const { timing, kits, envelopes } = FILM_DATA;
const W = 1920, H = 1080;
const canvas = document.querySelector('canvas'); canvas.width = W; canvas.height = H;
const ctx = canvas.getContext('2d'), images = {}, bboxes = {};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), mix = (a, b, k) => a + (b - a) * k;
const rad = (d) => d * Math.PI / 180, deg = (r) => r * 180 / Math.PI;
const EASE = {
  lin: (x) => x, io: (x) => x * x * x * (10 + x * (-15 + 6 * x)), in: (x) => x * x * x, out: (x) => 1 - (1 - x) ** 3,
  back: (x) => { const c = 1.6; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; },
  bounce: (x) => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + .75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + .9375; return n * (x -= 2.625 / d) * x + .984375; },
};
const phase = (t, a, b, e = 'io') => EASE[e](clamp((t - a) / (b - a)));
const point = (m, p) => ({ x: m.a * p[0] + m.c * p[1] + m.e, y: m.b * p[0] + m.d * p[1] + m.f });
const around = (m, p, d) => m.translate(p[0], p[1]).rotate(d).translate(-p[0], -p[1]);
const wrap = (d) => ((d + 180) % 360 + 360) % 360 - 180;

/* ---------- keyframe tracks ---------- */
const tracks = new Map();
function key(id, prop, t, v, e = 'io') { const k = id + '.' + prop; let a = tracks.get(k); if (!a) tracks.set(k, a = []); a.push({ t, v, e }); a.sort((p, q) => p.t - q.t); }
function val(id, prop, t, def) {
  const a = tracks.get(id + '.' + prop); if (!a) return def;
  let i = -1; for (let k = 0; k < a.length && a[k].t <= t; k++) i = k;
  if (i < 0) return def !== undefined ? def : a[0].v; const p = a[i], q = a[i + 1];
  if (!q || q.e === 'step' || typeof p.v !== 'number' || typeof q.v !== 'number') return p.v;
  return mix(p.v, q.v, EASE[q.e]((t - p.t) / (q.t - p.t)));
}
/* ค้างค่าปัจจุบันถึง t0 แล้วเคลื่อนไปค่าใหม่ที่ t1 */
const neutral = (id, prop) => prop.startsWith('j:') || ['lean', 'hop', 'rot'].includes(prop) ? 0 : ['sq', 'sy', 'alpha', 's', 'sx'].includes(prop) ? 1 : prop === 'alt' ? (CAST[id]?.hover?.alt ?? 0) : undefined;
function to(id, prop, t0, t1, v, e = 'io') { key(id, prop, t0, val(id, prop, t0, neutral(id, prop) ?? v)); key(id, prop, t1, v, e); }
const set = (id, prop, t, v) => key(id, prop, t, v, 'step');
const T = (k) => timing.audio.find((a) => a.key === k).start;
const TE = (k) => { const a = timing.audio.find((x) => x.key === k); return a.start + a.duration; };
const S = (id) => timing.shots.find((s) => s.id === id).start;

/* เสียงประกอบ: film.js บันทึกจุดเวลา แล้ว render.mjs เขียนออกเป็น sfx.json ให้ mix.mjs (ภาพไม่มีเสียง — AGENTS 3.1) */
const SFX = []; window.SFX = SFX;
const fx = (name, t, gain = 1, dur = null) => SFX.push({ name, t: +t.toFixed(3), gain, dur: dur && +dur.toFixed(3) });

