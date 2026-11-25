import type { Text } from '@/i18n/config';

export type Fruit = 'orange' | 'banana' | 'berry' | 'mango' | 'melon';
export type Upgrade = 'berry' | 'gold' | 'flowers' | 'mango' | 'lantern' | 'bigCup' | 'melon';
export type Stage = 'order' | 'prepare' | 'blend' | 'pour' | 'pouring' | 'serve' | 'collect';
export const customers = ['sabir', 'safi', 'hadi'] as const;
export const fruitKinds: Fruit[] = ['orange', 'banana', 'berry', 'mango', 'melon'];
export const fruitNames: Record<Fruit, Text> = {
  orange: { th: 'ส้ม', en: 'Orange' }, banana: { th: 'กล้วย', en: 'Banana' }, berry: { th: 'สตรอว์เบอร์รี', en: 'Strawberry' },
  mango: { th: 'มะม่วง', en: 'Mango' }, melon: { th: 'แตงโม', en: 'Watermelon' },
};

/**
 * The shop grows in this order. Each item needs coins, a number of cups already sold,
 * and sometimes an earlier item, so the menu moves from two-fruit cups to four-fruit cups.
 * About 15 cups unlock everything (103 coins in all).
 */
export const upgrades: { id: Upgrade; price: number; served: number; needs?: Upgrade }[] = [
  { id: 'berry', price: 5, served: 1 },
  { id: 'gold', price: 12, served: 3 },
  { id: 'flowers', price: 8, served: 4 },
  { id: 'mango', price: 15, served: 6, needs: 'berry' },
  { id: 'lantern', price: 18, served: 8, needs: 'flowers' },
  { id: 'bigCup', price: 20, served: 10, needs: 'mango' },
  { id: 'melon', price: 25, served: 13, needs: 'bigCup' },
];
export const prices = Object.fromEntries(upgrades.map(u => [u.id, u.price])) as Record<Upgrade, number>;
/** Decorations make the shop nicer, and each one adds a one-coin tip to every cup. */
export const decorations: Upgrade[] = ['flowers', 'lantern'];

/** `menuStart` is the cup count when recipes were last added, so the next customer orders the newest recipe. */
export type Ledger = { served: number; coins: number; earnedCoins: number; menuStart: number } & Record<Upgrade, boolean>;
export const emptyShop: Ledger = {
  served: 0, coins: 0, earnedCoins: 0, menuStart: 0, berry: false, gold: false, flowers: false, mango: false, lantern: false, bigCup: false, melon: false,
};
export const SAVE_KEY = 'little-ummah:games:smoothie:v1';
export function readLedger(raw: string | null): Ledger {
  if (!raw) return emptyShop;
  try {
    const v = JSON.parse(raw);
    if (v && Number.isSafeInteger(v.served) && v.served >= 0 && Number.isSafeInteger(v.coins) && v.coins >= 0) {
      // Saves from before the item shelf only had berry and gold. New items start unowned.
      const menuStart = Number.isSafeInteger(v.menuStart) && v.menuStart >= 0 ? v.menuStart : 0;
      // Earlier saves tracked cups, not lifetime receipts. Every cup paid at least five coins.
      const earnedCoins = Number.isSafeInteger(v.earnedCoins) && v.earnedCoins >= 0 ? v.earnedCoins : Math.min(Number.MAX_SAFE_INTEGER, v.served * 5);
      const shop: Ledger = { ...emptyShop, served: v.served, coins: v.coins, earnedCoins, menuStart };
      for (const { id } of upgrades) shop[id] = v[id] === true;
      return shop;
    }
  } catch { /* A damaged save starts a new shop. */ }
  return emptyShop;
}

const originalMenu: Fruit[][] = [['orange', 'banana'], ['banana', 'banana'], ['orange', 'orange'], ['orange', 'banana', 'orange']];
const berryMenu: Fruit[][] = [['berry', 'orange'], ['banana', 'berry'], ['berry', 'berry', 'orange'], ['banana', 'orange', 'berry']];
const mangoMenu: Fruit[][] = [['mango', 'banana'], ['mango', 'berry', 'orange'], ['mango', 'mango', 'banana']];
const bigCupMenu: Fruit[][] = [['banana', 'banana', 'berry', 'berry'], ['orange', 'mango', 'orange', 'mango'], ['berry', 'banana', 'mango', 'orange']];
const melonMenu: Fruit[][] = [['melon', 'berry'], ['melon', 'mango', 'orange'], ['melon', 'melon', 'banana', 'berry']];
/** Newest recipes first. With `menuStart` the customer after a purchase orders the first new recipe. */
export function menu(shop: Ledger): Fruit[][] {
  return [
    ...(shop.melon ? melonMenu : []),
    ...(shop.bigCup ? bigCupMenu : []),
    ...(shop.mango ? mangoMenu : []),
    ...(shop.berry ? berryMenu : []),
    ...originalMenu,
  ];
}
export const allRecipes: Fruit[][] = [...originalMenu, ...berryMenu, ...mangoMenu, ...bigCupMenu, ...melonMenu];
const bonus: Partial<Record<Fruit, number>> = { berry: 3, mango: 4, melon: 5 };
export function tips(shop: Ledger) {
  return decorations.filter(item => shop[item]).length;
}
export function ticket(shop: Ledger) {
  const list = menu(shop);
  const n = list.length;
  // Non-negative: a reload between buying and serving remounts a customer before menuStart.
  const fruit = list[((shop.served - shop.menuStart) % n + n) % n];
  const extra = Math.max(1, ...fruit.map(kind => bonus[kind] ?? 1));
  return { id: shop.served, fruit, value: fruit.length * 2 + extra + tips(shop) };
}
export function needsFruit(recipe: readonly Fruit[], inJug: readonly Fruit[], fruit: Fruit) {
  return inJug.filter(f => f === fruit).length < recipe.filter(f => f === fruit).length;
}
export function collect(shop: Ledger, order: ReturnType<typeof ticket>): Ledger {
  if (shop.served !== order.id) return shop;
  return { ...shop, served: shop.served + 1, coins: shop.coins + order.value, earnedCoins: shop.earnedCoins + order.value };
}
/** Why an item can't be bought yet, checked in the order a child would meet them. */
export type Blocker = { kind: 'owned' } | { kind: 'needs'; item: Upgrade } | { kind: 'served'; count: number } | { kind: 'coins'; count: number };
export function blocker(shop: Ledger, item: Upgrade): Blocker | undefined {
  const rule = upgrades.find(u => u.id === item)!;
  if (shop[item]) return { kind: 'owned' };
  if (rule.needs && !shop[rule.needs]) return { kind: 'needs', item: rule.needs };
  if (shop.served < rule.served) return { kind: 'served', count: rule.served - shop.served };
  if (shop.coins < rule.price) return { kind: 'coins', count: rule.price - shop.coins };
  return undefined;
}
/** Items that add recipes. The customer already at the counter keeps the order they gave. */
const addsRecipes: Upgrade[] = ['berry', 'mango', 'bigCup', 'melon'];
export function unlock(shop: Ledger, item: Upgrade): Ledger {
  if (blocker(shop, item)) return shop;
  const next = { ...shop, [item]: true, coins: shop.coins - prices[item] };
  return addsRecipes.includes(item) ? { ...next, menuStart: shop.served + 1 } : next;
}
/** Fruit the child can pick from at the counter. */
export function stocked(shop: Pick<Ledger, 'berry' | 'mango' | 'melon'>): Fruit[] {
  return fruitKinds.filter(kind => kind === 'orange' || kind === 'banana' || shop[kind]);
}
