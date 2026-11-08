# P0-3 — ซ่อมสคริปต์ตรวจเบราว์เซอร์ + `npm run verify:browser`

**model: `gpt-6.1-sol` (medium) · timeout 5400** — งานกลไกตรวจผลได้ชัด ถ้า 2 รอบไม่จบ Claude ยกระดับเป็น astra

ตอบและเขียนรายงานเป็นภาษาไทย ทำงานใน `D:/Littleummah-p0-3` (branch `codex/p0-3-browser-checks` จาก main `197aae4`) เท่านั้น **ห้าม commit / push**
อ่าน `AGENTS.md` ทั้งไฟล์ก่อน node_modules ติดตั้งแล้ว ใช้ dev/preview server พอร์ต **3104** เท่านั้น
(3101–3103 มีงานอื่นใช้ ห้ามแตะ) ปิด server ที่เปิดเองก่อนจบ

## ปัญหา
สคริปต์ตรวจเบราว์เซอร์ใน `scripts/` เขียนไว้ตอนทำแต่ละหมวด แล้วหน้าเว็บเปลี่ยนต่อ สคริปต์ 5 ตัวจึงตกทั้งที่หน้าเว็บอาจถูกแล้ว:
`check-bookshelf-browser.mjs`, `check-classroom-browser.mjs`, `check-explore-browser.mjs`, `check-moral-browser.mjs`, `check-storybook-browser.mjs`

## งาน
1. รันทั้ง 5 ตัวกับ main ปัจจุบัน จดผลเดิม (ข้อไหนตก ค่าที่คาด vs ค่าจริง)
2. แยกแต่ละข้อที่ตกเป็นสองชนิด
   - **สคริปต์เก่า** (selector เปลี่ยน, ค่าที่คาดตาม layout เดิม, URL เปลี่ยนเป็นแบบ `[lang]`) → แก้สคริปต์ให้ตรงหน้าปัจจุบัน
   - **หน้าเว็บผิดจริง** (tap target < 64px ที่ไม่อยู่ในข้อยกเว้นข้อ 2 ของ AGENTS, ภาพ/ข้อความล้น, alt หาย, focus มองไม่เห็น) →
     **ห้ามแก้หน้าเว็บ และห้ามแก้สคริปต์ให้ผ่าน** คงการตรวจไว้แล้วรายงาน พร้อมภาพหลักฐาน
   ไม่แน่ใจว่าชนิดไหน → ถือว่า "หน้าเว็บผิดจริง" และรายงาน
3. สร้าง `scripts/verify-browser.mjs` รันสคริปต์ `scripts/check-*-browser.mjs` ทุกตัว + `check-game-routes.mjs` ต่อกัน
   (รับ base URL จาก env/arg ค่าเริ่มต้น `http://localhost:3104`) สรุปผ่าน/ตกต่อสคริปต์ exit code ≠ 0 ถ้ามีตัวตก
   เพิ่ม `"verify:browser"` ใน `package.json` เขียนวิธีใช้ไว้หัวไฟล์ (ต้องเปิด server ก่อน — แนะนำ `next build && next start -p 3104`)
   **ห้ามแก้สคริปต์เกม** (`check-game-*`, `check-lightmaze-*`, `check-sequence-*`, `check-puzzle-*`, `check-shape-*`, `check-games-hub-*`, `check-art-*`)
   — งาน LS-1 กำลังแก้ส่วนเกมอยู่ ถ้าตัวไหนตก ให้รายงานเฉยๆ

## ไฟล์ที่แก้ได้
5 สคริปต์ข้างบน · สร้าง `scripts/verify-browser.mjs` · `package.json` (เฉพาะ scripts)

## เกณฑ์ผ่าน
- `npm run verify` ผ่าน
- `npm run verify:browser` กับ server พอร์ต 3104: 5 สคริปต์ผ่าน ยกเว้นข้อที่รายงานว่า "หน้าเว็บผิดจริง"
- **จำนวนข้อตรวจในแต่ละสคริปต์ไม่ลดลง** (นับก่อน/หลังใส่ในรายงาน) ข้อตรวจที่เปลี่ยนต้องบอกเหตุผล
- `git status` แสดงเฉพาะไฟล์ใน `scripts/` และ `package.json`

## ห้าม
- แก้หน้าเว็บให้ตรงสคริปต์ · ลบข้อตรวจ · ลดเกณฑ์ (เช่น 64px → 48px)
- commit / push / reset / ลบไฟล์ที่ไม่ได้สร้างเอง · แตะ worktree อื่น
- เก็บภาพหน้าจอนอก `output/p0-3/` (ห้ามใน `tests/` หรือ `public/`)

## ส่ง
- `output/p0-3/report.md`: ตารางต่อสคริปต์ (ข้อที่ตกเดิม · ชนิด · แก้อย่างไร · จำนวนข้อตรวจก่อน/หลัง) · รายการ "หน้าเว็บผิดจริง" + ภาพ · ผล `verify:browser` ทุกตัว
- ข้อความตอบสุดท้ายใช้รูปแบบรายงานใน `D:/Littleummah/docs/meetings/2026-11-07-global-hub-plan.md` ข้อ 5.3

## เวลา
90 นาที — ถ้าไม่ทัน หยุดแล้วเขียนรายงานเท่าที่ได้ บอกว่าเหลืออะไร
