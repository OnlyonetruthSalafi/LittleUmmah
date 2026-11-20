import * as THREE from 'three';

/** Original cloth, tooling and maritime illustration; no lettering or borrowed artwork. */
export function makeCoverArt(): THREE.MeshStandardMaterial {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1356;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.MeshStandardMaterial({ color: '#101d37', roughness: .84 });
  const w = canvas.width, h = canvas.height;
  let seed = 7159;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  ctx.fillStyle = '#1c2d49'; ctx.fillRect(0, 0, w, h);
  // Crossing warp/weft threads remain visible at close range, quiet at reading size.
  for (let y = 0; y < h; y += 3) {
    ctx.strokeStyle = `rgba(142,159,181,${.09 + random() * .09})`;
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let x = 0; x < w; x += 3) {
    ctx.strokeStyle = `rgba(3,9,25,${.16 + random() * .18})`;
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let i = 0; i < 48000; i++) {
    const x = Math.floor(random() * w), y = Math.floor(random() * h);
    ctx.fillStyle = random() > .5 ? 'rgba(155,161,168,.035)' : 'rgba(0,3,16,.075)';
    ctx.fillRect(x, y, 1, 2);
  }
  const shade = ctx.createLinearGradient(0, 0, w, 0);
  shade.addColorStop(0, 'rgba(1,8,22,.6)'); shade.addColorStop(.10, 'rgba(6,13,27,.08)');
  shade.addColorStop(.55, 'rgba(54,77,111,.09)'); shade.addColorStop(1, 'rgba(1,9,27,.28)');
  ctx.fillStyle = shade; ctx.fillRect(0, 0, w, h);
  // The broader bundles survive minification while the fine threads supply close-up grain.
  for(let x=6;x<w;x+=11) {
    ctx.fillStyle = `rgba(124,146,177,${.025+random()*.025})`;
    ctx.fillRect(x,0,2,h);
  }
  for(let y=7;y<h;y+=13) {
    ctx.fillStyle = `rgba(137,156,182,${.02+random()*.025})`;
    ctx.fillRect(0,y,w,2);
  }
  const hinge = ctx.createLinearGradient(38,0,84,0);
  hinge.addColorStop(0,'rgba(4,11,24,0)');hinge.addColorStop(.35,'rgba(1,7,19,.50)');
  hinge.addColorStop(.48,'rgba(2,8,20,.65)');hinge.addColorStop(.63,'rgba(120,143,176,.20)');hinge.addColorStop(1,'rgba(4,11,24,0)');
  ctx.fillStyle=hinge;ctx.fillRect(38,38,46,h-76);
  const foil = ctx.createLinearGradient(130, 80, 950, 1300);
  foil.addColorStop(0, '#cbb581'); foil.addColorStop(.26, '#f5e8bb');
  foil.addColorStop(.39, '#dfc48b'); foil.addColorStop(.44, '#fff5d3');
  foil.addColorStop(.49, '#e8d09b'); foil.addColorStop(.70, '#f3dfad'); foil.addColorStop(1, '#c4a96f');
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const stroke = (path: Path2D, width = 2.3, color: string | CanvasGradient = foil) => {
    ctx.strokeStyle = color; ctx.lineWidth = width * 1.18; ctx.stroke(path);
  };
  const path = (d: string, width = 2.3, color: string | CanvasGradient = foil) => stroke(new Path2D(d), width, color);
  // Spine-side border deliberately leaves a generous binding gutter.
  ctx.strokeStyle = foil; ctx.lineWidth = 4.4; ctx.strokeRect(103, 69, 854, 1218);
  ctx.lineWidth = 2.2; ctx.strokeRect(117, 83, 826, 1190);
  ctx.strokeStyle = '#344560'; ctx.lineWidth = 2; ctx.strokeRect(87, 54, 885, 1248);
  const ornament = () => {
    path('M0 112 L0 0 L112 0 M10 82 C46 80 56 55 46 36 C36 18 17 22 18 39 C20 53 39 51 36 39 M15 15 C68 12 80 43 65 62 C56 74 42 68 46 58 M19 75 C40 83 45 102 34 110 M75 19 C83 40 102 45 110 34', 2.1);
    path('M11 11 L11 62 M11 11 L62 11 M57 10 Q88 8 99 27 M10 57 Q8 88 27 99', 1.3);
    ctx.fillStyle = foil;
    for (const [x, y] of [[8, 98], [98, 8], [74, 74]]) { ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill(); }
    path('M60 60 L74 49 L88 60 L74 74 Z', 1.7);
  };
  for (const [x, y, sx, sy] of [[133, 99, 1, 1], [927, 99, -1, 1], [133, 1257, 1, -1], [927, 1257, -1, -1]]) {
    ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy); ornament(); ctx.restore();
  }
  // Blind-stamped tone-on-tone arabesques frame, rather than compete with, the crest.
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(side < 0 ? 178 : 882, 425); ctx.scale(side, 1);
    path('M0 0 C-37 55 26 88 -4 137 C-32 177 20 212 -1 255 C-30 303 27 332 0 378 M-2 25 C36 18 40 51 18 61 C2 69 -5 53 5 46 M-4 157 C34 147 44 182 21 194 C2 203 -3 182 9 177 M-1 289 C34 282 41 312 20 326', 2.5, '#2c405d');
    ctx.restore();
  }
  // An ornamental oval and radiant dawn make the boat read as a collectible edition crest.
  ctx.save(); ctx.translate(530, 649);
  ctx.strokeStyle = foil; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(0, 0, 276, 376, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(0, 0, 288, 388, 0, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 72; i++) {
    const a = i * Math.PI * 2 / 72;
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * 293, Math.sin(a) * 393);
    ctx.lineTo(Math.cos(a) * 298, Math.sin(a) * 398); ctx.stroke();
  }
  const sunY = -145;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, sunY, 69, Math.PI, Math.PI * 2); ctx.stroke();
  for (let i = 0; i <= 18; i++) {
    const a = Math.PI + i * Math.PI / 18, inner = 83, outer = i % 2 ? 99 : 116;
    path(`M${Math.cos(a) * inner} ${sunY + Math.sin(a) * inner} L${Math.cos(a) * outer} ${sunY + Math.sin(a) * outer}`, 1.6);
  }
  path('M-124 -143 L124 -143 M-101 -134 L101 -134', 1.2);
  // A curved timber hull, raised ends, cabin and close engraved plank hatching.
  path('M-218 28 Q-173 59 -121 61 L125 61 Q185 49 219 17 Q203 119 124 153 Q7 191 -125 151 Q-199 124 -218 28 Z', 4);
  path('M-211 48 Q-166 80 -118 81 L124 81 Q183 68 211 41 M-198 82 Q-144 113 -91 115 L100 115 Q156 103 194 75 M-172 116 Q-99 148 2 148 Q111 148 165 115', 2);
  path('M-136 59 L-136 -64 L132 -64 L132 58 M-154 -67 L-121 -111 L112 -111 L153 -67 Z', 3.2);
  path('M-141 -80 L139 -80 M-133 -94 L126 -94 M-119 -111 L-85 -67 M-72 -111 L-38 -67 M-25 -111 L9 -67 M22 -111 L56 -67 M69 -111 L103 -67', 1.3);
  for (const x of [-91, -30, 31, 92]) {
    path(`M${x - 13} 23 L${x - 13} -18 Q${x} -42 ${x + 13} -18 L${x + 13} 23 Z M${x} -25 L${x} 23`, 2);
  }
  path('M-144 42 L142 42 M-182 60 L-182 33 M-160 65 L-160 38 M156 59 L156 29 M179 47 L179 17 M-193 31 Q-153 53 -137 49 M133 45 Q174 34 191 7', 2);
  for (let x = -164; x <= 165; x += 25) path(`M${x} 87 Q${x * .86} 122 ${x * .75} 151`, 1);
  for (let row = 0; row < 4; row++) {
    const y = 197 + row * 29, edge = 218 - row * 25;
    let line = `M${-edge} ${y}`;
    for(let i=0;i<8;i++) line += ` Q${-edge+(i+.5)*edge/4} ${y+(i%2?9:-9)} ${-edge+(i+1)*edge/4} ${y}`;
    path(line, row === 0 ? 3 : 1.6);
  }
  // Tiny compass diamond, entirely geometric and deliberately without lettering.
  path('M0 -342 L10 -322 L0 -302 L-10 -322 Z M-28 -322 L-15 -322 M15 -322 L28 -322', 2);
  ctx.restore();
  path('M456 1139 Q490 1121 530 1139 Q570 1121 604 1139 M476 1152 L517 1152 M543 1152 L584 1152 M530 1144 L538 1152 L530 1160 L522 1152 Z', 2);
  // Patina breaks up the otherwise mechanically perfect foil without obscuring its marks.
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(12,23,43,${random() * .12})`;
    ctx.fillRect(random() * w, random() * h, 1 + random() * 2, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  // Color separates the foil cleanly from blue cloth, including antialiased edge pixels.
  // Packed G/B channels give the cloth and brass genuinely different light responses.
  const source=ctx.getImageData(0,0,w,h),response=new Uint8Array(w*h*4),height=new Uint8Array(w*h*4);
  for(let i=0;i<source.data.length;i+=4) {
    const r=source.data[i],b=source.data[i+2];
    const foilCoverage=THREE.MathUtils.clamp((r-b-9)/65,0,1);
    const roughness=242-foilCoverage*153;
    response[i]=255;response[i+1]=roughness;response[i+2]=foilCoverage*170;response[i+3]=255;
    const raised=110+(source.data[i+1]-25)*.65+foilCoverage*24;
    height[i]=height[i+1]=height[i+2]=THREE.MathUtils.clamp(raised,0,255);height[i+3]=255;
  }
  const surface=new THREE.DataTexture(response,w,h),relief=new THREE.DataTexture(height,w,h);
  for(const map of [surface,relief]) {
    map.flipY=true;map.magFilter=THREE.LinearFilter;map.minFilter=THREE.LinearMipmapLinearFilter;
    map.generateMipmaps=true;map.anisotropy=8;map.needsUpdate=true;
  }
  return new THREE.MeshStandardMaterial({ map: texture, color: '#ffffff', roughness: 1, metalness: .72, roughnessMap:surface, metalnessMap:surface, bumpMap:relief, bumpScale:.003 });
}
