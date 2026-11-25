import type { Text } from '@/i18n/config';
import { vip } from './content';
import type { Stop } from './trail';

const gardenTarget = 15;
const restaurantTarget = 10;

export type Place = {
  stop: Stop; name: Text; href: string; enter: Text; walk: Text; arrive: Text;
  pin: { x: number; y: number }; hit: [x1: number, y1: number, x2: number, y2: number];
};
/** Every place on the trail, in walking order. Coordinates are the world map's. */
export const places: Place[] = [
  { stop: 'shop', name: vip.shop, href: '/games/vip/smoothie-shop', enter: vip.open, walk: vip.walk, arrive: vip.arrive,
    pin: { x: 630, y: 101 }, hit: [565, 95, 704, 245] },
  { stop: 'garden', name: { th: 'สวนผัก', en: 'Garden' }, href: '/games/vip/garden',
    enter: { th: 'เข้าสวนผัก', en: 'Enter the garden' }, walk: { th: 'เดินไปสวนผัก', en: 'Walk to the garden' },
    arrive: { th: 'ถึงสวนผักแล้ว', en: 'You’re at the garden' },
    pin: { x: 866, y: 226 }, hit: [790, 225, 955, 345] },
  { stop: 'restaurant', name: { th: 'ร้านอาหาร', en: 'Restaurant' }, href: '/games/vip/restaurant',
    enter: { th: 'เข้าร้านอาหาร', en: 'Enter the restaurant' }, walk: { th: 'เดินไปร้านอาหาร', en: 'Walk to the restaurant' },
    arrive: { th: 'ถึงร้านอาหารแล้ว', en: 'You’re at the restaurant' },
    pin: { x: 968, y: 106 }, hit: [915, 115, 1025, 215] },
];
export type IslandGoal = { stop: 'garden' | 'restaurant'; earned: number; target: number; hint: Text };
export function islandProgress(smoothieCoins: number, gardenCoins: number): { open: Stop[]; goal?: IslandGoal } {
  if (smoothieCoins < gardenTarget) {
    const left = gardenTarget - smoothieCoins;
    return { open: ['shop'], goal: { stop: 'garden', earned: smoothieCoins, target: gardenTarget,
      hint: { th: `ขายน้ำปั่นอีก ${left} เหรียญเพื่อเปิดสวนผัก`, en: `Earn ${left} more ${left === 1 ? 'coin' : 'coins'} selling smoothies to open the garden` } } };
  }
  if (gardenCoins < restaurantTarget) {
    const left = restaurantTarget - gardenCoins;
    return { open: ['shop', 'garden'], goal: { stop: 'restaurant', earned: gardenCoins, target: restaurantTarget,
      hint: { th: `ขายผักอีก ${left} เหรียญเพื่อเปิดร้านอาหาร`, en: `Earn ${left} more ${left === 1 ? 'coin' : 'coins'} selling vegetables to open the restaurant` } } };
  }
  return { open: ['shop', 'garden', 'restaurant'] };
}

export const route: { inMist: Text; soon: { id: string; name: Text; x: number; y: number }[] } = {
  inMist: { th: 'ที่นี่ยังซ่อนอยู่ในหมอก เร็วๆ นี้จะเปิดให้สำรวจ', en: 'Still hidden in the mist. Coming soon.' },
  /** Places still in the mist, shown as locked signs so the child knows the island keeps going. */
  soon: [
    { id: 'race', name: { th: 'สนามแข่งรถ', en: 'Race track' }, x: 560, y: 560 },
  ],
};
