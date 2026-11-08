import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const {data,info}=await sharp('public/games/hub/bead-lacing.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
function center(region,mask){let sx=0,sy=0,n=0;for(let y=Math.round(region[1]*info.height);y<region[3]*info.height;y++)for(let x=Math.round(region[0]*info.width);x<region[2]*info.width;x++){const i=(y*info.width+x)*4;if(data[i+3]>240&&mask(...data.subarray(i,i+3))){sx+=x;sy+=y;n++;}}if(!n)throw Error('empty mask');return {x:+(sx/n/info.width*100).toFixed(3),y:+(sy/n/info.height*100).toFixed(3)};}
const points=[center([.35,.5,.48,.65],(r,g,b)=>r>190&&g>180&&b>160&&r-g<35&&g-b<35),center([.7,.22,.94,.36],(r,g,b)=>g>120&&b>100&&r<g*.7)];
await writeFile('src/features/games/data/beadLacingDemo.ts',`// Pixel centroids of the white tray bead and turquoise needle, measured by scripts/measure-bead-lacing-demo.mjs.\nexport const BEAD_DEMO_POINTS = ${JSON.stringify(points)};\n`);
console.log(points);
