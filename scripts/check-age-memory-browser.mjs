import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.argv[2] ?? 'http://localhost:3172';
const out = 'output/age-1';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE });
const routes = ['/learn/moral', '/learn/explore', '/learn/faith-basics', '/games', '/learn/games', '/learn/games/memory'];
const cases = [
  { name: 'none', saved: null, hash: '', age: null },
  { name: 'kids', saved: 'kids', hash: '', age: 'kids' },
  { name: 'juniors', saved: 'juniors', hash: '', age: 'juniors' },
  { name: 'hash-juniors', saved: 'kids', hash: '#juniors', age: 'juniors' },
  { name: 'hash-kids', saved: 'juniors', hash: '#kids', age: 'kids' },
];
const rows = [], failures = [];
const baselines = new Map();
async function lessonOrder(page, route, mode) {
  return page.evaluate(({ route, mode }) => Object.fromEntries(['kids','juniors'].map(age => {
    const selector = route.includes('stories')
      ? `[data-age-shelf="${mode ?? 'all'}"] [data-age-book="${age}"] .bs-cell`
      : `#${age} .mrl-card-title, #${age} li a`;
    return [age, [...document.querySelectorAll(selector)].map(el => {
      const copy = el.cloneNode(true);
      copy.querySelectorAll('noscript').forEach(node => node.remove());
      return copy.textContent.trim();
    })];
  })), { route, mode });
}
async function verify(page, route, age) {
  const result = await page.evaluate(({ age, story, game }) => {
    const shown = el => !!el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
    if (story) {
      const zones = [...document.querySelectorAll('section[data-age-book]')].filter(shown);
      return { valid: zones.length > 0 && zones.every(el => !age || el.dataset.ageBook === age), order: zones.map(el => el.dataset.ageBook) };
    }
    if (game) {
      const cards = [...document.querySelectorAll('[data-age-game]')].filter(shown);
      return { valid: cards.length > 0 && cards.every(el => !age || el.dataset.ageGame === 'both' || el.dataset.ageGame === age), order: cards.map(el => el.querySelector('a')?.getAttribute('href') ?? el.querySelector('button').getAttribute('aria-label')) };
    }
    const sections = ['kids','juniors'].filter(id => shown(document.getElementById(id)));
    return { valid: sections.join() === (age ?? 'kids,juniors'), order: sections };
  }, { age, story: route.includes('stories'), game: route === '/games' || route === '/learn/games' });
  assert.ok(result.valid, `visibility/order ${JSON.stringify(result)}`);
  return result.order;
}
try {
  for (const viewport of [{ width:390, height:844 }, { width:1024, height:768 }]) {
    for (const route of routes) for (const state of cases) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      await context.addInitScript(({ saved }) => {
        if (saved) localStorage.setItem('lu-age', saved);
        for (const island of ['moral','explore','faith','stories','games']) sessionStorage.setItem(`lu-${island}-guide-seen`, '1');
        window.__ageCLS = 0;
        window.__ageShifts = [];
        new PerformanceObserver(list => {
          for (const e of list.getEntries()) if (!e.hadRecentInput) {
            window.__ageCLS += e.value;
            window.__ageShifts.push({ value: e.value, nodes: e.sources?.map(s => s.node?.className) });
          }
        }).observe({ type: 'layout-shift', buffered: true });
      }, state);
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', msg => { if (msg.type() === 'error' && /hydration|hydrating|didn't match|server rendered/i.test(msg.text())) errors.push(msg.text()); });
      const row = { route, viewport: `${viewport.width}x${viewport.height}`, case: state.name };
      try {
        await page.goto(`${base}${route}${state.hash}`, { waitUntil:'networkidle' });
        await page.waitForTimeout(350);
        assert.equal(await page.locator('html').getAttribute('data-age'), state.age);
        row.order = await verify(page, route, state.age);
        const baselineKey = `${viewport.width}:${route}`;
        const contents = await lessonOrder(page, route, state.age);
        if (!state.age) baselines.set(baselineKey, { contents, games: row.order });
        else {
          assert.deepEqual(contents[state.age], baselines.get(baselineKey).contents[state.age], 'lesson order unchanged');
          if (route === '/games' || route === '/learn/games') {
            const all = baselines.get(baselineKey).games;
            assert.deepEqual(row.order, all.filter(id => row.order.includes(id)), 'game order unchanged');
          }
        }
        row.cls = await page.evaluate(() => window.__ageCLS);
        row.shifts = await page.evaluate(() => window.__ageShifts);
        assert.equal(row.cls, 0, `CLS ${row.cls}`);
        assert.deepEqual(errors, []);
        const buttons = page.locator('[data-age-switch]:visible');
        assert.equal(await buttons.count(), state.age ? (route.includes('stories') ? 3 : 1) : 0);
        row.targets = await buttons.evaluateAll(els => els.map(el => {
          const b = el.getBoundingClientRect(); return { width:b.width, height:b.height, expanded:el.getAttribute('aria-expanded'), controls:el.getAttribute('aria-controls').split(' ').every(id => !!document.getElementById(id)) };
        }));
        for (const b of row.targets) { assert.ok(b.width >= 64 && b.height >= 64); assert.equal(b.expanded, 'false'); assert.ok(b.controls); }
        if (state.name === 'juniors' && ['/learn/moral'].includes(route)) {
          await page.screenshot({ path: `${out}/${route.split('/').pop()}-${viewport.width}-juniors.png`, fullPage:true });
        }
        if (state.hash) {
          const target = page.locator(state.hash);
          assert.ok(await target.count());
          const bounds = await target.boundingBox();
          assert.ok(bounds && bounds.y < viewport.height && bounds.y >= -1, `hash scroll y=${bounds?.y}`);
          assert.equal(await page.evaluate(() => localStorage.getItem('lu-age')), state.saved);
        }
        if (state.age) {
          const button = buttons.first();
          await button.focus();
          await page.keyboard.press('Tab');
          await page.keyboard.press('Shift+Tab');
          assert.ok(await button.evaluate(el => el === document.activeElement), 'keyboard returns to switch');
          assert.notEqual(await button.evaluate(el => getComputedStyle(el).outlineStyle), 'none', 'visible keyboard focus');
          await page.keyboard.press('Enter');
          const next = state.age === 'kids' ? 'juniors' : 'kids';
          await page.waitForTimeout(50);
          assert.equal(await page.evaluate(() => localStorage.getItem('lu-age')), next);
          await verify(page, route, next);
          assert.equal(await page.evaluate(() => document.activeElement === document.body), false, 'focus retained');
          row.keyboard = 'pass';
        }
        row.result = 'pass';
      } catch (e) { row.result = 'FAIL'; row.error = e.message; failures.push(row); }
      rows.push(row); console.log(`${row.result} ${row.viewport} ${route} ${state.name}${row.error ? ': '+row.error : ''}`);
      await context.close();
    }
  }
  // Direct and soft navigation, blocked storage, and subsequent same-page hashes.
  const context = await browser.newContext({ viewport: { width:390, height:844 }, reducedMotion:'reduce' });
  const page = await context.newPage();
  for (const age of ['kids','juniors']) {
    await page.goto(`${base}/${age}`, { waitUntil:'networkidle' });
    assert.equal(await page.evaluate(() => localStorage.getItem('lu-age')), age);
    await page.locator('a[href="/learn/moral#'+age+'"]').first().click();
    await page.waitForURL('**/learn/moral#'+age);
    await verify(page, '/learn/moral', age);
  }
  await page.locator('.mrl-age-btn-kids').click();
  await verify(page, '/learn/moral', 'kids');
  assert.equal(await page.evaluate(() => localStorage.getItem('lu-age')), 'kids');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'kids', 'hero selection focuses the opened section');
  await page.goBack();
  await page.waitForFunction(() => document.documentElement.dataset.age === 'juniors');
  await verify(page, '/learn/moral', 'juniors');
  assert.equal(await page.evaluate(() => localStorage.getItem('lu-age')), 'kids');
  await page.goto(`${base}/en/learn/moral`, { waitUntil:'networkidle' });
  assert.equal(await page.locator('[data-age-switch="juniors"]:visible').innerText(), 'View ages 7 and up');
  await page.evaluate(() => localStorage.setItem('lu-age', 'invalid'));
  await page.reload({ waitUntil:'networkidle' });
  await verify(page, '/learn/moral', null);
  const otherTab = await context.newPage();
  await otherTab.goto(`${base}/juniors`, { waitUntil:'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.age === 'juniors');
  await verify(page, '/learn/moral', 'juniors');
  await context.close();
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } }));
  const privatePage = await blocked.newPage();
  const blockedErrors = []; privatePage.on('pageerror', e => blockedErrors.push(e.message));
  await privatePage.goto(`${base}/learn/moral#kids`, { waitUntil:'networkidle' });
  await privatePage.locator('[data-age-switch="juniors"]:visible').click();
  await verify(privatePage, '/learn/moral', 'juniors');
  assert.deepEqual(blockedErrors, []);
  await blocked.close();
  const beforeHydration = await browser.newContext();
  await beforeHydration.addInitScript(() => localStorage.setItem('lu-age','juniors'));
  await beforeHydration.route(/\/_next\/static\/.*\.js(?:\?|$)/, route => route.abort());
  const staticPage = await beforeHydration.newPage();
  await staticPage.goto(`${base}/learn/moral`, { waitUntil:'domcontentloaded' });
  await verify(staticPage, '/learn/moral', 'juniors');
  await beforeHydration.close();
  const noJS = await browser.newContext({ javaScriptEnabled:false });
  const fallback = await noJS.newPage();
  await fallback.goto(`${base}/learn/moral`, { waitUntil:'domcontentloaded' });
  await verify(fallback, '/learn/moral', null);
  await noJS.close();
} catch (e) { failures.push({ extra: e.stack }); }
finally { await browser.close(); await writeFile(`${out}/browser-matrix.json`, JSON.stringify({ rows, failures }, null, 2)); }
console.log(`${rows.length} matrix rows; ${failures.length} failures`);
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exitCode = 1; }
