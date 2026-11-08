// C-6: actual matching rounds, all classroom sets, touch sizes and screenshots.
// Run after build: node scripts/check-arabic-match-browser.mjs http://localhost:3116
// Both CLIs default to http://localhost:3210. Pass an explicit URL as above for C-6.
// When imported, the parent calls runArabicMatchBrowser(base); this runner uses
// that URL directly and does not read argv or apply a second fallback.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { arabicLetterSets, boardContent } from '../src/features/games/data/content.ts';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe';
// The parent suite owns the URL; importing this module never runs a browser.
export async function runArabicMatchBrowser(base) {
const out = process.env.BROWSER_CHECK_OUT ?? 'output/C-6/shots';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath });
const errors = [];
async function start(page, slug = 'arabic-match', level = 3, prefix = '') {
  await page.goto(`${base}${prefix}/games/${slug}`, { waitUntil: 'networkidle' });
  const viewport = page.viewportSize();
  if (viewport.width < viewport.height) {
    await page.locator('.gc-rotate').waitFor();
    assert.equal(await page.locator('.gc-play-container').getAttribute('inert'), '');
    await page.setViewportSize({ width: viewport.height, height: viewport.width });
    await page.locator('.gc-rotate').waitFor({ state: 'detached' });
  }
  await page.locator('.gc-level-stone').nth(level - 1).click();
  await page.locator('.gc-adventure-start').click();
  await page.locator('.gc-board:not([inert])').waitFor();
  await page.locator('.gc-countdown').waitFor({ state: 'detached' });
}
async function place(page, item) {
  await page.locator(`[data-item-id="${item.id}"]`).click();
  await page.locator(`[data-drop-id="${item.target}"]`).click();
}
try {
  for (const [width, height] of [[360, 780], [844, 390], [768, 1024], [1280, 720], [932, 521], [932, 540], [1101, 521]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: true, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await start(page);
    const readyFeedback = await page.locator('.gc-feedback').innerText();
    for (const [index, unit] of arabicLetterSets.entries()) {
      const choice = page.locator('.gc-arabic-sets button').nth(index);
      await choice.click();
      assert.equal(await choice.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.gc-arabic-sets .gc-arabic-set-check').count(), 1);
      assert.ok(await choice.locator('svg.gc-arabic-set-check').isVisible(), 'selected set has a visible non-color check mark');
      assert.equal(await choice.locator('svg.gc-arabic-set-check').getAttribute('aria-hidden'), 'true');
      const values = await page.locator('.gc-tray .gc-letter').allTextContents();
      assert.deepEqual(values.sort(), [...unit.letters].sort());
      assert.deepEqual((await page.locator('.gc-targets .gc-letter').allTextContents()).sort(), [...unit.letters].sort());
      const metrics = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('.gc-arabic-sets button, .gc-drop, .gc-object-button')];
        const glyphs = [...document.querySelectorAll('.gc-letter')];
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          small: buttons.filter(button => { const r = button.getBoundingClientRect(); return r.width < 64 || r.height < 64; }).length,
          clipped: glyphs.filter(glyph => {
            const r = glyph.getBoundingClientRect(), p = glyph.closest('button').getBoundingClientRect();
            return r.left < p.left || r.right > p.right || r.top < p.top || r.bottom > p.bottom || glyph.scrollHeight > glyph.clientHeight + 1;
          }).length,
        };
      });
      assert.deepEqual(metrics, { overflow: false, small: 0, clipped: 0 }, `${width} set ${index + 1}`);
      await page.locator('.gc-arabic-sets').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/set-${index + 1}-${width}x${height}.png`, fullPage: true });
      // Partial progress, hint and selected state must not leak into the next set.
      await place(page, boardContent('arabic-match', 3, index).items[0]);
      await page.waitForFunction(() => document.querySelector('progress')?.value === 1);
      assert.equal(await page.locator('progress').getAttribute('value'), '1');
      await page.locator('.gc-feedback .gc-correct').waitFor();
      // Reselecting the same set must preserve the current round and feedback.
      await choice.click();
      assert.equal(await page.locator('progress').getAttribute('value'), '1');
      assert.equal(await page.locator('.gc-feedback .gc-correct').count(), 1);
      if (index < 6) {
        await page.locator('.gc-arabic-sets button').nth(index + 1).click();
        await page.waitForFunction(() => document.querySelector('progress')?.value === 0);
        assert.equal(await page.locator('progress').getAttribute('value'), '0');
        assert.equal(await page.locator('.gc-filled, .gc-done-slot, .gc-hint, .gc-object-button[aria-pressed=true]').count(), 0);
        assert.equal(await page.locator('.gc-feedback').innerText(), readyFeedback, 'clear correct feedback on set change');
        assert.equal(await page.locator('.gc-feedback .gc-correct, .gc-feedback .gc-retry').count(), 0);
        const nextItems = boardContent('arabic-match', 3, index + 1).items;
        await page.locator(`[data-item-id="${nextItems[0].id}"]`).click();
        await page.locator(`[data-drop-id="${nextItems[1].target}"]`).click();
        await page.locator('.gc-feedback .gc-retry').waitFor();
        await choice.click();
        await page.waitForFunction(expected => document.querySelector('.gc-feedback')?.innerText === expected, readyFeedback);
        assert.equal(await page.locator('.gc-feedback').innerText(), readyFeedback, 'clear incorrect feedback on set change');
        assert.equal(await page.locator('.gc-feedback .gc-correct, .gc-feedback .gc-retry').count(), 0);
      }
      console.log(`PASS ${width}x${height} set ${index + 1}: glyphs, targets, reset, screenshot`);
    }
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  // Every set in every level can actually finish; same level star keys deduplicate replay.
  for (const level of [1, 2, 3]) for (let index = 0; index < 7; index++) {
    await start(page, 'arabic-match', level);
    await page.locator('.gc-arabic-sets button').nth(index).click();
    const content = boardContent('arabic-match', level, index);
    await page.locator(`[data-item-id="${content.items[0].id}"]`).click();
    await page.locator(`[data-drop-id="${content.items[1].target}"]`).click();
    assert.equal(await page.locator('progress').getAttribute('value'), '0');
    for (const item of content.items) await place(page, item);
    await page.locator('.gc-result').waitFor();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('little-ummah:games:v1:arabic-match')));
    assert.deepEqual(saved.completedLevels, Array.from({ length: level }, (_, i) => i + 1));
    assert.equal(saved.stars, level * 3);
    console.log(`PASS level ${level} set ${index + 1}: mismatch, complete, persisted stars`);
  }
  // Switching during the 900ms completion delay must cancel the old round.
  await start(page);
  assert.equal(await page.locator('.gc-arabic-sets button').nth(6).getAttribute('aria-pressed'), 'true', 'set choice survives starting another round');
  await page.locator('.gc-arabic-sets button').first().click();
  for (const item of boardContent('arabic-match', 3).items) await place(page, item);
  await page.locator('.gc-arabic-sets button').nth(6).click();
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('.gc-result').count(), 0);
  assert.equal(await page.locator('progress').getAttribute('value'), '0');

  for (const slug of ['color-match', 'sort']) for (const level of [1, 2, 3]) {
    await start(page, slug, level);
    assert.equal(await page.locator('.gc-arabic-sets').count(), 0);
    for (const item of boardContent(slug, level).items) await place(page, item);
    await page.locator('.gc-result').waitFor();
    console.log(`PASS ${slug} level ${level}`);
  }
  await start(page, 'arabic-match', 3, '/en');
  assert.ok(!/[\u0e00-\u0e7f]/.test(await page.locator('.gc-arabic-sets').innerText()));
  await page.locator('.gc-arabic-sets button').nth(6).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.gc-arabic-sets button').nth(6).getAttribute('aria-pressed'), 'true');
  assert.deepEqual(errors, []);
  console.log('PASS completion cancellation, English, keyboard, no browser errors');
  const blocked = await browser.newPage();
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('blocked'); } });
  });
  await start(blocked);
  await blocked.locator('.gc-arabic-sets button').nth(6).click();
  for (const item of boardContent('arabic-match', 3, 6).items) await place(blocked, item);
  await blocked.locator('.gc-result').waitFor();
  console.log('PASS blocked optional set preference storage remains playable');
} finally {
  await browser.close();
}
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await runArabicMatchBrowser(process.argv[2] ?? 'http://localhost:3210');
}
