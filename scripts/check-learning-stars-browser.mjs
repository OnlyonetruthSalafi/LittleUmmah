import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Load the TS data without Node's typeless-package warning on Windows shells.
const ts = require('typescript');
const catalog = ts.transpileModule(await fs.readFile(new URL('../src/features/games/data/catalog.ts', import.meta.url), 'utf8'), {compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {games} = await import('data:text/javascript;base64,'+Buffer.from(catalog).toString('base64'));
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const base = process.argv[2] || 'http://localhost:3160';
const out = 'output/ls-2';
await fs.mkdir(`${out}/shots`, {recursive:true});
const browser = await chromium.launch({headless:true,channel:'chrome'});
const results=[];
const check=(label,condition)=>{assert.ok(condition,label);results.push(label);console.log('PASS',label);};
const context=await browser.newContext({viewport:{width:1280,height:720},reducedMotion:'reduce'});
await context.addInitScript(()=>{localStorage.setItem('little-ummah:sound','off');});
const page=await context.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
await page.clock.install({time:new Date(2026,10,10,12)});
await page.clock.pauseAt(new Date(2026,10,10,12,0,1));
const advance=async ms=>{await page.clock.runFor(ms); await page.waitForTimeout(40);};
const goto=async path=>{await page.goto(base+path);await page.locator('main,article,.gh-page').first().waitFor();await advance(100);};
const state=()=>page.evaluate(()=>({stars:JSON.parse(localStorage.getItem('lu-ls-stars')),time:JSON.parse(localStorage.getItem('lu-ls-time')),settings:JSON.parse(localStorage.getItem('lu-settings'))}));
const shot1=async n=>{await fs.mkdir(`${out}/shots/fix1`,{recursive:true});await page.screenshot({path:`${out}/shots/fix1/${n}-1280x720.png`,fullPage:false});};
const start=async()=>{await page.locator('.gc-adventure-start').click();await advance(5000);};
async function solve() {
  const deck=await page.locator('.mem-face-front img').evaluateAll(imgs=>imgs.map(i=>{const u=new URL(i.src,location.href);return u.searchParams.get('url')||u.pathname;}));
  for(const src of new Set(deck)) {
    const ids=deck.flatMap((v,i)=>v===src?[i]:[]);
    await page.locator('.mem-card').nth(ids[0]).click();await page.locator('.mem-card').nth(ids[1]).click();await advance(1300);
  }
  await advance(2000);
}
async function gate(wrong=false) {
  const input=page.locator('#ls-answer');
  if(wrong) { const old=await page.locator('#ls-question').textContent();await input.fill('1');await page.locator('.ls-parent button[type=submit]').click();check('ParentGate wrong answer changes question',old!==await page.locator('#ls-question').textContent()); }
  const text=await page.locator('#ls-question').textContent();
  const tens=['สิบสอง','สิบสาม','สิบสี่','สิบห้า','สิบหก','สิบเจ็ด','สิบแปด','สิบเก้า'],words=['หก','เจ็ด','แปด','เก้า'];const th=text.split(/twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen/)[0];const pair=th.trim().split(' คูณ ');
  await input.fill(String((tens.indexOf(pair[0])+12)*(words.indexOf(pair[1])+6)));await page.locator('.ls-parent button[type=submit]').click();
}
try {
  await goto('/games/memory');check('starter stars = 3',(await state()).stars.balance===3);
  await start();check('first daily round is free',(await state()).stars.balance===3);
  await solve();check('pass consumes round credit',!(await state()).stars.activeRound);
  await page.locator('.gc-result-actions button').last().click();await advance(5000);check('next round spends one star',(await state()).stars.balance===2);
  await page.locator('.gc-bottom-controls button').last().click();await advance(5000);check('restart keeps credit',(await state()).stars.balance===2);
  await goto('/games');await goto('/games/memory');await start();check('exit and return keeps credit',(await state()).stars.balance===2);
  await solve();await page.locator('.gc-result-actions button').last().click();await advance(5000);check('new passed round requires another star',(await state()).stars.balance===1);
  await goto('/games');await goto('/games/memory');await start();
  await solve();await page.locator('.gc-result-actions button').last().click();await advance(5000);
  check('spending the last star shows the last-star badge',(await state()).stars.balance===0&&await page.locator('[data-ls-last]').isVisible());await shot1('fix1-last-star');
  await solve();check('result without stars shows go-learn panel and hides next/again',await page.locator('[data-ls-out]').isVisible()&&await page.locator('.gc-result-actions button').count()===0);await shot1('fix1-result-out');
  await goto('/games');check('hub says go learn first when out of stars',await page.locator('[data-ls-hub=empty] a').count()===1);await shot1('fix1-hub-empty');
  await goto('/games/memory');await page.locator('.gc-adventure-start').click();
  await page.locator('[data-ls-lock=stars]').waitFor();check('empty-stars screen tells the child to go learn first',(await page.locator('[data-ls-lock=stars]').textContent()).includes('ไปเรียนที่เกาะเรียนรู้เพื่อเก็บดาวก่อน'));check('empty stars show Nuri, 5 learning islands and a parent button',await page.locator('[data-ls-lock=stars] .ls-learn-tile').count()===5&&await page.locator('[data-ls-lock=stars] .ls-button').count()===1);
  // Real lesson finish, muted narration advances by its built-in reading durations.
  await goto('/learn/moral');
  await page.locator('.mrl-card').first().click();
  for(let i=0;i<30;i++) await advance(10000);
  check('moral lesson awards one star',(await state()).stars.balance===1);
  await goto('/learn/moral');await page.locator('.mrl-card').first().click();for(let i=0;i<30;i++) await advance(10000);
  check('same lesson same day does not award again',(await state()).stars.balance===1);
  await goto('/parents/settings');await page.getByRole('switch').nth(1).click();await gate(true);
  await page.locator('#ls-minutes').selectOption('15');await advance(20);
  // Clear time via gated setting; previous game visits are intentionally counted even with limit off.
  await page.getByRole('button',{name:/รีเซ็ตเวลาวันนี้/}).click();await advance(20);
  await goto('/games/memory');await start();await advance(13*60000);
  console.log("warning-state", JSON.stringify(await state()));
  check('two minute warning is recorded',(await state()).time.warned);
  await advance(2*60000);check('limit mid-level allows completion',await page.locator('[data-ls-lock=time]').count()===0);
  await page.getByRole('button',{name:/เริ่มใหม่/}).click();await advance(5000);check('restart during grace does not lock',await page.locator('[data-ls-lock=time]').count()===0);
  await solve();await page.locator('[data-ls-lock=time]').waitFor();check('time locks after level passes',true);
  await page.getByRole('button',{name:/สำหรับผู้ปกครอง/}).click();await advance(20);
  if(await page.locator('#ls-answer').count()) await gate();
  await page.getByRole('button',{name:/เพิ่ม 15 นาที/}).click();check('parent +15 unlocks',await page.locator('[data-ls-lock=time]').count()===0);await advance(100);check('focus returns into the game after unlock',await page.evaluate(()=>document.activeElement&&document.activeElement!==document.body));
  await goto('/learn/art');await advance(15*60000+5000);await page.locator('[data-ls-lock=time]').waitFor();check('art locks immediately',true);
  await goto('/learn/moral');check('learning island stays available',await page.locator('[data-ls-lock]').count()===0);
  await goto('/parents/settings');await page.getByRole('switch').nth(0).click();if(await page.locator('#ls-answer').count()) await gate();await advance(20);
  await page.getByRole('switch').nth(1).click();await advance(20);
  await goto('/games/memory');await start();check('both disabled allow play with zero stars',await page.locator('[data-status=playing]').count()===1);
  await goto('/parents/settings');await page.getByRole('button',{name:/ให้ดาว \+3/}).click();await gate();await advance(30);
  check('parent can grant three stars',(await state()).stars.balance===3);
  const beforeClear=await state();
  await page.getByRole('button',{name:/ล้างความคืบหน้า/}).click();await page.getByRole('button',{name:/กดอีกครั้ง/}).click();await advance(200);
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('lu-ls-stars'))?.balance===0);
  check('clear does not restore starter stars',(await state()).stars.balance===0 && (await state()).settings.seeded);
  check('clear preserves daily time, free-round date and settings',JSON.stringify((await state()).time)===JSON.stringify(beforeClear.time)&&(await state()).stars.freeDay===beforeClear.stars.freeDay&&JSON.stringify((await state()).settings)===JSON.stringify(beforeClear.settings));
  check('no page JS errors',errors.length===0);
  await context.close();
  const shared=await browser.newContext({reducedMotion:'reduce'});
  await shared.addInitScript(()=>{localStorage.setItem('little-ummah:sound','off');localStorage.setItem('lu-settings',JSON.stringify({starsEnabled:true,timeEnabled:true,minutes:90,seeded:true}));Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});});
  const tabs=await Promise.all([shared.newPage(),shared.newPage()]);
  for(const p of tabs) {await p.clock.install({time:new Date(2026,10,10,12)});await p.clock.pauseAt(new Date(2026,10,10,12,0,1));await p.goto(base+'/games');await p.locator('[data-ls-balance]').waitFor();}
  await tabs[0].clock.runFor(60000);await tabs[0].waitForTimeout(100);
  const used=await tabs[0].evaluate(()=>JSON.parse(localStorage.getItem('lu-ls-time')).used);
  console.log('shared-used',used);
  check('two visible tabs count overlapping minute only once',used>=59000&&used<=61000);
  for(const p of tabs) await p.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
  await tabs[0].clock.runFor(60000);await tabs[0].waitForTimeout(60);
  check('hidden tab does not count time',await tabs[0].evaluate(()=>JSON.parse(localStorage.getItem('lu-ls-time')).used)===used);
  await tabs[1].evaluate(()=>{const s=JSON.parse(localStorage.getItem('lu-settings'));s.starsEnabled=false;localStorage.setItem('lu-settings',JSON.stringify(s));});
  await tabs[0].goto(base+'/games/memory');await tabs[0].locator('.gc-adventure-start').click();await tabs[0].clock.runFor(5000);
  check('settings shared between tabs',await tabs[0].locator('[data-status=playing]').count()===1);
  await shared.close();
  const entryCtx=await browser.newContext({viewport:{width:1280,height:720},reducedMotion:'reduce'});
  await entryCtx.addInitScript(()=>{localStorage.setItem('little-ummah:sound','off');localStorage.setItem('lu-settings',JSON.stringify({starsEnabled:true,timeEnabled:false,minutes:15,seeded:true}));localStorage.setItem('lu-ls-stars',JSON.stringify({balance:0,earnedDay:'2026-11-10',earned:[],activeRound:false,freeDay:'2026-11-10'}));});
  const ep=await entryCtx.newPage();await ep.clock.install({time:new Date(2026,10,10,12)});await ep.clock.pauseAt(new Date(2026,10,10,12,0,1));
  for(const game of games.filter(g=>g.enabled)) {
    await ep.goto(base+'/games/'+game.slug);await ep.locator('.gc-start-3d,.gc-adventure-start,.lmt-skip').first().click();
    await ep.locator('[data-ls-lock=stars]').waitFor();
    check(`direct ${game.slug} entry denies empty stars before countdown/fullscreen`,await ep.locator('.gc-countdown').count()===0&&!await ep.evaluate(()=>!!document.fullscreenElement));
  }
  for(const difficulty of ['easy','hard']) {
    await ep.goto(base+'/learn/games/memory/'+difficulty);await ep.getByRole('button',{name:/เริ่มเล่น|เริ่มเกม/}).click();await ep.locator('[data-ls-lock=stars]').waitFor();check(`legacy memory ${difficulty} is gated`,true);
  }
  await ep.evaluate(()=>{const s=JSON.parse(localStorage.getItem('lu-settings'));s.timeEnabled=true;localStorage.setItem('lu-settings',JSON.stringify(s));localStorage.setItem('lu-ls-stars',JSON.stringify({balance:0,earnedDay:'2026-11-10',earned:[],activeRound:true,freeDay:'2026-11-10'}));localStorage.setItem('lu-ls-time',JSON.stringify({day:'2026-11-10',used:14*60000,extra:0,unlimited:false,warned:false}));});
  // addInitScript above sets only star settings, so set the limit after navigation.
  await ep.goto(base+'/games/memory');
  await ep.evaluate(()=>{const s=JSON.parse(localStorage.getItem('lu-settings'));s.timeEnabled=true;localStorage.setItem('lu-settings',JSON.stringify(s));const a=JSON.parse(localStorage.getItem('lu-ls-stars'));a.activeRound=true;localStorage.setItem('lu-ls-stars',JSON.stringify(a));});
  await ep.locator('.gc-adventure-start').click();await ep.clock.runFor(6*60000+1000);await ep.waitForTimeout(100);await ep.locator('[data-ls-lock=time]').waitFor();check('unfinished level locks at maximum five minute grace',true);
  await entryCtx.close();
  const broken=await browser.newContext();await broken.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('private storage');}});});
  const bp=await broken.newPage();await bp.clock.install();await bp.goto(base+'/games/memory');await bp.locator('.gc-adventure-start').click();await bp.clock.runFor(5000);
  check('storage failure allows unlimited play',await bp.locator('[data-status=playing]').count()===1&&await bp.locator('[data-ls-lock]').count()===0);await broken.close();
  // Each screenshot is an independently seeded visual state; flow assertions above use real controls.
  for(const [width,height] of [[360,780],[390,844],[844,390],[768,1024],[1280,720]]) {
    const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<1000,reducedMotion:'reduce'});
    const p=await ctx.newPage();await p.clock.install({time:new Date(2026,10,10,12)});await p.clock.pauseAt(new Date(2026,10,10,12,0,1));
    await p.goto(base+'/parents');
    const set=async(mode)=>{await p.evaluate(mode=>{
      localStorage.setItem('little-ummah:sound','off');
      localStorage.setItem('lu-settings',JSON.stringify({starsEnabled:true,timeEnabled:mode==='time',minutes:15,seeded:true}));
      localStorage.setItem('lu-ls-stars',JSON.stringify({balance:mode==='empty'?0:mode==='one'?1:3,earnedDay:'2026-11-10',earned:[],activeRound:mode==='credit',freeDay:mode==='free'?'':'2026-11-10'}));
      localStorage.setItem('lu-ls-time',JSON.stringify({day:'2026-11-10',used:mode==='time'?900000:0,extra:0,unlimited:false,warned:false}));
    },mode);};
    const shot=async(name)=>{await p.clock.runFor(200); await p.screenshot({path:`${out}/shots/${name}-${width}x${height}.png`,fullPage:true}); const m=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,buttons:[...document.querySelectorAll('.ls-button,.ls-learn-tile,.ls-input,.ls-settings select')].filter(e=>e.getClientRects().length).map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,parent:!!e.closest('.ls-parent')}))}));check(`${name} ${width}x${height}: no horizontal overflow`,!m.overflow);for(const b of m.buttons)check(`${name} button ${b.parent?48:64}px`,Math.min(b.w,b.h)>=(b.parent?48:64)-.5);};
    await set('free');await p.goto(base+'/games');await shot('hub');
    for(const mode of ['free','star','credit']) {await set(mode);await p.goto(base+'/games/memory');await shot('intro-'+mode);}
    await set('empty');await p.goto(base+'/games/memory');await p.locator('.gc-adventure-start').click();await shot('empty');
    await p.getByRole('button',{name:/สำหรับผู้ปกครอง/}).click();await shot('parent-gate');
    await set('empty');await p.goto(base+'/games');await shot('fix1/hub-empty');
    await set('one');await p.goto(base+'/games');await shot('fix1/hub-one');await p.goto(base+'/games/memory');await p.locator('.gc-adventure-start').click();await p.clock.runFor(5000);check(`last-star badge ${width}x${height}`,await p.locator('[data-ls-last]').isVisible());await shot('fix1/last-star');
    { const deck=await p.locator('.mem-face-front img').evaluateAll(imgs=>imgs.map(i=>{const u=new URL(i.src,location.href);return u.searchParams.get('url')||u.pathname;}));
      for(const src of new Set(deck)){const ids=deck.flatMap((v,i)=>v===src?[i]:[]);await p.locator('.mem-card').nth(ids[0]).click();await p.locator('.mem-card').nth(ids[1]).click();await p.clock.runFor(1300);}
      await p.clock.runFor(2000);check(`result-out panel ${width}x${height}`,await p.locator('[data-ls-out]').isVisible());await shot('fix1/result-out'); }
    await set('time');await p.goto(base+'/games/memory');await shot('time');
    if(width===844) { await p.locator('[data-ls-lock=time] h2').click();await p.evaluate(()=>document.documentElement.requestFullscreen());check('overlay inside fullscreen element',await p.evaluate(()=>document.fullscreenElement.contains(document.querySelector('[data-ls-lock=time]'))));await shot('fullscreen-time');await p.evaluate(()=>document.exitFullscreen()); }
    for(const route of ['parents','parents/settings','parents/evidence']) {await p.goto(base+'/'+route);await shot(route.replaceAll('/','-'));}
    await ctx.close();
  }
  await fs.writeFile(`${out}/browser-results.json`,JSON.stringify({passed:results,errors},null,2));
} catch(e) { await fs.writeFile(`${out}/browser-failure.txt`,String(e.stack));await page.screenshot({path:`${out}/failure.png`,fullPage:true}).catch(()=>{});throw e; }
finally {await browser.close();}
