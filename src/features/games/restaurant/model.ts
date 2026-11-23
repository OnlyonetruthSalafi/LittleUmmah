import type { Text } from '@/i18n/config';
import type { Crop } from '../garden/model';

/*
  Restaurant (VIP game 3). The child takes friends to lunch, reads a picture menu, and picks a dish
  for each friend that matches what they asked for, without spending more than the lunch money.
  The puzzle is reasoning (hot/cold, spicy, big, an ingredient) plus a simple budget sum.
*/
export type DishId = 'salad' | 'pumpkin-soup' | 'fried-rice' | 'grilled-corn' | 'spicy-stirfry' | 'sandwich' | 'papaya-salad' | 'pumpkin-egg';
export type Dish = { id: DishId; name: Text; price: number; hot: boolean; spicy: boolean; big: boolean; has: Crop[] };
export const dishes: Dish[] = [
  { id: 'salad', name: { th: 'สลัดผัก', en: 'Salad' }, price: 4, hot: false, spicy: false, big: false, has: ['lettuce', 'tomato', 'carrot'] },
  { id: 'pumpkin-soup', name: { th: 'ซุปฟักทอง', en: 'Pumpkin soup' }, price: 5, hot: true, spicy: false, big: false, has: ['pumpkin', 'carrot'] },
  { id: 'fried-rice', name: { th: 'ข้าวผัดผัก', en: 'Vegetable fried rice' }, price: 6, hot: true, spicy: false, big: true, has: ['carrot', 'corn'] },
  { id: 'grilled-corn', name: { th: 'ข้าวโพดย่าง', en: 'Grilled corn' }, price: 3, hot: true, spicy: false, big: false, has: ['corn'] },
  { id: 'spicy-stirfry', name: { th: 'ผัดผักรสจัด', en: 'Spicy stir-fry' }, price: 6, hot: true, spicy: true, big: true, has: ['carrot', 'corn', 'tomato'] },
  { id: 'sandwich', name: { th: 'แซนด์วิชผัก', en: 'Vegetable sandwich' }, price: 3, hot: false, spicy: false, big: false, has: ['lettuce', 'tomato'] },
  { id: 'papaya-salad', name: { th: 'ส้มตำ', en: 'Papaya salad' }, price: 4, hot: false, spicy: true, big: false, has: ['carrot', 'tomato'] },
  { id: 'pumpkin-egg', name: { th: 'ฟักทองผัดไข่', en: 'Pumpkin with egg' }, price: 5, hot: true, spicy: false, big: true, has: ['pumpkin'] },
];
export const dishById = Object.fromEntries(dishes.map(d => [d.id, d])) as Record<DishId, Dish>;

export type Want = { kind: 'has'; crop: Crop } | { kind: 'hot' } | { kind: 'cold' } | { kind: 'mild' } | { kind: 'spicy' } | { kind: 'big' };
export function pleases(dish: Dish, wants: Want[]) {
  return wants.every(w => w.kind === 'has' ? dish.has.includes(w.crop)
    : w.kind === 'hot' ? dish.hot : w.kind === 'cold' ? !dish.hot
    : w.kind === 'mild' ? !dish.spicy : w.kind === 'spicy' ? dish.spicy : dish.big);
}

export const diners = ['hadi', 'safi', 'sabir'] as const;
export type Diner = typeof diners[number];
export type Seat = { diner: Diner; wants: Want[]; line: string };
export type Meal = { id: number; seats: Seat[]; budget: number };

/** Easy to hard: one friend and one wish, then three friends with two wishes each and a tight budget. */
export const meals: Meal[] = [
  { id: 1, budget: 6, seats: [{ diner: 'hadi', wants: [{ kind: 'has', crop: 'carrot' }], line: 'm1-hadi' }] },
  { id: 2, budget: 5, seats: [{ diner: 'safi', wants: [{ kind: 'hot' }], line: 'm2-safi' }] },
  { id: 3, budget: 9, seats: [
    { diner: 'sabir', wants: [{ kind: 'cold' }], line: 'm3-sabir' },
    { diner: 'hadi', wants: [{ kind: 'has', crop: 'pumpkin' }], line: 'm3-hadi' }] },
  { id: 4, budget: 9, seats: [
    { diner: 'safi', wants: [{ kind: 'big' }], line: 'm4-safi' },
    { diner: 'sabir', wants: [{ kind: 'mild' }, { kind: 'hot' }], line: 'm4-sabir' }] },
  { id: 5, budget: 13, seats: [
    { diner: 'hadi', wants: [{ kind: 'has', crop: 'corn' }], line: 'm5-hadi' },
    { diner: 'safi', wants: [{ kind: 'cold' }, { kind: 'mild' }], line: 'm5-safi' },
    { diner: 'sabir', wants: [{ kind: 'hot' }, { kind: 'big' }], line: 'm5-sabir' }] },
  { id: 6, budget: 14, seats: [
    { diner: 'sabir', wants: [{ kind: 'spicy' }], line: 'm6-sabir' },
    { diner: 'hadi', wants: [{ kind: 'has', crop: 'tomato' }, { kind: 'cold' }], line: 'm6-hadi' },
    { diner: 'safi', wants: [{ kind: 'has', crop: 'pumpkin' }, { kind: 'big' }], line: 'm6-safi' }] },
  { id: 7, budget: 13, seats: [
    { diner: 'safi', wants: [{ kind: 'mild' }, { kind: 'big' }], line: 'm7-safi' },
    { diner: 'sabir', wants: [{ kind: 'has', crop: 'lettuce' }], line: 'm7-sabir' },
    { diner: 'hadi', wants: [{ kind: 'hot' }, { kind: 'has', crop: 'carrot' }], line: 'm7-hadi' }] },
];
/** After the last meal, keep playing the harder ones (3–7) in turn. */
export function meal(eaten: number): Meal {
  return eaten < meals.length ? meals[eaten] : meals[2 + (eaten - meals.length) % (meals.length - 2)];
}

export type Order = (DishId | null)[];
export function total(order: Order) {
  return order.reduce((sum, id) => sum + (id ? dishById[id].price : 0), 0);
}
/** Which seats the order pleases. A seat with no dish is not pleased. */
export function verdict(m: Meal, order: Order) {
  return m.seats.map((seat, i) => !!order[i] && pleases(dishById[order[i]!], seat.wants));
}
/** The cheapest order that pleases everyone (used by tests to prove each meal is fair). */
export function cheapest(m: Meal): number {
  const choices = m.seats.map(seat => dishes.filter(d => pleases(d, seat.wants)).map(d => d.price));
  let best = Infinity;
  const walk = (i: number, sum: number) => {
    if (i === choices.length) { best = Math.min(best, sum); return; }
    for (const p of choices[i]) walk(i + 1, sum + p);
  };
  walk(0, 0);
  return best;
}
/** Shop coins for a finished meal: the change, plus two per friend, minus one per dish sent back. */
export function reward(m: Meal, spent: number, swaps: number) {
  return Math.max(1, m.budget - spent + 2 * m.seats.length - swaps);
}

export type Lunch = { eaten: number };
export const RESTAURANT_KEY = 'little-ummah:games:restaurant:v1';
export function readLunch(raw: string | null): Lunch {
  try {
    const v = raw ? JSON.parse(raw) : null;
    if (v && Number.isSafeInteger(v.eaten) && v.eaten >= 0) return { eaten: v.eaten };
  } catch { /* A damaged save starts again. */ }
  return { eaten: 0 };
}
