# G-2 ภาพและที่มา

สร้างใหม่ด้วย built-in `image_gen` (ไม่มี asset ภายนอก) วันที่ 8 พ.ย. 2026 ไม่มีคน สัตว์ ใบหน้า ตัวหนังสือ หรือเครื่องดนตรี ใช้นูรีเดิมจาก `public/Character/idea.webp` ใน UI เท่านั้น

- `island-tilt.webp` (IMG-5, 8 พ.ย. 2026): เกาะกว้าง 16:10 **มุมเอียงเดียวกับภาพหน้าเกม** (ขอบหน้าโต๊ะ −7.05° เทียบต้นแบบ −6.32°) โต๊ะยาว + ถาดว่างบนเกาะ
  แทน island.webp/tray.webp เดิม (เจ้าของโปรเจกต์: ฉากรก ถาดใหญ่กว่าโต๊ะ ไม่มีมิติ) · พิกัดเชือก/scale ตามระยะลึก/ช่องถาด วัดจากภาพ
  → `scripts/build-bead-lacing-art.mjs` → `src/features/games/data/beadLacingArt.ts` · ตัวเลือกอยู่ `output/img-5/`
- `{blue,turquoise,gold,white}-{circle,square,star}.webp`: ลูกปัด 12 ชิ้นโปร่งใส ทุกสีมีครบ 3 รูปทรง
- `../hub/bead-lacing.webp`: การ์ด hub ใหม่
- เชือกและเข็มพลาสติก: SVG ใน `BeadLacingBoard.tsx` เป็นองค์ประกอบ UI ที่เขียนเอง

แปลงด้วย `scripts/optimize-images.mjs public/games/bead-lacing` และ `scripts/optimize-images.mjs public/games/hub` บันทึก sha256 ใน `scripts/source-images.json` ลูกปัด 320px เกาะ/ถาด 1100px hub 640px

พิกัดโต๊ะวัดจาก pixel mask ด้วย `scripts/measure-bead-lacing-art.mjs` ไม่อิงตำแหน่งจากการกะด้วยตา ค่าที่ได้อยู่ใน `output/g-2/measurements.json` พิกัดตัวอย่างใน intro วัดด้วย `scripts/measure-bead-lacing-demo.mjs`

alpha ต้นฉบับส่วนเนื้อวัตถุส่วนใหญ่อยู่ที่ 253/255 (โปร่งเล็กน้อยจาก imagegen) คง alpha ตามต้นฉบับ ไม่มีการเติมพื้นหลัง สแกนอยู่ใน `output/g-2/alpha-scan.json` ไม่มีสิ่งมีชีวิตใหม่ จึงไม่มี head-crops รอ Claude ตรวจรับภาพอีกครั้ง
