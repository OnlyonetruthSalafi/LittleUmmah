# P1-3 — หน้า error ที่เด็กเห็น

**model: `gpt-6-astra` (medium) · timeout 3600** — เป็นหน้าที่เด็กเล็กเห็นตอนมีปัญหา ต้องไม่ทำให้ตกใจ

ตอบและเขียนรายงานเป็นภาษาไทย ทำงานใน `D:/Littleummah-p1-3` (branch `codex/p1-3-error-pages` จาก main `197aae4`) เท่านั้น **ห้าม commit / push**
อ่าน `AGENTS.md` ทั้งไฟล์ (ข้อ 1.2, 2, 2.1, 3) และ **อ่าน `node_modules/next/dist/docs/` เรื่อง `error.js`, `global-error`, `not-found` ก่อน** — Next 16 ต่างจากที่คุณรู้
dev/preview server พอร์ต **3106** เท่านั้น ปิดก่อนจบ

## บริบท
- มี `src/app/[lang]/games/error.tsx` อยู่แล้ว (ใช้ `useDict()`, ข้อความจาก `t.games.error`, ปุ่มลองใหม่ + `BackLink`) — ใช้เป็นแบบ
- มี `src/app/[lang]/not-found.tsx` และ `src/app/global-not-found.tsx` (ใช้ `NotFoundPage`) — ดูหน้าตาเพื่อให้หน้า error เข้าชุดกัน
- ยังไม่มี error boundary ของ `[lang]` และ `learn/` ถ้าหน้าในหมวดเรียนรู้พัง เด็กจะเห็นหน้า error ดิบของ Next

## งาน
1. สร้าง `src/app/[lang]/learn/error.tsx` และ `src/app/[lang]/error.tsx` (+ `global-error.tsx` ถ้าเอกสาร Next 16 แนะนำ — global-error ต้องมี `<html>`/`<body>` เอง และใช้ `fontClasses`)
2. หน้าตา: หุ่นนูรี **ท่าที่มีอยู่แล้ว** ใน `public/Character/` (เช่น `idea` หรือ `welcome`) ข้อความสั้น อ่อนโยน ไม่โทษเด็ก
   เช่น "อุ๊ย หน้านี้ยังเปิดไม่ได้" + ปุ่ม **"ลองอีกครั้ง"** (เรียก `reset`) + ปุ่ม **"กลับหน้าหลัก"** (`LocaleLink`)
   ข้อความอยู่ใน dictionary ทั้ง `th` และ `en` (type `Text`), ไทยนำ อังกฤษรองตามแบบ `games/error.tsx`
3. ปุ่มเด็ก ≥ 64px, focus ชัด, contrast ผ่าน, motion ตามข้อ 2.1 (`motion-safe:`, ไม่มี `transition-all`), ภาพนูรีมี `alt` ที่มีความหมายหรือ `alt=""` ตามเกณฑ์ข้อ 2
4. **ห้ามแสดง `error.message` หรือ stack ให้เด็กเห็น** — log ด้วย `console.error` ได้ ถ้ามี `error.digest` ให้แสดงตัวเล็กสำหรับผู้ปกครองแจ้งปัญหาได้
5. ทดสอบ: สร้าง route ทดสอบชั่วคราวที่ throw error ตรวจทั้ง dev และ `next build && next start` ถ่ายภาพ 360×780, 844×390, 768×1024, 1280×720
   ไว้ใน `output/p1-3/shots/` แล้ว **ลบ route ทดสอบออกก่อนจบ**

## เกณฑ์ผ่าน
- `npm run verify` ผ่าน · ภาพครบ 4 ขนาด ไม่มีเลื่อนหน้า ไม่ล้น
- route ทดสอบถูกลบแล้ว (`git status` ไม่มี)
- `games/error.tsx` เดิมยังทำงาน (error ในเกมยังไปหน้า error ของเกม)

## ห้าม
- สร้างภาพใหม่/ท่าหุ่นใหม่ · emoji คน/สัตว์ · สัญลักษณ์ดนตรี · แก้ `games/error.tsx` เดิม (ยกเว้นย้ายข้อความเข้าที่ใช้ร่วมกัน และต้องบอกในรายงาน)
- commit / push / reset · แตะ worktree อื่น

## ส่ง
- `output/p1-3/report.md`: ไฟล์ที่สร้าง/แก้ · ข้อความไทย/อังกฤษทั้งหมด · ภาพ · ผลวัด tap target + contrast
- ข้อความตอบสุดท้ายใช้รูปแบบรายงานใน `D:/Littleummah/docs/meetings/2026-11-07-global-hub-plan.md` ข้อ 5.3

## เวลา
60 นาที
