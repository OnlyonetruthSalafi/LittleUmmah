'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useDict, useLocale } from '@/i18n/LocaleProvider';
import { useSound } from '@/components/sound/SoundProvider';
import { playNarration } from '@/lib/speech';
import { fmt } from '@/i18n/dict';
import { DragItem } from '../components/DragItem';
import type { PlayProps } from '../components/GameShell';
import { useGameAudio } from '../audio/useGameAudio';
import { addCoin, COIN_ROUNDS, coinNumbers, coinText as text, nextCoinTarget } from '../data/coinBox';
import { COIN_SLOT } from '../data/coinBoxArt';

type Phase = 'prompt' | 'ready' | 'count' | 'praise' | 'retry';
export default function CoinBoxBoard({ level, paused, onProgress, onComplete, onTap }: PlayProps) {
  const { pick, pickSub, sub } = useDict();
  const locale = useLocale();
  const { enabled } = useSound();
  const { effect } = useGameAudio(paused);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('prompt');
  const [selected, setSelected] = useState(false);
  const [loaded, setLoaded] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const [replay, setReplay] = useState(0);
  const lock = useRef(true);
  const countRef = useRef(0);
  const coinRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const assetsReady = loaded.length === 3 || failed;
  const label = (value: typeof text.coin, n?: number) => fmt(pick(value), { n: n ?? 0 });
  const secondary = (value: typeof text.coin, n?: number) => sub && <small lang="en">{fmt(pickSub(value)!, { n: n ?? 0 })}</small>;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Random choice happens after hydration, with a session-wide previous target.
    let previous = 0;
    try { previous = Number(sessionStorage.getItem('coin-box:last')); } catch {}
    const next = nextCoinTarget(level, previous);
    try { sessionStorage.setItem('coin-box:last', String(next)); } catch {}
    setTarget(next);
  }, [level]);
  useEffect(() => { onProgress(round, COIN_ROUNDS); }, [round, onProgress]);
  // A stalled picture never hides the functional text/coin fallback indefinitely.
  useEffect(() => {
    if (loaded.length === 3 || failed) return;
    const timer = setTimeout(() => setFailed(true), 8000);
    return () => clearTimeout(timer);
  }, [loaded.length, failed]);
  const ready = useCallback(() => {
    lock.current = false; setPhase('ready');
    requestAnimationFrame(() => coinRef.current?.querySelector('button')?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (paused || !target || !assetsReady || phase === 'ready') return;
    let active = true, timer = 0, ceiling = 0;
    const finish = () => {
      if (!active) return;
      active = false;
      window.clearTimeout(timer); window.clearTimeout(ceiling);
      if (phase === 'count' && count === target) { effect('correct'); setPhase('praise'); }
      else if (phase === 'praise') {
        if (round + 1 === COIN_ROUNDS) { onProgress(COIN_ROUNDS, COIN_ROUNDS); onComplete(); }
        else {
          const next = nextCoinTarget(level, target);
          try { sessionStorage.setItem('coin-box:last', String(next)); } catch {}
          countRef.current = 0; setCount(0); setRound(r => r + 1); setTarget(next); setPhase('prompt');
        }
      } else ready();
    };
    const clip = phase === 'prompt' ? `coin-target-${target}` : phase === 'count' ? `coin-count-${count}` : `coin-${phase}`;
    const delay = phase === 'count' ? 500 : phase === 'praise' ? 1500 : 1100;
    const fallback = () => { window.clearTimeout(timer); timer = window.setTimeout(finish, delay); };
    let stop = () => {};
    // Wait for the shared countdown's final spoken cue before the first prompt.
    timer = window.setTimeout(() => {
      if (enabled && locale === 'th') stop = playNarration(`/audio/th/${clip}.mp3`, { onEnded: finish, onStopped: fallback, onFail: fallback });
      else fallback();
    }, phase === 'prompt' && round === 0 && replay === 0 ? 1900 : 0);
    ceiling = window.setTimeout(finish, 16000);
    return () => { active = false; window.clearTimeout(timer); window.clearTimeout(ceiling); stop(); };
  }, [paused, target, assetsReady, phase, count, round, level, enabled, locale, effect, onComplete, onProgress, ready, replay]);

  const drop = (_id: string, destination: string) => {
    if (paused || lock.current || phase !== 'ready' || destination !== 'coin-slot') return;
    lock.current = true;
    const next = addCoin(countRef.current, target);
    countRef.current = next; setCount(next); setSelected(false); setPhase('count'); onTap();
  };
  const changeCount = (next: number) => {
    if (paused || lock.current) return;
    lock.current = true; countRef.current = next; setCount(next); setSelected(false); setPhase('retry');
  };
  const disabled = paused || phase !== 'ready' || !assetsReady;
  const status = !assetsReady ? text.loading : phase === 'praise' ? text.praise : phase === 'retry' ? text.retry : selected ? text.select : text.drag;
  return <div className="cb-scene" data-round={round + 1} data-target={target} data-count={count} data-phase={phase}>
    <div className="cb-goal">
      <Image src="/Character/point.webp" alt="" width={80} height={90} className="cb-guide" />
      <div><p>{label(text.round, round + 1)}{secondary(text.round, round + 1)}</p>
        <h2>{label(text.target, target)}{secondary(text.target, target)}</h2>
        <div className="cb-number" aria-hidden="true"><strong>{target || '…'}</strong><span className="cb-dots">{Array.from({ length: target }, (_, i) => <i key={i} />)}</span></div>
      </div>
      <button className="gc-button cb-listen" disabled={disabled} onClick={() => { lock.current = true; setReplay(r => r + 1); setPhase('prompt'); }}>{label(text.listen)}{secondary(text.listen)}</button>
    </div>
    <div className="cb-play">
      <div className="cb-island">
        <Image className="cb-island-art" src="/games/coin-box/island.webp" alt="" width={1000} height={1000} unoptimized preload onLoad={() => setLoaded(v => v.includes('island') ? v : [...v, 'island'])} onError={() => setFailed(true)} />
        <button className="cb-slot" data-drop-id="coin-slot" style={{ left: `${COIN_SLOT.x}%`, top: `${COIN_SLOT.y}%`, width: `${COIN_SLOT.w}%` }} disabled={disabled} aria-label={label(text.slot)} data-selected={selected} onClick={() => { if (selected) drop('coin', 'coin-slot'); else coinRef.current?.querySelector('button')?.focus({ preventScroll: true }); }}>
          <span aria-hidden="true">↓</span><span>{label(text.slot)}{secondary(text.slot)}</span>
        </button>
        <div className="cb-counter" aria-live="polite"><strong>{count}</strong><span>{label(text.count, count)}{secondary(text.count, count)}</span><span className="cb-count-dots" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} />)}</span></div>
      </div>
      <div className="cb-tray" ref={coinRef}>
        <Image src="/games/coin-box/tray.webp" alt="" width={1000} height={500} unoptimized className="cb-tray-art" onLoad={() => setLoaded(v => v.includes('tray') ? v : [...v, 'tray'])} onError={() => setFailed(true)} />
        {[0, 1, 2].map(i => <Image key={i} className="cb-reserve" src="/games/coin-box/coin.webp" alt="" width={72} height={72} unoptimized draggable={false} />)}
        <DragItem id="coin" label={label(text.coin)} selected={selected} disabled={disabled} onSelect={() => { setSelected(true); onTap(); }} onDrop={drop}>
          <Image src="/games/coin-box/coin.webp" alt="" width={1000} height={1000} unoptimized draggable={false} onLoad={() => setLoaded(v => v.includes('coin') ? v : [...v, 'coin'])} onError={() => setFailed(true)} />
          {failed && <span className="cb-fallback">★</span>}
        </DragItem>
      </div>
    </div>
    <p className="cb-status" role="status">{phase === 'count' ? label(coinNumbers[count - 1]) : label(status)}{secondary(phase === 'count' ? coinNumbers[count - 1] : status)}</p>
    <div className="cb-actions"><button className="gc-button" disabled={disabled || count === 0} onClick={() => changeCount(count - 1)}>{label(text.undo)}{secondary(text.undo)}</button><button className="gc-button" disabled={disabled} onClick={() => changeCount(0)}>{label(text.reset)}{secondary(text.reset)}</button></div>
  </div>;
}
