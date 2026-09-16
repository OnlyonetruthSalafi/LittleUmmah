export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function canPlace(items: readonly { id: string; target: string }[], targets: readonly { id: string }[], placed: readonly string[], itemId: string, targetId: string): boolean {
  return !placed.includes(itemId) && targets.some(t => t.id === targetId) && items.some(i => i.id === itemId && i.target === targetId);
}
export function levelComplete(total: number, completed: number): boolean { return total > 0 && completed === total; }
// Every finished level earns the full reward. Mistakes are practice, never a penalty.
export function completionStars(): number { return 3; }
export type MemoryState = { deck: { id: string; value: string }[]; open: string[]; matched: string[]; moves: number };
export function createMemory(values: readonly string[], random = Math.random): MemoryState {
  return { deck: shuffle(values.flatMap(value => [0, 1].map(copy => ({ id: `${value}-${copy}`, value }))), random), open: [], matched: [], moves: 0 };
}
export function flipCard(state: MemoryState, id: string): MemoryState {
  const card = state.deck.find(c => c.id === id);
  if (!card || state.open.length >= 2 || state.open.includes(id) || state.matched.includes(card.value)) return state;
  return { ...state, open: [...state.open, id], moves: state.moves + (state.open.length === 1 ? 1 : 0) };
}
export function memoryMatches(state: MemoryState): boolean {
  return state.open.length === 2 && state.deck.find(c => c.id === state.open[0])?.value === state.deck.find(c => c.id === state.open[1])?.value;
}
export function settleMemory(state: MemoryState): MemoryState {
  if (state.open.length !== 2) return state;
  const value = state.deck.find(c => c.id === state.open[0])!.value;
  return { ...state, open: [], matched: memoryMatches(state) ? [...state.matched, value] : state.matched };
}

/* หลุมของเกมหยอดรูปทรงวาดแบบ isometric กรอบสี่เหลี่ยมของแต่ละหลุมจึงคาบเกี่ยวกันได้
   (หลุมดาวกินเข้าไปในเนื้อวงกลมกับสี่เหลี่ยมจัตุรัสที่เด็กเห็นราว 4%)
   จุดที่ตกอยู่ในกรอบหลายใบต้องตัดสินด้วยกรอบที่จุดนั้น "อยู่ลึกที่สุด"
   ไม่ใช่ชั้นบนสุดใน DOM เพราะชั้นบนสุดคือใบที่ render ทีหลัง ไม่ใช่ใบที่เด็กเล็ง

   วัดความลึกเป็นระยะจากจุดศูนย์กลางที่หารด้วยครึ่งขนาดของกรอบใบนั้นเอง
   ระยะดิบใช้ไม่ได้ เพราะหลุมสี่เหลี่ยมผืนกว้างมีขอบที่ห่างจากศูนย์กลางตัวเองกว่าศูนย์กลางหลุมดาวที่อยู่ทแยงมุม */
export function nearestDropTarget<T extends { cx: number; cy: number; rx: number; ry: number }>(x: number, y: number, candidates: readonly T[]): T | null {
  let best: T | null = null, bestDepth = Infinity;
  for (const candidate of candidates) {
    const depth = Math.hypot((x - candidate.cx) / (candidate.rx || 1), (y - candidate.cy) / (candidate.ry || 1));
    if (depth < bestDepth) { bestDepth = depth; best = candidate; }
  }
  return best;
}
