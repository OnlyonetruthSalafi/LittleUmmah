// เปิด server ก่อน: node scripts/check-moral-browser.mjs [baseUrl] (หรือ BASE_URL; default :3104)
// PLAYWRIGHT_MODULE ชี้ไปที่ playwright ที่ติดตั้งไว้แล้วได้ โดยไม่ต้องเพิ่ม dependency
// MORAL_SCOPE=cartoons สำหรับตรวจเฉพาะตัวเล่นระหว่างแก้ไข; รอบตรวจรับให้ไม่ตั้งค่านี้
import assert from 'node:assert/strict';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { CARTOONS } from '../src/features/moral/cartoon.ts';
import { getIslandContent } from '../src/lib/lessons.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');

const OUT = process.env.BROWSER_CHECK_OUT ?? 'output/p0-3/moral';
const BASE = (process.argv.slice(2).find(arg => /^https?:/.test(arg)) ?? process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3104}`).replace(/\/+$/, '');
const NEW_LESSONS = {
  kids: ['wait-turn', 'tidy-toys', 'say-sorry', 'help-friend'],
  juniors: ['listen-friend', 'shared-things', 'keep-promise', 'save-water-power'],
};
const island = getIslandContent('moral');
const voiceScript = await readFile('scripts/make-moral-cartoon-voice.mjs', 'utf8');
for (const [age, ids] of Object.entries(NEW_LESSONS)) {
  assert.equal(island[age].length, age === 'kids' ? 12 : 13, `${age}: combined lessons`);
  for (const id of ids) {
    assert.ok(island[age].some(l => l.id === id));
    assert.equal(CARTOONS[id].scenes.length, 5);
    for (const s of CARTOONS[id].scenes) {
      assert.ok(s.th && s.en && !s.word && !s.sayAlong);
      assert.ok(voiceScript.includes(`${JSON.stringify(s.clip)}: ${JSON.stringify(s.th)}`), `${s.clip}: voice matches caption`);
      assert.ok((await stat(`public/audio/th/${s.clip}.mp3`)).size > 1000, `${s.clip}: real MP3 exists`);
      await stat(`public${s.bg}`);
    }
  }
}
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
await mkdir(OUT, { recursive: true });

const overlaps = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

const dailyOnly = process.argv.includes('--daily-duas');
try {
  if (!dailyOnly) {
  for (const [width, height] of (process.env.MORAL_SCOPE === 'cartoons' ? [] : [[320, 700], [360, 780], [390, 844], [844, 390], [768, 1024], [1280, 720], [1280, 800]])) {
    for (const reduce of [false, true]) {
      const context = await browser.newContext({
        viewport: { width, height },
        reducedMotion: reduce ? 'reduce' : 'no-preference',
        hasTouch: width < 800,
      });
      const page = await context.newPage();
      page.on('pageerror', (error) => errors.push(`${width}: ${error.message}`));
      page.on('response', (r) => { if (r.status() >= 400) errors.push(`${width}: ${r.status()} ${r.url()}`); });
      await page.goto(`${BASE}/learn/moral`);
      await page.locator('.mrl-hero').waitFor();
      assert.equal(await page.locator('#kids .mrl-card').count(), 12);
      assert.equal(await page.locator('#juniors .mrl-card').count(), 13);

      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no overflow ${width}`);

      // ระหว่างหุ่นยนต์แนะนำ: บอลลูนขึ้น และปุ่มวัยถูกชี้ตามลำดับ
      await page.locator('.mrl-bubble[data-show]').waitFor({ timeout: 6000 });
      const tag = `${width}x${height}${reduce ? '-reduce' : ''}`;
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
      for (const sel of ['.mrl-age-btn', '.mrl-card', '.oi-island-label']) {
        for (const el of await page.locator(sel).all()) {
          const box = await el.boundingBox();
          assert.ok(box.height >= 64, `${sel} ${tag} height ${box.height}`);
        }
      }

      // ไปเกาะอื่น = ภาพเกาะเดิมของหน้าแรก ห้าเกาะ ไม่มีเกาะมารยาท
      const srcs = await page.locator('.oi-wrap img').evaluateAll((imgs) => imgs.map((i) => i.currentSrc || i.src));
      assert.equal(srcs.length, 5);
      for (const src of srcs) assert.match(decodeURIComponent(src), /islands\/(stories|quran|explore|games|art)\.webp/);

      // เปิดอย่างเดียวยังไม่นับ ดูการ์ตูนครบจึงได้ภารกิจ 1/2 (เป้าวันละ 2 บท)
      if (!reduce) {
        await page.locator('#kids .mrl-card').first().click();
        await page.locator('.mrl-dialog[open]').waitFor();
        await page.locator('.mrl-dialog[open]').screenshot({ path: `${OUT}/${tag}-dialog.png` });
        await page.keyboard.press('Escape');
        assert.match(await page.locator('#kids .mrl-mission').innerText(), / 0\/2/);
        await page.locator('#kids .mrl-card').first().click();
        await page.locator('.mrl-cartoon[open]').getByRole('button', { name: /ดูอีกครั้ง/ }).waitFor({ timeout: 180000 });
        await page.keyboard.press('Escape');
        assert.match(await page.locator('#kids .mrl-mission').innerText(), / 1\/2/);
        await page.screenshot({ path: `${OUT}/${tag}-full.png`, fullPage: true });
      }
      await context.close();
      console.log(`page ${width}x${height} reduced=${reduce} OK`);
    }
  }

  // Native Audio instrumentation: observe actual playback, never substitute a fake player.
  for (const [width, height] of [[360, 780], [844, 390], [768, 1024], [1280, 720]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      window.__audio = [];
      const NativeAudio = window.Audio;
      window.Audio = class extends NativeAudio {
        constructor(...args) {
          super(...args);
          window.__audio.push(this);
        }
      };
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', e => errors.push(`${width} cartoon: ${e.message}`));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${width}: ${r.status()} ${r.url()}`); });
    await page.goto(`${BASE}/learn/moral`);
    await page.locator('.mrl-hero').waitFor();
    const dialog = page.locator('.mrl-cartoon[open]');
    const pause = () => dialog.locator('.mrl-cartoon-controls .ui-pill').click();
    const next = () => dialog.locator('.mrl-cartoon-controls .ui-round').last().click();
    const previous = () => dialog.locator('.mrl-cartoon-controls .ui-round').first().click();
    const quiet = async () => {
      await page.waitForFunction(() => window.__audio.every(a => a.paused || a.ended));
    };
    const playing = async clip => {
      try {
        await page.waitForFunction(clip => window.__audio.some(a => a.src.endsWith(`/${clip}.mp3`) && !a.paused && a.currentTime > 0), clip);
      } catch (error) {
        console.error('Playback diagnostic', clip, await page.evaluate(() => ({caption:document.querySelector('.mrl-cartoon-caption')?.textContent,audio:window.__audio.map(a=>({src:a.src,paused:a.paused,ended:a.ended,time:a.currentTime,error:a.error?.code}))})));
        throw error;
      }
      assert.equal(await page.evaluate(() => window.__audio.filter(a => !a.paused && !a.ended).length), 1, 'only one narration plays');
    };
    for (const [age, ids] of Object.entries(NEW_LESSONS)) {
      for (const id of ids) {
        const lesson = island[age].find(l => l.id === id);
        const card = page.locator(`#${age} .mrl-card`).filter({ hasText: lesson.title.th });
        assert.equal(await card.count(), 1, `${id}: correct age`);
        assert.equal(await page.locator(`#${age === 'kids' ? 'juniors' : 'kids'} .mrl-card`).filter({ hasText: lesson.title.th }).count(), 0);
        const missionBefore = await page.locator(`#${age} .mrl-mission`).innerText();
        await card.click();
        await dialog.waitFor();
        assert.equal(await dialog.locator('.mrl-dots li').count(), 5);
        for (let i = 0; i < 5; i++) {
          const scene = CARTOONS[id].scenes[i];
          await playing(scene.clip);
          await pause();
          await quiet();
          assert.equal(await dialog.locator('.mrl-cartoon-caption p').first().innerText(), scene.th);
          assert.equal(await dialog.locator('.mrl-cartoon-caption p[lang="en"]').innerText(), scene.en);
          assert.equal(await dialog.locator('.mrl-dots li[data-on]').evaluate(el => [...el.parentElement.children].indexOf(el)), i);
          assert.equal(await dialog.locator('.mrl-stage-word').count(), 0, 'no religious label');
          await page.waitForFunction(() => {
            const img = document.querySelector('.mrl-cartoon[open] .mrl-stage-bg[data-active]');
            return img?.complete && img.naturalWidth > 0;
          });
          await dialog.locator('.mrl-stage-bg[data-active]').evaluate(img => img.decode());
          assert.equal(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth), true, 'no dialog horizontal overflow');
          for (const control of await dialog.locator('button').all()) {
            const box = await control.boundingBox();
          assert.ok(box.width >= 64 && box.height >= 64, `cartoon controls ≥64px: ${width} ${id} ${box.width}×${box.height}`);
          }
          await dialog.evaluate(el => { el.scrollTop = 0; });
          await page.screenshot({path:`${OUT}/${width}x${height}-${id}-${i+1}.png`});
          // Short windows retain the existing scrollable dialog. Also capture its caption/controls.
          if (await dialog.evaluate(el => el.scrollHeight > el.clientHeight)) {
            await dialog.locator('.mrl-cartoon-controls').scrollIntoViewIfNeeded();
            await page.screenshot({path:`${OUT}/${width}x${height}-${id}-${i+1}-controls.png`});
          }
          // Resume replays the complete sentence; reverse/next must stop the old voice.
          if (i === 1) {
            await pause();
            await playing(scene.clip);
            await previous();
            await playing(CARTOONS[id].scenes[0].clip);
            await next();
            await playing(scene.clip);
            await pause();
            await quiet();
          }
          if (i < 4) await next();
        }
        // Close during real playback, not only while already paused.
        await pause();
        await playing(CARTOONS[id].scenes[4].clip);
        await dialog.locator('.mrl-cartoon-head button').click();
        await quiet();
        assert.equal(await page.locator('.mrl-cartoon[open]').count(), 0);
        console.log(`${width}x${height} ${id}: five scenes + playback controls OK`);
        assert.equal(await page.locator(`#${age} .mrl-mission`).innerText(), missionBefore, 'skipping scenes never earns completion');

        if (width === 1280) {
          // Let all five real MP3s finish: proves automatic progression and reward eligibility.
          await card.click();
          for (const scene of CARTOONS[id].scenes) await playing(scene.clip);
          await dialog.getByRole('button', {name:/ดูอีกครั้ง/}).waitFor({timeout:30000});
          await quiet();
          await dialog.getByRole('button', {name:/ดูอีกครั้ง/}).click();
          await playing(CARTOONS[id].scenes[0].clip);
          await page.keyboard.press('Escape');
          await quiet();
          const done = ids.indexOf(id) + 1;
          assert.match(await page.locator(`#${age} .mrl-mission`).innerText(), new RegExp(`${done}/2`));
        }
      }
    }
    await context.close();
  }
  }
  const expected = JSON.parse(await readFile('tests/fixtures/daily-duas.json', 'utf8'));
  const evidence = [];
  await mkdir(`${OUT}/shots`, { recursive: true });
  for (const [width, height] of [[360, 780], [844, 390], [768, 1024], [1280, 720]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      sessionStorage.setItem('lu-moral-guide-seen', '1');
      window.__moralAudio = [];
      const NativeAudio = window.Audio;
      window.Audio = class extends NativeAudio {
        constructor(...args) { super(...args); window.__moralAudio.push(this); }
      };
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', e => errors.push(`${width}: ${e.message}`));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${width}: ${r.status()} ${r.url()}`); });
    await page.goto(`${BASE}/learn/moral`);
    assert.equal(await page.locator('#kids .mrl-card').count(), 12);
    assert.equal(await page.locator('#juniors .mrl-card').count(), 13);
    for (const dua of expected) {
      console.log(`daily dua ${width}x${height} ${dua.id}`);
      const card = page.locator(`#${dua.age} .mrl-card`).filter({ hasText: dua.title.th });
      await card.click();
      const dialog = page.locator('.mrl-cartoon[open]');
      await dialog.waitFor();
      for (const [index, scene] of CARTOONS[dua.id].scenes.entries()) {
        if (index) await dialog.locator('.mrl-cartoon-controls button').last().click();
        await page.waitForFunction(clip => window.__moralAudio.some(a => a.src.endsWith(`/${clip}.mp3`) && !a.paused), scene.clip);
        await dialog.locator('.mrl-cartoon-controls button').nth(1).click();
        assert.equal(await page.evaluate(() => window.__moralAudio.every(a => a.paused || a.ended)), true, `pause stops audio ${scene.clip}`);
        assert.equal(await dialog.locator('.mrl-cartoon-caption > p').first().textContent(), scene.th);
        const word = scene.word;
        if (word) {
          assert.equal(await dialog.locator('.mrl-word-above [lang="ar"]').textContent(), word.ar);
          assert.equal(await dialog.locator('.mrl-word-above [lang="ar"]').getAttribute('dir'), 'rtl');
          assert.equal(await dialog.locator('.mrl-word-above').evaluate(el => el.scrollWidth <= el.clientWidth), true, `word fits ${scene.clip} ${width}`);
          const label = await dialog.locator('.mrl-word-above').boundingBox();
          const stage = await dialog.locator('.mrl-stage').boundingBox();
          assert.ok(label.y + label.height <= stage.y, `word does not cover robots ${scene.clip}`);
        }
        for (const button of await dialog.locator('button').all()) {
          const box = await button.boundingBox();
          assert.ok(box.width >= 64 && box.height >= 64, `64px controls ${scene.clip} ${width}`);
        }
        assert.equal(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth), true, `dialog overflow ${scene.clip}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await dialog.locator('img').evaluateAll(imgs => Promise.all(imgs.map(i => i.decode())));
        await dialog.evaluate(el => { el.scrollTop = 0; });
        const tag = `${width}x${height}-${dua.id}-${index+1}`;
        await page.screenshot({ path: `${OUT}/shots/${tag}.png` });
        if (await dialog.evaluate(el => el.scrollHeight > el.clientHeight + 1)) {
          await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
          await page.screenshot({ path: `${OUT}/shots/${tag}-bottom.png` });
        }
        evidence.push({ lesson: dua.id, scene: index+1, clip: scene.clip, width, height, arabic: word?.ar ?? null });
      }
      // ย้อนต้องกลับฉากก่อนหน้าและเล่นคลิปของฉากนั้น; ปิดแล้วไม่มีเสียงค้าง
      await dialog.locator('.mrl-cartoon-controls button').first().click();
      const previous = CARTOONS[dua.id].scenes.at(-2);
      await page.waitForFunction(clip => window.__moralAudio.some(a => a.src.endsWith(`/${clip}.mp3`) && !a.paused), previous.clip);
      assert.equal(await dialog.locator('.mrl-cartoon-caption > p').first().textContent(), previous.th);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => window.__moralAudio.every(a => a.paused || a.ended));
      assert.equal(await page.evaluate(() => window.__moralAudio.every(a => a.paused || a.ended)), true, `close stops ${dua.id}`);
      assert.match(await page.locator(`#${dua.age} .mrl-mission`).innerText(), /0\/2/);
    }
    await context.close();
  }
  await writeFile(`${OUT}/browser-results.json`, JSON.stringify(evidence, null, 2));

  // ไม่มีคลิป: ตัวเล่นยังเดินตามเวลา ให้เวลาพูดตามครบ และได้ภารกิจเมื่อดูครบจริง
  const fallbackContext = await browser.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
  const fallback = await fallbackContext.newPage();
  fallback.setDefaultTimeout(15000);
  await fallback.addInitScript(() => sessionStorage.setItem('lu-moral-guide-seen', '1'));
  await fallback.route('**/audio/th/dua-*.mp3', route => route.abort());
  await fallback.goto(`${BASE}/learn/moral`);
  await fallback.clock.install();
  await fallback.locator('#kids .mrl-card').filter({ hasText: expected[0].title.th }).click();
  const fallbackDialog = fallback.locator('.mrl-cartoon[open]');
  await fallbackDialog.waitFor();
  for (const scene of CARTOONS['dua-sleep'].scenes) {
    await fallback.waitForTimeout(150);
    assert.equal(await fallbackDialog.locator('.mrl-cartoon-caption > p').first().textContent(), scene.th);
    await fallback.clock.fastForward(scene.ms + 50);
    if (scene.sayAlong) {
      await fallback.waitForFunction(() => document.querySelector('.mrl-word-above[data-say]'));
      await fallback.clock.fastForward(scene.sayAlongMs + 50);
    } else await fallback.clock.fastForward(550);
  }
  await fallbackDialog.getByRole('button', { name: /ดูอีกครั้ง/ }).waitFor();
  await fallback.keyboard.press('Escape');
  assert.match(await fallback.locator('#kids .mrl-mission').innerText(), /1\/2/);
  await fallbackContext.close();
  console.log('missing audio fallback, sayAlong and completed lesson progress OK');
} catch (error) {
  for (const context of browser.contexts()) for (const page of context.pages()) {
    await page.screenshot({ path: `${OUT}/failure-${page.viewportSize()?.width}.png`, fullPage: true }).catch(() => {});
  }
  throw error;
} finally {
  await browser.close();
}
assert.deepEqual(errors, []);
await writeFile(`${OUT}/result.json`, JSON.stringify({status:'passed', scope:dailyOnly ? 'daily-duas' : process.env.MORAL_SCOPE ?? 'all', cartoonLessons:8, cartoonScenes:40, cartoonSceneScreenshots:160, errors},null,2));
console.log('moral page OK');
