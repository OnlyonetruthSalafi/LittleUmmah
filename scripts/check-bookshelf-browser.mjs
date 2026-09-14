// ตรวจตู้หนังสือเกาะเรื่องเล่าในเบราว์เซอร์จริง: ขนาดช่อง, ไม่ล้นจอ, หนังสือลอยแล้วเข้าหน้านิทานและเล่นเอง
// รัน: node scripts/check-bookshelf-browser.mjs [baseUrl]  (ค่าเริ่มต้น http://localhost:3000)
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.argv[2] ?? 'http://localhost:3000';
const out = 'output/bookshelf';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
const countPlays = () => {
  window.__plays = [];
  const play = Audio.prototype.play;
  Audio.prototype.play = function () {
    window.__plays.push(new URL(this.src).pathname);
    return play.call(this);
  };
};
try {
  for (const [width, height] of [[360, 780], [768, 1024], [1280, 800]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 800 });
    await context.addInitScript(countPlays);
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`${width}: ${e.message}`));
    await page.goto(`${base}/learn/stories`);
    const cells = page.locator('.bs-shelf:visible .bs-cell');
    await cells.first().waitFor();
    await page.waitForTimeout(600);
    assert.equal(await cells.count(), 8, `8 books ${width}`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow ${width}`);
    for (const cell of await cells.all()) {
      const r = await cell.boundingBox();
      assert.ok(r.width >= 64 && r.height >= 64, `64px cell ${width}: ${JSON.stringify(r)}`);
    }
    await page.locator('.bs-stage').screenshot({ path: `${out}/${width}-shelf.png` });

    // หนังสือ "เร็วๆ นี้" แตะแล้วไม่ไปไหน ป้ายใต้ตู้บอกชื่อเรื่อง
    // aria-disabled ทำให้ Playwright ไม่ยอมคลิกเอง แต่ในหน้าจริงแตะได้และต้องมีผลตอบรับ
    await cells.nth(1).click({ force: true });
    assert.match(page.url(), /\/learn\/stories$/);
    assert.match(await page.locator('.bs-stage [aria-live="polite"]').innerText(), /เร็วๆ นี้/);

    // หนังสือนูห์: ลอยออกมากลางจอ แล้วเข้าหน้านิทานและเริ่มเล่นเอง
    await cells.first().scrollIntoViewIfNeeded();
    await cells.first().click();
    await page.waitForTimeout(450);
    assert.equal(await page.locator('.bs-fly').count(), 1, 'book flying');
    await page.screenshot({ path: `${out}/${width}-flying.png` });
    await page.waitForURL(/\/learn\/stories\/nuh$/, { timeout: 5000 });
    await page.getByRole('button', { name: /พัก/ }).waitFor({ timeout: 5000 });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${width}-arrived.png` });
    const plays = await page.evaluate(() => window.__plays.filter((p) => p.includes('/audio/stories/')));
    assert.ok(plays[0]?.endsWith('/p00.mp3'), `title narration starts: ${plays}`);
    await context.close();
  }

  // ปิดการเคลื่อนไหว: ไม่ลอย ไปหน้านิทานทันที
  const rm = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const p = await rm.newPage();
  await p.goto(`${base}/learn/stories`);
  await p.locator('.bs-shelf:visible .bs-cell').first().click();
  await p.waitForURL(/\/learn\/stories\/nuh$/, { timeout: 5000 });
  assert.equal(await p.locator('.bs-fly').count(), 0);
  await rm.close();

  // เปิดหน้านิทานตรงๆ (ไม่ได้มาจากตู้) ต้องไม่เล่นเอง
  const direct = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const d = await direct.newPage();
  await d.goto(`${base}/learn/stories/nuh`);
  await d.getByRole('button', { name: /เล่นนิทาน/ }).waitFor();
  await direct.close();
} finally {
  await browser.close();
}
assert.deepEqual(errors, []);
console.log('bookshelf browser check passed; screenshots in', out);
