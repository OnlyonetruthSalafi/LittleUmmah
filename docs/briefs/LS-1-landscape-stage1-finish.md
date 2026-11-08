# LS-1 — ทำเกมแนวนอน Stage 1 ให้เสร็จ (ต่องานเดิม)

ตอบและเขียนรายงานเป็นภาษาไทย ทำงานใน `D:/Littleummah-landscape` (branch `feature/games-landscape-stars`) เท่านั้น **ห้าม commit / push**
อ่านก่อนลงมือ: `AGENTS.md` ทั้งไฟล์ (โดยเฉพาะข้อ 1, 1.3, 1.5, 2, 2.1, 3) แล้วอ่าน brief ต้นฉบับ
**`output/games-landscape-consult/BRIEF-stage1.md`** — ขอบเขต เกณฑ์ผ่าน และสิ่งที่ต้องส่ง **ใช้ตามไฟล์นั้นทั้งหมด** ไฟล์นี้บอกแค่สิ่งที่เปลี่ยนและสิ่งที่ค้าง

## สิ่งที่เปลี่ยนตั้งแต่รอบก่อน
- รอบก่อนหยุดกลางทางเพราะโควต้าหมด ไม่มี `stage1-report.md`
- worktree นี้ **fast-forward มาที่ main `197aae4` แล้ว** (มีเกาะศิลปะ, การ์ดกำลังเตรียม, CI) งาน Stage 1 ที่ค้างยังอยู่ใน working tree ครบ — ใช้ต่อ อย่าเริ่มใหม่
- มีคำสั่งตรวจเดียวแล้ว: **`npm run verify`** (typecheck แบบ `next typegen` → lint → test → build) ใช้แทนการรันสี่คำสั่งแยก
- `D:/Littleummah-baseline` คือ main `197aae4` แบบสะอาด (detached, มี node_modules) ใช้วัด baseline เท่านั้น ห้ามแก้ไฟล์ในนั้น

## ปัญหาที่รอบก่อนเจอและยังไม่ปิด (จากรายงาน P0-1)
1. **sequence ไม่ผ่าน 8 แถว** — `844×390` เอกสารสูง 393px (เกิน 3px), `932×430` ของเล่นหลุดจอ
   ห้ามแก้ด้วยการขยาย `PAD_WIDTH` หรือย่อเกาะ (AGENTS ข้อ 2 ส่วนเกม sequence) — แก้ที่ layout รอบกระดาน/แถวของที่รอเรียง
2. **Light Maze regression ไม่ตรง baseline ที่ 1024×768 และ 1180×820 ทั้งสามด่าน**
   baseline เดิม (`measurements.md`) วัด **ก่อน** commit `66cdf3b` ซึ่งเจ้าของโปรเจกต์อนุมัติให้เปลี่ยน layout Light Maze แล้ว
   → **วัด baseline ใหม่จาก `D:/Littleummah-baseline`** (พอร์ต 3102) แล้วเทียบกับ worktree นี้ (พอร์ต 3101) ต้องตรงกัน
   ถ้ายังต่าง แปลว่างาน Stage 1 ไปกระทบ Light Maze ต้องแก้ฝั่ง Stage 1 ห้ามแก้ไฟล์ Light Maze
3. **page error ของ CSS chunk ตอนเล่น arabic-match ด้วยเมาส์** — ตรวจว่าเกิดจากแอปหรือจาก dev server (ลอง `next build && next start` เทียบ) รายงานผล
4. **flow แนวตั้ง→RotateGate→แนะนำ→นับถอยหลัง ยังไม่ได้ตรวจ** เพราะ `runStage1Flow()` กรองเฉพาะเกมที่เปิด `fullscreen`
   เปิด `fullscreen: true` ทีละเกมที่ผ่านเกณฑ์อื่นครบแล้ว แล้วรัน flow ของเกมนั้น เกมที่ flow ไม่ผ่านให้ปิดกลับและรายงานเหตุผล
5. ภาพหลักฐาน/baseline ฟอนต์อยู่ใน `output/games-landscape-consult/` (ถูก ignore) — ใช้ได้ อย่าลบ

## ส่งงาน (เพิ่มจาก brief ต้นฉบับ)
- `npm run verify` ผ่าน + `node scripts/check-game-landscape-browser.mjs` ผ่าน (แปะสรุปผล)
- `output/games-landscape-consult/stage1-report.md` ตาม brief ต้นฉบับ และเพิ่มหัวข้อ
  - "ปัญหา 1–4 ข้างบน: แก้อย่างไร / ผลวัดหลังแก้"
  - "ขนาดชิ้นที่ต่ำกว่า 64px" ต่อเกมต่อจอ (เจ้าของโปรเจกต์ตัดสิน — ห้ามย่อเงียบ)
  - "สิ่งที่ยังไม่ได้ตรวจ" (เช่น อุปกรณ์จริง)
- ข้อความตอบสุดท้ายใช้รูปแบบรายงานใน `D:/Littleummah/docs/meetings/2026-11-07-global-hub-plan.md` ข้อ 5.3
- ปิด dev/preview server ทุกตัวที่เปิดเองก่อนจบ (เช็กพอร์ต 3101, 3102)

## ห้าม
- commit / push / reset / stash / checkout ไฟล์ · แตะไฟล์นอก worktree นี้ (ยกเว้นอ่าน `D:/Littleummah-baseline`)
- แก้ `memory.css`, `puzzle.css`, `MemoryBoard.tsx`, `PuzzleBoard.tsx`, ไฟล์ Light Maze, `shape.css` ส่วนที่ AGENTS ล็อกไว้
- เปลี่ยนภาพเกาะ/หุ่นยนต์ · ใส่ emoji คน/สัตว์ หรือสัญลักษณ์ดนตรี · `transition-all` · transform ที่ไม่มี `motion-safe:`
- เปลี่ยน `SHOW_REWARD_STARS` (ต้องเป็น false)

## เวลา
3 ชั่วโมง — ถ้าไม่ทันให้หยุด เขียน `stage1-report.md` เท่าที่ได้ และบอกว่าเหลืออะไร
