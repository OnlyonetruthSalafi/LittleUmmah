// Standalone, or called by check-game-landscape-browser.mjs. Uses the existing local Playwright.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { memorySymbols } from '../src/features/games/data/memoryArt.ts';

export async function checkMemoryBrowser(browser, base) {
  const out = process.env.BROWSER_CHECK_OUT ?? 'output/C-4';
  await mkdir(`${out}/shots`, { recursive: true });
  const seen = new Set();
  const measurements = [];
  for (const [width, height] of [[360, 780], [390, 844], [430, 932], [844, 390], [640, 960], [768, 1024], [1280, 720]]) {
    const mobilePortrait = width < 640 && height > width;
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 1000, reducedMotion: 'reduce' });
    // Reproducible random stream, still exercising the real browser round creation.
    await context.addInitScript(() => {
      let seed = 42;
      Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    for (let level = 1; level <= 3; level++) {
      const count = [3, 6, 8][level - 1];
      await page.goto(`${base}/games/memory`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.mem-card').count(), 0, 'SSR/initial hydration has no random board');
      assert.equal(await page.locator('.gc-rotate').count(), 0);
      await page.locator('.gc-level-stone').nth(level - 1).click();
      await page.locator('.gc-adventure-start').click();
      await page.waitForSelector('.gc-board:not([inert]) .mem-card');
      await page.locator('.gc-countdown').waitFor({ state: 'detached' });
      const getDeck = () => page.locator('.mem-face-front img').evaluateAll(imgs => imgs.map(img => {
        const url = new URL(img.src, location.href);
        return url.searchParams.get('url') ?? url.pathname;
      }));
      const deck = await getDeck();
      assert.equal(deck.length, count * 2);
      const values = [...new Set(deck)];
      assert.equal(values.length, count);
      for (const src of values) {
        assert.equal(deck.filter(s => s === src).length, 2);
        assert.ok(memorySymbols.some(s => src === `/games/memory/${s.art}.webp`));
        seen.add(src);
      }
      await page.waitForFunction(() => [...document.querySelectorAll('.mem-card img,.isl-art')].every(i => i.complete && i.naturalWidth > 0));
      const geometry = await page.evaluate(() => {
        const surface = document.querySelector('.isl-surface').getBoundingClientRect();
        const cards = [...document.querySelectorAll('.mem-card')].map(c => c.getBoundingClientRect());
        const island = document.querySelector('.isl-art');
        const controls = [...document.querySelectorAll('.gc-game-header .ui-pill,.gc-instruction button,.gc-bottom-controls button')].map(c => c.getBoundingClientRect());
        return { inSurface: cards.every(c => c.left >= surface.left - 1 && c.right <= surface.right + 1 && c.top >= surface.top - 1 && c.bottom <= surface.bottom + 1), minCard: Math.min(...cards.map(c => Math.min(c.width, c.height))),
          cardWidth: cards[0].width, cardHeight: cards[0].height,
          rows: new Set(cards.map(c => Math.round(c.top))).size,
          inViewport: [...cards,...controls].every(c => c.left >= 0 && c.top >= 0 && c.right <= innerWidth && c.bottom <= innerHeight),
          minControl: Math.min(...controls.map(c => Math.min(c.width,c.height))),
          islandSrc: new URL(island.currentSrc).pathname, loaded: island.complete && island.naturalWidth > 0,
          pageHeight: document.documentElement.scrollHeight, overflowY: document.documentElement.scrollHeight > innerHeight,
          overflow: document.documentElement.scrollWidth > innerWidth };
      });
      assert.ok(geometry.inSurface, 'cards stay within original island surface');
      assert.ok(!geometry.overflow, 'no horizontal overflow');
      measurements.push({ width, height, level, ...geometry });
      assert.ok(geometry.loaded, 'selected island is decoded');
      assert.equal(geometry.islandSrc, mobilePortrait ? `/games/memory/island-mobile-${level === 3 ? 'tall-b' : 'a'}.webp` : '/games/memory/island.webp');
      if (mobilePortrait) {
        assert.ok(geometry.minCard >= 64, `mobile cards >=64px: ${geometry.minCard}`);
        assert.ok(geometry.minControl >= 64, `mobile controls >=64px: ${geometry.minControl}`);
        assert.ok(!geometry.overflowY && geometry.inViewport, `no page scroll or clipped controls: ${JSON.stringify(geometry)}`);
        assert.equal(geometry.rows, [2,3,4][level-1]);
        await page.screenshot({ path: `${out}/shots/start-${level}-${width}x${height}.png` });
      }

      // A mismatch locks a third click, then hides both cards without matching.
      const different = deck.findIndex(s => s !== deck[0]);
      await page.locator('.mem-card').nth(0).click();
      await page.locator('.mem-card').nth(0).dispatchEvent('click');
      assert.equal(await page.locator('.mem-card[data-shown]').count(), 1);
      await page.locator('.mem-card').nth(different).click();
      // aria-disabled deliberately guards in the rule; dispatch tests the guard itself.
      await page.locator('.mem-card').nth(deck.findIndex((_, i) => i !== 0 && i !== different)).dispatchEvent('click');
      assert.equal(await page.locator('.mem-card[data-shown]').count(), 2);
      await page.waitForFunction(() => !document.querySelector('.mem-card[data-shown]'));
      assert.equal(await page.locator('.mem-card[data-matched]').count(), 0);
      for (const src of values) {
        const indices = deck.flatMap((s, i) => s === src ? [i] : []);
        await page.locator('.mem-card').nth(indices[0]).click();
        await page.locator('.mem-card').nth(indices[1]).click();
        await page.waitForFunction(i => document.querySelectorAll('.mem-card')[i]?.dataset.matched === 'true', indices[0]);
      }
      assert.equal(await page.locator('.mem-card[data-matched]').count(), count * 2);
      if (mobilePortrait) assert.ok(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), 'matched board still fits without scroll');
      await page.screenshot({ path: `${out}/shots/level-${level}-${width}x${height}.png` });
      await page.waitForSelector('.gc-result');
      // Replay clears the old state and resamples the library.
      await page.locator('.gc-result-actions button').last().click();
      await page.waitForSelector('.gc-board:not([inert]) .mem-card');
      const replay = await getDeck();
      assert.equal(replay.length, count * 2);
      assert.notDeepEqual(replay, deck);
      assert.equal(await page.locator('.mem-card[data-matched]').count(), 0);
      replay.forEach(s => seen.add(s));
      // The first screenshot rounds need not cover the whole library. Exercise
      // real restarts until every asset has appeared, with a bounded seeded run.
      if (width === 1280 && level === 3) {
        for (let round = 0; round < 32 && seen.size < memorySymbols.length; round++) {
          await page.locator('.gc-bottom-controls button').last().click();
          await page.waitForSelector('.gc-board:not([inert]) .mem-card');
          const next = await getDeck();
          assert.equal(next.length, count * 2);
          assert.equal(new Set(next).size, count);
          for (const src of next) {
            assert.equal(next.filter(s => s === src).length, 2);
            seen.add(src);
          }
          await page.waitForFunction(() => [...document.querySelectorAll('.mem-card img')].every(i => i.complete && i.naturalWidth > 0));
        }
      }
      console.log(`ok memory ${width}x${height} level ${level}: ${count} pairs, match/mismatch, replay, screenshot`);
    }
    assert.deepEqual(errors, [], 'no JS, missing image, or hydration errors');
    await context.close();
  }
  assert.equal(seen.size, memorySymbols.length, 'browser rounds exercise all old and new images');
  await writeFile(`${out}/browser-results.json`, JSON.stringify({ seen: [...seen], measurements }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const require = createRequire(import.meta.url);
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try { await checkMemoryBrowser(browser, process.argv[2] ?? 'http://localhost:3114'); }
  finally { await browser.close(); }
}
