# ชุดสี pastel — C-11

ชุดสีใหม่ของรูปทรงห้าชิ้นเดิม ไม่เพิ่มด่านและไม่เพิ่มชนิดดาว:
วงกลมส้มคอรัล, สี่เหลี่ยมจัตุรัสม่วง, สามเหลี่ยมเทอร์ควอยซ์,
สี่เหลี่ยมผืนผ้าชมพู, ดาวห้าแฉกฟ้า

ภาพสร้างด้วย built-in imagegen จากภาพบล็อก/ถาดของโปรเจกต์ ไม่ใช้ asset ภายนอก
ไม่มีตัวหนังสือ ใบหน้า คน หรือสัตว์ แหล่ง PNG และ prompt อยู่ใน `output/C-11/`
sha256 ของแหล่งภาพบันทึกใน `scripts/source-images.json`

ใช้ถาดและขอบทองเดิม อ่าน mask ด้วย `scripts/shape-art-masks.mjs`
เปลี่ยนเฉพาะเนื้อในหลุม ไม่มีการกะหรือเปลี่ยน HOLES
ชื่อ `plate-xxxxx.webp` ใช้ลำดับบิต circle, square, triangle, rectangle, star เหมือนเดิม
บล็อก 420×420 และถาด 900×748 เป็น WebP พื้นหลังโปร่งใส

สร้างซ้ำ (ต้องมี PNG ต้นฉบับใน `output/C-11/originals/`):

```sh
node scripts/prepare-shape-art.mjs --pastel
node scripts/optimize-images.mjs public/games/shape/pastel
node scripts/scan-shape-alpha.mjs
node --test tests/shape-art.test.mjs
```

PNG ที่เตรียมไว้ในโฟลเดอร์นี้เป็นไฟล์กลาง หลัง optimize ให้เก็บเฉพาะ WebP
การเล่นสุ่มชุดแรกหลัง mount และสลับกับ classic ในรอบถัดไปผ่าน sessionStorage
ถ้า storage ถูกบล็อก ใช้สุ่มแต่ละรอบแทน โดยยังบันทึกความคืบหน้าในด่านเดิม
