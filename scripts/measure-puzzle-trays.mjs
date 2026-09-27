import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const out = 'output/puzzle-art';
const measurements = JSON.parse(await readFile(`${out}/measurements.json`, 'utf8'));
for (const [name, key] of [['tray-1row', 'tray1row'], ['tray-2row', 'tray2row']]) {
  const file = `public/games/puzzle/${name}.png`;
  const {data, info:{width:w,height:h}} = await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const mask = new Uint8Array(w*h), seen = new Uint8Array(w*h), queue = new Int32Array(w*h);
  let minX=w,minY=h,maxX=0,maxY=0,transparent=0,best=[];
  for(let p=0;p<w*h;p++) {
    const [r,g,b,a]=data.subarray(p*4,p*4+4),x=p%w,y=Math.floor(p/w);
    if(a>=240){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
    if(a===0)transparent++;
    mask[p]=+(a>=240 && r>=170 && g>=160 && b>=145 && Math.max(r,g,b)-Math.min(r,g,b)<52);
  }
  for(let p=0;p<mask.length;p++) {
    if(!mask[p]||seen[p])continue;
    let head=0,tail=1;queue[0]=p;seen[p]=1;
    while(head<tail){const q=queue[head++],x=q%w;for(const n of [x?q-1:-1,x<w-1?q+1:-1,q-w,q+w])if(n>=0&&n<mask.length&&mask[n]&&!seen[n]){seen[n]=1;queue[tail++]=n;}}
    if(tail>best.length)best=Array.from(queue.subarray(0,tail));
  }
  mask.fill(0);for(const p of best)mask[p]=1;
  const rows=[],cols=[];
  for(let y=0;y<h;y++){let l=w,r=-1;for(let x=0;x<w;x++)if(mask[y*w+x]){l=Math.min(l,x);r=x;}if(r>=0)rows.push([y,l,r]);}
  for(let x=0;x<w;x++){let t=h,b=-1;for(let y=0;y<h;y++)if(mask[y*w+x]){t=Math.min(t,y);b=y;}if(b>=0)cols.push([x,t,b]);}
  const fit=ps=>{let sx=0,sy=0,sxx=0,sxy=0;for(const [x,y] of ps){sx+=x;sy+=y;sxx+=x*x;sxy+=x*y;}const a=(ps.length*sxy-sx*sy)/(ps.length*sxx-sx*sx);return {a,b:(sy-a*sx)/ps.length};};
  const mid=list=>list.slice(Math.floor(list.length*.15),Math.floor(list.length*.85));
  const top=fit(mid(cols).map(([x,t])=>[x,t])),bottom=fit(mid(cols).map(([x,,b])=>[x,b]));
  const left=fit(mid(rows).map(([y,l])=>[y,l])),right=fit(mid(rows).map(([y,,r])=>[y,r]));
  const cross=(v,z)=>{const x=(v.a*z.b+v.b)/(1-v.a*z.a);return [x,z.a*x+z.b];};
  const quad=[cross(left,top),cross(right,top),cross(right,bottom),cross(left,bottom)];
  // Exact maximum-area axis-aligned rectangle of the measured floor pixel mask.
  const heights=new Int32Array(w);let rect={x:0,y:0,width:0,height:0},area=0;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++)heights[x]=mask[y*w+x]?heights[x]+1:0;
    const stack=[];
    for(let x=0;x<=w;x++){const current=x===w?0:heights[x];while(stack.length&&heights[stack.at(-1)]>current){const i=stack.pop(),rh=heights[i],rx=stack.length?stack.at(-1)+1:0,rw=x-rx;if(rw*rh>area){area=rw*rh;rect={x:rx,y:y-rh+1,width:rw,height:rh};}}stack.push(x);}
  }
  const pctRect=r=>({x:r.x/w*100,y:r.y/h*100,width:r.width/w*100,height:r.height/h*100});
  const front=quad[2][0]-quad[3][0],back=quad[1][0]-quad[0][0],depth=((quad[2][1]-quad[1][1])+(quad[3][1]-quad[0][1]))/2;
  measurements[key]={width:w,height:h,bbox:pctRect({x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1}),alphaThreshold:240,fullyTransparentPixels:transparent,trayFloor:Object.fromEntries(quad.map(([x,y],i)=>[['tl','tr','br','bl'][i],{x:x/w*100,y:y/h*100}])),innerRect:pctRect(rect),innerRectPixels:rect,floorAspectRatio:(front+back)/2/depth,floorWidthPercent:Math.min(front,back)/w*100,backNarrowerPercent:(1-back/front)*100,method:'Cream mask alpha>=240 R>=170 G>=160 B>=145 max-min<52; largest 4-connected component; central 70% edge regression; maximum rectangle by histogram stack over every floor pixel.',roundedCorners:'Fitted corners are virtual intersections; use innerRect for guaranteed containment.'};
  const svg=`<svg width="${w}" height="${h}"><polygon points="${quad.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#e01491" stroke-width="3"/><rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="none" stroke="#087eae" stroke-width="3"/></svg>`;
  await sharp(file).flatten({background:'#d7eefa'}).composite([{input:Buffer.from(svg)}]).png().toFile(`${out}/measurement-${name}.png`);
  await sharp(Buffer.from(mask.map(v=>v*255)),{raw:{width:w,height:h,channels:1}}).png().toFile(`${out}/${name}-floor-mask.png`);
  console.log(key,JSON.stringify(measurements[key]));
}
await writeFile(`${out}/measurements.json`,JSON.stringify(measurements,null,2)+'\n');
