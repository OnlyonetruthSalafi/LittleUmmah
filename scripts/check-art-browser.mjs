/* node scripts/check-art-browser.mjs http://localhost:3123 output/c13/shots */
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { ART_COLORS, ART_PICTURES } from '../src/features/art/data.ts';
import { BRUSH_TIP } from '../src/features/art/paint-assets.ts';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe';
const base = process.argv[2] ?? 'http://localhost:3123';
const out = process.argv[3] ?? 'output/c13/shots';
await mkdir(out, { recursive: true });
const results = [], failures = [];
const check = (ok, label, detail) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`, detail ?? ''); results.push({ ok, label, detail }); if (!ok) failures.push(label); };
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const raster = page => page.locator('.art-paint').evaluate(c => c.toDataURL());
const buttonSizes = page => page.evaluate(() => [...document.querySelectorAll('.art-stage button')].filter(el => {
  const r = el.getBoundingClientRect(); return r.width > 0 && (r.width < 63.99 || r.height < 63.99);
}).map(el => ({ label: el.getAttribute('aria-label') ?? el.textContent, width: el.clientWidth, height: el.clientHeight })));
const overflow = page => page.evaluate(() => [...document.querySelectorAll('.art-board-inner button,.art-board-inner > .art-frame,.art-tray,.art-result')].filter(el => {
  const r=el.getBoundingClientRect(); return r.width && (r.left < -.5 || r.top < -.5 || r.right > innerWidth+.5 || r.bottom > innerHeight+.5);
}).map(el => el.className));
const browser = await chromium.launch({ headless: true, executablePath, args: [`--log-file=${resolve(out,'chromium.log')}`] });
try {
  check(ART_PICTURES.length === 20, '20 pictures available');
  // Exercise the real carousel, including wrapping, at all brief viewport sizes.
  const selectPicture = async (page, id) => {
    for (let i = 0; i < ART_PICTURES.length; i++) {
      if (await page.locator('.art-pick[data-slot="1"]').getAttribute('data-picture') === id) return;
      await page.getByRole('button', { name: 'รูปถัดไป', exact: true }).click();
    }
    throw new Error(`Picture is unreachable: ${id}`);
  };
  for (const [width, height, touch] of [[360,780,true],[844,390,true],[768,1024,true],[1280,720,false],[360,780,false]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, isMobile: touch });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/learn/art`, { waitUntil: 'load' });
    await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
    await page.waitForSelector('.art-pick[data-slot="1"]');
    const seen = new Set();
    for (let i = 0; i < ART_PICTURES.length; i++) {
      seen.add(await page.locator('.art-pick[data-slot="1"]').getAttribute('data-picture'));
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}x${height} picker ${i} no horizontal scroll`);
      check(!(await buttonSizes(page)).length, `${width}x${height} picker ${i} buttons ≥64px`);
      await page.getByRole('button', { name: 'รูปถัดไป', exact: true }).click();
    }
    check(seen.size === 20, `${width}x${height} all pictures reachable`);
    for (const picture of ART_PICTURES.slice(8)) {
      const label = `${picture.id}-${width}x${height}${height > width && !touch ? "-mouse" : ""}`;
      await selectPicture(page, picture.id);
      await page.screenshot({ path: `${out}/${label}-picker.png` });
      const card = page.locator('.art-pick[data-slot="1"]');
      check(await card.locator('.art-difficulty').isVisible(), `${label} difficulty visible`);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await settle(page);
      const before = await card.locator('.art-frame').evaluate(el => getComputedStyle(el).transform);
      await card.hover(); await settle(page);
      check(await card.locator('.art-frame').evaluate(el => getComputedStyle(el).transform) === before, `${label} reduced motion hover stays still`);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await card.click();
      if (height > width && touch) {
        await page.waitForSelector('.gc-rotate');
        await page.screenshot({ path: `${out}/${label}-rotate.png` });
        await page.locator('.gc-rotate button.gc-button').last().click();
        continue;
      }
      await page.waitForSelector('.art-paint'); await settle(page);
      const canvas = page.locator('.art-paint'), blank = await raster(page);
      await page.mouse.move(10,10); await page.waitForTimeout(250);
      await page.screenshot({ path: `${out}/${label}-blank.png` });
      check(!(await buttonSizes(page)).length, `${label} palette/tools ≥64px`);
      check(!(await overflow(page)).length, `${label} board fits`);
      const undo = async () => { await page.getByRole('button', { name: 'ย้อนกลับ', exact: true }).click(); await settle(page); };
      for (let index = 0; index < picture.regions.length; index++) {
        const region = picture.regions[index];
        // Find a visible start point that resolves to this region, including thin hit slop.
        const start = await canvas.evaluate((c, { regions, index }) => {
          const ctx = c.getContext('2d'), paths = regions.map(r => new Path2D(r.d));
          ctx.save(); ctx.resetTransform(); ctx.lineWidth = 26;
          const hit = (x,y) => {
            for (let i = paths.length-1; i >= 0; i--) if (ctx.isPointInPath(paths[i],x,y,'evenodd') || (regions[i].thin && ctx.isPointInStroke(paths[i],x,y))) return i;
            return -1;
          };
          let best = null, score = -1;
          for (let y=4;y<296;y+=4) for (let x=4;x<396;x+=4) {
            if (!ctx.isPointInPath(paths[index],x,y,'evenodd') || hit(x,y)!==index) continue;
            let margin=0;
            for (const d of [4,8,12,20,30]) if ([[x-d,y],[x+d,y],[x,y-d],[x,y+d]].every(([a,b])=>hit(a,b)===index)) margin++;
            if (margin>score) { best={x,y}; score=margin; }
          }
          ctx.restore(); return best;
        }, { regions: picture.regions, index });
        check(!!start, `${label}/${region.id} has a paintable start`);
        if (!start) continue;
        const bounds = await canvas.boundingBox();
        const at = (x,y) => ({ x: bounds.x+x/400*bounds.width, y: bounds.y+y/300*bounds.height });
        const a = at(start.x,start.y), b = at(start.x<200?398:2,start.y<150?298:2);
        await page.mouse.move(a.x,a.y); await page.mouse.down(); await page.mouse.move(b.x,b.y,{steps:8}); await page.mouse.up(); await settle(page);
        const coverage = await canvas.evaluate((c, { regions,index }) => {
          const mask=document.createElement('canvas');mask.width=c.width;mask.height=c.height;
          const ctx=mask.getContext('2d');ctx.scale(c.width/400,c.height/300);
          ctx.fill(new Path2D(regions[index].d),'evenodd');ctx.globalCompositeOperation='destination-out';
          for(const r of regions.slice(index+1))ctx.fill(new Path2D(r.d),'evenodd');
          const m=ctx.getImageData(0,0,c.width,c.height).data,d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
          let inside=0,outside=0;for(let i=3;i<d.length;i+=4)if(d[i]>20){if(m[i])inside++;else outside++;}
          return {inside,outside};
        }, { regions: picture.regions, index });
        check(coverage.inside>0 && coverage.outside===0, `${label}/${region.id} drag clips to visible region`, coverage);
        await undo(); check(await raster(page)===blank, `${label}/${region.id} undo restores blank`);
      }
      // Color the distinguishing vegetables for review, leaving soil/bed unpainted.
      const sampleRegions = picture.id === 'vegetable-garden'
        ? ['carrot-left','carrot-right','leaves-left','leaves-right','cabbage','cabbage-fold','cabbage-middle','stake','stem','tomato-leaf-left','tomato-leaf-right','tomato-left','tomato-right','calyx'].map(id => picture.regions.findIndex(r => r.id === id))
        : [1,2,3];
      for (const index of sampleRegions) {
        const colorIndex = ART_COLORS.findIndex(c => c.id === picture.example[picture.regions[index].id]);
        await page.locator('.art-color').nth(colorIndex).click();
        await page.locator('.art-keyboard path').nth(index).focus(); await page.keyboard.press('Enter'); await settle(page);
      }
      check(await raster(page)!==blank, `${label} partially colored`);
      await page.locator('.art-color[aria-pressed="true"]').click();
      await page.mouse.move(10,10); await page.waitForTimeout(250);
      await page.screenshot({ path: `${out}/${label}-partial.png` });
      await page.getByRole('button', { name: 'กลับไปเลือกรูป', exact: true }).click();
      await selectPicture(page,picture.id); await page.locator('.art-pick[data-slot="1"]').click(); await page.waitForSelector('.art-paint'); await settle(page);
      check(await raster(page)===blank, `${label} restart clears paint`);
      check(await page.getByRole('button',{name:'ย้อนกลับ',exact:true}).isDisabled(), `${label} restart clears history`);
      await page.getByRole('button', { name: 'กลับไปเลือกรูป', exact: true }).click();
    }
    check(!errors.length, `${width}x${height} new pictures no page errors`, errors);
    await context.close();
  }
  for (const [width,height] of [[568,320],[667,375],[740,360],[844,390],[932,430],[1024,768],[1280,800],[1536,770]]) {
    const name = `${width}x${height}`;
    const context = await browser.newContext({ viewport: {width,height}, hasTouch: width<1100, isMobile: width<1100 });
    const page = await context.newPage(); const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.goto(`${base}/learn/art`,{waitUntil:'load'});
    await page.addStyleTag({content:'nextjs-portal{display:none!important}'});
    await page.waitForSelector('.art-pick[data-slot="1"]'); await page.waitForTimeout(250);
    await page.screenshot({path:`${out}/picker-${name}.png`});
    check(!(await buttonSizes(page)).length,`${name} picker buttons ≥64px`);
    await page.locator('.art-pick[data-slot="1"]').click(); await page.waitForSelector('.art-paint');
    await page.waitForTimeout(250);
    const canvas=page.locator('.art-paint'); const bounds=await canvas.boundingBox();
    const at=(x,y)=>({x:bounds.x+x/400*bounds.width,y:bounds.y+y/300*bounds.height});
    const drag=async(points,steps=1)=>{
      const a=at(...points[0]);await page.mouse.move(a.x,a.y);await page.mouse.down();
      for(const point of points.slice(1)){const p=at(...point);await page.mouse.move(p.x,p.y,{steps});}
      await settle(page);
    };
    const undo=async()=>{await page.getByRole('button',{name:'ย้อนกลับ',exact:true}).click();await settle(page);};
    check(!(await buttonSizes(page)).length,`${name} board buttons ≥64px`,await buttonSizes(page));
    check(!(await overflow(page)).length,`${name} no interactive/frame overflow`,await overflow(page));
    check(await page.evaluate(()=>{const f=document.querySelector('.art-frame').getBoundingClientRect(),t=document.querySelector('.art-tray').getBoundingClientRect();return f.bottom<=t.top+1;}),`${name} tray does not overlap picture`);
    check(await page.evaluate(()=>document.querySelector('header')?.closest('[inert]')!==null),`${name} covered page is inert`);
    check(await page.evaluate(()=>{const e=document.querySelector('.art-example').getBoundingClientRect(),hit=b=>!(e.right<=b.left+1||b.right<=e.left+1||e.bottom<=b.top+1||b.bottom<=e.top+1),rect=q=>document.querySelector(q).getBoundingClientRect();return e.width>=120&&e.left>=0&&e.top>=0&&e.right<=innerWidth&&e.bottom<=innerHeight&&!hit(rect('.art-board-inner > .art-frame'))&&!hit(rect('.art-done'))&&!hit(rect('.art-tray'));}),`${name} example picture visible beside the board`);
    const blank=await raster(page);await page.locator('.art-color').nth(0).click();await page.waitForTimeout(230);
    const homeError=await page.evaluate(anchor=>{const b=document.querySelector('.art-brush-art').getBoundingClientRect(),c=document.querySelector('.art-color[aria-pressed="true"]').getBoundingClientRect();return Math.hypot(b.left+b.width*anchor.x/100-c.left-c.width/2,b.top+b.height*anchor.y/100-c.top-c.height/2);},BRUSH_TIP);
    check(homeError<=3,`${name} brush rests in the selected measured well`,homeError);
    await drag([[150,94],[200,94],[260,94],[340,94]],1);
    const tip=await page.evaluate(({anchor,target})=>{const r=document.querySelector('.art-brush-art').getBoundingClientRect();return Math.hypot(r.left+r.width*anchor.x/100-target.x,r.top+r.height*anchor.y/100-target.y);},{anchor:BRUSH_TIP,target:at(340,94)});
    check(tip<=3,`${name} brush tip error ≤3px`,tip);
    await page.mouse.up();await settle(page);
    check(await raster(page)!==blank,`${name} real drag changes canvas pixels`);
    const clipping=await canvas.evaluate((c,regions)=>{
      const ctx=c.getContext('2d'),data=ctx.getImageData(0,0,c.width,c.height).data,paths=regions.map(r=>new Path2D(r.d));let inside=0,outside=0;
      const mask=document.createElement('canvas');mask.width=c.width;mask.height=c.height;
      const mc=mask.getContext('2d');mc.scale(2.5,2.5);mc.fill(paths[2],'evenodd');mc.globalCompositeOperation='destination-out';
      for(const p of paths.slice(3))mc.fill(p,'evenodd');const coverage=mc.getImageData(0,0,c.width,c.height).data;
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>20){
        const allowed=coverage[(y*c.width+x)*4+3]>0;
        if(allowed)inside++;else outside++;
      }
      const gaps=[];for(let x=152;x<258;x+=2){let sum=0;for(let y=91;y<=97;y++)sum+=data[(Math.round(y*2.5)*c.width+Math.round(x*2.5))*4+3];if(!sum)gaps.push(x);}
      return {inside,outside,gaps};
    },ART_PICTURES[1].regions);
    check(clipping.inside>0&&clipping.outside===0,`${name} no paint outside starting visible region`,clipping);
    check(!clipping.gaps.length,`${name} fast stroke has no gaps`);
    await undo();check(await raster(page)===blank,`${name} undo restores exact pixels`);
    const dot=at(200,75);await page.mouse.click(dot.x,dot.y);await settle(page);
    const tapPixels=await canvas.evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i])n++;return n;});
    check(tapPixels>0&&tapPixels<4000,`${name} tap leaves only one brush dab`,tapPixels);await undo();
    const dome=page.locator('.art-keyboard path').nth(2);await dome.focus();await page.keyboard.press('Enter');await settle(page);
    const keyboard=await canvas.evaluate(c=>{const ctx=c.getContext('2d');return [[200,50],[150,95],[250,95]].map(([x,y])=>ctx.getImageData(x*2.5,y*2.5,1,1).data[3]);});
    check(keyboard.every(a=>a>0),`${name} Enter paints the whole region with texture`,keyboard);
    await undo();check(await raster(page)===blank,`${name} keyboard fill is one undo step`);
    const snapshots=[blank];
    for(let i=0;i<8;i++){const p=at(175+i*5,80);await page.mouse.click(p.x,p.y);await settle(page);snapshots.push(await raster(page));}
    let undoExact=true;for(let i=7;i>=0;i--){await undo();if(await raster(page)!==snapshots[i])undoExact=false;}
    check(undoExact,`${name} eight strokes undo individually with exact pixels`);
    await dome.focus();await page.keyboard.press('Enter');await page.locator('.art-color').nth(4).click();
    await drag([[140,145],[140,215],[157,215],[157,145]],8);await page.mouse.up();
    await page.locator('.art-color').nth(2).click();await drag([[195,172],[205,185],[195,201],[207,207]],6);await page.mouse.up();await settle(page);
    await page.mouse.move(at(205,185).x,at(205,185).y);await settle(page);
    await page.screenshot({path:`${out}/board-${name}.png`});const artwork=await raster(page);
    await page.locator('.art-done').click();await page.waitForSelector('.art-result');await settle(page);
    check(await raster(page)===artwork,`${name} finished view shows identical painted pixels`);
    const ratio=await page.locator('.art-paint').evaluate(c=>{const r=c.getBoundingClientRect();return r.width/r.height;});
    check(Math.abs(ratio-4/3)<.005,`${name} finished picture preserves aspect ratio`,ratio);
    check(!(await buttonSizes(page)).length&&!(await overflow(page)).length,`${name} finished view fits and buttons ≥64px`);
    await page.screenshot({path:`${out}/done-${name}.png`});
    await page.getByRole('button',{name:/ระบายต่อ/}).click();await settle(page);check(await raster(page)===artwork,`${name} keep coloring preserves artwork`);
    await page.evaluate(async()=>{if(document.fullscreenElement)await document.exitFullscreen();});
    await page.setViewportSize({width:width+1,height});await settle(page);check(await raster(page)===artwork,`${name} resize preserves raster`);await page.setViewportSize({width,height});
    await page.emulateMedia({reducedMotion:'reduce'});await settle(page);
    const motion=await page.locator('.art-brush').evaluate(el=>({property:getComputedStyle(el).transitionProperty,duration:getComputedStyle(el).transitionDuration}));
    check(motion.property==='none',`${name} reduced motion disables brush transition`,motion);
    check(!errors.length,`${name} no console/page errors`,errors);await context.close();
  }
  // Start on a real palette well, cross empty space, then enter the paper in one native touch.
  {
    const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
    const page=await context.newPage();await page.goto(`${base}/learn/art`);
    await page.locator('.art-pick[data-slot="1"]').tap();await page.waitForSelector('.art-paint');
    await page.addStyleTag({content:'nextjs-portal{display:none!important}'});await settle(page);
    const canvas=page.locator('.art-paint'),bounds=await canvas.boundingBox(),blank=await raster(page);
    const cdp=await context.newCDPSession(page);
    // Pace native samples like a finger; an instantaneous cross-screen fling can
    // make Chromium consume the next tap as a gesture-stop instead of a click.
    const touch=async(type,p)=>{await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:p?[{...p,id:1}]:[]});await page.waitForTimeout(100);};
    const well=await page.locator('.art-color').last().boundingBox();
    const start={x:well.x+well.width/2,y:well.y+well.height/2};
    const middle={x:bounds.x+bounds.width+12,y:bounds.y+bounds.height+12};
    const outside={x:middle.x,y:bounds.y+bounds.height*.5};
    const inside={x:bounds.x+bounds.width-5,y:outside.y};
    const destination={x:bounds.x+bounds.width*.35,y:outside.y};
    const tipError=target=>page.evaluate(({anchor,target})=>{const r=document.querySelector('.art-brush-art').getBoundingClientRect();return Math.hypot(r.left+r.width*anchor.x/100-target.x,r.top+r.height*anchor.y/100-target.y);},{anchor:BRUSH_TIP,target});
    await touch('touchStart',start);await settle(page);
    check(await page.locator('.art-color').last().getAttribute('aria-pressed')==='true','touch down selects tray color');
    await touch('touchMove',middle);await settle(page);
    check(await tipError(middle)<=3,'native tray touch brush follows first empty-space move');
    await touch('touchMove',outside);await settle(page);
    check(await tipError(outside)<=3,'native tray touch brush follows second empty-space move');
    await page.screenshot({path:`${out}/touch-midway-844x390.png`});
    check(await raster(page)===blank,'tray drag paints nothing before entering paper');
    await touch('touchMove',inside);await touch('touchMove',destination);await settle(page);
    check(await tipError(destination)<=3,'captured tray touch follows onto canvas');
    await touch('touchEnd');await settle(page);
    const coverage=await canvas.evaluate((c,regions)=>{
      const mask=document.createElement('canvas');mask.width=c.width;mask.height=c.height;
      const m=mask.getContext('2d');m.scale(c.width/400,c.height/300);
      // The right edge at y=150 enters the background before crossing the lantern.
      m.fill(new Path2D(regions[0].d),'evenodd');m.globalCompositeOperation='destination-out';
      for(const r of regions.slice(1))m.fill(new Path2D(r.d),'evenodd');
      const allowed=m.getImageData(0,0,c.width,c.height).data,d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
      let inside=0,outside=0;for(let i=3;i<d.length;i+=4)if(d[i]>20){if(allowed[i])inside++;else outside++;}return {inside,outside};
    },ART_PICTURES[1].regions);
    check(coverage.inside>0&&coverage.outside===0,'native tray touch locks first entered region with no spill',coverage);
    await page.screenshot({path:`${out}/touch-painted-844x390.png`});
    await page.getByRole('button',{name:'ย้อนกลับ',exact:true}).tap();await settle(page);
    check(await raster(page)===blank,'tray touch is one undo step');
    await touch('touchStart',start);await touch('touchEnd');await settle(page);
    check(await raster(page)===blank&&await page.locator('.art-color').last().getAttribute('aria-pressed')==='true','tray tap selects without painting');
    await touch('touchStart',start);await touch('touchMove',middle);await touch('touchCancel');await settle(page);
    await page.touchscreen.tap(destination.x,destination.y);await settle(page);
    check(await raster(page)!==blank,'cancelled tray drag releases pointer for direct touch painting');
    await page.getByRole('button',{name:'ย้อนกลับ',exact:true}).tap();await settle(page);
    await page.mouse.move(start.x,start.y);await page.mouse.down();
    for(const p of [middle,outside,inside,destination])await page.mouse.move(p.x,p.y);
    await page.mouse.up();await settle(page);
    check(await raster(page)!==blank,'mouse can also drag from tray onto paper');
    await page.getByRole('button',{name:'ย้อนกลับ',exact:true}).click();await settle(page);
    const pen=(type,p,buttons)=>cdp.send('Input.dispatchMouseEvent',{type,...p,button:buttons?'left':'none',buttons,pointerType:'pen',clickCount:1});
    await pen('mousePressed',start,1);
    for(const p of [middle,outside,inside,destination])await pen('mouseMoved',p,1);
    await settle(page);check(await tipError(destination)<=3,'pen tray drag follows pointer');
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',...destination,button:'left',buttons:0,pointerType:'pen',clickCount:1});await settle(page);
    check(await raster(page)!==blank,'pen can also drag from tray onto paper');
    await context.close();
  }
  // Native multi-touch/cancel and history checkpointing, without DOM-dispatched pointer events.
  {
    const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
    const page=await context.newPage();await page.goto(`${base}/learn/art`);await page.locator('.art-pick[data-slot="0"]').click();await page.waitForSelector('.art-paint');
    const bounds=await page.locator('.art-paint').boundingBox();
    const at=(x,y,id=1)=>({x:bounds.x+x/400*bounds.width,y:bounds.y+y/300*bounds.height,id});
    const blank=await raster(page),undo=async()=>{await page.getByRole('button',{name:'ย้อนกลับ',exact:true}).click();await settle(page);};
    const lines=await page.locator('.art-lines').evaluate(c=>c.toDataURL());
    const nearMast=at(188,100);await page.mouse.move(nearMast.x,nearMast.y);await page.mouse.down();
    for(const [x,y] of [[200,110],[220,40],[245,40]]){const p=at(x,y);await page.mouse.move(p.x,p.y,{steps:4});}await page.mouse.up();await settle(page);
    const thin=await page.locator('.art-paint').evaluate(c=>{const ctx=c.getContext('2d');return {mast:ctx.getImageData(200*2.5,110*2.5,1,1).data[3],sail:ctx.getImageData(185*2.5,110*2.5,1,1).data[3],flag:ctx.getImageData(220*2.5,40*2.5,1,1).data[3]};});
    check(thin.mast>0&&thin.sail===0&&thin.flag===0,'thin mast hit slop + later flag occludes paint',thin);
    check(await page.locator('.art-lines').evaluate(c=>c.toDataURL())===lines,'painting never changes top outline raster');await undo();
    const cdp=await context.newCDPSession(page),one=at(30,160,1),two=at(350,160,2);
    const touch=(type,touchPoints)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints});
    await touch('touchStart',[one]);await settle(page);const first=await raster(page);
    await touch('touchStart',[one,two]);await touch('touchMove',[one,{...two,y:two.y+20}]);await settle(page);
    check(await raster(page)===first,'second finger does not add paint or disturb first');
    await touch('touchMove',[at(70,160,1),two]);await settle(page);
    check(await raster(page)!==first,'primary finger still paints with second finger down');
    await touch('touchCancel',[]);await settle(page);
    const cancelled=await raster(page);await page.mouse.click(at(80,170).x,at(80,170).y);await settle(page);
    check(await raster(page)!==cancelled,'pointercancel releases capture and next stroke works');await undo();check(await raster(page)===cancelled,'cancelled partial stroke retained as one undo step');await undo();check(await raster(page)===blank,'touch gesture undo returns blank');
    const snapshots=[];
    for(let i=0;i<20;i++){const p=at(20+i*4,155);await page.mouse.click(p.x,p.y);await settle(page);snapshots.push(await raster(page));}
    for(let i=0;i<16;i++)await undo();
    check(await raster(page)===snapshots[3],'16-step history bakes older strokes without losing pixels');
    // Keyboard Space on background respects every foreground silhouette and evenodd holes.
    await page.locator('.art-keyboard path').first().focus();await page.keyboard.press('Space');await settle(page);
    const occlusion=await page.locator('.art-paint').evaluate(c=>{const ctx=c.getContext('2d');return [[200,220],[200,100],[306,60]].map(([x,y])=>ctx.getImageData(x*2.5,y*2.5,1,1).data[3]);});
    check(occlusion.every(a=>a===0),'background keyboard paint does not cover hull, mast or sun',occlusion);
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page=await context.newPage();await page.goto(`${base}/learn/art`);await page.locator('.art-pick[data-slot="1"]').tap();
  await page.waitForSelector('.gc-rotate');check(true,'portrait rotate gate');
  await page.locator('.gc-rotate button.gc-button').last().tap();await page.waitForSelector('.art-pick[data-slot="1"]');check(true,'rotate gate back works');await context.close();
} finally { await browser.close(); await writeFile(`${out}/results.json`,JSON.stringify({results,failures},null,2)+'\n'); }
console.log(failures.length?`${failures.length} FAILED`:'all passed');process.exitCode=failures.length?1:0;
