import {chromium,chromePath} from './lib/playwright.mjs';
import {filmRoot} from './lib/common.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const root=filmRoot();
const browser=await chromium.launch({executablePath:chromePath,headless:true,args:['--allow-file-access-from-files']});
try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>errors.push('failed '+r.url()));
 await page.goto(pathToFileURL(root+'/stage.html').href);await page.evaluate(()=>window.ready);
 const report=await page.evaluate(()=>{
  const grips=iks.map(k=>({id:k.id,view:k.view,arm:k.arm,t0:k.t0,t1:k.t1,error:0,samples:0}));
  let samples=0,minHeadMargin=Infinity,headSamples=0;
  const headMargins={};
  for(let f=0;f<timing.total*24;f++){
   const t=f/24;poseCache.clear();
   const z=val('cam','z',t,1),cx=clamp(val('cam','x',t,960),960/z,1920-960/z),cy=clamp(val('cam','y',t,540),540/z,1080-540/z);
   camM=new DOMMatrix([z,0,0,z,960-cx*z,540-cy*z]);
   iks.forEach((k,i)=>{
    if(val(k.id,'view',t,'front')!==k.view)return;
    if(t>=k.t0&&t<=k.t1){
     const p=pose(k.id,t),g=point(p.mats[k.chain[2]],k.grip),target=k.target(t);
     const e=Math.hypot(g.x-target.x,g.y-target.y)*val('cam','z',t,1)*2/3;
     samples++;grips[i].samples++;if(e>grips[i].error)Object.assign(grips[i],{error:e,t,g,target,base:{x:p.x,y:p.y,scale:p.s}});
    }
    if(t<k.t0-k.tin||t>k.t1+k.tout)return;
    const p=pose(k.id,t);
    // Check all four camera edges and all corners of every head/dome sprite.
    for(const n of ['head','dome']){
     const part=p.rig.parts[n];if(!part)continue;
     for(const xy of [[part.x,part.y],[part.x+part.w,part.y],[part.x,part.y+part.h],[part.x+part.w,part.y+part.h]]){
      const q=point(camM.multiply(p.mats[n]),xy),margin=Math.min(q.x,1920-q.x,q.y,1080-q.y);
      minHeadMargin=Math.min(minHeadMargin,margin);headMargins[k.id]=Math.min(headMargins[k.id]??Infinity,margin);headSamples++;
     }
    }
   });
  }
  // ส่งของ/ปล่อยของ (directing.js): ของต้องไม่กระโดด ณ จุดเปลี่ยนผู้ถือ — เกณฑ์ ≤ 1.5px ที่ 720p (คิดตามซูมกล้อง)
  const handoffs=(typeof HANDOFFS==='undefined'?[]:HANDOFFS).map(h=>{poseCache.clear();const a=propWorld(h.name,h.at-1e-3);poseCache.clear();const b=propWorld(h.name,h.at+1e-3);
   return {...h,jump:Math.hypot(a.x-b.x,a.y-b.y)*val('cam','z',h.at,1)*2/3};});
  const story=window.filmChecks?.()??{passed:true};
  const genericPassed=grips.every(g=>g.samples>0&&g.error<=2)&&minHeadMargin>=0&&handoffs.every(h=>h.jump<=1.5);
  return {frames:Math.ceil(timing.total*24),samples,grips,handoffs,minHeadMargin:Number.isFinite(minHeadMargin)?minHeadMargin:null,headSamples,headMargins,story,genericPassed,passed:genericPassed&&story.passed===true};
 });
 if(errors.length)throw Error(errors.join('\n'));
 mkdirSync(root+'/qa',{recursive:true});writeFileSync(root+'/qa/motion-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
}finally{await browser.close();}
