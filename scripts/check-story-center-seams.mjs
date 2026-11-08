// Heuristic triage, not proof of visual continuity: always inspect the center-strip contact sheets.
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
const out = 'output/stories-c9/fix1';
await mkdir(out, { recursive: true });
const paths = [];
for (const slug of ['garden-owners', 'two-gardens']) {
  for (const file of (await readdir(`public/stories/${slug}`)).filter(f => /\.(png|webp)$/.test(f)).sort()) {
    paths.push(`public/stories/${slug}/${file}`);
  }
}
// ภาพก่อนแก้ (ถ้ามีในเครื่อง) ใช้เทียบเท่านั้น — output/ ไม่อยู่ใน git จึงข้ามเมื่อไม่มีไฟล์
const { existsSync } = await import('node:fs');
for (const p of [`${out}/before/p04.png`, `${out}/before/p05.png`]) if (existsSync(p)) paths.push(p);
const results = [], tiles = [];
for (const path of paths) {
  const { data, info } = await sharp(path).removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const x = Math.floor(w / 2), gap = Math.round(w * .025);
  const lum = (xx, y) => { const i = (y*w+xx)*c; return .2126*data[i]+.7152*data[i+1]+.0722*data[i+2]; };
  const avg = (xx,y,r=2) => { let sum=0; for(let k=-r;k<=r;k++)sum+=lum(xx+k,y); return sum/(2*r+1); };
  let rgbJump=0;
  const residual=[];
  for(let y=0;y<h;y++) {
    residual.push(avg(x,y)-(avg(x-gap,y)+avg(x+gap,y))/2);
    for(let k=0;k<3;k++)rgbJump+=Math.abs(data[(y*w+x)*c+k]-data[(y*w+x-1)*c+k]);
  }
  const quarters=Array.from({length:4},(_,q)=>{
    const rows=residual.slice(Math.floor(q*h/4),Math.floor((q+1)*h/4));
    return { mean: rows.reduce((a,b)=>a+b,0)/rows.length, darkFraction: rows.filter(v=>v < -10).length/rows.length, lightFraction: rows.filter(v=>v > 10).length/rows.length };
  });
  const darkFraction=residual.filter(v=>v < -10).length/h;
  const lightFraction=residual.filter(v=>v > 10).length/h;
  const flagged=(darkFraction>.65 && quarters.every(q=>q.darkFraction>.45)) || (lightFraction>.65 && quarters.every(q=>q.lightFraction>.45));
  results.push({path,adjacentRgbMAE:rgbJump/(h*3),centerVsFlanksMean:residual.reduce((a,b)=>a+b,0)/h,darkFraction,lightFraction,quarters,flagged});
  if(path.endsWith('.png')) {
    const idx=tiles.length/2, tw=192, th=512;
    const strip=await sharp(path).extract({left:x-96,top:0,width:192,height:h}).resize(tw,th,{fit:'fill'}).png().toBuffer();
    const label=path.includes('/before/')?'BEFORE '+path.split('/').pop():path.split('/').slice(-2).join('/');
    tiles.push({input:strip,left:(idx%6)*tw,top:Math.floor(idx/6)*(th+24)});
    tiles.push({input:Buffer.from(`<svg width="192" height="24"><rect width="192" height="24" fill="white"/><text x="3" y="17" font-size="12">${label}</text></svg>`),left:(idx%6)*tw,top:Math.floor(idx/6)*(th+24)+th});
  }
}
await writeFile(`${out}/center-seams.json`,JSON.stringify({method:'Adjacent RGB MAE; center luminance minus symmetric flanks at 2.5% width, 5px averaging; coherent >10/255 residual across all quarters. Natural scene edges may trigger false positives; visual review required.',results},null,2)+'\n');
await sharp({create:{width:1152,height:Math.ceil(tiles.length/2/6)*536,channels:3,background:'white'}}).composite(tiles).png().toFile(`${out}/center-strips.png`);
console.table(results.filter(r=>r.path.endsWith('.png')).map(r=>({path:r.path,delta:r.adjacentRgbMAE.toFixed(2),band:r.centerVsFlanksMean.toFixed(2),dark:r.darkFraction.toFixed(2),flag:r.flagged})));
