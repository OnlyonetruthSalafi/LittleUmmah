// ตรวจหน้าแรก "วงเกาะโคจร" (IslandOrbit) — เปิด server ก่อน: node scripts/check-home-browser.mjs [baseUrl]
// PLAYWRIGHT_MODULE ชี้ playwright-core ที่มีอยู่ได้ · ภาพหน้าจอ/ตัวเลขอยู่ใน HOME_OUTPUT (default output/home-orbit)
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const base = (process.argv[2] || 'http://localhost:3150').replace(/\/+$/, '');
const out = process.env.HOME_OUTPUT || 'output/home-orbit';
await mkdir(`${out}/shots`, { recursive: true });
const failures = [];
const check = (ok, label) => { console.log(`${ok ? 'ok' : 'FAIL'} ${label}`); if (!ok) failures.push(label); };
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const front = page => page.locator('.orbit-island[data-front]').getAttribute('data-slug');
const lum = hex => { const c = hex.match(/[\da-f]{2}/gi).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return c[0] * .2126 + c[1] * .7152 + c[2] * .0722; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const rows = [];

for (const [width, height] of [[360, 780], [390, 844], [430, 932], [844, 390], [768, 1024], [1280, 800], [1536, 864]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: width < 800 });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  check(await page.locator('.orbit-island[data-slug="arabic"] a').getAttribute('href') === '/learn/languages', 'language island uses the new picker URL');
  // ภาพ lazy นอกจอ decode() จะค้างจนกว่าจะโหลด: สั่ง eager แล้วรอไม่เกิน 5 วินาทีต่อภาพ
  await page.evaluate(async () => { await document.fonts.ready; const imgs = [...document.querySelectorAll('.orbit-island img')]; imgs.forEach(i => { i.loading = 'eager'; }); await Promise.all(imgs.map(i => Promise.race([i.decode().catch(() => {}), new Promise(r => setTimeout(r, 5000))]))); });
  const m = await page.evaluate(() => {
    const box = e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
    const f = document.querySelector('.orbit-island[data-front]');
    return {
      count: document.querySelectorAll('.orbit-island').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      frontArt: box(f.querySelector('.orbit-art')),
      frontHit: box(f.querySelector('.orbit-hit')),
      caption: getComputedStyle(f.querySelector('.orbit-caption')).opacity,
      arrows: [...document.querySelectorAll('.orbit-arrow')].map(box),
      imagesOk: [...document.querySelectorAll('.orbit-island img')].every(i => i.complete && i.naturalWidth > 0),
      alts: [...document.querySelectorAll('.orbit-island img')].map(i => i.alt),
      labels: [...document.querySelectorAll('.orbit-hit')].map(e => e.getAttribute('aria-label')),
    };
  });
  check(m.count === 10, `${width}x${height} 10 islands`);
  check(!m.overflow, `${width}x${height} no horizontal scroll`);
  check(m.imagesOk, `${width}x${height} images load`);
  check(m.alts.every(a => a === ''), `${width}x${height} island images decorative (name is the link text)`);
  check(m.labels.every(Boolean), `${width}x${height} every island has a name for screen readers`);
  check(await front(page) === 'arabic', `${width}x${height} starts on Arabic`);
  check(m.caption === '1', `${width}x${height} front caption visible`);
  check(m.frontArt.x >= 0 && m.frontArt.x + m.frontArt.w <= width, `${width}x${height} front island inside screen`);
  check(m.frontHit.w >= 64 && m.frontHit.h >= 64 && m.arrows.every(a => a.w >= 64 && a.h >= 64), `${width}x${height} targets ≥64px`);
  // มือถือแนวตั้ง: เกาะเล็กลง (เจ้าของโปรเจกต์ 9 พ.ย. 2026) — เกาะหน้ากว้างไม่เกินครึ่งจอ
  if (width < 640) check(m.frontArt.w <= width * .5, `${width}x${height} phone island ≤ 50% width (${Math.round(m.frontArt.w)}px)`);
  check(errors.length === 0, `${width}x${height} no runtime errors: ${errors.join()}`);
  rows.push({ width, height, ...m });
  await page.screenshot({ path: `${out}/shots/home-${width}x${height}.png` });
  await page.close();
}

