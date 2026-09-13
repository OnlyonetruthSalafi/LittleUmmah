'use client';
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
    setAnnouncement(`วางแล้ว ${next.length} จาก ${content.items.length} ชิ้น`);
    if (levelComplete(content.items.length, next.length)) timer.current = setTimeout(onComplete, 900);
    else {
      const nextItem = content.items.find(item => !next.includes(item.id));
      requestAnimationFrame(() => { if (nextItem) boardRef.current?.querySelector<HTMLButtonElement>(`[data-item-id="${nextItem.id}"]`)?.focus({ preventScroll: true }); });
    }
  };
  const art = (value: Item['visual']) => <ObjectArt visual={artworkFailed && value.kind === 'piece' ? { kind: 'text', value: `${(value.index ?? 0) + 1}` } : value} />;
  const visual = (item: Item) => <>{art(item.visual)}{!content.puzzle && <span className="gc-item-label">{item.label.th}<small lang="en">{item.label.en}</small></span>}</>;
  const theme = gamePresentation[slug];
  return <div ref={boardRef} className="gc-matching-workspace">
    <div className="gc-board-tools"><p>{content.sequential ? 'ซ้าย → ขวา • Left → right' : 'แตะชิ้น → แตะช่อง หรือลาก • Tap → tap, or drag'}</p><button className="gc-button" onClick={() => { const item = content.items.find(i => i.id === selected) ?? content.items.find(i => !placed.includes(i.id)); if (item) { setSelected(item.id); setHint(item.target); setAnnouncement(`ลองวาง ${item.label.th} ในช่องที่มีลูกศร`); } }}>คำใบ้<small lang="en">Hint</small></button>{content.puzzle && <button className="gc-button" aria-pressed={ghost} onClick={() => setGhost(g => !g)}>{ghost ? 'ซ่อนภาพช่วย' : 'ดูภาพช่วย'}<small lang="en">Picture guide</small></button>}</div>
    <p className="sr-only" role="status">{announcement}</p>
    {artworkFailed && <p className="gc-audio-note" role="status">ภาพยังไม่พร้อม จับคู่ตัวเลขแทนได้เลย <span lang="en">Match the numbers while the picture is unavailable.</span></p>}
    <h3 className="gc-zone-heading">{theme.destinations.th}<small lang="en">{theme.destinations.en}</small></h3>
    <div className={`gc-targets ${content.puzzle ? 'gc-puzzle-board' : ''}`} style={content.puzzle ? { gridTemplateColumns: `repeat(${content.puzzle.columns}, minmax(64px, 1fr))` } : undefined} aria-label="ช่องวาง / Destinations">
      {content.targets.map(target => { const accepted = content.items.filter(i => i.target === target.id && placed.includes(i.id)); const filled = accepted.length > 0; const finishedTarget = content.items.filter(i => i.target === target.id).every(i => placed.includes(i.id)); return <button key={target.id} data-drop-id={target.id} className={`gc-drop ${filled ? 'gc-filled' : ''} ${hint === target.id ? 'gc-hint' : ''}`} style={content.puzzle ? { aspectRatio: `${content.puzzle.rows} / ${content.puzzle.columns}` } : { '--gc-bin-color': target.visual?.color ?? '#62aaf2' } as CSSProperties} disabled={finishedTarget} aria-label={`${target.label.th} / ${target.label.en}${filled ? ` วางแล้ว ${accepted.length}` : ''}`} onClick={() => { if (selected) place(selected, target.id); else setAnnouncement('แตะเลือกชิ้นก่อน แล้วแตะช่องนี้'); }}>
        {content.puzzle ? <span className={`gc-puzzle-slot ${filled ? '' : ghost ? 'gc-ghost' : 'gc-hidden-ghost'}`}>{art(target.visual!)}</span> : filled && (content.sequential || slug === 'arabic-match') ? visual(accepted[0]) : <>{target.visual && <ObjectArt visual={target.visual} recessed={slug === 'shape-match' && !filled} />}<span className="gc-item-label">{target.label.th}<small lang="en">{target.label.en}</small></span></>}
        {content.puzzle && !filled && <span className="gc-slot-number">{content.targets.indexOf(target) + 1}</span>}{filled && <span className="gc-placed-count" aria-hidden="true">✓{accepted.length > 1 ? accepted.length : ''}</span>}{hint === target.id && <span className="gc-hint-arrow" aria-hidden="true">↓</span>}
      </button>; })}
    </div>
    <h3 className="gc-zone-heading gc-tray-heading">{theme.pieces.th}<small lang="en">{theme.pieces.en}</small></h3>
    <div className={`gc-tray ${content.puzzle ? 'gc-puzzle-tray' : ''}`} aria-label="ชิ้นที่เลือกได้ / Pieces">{content.items.map(item => <div key={item.id} className={`gc-tray-slot ${placed.includes(item.id) ? 'gc-done-slot' : ''}`} style={content.puzzle ? { aspectRatio: `${content.puzzle.rows} / ${content.puzzle.columns}` } : undefined}>{placed.includes(item.id) ? <span className="gc-done-mark" aria-label={`วาง ${item.label.th} แล้ว`}>✓</span> : <DragItem id={item.id} label={`${item.label.th} / ${item.label.en}`} selected={selected === item.id} onSelect={() => { setSelected(item.id); setHint(null); setAnnouncement(`เลือก ${item.label.th} แล้ว แตะช่องที่ตรงกัน`); }} onDrop={place}>{visual(item)}</DragItem>}</div>)}</div>
  </div>;
}
