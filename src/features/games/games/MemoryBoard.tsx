'use client';
import { useEffect, useRef, useState } from 'react';
import { GameImage as Image } from '../components/GameImage';
import { createMemory, flipCard, memoryMatches, settleMemory } from '../engine/rules';
import { IslandBoard } from '../components/diorama/IslandBoard';
import { CARD_ART, ISLAND_ART, memorySymbols } from '../data/memoryArt';
import type { PlayProps } from '../components/GameShell';

export default function MemoryBoard({ level, onProgress, onFeedback, onComplete, onTap }: PlayProps) {
  const count = [3, 6, 8][level - 1];
  const [state, setState] = useState(() => createMemory(memorySymbols.slice(0, count).map(s => s.id)));
  const stateRef = useRef(state);
  const firstCard = useRef<HTMLButtonElement>(null);
  useEffect(() => { firstCard.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => { onProgress(state.matched.length, count); }, [state.matched.length, count, onProgress]);
  useEffect(() => {
    if (state.open.length !== 2) return;
    const match = memoryMatches(state);
    const timer = setTimeout(() => { onFeedback(match); const next = settleMemory(state); stateRef.current = next; setState(next); }, match ? 450 : 1100);
    return () => clearTimeout(timer);
  }, [state, onFeedback]);
  useEffect(() => { if (state.matched.length !== count) return; const timer = setTimeout(onComplete, 850); return () => clearTimeout(timer); }, [state.matched.length, count, onComplete]);

  return <div className="mem-scene" data-cards={count * 2}>
    <p className="mem-stats">เปิดไปแล้ว {state.moves} ครั้ง <span lang="en">· {state.moves} moves</span></p>
    <IslandBoard {...ISLAND_ART} label="กระดานการ์ดความจำ / Memory card board">
      <div className="mem-grid" data-count={count * 2}>{state.deck.map((card, i) => {
        const shown = state.open.includes(card.id) || state.matched.includes(card.value);
        const matched = state.matched.includes(card.value);
        const symbol = memorySymbols.find(s => s.id === card.value)!;
        return <button
          key={card.id}
          ref={i === 0 ? firstCard : undefined}
          className="mem-card"
          data-shown={shown || undefined}
          data-matched={matched || undefined}
          aria-label={shown ? `${symbol.th} / ${symbol.en}${matched ? ' จับคู่แล้ว' : ''}` : `เปิดการ์ด ${i + 1} / Card ${i + 1}`}
          aria-disabled={matched || state.open.length === 2 || state.open.includes(card.id)}
          onClick={() => {
            const next = flipCard(stateRef.current, card.id);
            // flipCard คืนสถานะเดิมถ้าการ์ดใบนั้นกดไม่ได้ จึงเช็คก่อนว่าพลิกจริงค่อยมีเสียง
            if (next !== stateRef.current) onTap();
            stateRef.current = next; setState(next);
          }}
        >
          {/* ทั้งสองหน้าอยู่ใน DOM พร้อมกัน การพลิกจึงเป็น rotateY จริง ไม่ใช่การสลับเนื้อหา */}
          <span className="mem-card-inner" aria-hidden="true">
            <span className="mem-face mem-face-back">
              <Image src={CARD_ART.back} width={CARD_ART.width} height={CARD_ART.height} alt="" sizes="(max-width: 639px) 26vw, 150px" />
            </span>
            <span className="mem-face mem-face-front">
              <Image src={`/games/memory/${symbol.art}.webp`} width={CARD_ART.width} height={CARD_ART.height} alt="" sizes="(max-width: 639px) 26vw, 150px" />
            </span>
          </span>
          {matched && <span className="mem-spark" aria-hidden="true"><i /><i /><i /></span>}
        </button>;
      })}</div>
    </IslandBoard>
  </div>;
}
