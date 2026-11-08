'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import { useSound } from '@/components/sound/SoundProvider';
import type { Text } from '@/i18n/config';
import { GameImage } from '../components/GameImage';
import { DragItem } from '../components/DragItem';
import type { PlayProps } from '../components/GameShell';
import { BEAD_LEVELS, BEAD_TEXT as T, bead, beadHint, type BeadId } from '../data/beadLacing';
import { lacingStart, laceBead, lacingDone } from '../engine/beadLacing';
import { LACING_ART } from '../data/beadLacingArt';

export default function BeadLacingBoard(props: PlayProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  return <LacingRound key={roundIndex} {...props} roundIndex={roundIndex} onNext={() => setRoundIndex(i => i + 1)} />;
}
function LacingRound({ level, roundIndex, paused, onProgress, onFeedback, onComplete, onTap, onNext }: PlayProps & { roundIndex: number; onNext: () => void }) {
  const { pick, pickSub, sub } = useDict();
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
    <div className="bl-island-wrap"><div className="bl-island" style={{ '--bl-line-y': `${LACING_ART.lineY}%` } as CSSProperties}>
      <GameImage className="bl-island-art" src="/games/bead-lacing/island.webp" width={1536} height={1024} alt="" unoptimized draggable={false} preload />
      <svg className="bl-cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={`M ${LACING_ART.left} ${LACING_ART.lineY} H ${LACING_ART.tip}`} stroke="#785020" strokeWidth="1.7"/><path d={`M ${LACING_ART.left} ${LACING_ART.lineY} H ${LACING_ART.tip}`} stroke="#fff5cf" strokeWidth=".8" strokeDasharray="1 .4"/></svg>
      {placed.map((id, i) => {
        const x = LACING_ART.first + i * LACING_ART.step;
        return <span className="bl-laced" key={i} data-new={i >= round.prefilled && i === placed.length - 1 || undefined} style={{ left: `${x}%`, top: `${LACING_ART.lineY}%`, '--bl-travel': `${(LACING_ART.tip - x) / LACING_ART.beadWidth * 100}%` } as CSSProperties}>
          <GameImage src={bead(id as BeadId).src} width={120} height={120} alt={pick(bead(id as BeadId).label)} unoptimized draggable={false} />
        </span>;
      })}
      <button className="bl-tip" style={{ left: `${LACING_ART.tip}%`, top: `${LACING_ART.lineY}%` }} data-drop-id="bead-cord-tip" disabled={paused || done || busy} aria-label={pick(T.tip)} onClick={() => { if (selected) place(selected, 'bead-cord-tip'); else setNotice(T.select); }}>
        <svg viewBox="0 0 80 45" aria-hidden="true"><path d="M9 13 Q3 22 9 31 L62 31 Q79 22 62 13Z" fill="#168ca0" stroke="#16455a" strokeWidth="3"/><rect x="14" y="19" width="18" height="7" rx="3" fill="#fff5cf"/></svg><span>{label(T.tip)}</span>
      </button>
    </div></div>
    <div className="bl-tray" role="group" aria-label={pick(T.tray)}>
      <GameImage className="bl-tray-art" src="/games/bead-lacing/tray.webp" width={1200} height={400} alt="" unoptimized draggable={false} />
      {round.choices.map(id => <div className="bl-tray-cell" key={id} data-rejected={rejected === id || undefined}>
        <DragItem id={id} label={pick(bead(id).label)} selected={selected === id} disabled={paused || done || busy} onSelect={() => { onTap(); setSelected(id); setNotice(bead(id).label); }} onDrop={place}>
          <GameImage src={bead(id).src} width={128} height={128} alt="" unoptimized draggable={false} />
        </DragItem>
        <span className="bl-piece-label">{pick(bead(id).label)}{sub && <small lang="en">{pickSub(bead(id).label)}</small>}</span>
      </div>)}
    </div>
    <div className="bl-guide"><GameImage src="/Character/point.webp" alt="" width={80} height={90} /><p role="status" aria-live="polite">{label(notice)}</p><button className="gc-button" disabled={paused || done || busy} onClick={showHint}>{label(T.hint)}</button></div>
  </div>;
}
