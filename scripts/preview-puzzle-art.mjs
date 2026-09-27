import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const out = 'output/puzzle-art';
const measured = JSON.parse(await readFile(`${out}/measurements.json`, 'utf8'));
const { width:w, height:h, trayFloor } = measured.island;
const corners = ['left','top','right','bottom'].map(k=>[trayFloor[k].x*w/100,trayFloor[k].y*h/100]);
// Solve the eight projective coefficients with pivoted Gaussian elimination.
function solve(a,b) {
  const m=a.map((r,i)=>[...r,b[i]]),n=b.length;
  for(let i=0;i<n;i++){
    let pivot=i;
    for(let j=i+1;j<n;j++)if(Math.abs(m[j][i])>Math.abs(m[pivot][i]))pivot=j;
    [m[i],m[pivot]]=[m[pivot],m[i]];
    const d=m[i][i]; if(Math.abs(d)<1e-10)throw new Error('Singular homography');
    for(let k=i;k<=n;k++)m[i][k]/=d;
    for(let j=0;j<n;j++)if(j!==i){const f=m[j][i];for(let k=i;k<=n;k++)m[j][k]-=f*m[i][k];}
  }
  return m.map(r=>r[n]);
}
function homography(from,to){
  const a=[],b=[];
  from.forEach(([x,y],i)=>{const [u,v]=to[i];a.push([x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]);b.push(u,v);});
  return solve(a,b);
}
function transform(m,x,y){const z=m[6]*x+m[7]*y+1;return [(m[0]*x+m[1]*y+m[2])/z,(m[3]*x+m[4]*y+m[5])/z];}
const square=[[0,0],[1,0],[1,1],[0,1]];
const inverse=homography(corners,square),forward=homography(square,corners);
const cornerError=Math.max(...square.map(([u,v],i)=>{const p=transform(forward,u,v);return Math.hypot(p[0]-corners[i][0],p[1]-corners[i][1]);}));
if(cornerError>1e-6)throw new Error('Corner mapping failed');
const mask=await sharp(`${out}/tray-floor-mask.png`).greyscale().raw().toBuffer();
const verification=[];
for(let level=1;level<=3;level++){
  const file=level===3?'courtyard':`picture-${level}`;
  const {data,info}=await sharp(`public/games/puzzle/${file}.webp`).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const cols=level===1?2:3,rows=level===3?3:2;
  const overlay=Buffer.alloc(w*h*4);
  let covered=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const p=y*w+x;if(!mask[p])continue;
    const [u,v]=transform(inverse,x+.5,y+.5);
    if(u<0||v<0||u>1||v>1)continue;
    const sx=u*(info.width-1),sy=v*(info.height-1),ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;
    const col=Math.min(cols-1,Math.floor(u*cols)),row=Math.min(rows-1,Math.floor(v*rows));
    const opacity=level===1?1:level===2?((row+col)%2===0?1:.35):.35;
    // Thin grid lines in the source plane; the image itself remains unmarked.
    const grid=[...Array(cols-1)].some((_,i)=>Math.abs(u-(i+1)/cols)<.0015)||[...Array(rows-1)].some((_,i)=>Math.abs(v-(i+1)/rows)<.0015);
    for(let c=0;c<3;c++){
      const sample=(xx,yy)=>data[(Math.min(yy,info.height-1)*info.width+Math.min(xx,info.width-1))*info.channels+c];
      const value=(sample(ix,iy)*(1-fx)+sample(ix+1,iy)*fx)*(1-fy)+(sample(ix,iy+1)*(1-fx)+sample(ix+1,iy+1)*fx)*fy;
      overlay[p*4+c]=grid?[28,75,92][c]:Math.round(value);
    }
    overlay[p*4+3]=Math.round((grid?.8:opacity)*255);covered++;
  }
  const composite=await sharp('public/games/puzzle/island.webp').composite([{input:overlay,raw:{width:w,height:h,channels:4}}]).png().toBuffer();
  await sharp(composite).toFile(`${out}/preview-level${level}.png`);
  await sharp(composite).resize(390).flatten({background:'#e8f3f9'}).png().toFile(`${out}/preview-level${level}-390.png`);
  verification.push({level,columns:cols,rows,source:file,coveredPixels:covered,opacity:level===1?'100%':level===2?'3 checkerboard cells 100%, 3 cells 35%':'35% entire picture',cornerErrorPx:cornerError});
}
await writeFile(`${out}/preview-verification.json`,JSON.stringify({type:'Sharp composite, NOT browser screenshot',mapping:measured.mapping,forward,inverse,levels:verification},null,2)+'\n');
console.log(verification);
