// Run against `npm run start -- --port 3001` using a locally installed Playwright.
// PLAYWRIGHT_MODULE can point to an existing installation without adding dependencies.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
// channel:'chrome' = Chrome ของเครื่องจริง ซึ่งถอดรหัส MP3 ได้
// Chromium ที่มากับ Playwright ไม่มี codec ที่มีสิทธิบัตร จะได้ทดสอบแต่ทางสำรองเท่านั้น
const realAudio = process.env.SHAPE_BROWSER !== 'chromium';
const browser = await chromium.launch({
  headless: true,
  channel: realAudio ? 'chrome' : undefined,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE,
});
const errors = [];
const base = 'http://localhost:3001';
await mkdir('output/shape-intro', { recursive: true });

/* เข้าเกมด้วยการกดจากหน้ารวมเกม = ทางที่เด็กใช้จริง และเป็นทางเดียวที่เบราว์เซอร์ยอมให้เสียงเล่นเอง */
async function enterFromHub(page) {
  await page.goto(`${base}/games`);
  await page.getByRole('link', { name: /รูปทรง/ }).first().click();
  await page.locator('.gc-voice-intro').waitFor();
}

try {
  for (const width of [320, 390, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: width === 320 ? 'reduce' : 'no-preference', hasTouch: width < 800 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${width}: ${error.message}`));
    await enterFromHub(page);

    // คลื่นเสียงขึ้นเฉพาะตอนเสียงสอนเล่นได้จริง
    // ถ้าไฟล์เล่นไม่ได้ โค้ดจะข้ามไปโชว์ปุ่มทันที ซึ่งผ่านเทสต์อื่นหมดโดยที่ไม่มีใครรู้ว่าเสียงหาย
    if (realAudio) await page.locator('.gc-voice-wave').waitFor({ timeout: 5000 });

    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow ${width}`);

    // ข้อความที่เคยรกต้องหายไปจากหน้าแนะนำของเกมนี้
    for (const gone of ['พร้อมออกผจญภัยไหม', 'ดูขอบรูป แล้วหาช่องที่พอดีกัน', 'แตะชิ้น', 'ห้องของเล่นรูปทรง']) {
      assert.equal(await page.getByText(gone, { exact: false }).count(), 0, `ยังมีข้อความ "${gone}" ที่ ${width}`);
    }

    /*
      บนจอต้องไม่เหลือตัวหนังสือเลย นอกจากป้ายบนปุ่มเริ่มเล่น
      แต่คำสั่งต้องยังอยู่ในหน้าเว็บให้เครื่องอ่านหน้าจอ = มีหัวข้อที่ sr-only ซ่อนไว้
    */
    const heading = page.getByRole('heading', { name: /วางรูปทรงให้ตรงช่อง/ });
    assert.equal(await heading.count(), 1, `คำสั่งต้องยังเป็นหัวข้อให้ screen reader ที่ ${width}`);
    const headingBox = await heading.boundingBox();
    assert.ok(headingBox.width <= 2 && headingBox.height <= 2, `หัวข้อต้องถูกซ่อนจากสายตา ที่ ${width}: ${JSON.stringify(headingBox)}`);

    // ภาพสาธิต: มือขาว เส้นลาก และวงแหวนเป้าหมาย ต้องอยู่ครบ เพราะเป็นตัวแทนคำอธิบายทั้งหมดแล้ว
    for (const part of ['.gc-demo-hand', '.gc-demo-path', '.gc-demo-target']) {
      assert.equal(await page.locator(part).count(), 1, `ไม่มี ${part} ที่ ${width}`);
    }
    // มือต้องอยู่ในกรอบภาพเกาะ ไม่หลุดออกไปข้างนอก
    const island = await page.locator('.gc-adventure-island').boundingBox();
    const hand = await page.locator('.gc-demo-hand').boundingBox();
    assert.ok(hand.x >= island.x - 1 && hand.x + hand.width <= island.x + island.width + 1, `มือสาธิตหลุดกรอบที่ ${width}`);

    /*
      ปุ่มเริ่มเล่นต้องกดได้ตั้งแต่วินาทีแรก ทั้งที่หุ่นยนต์ยังพูดไม่จบ
      เด็กที่เล่นเกมนี้เป็นแล้วจะได้ข้ามคำอธิบายไปเล่นเลย ไม่ต้องยืนรอฟังซ้ำทุกครั้ง
      (ถึงตรงนี้ยังอยู่ในช่วงที่คลื่นเสียงขึ้นอยู่ คือหุ่นยนต์กำลังพูด)
    */
    const start = page.getByRole('button', { name: /เริ่มเล่น/ });
    await start.waitFor({ state: 'visible', timeout: 2000 });
    assert.ok(await start.isEnabled(), `ปุ่มเริ่มเล่นต้องกดได้ระหว่างหุ่นยนต์พูด ที่ ${width}`);
    const rect = await start.boundingBox();
    assert.ok(rect.height >= 64, `64px start button ${width}: ${rect.height}`);
    const replay = await page.locator('.gc-voice-replay').boundingBox();
    assert.ok(replay.height >= 64 && replay.width >= 64, `64px replay ${width}: ${JSON.stringify(replay)}`);
    await page.screenshot({ path: `output/shape-intro/${width}-ready.png`, fullPage: true });

    // กดข้ามขณะหุ่นยนต์ยังพูดอยู่ — ต้องเข้าเกมได้ และเสียงสอนต้องหยุด ไม่พูดทับตอนเล่น
    await start.click();
    await page.locator('.gc-board').waitFor();
    if (realAudio) {
      const talking = await page.evaluate(() => [...document.querySelectorAll('audio')].some(a => !a.paused));
      assert.equal(talking, false, `เสียงสอนต้องหยุดเมื่อกดเริ่มเล่น ที่ ${width}`);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow playing ${width}`);

    // หยอดสี่เหลี่ยมจัตุรัสลงหลุมของมัน — ชิ้นที่เคยเป็นลูกบาศก์แล้วเด็กจับคู่กับหลุมไม่ถูก
    await page.locator('[data-item-id="square"]').click();
    await page.locator('[data-drop-id="square"]').click();
    await page.getByText('1 / 5').waitFor({ timeout: 5000 });
    await context.close();
  }

  /*
    ปิดเสียงอยู่: ไม่มีเสียงสอนแน่นอน ปุ่มเริ่มเล่นจึงต้องกดได้ทันที
    เป็นกรณีที่พังแล้วเด็กติดอยู่หน้าเดิมโดยไม่มีทางไปต่อ จึงต้องมีเทสต์
  */
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`muted: ${error.message}`));
    // ปิดเสียงไว้ก่อนเข้าเว็บ เหมือนเด็กที่เคยกดปิดไว้รอบก่อน (ค่าเก็บใน localStorage)
    await page.addInitScript(() => localStorage.setItem('little-ummah:sound', 'off'));
    await page.goto(`${base}/games`);
    await page.getByRole('link', { name: /รูปทรง/ }).first().click();
    await page.locator('.gc-voice-intro').waitFor();
    await page.getByRole('button', { name: /เริ่มเล่น/ }).waitFor({ state: 'visible', timeout: 5000 });
    assert.equal(await page.locator('.gc-voice-wave').count(), 0, 'ปิดเสียงแล้วต้องไม่มีคลื่นเสียง');
    await context.close();
  }

  /*
    เปิดหน้าเกมตรงๆ (พิมพ์ URL / รีเฟรช): เบราว์เซอร์บล็อกเสียงอัตโนมัติ
    ปุ่มต้องโผล่ทันทีเช่นกัน แล้วเด็กกดปุ่มลำโพงฟังวิธีเล่นเองได้
  */
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`direct: ${error.message}`));
    await page.goto(`${base}/games/shape-match`);
    await page.getByRole('button', { name: /เริ่มเล่น/ }).waitFor({ state: 'visible', timeout: 10000 });
    await context.close();
  }

  // เกมพี่น้องที่ยังไม่เปิด voiceIntro ต้องเหมือนเดิมทุกประการ
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`sibling: ${error.message}`));
    await page.goto(`${base}/games/color-match`);
    await page.locator('.gc-adventure-intro').waitFor();
    await page.getByText('พร้อมออกผจญภัยไหม', { exact: false }).waitFor();
    await page.getByRole('button', { name: /ไปเล่นกันเลย/ }).waitFor();
    assert.equal(await page.locator('.gc-voice-intro').count(), 0, 'color-match ต้องไม่ใช้หน้าแนะนำแบบเสียง');
    await context.close();
  }

  assert.deepEqual(errors, [], 'no page errors');
  console.log('shape intro browser checks passed');
} finally {
  await browser.close();
}
