// ตรวจเกมเขาวงกตแสง 2.5D ในเบราว์เซอร์จริง
// Run against `npm run start -- --port 3001` (or BASE_URL=http://localhost:3000 for `npm run dev`) using a locally installed Playwright.
// PLAYWRIGHT_MODULE can point to an existing installation without adding dependencies.
// ฉากวาดบน canvas จึงอ่านสถานะจาก data-* บน .lm-stage: data-beads-left, data-robot (x,y บนจอ), data-tile (ความกว้างช่อง px)
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.env.BASE_URL ?? 'http://localhost:3001';
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
await mkdir('output/lightmaze', { recursive: true });
// แนวตั้ง + แนวนอน (แท็บเล็ตแนวนอน 1024/1180, มือถือแนวนอน 844×390)
const sizes = { 360: 844, 390: 844, 768: 1024, 1024: 768, 1180: 820, 844: 390, 1536: 770 };

try {
  for (const width of (process.env.WIDTHS ?? '360,390,768,1024,1180,844,1536').split(',').map(Number)) {
    for (const level of [1, 3]) {
      const page = await browser.newPage({ viewport: { width, height: sizes[width] ?? 844 }, hasTouch: width < 1000 });
      page.on('pageerror', e => errors.push(`${width} L${level}: ${e.message}`));
      page.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) errors.push(`${width} L${level}: ${m.text()}`); });
      await page.goto(`${base}/games/light-maze`, { waitUntil: 'networkidle' });
      if (level > 1) await page.locator('.gc-level-stone').nth(level - 1).click();
      await page.getByRole('button', { name: /ไปเล่นกันเลย/ }).click();
      await page.waitForFunction(() => document.querySelector('.lm-stage')?.dataset.robot);
      const m = await page.evaluate(() => {
        const r = e => { const b = e.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) }; };
        const stage = document.querySelector('.lm-stage'), h = document.querySelector('.gc-game-header h1');
        return {
          scroll: document.documentElement.scrollHeight - innerHeight, hscroll: document.documentElement.scrollWidth - innerWidth,
          stage: r(stage), tile: Number(stage.dataset.tile), beads: Number(stage.dataset.beadsLeft), robot: stage.dataset.robot.split(',').map(Number),
          pad: [...document.querySelectorAll('.lm-pad button')].map(r),
          title: { overflow: h.scrollWidth - h.clientWidth, right: h.getBoundingClientRect().right, sound: document.querySelector('.gc-sound').getBoundingClientRect().left },
        };
      });
      // ปุ่มที่เด็กกด ≥ 64px ทุกขนาด และอยู่ในจอ (AGENTS.md ข้อ 2)
      for (const b of m.pad) assert.ok(b.w >= 64 && b.h >= 64 && b.y + b.h <= (sizes[width] ?? 844), `${width} pad ${JSON.stringify(b)}`);
      assert.ok(m.hscroll <= 0, `${width} horizontal scroll ${m.hscroll}`);
      assert.ok(m.scroll <= 0, `${width} page scrolls ${m.scroll}px`);
      assert.ok(m.title.overflow <= 0 && m.title.right <= m.title.sound, `${width} title clipped`);
      // หุ่นลูกกลมอยู่ในฉาก
      assert.ok(m.robot[0] > 0 && m.robot[0] < m.stage.w && m.robot[1] > 0 && m.robot[1] < m.stage.h, `${width} robot outside stage ${m.robot}`);
      // กดขวาล่าง (+c) ต้องเดินและเก็บเม็ดแสงได้ (กล้องตามหุ่นบนมือถือ ตำแหน่งบนจอจึงอาจแทบไม่ขยับ ดูจากเม็ดแสงแทน)
      await page.getByRole('button', { name: 'ขวาล่าง / Down-right' }).click();
      await page.waitForTimeout(900);
      const after = await page.evaluate(() => Number(document.querySelector('.lm-stage').dataset.beadsLeft));
      assert.ok(after < m.beads, `${width} no light collected`);
      await page.screenshot({ path: `output/lightmaze/level${level}-${width}.png` });
      console.log(width, `L${level}`, JSON.stringify({ scroll: m.scroll, stage: m.stage, tile: m.tile, pad: m.pad[0] }));
      await page.close();
    }
  }
} finally { await browser.close(); }
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
