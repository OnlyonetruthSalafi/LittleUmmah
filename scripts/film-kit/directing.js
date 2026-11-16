/* ชุดคำสั่งกำกับการแสดง — ถอดจากการ์ตูน "ฮาดีพูดความจริง" (truth-v2, ต้นแบบที่ Fable ทำ) ให้เรื่องใหม่เรียกใช้ซ้ำได้
   Claude 17 พ.ย. 2026 · บทเรียนเต็ม: docs/animation/2026-11-16-car-truth-lessons.txt และ docs/animation/2026-11-17-film-template.txt
   หลักของต้นแบบ: เจตนา → ลงมือ → ของตอบสนอง → ตัวละครรับรู้ผล → แก้ไข
   ทุกคำสั่งเป็นแค่ key บน timeline เดิม ไม่เรียกก็ไม่มีผลกับเรื่องเก่า (ไฟล์นี้ไม่วาดอะไรเองจนกว่าจะเรียก) */

/* ---------- การชน: เหตุเดียว ผลเป็นทอด ๆ ----------
   at = เวลาที่ถึงตัว · mover = ผู้ชน · hit = รายการของที่ถูกชน [{name, amp?, rot?}]
   ของหนักสั่นแบบหน่วง (+amp → -0.4 → +0.2 → 0) ผู้ชนผงะถอย เอนหลัง กระเด้งเล็กน้อย ตาเบิก
   คืนเวลาที่ทุกอย่างกลับนิ่ง — ใช้ต่อกับ topple()/debris() ให้ของเบาตอบสนองช้ากว่า */
function impact(at, mover, hit = [], { back = 50, lean = -7, hop = 16, face = true, sound = .55, boing = .7, dir = 1 } = {}) {
  for (const h of hit) {
    const amp = (h.amp ?? 16) * dir, base = val(h.name, 'x', at, 0), r = (h.rot ?? 1.6) * dir;
    key(h.name, 'x', at, base); key(h.name, 'x', at + .07, base + amp, 'out'); key(h.name, 'x', at + .2, base - amp * .38, 'io');
    key(h.name, 'x', at + .34, base + amp * .19, 'io'); key(h.name, 'x', at + .46, base, 'io');
    if (r) { key(h.name, 'rot', at, val(h.name, 'rot', at, 0)); key(h.name, 'rot', at + .07, r, 'out'); key(h.name, 'rot', at + .22, -r / 2, 'io'); key(h.name, 'rot', at + .4, 0, 'io'); }
  }
  if (mover) {
    const x = val(mover, 'x', at, 0);
    to(mover, 'lean', at, at + .18, lean * dir, 'out'); to(mover, 'x', at, at + .5, x - back * dir, 'out'); key(mover, 'lean', at + .7, 0, 'io');
    to(mover, 'hop', at, at + .14, hop, 'out'); key(mover, 'hop', at + .34, 0, 'bounce');
    if (face) { set(mover, 'eyes', at, 'wide'); set(mover, 'mouth', at, 'o'); }
  }
  if (sound) fx('bump', at, sound); if (boing) fx('boing', at + .03, boing);
  return at + .7;
}

/* ของเบาโยกแล้วล้ม: โยกตามแรงชน → ค้างลังเล → ล้มเร่ง → กระดอนเล็กน้อยแล้วนิ่ง · คืนเวลาที่ล้มถึง (land) */
function topple(name, at, { wobble = 9, to: deg = 86, delay = .5, dur = .62, bounce = 4, sound = .5 } = {}) {
  const fall = at + delay, land = fall + dur, s = Math.sign(deg) || 1;
  to(name, 'rot', at, at + .16, wobble * s, 'out'); key(name, 'rot', at + .34, -wobble / 3 * s, 'io'); key(name, 'rot', fall, wobble * .8 * s, 'io');
  key(name, 'rot', land, deg, 'in'); key(name, 'rot', land + .1, deg - bounce * s, 'out'); key(name, 'rot', land + .22, deg, 'in');
  if (sound) { fx('bump', land, sound); fx('bump', land + .42, sound * .4); }
  return land;
}

/* เศษชิ้นที่หลุด: ตกจาก from ลงพื้น floorY กระดอนหนึ่งครั้ง หมุนระหว่างตก แล้วอยู่ที่เดิมต่อไป (ของมีสถานะต่อเนื่อง)
   from/to = {x,y,rot} · depth = ลำดับวาดตอนอยู่บนพื้น · เปิดเงาใต้ชิ้นด้วย propShadow(name,{floorY}) */
