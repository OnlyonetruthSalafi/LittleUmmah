import type { Text } from '@/i18n/config';

export type SequenceArt = 'block' | 'ball' | 'cylinder' | 'wood';
export type SequencePiece = Text & { id: string; rank: number };
export type SequenceLevel = Text & {
  kind: 'size' | 'count' | 'height'; art: SequenceArt; pieces: SequencePiece[];
};
/** Each level keeps its original rule and slot count. Variant 0 is the original set. */
export function sequenceLevel(level: number, variant = 0): SequenceLevel {
  if (variant === 1) {
    if (level === 1) return {
      kind: 'size', art: 'ball', th: 'เรียงลูกบอลจากเล็กไปใหญ่', en: 'Order the balls from small to large',
      pieces: [
        { th: 'ลูกบอลเล็ก', en: 'Small ball' },
        { th: 'ลูกบอลกลาง', en: 'Medium ball' },
        { th: 'ลูกบอลใหญ่', en: 'Large ball' },
      ].map((label, rank) => ({ ...label, id: `ball-${rank}`, rank })),
    };
    const count = level === 2;
    return {
      kind: count ? 'count' : 'height', art: count ? 'cylinder' : 'wood',
      th: count ? 'นับบล็อกทรงกระบอก แล้วเรียงจากน้อยไปมาก' : 'เรียงหอคอยไม้จากเตี้ยไปสูง',
      en: count ? 'Count the cylinder blocks. Order from fewest to most' : 'Order the wooden towers from short to tall',
      pieces: Array.from({ length: 4 }, (_, rank) => ({
        id: `${count ? 'cylinder' : 'wood'}-${rank}`, rank,
        th: count ? `บล็อกทรงกระบอก ${rank + 1} ชิ้น` : `หอคอยไม้ ${rank + 1} ชั้น`,
        en: count ? `${rank + 1} cylinder block${rank ? 's' : ''}` : `${rank + 1}-storey wooden tower`,
      })),
    };
  }
  if (level === 1) return {
    kind: 'size', art: 'block', th: 'เรียงบล็อกจากเล็กไปใหญ่', en: 'Order the blocks from small to large',
    pieces: ['เล็ก', 'กลาง', 'ใหญ่'].map((th, i) => ({ id: `size-${i}`, rank: i, th, en: ['Small', 'Medium', 'Large'][i] })),
  };
  const kind = level === 2 ? 'count' : 'height';
  return { kind, art: 'block', th: kind === 'count' ? 'นับบล็อก แล้วเรียงจากน้อยไปมาก' : 'เรียงหอคอยจากเตี้ยไปสูง',
    en: kind === 'count' ? 'Count the blocks. Order from fewest to most' : 'Order the towers from short to tall',
    pieces: Array.from({ length: 4 }, (_, i) => ({ id: `${kind}-${i}`, rank: i,
      th: kind === 'count' ? `${i + 1} บล็อก` : `หอคอย ${i + 1} ชั้น`,
      en: kind === 'count' ? `${i + 1} block${i ? 's' : ''}` : `${i + 1}-storey tower` })),
  };
}

/** Reject unknown pieces, duplicate placements, occupied homes and wrong ranks. */
export function placeSequence(pieces: SequencePiece[], placed: string[], id: string, target: string): string[] {
  const piece = pieces.find(p => p.id === id);
  if (!piece || placed.includes(id) || target !== `sequence-slot-${piece.rank}`) return placed;
  if (placed.some(p => pieces.find(item => item.id === p)?.rank === piece.rank)) return placed;
  return [...placed, id];
}

export function mixSequence(pieces: SequencePiece[], random = Math.random): SequencePiece[] {
  const mixed = [...pieces];
  for (let i = mixed.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
  }
  // Never give away a finished ordering on a fresh round.
  if (mixed.length > 1 && mixed.every((piece, i) => piece.rank === i)) mixed.push(mixed.shift()!);
  return mixed;
}
