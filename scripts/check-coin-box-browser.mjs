import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe'});
const base=process.argv[2] || 'http://localhost:3131';
const shots='output/g-1/shots-fix1';
await mkdir(shots,{recursive:true});
// Both boards must be routed through the one shared shell, with no local header.
const player=await readFile('src/features/games/components/GamePlayer.tsx','utf8');
assert.match(player, /return <GameShell/);
assert.match(player, /game.slug === 'coin-box' \? CoinBoxBoard/);
assert.match(player, /game.slug === 'shape-match' \? ShapeBoard/);
assert.doesNotMatch(await readFile('src/features/games/games/CoinBoxBoard.tsx','utf8'), /<header|gc-game-header/);
assert.doesNotMatch(await readFile('src/features/games/coin-box.css','utf8'), /gc-game-header|ui-label/);
const headerStyle=page=>page.locator('.gc-game-header').evaluate(el=>{
 const h=el.querySelector('h1'), style=getComputedStyle(h);
 return {font:style.fontSize,secondary:getComputedStyle(h.querySelector('small')).fontSize,
 color:style.color,background:style.background,
 buttons:[...el.querySelectorAll('.ui-pill')].map(e=>e.className)};
});
async function compareHeader(page,context,width,height) {
 const coinStyle=await headerStyle(page);
 const coin=await page.screenshot({clip:{x:0,y:0,width,height:112},path:`${shots}/${width}x${height}-coin-header.png`});
 const shape=await context.newPage();
 await shape.goto(base+'/games/shape-match');
 await shape.locator('.gc-start-3d').click();
 await shape.locator('.shp-scene').waitFor();
 await shape.locator('.gc-countdown').waitFor({state:'detached'});
 await shape.screenshot({path:`${shots}/${width}x${height}-shape-match.png`});
 assert.deepEqual(coinStyle,await headerStyle(shape),'shared header appearance');
 // Shape's landscape rail uses display:contents and visually hides its title.
 const shapeHeader=await shape.screenshot({clip:{x:0,y:0,width,height:112},path:`${shots}/${width}x${height}-shape-header.png`});
 const sharp=require('sharp');
 const a=await sharp(coin).metadata(), b=await sharp(shapeHeader).metadata();
 await sharp({create:{width:Math.max(a.width,b.width),height:a.height+b.height+12,channels:4,background:'#ffffff'}})
 .composite([{input:coin,top:0,left:0},{input:shapeHeader,top:a.height+12,left:0}])
 .png().toFile(`${shots}/${width}x${height}-header-comparison.png`);
 await shape.close();
}

const results=[];
try {
 await Promise.all([[360,780],[390,844],[844,390],[768,1024],[1280,720]].filter(([w])=>!process.env.COIN_WIDTH || w===Number(process.env.COIN_WIDTH)).map(async ([width,height]) => {
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'});
  await context.addInitScript(()=>{localStorage.setItem('little-ummah:sound','off');let seed=42;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};});
  const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/games/coin-box');
  await page.locator('.gc-start-3d').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`${shots}/${width}x${height}-intro.png`});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight && document.documentElement.scrollWidth<=innerWidth),'intro fits viewport');
  await page.locator('.gc-start-3d').click();
  let previous=0;
  for(let level=1;level<=3;level++) {
   for(let round=1;round<=3;round++) {
    await page.waitForFunction(r=>document.querySelector('.cb-scene')?.dataset.round===String(r)&&document.querySelector('.cb-scene')?.dataset.phase==='ready',round);
    const target=Number(await page.locator('.cb-scene').getAttribute('data-target'));assert.notEqual(target,previous);previous=target;
    if(round===1) {
     // Repeated taps on an empty slot cannot select a coin or increase the count.
     await page.locator('[data-drop-id="coin-slot"]').click({clickCount:3});
     assert.equal(await page.locator('.cb-scene').getAttribute('data-count'),'0');
     assert.equal(await page.locator('[data-item-id="coin"]').getAttribute('aria-pressed'),'false');
     assert.equal(await page.locator('.cb-reserve').count(),3);
     if(level===1 && [844,1280].includes(width)) await compareHeader(page,context,width,height);
     await page.screenshot({path:`${shots}/${width}x${height}-level-${level}.png`});
     const geometry=await page.evaluate(()=>{
      const controls=[...document.querySelectorAll('.gc-game-header a,.gc-game-header button,.cb-scene button,.gc-bottom-controls button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {label:e.getAttribute('aria-label')||e.textContent,width:r.width,height:r.height,x:r.x,y:r.y,right:r.right,bottom:r.bottom,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,unobscured:e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};});
      return {controls,overflowX:document.documentElement.scrollWidth>innerWidth,overflowY:document.documentElement.scrollHeight>innerHeight};
     });results.push({width,height,level,...geometry});
     assert.ok(!geometry.overflowX&&!geometry.overflowY,JSON.stringify(geometry));
     for(const c of geometry.controls) {assert.ok(c.scrollHeight<=c.clientHeight && c.scrollWidth<=c.clientWidth,'overflowing button '+JSON.stringify(c));assert.ok(c.unobscured,'obscured '+JSON.stringify(c));assert.ok(c.width>=64&&c.height>=64,JSON.stringify(c));assert.ok(c.x>=0&&c.y>=0&&c.right<=width+1&&c.bottom<=height+1,JSON.stringify(c));}
    }
    for(let n=1;n<=target;n++) {
     await page.waitForFunction(()=>document.querySelector('.cb-scene')?.dataset.phase==='ready');
     const coin=page.locator('[data-item-id="coin"]'), slot=page.locator('[data-drop-id="coin-slot"]');
     if(n===1) {
      const a=await coin.boundingBox(),b=await slot.boundingBox();const cdp=await context.newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x+a.width/2,y:a.y+a.height/2}]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2}]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
     } else {await coin.focus();await page.keyboard.press('Enter');await slot.focus();await page.keyboard.press('Enter');}
     assert.equal(Number(await page.locator('.cb-scene').getAttribute('data-count')),n);
     assert.ok(await page.evaluate(()=>document.querySelector('.cb-counter').getBoundingClientRect().bottom<=document.querySelector('.cb-tray').getBoundingClientRect().top),'tray must not obscure counter');
     if(n===1 && round===1 && level===3) await page.screenshot({path:`${shots}/${width}x${height}-counting.png`});
    }
   }
   await page.waitForSelector('.gc-result');
   await page.screenshot({path:`${shots}/${width}x${height}-result-${level}.png`});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight && document.documentElement.scrollWidth<=innerWidth),'result fits viewport');
   const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('little-ummah:games:v1:coin-box')));
   assert.equal(progress.stars,level);assert.equal(progress.completedLevels.length,level);
   if(level<3) await page.locator('.gc-result-actions .gc-primary').click();
  }
  assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${width}x${height}`);
 }));
} finally {await writeFile('output/g-1/browser-results-fix1.json',JSON.stringify(results,null,2));await browser.close();}
if (!process.env.COIN_WIDTH) await import('./check-coin-box-resilience.mjs');
