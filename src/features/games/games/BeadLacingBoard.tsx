'use client';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import { useSound } from '@/components/sound/SoundProvider';
import type { Text } from '@/i18n/config';
import { GameImage } from '../components/GameImage';
import { DragItem } from '../components/DragItem';
import type { PlayProps } from '../components/GameShell';
import { BEAD_LEVELS, BEAD_TEXT as T, bead, beadHint, type BeadId } from '../data/beadLacing';
import { lacingStart, laceBead, lacingDone } from '../engine/beadLacing';
import { LACING_ART } from '../data/beadLacingArt';

/* ── เรขาคณิตของเชือก ─────────────────────────────────────────────
   พิกัดเป็น % ของภาพเกาะ (กว้าง/สูงไม่เท่ากัน) มุมเอียงจึงต้องคูณอัตราส่วนภาพก่อน atan2
   ตำแหน่ง t นับตามจุดใน LACING_ART.points (0 = ปมซ้าย, n-1 = ใกล้ปลายเข็ม) */
const RATIO = LACING_ART.height / LACING_ART.width;
type CordPoint = { x: number; y: number };
/* มุมเอียงแบบภาพหน้าเกม: แต่ละจุดบนเชือกมี scale ตามระยะลึก (ใกล้กล้อง = 1) ลูกปัดไกลจึงเล็กลง ภาพที่ไม่มี scale ถือเป็น 1 */
const POINTS = LACING_ART.points as readonly (CordPoint & { scale?: number })[];
function cordAt(t: number): CordPoint {
  const p = POINTS, i = Math.max(0, Math.min(Math.floor(t), p.length - 2)), f = t - i;
  return { x: p[i].x + (p[i + 1].x - p[i].x) * f, y: p[i].y + (p[i + 1].y - p[i].y) * f };
}
function cordScale(t: number) {
  const p = POINTS, i = Math.max(0, Math.min(Math.floor(t), p.length - 2)), f = t - i;
  return (p[i].scale ?? 1) + ((p[i + 1].scale ?? 1) - (p[i].scale ?? 1)) * f;
}
const tilt = (a: CordPoint, b: CordPoint) => Math.atan2((b.y - a.y) * RATIO, b.x - a.x) * 180 / Math.PI;
function cordTilt(t: number) {
  const p = POINTS, i = Math.max(0, Math.min(Math.floor(t), p.length - 2));
  return tilt(p[i], p[i + 1]);
}
/** ระยะตามโค้งเชือก (หน่วย % ความกว้างภาพ) -> ตำแหน่ง t */
function tAtLength(len: number): number {
  const p = POINTS;
  for (let i = 0; i < p.length - 1; i++) {
    const seg = Math.hypot(p[i + 1].x - p[i].x, (p[i + 1].y - p[i].y) * RATIO);
    if (len <= seg) return i + len / seg;
    len -= seg;
  }
  return p.length - 1;
}
/** ลูกปัดจริงไถลไปจนชนปม/ลูกก่อนหน้า: วางชิดกันจากปมซ้าย แต่ละเม็ดกินที่ตามขนาดจริง ณ ระยะลึกนั้น */
function packedSlot(index: number, width: number): number {
  let at = 1.2;
  for (let k = 0; k <= index; k++) {
    const half = width * cordScale(tAtLength(at)) * 0.48;
    if (k === index) return tAtLength(at + half);
    at += half * 2;
  }
  return 0;
}
/** ทางที่ลูกปัดเดินจริง: จากปลายเข็ม ไล่ย้อนตามจุดบนเชือกจนถึงช่องของมัน (ไม่ใช่เส้นตรงแนวนอน) */
function threadPath(slot: number): CordPoint[] {
  const p = LACING_ART.points, path: CordPoint[] = [LACING_ART.tip];
  for (let i = p.length - 1; i > slot; i--) path.push(p[i]);
  path.push(cordAt(slot));
  return path;
}

/** ลูกปัดบนเชือก: ใช้ภาพมุมข้าง (รูขนานเชือก) เอียงตามความชันของเชือก
 *  ลูกที่เพิ่งร้อยไถลจากปลายเข็มตามโค้งเชือกมาชนลูกก่อนหน้า แล้วยุบ-เด้งเล็กน้อยตอนหยุด */
