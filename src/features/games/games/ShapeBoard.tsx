'use client';
import { fmt } from '@/i18n/dict';
import { useDict } from '@/i18n/LocaleProvider';

import { useEffect, useRef, useState } from 'react';
import { GameImage as Image } from '../components/GameImage';
import { IslandBoard } from '../components/diorama/IslandBoard';
import { DragItem } from '../components/DragItem';
import { dropTargetAt } from '../components/dropTarget';
import { canPlace, levelComplete, shuffle } from '../engine/rules';
import { BLOCK, HOLES, PLATE, SHAPE_ISLAND, blockArt, plateFor, shapeNames, shapeOrder, type ShapeId } from '../data/shapeArt';
import type { PlayProps } from '../components/GameShell';

/* เกมหยอดรูปทรงแบบ 2.5D
 *
 * แผ่นฐานเป็นภาพเดียว หลุมที่กดได้เป็นกล่องใสวางทับตำแหน่งหลุมในภาพ
 * พอหยอดถูก แผ่นจะสลับไปเป็นภาพที่มีรูปทรง "ที่หยอดไปแล้วทั้งหมด" อยู่ในหลุม แล้วมีประกายขึ้น
 * ของที่หยอดก่อนหน้าจึงยังอยู่ให้เห็น เด็กเห็นความคืบหน้าสะสมบนแผ่นจริงๆ
 * (ประกอบจากถาดเปล่าและภาพหยอดครบ โดยเปลี่ยนเฉพาะพิกเซลภายในหลุม)
 *
 * ถาดอยู่ด้านหลัง บล็อกที่ลากได้อยู่ด้านหน้าของผิวครีมเดียวกัน
 */
