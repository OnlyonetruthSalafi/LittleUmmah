const RING = ['front', 'q', 'side', 'back'];
/* หันตัว: ไล่ผ่านมุมที่อยู่ระหว่างทาง (หน้า -> เฉียง -> ข้าง -> หลัง) สลับชุดชิ้นส่วนทีละขั้น
   แต่ละขั้นบีบความกว้างสั้น ๆ ให้เห็นเป็นการหมุนรอบตัว แล้วคืนพร้อมเอนตัวเล็กน้อย · flip = หันไปทางซ้ายของจอ */
function turn(id, t, view, flip = false, step = .13) {
  const cur = val(id, 'view', t, 'front'), cf = !!val(id, 'flip', t, false), have = (v) => kits[id][v];
  // ตำแหน่งบนวงรอบตัว: หน้า 0, เฉียง ±1, ข้าง ±2, หลัง 3 (ลบ = หันซ้าย)
  const pos = (v, f) => { const i = RING.indexOf(v); return i === 0 || i === 3 ? i : f ? -i : i; };
  let a = pos(cur, cf), b = pos(view, flip); if (a === b) return t;
  // ด้านหลังนับเป็น 3 หรือ -3 ตามฝั่งที่มาจาก/จะไป เพื่อหมุนทางสั้น
  if (a === 3 && b < 0) a = -3; if (b === 3 && a < 0) b = -3;
  const path = []; const dir = b > a ? 1 : -1;
  for (let p = a + dir; dir > 0 ? p <= b : p >= b; p += dir) path.push(p);
  let at = t;
  for (const p of path) {
    const v = RING[Math.abs(p)], f = p < 0 && Math.abs(p) !== 3; if (!have(v) || (p !== b && CAST[id].skip?.includes(v))) continue;
    to(id, 'sq', at, at + step * .45, .96, 'in'); set(id, 'view', at + step * .45, v); set(id, 'flip', at + step * .45, v === 'front' ? false : f);
    key(id, 'sq', at + step, 1, 'out'); at += step;
  }
  return at;
}
/* ขับไปยังจุดใหม่: หันข้างไปทางที่จะไปก่อน เอนตัวตอนออกตัวและตอนเบรก แล้วหันกลับเป็นมุมที่ต้องการ */
function drive(id, t0, t1, x, y, { end = 'q', endFlip, s, via = 'side', brake = true, soundGain = .45, brakeGain = .5 } = {}) {
  const x0 = val(id, 'x', t0, x), left = x < x0, v = kits[id][via] ? via : 'q';
  const tt = turn(id, t0, v, left), d = t1 - tt, lean = left ? -1 : 1;
  if (!CAST[id].hover) { fx('glide', tt, soundGain, d); if (brake) fx('settle', t1 - .35, brakeGain); } // glide/settle นุ่มแทน tread/brake ที่แสบหู (เจ้าของ 17 พ.ย. 2026)
  to(id, 'x', tt, t1, x, 'io'); to(id, 'y', tt, t1, y, 'io'); if (s !== undefined) to(id, 's', tt, t1, s, 'io');
  to(id, 'lean', tt, tt + Math.min(.35, d * .3), 3.5 * lean, 'out'); key(id, 'lean', t1 - Math.min(.45, d * .3), 2 * lean); key(id, 'lean', t1, -3 * lean, 'out'); key(id, 'lean', t1 + .3, 0, 'io');
  return end ? turn(id, t1 + .05, end, endFlip ?? left) : t1;
}
/* ท่าทางข้อต่อ: ค้างท่าปัจจุบันถึง t0 เคลื่อนถึง t1 */
function joints(id, view, t0, t1, angles, e = 'io') { for (const [n, a] of Object.entries(angles)) to(id, `j:${view}:${n}`, t0, t1, a, e); }
/* ยกท่าขึ้นแล้วคืน (ใช้ตอนพูด/ชี้) */
function gesture(id, view, t0, t1, angles, { up = .4, down = .45 } = {}) { joints(id, view, t0, t0 + up, angles, 'out'); const zero = Object.fromEntries(Object.keys(angles).map((n) => [n, 0])); joints(id, view, t1 - down, t1, zero); }

const cut=(t,x,y,z)=>{set('cam','x',t,x);set('cam','y',t,y);set('cam','z',t,z);};
const camTo=(a,b,x,y,z)=>{to('cam','x',a,b,x);to('cam','y',a,b,y);to('cam','z',a,b,z);};
const head=(id,a,b,v)=>to(id,`j:${val(id,'view',a,'q')}:head`,a,b,v);
const place=(id,x,y,view='q',flip=false)=>{set(id,'x',-1,x);set(id,'y',-1,y);set(id,'view',-1,view);set(id,'flip',-1,flip);};
const OPEN={'arm-l-upper':28,'arm-l-lower':30,'arm-r-upper':-28,'arm-r-lower':-30};
const FWD={'arm-r-upper':-55,'arm-r-lower':-45};
const BOTH={'arm-l-upper':40,'arm-l-lower':30,'arm-r-upper':-40,'arm-r-lower':-30};
function prop(name,img,x,y,s,ax,ay,depth=951){PROPS[name]={img,ax,ay};for(const [p,v] of Object.entries({x,y,s,depth}))set(name,p,0,v);}
function shadow(x,y,rx,ry,alpha){ctx.save();ctx.setTransform(camM);ctx.translate(x,y);ctx.scale(rx,ry);const g=ctx.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,`rgba(30,45,55,${alpha})`);g.addColorStop(1,'rgba(30,45,55,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,7);ctx.fill();ctx.restore();}

// Arm and view are explicit; each grip owns an independent chain.
function grip(id,propName,p,a,b,{tin=.6,tout=.5,hand=0,elbow=-1,arm='r',view='q',follow,gripPoint}={}){
 const rig=kits[id]?.[view], profile=CAST[id]?.arms?.[view]?.[arm];
 const chain=[`arm-${arm}-upper`,`arm-${arm}-lower`,`hand-${arm}`];
 if(!profile||!rig||chain.some(n=>!rig.parts[n]))throw Error(`Missing arm rig/profile: ${id}/${view}/${arm}`);
 const k={id,view,arm,chain,grip:gripPoint??profile.grip,t0:a,t1:b,tin,tout,hand,elbow,
 follow:follow===false?null:follow??profile.follow,target:t=>propWorld(propName,t,p)};
 iks.push(k);return k;
}
function frontGrip(id,a,b,arms=['r']){set(id,'front',a,arms.map(arm=>`hand-${arm}`));set(id,'front',b,null);}

window.FILM_CAST_API={turn,drive,joints,gesture,cut,camTo,head,place,prop,shadow,grip,frontGrip,OPEN,FWD,BOTH};