function LacedBead({ id, slot, width, fresh, alt }: { id: BeadId; slot: number; width: number; fresh: boolean; alt: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const at = cordAt(slot), angle = cordTilt(slot);
  useEffect(() => {
    const node = el.current;
    if (!fresh || !node || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const path = threadPath(slot);
    const lengths = path.map((q, i) => i ? Math.hypot(q.x - path[i - 1].x, (q.y - path[i - 1].y) * RATIO) : 0);
    const total = lengths.reduce((a, b) => a + b, 0) || 1;
    let run = 0;
    // มุมเอียงของแต่ละจุดคือความชันของเชือกตรงนั้น (ทิศซ้าย→ขวาเสมอ ลูกปัดไม่พลิกกลับหัว)
    const slide = path.map((q, i) => {
      run += lengths[i];
      const a = path[Math.min(i + 1, path.length - 1)], b = path[Math.max(i - 1, 0)];
      const [left, right] = a.x < b.x ? [a, b] : [b, a];
      return { left: `${q.x}%`, top: `${q.y}%`, rotate: `${tilt(left, right)}deg`, offset: run / total * 0.82 };
    });
    const end = { ...slide[slide.length - 1], rotate: `${angle}deg` };
    const animation = node.animate([
      { ...slide[0], scale: '0.82', opacity: 0.85, easing: 'cubic-bezier(.25,.6,.35,1)' },
      ...slide.slice(1, -1),
      { ...end, scale: '1', opacity: 1 },
      { ...end, offset: 0.9, scale: '1.06 0.94', opacity: 1 },
      { ...end, offset: 1, scale: '1', opacity: 1 },
    ], { duration: 380 + total * 9, fill: 'backwards' });
    return () => animation.cancel();
    // เล่นครั้งเดียวตอนลูกปัดเพิ่งร้อย ไม่เล่นซ้ำเมื่อ render ใหม่
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <span ref={el} className="bl-laced" style={{ left: `${at.x}%`, top: `${at.y}%`, width: `${width * cordScale(slot)}%`, rotate: `${angle}deg` } as CSSProperties}>
    <GameImage src={bead(id).threaded} width={120} height={120} alt={alt} unoptimized draggable={false} />
  </span>;
}

/* ── เชือกเกลียวแบบภาพหน้าเกม (เจ้าของโปรเจกต์ 8 พ.ย. 2026: "ทำรูปเชือกใหม่ให้สมจริงมากขึ้น")
   เชือกฝ้ายสีครีมบิดเกลียว: วาดเป็นเกลียวทีละเส้น (วงรีเฉียง 40° ตามแนวเชือก) บนแกนสีเข้ม + ปมที่ปลายซ้าย + หางเชือกห้อย
   คำนวณครั้งเดียวจากพิกัดภาพ (หน่วย px ของภาพ) */
const ROPE = (() => {
  const W = LACING_ART.width, H = LACING_ART.height, w = LACING_ART.cordPx;
  const toPx = (p: CordPoint) => ({ x: p.x * W / 100, y: p.y * H / 100 });
  const main = POINTS.map(toPx), k = main[0], dir = Math.atan2(main[1].y - k.y, main[1].x - k.x);
  // หางเชือกจากปม ม้วนลงซ้ายบนผิวโต๊ะ (แบบเชือกขดในภาพหน้าเกม)
  const tail = [k, { x: k.x - w * 2.2, y: k.y + w * 1.4 }, { x: k.x - w * 3.6, y: k.y + w * 3.4 }, { x: k.x - w * 3.4, y: k.y + w * 5.6 }];
  const strands = (line: { x: number; y: number }[]) => {
    const out: { x: number; y: number; a: number }[] = [];
    for (let i = 0; i < line.length - 1; i++) {
      const a = line[i], b = line[i + 1], len = Math.hypot(b.x - a.x, b.y - a.y), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      for (let d = 0; d < len; d += w * 0.6) out.push({ x: a.x + (b.x - a.x) * d / len, y: a.y + (b.y - a.y) * d / len, a: ang });
    }
    return out;
  };
  const path = (line: { x: number; y: number }[]) => line.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  return { w, main: path(main), tail: path(tail), strands: [...strands(tail), ...strands(main)], knot: k, dir: dir * 180 / Math.PI };
})();
function Rope({ id }: { id: string }) {
  const { w } = ROPE;
  return <svg className="bl-cord" viewBox={`0 0 ${LACING_ART.width} ${LACING_ART.height}`} aria-hidden="true">
    <defs><radialGradient id={id} cx=".4" cy=".3" r=".8"><stop stopColor="#fffaf0"/><stop offset=".55" stopColor="#efdcb6"/><stop offset="1" stopColor="#c19a68"/></radialGradient></defs>
    {[ROPE.tail, ROPE.main].map((d, i) => <g key={i}>
      <path d={d} fill="none" stroke="#4a2a0c" strokeOpacity=".22" strokeWidth={w * 1.35} strokeLinecap="round" strokeLinejoin="round" transform={`translate(${w * .25} ${w * .65})`}/>
      <path d={d} fill="none" stroke="#a9845a" strokeWidth={w * 1.02} strokeLinecap="round" strokeLinejoin="round"/>
    </g>)}
    {ROPE.strands.map((s, i) => <ellipse key={i} cx={s.x} cy={s.y} rx={w * .58} ry={w * .3} transform={`rotate(${s.a + 40} ${s.x} ${s.y})`}
      fill={`url(#${id})`} stroke="#9c7444" strokeWidth={w * .07}/>)}
    <ellipse cx={ROPE.knot.x} cy={ROPE.knot.y} rx={w * .95} ry={w * .78} transform={`rotate(${ROPE.dir} ${ROPE.knot.x} ${ROPE.knot.y})`} fill={`url(#${id})`} stroke="#8d6638" strokeWidth={w * .1}/>
    <path d={`M${ROPE.knot.x - w * .5} ${ROPE.knot.y - w * .2} q${w * .5} ${w * .6} ${w * 1} 0`} fill="none" stroke="#9c7444" strokeWidth={w * .1} strokeLinecap="round"/>
  </svg>;
}

export default function BeadLacingBoard(props: PlayProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  return <LacingRound key={roundIndex} {...props} roundIndex={roundIndex} onNext={() => setRoundIndex(i => i + 1)} />;
}
function LacingRound({ level, roundIndex, paused, onProgress, onFeedback, onComplete, onTap, onNext }: PlayProps & { roundIndex: number; onNext: () => void }) {
  const { pick, pickSub, sub } = useDict();
  const ropeId = useId().replaceAll(':', '');
  const { speak } = useSound();
  const rounds = BEAD_LEVELS[level - 1];
  const round = rounds[roundIndex];
  const [placed, setPlaced] = useState<readonly string[]>(() => lacingStart(round));
  const current = useRef(placed);
  const [selected, setSelected] = useState<BeadId | null>(null);
  const [hint, setHint] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);
  const [notice, setNotice] = useState<Text>(level === 3 ? T.repeat : T.pattern);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const release = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const root = useRef<HTMLDivElement>(null);
  const next = useRef(onNext);
  useEffect(() => { next.current = onNext; }, [onNext]);
  useEffect(() => () => clearTimeout(release.current), []);
  const done = lacingDone(round, placed);
  // Effects run after disabled/inert have been updated, including a new round.
  useEffect(() => {
    if (paused || busy || done) return;
    root.current?.querySelector<HTMLButtonElement>('[data-item-id]')?.focus({ preventScroll: true });
  }, [paused, busy, done]);
  const total = rounds.reduce((n, r) => n + r.pattern.length - r.prefilled, 0);
  const completed = rounds.slice(0, roundIndex).reduce((n, r) => n + r.pattern.length - r.prefilled, 0) + placed.length - round.prefilled;
  useEffect(() => { onProgress(completed, total); }, [onProgress, completed, total]);
  useEffect(() => {
    if (paused || !done) return;
    const timer = setTimeout(() => { if (roundIndex === 2) onComplete(); else next.current(); }, 1600);
    return () => clearTimeout(timer);
  }, [paused, done, roundIndex, onComplete]);
  useEffect(() => {
    if (paused || level !== 3 || roundIndex !== 0) return;
    const timer = setTimeout(() => speak(pick(T.repeat), 'bead-repeat'), 2100);
    return () => clearTimeout(timer);
  }, [paused, level, roundIndex, speak, pick]);
  const label = (text: Text) => <>{pick(text)}{sub && <small lang="en">{pickSub(text)}</small>}</>;
  function showHint() {
    const id = round.pattern[current.current.length];
    if (!id || paused || locked.current) return;
    const text = beadHint(id);
    setHint(true); setNotice(text); speak(pick(text), `bead-hint-${id}`);
  }
  function place(id: string, target: string) {
    if (paused || locked.current || done) return;
    const value = laceBead(round, current.current, id, target);
    if (value === current.current) {
      const expected = round.pattern[current.current.length];
      const text = beadHint(expected);
      setHint(true); setSelected(null); setRejected(id); setNotice(text);
      onFeedback(false, { text: pick(text), key: `bead-hint-${expected}` });
    } else {
      current.current = value; setPlaced(value); setHint(false); setSelected(null); setRejected(null);
      const text = lacingDone(round, value) ? T.complete : T.praise;
      setNotice(text); onFeedback(true, { text: pick(text), key: lacingDone(round, value) ? 'bead-complete' : 'bead-praise' });
    }
    // One input per landing/return animation, including double taps on repeated beads.
    locked.current = true; setBusy(true);
    release.current = setTimeout(() => {
      locked.current = false; setBusy(false); setRejected(null);
    }, 550);
  }
  /* ── ฉากเดียวแบบภาพหน้าเกม (เจ้าของโปรเจกต์ 8 พ.ย. 2026: "ตัวหนังสือ การ์ด รกไปหมด", "โต๊ะกับเกาะเล็กกว่าถาด")
     แบบที่ต้องร้อย = เงาลูกปัดบนเชือก ณ ตำแหน่งจริง (ไม่มีการ์ดแบบลายไม้) · ลูกปัดให้เลือกอยู่ในถาดที่วาดติดเกาะ
     ชื่อลูกปัดไม่แปะใต้เม็ด: แตะแล้วชื่อขึ้นในข้อความของหุ่น (role=status) และอยู่ใน aria-label ของปุ่ม */
  const beadW = Math.min(LACING_ART.beadMax, LACING_ART.cordLength * 0.92 / round.pattern.length);
  const patternLabel = pick(level === 3 ? T.repeat : T.pattern);
  return <div className="bl-scene" ref={root} data-round={roundIndex + 1} data-level={level} data-placed={placed.length} data-done={done}>
    <ol className="bl-pattern sr-only" aria-label={`${patternLabel} · ${pick(T.round)} ${roundIndex + 1}/3`}>
      {round.pattern.map((id, i) => {
        const hidden = level === 3 && i >= round.prefilled && i >= placed.length;
        return <li key={i} data-current={i === placed.length || undefined} data-hint={hint && i === placed.length || undefined} data-filled={i < placed.length || undefined}>
          {i + 1}: {hidden ? <span className="bl-question">{pick(T.unknown)}</span> : <GameImage src={bead(id).src} width={32} height={32} alt={pick(bead(id).label)} draggable={false} unoptimized />}
        </li>;
      })}
    </ol>
    <div className="bl-island-wrap" style={{ "--bl-aspect": LACING_ART.width / LACING_ART.height } as CSSProperties}><div className="bl-island" style={{ aspectRatio: `${LACING_ART.width}/${LACING_ART.height}` }}>
      <GameImage className="bl-island-art" src={LACING_ART.src} width={LACING_ART.width} height={LACING_ART.height} alt="" unoptimized draggable={false} preload />
      <Rope id={`${ropeId}-rope`} />
      {round.pattern.map((id, i) => {
        if (i < placed.length) return null;
        const t = packedSlot(i, beadW), at = cordAt(t), hidden = level === 3 && i >= round.prefilled;
        // เงาบอกใบ้: ภาพลูกปัดจาง + เส้นประตามรูปทรง (เจ้าของโปรเจกต์: "ภาพลางๆ จางเกินไป ทำเส้นประขอบด้วย")
        return <span key={`g${i}`} className="bl-ghost" aria-hidden="true" data-shape={hidden ? 'unknown' : id.split('-')[1]} data-current={i === placed.length || undefined} data-hint={hint && i === placed.length || undefined}
          style={{ left: `${at.x}%`, top: `${at.y}%`, width: `${beadW * cordScale(t)}%`, rotate: `${cordTilt(t)}deg` } as CSSProperties}>
          {hidden ? <span className="bl-ghost-q">?</span> : <GameImage src={bead(id).threaded} width={120} height={120} alt="" unoptimized draggable={false} />}
          {i === placed.length && <span className="bl-pointer">▼</span>}
        </span>;
      })}
      {placed.map((id, i) => <LacedBead key={i} id={id as BeadId} slot={packedSlot(i, beadW)}
        width={beadW} fresh={i >= round.prefilled && i === placed.length - 1} alt={pick(bead(id as BeadId).label)} />)}
      <button className="bl-tip" style={{ left: `${LACING_ART.tip.x}%`, top: `${LACING_ART.tip.y}%` }} data-drop-id="bead-cord-tip" disabled={paused || done || busy} aria-label={pick(T.tip)} onClick={() => { if (selected) place(selected, 'bead-cord-tip'); else setNotice(T.select); }}>
        <svg viewBox="0 0 100 55" aria-hidden="true"><defs><linearGradient id={`${ropeId}-needle`} x2="0" y2="1"><stop stopColor="#a4ffed"/><stop offset=".4" stopColor="#16cebd"/><stop offset="1" stopColor="#087b88"/></linearGradient></defs><path d="M9 34 Q3 20 18 17 L90 7 Q100 10 92 19 L24 42 Q13 45 9 34Z" fill={`url(#${ropeId}-needle)`} stroke="#087b88" strokeWidth="2"/><path d="M18 26 L35 22 Q41 23 36 28 L20 33 Q14 33 18 26" fill="#fff1c9"/><path d="M43 19 L86 11" stroke="#aefff0" strokeWidth="3" strokeLinecap="round"/></svg>
      </button>
      <div className="bl-tray" role="group" aria-label={pick(T.tray)}>
        {round.choices.map((id, i) => { const slots = LACING_ART.traySlots as readonly (CordPoint & { scale?: number })[], slot = slots[i] ?? slots[slots.length - 1];
          return <div className="bl-tray-cell" key={id} data-rejected={rejected === id || undefined} style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${LACING_ART.traySlotWidth * (slot.scale ?? 1)}%` } as CSSProperties}>
            <DragItem id={id} label={pick(bead(id).label)} selected={selected === id} disabled={paused || done || busy} onSelect={() => { onTap(); setSelected(id); setNotice(bead(id).label); }} onDrop={place}>
              <GameImage src={bead(id).src} width={128} height={128} alt="" unoptimized draggable={false} />
            </DragItem>
          </div>; })}
      </div>
      {/* ขอบหน้าถาด: ภาพเกาะชุดเดียวกันตัดเฉพาะผนังหน้าถาด วางทับลูกปัด ฐานลูกปัดจึงจมอยู่ในถาด (กดทะลุได้) */}
      <div className="bl-tray-front" aria-hidden="true" style={{ clipPath: `polygon(${LACING_ART.trayFront.map(([x, y]) => `${x}% ${y}%`).join(',')})` }}>
        <GameImage src={LACING_ART.src} width={LACING_ART.width} height={LACING_ART.height} alt="" unoptimized draggable={false} />
      </div>
    </div></div>
    <div className="bl-guide"><GameImage src="/Character/point.webp" alt="" width={80} height={90} /><p role="status" aria-live="polite">{label(notice)}</p>
      <button className="bl-hint" disabled={paused || done || busy} onClick={showHint}>{label(T.hint)}</button></div>
  </div>;
}