export default function ShapeBoard({ onProgress, onFeedback, onComplete, onTap }: PlayProps) {
  const { t, sub, pick, pickSub } = useDict();
  // ใช้ครบห้ารูปทรงเสมอ เพราะหลุมทั้งห้าวาดติดมากับภาพแผ่นฐาน
  const [pieces] = useState<ShapeId[]>(() => shuffle(shapeOrder));
  const items = pieces.map(shape => ({ id: shape, target: shape }));
  const targets = shapeOrder.map(shape => ({ id: shape }));

  const [placed, setPlaced] = useState<ShapeId[]>([]);
  const placedRef = useRef<ShapeId[]>([]);
  const [selected, setSelected] = useState<ShapeId | null>(null);
  const [hint, setHint] = useState<ShapeId | null>(null);
  const [landed, setLanded] = useState<ShapeId | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const boardRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { onProgress(placed.length, pieces.length); }, [placed.length, pieces.length, onProgress]);

  const place = (itemId: string, targetId: string) => {
    if (placedRef.current.includes(itemId as ShapeId)) return;
    const correct = canPlace(items, targets, placedRef.current, itemId, targetId);
    onFeedback(correct);
    if (!correct) return;
    const next = [...placedRef.current, itemId as ShapeId];
    placedRef.current = next; setPlaced(next); setSelected(null); setHint(null); setLanded(itemId as ShapeId);
    setAnnouncement(fmt(t.games.shape.placedCount, { name: pick(shapeNames[itemId as ShapeId]), done: next.length, total: pieces.length }));
    if (levelComplete(pieces.length, next.length)) timer.current = setTimeout(onComplete, 1100);
    else {
      const nextPiece = pieces.find(p => !next.includes(p));
      requestAnimationFrame(() => { if (nextPiece) boardRef.current?.querySelector<HTMLButtonElement>(`[data-item-id="${nextPiece}"]`)?.focus({ preventScroll: true }); });
    }
  };

  return <div ref={boardRef} className="shp-scene">
    <div className="gc-board-tools">
      {/* ป้ายชื่อใต้บล็อกทั้งห้าชิ้นเบียดกันจนอ่านไม่ออกบนมือถือ
          จึงเหลือป้ายเดียว บอกชื่อชิ้นที่เด็กเลือกอยู่ (ชื่อครบยังอยู่ใน aria-label ของทุกชิ้น) */}
      {selected && <p className="shp-picked">{fmt(t.games.shape.picked, { name: pick(shapeNames[selected]) })}{sub && <span lang="en">{fmt(sub.games.shape.pickedSecondary, { name: pickSub(shapeNames[selected])! })}</span>}</p>}
      <button className="gc-button" onClick={() => { const piece = (selected && !placed.includes(selected) ? selected : pieces.find(p => !placed.includes(p))) ?? null; if (piece) { setSelected(piece); setHint(piece); setAnnouncement(fmt(t.games.shape.hintSlot, { name: pick(shapeNames[piece]) })); } }}>{t.games.shape.hint}{sub && <small lang="en">{sub.games.shape.hint}</small>}</button>
    </div>
    <p className="sr-only" role="status">{announcement}</p>

    <IslandBoard {...SHAPE_ISLAND} className="shp-island" label={t.games.shape.island}>
      <div className="shp-plate" data-landed={landed ?? undefined}>
        {/* แผ่นฐานเป็นภาพนิ่ง หลุมที่กดได้ลอยอยู่เหนือภาพตามตำแหน่งใน HOLES */}
        {/* unoptimized: ตัว optimizer ของ next/image ทำ alpha ของไฟล์ชุดนี้หาย กลายเป็นกล่องดำ
            ไฟล์ต้นทางเป็น WebP 900px ~100KB ที่ย่อมาพอดีอยู่แล้ว ไม่ได้อะไรเพิ่มจากการ optimize ซ้ำ */}
        <Image className="shp-plate-art" src={plateFor(placed)} width={PLATE.width} height={PLATE.height} alt="" priority unoptimized />
        {shapeOrder.map(shape => {
          const hole = HOLES[shape];
          const filled = placed.includes(shape);
          const used = pieces.includes(shape);
          return <button
            key={shape}
            data-drop-id={shape}
            className={`shp-hole ${filled ? 'shp-hole-filled' : ''} ${hint === shape ? 'gc-hint' : ''}`}
            style={{ left: `${hole.x}%`, top: `${hole.y}%`, width: `${hole.w}%`, height: `${hole.h}%` }}
            disabled={filled || !used}
            aria-label={fmt(t.games.shape.slot, { name: pick(shapeNames[shape]), secondary: pickSub(shapeNames[shape])!, placed: filled ? t.games.shape.placed : '' })}
            onClick={event => {
              if (!selected) { setAnnouncement(t.games.shape.selectFirst); return; }
              /* กรอบหลุมคาบเกี่ยวกัน ชั้นบนสุดที่รับคลิกจึงไม่ใช่หลุมที่เด็กเล็งเสมอไป
                 แตะด้วยนิ้ว/เมาส์ให้หาหลุมจากพิกัดจริง ส่วนคีย์บอร์ด (detail 0 ไม่มีพิกัด) ใช้หลุมที่โฟกัสอยู่ */
              if (event.detail === 0) { place(selected, shape); return; }
              const target = dropTargetAt(event.clientX, event.clientY);
              // ช่องที่หยอดแล้วเป็นช่องปิด แตะโดนแล้วไม่ต้องทำอะไร ไม่ใช่ตอบผิด
              if (target && !target.hasAttribute('disabled')) place(selected, target.dataset.dropId!);
            }}
          >
            {hint === shape && <span className="gc-hint-arrow" aria-hidden="true">↓</span>}
            {filled && <span className="shp-spark" aria-hidden="true"><i /><i /><i /></span>}
          </button>;
        })}
      </div>
    {/* ทั้งถาดและชิ้นส่วนอ้างอิงผิวเกาะเดียวกัน */}
    <div className="shp-tray-dock">
      <div className="gc-tray" aria-label={t.games.shape.pieces}>{pieces.map(shape => <div key={shape} className={`gc-tray-slot ${placed.includes(shape) ? 'gc-done-slot' : ''}`}>
        {placed.includes(shape)
          ? <span className="gc-done-mark" aria-label={fmt(t.games.shape.placedItem, { name: pick(shapeNames[shape]) })}>✓</span>
          : <DragItem id={shape} label={(pickSub(shapeNames[shape]) ? `${pick(shapeNames[shape])} / ${pickSub(shapeNames[shape])}` : pick(shapeNames[shape]))} selected={selected === shape} onSelect={() => { onTap(); setSelected(shape); setHint(null); setAnnouncement(fmt(t.games.shape.selected, { name: pick(shapeNames[shape]) })); }} onDrop={place}>
              <Image className="shp-block" src={blockArt(shape)} width={BLOCK.width} height={BLOCK.height} alt="" unoptimized draggable={false} />
            </DragItem>}
      </div>)}</div>
    </div>
    </IslandBoard>
  </div>;
}
