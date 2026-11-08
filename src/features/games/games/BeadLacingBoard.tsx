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
function cordAt(t: number): CordPoint {
  const p = LACING_ART.points, i = Math.max(0, Math.min(Math.floor(t), p.length - 2)), f = t - i;
  return { x: p[i].x + (p[i + 1].x - p[i].x) * f, y: p[i].y + (p[i + 1].y - p[i].y) * f };
}
const tilt = (a: CordPoint, b: CordPoint) => Math.atan2((b.y - a.y) * RATIO, b.x - a.x) * 180 / Math.PI;
function cordTilt(t: number) {
  const p = LACING_ART.points, i = Math.max(0, Math.min(Math.floor(t), p.length - 2));
  return tilt(p[i], p[i + 1]);
}
/** ลูกปัดจริงไถลไปจนชนปม/ลูกก่อนหน้า: วางลูกที่ i ชิดกันจากปมซ้าย ตามความยาวโค้งเชือก (หน่วย % ความกว้างภาพ) */
function packedSlot(index: number, width: number): number {
  const p = LACING_ART.points;
  let want = width * (index + 0.5) * 0.96 + 1.2;
  for (let i = 0; i < p.length - 1; i++) {
    const seg = Math.hypot(p[i + 1].x - p[i].x, (p[i + 1].y - p[i].y) * RATIO);
    if (want <= seg) return i + want / seg;
    want -= seg;
  }
  return p.length - 1;
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
  return <span ref={el} className="bl-laced" style={{ left: `${at.x}%`, top: `${at.y}%`, width: `${width}%`, rotate: `${angle}deg` } as CSSProperties}>
    <GameImage src={bead(id).threaded} width={120} height={120} alt={alt} unoptimized draggable={false} />
  </span>;
}

export default function BeadLacingBoard(props: PlayProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  return <LacingRound key={roundIndex} {...props} roundIndex={roundIndex} onNext={() => setRoundIndex(i => i + 1)} />;
}
function LacingRound({ level, roundIndex, paused, onProgress, onFeedback, onComplete, onTap, onNext }: PlayProps & { roundIndex: number; onNext: () => void }) {
  const { pick, pickSub, sub } = useDict();
  const ropeId = useId().replaceAll(':', '');
  const cord = LACING_ART.cordPath;
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
  return <div className="bl-scene" ref={root} data-round={roundIndex + 1} data-level={level} data-placed={placed.length} data-done={done}>
    <div className="bl-pattern-card">
      <div className="bl-pattern-heading"><strong>{label(level === 3 ? T.repeat : T.pattern)}</strong><span>{pick(T.round)} {roundIndex + 1}/3</span></div>
      <ol className="bl-pattern" aria-label={pick(level === 3 ? T.repeat : T.pattern)}>
        {round.pattern.map((id, i) => {
          const hidden = level === 3 && i >= round.prefilled && i >= placed.length;
          return <li key={i} data-current={i === placed.length || undefined} data-hint={hint && i === placed.length || undefined} data-filled={i < placed.length || undefined}>
            <span className="sr-only">{i + 1}: </span>
            {hidden ? <span className="bl-question" aria-label={pick(T.unknown)}>?</span> : <GameImage src={bead(id).src} width={96} height={96} alt={pick(bead(id).label)} draggable={false} unoptimized />}
            {i === placed.length && <span className="bl-pointer" aria-hidden="true">↓</span>}
            {i < placed.length && <span className="bl-check" aria-hidden="true">✓</span>}
          </li>;
        })}
      </ol>
    </div>
    <div className="bl-island-wrap"><div className="bl-island" style={{ aspectRatio: `${LACING_ART.width}/${LACING_ART.height}` }}>
      <GameImage className="bl-island-art" src="/games/bead-lacing/island.webp" width={LACING_ART.width} height={LACING_ART.height} alt="" unoptimized draggable={false} preload />
      <svg className="bl-cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id={ropeId}><stop stopColor="#9c7447"/><stop offset=".32" stopColor="#fff6d9"/><stop offset=".6" stopColor="#e8c995"/><stop offset="1" stopColor="#9c7447"/></linearGradient></defs>
        <path d={cord} fill="none" stroke="#704315" strokeOpacity=".3" strokeWidth="2.1" transform="translate(0 .6)"/>
        <path d={cord} fill="none" stroke={`url(#${ropeId})`} strokeWidth="1.6" strokeLinecap="round"/>
        <path d={cord} fill="none" stroke="#fff6dd" strokeWidth=".7"/>
        {LACING_ART.twists.map((d,i)=><path key={i} d={d} fill="none" stroke="#b69567" strokeWidth=".18"/>)}
      </svg>
      {placed.map((id, i) => <LacedBead key={i} id={id as BeadId} slot={packedSlot(i, Math.min(13, 52 / round.pattern.length))}
        width={Math.min(13, 52 / round.pattern.length)} fresh={i >= round.prefilled && i === placed.length - 1} alt={pick(bead(id as BeadId).label)} />)}
      <button className="bl-tip" style={{ left: `${LACING_ART.tip.x}%`, top: `${LACING_ART.tip.y}%` }} data-drop-id="bead-cord-tip" disabled={paused || done || busy} aria-label={pick(T.tip)} onClick={() => { if (selected) place(selected, 'bead-cord-tip'); else setNotice(T.select); }}>
        <svg viewBox="0 0 100 55" aria-hidden="true"><defs><linearGradient id={`${ropeId}-needle`} x2="0" y2="1"><stop stopColor="#a4ffed"/><stop offset=".4" stopColor="#16cebd"/><stop offset="1" stopColor="#087b88"/></linearGradient></defs><path d="M9 34 Q3 20 18 17 L90 7 Q100 10 92 19 L24 42 Q13 45 9 34Z" fill={`url(#${ropeId}-needle)`} stroke="#087b88" strokeWidth="2"/><path d="M18 26 L35 22 Q41 23 36 28 L20 33 Q14 33 18 26" fill="#fff1c9"/><path d="M43 19 L86 11" stroke="#aefff0" strokeWidth="3" strokeLinecap="round"/></svg><span>{label(T.tip)}</span>
      </button>
    </div>
    <div className="bl-tray" role="group" aria-label={pick(T.tray)}>
      <GameImage className="bl-tray-art" src="/games/bead-lacing/tray.webp" width={1200} height={400} alt="" unoptimized draggable={false} />
      {round.choices.map(id => <div className="bl-tray-cell" key={id} data-rejected={rejected === id || undefined}>
        <DragItem id={id} label={pick(bead(id).label)} selected={selected === id} disabled={paused || done || busy} onSelect={() => { onTap(); setSelected(id); setNotice(bead(id).label); }} onDrop={place}>
          <GameImage src={bead(id).src} width={128} height={128} alt="" unoptimized draggable={false} />
        </DragItem>
        <span className="bl-piece-label">{pick(bead(id).label).replace("สี", "").replace(" รูป", "\n")}{sub && <small lang="en">{pickSub(bead(id).label)?.replace('Turquoise', 'Teal')}</small>}</span>
      </div>)}
    </div>
    </div>
    <div className="bl-guide"><GameImage src="/Character/point.webp" alt="" width={80} height={90} /><p role="status" aria-live="polite">{label(notice)}</p><button className="gc-button" disabled={paused || done || busy} onClick={showHint}>{label(T.hint)}</button></div>
  </div>;
}
