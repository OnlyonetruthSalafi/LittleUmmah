import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { cleanBalanceAlpha } from './lib/balance-alpha.mjs';

const root='output/g-4/fix1-source', dest='public/games/block-builders';
const bounds={};
async function cut(name, input) {
  const clean=await cleanBalanceAlpha(input,2);
  const {data,info}=await sharp(clean).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let l=info.width,t=info.height,r=0,b=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>128){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
  bounds[name]={left:l,top:t,width:r-l+1,height:b-t+1};
  await sharp(clean).extract(bounds[name]).extend({top:2,bottom:2,left:2,right:2,background:'#00000000'}).png().toFile(`${dest}/${name}.png`);
}
await cut('island',`${root}/island.png`);
await cut('tray',`${root}/tray.png`);
// Discover the six opaque connected silhouettes, rather than guessing crop boxes.
const {data,info}=await sharp(`${root}/blocks.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const seen=new Uint8Array(info.width*info.height), components=[];
for(let p=0;p<seen.length;p++){
  if(seen[p]||data[p*4+3]<240)continue;
  const stack=[p];seen[p]=1;let count=0,l=info.width,t=info.height,r=0,b=0;
  while(stack.length){const n=stack.pop(),x=n%info.width,y=Math.floor(n/info.width);count++;l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);
    for(const q of [x>0?n-1:-1,x<info.width-1?n+1:-1,n-info.width,n+info.width])if(q>=0&&q<seen.length&&!seen[q]&&data[q*4+3]>=240){seen[q]=1;stack.push(q);}
  }
  if(count>10000)components.push({left:l,top:t,width:r-l+1,height:b-t+1,count});
}
if(components.length!==6)throw Error(`Expected six sprites, found ${components.length}`);
components.sort((a,b)=>(a.top<info.height/2?0:1)-(b.top<info.height/2?0:1)||a.left-b.left);
for(const [i,name] of ['cube','beam','roof','arch','cylinder','dome'].entries()){
  const {left,top,width,height}=components[i],box={left,top,width,height};
  await cut(name,await sharp(`${root}/blocks.png`).extract(box).png().toBuffer());
}
// Selected correction: the first sheet filled the arch opening with beige.
await cut('arch',`${root}/arch.png`);
// At the center of the island find the cream courtyard. Its midpoint is the
// contact plane, behind the decorative cylinders, with room for all blueprints.
const island=await sharp(`${dest}/island.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const rows=[];
for(let y=0;y<island.info.height;y++){
  const x=Math.floor(island.info.width/2),k=(y*island.info.width+x)*4,d=island.data;
  if(d[k+3]>240&&d[k]>220&&d[k+1]>185&&d[k+2]>140&&d[k]>d[k+2]+15)rows.push(y);
}
const ground=rows[Math.floor(rows.length*.62)];
const xs=[];
for(let x=0;x<island.info.width;x++){const k=(ground*island.info.width+x)*4,d=island.data;if(d[k+3]>240&&d[k]>210&&d[k+1]>165&&d[k+2]>110)xs.push(x);}
const geometry={aspect:island.info.width/island.info.height,ground:ground/island.info.height*100,left:xs[0]/island.info.width*100,right:xs.at(-1)/island.info.width*100};
await writeFile('src/features/games/data/blockBuildersArt.ts',`// Pixel measurements from scripts/prepare-block-builders-fix1.mjs.\nexport const BUILD_ART = ${JSON.stringify(geometry)} as const;\n`);
await writeFile('output/g-4/fix1-measurements.json',JSON.stringify({bounds,components,creamRows:[rows[0],rows.at(-1)],geometry},null,2));
console.log(geometry);
