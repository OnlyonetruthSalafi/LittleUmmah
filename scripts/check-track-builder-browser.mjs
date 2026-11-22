import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import railway from '../src/features/games/data/railway.json' with { type: 'json' };
import { landscapeProblems, measureLandscapePage } from './game-landscape-stage1.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ||
  'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const browser = await chromium.launch({ headless: true,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const base = process.argv[2] || 'http://localhost:3220';
const out = process.env.BROWSER_CHECK_OUT || 'output/track-builder';
await mkdir(out, { recursive: true });
const measurements = [];
const errors = [];
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('lu-games-guide-seen', '1');
    localStorage.setItem('little-ummah:sound', 'off');
    localStorage.setItem('lu-settings', JSON.stringify({ starsEnabled: false, timeEnabled: false, minutes: 90, seeded: true }));
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => errors.push(error.message));
  const sceneRequests = [];
  page.on('request', request => {
    if (new URL(request.url()).pathname.startsWith('/games/track-builder/')) sceneRequests.push(request.url());
  });
  await page.goto(base+'/games', {waitUntil:'networkidle'});
  const card = page.locator('a[href$="/games/track-builder"]').first();
  await card.scrollIntoViewIfNeeded();
  await card.locator('img').waitFor();
  await card.locator('img').evaluate(img => img.decode());
  const hubCover = await card.locator('img').evaluate(img => performance.getEntriesByName(img.currentSrc)[0]?.encodedBodySize);
  await card.tap();
  await page.locator('.gc-rotate').waitFor();
  assert.deepEqual(sceneRequests, [], 'The island and intro must not request play artwork');
  if (await page.evaluate(() => !!document.fullscreenElement)) await page.evaluate(() => document.exitFullscreen());
  await page.setViewportSize({ width:568, height:320 });
  await page.locator('.gc-rotate').waitFor({state:'detached'});
  await page.screenshot({path:out+'/instructions.png'});
  const cdp = await ctx.newCDPSession(page);
  for (const [i, route] of railway.routes.entries()) {
    await page.locator('.harbor-level').nth(i).click();
    if (!i) await cdp.send('Network.emulateNetworkConditions', {
      offline:false, latency:100, downloadThroughput:200000, uploadThroughput:100000,
    });
    await page.evaluate(() => performance.mark('rail-start'));
    await page.locator('.harbor-start').tap();
    await page.locator('.rail-window > img').evaluate(img => img.decode());
    await page.waitForFunction(() => performance.getEntriesByType('resource').some(r=>r.name.endsWith('/locomotive.webp')));
    const assetStats = await page.evaluate(() => {
      const start = performance.getEntriesByName('rail-start').at(-1).startTime;
      const art = performance.getEntriesByType('resource').filter(r => new URL(r.name).pathname.startsWith('/games/track-builder/') && r.startTime >= start);
      return { assets: art.map(r=>({ file:r.name.split('/').pop(), bytes:r.encodedBodySize })), lastAssetMs:Math.round(Math.max(...art.map(r=>r.responseEnd))-start) };
    });
    measurements.push({level:i+1, ...assetStats});
    assert.ok(!sceneRequests.some(url => railway.routes.slice(i+1).some(later=>url.endsWith('/'+later.scene+'.webp'))),'Future scenery must remain unloaded');
    if (!i) await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
    await page.locator('.gc-countdown').waitFor({state:'detached'});
    if (await page.evaluate(() => !!document.fullscreenElement)) await page.evaluate(() => document.exitFullscreen());
    for (const [width,height] of [[568,320],[844,390],[1280,720]]) {
      await page.setViewportSize({width,height}); await page.evaluate(()=>document.fonts.ready);
      const issues = landscapeProblems({slug:'track-builder', ...await page.evaluate(measureLandscapePage)});
      assert.deepEqual(issues, [], width+'x'+height+' level '+(i+1));
    }
    await page.screenshot({path:out+'/'+route.scene+'.png'});
    const first = route.steps[route.gaps[0]];
    await page.locator('[data-turn]:not([data-turn="'+first+'"])').first().tap();
    assert.equal(await page.locator('progress').getAttribute('value'),'0');
    for (const [j, span] of route.gaps.entries()) {
      const turn = page.locator('[data-turn="'+route.steps[span]+'"]');
      await turn.focus(); await page.keyboard.press('Enter');
      if (i===0 && j===0) {
        await page.setViewportSize({width:390,height:844});
        await page.locator('.gc-rotate').waitFor();
        const train = page.locator('.rail-map > g').last();
        const pose = await train.getAttribute('transform');
        await page.waitForTimeout(300);
        assert.equal(await train.getAttribute('transform'), pose);
        await page.setViewportSize({width:844,height:390});
      }
      if (j < route.gaps.length-1) await page.locator('.rail-game[data-moving="false"][data-laid="'+(j+1)+'"]').waitFor();
    }
    await page.locator('.gc-result').waitFor();
    if (i<2) await page.locator('.gc-result-actions .gc-primary').tap();
  }
  await page.goto(base+'/en/games/track-builder');
  assert.doesNotMatch(await page.locator('.harbor-intro').innerText(), /[\u0e00-\u0e7f]/);
  assert.deepEqual(errors, []);
  const result = {hubCoverBytes:hubCover, levels:measurements};
  await writeFile(out+'/network.json', JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
