// Run against `npm run start -- --port 3001` using a locally installed Playwright.
// PLAYWRIGHT_MODULE can point to an existing installation without adding dependencies.
// BASE_URL overrides the server (e.g. http://localhost:3000 for `npm run dev`).
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.env.BASE_URL ?? 'http://localhost:3001';
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
await mkdir('output/puzzle', { recursive: true });

/* ช่องในถาดเอียงเป็นทรงข้าวหลามตัด กล่อง boundingBox จึงใหญ่เกินจริง
   วัด "ความกว้างที่นิ้วแตะได้" เป็นระยะระหว่างจุดกลางของขอบตรงข้าม ทั้งสองแนว บนจอจริง */
const measureCells = () => {
  const plane = document.querySelector('.pz-plane');
  const layer = plane.parentElement.getBoundingClientRect();
  const m = new DOMMatrix(getComputedStyle(plane).transform);
  const at = (x, y) => { const p = m.transformPoint(new DOMPoint(x, y)); return { x: p.x / p.w + layer.left, y: p.y / p.w + layer.top }; };
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  return [...document.querySelectorAll('.pz-cell')].map(cell => {
    const x = cell.offsetLeft, y = cell.offsetTop, w = cell.offsetWidth, h = cell.offsetHeight;
    const tl = at(x, y), tr = at(x + w, y), br = at(x + w, y + h), bl = at(x, y + h);
    return [dist(mid(tl, bl), mid(tr, br)), dist(mid(tl, tr), mid(bl, br))].map(Math.round);
  });
};

// หัวจิ๊กซอว์ของช่องแรก (ขวา) ยื่นเข้าไปในช่องที่สอง: จุดใกล้ปลายหัวบนจอ + ช่องที่ถูกแตะ ณ จุดนั้น
const knobPoint = () => {
  const plane = document.querySelector('.pz-plane'), cell = plane.querySelector('.pz-cell');
  const layer = plane.parentElement.getBoundingClientRect();
  const w = cell.offsetWidth, h = cell.offsetHeight, k = Math.min(w, h);
  const p = new DOMMatrix(getComputedStyle(plane).transform).transformPoint(new DOMPoint(w + k * 0.2, h / 2));
  const x = p.x / p.w + layer.left, y = p.y / p.w + layer.top;
  const hit = document.elementsFromPoint(x, y).find(e => e.closest('[data-drop-id]'));
  return { x, y, id: hit?.closest('[data-drop-id]').dataset.dropId };
};

