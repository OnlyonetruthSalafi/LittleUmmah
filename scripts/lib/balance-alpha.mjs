import sharp from 'sharp';
// Remove the low-alpha saturated matte from generated cutouts, then contract
// one source pixel (two for the large hub) and antialias the new silhouette.
export async function cleanBalanceAlpha(path, radius = 1) {
  const {data, info} = await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const mask = Buffer.alloc(info.width * info.height);
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    let value=255;
    for(let dy=-radius;dy<=radius&&value;dy++) for(let dx=-radius;dx<=radius;dx++) {
      const xx=x+dx, yy=y+dy;
      if(xx<0||yy<0||xx>=info.width||yy>=info.height||data[(yy*info.width+xx)*4+3]<240){value=0;break;}
    }
    mask[y*info.width+x]=value;
  }
  const alpha = await sharp(mask,{raw:{width:info.width,height:info.height,channels:1}}).blur(.6).toColourspace('b-w').raw().toBuffer();
  for(let i=0;i<mask.length;i++) data[i*4+3]=alpha[i];
  return sharp(data,{raw:info}).png().toBuffer();
}
