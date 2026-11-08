# ตาชั่งสมดุล — Balance Scale

ภาพสร้างด้วย built-in imagegen สำหรับ G-3: สิ่งของ/ผลไม้เท่านั้น ไม่มีคน สัตว์ ใบหน้า ข้อความ ตัวเลข หรือสัญลักษณ์ดนตรี หุ่นนูรีใช้ตัวเดิมจาก GameShell/VoiceIntro

- `island.webp`: เกาะตัวเลือก B
- `base.webp`, `beam.webp`, `pan-left.webp`, `pan-right.webp`: ชิ้นส่วนตาชั่งแยกอิสระ มีต้นฉบับ PNG โปร่งใสชื่อเดียวกัน
- `block.webp`: บล็อกไม้หน้าฟ้า จุด 1–3 จุดวาดด้วยโค้ด
- `apple.webp`, `orange.webp`, `watermelon.webp`, `pumpkin.webp`, `basket.webp`, `book.webp`: ของชั่งแยกชิ้น
- การ์ด hub: `../hub/balance-scale.webp`

ต้นฉบับและตัวเลือก: `output/g-3/options/` · prompts: `output/g-3/prompts.md`
เตรียมภาพและวัดพื้นที่: `node scripts/prepare-balance-scale-art.mjs`
แปลงเฉพาะชุดนี้: `node scripts/optimize-images.mjs public/games/balance-scale`
ตรวจ alpha/sha256: `node scripts/check-balance-scale-assets.mjs`

ต้นฉบับ PNG ถูก ignore ตาม pipeline เดิม; sha256 อยู่ใน `scripts/source-images.json` ไฟล์พร้อมเสิร์ฟเป็น WebP โปร่งใส
ภาพต้นฉบับมี alpha กลางผิวประมาณ 252–253/255 เก็บ alpha เดิมไว้ ผลสแกนทั้งต้นฉบับและไฟล์พร้อมใช้: `output/g-3/alpha-final.json`
