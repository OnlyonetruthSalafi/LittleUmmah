'use client';
import { fmt } from '@/i18n/dict';
import { useDict } from '@/i18n/LocaleProvider';

import { useEffect, useRef, useState } from 'react';
import { boardContent, type Item } from '../data/content';
import { canPlace, shuffle, levelComplete } from '../engine/rules';
import { ObjectArt } from '../components/Artwork';
import { DragItem } from '../components/DragItem';
import type { PlayProps } from '../components/GameShell';
import { gameAssets } from '../data/catalog';
import { gamePresentation } from '../data/presentation';
import type { CSSProperties } from 'react';

export default function MatchingBoard({ slug, level, onProgress, onFeedback, onComplete }: PlayProps) {
  const { t, sub, pick, pickSub } = useDict();
  const [content] = useState(() => { const data = boardContent(slug, level); return { ...data, items: shuffle(data.items), targets: data.puzzle || data.sequential ? data.targets : shuffle(data.targets) }; });
  const [placed, setPlaced] = useState<string[]>([]);
  const placedRef = useRef<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [ghost, setGhost] = useState(true);
  const [hint, setHint] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [artworkFailed, setArtworkFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!content.puzzle) return;
    const image = new window.Image();
    image.onerror = () => { setArtworkFailed(true); if (process.env.NODE_ENV !== 'production') console.warn('Puzzle artwork unavailable; using numbered tiles.'); };
    image.src = gameAssets.puzzle;
    return () => { image.onerror = null; };
  }, [content.puzzle]);
  useEffect(() => { onProgress(placed.length, content.items.length); }, [placed.length, content.items.length, onProgress]);
  const place = (itemId: string, targetId: string) => {
    if (placedRef.current.includes(itemId)) return;
    const correct = canPlace(content.items, content.targets, placedRef.current, itemId, targetId);
    onFeedback(correct);
    if (!correct) return;
    const next = [...placedRef.current, itemId];
    placedRef.current = next; setPlaced(next); setSelected(null); setHint(null);
    setAnnouncement(fmt(t.games.matching.placed, { done: next.length, total: content.items.length }));
    if (levelComplete(content.items.length, next.length)) timer.current = setTimeout(onComplete, 900);
    else {
      const nextItem = content.items.find(item => !next.includes(item.id));
      requestAnimationFrame(() => { if (nextItem) boardRef.current?.querySelector<HTMLButtonElement>(`[data-item-id="${nextItem.id}"]`)?.focus({ preventScroll: true }); });
    }
  };
  const art = (value: Item['visual']) => <ObjectArt visual={artworkFailed && value.kind === 'piece' ? { kind: 'text', value: `${(value.index ?? 0) + 1}` } : value} />;
  const visual = (item: Item) => <>{art(item.visual)}{!content.puzzle && <span className="gc-item-label">{pick(item.label)}{sub && <small lang="en">{pickSub(item.label)!}</small>}</span>}</>;
  const theme = gamePresentation[slug];
  return <div ref={boardRef} className="gc-matching-workspace">
    <div className="gc-board-tools"><p>{content.sequential ? t.games.matching.leftRight : t.games.matching.tapDrag}</p><button className="gc-button" onClick={() => { const item = content.items.find(i => i.id === selected) ?? content.items.find(i => !placed.includes(i.id)); if (item) { setSelected(item.id); setHint(item.target); setAnnouncement(fmt(t.games.matching.trySlot, { name: pick(item.label) })); } }}>{t.games.matching.hint}{sub && <small lang="en">{sub.games.matching.hint}</small>}</button>{content.puzzle && <button className="gc-button" aria-pressed={ghost} onClick={() => setGhost(g => !g)}>{ghost ? t.games.matching.hide : t.games.matching.show}{sub && <small lang="en">{sub.games.matching.pictureGuide}</small>}</button>}</div>
    <p className="sr-only" role="status">{announcement}</p>
    {artworkFailed && <p className="gc-audio-note" role="status">{t.games.matching.unavailable} {sub && <span lang="en">{sub.games.matching.unavailable}</span>}</p>}
    <h3 className="gc-zone-heading">{pick(theme.destinations)}{sub && <small lang="en">{pickSub(theme.destinations)!}</small>}</h3>
    <div className={`gc-targets ${content.puzzle ? 'gc-puzzle-board' : ''}`} style={content.puzzle ? { gridTemplateColumns: `repeat(${content.puzzle.columns}, minmax(64px, 1fr))` } : undefined} aria-label={t.games.matching.destinations}>
      {content.targets.map(target => { const accepted = content.items.filter(i => i.target === target.id && placed.includes(i.id)); const filled = accepted.length > 0; const finishedTarget = content.items.filter(i => i.target === target.id).every(i => placed.includes(i.id)); return <button key={target.id} data-drop-id={target.id} className={`gc-drop ${filled ? 'gc-filled' : ''} ${hint === target.id ? 'gc-hint' : ''}`} style={content.puzzle ? { aspectRatio: `${content.puzzle.rows} / ${content.puzzle.columns}` } : { '--gc-bin-color': target.visual?.color ?? '#62aaf2' } as CSSProperties} disabled={finishedTarget} aria-label={`${pick(target.label)}${pickSub(target.label) ? ` / ${pickSub(target.label)}` : ''}${filled ? fmt(t.games.matching.placedCount, { n: accepted.length }) : ''}`} onClick={() => { if (selected) place(selected, target.id); else setAnnouncement(t.games.matching.selectFirst); }}>
        {content.puzzle ? <span className={`gc-puzzle-slot ${filled ? '' : ghost ? 'gc-ghost' : 'gc-hidden-ghost'}`}>{art(target.visual!)}</span> : filled && (content.sequential || slug === 'arabic-match') ? visual(accepted[0]) : <>{target.visual && <ObjectArt visual={target.visual} recessed={slug === 'shape-match' && !filled} />}<span className="gc-item-label">{pick(target.label)}{sub && <small lang="en">{pickSub(target.label)!}</small>}</span></>}
        {content.puzzle && !filled && <span className="gc-slot-number">{content.targets.indexOf(target) + 1}</span>}{filled && <span className="gc-placed-count" aria-hidden="true">✓{accepted.length > 1 ? accepted.length : ''}</span>}{hint === target.id && <span className="gc-hint-arrow" aria-hidden="true">↓</span>}
      </button>; })}
    </div>
    <h3 className="gc-zone-heading gc-tray-heading">{pick(theme.pieces)}{sub && <small lang="en">{pickSub(theme.pieces)!}</small>}</h3>
    <div className={`gc-tray ${content.puzzle ? 'gc-puzzle-tray' : ''}`} aria-label={t.games.matching.pieces}>{content.items.map(item => <div key={item.id} className={`gc-tray-slot ${placed.includes(item.id) ? 'gc-done-slot' : ''}`} style={content.puzzle ? { aspectRatio: `${content.puzzle.rows} / ${content.puzzle.columns}` } : undefined}>{placed.includes(item.id) ? <span className="gc-done-mark" aria-label={fmt(t.games.matching.placedItem, { name: pick(item.label) })}>✓</span> : <DragItem id={item.id} label={(pickSub(item.label) ? `${pick(item.label)} / ${pickSub(item.label)}` : pick(item.label))} selected={selected === item.id} onSelect={() => { setSelected(item.id); setHint(null); setAnnouncement(fmt(t.games.matching.selected, { name: pick(item.label) })); }} onDrop={place}>{visual(item)}</DragItem>}</div>)}</div>
  </div>;
}