/* ---------- actors ---------- */
const CAST = {}; // id -> { scale, shadow, viewScale:{view:mult}, wheels:{view:{part:radius}}, hover }
const iks = [];
function speech(id, t) {
  const a = timing.audio.find((a) => (a.who === id || (a.who === 'all' && CAST[id]?.group)) && t >= a.start && t < a.start + a.duration); if (!a) return null;
  const env = envelopes[a.key], i = (t - a.start) * 24, f = Math.floor(i), e = ((env[f - 1] || 0) + 2 * (env[f] || 0) + (env[f + 1] || 0)) / 4;
  return { a, raw: env[f] || 0, e, g: Math.min(phase(t, a.start, a.start + .35), 1 - phase(t, a.start + a.duration - .35, a.start + a.duration)) };
}
function matFor(rig, name, angles, base, cache) { if (cache[name]) return cache[name]; const p = rig.parts[name]; return cache[name] = around(p.parent ? matFor(rig, p.parent, angles, base, cache) : base, p.pivot, angles[name] || 0); }
function solve(rig, base, chain, grip, target, handAbs, elbow) {
  const p = rig.parts, Sh = p[chain[0]].pivot, El = p[chain[1]].pivot, Wr = p[chain[2]].pivot, local = point(base.inverse(), [target.x, target.y]), a = rad(handAbs);
  const off = { x: Math.cos(a) * (grip[0] - Wr[0]) - Math.sin(a) * (grip[1] - Wr[1]), y: Math.sin(a) * (grip[0] - Wr[0]) + Math.cos(a) * (grip[1] - Wr[1]) };
  const dx = local.x - off.x - Sh[0], dy = local.y - off.y - Sh[1], L1 = Math.hypot(El[0] - Sh[0], El[1] - Sh[1]), L2 = Math.hypot(Wr[0] - El[0], Wr[1] - El[1]);
  const d = clamp(Math.hypot(dx, dy), Math.abs(L1 - L2) + .1, L1 + L2 - .1), aim = Math.atan2(dy, dx), bend = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), upper = aim - elbow * bend;
  const ex = Sh[0] + L1 * Math.cos(upper), ey = Sh[1] + L1 * Math.sin(upper), lower = Math.atan2(Sh[1] + d * Math.sin(aim) - ey, Sh[0] + d * Math.cos(aim) - ex);
  const u = deg(upper - Math.atan2(El[1] - Sh[1], El[0] - Sh[0])), l = deg(lower - Math.atan2(Wr[1] - El[1], Wr[0] - El[0])) - u;
  return { [chain[0]]: u, [chain[1]]: l, [chain[2]]: handAbs - u - l };
}
const poseCache = new Map();
function pose(id, t) {
  const ck = id + '@' + t; if (poseCache.has(ck)) return poseCache.get(ck);
  const c = CAST[id], view = val(id, 'view', t, 'front'), rig = kits[id][view]; if (!rig) throw Error(`no kit ${id}/${view}`);
  const s = val(id, 's', t, 1) * c.scale * (rig.scaleToFront || 1) * (c.viewScale?.[view] || 1), flip = !!val(id, 'flip', t, false);
  let x = val(id, 'x', t, 0), y = val(id, 'y', t, 0), lean = val(id, 'lean', t, 0);
  const sq = val(id, 'sq', t, 1), sy = val(id, 'sy', t, 1);
  const bob = c.hover ? Math.sin(t * 1.9 + c.hover.phase) * c.hover.amp : 0;
  let alt = val(id, 'alt', t, c.hover ? c.hover.alt : 0) + bob;
  // Contact choreography: move the body into reachable space before the hand closes.
  // This is a staged body path, not a rigid-body simulation. Ground remains fixed for hoverers.
  const bodyGrips=iks.filter(k=>k.id===id&&k.view===view&&k.follow&&t>=k.t0-k.tin&&t<=k.t1+k.tout);
  if(bodyGrips.length>1){
    let total=0,weight=0,tx=0,ty=0;
    for(const k of bodyGrips){
      const w=Math.min(phase(t,k.t0-k.tin,k.t0),1-phase(t,k.t1,k.t1+k.tout)),q=k.target(t);
      tx+=(q.x-k.follow.x*(flip?-1:1))*w;ty+=(q.y+k.follow.y)*w;total+=w;weight=Math.max(weight,w);
    }
    if(total){x=mix(x,tx/total,weight);lean=mix(lean,0,weight);if(c.hover)alt=mix(alt,y-ty/total,weight);else y=mix(y,ty/total,weight);}
  }else{
  for (const k of iks) {
    if(k.id!==id||k.view!==view||!k.follow||t<k.t0-k.tin||t>k.t1+k.tout)continue;
    const w=Math.min(phase(t,k.t0-k.tin,k.t0),1-phase(t,k.t1,k.t1+k.tout));
    const q=k.target(t), dx=k.follow.x*(flip?-1:1);
    x=mix(x,q.x-dx,w);lean=mix(lean,0,w);
    if(c.hover)alt=mix(alt,y-(q.y+k.follow.y),w);else y=mix(y,q.y+k.follow.y,w);
  }
  }
  const root = Object.keys(rig.parts).find((n) => !rig.parts[n].parent), ax = rig.anchorX ?? rig.parts[root].pivot[0];
  const base = new DOMMatrix().translate(x, y - alt - val(id, 'hop', t, 0)).rotate(lean).scale((flip ? -1 : 1) * s * sq, s * sy).translate(-ax, -rig.ground);
  const angles = {}, sp = speech(id, t);
  for (const n of Object.keys(rig.parts)) angles[n] = (rig.restPose?.[n] || 0) + val(id, `j:${view}:${n}`, t, 0);
  if (sp && rig.parts.head) angles.head += (sp.e - .25) * -2.4 * sp.g;
  for (const k of iks) {
    if (k.id !== id || k.view !== view || t < k.t0 - k.tin || t > k.t1 + k.tout) continue;
    const w = Math.min(phase(t, k.t0 - k.tin, k.t0), 1 - phase(t, k.t1, k.t1 + k.tout)), tg = typeof k.target === 'function' ? k.target(t) : k.target;
    const sol = solve(rig, base, k.chain, k.grip, tg, k.hand ?? 0, k.elbow ?? 1);
    for (const n of k.chain) angles[n] = angles[n] + wrap(sol[n] - angles[n]) * w;
  }
  const mats = {}; for (const n of Object.keys(rig.parts)) matFor(rig, n, angles, base, mats);
  const out = { id, view, rig, base, mats, x, y, s, flip, alt, sp, dir: `assets/kits/${id}-${view}/` };
  poseCache.set(ck, out); return out;
}
function bbox(src) { // กรอบ alpha จริงของชิ้นสีหน้า (บางชุดใช้ภาพเต็มหน้าจอเป็นชั้นซ้อน)
  if (bboxes[src]) return bboxes[src]; const im = images[src], c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
  const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return bboxes[src] = { cx: (x0 + x1) / 2 / c.width, cy: (y0 + y1) / 2 / c.height };
}
function drawImg(src, p, m, alpha = 1) { const im = images[src]; if (!im) throw Error('missing ' + src); ctx.save(); ctx.setTransform(camM.multiply(m)); ctx.globalAlpha = alpha; ctx.drawImage(im, p.x, p.y, p.w, p.h); ctx.restore(); }
function face(P, m, t) {
  const F = P.rig.faces; if (!F || !Object.keys(F).length) return;
  const c = CAST[P.id], blink = (t + c.blink) % c.blinkEvery < .13;
  let eyes = 'eyes-' + val(P.id, 'eyes', t, 'happy'); if (blink && eyes !== 'eyes-happy' && F['eyes-blink']) eyes = 'eyes-blink'; if (!F[eyes]) eyes = F['eyes-happy'] ? 'eyes-happy' : Object.keys(F).find((k) => k.startsWith('eyes'));
  let mouth = val(P.id, 'mouth', t, 'smile'), flipY = false, flat = false;
  if (P.sp) mouth = P.sp.e > .46 ? 'wide' : P.sp.e > .2 ? 'open' : P.sp.e > .07 ? 'small' : mouth === 'frown' ? 'flat' : mouth;
  if (mouth === 'frown') { mouth = 'smile'; flipY = true; } if (mouth === 'flat') { mouth = 'smile'; flat = true; }
  let mk = 'mouth-' + mouth; if (!F[mk]) mk = F['mouth-small'] ? 'mouth-small' : 'mouth-smile';
  if (eyes) drawImg(P.dir + F[eyes].file, F[eyes], m);
  const p = F[mk]; if (!p) return; let mm = m;
  if (flipY || flat) { const b = bbox(P.dir + p.file), cx = p.x + p.w * b.cx, cy = p.y + p.h * b.cy; mm = m.translate(cx, cy).scale(1, flipY ? -1 : .3).translate(-cx, -cy); }
  drawImg(P.dir + p.file, p, mm);
}
const scratch = {};
const supportContours = {};
function supportContour(src,p) {
  if(supportContours[src])return supportContours[src];
  const im=images[src],c=document.createElement('canvas');c.width=im.width;c.height=im.height;
  const g=c.getContext('2d');g.drawImage(im,0,0);const data=g.getImageData(0,0,c.width,c.height).data,points=[];
  // Measure the actual opaque rubber silhouette, excluding transparent sprite padding.
  for(let x=0;x<c.width;x+=2){for(let y=c.height-1;y>=0;y--)if(data[(y*c.width+x)*4+3]>180){points.push([p.x+x/c.width*p.w,p.y+y/c.height*p.h]);break;}}
  return supportContours[src]=points;
}
function groundContacts(P) {
  const contacts=[];
  for(const [name,p] of Object.entries(P.rig.parts)){
    if(!/^(wheel|tread)-/.test(name))continue;
    const points=supportContour(P.dir+p.file,p).map(q=>point(P.mats[name],q));if(!points.length)continue;
    const bottom=Math.max(...points.map(q=>q.y)),lowest=points.filter(q=>q.y>=bottom-2*P.s);
    const left=Math.min(...points.map(q=>q.x)),right=Math.max(...points.map(q=>q.x));
    contacts.push({name,x:lowest.reduce((s,q)=>s+q.x,0)/lowest.length,y:bottom,rx:(right-left)*(name.startsWith('tread')?.35:.35),ry:name.startsWith('tread')?8:6});
  }
  return contacts;
}
function contactShadow(P,alpha){
  ctx.save();ctx.setTransform(camM);
  for(const c of groundContacts(P)){
    // Tight dark contact touches the bottom pixels; a soft penumbra anchors each support.
    for(const [scale,opacity]of [[1.7,.18],[1,.40]]){
      ctx.save();ctx.translate(c.x,c.y+1);ctx.scale(c.rx*scale,c.ry*scale);
      const g=ctx.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,`rgba(28,37,40,${opacity*alpha})`);g.addColorStop(.55,`rgba(28,37,40,${opacity*.55*alpha})`);g.addColorStop(1,'rgba(28,37,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,7);ctx.fill();ctx.restore();
    }
  }
  ctx.restore();
}
function drawActor(id, t, only) {
  const P = pose(id, t), { rig } = P, alpha = val(id, 'alpha', t, 1); if (alpha <= 0) return P;
  const c = CAST[id];
  if (!only) {
    const sa=alpha*val(id,'shadowA',t,1); // shadowA: จางเงาต่อเวลา (เช่นตอนนอนบนเตียง) ค่าเริ่ม 1 ไม่เปลี่ยนภาพเรื่องเดิม
    if(sa<=0){}else if(c.shadowMode==='contact')contactShadow(P,sa);
    else {const k = clamp(1 - P.alt / 420, .35, 1); ctx.save(); ctx.setTransform(camM); ctx.fillStyle = `rgba(30,50,60,${.2 * k * sa})`; ctx.beginPath(); ctx.ellipse(P.x, P.y + 3, c.shadow * P.s * (1.25 - .25 * k), c.shadow * P.s * .13, 0, 0, 7); ctx.fill(); ctx.restore();}
  }
  const spin = c.wheels?.[P.view] || {};
  function visit(name) {
    const p = rig.parts[name], m = P.mats[name], items = [{ self: true, z: p.z }, ...Object.entries(rig.parts).filter(([, v]) => v.parent === name).map(([k, v]) => ({ k, z: v.z }))].sort((a, b) => a.z - b.z);
    for (const it of items) {
      if (!it.self) { visit(it.k); continue; }
      if (only && !only.includes(name)) continue;
      const mm = spin[name] ? around(m, p.pivot, deg((P.x * (P.flip ? -1 : 1)) / (spin[name] * P.s))) : m;
      if (p.w > 1) drawImg(P.dir + p.file, p, mm, alpha);
      if (name === 'screen') face(P, m, t);
      for (const tr of Object.values(rig.treads || {}).filter((v) => v.parent === name)) {
        const tmp = scratch[id + tr.mask] ??= document.createElement('canvas'); tmp.width = tr.w; tmp.height = tr.h; const tc = tmp.getContext('2d'), pat = tc.createPattern(images[P.dir + tr.tile], 'repeat');
        pat.setTransform(new DOMMatrix().translate(-P.x / P.s, 0)); tc.fillStyle = pat; tc.fillRect(0, 0, tr.w, tr.h); tc.globalCompositeOperation = 'destination-in'; tc.drawImage(images[P.dir + tr.mask], 0, 0, tr.w, tr.h);
        ctx.save(); ctx.setTransform(camM.multiply(m)); ctx.globalAlpha = alpha; ctx.drawImage(tmp, tr.x, tr.y); ctx.restore();
      }
    }
  }
  visit(Object.keys(rig.parts).find((n) => !rig.parts[n].parent)); return P;
}

