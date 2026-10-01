import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const root='public/games/light-maze/v2';
const out='output/orbmaze-art';
const jobs=JSON.parse(await fs.readFile(`${out}/jobs.json`,'utf8'));
const sha=async file=>createHash('sha256').update(await fs.readFile(file)).digest('hex');
const round=n=>Math.round(n*100)/100;

async function scan(file,opaque=false,validate=true) {
  const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width:w,height:h}=info;
  let zero=0,solid=0,visible=0,min=255,max=0,sum=0;
  let l=w,t=h,r=-1,b=-1;
  const rows=Array.from({length:h},()=>[]), hist=new Uint32Array(256);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
    const a=data[(y*w+x)*4+3]; hist[a]++;zero+=a===0;solid+=a>=250;min=Math.min(min,a);max=Math.max(max,a);sum+=a;
    if(a>128){visible++;l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);rows[y].push(x);}
  }
  if(validate&&(opaque ? min<250 : !zero||!solid)) throw Error(`${file}: invalid alpha (${min}..${max})`);
  const bw=r-l+1,bh=b-t+1;
  let anchor=null;
  if(!opaque) {
    // Bottommost alpha>128 scanline with a useful base width, ignoring isolated glow pixels.
    const minRowWidth=Math.max(3,Math.ceil(bw*.08));
    for(let y=b;y>=t;y--) if(rows[y].length>=minRowWidth) {
      anchor={x:round((rows[y][0]+rows[y].at(-1))/2),y,threshold:128,minRowWidth};break;
    }
  }
  let bodyMedian=0,cumulative=0;
  for(let a=129;a<=255;a++){cumulative+=hist[a];if(cumulative>=visible/2){bodyMedian=a;break;}}
  if(validate&&bodyMedian<250) throw Error(`${file}: translucent body median alpha ${bodyMedian}`);
  return {width:w,height:h,bbox:{x:l,y:t,width:bw,height:bh,threshold:128},anchor,
    alpha:{min,max,zero,solid250:solid,visible128:visible,solidFractionOfVisible:round(solid/Math.max(visible,1)),bodyMedian,mean:round(sum/(w*h))},
    bytes:(await fs.stat(file)).size,sha256:await sha(file)};
}

function fit(points) {
  const n=points.length,sx=points.reduce((s,p)=>s+p[0],0),sy=points.reduce((s,p)=>s+p[1],0);
  const sxx=points.reduce((s,p)=>s+p[0]*p[0],0),sxy=points.reduce((s,p)=>s+p[0]*p[1],0);
  const m=(n*sxy-sx*sy)/(n*sxx-sx*sx),b=(sy-m*sx)/n;
  return {m,b};
}
async function diamond(file) {
  const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const w=info.width,h=info.height;
  // Search bands identify the top rim, not decorative gold on the cliff. Coordinates are
  // only search hints; regression and line intersections determine final corners from pixels.
  const hints={top:[.499*w,.069*h],left:[.066*w,.374*h],right:[.933*w,.374*h],bottom:[.498*w,.695*h]};
  const lines={};
  for(const [name,a,b] of [['tl','top','left'],['tr','top','right'],['bl','bottom','left'],['br','bottom','right']]) {
    const p=hints[a],q=hints[b],m=(q[1]-p[1])/(q[0]-p[0]),bb=p[1]-m*p[0];
    const points=[];
    const low=Math.min(p[0],q[0]),span=Math.abs(q[0]-p[0]);
    for(let x=Math.ceil(low+span*.15);x<low+span*.85;x++) {
      const guess=m*x+bb;
      let best=null;
      for(let y=Math.max(0,Math.floor(guess-22));y<=Math.min(h-1,Math.ceil(guess+22));y++) {
        const i=(y*w+x)*4,R=data[i],G=data[i+1],B=data[i+2],A=data[i+3];
        if(A>240&&R>185&&G>105&&G>B*1.28&&R>G*1.035) {
          const score=R+G-B*.5-Math.abs(y-guess)*2;
          if(!best||score>best.score)best={y,score};
        }
      }
      if(best)points.push([x,best.y]);
    }
    if(points.length<100)throw Error(`${file}: not enough gold rim samples ${name}`);
    let line=fit(points);
    const clean=points.filter(([x,y])=>Math.abs(y-line.m*x-line.b)<4);
    line=fit(clean);
    const rms=Math.sqrt(clean.reduce((s,[x,y])=>s+(y-line.m*x-line.b)**2,0)/clean.length);
    lines[name]={...line,samples:clean.length,rms:round(rms),angle:round(Math.atan(Math.abs(line.m))*180/Math.PI)};
  }
  const cross=(a,b)=>{const x=(b.b-a.b)/(a.m-b.m);return {x:round(x),y:round(a.m*x+a.b)}};
  const corners={top:cross(lines.tl,lines.tr),right:cross(lines.tr,lines.br),bottom:cross(lines.bl,lines.br),left:cross(lines.tl,lines.bl)};
  const pass=Object.values(lines).every(l=>Math.abs(l.angle-26.565051)<1.5);
  return {corners,edges:lines,targetAngle:26.565051,tolerance:1.5,pass,method:'Gold-pixel regression in four top-rim search bands; intersections extrapolate through corner caps.'};
}

