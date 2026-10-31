/*
  ตรวจขั้นตอนเข้าเกมแนวนอน (เขาวงกตแสง): แตะการ์ด → เต็มจอ → บังคับหมุนจอ → สอนเล่น → ข้ามได้ → นับถอยหลัง → เล่น

  วิธีใช้
    npx next start -p 3210
    node scripts/check-game-landscape-browser.mjs http://localhost:3210

  ตั้ง PLAYWRIGHT_MODULE และ PLAYWRIGHT_EXECUTABLE ถ้าเครื่องเก็บไว้คนละที่
  ภาพหน้าจอเก็บที่ output/game-landscape/
*/
import { mkdir } from "node:fs/promises";
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

const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failures.push(label);
};
await mkdir("output/game-landscape", { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath });

const noOverflow = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight);
const box = (page, selector) => page.locator(selector).first().boundingBox();

// มือถือ: แตะการ์ดตอนจอตั้ง
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await context.addInitScript(() => sessionStorage.setItem("lu-games-guide-seen", "1"));
  const page = await context.newPage();
  const errors = [];
  const clips = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (/\/audio\/th\/(howto-light|rotate)/.test(request.url())) clips.push(request.url().split("/").pop()); });
  await page.goto(`${base}/games`, { waitUntil: "networkidle" });
  await page.locator('a[href$="/games/light-maze"]').first().tap();
  await page.waitForSelector(".gc-rotate", { timeout: 20000 });
  check(await page.evaluate(() => !!document.fullscreenElement), "แตะการ์ดแล้วเต็มจอ และยังเต็มจออยู่ในหน้าเกม");
  await page.waitForTimeout(1300);
  check(clips.includes("rotate-phone.mp3"), "หน้าหมุนจอมีเสียงบอก");
  check(!clips.some(clip => clip.startsWith("howto")), "จอตั้งอยู่ ยังไม่เริ่มสอน");
  const back = await box(page, ".gc-rotate .ui-pill");
  check(back && back.height >= 64, `ปุ่มกลับในหน้าหมุนจอ ≥ 64px (${back?.height})`);
  await page.screenshot({ path: "output/game-landscape/rotate-390.png" });

  // Chromium ปรับขนาดหน้าต่างขณะเต็มจอไม่ได้ จึงออกจากเต็มจอก่อนจำลองการหมุน
  await page.evaluate(() => document.exitFullscreen());
  for (const [width, height] of [[844, 390], [667, 375], [568, 320]]) {
    await page.setViewportSize({ width, height });
    await page.locator(".gc-rotate").waitFor({ state: "detached", timeout: 3000 });
    check(true, `${width}×${height} หมุนแล้วหน้าบังหายไป`);
    check(await noOverflow(page), `${width}×${height} หน้าสอนไม่เลื่อน`);
    const skip = await box(page, ".lmt-skip");
    check(skip.height >= 64 && skip.y + skip.height <= height, `${width}×${height} ปุ่มข้ามอยู่ในจอ ≥ 64px (${Math.round(skip.height)})`);
    await page.screenshot({ path: `output/game-landscape/tutorial-${width}.png` });
  }
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForFunction(() => document.querySelector(".lmt-scene")?.dataset.step === "1", null, { timeout: 15000 });
  check(true, "สอนเดินไปจังหวะ 2 เอง");
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "output/game-landscape/tutorial-step2-844.png" });
  await page.waitForFunction(() => document.querySelector(".lmt-scene")?.dataset.step === "2", null, { timeout: 15000 });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: "output/game-landscape/tutorial-step3-844.png" });
  await page.locator(".lmt-skip").tap();
  await page.waitForSelector(".gc-count-badge", { timeout: 5000 });
  check(true, "ข้ามการสอนแล้วนับถอยหลัง");
  await page.locator(".gc-countdown").waitFor({ state: "detached", timeout: 8000 });

  // เล่นอยู่แล้วหมุนกลับเป็นแนวตั้ง = หยุด แล้วนับใหม่ (ปุ่มข้ามเต็มจอซ้ำเพราะเป็นการกดของเด็ก)
  if (await page.evaluate(() => !!document.fullscreenElement)) await page.evaluate(() => document.exitFullscreen());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForSelector(".gc-rotate");
  const full = await box(page, ".gc-rotate .gc-button");
  check(full && full.height >= 64, `ปุ่มเปิดเต็มจอ ≥ 64px (${full?.height})`);
  check((await page.locator(".gc-play-container[inert]").count()) === 1, "จอตั้งระหว่างเล่น กดเกมไม่ได้");
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForSelector(".gc-count-badge", { timeout: 3000 });
  check((await page.locator(".gc-board[inert]").count()) === 1, "หมุนกลับแล้วนับถอยหลังใหม่");
  await page.locator(".gc-countdown").waitFor({ state: "detached", timeout: 8000 });
  await page.getByRole("button", { name: /ขวาล่าง/ }).tap();
  const before = await page.evaluate(() => Number(document.querySelector(".lm-stage").dataset.beadsLeft));
  await page.waitForTimeout(1000);
  check((await page.evaluate(() => Number(document.querySelector(".lm-stage").dataset.beadsLeft))) <= before, "กลับมาเล่นต่อได้");

  await page.evaluate(() => document.documentElement.requestFullscreen());
  await page.locator(".gc-game-header .ui-pill").first().tap();
  await page.waitForURL("**/games");
  await page.waitForFunction(() => !document.fullscreenElement, null, { timeout: 3000 });
  check(true, "ออกจากเกมแล้วคืนจอปกติ");
  check(errors.length === 0, `ไม่มี JS error ${errors.join(" | ")}`);
  await context.close();
}

// คอมพิวเตอร์: ไม่บังคับหมุน ไม่เต็มจอ แต่ยังมีสอนเล่น
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.addInitScript(() => sessionStorage.setItem("lu-games-guide-seen", "1"));
  await page.goto(`${base}/games`, { waitUntil: "networkidle" });
  await page.locator('a[href$="/games/light-maze"]').first().click();
  await page.waitForSelector(".lmt", { timeout: 20000 });
  check((await page.locator(".gc-rotate").count()) === 0, "PC ไม่มีหน้าหมุนจอ");
  check(!(await page.evaluate(() => !!document.fullscreenElement)), "PC ไม่เต็มจอ");
  check(await noOverflow(page), "PC หน้าสอนไม่เลื่อน");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "output/game-landscape/tutorial-1280.png" });
  await page.close();
}

// เกมอื่นยังเหมือนเดิม จอตั้งเล่นได้ และ /en ไม่มีตัวอักษรไทย
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto(`${base}/games/memory`, { waitUntil: "networkidle" });
  check((await page.locator(".gc-rotate, .lmt").count()) === 0, "เกมความจำยังเหมือนเดิม");
  await page.goto(`${base}/en/games/light-maze`, { waitUntil: "networkidle" });
  await page.waitForSelector(".gc-rotate");
  check(!/[฀-๿]/.test(await page.locator(".gc-rotate").innerText()), "/en หน้าหมุนจอไม่มีตัวอักษรไทย");
  await context.close();
}

await browser.close();
console.log(failures.length ? `\nไม่ผ่าน ${failures.length} ข้อ` : "\nผ่านทุกข้อ");
process.exit(failures.length ? 1 : 0);