/* ---------- props ---------- */
const PROPS = {}; // name -> { ax, ay }  (จุดยึดในพิกเซลของภาพ)
function propMat(name, t) {
  const d = PROPS[name], at = val(name, 'attach', t, null), s = val(name, 's', t, 1), rot = val(name, 'rot', t, 0), sx = val(name, 'sx', t, 1);
  let m;
  if (at?.prop) m = propMat(at.prop, t).translate(at.at[0], at.at[1]);
  else if (at?.actor) { const P = pose(at.actor, t), q = point(P.mats[at.part], at.at); m = new DOMMatrix().translate(q.x, q.y); if (at.follow) { const pm = P.mats[at.part]; m = m.rotate(deg(Math.atan2(pm.b, pm.a * (P.flip ? -1 : 1)))); } }
  else m = new DOMMatrix().translate(val(name, 'x', t, 0), val(name, 'y', t, 0) - val(name, 'hop', t, 0)); // hop: ยกพร็อพตามโค้งกระโดดของผู้ถือ (ค่าเริ่ม 0)
  return m.rotate(rot).scale(s * sx, s).translate(-d.ax, -d.ay);
}
function drawProp(name, t) { const a = val(name, 'alpha', t, 1); if (a <= 0) return; const src = FILM_DATA.props[val(name, 'img', t, PROPS[name].img)], im = images[src]; ctx.save(); ctx.setTransform(camM.multiply(propMat(name, t))); ctx.globalAlpha = a; ctx.drawImage(im, 0, 0); ctx.restore(); }
const propWorld = (name, t, p) => point(propMat(name, t), p ?? [PROPS[name].ax, PROPS[name].ay]);

