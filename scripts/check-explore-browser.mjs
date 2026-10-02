// ตรวจหน้าเกาะสำรวจโลก (/learn/explore) และการ์ตูนเกาะมารยาทที่ใช้ส่วนประกอบร่วมกัน ด้วย Playwright ที่มีในเครื่อง
//   PORT=3000 PLAYWRIGHT_MODULE=<playwright/index.mjs> PLAYWRIGHT_EXECUTABLE=<chrome.exe> node scripts/check-explore-browser.mjs
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');

const OUT = 'output/explore-check';
const BASE = `http://localhost:${process.env.PORT ?? 3001}`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
await mkdir(OUT, { recursive: true });

const area = (b) => b.width * b.height;
const overlapArea = (a, b) =>
  Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));

try {
  for (const [width, height] of [[360, 780], [390, 844], [768, 1024], [1280, 800]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 800 });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(`${width}: ${error.message}`));
    page.on('response', (r) => { if (r.status() >= 400) errors.push(`${width}: ${r.status()} ${r.url()}`); });

    await page.goto(`${BASE}/learn/explore`);
    await page.locator('.mrl-hero').waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow ${width}`);
    await page.locator('.mrl-bubble[data-show]').waitFor({ timeout: 6000 });
    await page.locator('.mrl-guide').click();
    await page.locator('.mrl-guide[data-phase="rest"]').waitFor();

    // สองหมวดต่อช่วงวัย การ์ดสูง ≥ 64px (ข้อ 2)
    for (const age of ['kids', 'juniors']) {
      assert.equal(await page.locator(`#${age} .mrl-group-title`).count(), 2, `${age} groups`);
    }
    for (const el of await page.locator('.mrl-card').all()) {
      assert.ok((await el.boundingBox()).height >= 64, `card height ${width}`);
    }
    // ภาพการ์ดทุกใบโหลดได้
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const broken = await page.locator('.mrl-card-art img').evaluateAll((imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).length);
    assert.equal(broken, 0, `broken card images ${width}`);
    await page.screenshot({ path: `${OUT}/${width}-page.png`, fullPage: true });

    // การ์ดหมวดสัตว์ทุกใบ (4 ถิ่น x 2 วัย): ไล่ฉากจนจบ ตรวจภาพถ่ายทุกภาพ และป้ายอายะฮ์ทุกป้าย
    for (const age of ['kids', 'juniors']) {
      const cards = page.locator(`#${age} .mrl-group`).first().locator('.mrl-card');
      const count = await cards.count();
      assert.equal(count, 4, `${age} habitat cards`);
      for (let c = 0; c < count; c++) {
        await cards.nth(c).click();
        await page.locator('.mrl-cartoon[open]').waitFor();
        const scenes = await page.locator('.mrl-cartoon .mrl-dots li').count();
        let photos = 0;
        for (let i = 0; i < scenes; i++) {
          if (i > 0) await page.getByRole('button', { name: /ฉากถัดไป/ }).click();
          await page.waitForTimeout(250);
          const tag = `${width}-${age}-${c}-${i}`;
          if (await page.locator('.mrl-cartoon .mrl-photo').count()) {
            photos++;
            const photo = page.locator('.mrl-cartoon .mrl-photo img');
            await page.waitForFunction(() => {
              const img = document.querySelector('.mrl-cartoon .mrl-photo img');
              return img && img.complete && img.naturalWidth > 0;
            });
            assert.ok((await photo.getAttribute('alt')).includes('ตัวจริง'), `photo alt ${tag}`);
            // นูรีบังภาพถ่ายได้ไม่เกิน 10%
            const pBox = await page.locator('.mrl-cartoon .mrl-photo').boundingBox();
            const nBox = await page.locator('.mrl-cartoon .mrl-nuri').boundingBox();
            assert.ok(overlapArea(pBox, nBox) / area(pBox) < 0.1, `nuri covers photo ${tag}`);
            assert.match(await page.locator('.mrl-cartoon-caption').innerText(), /ภาพ:/);
            await page.waitForTimeout(400);
            await page.locator('.mrl-cartoon[open]').screenshot({ path: `${OUT}/${tag}-photo.png` });
          }
          const word = page.locator('.mrl-cartoon .mrl-stage-word');
          if (await word.count()) {
            const w = await word.boundingBox();
            const stage = await page.locator('.mrl-cartoon .mrl-stage').boundingBox();
            assert.ok(w.x >= stage.x - 1 && w.x + w.width <= stage.x + stage.width + 1, `word label fits ${tag}`);
            assert.ok(w.height < stage.height * 0.45, `word label too tall ${tag}`);
            if (width === 360) {
              await page.waitForTimeout(400);
              await page.locator('.mrl-cartoon[open]').screenshot({ path: `${OUT}/${tag}-word.png` });
            }
          }
        }
        assert.ok(photos >= 2, `${age} card ${c} has ${photos} photos`);
        await page.getByRole('button', { name: /ปิด/ }).first().click();
        await page.locator('.mrl-cartoon[open]').waitFor({ state: 'detached' });
      }
    }
    assert.match(await page.locator('#kids .mrl-mission').innerText(), /4\/8/);

    // เกาะมารยาท: การ์ตูนบิสมิลลาฮ์ยังเปิดได้ ดาวแยกจากเกาะสำรวจโลก
    await page.goto(`${BASE}/learn/moral`);
    await page.locator('.mrl-hero').waitFor();
    assert.match(await page.locator('#kids .mrl-mission').innerText(), / 0\//);
    await page.locator('#kids .mrl-card').first().click();
    await page.locator('.mrl-cartoon[open]').waitFor();
    await page.waitForTimeout(600);
    await page.locator('.mrl-cartoon[open]').screenshot({ path: `${OUT}/${width}-moral-cartoon.png` });
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log('explore ok');
} finally {
  await browser.close();
}
