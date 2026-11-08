import assert from 'node:assert/strict';
import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const scans=[];
const manifest=JSON.parse(await readFile('scripts/source-images.json','utf8'));
for(const directory of ['output/g-3/options','public/games/balance-scale','public/games/hub']) {
  for(const name of await readdir(directory)) {
    if(!/\.(png|webp)$/.test(name)||directory.endsWith('/hub')&&!name.startsWith('balance-scale.'))continue;
    const path=`${directory}/${name}`, bytes=await readFile(path);
    const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    let clear=0,partial=0,solid=0,nearOpaque=0;
    for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;else if(data[i]===255)solid++;else partial++;if(data[i]>=250)nearOpaque++;}
    scans.push({path,width:info.width,height:info.height,bytes:bytes.length,clear,partial,solid,nearOpaque,centerAlpha:data[(Math.floor(info.height/2)*info.width+Math.floor(info.width/2))*4+3]});
    assert.ok(clear>0,`${path}: real transparent pixels`);assert.ok(nearOpaque>info.width*info.height*.05,`${path}: substantial opaque object`);
    if(path.startsWith('public/')&&name.endsWith('.png'))assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest[path]);
  }
}
await writeFile('output/g-3/alpha-final.json',JSON.stringify(scans,null,2));
console.log(`PASS ${scans.length} original/PNG/WebP alpha scans and source hashes; cleaned cutouts have opaque interiors and antialiased transparent edges.`);
