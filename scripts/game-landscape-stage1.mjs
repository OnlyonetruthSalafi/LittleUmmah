import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { boardContent } from '../src/features/games/data/content.ts';
import { gamePresentation } from '../src/features/games/data/presentation.ts';

export const stage1Slugs = ['color-match', 'arabic-match', 'sort', 'find-object', 'shape-match', 'sequence'];
export const landscapeSizes = [[568,320],[667,375],[844,390],[932,430],[932,521],[932,540],[1024,600],[1100,700],[1101,521],[1280,600],[1366,640],[1024,768],[1180,820],[1280,720]];

// Runs in Chromium: include every visible control, not just document scroll size.
export function measureLandscapePage() {
  const rect = e => { const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; };
  const visible = e => { const s=getComputedStyle(e),r=e.getBoundingClientRect(); return s.display!=='none' && s.visibility!=='hidden' && r.width>1 && r.height>1; };
  const textOverflows = e => {
    const bounds=e.getBoundingClientRect(),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
    for(let node=walker.nextNode();node;node=walker.nextNode()) {
      if(!node.textContent.trim()) continue;
      const parent=node.parentElement;
      if(parent.closest('[aria-hidden="true"],.sr-only')||!visible(parent)) continue;
      const range=document.createRange();range.selectNodeContents(node);
      for(const r of range.getClientRects()) if(r.width&&r.height&&(r.left<bounds.left-1||r.right>bounds.right+1||r.top<bounds.top-1||r.bottom>bounds.bottom+1)) return true;
    }
    return false;
  };
  const buttons=[...document.querySelectorAll('main button,main a')].filter(visible).map(e=>{
    const r=rect(e),hit=document.elementFromPoint(r.x+r.w/2,r.y+r.h/2);
    return {...r,label:e.getAttribute('aria-label')||e.textContent.trim(),classes:e.className,contentOverflow:textOverflows(e),disabled:e.disabled||e.getAttribute('aria-disabled')==='true',inside:r.x>=-.5&&r.y>=-.5&&r.x+r.w<=innerWidth+.5&&r.y+r.h<=innerHeight+.5,centerHit:e===hit||e.contains(hit),item:e.dataset.itemId,drop:e.dataset.dropId};
  });
  const groups={};
  for(const selector of ['.gc-drag','.gc-drop','.shp-hole','.seq-home','.gc-find-object','.lm-pad button']) groups[selector]=buttons.filter(b=>selector==='.lm-pad button'?b.classes.includes('lm-'):b.classes.split(' ').includes(selector.slice(1)));
  const boxes=Object.fromEntries(['.gc-board','.shp-scene','.seq-scene','.lm-stage','.gc-find-scene'].map(s=>[s,document.querySelector(s)?rect(document.querySelector(s)):null]));
  return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,status:document.querySelector('main')?.dataset.status,buttons,groups,boxes,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family),brokenImages:[...document.querySelectorAll('main img')].filter(i=>i.checkVisibility()&&(!i.complete||!i.naturalWidth)).map(i=>i.src),fallbacks:document.querySelectorAll('.gc-image-fallback').length};
}

export function landscapeProblems(row) {
  const failures=[];
  if(row.scrollWidth>row.width||row.scrollHeight>row.height) failures.push(`overflow ${row.scrollWidth}x${row.scrollHeight}`);
  for(const b of row.buttons) {
    if(b.contentOverflow) failures.push(`text overflow: ${b.label}`);
    if(!b.inside) failures.push(`outside: ${b.classes} ${b.label}`);
    const exception=row.slug==='shape-match'&&(b.item||b.drop)||row.slug==='sequence'&&b.drop;
    if(!exception&&Math.min(b.w,b.h)<63.9) failures.push(`small ${b.w.toFixed(1)}x${b.h.toFixed(1)}: ${b.label}`);
    // Island hit testing uses nearest painted hole, not rectangular overlap order.
    if(!b.disabled&&!b.centerHit&&!b.drop) failures.push(`covered: ${b.label}`);
  }
  if(row.brokenImages.length||row.fallbacks) failures.push('artwork missing');
  return failures;
}

