/*
  ตรวจหน้าเกาะเกม (/games) ในเบราว์เซอร์จริง

  วิธีใช้ (หลัง npm run build)
    npx next start -p 3210
    node scripts/check-games-hub-browser.mjs http://localhost:3210

  ตั้ง PLAYWRIGHT_MODULE และ PLAYWRIGHT_EXECUTABLE ถ้าเครื่องเก็บไว้คนละที่
  ภาพหน้าจอเก็บที่ output/games-hub-design/real-*.png
*/
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core",
);
const executablePath =
  process.env.PLAYWRIGHT_EXECUTABLE ||
  "C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe";
const base = process.argv[2] ?? "http://localhost:3210";

const VIEWPORTS = [
  { width: 320, height: 740, touch: true, columns: 2 },
  { width: 390, height: 844, touch: true, columns: 2 },
  { width: 844, height: 390, touch: true, columns: 4, cueBelowFold: true },
  { width: 768, height: 1024, touch: true, columns: 2 },
  { width: 1280, height: 800, touch: false, columns: 4 },
  { width: 1536, height: 770, touch: false, columns: 4 },
];

const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failures.push(label);
};

const browser = await chromium.launch({ headless: true, executablePath });

for (const view of VIEWPORTS) {
  const tag = `${view.width}x${view.height}`;
  const context = await browser.newContext({
    viewport: { width: view.width, height: view.height },
    hasTouch: view.touch,
    isMobile: view.touch,
  });
  // ไม่ให้ทัวร์เล่นเอง จะได้วัดตำแหน่งพักของหุ่นยนต์
  await context.addInitScript(() => sessionStorage.setItem("lu-games-guide-seen", "1"));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/games`, { waitUntil: "networkidle" });

  const m = await page.evaluate(() => {
    const rect = (el) => el.getBoundingClientRect();
    const cards = [...document.querySelectorAll("[data-game-link]")];
    const grid = document.querySelector(".gh-grid");
    return {
      scroll: document.documentElement.scrollWidth,
      inner: window.innerWidth,
      header: !!document.querySelector("header nav, header a"),
      mainCount: document.querySelectorAll("main").length,
      hrefs: cards.map((card) => card.getAttribute("href")),
      minCard: Math.min(...cards.map((card) => Math.min(rect(card).width, rect(card).height))),
      columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
      jumps: [...document.querySelectorAll(".gh-category-button")].map((el) => ({
        bottom: rect(el).bottom,
        height: rect(el).height,
      })),
      guide: Math.min(rect(document.querySelector(".gh-guide")).width, rect(document.querySelector(".gh-guide")).height),
      sections: [...document.querySelectorAll(".gh-section")].map((s) => s.id),
      other: !!document.querySelector(".oi-wrap"),
    };
  });

  check(m.scroll <= m.inner, `${tag} ไม่เลื่อนแนวนอน (${m.scroll}/${m.inner})`);
  check(m.columns === view.columns, `${tag} การ์ด ${view.columns} คอลัมน์ (${m.columns})`);
  check(m.hrefs.length === 9 && new Set(m.hrefs).size === 9, `${tag} เกมครบ 9 ไม่ซ้ำ`);
  check(m.minCard >= 64, `${tag} การ์ด ≥ 64px (${Math.round(m.minCard)})`);
  check(m.jumps.every((jump) => jump.height >= 64), `${tag} ปุ่มหมวด ≥ 64px`);
  check(m.guide >= 64, `${tag} หุ่นยนต์ ≥ 64px (${Math.round(m.guide)})`);
  check(m.mainCount === 1, `${tag} มี main เดียว`);
  check(m.sections.join() === "matching,thinking", `${tag} สองหมวดตามลำดับ`);
  check(m.other, `${tag} มีไปเกาะอื่นกัน`);
  const lowest = Math.max(...m.jumps.map((jump) => jump.bottom));
  if (view.cueBelowFold) console.log(`     ${tag} ปุ่มหมวดล่างสุด ${Math.round(lowest)}px (รายงานเท่านั้น)`);
  else check(lowest <= view.height, `${tag} ปุ่มหมวดในจอแรก (${Math.round(lowest)}/${view.height})`);
  check(errors.length === 0, `${tag} ไม่มี JS error ${errors.join(" | ")}`);

  await page.screenshot({ path: `output/games-hub-design/real-${tag}.png`, fullPage: true });
  await context.close();
}

// hover: ข้อความนิ่ง กรอบภาพขยับ
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.addInitScript(() => sessionStorage.setItem("lu-games-guide-seen", "1"));
  await page.goto(`${base}/games`, { waitUntil: "networkidle" });
  const card = page.locator("[data-game-link]").first();
  await card.scrollIntoViewIfNeeded();
  const before = await card.locator(".gh-card-title").boundingBox();
  await card.hover();
  await page.waitForTimeout(350);
  const after = await card.locator(".gh-card-title").boundingBox();
  const transform = await card.locator(".gh-card-art").evaluate((el) => getComputedStyle(el).transform);
  check(before.y === after.y, "hover ข้อความไม่ขยับ");
  check(transform !== "none", "hover กรอบภาพขยับ");
  await page.close();

  const still = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const quiet = await still.newPage();
  await quiet.addInitScript(() => sessionStorage.setItem("lu-games-guide-seen", "1"));
  await quiet.goto(`${base}/games`, { waitUntil: "networkidle" });
  const quietCard = quiet.locator("[data-game-link]").first();
  await quietCard.scrollIntoViewIfNeeded();
  await quietCard.hover();
  check(
    (await quietCard.locator(".gh-card-art").evaluate((el) => getComputedStyle(el).transform)) === "none",
    "reduced motion ไม่มี transform",
  );
  await still.close();
}

// ทัวร์นูรี: จังหวะแรก ชี้ปุ่มหมวด และบอลลูน
for (const [touch, viewport] of [[false, { width: 1280, height: 800 }], [true, { width: 390, height: 844 }], [true, { width: 320, height: 740 }], [true, { width: 844, height: 390 }]]) {
  const context = await browser.newContext({
    viewport,
    hasTouch: touch,
    isMobile: touch,
  });
  const page = await context.newPage();
  const clips = [];
  page.on("request", (request) => {
    if (request.url().includes("/audio/th/hub-")) clips.push(request.url().split("/").pop());
  });
  await page.goto(`${base}/games`, { waitUntil: "networkidle" });
  await page.waitForSelector(".gh-bubble[data-show]", { timeout: 6000 });
  await page.waitForTimeout(500);
  const label = `${touch ? "touch" : "desktop"}-${viewport.width}`;
  await page.screenshot({ path: `output/games-hub-design/real-tour-${label}.png` });
  check(
    (await page.locator(".gh-guide").getAttribute("data-pose")) === "wave",
    `ทัวร์ ${label}: จังหวะแรกโบกมือ`,
  );
  check((await page.locator(".gh-guide[data-phone]").count()) === (touch ? 1 : 0), `ทัวร์ ${label}: ท่าหมุนมือถือเฉพาะจอสัมผัส`);
  check(clips[0] === (touch ? "hub-intro-touch.mp3" : "hub-intro.mp3"), `ทัวร์ ${label}: คลิปแรก ${clips[0]}`);

  // แตะเกมระหว่างทัวร์ = ทัวร์จบ แล้วเข้าเกม
  const first = page.locator("[data-game-link]").first();
  await first.scrollIntoViewIfNeeded();
  await first.dispatchEvent("pointerdown");
  check((await page.locator(".gh-bubble[data-show]").count()) === 0, `ทัวร์ ${label}: แตะเกมแล้วทัวร์หยุด`);
  await context.close();
}

// เส้นทางอื่นต้องเหมือนเดิม
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${base}/games/memory`, { waitUntil: "domcontentloaded" });
  check((await page.locator(".gc-focus").count()) === 1, "/games/memory ยังเป็น focus mode");
  check((await page.locator(".gh-page").count()) === 0, "/games/memory ไม่มีหน้า hub");
  await page.goto(`${base}/learn/games`, { waitUntil: "domcontentloaded" });
  check(new URL(page.url()).pathname === "/games", `/learn/games ไป /games (${new URL(page.url()).pathname})`);
  await page.goto(`${base}/en/games`, { waitUntil: "networkidle" });
  const hrefs = await page.locator("[data-game-link]").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  check(hrefs.length === 9 && hrefs.every((href) => href.startsWith("/en/games/")), "/en ลิงก์เกมถูก");
  const text = await page.locator(".gh-page").innerText();
  check(!/[฀-๿]/.test(text), "/en ไม่มีตัวอักษรไทย");
  await page.close();
}

await browser.close();
console.log(failures.length ? `\nไม่ผ่าน ${failures.length} ข้อ` : "\nผ่านทุกข้อ");
process.exit(failures.length ? 1 : 0);
