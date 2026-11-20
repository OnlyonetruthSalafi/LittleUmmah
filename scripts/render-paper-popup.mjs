// Rebuild the paper edition's GPU-free spreads from its live Three.js geometry.
// PLAYWRIGHT_MODULE may point to an existing Playwright installation.
import { createRequire } from "node:module";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE } : {}),
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const story = process.argv[2] ?? "nuh";
if (!["nuh", "gold-jar"].includes(story)) throw new Error("Unknown paper edition: " + story);
const goldJar = story === "gold-jar";
const output = `public/stories/${story}-paper`;
const names = goldJar ? ["cover", "p01", "p02", "p03", "p04", "p05", "p06"] : ["cover", "p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p08b", "p09", "p10", "p11"];
try {
  await mkdir(join(output, "turns"), { recursive: true });
  const page = await browser.newPage();
  await page.route("http://paper.local/**", async route => {
    const path = new URL(route.request().url()).pathname.slice(1);
    if (!path) {
      return route.fulfill({ contentType: "text/html", body: '<style>*{margin:0}canvas{display:block}</style><canvas></canvas><script type="importmap">{"imports":{"three":"/three.module.js"}}</script>' });
    }
    if (["three.module.js", "three.core.js"].includes(path)) {
      return route.fulfill({ path: join("node_modules/three/build", path), contentType: "text/javascript" });
    }
    if (!["theatre", "cutouts", "gold-jar", "folds", "stock", "spreads", "sculptures", "boarding", "flood", "reflections", "cover-art", "tabletop", "ark-workshop"].includes(path)) return route.abort();
    const source = await readFile(join("src/features/stories/paper", path + ".ts"), "utf8");
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
    return route.fulfill({ contentType: "text/javascript", body: outputText });
  });
  await page.goto("http://paper.local/");
  const jacket = await page.evaluate(async goldJar => {
    const { makeCoverArt } = await import("/cover-art");
    return makeCoverArt(goldJar).map.image.toDataURL("image/png").split(",")[1];
  }, goldJar);
  await writeFile(join(output, "jacket.png"), Buffer.from(jacket, "base64"));
  await page.evaluate(async story => {
    const canvas = document.querySelector("canvas");
    canvas.style.width = "1080px";
    canvas.style.height = "648px";
    const { createTheatre } = await import("/theatre");
    const book = createTheatre(canvas, story);
    window.capture = (from, to, amount) => {
      book.pose(from, to, amount, false);
      return canvas.toDataURL("image/png").split(",")[1];
    };
  }, story);
  async function capture(from, to, amount) {
    const png = await page.evaluate(([a, b, c]) => window.capture(a, b, c), [from, to, amount]);
    return Buffer.from(png, "base64");
  }
  for (const name of names) {
    await writeFile(join(output, name + ".png"), await capture(name, undefined, 0));
  }
  await page.evaluate(async () => {
    const canvas = document.querySelector("canvas");
    canvas.style.width = "600px";
    canvas.style.height = "360px";
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const transitions = names.slice(0, -1).map((name, i) => [name, name, names[i + 1]]);
  transitions.push(goldJar ? ["discovery", "cover", "p02"] : ["workshop", "cover", "p04"]);
  for (const [atlas, from, to] of transitions) {
    const frames = [];
    for (let frame = 0; frame < 12; frame++) {
      const input = await capture(from, to, frame / 11);
      frames.push({ input, left: frame % 4 * 600, top: Math.floor(frame / 4) * 360 });
    }
    await sharp({ create: { width: 2400, height: 1080, channels: 3, background: "#496769" } })
      .composite(frames).png().toFile(join(output, "turns", atlas + ".png"));
    console.log("Rendered", from, "→", to);
  }
} finally {
  await browser.close();
}
