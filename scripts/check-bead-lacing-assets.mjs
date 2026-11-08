import sharp from 'sharp';
import assert from 'node:assert/strict';
import {readdir,readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const files=(await readdir('public/games/bead-lacing')).filter(f=>f.endsWith('.webp')).map(f=>`public/games/bead-lacing/${f}`).concat('public/games/hub/bead-lacing.webp');
const manifest=JSON.parse(await readFile('scripts/source-images.json','utf8'));const report=[];
for(const file of files){
 const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let zero=0,partial=0,opaque=0,nearOpaque=0;for(let i=3;i<data.length;i+=4){const a=data[i];if(a===0)zero++;else if(a===255)opaque++;else partial++;if(a>=250)nearOpaque++;}
 assert.ok(zero>100&&nearOpaque>100,`${file} has transparent background and solid subject`);
 const source=file.replace('.webp','.png');const hash=createHash('sha256').update(await readFile(source)).digest('hex');assert.equal(hash,manifest[source]);
 report.push({file,width:info.width,height:info.height,bytes:(await stat(file)).size,zero,partial,opaque,nearOpaque,sha256:hash});
}
assert.equal(files.length,15);await writeFile('output/g-2/asset-audit.json',JSON.stringify(report,null,2));
console.log(`PASS ${files.length} WebP assets, transparency, SHA256, total ${report.reduce((s,r)=>s+r.bytes,0)} bytes`);
