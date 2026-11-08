'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useDict, useLocale } from '@/i18n/LocaleProvider';
import { useSound } from '@/components/sound/SoundProvider';
import { fmt } from '@/i18n/dict';
import { playNarration } from '@/lib/speech';
import type { Text } from '@/i18n/config';
import { DragItem } from '../components/DragItem';
import type { PlayProps } from '../components/GameShell';
import { useGameAudio } from '../audio/useGameAudio';
import { blockKinds, buildText as text, BUILD_ROUNDS, type BlockShape } from '../data/blockBuilders';
import { BUILD_ART } from '../data/blockBuildersArt';
import { nextBuildPlan, placeBlock, buildComplete } from '../engine/blockBuilders';

function Art({ name, className = '' }: { name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return failed ? null : <Image className={className} data-ready={loaded} src={`/games/block-builders/${name}.webp`} alt="" width={1000} height={1000} unoptimized draggable={false} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />;
}
function Block({ shape, paired = false }: { shape: BlockShape; paired?: boolean }) {
  return <span className={`bb-block bb-${shape}${paired ? ' bb-paired' : ''}`} aria-hidden="true"><span className="bb-fallback" /><Art name={shape} />{paired && <Art name={shape} />}</span>;
}
export default function BlockBuildersBoard({ level, paused, onProgress, onComplete, onTap }: PlayProps) {
  const { pick, pickSub, sub } = useDict(), locale = useLocale();
  const { enabled } = useSound(), { effect } = useGameAudio(paused);
  const [plan, setPlan] = useState(() => nextBuildPlan(level, '', 0));
  const [round, setRound] = useState(0), [placed, setPlaced] = useState<string[]>([]);
  const [selected, setSelected] = useState<BlockShape | null>(null);
  const [notice, setNotice] = useState<keyof typeof text>('drag');
  const [voice, setVoice] = useState({ key: '', sequence: 0 });
  const [rejected, setRejected] = useState({ shape: '', sequence: 0 });
  const placedRef = useRef<string[]>([]), initialized = useRef(false), scene = useRef<HTMLDivElement>(null);
  const complete = buildComplete(plan, placed), disabled = paused || complete;
  const focusTray = useCallback(() => requestAnimationFrame(() => scene.current?.querySelector<HTMLButtonElement>('[data-item-id]:not(:disabled)')?.focus({ preventScroll: true })), []);
  const say = (key: string) => setVoice(v => ({ key, sequence: v.sequence + 1 }));
  const label = (value: Text, n = 0) => fmt(pick(value), { n });
  const secondary = (value: Text, n = 0) => sub && <small lang="en">{fmt(pickSub(value)!, { n })}</small>;
  const shapes = [...new Set(plan.slots.map(s => s.shape))];
  const columns = Math.max(...plan.slots.map(s => s.x + s.w));
  useEffect(() => {
    if (initialized.current) return; initialized.current = true;
    let previous = ''; try { previous = sessionStorage.getItem('block-builders:last') ?? ''; } catch {}
    const next = nextBuildPlan(level, previous);
    try { sessionStorage.setItem('block-builders:last', next.id); } catch {}
    queueMicrotask(() => setPlan(next));
  }, [level]);
  useEffect(() => { onProgress(round, BUILD_ROUNDS); }, [round, onProgress]);
  useEffect(() => {
    if (paused || !enabled || locale !== 'th' || !voice.key) return;
    return playNarration(`/audio/th/${voice.key}.mp3`, { onEnded: () => {}, onStopped: () => {}, onFail: () => {} });
  }, [voice, paused, enabled, locale]);
  useEffect(() => {
    if (paused) return;
    focusTray();
    const timer = window.setTimeout(() => {
      if (!buildComplete(plan, placedRef.current)) setVoice(v => ({ key: 'game-block-builders', sequence: v.sequence + 1 }));
    }, round === 0 ? 1900 : 100);
    return () => clearTimeout(timer);
  }, [paused, plan, round, focusTray]);
  const changePlan = useCallback((nextRound: number) => {
    const next = nextBuildPlan(level, plan.id);
    try { sessionStorage.setItem('block-builders:last', next.id); } catch {}
    placedRef.current = []; setPlaced([]); setSelected(null); setNotice('drag'); setRound(nextRound); setPlan(next); focusTray();
  }, [level, plan.id, focusTray]);
  useEffect(() => {
    if (!complete || paused) return;
    const timer = window.setTimeout(() => {
      if (round + 1 === BUILD_ROUNDS) { onProgress(BUILD_ROUNDS, BUILD_ROUNDS); onComplete(); }
      else changePlan(round + 1);
    }, enabled ? 3000 : 1500);
    return () => clearTimeout(timer);
  }, [complete, paused, round, enabled, onProgress, onComplete, changePlan]);
  const place = (id: string, target: string) => {
    if (disabled || buildComplete(plan, placedRef.current) || !(id in blockKinds)) return;
    const shape = id as BlockShape;
    const result = placeBlock(plan, placedRef.current, { shape, color: blockKinds[shape].color }, target);
    if (result.reason !== 'ok') {
      setNotice(result.reason); setRejected(r => ({ shape, sequence: r.sequence + 1 })); effect('incorrect'); say(`build-${result.reason}`); return;
    }
    placedRef.current = result.placed; setPlaced(result.placed); setSelected(null); onTap();
    if (buildComplete(plan, result.placed)) { setNotice('praise'); effect('correct'); say('build-praise'); }
    else { setNotice('drag'); focusTray(); }
  };
  return <div ref={scene} className="bb-scene" data-plan={plan.id} data-round={round + 1} data-phase={complete ? 'success' : 'ready'} data-placed={placed.length} data-notice={notice}>
    <div className="bb-goal"><div><p>{label(text.round, round + 1)}{secondary(text.round, round + 1)}</p><h2>{label(plan.title)}{secondary(plan.title)}</h2></div><button className="gc-button" disabled={disabled} onClick={() => say('howto-block-builders')}>{label(text.listen)}{secondary(text.listen)}</button><button className="gc-button" data-new-round disabled={disabled} onClick={() => { onTap(); changePlan(round); }}>{label(text.newRound)}{secondary(text.newRound)}</button></div>
    <div className="bb-stage" style={{ '--bb-ground': BUILD_ART.ground / 100, '--bb-island-aspect': BUILD_ART.aspect, '--bb-columns': columns } as CSSProperties}>
      <div className="bb-island"><Art name="island" /></div>
      <div className={`bb-building${complete ? ' bb-complete' : ''}`}>
        {plan.slots.map((slot, i) => {
          const done = placed.includes(slot.id), ready = slot.supports.every(id => placed.includes(id));
          return <div key={slot.id} data-shape={slot.shape} data-supported={ready} className={`bb-placement${done ? ' bb-filled' : ''}${selected === slot.shape ? ' bb-matching' : ''}`} style={{ '--bb-x': slot.x, '--bb-y': slot.y, '--bb-w': slot.w } as CSSProperties}><button type="button" data-drop-id={slot.id} data-shape={slot.shape} data-supports={slot.supports.join(',')} data-filled={done} data-supported={ready} disabled={paused || done || complete} className="bb-slot" aria-label={`${label(text.slot, i + 1)}: ${label(blockKinds[slot.shape].label)} ${label(blockKinds[slot.shape].colorLabel)}${done ? `, ${label(text.placed)}` : !ready ? `, ${label(text.support)}` : ''}`} onClick={() => { if (selected) place(selected, slot.id); else setNotice('select'); }}>
          </button><Block shape={slot.shape} paired={plan.id === 'home-5' && slot.shape === 'cube'} />
          </div>;
        })}
      </div>
    </div>
    <div className="bb-status" role="status"><strong>{label(text[notice])}</strong>{secondary(text[notice])}</div>
    <div className="bb-tray" role="group" aria-label={label(text.tray)}><Art name="tray" className="bb-tray-art" />{shapes.map(shape => {
      const remaining = plan.slots.filter(s => s.shape === shape && !placed.includes(s.id)).length;
      return <div className="bb-piece" key={shape} data-rejected={rejected.shape === shape ? rejected.sequence : undefined}>
        <DragItem id={shape} label={`${label(blockKinds[shape].label)} ${label(blockKinds[shape].colorLabel)}`} selected={selected === shape} disabled={disabled || !remaining} onSelect={() => { setSelected(shape); setNotice('drag'); onTap(); say(`build-${shape}`); }} onDrop={place}><Block shape={shape} /></DragItem>
        <span>{label(blockKinds[shape].label)}{secondary(blockKinds[shape].label)}</span>
      </div>;
    })}</div>
  </div>;
}
