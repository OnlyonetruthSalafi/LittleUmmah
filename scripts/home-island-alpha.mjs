import sharp from 'sharp';
export const homeIslandNames = ['tajweed','quran-reading','faith-basics','numbers-math'];

// Generated opaque toys should not contain a translucent center. Keep a narrow
// antialias band at the silhouette, discard faint exterior haze and pull edge
// RGB from the nearest solid pixel (defringe, without a white/black matte).
export async function prepareHomeIsland(bytes) {
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width:w,height:h}=info;
  const mask=new Uint8Array(w*h);
  for(let i=0;i<mask.length;i++)mask[i]=data[i*4+3]>=32?1:0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=y*w+x,offset=i*4;
    if(!mask[i]){data[offset+3]=0;continue;}
    let interior=true;
    for(let dy=-2;dy<=2&&interior;dy++)for(let dx=-2;dx<=2;dx++){
      if(x+dx<0||x+dx>=w||y+dy<0||y+dy>=h||!mask[(y+dy)*w+x+dx]){interior=false;break;}
    }
    if(interior)data[offset+3]=255;
  }
  const source=Buffer.from(data);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const o=(y*w+x)*4,a=source[o+3];
    if(a===0||a===255)continue;
    let found=false;
    for(let r=1;r<=4&&!found;r++)for(let dy=-r;dy<=r&&!found;dy++)for(let dx=-r;dx<=r;dx++){
      const xx=x+dx,yy=y+dy;if(xx<0||xx>=w||yy<0||yy>=h)continue;
      const n=(yy*w+xx)*4;
      if(source[n+3]===255){for(let c=0;c<3;c++)data[o+c]=source[n+c];found=true;break;}
    }
  }
  return sharp(data,{raw:{width:w,height:h,channels:4}}).png().toBuffer();
}

export async function scanHomeAlpha(file) {
  const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width:w,height:h}=info;let transparent=0,opaque=0,edge=0,interiorTranslucent=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const a=data[(y*w+x)*4+3];
    if(a===0){transparent++;continue;}if(a===255){opaque++;continue;}edge++;
    // At 900px output, a 4px radius exceeds the resampled antialias band.
    let nearOutside=false;
    for(let dy=-4;dy<=4&&!nearOutside;dy++)for(let dx=-4;dx<=4;dx++){
      const xx=x+dx,yy=y+dy;
      if(xx<0||xx>=w||yy<0||yy>=h||data[(yy*w+xx)*4+3]===0){nearOutside=true;break;}
    }
    if(!nearOutside)interiorTranslucent++;
  }
  return {file,width:w,height:h,transparent,opaque,edge,interiorTranslucent};
}
