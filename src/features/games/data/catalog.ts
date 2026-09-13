export type GameSlug = 'color-match' | 'shape-match' | 'memory' | 'puzzle' | 'arabic-match' | 'sequence' | 'find-object' | 'sort';
export type Label = { th: string; en: string };
export type GameDefinition = { slug: GameSlug; title: Label; instruction: Label; category: 'matching' | 'thinking'; ageGroup: string; enabled: boolean; color: string };
export const gameAssets = { robot: '/Character/play.webp', guide: '/Character/idea.webp', celebration: '/Character/fighting.webp', island: '/islands/games.webp', puzzle: '/games/puzzle/courtyard.webp' } as const;
export const games: GameDefinition[] = [
  { slug: 'color-match', title: { th: 'จับคู่สี', en: 'Color Match' }, instruction: { th: 'พาสีไปหาสีเดียวกัน', en: 'Match the colors' }, category: 'matching', ageGroup: '3–6', enabled: true, color: 'peach' },
  { slug: 'shape-match', title: { th: 'รูปทรง', en: 'Shape Match' }, instruction: { th: 'วางรูปทรงให้ตรงช่อง', en: 'Match each shape' }, category: 'matching', ageGroup: '3–6', enabled: true, color: 'mint' },
  { slug: 'memory', title: { th: 'ความจำ', en: 'Memory' }, instruction: { th: 'เปิดภาพ แล้วหาคู่', en: 'Turn two cards. Find a pair' }, category: 'thinking', ageGroup: '3–10', enabled: true, color: 'lilac' },
  { slug: 'puzzle', title: { th: 'จิ๊กซอว์', en: 'Puzzle' }, instruction: { th: 'ต่อภาพให้ครบ', en: 'Put the picture together' }, category: 'thinking', ageGroup: '3–10', enabled: true, color: 'sky' },
  { slug: 'arabic-match', title: { th: 'อักษรอาหรับ', en: 'Arabic Match' }, instruction: { th: 'จับคู่อักษรที่เหมือนกัน', en: 'Match the same letter' }, category: 'matching', ageGroup: '3–10', enabled: true, color: 'sky' },
  { slug: 'sequence', title: { th: 'เรียงลำดับ', en: 'Sequence' }, instruction: { th: 'เรียงจากน้อยไปมาก', en: 'Put them in order' }, category: 'thinking', ageGroup: '3–10', enabled: true, color: 'peach' },
  { slug: 'find-object', title: { th: 'ค้นหา', en: 'Find It' }, instruction: { th: 'หาสิ่งของให้เหมือนภาพ', en: 'Find this object' }, category: 'thinking', ageGroup: '3–6', enabled: true, color: 'mint' },
  { slug: 'sort', title: { th: 'แยกหมวด', en: 'Sort Objects' }, instruction: { th: 'พาของไปอยู่กลุ่มเดียวกัน', en: 'Sort into groups' }, category: 'matching', ageGroup: '3–10', enabled: true, color: 'lilac' },
];
