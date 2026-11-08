import assert from 'node:assert/strict';
import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile('scripts/source-images.json','utf8')),scans=[];
for(const name of ['island','base','beam','pan','pan-front','tray','block'])for(const ext of ['png','webp']){
 const path=`public/games/balance-scale/scene-${name}.${ext}`,bytes=await readFile(path);
 const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let clear=0,partial=0,opaque=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;else if(data[i]===255)opaque++;else partial++;}
 assert.ok(clear>0,`${path}: transparent outside`);assert.ok(opaque>info.width*info.height*.02,`${path}: opaque interior`);
 if(ext==='png')assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest[path]);
 scans.push({path,width:info.width,height:info.height,bytes:bytes.length,clear,partial,opaque});
}
await writeFile('output/vis-2/alpha-final.json',JSON.stringify(scans,null,2));
console.log(`PASS ${scans.length} scene PNG/WebP alpha scans and PNG source hashes`);
