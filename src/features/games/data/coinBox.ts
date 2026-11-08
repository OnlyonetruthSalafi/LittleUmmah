import type { Text } from '@/i18n/config';

export const COIN_ROUNDS = 3;
export function coinLimit(level: number) { return [3, 5, 10][Math.max(0, Math.min(2, level - 1))]; }
export function nextCoinTarget(level: number, previous = 0, random = Math.random()) {
  const choices = Array.from({ length: coinLimit(level) }, (_, i) => i + 1).filter(n => n !== previous);
  return choices[Math.min(choices.length - 1, Math.max(0, Math.floor(random * choices.length)))];
}
/** Exact completion locks input synchronously; even two drops in one frame cannot overfill. */
export function addCoin(count: number, target: number) { return Math.min(target, count + 1); }
export const coinText = {
  target: { th: 'ใส่เหรียญ {n} เหรียญนะ', en: 'Coins to put in: {n}' },
  count: { th: 'ในกล่อง {n} เหรียญ', en: 'Coins in the box: {n}' },
  round: { th: 'รอบ {n} / 3', en: 'Round {n} / 3' },
  coin: { th: 'เหรียญทอง', en: 'Gold coin' },
  slot: { th: 'หยอดตรงนี้', en: 'Drop here' },
  select: { th: 'เลือกเหรียญ แล้วแตะช่องหยอด', en: 'Pick a coin, then tap the slot' },
  drag: { th: 'ลากเหรียญไปที่ช่องหยอด', en: 'Drag a coin to the slot' },
  undo: { th: 'เอาออก 1 เหรียญ', en: 'Take one out' },
  reset: { th: 'นับใหม่', en: 'Count again' },
  praise: { th: 'ครบแล้ว เก่งมากเลย!', en: 'All counted. Well done!' },
  retry: { th: 'ไม่เป็นไร มานับใหม่ด้วยกันนะ', en: 'Let’s count again together' },
  loading: { th: 'รอภาพสักครู่นะ', en: 'Loading the pictures' },
  ready: { th: 'นับกับครูนะ', en: 'Count with me' },
  listen: { th: 'ฟังจำนวน', en: 'Hear the number' },
} satisfies Record<string, Text>;
export const coinNumbers: Text[] = ['หนึ่ง','สอง','สาม','สี่','ห้า','หก','เจ็ด','แปด','เก้า','สิบ'].map((th, i) => ({ th, en: ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'][i] }));
