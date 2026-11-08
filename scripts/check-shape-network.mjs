// Native touch and image lifecycle regression tests for BUG-1. Called by check-shape-browser.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { plateFor } from '../src/features/games/data/shapeArt.ts';
export async function checkShapeNetwork(browser, base, out) {
  const rows = [];
  const order = ['circle', 'square', 'rectangle', 'star', 'triangle'];
  async function start(width, height, palette) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: true, reducedMotion: 'reduce' });
    await context.addInitScript(palette => {
      localStorage.setItem('little-ummah:sound', 'off');
      sessionStorage.setItem('little-ummah:shape-palette', palette === 'classic' ? 'pastel' : 'classic');
    }, palette);
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${base}/games/shape-match`);
    await page.getByRole('button', { name: /^เริ่มเล่น/ }).click();
    await ready(page);
    const cdp = await context.newCDPSession(page);
    const center = async locator => { const r = await locator.boundingBox(); assert.ok(r); return { x: r.x+r.width/2, y: r.y+r.height/2, id: 1 }; };
    async function drag(shape, target = shape, cancel = false) {
      const from = await center(page.locator(`[data-item-id="${shape}"]`));
      const to = typeof target === 'string' ? await center(page.locator(`[data-drop-id="${target}"]`)) : target;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...to, id: 1 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] });
      assert.equal(await page.locator('[data-dragging]').count(), 0);
      assert.ok(await page.locator('[data-item-id]').evaluateAll(es => es.every(e => !e.style.translate)));
    }
    return { context, page, drag, errors };
  }
  async function ready(page) {
    await page.locator('.gc-board:not([inert]) .shp-scene').waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll('.shp-scene img')].every(i => i.complete && i.naturalWidth > 0));
  }
  async function state(page) {
    return page.evaluate(() => {
      const plate = document.querySelector('.shp-plate-art:not([data-pending])');
      const rect = el => { const r=el.getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height }; };
      const items = [...document.querySelectorAll('[data-item-id]')];
      return { progress: document.querySelector('progress')?.value, filled: document.querySelectorAll('.shp-hole-filled').length,
        items: items.map(e => e.dataset.itemId), blocks: items.map(rect), visible: items.every(e => { const r=e.getBoundingClientRect(), i=e.querySelector('img'); return r.left>=0 && r.top>=0 && r.right<=innerWidth && r.bottom<=innerHeight && i?.complete && i.naturalWidth>0 && getComputedStyle(e).visibility==='visible'; }),
        plate: plate && { src: plate.getAttribute('src'), loaded: plate.complete && plate.naturalWidth>0, opacity:getComputedStyle(plate).opacity, ...rect(plate) },
        fallback: document.querySelectorAll('.gc-image-fallback').length, result: !!document.querySelector('.gc-result'),
        scroll: { width:document.documentElement.scrollWidth, height:document.documentElement.scrollHeight },
        progressBackground: document.querySelector('.gc-progress-row') && getComputedStyle(document.querySelector('.gc-progress-row')).backgroundColor };
    });
  }
  async function checkState(page, n, palette, placed) {
    const s=await state(page);
    assert.equal(s.progress,n); assert.equal(s.filled,n); assert.equal(s.items.length,5-n);
    assert.ok(s.visible); assert.equal(s.fallback,0); assert.ok(s.plate?.loaded); assert.equal(s.plate.opacity,'1');
    assert.equal(new URL(s.plate.src, base).pathname,plateFor(placed,palette));
    assert.ok(s.scroll.width<=page.viewportSize().width && s.scroll.height<=page.viewportSize().height);
    return s;
  }
  const waitCount = (page,n) => page.waitForFunction(n => document.querySelector('progress')?.value===n,n);
  async function result(page) {
    await page.locator('.gc-result').waitFor();
    assert.equal(await page.getByRole('button',{name:/ด่านต่อไป/}).count(),0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollHeight<=innerHeight && document.documentElement.scrollWidth<=innerWidth));
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('little-ummah:games:v1:shape-match')).levelStars),{'1':3});
  }
  try {
    // Both available palettes, complete the sole level with native touch at both requested sizes.
    for (const [width,height] of [[844,390],[740,360]]) for (const palette of ['classic','pastel']) for (const last of ['star','triangle']) {
      const {context,page,drag,errors}=await start(width,height,palette);
      const row={scenario:'normal-touch',width,height,palette,last,states:[]};rows.push(row);
      await drag('star','square'); await checkState(page,0,palette,[]);
      await drag('triangle',{x:4,y:height-4}); await checkState(page,0,palette,[]);
      await drag('star','star',true); await checkState(page,0,palette,[]);
      const placed=[];
      for(const shape of [...order.filter(s=>s!==last),last]) {
        await drag(shape); placed.push(shape); await waitCount(page,placed.length);
        row.states.push(await checkState(page,placed.length,palette,placed));
      }
      await page.screenshot({path:`${out}/shots/touch-${width}-${palette}-${last}-five.png`});
      await result(page); await page.screenshot({path:`${out}/shots/touch-${width}-${palette}-${last}-result.png`});
      assert.deepEqual(errors,[]); await context.close(); console.log(`PASS native touch ${width}x${height} ${palette} last=${last}`);
    }
    for(const palette of ['classic','pastel']) for(const last of ['star','triangle']) for(const scenario of ['slow-middle','slow-final','fail-middle']) {
      const {context,page,drag,errors}=await start(844,390,palette);
      const row={scenario,palette,last,states:[]};rows.push(row);
      const sequence=[...order.filter(s=>s!==last),last], index=scenario==='slow-final'?4:3;
      const target=plateFor(sequence.slice(0,index+1),palette);
      let attempts=0, release;
      await page.route(`**${target}`,async route=>{
        attempts++;
        if(attempts===1) {
          if(scenario==='fail-middle') { await route.abort(); return; }
          await new Promise(resolve=>{release=resolve;});
        }
        await route.continue().catch(()=>{});
      });
      for(let i=0;i<5;i++) {
        const shape=sequence[i]; await drag(shape);
        if(i===index) {
          await page.waitForFunction(() => !!document.querySelector('.shp-load-status'));
          assert.ok(await page.locator('.shp-load-status').evaluate(e => e.getBoundingClientRect().height >= 30 && getComputedStyle(e).clipPath === 'none'), 'loading/retry message is readable');
          assert.match(await page.locator('.shp-load-status').innerText(), /[\u0E00-\u0E7F]/, 'status keeps Thai text');
          assert.ok(await page.locator('.shp-load-status').evaluate(e => {
            const r = e.getBoundingClientRect(), top = document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
            return top === e || e.contains(top);
          }), 'status stays above island decorations');
          if(scenario==='fail-middle') await page.waitForFunction(() => !document.querySelector('.shp-scene[data-loading]'));
          else {
            // A fast second drop of the same still-visible piece cannot queue
            // another placement or start a duplicate request while loading.
            await drag(shape);
            assert.equal(attempts, 1);
            await page.waitForTimeout(2400);
          }
          row.states.push(await checkState(page,i,palette,sequence.slice(0,i)));
          assert.equal(await page.locator('.gc-result').count(),0);
          await page.screenshot({path:`${out}/shots/${scenario}-${palette}-${last}-pending.png`});
          if(scenario==='fail-middle') await drag(shape); else release();
        }
        await waitCount(page,i+1); row.states.push(await checkState(page,i+1,palette,sequence.slice(0,i+1)));
      }
      const loadedAt=Date.now();
      await page.screenshot({path:`${out}/shots/${scenario}-${palette}-${last}-five.png`});
      await page.waitForTimeout(650); assert.equal(await page.locator('.gc-result').count(),0,'complete plate remains visible');
      await result(page); row.afterLoadedMs=Date.now()-loadedAt;row.attempts=attempts;
      assert.deepEqual(errors,[]); await context.close(); console.log(`PASS ${scenario} ${palette} last=${last}`);
    }
    for(const scenario of ['watchdog','restart','rotate-pending','rotate-final']) {
      const {context,page,drag,errors}=await start(844,390,'classic');
      const row={scenario,states:[]};rows.push(row);
      const index=scenario==='rotate-final'?4:0;
      for(let i=0;i<index;i++){await drag(order[i]);await waitCount(page,i+1);}
      let release;
      await page.route(`**${plateFor(order.slice(0,index+1),'classic')}`,async route=>{await new Promise(r=>{release=r;});await route.continue().catch(()=>{});});
      await drag(order[index]); await page.waitForFunction(()=>!!document.querySelector('.shp-scene[data-loading]'));
      if(scenario==='watchdog') {
        await page.waitForFunction(()=>!document.querySelector('.shp-scene[data-loading]'),{},{timeout:13000});
        row.states.push(await checkState(page,0,'classic',[]));release();await page.waitForTimeout(300);
        assert.equal(await page.locator('.shp-hole-filled').count(),0,'late watchdog response ignored');
        await page.unrouteAll({behavior:'wait'});await drag(order[0]);await waitCount(page,1);
      } else if(scenario==='restart') {
        await page.getByRole('button',{name:/เริ่มใหม่/}).click();release();await ready(page);
        row.states.push(await checkState(page,0,'pastel',[])); await page.waitForTimeout(1300);
        assert.equal(await page.locator('.gc-result').count(),0,'old round cannot complete');
      } else {
        await page.evaluate(async () => { if (document.fullscreenElement) await document.exitFullscreen(); });
        await page.setViewportSize({width:390,height:844});await page.locator('.gc-rotate').waitFor();release();
        await page.waitForTimeout(1500);assert.equal(await page.locator('.gc-result').count(),0);
        await page.setViewportSize({width:844,height:390});await page.locator('.gc-countdown').waitFor();
        assert.equal(await page.locator('.gc-result').count(),0);await page.locator('.gc-countdown').waitFor({state:'detached'});
        row.states.push(await checkState(page,index+1,'classic',order.slice(0,index+1)));
        if(index===4) await result(page);
      }
      assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${scenario}`);
    }
  } finally { await writeFile(`${out}/network-results.json`,JSON.stringify(rows,null,2)+'\n'); }
}
