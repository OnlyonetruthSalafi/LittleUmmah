import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
const src='public/games/bead-lacing/island.png';
const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const wood=(x,y)=>{const i=(y*info.width+x)*4;const [r,g,b,a]=data.subarray(i,i+4);return a>240&&r>170&&g>95&&r>g*1.1&&g>b*1.15;};
const samples=[];
for(const xPct of [19,29,39,49,59,69,80]){
 const x=Math.round(info.width*xPct/100);let start=-1,end=-1;
 for(let y=0;y<info.height*.43;y++){if(wood(x,y)){if(start<0)start=y;end=y;}else if(start>=0&&y-end>5)break;}
 if(start<0||end-start<50)throw Error(`No bench at ${xPct}`);
 samples.push({x:xPct,top:start/info.height*100,bottom:end/info.height*100});
}
const points=samples.map((s,i)=>({x:s.x,y:+(s.top+(s.bottom-s.top)*(.45+.12*Math.sin(i/6*Math.PI))).toFixed(3)}));
// Cubic curves go exactly through the measured bead centres. Cross-strand marks
// use the same curve and its tangent, including the loose loop at the left.
const segments=[[[19,29.187],[8,43],[4,21],[19,29.187]]];
for(let i=0;i<points.length-1;i++){
 const a=points[i],b=points[i+1],prev=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+2)];
 segments.push([[a.x,a.y],[a.x+(b.x-prev.x)/6,a.y+(b.y-prev.y)/6],[b.x-(next.x-a.x)/6,b.y-(next.y-a.y)/6],[b.x,b.y]]);
}
const num=n=>+n.toFixed(3),pair=p=>p.map(num).join(' ');
const cordPath=`M ${pair(segments[0][0])} `+segments.map(s=>`C ${s.slice(1).map(pair).join(' ')}`).join(' ');
const twists=[];
for(const s of segments){
 const at=t=>[0,1].map(k=>(1-t)**3*s[0][k]+3*(1-t)**2*t*s[1][k]+3*(1-t)*t*t*s[2][k]+t**3*s[3][k]);
 const length=Math.hypot(s[3][0]-s[0][0],s[3][1]-s[0][1])||23;
 for(let n=0;n<Math.ceil(length/.65);n++){const t=n/Math.ceil(length/.65),a=at(t),b=at(Math.min(1,t+.001));const angle=Math.atan2(b[1]-a[1],b[0]-a[0]),dx=Math.cos(angle),dy=Math.sin(angle);const start=[a[0]-.65*dy-.2*dx,a[1]+.65*dx-.2*dy];twists.push(`M ${pair(start)} q ${pair([.8*dy+.6*dx,-.8*dx+.6*dy])} ${pair([1.3*dy+.4*dx,-1.3*dx+.4*dy])}`);}
}
const tip=points.pop();
const art={width:info.width,height:info.height,points,tip,beadWidth:10,cordPath,twists};
await writeFile('src/features/games/data/beadLacingArt.ts',`// Measured from the bench wood mask by scripts/measure-bead-lacing-art.mjs.\nexport const LACING_ART = ${JSON.stringify(art)};\n`);
await writeFile('output/vis-1/measurements.json',JSON.stringify({src,samples,art},null,2));
console.log(art);
