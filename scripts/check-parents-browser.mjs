import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'file:///C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs');
const base = process.argv[2] || 'http://localhost:3173';
const out = 'output/par-1';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const rows = [], failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
try {
  for (const locale of ['', '/en']) for (const route of ['', '/curriculum', '/progress', '/privacy', '/sponsors']) for (const [width, height] of [[360, 780], [390, 844], [1024, 768]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    // Capture every attempted storage mutation, including calls from shared layout.
    await page.addInitScript(() => {
      window.__storageWrites = [];
      window.__cls = 0;
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
      for (const name of ['setItem', 'removeItem', 'clear']) {
        const original = Storage.prototype[name];
        Storage.prototype[name] = function (...args) { window.__storageWrites.push([name, ...args]); return original.apply(this, args); };
      }
    });
    const path = `${locale}/parents${route}`;
    const response = await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    if (route === '/progress') await page.locator('[data-progress-ready]').waitFor();
    if (route === '/curriculum') await page.locator('details').evaluateAll(nodes => nodes.forEach(node => { node.open = true; }));
    const metrics = await page.evaluate(() => {
      const article = document.querySelector('article');
      const visible = el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
      const small = [...article.querySelectorAll('a,button,summary')].filter(visible).map(el => ({ text: el.textContent.trim(), w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height })).filter(r => r.w < 48 || r.h < 48);
      const headings = [...article.querySelectorAll('h1,h2,h3,h4')].filter(visible).map(e => Number(e.tagName[1]));
      const rgb = value => value.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
      const lum = c => c.slice(0, 3).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
      const lowContrast = [];
      for (const el of [article, ...article.querySelectorAll('*')].filter(visible)) {
        if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
        const style = getComputedStyle(el), fg = rgb(style.color); let bg = [255, 255, 255];
        const ancestors = []; for (let p = el; p; p = p.parentElement) ancestors.unshift(p);
        for (const p of ancestors) { const c = rgb(getComputedStyle(p).backgroundColor), a = c[3] ?? 1; bg = bg.map((v, i) => c[i] * a + v * (1 - a)); }
        const ratio = (Math.max(lum(fg), lum(bg)) + .05) / (Math.min(lum(fg), lum(bg)) + .05);
        if (ratio < 4.5) lowContrast.push({ text: el.textContent.slice(0, 60), ratio });
      }
      return { overflow: document.documentElement.scrollWidth > innerWidth, small, headings, lowContrast, writes: window.__storageWrites, cls: window.__cls };
    });
    check(response.status() === 200, `${path} ${width}: HTTP ${response.status()}`);
    check(!metrics.overflow, `${path} ${width}: overflow`);
    check(!metrics.small.length, `${path} ${width}: small targets ${JSON.stringify(metrics.small)}`);
    check(!metrics.lowContrast.length, `${path} ${width}: contrast ${JSON.stringify(metrics.lowContrast)}`);
    check(metrics.headings[0] === 1 && metrics.headings.every((n, i, a) => !i || n <= a[i - 1] + 1), `${path} ${width}: headings`);
    check(!errors.length, `${path} ${width}: console ${errors.join('; ')}`);
    if (route === '/progress') check(metrics.cls <= .1, `${path} ${width}: CLS ${metrics.cls}`);
    if (route === '/progress') { check(!metrics.writes.length, `${path} ${width}: storage writes`); check(await page.locator('[data-empty]').count() === 1, `${path}: empty state`); }
    check((await page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '')).includes('noindex') === !!locale, `${path}: indexing`);
    const focusTargets = page.locator('article a,article button,article summary');
    const focusIssues = [];
    for (let i = 0; i < await focusTargets.count(); i++) {
      const target = focusTargets.nth(i); if (!await target.isVisible()) continue;
      await target.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
      const visible = await target.evaluate(el => { const s = getComputedStyle(el); return document.activeElement === el && ((s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none'); });
      if (!visible) focusIssues.push(await target.textContent());
    }
    check(!focusIssues.length, `${path} ${width}: focus ${focusIssues.join()}`);
    if (route === '/curriculum') {
      if (width === 390) await page.screenshot({ path: `${out}/${locale ? 'en' : 'th'}-curriculum-expanded.png`, fullPage: true });
      await page.locator('details').evaluateAll(nodes => nodes.forEach(node => { node.open = false; }));
      const summary = page.locator('summary').first(); await summary.focus(); await page.keyboard.press('Enter');
      check(await page.locator('details').first().getAttribute('open') !== null, `${path}: keyboard details`);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path}: expanded overflow`);
      await page.keyboard.press('Enter');
    }
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
    if (width === 390) await page.screenshot({ path: `${out}/${locale ? 'en' : 'th'}-parents${route.replace('/', '-')}.png`, fullPage: true });
    rows.push({ path, width, height, ...metrics, errors, focusIssues });
    console.log(`checked ${path} ${width}x${height}`);
    await page.close();
  }
  // Real localStorage formats: valid, malformed and inaccessible; no mutations.
  for (const locale of ['', '/en']) for (const kind of ['valid', 'corrupt', 'blocked']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(kind => {
      const date = new Date(), day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (kind === 'valid') {
        localStorage.setItem('lu-moral-progress', JSON.stringify({ salam: [day] }));
        localStorage.setItem('lu-arabic-learned-v1', 'alif,ba');
        localStorage.setItem('little-ummah:games:v1:puzzle:flower-garden', JSON.stringify({ levelStars: { 1: 2 } }));
        localStorage.setItem('lu-settings', JSON.stringify({ starsEnabled: true, timeEnabled: true, minutes: 30, seeded: true }));
        localStorage.setItem('lu-ls-stars', JSON.stringify({ balance: 7, earnedDay: day, earned: ['story:nuh'], activeRound: false, freeDay: '' }));
        localStorage.setItem('lu-ls-time', JSON.stringify({ day, used: 120000, extra: 0, unlimited: false, warned: false }));
      } else if (kind === 'corrupt') for (const key of ['lu-moral-progress', 'lu-settings', 'lu-ls-stars', 'lu-ls-time', 'lu-arabic-learned-v1', 'little-ummah:games:v1:puzzle']) localStorage.setItem(key, '{bad');
      window.__before = JSON.stringify({ ...localStorage }); window.__writes = [];
      Storage.prototype.setItem = function (...args) { window.__writes.push(args); };
      if (kind === 'blocked') Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
    }, kind);
    await page.goto(`${base}${locale}/parents/progress`, { waitUntil: 'networkidle' });
    await page.locator('[data-progress-ready]').waitFor();
    if (kind === 'valid') {
      check((await page.locator('[data-progress-island="moral"]').textContent()).includes('Say Salam'), `${locale}: moral lesson name`);
      check((await page.locator('[data-progress-island="arabic"]').textContent()).includes('Alif'), `${locale}: learned Alif`);
      check((await page.locator('[data-progress-island="games"]').textContent()).includes('Potted flower garden'), `${locale}: puzzle name`);
      check(await page.locator('dd').allTextContents().then(v => v.join(',') === '7,2'), `${locale}: stars/time`);
      check((await page.locator('[data-progress-island="stories"]').textContent()).includes('Nuh'), `${locale}: story name`);
      await page.screenshot({ path: `${out}/${locale ? 'en' : 'th'}-progress-populated.png`, fullPage: true });
    } else check(await page.locator('[data-empty]').count() === 1, `${locale} ${kind}: empty state`);
    check(await page.evaluate(() => window.__writes.length === 0), `${locale} ${kind}: no writes`);
    if (kind !== 'blocked') check(await page.evaluate(() => JSON.stringify({ ...localStorage }) === window.__before), `${locale} ${kind}: storage unchanged`);
    check(!errors.length, `${locale} ${kind}: errors ${errors.join()}`);
    rows.push({ path: `${locale}/parents/progress`, scenario: kind, errors }); await page.close();
  }
} finally {
  await browser.close();
  await writeFile(`${out}/browser-results.json`, JSON.stringify({ rows, failures }, null, 2));
}
console.log(JSON.stringify({ checks: rows.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
