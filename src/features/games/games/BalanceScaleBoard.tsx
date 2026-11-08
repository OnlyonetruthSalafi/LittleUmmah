'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useDict, useLocale } from '@/i18n/LocaleProvider';
import { useSound } from '@/components/sound/SoundProvider';
import { fmt } from '@/i18n/dict';
import { playNarration } from '@/lib/speech';
import { DragItem } from '../components/DragItem';
import type { PlayProps } from '../components/GameShell';
import { useGameAudio } from '../audio/useGameAudio';
import { BALANCE_ROUNDS, MAX_BLOCKS, balanceObjects, balanceText as text } from '../data/balanceScale';
import { SCALE_ART } from '../data/balanceScaleArt';
import { acceptsBalance, balanceAngle, compareWeights, nextBalanceQuestion, totalWeight, weightsForLevel, type Comparison, type Weight } from '../engine/balanceScale';
import type { Text } from '@/i18n/config';

function Art({ name, className = '' }: { name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? null : <Image className={className} src={`/games/balance-scale/${name}.webp`} alt="" width={600} height={600} unoptimized draggable={false} onError={() => setFailed(true)} />;
}
function Block({ weight }: { weight: number }) {
  return <span className="bs-block-art" aria-hidden="true"><Art name="scene-block" /><span className="bs-dots">{Array.from({ length: weight }, (_, i) => <i key={i} />)}</span></span>;
}

export default function BalanceScaleBoard({ level, paused, onProgress, onComplete, onTap }: PlayProps) {
  const { pick, pickSub, sub } = useDict();
  const locale = useLocale();
  const { enabled } = useSound();
  const { effect } = useGameAudio(paused);
  const [round, setRound] = useState(0);
  const [question, setQuestion] = useState(() => nextBalanceQuestion(level, 0, '', 0));
  const [blocks, setBlocks] = useState<Weight[]>([]);
  const [selected, setSelected] = useState<Weight | null>(null);
  const [phase, setPhase] = useState<'ready' | 'success'>('ready');
  const [notice, setNotice] = useState<'drag' | 'selected' | 'retry' | 'full'>('drag');
  const [voice, setVoice] = useState({ key: '', sequence: 0 });
  const blocksRef = useRef<Weight[]>([]);
  const busy = useRef(false);
  const initialized = useRef(false);
  const scene = useRef<HTMLDivElement>(null);
  const focusControl = useCallback(() => requestAnimationFrame(() => scene.current?.querySelector<HTMLButtonElement>('[data-item-id], [data-answer]')?.focus({ preventScroll: true })), []);
  const say = (key: string) => setVoice(v => ({ key, sequence: v.sequence + 1 }));
  const label = (value: Text, n = 0) => fmt(pick(value), { n });
  const secondary = (value: Text, n = 0) => sub && <small lang="en">{fmt(pickSub(value)!, { n })}</small>;
  const right = question.mode === 'compare' ? question.right : totalWeight(blocks);
  const comparison = compareWeights(question.left, right);
  const disabled = paused || phase === 'success';

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    let previous = '';
    try { previous = sessionStorage.getItem('balance-scale:last') ?? ''; } catch {}
    const q = nextBalanceQuestion(level, 0, previous);
    try { sessionStorage.setItem('balance-scale:last', q.id); } catch {}
    queueMicrotask(() => setQuestion(q));
  }, [level]);
  useEffect(() => { onProgress(round, BALANCE_ROUNDS); }, [round, onProgress]);
  useEffect(() => {
    if (paused || !enabled || locale !== 'th' || !voice.key) return;
    return playNarration(`/audio/th/${voice.key}.mp3`, { onEnded: () => {}, onStopped: () => {}, onFail: () => {} });
  }, [voice, enabled, locale, paused]);
  useEffect(() => {
    if (paused) return;
    focusControl();
    const timer = window.setTimeout(() => {
      setVoice(v => ({ key: question.mode === 'compare' ? 'balance-compare' : 'game-balance-scale', sequence: v.sequence + 1 }));
    }, round === 0 ? 1900 : 100);
    return () => clearTimeout(timer);
  }, [paused, question.id, question.mode, round, focusControl]);

  const changeQuestion = useCallback((nextRound: number) => {
    const next = nextBalanceQuestion(level, nextRound, question.id);
    try { sessionStorage.setItem('balance-scale:last', next.id); } catch {}
    blocksRef.current = []; busy.current = false;
    setBlocks([]); setSelected(null); setNotice('drag'); setPhase('ready');
    setRound(nextRound); setQuestion(next); focusControl();
  }, [level, question.id, focusControl]);
  useEffect(() => {
    if (phase !== 'success' || paused) return;
    const timer = window.setTimeout(() => {
      if (round + 1 === BALANCE_ROUNDS) { onProgress(BALANCE_ROUNDS, BALANCE_ROUNDS); onComplete(); }
      else changeQuestion(round + 1);
    }, enabled ? 3000 : 1300);
    return () => clearTimeout(timer);
  }, [phase, paused, round, enabled, onProgress, onComplete, changeQuestion]);

  const place = (id: string, destination: string) => {
    const weight = Number(id) as Weight;
    if (disabled || busy.current || destination !== 'balance-right' || question.mode !== 'balance' || !weightsForLevel(level).includes(weight)) return;
    if (blocksRef.current.length >= MAX_BLOCKS) { setNotice('full'); say('balance-retry'); return; }
    const next = [...blocksRef.current, weight]; blocksRef.current = next;
    setBlocks(next); setSelected(null); setNotice('drag'); onTap();
    const status = compareWeights(question.left, totalWeight(next));
    // Equal praise is spoken after checking, so it never sounds like an automatic submission.
    if (status !== 'equal') say(`balance-${status}`);
  };
  const remove = (index: number) => {
    if (disabled || busy.current) return;
    const next = blocksRef.current.filter((_, i) => i !== index); blocksRef.current = next;
    setBlocks(next); setNotice('drag'); onTap();
    requestAnimationFrame(() => scene.current?.querySelector<HTMLButtonElement>('.bs-remove:not(:disabled), [data-item-id]')?.focus({ preventScroll: true }));
    const status = compareWeights(question.left, totalWeight(next));
    if (status !== 'equal') say(`balance-${status}`);
  };
  const check = (choice?: Comparison) => {
    if (disabled || busy.current) return;
    if (acceptsBalance(question, blocksRef.current, choice)) {
      busy.current = true; setPhase('success'); setSelected(null); effect('correct');
      say(question.mode === 'compare' ? 'balance-correct' : 'balance-equal');
    } else { setNotice('retry'); effect('incorrect'); say('balance-retry'); }
  };
  const angle = balanceAngle(question.left, right);
  const leftObject = balanceObjects[question.leftObject], rightObject = balanceObjects[question.rightObject];
  const statusText = phase === 'success' ? question.mode === 'compare' ? text.correct : text.praise : text[comparison];
  return <div ref={scene} className="bs-scene" data-round={round + 1} data-question={question.id} data-mode={question.mode} data-left={question.left} data-right={right} data-phase={phase}>
    <div className="bs-goal"><div><p>{label(text.round, round + 1)}{secondary(text.round, round + 1)}</p><h2>{label(text[question.mode])}{secondary(text[question.mode])}</h2></div><button className="gc-button" disabled={disabled} onClick={() => say('howto-balance-scale')}>{label(text.listen)}{secondary(text.listen)}</button></div>
    <div className="bs-stage" style={{ '--bs-arm-span': `${SCALE_ART.armSpan}%`, '--bs-angle': `${angle}deg`, '--bs-arm-radius': `${SCALE_ART.armSpan / 2}cqw`, '--bs-pivot-y': `${SCALE_ART.pivotY}%`, '--bs-seat': `${SCALE_ART.seat}%` } as CSSProperties}>
      <div className="bs-diorama">
      <Art name="scene-island" className="bs-island" />
      <Art name="scene-base" className="bs-base" />
      <div className="bs-beam"><Art name="scene-beam" /></div>
      <div className="bs-pan bs-left"><Art name="scene-pan" className="bs-pan-art" /><div className="bs-object"><Art name={leftObject.id} /></div><Art name="scene-pan-front" className="bs-pan-front" /></div>
      <div className="bs-pan bs-right" data-drop-id="balance-right"><Art name="scene-pan" className="bs-pan-art" />
        {question.mode === 'compare' ? <div className="bs-object"><Art name={rightObject.id} /></div> : <div className="bs-placed">{blocks.map((weight, i) => <button key={i} type="button" className="bs-remove" disabled={disabled} aria-label={label(text.remove, weight)} onClick={() => remove(i)}><Block weight={weight} /></button>)}</div>}
        <Art name="scene-pan-front" className="bs-pan-front" />
      </div>
      </div>
      <div className="bs-labels">
        <div className="bs-pan-label"><span>{label(text.leftPan)}{secondary(text.leftPan)}</span><strong>{label(leftObject.label)}{secondary(leftObject.label)}</strong><span>{label(text.unit, question.left)}{secondary(text.unit, question.left)}</span></div>
        <div className="bs-pan-label"><span>{label(text.rightPan)}{secondary(text.rightPan)}</span>{question.mode === 'compare' && <strong>{label(rightObject.label)}{secondary(rightObject.label)}</strong>}<span>{label(text.unit, right)}{secondary(text.unit, right)}</span></div>
      </div>
      {question.mode === 'balance' && <div className="bs-tray"><Art name="scene-tray" className="bs-tray-art" />{weightsForLevel(level).map(weight => <div key={weight}><DragItem id={String(weight)} label={label(text.block, weight)} selected={selected === weight} disabled={disabled} onSelect={() => { setSelected(weight); setNotice('selected'); onTap(); }} onDrop={place}><Block weight={weight} /></DragItem><span>{label(text.unit, weight)}{secondary(text.unit, weight)}</span></div>)}</div>}
    </div>
    <div className="bs-status" role="status"><strong><span aria-hidden="true">{comparison === 'equal' ? '=' : comparison === 'left' ? '◀' : '▶'}</span> {label(statusText)}</strong>{secondary(statusText)}</div>
    <div className="bs-controls">
      {question.mode === 'balance' ? <><div className="bs-actions"><button className="gc-button" disabled={disabled || selected === null} data-place onClick={() => { if (selected !== null) place(String(selected), 'balance-right'); }}>{label(text.place)}{secondary(text.place)}</button><button className="gc-button gc-primary" disabled={disabled} data-check onClick={() => check()}>{label(text.check)}{secondary(text.check)}</button></div></> : <div className="bs-answers">{(['left', 'equal', 'right'] as const).map(choice => { const t = choice === 'left' ? text.chooseLeft : choice === 'right' ? text.chooseRight : text.chooseEqual; return <button className="gc-button" key={choice} data-answer={choice} disabled={disabled} onClick={() => check(choice)}><span aria-hidden="true">{choice === 'equal' ? '=' : choice === 'left' ? '◀' : '▶'}</span>{label(t)}{secondary(t)}</button>; })}</div>}
      <p className="bs-hint">{label(question.mode === 'compare' && notice === 'drag' ? text.compare : text[notice])}{secondary(question.mode === 'compare' && notice === 'drag' ? text.compare : text[notice])}</p>
      <div className="bs-round-actions"><p>{label(text.toy)}{secondary(text.toy)}</p><button className="gc-button" disabled={disabled} data-new-round onClick={() => { onTap(); changeQuestion(round); }}>{label(text.newRound)}{secondary(text.newRound)}</button></div>
    </div>
  </div>;
}
