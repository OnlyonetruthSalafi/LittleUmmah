# INT-1 — รันชุดตรวจเบราว์เซอร์ทั้งหมดบน worktree รวมงาน
**model `gpt-6-astra` (medium) · timeout 7200 · worktree `D:/Littleummah-int` (branch `integration/2026-11-08`) · พอร์ต 3200**
ตอบเป็นภาษาไทย ห้าม commit/push/reset/stash · อ่าน `AGENTS.md` ข้อ 1–3

## บริบท
Claude รวมงาน 11 ชิ้นเข้า worktree นี้ (ยังไม่ commit — ดูด้วย `git diff --cached` เทียบ 197aae4): P0-3, P0-4, P1-1, P1-2, P1-3, LS-1, C-1, C-3, C-4, C-5, C-7
มีไฟล์ชนที่ Claude แก้เอง: `src/i18n/dict/{th,en}.ts`, `scripts/source-images.json`, `src/components/learn/LessonCard.tsx`, `src/features/moral/components/MoralLessons.tsx`,
`src/features/games/games.css`, `src/features/games/components/GameShell.tsx`, `scripts/check-{moral,explore,game-landscape}-browser.mjs`
`npm run verify` ผ่านแล้ว

## งาน
1. `npm run build` แล้ว `next start -p 3200` รัน `npm run verify:browser` (ส่ง base http://localhost:3200) และสคริปต์ตรวจของแต่ละงานที่ไม่อยู่ใน runner:
   `check-game-landscape-browser.mjs`, `check-art-browser.mjs`, `check-puzzle-browser.mjs`, `check-memory-browser.mjs` (ถ้ามี), `check-explore-browser.mjs`, `check-moral-browser.mjs`, `check-sequence-browser.mjs`, `check-classroom-browser.mjs`
2. ข้อที่ตก: แยกว่าเป็น (ก) สคริปต์รวมผิด/พอร์ตหรือ path ไม่ตรง (ข) โค้ดแอปพังจากการรวม (ค) ตกอยู่แล้วก่อนรวม (เช่น ชื่อ "เกาะเขาวงกตแสง" ใน check-game-routes)
   - (ก) และ (ข) **แก้ได้** แก้ให้น้อยที่สุด ตรงจุด แล้ว `git add` ไฟล์ที่แก้ (ไม่ commit)
   - (ข) ที่ต้องตัดสินใจเรื่องดีไซน์ หรือ (ค) ให้รายงาน ไม่ต้องแก้ — ยกเว้นข้อ "เกาะเขาวงกตแสง": ตรวจว่าหลัง LS-1 ชื่อโลกยังควรแสดงใน HTML หรือไม่ (ดู `presentation.ts` `world` และหน้าเกม) แล้วเสนอว่าแก้หน้า หรือแก้ assertion พร้อมเหตุผล
3. ห้ามลด assertion/เกณฑ์ 64px เพื่อให้ผ่าน · ห้ามแตะเนื้อหาศาสนา ภาพ เสียง
4. ปิด server ก่อนจบ ผลและ log ไว้ที่ `output/int-1/` รันจนครบทุกสคริปต์แม้บางตัวตก

## รายงาน (รูปแบบ 5.3 ใน `docs/meetings/2026-11-07-global-hub-plan.md`)
ตาราง: สคริปต์ · ผ่าน/ตก · จำนวนข้อ · ถ้าตก: ประเภท (ก/ข/ค) + สิ่งที่แก้ (ไฟล์:บรรทัด) หรือข้อเสนอ