async function ready(page) {
  await page.locator('.gc-countdown').waitFor({state:'detached',timeout:12000});
  await page.waitForFunction(()=>!document.querySelector('.gc-board')?.hasAttribute('inert'));
  await page.evaluate(()=>document.fonts.ready);
}
async function leaveFullscreen(page) { await page.waitForTimeout(250); if(await page.evaluate(()=>!!document.fullscreenElement)) { await page.evaluate(()=>document.exitFullscreen()); await page.waitForTimeout(250); } }
export async function startStage1(page) {
  await page.locator('.gc-adventure-start,.gc-start-3d').click();
  await leaveFullscreen(page);
  await ready(page);
}
export async function solveStage1(page,slug,level,beforeComplete) {
  if(slug==='find-object') {
    for(let round=0;round<5;round++) {
      const label=await page.locator('.gc-find-prompt > span:last-child').innerText();
      const th=label.split('\n')[0];
      await page.getByRole('button',{name:new RegExp(`^${th}`)}).click();
      if(round<4||!beforeComplete) await page.waitForTimeout(1000);
    }
  } else {
    const ids=await page.locator('[data-item-id]').evaluateAll(es=>es.map(e=>e.dataset.itemId));
    const targets=['color-match','arabic-match','sort'].includes(slug)?Object.fromEntries(boardContent(slug,level).items.map(i=>[i.id,i.target])):{};
    for(const id of ids) {
      await page.locator(`[data-item-id="${id}"]`).click();
      const target=slug==='shape-match'?id:slug==='sequence'?`sequence-slot-${id.split('-').at(-1)}`:targets[id];
      // Focus+Enter exercises the supported keyboard path for overlapping perspective holes.
      const home=page.locator(`[data-drop-id="${target}"]`);
      if(slug==='sequence'||slug==='shape-match') { await home.focus(); await page.keyboard.press('Enter'); }
      else await home.click();
    }
  }
  if(beforeComplete) await beforeComplete();
  await page.locator('[data-status="complete"]').waitFor({timeout:6000});
}

export async function runStage1Matrix(browser,base,check,out='output/games-landscape-consult') {
  await mkdir(`${out}/stage1-shots`,{recursive:true});
  const rows=[],errors=[];
  const selected=process.env.LANDSCAPE_GAMES?.split(',')??stage1Slugs;
  for(const slug of selected) for(const touch of [true,false]) {
    const sizes=touch?landscapeSizes.slice(0,-1):landscapeSizes.slice(-1);
    const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push({slug,touch,error:e.message}));
    page.on('requestfailed',r=>{if(/\.css(?:\?|$)/.test(r.url())) errors.push({slug,touch,error:r.failure()?.errorText,url:r.url()});});
    try {
      await page.goto(`${base}/games/${slug}`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      check(await page.evaluate(()=>['Baloo 2','Noto Sans Thai Looped'].every(name=>[...document.fonts].some(f=>f.family.replaceAll('"','')===name&&f.status==='loaded'))),`${slug}: actual project fonts loaded`);
      for(let level=1;level<=(slug==='shape-match'?1:3);level++) {
        if(await page.locator('.gc-level-stone').count()) await page.locator('.gc-level-stone').nth(level-1).click();
        for(const state of ['idle','playing','complete']) {
          if(state==='playing') { await page.setViewportSize({width:844,height:390}); await startStage1(page); }
          if(state==='complete') await solveStage1(page,slug,level);
          for(const [width,height] of sizes) {
            await page.setViewportSize({width,height});
            await page.evaluate(()=>document.fonts.ready);
            await page.waitForTimeout(120);
            await page.evaluate(()=>scrollTo(0,0));
            const row={slug,level,touch,...await page.evaluate(measureLandscapePage)};
            row.problems=landscapeProblems(row);rows.push(row);
            check(row.status===state&&!row.problems.length,`${slug} L${level} ${state} ${width}x${height}: ${row.problems.join('; ')}`);
            await page.screenshot({path:`${out}/stage1-shots/${slug}-l${level}-${state}-${width}x${height}.png`});
          }
        }
        if(level<(slug==='shape-match'?1:3)) await page.locator('.gc-result-actions .gc-primary').click();
      }
    } catch(error) {errors.push({slug,touch,error:String(error)});check(false,`${slug} matrix: ${error.message}`);}
    finally {await context.close();await writeFile(`${out}/stage1-measurements.json`,JSON.stringify({rows,errors},null,2));}
  }
  check(!errors.length,`stage1 page errors: ${JSON.stringify(errors)}`);
  return {rows,errors};
}

