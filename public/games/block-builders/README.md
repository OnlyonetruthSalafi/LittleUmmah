# ต่อบล็อกสร้างบ้าน — G-4 fix 1

สร้างด้วย imagegen โดยใช้ `../hub/block-builders.webp` เป็นภาพอ้างอิง ภาพหน้าเกมคงเดิม ไม่มีบุคคล สัตว์ ตัวหนังสือ หรือ asset จากเกมอื่น

- `island.webp`: เกาะกลมลานไม้ครีม ขอบทอง ฐานหินเทอร์ควอยซ์ พุ่มไม้คู่ และทรงกระบอกไม้คู่ ลบบ้านออกแล้วเติมลานว่าง
- `cube.webp`, `beam.webp`, `roof.webp`, `arch.webp`, `cylinder.webp`, `dome.webp`: ชิ้นไม้ 3D แยกชิ้นตามวัสดุและมุมกล้องอ้างอิง
- `tray.webp`: ถาดไม้ขอบทอง
- แบบ `home-5` ระดับ 2 ใช้ฐานน้ำเงิน ประตูขาว คานเทอร์ควอยซ์ หลังคาทอง ตรรกะเดิม 5 ชิ้น

ต้นฉบับที่เลือก: `output/g-4/fix1-source/` ตัวเลือกเก่า: `output/g-4/options/`

```sh
node scripts/prepare-block-builders-art.mjs
node scripts/optimize-images.mjs public/games/block-builders
node scripts/check-block-builders-assets.mjs
```

คำสั่ง prepare เดิมเรียก `prepare-block-builders-fix1.mjs` แยก sprite ด้วย connected components ของ opaque alpha ใช้ `cleanBalanceAlpha` ตัด matte ต่ำกว่า 240 หดขอบ 2 พิกเซล และ antialias ใหม่ ประตูแก้แยกให้ช่องโค้งโปร่งใสจริง

วัดลานจากพิกเซลจริง: `blockBuildersArt.ts` และ `output/g-4/fix1-measurements.json` ไม่บีบภาพเกาะให้แบน

sha256: `scripts/source-images.json` · alpha: `output/g-4/alpha-final.json` · ภาพเทียบ: `output/g-4/compare/`

ไม่มีสิ่งมีชีวิต จึงไม่มี head-crops