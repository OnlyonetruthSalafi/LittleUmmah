# P0-1 — สำรวจ branch และ worktree ที่ค้าง (อ่านอย่างเดียว)

อ่าน `D:/Littleummah/AGENTS.md` ก่อน แผนรวมอยู่ที่ `D:/Littleummah/docs/meetings/2026-11-07-global-hub-plan.md`

## เป้าหมาย
เจ้าของโปรเจกต์สั่ง "เก็บงานค้างให้เหลือฐานเดียว" ก่อนเริ่มงานใหญ่ งานนี้คือ **รายงาน** ว่าแต่ละที่มีอะไรค้าง
และเสนอวิธีรวม Claude จะใช้รายงานนี้รวมงานเอง — **คุณห้ามแก้ไฟล์ ห้าม git อะไรที่เปลี่ยนสถานะ**

## ที่ต้องสำรวจ (`git worktree list` ใน D:/Littleummah)
- `D:/Littleummah` [feature/islands-content] · `D:/Littleummah-art` [feature/art-coloring]
- `D:/Littleummah-hub` [feature/games-hub-categories] · `D:/Littleummah-landscape` [feature/games-landscape-stars]
- `D:/Littleummah-lm-fit` [feature/light-maze-topdown — เจ้าของโปรเจกต์ยกเลิกแนว top-down แล้ว 1 พ.ย.]
- `D:/Littleummah-lm-iso` [feature/light-maze-iso-fit]
- ฐานเทียบ = `main` (66cdf3b)

## ต่อแต่ละ worktree ให้ตอบ
1. commit ที่นำหน้า/ตามหลัง main
2. **ทุกไฟล์ที่ค้าง** (staged, unstaged, untracked) — ต่อไฟล์บอก: เป็นงานเรื่องอะไร (1 บรรทัด) และ **สถานะเทียบ main**:
   - `ALREADY-IN-MAIN` — เนื้อหาเดียวกันหรือเทียบเท่ามีใน main แล้ว (เช่น ไฟล์ untracked ที่ main มีไฟล์ชื่อเดียวกันเนื้อหาเหมือน, หรือ diff ที่ main ทำไปแล้ว) ใช้ `git diff main -- <file>` / `git hash-object` เทียบ
   - `NEWER-THAN-MAIN` — งานที่ main ยังไม่มี
   - `CONFLICTS` — main เปลี่ยนไฟล์นี้ไปอีกทาง ต้องเลือก
   - `JUNK` — log, ไฟล์ debug, ผลรันชั่วคราว
3. งานที่ยังไม่มีใน main นั้น **ดูเหมือนเสร็จหรือยังทำค้าง** (ดูจาก test ที่มี, TODO, ไฟล์ที่ import แต่ยังไม่มี) — ไม่ต้องรัน build
4. ซ้ำกับ worktree อื่นไหม (เช่น lm-iso กับ art-coloring อาจมีงาน ComingSoon/rewardStars ชุดเดียวกัน)

## สิ่งที่ต้องส่ง (เขียนเป็นข้อความตอบสุดท้าย — markdown ภาษาไทย)
```
## P0-1 รายงาน
### สรุป (ไม่เกิน 10 บรรทัด)
### ต่อ worktree  (ตาราง: ไฟล์ | สถานะ | เรื่อง)
### งานที่ main ยังไม่มีจริงๆ (จัดกลุ่มเป็นชุดงาน: ชื่อชุด, ไฟล์, เสร็จ/ค้าง, worktree ต้นทาง)
### ลำดับรวมที่เสนอ (ขั้นละบรรทัด, ระบุคำสั่ง git ที่ Claude ควรรัน)
### ทิ้งได้ (ไฟล์/worktree/branch ที่ไม่มีอะไรเหลือ)
### คำถามให้เจ้าของโปรเจกต์ (เฉพาะที่ตัดสินจากโค้ดไม่ได้)
```

## ห้าม
- แก้/สร้าง/ลบไฟล์, `git add/commit/checkout/reset/stash/merge/rebase/worktree remove/branch -d`
- ไฟล์ภาพใน `D:/Littleummah/tests/` เป็นของเจ้าของโปรเจกต์ — รายงานได้ แต่ห้ามจัดเป็น JUNK
- เดาว่างานเสร็จโดยไม่มีหลักฐาน — ถ้าไม่แน่ใจเขียนว่า "ไม่แน่ใจ" พร้อมเหตุผล

## เวลา
40 นาที — ถ้าไม่ทันให้ส่งเท่าที่ได้ และบอกว่าที่ไหนยังไม่ได้ดู
