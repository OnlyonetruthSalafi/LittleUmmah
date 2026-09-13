'use client';
import { useEffect, useRef, useState } from 'react';
import { findScenes, symbols } from '../data/content';
import { shuffle } from '../engine/rules';
import { ObjectArt } from '../components/Artwork';
import type { PlayProps } from '../components/GameShell';
export default function FindBoard({ level, onProgress, onFeedback, onComplete }: PlayProps) {
  const [scene] = useState(() => shuffle(findScenes[level - 1].map(i => symbols[i])));
  const [targets] = useState(() => shuffle([...scene, ...scene]).slice(0, 5));
  const [round, setRound] = useState(0);
  const [found, setFound] = useState(false);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { onProgress(round + (found ? 1 : 0), targets.length); }, [round, found, targets.length, onProgress]);
  const target = targets[round];
  return <><div className="gc-find-prompt" aria-live="polite" aria-atomic="true"><span>หา…<small lang="en">Find…</small></span><ObjectArt visual={{ kind: 'icon', value: target.id }} /><span>{target.th}<small lang="en">{target.en}</small></span></div><div className="gc-find-scene">{scene.map((object, i) => <button key={object.id} className={`gc-object-button gc-find-object ${found && object.id === target.id ? 'gc-found' : ''}`} style={{ alignSelf: i % 2 ? 'end' : 'start' }} aria-label={`${object.th} / ${object.en}`} aria-disabled={found} onClick={() => { if (locked.current) return; const correct = object.id === target.id; onFeedback(correct); if (!correct) return; locked.current = true; setFound(true); timer.current = setTimeout(() => { if (round + 1 === targets.length) onComplete(); else { setRound(r => r + 1); setFound(false); locked.current = false; } }, 900); }}><ObjectArt visual={{ kind: 'icon', value: object.id }} />{found && object.id === target.id && <span className="gc-placed-count" aria-hidden="true">✓</span>}</button>)}</div></>;
}
