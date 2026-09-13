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
