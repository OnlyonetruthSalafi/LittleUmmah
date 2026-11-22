import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir,writeFile } from 'node:fs/promises';
import { landscapeProblems,measureLandscapePage } from './game-landscape-stage1.mjs';
import { marbleMachine } from '../src/features/games/engine/marbleRun.ts';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const base=process.argv[2]||'http://localhost:3221';
const out='output/workshops';
await mkdir(out,{recursive:true});
const metrics=[];
const errors=[];
try {
  for(const slug of (process.argv[3] ? [process.argv[3]] : ['canal-lock','sandcastle','marble-run'])){
    const ctx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    await ctx.addInitScript(()=>{
      sessionStorage.setItem('lu-games-guide-seen','1');localStorage.setItem('little-ummah:sound','off');
      localStorage.setItem('lu-settings',JSON.stringify({starsEnabled:false,timeEnabled:false,minutes:90,seeded:true}));
    });
    const page=await ctx.newPage();page.setDefaultTimeout(12000);
    page.on('pageerror',e=>errors.push(e.message));
    const art=[];
    page.on('request',r=>{if(/^\/games\/(canal-lock|sandcastle|marble-run)\//.test(new URL(r.url()).pathname))art.push(new URL(r.url()).pathname);});
    await page.goto(base+'/games');
    const card=page.locator('a[href$="/games/'+slug+'"]').first();
    await card.scrollIntoViewIfNeeded();await card.locator('img').evaluate(img=>img.decode());
    if(slug==='sandcastle'){
      const src=await card.locator('img').evaluate(img=>decodeURIComponent(img.currentSrc));
      assert.ok(src.includes('/games/hub/sandcastle.webp'),'The hub shows the Blender sandcastle cover');
      assert.equal(await page.locator('a[href$="/games/sand-trails"]').count(),0);
      await card.screenshot({path:out+'/sandcastle-hub-card.png'});
    }
    if(slug==='marble-run'){
      const src=await card.locator('img').evaluate(img=>decodeURIComponent(img.currentSrc));
      assert.match(src,/\/_next\/static\/(?:immutable\/)?media\/marble-run\.[\w-]+\.webp/,'The hub uses the current Blender cover');
      await card.screenshot({path:out+'/marble-run-hub-card.png'});
    }
    await card.tap();await page.locator('.gc-rotate').waitFor();
    assert.deepEqual(art,[]);
    await page.setViewportSize({width:844,height:390});await page.locator('.gc-rotate').waitFor({state:'detached'});
    if(slug==='marble-run'){
      const lever=page.locator('[data-practice-lever]'), release=page.locator('.marble-trial-release');
      assert.ok(await release.isDisabled());
      await page.setViewportSize({width:568,height:320});
      await lever.focus();await page.keyboard.press('Enter');
      assert.equal(await lever.getAttribute('data-practice-lever'),'-1');
      await release.click();
      await page.waitForFunction(()=>Number(document.querySelector('[data-hatch-open]')?.getAttribute('data-hatch-open'))>.25);
      assert.ok(await lever.isDisabled());
      await page.getByText('Try the other side',{exact:true}).waitFor();
      await lever.click();
      assert.equal(await lever.getAttribute('data-practice-lever'),'1');
      await release.click();
      await page.getByText('Into the star cup!',{exact:true}).waitFor();
      assert.equal(await page.locator('[data-hatch-open]').getAttribute('data-hatch-open'),'0.00');
      assert.deepEqual(art,[],'Practising does not fetch any level art');
      await page.screenshot({path:out+'/marble-practice-small.png'});
      await page.setViewportSize({width:844,height:390});
    }
    await page.screenshot({path:out+'/'+slug+'-intro.png'});
    for(const level of [1,2,3]){
      await page.locator('.harbor-level').nth(level-1).click();
      await page.locator('.harbor-start').click();
      await page.locator('.ws-stage > img').evaluate(img=>img.decode());
      await page.waitForFunction(()=>!!document.querySelector('.ws-stage')&&!document.querySelector('.gc-board[inert]'));
      await page.locator('.gc-countdown').waitFor({state:'detached'});
      if(await page.evaluate(()=>!!document.fullscreenElement))await page.evaluate(()=>document.exitFullscreen());
      for(const [width,height] of [[568,320],[1280,720],[844,390]]){
        await page.setViewportSize({width,height});await page.evaluate(()=>document.fonts.ready);
        const issues=landscapeProblems({slug,...await page.evaluate(measureLandscapePage)});
        assert.deepEqual(issues,[],slug+' '+width+'x'+height);
        if(slug==='marble-run'){
          const board=await page.locator('.ws-stage').boundingBox();
          const launch=await page.locator('.marble-launch').boundingBox();
          assert.ok(Math.abs(board.x+board.width/2-launch.x-launch.width/2)<1,'Launch control is centred');
        }
        if(slug==='marble-run' && width===568){
          const star=await page.locator('.marble-goal-star').boundingBox();
          assert.ok(Math.min(star.width,star.height)>=30,'The destination star is visible on a small phone');
          await page.screenshot({path:out+'/marble-run-'+level+'-phone.png'});
        }
      }
      await page.screenshot({path:out+'/'+slug+'-'+level+'.png'});
      const files=await page.evaluate(slug=>performance.getEntriesByType('resource').filter(r=>new URL(r.name).pathname.startsWith('/games/'+slug+'/')).map(r=>({file:r.name.split('/').pop(),bytes:r.encodedBodySize})),slug);
      assert.ok(files.some(f=>f.file==='level-'+level+'.webp'));
      assert.ok(art.every(p=>p.startsWith('/games/'+slug+'/')&&(!p.includes('/level-')||Number(p.match(/level-(\d)/)[1])<=level)));
      metrics.push({slug,level,files});
      const button=page.locator('.ws-action');
      if(slug==='canal-lock'){
        const controls=page.locator('.canal-controls');
        const part=action=>controls.locator('[data-lock-action="'+action+'"]');
        const waitForRest=()=>controls.locator('xpath=self::*[@data-moving="false"]').waitFor();
        const press=async action=>{
          await part(action).focus();
          await page.keyboard.press('Enter');
          await waitForRest();
        };
        const dragPart=async action=>{
          const box=await part(action).boundingBox();
          const x=box.x+box.width/2, y=box.y+box.height/2;
          if(action==='fill'){
            await page.mouse.move(x+18,y);await page.mouse.down();
            for(let i=1;i<=8;i++)await page.mouse.move(x+18*Math.cos(i*Math.PI/16),y+18*Math.sin(i*Math.PI/16));
          }else{
            await page.mouse.move(x,y);await page.mouse.down();
            await page.mouse.move(x+(action==='open'?box.width*.33:0),y+(action==='drain'?box.height*.33:0),{steps:6});
          }
          await page.mouse.up();await waitForRest();
        };
        assert.equal(await page.locator('.ws-console button').count(),0);
        const hint=action=>controls.locator('[data-guide="'+action+'"]');
        if(level===1){
          await hint('fill').waitFor({timeout:11000});
          await page.screenshot({path:out+'/canal-wheel-guide.png'});
          await part('open').tap();await hint('fill').waitFor();
          assert.equal(await controls.getAttribute('data-water'),'1');
          await dragPart('fill');await hint('open').waitFor();
          assert.equal(await hint('open').getAttribute('data-lock-part'),'right');
          await dragPart('open');
        }else if(level===2){
          await part('other-gate').tap();await hint('open').waitFor();
          assert.equal(await hint('open').getAttribute('data-lock-part'),'left');
          await press('open');
          await dragPart('drain');
          assert.equal(await controls.getAttribute('data-water'),'1');
          await press('drain');await part('open').tap();await waitForRest();
        }else{
          await controls.tap({position:{x:12,y:8}});await controls.tap({position:{x:12,y:8}});
          await hint('drain').waitFor();
          await part('fill').tap();await waitForRest();await hint('drain').waitFor();
          for(const action of ['drain','drain','open','fill','fill','open'])await press(action);
        }
        assert.equal(await controls.getAttribute('data-berth'),'harbour');
      }else if(slug==='sandcastle'){
        const yard=page.locator('.sand-yard'), bucket=page.locator('[data-sand-tool="bucket"]');
        const plot=id=>page.locator('[data-plot="'+id+'"]');
        const tool=name=>page.locator('[data-sand-tool="'+name+'"]');
        const mix=page.locator('.sand-mix');
        if(level===1)await mix.locator('.sand-guide').waitFor({timeout:11000});
        const order=level===1?['tower']:level===2?['east','west','gate']:['gate','turret','east','west'];
        for(const [i,id] of order.entries()){
          await mix.waitFor();
          assert.equal(await bucket.count(),0);
          const moisture=Number(await mix.getAttribute('data-sand'));
          if(moisture!==1){
            await tool('pile').tap();await mix.locator('.sand-guide').waitFor();
            assert.equal(await mix.getAttribute('data-pats'),'0');
            await tool(moisture===0?'water':'scoop').tap();
            if(level===1){
              await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.sand-waterfall')).opacity)>.9);
              await page.screenshot({path:out+'/sandcastle-watering.png'});
              await page.setViewportSize({width:390,height:844});await page.locator('.gc-rotate').waitFor();
              await page.waitForTimeout(2250);assert.equal(await mix.getAttribute('data-sand'),'0');
              await page.setViewportSize({width:844,height:390});await page.locator('.gc-rotate').waitFor({state:'detached'});
            }
            await page.locator('.sand-mix[data-motion="idle"][data-sand="1"]').waitFor();
          }
          for(let n=1;n<=3;n++){
            await tool('pile').tap();
            assert.equal(await mix.getAttribute('data-pats'),String(n));
            assert.equal(await bucket.count(),0);
          }
          if(i===0){
            const pile=await tool('pile').boundingBox();
            await page.mouse.move(pile.x+pile.width*.23,pile.y+pile.height/2);await page.mouse.down();
            await page.mouse.move(pile.x+pile.width*.76,pile.y+pile.height/2,{steps:8});await page.mouse.up();
          }else{
            await tool('pile').focus();await page.keyboard.press('Enter');
          }
          await bucket.waitFor();
          if(level===3 && i===0)assert.equal(await plot('turret').count(),0);
          if(i===0){
            const start=await bucket.boundingBox(),end=await plot(id).boundingBox();
            await page.mouse.move(start.x+start.width/2,start.y+start.height/2);await page.mouse.down();
            await page.mouse.move(end.x+end.width/2,end.y+end.height/2,{steps:10});await page.mouse.up();
          }else{
            await plot(id).focus();await page.keyboard.press('Enter');
          }
          await page.locator('.sand-yard[data-pieces="'+(i+1)+'"]').waitFor();
          assert.equal(await yard.getAttribute('data-pieces'),String(i+1));
        }
        await page.screenshot({path:out+'/sandcastle-built-'+level+'.png'});
        await page.locator('[data-flag="'+(level-1)+'"]').tap();
      }else{
        const machine=marbleMachine(level);
        if(level===1){
          await button.click();
          await page.waitForFunction(()=>Number(document.querySelector('[data-hatch-open]')?.getAttribute('data-hatch-open'))>.25);
          const startY=Number(await page.locator('[data-marble]').getAttribute('y'));
          assert.ok(Math.abs(startY+25-machine.intake.y)<.1,'Plates open while the marble is still supported');
          await page.getByText('A ramp is missing.',{exact:false}).waitFor();
        }
        assert.ok(files.some(f=>f.file==='rotor-'+level+'.webp' && f.bytes>0),'Only the active scene needs its moving landmark');
        if(level===1){
          const gate=page.locator('[data-gate="0"]');
          await gate.focus();await page.keyboard.press('Enter');await page.keyboard.press('Enter');
          await button.click();await page.getByText('Switch a ramp to reach the star.',{exact:true}).waitFor();
          assert.equal(await page.locator('progress').getAttribute('value'),'0');
        }
        for(const [j,cup] of machine.goals.entries()){
          const beacon=page.locator('.marble-beacon');
          assert.equal(await beacon.count(),1);
          assert.equal(await beacon.evaluate(e=>e.parentElement.querySelector('text').textContent),String(cup+1));
          const setGate=async(i,dir)=>{
            const peg=page.locator('[data-gate="'+i+'"]');
            while(Number(await peg.getAttribute('data-direction'))!==dir)await peg.click();
          };
          const checkGuide=level===2 && j===0;
          if(checkGuide)await page.locator('[data-guide="0"]').waitFor();
          if(machine.gates.length===1)await setGate(0,cup===1?1:-1);
          else {
            await setGate(0,cup<2?-1:1);
            if(checkGuide){
              assert.equal(await page.locator('[data-guide]').count(),0);
              await page.locator('[data-guide="2"]').waitFor();
              await page.screenshot({path:out+'/marble-run-idle-switch.png'});
            }
            await setGate(cup<2?1:2,cup%2?1:-1);
          }
          if(checkGuide){
            await page.locator('[data-guide="release"]').waitFor();
            await page.screenshot({path:out+'/marble-run-idle-release.png'});
          }
          if(j===0){
            await page.setViewportSize({width:1280,height:720});
            await page.screenshot({path:out+'/'+slug+'-'+level+'-connected.png'});
            await page.setViewportSize({width:844,height:390});
          }
          await button.click();
          if(level===1&&j===0){
            await page.setViewportSize({width:390,height:844});await page.locator('.gc-rotate').waitFor();
            const sprite=page.locator('[data-marble]');
            const x=await sprite.getAttribute('y');await page.waitForTimeout(250);assert.equal(await sprite.getAttribute('y'),x);
            await page.setViewportSize({width:844,height:390});await page.locator('.gc-rotate').waitFor({state:'detached'});
          }
          if(j<machine.goals.length-1)await page.waitForFunction(()=>document.querySelector('.ws-action')?.disabled===false);
        }
      }
      await page.locator('.gc-result').waitFor();console.log(slug,level,'passed');
      if(level<3)await page.locator('.gc-result-actions .gc-primary').click();
    }
    await page.goto(base+'/en/games/'+slug);
    assert.doesNotMatch(await page.locator('.harbor-intro').innerText(),/[\u0e00-\u0e7f]/);
    await ctx.close();
  }
  assert.deepEqual(errors,[]);await writeFile(out+'/network.json',JSON.stringify(metrics,null,2));
}finally{await browser.close();}