const manifest={version:2,units:'pixels in delivered WebP',alphaPolicy:'Sprites: alpha=0 background, median body alpha>=250. Opaque textures/backdrops: all alpha>=250.',assets:{}};
const all=[{id:'orb-se',output:`${root}/actors/orb-se.png`,opaque:false},...jobs];
for(const job of all) {
  const file=job.output.replace(/\.png$/,'.webp');
  const runtime=await scan(file,job.opaque),source=await scan(job.output,job.opaque);
  const asset={file:'/'+file.replace(/^public\//,''),...runtime,source:{file:job.output,...source}};
  if(job.id.startsWith('island-')) asset.surface=await diamond(file);
  manifest.assets[job.id]=asset;
}
await fs.writeFile(`${root}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile(`${out}/alpha-report.json`,JSON.stringify(Object.fromEntries(Object.entries(manifest.assets).map(([id,a])=>[id,{source:a.source.alpha,runtime:a.alpha}])),null,2)+'\n');
const rawReport={};
for(const job of jobs) rawReport[job.id]={status:'selected',file:job.source,...await scan(job.source,job.opaque)};
for(const job of JSON.parse(await fs.readFile(`${out}/rejected-rounds.json`,'utf8'))) {
  const file=`${out}/originals/${job.id}.png`;
  rawReport[job.id]={status:'rejected',reason:job.reason,file,...await scan(file,false,false)};
}
await fs.writeFile(`${out}/raw-alpha-report.json`,JSON.stringify(rawReport,null,2)+'\n');

// Update only new source-images keys, as required by the art brief. The hub key already
// belongs to a previous version: preserve it and record this version under its archive path.
const hashFile='scripts/source-images.json';
const hashes=JSON.parse(await fs.readFile(hashFile,'utf8'));
const hashNotes=[];
for(const job of all) {
  const hash=await sha(job.output);
  if(!(job.output in hashes)||job.output.startsWith(root+'/'))hashes[job.output]=hash;
  else if(hashes[job.output]!==hash) {
    const archive=`${out}/originals/${job.id}-production.png`;
    await fs.copyFile(job.output,archive);
    if(!(archive in hashes)) hashes[archive]=hash;
    hashNotes.push({file:job.output,existingHashPreserved:hashes[job.output],currentHash:hash,versionKey:archive});
  }
}
await fs.writeFile(hashFile,JSON.stringify(hashes,null,2)+'\n');
await fs.writeFile(`${out}/source-hash-notes.json`,JSON.stringify(hashNotes,null,2)+'\n');

function label(text,w=300,h=30) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><text x="8" y="22" fill="#fff" font-size="17" font-family="Arial">${text}</text></svg>`);
}
async function sheet(ids,file,cols=4,cell=280) {
  const rows=Math.ceil(ids.length/cols),layers=[];
  for(let i=0;i<ids.length;i++) {
    const a=manifest.assets[ids[i]],x=i%cols*cell,y=Math.floor(i/cols)*(cell+32);
    const img=await sharp('public'+a.file).resize(cell-16,cell-16,{fit:'inside'}).png().toBuffer();
    const meta=await sharp(img).metadata();
    layers.push({input:img,left:x+Math.round((cell-meta.width)/2),top:y+Math.round((cell-meta.height)/2)});
    layers.push({input:label(ids[i],cell),left:x,top:y+cell});
  }
  await sharp({create:{width:cols*cell,height:rows*(cell+32),channels:4,background:'#24354c'}}).composite(layers).png().toFile(file);
}
await sheet(all.filter(j=>j.output.includes('/actors/')).map(j=>j.id),`${out}/actors-contact.png`,5,256);
await sheet(all.filter(j=>/\/(items|props)\//.test(j.output)).map(j=>j.id),`${out}/objects-contact.png`,4,280);
await sheet(all.filter(j=>/island-|backdrop-/.test(j.id)).map(j=>j.id),`${out}/scenes-contact.png`,2,600);
await sheet(['hub-light-maze'],`${out}/hub-preview.png`,1,900);

const tileLayers=[],tileStats={};
for(const [index,theme] of ['neon','grove','sky'].entries()) {
  const y=index*780;
  tileLayers.push({input:label(theme,1100),left:0,top:y});
  const floor=await sharp(`${root}/textures/${theme}-floor.webp`).resize(180).png().toBuffer();
  for(let r=0;r<3;r++) for(let c=0;c<3;c++)tileLayers.push({input:floor,left:c*180,top:y+40+r*180});
  const side=await sharp(`${root}/textures/${theme}-wallside.webp`).png().toBuffer();
  for(let c=0;c<4;c++)tileLayers.push({input:side,left:c*256,top:y+600});
  const top=await sharp(`${root}/textures/${theme}-walltop.webp`).resize(220).png().toBuffer();
  tileLayers.push({input:top,left:650,top:y+70});
  const {data,info}=await sharp(side).removeAlpha().raw().toBuffer({resolveWithObject:true});
  let delta=0;for(let r=0;r<info.height;r++)for(let c=0;c<3;c++)delta+=Math.abs(data[(r*info.width)*3+c]-data[(r*info.width+info.width-1)*3+c]);
  tileStats[theme]={webpSeamMeanChannelDelta:round(delta/(info.height*3)),sourceFeatherPixels:16};
}
await sharp({create:{width:1100,height:2340,channels:4,background:'#24354c'}}).composite(tileLayers).png().toFile(`${out}/tile-check.png`);
await fs.writeFile(`${out}/tile-report.json`,JSON.stringify(tileStats,null,2)+'\n');

for(const theme of ['neon','grove','sky']) {
  const island=manifest.assets[`island-${theme}`];
  const scale=.9,iw=Math.round(island.width*scale),ih=Math.round(island.height*scale),ox=Math.round((1600-iw)/2),oy=30;
  const layers=[{input:await sharp('public'+island.file).resize(iw,ih).png().toBuffer(),left:ox,top:oy}];
  const {top:T,right:R,left:L}=island.surface.corners;
  const point=(u,v)=>({x:ox+scale*(T.x+u*(R.x-T.x)+v*(L.x-T.x)),y:oy+scale*(T.y+u*(R.y-T.y)+v*(L.y-T.y))});
  const placements=[['arch',.12,.14,140],['palm',.06,.75,155],['post',.9,.08,100],['shrub',.8,.94,110],['lantern',.91,.78,85],['crystal',.46,.44,105],['charger',.14,.48,95],['portal',.63,.22,110],['star',.42,.76,72],['clock',.69,.67,65],['shield',.29,.59,65],['red-se',.3,.23,125],['violet-se',.67,.4,120],['blue-se',.78,.59,125],['green-se',.53,.6,125],['orb-se',.63,.85,135]];
  placements.sort((a,b)=>point(a[1],a[2]).y-point(b[1],b[2]).y);
  for(const [id,u,v,width] of placements) {
    const a=manifest.assets[id],p=point(u,v),s=width/a.width;
    const img=await sharp('public'+a.file).resize(width).png().toBuffer();
    layers.push({input:img,left:Math.round(p.x-a.anchor.x*s),top:Math.round(p.y-a.anchor.y*s)});
  }
  await sharp(`${root}/backdrop-${theme}.webp`).composite(layers).png().toFile(`${out}/preview-${theme}.png`);
  // QA overlay visibly connects measured corners without modifying production artwork.
  const pts=Object.values(island.surface.corners).map(p=>`${p.x},${p.y}`).join(' ');
  const overlay=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${island.width}" height="${island.height}"><polygon points="${pts}" fill="none" stroke="#ff42cd" stroke-width="3"/>${Object.entries(island.surface.corners).map(([name,p])=>`<circle cx="${p.x}" cy="${p.y}" r="7" fill="#ff42cd"/><text x="${p.x+10}" y="${p.y}" fill="#fff" font-size="18">${name}</text>`).join('')}</svg>`);
  await sharp('public'+island.file).flatten({background:'#18253a'}).composite([{input:overlay}]).png().toFile(`${out}/measure-${theme}.png`);
}
console.log(JSON.stringify({assets:all.length,islands:Object.fromEntries(['neon','grove','sky'].map(t=>[t,manifest.assets[`island-${t}`].surface])),tileStats,hashNotes},null,2));
if(['neon','grove','sky'].some(t=>!manifest.assets[`island-${t}`].surface.pass))process.exitCode=1;
