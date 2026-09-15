// Run against `npm run start -- --port 3001` using a locally installed Playwright.
// PLAYWRIGHT_MODULE can point to an existing installation without adding dependencies.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
await mkdir('output/sequence', { recursive: true });
try {
  for (const width of [320, 390, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: width === 320 ? 'reduce' : 'no-preference', hasTouch: width < 800 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://localhost:3001/games/sequence');
    await page.locator('.seq-thumbnail').screenshot({ path: `output/sequence/${width}-intro.png` });
    for (const level of [1, 2, 3]) {
      if (level > 1) await page.getByRole('button', { name: /ด่านต่อไป/ }).click();
      await page.getByRole('button', { name: /ไปเล่นกันเลย/ }).click();
      await page.locator('.seq-home').first().waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow ${width}/${level}`);
      const homes = await page.locator('.seq-home').all();
      for (const home of homes) {
        const rect = await home.boundingBox();
        assert.ok(rect.width >= 64 && rect.height >= 64, `64px target ${width}/${level}: ${JSON.stringify(rect)}`);
      }
      await page.locator('.seq-scene').screenshot({ path: `output/sequence/${width}-level-${level}.png` });
      const first = page.locator('[data-item-id]').first();
      const id = await first.getAttribute('data-item-id');
      const rank = Number(id.split('-').at(-1));
      await first.click();
      await page.locator(`[data-drop-id="sequence-slot-${(rank + 1) % homes.length}"]`).click();
      assert.equal(await page.locator('.seq-home[data-filled]').count(), 0);
      await page.getByRole('button', { name: /คำใบ้/ }).click();
      assert.equal(await page.locator(`[data-drop-id="sequence-slot-${rank}"]`).getAttribute('data-hint'), 'true');
      await page.locator(`[data-drop-id="sequence-slot-${rank}"]`).click();
      while (await page.locator('[data-item-id]').count()) {
        const piece = page.locator('[data-item-id]').first();
        const pieceId = await piece.getAttribute('data-item-id');
        const pieceRank = Number(pieceId.split('-').at(-1));
        const target = page.locator(`[data-drop-id="sequence-slot-${pieceRank}"]`);
        if (width === 1280) {
          await piece.scrollIntoViewIfNeeded();
          const from = await piece.boundingBox();
          const to = await target.boundingBox();
          await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
          await page.mouse.down();
          await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 15 });
          await page.mouse.up();
          await page.waitForFunction(id => !document.querySelector(`[data-item-id="${id}"]`), pieceId);
        } else {
          await piece.focus();
          await page.keyboard.press('Enter');
          await target.focus();
          await page.keyboard.press('Enter');
        }
        if (await page.locator('[data-item-id]').count() === 1) await page.locator('.seq-scene').screenshot({ path: `output/sequence/${width}-level-${level}-placed.png` });
      }
      await page.getByRole('heading', { name: 'เก่งมาก ผ่านด่านแล้ว!' }).waitFor();
      console.log(`PASS ${width}px level ${level}: retry, hint, ${width === 1280 ? 'pointer drag' : 'keyboard'}, completion, 64px homes`);
    }
    await page.getByRole('button', { name: /เล่นอีกครั้ง/ }).click();
    await page.locator('.seq-home').first().waitFor();
    assert.equal(await page.locator('.seq-home[data-filled]').count(), 0);
    await page.getByRole('button', { name: /เริ่มใหม่/ }).click();
    assert.equal(await page.locator('.seq-home[data-filled]').count(), 0);
    assert.equal(await page.locator('.gc-image-fallback').count(), 0, 'all images loaded');
    await page.getByRole('link', { name: /รวมเกม/ }).click();
    await page.locator('a[href="/games/sequence"] .gc-diorama').screenshot({ path: `output/sequence/${width}-hub.png` });
    assert.equal(await page.locator('.gc-image-fallback').count(), 0, 'hub images loaded');
    await context.close();
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
