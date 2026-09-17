'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { PlayProps } from '../components/GameShell';
import { GameImage as Image } from '../components/GameImage';
import { IslandBoard } from '../components/diorama/IslandBoard';
import { DragItem } from '../components/DragItem';
import { dropTargetAt } from '../components/dropTarget';
import { SequenceToy } from '../components/SequenceToy';
import { mixSequence, placeSequence, sequenceLevel } from '../data/sequence';
import { PAD_WIDTH, SEQ_ISLAND, SEQ_PAD, padAt } from '../data/sequenceArt';

/* เกมเรียงลำดับแบบ 2.5D — ตามภาพเกาะตัวอย่าง public/games/hub/sequence.png
 *
 * ทางแผ่นทองไล่จากซ้ายหน้าขึ้นไปขวาหลัง ของที่รอเรียงวางเป็นแถวใต้เกาะ
 * ไม่มีตัวหนังสือบนเกาะตามที่เจ้าของโปรเจกต์สั่ง (เหมือนเกมหยอดรูปทรง):
 * ตัดหัวข้อ ป้าย "เริ่มทางซ้าย" เลขแท่น ป้ายชื่อชิ้น และข้อความแนะนำออก
 * ทิศของทางแผ่นทองบอกจุดเริ่มแทนเลขแท่น ชื่อชิ้นกับเลขแท่นยังอยู่ใน aria-label
 * ข้อความแนะนำย้ายไปเป็น sr-only role=status ให้เครื่องอ่านหน้าจอ
 */
