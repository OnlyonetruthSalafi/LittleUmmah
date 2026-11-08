// Resize/pad existing artwork only. No text, drawing, or generated artwork.
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";

await mkdir("public/og", { recursive: true });
await mkdir("output/p1-2/crops", { recursive: true });
const manifest = JSON.parse(await readFile("scripts/source-images.json", "utf8"));
const evidence = [];
for (const name of ["welcome", "play"]) {
  const source = `public/Character/${name}.webp`;
  const bytes = await readFile(source);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const output = `public/og/${name}.jpg`;
  await sharp(bytes).resize(570, 570, { fit: "contain", background: "#eaf6ff" })
    .flatten({ background: "#eaf6ff" })
    .extend({ left: 315, right: 315, top: 30, bottom: 30, background: "#eaf6ff" })
    .jpeg({ quality: 88, mozjpeg: true }).toFile(output);
  const result = await readFile(output);
  const metadata = await sharp(result).metadata();
  if (metadata.width !== 1200 || metadata.height !== 630 || result.length > 200000) throw new Error(`Invalid share image: ${output}`);
  manifest[output] = { source, sha256 };
  // Full head including antenna and ears; enlarged for review, on a light background.
  await sharp(bytes).extract({ left: 85, top: 0, width: 245, height: 215 })
    .resize(735, 645).flatten({ background: "#eaf6ff" }).png().toFile(`output/p1-2/crops/${name}-head.png`);
  const stats = await sharp(bytes).stats();
  evidence.push({ source, sha256, output, bytes: result.length, width: metadata.width, height: metadata.height, sourceAlpha: stats.channels[3] ? { min: stats.channels[3].min, max: stats.channels[3].max } : null, outputHasAlpha: metadata.hasAlpha });
}
await writeFile("scripts/source-images.json", JSON.stringify(manifest, null, 2) + "\n");
await writeFile("output/p1-2/image-evidence.json", JSON.stringify(evidence, null, 2) + "\n");
console.log(evidence);