export async function runComingSoon(browser,base,check,out='output/games-landscape-consult') {
  const results=[];
  const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
  await context.addInitScript(()=>sessionStorage.setItem('lu-games-guide-seen','1'));
  const page=await context.newPage();await page.goto(`${base}/games`,{waitUntil:'networkidle'});
  for(const [width,height] of landscapeSizes) {
    await page.setViewportSize({width,height});
    const soonCount=await page.locator('.gh-card-soon').count();check(soonCount>0,`coming-soon cards ${soonCount}`);
    for(let i=0;i<soonCount;i++) {
      const card=page.locator('.gh-card-soon').nth(i);await card.click();
      const result=await page.locator('dialog[open]').evaluate(d=>{
        const r=d.getBoundingClientRect(),b=d.querySelector('button').getBoundingClientRect();
        return {width:innerWidth,height:innerHeight,w:r.width,h:r.height,inside:r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,scroll:d.scrollHeight>d.clientHeight,button:{w:b.width,h:b.height,inside:b.bottom<=innerHeight},fullscreen:!!document.fullscreenElement};
      });results.push({card:i,...result});
      check(result.inside&&!result.scroll&&result.button.inside&&result.button.h>=64&&!result.fullscreen,`coming-soon ${i+1} ${width}x${height}`);
      if(width===568) await page.screenshot({path:`${out}/stage1-shots/coming-soon-${i+1}-${width}.png`});
      await page.keyboard.press('Escape');
      check(await card.evaluate(e=>e===document.activeElement),'dialog closes and returns focus');
    }
  }
  await context.close();await writeFile(`${out}/stage1-coming-soon.json`,JSON.stringify(results,null,2));
}
export async function measureLightMaze(browser,base,out,suffix) {
  const rows=[];
  for(const touch of [true,false]) {
    const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:touch,isMobile:touch});
    const page=await context.newPage();
    for(let level=1;level<=3;level++) {
      await page.goto(`${base}/games/light-maze`,{waitUntil:'networkidle'});
      await page.evaluate(n=>localStorage.setItem('little-ummah:games:v1:light-maze',JSON.stringify({levelStars:Object.fromEntries(Array.from({length:n-1},(_,i)=>[i+1,3]))})),level);
      await page.reload({waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.locator('.lmt-skip').click();await leaveFullscreen(page);await ready(page);
      for(const [width,height] of touch?landscapeSizes.slice(0,-1):landscapeSizes.slice(-1)) {
        await page.setViewportSize({width,height});await page.waitForTimeout(150);
        const current=await page.evaluate(()=>{
          const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};
          return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,stage:rect(document.querySelector('.lm-stage')),buttons:[...document.querySelectorAll('.lm-pad button')].map(rect)};
        });
        rows.push({level,touch,...current});
        await page.screenshot({path:`${out}/stage1-shots/light-maze-${suffix}-l${level}-${width}x${height}.png`});
      }
    }
    await context.close();
  }
  return rows;
}

