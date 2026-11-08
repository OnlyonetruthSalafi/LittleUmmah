# P0-4 — จัดโฟลเดอร์เอกสารงาน

**model: `gpt-6.1-sol` (medium) · timeout 1800** — ย้ายไฟล์ตามรายการ ไม่มีทางเลือกให้ชั่ง

ตอบและเขียนรายงานเป็นภาษาไทย ทำงานใน `D:/Littleummah-p0-4` (branch `codex/p0-4-docs-tidy` จาก main `197aae4`) เท่านั้น **ห้าม commit / push**
อ่าน `AGENTS.md` ก่อน งานนี้ไม่ต้องเปิด server

## ปัญหา
รากโปรเจกต์มีไฟล์ brief/handoff เก่า 15 ไฟล์ ปนกับเอกสารหลัก

## งาน
1. ย้ายด้วย **`git mv`** ไปที่ **`docs/briefs/archive/`**:
   `CODEX_BISMILLAH_BRIEF.md` `CODEX_CLASSROOM_BRIEF.md` `CODEX_EXPLORE_BRIEF.md` `CODEX_EXPLORE_BRIEF_2.md` `CODEX_GAME_GUIDE_BRIEF.md`
   `CODEX_MORAL_BRIEF.md` `CODEX_MORAL_CAST_BRIEF.md` `CODEX_MORAL_SCENES_BRIEF.md` `CODEX_ORBMAZE_ART_BRIEF.md` `CODEX_ORBMAZE_PLAN_BRIEF.md`
   `CODEX_PUZZLE_BRIEF.md` `CODEX_SEQUENCE_BRIEF.md` `CODEX_STORYBOOK_BRIEF.md` `CODEX_HANDOFF.md` `CLAUDE_HANDOFF.md`
   **ไม่ย้าย**: `AGENTS.md` `CLAUDE.md` `README.md` `GAME_*.md`
2. grep ทั้ง repo (ยกเว้น `node_modules`, `.next`, `output/`) หาทุกจุดที่อ้างชื่อไฟล์ที่ย้าย แล้วแก้ **เฉพาะ path** ห้ามแก้เนื้อความอื่น
   (comment ในโค้ด เช่น `src/features/arabic/components/Classroom.tsx`, `scripts/optimize-images.mjs` แก้ได้เฉพาะ path ใน comment)
   ไฟล์ใน `output/` (ถูก ignore) ไม่ต้องแก้ แค่นับจำนวนในรายงาน
3. สร้าง `docs/briefs/archive/README.md`: บอกว่าเป็น brief ของงานที่เสร็จแล้ว ใช้อ่านประวัติ + ตาราง ชื่อไฟล์ → งานอะไร (1 บรรทัด อ่านจากหัวไฟล์)
4. ห้ามแตะไฟล์อื่นใน `docs/briefs/` นอก `archive/` · **ห้ามแตะ `tests/`** (ภาพในนั้นจะถูก ignore ด้วย `.gitignore` แยกต่างหาก)

## เกณฑ์ผ่าน
- `git status` แสดง 15 รายการเป็น renamed (R) ไม่ใช่ deleted + untracked
- grep ชื่อไฟล์ทั้ง 15 ในไฟล์ที่ track ไม่เหลือ path เก่า (แปะผล grep)
- `npm run verify` ผ่าน · diff ของไฟล์ `src/` มีแต่ comment (แปะ diff ทั้งหมด)

## ห้าม
แก้เนื้อหา brief เดิม · ลบไฟล์ · ย้ายไฟล์นอกรายการ · แตะ `tests/`, `output/`, worktree อื่น · commit / push / reset

## ส่ง
- `output/p0-4/report.md`: รายการย้าย · ไฟล์ที่แก้ path (ไฟล์:บรรทัด) · จำนวนไฟล์ใน `output/` ที่ยังอ้าง path เก่า · ผล verify
- ข้อความตอบสุดท้ายใช้รูปแบบรายงานใน `D:/Littleummah/docs/meetings/2026-11-07-global-hub-plan.md` ข้อ 5.3

## เวลา
20 นาที
