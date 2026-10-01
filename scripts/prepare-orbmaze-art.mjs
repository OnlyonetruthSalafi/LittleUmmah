import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = 'public/games/light-maze/v2';
const jobs = JSON.parse(await fs.readFile('output/orbmaze-art/jobs.json', 'utf8'));
const selected = new Set(process.argv.slice(2));
await fs.mkdir('output/orbmaze-art/originals', {recursive:true});
for (const job of jobs) {
  if (selected.size && !selected.has(job.id)) continue;
  const original = `output/orbmaze-art/originals/${job.id}.png`;
  if (path.resolve(job.source) !== path.resolve(original)) await fs.copyFile(job.source, original);
  const out = job.output ?? `${root}/actors/${job.id}.png`;
  await fs.mkdir(path.dirname(out), {recursive:true});
  const [width,height] = job.size ?? [512,512];
  if (job.opaque) {
    const {data: pixels, info: sourceInfo} = await sharp(original).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for (let i=3; i<pixels.length; i+=sourceInfo.channels) {
      if (pixels[i]<250) throw new Error(`${job.id}: opaque source has translucent pixels`);
    }
    let input = sharp(original);
    if (job.extract) input = input.extract(job.extract);
    if (job.seamWidth) {
      const {data,info} = await input.resize(width,height,{fit:'fill'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
      // Feather the same endpoint color into both sides of each row. Mortar stays horizontal.
      const band=job.seamWidth;
      for(let y=0;y<height;y++) for(let c=0;c<3;c++) {
        const edge=(data[(y*width)*3+c]+data[(y*width+width-1)*3+c])/2;
        for(let k=0;k<band;k++) for(const x of [k,width-1-k]) {
          const i=(y*width+x)*3+c, t=k/(band-1);
          data[i]=Math.round(edge*(1-t)+data[i]*t);
        }
      }
      await sharp(data,{raw:info}).png().toFile(out);
    } else await input.resize(width,height,{fit:'fill'}).removeAlpha().png().toFile(out);
  } else {
    const {data,info} = await sharp(original).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    let left=info.width,top=info.height,right=0,bottom=0,zero=0,solid=0,visible=0;
    for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
      const a=data[(y*info.width+x)*4+3]; zero+=a===0;solid+=a>=250;visible+=a>128;
      if(a>8){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
    }
    if(!zero||!solid||solid<visible/2) throw new Error(`${job.id}: invalid transparency or translucent body`);
    if (job.canvas) {
      const [zx,zy]=job.canvasZoom??[1,1];
      const rw=Math.round(width*zx),rh=Math.round(height*zy);
      await sharp(original).resize(rw,rh,{fit:'fill'}).extract({left:Math.floor((rw-width)/2),top:Math.floor((rh-height)/2),width,height}).png().toFile(out);
    } else {
      const bw=right-left+1,bh=bottom-top+1;
      const scale=Math.min(width*(job.fill??0.66)/bw,height*0.76/bh);
      const w=Math.round(bw*scale),h=Math.round(bh*scale);
      const sprite=await sharp(original).extract({left,top,width:bw,height:bh}).resize(w,h).png().toBuffer();
      await sharp({create:{width,height,channels:4,background:'#00000000'}}).composite([{input:sprite,left:Math.round((width-w)/2),top:Math.round(height*0.84)-h}]).png().toFile(out);
    }
  }
  await sharp(out).resize(job.runtimeWidth??256).webp({quality:job.quality??(job.opaque?80:90),alphaQuality:100}).toFile(out.replace(/\.png$/,'.webp'));
  console.log(out);
}
const rounds=JSON.parse(await fs.readFile('output/orbmaze-art/rejected-rounds.json','utf8').catch(e=>{if(e.code==='ENOENT')return '[]';throw e;}));
await fs.writeFile('output/orbmaze-art/PROMPTS.md', '# Production prompts\n\nBuilt-in image generation; one call per asset. No CLI/API fallback. Originals preserved. orb-se was supplied and was not regenerated.\n\n'+jobs.map(j=>`## ${j.id}\n\n${j.prompt}\n\nSource: ${j.source}\n`).join('\n')+'\n# Rejected rounds\n\n'+rounds.map(j=>`## ${j.id}\n\n${j.prompt}\n\nReason: ${j.reason}\n\nSource: output/orbmaze-art/originals/${j.id}.png\n`).join('\n'));
