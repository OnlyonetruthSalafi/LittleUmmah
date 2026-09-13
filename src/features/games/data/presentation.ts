import type { GameSlug, Label } from './catalog';

type GamePresentation = {
  world: Label;
  description: Label;
  levels: [Label, Label, Label];
  destinations: Label;
  pieces: Label;
};

export const gamePresentation: Record<GameSlug, GamePresentation> = {
  'color-match': {
    world: { th: 'โรงงานสีแสนสนุก', en: 'The Color Workshop' },
    description: { th: 'พาของเล่นกลับบ้านสีของตัวเอง', en: 'Bring each toy to its color home.' },
    levels: [{ th: 'รู้จัก 4 สี', en: 'Meet four colors' }, { th: 'ลองจับคู่', en: 'Match the toys' }, { th: 'จำสีให้ได้', en: 'Know your colors' }],
    destinations: { th: 'บ้านของแต่ละสี', en: 'Color homes' }, pieces: { th: 'เลือกของเล่นไปวาง', en: 'Pick a toy' },
  },
  'shape-match': {
    world: { th: 'ห้องของเล่นรูปทรง', en: 'The Shape Studio' },
    description: { th: 'ดูขอบรูป แล้วหาช่องที่พอดีกัน', en: 'Look at the outline. Find a perfect fit.' },
    levels: [{ th: '3 รูปทรง', en: 'Three shapes' }, { th: '5 รูปทรง', en: 'Five shapes' }, { th: 'ลองด้วยตัวเอง', en: 'Try on your own' }],
    destinations: { th: 'รูปนี้ลงช่องไหนดี?', en: 'Find the matching outline' }, pieces: { th: 'ชิ้นรูปทรงของเรา', en: 'Our shape pieces' },
  },
  memory: {
    world: { th: 'ลานสมบัติความจำ', en: 'The Memory Treasury' },
    description: { th: 'เปิดทีละสองภาพ แล้วตามหาคู่ของมัน', en: 'Reveal two treasures and find their pair.' },
    levels: [{ th: '6 ใบ · 3 คู่', en: '6 cards · 3 pairs' }, { th: '12 ใบ · 6 คู่', en: '12 cards · 6 pairs' }, { th: '16 ใบ · 8 คู่', en: '16 cards · 8 pairs' }],
    destinations: { th: 'สมบัติที่ซ่อนอยู่', en: 'Hidden treasures' }, pieces: { th: 'เปิดภาพหาคู่', en: 'Reveal a pair' },
  },
  puzzle: {
    world: { th: 'ช่างต่อเมืองน้อย', en: 'The Little City Builders' },
    description: { th: 'ต่อทีละชิ้น ให้เมืองสวยกลับมาครบ', en: 'Build a beautiful little city, piece by piece.' },
    levels: [{ th: '4 ชิ้น', en: '4 pieces' }, { th: '6 ชิ้น', en: '6 pieces' }, { th: '9 ชิ้น', en: '9 pieces' }],
    destinations: { th: 'มาสร้างภาพนี้ด้วยกัน', en: 'Let’s build this picture' }, pieces: { th: 'ชิ้นภาพที่รอเราอยู่', en: 'Your picture pieces' },
  },
  'arabic-match': {
    world: { th: 'ห้องสมุดอักษร', en: 'The Letter Library' },
    description: { th: 'สังเกตรูปอักษรและจุด แล้วหาอักษรคู่กัน', en: 'Look at the letter and its dots. Find its twin.' },
    levels: [{ th: 'อักษร 3 ตัว', en: 'Three letters' }, { th: 'อักษรอีก 4 ตัว', en: 'Four more letters' }, { th: 'รวม 7 ตัว', en: 'All seven letters' }],
    destinations: { th: 'บ้านของอักษร', en: 'Letter homes' }, pieces: { th: 'เลือกบล็อกอักษร', en: 'Pick a letter block' },
  },
  sequence: {
    world: { th: 'เส้นทางนักเรียง', en: 'The Stepping Stone Trail' },
    description: { th: 'วางทีละชิ้น จากน้อยไปมาก', en: 'Follow the trail from little to large.' },
    levels: [{ th: 'นับ 1 ถึง 4', en: 'Count 1 to 4' }, { th: 'เล็ก → ใหญ่', en: 'Small to large' }, { th: 'นับ 1 ถึง 6', en: 'Count 1 to 6' }],
    destinations: { th: 'เรียงไปตามทาง', en: 'Follow the trail' }, pieces: { th: 'ชิ้นไหนมาก่อนนะ?', en: 'Which comes first?' },
  },
  'find-object': {
    world: { th: 'สวนสำรวจสมบัติ', en: 'The Discovery Garden' },
    description: { th: 'มองภาพตัวอย่าง แล้วค้นหาสิ่งเดียวกันในสวน', en: 'Look at the clue. Find the same treasure in the garden.' },
    levels: [{ th: 'ของ 4 อย่าง', en: 'Four treasures' }, { th: 'ของ 6 อย่าง', en: 'Six treasures' }, { th: 'ของ 8 อย่าง', en: 'Eight treasures' }],
    destinations: { th: 'ลองมองในสวน', en: 'Explore the garden' }, pieces: { th: 'ตามหาภาพนี้', en: 'Find this treasure' },
  },
  sort: {
    world: { th: 'สถานีจัดของเล่น', en: 'The Sorting Station' },
    description: { th: 'ช่วยจัดของเล่น ให้เพื่อนกลุ่มเดียวกันอยู่ด้วยกัน', en: 'Bring toys that belong together to the same basket.' },
    levels: [{ th: 'แยกตามสี', en: 'Sort by color' }, { th: 'แยกตามรูป', en: 'Sort by shape' }, { th: 'แยกตามขนาด', en: 'Sort by size' }],
    destinations: { th: 'ตะกร้าของแต่ละกลุ่ม', en: 'A basket for each group' }, pieces: { th: 'ช่วยจัดของเล่นกัน', en: 'Let’s sort our toys' },
  },
};
