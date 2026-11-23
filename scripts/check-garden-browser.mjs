// Plays one garden visit end to end: salam, accept, dig, sow, water, weed and harvest with the fork, drag the basket to the friend.
// Usage: node scripts/check-garden-browser.mjs [base-url] [screenshot-dir]
import assert from 'node:assert/strict';
import { chromium, chromePath } from './film-kit/lib/playwright.mjs';
const base = process.argv[2] || 'http://localhost:3123';
const out = process.argv[3];
const [w, h] = [390, 844];
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: true });
const errors = [];
page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(() => { localStorage.setItem('little-ummah:sound', 'off'); localStorage.removeItem('little-ummah:games:garden:v1'); });
await page.goto(base + '/games/vip/garden', { waitUntil: 'networkidle' });
const dialog = page.getByRole('dialog');
await dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first().tap();
if (out) await page.screenshot({ path: `${out}/1-salam-${w}.png` });
await dialog.getByRole('button', { name: /รับคำขอ/ }).tap();
await page.waitForTimeout(300);
if (out) await page.screenshot({ path: `${out}/2-work-${w}.png` });
const bed = page.locator('[data-bed="0"]');
const tool = n => page.locator(`[data-tool="${n}"]`);
await tool('hoe').tap(); await bed.tap();
await tool('seed:carrot').tap(); await bed.tap();
await tool('can').tap(); await bed.tap();
await page.waitForTimeout(1500);
if (out) await page.screenshot({ path: `${out}/3-sown-${w}.png` });
const t0 = Date.now(); let looks = [];
while (Date.now() - t0 < 40000) {
  const l = await bed.getAttribute('data-look'); looks.push(l);
  if (l === 'ready') break;
  const label = await bed.getAttribute('aria-label');
  if (/วัชพืช/.test(label)) { await tool('fork').tap(); await bed.tap(); }
  if (/ขาดน้ำ/.test(label)) { await tool('can').tap(); await bed.tap(); }
  await page.waitForTimeout(700);
}
if (out) await page.screenshot({ path: `${out}/4-ready-${w}.png` });
await tool('fork').tap(); await bed.tap(); // dig the ripe vegetable up with the fork
await page.waitForTimeout(400);
const status1 = await page.locator('[role=status]').first().innerText();
// Drag the basket onto the friend.
const b = await page.locator('[data-drag="basket"]').boundingBox(), f = await page.locator('[data-object="friend"]').boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down();
await page.mouse.move(f.x + f.width / 2, f.y + f.height / 2, { steps: 8 }); await page.mouse.up();
await page.waitForTimeout(600);
if (out) await page.screenshot({ path: `${out}/5-thanks-${w}.png` });
const stage = await page.locator('[data-garden-stage]').getAttribute('data-garden-stage');
const save = await page.evaluate(() => [localStorage.getItem('little-ummah:games:garden:v1'), localStorage.getItem('little-ummah:games:smoothie:v1')]);
const scroll = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
const sizes = await page.$$eval('[data-bed],[data-tool],[data-drag],[data-object]', bs => bs.map(b => { const r = b.getBoundingClientRect(); return (b.dataset.bed ?? b.dataset.tool ?? b.dataset.drag ?? b.dataset.object) + ':' + Math.round(r.width) + 'x' + Math.round(r.height); }));
assert.equal(stage, 'thanks', 'the friend received the basket');
assert.equal(JSON.parse(save[1]).coins, 3, 'the carrot paid 3 shop coins');
assert.equal(scroll, false);
assert.deepEqual(errors, []);
console.log(JSON.stringify({ looks: [...new Set(looks)], status1, stage, save, scroll, sizes, errors: errors.slice(0, 5) }, null, 1));
await browser.close();
