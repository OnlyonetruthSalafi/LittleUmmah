import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
await mkdir('output/vis-1/compare',{recursive:true});
for(const [w,h] of [[360,780],[390,844],[844,390],[768,1024],[1280,720]]){
 const size=Math.round(Math.min(w*.94,h*.9));
 const source=await sharp('public/games/hub/bead-lacing.webp').resize(size,size).png().toBuffer();
 const left=await sharp({create:{width:w,height:h,channels:4,background:'#d9f3fc'}}).composite([{input:source,left:Math.round((w-size)/2),top:Math.round((h-size)/2)}]).png().toBuffer();
 const heading=Buffer.from(`<svg width="${w*2}" height="40"><rect width="100%" height="100%" fill="#123a72"/><g fill="white" font-family="sans-serif" font-size="15" text-anchor="middle"><text x="${w/2}" y="26">Hub island reference</text><text x="${w*1.5}" y="26">Playable scene · ${w} × ${h}</text></g></svg>`);
 for(const [name,shot] of [['empty','level-1-round-1'],['threaded','level-3-round-1'],['in-progress','two-beads']]){
  await sharp({create:{width:w*2,height:h+40,channels:4,background:'#d9f3fc'}}).composite([{input:heading,left:0,top:0},{input:left,left:0,top:40},{input:`output/vis-1/shots/${w}x${h}-${shot}.png`,left:w,top:40}]).png().toFile(`output/vis-1/compare/${w}x${h}-${name}.png`);
 }
}
console.log('Saved 15 comparisons: 5 viewports, empty, in-progress and threaded scenes.');
