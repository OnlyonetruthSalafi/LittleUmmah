// ตรวจตู้หนังสือเกาะเรื่องเล่าในเบราว์เซอร์จริง: ขนาดช่อง, ไม่ล้นจอ, หนังสือลอยแล้วเข้าหน้านิทานและเล่นเอง
// รันหลังเปิด server: node scripts/check-bookshelf-browser.mjs [baseUrl] (หรือ BASE_URL; ค่าเริ่มต้น http://localhost:3104)
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = (process.argv[2] ?? process.env.BASE_URL ?? 'http://localhost:3104').replace(/\/+$/, '');
const out = process.env.BROWSER_CHECK_OUT ?? 'output/p0-3/bookshelf';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
const countPlays = () => {
  window.__plays = [];
  window.__spoken = [];
  const speak = window.speechSynthesis.speak.bind(window.speechSynthesis);
  window.speechSynthesis.speak = function (utterance) {
    window.__spoken.push(utterance.text);
    return speak(utterance);
  };
  const play = Audio.prototype.play;
  Audio.prototype.play = function () {
    window.__plays.push(new URL(this.src).pathname);
    return play.call(this);
  };
};
try {
  for (const [width, height] of [[360, 780], [640, 900], [700, 900], [844, 390], [768, 1024], [1280, 720]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 800 });
    await context.addInitScript(countPlays);
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`${width}: ${e.message}`));
    await page.goto(`${base}/learn/stories`);
    const cells = page.locator('[data-shelf="quran"] .bs-shelf:visible .bs-cell');
    await cells.first().waitFor();
    await page.waitForTimeout(600);
    assert.equal(await cells.count(), 10, `10 books ${width}`);
    for (const [slug, age] of [['garden-owners', 'kids'], ['two-gardens', 'juniors']]) {
      const book = page.locator(`[data-shelf="quran"] .bs-shelf:visible .bs-cell[href="/learn/stories/${slug}"]`);
      assert.equal(await book.count(), 1, `${slug} available`);
      const section = book.locator('xpath=ancestor::section[1]');
      const labelId = await section.getAttribute('aria-labelledby');
      const heading = await page.locator(`[id="${labelId}"]`).innerText();
      assert.match(heading, age === 'kids' ? /3.?6/ : /7/, `${slug} age zone`);
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow ${width}`);
    for (const cell of await cells.all()) {
      const r = await cell.boundingBox();
      assert.ok(r.width >= 64 && r.height >= 64, `64px cell ${width}: ${JSON.stringify(r)}`);
    }
    await page.locator('[data-shelf="quran"]').screenshot({ path: `${out}/${width}-shelf.png` });

    // ตู้ที่สอง เรื่องจริงจากหะดีษ (9 พ.ย. 2026): 10 เล่ม (วัย 3-6 = 6, 7+ = 4) ช่องละ ≥ 64px ทุกเล่มเปิดได้หรือขึ้น "เร็วๆ นี้"
    const hadith = page.locator('[data-shelf="hadith"] .bs-shelf:visible .bs-cell');
    assert.equal(await hadith.count(), 10, `10 hadith books ${width}`);
    assert.match(await page.locator('[data-shelf="hadith"] .bs-shelf:visible .bs-plaque').innerText(), /หะดีษ/, 'hadith plaque');
    for (const cell of await hadith.all()) {
      const r = await cell.boundingBox();
      assert.ok(r.width >= 64 && r.height >= 64, `64px hadith cell ${width}: ${JSON.stringify(r)}`);
      const open = (await cell.getAttribute('href')) !== null;
      assert.ok(open || (await cell.getAttribute('aria-disabled')) === 'true', 'hadith book open or pending');
    }
    await page.locator('[data-shelf="hadith"]').screenshot({ path: `${out}/${width}-hadith-shelf.png` });

    // ช่องที่กดได้ต้องไม่ทับกัน และแตะตรงไหนของสติ๊กเกอร์ชื่อก็เปิดเล่มนั้น (Codex review INT-1110, 10 พ.ย. 2026)
    const tap = await page.evaluate(() => {
      const bad = [];
      for (const shelf of document.querySelectorAll('[data-shelf] .bs-shelf')) {
        const cells = [...shelf.querySelectorAll('.bs-cell')].filter((c) => c.getBoundingClientRect().width);
        const box = cells.map((c) => c.getBoundingClientRect());
        for (let i = 0; i < box.length; i++) for (let j = i + 1; j < box.length; j++) {
          const a = box[i], b = box[j];
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) bad.push(`overlap ${i}/${j}`);
        }
        for (const cell of cells) {
          cell.scrollIntoView({ block: 'center' });
          const r = cell.querySelector('.bs-label').getBoundingClientRect();
          for (const fx of [0.15, 0.5, 0.85]) for (const fy of [0.25, 0.75]) {
            const hit = document.elementFromPoint(r.left + r.width * fx, r.top + r.height * fy);
            if (!hit || !cell.contains(hit)) bad.push(`label miss ${cell.textContent.trim().slice(0, 16)}`);
          }
        }
      }
      return [...new Set(bad)];
    });
    assert.deepEqual(tap, [], `tap areas ${width}`);

    // มีนิทานครบ 10 เรื่องแล้ว ป้ายใต้ตู้ถูกแทนด้วยเสียงอ่านชื่อเมื่อโฟกัส
    // ยังตรวจ placeholder หากเพิ่มเรื่องที่ยังไม่พร้อมในอนาคต
    const pending = page.locator('[data-shelf="quran"] .bs-shelf:visible .bs-cell[aria-disabled="true"]');
    const placeholder = pending.first();
    const feedbackBook = await placeholder.count() ? placeholder : cells.first();
    await feedbackBook.focus();
    if (await placeholder.count()) await placeholder.click({ force: true });
    assert.match(page.url(), /\/learn\/stories$/);
    const label = (await feedbackBook.locator('.bs-label').textContent()).replace(/\s*เร็วๆ นี้\s*$/, '').trim();
    await page.waitForFunction((title) => window.__spoken.some(text => text.includes(title)), label);
    assert.ok(await page.evaluate(title => window.__spoken.some(text => text.includes(title)), label), 'focus reads book title');
    assert.equal(await page.locator('[data-shelf="quran"] .bs-shelf:visible a.bs-cell').count() + await pending.count(), 10, 'every book is readable or marked pending');

    // หนังสือนูห์: ลอยออกมากลางจอ แล้วเข้าหน้านิทานและเริ่มเล่นเอง
    await cells.first().scrollIntoViewIfNeeded();
    await cells.first().click();
    await page.waitForTimeout(450);
    assert.equal(await page.locator('.bs-fly').count(), 1, 'book flying');
    await page.screenshot({ path: `${out}/${width}-flying.png` });
    await page.waitForURL(/\/learn\/stories\/nuh$/, { timeout: 5000 });
    await page.getByRole('button', { name: /พัก/ }).waitFor({ timeout: 5000 });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${width}-arrived.png` });
    const plays = await page.evaluate(() => window.__plays.filter((p) => p.includes('/audio/th/stories/')));
    assert.ok(plays[0]?.endsWith('/p00.mp3'), `title narration starts: ${plays}`);
    await context.close();
  }

  // ปิดการเคลื่อนไหว: ไม่ลอย ไปหน้านิทานทันที
  const rm = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const p = await rm.newPage();
  await p.goto(`${base}/learn/stories`);
  await p.locator('[data-shelf="quran"] .bs-shelf:visible .bs-cell').first().click();
  await p.waitForURL(/\/learn\/stories\/nuh$/, { timeout: 5000 });
  assert.equal(await p.locator('.bs-fly').count(), 0);
  await rm.close();

  // เปิดหน้านิทานตรงๆ (ไม่ได้มาจากตู้) ต้องไม่เล่นเอง
  const direct = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const d = await direct.newPage();
  await d.goto(`${base}/learn/stories/nuh`);
  await d.getByRole('button', { name: /เล่นนิทาน/ }).waitFor();
  await direct.close();
} catch (error) {
  for (const context of browser.contexts()) for (const page of context.pages()) {
    await page.screenshot({ path: `${out}/failure-${page.viewportSize()?.width}.png`, fullPage: true }).catch(() => {});
  }
  throw error;
} finally {
  await browser.close();
}
assert.deepEqual(errors, []);
console.log('bookshelf browser check passed; screenshots in', out);