/* ---------- camera + frame ---------- */
let camM = new DOMMatrix();
const extras = []; // ฟังก์ชันวาดเพิ่มเติมของเรื่อง: {depth:(t)=>y, draw:(t)=>void}
function render(t) {
  t = clamp(t, 0, timing.total); poseCache.clear();
  const z = val('cam', 'z', t, 1), vw = W / z, vh = H / z, cx = clamp(val('cam', 'x', t, W / 2), vw / 2, W - vw / 2), cy = clamp(val('cam', 'y', t, H / 2), vh / 2, H - vh / 2);
  camM = new DOMMatrix([z, 0, 0, z, W / 2 - cx * z, H / 2 - cy * z]);
  ctx.setTransform(camM); ctx.drawImage(images['assets/park.jpg'], 0, 0, W, H);
  const list = [];
  for (const id of Object.keys(CAST)) if (val(id, 'on', t, true)) list.push({ d: val(id, 'y', t, 0) + val(id, 'depth', t, 0), draw: () => { drawActor(id, t); for (const n of held(id, t, false)) drawProp(n, t); const fr = val(id, 'front', t, null); if (fr) drawActor(id, t, fr); } , id });
  for (const n of Object.keys(PROPS)) { if (!val(n, 'on', t, true)) continue; const at = val(n, 'attach', t, null); if (at) continue; list.push({ d: val(n, 'depth', t, val(n, 'y', t, 0)), draw: () => { for (const c of children(n, t, true)) drawProp(c, t); drawProp(n, t); for (const c of children(n, t, false)) drawProp(c, t); } }); }
  for (const e of extras) list.push({ d: e.depth(t), draw: () => e.draw(t) });
  list.sort((a, b) => a.d - b.d).forEach((o) => o.draw());
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  window.frameState = { t, shot: timing.shots.findLast((s) => t >= s.start)?.id };
}
// ของที่ผูกกับตัวละคร/ของชิ้นอื่น วาดต่อจากตัวแม่ (behind:true = วาดก่อนตัวแม่)
function children(parent, t, behind) { const out = []; for (const n of Object.keys(PROPS)) { if (!val(n, 'on', t, true)) continue; const at = val(n, 'attach', t, null); if (at?.prop === parent && !!at.behind === behind) out.push(n, ...children(n, t, false)); } return out; }
function held(id, t) { const out = []; for (const n of Object.keys(PROPS)) { if (!val(n, 'on', t, true)) continue; const at = val(n, 'attach', t, null); if (at?.actor === id) out.push(n, ...children(n, t, false)); } return out; }
window.renderAt = render;
function loadAll() {
  const paths = new Set(['assets/park.jpg', ...Object.values(FILM_DATA.props)]);
  for (const [id, views] of Object.entries(kits)) for (const [view, k] of Object.entries(views)) {
    const dir = `assets/kits/${id}-${view}/`;
    for (const p of [...Object.values(k.parts), ...Object.values(k.faces || {})]) if (p.file && p.w > 1) paths.add(dir + p.file);
    for (const tr of Object.values(k.treads || {})) { paths.add(dir + tr.tile); paths.add(dir + tr.mask); }
  }
  return Promise.all([...paths].map((src) => new Promise((ok, no) => { const im = new Image(); im.onload = () => { images[src] = im; ok(); }; im.onerror = () => no(Error('load ' + src)); im.src = src; })));
}

window.FILM_ENGINE={to,set,T,TE,S,fx,propWorld,loadAll};
