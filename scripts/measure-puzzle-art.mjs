import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const out = 'output/puzzle-art';
const { data, info: { width: w, height: h } } = await sharp('public/games/puzzle/island.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const cream = new Uint8Array(w * h);
const gold = new Uint8Array(w * h);
let minX = w, minY = h, maxX = 0, maxY = 0, transparent = 0;
for (let p = 0; p < w * h; p++) {
  const [r, g, b, a] = data.subarray(p * 4, p * 4 + 4);
  const x = p % w, y = Math.floor(p / w);
  if (a >= 240) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  if (!a) transparent++;
  cream[p] = +(a >= 240 && r >= 175 && g >= 165 && b >= 150 && r - b < 55 && Math.max(r, g, b) - Math.min(r, g, b) < 55);
  gold[p] = +(a >= 240 && r >= 225 && g >= 140 && b < 180 && r - b >= 65 && g - b >= 30);
}
function largest(mask) {
  const visited = new Uint8Array(mask.length), queue = new Int32Array(mask.length);
  let best = [];
  for (let p = 0; p < mask.length; p++) {
    if (!mask[p] || visited[p]) continue;
    let head = 0, tail = 1; queue[0] = p; visited[p] = 1;
    while (head < tail) {
      const q = queue[head++], x = q % w;
      for (const n of [x ? q - 1 : -1, x < w - 1 ? q + 1 : -1, q - w, q + w]) {
        if (n >= 0 && n < mask.length && mask[n] && !visited[n]) { visited[n] = 1; queue[tail++] = n; }
      }
    }
    if (tail > best.length) best = Array.from(queue.subarray(0, tail));
  }
  const result = new Uint8Array(mask.length);
  for (const p of best) result[p] = 1;
  return { mask: result, count: best.length };
}
const floor = largest(cream);
const points = [];
for (let p = 0; p < floor.mask.length; p++) if (floor.mask[p] && (!floor.mask[p - 1] || !floor.mask[p + 1] || !floor.mask[p - w] || !floor.mask[p + w])) points.push([p % w, Math.floor(p / w)]);
const extreme = [
  points.reduce((a,b) => b[0] < a[0] ? b : a),
  points.reduce((a,b) => b[1] < a[1] ? b : a),
  points.reduce((a,b) => b[0] > a[0] ? b : a),
  points.reduce((a,b) => b[1] > a[1] ? b : a),
];
function regression(ps) {
  let sx=0,sy=0,sxx=0,sxy=0;
  for (const [x,y] of ps) { sx+=x; sy+=y; sxx+=x*x; sxy+=x*y; }
  const a=(ps.length*sxy-sx*sy)/(ps.length*sxx-sx*sx), b=(sy-a*sx)/ps.length;
  return { a,b, samples: ps.length, rmse: Math.sqrt(ps.reduce((s,[x,y])=>s+(y-a*x-b)**2,0)/ps.length) };
}
const lines = extreme.map((a,i) => {
  const b = extreme[(i+1)%4], dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
  let ps=points.filter(([x,y])=>{const t=((x-a[0])*dx+(y-a[1])*dy)/(len*len);return t>.12&&t<.88&&Math.abs((x-a[0])*dy-(y-a[1])*dx)/len<12;});
  let fit=regression(ps);
  ps=ps.filter(([x,y])=>Math.abs(y-fit.a*x-fit.b)<3);
  return regression(ps);
});
function intersect(a,b) { const x=(b.b-a.b)/(a.a-b.a);return [x,a.a*x+a.b]; }
const quad=lines.map((line,i)=>intersect(lines[(i+3)%4],line));
const center=quad.reduce((s,p)=>[s[0]+p[0]/4,s[1]+p[1]/4],[0,0]);
// Follow outward edge normals from measured floor edges, locating the outer
// bright gold crown. Excludes dark vertical side walls from the rim plane.
const rimLines = lines.map((line,i)=>{
  const a=quad[i], b=quad[(i+1)%4],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
  let nx=-dy/len,ny=dx/len;
  if(nx*(center[0]-a[0])+ny*(center[1]-a[1])>0){nx=-nx;ny=-ny;}
  const ps=[];
  for(let t=.15;t<=.85;t+=.01){
    const x=a[0]+t*dx,y=a[1]+t*dy;
    let last=-1,miss=0;
    for(let d=1;d<=65;d++){
      const xx=Math.round(x+d*nx),yy=Math.round(y+d*ny);
      if(gold[yy*w+xx]){last=d;miss=0;}else if(last>=0&&++miss>=4)break;
    }
    if(last>0)ps.push([x+last*nx,y+last*ny]);
  }
  if(ps.length<20)throw new Error('Insufficient gold edge samples');
  let fit=regression(ps);
  return regression(ps.filter(([x,y])=>Math.abs(y-fit.a*x-fit.b)<4));
});
const rim=rimLines.map((line,i)=>intersect(rimLines[(i+3)%4],line));
const names=['left','top','right','bottom'];
const percent = ps => Object.fromEntries(ps.map(([x,y],i)=>[names[i],{x:+(x/w*100).toFixed(5),y:+(y/h*100).toFixed(5)}]));
const thickness=lines.map((line,i)=>Math.abs((rim[i][1]+rim[(i+1)%4][1])/2-line.a*(rim[i][0]+rim[(i+1)%4][0])/2-line.b)/Math.hypot(line.a,1));
const result={ coordinateSystem:'percent of full image, x rightward, y downward', island:{width:w,height:h,bbox:{x:minX/w*100,y:minY/h*100,width:(maxX-minX+1)/w*100,height:(maxY-minY+1)/h*100},alphaThreshold:240,fullyTransparentPixels:transparent,trayCornerNaming:'left top right bottom (screen positions)',trayFloor:percent(quad),trayRim:percent(rim),rimThicknessPx:thickness,rimThicknessMeanPx:thickness.reduce((a,b)=>a+b)/4,trayWidthPercentOfIsland:(rim[2][0]-rim[0][0])/(maxX-minX+1)*100},measurement:{method:'cream mask -> largest 4-connected component -> x/y extrema -> trimmed least-squares edge fits -> line intersections; gold crown sampled along outward edge normals and fitted independently',creamThreshold:'alpha>=240 R>=175 G>=165 B>=150 max-min<55 R-B<55',goldThreshold:'alpha>=240 R>=225 G>=140 B<180 R-B>=65 G-B>=30',floorPixels:floor.count,floorEdgeFits:lines,rimEdgeFits:rimLines,roundedCornerNote:'Corners are intersections of fitted straight sides; small rounded corners require clipping to floor mask.'},mapping:{imageTL:'left',imageTR:'top',imageBR:'right',imageBL:'bottom',imageTopEdge:'left -> top (rear-left edge)'}};
let existing = {};
try { existing = JSON.parse(await readFile(`${out}/measurements.json`, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
await writeFile(`${out}/measurements.json`,JSON.stringify({...existing,...result},null,2)+'\n');
await sharp(Buffer.from(floor.mask.map(v=>v*255)),{raw:{width:w,height:h,channels:1}}).png().toFile(`${out}/tray-floor-mask.png`);
const polygon=(ps,color)=>`<polygon points="${ps.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="2"/>`;
const svg=`<svg width="${w}" height="${h}">${polygon(rim,'#1261f0')}${polygon(quad,'#e01491')}${quad.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="4" fill="#e01491"/><text x="${x+8}" y="${y-8}" font-size="18" fill="#152347" stroke="white" stroke-width=".5">${names[i]}</text>`).join('')}</svg>`;
await sharp('public/games/puzzle/island.png').flatten({background:'#e8f3f9'}).composite([{input:Buffer.from(svg)}]).png().toFile(`${out}/measurement-tray.png`);
console.log(JSON.stringify(result,null,2));
