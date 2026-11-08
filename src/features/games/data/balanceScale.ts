import type { Text } from '@/i18n/config';

export const BALANCE_ROUNDS = 3;
export const MAX_BLOCKS = 4;
export const balanceObjects = [
  { id: 'apple', label: { th: 'แอปเปิล', en: 'Apple' } },
  { id: 'orange', label: { th: 'ส้ม', en: 'Orange' } },
  { id: 'watermelon', label: { th: 'แตงโม', en: 'Watermelon' } },
  { id: 'pumpkin', label: { th: 'ฟักทอง', en: 'Pumpkin' } },
  { id: 'basket', label: { th: 'ตะกร้า', en: 'Basket' } },
  { id: 'book', label: { th: 'หนังสือ', en: 'Book' } },
] satisfies { id: string; label: Text }[];
export const balanceText = {
  balance: { th: 'เติมบล็อกให้สมดุล', en: 'Add blocks to balance' },
  compare: { th: 'ฝั่งไหนหนักกว่า?', en: 'Which side is heavier?' },
  left: { th: 'ซ้ายหนักกว่า', en: 'Left is heavier' },
  right: { th: 'ขวาหนักกว่า', en: 'Right is heavier' },
  equal: { th: 'เท่ากันแล้ว', en: 'Both sides are equal' },
  praise: { th: 'เท่ากันแล้ว เก่งมาก', en: 'Balanced! Well done' },
  correct: { th: 'สังเกตได้ดีมาก', en: 'Great observing!' },
  retry: { th: 'ลองดูตาชั่ง แล้วลองอีกครั้งนะ', en: 'Look at the scale and try again' },
  round: { th: 'รอบ {n} / 3', en: 'Round {n} / 3' },
  unit: { th: '{n} หน่วย', en: 'Units: {n}' },
  toy: { th: 'น้ำหนักสมมติในเกม', en: 'Pretend weights for this game' },
  block: { th: 'บล็อก {n} หน่วย', en: '{n}-unit block' },
  remove: { th: 'นำบล็อก {n} หน่วยกลับถาด', en: 'Return the {n}-unit block to the tray' },
  place: { th: 'วางที่จานขวา', en: 'Place on the right pan' },
  drag: { th: 'ลากบล็อกลงจานขวา แตะบล็อกบนจานเพื่อนำออก', en: 'Drag blocks to the right pan. Tap a placed block to remove it.' },
  selected: { th: 'เลือกแล้ว กดปุ่มวางที่จานขวา', en: 'Selected. Press Place on the right pan.' },
  full: { th: 'จานเต็มแล้ว แตะบล็อกเพื่อนำออกก่อนนะ', en: 'The pan is full. Tap a block to remove it first.' },
  check: { th: 'ตรวจคำตอบ', en: 'Check' },
  newRound: { th: 'เริ่มรอบใหม่', en: 'New round' },
  listen: { th: 'ฟังวิธีเล่น', en: 'How to play' },
  chooseLeft: { th: 'ซ้าย', en: 'Left' },
  chooseRight: { th: 'ขวา', en: 'Right' },
  chooseEqual: { th: 'เท่ากัน', en: 'Equal' },
  leftPan: { th: 'จานซ้าย', en: 'Left pan' },
  rightPan: { th: 'จานขวา', en: 'Right pan' },
} satisfies Record<string, Text>;
export const balanceVoice = {
  'name-balance-scale': { th: 'ตาชั่งสมดุล', en: 'Balance Scale' },
  'game-balance-scale': balanceText.balance,
  'howto-balance-scale': { th: 'มาชั่งของกับครูนะ จุดหนึ่งจุดคือหนึ่งหน่วย ลากบล็อกลงจานขวา หรือแตะบล็อกแล้วแตะปุ่มวาง แตะบล็อกบนจานเพื่อนำออก เมื่อเท่ากันแล้วกดตรวจคำตอบ ถ้าครูถามว่าฝั่งไหนหนักกว่า ให้ดูตาชั่งแล้วเลือกซ้าย ขวา หรือเท่ากันนะ', en: 'Weigh things with me. Each dot is one unit. Drag a block to the right pan, or select a block and press Place. Tap a placed block to remove it. Check when the sides are equal. For comparison questions, choose left, right or equal.' },
  'balance-left': balanceText.left,
  'balance-right': balanceText.right,
  'balance-equal': balanceText.praise,
  'balance-retry': balanceText.retry,
  'balance-correct': balanceText.correct,
  'balance-compare': balanceText.compare,
} satisfies Record<string, Text>;
