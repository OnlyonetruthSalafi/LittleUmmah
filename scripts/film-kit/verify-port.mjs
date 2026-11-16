// Regression evidence lives in the port folder; original qa is never written.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const original=path.resolve(process.argv[2]),port=path.resolve(process.argv[3]);
if(!process.argv[2]||!process.argv[3])throw Error('Usage: verify-port.mjs <original> <port>');
const times=[0,5,16,28,40,51,65,81,94,96.6,100,108,125.5,133,144,155,166,190,203];
const read=p=>JSON.parse(readFileSync(p,'utf8'));
assert.deepEqual(read(port+'/timing.json'),read(original+'/timing.json'));
for(const [root,dest] of [[original,port+'/qa/original'],[port,port+'/qa/port']]){
 execFileSync(process.execPath,['scripts/film-kit/render.mjs',root,'--stills',times.join(','),'--w','1920','--format','png','--dest',dest],{stdio:'inherit'});
}
const images=[];
for(const t of times){
 const file=`still-${t.toFixed(2).padStart(6,'0')}.png`;
 const a=await sharp(port+'/qa/original/'+file).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const b=await sharp(port+'/qa/port/'+file).removeAlpha().raw().toBuffer();
 assert.equal(a.data.length,b.length);let different=0,maxChannelDifference=0;
 for(let p=0;p<b.length;p+=3){let d=0;for(let c=0;c<3;c++)d=Math.max(d,Math.abs(a.data[p+c]-b[p+c]));if(d)different++;maxChannelDifference=Math.max(maxChannelDifference,d);}
 const pixels=a.info.width*a.info.height,percent=different/pixels*100;
 images.push({t,width:a.info.width,height:a.info.height,different,pixels,percent,maxChannelDifference,passed:percent<=.1&&maxChannelDifference<=8});
}
const before=read(original+'/qa/motion-report.json'),after=read(port+'/qa/motion-report.json');
const motion={framesDelta:after.frames-before.frames,samplesDelta:after.samples-before.samples,maxGripErrorDelta:Math.max(...after.grips.map((g,i)=>Math.abs(g.error-before.grips[i].error))),story:after.story};
const report={timingEqual:true,images,motion,passed:images.every(i=>i.passed)&&after.passed};
mkdirSync(port+'/qa',{recursive:true});writeFileSync(port+'/qa/port-regression.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));assert.equal(report.passed,true);
