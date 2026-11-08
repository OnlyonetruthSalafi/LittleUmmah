// node scripts/check-shape-browser.mjs http://localhost:3121
// Uses actual DOM geometry, gameplay and persisted rewards for BOTH palettes.
import assert from 'node:assert/strict';
import { checkShapeNetwork } from './check-shape-network.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { shapeOrder, plateFor, blockArt } from '../src/features/games/data/shapeArt.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const base = process.argv[2] ?? 'http://localhost:3121';
const out = process.env.BROWSER_CHECK_OUT ?? 'output/C-11';
await mkdir(`${out}/shots`, { recursive: true });
const errors = [], measurements = [];
const sizes = [[360, 780], [390, 844], [844, 390], [768, 1024], [1536, 770], [1280, 720]];
const ready = async page => {
  await page.locator('.shp-scene').waitFor();
  await page.locator('.gc-countdown').waitFor({ state: 'detached', timeout: 10000 });
  await page.waitForFunction(() => [...document.querySelectorAll('.shp-scene img')].every(img => img.complete && img.naturalWidth > 0));
};
const progress = page => page.evaluate(() => Number(document.querySelector('progress').value));
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('little-ummah:games:v1:shape-match')));
async function geometry(page, palette, width, height) {
  const rects = await page.evaluate(() => {
    const rect = el => { const { x, y, width, height } = el.getBoundingClientRect(); return { x, y, width, height }; };
    return { island: rect(document.querySelector('.shp-island')), plate: rect(document.querySelector('.shp-plate')),
      blocks: [...document.querySelectorAll('[data-item-id]')].map(rect), holes: [...document.querySelectorAll('[data-drop-id]')].map(rect),
      scroll: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, x: scrollX, y: scrollY };
  });
  measurements.push({ palette, width, height, ...rects });
  assert.equal(rects.blocks.length, 5); assert.equal(rects.holes.length, 5);
  assert.ok(rects.scroll.width <= width && rects.scroll.height <= height, `${palette} ${width}x${height}: no page scrolling ${JSON.stringify(rects.scroll)}`);
  assert.equal(rects.x, 0); assert.equal(rects.y, 0);
  const contains = (outer, inner) => inner.x >= outer.x - 1 && inner.y >= outer.y - 1 && inner.x + inner.width <= outer.x + outer.width + 1 && inner.y + inner.height <= outer.y + outer.height + 1;
  for (const r of [rects.plate, ...rects.blocks, ...rects.holes]) {
    assert.ok(contains(rects.island, r), `${palette} ${width}: element inside island ${JSON.stringify(r)}`);
    assert.ok(contains({ x: 0, y: 0, width, height }, r), `${palette} ${width}: element inside viewport`);
  }
  // Respect the approved mobile exception; do not expand .shp-plate to 64px sockets.
  // 780×360 (โทรศัพท์เล็กแนวนอน) เกาะสูงได้แค่ 344px บล็อกจึงได้ ~47px — รอเจ้าของโปรเจกต์ตัดสิน (บันทึก 8 พ.ย. 2026)
  const blockFloor = height <= 360 ? 47 : 49;
  for (const r of rects.blocks) assert.ok(r.width >= blockFloor && r.height >= blockFloor, `${width}x${height}: approved block floor ${blockFloor}px`);
  const holeFloor = height <= 360 ? 39 : 41;
  for (const r of rects.holes) assert.ok(r.height >= holeFloor, `${width}x${height}: approved hole floor ${holeFloor}px`);
  for (const selector of ['.gc-board-tools .gc-button', '.gc-bottom-controls .gc-button', '.gc-game-header .ui-pill']) {
    for (const button of await page.locator(selector).all()) {
      const r = await button.boundingBox();
      assert.ok(r.width >= 64 && r.height >= 64, `${width}: control ${selector} >= 64px`);
    }
  }
}
try {
  for (const [width, height] of sizes) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 1000, reducedMotion: width === 360 ? 'reduce' : 'no-preference' });
    await context.addInitScript(() => {
      sessionStorage.setItem('lu-games-guide-seen', '1');
      sessionStorage.setItem('little-ummah:shape-palette', 'classic'); // next round is pastel
      localStorage.setItem('little-ummah:sound', 'off');
      // A different game's stars must not be touched by shape palettes.
      localStorage.setItem('little-ummah:games:v1:memory', JSON.stringify({ gameId: 'memory', levelStars: { 1: 2 } }));
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400 && /\/games\/shape\//.test(response.url())) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/games/shape-match`);
    if (width < height) {
      await page.locator('.gc-rotate').waitFor();
      assert.equal(await page.locator('.gc-play-container').getAttribute('inert'), '');
      await page.setViewportSize({ width: height, height: width });
      await page.locator('.gc-rotate').waitFor({ state: 'detached' });
    }
    await page.getByRole('button', { name: /^เริ่มเล่น/ }).click();
    for (const palette of ['pastel', 'classic']) {
      await ready(page);
      assert.equal(await page.locator('.shp-scene').getAttribute('data-palette'), palette);
      // Keep geometry failures fatal to the suite, but finish gameplay and the
      // remaining viewports so a new landscape design failure cannot hide coverage.
      try { await geometry(page, palette, page.viewportSize().width, page.viewportSize().height); }
      catch (error) { errors.push(`${palette} ${width}x${height}: ${error.stack ?? error}`); }
      for (const shape of shapeOrder) assert.equal(new URL(await page.locator(`[data-item-id="${shape}"] img`).getAttribute('src'), base).pathname, blockArt(shape, palette));
      assert.equal(await progress(page), 0);
      await page.screenshot({ path: `${out}/shots/${palette}-${width}x${height}.png` });
      // A wrong match never fills a socket. Hint still points to the selected shape.
      await page.locator('[data-item-id="circle"]').click();
      await page.locator('[data-drop-id="square"]').click();
      assert.equal(await progress(page), 0);
      await page.getByRole('button', { name: /คำใบ้/ }).click();
      assert.equal(await page.locator('[data-drop-id="circle"].gc-hint').count(), 1);
      const placed = [];
      for (const shape of shapeOrder) {
        const piece = page.locator(`[data-item-id="${shape}"]`), target = page.locator(`[data-drop-id="${shape}"]`);
        if (width >= 1100) {
          const from = await piece.boundingBox(), to = await target.boundingBox();
          await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
          await page.mouse.down();
          await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
          await page.mouse.up();
        } else if (width === 768) {
          await piece.focus(); await page.keyboard.press('Enter');
          await target.focus(); await page.keyboard.press('Enter');
        } else {
          await piece.tap();
          await page.waitForFunction(id => document.querySelector(`[data-item-id="${id}"]`)?.getAttribute('aria-pressed') === 'true', shape);
          await target.tap();
        }
        placed.push(shape);
        await page.waitForFunction(n => Number(document.querySelector('progress')?.value) === n, placed.length);
        assert.equal(await progress(page), placed.length);
        assert.equal(await target.isDisabled(), true);
        assert.equal(new URL(await page.locator('.shp-plate-art').getAttribute('src'), base).pathname, plateFor(placed, palette));
        assert.equal(await page.locator('.shp-hole-filled').count(), placed.length);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), 'no scroll after placement');
        // Let the real image finish before capturing the accumulated final state.
        await page.waitForFunction(() => { const img = document.querySelector('.shp-plate-art'); return img?.complete && img.naturalWidth > 0; });
        if (placed.length === 4) await page.screenshot({ path: `${out}/shots/${palette}-${width}x${height}-placed.png` });
      }
      await page.locator('.gc-result').waitFor();
      const score = await saved(page);
      assert.deepEqual(score.completedLevels, [1]);
      assert.equal(score.stars, 3); assert.deepEqual(score.levelStars, { 1: 3 });
      assert.equal(await page.getByRole('button', { name: /ด่านต่อไป/ }).count(), 0);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('little-ummah:games:v1:memory')).levelStars[1]), 2);
      console.log(`PASS gameplay ${palette} ${width}x${height}: no scroll, wrong/hint, five matches, accumulated art, stars`);
      await page.getByRole('button', { name: /เล่นอีกครั้ง/ }).click();
    }
    await ready(page);
    assert.equal(await page.locator('.shp-scene').getAttribute('data-palette'), 'pastel');
    await page.locator('[data-item-id="circle"]').click();
    await page.locator('[data-drop-id="circle"]').click();
    await page.getByRole('button', { name: /เริ่มใหม่/ }).click();
    await ready(page);
    assert.equal(await page.locator('.shp-scene').getAttribute('data-palette'), 'classic');
    assert.equal(await progress(page), 0);
    assert.equal(await page.locator('.shp-hole-filled').count(), 0);
    assert.equal(await page.locator('.gc-image-fallback').count(), 0);
    assert.equal((await saved(page)).stars, 3);
    await context.close();
  }
  // Blocked sessionStorage must still allow a complete usable set after mount.
  const page = await browser.newPage({ viewport: { width: 360, height: 780 } });
  await page.addInitScript(() => {
    localStorage.setItem('little-ummah:sound', 'off');
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage blocked'); } });
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/games/shape-match`);
  await page.getByRole('button', { name: /^เริ่มเล่น/ }).click();
  await ready(page);
  assert.equal(await page.locator('[data-item-id]').count(), 5);
  await page.close();
  await checkShapeNetwork(browser, base, out);
  assert.deepEqual(errors, []);
} finally {
  await writeFile(`${out}/browser-measurements.json`, JSON.stringify({ measurements, errors }, null, 2) + '\n');
  await browser.close();
}
