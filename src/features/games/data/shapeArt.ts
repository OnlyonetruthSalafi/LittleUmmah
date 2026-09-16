/* ภาพประกอบเกมจับคู่รูปทรง — สร้างใหม่ด้วย imagegen ตามภาพอ้างอิงของโปรเจกต์
 * แปลงด้วย scripts/prepare-shape-art.mjs
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
   ค่า w/h วัดจากขอบคิ้วทองจริง สร้างอัตโนมัติด้วย scripts/shape-art-masks.mjs */
export const HOLES: Record<ShapeId, { x: number; y: number; w: number; h: number }> = {
  circle: {"x":34.833,"y":20.12,"w":26.444,"h":24.599},
  square: {"x":74.278,"y":26.872,"w":29.556,"h":26.604},
  triangle: {"x":21.333,"y":55.749,"w":28.333,"h":28.209},
  rectangle: {"x":59.833,"y":67.313,"w":35.333,"h":22.995},
  star: {"x":49.889,"y":41.578,"w":27.444,"h":27.941},
};

export const PLATE = { width: 900, height: 748 };
/** ภาพแผ่นฐานที่ตรงกับชุดรูปทรงที่หยอดไปแล้ว */
export const plateFor = (placed: readonly ShapeId[]) =>
  `/games/shape/plate-${shapeOrder.map(shape => (placed.includes(shape) ? '1' : '0')).join('')}.webp`;

export const blockArt = (shape: ShapeId) => `/games/shape/block-${shape}.webp`;
export const BLOCK = { width: 420, height: 420 };

export const SHAPE_ISLAND = { src: '/games/shape/island.webp', width: 1100, height: 1100 };
