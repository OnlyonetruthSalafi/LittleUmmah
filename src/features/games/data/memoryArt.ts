/**
 * ชุดสัญลักษณ์ของเกมความจำ ใช้ภาพ 3D เดิมและภาพสิ่งของที่สร้างด้วย imagegen (C-4)
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
  { id: 'toy-car', th: 'รถของเล่น', en: 'Toy car', art: 'face-toy-car' },
  { id: 'ball', th: 'ลูกบอล', en: 'Ball', art: 'face-ball' },
  { id: 'umbrella', th: 'ร่ม', en: 'Umbrella', art: 'face-umbrella' },
  { id: 'watering-can', th: 'บัวรดน้ำ', en: 'Watering can', art: 'face-watering-can' },
  { id: 'cup', th: 'ถ้วย', en: 'Cup', art: 'face-cup' },
  { id: 'basket', th: 'ตะกร้า', en: 'Basket', art: 'face-basket' },
  { id: 'plant-pot', th: 'กระถางต้นไม้', en: 'Potted plant', art: 'face-plant-pot' },
  { id: 'wooden-blocks', th: 'บล็อกไม้', en: 'Wooden blocks', art: 'face-wooden-blocks' },
];

/** ขนาดจริงของไฟล์การ์ด ใช้กำหนด aspect-ratio ให้ช่องการ์ดไม่ขยับตอนโหลด */
export const CARD_ART = { width: 384, height: 356, back: '/games/memory/card-back.webp' };

/** ขนาดจริงของภาพเกาะ และกรอบพื้นที่วางการ์ดบนผิวครีม วัดจากไฟล์จริงด้วยสคริปต์ */
export const ISLAND_ART = { src: '/games/memory/island.webp', width: 1100, height: 1079 };

// MEM-1: safe_rectangle_percent from measure.json / measure-tall.json, not visual estimates.
export const MOBILE_ISLAND_ART = {
  src: '/games/memory/island-mobile-a.webp', width: 1296, height: 1365,
  surface: { left: 6.944, right: 7.099, top: 22.857, bottom: 27.179 },
};
export const MOBILE_TALL_ISLAND_ART = {
  src: '/games/memory/island-mobile-tall-b.webp', width: 1159, height: 1357,
  surface: { left: 6.385, right: 6.212, top: 13.928, bottom: 17.833 },
};
