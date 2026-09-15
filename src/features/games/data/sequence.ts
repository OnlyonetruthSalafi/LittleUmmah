export type SequencePiece = { id: string; rank: number; th: string; en: string };
export type SequenceLevel = {
  kind: 'size' | 'count' | 'height'; th: string; en: string; pieces: SequencePiece[];
};
export function sequenceLevel(level: number): SequenceLevel {
  if (level === 1) return {
    kind: 'size', th: 'เรียงบล็อกจากเล็กไปใหญ่', en: 'Order the blocks from small to large',
    pieces: ['เล็ก', 'กลาง', 'ใหญ่'].map((th, i) => ({ id: `size-${i}`, rank: i, th, en: ['Small', 'Medium', 'Large'][i] })),
  };
  const kind = level === 2 ? 'count' : 'height';
  return { kind, th: kind === 'count' ? 'นับบล็อก แล้วเรียงจากน้อยไปมาก' : 'เรียงหอคอยจากเตี้ยไปสูง',
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
