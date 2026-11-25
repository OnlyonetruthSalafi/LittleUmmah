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
await page.addInitScript(() => {
  window.playedGardenHints = [];
  window.finishedGardenHints = [];
  const originalPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (this.src.includes('/audio/th/garden/')) {
      this.addEventListener('playing', () => window.playedGardenHints.push(this.src), { once: true });
      this.addEventListener('ended', () => window.finishedGardenHints.push(this.src), { once: true });
    }
    return originalPlay.call(this);
  };
  localStorage.setItem('little-ummah:sound', 'off');
  const wallet = 'little-ummah:games:smoothie:v1';
  if (!localStorage.getItem(wallet)) localStorage.setItem(wallet, JSON.stringify({ served: 3, coins: 0 }));
});
await page.goto(base + '/games/vip#garden', { waitUntil: 'networkidle' });
await page.getByRole('link', { name: /เข้าสวนผัก/ }).tap();
const dialog = page.getByRole('dialog');
await dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first().tap();
if (out) await page.screenshot({ path: `${out}/1-salam-${w}.png` });
await dialog.getByRole('button', { name: /รับคำขอ/ }).tap();
await page.waitForTimeout(300);
if (out) await page.screenshot({ path: `${out}/2-work-${w}.png` });
const bed = page.locator('[data-bed="0"]');
const tool = n => page.locator(`[data-tool="${n}"]`);
const task = n => page.locator(`[data-garden-task="${n}"]`).waitFor();
const bedSign = (action, bedIndex = 0) => page.locator(`[data-bed-sign="${action}"][data-for-bed="${bedIndex}"]`);
const basket = page.locator('[data-drag="basket"]');
const packed = basket.locator('[data-crop]');
const soundButton = page.locator('main header button[aria-pressed]');
const requestSign = page.locator('[data-customer-request]');
const shownCrops = () => requestSign.locator('[data-request-crop]').evaluateAll(nodes => nodes.map(n => n.dataset.requestCrop));
await task('dig');
assert.equal(await packed.count(), 0);
const digSign = bedSign('dig');
await digSign.waitFor();
assert.equal(await page.locator('[data-bed-sign="dig"]').count(), 4, 'only the four open beds need digging');
assert.equal(await page.getByRole('button', { name: /ตัวเลขบอกลำดับ|Step numbers/ }).count(), 0);
assert.ok((await page.locator('button[data-tool]').allTextContents()).every(label => !/\d/.test(label)));
const shopButton = page.getByRole('button', { name: /ร้านเมล็ดพันธุ์/ });
await shopButton.locator('svg').waitFor();
await shopButton.tap();
await page.getByRole('dialog', { name: /ร้านเมล็ดพันธุ์/ }).getByRole('button', { name: /กลับไปที่สวน/ }).tap();
await bed.tap();
assert.equal(await bed.getAttribute('data-look'), 'wild', 'a bare-handed tap cannot till soil');
await tool('seed:carrot').tap(); await bed.tap();
assert.equal(await bed.getAttribute('data-look'), 'wild', 'seeds cannot go into hard soil');
const hoe = await tool('hoe').boundingBox(), soil = await bed.boundingBox();
const cx = soil.x + soil.width / 2, cy = soil.y + soil.height / 2;
await page.mouse.move(hoe.x + hoe.width / 2, hoe.y + hoe.height / 2); await page.mouse.down();
await page.mouse.move(cx, cy);
assert.equal(await bed.getAttribute('data-look'), 'wild', 'carrying the hoe to the bed does not dig it');
for (const offset of [-.3, .3, -.3, .3]) await page.mouse.move(cx + soil.width * offset, cy, { steps: 4 });
await page.mouse.up();
await task('sow');
await bedSign('sow').locator('image[href$="/carrot.webp"]').waitFor();
if (out) await page.screenshot({ path: `${out}/sow-sign.png` });
assert.equal(await digSign.count(), 0);
assert.match(await page.locator('[data-garden-task]').innerText(), /แครอท/);
await soundButton.tap();
await tool('seed:lettuce').tap();
assert.equal(await requestSign.count(), 0, 'picking up a sack alone is not a sowing attempt');
await bed.tap(); await requestSign.waitFor();
assert.deepEqual(await shownCrops(), ['carrot']);
assert.match(await page.locator('[data-garden-task]').innerText(), /ขอแครอทหนึ่งหัว/);
await page.waitForFunction(() => window.playedGardenHints.some(url => url.endsWith('/hadi-carrot-1.mp3')));
await bed.tap();
assert.equal(await bed.getAttribute('data-look'), 'tilled');
if (out) await page.screenshot({ path: `${out}/customer-reminder.png` });
await page.waitForFunction(() => window.finishedGardenHints.some(url => url.endsWith('/hadi-carrot-1.mp3')));
await bed.tap();
await page.waitForFunction(() => window.playedGardenHints.filter(url => url.endsWith('/hadi-carrot-1.mp3')).length === 2);
await soundButton.tap();
await tool('seed:carrot').tap(); await bed.tap();
await task('water');
await requestSign.waitFor({ state: 'detached' });
await bedSign('water').locator('image[href$="/watering-can.webp"]').waitFor();
await tool('can').tap(); await bed.tap();
await bedSign('grow').waitFor();
await soundButton.tap();
await page.waitForTimeout(1500);
if (out) await page.screenshot({ path: `${out}/3-sown-${w}.png` });
const t0 = Date.now(); let looks = [];
while (Date.now() - t0 < 40000) {
  const l = await bed.getAttribute('data-look'); looks.push(l);
  if (l === 'ready') break;
  const label = await bed.getAttribute('aria-label');
  if (/วัชพืช/.test(label)) {
    const sign = bedSign('weed');
    await sign.waitFor();
    await page.waitForFunction(() => window.playedGardenHints.some(url => url.endsWith('/hadi-weed.mp3')));
    if (out) await page.screenshot({ path: `${out}/weed-sign.png` });
    assert.equal(await packed.count(), 0);
    await soundButton.tap();
    await tool('fork').tap(); await bed.tap();
    await sign.waitFor({ state: 'detached' });
  }
  if (/ขาดน้ำ/.test(label)) { await tool('can').tap(); await bed.tap(); }
  await page.waitForTimeout(700);
}
await bedSign('harvest').locator('image[href$="/carrot.webp"]').waitFor();
if (out) await page.screenshot({ path: `${out}/4-ready-${w}.png` });
await tool('fork').tap(); await bed.tap(); // dig the ripe vegetable up with the fork
await page.waitForTimeout(400);
const status1 = await page.locator('[role=status]').first().innerText();
await task('sell');
assert.equal(await page.locator('[data-bed-sign]').count(), 0);
if (out) await page.screenshot({ path: `${out}/basket-ready-${w}.png` });
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
assert.equal(JSON.parse(save[0]).delivered, 1);
assert.match(await page.locator('[data-garden-stage] [data-done]').innerText(), /1\/1/);
assert.equal(scroll, false);
const carried = page.locator('[data-basket="carried"]');
const replacement = page.locator('[data-basket="replacement"]');
assert.deepEqual(await carried.locator('[data-crop]').evaluateAll(nodes => nodes.map(n => n.dataset.crop)), ['carrot']);
assert.equal(await replacement.evaluate(el => Number(getComputedStyle(el).opacity)), 0);
const hand = await carried.boundingBox();
await page.waitForFunction(x => {
  const basket = document.querySelector('[data-basket="carried"]');
  return basket && basket.getBoundingClientRect().x < x - 60;
}, hand.x);
if (out) await page.screenshot({ path: `${out}/customer-leaving-${w}.png` });
await page.waitForFunction(() => {
  const basket = document.querySelector('[data-basket="replacement"]');
  return basket && Number(getComputedStyle(basket).opacity) >= .95;
});
assert.equal(await replacement.locator('[data-crop]').count(), 0);
if (out) await page.screenshot({ path: `${out}/empty-basket-${w}.png` });
// The next customer can also collect a basket with motion reduced.
await page.emulateMedia({ reducedMotion: 'reduce' });
// Play the next order in the same garden. Use the tap-to-sell shortcut this time.
await dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first().tap();
await dialog.getByRole('button', { name: /รับคำขอ/ }).tap();
await task('dig'); await digSign.waitFor();
await tool('hoe').focus(); await page.keyboard.press('Enter'); await bed.tap();
await task('sow');
assert.match(await page.locator('[data-garden-task]').innerText(), /ผักกาด/);
await tool('seed:carrot').dragTo(bed);
await requestSign.waitFor();
assert.deepEqual(await shownCrops(), ['lettuce']);
assert.equal(await bed.getAttribute('data-look'), 'tilled');
assert.equal(await page.evaluate(() => window.playedGardenHints.some(url => url.endsWith('/safi-lettuce-1.mp3'))), false);
await tool('seed:lettuce').focus(); await page.keyboard.press('Enter'); await bed.tap();
await task('water'); await tool('can').tap(); await bed.tap();
await task('weed'); await tool('fork').tap(); await bed.tap();
await task('water'); await tool('can').tap(); await bed.tap();
await task('harvest'); await tool('fork').tap(); await bed.tap();
await task('sell');
await page.locator('[data-drag="basket"]').tap();
await page.locator('[data-garden-stage="thanks"]').waitFor();
assert.equal(await carried.locator('[data-crop="lettuce"]').count(), 1);
if (out) await page.screenshot({ path: `${out}/safi-carry-${w}.png` });
assert.equal(await carried.evaluate(el => getComputedStyle(el).animationName), 'none');
await page.reload({ waitUntil: 'networkidle' });
assert.deepEqual(await page.evaluate(() => [
  JSON.parse(localStorage.getItem('little-ummah:games:garden:v1')).delivered,
  JSON.parse(localStorage.getItem('little-ummah:games:smoothie:v1')).coins,
]), [2, 6], 'both sales survived re-entry');
// All five seed sacks and all three tools must stay on the benches after upgrades.
await page.evaluate(() => {
  const key = 'little-ummah:games:garden:v1';
  const farm = JSON.parse(localStorage.getItem(key));
  delete farm.activeOrder;
  farm.plots[0] = { kind: 'tilled' };
  farm.plots[1] = { kind: 'crop', crop: 'carrot', growth: 9000, water: 0, weed: 'pulled', at: Date.now() };
  localStorage.setItem(key, JSON.stringify({ ...farm, hints: false, basket: { ...farm.basket, carrot: 3, corn: 1 }, sprinkler: true, beds: true, tomato: true, corn: true, pumpkin: true }));
});
await page.reload({ waitUntil: 'networkidle' });
await dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first().tap();
await dialog.getByRole('button', { name: /รับคำขอ/ }).tap();
for (const [width, height] of [[360,740], [600,800], [844,390], [1366,768]]) {
  await page.setViewportSize({width, height});
  const boxes = await page.locator('button[data-tool]').evaluateAll(buttons => buttons.map(b => {
    const r = b.getBoundingClientRect();
    const scene = b.closest('[role="toolbar"]').getBoundingClientRect();
    return r.left >= scene.left - 1 && r.right <= scene.right + 1 && r.width >= 64 && r.height >= 64;
  }));
  assert.equal(boxes.length, 8);
  assert.ok(boxes.every(Boolean), 'Reachable tools at ' + width);
}
await task('dig');
assert.equal(await packed.count(), 0);
assert.equal(await page.locator('[data-bed-sign="dig"]').count(), 6);
await basket.tap();
assert.equal(await carried.count(), 0);
const otherBed = page.locator('[data-bed="1"]');
for (const plot of [bed, otherBed]) {
  await tool('hoe').tap(); await plot.tap();
  await tool('seed:carrot').tap(); await plot.tap();
}
for (const [i, plot] of [bed, otherBed].entries()) {
  await bedSign('weed', i).waitFor();
  await tool('fork').tap(); await plot.tap();
}
await task('harvest');
await bed.tap();
await packed.first().waitFor();
assert.equal(await packed.count(), 1);
await page.reload({ waitUntil: 'networkidle' });
await dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first().tap();
await dialog.getByRole('button', { name: /รับคำขอ/ }).tap();
await task('harvest');
assert.equal(await packed.count(), 1);
await tool('fork').tap(); await otherBed.tap();
await task('sell');
await basket.focus(); await page.keyboard.press('Enter');
await carried.waitFor();
assert.deepEqual(await carried.locator('[data-crop]').evaluateAll(nodes => nodes.map(n => n.dataset.crop)), ['carrot', 'carrot']);
if (out) await page.screenshot({ path: `${out}/sabir-carry-desktop.png` });
await page.waitForFunction(() => {
  const basket = document.querySelector('[data-basket="replacement"]');
  return basket && Number(getComputedStyle(basket).opacity) === 1;
});
assert.equal(await replacement.locator('[data-crop]').count(), 0);
const stock = await page.evaluate(() => JSON.parse(localStorage.getItem('little-ummah:games:garden:v1')).basket);
assert.ok(Object.values(stock).every(n => n === 0));
// Resume a mixed order. One of the two lettuces has already been harvested.
await page.evaluate(() => {
  const key = 'little-ummah:games:garden:v1';
  const farm = JSON.parse(localStorage.getItem(key));
  farm.activeOrder = 'feast';
  farm.delivered = 10;
  farm.plots[0] = { kind: 'tilled' };
  farm.basket.lettuce = 1;
  localStorage.setItem(key, JSON.stringify(farm));
});
await page.setViewportSize({ width: 360, height: 740 });
await page.reload({ waitUntil: 'networkidle' });
await dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first().tap();
await dialog.getByRole('button', { name: /รับคำขอ/ }).tap();
await tool('seed:carrot').tap(); await bed.tap(); await requestSign.waitFor();
assert.deepEqual((await shownCrops()).sort(), ['corn', 'lettuce', 'pumpkin']);
const signBox = await requestSign.boundingBox();
assert.ok(signBox.x >= 0 && signBox.x + signBox.width <= 360);
if (out) await page.screenshot({ path: `${out}/mixed-order-reminder.png` });
await tool('seed:pumpkin').tap(); await bed.tap();
await requestSign.waitFor({ state: 'detached' });
await page.locator('[data-bed="0"][data-look="seed"]').waitFor();
// Spend the coins earned above on the first seed upgrade. The waiting ticket should change
// as soon as the shop closes, and the next mixed recipe should follow a real tomato harvest.
await page.evaluate(() => localStorage.setItem('little-ummah:games:garden:v1', JSON.stringify({ delivered: 3 })));
await page.reload({ waitUntil: 'networkidle' });
await dialog.getByRole('button', { name: /คุยต่อภายหลัง/ }).tap();
await shopButton.tap();
const tomatoStock = dialog.locator('[data-upgrade="tomato"]');
await tomatoStock.getByRole('button').tap();
await dialog.locator('[data-upgrade="tomato"][data-state="owned"]').waitFor();
await dialog.getByRole('button', { name: /กลับไปที่สวน/ }).tap();
await dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first().tap();
await dialog.getByText('ขอมะเขือเทศสองลูกได้ไหมคะ', { exact: false }).first().waitFor();
if (out) await page.screenshot({ path: `${out}/first-tomato-order.png` });
await dialog.getByRole('button', { name: /รับคำขอ/ }).tap();
for (const plot of [bed, otherBed]) {
  await tool('hoe').tap(); await plot.tap();
  await tool('seed:tomato').tap(); await plot.tap();
  await tool('can').tap(); await plot.tap();
}
const deadline = Date.now() + 40000;
while (await page.locator('[data-garden-task="sell"]').count() === 0 && Date.now() < deadline) {
  for (const [i, plot] of [bed, otherBed].entries()) {
    const sign = await page.locator(`[data-for-bed="${i}"]`).evaluateAll(nodes => nodes[0]?.getAttribute('data-bed-sign'));
    if (sign === 'weed' || sign === 'harvest') { await tool('fork').tap(); await plot.tap(); }
    if (sign === 'water') { await tool('can').tap(); await plot.tap(); }
    if (await page.locator('[data-garden-task="sell"]').count()) break;
  }
  await page.waitForTimeout(250);
}
await task('sell'); await basket.tap();
await carried.waitFor();
assert.equal(await carried.locator('[data-crop="tomato"]').count(), 2);
await dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first().tap();
await dialog.getByText(/จะทำสลัดครับ/).first().waitFor();
assert.deepEqual(errors, []);
console.log(JSON.stringify({ looks: [...new Set(looks)], status1, stage, save, scroll, sizes, errors: errors.slice(0, 5) }, null, 1));
await browser.close();
