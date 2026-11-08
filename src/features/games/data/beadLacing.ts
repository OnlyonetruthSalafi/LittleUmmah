import type { Text } from '@/i18n/config';
export const BEAD_COLORS = {
  blue: { th: 'สีฟ้า', en: 'Blue' }, turquoise: { th: 'สีเทอร์ควอยซ์', en: 'Turquoise' },
  gold: { th: 'สีทอง', en: 'Gold' }, white: { th: 'สีขาว', en: 'White' },
} satisfies Record<string, Text>;
export const BEAD_SHAPES = { circle: { th: 'วงกลม', en: 'Circle' }, square: { th: 'สี่เหลี่ยม', en: 'Square' }, star: { th: 'ดาว', en: 'Star' } } satisfies Record<string, Text>;
export type BeadId = `${keyof typeof BEAD_COLORS}-${keyof typeof BEAD_SHAPES}`;
export const BEADS = Object.entries(BEAD_COLORS).flatMap(([color, name]) => Object.entries(BEAD_SHAPES).map(([shape, label]) => ({
  id: `${color}-${shape}` as BeadId, label: { th: `${name.th} รูป${label.th}`, en: `${name.en} ${label.en.toLowerCase()}` },
  src: `/games/bead-lacing/${color}-${shape}.webp`,
  // มุมข้าง แกนรูขนานกับเชือก ใช้ตอนลูกปัดร้อยอยู่บนเชือกแล้ว (รูหน้าตรงจะดูเหมือนเชือกไม่ได้ลอดรู)
  threaded: `/games/bead-lacing/threaded/${color}-${shape}.webp`,
})));
export const bead = (id: BeadId) => BEADS.find(b => b.id === id)!;
export type BeadRound = { pattern: readonly BeadId[]; prefilled: number; choices: readonly BeadId[] };
const round = (pattern: BeadId[], choices: BeadId[], prefilled = 0): BeadRound => ({ pattern, choices, prefilled });
export const BEAD_LEVELS: readonly (readonly BeadRound[])[] = [
  [round(['blue-circle','turquoise-square','gold-star'], ['gold-star','white-circle','blue-circle','turquoise-square']),
   round(['white-square','gold-circle','blue-star'], ['blue-star','white-square','gold-circle','turquoise-star']),
   round(['turquoise-star','white-circle','gold-square'], ['gold-square','blue-square','turquoise-star','white-circle'])],
  [round(['gold-star','blue-circle','white-square','blue-circle','gold-star'], ['white-square','gold-star','turquoise-square','blue-circle']),
   round(['turquoise-star','gold-circle','blue-square','turquoise-star','gold-circle'], ['gold-circle','white-circle','blue-square','turquoise-star']),
   round(['white-star','turquoise-circle','gold-square','white-star','turquoise-circle'], ['blue-star','gold-square','white-star','turquoise-circle'])],
  [round(['blue-circle','gold-star','blue-circle','gold-star','blue-circle','gold-star'], ['gold-star','white-circle','blue-circle','turquoise-square'],4),
   round(['white-square','turquoise-star','gold-circle','white-square','turquoise-star','gold-circle'], ['gold-circle','blue-square','white-square','turquoise-star'],3),
   round(['turquoise-circle','blue-square','white-star','turquoise-circle','blue-square','white-star'], ['white-star','turquoise-circle','gold-square','blue-square'],3)],
];
export const BEAD_TEXT = {
  pattern: { th: 'ดูแบบจากซ้ายไปขวา', en: 'Follow from left to right' },
  repeat: { th: 'ดูแบบซ้ำ แล้วเติมต่อ', en: 'Find the repeat and continue' },
  round: { th: 'รอบ', en: 'Round' },
  tip: { th: 'ปลายเชือก', en: 'Cord tip' },
  tray: { th: 'ถาดลูกปัด', en: 'Bead tray' },
  hint: { th: 'คำใบ้', en: 'Hint' },
  select: { th: 'เลือกลูกปัด แล้วแตะปลายเชือก', en: 'Choose a bead, then tap the cord tip' },
  praise: { th: 'ถูกแล้ว ร้อยเม็ดต่อไปกันนะ', en: 'That is right. Let’s lace the next bead.' },
  complete: { th: 'ร้อยครบแล้ว เก่งมากเลย', en: 'All beads are threaded. Well done!' },
  unknown: { th: 'เติมแบบต่อ', en: 'Continue the pattern' },
  howto: { th: 'ดูสีและรูปทรงบนแบบนะ ลากลูกปัดไปที่ปลายเชือกทีละเม็ด หรือแตะลูกปัด แล้วแตะปลายเชือกก็ได้', en: 'Look at the colors and shapes in the pattern. Drag one bead at a time to the cord tip, or select a bead and tap the cord tip.' },
} satisfies Record<string, Text>;
export const beadHint = (id: BeadId): Text => ({ th: `ดูช่องที่ครูชี้นะ เม็ดต่อไปคือ${bead(id).label.th}`, en: `Look at the marked space. Next is the ${bead(id).label.en.toLowerCase()}.` });
