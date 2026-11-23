import type { Text } from '@/i18n/config';
import { vip } from './content';
import type { Stop } from './trail';

/** Cups of smoothie sold before the bridge to the garden opens. */
export const GARDEN_AFTER = 3;
/** Garden deliveries before the bridge to the restaurant opens. */
export const RESTAURANT_AFTER = 3;

export type Place = {
  stop: Stop; name: Text; href: string; enter: Text; walk: Text; arrive: Text; locked?: Text;
  pin: { x: number; y: number }; hit: [x1: number, y1: number, x2: number, y2: number];
};
/** Every place on the trail, in walking order. Coordinates are the world map's. */
export const places: Place[] = [
  { stop: 'shop', name: vip.shop, href: '/games/vip/smoothie-shop', enter: vip.open, walk: vip.walk, arrive: vip.arrive,
    pin: { x: 630, y: 101 }, hit: [565, 95, 704, 245] },
  { stop: 'garden', name: { th: 'สวนผัก', en: 'Garden' }, href: '/games/vip/garden',
    enter: { th: 'เข้าสวนผัก', en: 'Enter the garden' }, walk: { th: 'เดินไปสวนผัก', en: 'Walk to the garden' },
    arrive: { th: 'ถึงสวนผักแล้ว', en: 'You’re at the garden' },
    locked: { th: `ขายน้ำปั่นให้ครบ ${GARDEN_AFTER} แก้ว สะพานไปสวนผักจึงจะเปิด`, en: `Sell ${GARDEN_AFTER} smoothies to open the bridge to the garden` },
    pin: { x: 866, y: 226 }, hit: [790, 225, 955, 345] },
  { stop: 'restaurant', name: { th: 'ร้านอาหาร', en: 'Restaurant' }, href: '/games/vip/restaurant',
    enter: { th: 'เข้าร้านอาหาร', en: 'Enter the restaurant' }, walk: { th: 'เดินไปร้านอาหาร', en: 'Walk to the restaurant' },
    arrive: { th: 'ถึงร้านอาหารแล้ว', en: 'You’re at the restaurant' },
    locked: { th: `ส่งผักให้เพื่อนครบ ${RESTAURANT_AFTER} ครั้ง สะพานไปร้านอาหารจึงจะเปิด`, en: `Deliver vegetables ${RESTAURANT_AFTER} times to open the bridge to the restaurant` },
    pin: { x: 968, y: 106 }, hit: [915, 115, 1025, 215] },
];
/** Places the child can walk to, given smoothies sold and garden deliveries. Each opens the next. */
export function openPlaces(served: number, delivered: number): Stop[] {
  if (served < GARDEN_AFTER) return ['shop'];
  if (delivered < RESTAURANT_AFTER) return ['shop', 'garden'];
  return ['shop', 'garden', 'restaurant'];
}

export const route: { inMist: Text; soon: { id: string; name: Text; x: number; y: number }[] } = {
  inMist: { th: 'ที่นี่ยังซ่อนอยู่ในหมอก เร็วๆ นี้จะเปิดให้สำรวจ', en: 'Still hidden in the mist. Coming soon.' },
  /** Places still in the mist, shown as locked signs so the child knows the island keeps going. */
  soon: [
    { id: 'race', name: { th: 'สนามแข่งรถ', en: 'Race track' }, x: 560, y: 560 },
  ],
};
