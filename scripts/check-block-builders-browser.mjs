import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { BUILD_ART } from '../src/features/games/data/blockBuildersArt.ts';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const sharp=require('sharp');
const base=process.argv[2]||process.env.BASE_URL||'http://localhost:3134';
const shots='output/g-4/shots';await mkdir(shots,{recursive:true});
process.env.CHROME_LOG_FILE=resolve('output/g-4/chromium.log');
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE||'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe'});
const results=[];
async function geometry(page,tag){
  const g=await page.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
    const shown=e=>e.getBoundingClientRect().width>0;
    const controls=[...document.querySelectorAll('main button,main a')].filter(shown).map(e=>{const r=rect(e);return{...r,label:e.getAttribute('aria-label')||e.textContent,overflow:e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1,unobscured:e.contains(document.elementFromPoint(r.x+r.w/2,r.y+r.h/2))};});
    const labels=[...document.querySelectorAll('.bb-goal,.bb-status,.bb-piece>span,.gc-audio-note')].filter(shown).map(e=>({...rect(e),text:e.textContent,overflow:e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1}));
    const blocks=[...document.querySelectorAll('.bb-slot')].map(rect);
    const luminance=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    const contrast=[...document.querySelectorAll('.bb-goal,.bb-status,.bb-tray,.gc-audio-note')].map(e=>{const fg=getComputedStyle(e).color.match(/[\d.]+/g).map(Number),bg=getComputedStyle(e).backgroundColor.match(/[\d.]+/g).map(Number);return{alpha:bg[3]??1,ratio:(Math.max(luminance(fg),luminance(bg))+.05)/(Math.min(luminance(fg),luminance(bg))+.05)};});
    return{plan:document.querySelector('.bb-scene')?.dataset.plan,island:document.querySelector('.bb-island')?rect(document.querySelector('.bb-island')):null,width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,controls,labels,blocks,contrast};
  });results.push({tag,...g});
  await page.screenshot({path:`${shots}/${tag}.png`});
  assert.ok(g.scrollWidth<=g.width&&g.scrollHeight<=g.height,`${tag}: page overflow ${g.scrollWidth}x${g.scrollHeight}`);
  for(const c of g.controls){assert.ok(c.w>=63.99&&c.h>=63.99,`${tag}: target below 64 ${JSON.stringify(c)}`);assert.ok(c.x>=-1&&c.y>=-1&&c.right<=g.width+1&&c.bottom<=g.height+1,`${tag}: offscreen ${JSON.stringify(c)}`);assert.ok(!c.overflow,`${tag}: control overflow ${JSON.stringify(c)}`);assert.ok(c.unobscured,`${tag}: obscured ${JSON.stringify(c)}`);}
  const overlap=(a,b)=>a.x<b.right-.5&&a.right>b.x+.5&&a.y<b.bottom-.5&&a.bottom>b.y+.5;
  for(const l of g.labels){assert.ok(!l.overflow,`${tag}: label overflow ${l.text}`);for(const b of g.blocks)assert.ok(!overlap(l,b),`${tag}: label overlaps block ${l.text}`);if(g.island)assert.ok(!overlap(l,g.island),`${tag}: label overlaps island ${l.text}`);}
  for(let i=0;i<g.blocks.length;i++)for(let j=i+1;j<g.blocks.length;j++)assert.ok(!overlap(g.blocks[i],g.blocks[j]),`${tag}: overlapping slots`);
  if(g.island)for(const b of g.blocks){
    assert.ok(b.x>=g.island.x+g.island.w*BUILD_ART.left/100-1&&b.right<=g.island.x+g.island.w*BUILD_ART.right/100+1,`${tag}: outside measured courtyard width`);
    assert.ok(b.bottom<=g.island.y+g.island.h*BUILD_ART.ground/100+1,`${tag}: block below measured ground`);
  }
  if(g.island&&g.blocks.length){
    assert.ok(Math.abs(g.island.w/g.island.h-BUILD_ART.aspect)<.01,`${tag}: island must retain its camera proportions`);
    assert.ok(Math.abs(Math.max(...g.blocks.map(b=>b.bottom))-(g.island.y+g.island.h*BUILD_ART.ground/100))<1,`${tag}: building must touch the measured courtyard`);
    assert.equal(await page.locator('.bb-slot').first().evaluate(e=>getComputedStyle(e).borderStyle),'none',`${tag}: ghost blocks instead of UI boxes`);
  }
  for(const c of g.contrast){assert.equal(c.alpha,1);assert.ok(c.ratio>=4.5,`${tag}: contrast ${c.ratio}`);}
}
async function keyboard(page,selector){
  for(let i=0;i<60;i++){
    if(await page.locator(selector).first().evaluate(el=>el===document.activeElement)){await page.keyboard.press('Enter');await page.evaluate(()=>new Promise(requestAnimationFrame));return;}
    await page.keyboard.press('Tab');
  }assert.fail(`Tab cannot reach ${selector}`);
}
async function place(page,context,shape,slot,method='keyboard'){
  const source=page.locator(`[data-item-id="${shape}"]`),target=page.locator(`[data-drop-id="${slot}"]`);
  if(method==='touch'){
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const {a,b}=await page.evaluate(({shape,slot})=>{const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};return{a:rect(document.querySelector(`[data-item-id="${shape}"]`)),b:rect(document.querySelector(`[data-drop-id="${slot}"]`))};},{shape,slot});const cdp=await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x+a.width/2,y:a.y+a.height/2}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
  }else if(method==='tap'){await source.tap();await page.waitForFunction(shape=>document.querySelector(`[data-item-id="${shape}"]`)?.getAttribute('aria-pressed')==='true',shape,{timeout:2000});await target.tap();}
  else{await keyboard(page,`[data-item-id="${shape}"]`);await keyboard(page,`[data-drop-id="${slot}"]`);}
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
async function start(page){await page.goto(base+'/games/block-builders');await page.locator('.gc-start-3d').waitFor();await page.evaluate(()=>document.fonts.ready);await keyboard(page,'.gc-start-3d');await page.locator('.bb-scene').waitFor();await page.locator('.gc-countdown').waitFor({state:'detached'});await page.waitForTimeout(2000);}
const style=page=>page.locator('.gc-game-header').evaluate(el=>{const h=el.querySelector('h1'),s=getComputedStyle(h),p=getComputedStyle(document.querySelector('.gc-progress-row'));return{font:s.fontSize,sub:getComputedStyle(h.querySelector('small')).fontSize,color:s.color,background:s.background,border:s.border,buttons:[...el.querySelectorAll('.ui-pill')].map(e=>e.className),progress:{font:p.fontSize,color:p.color,background:p.background,padding:p.padding}};});
async function header(page,context,tag,width){
  const current=await style(page),a=await page.screenshot({clip:{x:0,y:0,width,height:150}});
  const other=await context.newPage();await other.goto(base+'/games/balance-scale');await other.locator('.gc-start-3d').click();await other.locator('.bs-scene').waitFor();await other.locator('.gc-countdown').waitFor({state:'detached'});
  assert.deepEqual(await style(other),current,`${tag}: shared balance-scale header/progress`);
  const b=await other.screenshot({clip:{x:0,y:0,width,height:150}});await sharp({create:{width,height:312,channels:4,background:'#fff'}}).composite([{input:a,left:0,top:0},{input:b,left:0,top:162}]).png().toFile(`${shots}/${tag}-header-comparison.png`);await other.close();
}
async function journey(page,context,tag,{touch=true}={}){
  for(let level=1;level<=3;level++){
    for(let round=1;round<=3;round++){
      await page.waitForFunction(r=>document.querySelector('.bb-scene')?.dataset.round===String(r)&&document.querySelector('.bb-scene')?.dataset.phase==='ready',round);await page.locator('.gc-countdown').waitFor({state:'detached'});
      if(round===1)await page.waitForTimeout(2000);
      const scene=page.locator('.bb-scene');
      if(round===1){const old=await scene.getAttribute('data-plan');await keyboard(page,'[data-new-round]');assert.notEqual(await scene.getAttribute('data-plan'),old);assert.equal(await scene.getAttribute('data-round'),String(round));await page.waitForTimeout(2050);}
      if(level===2&&round===1)await geometry(page,`${tag}-reference-start`);
      const slots=await page.locator('[data-drop-id]').evaluateAll(es=>es.map(e=>({id:e.dataset.dropId,shape:e.dataset.shape,supports:e.dataset.supports.split(',').filter(Boolean)})));
      const upper=slots.find(s=>s.supports.length);
      await place(page,context,upper.shape,upper.id,touch?'touch':'keyboard');
      if(await scene.getAttribute('data-notice')!=='support'){
        await page.screenshot({path:`${shots}/${tag}-support-failed.png`});
        const boxes=await page.locator('[data-drop-id]').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return{id:e.dataset.dropId,shape:e.dataset.shape,x:r.x,y:r.y,w:r.width,h:r.height,hits:document.elementsFromPoint(r.x+r.width/2,r.y+r.height/2).map(el=>el.closest('[data-drop-id]')?.getAttribute('data-drop-id')).filter(Boolean)};}));
        console.log(JSON.stringify({tag,level,round,upper,boxes}));
      }
      assert.equal(await scene.getAttribute('data-notice'),'support',`${tag} L${level} R${round} upper ${upper.id}`);assert.equal(await scene.getAttribute('data-placed'),'0');
      const wrong=slots.find(s=>s.shape!==slots[0].shape);
      await place(page,context,wrong.shape,slots[0].id);assert.equal(await scene.getAttribute('data-notice'),'retry');assert.equal(await scene.getAttribute('data-placed'),'0');
      await geometry(page,`${tag}-level-${level}-round-${round}-ready`);
      for(const [i,s] of slots.entries()){
        await place(page,context,s.shape,s.id,touch&&i===0?'touch':touch&&i===1?'tap':'keyboard');
        await page.waitForFunction(n=>document.querySelector('.bb-scene')?.dataset.placed===String(n),i+1,{timeout:2000}).catch(async e=>{await page.screenshot({path:`${shots}/${tag}-drop-failed.png`});throw new Error(`${tag} L${level} R${round} slot ${s.id} ${s.shape}: ${await scene.getAttribute('data-notice')} ${e.message}`);});
      }
      assert.equal(await scene.getAttribute('data-phase'),'success');
      if(level===1&&round===1){
        assert.equal(await page.locator('.bb-building').evaluate(e=>getComputedStyle(e).animationName),'none','reduced motion disables completion glow');
        await page.emulateMedia({reducedMotion:'no-preference'});
        const motion=await page.locator('.bb-building').evaluate(e=>({name:getComputedStyle(e).animationName,count:getComputedStyle(e).animationIterationCount}));
        assert.deepEqual(motion,{name:'bb-gold',count:'1'},'one gentle completion glow');
        await page.emulateMedia({reducedMotion:'reduce'});
      }
      await geometry(page,`${tag}-level-${level}-round-${round}-built`);
    }
    await page.locator('.gc-result').waitFor();await geometry(page,`${tag}-result-${level}`);
    const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('little-ummah:games:v1:block-builders')));assert.equal(progress.stars,level);assert.equal(progress.completedLevels.length,level);
    if(level<3)await keyboard(page,'.gc-result-actions .gc-primary');
  }
}
try{
  const sizes=[[360,780],[390,844],[844,390],[768,1024],[1280,720]].filter(([w])=>!process.env.BUILD_WIDTH||w===Number(process.env.BUILD_WIDTH));
  const runs=await Promise.allSettled(sizes.map(async([width,height])=>{
    const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'});
    await context.addInitScript(()=>{localStorage.setItem('little-ummah:sound','off');let seed=42;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));const tag=`${width}x${height}`;
    await page.goto(base+'/games/block-builders');await page.locator('.gc-start-3d').waitFor();await page.evaluate(()=>document.fonts.ready);await geometry(page,`${tag}-intro`);
    await start(page);await header(page,context,tag,width);await journey(page,context,tag);assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${tag}: all levels, touch, tap, keyboard, support, geometry and header`);
  }));
  const failures=runs.filter(r=>r.status==='rejected');if(failures.length)throw new AggregateError(failures.map(r=>r.reason),'Viewport checks failed');
  if(!process.env.BUILD_WIDTH){
    const hub=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:3,reducedMotion:'reduce'});await hub.addInitScript(()=>sessionStorage.setItem('lu-games-guide-seen','1'));
    const p=await hub.newPage();await p.goto(base+'/games');const card=p.locator('a[href="/games/block-builders"]');await card.scrollIntoViewIfNeeded();await card.locator('img').evaluate(img=>img.decode());await p.evaluate(()=>document.fonts.ready);await card.screenshot({path:`${shots}/hub-card-zoom.png`});await card.locator('.gh-card-art').screenshot({path:`${shots}/hub-edge-zoom.png`});await hub.close();
    const resilience=await Promise.allSettled(sizes.flatMap(([width,height])=>['slow','missing'].map(failure=>({width,height,failure}))).map(async({width,height,failure})=>{
      const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'});await context.addInitScript(()=>localStorage.setItem('little-ummah:sound','on'));
      let pending=0;await context.route('**/games/block-builders/*.webp',async route=>{if(failure==='missing')await route.abort();else{pending++;await new Promise(r=>setTimeout(r,15000));pending--;await route.continue().catch(()=>{});}});await context.route('**/audio/**',route=>route.abort());
      const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page);if(failure==='slow')assert.ok(pending>0);
      const tag=`${width}x${height}-${failure}`;await geometry(page,`${tag}-initial`);await journey(page,context,tag,{touch:false});assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${tag}: complete keyboard journey without artwork/audio`);
    }));const failures=resilience.filter(r=>r.status==='rejected');if(failures.length)throw new AggregateError(failures.map(r=>r.reason),'Resilience failed');
  }
}finally{await writeFile(`output/g-4/browser-results${process.env.BUILD_WIDTH?'-'+process.env.BUILD_WIDTH:''}.json`,JSON.stringify(results,null,2));await browser.close();}
