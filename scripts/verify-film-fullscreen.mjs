// Run against a build with local film media. Native Safari calls are simulated;
// real Chromium fullscreen and the HTML player are exercised without API mocks.
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE??'playwright');
const base=process.env.BASE_URL??'http://localhost:3330';
const out=process.env.FULLSCREEN_QA_OUT??'output/film-fullscreen';
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const reports=[],errors=[];
const scenarios=[
 {id:'moral-landscape',route:'moral',title:'แบ่งปันของเล่น',turn:194.742,resume:198.742},
 {id:'faith-landscape',route:'faith-basics',title:'ใครคือพระเจ้าของหนู',turn:175.592245,resume:185,ratio:1280/636},
 {id:'explore-photo',route:'explore',title:'ทะเลทราย',turn:46.52,resume:47.07,photo:true},
 {id:'desktop',route:'moral',title:'แบ่งปันของเล่น',width:1366,height:900,turn:194.742,resume:198.742},
 {id:'denied-portrait',route:'moral',title:'แบ่งปันของเล่น',width:390,height:844,fallback:true,denied:true},
 {id:'unsupported-english',route:'moral',title:'Share your toys',en:true,width:390,height:844,fallback:true},
 {id:'native-stop',route:'moral',title:'แบ่งปันของเล่น',native:true,turn:194.742,resume:198.742},
];
try {for(const s of scenarios){
 const context=await browser.newContext({viewport:{width:s.width??844,height:s.height??390},hasTouch:s.id!=='desktop',reducedMotion:s.fallback?'reduce':'no-preference'});
 await context.addInitScript(({fallback,denied,native})=>{
  sessionStorage.setItem('lu-moral-guide-seen','1');localStorage.setItem('little-ummah:sound','on');
  window.orientationCalls=[];
  Object.defineProperty(screen.orientation,'lock',{configurable:true,value:async v=>window.orientationCalls.push(v)});
  Object.defineProperty(screen.orientation,'unlock',{configurable:true,value:()=>window.orientationCalls.push('unlock')});
  if(fallback||native){Object.defineProperty(Element.prototype,'requestFullscreen',{configurable:true,value:denied?()=>Promise.reject(new Error('Denied for test')):undefined});Object.defineProperty(Element.prototype,'webkitRequestFullscreen',{configurable:true,value:undefined});}
  if(native){
   HTMLVideoElement.prototype.webkitEnterFullscreen=function(){this.webkitDisplayingFullscreen=true;this.dispatchEvent(new Event('webkitbeginfullscreen'));};
   HTMLVideoElement.prototype.webkitExitFullscreen=function(){this.webkitDisplayingFullscreen=false;this.dispatchEvent(new Event('webkitendfullscreen'));};
  }
 },s);
 const p=await context.newPage();p.on('pageerror',e=>errors.push({scenario:s.id,message:e.message}));
 await p.goto(`${base}${s.en?'/en':''}/learn/${s.route}#kids`);
 const card=p.locator('#kids .mrl-card').filter({hasText:s.title}).first();await card.click();
 const d=p.locator('dialog.mrl-film[open]'),v=d.locator('video'),full=d.locator('.mrl-film-fullscreen'),body=d.locator('.mrl-cartoon-body'),main=d.locator('.mrl-cartoon-controls button').last();
 await p.waitForFunction(()=>document.querySelector('dialog.mrl-film[open] video')?.readyState>=2,null,{timeout:60000});
 if(s.fallback)assert.equal(await v.evaluate(v=>v.paused),true,'Reduced motion must not autoplay');
 await full.click();
 if(s.native){await p.waitForFunction(()=>document.querySelector('video')?.webkitDisplayingFullscreen);assert.equal(await v.evaluate(v=>v.textTracks[0].mode),'showing');}
 else {
  await p.waitForFunction(()=>document.querySelector('.mrl-cartoon-body[data-expanded]'));
  assert.equal(await p.evaluate(()=>!!document.fullscreenElement),!s.fallback);
  if(s.fallback){assert.equal(await d.locator('.mrl-film-rotate').isVisible(),true);await p.setViewportSize({width:844,height:390});await p.waitForFunction(()=>{const r=document.querySelector('.mrl-cartoon-body[data-expanded]')?.getBoundingClientRect();return r&&Math.abs(r.width-innerWidth)<2&&Math.abs(r.height-innerHeight)<2;});}
  await v.evaluate(v=>v.pause());
  const layout=await body.evaluate(el=>{const r=el.getBoundingClientRect(),stage=el.querySelector('.mrl-film-stage').getBoundingClientRect();return {width:r.width,height:r.height,vw:innerWidth,vh:innerHeight,stage:{width:stage.width,height:stage.height},overflow:el.scrollWidth>el.clientWidth+1,buttons:[...el.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width).map(b=>{const r=b.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};})};});
  console.log(s.id,JSON.stringify(layout));await p.screenshot({path:`${out}/${s.id}.png`});
  assert.ok(Math.abs(layout.width-layout.vw)<2&&Math.abs(layout.height-layout.vh)<2);
  assert.equal(layout.overflow,false);assert.ok(Math.abs(layout.stage.width/layout.stage.height-(s.ratio??16/9))<.02);
  assert.ok(layout.stage.height>=layout.vh*.8||layout.stage.width>=layout.vw*.98,'Image should fill the available frame');
  assert.ok(layout.buttons.every(b=>b.w>=63.9&&b.h>=63.9&&b.x>=-1&&b.y>=-1&&b.x+b.w<=layout.vw+1&&b.y+b.h<=layout.vh+1));
  await p.screenshot({path:`${out}/${s.id}.png`});s.layout=layout;
 }
 if(s.turn){
  await v.evaluate((v,t)=>{v.pause();v.currentTime=t-.15;},s.turn);await p.waitForFunction(()=>!document.querySelector('dialog.mrl-film[open] video').seeking);await v.evaluate(v=>v.play());
  await p.waitForFunction(()=>document.querySelector('.mrl-film-stage')?.dataset.state==='turn');
  assert.equal(await v.evaluate(v=>v.paused),true);
  if(s.native){
   assert.equal(await v.evaluate(v=>v.webkitDisplayingFullscreen),false);assert.equal(await v.evaluate(v=>v.textTracks[0].mode),'hidden');
   await full.click();await p.waitForFunction(()=>document.querySelector('.mrl-cartoon-body[data-expanded]'));
   assert.equal(await v.evaluate(v=>v.webkitDisplayingFullscreen),false,'Keep HTML prompts visible when entering fullscreen during a turn');
  }
  else assert.equal(await body.getAttribute('data-expanded'),'true');
  if(s.photo){assert.equal(await d.locator('.mrl-film-photo img').isVisible(),true);await p.waitForFunction(()=>{const img=document.querySelector('.mrl-film-photo img');return img?.complete&&img.naturalWidth>0;});}
  else assert.ok((await d.locator('.mrl-film-caption').innerText()).length>8);
  await p.screenshot({path:`${out}/${s.id}-turn.png`,animations:'disabled'});
  await main.click();await p.waitForFunction(t=>{const v=document.querySelector('dialog.mrl-film[open] video');return v&&!v.paused&&v.currentTime>=t;},s.resume);
 }
 if(!s.native){
  if(!s.fallback){
   await p.waitForFunction(()=>document.querySelector('.mrl-cartoon-body')?.dataset.controls==='hidden');
   await p.mouse.move(10,10);await p.waitForFunction(()=>document.querySelector('.mrl-cartoon-body')?.dataset.controls==='visible');
   await p.evaluate(()=>document.exitFullscreen());
  } else await p.keyboard.press('Escape');
  await p.waitForFunction(()=>!document.querySelector('.mrl-cartoon-body[data-expanded]'));
  assert.equal(await d.count(),1,'Exiting fullscreen must not close the lesson');
  const calls=await p.evaluate(()=>window.orientationCalls);if(!s.fallback&&s.id!=='desktop')assert.deepEqual(calls,['landscape','unlock']);
 }
 if(s.id==='desktop'){await full.click();await p.waitForFunction(()=>!!document.fullscreenElement);}
 await d.locator('.mrl-film-actions .ui-pill').click();await p.waitForFunction(()=>!document.querySelector('dialog.mrl-film[open]'));
 assert.equal(await p.evaluate(()=>!!document.fullscreenElement),false,'Closing a fullscreen lesson must exit fullscreen');
 assert.equal(await card.evaluate(b=>document.activeElement===b),true,'Restore focus to the lesson card');
 reports.push({...s,passed:true});await context.close();
}assert.deepEqual(errors,[]);writeFileSync(`${out}/report.json`,JSON.stringify({passed:true,base,reports,errors,nativeSafari:'API simulation only; physical iPhone/iPad not tested'},null,2));console.log('passed',reports.length,'fullscreen scenarios');}
finally{await browser.close();}
