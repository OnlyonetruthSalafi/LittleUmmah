# G-2 ภาพและที่มา

สร้างใหม่ด้วย built-in `image_gen` (ไม่มี asset ภายนอก) วันที่ 8 พ.ย. 2026 ไม่มีคน สัตว์ ใบหน้า ตัวหนังสือ หรือเครื่องดนตรี ใช้นูรีเดิมจาก `public/Character/idea.webp` ใน UI เท่านั้น

- `island.webp`: เลือกแบบ A จาก `output/g-2/options/island-a.png` เพราะโต๊ะกว้าง เสาสองข้างชัด พื้นไม้ต่อเนื่องรองรับเชือกตรง
- แบบ B: `output/g-2/options/island-b.png` โต๊ะวงรีและฐานหนา กินพื้นที่ใช้งานมากกว่า จึงไม่เลือก
- `{blue,turquoise,gold,white}-{circle,square,star}.webp`: ลูกปัด 12 ชิ้นโปร่งใส ทุกสีมีครบ 3 รูปทรง
- `tray.webp`: ถาดไม้ 4 ช่องโปร่งใส
- `../hub/bead-lacing.webp`: การ์ด hub ใหม่
- เชือกและเข็มพลาสติก: SVG ใน `BeadLacingBoard.tsx` เป็นองค์ประกอบ UI ที่เขียนเอง

แปลงด้วย `scripts/optimize-images.mjs public/games/bead-lacing` และ `scripts/optimize-images.mjs public/games/hub` บันทึก sha256 ใน `scripts/source-images.json` ลูกปัด 320px เกาะ/ถาด 1100px hub 640px

พิกัดโต๊ะวัดจาก pixel mask ด้วย `scripts/measure-bead-lacing-art.mjs` ไม่อิงตำแหน่งจากการกะด้วยตา ค่าที่ได้อยู่ใน `output/g-2/measurements.json` พิกัดตัวอย่างใน intro วัดด้วย `scripts/measure-bead-lacing-demo.mjs`

alpha ต้นฉบับส่วนเนื้อวัตถุส่วนใหญ่อยู่ที่ 253/255 (โปร่งเล็กน้อยจาก imagegen) คง alpha ตามต้นฉบับ ไม่มีการเติมพื้นหลัง สแกนอยู่ใน `output/g-2/alpha-scan.json` ไม่มีสิ่งมีชีวิตใหม่ จึงไม่มี head-crops รอ Claude ตรวจรับภาพอีกครั้ง
