import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import sharp from 'sharp';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe'});
// ใช้: BASE_URL=http://localhost:3200 node scripts/check-logo-browser.mjs [--quick]
// ไฟล์เทียบของรอบออกแบบโลโก้ (output/logo-1/compare, options-fix1) ไม่จำเป็น — ถ้าไม่มีจะข้ามการเทียบ แต่ยังตรวจล้นจอ/ทับปุ่ม/ลิงก์ซ้อน
const base=(process.env.BASE_URL||'http://localhost:3143').replace(/\/+$/,'');
const out=process.env.LOGO_CHECK_OUT||'output/logo-1/shots-fix1';
await mkdir(out,{recursive:true});
const measurements=[];
const oldFile='output/logo-1/compare/measurements.json';
const old=existsSync(oldFile)?JSON.parse(await readFile(oldFile,'utf8')):[];
if(!old.length)console.log('ไม่มีไฟล์เทียบเดิม — ข้ามการเทียบความสูงโลโก้');
const sizes=[[1280,800],[390,844],[844,390],[768,1024]];
try {
 for(const [width,height] of sizes) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.addInitScript(()=>sessionStorage.setItem('lu-games-guide-seen','1'));
  for(const route of process.argv.includes('--quick')?['/']:['/','/kids','/games','/parents','/learn/moral','/en']) {
   await page.goto(`${base}${route}`,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.addStyleTag({content:'nextjs-portal {display:none !important;}'});
   await page.locator('.brand-logo image').evaluate(async e=>{const i=new Image();i.src=e.getAttribute('href');await i.decode();});
   const m=await page.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const logo=document.querySelector('.brand-logo'),tag=document.querySelector('.brand-logo-tagline'),link=logo.closest('a'),controls=document.querySelector('.brand-header > div');
    const l=rect(link),c=rect(controls);
    return {logo:rect(logo),tagline:rect(tag),fontSize:27*rect(tag).width/600,fontWeight:getComputedStyle(tag.querySelector('text')).fontWeight,fontFamily:getComputedStyle(tag).fontFamily,phrases:[...tag.querySelectorAll('text:last-child tspan')].map(e=>({text:e.textContent,...rect(e),color:getComputedStyle(e).fill})),overflow:document.documentElement.scrollWidth>innerWidth,overlap:l.x<c.right&&l.right>c.x&&l.y<c.bottom&&l.bottom>c.y,focusable:link.querySelectorAll('a,button,[tabindex]').length,href:link.getAttribute('href'),header:rect(document.querySelector('.brand-header')),main:rect(document.querySelector('main'))};
   });
   const stem=`${width}x${height}${route==='/'?'':route.replaceAll('/','-')}`;
   await page.screenshot({path:`${out}/${stem}.png`});
   const previous=old.find(x=>x.variant==='B'&&x.width===width&&x.height===height&&x.route===route);
   m.oldHeight=previous?.logo.height;
   if(route==='/') {
    await page.locator('.brand-logo-tagline text').last().evaluate(e=>e.style.visibility='hidden');
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.screenshot({path:`${out}/${stem}-backing.png`});
    await page.locator('.brand-logo-tagline text').last().evaluate(e=>e.style.removeProperty('visibility'));
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.locator('.brand-header > a').first().focus();
    m.focus=await page.locator('.brand-header > a').first().evaluate(e=>({visible:e.matches(':focus-visible'),outline:getComputedStyle(e).outline,offset:getComputedStyle(e).outlineOffset}));
    await page.screenshot({path:`${out}/${stem}-focus.png`});
    await page.locator('.brand-header > a').first().evaluate(e=>e.blur());
    for(const option of [1,2].filter(o=>existsSync(`output/logo-1/options-fix1/book-${o}.webp`))) {
     const data=await readFile(`output/logo-1/options-fix1/book-${option}.webp`);
     await page.locator('.brand-logo image').evaluate(async (e,url)=>{e.setAttribute('href',url);const i=new Image();i.src=url;await i.decode();},`data:image/webp;base64,${data.toString('base64')}`);
     await page.locator('.brand-logo').screenshot({path:`output/logo-1/options-fix1/ribbon-book-${option}-${width}.png`});
    }
   }
   measurements.push({width,height,route,...m});
   console.log(width,height,route,JSON.stringify({height:m.logo.height,old:m.oldHeight,overflow:m.overflow,overlap:m.overlap}));
  }
  await page.close();
 }
} finally {await browser.close();}
if(process.argv.includes('--quick')&&existsSync(`${out}/measurements.json`)) {
 const previous=JSON.parse(await readFile(`${out}/measurements.json`,'utf8'));
 measurements.push(...previous.filter(x=>x.route!=='/'));
}
await writeFile(`${out}/measurements.json`,JSON.stringify(measurements,null,2));
for(const [width,height] of sizes.filter(([w,h])=>existsSync(`output/logo-1/compare/B-${w}x${h}.png`))) {
 const labels=Buffer.from(`<svg width="${width*2}" height="40"><rect width="100%" height="100%" fill="#17365b"/><text x="20" y="28" fill="white" font-family="Tahoma" font-size="22">B เดิม</text><text x="${width+20}" y="28" fill="white" font-family="Tahoma" font-size="22">B ใหม่</text></svg>`);
 await sharp({create:{width:width*2,height:height+40,channels:3,background:'white'}}).composite([{input:labels,left:0,top:0},{input:`output/logo-1/compare/B-${width}x${height}.png`,left:0,top:40},{input:`${out}/${width}x${height}.png`,left:width,top:40}]).png().toFile(`${out}/comparison-${width}x${height}.png`);
}
if(measurements.some(m=>m.overlap||m.overflow||m.focusable||m.oldHeight&&m.logo.height>m.oldHeight+0.5))process.exitCode=1;
