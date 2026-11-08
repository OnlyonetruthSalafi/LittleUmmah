import sharp from 'sharp';
import { writeFile, copyFile } from 'node:fs/promises';
const out='output/logo-1/options-fix1';
const scans=[];
for (const n of [1,2]) {
  const {data,info}=await sharp(`${out}/book-${n}-original.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let removed=0;
  for(let i=0;i<data.length;i+=4) {
    const a=data[i+3];
    if(a<180) {if(a) removed++;data.fill(0,i,i+4);}
    else data[i+3]=a>=250 ? 255 : Math.round((a-180)*255/70);
  }
  await sharp(data,{raw:info}).trim({threshold:1}).extend({top:8,bottom:8,left:8,right:8,background:'#00000000'}).png().toFile(`${out}/book-${n}.png`);
  await sharp(`${out}/book-${n}.png`).resize({width:800}).webp({quality:90,effort:6}).toFile(`${out}/book-${n}.webp`);
  const raw=await sharp(`${out}/book-${n}.webp`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let transparent=0,partial=0,opaque=0,borderNonzero=0,whiteFringe=0;
  for(let y=0;y<raw.info.height;y++) for(let x=0;x<raw.info.width;x++) {
    const i=(y*raw.info.width+x)*4,a=raw.data[i+3];
    if(!a)transparent++;else if(a===255)opaque++;else {partial++;if(a<128&&raw.data[i]>245&&raw.data[i+1]>245&&raw.data[i+2]>245)whiteFringe++;}
    if((x===0||y===0||x===raw.info.width-1||y===raw.info.height-1)&&a)borderNonzero++;
  }
  scans.push({option:n,width:raw.info.width,height:raw.info.height,removedLowAlpha:removed,transparent,partial,opaque,borderNonzero,whiteFringe});
}
await copyFile(`${out}/book-2.png`,'public/brand/logo-book.png');
await writeFile(`${out}/alpha-scan.json`,JSON.stringify(scans,null,2));
console.log(scans);