export default function SequenceBoard({ level, onProgress, onFeedback, onComplete, onTap }: PlayProps) {
  const [round] = useState(() => { const data = sequenceLevel(level); return { ...data, tray: mixSequence(data.pieces) }; });
  const [placed, setPlaced] = useState<string[]>([]);
  const current = useRef<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hint, setHint] = useState<number | null>(null);
  const [landed, setLanded] = useState<number | null>(null);
  const [notice, setNotice] = useState(`${round.th} แตะของเล่น แล้วแตะแผ่นทอง หรือลากไปวาง เริ่มจากแผ่นซ้ายหน้า`);
  const board = useRef<HTMLDivElement>(null);
  const total = round.pieces.length;
  useEffect(() => { onProgress(placed.length, total); }, [placed.length, total, onProgress]);
  useEffect(() => {
    if (placed.length !== total) return;
    const timer = setTimeout(onComplete, 1100);
    return () => clearTimeout(timer);
  }, [placed.length, total, onComplete]);

  function place(id: string, target: string) {
    if (current.current.includes(id)) return;
    const next = placeSequence(round.pieces, current.current, id, target);
    const correct = next !== current.current;
    onFeedback(correct);
    if (!correct) { setNotice('ลองเปรียบเทียบกับชิ้นอื่น แล้ววางใหม่ได้นะ'); return; }
    const piece = round.pieces.find(p => p.id === id)!;
    current.current = next;
    setPlaced(next); setSelected(null); setHint(null); setLanded(piece.rank);
    setNotice(`วาง ${piece.th} ถูกแล้ว ${next.length} จาก ${total} ชิ้น`);
    const nextPiece = round.tray.find(p => !next.includes(p.id));
    if (nextPiece) requestAnimationFrame(() => board.current?.querySelector<HTMLButtonElement>(`[data-item-id="${nextPiece.id}"]`)?.focus({ preventScroll: true }));
  }

  const picked = round.pieces.find(p => p.id === selected);
  return <div className="seq-scene" data-count={total} ref={board} style={{ '--seq-count': total, '--pad-w': `${PAD_WIDTH}%` } as CSSProperties}>
    <div className="seq-tools">
      {picked && <p className="seq-picked">เลือก {picked.th} แล้ว <span lang="en">· {picked.en} selected</span></p>}
      <button type="button" className="gc-button" disabled={placed.length === total} onClick={() => {
        const piece = round.pieces.find(p => p.id === selected) ?? round.pieces.find(p => !current.current.includes(p.id));
        if (!piece) return;
        onTap(); setSelected(piece.id); setHint(piece.rank);
        setNotice(`ลองวาง ${piece.th} บนแผ่นทองที่มีลูกศร แผ่นที่ ${piece.rank + 1}`);
      }}>คำใบ้<small lang="en">Hint</small></button>
    </div>
    <p className="sr-only" role="status" aria-live="polite">{notice}</p>

    <IslandBoard {...SEQ_ISLAND} className="seq-island" label={`${round.th} / ${round.en}`}>
      <div className="seq-homes" role="group" aria-label="แผ่นทองเรียงจากซ้ายหน้าไปขวาหลัง / Order from front left to back right">
        {round.pieces.map(piece => {
          const filled = placed.includes(piece.id);
          const at = padAt(piece.rank, total);
          return <button type="button" key={piece.id} className="seq-home" data-drop-id={`sequence-slot-${piece.rank}`}
            data-filled={filled || undefined} data-hint={hint === piece.rank || undefined} data-landed={landed === piece.rank || undefined} disabled={filled}
            style={{ left: `${at.x}%`, top: `${at.y}%`, zIndex: 10 - piece.rank } as CSSProperties}
            aria-label={`แผ่นที่ ${piece.rank + 1} / Position ${piece.rank + 1}${filled ? `: ${piece.th} วางแล้ว / ${piece.en}, placed` : ''}`}
            onClick={event => {
              if (!selected) { setNotice('เลือกของเล่นก่อน แล้วแตะแผ่นทอง'); return; }
              /* แผ่นเรียงทแยงจึงคาบเกี่ยวกัน แตะด้วยนิ้ว/เมาส์ให้หาแผ่นที่ใกล้จุดแตะที่สุด
                 คีย์บอร์ด (detail 0 ไม่มีพิกัด) ใช้แผ่นที่โฟกัสอยู่ — วิธีเดียวกับเกมหยอดรูปทรง */
              if (event.detail === 0) { place(selected, `sequence-slot-${piece.rank}`); return; }
              const target = dropTargetAt(event.clientX, event.clientY);
              if (target && !target.hasAttribute('disabled')) place(selected, target.dataset.dropId!);
            }}>
            <Image className="seq-pad" src={SEQ_PAD.src} width={SEQ_PAD.width} height={SEQ_PAD.height} alt="" unoptimized draggable={false} />
            {filled && <span className="seq-home-object"><SequenceToy kind={round.kind} rank={piece.rank} /></span>}
            {hint === piece.rank && <span className="gc-hint-arrow" aria-hidden="true">↓</span>}
            {filled && <span className="shp-spark" aria-hidden="true"><i /><i /><i /></span>}
          </button>;
        })}
      </div>
    </IslandBoard>

    {/* ของที่รอเรียงอยู่ใต้เกาะ (เกาะรอบ 1 ไม่มีลานว่างด้านหน้า) ช่องของชิ้นที่วางแล้วยังเว้นไว้ ชิ้นอื่นจึงไม่เลื่อนขณะเด็กเล็ง */}
    <div className="seq-tray" role="group" aria-label="ของเล่นที่รอเรียง / Toys to order">
      {round.tray.map(piece => <div className="seq-tray-cell" key={piece.id}>
        {!placed.includes(piece.id) &&
          <DragItem id={piece.id} label={`${piece.th} / ${piece.en}`} selected={selected === piece.id}
            onSelect={() => { onTap(); setSelected(piece.id); setHint(null); setNotice(`เลือก ${piece.th} แล้ว แตะแผ่นทองที่ต้องการวาง`); }} onDrop={place}>
            <SequenceToy kind={round.kind} rank={piece.rank} />
          </DragItem>}
      </div>)}
    </div>
  </div>;
}