function debris(name, at, from, to_, { dur = .7, bounce = 18, depth } = {}) {
  set(name, 'on', at, true); set(name, 'x', at, from.x); set(name, 'y', at, from.y); set(name, 'rot', at, from.rot ?? 0);
  if (depth !== undefined) set(name, 'depth', at, depth);
  const down = at + dur * .6, up = at + dur * .8;
  to(name, 'x', at, at + dur, to_.x, 'out'); to(name, 'y', at, down, to_.y, 'in'); key(name, 'y', up, to_.y - bounce, 'out'); key(name, 'y', at + dur, to_.y, 'in');
  to(name, 'rot', at, at + dur, to_.rot ?? (from.rot ?? 0) + 105, 'out');
  return at + dur;
}

/* เปลี่ยนสภาพของ (ปกติ/หัก/ซ่อมแล้ว) — ภาพทุกสภาพต้องขนาดและจุดยึดเดียวกัน */
function swapState(name, at, img, { sound = 'pop', gain = .4 } = {}) { set(name, 'img', at, img); if (sound) fx(sound, at, gain); }

/* หมุนสะสม (ใบพัด กังหัน ล้อของประกอบฉาก): spin(t1, องศา/วินาที, ease) ต่อจากมุมเดิมเสมอ ไม่ย้อนกลับ */
function spinner(name, start = 0) {
  let T0 = start, A = val(name, 'rot', start, 0); set(name, 'rot', start, A);
  const api = {
    spin(t1, degPerSec, e = 'lin') { A += degPerSec * (t1 - T0) * (e === 'lin' ? 1 : .5); T0 = t1; key(name, 'rot', t1, A, e); return api; },
    snap(t, a) { A = a; T0 = t; key(name, 'rot', t, A, 'step'); return api; },   // ตั้งมุมทันที เช่น ให้ใบที่จะหักชี้ลง
    settle(t0, t1) { A = Math.round(A / 360) * 360; to(name, 'rot', t0, t1, A, 'io'); T0 = t1; return api; }, // หมุนกลับตั้งตรง
    get angle() { return A; },
  };
  return api;
}

/* ถือของ: ผูกของกับมือ (attach actor) · ปล่อยของ: เก็บตำแหน่งโลกขณะปล่อยไว้ก่อนตัดการผูก ของจึงไม่วาร์ป
   แล้วตกลงพื้นที่ floorY ภายใน drop วินาที (0 = วางนิ่งตรงนั้น) */
function holdProp(name, at, actor, part, p, { follow = false } = {}) { set(name, 'on', at, true); set(name, 'attach', at, { actor, part, at: p, follow }); }
function releaseProp(name, at, { floorY, drop = .12, depth } = {}) {
  const w = propWorld(name, at);
  set(name, 'attach', at, null); set(name, 'x', at, w.x); set(name, 'y', at, w.y);
  if (depth !== undefined) set(name, 'depth', at, depth);
  if (floorY !== undefined && drop > 0) { to(name, 'y', at, at + drop, floorY, 'in'); fx('bump', at + drop, .25); }
  HANDOFFS.push({ name, at, kind: 'release', world: w });
  return at + drop;
}
/* ส่งของจากมือหนึ่งไปอีกมือ: ผู้รับต้องเอื้อมมาที่จุดเดียวกันก่อน (ใช้ grip กับเป้าเดียวกัน) แล้วเปลี่ยนผู้ถือ ณ at
   ระบบบันทึกระยะกระโดดของของ ณ จุดเปลี่ยนไว้ใน HANDOFFS ให้ check ตรวจ (เกณฑ์ ≤ 1px ที่ 720p) */
function handover(name, at, actor, part, p) {
  const before = { ...val(name, 'attach', at - 1e-3, null) };
  set(name, 'attach', at, { actor, part, at: p });
  HANDOFFS.push({ name, at, kind: 'handover', from: before, to: { actor, part } });
}
const HANDOFFS = [];
/* เป้าจับกลางอากาศที่เลื่อนได้ (ใช้ร่วมระหว่างมือผู้ส่ง ผู้รับ และของ) — ทำตามฉากซ่อมของ truth-v2
   const g=airTarget('repair',x,y); g.move(t0,t1,x,y) แล้ว grip(id,'repair',[0,0],...) */
