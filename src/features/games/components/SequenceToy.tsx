import type { CSSProperties } from 'react';
import { GameImage } from './GameImage';
import type { SequenceLevel } from '../data/sequence';
import { SEQ_BLOCK } from '../data/sequenceArt';

/** ลูกบาศก์ภาพเดียวกันทั้งในแถวรอเรียงและบนแท่น เด็กจึงเทียบได้ว่าเป็นชิ้นเดียวกัน
 *  size = ลูกเดียวขยายตามลำดับ · count = กองแบบ 2×2 · height = ซ้อนเป็นหอคอย */
export function SequenceToy({ kind, rank }: { kind: SequenceLevel['kind']; rank: number }) {
  const blocks = kind === 'size' ? 1 : rank + 1;
  return <span className="seq-toy" data-kind={kind} style={{ '--toy-size': `${42 + rank * 20}%` } as CSSProperties} aria-hidden="true">
    {Array.from({ length: blocks }, (_, index) =>
      <GameImage key={index} src={SEQ_BLOCK.src} alt="" width={SEQ_BLOCK.width} height={SEQ_BLOCK.height} draggable={false} unoptimized
        style={{ '--block-index': index, '--block-col': index % 2, '--block-row': Math.floor(index / 2) } as CSSProperties} />)}
  </span>;
}
