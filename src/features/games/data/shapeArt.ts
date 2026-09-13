/* ภาพประกอบเกมจับคู่รูปทรง — วาดโดยเจ้าของโปรเจกต์ แปลงด้วย scripts/prepare-shape-art.mjs
 *
 * แผ่นฐานมีครบทุกสถานะ 32 ใบ = ทุกชุดย่อยของห้ารูปทรง ตั้งชื่อเป็นบิตมาสก์
 * เกมจึงเปลี่ยนภาพแผ่นให้ตรงกับ "ของที่หยอดไปแล้วทั้งหมด" ได้จริง ไม่ใช่โชว์แค่ชิ้นล่าสุด
 *
 * หลุมที่เด็กกดได้เป็นกล่องใสวางทับตำแหน่งหลุมในภาพ (HOLES)
 * ตำแหน่งหาจากคิ้วทองรอบหลุมใน plate-00000.webp ด้วยสคริปต์ ไม่ได้กะเอา
 */
export type ShapeId = 'circle' | 'square' | 'triangle' | 'rectangle' | 'star';

/** ลำดับนี้คือลำดับบิตในชื่อไฟล์แผ่นฐาน ห้ามสลับโดยไม่แปลงไฟล์ใหม่ */
export const shapeOrder: ShapeId[] = ['circle', 'square', 'triangle', 'rectangle', 'star'];

export const shapeNames: Record<ShapeId, { th: string; en: string }> = {
  circle: { th: 'วงกลม', en: 'Circle' },
  square: { th: 'สี่เหลี่ยมจัตุรัส', en: 'Square' },
  triangle: { th: 'สามเหลี่ยม', en: 'Triangle' },
  rectangle: { th: 'สี่เหลี่ยมผืนผ้า', en: 'Rectangle' },
  star: { th: 'ดาว', en: 'Star' },
};

/* กึ่งกลางและขนาดของแต่ละหลุม เป็น % ของภาพแผ่นฐาน
   แผ่นวาดแบบ isometric หลุมจึงไม่ได้เรียงเป็นตาราง ต้องระบุทีละหลุม
   ค่า w/h คือพื้นที่ "กดได้" ซึ่งใหญ่กว่าตัวหลุมที่วาดไว้เล็กน้อย เพื่อให้นิ้วเด็กกดง่ายขึ้น */
export const HOLES: Record<ShapeId, { x: number; y: number; w: number; h: number }> = {
  circle: { x: 38.2, y: 20.3, w: 25, h: 22 },
  square: { x: 76.1, y: 28.0, w: 30, h: 24 },
  star: { x: 51.0, y: 40.0, w: 24, h: 21 },
  triangle: { x: 23.2, y: 51.9, w: 26, h: 23 },
  rectangle: { x: 60.2, y: 64.2, w: 36, h: 22 },
};

export const PLATE = { width: 900, height: 860 };
/** ภาพแผ่นฐานที่ตรงกับชุดรูปทรงที่หยอดไปแล้ว */
export const plateFor = (placed: readonly ShapeId[]) =>
  `/games/shape/plate-${shapeOrder.map(shape => (placed.includes(shape) ? '1' : '0')).join('')}.webp`;

export const blockArt = (shape: ShapeId) => `/games/shape/block-${shape}.webp`;
export const BLOCK = { width: 420, height: 420 };

export const SHAPE_ISLAND = { src: '/games/shape/island.webp', width: 1100, height: 1100 };
