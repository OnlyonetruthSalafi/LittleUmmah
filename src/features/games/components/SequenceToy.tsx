import type { CSSProperties } from 'react';
import { GameImage } from './GameImage';
import type { SequenceLevel } from '../data/sequence';

/** Shared camera and block artwork keep the tray and placed objects identical. */
export function SequenceToy({ kind, rank }: { kind: SequenceLevel['kind']; rank: number }) {
  return <span className="seq-toy" data-kind={kind} style={{ '--toy-size': `${48 + rank * 26}%` } as CSSProperties} aria-hidden="true">
    {Array.from({ length: kind === 'size' ? 1 : rank + 1 }, (_, index) =>
      <GameImage key={index} src="/games/sequence/block.webp" alt="" width={320} height={320} draggable={false}
        style={{ '--block-index': index, '--block-x': `${index % 2 * 48}%`, '--block-y': `${Math.floor(index / 2) * 42}%` } as CSSProperties} sizes="(max-width: 639px) 75px, 130px" />)}
  </span>;
}
