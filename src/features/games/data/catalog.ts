export type GameSlug = 'block-builders' | 'balance-scale' | 'coin-box' | 'color-match' | 'shape-match' | 'memory' | 'puzzle' | 'arabic-match' | 'sequence' | 'find-object' | 'sort' | 'light-maze' | 'bead-lacing';
export type Label = { th: string; en: string };
export type GameDefinition = { slug: GameSlug; title: Label; instruction: Label; category: 'matching' | 'thinking'; ageGroup: string; enabled: boolean; color: string };
export const gameAssets = { robot: '/Character/play.webp', guide: '/Character/idea.webp', celebration: '/Character/celebrate.webp', pointer: '/Character/point.webp', island: '/islands/games.webp', puzzle: '/games/puzzle/courtyard.webp' } as const;
export const games: GameDefinition[] = [
  { slug: 'block-builders', title: { th: 'ต่อบล็อกสร้างบ้าน', en: 'Block Builders' }, instruction: { th: 'วางบล็อกให้ตรงช่อง เริ่มจากชั้นล่าง', en: 'Match each block. Build the bottom first' }, category: 'thinking', ageGroup: '3–6', enabled: true, color: 'sky' },
  { slug: 'balance-scale', title: { th: 'ตาชั่งสมดุล', en: 'Balance Scale' }, instruction: { th: 'เติมบล็อกให้สมดุล หรือเลือกฝั่งที่หนักกว่า', en: 'Balance the blocks or choose the heavier side' }, category: 'thinking', ageGroup: '7+', enabled: true, color: 'sky' },
  { slug: 'coin-box', title: { th: 'กล่องเหรียญนับจำนวน', en: 'Counting Coin Box' }, instruction: { th: 'หยอดเหรียญ แล้วนับไปด้วยกัน', en: 'Drop coins and count together' }, category: 'thinking', ageGroup: '3–6', enabled: true, color: 'sky' },
  { slug: 'bead-lacing', title: { th: 'ร้อยเชือกลูกปัด', en: 'Bead Lacing' }, instruction: { th: 'ลากลูกปัดไปที่ปลายเชือกตามแบบ', en: 'Drag beads to the cord tip to follow the pattern' }, category: 'matching', ageGroup: '3–6', enabled: true, color: 'sky' },
  { slug: 'color-match', title: { th: 'จับคู่สี', en: 'Color Match' }, instruction: { th: 'พาสีไปหาสีเดียวกัน', en: 'Match the colors' }, category: 'matching', ageGroup: '3–6', enabled: true, color: 'peach' },
  { slug: 'shape-match', title: { th: 'รูปทรง', en: 'Shape Match' }, instruction: { th: 'วางรูปทรงให้ตรงช่อง', en: 'Match each shape' }, category: 'matching', ageGroup: '3–6', enabled: true, color: 'mint' },
  { slug: 'memory', title: { th: 'ความจำ', en: 'Memory' }, instruction: { th: 'เปิดภาพ แล้วหาคู่', en: 'Turn two cards. Find a pair' }, category: 'thinking', ageGroup: '3–10', enabled: true, color: 'lilac' },
  { slug: 'puzzle', title: { th: 'จิ๊กซอว์', en: 'Puzzle' }, instruction: { th: 'ต่อภาพให้ครบ', en: 'Put the picture together' }, category: 'thinking', ageGroup: '3–10', enabled: true, color: 'sky' },
  { slug: 'arabic-match', title: { th: 'อักษรอาหรับ', en: 'Arabic Match' }, instruction: { th: 'จับคู่อักษรที่เหมือนกัน', en: 'Match the same letter' }, category: 'matching', ageGroup: '3–10', enabled: true, color: 'sky' },
  { slug: 'sequence', title: { th: 'เรียงลำดับ', en: 'Sequence' }, instruction: { th: 'เรียงจากน้อยไปมาก', en: 'Put them in order' }, category: 'thinking', ageGroup: '3–10', enabled: true, color: 'peach' },
  { slug: 'find-object', title: { th: 'ค้นหา', en: 'Find It' }, instruction: { th: 'หาสิ่งของให้เหมือนภาพ', en: 'Find this object' }, category: 'thinking', ageGroup: '3–6', enabled: true, color: 'mint' },
  { slug: 'light-maze', title: { th: 'เขาวงกตแสง', en: 'Light Maze' }, instruction: { th: 'เก็บแสงให้ครบ เลือกทางหลบเพื่อนหุ่นยนต์', en: 'Collect every light. Find a way around the robot friends' }, category: 'thinking', ageGroup: '3–10', enabled: true, color: 'sky' },
  { slug: 'sort', title: { th: 'แยกหมวด', en: 'Sort Objects' }, instruction: { th: 'พาของไปอยู่กลุ่มเดียวกัน', en: 'Sort into groups' }, category: 'matching', ageGroup: '3–10', enabled: true, color: 'lilac' },
];
