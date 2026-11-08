import sharp from 'sharp';
import { writeFile, readdir } from 'node:fs/promises';
const src = 'public/games/bead-lacing/island.png';
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const wood = (x,y) => { const i=(y*info.width+x)*4; const [r,g,b,a]=data.subarray(i,i+4); return a>240 && r>180 && g>110 && b<195 && r>g*1.08 && g>b*1.08; };
// Measure the continuous wood span at every scanline through the central table band.
let left=0,right=info.width-1;
const top=Math.round(info.height*.28),bottom=Math.round(info.height*.43);
for(let y=top;y<=bottom;y++) { let l=Math.floor(info.width/2),r=l; while(l>0&&wood(l-1,y))l--;while(r<info.width-1&&wood(r+1,y))r++;left=Math.max(left,l);right=Math.min(right,r); }
if(right-left<info.width*.55)throw Error('Table mask too narrow; inspect source');
const pct=n=>Number((n/info.width*100).toFixed(3));
const safe={left:pct(left),right:pct(right),top:top/info.height*100,bottom:bottom/info.height*100};
const span=safe.right-safe.left;
const art={left:safe.left,tip:Number((safe.right-7).toFixed(3)),lineY:Number(((safe.top+safe.bottom)/2).toFixed(3)),first:Number((safe.left+5).toFixed(3)),step:Number(((span-25)/5).toFixed(3)),beadWidth:9};
await writeFile('src/features/games/data/beadLacingArt.ts',`// Generated from ${src} by scripts/measure-bead-lacing-art.mjs.\nexport const LACING_ART = ${JSON.stringify(art)};\n`);
await writeFile('output/g-2/measurements.json',JSON.stringify({src,width:info.width,height:info.height,woodSafe:safe,art},null,2));
const scan=[];
for(const f of await readdir('public/games/bead-lacing'))if(f.endsWith('.png')){
 const {data,info}=await sharp(`public/games/bead-lacing/${f}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});let transparent=0,nearOpaque=0,partial=0;
 for(let i=3;i<data.length;i+=4){if(data[i]===0)transparent++;else if(data[i]>=250)nearOpaque++;else partial++;}
 scan.push({file:f,width:info.width,height:info.height,transparent,nearOpaque,partial,coreAlpha:data[(Math.floor(info.height*.5)*info.width+Math.floor(info.width*.3))*4+3]});
}
await writeFile('output/g-2/alpha-scan.json',JSON.stringify(scan,null,2));console.log({safe,art});
