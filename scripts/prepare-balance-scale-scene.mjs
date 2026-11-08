import sharp from 'sharp';
import {cleanBalanceAlpha} from './lib/balance-alpha.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const dir='public/games/balance-scale';
const measurements={};
for(const name of ['island','beam','pan','tray','block']){
 const bytes=await cleanBalanceAlpha(`output/vis-2/options/${name}.png`,1);
 const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let left=info.width,top=info.height,right=0,bottom=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>=240){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 const box={left,top,width:right-left+1,height:bottom-top+1};measurements[name]=box;
 await sharp(bytes).extract(box).png().toFile(`${dir}/scene-${name}.png`);
}
// Locate the gold medallion's widest central horizontal scanline below the finial.
const {data,info}=await sharp(`${dir}/scene-island.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const gold=(x,y)=>{const k=(y*info.width+x)*4;return data[k+3]>240&&data[k]>170&&data[k+1]>85&&data[k+1]<220&&data[k+2]<100;};
let rows=[];for(let y=Math.floor(info.height*.12);y<info.height*.25;y++){let xs=[];for(let x=Math.floor(info.width*.4);x<info.width*.6;x++)if(gold(x,y))xs.push(x);if(xs.length)rows.push({y,left:xs[0],right:xs.at(-1),width:xs.at(-1)-xs[0]});}
const pivot=rows.sort((a,b)=>b.width-a.width)[0];
// Find the dish's cream inner surface and use its centre/front lip as seating references.
const pan=await sharp(`${dir}/scene-pan.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const cream=[];for(let y=pan.info.height*.5|0;y<pan.info.height;y++){let n=0;for(let x=0;x<pan.info.width;x++){let k=(y*pan.info.width+x)*4;if(pan.data[k+3]>=240&&pan.data[k]>210&&pan.data[k+1]>185&&pan.data[k+2]>135)n++;}if(n>pan.info.width*.35)cream.push(y);}
const seat=(cream.at(-1)-10)/pan.info.height;
// Front lip is an exact copy of the lower part of the same sprite, on a full-size transparent canvas.
const lipTop=cream.at(-1)+1;
await sharp(`${dir}/scene-pan.png`).extract({left:0,top:lipTop,width:pan.info.width,height:pan.info.height-lipTop}).extend({top:lipTop,bottom:0,left:0,right:0,background:'#00000000'}).png().toFile(`${dir}/scene-pan-front.png`);
const geometry={armSpan:54,pivotY:100*pivot.y/info.height,seat:100*seat,lipTop:100*lipTop/pan.info.height};
await writeFile('src/features/games/data/balanceScaleArt.ts',`// Pixel measurements: scripts/prepare-balance-scale-scene.mjs; output/vis-2/art-measurements.json.\nexport const SCALE_ART = ${JSON.stringify(geometry)} as const;\n`);
await mkdir('output/vis-2',{recursive:true});await writeFile('output/vis-2/art-measurements.json',JSON.stringify({measurements,pivot,cream:{top:cream[0],bottom:cream.at(-1)},geometry},null,2));
console.log(geometry);

// Split the fixed pillar/base from the island without inventing hidden artwork.
// Both layers retain the same pixel canvas and partition the source alpha exactly.
// The teal shaft lies in the central strip; blue base and gold foot are colour-segmented.
const basePixels=Buffer.from(data),islandPixels=Buffer.from(data);
for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
 const k=(y*info.width+x)*4,r=data[k],g=data[k+1],b=data[k+2];
 const shaft=y<info.height*.60&&x>info.width*.35&&x<info.width*.65;
 const blueBase=y>info.height*.55&&y<info.height*.78&&b>g*1.35&&b>r*1.5;
 const goldFoot=y>info.height*.55&&y<info.height*.68&&x>info.width*.38&&x<info.width*.62&&r>140&&g>65&&b<130;
 if(shaft||blueBase||goldFoot)islandPixels[k+3]=0;else basePixels[k+3]=0;
}
await sharp(basePixels,{raw:info}).png().toFile(`${dir}/scene-base.png`);
await sharp(islandPixels,{raw:info}).png().toFile(`${dir}/scene-island.png`);
