// Adapted from check-explore-browser: muted full playback with a fake clock.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { CARTOONS, LESSONS, CARD_ART } from '../src/features/faith/data.ts';
import { SAY_ALONG_MS } from '../src/features/moral/cartoon.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const BASE = process.argv[2] ?? process.env.BASE_URL ?? 'http://localhost:3170';
const OUT = process.env.BROWSER_CHECK_OUT ?? 'output/faith-1/shots';
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const errors = [], measurements = [];
const starState = page => page.evaluate(() => JSON.parse(localStorage.getItem('lu-ls-stars')));
async function layout(page, tag, selector) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${tag}: page overflow`);
  const boxes = await page.locator(selector).evaluateAll(els => els.filter(e => e.getClientRects().length).map(e => {
    const b = e.getBoundingClientRect();
    return { label: e.getAttribute('aria-label') ?? e.textContent.trim(), w: b.width, h: b.height };
  }));
  for (const b of boxes) assert.ok(Math.min(b.w, b.h) >= 63.5, `${tag}: target ${b.label} ${b.w}x${b.h}`);
  measurements.push({ tag, boxes });
}
try {
  for (const [width, height] of [[360,780], [390,844], [844,390], [768,1024], [1280,720]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 844, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.clock.install({ time: new Date('2026-11-10T05:00:00Z') });
    await page.goto(`${BASE}/learn/faith-basics`);
    await page.locator('.mrl-hero').waitFor();
    const sound = page.getByRole('button', { name: 'เสียงอ่าน', exact: true });
    if (await sound.getAttribute('aria-pressed') === 'true') await sound.click();
    await page.clock.runFor(25000);
    if (await page.locator('.mrl-guide').getAttribute('data-phase') !== 'rest') {
      await page.locator('.mrl-guide').click();
      await page.clock.runFor(2000);
    }
    await layout(page, `${width}-page`, '.mrl-card,.mrl-age-btn,.mrl-guide');
    for (const age of ['kids','juniors']) assert.equal(await page.locator(`#${age} .mrl-card`).count(), 6);
    await page.locator('#juniors').scrollIntoViewIfNeeded();
    await page.locator('img').evaluateAll(imgs => imgs.forEach(img => { img.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: `${OUT}/${width}x${height}-page.png`, fullPage: true });
    async function play(age, n, capture = false) {
      const lesson = LESSONS[age][n];
      assert.ok(CARD_ART[lesson.id]);
      await page.locator(`#${age} .mrl-card`).nth(n).click();
      await page.locator('.mrl-cartoon[open]').waitFor();
      const expected = CARTOONS[lesson.id].scenes;
      assert.equal(await page.locator('.mrl-dots li').count(), expected.length);
      for (const [i, scene] of expected.entries()) {
        await page.waitForFunction(index => document.querySelectorAll('.mrl-dots li')[index]?.hasAttribute('data-on'), i);
        assert.equal(await page.locator('.mrl-cartoon-caption > p').first().innerText(), scene.th);
        assert.equal(await page.locator('.mrl-cartoon-caption > p[lang=en]').innerText(), scene.en);
        await page.waitForFunction(() => { const img = document.querySelector('.mrl-stage-bg[data-active]'); return img?.complete && img.naturalWidth > 0; });
        assert.ok(!decodeURIComponent(await page.locator('.mrl-stage-bg[data-active]').getAttribute('src')).includes('/explore/scenes/desert-night.webp'), 'no fox in faith night scenes');
        await layout(page, `${width}-${lesson.id}-${i}`, '.mrl-cartoon[open] button');
        assert.ok(await page.locator('.mrl-cartoon').evaluate(e => e.scrollWidth <= e.clientWidth + 1), 'dialog overflow');
        if (capture && (i === 1 || scene.sayAlong)) {
          await page.locator('.mrl-cartoon').screenshot({ path: `${OUT}/${width}x${height}-${lesson.id}-${i}.png` });
        }
        // runFor (not fastForward) preserves each timer and the say-along delay.
        await page.clock.runFor(scene.ms + (scene.sayAlong ? (scene.sayAlongMs ?? SAY_ALONG_MS) : 500) + 100);
      }
      await page.getByRole('button', { name: /ดูอีกครั้ง/ }).waitFor();
      await page.locator('.mrl-cartoon-head button').click();
      await page.locator('.mrl-cartoon[open]').waitFor({ state: 'detached' });
      assert.ok((await starState(page)).earned.includes(`faith:${lesson.id}`), `star ${lesson.id}`);
    }
    for (const age of ['kids','juniors']) for (let n = 0; n < 6; n++) await play(age, n, true);
    const before = await starState(page);
    assert.equal(before.earned.filter(k => k.startsWith('faith:')).length, 12);
    await play('kids', 0);
    assert.deepEqual(await starState(page), before, 'once per lesson per day');
    await page.clock.setSystemTime(new Date('2026-11-11T05:00:00Z'));
    await play('kids', 0);
    const tomorrow = await starState(page);
    assert.equal(tomorrow.balance, before.balance + 1, 'new day awards again');
    assert.deepEqual(tomorrow.earned, ['faith:faith-rabbi']);
    // All referenced voice files must exist, including the namespaced guide.
    for (const cartoon of Object.values(CARTOONS)) for (const scene of cartoon.scenes) {
      assert.equal((await context.request.get(`${BASE}/audio/th/faith/${scene.clip}.mp3`)).status(), 200);
    }
    await context.close();
    console.log(`PASS ${width}x${height}: 12 lessons, every scene, 64px targets, overflow, daily stars`);
  }
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(BASE);
    const island = page.locator('.orbit-island[data-slug="faith-basics"]');
    assert.equal(await island.locator('.orbit-lock').count(), 0);
    assert.equal(await island.locator('a').getAttribute('href'), '/learn/faith-basics');
    await island.locator('a').dispatchEvent('click');
    await island.locator('a').click();
    await page.waitForURL('**/learn/faith-basics');
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).includes('อิสลาม'));
    assert.equal(await page.locator('footer a[href="/learn/faith-basics"]').count(), 1);
    const sitemap = await (await context.request.get(`${BASE}/sitemap.xml`)).text();
    assert.ok(sitemap.includes('/learn/faith-basics</loc>'));
    await page.goto(`${BASE}/learn/moral`);
    assert.equal(await page.locator('.oi-wrap a[href="/learn/faith-basics"]').count(), 1);
    await page.goto(`${BASE}/en/learn/faith-basics`);
    assert.ok(!/[\u0e00-\u0e7f]/.test(await page.locator('main').innerText()), 'English page has no Thai UI');
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute('href')).endsWith('/en/learn/faith-basics'));
    await context.close();
    console.log('PASS home navigation, footer, OtherIslands, sitemap, localized metadata');
  }
  assert.deepEqual(errors, []);
  await writeFile('output/faith-1/browser-measurements.json', JSON.stringify(measurements, null, 2));
} catch (error) {
  for (const c of browser.contexts()) for (const p of c.pages()) await p.screenshot({ path: `${OUT}/failure-${p.viewportSize()?.width}.png`, fullPage: true }).catch(() => {});
  throw error;
} finally { await browser.close(); }
