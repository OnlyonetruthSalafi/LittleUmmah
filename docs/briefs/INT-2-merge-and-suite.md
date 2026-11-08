# INT-2 — รวมงานที่เหลือ แก้จุดชน แก้ 2 ข้อจาก INT-1 และรันชุดตรวจทั้งหมด
**model `gpt-6-astra` (medium) · timeout 10800 · worktree `D:/Littleummah-int` (branch `integration/2026-11-08`) · พอร์ต 3200**
ตอบภาษาไทย **ห้าม commit/push/reset/stash/checkout ไฟล์ทิ้ง** · อ่าน `AGENTS.md` ข้อ 1–3 และ `D:/Littleummah/output/codex/INT-1-report.md` + `output/int-1/REPORT.md`

## สถานะตอนเริ่ม
index มีงานรวมแล้ว 12 ชิ้น (P0-3, P0-4, P1-1, P1-2, P1-3, LS-1, C-1, C-3, C-4, C-5, C-7, C-8) ผ่าน verify แล้ว
Claude เพิ่ง `git apply --3way --index` ต่อ:
- **C-6** (จับคู่อักษรอาหรับครบ 28 ตัว 7 ชุด + ปุ่มเลือกชุดมีเครื่องหมายถูก + ล้าง feedback เมื่อเปลี่ยนชุด) → ชนใน `scripts/check-game-landscape-browser.mjs`, `GameShell.tsx`, `games.css`, `MatchingBoard.tsx`
- **C-10** (เกมเรียงลำดับ ชุดของใหม่ 3 ชุด + เสียงสอนกลาง + ปุ่มของเล่น ≥64px) → ชนใน `scripts/check-sequence-browser.mjs`, `scripts/source-images.json`, `SequenceBoard.tsx`
- **C-11** (หยอดรูปทรง ชุดสีพาสเทล) และ **C-12** (สำรวจโลก ฟาร์ม+สวนดอกไม้) → **ยังไม่เข้า** เพราะ index ค้างไฟล์ชน: ใช้ `git apply --3way --index D:/Littleummah/output/codex/patches/c11.patch` และ `c12.patch` หลังแก้ชนชุดแรกเสร็จ
แพตช์ต้นฉบับทุกงานอยู่ที่ `D:/Littleummah/output/codex/patches/<id>.patch` worktree ต้นทาง `D:/Littleummah-<id>` (อ่านอย่างเดียว ห้ามแก้) รายงานของแต่ละงาน `D:/Littleummah/output/codex/<ID>-report.md`

## งาน
1. **แก้จุดชนทุกไฟล์** ให้ได้พฤติกรรมของทุกงานรวมกัน (ไม่ทิ้งฝั่งใด) — `source-images.json` รวมทุก key; `GameShell.tsx` ต้องคง `paused={gated}` (LS-1), `pictureId/onPicture` บน `GameIntro` (C-5) และ callback ล้าง feedback (C-6); `games.css` คง layout แนวนอน (LS-1) + ฟอนต์อาหรับ (P1-1) + ปุ่มชุด (C-6); สูตรความสูงแถวของ LS-1 ต้องรองรับจำนวนอักษรต่อชุดของ C-6
2. **(ข) จาก INT-1:** อักษรอาหรับ Naskh ล้นกรอบปุ่มที่ 932×521, 932×540, 1101×521 — Claude ตัดสินแล้ว: ปรับ font-size/line-height ของ `.gc-letter[lang="ar"]` ในช่วงจอเตี้ยตามความสูงแถวจริง (เช่น clamp จาก `--gc-match-row`) ห้ามย่อปุ่มต่ำกว่า 64px ห้ามเปลี่ยนฟอนต์ ห้ามย่อ artwork เดสก์ท็อปต่ำกว่า baseline ตรวจซ้ำด้วยชุดอักษรของ C-6 ทุกชุด
3. **(ค) จาก INT-1:** แก้ `scripts/check-game-routes.mjs:25` ให้รู้จัก `GameTutorial` ตามข้อเสนอ INT-1 (ไม่เพิ่มชื่อโลกกลับเข้าหน้า)
4. **รวมสคริปต์ตรวจมารยาท:** `scripts/check-moral-duas-browser.mjs` เป็นสำเนาจาก C-8 (โหมด `--daily-duas`) ย้ายส่วนตรวจดุอาอ์เข้า `scripts/check-moral-browser.mjs` (ใช้ base/OUT แบบ P0-3) แล้วลบไฟล์สำเนา
5. `npm run verify` แล้ว build + `next start -p 3200` รัน `npm run verify:browser` และสคริปต์ตรวจของทุกงาน (รวม `check-arabic-match-browser`, `check-shape-browser`, ตรวจดุอาอ์) จนผ่านหมด
   ข้อตกที่เป็นดีไซน์ใหม่ (ไม่ใช่จากการรวม) ให้รายงาน ไม่ต้องแก้
6. ห้ามแตะ: ตัวอาหรับ/คำแปล/บทพูดศาสนา (`tests/fixtures/daily-duas.json` ต้องผ่าน), ภาพ, เสียง · ห้ามลด assertion/เกณฑ์ 64px
7. `git add` ทุกไฟล์ที่แก้ ปิด server ผลไว้ที่ `output/int-2/`

## รายงาน (5.3)
- ตารางไฟล์ชน: เลือกอย่างไร (ไฟล์:บรรทัด) — Claude จะอ่าน diff จุดเหล่านี้
- ตารางสคริปต์: ผ่าน/ตก จำนวนข้อ
- ข้อ (ข): ขนาดอักษร/ปุ่มที่วัดได้ก่อน/หลังทุกขนาดจอที่เคยตก
