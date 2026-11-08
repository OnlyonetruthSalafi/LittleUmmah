import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { BEAD_LEVELS } from '../src/features/games/data/beadLacing.ts';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const base=(process.argv[2]&&!process.argv[2].startsWith('-')?process.argv[2]:process.env.BASE_URL||'http://localhost:3132').replace(/\/+$/,''),out='output/g-2/shots-fix1';
await mkdir(out,{recursive:true});const measurements=[],errors=[];
// Navigate only through real keyboard events; never repair focus from the test.
async function tabTo(page, selector) {
 for(let n=0;n<24;n++) {
  if(await page.locator(selector).first().evaluate(el=>el===document.activeElement)) return;
  await page.keyboard.press('Tab');
  await assertVisibleFocus(page);
 }
 assert.fail(`Tab could not reach ${selector}`);
}
async function assertVisibleFocus(page) {
 const state=await page.evaluate(()=>{
  const el=document.activeElement;
  if(el===document.body) return {body:true};
  const r=el.getBoundingClientRect();
  let clipped=false;
  for(let e=el;e;e=e.parentElement){const s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden'||s.clipPath!=='none')clipped=true;}
  return {body:false,clipped,width:r.width,height:r.height,x:r.x,y:r.y,outline:getComputedStyle(el).outlineStyle};
 });
 if(state.body)return; // Browser chrome between the last and first Tab stops.
 assert.ok(!state.clipped&&state.width>=64&&state.height>=64,`invisible/small Tab stop ${JSON.stringify(state)}`);
 assert.notEqual(state.outline,'none','keyboard focus indicator');
}
async function assertRoundFocus(page) {
 await page.waitForFunction(()=>document.activeElement===document.querySelector('[data-item-id]'));
 await assertVisibleFocus(page);
}
async function drag(page,context,id,touch){
 const piece=page.locator(`[data-item-id="${id}"]`),tip=page.locator('.bl-tip');await piece.waitFor();await page.waitForFunction(()=>!document.querySelector('.bl-tip').disabled);
 const a=await piece.boundingBox(),b=await tip.boundingBox(),from={x:a.x+a.width/2,y:a.y+a.height/2},to={x:b.x+b.width/2,y:b.y+b.height/2};
 if(touch){const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...from,id:1}]});for(let n=1;n<=10;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*n/10,y:from.y+(to.y-from.y)*n/10,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
 else {await tabTo(page,`[data-item-id="${id}"]`);await page.keyboard.press('Enter');await tabTo(page,'.bl-tip');await page.keyboard.press('Enter');}
 if(!touch && await page.locator('.bl-scene').getAttribute('data-done')!=='true') await assertRoundFocus(page);
}
try{
await Promise.all([[360,780],[390,844],[844,390],[768,1024],[1280,720]].map(async ([w,h])=>{
 const context=await browser.newContext({viewport:{width:w,height:h},hasTouch:w!==1280,reducedMotion:w===360?'reduce':'no-preference'});const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/games/bead-lacing`);
 await page.locator('.gc-voice-scene img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
 await page.screenshot({path:`${out}/${w}x${h}-intro.png`});
 for(const b of await page.locator('.gc-voice-actions button').all()){const r=await b.boundingBox();assert.ok(r.width>=64&&r.height>=64&&r.y>=0&&r.y+r.height<=h+1,'intro controls fit');}
 await tabTo(page,'.gc-start-3d');await page.keyboard.press('Enter');await page.locator('.gc-countdown').waitFor({state:'detached',timeout:15000});
 for(let level=1;level<=3;level++){
  for(let ri=0;ri<3;ri++){
   const r=BEAD_LEVELS[level-1][ri];await page.waitForFunction(({level,round})=>{const el=document.querySelector('.bl-scene');return el?.dataset.level===String(level)&&el?.dataset.round===String(round);},{level,round:ri+1});
   await page.locator('.bl-scene img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
   if(w===1280)await assertRoundFocus(page);
   assert.equal(await page.locator('.gc-instruction button:visible').count(),0,'hidden listen control removed from Tab order');
   // Every distinct pattern bead must also have a distinct shape (no color-only slots).
   const shapeIds=new Map();
   for(const id of r.pattern){const shape=id.split('-')[1];assert.ok(!shapeIds.has(shape)||shapeIds.get(shape)===id,`color-only pattern ${level}/${ri+1}`);shapeIds.set(shape,id);}
   const shown=await page.locator('.bl-pattern li img').evaluateAll(els=>els.map(e=>e.getAttribute('src').split('/').pop().replace('.webp','')));
   assert.deepEqual(shown,r.pattern.slice(0,level===3?r.prefilled:r.pattern.length));
   const dims=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight}));
   assert.ok(dims.scrollWidth<=w&&dims.scrollHeight<=h,`overflow ${JSON.stringify(dims)}`);
   const rects=await page.locator('main button:visible, main a.ui-pill:visible').evaluateAll(els=>els.map(e=>({name:e.getAttribute('aria-label')||e.textContent, ...Object.fromEntries(['x','y','width','height'].map(k=>[k,e.getBoundingClientRect()[k]]))})));
   for(const r of rects){assert.ok(r.width>=63.9&&r.height>=63.9,`target under 64 ${w} ${JSON.stringify(r)}`);assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=w+1&&r.y+r.height<=h+1,`off screen ${JSON.stringify(r)}`);}
   measurements.push({w,h,level,round:ri+1,rects});
   const ratio=await page.locator('.bl-island').boundingBox();assert.ok(Math.abs(ratio.width/ratio.height-1.5)<.01,'source aspect ratio preserved');
   if(ri===0||ri===2)await page.screenshot({path:`${out}/${w}x${h}-level-${level}-round-${ri+1}.png`});
   if(level===3)assert.equal(await page.locator('.bl-question').count(),r.pattern.length-r.prefilled);
   const wrong=r.choices.find(id=>id!==r.pattern[r.prefilled]);await drag(page,context,wrong,w!==1280);
   assert.equal(await page.locator('.bl-scene').getAttribute('data-placed'),String(r.prefilled));assert.equal(await page.locator('.bl-pattern [data-hint]').count(),1);
   for(let i=r.prefilled;i<r.pattern.length;i++){
    await drag(page,context,r.pattern[i],w!==1280);
    assert.equal(await page.locator('.bl-scene').getAttribute('data-placed'),String(i+1),`drop ${w} ${level}/${ri}/${i}`);
   }
  }
  await page.locator('.gc-result').waitFor();
  for(const b of await page.locator('.gc-result-actions .gc-button').all()){const r=await b.boundingBox();assert.ok(r.width>=64&&r.height>=64&&r.y+r.height<=h+1,'result controls fit');}
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('little-ummah:games:v1:bead-lacing')));assert.equal(saved.stars,level);
  if(level<3){await tabTo(page,'.gc-result-actions .gc-primary');await page.keyboard.press('Enter');await page.locator('.gc-countdown').waitFor({state:'detached',timeout:10000});}
 }
 await page.screenshot({path:`${out}/${w}x${h}-complete.png`});
 await page.reload();await tabTo(page,'.gc-start-3d');await page.keyboard.press('Enter');await page.locator('.gc-countdown').waitFor({state:'detached',timeout:10000});
 assert.equal(await page.locator('.bl-scene').getAttribute('data-level'),'1');
 await drag(page,context,BEAD_LEVELS[0][0].pattern[0],w!==1280);
 await tabTo(page,'.gc-bottom-controls .gc-button');await page.keyboard.press('Enter');await page.locator('.gc-countdown').waitFor({state:'detached',timeout:10000});
 assert.equal(await page.locator('.bl-scene').getAttribute('data-placed'),'0');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('little-ummah:games:v1:bead-lacing')).stars),3);
 await context.close();console.log(`PASS ${w}x${h}: all 9 rounds, touch/keyboard, targets, 3 stars`);
}));
// Delayed artwork retains dimensions, targets and independent selection.
const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const p=await c.newPage();await p.route('**/games/bead-lacing/*.webp',async route=>{await new Promise(r=>setTimeout(r,2500));await route.continue();});await p.goto(`${base}/games/bead-lacing`);await p.locator('.gc-start-3d').click();await p.locator('.bl-scene').waitFor();const before=await p.locator('.bl-tip').boundingBox();await p.locator('.bl-scene img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));const after=await p.locator('.bl-tip').boundingBox();assert.deepEqual(after,before);await c.close();
assert.deepEqual(errors,[]);await writeFile('output/g-2/browser-measurements-fix1.json',JSON.stringify(measurements,null,2));
}finally{await browser.close();}
