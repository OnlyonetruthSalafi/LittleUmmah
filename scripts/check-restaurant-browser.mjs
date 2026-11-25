// Plays two restaurant meals: meal 1 right first time, meal 2 with a wrong dish sent back, a too-expensive order, then a fix.
// Usage: node scripts/check-restaurant-browser.mjs [base-url] [screenshot-dir]
import assert from 'node:assert/strict';
import { chromium, chromePath } from './film-kit/lib/playwright.mjs';
const base = process.argv[2] || 'http://localhost:3123';
const out = process.argv[3];
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
const errors = [];
page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(() => { localStorage.setItem('little-ummah:sound', 'off'); localStorage.removeItem('little-ummah:games:restaurant:v1');
  localStorage.setItem('little-ummah:games:garden:v1', JSON.stringify({ delivered: 3 }));
  localStorage.setItem('little-ummah:games:smoothie:v1', JSON.stringify({ served: 5, coins: 0 })); });
await page.goto(base + '/games/vip/restaurant', { waitUntil: 'networkidle' });
const stage = () => page.locator('[data-lunch-stage]').getAttribute('data-lunch-stage');
const choose = async (dish, seat) => { await page.locator(`[data-dish="${dish}"]`).tap(); await page.locator(`[data-seat="${seat}"]`).tap(); };
// Meal 1: Hadi wants something with carrot. Salad (4) fits the 6 coins.
await page.locator('[data-seat-friend="0"]').tap();
if (out) await page.screenshot({ path: `${out}/r1-ask.png`, fullPage: true });
await choose('salad', 0);
await page.getByRole('button', { name: /^สั่งอาหาร/ }).tap();
await page.locator('[data-lunch-stage="paid"]').waitFor({ timeout: 15000 });
if (out) await page.screenshot({ path: `${out}/r1-paid.png`, fullPage: true });
const coins1 = await page.evaluate(() => JSON.parse(localStorage.getItem('little-ummah:games:smoothie:v1')).coins);
assert.equal(coins1, 6 - 4 + 2, 'change plus two coins for one happy friend');
// Meal 2: Safi wants something hot with 5 coins. A cold sandwich is sent back; fried rice is too dear; soup fits.
await page.locator('[data-lunch-stage="choose"]').waitFor({ timeout: 8000 });
await page.locator('[data-seat-friend="0"]').tap();
await choose('sandwich', 0);
await page.getByRole('button', { name: /^สั่งอาหาร/ }).tap();
await page.waitForFunction(() => document.querySelector('[data-lunch-stage]')?.getAttribute('data-lunch-stage') === 'choose'
  && !document.querySelector('[data-seat="0"]')?.getAttribute('aria-label')?.includes('แซนด์วิช'), null, { timeout: 15000 });
await choose('fried-rice', 0);
await page.getByRole('button', { name: /^สั่งอาหาร/ }).tap();
const broke = await page.locator('[role=status]').first().innerText();
assert.match(broke, /เงินไม่พอ/);
await choose('pumpkin-soup', 0);
await page.getByRole('button', { name: /^สั่งอาหาร/ }).tap();
await page.locator('[data-lunch-stage="paid"]').waitFor({ timeout: 15000 });
const coins2 = await page.evaluate(() => JSON.parse(localStorage.getItem('little-ummah:games:smoothie:v1')).coins);
assert.equal(coins2 - coins1, 5 - 5 + 2 - 1, 'one swap costs a coin');
const scroll = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
const small = await page.$$eval('[data-dish],[data-seat],[data-seat-friend]', bs => bs.filter(b => { const r = b.getBoundingClientRect(); return r.width < 64 || r.height < 64; }).length);
assert.equal(scroll, false); assert.equal(small, 0, 'every tap target is at least 64px');
assert.deepEqual(errors, []);
console.log('Restaurant: right first time, sent back, over budget, and fixed — all passed.', await stage());
await browser.close();
