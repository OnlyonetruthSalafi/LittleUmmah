import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const sharp = require('sharp');
const base = process.argv[2] || process.env.BASE_URL || 'http://localhost:3133';
const shots = 'output/g-3/shots-fix1';
await mkdir(shots, { recursive: true });
process.env.CHROME_LOG_FILE = resolve('output/g-3/chromium-fix1.log');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe' });
const results = [];
const css = await readFile('src/features/games/balance-scale.css', 'utf8');
assert.doesNotMatch(css, /gc-game-header|ui-label|transition-all/);
const style = page => page.locator('.gc-game-header').evaluate(el => {
  const h = el.querySelector('h1'), s = getComputedStyle(h), p = getComputedStyle(document.querySelector('.gc-progress-row'));
  return { font: s.fontSize, sub: getComputedStyle(h.querySelector('small')).fontSize, color: s.color, background: s.background, border: s.border, buttons: [...el.querySelectorAll('.ui-pill')].map(e => e.className), progress: { font: p.fontSize, color: p.color, background: p.background, padding: p.padding } };
});
async function scaleGeometry(page, tag) {
  const g = await page.locator('.bs-scene').evaluate(scene => {
    const rect = el => { const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}; };
    const pans = [...scene.querySelectorAll('.bs-pan')].map(el=>({ ...rect(el), art:rect(el.querySelector('.bs-pan-art') || el), transform:getComputedStyle(el).transform, transition:getComputedStyle(el).transitionProperty }));
    const labels = [...scene.querySelectorAll('.bs-pan-label')].map(rect);
    const objects = [...scene.querySelectorAll('.bs-object>img,.bs-remove,.bs-pan-art')].map(rect);
    const luminance = c => c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    const contrast = [...scene.querySelectorAll('.bs-hint,.bs-round-actions p')].filter(el=>el.getBoundingClientRect().width).flatMap(el=>[el,...el.querySelectorAll('small')].map(text=>{
      const fg=getComputedStyle(text).color.match(/[\d.]+/g).map(Number),bg=getComputedStyle(el).backgroundColor.match(/[\d.]+/g).map(Number);
      return {text:text.textContent,alpha:bg[3]??1,ratio:(Math.max(luminance(fg),luminance(bg))+.05)/(Math.min(luminance(fg),luminance(bg))+.05)};
    }));
    const stage=rect(scene.querySelector('.bs-stage')),beam=scene.querySelector('.bs-beam'),angle=parseFloat(getComputedStyle(beam).rotate);
    return {pans,labels,objects,contrast,stage,angle,arm:parseFloat(getComputedStyle(scene.querySelector('.bs-stage')).getPropertyValue('--bs-arm-span')),left:Number(scene.dataset.left),right:Number(scene.dataset.right),reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,drop:rect(scene.querySelector('[data-drop-id]'))};
  });
  results.push({tag,scale:g});
  const difference=g.pans[0].art.y-g.pans[1].art.y;
  if(g.left===g.right)assert.ok(Math.abs(difference)<1,`${tag}: equal pans level`);
  else assert.ok((g.left>g.right?difference:-difference)>2,`${tag}: heavy pan must be lower: ${difference}`);
  for(const [i,pan] of g.pans.entries()) {
    const sign=i===0?-1:1,radius=g.stage.width*g.arm/200,angle=g.angle*Math.PI/180;
    assert.ok(Math.abs(pan.y-(g.stage.y+g.stage.height*.15+13+sign*radius*Math.sin(angle)))<1,`${tag}: pan follows beam endpoint`);
    assert.ok(Math.abs(pan.x+pan.width/2-(g.stage.x+g.stage.width/2+sign*radius*Math.cos(angle)))<1,`${tag}: pan x follows beam endpoint`);
    const matrix=pan.transform.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
    assert.ok(Math.abs(matrix[1])<.001&&Math.abs(matrix[2])<.001,`${tag}: pan stays upright`);
    if(g.reduced)assert.equal(pan.transition,'none');
  }
  assert.equal(g.drop.y,g.pans[1].y,`${tag}: drop target moves with right pan`);
  const overlaps=(a,b)=>a.x<b.right-.5&&a.right>b.x+.5&&a.y<b.bottom-.5&&a.bottom>b.y+.5;
  assert.ok(!overlaps(...g.labels),`${tag}: labels overlap`);
  assert.ok(Math.abs(g.labels[0].y-g.labels[1].y)<1,`${tag}: labels align`);
  for(const label of g.labels)for(const obj of g.objects)assert.ok(!overlaps(label,obj),`${tag}: label overlaps object/pan ${JSON.stringify({label,obj})}`);
  for(const c of g.contrast){assert.equal(c.alpha,1,`${tag}: opaque help background`);assert.ok(c.ratio>=4.5,`${tag}: help contrast ${c.ratio}`);}
}
async function geometry(page, tag) {
  if(await page.locator('.bs-scene').count()) { await page.waitForTimeout(350); await scaleGeometry(page,tag); }

  const g = await page.evaluate(() => ({
    width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight,
    controls: [...document.querySelectorAll('main button,main a')].filter(el => el.getBoundingClientRect().width > 0).map(el => {
      const r = el.getBoundingClientRect();
      return { label: el.getAttribute('aria-label') || el.textContent, x:r.x, y:r.y, w:r.width, h:r.height, right:r.right, bottom:r.bottom, overflowX:el.scrollWidth>el.clientWidth+1, overflowY:el.scrollHeight>el.clientHeight+1, unobscured:el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)) };
    }),
    text: [...document.querySelectorAll('.bs-goal h2,.bs-hint,.bs-status,.bs-pan-label')].filter(el=>el.getBoundingClientRect().width>0).map(el=>({text:el.textContent,overflow:el.scrollWidth>el.clientWidth+1})),
  }));
  results.push({ tag, ...g });
  assert.ok(g.scrollWidth<=g.width && g.scrollHeight<=g.height, `${tag}: page overflow ${g.scrollWidth}x${g.scrollHeight}`);
  for(const c of g.controls) {
    assert.ok(c.w>=63.99 && c.h>=63.99, `${tag}: target <64 ${JSON.stringify(c)}`);
    assert.ok(c.x>=-1 && c.y>=-1 && c.right<=g.width+1 && c.bottom<=g.height+1, `${tag}: offscreen ${JSON.stringify(c)}`);
    assert.ok(!c.overflowX && !c.overflowY, `${tag}: text overflow ${JSON.stringify(c)}`);
    assert.ok(c.unobscured, `${tag}: obscured ${JSON.stringify(c)}`);
  }
  for(const t of g.text) assert.ok(!t.overflow, `${tag}: ${t.text}`);
}
async function keyboard(page, selector) {
  // Reach the requested control using actual Tab navigation, including wraparound.
  for(let i=0;i<40;i++) {
    if(await page.locator(selector).first().evaluate(el=>el===document.activeElement)) { await page.keyboard.press('Enter'); await page.evaluate(()=>new Promise(requestAnimationFrame)); return; }
    await page.keyboard.press('Tab');
  }
  assert.fail(`Tab cannot reach ${selector}`);
}
async function add(page, context, weight, touch) {
  const source=page.locator(`[data-item-id="${weight}"]`);
  if(touch) {
    const a=await source.boundingBox(),b=await page.locator('.bs-right').boundingBox();
    const cdp=await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x+a.width/2,y:a.y+a.height/2}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height*.7}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
  } else { await keyboard(page,`[data-item-id="${weight}"]`);await keyboard(page,'[data-place]'); }
}
async function start(page) {
  await page.goto(base+'/games/balance-scale');
  await page.locator('.gc-start-3d').waitFor();await page.evaluate(()=>document.fonts.ready);
  await keyboard(page,'.gc-start-3d');
  await page.locator('.bs-scene').waitFor();await page.locator('.gc-countdown').waitFor({state:'detached'});
  await page.waitForTimeout(2000);
}
async function compareHeader(page,context,tag,width) {
  const current=await style(page), a=await page.screenshot({clip:{x:0,y:0,width,height:150}});
  const coin=await context.newPage();await coin.goto(base+'/games/coin-box');await coin.locator('.gc-start-3d').click();await coin.locator('.cb-scene').waitFor();await coin.locator('.gc-countdown').waitFor({state:'detached'});
  assert.deepEqual(await style(coin),current,`${tag}: shared coin-box header/progress styles`);
  const b=await coin.screenshot({clip:{x:0,y:0,width,height:150}});
  await sharp({create:{width,height:312,channels:4,background:'#fff'}}).composite([{input:a,left:0,top:0},{input:b,left:0,top:162}]).png().toFile(`${shots}/${tag}-header-comparison.png`);await coin.close();
}
async function journey(page,context,tag,{touch=true,screens=true,checks=true}={}) {
  for(let level=1;level<=3;level++) {
    for(let round=1;round<=3;round++) {
      await page.waitForFunction(r=>document.querySelector('.bs-scene')?.dataset.round===String(r)&&document.querySelector('.bs-scene')?.dataset.phase==='ready',round);
      await page.locator('.gc-countdown').waitFor({state:'detached'});
      // Wait for the post-countdown instruction/focus, then exercise stable keyboard flow.
      if(round===1)await page.waitForTimeout(2000);
      const scene=page.locator('.bs-scene');
      if(round===1) {
        const previous=await scene.getAttribute('data-question');
        await keyboard(page,'[data-new-round]');
        assert.notEqual(await scene.getAttribute('data-question'),previous);
        assert.equal(await scene.getAttribute('data-round'),String(round));
        await page.waitForTimeout(2050);
      }
      const mode=await scene.getAttribute('data-mode');
      const left=Number(await scene.getAttribute('data-left'));
      if(mode==='compare') {
        const right=Number(await scene.getAttribute('data-right'));
        const answer=left===right?'equal':left>right?'left':'right';
        await keyboard(page,`[data-answer="${answer==='left'?'right':'left'}"]`);
        assert.equal(await scene.getAttribute('data-phase'),'ready');
        if(checks)await geometry(page,`${tag}-L${level}R${round}-compare`);
        if(screens)await page.screenshot({path:`${shots}/${tag}-level-${level}-round-${round}.png`});
        await keyboard(page,`[data-answer="${answer}"]`);
      } else {
        await keyboard(page,'[data-check]');assert.equal(await scene.getAttribute('data-phase'),'ready');
        if(round===1) {
          for(let i=0;i<4;i++)await add(page,context,level===1?1:2,touch&&i===0);
          const full=await scene.getAttribute('data-right');await add(page,context,1,false);assert.equal(await scene.getAttribute('data-right'),full);
          if(checks)await geometry(page,`${tag}-L${level}-full`);
          if(screens)await page.screenshot({path:`${shots}/${tag}-level-${level}-full.png`});
          for(let i=0;i<4;i++)await keyboard(page,'.bs-remove');
          assert.equal(await scene.getAttribute('data-right'),'0');
        }
        let remaining=left,first=true;
        while(remaining>0) { const weight=round===2?1:Math.min(remaining,level===1?1:level===2?2:3);await add(page,context,weight,touch&&first);remaining-=weight;first=false; }
        assert.equal(await scene.getAttribute('data-right'),String(left));
        if(checks)await geometry(page,`${tag}-L${level}R${round}-balanced`);
        if(screens)await page.screenshot({path:`${shots}/${tag}-level-${level}-round-${round}.png`});
        await keyboard(page,'[data-check]');
      }
      assert.equal(await scene.getAttribute('data-phase'),'success');
    }
    await page.locator('.gc-result').waitFor();
    if(checks)await geometry(page,`${tag}-result-${level}`);
    if(screens)await page.screenshot({path:`${shots}/${tag}-result-${level}.png`});
    const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('little-ummah:games:v1:balance-scale')));
    assert.equal(progress.stars,level);assert.equal(progress.completedLevels.length,level);
    if(level<3)await keyboard(page,'.gc-result-actions .gc-primary');
  }
}
try {
  const runs = await Promise.allSettled([[360,780],[390,844],[844,390],[768,1024],[1280,720]].filter(([w])=>!process.env.BALANCE_RESILIENCE_ONLY&&(!process.env.BALANCE_WIDTH||w===Number(process.env.BALANCE_WIDTH))).map(async ([width,height]) => {
    const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'});
    await context.addInitScript(()=>{localStorage.setItem('little-ummah:sound','off');let seed=42;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));const tag=`${width}x${height}`;
    await page.goto(base+'/games/balance-scale');await page.locator('.gc-start-3d').waitFor();await page.evaluate(()=>document.fonts.ready);
    await geometry(page,`${tag}-intro`);await page.screenshot({path:`${shots}/${tag}-intro.png`});
    await start(page);await compareHeader(page,context,tag,width);
    assert.ok(parseFloat(await page.locator('.bs-beam').evaluate(el=>getComputedStyle(el).rotate))<0, 'reduced motion retains final tilt');
    await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(350);
    assert.ok(parseFloat(await page.locator('.bs-beam').evaluate(el=>getComputedStyle(el).rotate))<0,'left-heavy scale tilts left');
    await geometry(page,`${tag}-tilted`);await page.screenshot({path:`${shots}/${tag}-tilted.png`});
    await page.screenshot({path:`${shots}/${tag}-left-heavy.png`});
    await page.emulateMedia({reducedMotion:'reduce'});
    await scaleGeometry(page,`${tag}-reduced-left`);
    for(let i=0;i<4;i++)await add(page,context,1,true);
    await geometry(page,`${tag}-right-heavy`);await page.screenshot({path:`${shots}/${tag}-right-heavy.png`});
    const left=Number(await page.locator('.bs-scene').getAttribute('data-left'));
    for(let i=4;i>left;i--)await keyboard(page,'.bs-remove');
    await geometry(page,`${tag}-balanced`);await page.screenshot({path:`${shots}/${tag}-balanced.png`});
    for(let i=0;i<left;i++)await keyboard(page,'.bs-remove');
    await journey(page,context,tag);assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${tag}: 3 levels, touch, keyboard, geometry, header`);
  }));
  const failures=runs.filter(r=>r.status==='rejected');
  if(failures.length)throw new AggregateError(failures.map(r=>r.reason),'Viewport checks failed');
  if(!process.env.BALANCE_WIDTH) {
    const hub=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:3,reducedMotion:'reduce'});
    await hub.addInitScript(()=>sessionStorage.setItem('lu-games-guide-seen','1'));
    const page=await hub.newPage();await page.goto(base+'/games');
    const card=page.locator('a[href="/games/balance-scale"]');await card.scrollIntoViewIfNeeded();
    await card.locator('img').evaluate(img=>img.decode());await page.evaluate(()=>document.fonts.ready);
    await card.screenshot({path:`${shots}/hub-card-zoom.png`});
    await card.locator('.gh-card-art').screenshot({path:`${shots}/hub-edge-zoom.png`});await hub.close();

    const resilience=await Promise.allSettled([[360,780],[390,844],[844,390],[768,1024],[1280,720]].flatMap(([width,height])=>['missing','slow'].map(failure=>({width,height,failure}))).map(async ({width,height,failure})=>{
      const tag=`${width}x${height}-${failure}`;
      const context=await browser.newContext({viewport:{width,height},hasTouch:true});
      await context.addInitScript(()=>localStorage.setItem('little-ummah:sound','on'));
      let pending=0;
      await context.route('**/games/balance-scale/*.webp',async route=>{if(failure==='missing')await route.abort();else{pending++;await new Promise(r=>setTimeout(r,15000));pending--;await route.continue().catch(()=>{});}});
      await context.route('**/audio/**',route=>route.abort());
      const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page);
      if(failure==='slow')assert.ok(pending>0,'game is playable while artwork is still pending');
      await geometry(page,`${tag}-initial`);await page.screenshot({path:`${shots}/${tag}-initial.png`});
      // An unequal scale must visibly tilt with normal motion enabled.
      if(await page.locator('.bs-scene').getAttribute('data-left')!=='0')assert.notEqual(await page.locator('.bs-beam').evaluate(el=>getComputedStyle(el).rotate),'0deg');
      await journey(page,context,tag,{touch:false,screens:failure==='missing'&&width===390});assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${tag} images + missing audio: complete keyboard journey`);
    }));
    const failed=resilience.filter(r=>r.status==='rejected');if(failed.length)throw new AggregateError(failed.map(r=>r.reason),'Resilience checks failed');
  }
} finally {await writeFile(`output/g-3/browser-fix1${process.env.BALANCE_RESILIENCE_ONLY?'-resilience':''}-results.json`,JSON.stringify(results,null,2));await browser.close();}
