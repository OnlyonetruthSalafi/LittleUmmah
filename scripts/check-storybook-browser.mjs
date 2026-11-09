// ตรวจหนังสือนิทานในเบราว์เซอร์จริง: พลิกหน้า, เล่นอัตโนมัติ, ขนาดปุ่ม, ไม่ล้นจอ
// เปิด server ก่อน: node scripts/check-storybook-browser.mjs [baseUrl] [--story=<slug>] (หรือ BASE_URL; default :3104, nuh)
// PLAYWRIGHT_MODULE ชี้ไปที่ playwright ที่ติดตั้งไว้แล้วได้ ไม่ต้องเพิ่ม dependency
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith('--')) ?? process.env.BASE_URL ?? 'http://localhost:3104').replace(/\/+$/, '');
const slug = args.find((a) => a.startsWith('--story='))?.slice('--story='.length) ?? 'nuh';
// ไฟล์ข้อมูลนิทานมี export เดียว (import แค่ type) Node จึงโหลด .ts ได้ตรงๆ
// เล่มตู้หะดีษอยู่ใน data/hadith/ (9 พ.ย. 2026)
const { existsSync } = await import('node:fs');
const dataFile = existsSync(new URL(`../src/features/stories/data/${slug}.ts`, import.meta.url)) ? `${slug}.ts` : `hadith/${slug}.ts`;
const story = Object.values(await import(`../src/features/stories/data/${dataFile}`))[0];
const url = `${base}/learn/stories/${slug}`;
const snippet = (i) => story.pages[i].th.slice(0, 12);
const out = process.env.BROWSER_CHECK_OUT ?? `output/p0-3/storybook/${slug}`;
// เล่ม deluxe ใช้ CurlLeaf แทนแผ่นเดิม และเปิดปก/พัก/พลิกกระดาษรวมสองจังหวะ
const leaf = story.deluxe ? '.sb-curl' : '.sb-leaf';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
try {
  for (const [width, height] of [[360, 780], [844, 390], [768, 1024], [1280, 720]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 800 });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`${width}: ${e.message}`));
    await page.goto(url);
    if (width === 360) {
      // A successful play() call can still fall back after a corrupt MP3. Decode every clip explicitly.
      const clips = ['p00', ...story.pages.map(p => p.image.split('/').pop().replace(/\.\w+$/, ''))];
      const audio = await page.evaluate(async ({ slug, clips }) => {
        const ctx = new AudioContext();
        try {
          const result = [];
          for (const key of clips) {
            const response = await fetch(`/audio/th/stories/${slug}/${key}.mp3`);
            if (!response.ok) throw new Error(`${key}: HTTP ${response.status}`);
            const decoded = await ctx.decodeAudioData(await response.arrayBuffer());
            result.push({ key, duration: decoded.duration, channels: decoded.numberOfChannels });
          }
          return result;
        } finally { await ctx.close(); }
      }, { slug, clips });
      for (const clip of audio) {
        assert.ok(clip.duration > 0.5, `${clip.key}: real audio duration`);
        assert.equal(clip.channels, 1, `${clip.key}: mono`);
      }
      console.log('decoded narration', JSON.stringify(audio));
    }
    await page.locator('.sb-book').waitFor();
    await page.waitForTimeout(800);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow ${width}`);
    assert.equal(await page.locator('.sb-root button').count(), 3, 'three story controls');
    for (const btn of await page.locator('.sb-root button').all()) {
      const r = await btn.boundingBox();
      assert.ok(r.width >= 64 && r.height >= 64, `64px ${width}: ${JSON.stringify(r)}`);
    }
    await page.screenshot({ path: `${out}/${width}-cover.png`, fullPage: true });

    // เปิดปกด้วยปุ่มถัดไป แล้วถ่ายกลางการพลิก
    await page.getByRole('button', { name: 'หน้าถัดไป' }).click();
    await page.waitForTimeout(450);
    assert.equal(await page.locator(leaf).count(), 1, 'leaf visible while turning');
    await page.screenshot({ path: `${out}/${width}-opening.png` });
    await page.locator('.sb-book[data-turning]').waitFor({ state: 'detached' });
    assert.equal(await page.locator(leaf).count(), 0, 'leaf removed after turn');
    assert.ok((await page.locator('.sb-text').innerText()).includes(snippet(0)), 'page 1 text');
    await page.screenshot({ path: `${out}/${width}-p01.png`, fullPage: true });

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/${width}-turning-p02.png` });
    await page.locator('.sb-book[data-turning]').waitFor({ state: 'detached' });
    assert.ok((await page.locator('.sb-text').innerText()).includes(snippet(1)), 'page 2 text');
    await page.screenshot({ path: `${out}/${width}-p02.png`, fullPage: true });
    for (let i = 2; i < story.pages.length; i++) {
      await page.getByRole('button', { name: 'หน้าถัดไป' }).click();
      await page.waitForTimeout(1400);
      assert.ok((await page.locator('.sb-text').innerText()).includes(snippet(i)), `page ${i + 1} text`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `page ${i + 1} overflow ${width}`);
      await page.screenshot({ path: `${out}/${width}-p${String(i + 1).padStart(2, '0')}.png`, fullPage: true });
    }
    await context.close();
  }

  // เล่นอัตโนมัติ — นับการเล่นเสียงทุกครั้ง เพราะ new Audio() ไม่อยู่ใน DOM ให้ตรวจ
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addInitScript(() => {
    window.__plays = [];
    const play = Audio.prototype.play;
    Audio.prototype.play = function () {
      window.__plays.push(new URL(this.src).pathname);
      return play.call(this);
    };
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(`auto: ${e.message}`));
  const narr = () => page.evaluate(() => window.__plays.filter((p) => p.includes('/audio/th/stories/')));
  await page.goto(url);
  await page.getByRole('button', { name: /เล่นนิทาน/ }).click();
  await page.getByText(`หน้า 1 / ${story.pages.length}`).waitFor({ timeout: 12000 });
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /พัก/ }).click();
  const atPause = (await narr()).length;
  await page.waitForTimeout(2000);
  assert.equal((await narr()).length, atPause, 'pause must not restart narration');
  assert.equal(await page.evaluate(() => [...document.querySelectorAll('audio')].length), 0);

  // เล่นต่อจนจบเล่ม: ทุกหน้าต้องพากย์ครั้งเดียว ตามลำดับ
  await page.getByRole('button', { name: /เล่นต่อ/ }).click();
  await page.getByText('จบแล้ว').waitFor({ timeout: 240000 });
  await page.waitForTimeout(3000);
  const plays = await narr();
  const keys = story.pages.map((p) => p.image.split('/').pop().replace(/\.\w+$/, ''));
  const expected = ['p00', keys[0], ...keys].map((k) => `/audio/th/stories/${slug}/${k}.mp3`);
  assert.deepEqual(plays, expected, 'each page of this story narrated once, p01 replayed after pause');
  assert.equal(await page.getByRole('button', { name: /อ่านอีกครั้ง/ }).count(), 1);
  assert.equal(await page.locator('.sb-root button').count(), 3, 'three story controls at end');
  for (const btn of await page.locator('.sb-root button').all()) {
    const r = await btn.boundingBox();
    assert.ok(r.width >= 64 && r.height >= 64, `64px at end: ${JSON.stringify(r)}`);
  }
  await page.screenshot({ path: `${out}/1280-end.png`, fullPage: true });
  console.log('autoplay ran to the end; pause silent; narration order', plays.length, 'clips');
  await context.close();

  // ปิดการเคลื่อนไหว: ไม่มีแผ่นพลิก 3D
  const rm = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const p2 = await rm.newPage();
  await p2.goto(url);
  await p2.getByRole('button', { name: 'หน้าถัดไป' }).click();
  await p2.waitForTimeout(100);
  assert.equal(await p2.locator('.sb-leaf, .sb-curl').count(), 0, 'no 3D leaf with reduced motion');
  assert.ok((await p2.locator('.sb-text').innerText()).includes(snippet(0)), 'page 1 text (reduced motion)');
  await rm.close();
} catch (error) {
  for (const context of browser.contexts()) for (const page of context.pages()) {
    await page.screenshot({ path: `${out}/failure-${page.viewportSize()?.width}.png`, fullPage: true }).catch(() => {});
  }
  throw error;
} finally {
  await browser.close();
}
assert.deepEqual(errors, []);
console.log('storybook browser check passed; screenshots in', out);
