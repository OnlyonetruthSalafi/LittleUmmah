// เปิด server ก่อน แล้วรัน node scripts/check-classroom-browser.mjs [baseUrl] (หรือ BASE_URL; default :3104)
// PLAYWRIGHT_MODULE can point to an existing installation without adding dependencies.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = (process.argv[2] ?? process.env.BASE_URL ?? 'http://localhost:3104').replace(/\/+$/, '');
const out = process.env.BROWSER_CHECK_OUT ?? 'output/p0-3/classroom';
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
await mkdir(out, { recursive: true });
try {
  for (const width of [320, 390, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: width === 320 ? 'reduce' : 'no-preference', hasTouch: width < 800 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${width}: ${error.message}`));
    await page.goto(`${base}/learn/arabic`);
    await page.locator('.cls-stage').waitFor();

    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow ${width}`);

    // ตัวอักษรบนกระดานต้องเป็นข้อความจริง ไม่ใช่ภาพ (AGENTS.md ข้อ 1.5)
    assert.equal(await page.locator('.cls-board-text').innerText(), 'ا', `alif on board ${width}`);

    // ปุ่มที่เด็กกดต้องสูงอย่างน้อย 64px (ข้อ 2)
    for (const button of await page.getByRole('button').all()) {
      const rect = await button.boundingBox();
      if (!rect) continue;
      assert.ok(rect.width >= 64 && rect.height >= 64, `64px target ${width}: ${await button.innerText()} = ${rect.width}×${rect.height}`);
    }

    await page.locator('.cls-stage').screenshot({ path: `${out}/${width}-idle.png` });

    // วัย 3-6: เส้นทางเดียวครบ 28 ตัว ไม่มีแถวเลือกชุด · อะลิฟอยู่ขวาสุดของแถวแรก (อ่านขวาไปซ้าย)
    assert.equal(await page.locator('.cls-units').count(), 0, `no set picker for kids ${width}`);
    assert.equal(await page.locator('.cls-plaque').count(), 28, `28 plaques ${width}`);
    const [first, second] = await page.locator('.cls-plaque').evaluateAll(els => els.slice(0, 2).map(el => el.getBoundingClientRect().left));
    assert.ok(first > second, `alif is right of ba ${width}`);
    await page.locator('.cls-path').screenshot({ path: `${out}/${width}-path.png` });

    // เริ่มเรียน -> ต้องเดินไปถึงจังหวะ "ตาหนูแล้ว" เอง แม้เบราว์เซอร์นี้เล่น mp3 ไม่ได้
    await page.getByRole('button', { name: /เริ่มเรียน/ }).click();
    await page.getByText('ตาหนูแล้ว').waitFor({ timeout: 20000 });
    await page.locator('.cls-turn-ring').waitFor();
    await page.screenshot({ path: `${out}/${width}-echo.png`, fullPage: width === 390 });

    // ข้ามไปบทถัดไปด้วยปุ่ม แล้วกระดานต้องเปลี่ยนตัวอักษรตาม
    await page.getByRole('button', { name: /ตัวถัดไป/ }).click();
    await page.waitForFunction(() => document.querySelector('.cls-board-text').textContent === 'ب');

    // สลับไปวัย 7+ แล้วกระดานต้องเป็นวลี ไม่ใช่ตัวอักษรเดี่ยว
    await page.getByRole('button', { name: /7 ปีขึ้นไป/ }).click();
    await page.waitForFunction(() => document.querySelector('.cls-board-text').textContent.includes('السَّلَامُ'));
    assert.equal(await page.locator('.cls-board-text').getAttribute('data-size'), 'phrase', `phrase board ${width}`);
    await page.locator('.cls-stage').screenshot({ path: `${out}/${width}-juniors.png` });

    // วลียาวของวัย 7+ ต้องไม่ถูกกระดานตัดหาย — ตัวอักษรอาหรับคือตัวเนื้อหา ขาดไปแม้ครึ่งตัวก็สอนผิด
    for (const [unit, title] of [['มารยาทและคำทักทาย', 'กล่าวสลาม'], ['มารยาทและคำทักทาย', 'ขอบคุณแบบมุสลิม'], ['ตัวเลข', 'นับเลข 1 ถึง 5'], ['ตัวเลข', 'นับเลข 6 ถึง 10'], ['คำศัพท์', 'คำศัพท์รอบตัว']]) {
      await page.locator('.cls-units').getByRole('button', { name: new RegExp(unit) }).click();
      await page.getByRole('button', { name: new RegExp(title) }).click();
      await page.locator('.cls-board-text').waitFor();
      const fits = await page.evaluate(() => {
        const text = document.querySelector('.cls-board-text > span');
        const face = document.querySelector('.cls-board-face');
        const a = text.getBoundingClientRect();
        const b = face.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(text);
        const glyphs = range.getBoundingClientRect();
        return [a, glyphs].every(r => r.top >= b.top - 1 && r.bottom <= b.bottom + 1 && r.left >= b.left - 1 && r.right <= b.right + 1);
      });
      assert.ok(fits, `board text clipped at ${width}: ${title}`);
    }
    await page.locator('.cls-stage').screenshot({ path: `${out}/${width}-longest.png` });

    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow after play ${width}`);
    await context.close();
  }

  // /kids และ /juniors ลิงก์มาพร้อม anchor ห้องเรียนต้องเปิดที่ช่วงวัยนั้นเลย
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`anchor: ${error.message}`));
    await page.goto(`${base}/learn/arabic#juniors`);
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
    await page.goto(`${base}/learn/arabic`);

    // เริ่มที่บทสุดท้ายของวัยเล็ก เพื่อให้ได้ครบวงจร สอน -> อ่านนำ -> เว้นจังหวะ -> ชม -> จบคาบ ในเวลาไม่นาน
    // วัย 3-6 เป็นเส้นทางเดียว อะลิฟ → ยาอ์ กดแผ่นป้ายยาอ์ (ตัวที่ 28) แล้วต้องจบหลักสูตรพร้อมท่าฉลอง
    await page.locator('.cls-plaque', { hasText: 'ยาอ์' }).click();
    await page.getByText('ตาหนูแล้ว').waitFor({ timeout: 40000 });
    await page.getByText(/^เก่งมาก! เรียนครบ 28 ตัว/).waitFor({ timeout: 40000 });
    assert.match(await page.locator('.cls-teacher').getAttribute('src'), /celebrate/);
    assert.equal(await page.locator('.cls-plaque', { hasText: 'ยาอ์' }).locator('.cls-plaque-star').count(), 1, 'ยาอ์ ได้ดาวเรียนแล้ว');

    const { synth, played } = await page.evaluate(() => ({ synth: window.__synth, played: window.__played }));
    assert.equal(synth, 0, `ต้องไม่ตกไปใช้เสียงสังเคราะห์เลย แต่ถูกเรียก ${synth} ครั้ง — แปลว่าไฟล์ MP3 เล่นไม่ได้`);
    assert.ok(played >= 4, `ต้องเล่นคลิปครูอย่างน้อย 4 คลิป แต่เล่นไป ${played}`);
    await context.close();
  } else {
    console.log('ข้ามการตรวจเสียงจริง (CLASSROOM_BROWSER=chromium)');
  }
  assert.deepEqual(errors, [], 'no page errors');
  console.log('classroom browser checks passed');
} catch (error) {
  for (const context of browser.contexts()) for (const page of context.pages()) {
    await page.screenshot({ path: `${out}/failure-${page.viewportSize()?.width}.png`, fullPage: true }).catch(() => {});
  }
  throw error;
} finally {
  await browser.close();
}