export async function runLightMazeRegression(browser,base,check,out='output/games-landscape-consult') {
  // Re-measure the approved main layout; the consult predates 66cdf3b.
  const baseline=await measureLightMaze(browser,process.env.LANDSCAPE_BASELINE_URL??'http://localhost:3102',out,'baseline');
  await writeFile(`${out}/stage1-light-maze-baseline.json`,JSON.stringify(baseline,null,2));
  const rows=await measureLightMaze(browser,base,out,'current');
  const equal=(a,b)=>a&&b&&['x','y','w','h'].every(k=>Math.abs(a[k]-b[k])<.6);
  for(const current of rows) {
    const old=baseline.find(r=>r.level===current.level&&r.touch===current.touch&&r.width===current.width&&r.height===current.height);
    current.unchanged=current.scrollHeight===old.scrollHeight&&current.scrollWidth===old.scrollWidth&&equal(current.stage,old.stage)&&current.buttons.length===old.buttons.length&&current.buttons.every((b,i)=>equal(b,old.buttons[i]));
    check(current.unchanged,`Light Maze L${current.level} ${current.width}x${current.height} baseline geometry unchanged`);
  }
  await writeFile(`${out}/stage1-light-maze.json`,JSON.stringify(rows,null,2));
}

export async function runStage1Flow(browser,base,check,out='output/games-landscape-consult') {
  const results=[];
  for(const slug of stage1Slugs.filter(s=>gamePresentation[s].fullscreen&&(!process.env.LANDSCAPE_GAMES||process.env.LANDSCAPE_GAMES.split(',').includes(s)))) {
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    await context.addInitScript(()=>{
      sessionStorage.setItem('lu-games-guide-seen','1');
      window.__mediaTrace=[];
      const active=new Set();
      const original=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){
        if (/howto-/.test(this.src)) window.__narration=this;
        const voice=/\/audio\/(th|en)\//.test(this.src);
        const overlap=voice?[...active].filter(a=>a!==this&&!a.paused&&!a.ended&&/\/audio\/(th|en)\//.test(a.src)).map(a=>a.src):[];
        window.__mediaTrace.push({src:this.src,gated:!!document.querySelector('.gc-rotate'),overlap,at:performance.now()});
        active.add(this);
        return original.call(this);
      };
    });
    const page=await context.newPage();
    try {
      await page.goto(`${base}/games`,{waitUntil:'networkidle'});
      await page.locator(`a[href$="/games/${slug}"]`).first().tap();
      await page.locator('.gc-rotate').waitFor();
      check(await page.evaluate(()=>!!document.fullscreenElement),`${slug}: hub tap enters fullscreen`);
      await page.waitForTimeout(1200);
      check(await page.evaluate(()=>!window.__mediaTrace.some(e=>/howto-/.test(e.src))),`${slug}: no intro audio before rotating`);
      check(await page.locator('.gc-play-container[inert]').count()===1,`${slug}: portrait makes content inert`);
      await page.screenshot({path:`${out}/stage1-shots/${slug}-portrait-gate.png`});
      await leaveFullscreen(page);await page.setViewportSize({width:844,height:390});
      await page.locator('.gc-rotate').waitFor({state:'detached'});
      if(gamePresentation[slug].voiceIntro) {
        await page.waitForFunction(s=>window.__mediaTrace.some(e=>e.src.includes(`howto-${s}`)),slug);
        check(true,`${slug}: voice starts after rotating`);
        if(slug==='sequence'&&!existsSync('public/audio/th/howto-sequence.mp3')) {
          // The repository has no howto-sequence.mp3. First verify the real
          // failure state, then use an existing speech clip solely as a fixture
          // to exercise successful narration lifecycle without adding assets.
          await page.waitForFunction(()=>!!window.__narration?.error);
          await page.locator('.gc-voice-wave').waitFor({state:'detached'});
          check(await page.locator('.gc-start-3d').getAttribute('data-ready')==='true',`${slug}: missing real narration restores ready state`);
          await page.route('**/audio/th/howto-sequence.mp3',route=>route.fulfill({path:'public/audio/th/game-sequence.mp3',contentType:'audio/mpeg'}));
          await page.locator('.gc-voice-replay').click();
        }
        const speaking=async()=>{
          await page.locator('.gc-voice-wave').waitFor();
          check(await page.locator('.gc-start-3d').getAttribute('data-ready')==='false' && /กำลัง/.test(await page.locator('.gc-voice-actions [role="status"]').innerText()),`${slug}: narration wave and speaking status agree`);
        };
        await speaking();
        for(const event of ['ended','pause','error']) {
          await page.evaluate(event=>{if(event==='pause') window.__narration.pause();else window.__narration.dispatchEvent(new Event(event));},event);
          await page.locator('.gc-voice-wave').waitFor({state:'detached'});
          check(await page.locator('.gc-start-3d').getAttribute('data-ready')==='true',`${slug}: narration ${event} restores ready state`);
          await page.evaluate(()=>window.__narration.pause());
          await page.locator('.gc-voice-replay').click();await speaking();
        }
      }
      await page.locator('.gc-adventure-start,.gc-start-3d').click();
      await page.locator('.gc-count-badge').waitFor();check(true,`${slug}: countdown before play`);
      await leaveFullscreen(page);await ready(page);
      // Rotate during the completion delay: no result/reward may arrive behind the gate.
      await solveStage1(page,slug,1,async()=>{
        await page.setViewportSize({width:390,height:844});await page.locator('.gc-rotate').waitFor();
        await page.waitForTimeout(1500);
        check(await page.locator('[data-status="playing"]').count()===1,`${slug}: completion timer paused behind gate`);
        await page.setViewportSize({width:844,height:390});await page.locator('.gc-count-badge').waitFor();
        await ready(page);
      });
      const trace=await page.evaluate(()=>window.__mediaTrace);
      check(!trace.some(e=>e.gated&&/howto-|game-|praise-/.test(e.src)),`${slug}: no lesson/instruction/praise audio behind gate`);
      check(!trace.some(e=>e.overlap.length),`${slug}: spoken clips never overlap`);
      results.push({slug,trace});
      await page.locator('.gc-game-header a').click();await page.waitForURL('**/games');
      await page.waitForFunction(()=>!document.fullscreenElement);
      check(true,`${slug}: returns to hub with normal window`);
    } catch(error) {check(false,`${slug}: ${error.message}; ${JSON.stringify(await page.evaluate(()=>({ready:document.querySelector('.gc-start-3d')?.dataset.ready,wave:!!document.querySelector('.gc-voice-wave'),audio:window.__narration?{paused:window.__narration.paused,ended:window.__narration.ended,time:window.__narration.currentTime,duration:window.__narration.duration,error:window.__narration.error?.message}:null,trace:window.__mediaTrace})))}`);}
    finally {await context.close();}
    const pc=await browser.newPage({viewport:{width:1280,height:720}});
    await pc.addInitScript(()=>sessionStorage.setItem('lu-games-guide-seen','1'));
    await pc.goto(`${base}/games`,{waitUntil:'networkidle'});await pc.locator(`a[href$="/games/${slug}"]`).first().click();
    await pc.locator('.gc-landscape').waitFor();
    check(await pc.locator('.gc-rotate').count()===0&&!await pc.evaluate(()=>!!document.fullscreenElement),`${slug}: mouse never enters fullscreen/gate`);
    await pc.close();
  }
  await writeFile(`${out}/stage1-flow.json`,JSON.stringify(results,null,2));
}

