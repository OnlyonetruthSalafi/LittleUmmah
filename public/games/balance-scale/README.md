# ตาชั่งสมดุล — Balance Scale

VIS-2 ใช้ภาพเกาะหน้าเกม `../hub/balance-scale.webp` เป็น reference กับ built-in imagegen โดยตรง ไม่มีคน สัตว์ ใบหน้า ตัวหนังสือ หรือสัญลักษณ์ดนตรีในภาพใหม่

ชุดฉากที่ใช้จริง:
- `scene-island.webp`: เกาะทรายครีมขอบทอง ฐานหินเทอร์ควอยซ์และพุ่มไม้
- `scene-base.webp`: เสาเทอร์ควอยซ์ ลูกทอง และฐานกลมน้ำเงิน แบ่ง alpha ออกจากฉากบน canvas เดียวกัน ประกอบกลับเป็นภาพต้นฉบับ
- `scene-beam.webp`: คานทองและลูกกลมปลาย แยกชั้นสำหรับเอียง
- `scene-pan.webp`: จานทองว่างพร้อมก้านทองสามเส้น
- `scene-pan-front.webp`: ขอบหน้าจาน ตัดจากภาพจานเดียวกัน เพื่อบังขอบล่างสิ่งของอย่างถูกชั้น
- `scene-tray.webp`: ถาดไม้ขอบทองใต้เกาะ
- `scene-block.webp`: บล็อกน้ำเงินตามภาพ hub จุดน้ำหนัก 1–3 จุดเป็นโค้ดเดิม
- `apple.webp`, `orange.webp`, `watermelon.webp`, `pumpkin.webp`, `basket.webp`, `book.webp`: สิ่งของเดิม ไม่มีการเปลี่ยนเนื้อหา/น้ำหนัก

PNG ชื่อเดียวกันเป็นต้นฉบับสำหรับ pipeline; sha256 อยู่ใน `scripts/source-images.json` ภาพ WebP ใช้ alpha จริง
ภาพ `island`, `base`, `beam`, `pan-left`, `pan-right`, `block` ชุด G-3 เดิมเก็บไว้ แต่ฉากใหม่ไม่ได้อ้างอิง

เตรียมและวัดชิ้นภาพ: `node scripts/prepare-balance-scale-scene.mjs`
แปลงเฉพาะชุดเกม: `node scripts/optimize-images.mjs public/games/balance-scale`
ตรวจภาพใหม่: `node scripts/check-balance-scale-scene.mjs`
ตรวจเกม: `node scripts/check-balance-scale-browser.mjs http://localhost:3142`

พิกัด pivot และผิวรับของวัดจากพิกเซลของภาพในสคริปต์เตรียมภาพ; ความกว้างแขน 54% เป็นข้อกำหนด responsive (จาน 44% + ขอบเกาะด้านละ 1%) เพื่อรับบล็อก 64px สองคอลัมน์ได้บนมือถือ ไม่ใช่การคาดพิกัดในภาพ
ท่าเอียงใช้สูตรเดิม rotate / translateX / counterrotate จานยังตั้งตรงและตำแหน่งรับลากเคลื่อนตามจาน

หลักฐาน: `output/vis-2/options/`, `art-measurements.json`, `alpha-final.json`, `compare/`, `shots/`, `report.md`
Prompts: `output/vis-2/prompts.md`
