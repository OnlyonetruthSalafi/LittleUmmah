/* ภาพประกอบเกมเรียงลำดับแบบ 2.5D — ภาพจาก Codex ตาม CODEX_SEQUENCE_BRIEF.md
 * ภาพตัวอย่างคือ public/games/hub/sequence.png (ทางแผ่นทองขั้นบันได ลูกบาศก์ฟ้าเล็กไปใหญ่)
 *
 * แยกเป็นสามชิ้น: เกาะเปล่า · แผ่นทองหนึ่งแผ่น · ลูกบาศก์หนึ่งลูก
 * เพราะด่าน 1 มี 3 แท่น ด่าน 2–3 มี 4 แท่น วาดแท่นติดภาพเกาะไม่ได้
 *
 * ใช้ภาพเกาะรอบ 1 (เหมือนภาพตัวอย่าง: ลานต่างระดับ น้ำตกด้านหน้า) — เจ้าของโปรเจกต์เลือก 17 ก.ย. 2026
 * ภาพรอบ 2 (ลานเรียบกว้าง) เก็บไว้ที่ output/sequence-art/originals/island-round2.png
 * รอบ 1 ไม่มีลานว่างด้านหน้า แถวของที่รอเรียงจึงอยู่ใต้เกาะ ไม่ได้วางบนผิวเกาะ
 * พิกัดทั้งหมดเป็น % ของภาพเกาะ ห้ามกะด้วยตา ถ้าเปลี่ยนภาพต้องวัดใหม่
 * (output/sequence-art/measurements.json ตอนนี้เป็นค่าของรอบ 2 ค่าของรอบ 1 อยู่ในคอมเมนต์ด้านล่าง)
 */
export const SEQ_ISLAND = { src: '/games/sequence/island.webp', width: 1100, height: 1100 };
export const SEQ_PAD = { src: '/games/sequence/pad.webp', width: 512, height: 512 };
export const SEQ_BLOCK = { src: '/games/sequence/block.webp', width: 512, height: 512 };

/* วัดจากภาพรอบ 1 ด้วย scripts/measure-sequence-art.mjs ก่อนแก้เป็นรอบ 2:
   ผิวเทอร์ควอยซ์ y 35–60% · preview-layouts รอบ 1 กลางหน้าบนแผ่นแรก ≈ (33%, 47.5%) แผ่นที่ 4 ≈ (74.3%, 39.4%)
   กลางหน้าบนของภาพแผ่น = (50%, 41.9%) · กลางฐานของภาพบล็อก = (50%, 76.5%) (ใช้ใน sequence.css) */
/** ทางแผ่นทอง: แท่นแรกซ้ายหน้า (ใกล้คนดู) ไล่ขึ้นไปขวาหลัง — ทิศของทางคือตัวบอกว่า "เริ่มตรงไหน" */
export const PATH = { from: { x: 33, y: 47.5 }, to: { x: 74, y: 39.7 } };
/** ความกว้างแผ่นทอง % ของภาพเกาะ */
export const PAD_WIDTH = 15;

/** จุดกึ่งกลางของแท่นที่ rank ในด่านที่มี count แท่น */
export function padAt(rank: number, count: number) {
  const t = count > 1 ? rank / (count - 1) : 0;
  return { x: PATH.from.x + (PATH.to.x - PATH.from.x) * t, y: PATH.from.y + (PATH.to.y - PATH.from.y) * t };
}
