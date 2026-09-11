import type { GameIconName } from "./games";

type MemoryItem = { icon: GameIconName; nameTh: string; nameEn: string };
export type MemoryCard = { id: string; item: MemoryItem };
export type MemoryState = {
  deck: MemoryCard[];
  started: boolean;
  open: string[];
  matched: GameIconName[];
  moves: number;
};

export function createMemoryState(items: MemoryItem[]): MemoryState {
  return {
    deck: items.flatMap(item => [0, 1].map(copy => ({ id: `${item.icon}-${copy}`, item }))),
    started: false,
    open: [],
    matched: [],
    moves: 0,
  };
}

// แยกกติกาจากหน้าจอเพื่อทดสอบการกดซ้ำและการล็อก โดยไม่ผูกกับเวลาแอนิเมชัน
export function startMemoryRound(state: MemoryState, random = Math.random): MemoryState {
  const deck = [...state.deck];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return { deck, started: true, open: [], matched: [], moves: 0 };
}

export function chooseMemoryCard(state: MemoryState, id: string): MemoryState {
  const card = state.deck.find(card => card.id === id);
  if (!state.started || !card || state.open.length === 2 || state.open.includes(id) || state.matched.includes(card.item.icon)) return state;
  return {
    ...state,
    open: [...state.open, id],
    moves: state.moves + (state.open.length === 1 ? 1 : 0),
  };
}

export function isMemoryMatch(state: MemoryState): boolean {
  if (state.open.length !== 2) return false;
  const [first, second] = state.open.map(id => state.deck.find(card => card.id === id)!);
  return first.item.icon === second.item.icon;
}

export function settleMemoryTurn(state: MemoryState): MemoryState {
  if (state.open.length !== 2) return state;
  const item = state.deck.find(card => card.id === state.open[0])!.item;
  return {
    ...state,
    open: [],
    matched: isMemoryMatch(state) ? [...state.matched, item.icon] : state.matched,
  };
}
