/**
 * ชุดสัญลักษณ์ของเกมความจำ ใช้ภาพ 3D ที่เจ้าของโปรเจกต์วาดมา
 * (ต้นฉบับ public/games/memorygame → แปลงด้วย scripts/prepare-memory-art.mjs)
 *
 * แยกจาก `symbols` ใน content.ts เพราะชุดนั้นเกม "ค้นหา" ใช้อยู่ด้วย
 * ถ้าแก้ชุดเดียวกันจะพังอีกเกมหนึ่ง
 *
 * ทุกภาพเป็นสิ่งของ สถาปัตยกรรม หรือต้นไม้ ไม่มีสิ่งมีชีวิตที่มีใบหน้า (AGENTS.md ข้อ 1.1)
 */
export type MemorySymbol = { id: string; th: string; en: string; art: string };

export const memorySymbols: MemorySymbol[] = [
  { id: 'crescent', th: 'จันทร์เสี้ยว', en: 'Crescent', art: 'face-crescent' },
  { id: 'star', th: 'ดาว', en: 'Star', art: 'face-star' },
  { id: 'lantern', th: 'โคมไฟ', en: 'Lantern', art: 'face-lantern' },
  { id: 'masjid', th: 'มัสยิด', en: 'Mosque', art: 'face-masjid' },
  { id: 'arch', th: 'ซุ้มโค้ง', en: 'Arch', art: 'face-arch' },
  { id: 'tasbih', th: 'ลูกประคำ', en: 'Tasbih beads', art: 'face-tasbih' },
  { id: 'gem', th: 'อัญมณี', en: 'Gem', art: 'face-gem' },
  { id: 'palm', th: 'ต้นอินทผลัม', en: 'Palm tree', art: 'face-palm' },
];

/** ขนาดจริงของไฟล์การ์ด ใช้กำหนด aspect-ratio ให้ช่องการ์ดไม่ขยับตอนโหลด */
export const CARD_ART = { width: 384, height: 356, back: '/games/memory/card-back.webp' };

/** ขนาดจริงของภาพเกาะ และกรอบพื้นที่วางการ์ดบนผิวครีม วัดจากไฟล์จริงด้วยสคริปต์ */
export const ISLAND_ART = { src: '/games/memory/island.webp', width: 1100, height: 1079 };