// A real touch/mouse drag complements the complete keyboard/click matrix.
// No React state or event handler is invoked directly by these checks.
export async function runStage1Input(browser,base,check,out='output/games-landscape-consult') {
  const results=[];
  for(const slug of stage1Slugs) for(const touch of [true,false]) {
    const context=await browser.newContext({viewport:touch?{width:568,height:320}:{width:1280,height:720},hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    try {
      await page.goto(`${base}/games/${slug}`,{waitUntil:'networkidle'});
      const level=slug==='arabic-match'?3:1;
      if(level===3) await page.locator('.gc-level-stone').nth(2).click();
      await startStage1(page);
      const control=page.locator('.gc-instruction > button');
      await page.keyboard.press('Tab');await control.focus();
      const focus=await control.evaluate(e=>{const s=getComputedStyle(e);return e.matches(':focus-visible')&&s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0;});
      check(focus,`${slug} ${touch?'touch':'mouse'}: visible keyboard focus`);
      const still=await control.evaluate(e=>getComputedStyle(e).transform);
      await control.hover();
      const hovered=await control.evaluate(e=>getComputedStyle(e).transform);
      check(still===hovered,`${slug} ${touch?'touch':'mouse'}: reduced-motion hover keeps position`);
      if(!touch&&['color-match','arabic-match','sort'].includes(slug)) {
        await page.setViewportSize({width:844,height:390});
        for(const selector of ['.gc-object-button','.gc-drop:not(:disabled)']) {
          const button=page.locator(selector).first();
          await page.mouse.move(1,1);
          const before=await button.evaluate(e=>({shadow:getComputedStyle(e).boxShadow,transform:getComputedStyle(e).transform}));
          await button.hover();await page.waitForTimeout(250);
          const hover=await button.evaluate(e=>({shadow:getComputedStyle(e).boxShadow,transform:getComputedStyle(e).transform}));
          await page.mouse.down();await page.waitForTimeout(250);
          const active=await button.evaluate(e=>getComputedStyle(e).boxShadow);
          await page.mouse.move(1,1);await page.mouse.up();
          check(before.shadow!==hover.shadow&&active!==hover.shadow&&active!==before.shadow&&before.transform===hover.transform,`${slug}: compact ${selector} hover/active shadows with reduced motion`);
        }
        await page.setViewportSize({width:1280,height:720});
        // Start the independent drag check from a fresh board after probing
        // pointer-down/active styles, which deliberately changes selection.
        await page.reload({waitUntil:'networkidle'});
        if(level===3) await page.locator('.gc-level-stone').nth(2).click();
        await startStage1(page);
      }
      if(slug==='find-object') {
        const label=(await page.locator('.gc-find-prompt > span:last-child').innerText()).split('\n')[0];
        const object=page.getByRole('button',{name:new RegExp(`^${label}`)});
        if(touch) await object.tap();else await object.click();
        await page.locator('.gc-found').waitFor();
      } else {
        const source=page.locator('[data-item-id]').first();
        const id=await source.getAttribute('data-item-id');
        const target=slug==='shape-match'?id:slug==='sequence'?`sequence-slot-${id.split('-').at(-1)}`:boardContent(slug,level).items.find(i=>i.id===id).target;
        const from=await source.boundingBox(),to=await page.locator(`[data-drop-id="${target}"]`).boundingBox();
        const a={x:from.x+from.width/2,y:from.y+from.height/2},b={x:to.x+to.width/2,y:to.y+to.height/2};
        if(touch) {
          const cdp=await context.newCDPSession(page);
          await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});
          for(let step=1;step<=8;step++) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*step/8,y:a.y+(b.y-a.y)*step/8}]});
          await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
        } else {
          await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();
        }
        await page.locator(`[data-item-id="${id}"]`).waitFor({state:'detached',timeout:3000});
        check(await page.locator('.gc-drag[data-dragging]').count()===0,`${slug}: drag state clears`);
      }
      check(true,`${slug} ${touch?'touch':'mouse'}: real ${slug==='find-object'?'tap':'drag'} accepted`);
      check(!errors.length,`${slug} input has no page errors: ${errors.join('; ')}`);
      results.push({slug,touch,passed:true,errors});
    } catch(error) {check(false,`${slug} input: ${error.message}`);results.push({slug,touch,passed:false,error:String(error),errors});}
    finally {await context.close();}
  }
  await writeFile(`${out}/stage1-input.json`,JSON.stringify(results,null,2));
}

