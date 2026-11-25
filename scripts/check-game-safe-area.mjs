import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { games } from '../src/features/games/data/catalog.ts';

// Run against next start. Use PLAYWRIGHT_MODULE and PLAYWRIGHT_EXECUTABLE for a local Chromium.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.argv[2] || 'http://localhost:3101';
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const profiles = [
  // Width, height, left cutout, right cutout, bottom gesture area (CSS pixels).
  [568, 320, 0, 0, 0], [667, 375, 38, 0, 16], [740, 310, 42, 0, 12],
  [844, 390, 0, 56, 21], [932, 430, 56, 0, 21], [1024, 768, 0, 0, 0],
];

function unreachableControls({ width, height, left, right, bottom }) {
  const issues = [];
  for (const button of document.querySelectorAll('main button, main a')) {
    const r = button.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || getComputedStyle(button).visibility === 'hidden') continue;
    const name = button.getAttribute('aria-label') || button.textContent.trim();
    if (r.left < left - 1 || r.right > width - right + 1 || r.top < -1 || r.bottom > height - bottom + 1) {
      issues.push(name + ' outside safe area');
    }
    if (button.disabled || button.getAttribute('aria-disabled') === 'true') continue;
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    // Puzzle cells use painted SVG paths for touch and rectangular buttons for the keyboard.
    if (button.matches('.pz-cell') && hit?.closest('.pz-outlines')) continue;
    if (!button.contains(hit)) issues.push(name + ' covered');
  }
  return issues;
}

try {
  for (const game of games.filter(game => game.enabled)) {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
    try {
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await context.addInitScript(slug => {
        localStorage.setItem('little-ummah:games:v1:' + slug, JSON.stringify({ levelStars: { 1: 2, 2: 2 } }));
      }, game.slug);
      await page.goto(base + '/games/' + game.slug);
      await page.evaluate(() => document.fonts.ready);
      const levels = page.locator('.gc-level-stone, .harbor-level, .pz-difficulty button');
      if (await levels.count()) await levels.last().click();
      for (const state of ['idle', 'playing']) {
        if (state === 'playing') {
          await page.setViewportSize({ width: 844, height: 390 });
          await page.locator('.gc-adventure-start, .harbor-start, .gc-start-3d, .pz-studio-start, .lmt-skip').click();
          await page.locator('[data-status=playing] .gc-board:not([inert])').waitFor();
        }
        for (const [width, height, left, right, bottom] of profiles) {
          await page.setViewportSize({ width, height });
          await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 0, left, right, bottom } });
          // Allow ResizeObserver and React to reproject the puzzle onto the resized island.
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          const issues = await page.evaluate(unreachableControls, { width, height, left, right, bottom });
          assert.deepEqual(issues, [], game.slug + ' ' + state + ' ' + width + 'x' + height + ': ' + issues.join(', '));
        }
      }
      console.log('Passed', game.slug);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