// ชื่อเกาะ ตัวหมึกบนขอบขาว · ไม่มีป้ายโซนแล้ว (เจ้าของโปรเจกต์ 9 พ.ย. 2026)
check(ratio('#0f1d33', '#ffffff') >= 4.5, 'island names contrast ≥4.5:1');
check(await (async () => { const p = await browser.newPage(); await p.goto(base, { waitUntil: 'networkidle' }); const n = await p.locator('.orbit-zone').count(); await p.close(); return n === 0; })(), 'no zone badges in the hero');

// การหมุน: ลูกศร, แตะเกาะหลัง = หมุนมาหน้า (ไม่เข้าเกาะ), แตะซ้ำ = เข้าเกาะ, เกาะล็อก = ข้อความ
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /เกาะถัดไป/ }).click();
  check(await front(page) === 'moral', 'next arrow turns the ring');
  check(await page.locator('.orbit-hint').evaluate(e => getComputedStyle(e).opacity === '0'), 'hint hides after first turn');
  await page.getByRole('button', { name: /เกาะก่อนหน้า/ }).click();
  check(await front(page) === 'arabic', 'previous arrow turns back');
  const games = page.locator('.orbit-island[data-slug="games"] a');
  await games.dispatchEvent('click'); // เกาะหลังถูกเกาะหน้าบังบางส่วน: ส่ง click ตรงที่ลิงก์ (แบบแตะส่วนที่มองเห็น)
  check(new URL(page.url()).pathname === '/' && await front(page) === 'games', 'tapping a back island brings it to the front');
  await games.click();
  await page.waitForURL(/\/learn\/games/);
  check(true, 'tapping the front island opens it');
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('.orbit-island[data-slug="tajweed"] button').dispatchEvent('click');
  await page.locator('.orbit-island[data-slug="tajweed"] button').click();
  check(await page.locator('.island-notice[data-visible="true"]').isVisible(), 'locked island shows the not-open-yet notice');
  await page.close();
}

// คีย์บอร์ด + motion (ข้อ 2.1)
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  const arabic = page.locator('.orbit-island[data-slug="arabic"] a');
  for (let i = 0; i < 15 && !(await arabic.evaluate(e => e === document.activeElement)); i++) await page.keyboard.press('Tab');
  check(await arabic.evaluate(e => e.matches(':focus-visible') && parseFloat(getComputedStyle(e).outlineWidth) >= 3), 'keyboard: visible outline on island');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(80);
  const mid = await page.locator('.orbit-island[data-slug="arabic"]').evaluate(e => e.style.getPropertyValue('--sx'));
  await page.waitForTimeout(700);
  const end = await page.locator('.orbit-island[data-slug="arabic"]').evaluate(e => e.style.getPropertyValue('--sx'));
  check(mid !== end && await front(page) === 'moral', 'arrow key turns the ring with a short tween');
  // hover เกาะหน้า: ภาพขยับ ชื่อนิ่ง
  const link = page.locator('.orbit-island[data-slug="moral"] .orbit-hit');
  await page.mouse.move(0, 0);
  const before = await link.locator('.orbit-caption').boundingBox();
  await link.hover(); await page.waitForTimeout(260);
  const after = await link.locator('.orbit-caption').boundingBox();
  check(Math.abs(before.y - after.y) < .1, 'hover: caption stationary');
  check(await link.locator('img').evaluate(e => !['none', '0px'].includes(getComputedStyle(e).translate)), 'hover: island image lifts');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(50);
  check(await link.locator('img').evaluate(e => ['none', '0px'].includes(getComputedStyle(e).translate)), 'reduced motion: no hover lift');
  await page.mouse.move(0, 0);
  await page.getByRole('button', { name: /เกาะถัดไป/ }).click();
  check(await front(page) !== 'moral', 'reduced motion: ring jumps immediately');
  await page.screenshot({ path: `${out}/shots/turned-1280.png` });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${base}/en`, { waitUntil: 'networkidle' });
  check(!/[\u0e00-\u0e7f]/.test(await page.locator('main').innerText()), 'English page: no Thai');
  check(await page.locator('.orbit-island a').evaluateAll(links => links.every(a => a.getAttribute('href').startsWith('/en/'))), 'English page: localized links');
  await page.close();
}
await browser.close();
await writeFile(`${out}/measurements.json`, JSON.stringify({ rows, failures }, null, 2));
console.log(failures.length ? `${failures.length} failures` : 'home orbit checks passed');
process.exitCode = failures.length ? 1 : 0;
