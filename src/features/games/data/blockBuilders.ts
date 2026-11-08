import type { Text } from '@/i18n/config';
export type BlockShape = 'cube' | 'beam' | 'roof' | 'arch' | 'cylinder' | 'dome';
export type BlockKind = { shape: BlockShape; color: string };
export type BuildSlot = BlockKind & { id: string; x: number; y: number; w: number; supports: string[] };
export type BuildPlan = { id: string; level: number; title: Text; slots: BuildSlot[] };
export const BUILD_ROUNDS = 3;
export const blockKinds: Record<BlockShape, { color: string; label: Text; colorLabel: Text }> = {
  cube: { color: 'blue', label: { th: 'ลูกบาศก์', en: 'Cube' }, colorLabel: { th: 'สีฟ้า', en: 'Blue' } },
  beam: { color: 'turquoise', label: { th: 'แท่งยาว', en: 'Beam' }, colorLabel: { th: 'สีเทอร์ควอยซ์', en: 'Turquoise' } },
  roof: { color: 'gold', label: { th: 'หลังคาสามเหลี่ยม', en: 'Triangle roof' }, colorLabel: { th: 'สีทอง', en: 'Gold' } },
  arch: { color: 'white', label: { th: 'โค้งประตู', en: 'Arch' }, colorLabel: { th: 'สีขาว', en: 'White' } },
  cylinder: { color: 'wood', label: { th: 'ทรงกระบอก', en: 'Cylinder' }, colorLabel: { th: 'สีไม้', en: 'Wood' } },
  dome: { color: 'gold', label: { th: 'โดม', en: 'Dome' }, colorLabel: { th: 'สีทอง', en: 'Gold' } },
};
const slot = (id: string, shape: BlockShape, x: number, y: number, w = 1, supports: string[] = []): BuildSlot => ({ id, shape, color: blockKinds[shape].color, x, y, w, supports });
const house: Text = { th: 'บ้านน้อย', en: 'Little house' }, school: Text = { th: 'โรงเรียนเล็ก', en: 'Little school' }, tower: Text = { th: 'หอคอยโดม', en: 'Dome tower' }, bridge: Text = { th: 'สะพาน', en: 'Bridge' };
// Coordinates are logical construction units, projected onto the measured island ground.
// Dependencies list every physical support, so an upper piece cannot float.
export const buildPlans: BuildPlan[] = [
  { id: 'home-3', level: 1, title: house, slots: [slot('a','cube',0,0),slot('b','cube',1,0),slot('c','roof',0,1,2,['a','b'])] },
  { id: 'home-4', level: 1, title: house, slots: [slot('a','cube',0,0),slot('b','cube',1,0),slot('c','beam',0,1,2,['a','b']),slot('d','roof',0,2,2,['c'])] },
  { id: 'home-5', level: 2, title: house, slots: [slot('a','cube',0,0),slot('b','arch',1,0),slot('c','cube',2,0),slot('d','beam',0,1,3,['a','b','c']),slot('e','roof',0,2,3,['d'])] },
  { id: 'school-6', level: 2, title: school, slots: [slot('a','arch',0,0),slot('b','arch',1,0),slot('c','cube',2,0),slot('d','beam',0,1,2,['a','b']),slot('e','cube',2,1,1,['c']),slot('f','roof',0,2,3,['d','e'])] },
  { id: 'bridge-5', level: 2, title: bridge, slots: [slot('a','cylinder',0,0),slot('b','arch',1,0),slot('c','cylinder',2,0),slot('d','beam',0,1,3,['a','b','c']),slot('e','beam',0,2,3,['d'])] },
  { id: 'tower-7', level: 3, title: tower, slots: [slot('a','cylinder',0,0),slot('b','arch',1,0),slot('c','cylinder',2,0),slot('d','cube',0,1,1,['a']),slot('e','cube',1,1,1,['b']),slot('f','cube',2,1,1,['c']),slot('g','dome',0,2,3,['d','e','f'])] },
  { id: 'school-8', level: 3, title: school, slots: [slot('a','cube',0,0),slot('b','arch',1,0),slot('c','cube',2,0),slot('d','cube',0,1,1,['a']),slot('e','arch',1,1,1,['b']),slot('f','cube',2,1,1,['c']),slot('g','roof',0,2,2,['d','e']),slot('h','roof',2,2,1,['f'])] },
  { id: 'bridge-8', level: 3, title: bridge, slots: [slot('a','cylinder',0,0),slot('b','arch',1,0),slot('c','arch',2,0),slot('d','cylinder',3,0),slot('e','cube',0,1,1,['a']),slot('f','beam',1,1,2,['b','c']),slot('g','cube',3,1,1,['d']),slot('h','beam',0,2,4,['e','f','g'])] },
];
export const buildText = {
  round: { th: 'รอบ {n} / 3', en: 'Round {n} / 3' },
  drag: { th: 'เลือกบล็อก แล้วแตะช่องเงา', en: 'Pick a block, then tap its outline' },
  support: { th: 'วางชั้นล่างก่อนนะ', en: 'Place the supporting blocks first' },
  retry: { th: 'ลองดูรูปทรงและสีอีกทีนะ', en: 'Look at the shape and color again' },
  praise: { th: 'สร้างเสร็จแล้ว เก่งมากเลย!', en: 'You built it. Well done!' },
  select: { th: 'เลือกบล็อกในถาดก่อนนะ', en: 'Choose a block from the tray first' },
  listen: { th: 'ฟังวิธีเล่น', en: 'Listen' },
  newRound: { th: 'เริ่มรอบใหม่', en: 'New round' },
  slot: { th: 'ช่อง {n}', en: 'Slot {n}' },
  placed: { th: 'วางแล้ว', en: 'Placed' },
  tray: { th: 'ถาดบล็อก', en: 'Block tray' },
} satisfies Record<string, Text>;
export const buildVoice = {
  'name-block-builders': { th: 'ต่อบล็อกสร้างบ้าน', en: 'Block Builders' },
  'game-block-builders': { th: 'เลือกบล็อกให้ตรงรูปทรงและสี แล้ววางชั้นล่างก่อนนะ', en: 'Match the shape and color. Start with the bottom blocks.' },
  'howto-block-builders': { th: 'มาสร้างบ้านกับครูกันนะ ดูรูปทรงและสีของช่องเงา ลากบล็อกไปวางให้ตรงช่อง หรือแตะบล็อก แล้วแตะช่องก็ได้ วางชั้นล่างให้ครบก่อน แล้วค่อยวางชั้นบน', en: 'Let’s build together. Match the shape and color of each outline. Drag a block, or tap it and then tap a slot. Build the bottom first, then add the top.' },
  'build-support': buildText.support,
  'build-retry': buildText.retry,
  'build-praise': buildText.praise,
  'build-cube': blockKinds.cube.label, 'build-beam': blockKinds.beam.label,
  'build-roof': blockKinds.roof.label, 'build-arch': blockKinds.arch.label,
  'build-cylinder': blockKinds.cylinder.label, 'build-dome': blockKinds.dome.label,
} satisfies Record<string, Text>;
