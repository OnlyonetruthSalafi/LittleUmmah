import assert from 'node:assert/strict';
import { chromium, chromePath } from './film-kit/lib/playwright.mjs';

const base = process.argv[2] ?? 'http://localhost:3123';
const out = process.argv[3];
const browser = await chromium.launch({ executablePath: chromePath, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('little-ummah:sound', 'off');
    if (!localStorage.getItem('little-ummah:games:smoothie:v1')) {
      localStorage.setItem('little-ummah:games:smoothie:v1', JSON.stringify({ served: 2, coins: 0, earnedCoins: 10 }));
    }
  });
  const progress = page.locator('[data-next-island] progress');
  const dialog = page.getByRole('dialog');
  const reply = dialog.getByRole('button', { name: /^วะอะลัยกุมุสสะลาม/ }).first();
  const back = page.getByRole('link', { name: /กลับแผนที่/ });
  await page.goto(base + '/games/vip/garden');
  await back.click();
  await page.getByRole('link', { name: /เข้าร้านน้ำปั่น/ }).waitFor();
  assert.equal(await progress.getAttribute('value'), '10');
  assert.equal(await progress.getAttribute('max'), '15');
  assert.equal(await page.locator('[data-stop="garden"][data-locked]').count(), 1);
  assert.equal(await page.locator('[data-fog-cleared]').count(), 0);
  if (out) await page.screenshot({ path: out + '/before-garden.png' });
  await page.getByRole('link', { name: /เข้าร้านน้ำปั่น/ }).click();
  await reply.click();
  await dialog.getByRole('button', { name: /รับออเดอร์/ }).click();
  for (const object of ['orange', 'orange', 'blender', 'cup']) await page.locator(`[data-object="${object}"]`).click();
  const cup = await page.locator('[data-drag="serve"]').boundingBox();
  const scene = await page.locator('[data-shop-stage] svg[role="img"]').boundingBox();
  await page.mouse.move(cup.x + cup.width / 2, cup.y + cup.height / 2);
  await page.mouse.down();
  await page.mouse.move(scene.x + scene.width * 478 / 900, scene.y + scene.height * 200 / 530, { steps: 8 });
  await page.mouse.up();
  await page.locator('[data-object="coins"]').click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('little-ummah:games:smoothie:v1')).earnedCoins === 15);
  await back.click();
  await page.locator('[data-next-island="restaurant"]').waitFor();
  assert.equal(await page.locator('[data-fog-cleared="garden"]').count(), 1);
  assert.equal(await progress.getAttribute('value'), '0');
  assert.equal(await progress.getAttribute('max'), '10');
  await page.goto(base + '/games/vip/restaurant');
  await back.waitFor();
  // Return with a ready basket and an empty wallet after upgrades.
  await page.evaluate(() => {
    const shopKey = 'little-ummah:games:smoothie:v1';
    const shop = JSON.parse(localStorage.getItem(shopKey));
    localStorage.setItem(shopKey, JSON.stringify({ ...shop, coins: 0, berry: true }));
    localStorage.setItem('little-ummah:games:garden:v1', JSON.stringify({
      delivered: 2, earnedCoins: 6, activeOrder: 'carrot-2', basket: { carrot: 2 },
    }));
  });
  await back.click();
  await page.getByRole('link', { name: /เข้าสวนผัก/ }).waitFor();
  assert.equal(await progress.getAttribute('value'), '6');
  if (out) await page.screenshot({ path: out + '/garden-open.png' });
  await page.getByRole('link', { name: /เข้าสวนผัก/ }).click();
  await reply.click();
  await dialog.getByRole('button', { name: /รับคำขอ/ }).click();
  await page.locator('[data-drag="basket"]').click();
  await page.locator('[data-garden-stage="thanks"]').waitFor();
  await back.click();
  await page.locator('[data-stop="restaurant"]:not([data-locked])').waitFor();
  assert.equal(await page.locator('[data-fog-cleared="restaurant"]').count(), 1);
  await page.reload();
  await page.getByRole('button', { name: /เดินไปร้านอาหาร/ }).click();
  await page.getByRole('link', { name: /เข้าร้านอาหาร/ }).click();
  await page.locator('[data-lunch-stage]').waitFor();
  console.log('Smoothie and vegetable sales opened both islands. Spending and reloading kept both bridges open.');
} finally {
  await browser.close();
}
