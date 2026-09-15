// Run against `npm run start -- --port 3001` using a locally installed Playwright.
// PLAYWRIGHT_MODULE can point to an existing installation without adding dependencies.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
// channel:'chrome' = Google Chrome ของเครื่องจริง ซึ่งถอดรหัส MP3 ได้
// Chromium ที่มากับ Playwright ไม่มี codec ที่มีสิทธิบัตร ถ้าใช้ตัวนั้นจะได้ทดสอบแต่ "ทางสำรอง" เท่านั้น
// ไม่มี Chrome ในเครื่อง: ตั้ง CLASSROOM_BROWSER=chromium แล้วข้ามการตรวจเสียงจริง
const realAudio = process.env.CLASSROOM_BROWSER !== 'chromium';
const browser = await chromium.launch({
  headless: true,
  channel: realAudio ? 'chrome' : undefined,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE,
});
const errors = [];
await mkdir('output/classroom', { recursive: true });
try {
  for (const width of [320, 390, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: width === 320 ? 'reduce' : 'no-preference', hasTouch: width < 800 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${width}: ${error.message}`));
    await page.goto('http://localhost:3001/learn/arabic');
    await page.locator('.cls-stage').waitFor();

    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow ${width}`);

    // ตัวอักษรบนกระดานต้องเป็นข้อความจริง ไม่ใช่ภาพ (AGENTS.md ข้อ 1.5)
    assert.equal(await page.locator('.cls-board-text').innerText(), 'ا', `alif on board ${width}`);

    // ปุ่มที่เด็กกดต้องสูงอย่างน้อย 64px (ข้อ 2)
    for (const button of await page.getByRole('button').all()) {
      const rect = await button.boundingBox();
      if (!rect) continue;
      assert.ok(rect.height >= 64, `64px target ${width}: ${await button.innerText()} = ${rect.height}`);
    }

    await page.locator('.cls-stage').screenshot({ path: `output/classroom/${width}-idle.png` });

    // เริ่มเรียน -> ต้องเดินไปถึงจังหวะ "ตาหนูแล้ว" เอง แม้เบราว์เซอร์นี้เล่น mp3 ไม่ได้
    await page.getByRole('button', { name: /เริ่มเรียน/ }).click();
    await page.getByText('ตาหนูแล้ว').waitFor({ timeout: 20000 });
    await page.locator('.cls-turn-ring').waitFor();
    await page.screenshot({ path: `output/classroom/${width}-echo.png`, fullPage: width === 390 });

    // ข้ามไปบทถัดไปด้วยปุ่ม แล้วกระดานต้องเปลี่ยนตัวอักษรตาม
    await page.getByRole('button', { name: /ตัวถัดไป/ }).click();
    await page.waitForFunction(() => document.querySelector('.cls-board-text').textContent === 'ب');

    // สลับไปวัย 7+ แล้วกระดานต้องเป็นวลี ไม่ใช่ตัวอักษรเดี่ยว
    await page.getByRole('button', { name: /7 ปีขึ้นไป/ }).click();
    await page.waitForFunction(() => document.querySelector('.cls-board-text').textContent.includes('السَّلَامُ'));
    assert.equal(await page.locator('.cls-board-text').getAttribute('data-size'), 'phrase', `phrase board ${width}`);
    await page.locator('.cls-stage').screenshot({ path: `output/classroom/${width}-juniors.png` });

    // วลียาวของวัย 7+ ต้องไม่ถูกกระดานตัดหาย — ตัวอักษรอาหรับคือตัวเนื้อหา ขาดไปแม้ครึ่งตัวก็สอนผิด
    for (const title of ['สลาม', 'ขอบคุณ', 'นับเลข', 'คำศัพท์']) {
      await page.getByRole('button', { name: new RegExp(title) }).click();
      await page.locator('.cls-board-text').waitFor();
      const fits = await page.evaluate(() => {
        const text = document.querySelector('.cls-board-text');
        const face = document.querySelector('.cls-board-face');
        const a = text.getBoundingClientRect();
        const b = face.getBoundingClientRect();
        return a.top >= b.top - 1 && a.bottom <= b.bottom + 1 && a.left >= b.left - 1 && a.right <= b.right + 1;
      });
      assert.ok(fits, `board text clipped at ${width}: ${title}`);
    }
    await page.locator('.cls-stage').screenshot({ path: `output/classroom/${width}-longest.png` });

    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow after play ${width}`);
    await context.close();
  }

  // /kids และ /juniors ลิงก์มาพร้อม anchor ห้องเรียนต้องเปิดที่ช่วงวัยนั้นเลย
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`anchor: ${error.message}`));
    await page.goto('http://localhost:3001/learn/arabic#juniors');
    await page.waitForFunction(() => document.querySelector('.cls-board-text')?.getAttribute('data-size') === 'phrase');
    assert.equal(await page.getByRole('button', { name: /7 ปีขึ้นไป/ }).getAttribute('aria-pressed'), 'true');
    await context.close();
  }

  /*
    เดินบทเรียนจริงด้วยไฟล์ MP3 ของครู ไม่ใช่ทางสำรอง
    ถ้า MP3 เล่นไม่ได้ โค้ดจะตกไปใช้เสียงสังเคราะห์แล้วจับเวลาแทน ซึ่งเดินหน้าได้เหมือนกัน
    เทสต์จึงต้องนับว่าเสียงสังเคราะห์ถูกเรียกหรือไม่ ไม่งั้นทางหลักจะไม่เคยถูกทดสอบเลย
  */
  if (realAudio) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`audio: ${error.message}`));
    await page.addInitScript(() => {
      window.__synth = 0;
      window.__played = 0;
      const speak = window.speechSynthesis?.speak;
      if (speak) window.speechSynthesis.speak = function (...args) { window.__synth += 1; return speak.apply(this, args); };
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function (...args) { window.__played += 1; return play.apply(this, args); };
    });
    await page.goto('http://localhost:3001/learn/arabic');

    // เริ่มที่บทสุดท้ายของวัยเล็ก เพื่อให้ได้ครบวงจร สอน -> อ่านนำ -> เว้นจังหวะ -> ชม -> จบคาบ ในเวลาไม่นาน
    await page.getByRole('button', { name: /ษาอ์/ }).click();
    await page.getByText('ตาหนูแล้ว').waitFor({ timeout: 40000 });
    await page.getByText('เรียนครบทุกบทแล้ว').waitFor({ timeout: 40000 });

    const { synth, played } = await page.evaluate(() => ({ synth: window.__synth, played: window.__played }));
    assert.equal(synth, 0, `ต้องไม่ตกไปใช้เสียงสังเคราะห์เลย แต่ถูกเรียก ${synth} ครั้ง — แปลว่าไฟล์ MP3 เล่นไม่ได้`);
    assert.ok(played >= 4, `ต้องเล่นคลิปครูอย่างน้อย 4 คลิป แต่เล่นไป ${played}`);
    await context.close();
  } else {
    console.log('ข้ามการตรวจเสียงจริง (CLASSROOM_BROWSER=chromium)');
  }
  assert.deepEqual(errors, [], 'no page errors');
  console.log('classroom browser checks passed');
} finally {
  await browser.close();
}
