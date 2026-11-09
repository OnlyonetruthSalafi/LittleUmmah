// Start a production server, then: node scripts/check-language-rooms-browser.mjs http://localhost:3300
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { COURSES } from '../src/features/languages/courses.ts';
import { scanHomeAlpha } from './home-island-alpha.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = (process.argv[2] ?? process.env.BASE_URL ?? 'http://localhost:3300').replace(/\/+$/, '');
const out = process.env.BROWSER_CHECK_OUT ?? 'output/lang-2';
const browser = await chromium.launch({ headless: true, channel: process.env.CLASSROOM_BROWSER === 'chromium' ? undefined : 'chrome', executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const errors = [];
const measurements = [];
await mkdir(out, { recursive: true });

async function boardFits(page, expected, label) {
  await page.waitForFunction(text => document.querySelector('.cls-board-text')?.textContent === text, expected);
  const sizes = await page.evaluate(() => {
    const board = document.querySelector('.cls-board-face');
    const text = document.querySelector('.cls-board-text');
    const span = text.querySelector('span');
    const box = board.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(span);
    const rects = [span.getBoundingClientRect(), range.getBoundingClientRect()];
    return {
      scrollFits: [board, text, span].every(el => el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1),
      boundsFit: rects.every(r => r.left >= box.left - 1 && r.right <= box.right + 1 && r.top >= box.top - 1 && r.bottom <= box.bottom + 1),
    };
  });
  assert.ok(sizes.scrollFits && sizes.boundsFit, `${label}: board clipped ${expected}: ${JSON.stringify(sizes)}`);
}
async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `horizontal overflow: ${label}`);
}
try {
  const alpha = await scanHomeAlpha('public/languages/school.webp');
  assert.equal(alpha.interiorTranslucent, 0, 'school has no translucent solid interior');
  await writeFile(`${out}/art-alpha.json`, JSON.stringify(alpha, null, 2));
  for (const [width, height] of [[360, 780], [390, 844], [844, 390], [768, 1024], [1280, 800], [1536, 864]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: width < 800 });
    await context.addInitScript(() => localStorage.setItem('little-ummah:sound', 'off'));
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${width}: ${error.message}`));
    await page.goto(`${base}/learn/languages#juniors`);
    await page.locator('.language-room[href$="#juniors"]').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.language-room-art img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
    await noOverflow(page, `picker ${width}`);
    const contrasts = await page.locator('.language-picker').evaluate(root => {
      const rgb = s => s.match(/[\d.]+/g).map(Number);
      const luminance = c => c.slice(0, 3).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((a, v, i) => a + v * [.2126, .7152, .0722][i], 0);
      return [...root.querySelectorAll('*')].filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(el => {
        let bg = el;
        while (bg && rgb(getComputedStyle(bg).backgroundColor)[3] === 0) bg = bg.parentElement;
        const color = getComputedStyle(el).color;
        const background = bg ? getComputedStyle(bg).backgroundColor : 'rgb(255,255,255)';
        const a = luminance(rgb(color)), b = luminance(rgb(background));
        return { text: [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(''), color, background, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
      });
    });
    assert.ok(contrasts.every(row => row.ratio >= 4.5), `contrast ${width}: ${JSON.stringify(contrasts.filter(row => row.ratio < 4.5))}`);
    measurements.push({ width, height, contrasts });
    // Labels are on opaque CSS surfaces, never painted into the raster.
    assert.ok(await page.locator('.language-sample, .language-nameplate, .language-enter, .language-closed-board').evaluateAll(labels => labels.every(el => {
      const r = el.getBoundingClientRect();
      const range = document.createRange(); range.selectNodeContents(el);
      const text = range.getBoundingClientRect();
      return text.left >= r.left - 1 && text.right <= r.right + 1 && text.top >= r.top - 1 && text.bottom <= r.bottom + 1;
    })), `all live labels fit their surfaces ${width}`);
    assert.ok(await page.locator('.language-room-art img').evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0)), 'school artwork loaded');
    assert.equal(await page.locator('a.language-room').count(), 3);
    for (const link of await page.locator('.language-room').all()) {
      const rect = await link.boundingBox();
      assert.ok(rect.width >= 64 && rect.height >= 64, `room target ${width}`);
      assert.ok((await link.getAttribute('href')).endsWith('#juniors'));
      assert.equal(await link.locator('a, button, [tabindex]').count(), 0, 'one focus stop per room');
    }
    assert.equal(await page.locator('[data-locked-room]').count(), 2);
    for (const locked of await page.locator('[data-locked-room]').all()) {
      assert.match(await locked.innerText(), /เร็วๆ นี้/);
      assert.equal(await locked.locator('a,button,[tabindex]').count(), 0);
      assert.equal(await locked.evaluate(el => el.matches('a,button,[tabindex]')), false);
      assert.ok((await locked.boundingBox()).height >= 64);
    }
    await page.locator('.language-room').first().focus();
    assert.notEqual(await page.locator('.language-room').first().evaluate(el => getComputedStyle(el).outlineStyle), 'none');
    await page.screenshot({ path: `${out}/picker-${width}.png`, fullPage: true });
    await page.locator('.language-picker').screenshot({ path: `${out}/picker-${width}-detail.png` });
    await page.locator('[data-room="english"]').click();
    await page.waitForFunction(() => document.querySelector('#juniors')?.getAttribute('aria-pressed') === 'true');
    assert.ok(page.url().endsWith('/english#juniors'));

    for (const config of Object.values(COURSES)) {
      await page.goto(`${base}/learn/languages/${config.id}#kids`);
      await page.locator('.cls-stage').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await noOverflow(page, `${config.id} ${width}`);
      const steps = config.units.kids[0].steps;
      assert.equal(await page.locator('.cls-plaque').count(), steps.length);
      assert.equal(await page.locator('.cls-board-text').getAttribute('lang'), config.lang);
      assert.equal(await page.locator('.cls-board-text').getAttribute('dir'), config.dir);
      assert.equal(await page.locator('a.ui-pill[href="/learn/languages"]').count(), 1, 'back to picker');
      if (config.id !== "arabic") await boardFits(page, steps[0].board, `${config.id} ${width}`);
      await page.getByRole('button', { name: /เริ่มเรียน/ }).click();
      if (width === 360) {
        // No sound, no clicks: the complete timer fallback must advance by itself.
        await page.waitForFunction(text => document.querySelector('.cls-board-text')?.textContent === text, steps[1].board, { timeout: 45000 });
        const saved = await page.evaluate(key => localStorage.getItem(key), config.progressKey);
        assert.ok(saved?.split(',').includes(steps[0].id), 'save progress under the room key');
      } else {
        await page.getByRole('button', { name: /ตัวถัดไป/ }).click();
      }
      assert.equal(await page.locator(".cls-board-text").innerText(), steps[1].board);
      if (config.id !== "arabic") await boardFits(page, steps[1].board, `${config.id} step 2 ${width}`);
      await page.locator('.cls-stage').screenshot({ path: `${out}/${config.id}-${width}-step-2.png` });
      if (config.id !== 'arabic') {
        for (let i = 0; i < steps.length; i++) {
          await page.locator('.cls-plaque').nth(i).click();
          await boardFits(page, steps[i].board, `${config.id} letter ${i + 1} ${width}`);
        }
        await page.locator('.cls-path').screenshot({ path: `${out}/${config.id}-${width}-path.png` });
        if (width === 360) {
          await page.getByRole('button', { name: /7 ปีขึ้นไป/ }).click();
          for (let u = 0; u < config.units.juniors.length; u++) {
            await page.locator('.cls-unit').nth(u).click();
            for (let s = 0; s < config.units.juniors[u].steps.length; s++) {
              await page.locator('.cls-plaque').nth(s).click();
              await boardFits(page, config.units.juniors[u].steps[s].board, `${config.id} juniors ${u}/${s}`);
            }
            await page.locator('.cls-stage').screenshot({ path: `${out}/${config.id}-juniors-${u}-360.png` });
          }
        }
      }
    }
    await context.close();
    console.log(`language rooms: ${width}×${height} passed`);
  }
  const context = await browser.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`extra: ${error.message}`));
  for (const locale of ['', '/en', '/th']) {
    for (const room of ['', '/english', '/thai', '/arabic']) {
      const oldPath = `${locale}/learn/arabic${room}`;
      const newPath = `${locale === '/en' ? '/en' : ''}/learn/languages${room}`;
      const response = await context.request.get(`${base}${oldPath}?source=legacy`, { maxRedirects: 0 });
      assert.equal(response.status(), 308, `permanent redirect ${oldPath}`);
      assert.equal(new URL(response.headers().location, base).href, `${base}${newPath}?source=legacy`);
      for (const hash of ['#kids', '#juniors']) {
        const final = await page.goto(`${base}${oldPath}?source=legacy${hash}`);
        assert.equal(final.status(), 200);
        assert.equal(page.url(), `${base}${newPath}?source=legacy${hash}`, 'browser preserves hash and query');
        const initial = final.request().redirectedFrom();
        assert.ok(initial && !initial.redirectedFrom(), 'exactly one redirect, no rewrite loop');
        if (!room) await page.locator(`.language-room[href$="${hash}"]`).first().waitFor();
      }
    }
  }
  await page.goto(`${base}/learn/languages`);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const roomLink = page.locator('.language-room').first();
  await page.evaluate(() => document.fonts.ready);
  await roomLink.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const textPosition = el => { const r = el.getBoundingClientRect(); const parent = el.closest('.language-room').getBoundingClientRect(); return { x: r.x - parent.x, y: r.y - parent.y, width: r.width, height: r.height }; };
  const before = await roomLink.locator('.language-sample').evaluate(textPosition);
  await roomLink.hover(); await page.waitForTimeout(250);
  const after = await roomLink.locator('.language-sample').evaluate(textPosition);
  assert.deepEqual(after, before, 'hover keeps text stationary');
  assert.notEqual(await roomLink.locator('img').evaluate(el => getComputedStyle(el).translate), 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await roomLink.locator('img').evaluate(el => getComputedStyle(el).translate), 'none');
  for (const locale of ['', '/en']) {
    const response = await page.goto(`${base}${locale}/learn/languages/not-a-room`);
    assert.equal(response.status(), 404);
  }
  await page.goto(`${base}/en/learn/languages#kids`);
  await page.locator('.language-room[href$="#kids"]').first().waitFor();
  assert.doesNotMatch(await page.locator('.language-picker').innerText(), /เลือก|เร็วๆ|ภาษา/);
  assert.equal(await page.locator('.language-room[href^="/en/learn/languages/"]').count(), 3);
  await page.screenshot({ path: `${out}/picker-en-360.png`, fullPage: true });
  for (const id of Object.keys(COURSES)) {
    await page.goto(`${base}/en/learn/languages/${id}`);
    await page.locator('.cls-stage').waitFor();
    assert.match(await page.locator('h1').innerText(), /classroom/i);
  }
  // Missing recordings still complete a lesson phase with sound enabled.
  await page.route('**/audio/th/class/en/*.mp3', route => route.fulfill({ status: 404 }));
  await page.goto(`${base}/learn/languages/english`);
  await page.getByRole('button', { name: /เริ่มเรียน/ }).click();
  await page.getByText('ตาหนูแล้ว').waitFor({ timeout: 30000 });
  await context.close();
  assert.deepEqual(errors, [], 'no page errors');
  await writeFile(`${out}/measurements.json`, JSON.stringify(measurements, null, 2));
  console.log('language rooms browser checks passed');
} catch (error) {
  for (const context of browser.contexts()) for (const page of context.pages()) {
    await page.screenshot({ path: `${out}/failure-${page.viewportSize()?.width}.png`, fullPage: true }).catch(() => {});
  }
  throw error;
} finally {
  await browser.close();
}
