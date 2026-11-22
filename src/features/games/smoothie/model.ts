import type { Text } from '@/i18n/config';

export type Fruit = 'orange' | 'banana' | 'berry';
export type Upgrade = 'berry' | 'gold';
export type Stage = 'order' | 'prepare' | 'blend' | 'pour' | 'pouring' | 'serve' | 'collect';
export const customers = ['sabir', 'safi', 'hadi'] as const;
export const fruitNames: Record<Fruit, Text> = {
  orange: { th: 'ส้ม', en: 'Orange' }, banana: { th: 'กล้วย', en: 'Banana' }, berry: { th: 'สตรอว์เบอร์รี', en: 'Strawberry' },
};
export const prices: Record<Upgrade, number> = { berry: 5, gold: 12 };
export type Ledger = { served: number; coins: number; berry: boolean; gold: boolean };
export const emptyShop: Ledger = { served: 0, coins: 0, berry: false, gold: false };
export const SAVE_KEY = 'little-ummah:games:smoothie:v1';
export function readLedger(raw: string | null): Ledger {
  if (!raw) return emptyShop;
  try {
    const v = JSON.parse(raw);
    if (v && Number.isSafeInteger(v.served) && v.served >= 0 && Number.isSafeInteger(v.coins) && v.coins >= 0) {
      return { served: v.served, coins: v.coins, berry: v.berry === true, gold: v.gold === true };
    }
  } catch { /* A damaged save starts a new shop. */ }
  return emptyShop;
}
const originalMenu: Fruit[][] = [['orange', 'banana'], ['banana', 'banana'], ['orange', 'orange'], ['orange', 'banana', 'orange']];
const berryMenu: Fruit[][] = [['berry', 'orange'], ['banana', 'berry'], ['berry', 'berry', 'orange'], ['banana', 'orange', 'berry']];
const extendedMenu = [...berryMenu, ...originalMenu];
export function ticket(shop: Ledger) {
  const menu = shop.berry ? extendedMenu : originalMenu;
  const fruit = menu[shop.served % menu.length];
  return { id: shop.served, fruit, value: fruit.length * 2 + (fruit.includes('berry') ? 3 : 1) };
}
export function needsFruit(recipe: readonly Fruit[], inJug: readonly Fruit[], fruit: Fruit) {
  return inJug.filter(f => f === fruit).length < recipe.filter(f => f === fruit).length;
}
export function collect(shop: Ledger, order: ReturnType<typeof ticket>): Ledger {
  if (shop.served !== order.id) return shop;
  return { ...shop, served: shop.served + 1, coins: shop.coins + order.value };
}
export function unlock(shop: Ledger, item: Upgrade): Ledger {
  if (shop[item] || shop.coins < prices[item]) return shop;
  return { ...shop, [item]: true, coins: shop.coins - prices[item] };
}