export async function runDesktopArtworkRegression(browser,base,check,out='output/games-landscape-consult') {
  const rows=[];
  const baselineUrl=process.env.LANDSCAPE_BASELINE_URL??'http://localhost:3102';
  for(const slug of ['color-match','arabic-match','sort']) for(let level=1;level<=3;level++) {
    const measurements=[];
    for(const url of [baselineUrl,base]) {
      const context=await browser.newContext({viewport:{width:1280,height:720},reducedMotion:'reduce'});
      try {
        const page=await context.newPage();
        await page.goto(`${url}/games/${slug}`,{waitUntil:'networkidle'});
        await page.locator('.gc-level-stone').nth(level-1).click();await startStage1(page);
        const measure=()=>page.locator('.gc-tray .gc-object,.gc-tray .gc-letter').evaluateAll(es=>es.map(e=>{
          const r=e.getBoundingClientRect();
          return {label:e.closest('button').getAttribute('aria-label'),w:r.width,h:r.height,font:getComputedStyle(e).fontSize};
        }));
        if(slug==='arabic-match'&&url===base) {
          const allSets=[];
          for(const choice of await page.locator('.gc-arabic-sets button').all()) {
            await choice.click();
            allSets.push(...await measure());
          }
          measurements.push(allSets);
        } else measurements.push(await measure());
      } finally {await context.close();}
    }
    const [baseline,current]=measurements;
    // C-6 redistributes the original letters across levels and adds seven sets.
    // Compare each original glyph against every occurrence in the new curriculum
    // after collecting all levels, rather than requiring the old round contents.
    if(slug==='arabic-match') { rows.push({slug,level,baseline,current}); continue; }
    const unchangedOrLarger=current.length===baseline.length&&current.every(c=>{
      const b=baseline.find(b=>b.label===c.label);
      return b&&c.w>=b.w-.1&&c.h>=b.h-.1;
    });
    check(unchangedOrLarger,`${slug} L${level}: visible PC artwork and letters no smaller than main`);
    rows.push({slug,level,baseline,current,unchangedOrLarger});
  }
  const arabic=rows.filter(row=>row.slug==='arabic-match');
  const allCurrent=arabic.flatMap(row=>row.current);
  const allBaseline=arabic.flatMap(row=>row.baseline);
  const baselineFont=Math.max(...allBaseline.map(item=>parseFloat(item.font)));
  const baselineHeight=Math.max(...allBaseline.map(item=>item.h));
  check(new Set(allCurrent.map(item=>item.label)).size===28,'Arabic PC artwork: all 28 glyphs measured across seven sets');
  for(const row of arabic) {
    row.unchangedOrLarger=row.baseline.every(b=>{
      const matches=allCurrent.filter(c=>c.label===b.label);
      return matches.length>0&&matches.every(c=>c.w>=b.w-.1&&c.h>=b.h-.1);
    });
    check(row.unchangedOrLarger,`arabic-match L${row.level}: every original glyph no smaller than main across new sets/levels`);
    const expected=Array.from({length:7},(_,set)=>boardContent('arabic-match',row.level,set).items.length).reduce((a,b)=>a+b,0);
    check(row.current.length===expected&&row.current.every(c=>parseFloat(c.font)>=baselineFont&&c.h>=baselineHeight-.1),`arabic-match L${row.level}: all seven sets retain baseline font size and letter height`);
  }
  await writeFile(`${out}/stage1-pc-artwork.json`,JSON.stringify(rows,null,2));
}
