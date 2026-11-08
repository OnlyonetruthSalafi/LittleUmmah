import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
const dir='public/games/bead-lacing';
const audit=[];
// Remove generated low-alpha speckles, keep the largest connected solid, and
// feather only its outermost pixel. Never key out a colour (ivory beads stay solid).
async function clean(input,name,square=false){
 const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width:w,height:h}=info,seen=new Uint8Array(w*h);let largest=[];
 for(let p=0;p<w*h;p++)if(!seen[p]&&data[p*4+3]>=160){
  const q=[p];seen[p]=1;
  for(let k=0;k<q.length;k++){const i=q[k],x=i%w,y=Math.floor(i/w);for(const j of [x?i-1:-1,x<w-1?i+1:-1,y?i-w:-1,y<h-1?i+w:-1])if(j>=0&&!seen[j]&&data[j*4+3]>=160){seen[j]=1;q.push(j);}}
  if(q.length>largest.length)largest=q;
 }
 const mask=new Uint8Array(w*h);for(const p of largest)mask[p]=1;
 let left=w,top=h,right=0,bottom=0;
 for(let p=0;p<w*h;p++){const x=p%w,y=Math.floor(p/w);if(!mask[p]){data[p*4+3]=0;continue;}const edge=!mask[p-1]||!mask[p+1]||!mask[p-w]||!mask[p+w];data[p*4+3]=edge?180:255;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 const bounds={left,top,width:right-left+1,height:bottom-top+1};
 let pipeline=sharp(data,{raw:{width:w,height:h,channels:4}}).extract(bounds);
 if(square)pipeline=pipeline.resize(320,320,{fit:'contain',background:'#00000000'});
 else pipeline=pipeline.extend({top:8,bottom:8,left:8,right:8,background:'#00000000'});
 await pipeline.png().toFile(`${dir}/${name}.png`);
 audit.push({name,inputDimensions:[w,h],bounds,solidPixels:largest.length});
}
await clean('output/vis-1/options/island.png','island');
await clean('output/vis-1/options/tray.png','tray');
const sheet=sharp('output/vis-1/options/beads.png'),meta=await sheet.metadata();
for(const [r,color] of ['blue','turquoise','gold','white'].entries())for(const [c,shape] of ['circle','square','star'].entries()){
 const left=Math.round(c*meta.width/3),top=Math.round(r*meta.height/4);
 const buf=await sheet.clone().extract({left,top,width:Math.round((c+1)*meta.width/3)-left,height:Math.round((r+1)*meta.height/4)-top}).png().toBuffer();
 await clean(buf,`${color}-${shape}`,true);
}
await writeFile('output/vis-1/art-extraction.json',JSON.stringify(audit,null,2));
console.log(audit);