function airTarget(name, x, y) {
  PROPS[name] = { img: Object.keys(FILM_DATA.props)[0], ax: 0, ay: 0 }; set(name, 'x', 0, x); set(name, 'y', 0, y); set(name, 'alpha', 0, 0);
  return { move(t0, t1, nx, ny, e = 'io') { to(name, 'x', t0, t1, nx, e); to(name, 'y', t0, t1, ny, e); }, at: (t) => ({ x: val(name, 'x', t, x), y: val(name, 'y', t, y) }) };
}

/* เงาสัมผัสใต้ของประกอบฉาก (โต๊ะ เศษชิ้น ของบนพื้น): จางและกว้างขึ้นเมื่อของลอยสูง ทำให้เด็กเห็นว่าของวางอยู่บนพื้น
   feet = จุดในภาพของ [[x,y],...] สำหรับขาโต๊ะ; ไม่ใส่ = ใช้ตำแหน่ง x ของของ */
function propShadow(name, { floorY, rx = 26, ry = 6, alpha = .2, feet } = {}) {
  extras.push({ depth: () => 0, draw: (t) => {
    if (!val(name, 'on', t, true) || val(name, 'attach', t, null)) return;
    const pts = feet ? feet.map((f) => point(propMat(name, t), f)) : [{ x: val(name, 'x', t, 0), y: val(name, 'y', t, floorY) }];
    for (const p of pts) { const h = Math.max(0, floorY - p.y), k = clamp(1 - h / 350, .2, 1); shadow(p.x, floorY + 2, rx + h * .04, ry + h * .015, alpha * k); }
  } });
}

/* ---------- อารมณ์: ให้การหันและการค้างเล่าเรื่อง ---------- */
/* มองซ้ายมองขวา (ลังเล/ดูว่ามีใครเห็นไหม): หันข้างไปฝั่งหนึ่ง ค้าง แล้วกลับมุมเดิม · คืนเวลาจบ */
function lookAround(id, at, { first = 'side', flip = true, hold = .75, back = 'q', backFlip = false } = {}) {
  const t = turn(id, at, first, flip); return turn(id, t + hold, back, backFlip);
}
/* หันหลังให้ ก้มหน้า (ไม่กล้า/คิด) แล้วหันกลับมาตอนตัดสินใจ · decide = เวลาที่เริ่มหันกลับ */
function turnAway(id, at, decide, { down = 9, back = 'q', backFlip = false } = {}) {
  turn(id, at, 'back', false, .16); to(id, 'j:back:head', at + .3, at + .9, down);
  to(id, 'j:back:head', decide - .4, decide, 0); return turn(id, decide, back, backFlip, .14);
}
/* โบกมือ n ครั้ง */
function wave(id, view, arm, t0, { n = 3, sign = 1, period = .44 } = {}) {
  joints(id, view, t0, t0 + .35, { [`arm-${arm}-upper`]: -120 * sign, [`arm-${arm}-lower`]: -30 * sign }, 'out');
  for (let i = 0; i < n; i++) { const a = t0 + .35 + i * period; to(id, `j:${view}:arm-${arm}-lower`, a, a + period / 2, -62 * sign); to(id, `j:${view}:arm-${arm}-lower`, a + period / 2, a + period, -20 * sign); }
  const end = t0 + .35 + n * period; joints(id, view, end, end + .4, { [`arm-${arm}-upper`]: 0, [`arm-${arm}-lower`]: 0 }); return end + .4;
}
/* ฟังเด็กตอบ (จุดหยุดในเว็บ): เอียงหัว ยกมือป้องหู แล้วคืนก่อนพูดต่อ */
function listen(id, view, a, b, arm = 'r') {
  to(id, `j:${view}:head`, a, a + .5, -7); joints(id, view, a, a + .6, { [`arm-${arm}-upper`]: -105, [`arm-${arm}-lower`]: -25 }, 'out');
  to(id, `j:${view}:head`, b - .5, b - .1, 0); joints(id, view, b - .6, b - .1, { [`arm-${arm}-upper`]: 0, [`arm-${arm}-lower`]: 0 });
}

window.FILM_DIRECTING_API = { impact, topple, debris, swapState, spinner, holdProp, releaseProp, handover, airTarget, propShadow, lookAround, turnAway, wave, listen, HANDOFFS };
