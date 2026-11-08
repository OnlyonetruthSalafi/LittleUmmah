import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { inspectHomepage } from './homepage-browser.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const base=process.argv[2]||'http://localhost:3150';
const out=process.env.HOME_OUTPUT || 'output/home-2';
await mkdir(`${out}/shots`,{recursive:true});
const failures=[];
const check=(ok,label)=>{console.log(`${ok?'ok':'FAIL'} ${label}`);if(!ok)failures.push(label);};
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe'});
const rows=[];
for(const [width,height] of [[360,780],[390,844],[430,932],[844,390],[768,1024],[1280,800],[1536,864]]) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const m=await inspectHomepage(page,(ok,label)=>check(ok,`${width}x${height} ${label}`));
  m.contrasts=await page.evaluate(()=>{
    const lum=color=>{
      const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(c=>{const v=c/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
      return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
    };
    return [...document.querySelectorAll('.home-zone-heading,.home-zone-heading > span,.home-islands .island-name,.home-islands .island-name-sub')].map(e=>{
      const fg=getComputedStyle(e).color;
      const bg=getComputedStyle(e).webkitTextStrokeColor;
      const a=lum(fg),b=lum(bg);
      return {text:e.textContent,foreground:fg,background:bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
    });
  });
  check(m.contrasts.every(c=>c.ratio>=4.5),`${width} all new labels contrast ≥4.5:1`);
  check(await page.locator('[data-home-zone] img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),`${width} images load`);
  check(errors.length===0,`${width} no runtime errors: ${errors.join()}`);
  rows.push({height,...m});
  await page.screenshot({path:`${out}/shots/after-${width}x${height}.png`,fullPage:true});
  await page.locator('[data-home-zone="play"]').screenshot({path:`${out}/shots/play-${width}x${height}.png`});
  await page.close();
}
// Keyboard, hover, reduced motion and locale coverage.
const page=await browser.newPage({viewport:{width:1280,height:800}});
await page.goto(base,{waitUntil:'networkidle'});
for (const zone of ['learn','play']) {
await page.emulateMedia({reducedMotion:'no-preference'});
const link=page.locator(`[data-home-zone="${zone}"] a`).first();
await link.focus();
check(await link.evaluate(e=>e.matches(':focus-visible')&&parseFloat(getComputedStyle(e).outlineWidth)>=3),'keyboard: visible outline');
await page.screenshot({path:`${out}/shots/focus-1280.png`});
await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement.blur());
const label=link.locator('.island-caption');
const before=await label.boundingBox();
await link.hover();await page.waitForTimeout(250);
const after=await label.boundingBox();
check(Math.abs(before.y-after.y)<.1,'hover: label stationary');
check(await link.locator('.island-glow').evaluate(e=>{const s=getComputedStyle(e);return s.translate!=='none'||s.scale!=='none'||s.transform!=='none';}),'hover: image moves');
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(50);
check(await link.locator('.island-glow').evaluate(e=>{const s=getComputedStyle(e);return s.transform==='none'&&s.translate==='none'&&s.scale==='none';}),'reduced motion: image stays still');
check(await link.locator('.island-glow').evaluate(e=>getComputedStyle(e).filter.includes('28px')),'reduced motion: hover shadow remains');
}
await page.goto(`${base}/en`,{waitUntil:'networkidle'});
check(!/[\u0e00-\u0e7f]/.test(await page.locator('main').innerText()),'English page: no Thai');
check(await page.locator('[data-home-zone] a').evaluateAll(links=>links.every(a=>a.getAttribute('href').startsWith('/en/'))),'English page: localized links');
await browser.close();
await writeFile(`${out}/measurements.json`,JSON.stringify({rows,failures},null,2));
process.exitCode=failures.length?1:0;
