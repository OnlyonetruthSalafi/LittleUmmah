// Run against `npm run start -- --port 3120` using a locally installed Playwright.
// PLAYWRIGHT_MODULE can point to an existing installation without adding dependencies.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
const base = process.env.BASE_URL ?? 'http://localhost:3120';
const output = process.env.BROWSER_CHECK_OUT ?? 'output/C-10/shots';
await mkdir(output, { recursive: true });
async function checkViewport(variant, width, height) {
    const shot = `${output}/${width}x${height}-variant-${variant}`;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: width === 360 ? 'reduce' : 'no-preference', hasTouch: width < 900 });
    // Exercise the real post-mount selector, with no test-only route or production override.
    await context.addInitScript(value => { Math.random = () => value; }, variant ? .9 : .1);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(`${base}/games/sequence`);
    if (width < height) {
      await page.locator('.gc-rotate').waitFor();
      assert.equal(await page.locator('.gc-play-container').getAttribute('inert'), '', 'portrait gate blocks play');
      await page.screenshot({ path: `${shot}-rotate.png` });
      const portrait = page.viewportSize();
      await page.setViewportSize({ width: portrait.height, height: portrait.width });
      await page.locator('.gc-rotate').waitFor({ state: 'detached' });
      assert.equal(await page.locator('.gc-play-container').getAttribute('inert'), null, 'rotation unlocks play');
    }
    await page.locator('.gc-voice-scene').screenshot({ path: `${shot}-intro.png` });
    for (const level of [1, 2, 3]) {
      if (level > 1) await page.getByRole('button', { name: /ด่านต่อไป/ }).click();
      await page.getByRole('button', { name: /^เริ่มเล่น/ }).click();
      await page.locator('.gc-countdown').waitFor({ state: 'detached', timeout: 8000 }); // นับถอยหลัง 3 2 1 ก่อนเล่น
      await page.locator('.seq-home').first().waitFor();
      const kind = ['size', 'count', 'height'][level - 1];
      const art = variant ? ['ball', 'cylinder', 'wood'][level - 1] : 'block';
      assert.equal(await page.locator('.seq-scene').getAttribute('data-set'), `${kind}-${art}`);
      assert.equal(await page.locator('.seq-home[data-filled]').count(), 0, 'no placements leak into next round');
      assert.equal(await page.locator('[data-item-id]').count(), level === 1 ? 3 : 4);
      await page.locator('.seq-scene img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow ${width}/${level}`);
      const homes = await page.locator('.seq-home').all();
      // Only gold pads have the approved size exception. Toy buttons must be >=64px.
      const sizes = [];
      for (const target of homes) {
        const rect = await target.boundingBox();
        sizes.push(`${Math.round(rect.width)}x${Math.round(rect.height)}`);
        assert.ok(rect.width >= 44 && rect.height >= 44, `gold pad exception ${width}/${level}: ${JSON.stringify(rect)}`);
      }
      const toys = await page.locator('.seq-tray [data-item-id]').all();
      const toyRects = [];
      for (const toy of toys) {
        await toy.scrollIntoViewIfNeeded();
        const rect = await toy.boundingBox();
        toyRects.push(rect);
        sizes.push(`${Math.round(rect.width)}x${Math.round(rect.height)}`);
        assert.ok(rect.width >= 64 && rect.height >= 64, `toy tap target ${width}/${level}: ${JSON.stringify(rect)}`);
        // Check the added edge is actually hittable, not covered by a neighbour.
        assert.equal(await toy.evaluate(element => {
          const r = element.getBoundingClientRect();
          return [r.left + .5, r.right - .5].every(x => element.contains(document.elementFromPoint(x, r.top + r.height / 2)));
        }), true, `toy edge hit area ${width}/${level}`);
      }
      for (let i = 1; i < toyRects.length; i++) {
        assert.ok(toyRects[i - 1].x + toyRects[i - 1].width <= toyRects[i].x, `toy hit areas must not overlap ${width}/${level}`);
      }
      console.log(`SIZE ${width}px level ${level}: homes+toys ${sizes.join(' ')}`);
      await page.screenshot({ path: `${shot}-level-${level}.png`, fullPage: true });
      for (const toy of await page.locator('.seq-tray [data-item-id]').all()) {
        const rank = Number((await toy.getAttribute('data-item-id')).split('-').at(-1));
        assert.equal(await toy.locator('img').count(), level === 1 ? 1 : rank + 1);
        assert.ok((await toy.locator('img').first().getAttribute('src')).endsWith(`/${art}.webp`));
      }
      const first = page.locator('[data-item-id]').first();
      const id = await first.getAttribute('data-item-id');
      const rank = Number(id.split('-').at(-1));
      await first.click();
      await page.locator(`[data-drop-id="sequence-slot-${(rank + 1) % homes.length}"]`).click();
      assert.equal(await page.locator('.seq-home[data-filled]').count(), 0);
      await page.getByRole('button', { name: /คำใบ้/ }).click();
      assert.equal(await page.locator(`[data-drop-id="sequence-slot-${rank}"]`).getAttribute('data-hint'), 'true');
      // A point near (not exactly at) the pad center must still resolve via dropTargetAt.
      const near = await page.locator(`[data-drop-id="sequence-slot-${rank}"]`).boundingBox();
      await page.mouse.click(near.x + near.width * .55, near.y + near.height * .55);
      assert.equal(await page.locator('.seq-home[data-filled]').count(), 1, 'near-pad hit accepted');
      while (await page.locator('[data-item-id]').count()) {
        const piece = page.locator('[data-item-id]').first();
        const pieceId = await piece.getAttribute('data-item-id');
        const pieceRank = Number(pieceId.split('-').at(-1));
        const target = page.locator(`[data-drop-id="sequence-slot-${pieceRank}"]`);
        if (width === 1536) {
          await piece.scrollIntoViewIfNeeded();
          const from = await piece.boundingBox();
          const to = await target.boundingBox();
          await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
          await page.mouse.down();
          await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 15 });
          const dragging = await piece.boundingBox();
          assert.ok(Math.abs(dragging.x + dragging.width / 2 - (to.x + to.width / 2)) < 1, 'drag stays under pointer after hit-area expansion');
          await page.mouse.up();
          await page.waitForFunction(id => !document.querySelector(`[data-item-id="${id}"]`), pieceId);
        } else {
          await piece.focus();
          await page.keyboard.press('Enter');
          await target.focus();
          await page.keyboard.press('Enter');
        }
        if (await page.locator('[data-item-id]').count() === 1) await page.screenshot({ path: `${shot}-level-${level}-placed.png`, fullPage: true });
      }
      await page.getByRole('heading', { name: 'เก่งมาก ผ่านด่านแล้ว!' }).waitFor();
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('little-ummah:games:v1:sequence')));
      assert.deepEqual(saved.completedLevels, Array.from({ length: level }, (_, i) => i + 1));
      assert.equal(saved.stars, level * 3);
      console.log(`PASS ${width}x${height} level ${level} ${art}: retry, hint, near-pad, ${width === 1536 ? 'pointer drag' : 'keyboard'}, completion, progress, tap targets`);
    }
    await page.getByRole('button', { name: /เล่นอีกครั้ง/ }).click();
    await page.locator('.gc-countdown').waitFor({ state: 'detached', timeout: 8000 }); // นับถอยหลัง 3 2 1 ก่อนเล่น
    await page.locator('.seq-home').first().waitFor();
    assert.equal(await page.locator('.seq-home[data-filled]').count(), 0);
    await page.evaluate(value => { Math.random = () => value; }, variant ? .1 : .9);
    await page.getByRole('button', { name: /เริ่มใหม่/ }).click();
    await page.locator('.gc-countdown').waitFor({ state: 'detached', timeout: 8000 });
    await page.locator('.seq-home').first().waitFor();
    assert.equal(await page.locator('.seq-home[data-filled]').count(), 0);
    assert.equal(await page.locator('.seq-scene').getAttribute('data-set'), `height-${variant ? 'block' : 'wood'}`);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('little-ummah:games:v1:sequence')));
    assert.equal(saved.stars, 9, 'restart/switching set earns no stars');
    assert.equal(await page.locator('.gc-image-fallback').count(), 0, 'all images loaded');
    await page.getByRole('link', { name: /รวมเกม/ }).click();
    await page.locator('a[href="/games/sequence"] .gc-diorama').screenshot({ path: `${shot}-hub.png` });
    assert.equal(await page.locator('.gc-image-fallback').count(), 0, 'hub images loaded');
    await context.close();
}
try {
  const cases = [0, 1].flatMap(variant => [[360, 844], [390, 844], [768, 1024], [1536, 770], [360, 780], [844, 390], [1280, 720]].map(([width, height]) => [variant, width, height]));
  // Isolated contexts have independent storage and random seeds; run four at a time.
  for (let i = 0; i < cases.length; i += 4) {
    const results = await Promise.allSettled(cases.slice(i, i + 4).map(args => checkViewport(...args)));
    for (const result of results) if (result.status === 'rejected') errors.push(result.reason.stack ?? String(result.reason));
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
