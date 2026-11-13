// ตรวจหน้าเกาะสำรวจโลก (/learn/explore) และการ์ตูนเกาะมารยาทที่ใช้ส่วนประกอบร่วมกัน ด้วย Playwright ที่มีในเครื่อง
// เปิด server ก่อน: node scripts/check-explore-browser.mjs [baseUrl] (หรือ BASE_URL; default :3104)
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { CARTOONS, FILMS, HABITAT_LESSONS, CARD_ART } from '../src/features/explore/data.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');

const OUT = process.env.BROWSER_CHECK_OUT ?? 'output/p0-3/explore';
const BASE = (process.argv[2] ?? process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3104}`).replace(/\/+$/, '');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
await mkdir(OUT, { recursive: true });

const area = (b) => b.width * b.height;
const overlapArea = (a, b) =>
  Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));

try {
  for (const [width, height] of [[360, 780], [390, 844], [844, 390], [768, 1024], [1280, 720], [1280, 800]]) {
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
      assert.equal(await page.locator(`#${age} .mrl-card`).count(), 14, `${age} total lessons`);
    }
    for (const img of await page.locator('.mrl-card-art img, .mrl-hero img').all()) {
      assert.ok(!decodeURIComponent(await img.getAttribute('src')).includes('/explore/photos/'), 'no photos on cards or hero');
    }
    for (const el of await page.locator('.mrl-card').all()) {
      assert.ok((await el.boundingBox()).height >= 64, `card height ${width}`);
    }
    // ภาพการ์ดทุกใบโหลดได้
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const broken = await page.locator('.mrl-card-art img').evaluateAll((imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).length);
    assert.equal(broken, 0, `broken card images ${width}`);
    await page.screenshot({ path: `${OUT}/${width}x${height}-page.png`, fullPage: true });

    // การ์ดหมวดสัตว์ทุกใบ (10 ถิ่น x 2 วัย): ตรวจทั้งบทเดิมและบทใหม่ ไม่ข้าม assertions เดิม
    for (const age of ['kids', 'juniors']) {
      const cards = page.locator(`#${age} .mrl-group`).first().locator('.mrl-card');
      const count = await cards.count();
      assert.equal(count, 10, `${age} habitat cards`);
      for (let c = 0; c < count; c++) {
        const lesson = HABITAT_LESSONS[age][c];
        assert.ok(!CARD_ART[lesson.id].includes('/photos/'), `cartoon card ${lesson.id}`);
        const expected = CARTOONS[lesson.id].scenes;
        assert.ok((await cards.nth(c).innerText()).includes(lesson.title.th), `${age} card title ${lesson.id}`);
        await cards.nth(c).click();
        await page.locator('.mrl-cartoon[open]').waitFor();
        // บทที่มีการ์ตูนเต็มเรื่อง (FILMS) เปิดเครื่องเล่นวิดีโอ — ตรวจไฟล์ใต้ explore/film และจุดหยุดดูภาพถ่าย (ตรวจละเอียดใน output/car-desert/check-film.mjs)
        if (FILMS[lesson.id]) {
          const film = FILMS[lesson.id];
          const src = await page.locator('.mrl-film-video source').first().getAttribute('src');
          assert.ok(src.includes(`/${film.dir}/${film.name}-`), `${lesson.id} film source ${src}`);
          assert.ok(film.turns.filter((tr) => tr.photo).length >= 2, `${lesson.id} film has two photo stops`);
          await page.getByRole('button', { name: /ปิด/ }).first().click();
          await page.locator('.mrl-cartoon[open]').waitFor({ state: 'detached' });
          continue;
        }
        const scenes = await page.locator('.mrl-cartoon .mrl-dots li').count();
        assert.equal(scenes, age === 'kids' ? 7 : 8, `${lesson.id} scene count`);
        let photos = 0;
        for (let i = 0; i < scenes; i++) {
          if (i > 0) await page.getByRole('button', { name: /ฉากถัดไป/ }).click();
          // หยุดเสียงไว้ระหว่างวัด layout เพื่อไม่ให้เสียงสั้นพาไปฉากถัดไปเอง
          const pause = page.locator('.mrl-cartoon-controls .ui-pill');
          if ((await pause.innerText()).includes('พัก')) await pause.click();
          await page.waitForTimeout(250);
          await page.waitForFunction(() => { const img = document.querySelector('.mrl-cartoon .mrl-stage-bg[data-active]'); return img && img.complete && img.naturalWidth > 0; });
          const tag = `${width}x${height}-${age}-${c}-${i}`;
          assert.equal(await page.locator('.mrl-cartoon-caption > p').first().innerText(), expected[i].th, `${tag} Thai caption`);
          assert.equal(await page.locator('.mrl-cartoon-caption > p[lang="en"]').innerText(), expected[i].en, `${tag} English caption`);
          for (const bg of await page.locator('.mrl-stage-bg').all()) {
            assert.ok(!decodeURIComponent(await bg.getAttribute('src')).includes('/explore/photos/'), `${tag} no photo background`);
          }
          assert.equal(await page.locator('.mrl-cartoon .mrl-photo').count(), expected[i].photo ? 1 : 0, `${tag} photo only in teaching scene`);
          if (/^(pond|savanna|farm|garden|mountain|beach)-/.test(lesson.id) && !expected[i].photo && i === 1) {
            await page.locator('.mrl-cartoon[open]').screenshot({ path: `${OUT}/${tag}-cartoon.png` });
          }
          if (await page.locator('.mrl-cartoon .mrl-photo').count()) {
            photos++;
            const photo = page.locator('.mrl-cartoon .mrl-photo img');
            assert.ok(decodeURIComponent(await photo.getAttribute('src')).includes(expected[i].photo.src), `expected photo ${tag}`);
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
            if (width === 844 && /^(farm|garden|mountain|beach)-/.test(lesson.id)) {
              const dialog = page.locator('.mrl-cartoon[open]');
              const scrollTop = await dialog.evaluate((el) => { const y = el.scrollTop; el.scrollTop = 0; return y; });
              await dialog.screenshot({ path: `${OUT}/${tag}-photo-top.png` });
              await dialog.evaluate((el, y) => { el.scrollTop = y; }, scrollTop);
            }
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
        if (/^(pond|savanna|farm|garden|mountain|beach)-/.test(lesson.id)) assert.equal(photos, 2, `${lesson.id} exactly two teaching photos`);
        await page.getByRole('button', { name: /ปิด/ }).first().click();
        await page.locator('.mrl-cartoon[open]').waitFor({ state: 'detached' });
      }
    }
    // ภารกิจปัจจุบันวันละ 2 บท และการกดข้ามฉากยังไม่นับว่าเรียนจบ
    assert.match(await page.locator('#kids .mrl-mission').innerText(), / 0\/2/);
    await page.locator('#kids .mrl-card').first().click();
    await page.locator('.mrl-cartoon[open]').getByRole('button', { name: /ดูอีกครั้ง/ }).waitFor({ timeout: 180000 });
    await page.keyboard.press('Escape');
    assert.match(await page.locator('#kids .mrl-mission').innerText(), / 1\/2/);

    // บทใหม่: เล่น MP3 จริงครบทุกฉากที่ 16x แล้วตรวจได้ดาว ไม่สร้าง event ended ปลอม
    if (width === 360) {
      await page.evaluate(() => {
        const NativeAudio = window.Audio;
        window.__explorePlayed = [];
        window.Audio = function (...args) {
          const audio = new NativeAudio(...args);
          audio.playbackRate = 16;
          audio.addEventListener('ended', () => window.__explorePlayed.push(audio.src));
          return audio;
        };
      });
      for (const age of ['kids', 'juniors']) {
        const cards = page.locator(`#${age} .mrl-group`).first().locator('.mrl-card');
        const newIds = ['pond', 'savanna', 'farm', 'garden', 'mountain', 'beach'].map(habitat => `${habitat}-${age === 'kids' ? 'home' : 'life'}`);
        for (const id of newIds) {
          const c = HABITAT_LESSONS[age].findIndex(lesson => lesson.id === id);
          assert.ok(c >= 0, `combined habitat ${id}`);
          const lesson = HABITAT_LESSONS[age][c];
          await cards.nth(c).click();
          await page.getByRole('button', { name: /ดูอีกครั้ง/ }).waitFor({ timeout: 90000 });
          const played = await page.evaluate(() => window.__explorePlayed);
          for (const scene of CARTOONS[lesson.id].scenes) {
            assert.ok(played.some((src) => src.endsWith(`/${scene.clip}.mp3`)), `${lesson.id}: ${scene.clip} played to end`);
          }
          await page.getByRole('button', { name: /ปิด/ }).first().click();
          console.log(`playback complete: ${lesson.id}`);
        }
        // The earlier full-playback check already completed one kids lesson.
        const completed = new Set([...newIds, ...(age === 'kids' ? [HABITAT_LESSONS.kids[0].id] : [])]).size;
        assert.match(await page.locator(`#${age} .mrl-mission`).innerText(), new RegExp(` ${completed}/2\\b`));
      }
    }

    // เกาะมารยาท: การ์ตูนบิสมิลลาฮ์ยังเปิดได้ ดาวแยกจากเกาะสำรวจโลก
    await page.goto(`${BASE}/learn/moral`);
    await page.locator('.mrl-hero').waitFor();
    assert.match(await page.locator('#kids .mrl-mission').innerText(), / 0\//);
    await page.locator('#kids .mrl-card').first().click();
    await page.locator('.mrl-cartoon[open]').waitFor();
    await page.waitForTimeout(600);
    await page.locator('.mrl-cartoon[open]').screenshot({ path: `${OUT}/${width}-moral-cartoon.png` });
    await context.close();
    console.log(`viewport ${width}x${height} passed`);
  }
  // C-12 muted fallback progression is independent of the real-MP3 coverage above.
  {
    const context = await browser.newContext({ viewport: { width: 360, height: 780 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/learn/explore`);
    const sound = page.getByRole('button', { name: 'เสียงอ่าน', exact: true });
    if (await sound.getAttribute('aria-pressed') === 'true') await sound.click();
    await page.clock.install();
    for (const [n, id] of ['farm-home', 'garden-home', 'mountain-home', 'beach-home'].entries()) {
      const index = HABITAT_LESSONS.kids.findIndex(l => l.id === id);
      await page.locator('#kids .mrl-group').first().locator('.mrl-card').nth(index).click();
      await page.locator('.mrl-cartoon[open]').waitFor();
      for (const [i, scene] of CARTOONS[id].scenes.entries()) {
        await page.waitForFunction(index => document.querySelectorAll('.mrl-dots li')[index]?.hasAttribute('data-on'), i);
        await page.clock.runFor(scene.ms + 600);
      }
      await page.getByRole('button', { name: /ดูอีกครั้ง/ }).waitFor();
      await page.getByRole('button', { name: /ปิด/ }).first().click();
      assert.ok((await page.locator('#kids .mrl-mission').innerText()).includes(`${n + 1}/2`), `muted completed ${id}`);
    }
    await page.goto(`${BASE}/learn/moral`);
    assert.match(await page.locator('#kids .mrl-mission').innerText(), / 0\//);
    await context.close();
    console.log('PASS farm/garden/mountain/beach muted fallback and separate island progress');
  }
  assert.deepEqual(errors, []);
  console.log('explore ok');
} catch (error) {
  for (const context of browser.contexts()) for (const page of context.pages()) {
    await page.screenshot({ path: `${OUT}/failure-${page.viewportSize()?.width}.png`, fullPage: true }).catch(() => {});
  }
  throw error;
} finally {
  await browser.close();
}
