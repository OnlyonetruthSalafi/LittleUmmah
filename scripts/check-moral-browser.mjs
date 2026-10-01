// ตรวจหน้าเกาะมารยาท (/learn/moral) กับ `npm run start -- --port 3001` (หรือพอร์ตอื่นด้วย PORT=) ด้วย Playwright ที่มีในเครื่อง
// PLAYWRIGHT_MODULE ชี้ไปที่ playwright ที่ติดตั้งไว้แล้วได้ โดยไม่ต้องเพิ่ม dependency
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');

const OUT = 'output/moral-check';
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
await mkdir(OUT, { recursive: true });

const overlaps = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

try {
  for (const [width, height] of [[320, 700], [360, 780], [390, 844], [768, 1024], [1280, 800]]) {
    for (const reduce of [false, true]) {
      const context = await browser.newContext({
        viewport: { width, height },
        reducedMotion: reduce ? 'reduce' : 'no-preference',
        hasTouch: width < 800,
      });
      const page = await context.newPage();
      page.on('pageerror', (error) => errors.push(`${width}: ${error.message}`));
      page.on('response', (r) => { if (r.status() >= 400) errors.push(`${width}: ${r.status()} ${r.url()}`); });
      await page.goto(`http://localhost:${process.env.PORT ?? 3001}/learn/moral`);
      await page.locator('.mrl-hero').waitFor();

      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow ${width}`);

      // ระหว่างหุ่นยนต์แนะนำ: บอลลูนขึ้น และปุ่มวัยถูกชี้ตามลำดับ
      await page.locator('.mrl-bubble[data-show]').waitFor({ timeout: 6000 });
      const tag = `${width}${reduce ? '-reduce' : ''}`;
      await page.waitForTimeout(reduce ? 200 : 1500);
      await page.locator('.mrl-hero').screenshot({ path: `${OUT}/${tag}-tour.png` });
      await page.locator('.mrl-age-btn-kids[data-guided]').waitFor({ timeout: 15000 });
      await page.locator('.mrl-hero').screenshot({ path: `${OUT}/${tag}-point-kids.png` });

      // บอลลูนต้องไม่บังปุ่มช่วงวัยที่กำลังถูกชี้
      const bubble = await page.locator('.mrl-bubble').boundingBox();
      for (const age of ['kids', 'juniors']) {
        const btn = await page.locator(`.mrl-age-btn-${age}`).boundingBox();
        assert.ok(!overlaps(bubble, btn), `bubble covers ${age} button at ${tag}`);
      }

      // แตะหุ่นยนต์ = ข้าม -> กลับไปยืนมุมขวา
      await page.locator('.mrl-guide').click();
      await page.locator('.mrl-guide[data-phase="rest"]').waitFor();
      await page.waitForTimeout(reduce ? 100 : 1500);
      await page.locator('.mrl-hero').screenshot({ path: `${OUT}/${tag}-rest.png` });
      const robot = await page.locator('.mrl-guide').boundingBox();
      const art = await page.locator('.mrl-hero-art').boundingBox();
      assert.ok(robot.width >= 64 && robot.height >= 64, `rest robot ≥64px ${tag}: ${robot.width}`);
      assert.ok(robot.x + robot.width <= art.x + art.width + 1 && robot.x > art.x + art.width / 2, `rest robot on the right ${tag}`);
      for (const other of await page.locator('a, button:not(.mrl-guide)').all()) {
        const box = await other.boundingBox();
        if (box && box.width > 0) assert.ok(!overlaps(robot, box), `rest robot overlaps ${await other.innerText()} at ${tag}`);
      }

      // เป้ากดของเด็ก ≥ 64px (ข้อ 2)
      for (const sel of ['.mrl-age-btn', '.mrl-card', '.mrl-island-label']) {
        for (const el of await page.locator(sel).all()) {
          const box = await el.boundingBox();
          assert.ok(box.height >= 64, `${sel} ${tag} height ${box.height}`);
        }
      }

      // ไปเกาะอื่น = ภาพเกาะเดิมของหน้าแรก ห้าเกาะ ไม่มีเกาะมารยาท
      const srcs = await page.locator('.mrl-others img').evaluateAll((imgs) => imgs.map((i) => i.currentSrc || i.src));
      assert.equal(srcs.length, 5);
      for (const src of srcs) assert.match(decodeURIComponent(src), /islands\/(stories|quran|explore|games|art)\.webp/);

      // แตะการ์ด = เปิดหน้าต่างบทเรียน ได้ดาว 1 ดวง ภารกิจ 1/4
      if (!reduce) {
        await page.locator('#kids .mrl-card').first().click();
        await page.locator('.mrl-dialog[open]').waitFor();
        await page.locator('.mrl-dialog[open]').screenshot({ path: `${OUT}/${tag}-dialog.png` });
        await page.keyboard.press('Escape');
        assert.match(await page.locator('#kids .mrl-mission').innerText(), /1\/4/);
        await page.screenshot({ path: `${OUT}/${tag}-full.png`, fullPage: true });
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}
assert.deepEqual(errors, []);
console.log('moral page OK');
