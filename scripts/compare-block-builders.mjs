import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const out='output/g-4/compare';await mkdir(out,{recursive:true});
for(const [width,height] of [[360,780],[390,844],[844,390],[768,1024],[1280,720]]){
  const tag=`${width}x${height}`,size=Math.min(width-24,height-48);
  const hub=await sharp('public/games/hub/block-builders.webp').resize(size,size,{fit:'inside'}).toBuffer();
  const meta=await sharp(hub).metadata();
  const labels=Buffer.from(`<svg width="${width*3}" height="40"><rect width="100%" height="100%" fill="#123a72"/><g fill="white" font-family="Arial" font-size="16" text-anchor="middle"><text x="${width/2}" y="26">HUB REFERENCE</text><text x="${width*1.5}" y="26">PLAY / START — ${tag}</text><text x="${width*2.5}" y="26">PLAY / BUILT — ${tag}</text></g></svg>`);
  await sharp({create:{width:width*3,height:height+40,channels:4,background:'#e4f6fb'}}).composite([
    {input:hub,left:Math.floor((width-meta.width)/2),top:40+Math.floor((height-meta.height)/2)},
    {input:`output/g-4/shots/${tag}-reference-start.png`,left:width,top:40},
    {input:`output/g-4/shots/${tag}-level-2-round-1-built.png`,left:width*2,top:40},
    {input:labels,left:0,top:0},
  ]).png().toFile(`${out}/${tag}.png`);
}
console.log('Saved five reference / start / built comparisons.');