try {
  for (const width of (process.env.WIDTHS ?? '360,390,768,1536').split(',').map(Number)) {
    const context = await browser.newContext({ viewport: { width, height: width === 1536 ? 770 : width === 768 ? 1024 : 844 }, reducedMotion: width === 360 ? 'reduce' : 'no-preference', hasTouch: width < 800 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const level of [1, 2, 3]) {
      await page.goto(`${base}/games/puzzle`);
      await page.locator('.gc-level-stone').nth(level - 1).click();
      if (level === 1) await page.locator('.gc-adventure-intro').screenshot({ path: `output/puzzle/${width}-intro.png` });
      await page.getByRole('button', { name: /ไปเล่นกันเลย/ }).click();
      await page.locator('.pz-cell').first().waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow ${width}/${level}`);
      // วัดขนาดจริงจาก DOM แล้วพิมพ์ให้บันทึกใน AGENTS.md — เกณฑ์ 64px (ข้อ 2) ตัดสินโดยเจ้าของโปรเจกต์
      const cells = await page.evaluate(measureCells);
      const pieces = [];
      for (const piece of await page.locator('.pz-tray [data-item-id]').all()) {
        const rect = await piece.boundingBox();
        pieces.push(`${Math.round(rect.width)}x${Math.round(rect.height)}`);
        assert.ok(rect.width >= 64 && rect.height >= 64, `piece tap target ${width}/${level}: ${JSON.stringify(rect)}`);
      }
      // หัวจิ๊กซอว์ของช่องแรกยื่นเข้าไปในช่องขวา แตะที่ปลายหัวต้องได้ช่องแรก ไม่ใช่ช่องข้างเคียง
      const knob = await page.evaluate(knobPoint);
      assert.equal(knob.id, 'slot-0', `knob hit-test ${width}/${level}`);
      assert.equal(await page.locator('.gc-image-fallback').count(), 0, 'island image loaded');
      await page.waitForFunction(() => { const img = document.querySelector('.pz-ghost'); return img?.complete && img.naturalWidth > 0; }, null, { timeout: 10000 });
      console.log(`SIZE ${width}px level ${level}: cells ${cells.map(c => c.join('x')).join(' ')} | pieces ${pieces.join(' ')}`);
      await page.locator('.pz-scene').screenshot({ path: `output/puzzle/${width}-level-${level}.png` });
      await page.screenshot({ path: `output/puzzle/${width}-level-${level}-page.png` });

      // วางผิดช่อง → ไม่ติด, คำใบ้ชี้ช่องที่ถูก
      const first = page.locator('.pz-tray [data-item-id]').first();
      const id = await first.getAttribute('data-item-id');
      const index = Number(id.split('-').at(-1));
      const total = await page.locator('.pz-cell').count();
      await first.focus(); await page.keyboard.press('Enter');
      await page.locator(`.pz-cell[data-drop-id="slot-${(index + 1) % total}"]`).focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('.pz-placed[data-part="face"]').count(), 0);
      await page.getByRole('button', { name: /คำใบ้/ }).click();
      assert.equal(await page.locator('.pz-outlines path[data-hint]').count(), 1);

      // แตะจริงที่ปลายหัวจิ๊กซอว์ของช่องแรก (ผ่าน onClick ของ path) ต้องวางชิ้นแรกได้
      await page.locator('.pz-tray [data-item-id="piece-0"]').click();
      const tip = await page.evaluate(knobPoint); // คลิกชิ้นอาจเลื่อนจอ จึงคำนวณพิกัดใหม่
      if (width < 800) await page.touchscreen.tap(tip.x, tip.y); else await page.mouse.click(tip.x, tip.y);
      await page.waitForFunction(() => !document.querySelector('.pz-tray [data-item-id="piece-0"]'));
      assert.equal(await page.locator('.pz-placed[data-part="face"]').count(), 1, `knob tap places piece ${width}/${level}`);

      let placedCount = 1;
      while (await page.locator('.pz-tray [data-item-id]').count()) {
        const piece = page.locator('.pz-tray [data-item-id]').first();
        const pieceId = await piece.getAttribute('data-item-id');
        const slot = `slot-${pieceId.split('-').at(-1)}`;
        if (width === 1536 || (width === 768 && placedCount % 2)) {
          // ลากด้วยเมาส์ไปปล่อยที่จุดกลางของช่องบนจอ (ช่องเอียง จึงคำนวณจาก transform ไม่ใช่จากกล่อง)
          await piece.scrollIntoViewIfNeeded();
          const from = await piece.boundingBox();
          const to = await page.evaluate(s => {
            const cell = document.querySelector(`.pz-cell[data-drop-id="${s}"]`), plane = cell.parentElement;
            const layer = plane.parentElement.getBoundingClientRect();
            const p = new DOMMatrix(getComputedStyle(plane).transform).transformPoint(new DOMPoint(cell.offsetLeft + cell.offsetWidth / 2, cell.offsetTop + cell.offsetHeight / 2));
            return { x: p.x / p.w + layer.left, y: p.y / p.w + layer.top };
          }, slot);
          await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
          await page.mouse.down();
          await page.mouse.move(to.x, to.y, { steps: 15 });
          await page.mouse.up();
          await page.waitForFunction(id => !document.querySelector(`.pz-tray [data-item-id="${id}"]`), pieceId);
        } else {
          await piece.focus(); await page.keyboard.press('Enter');
          await page.locator(`.pz-cell[data-drop-id="${slot}"]`).focus(); await page.keyboard.press('Enter');
        }
        placedCount++;
        if (placedCount === Math.ceil(total / 2)) await page.locator('.pz-scene').screenshot({ path: `output/puzzle/${width}-level-${level}-half.png` });
      }
      await page.locator('.pz-scene').screenshot({ path: `output/puzzle/${width}-level-${level}-done.png` });
      await page.getByRole('heading', { name: 'เก่งมาก ผ่านด่านแล้ว!' }).waitFor();
      console.log(`PASS ${width}px level ${level}: retry, hint, ${width === 1536 ? 'pointer drag' : width === 768 ? 'keyboard + drag' : 'keyboard'}, completion`);
    }
    await context.close();
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
