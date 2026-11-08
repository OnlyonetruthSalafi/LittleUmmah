import sharp from 'sharp';
import assert from 'node:assert/strict';
import {readdir,readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir='public/games/bead-lacing';
const manifest=JSON.parse(await readFile('scripts/source-images.json','utf8')),report=[];
for(const f of (await readdir(dir)).filter(f=>f.endsWith('.webp'))){
 const {data,info}=await sharp(`${dir}/${f}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let transparent=0,partial=0,opaque=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)transparent++;else if(data[i]===255)opaque++;else partial++;}
 assert.ok(transparent>100&&opaque>100,`${f}: transparency and opaque subject`);
 const source=`${dir}/${f.replace('.webp','.png')}`;
 const hash=createHash('sha256').update(await readFile(source)).digest('hex');assert.equal(hash,manifest[source]);
 // Edge clean-up leaves a thin antialiased silhouette, not a translucent solid.
 assert.ok(partial/(opaque+partial)<.1,`${f}: excess semitransparency`);
 report.push({file:f,width:info.width,height:info.height,bytes:(await stat(`${dir}/${f}`)).size,transparent,partial,opaque,sha256:hash});
}
assert.equal(report.length,14);
await writeFile('output/vis-1/alpha-scan.json',JSON.stringify(report,null,2));
const colors=['efd0a0','f5dcb5','fff1c9'];
const lum=h=>h.match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);
const contrasts=colors.map(background=>({background,foreground:'1f2937',ratio:(lum(background)+.05)/(lum('1f2937')+.05)}));
for(const c of contrasts)assert.ok(c.ratio>=4.5);
await writeFile('output/vis-1/contrast.json',JSON.stringify(contrasts,null,2));
console.log('PASS: 14 assets, alpha, source hashes, 3 text background contrasts');
