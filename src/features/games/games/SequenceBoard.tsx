'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { PlayProps } from '../components/GameShell';
import { GameImage } from '../components/GameImage';
import { DragItem } from '../components/DragItem';
import { SequenceToy } from '../components/SequenceToy';
import { mixSequence, placeSequence, sequenceLevel } from '../data/sequence';

export default function SequenceBoard({ level, onProgress, onFeedback, onComplete, onTap }: PlayProps) {
  const [round] = useState(() => { const data = sequenceLevel(level); return { ...data, tray: mixSequence(data.pieces) }; });
  const [placed, setPlaced] = useState<string[]>([]);
  const current = useRef<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hint, setHint] = useState<number | null>(null);
  const [notice, setNotice] = useState('แตะของเล่น แล้วแตะแท่นบนเกาะ หรือลากไปวาง');
  const board = useRef<HTMLDivElement>(null);
  const total = round.pieces.length;
  useEffect(() => { onProgress(placed.length, total); }, [placed.length, total, onProgress]);
  useEffect(() => {
    if (placed.length !== total) return;
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [placed.length, total, onComplete]);

  function place(id: string, target: string) {
    if (current.current.includes(id)) return;
    const next = placeSequence(round.pieces, current.current, id, target);
    const correct = next !== current.current;
    onFeedback(correct);
    if (!correct) { setNotice('ลองเปรียบเทียบกับชิ้นอื่น แล้ววางใหม่ได้นะ'); return; }
    current.current = next;
    setPlaced(next); setSelected(null); setHint(null);
    setNotice(`วางถูกแล้ว ${next.length} จาก ${total} ชิ้น`);
    const nextPiece = round.tray.find(p => !next.includes(p.id));
    if (nextPiece) board.current?.querySelector<HTMLButtonElement>(`[data-item-id="${nextPiece.id}"]`)?.focus({ preventScroll: true });
  }

  return <div className="seq-scene" ref={board} style={{ '--seq-count': total } as CSSProperties}>
    <div className="seq-heading"><div><h3>{round.th}</h3><p lang="en">{round.en}</p></div>
      <button className="gc-button" disabled={placed.length === total} onClick={() => {
        const piece = round.pieces.find(p => p.id === selected) ?? round.pieces.find(p => !current.current.includes(p.id));
        if (!piece) return;
        onTap(); setSelected(piece.id); setHint(piece.rank);
        setNotice(`ลองวาง ${piece.th} บนแท่น ${piece.rank + 1} ที่มีลูกศร`);
      }}>คำใบ้<small lang="en">Hint</small></button>
    </div>
    <div className="seq-island">
      <GameImage className="seq-island-art" src="/games/sequence/island.webp" alt="" width={1100} height={1100} preload sizes="(max-width: 767px) 100vw, 780px" />
      <div className="seq-direction">เริ่มทางซ้าย <span aria-hidden="true">→</span><small lang="en">Start on the left</small></div>
      <div className="seq-homes" role="group" aria-label="แท่นเรียงลำดับจากซ้ายไปขวา / Order from left to right">
        {round.pieces.map(piece => {
          const filled = placed.includes(piece.id);
          return <button type="button" key={piece.id} className="seq-home" data-drop-id={`sequence-slot-${piece.rank}`}
            data-filled={filled || undefined} data-hint={hint === piece.rank || undefined} disabled={filled}
            aria-label={`แท่น ${piece.rank + 1} / Position ${piece.rank + 1}${filled ? `: ${piece.th} วางแล้ว / ${piece.en}, placed` : ''}`}
            onClick={() => { if (selected) place(selected, `sequence-slot-${piece.rank}`); else setNotice('เลือกของเล่นด้านล่างก่อน แล้วแตะแท่นนี้'); }}>
            <span className="seq-home-object">{filled ? <SequenceToy kind={round.kind} rank={piece.rank} /> : <span className="seq-empty" aria-hidden="true">{hint === piece.rank ? '↓' : '?'}</span>}</span>
            <span className="seq-plinth" aria-hidden="true" />
            <span className="seq-position">{filled ? '✓ ' : ''}{piece.rank + 1}</span>
          </button>;
        })}
      </div>
    </div>
    <div className="seq-tray-wrap">
      <p className="seq-notice" role="status" aria-live="polite">{notice}<small lang="en">Tap a toy, then a platform · or drag and drop</small></p>
      <div className="seq-tray" role="group" aria-label="ของเล่นที่รอเรียง / Toys to order">
        {round.tray.map(piece => <div className="seq-tray-cell" key={piece.id}>
          {placed.includes(piece.id) ? <div className="seq-done" aria-label={`${piece.th} วางแล้ว / ${piece.en}, placed`}><span aria-hidden="true">✓</span><small>วางแล้ว<small lang="en">Placed</small></small></div> :
            <DragItem id={piece.id} label={`${piece.th} / ${piece.en}`} selected={selected === piece.id}
              onSelect={() => { onTap(); setSelected(piece.id); setHint(null); setNotice(`เลือก ${piece.th} แล้ว แตะแท่นที่ต้องการวาง`); }} onDrop={place}>
              <SequenceToy kind={round.kind} rank={piece.rank} /><span className="seq-label">{piece.th}<small lang="en">{piece.en}</small></span>
            </DragItem>}
        </div>)}
      </div>
    </div>
  </div>;
}
