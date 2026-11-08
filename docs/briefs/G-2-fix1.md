# G-2 fix 1 — ร้อยลูกปัด: แก้ตาม review
**model `gpt-6-astra` (medium) · timeout 7200 · worktree `D:/Littleummah-g2` (ทำต่อจากงานเดิม) · พอร์ต 3132**
กติกาเดิมทั้งหมดจาก `D:/Littleummah/docs/briefs/G-common.md` และ `G-2-bead-lacing.md` · ห้าม commit/reset/unstage

แก้ทุกข้อใน `D:/Littleummah/output/codex/G-2-review.md`:
1. ปุ่มฟังคำสั่งที่ซ่อนอยู่ใน `.gc-instruction` ยังรับ Tab — ให้ปุ่มฟังมองเห็นได้ ≥64px แบบเกมเดิม หรือถอดออกจากลำดับ Tab (ดูว่าเกมเดิมทำอย่างไรแล้วทำเหมือนกัน)
2. คืน focus หลัง DOM อัปเดต (effect) ไม่ใช่ทันทีหลัง `setBusy(false)` · จัด focus ตอนเปลี่ยนรอบ · ทดสอบด้วย Tab/Enter จริง ไม่บังคับ `.focus()` ในสคริปต์
3. การ์ดแบบห้ามแยกคำตอบด้วยสีอย่างเดียว — แสดงชื่อสี+รูปทรงสั้นๆ ใต้แต่ละช่องบนการ์ดแบบ (ไทยนำ) หรือออกแบบชุดโจทย์ให้ทุกช่องที่ต่างกันมีรูปทรงต่างกันด้วย เลือกแบบที่อ่านง่ายบนมือถือ 360px และไม่ล้น
4. ignore PNG ต้นฉบับ `/public/games/bead-lacing/*.png` ใน `.gitignore` ตามแบบโฟลเดอร์เกมเดิม (คง sha256)

## เกณฑ์ผ่าน
`npm run verify` + `scripts/check-bead-lacing-browser.mjs` ผ่าน (เพิ่ม assertion ของข้อ 1–3) · ภาพหน้าจอใหม่ 5 ขนาดใน `output/g-2/shots-fix1/` · รายงาน `output/g-2/report-fix1.md`
