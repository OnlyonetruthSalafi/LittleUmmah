# EVID-1: ทะเบียนหลักฐานศาสนา (roadmap 10.1 ข้อ 3) — ขั้นรวบรวม
**model `gpt-6.1-sol` (medium) · timeout 5400 · worktree `D:/Littleummah-evid1` (branch `feature/evid-1`, จาก main) · ไม่ต้องเปิด server**

อ่านก่อน: `AGENTS.md` ข้อ 1 (ทั้งหมด โดยเฉพาะ 1.6) และข้อ 3, `docs/meetings/2026-11-10-fable-hub-review.md` ข้อ 2 และ 10.1
รายงานเป็นภาษาไทยที่ `output/evid-1/report.md` · ห้าม commit / reset / unstage

## บทบาท: รวบรวมอย่างเดียว ห้ามตัดสิน
งานนี้เป็นงานกลไก **ห้ามเพิ่ม เดา หรือแก้ที่มา** (เลขอายะฮ์ เลขหะดีษ หน้าหนังสือ ลิงก์ Shamela ระดับหะดีษ) ที่ไม่มีอยู่แล้วใน comment ของไฟล์
- ที่มาที่อ่านไม่ชัดหรือไม่มีในไฟล์ → ใส่ในรายงานหัวข้อ "ไม่มีที่มา / ไม่ชัด" พร้อมไฟล์:บรรทัด ไม่ต้องหาเอง
- **ห้ามแก้ข้อความเนื้อหา** (`th`, `en`, `meaning`, `arabic`, `reading`, `say`, บทพากย์) แม้แต่ตัวเดียว ห้ามแตะ `public/audio`
- Claude จะยืนยันทีละรายการกับ Shamela ภายหลัง — ทุกรายการเริ่มที่ `verified: null`

## ทำ
1. `src/content/evidence.ts` — ทะเบียนกลาง type ชัดเจน เช่น
   ```ts
   export type Evidence = {
     id: string;                 // คงที่ อ่านออก เช่น "quran-18-32", "bukhari-3467", "muslim-2653"
     kind: "quran" | "hadith" | "athar" | "scholar";
     ref: string;                // ตามที่ comment เขียน เช่น "อัลกะฮ์ฟี 18:32-44", "บุคอรี 3467"
     grade?: string;             // เฉพาะที่ comment ระบุไว้แล้ว
     url?: string;               // เฉพาะลิงก์ที่มีใน comment
     translation?: string;       // เช่น "quran.com id 51" ถ้า comment ระบุ
     note?: string;
     verified: null | { by: "claude"; date: string; how: string };
   };
   ```
   รวมรายการซ้ำ (หะดีษเดียวกันอ้างหลายที่ = id เดียว)
2. เชื่อมเนื้อหากับทะเบียน — เพิ่ม field `evidence?: string[]` (id) ใน type ที่เกี่ยวข้อง แล้วใส่ id ในข้อมูล:
   - นิทานอัลกุรอาน `src/features/stories/data/*.ts` และหนังสือหะดีษ `src/features/stories/data/hadith/*.ts` — ระดับเล่ม และระดับหน้าที่มี `meaning`/`arabic`
   - เกาะศรัทธา `src/features/faith/data.ts` — ระดับฉาก/บทที่มีที่มาใน comment
   - บทเรียน `src/lib/lessons.ts`, `src/features/moral/*.ts`, `src/features/explore/data.ts` — เฉพาะจุดที่มีที่มาใน comment
   comment เดิมคงไว้ (อย่าลบ) เพิ่ม field อย่างเดียว
3. `tests/evidence.test.mjs` (รูปแบบเดียวกับ tests เดิม — ดู `tests/*.test.mjs` และวิธี import .ts ที่ใช้อยู่):
   - ทุก id ที่อ้างในข้อมูลมีอยู่ในทะเบียน, ไม่มี id ซ้ำ, ไม่มีรายการในทะเบียนที่ไม่ถูกใช้
   - ทุกหน้า/ฉากที่มี `meaning` หรือ `arabic` ต้องมี `evidence` (ของตัวเองหรือของเล่ม/บท) — ถ้าตอนนี้ยังมีที่ไม่ผ่านเพราะไม่มีที่มาใน comment ให้ใส่ใน allowlist ชื่อชัดเจน `MISSING_SOURCE` ในเทสต์ พร้อมรายการในรายงาน
   - quran kind ต้องไม่มี `arabic` ในหน้านิทาน (ข้อ 1.6) — ถ้ามีเทสต์นี้อยู่แล้วไม่ต้องซ้ำ
4. ยังไม่ต้องแก้ `/parents/evidence` (ขั้นถัดไป Claude ทำเอง)

## ตรวจก่อนส่ง
- `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`
- พิสูจน์ว่าข้อความเนื้อหาไม่เปลี่ยน: สคริปต์ใน `output/evid-1/` ที่เทียบทุก string ใน `th`/`en`/`meaning`/`arabic`/`say` ก่อน-หลัง (เช่น import ข้อมูลจาก main กับ worktree แล้ว deep-compare โดยตัด field `evidence` ออก) — ผลต้องเท่ากันทุกไฟล์
- `git diff --stat` ต้องมีเฉพาะไฟล์ในขอบเขตข้างล่าง

## แก้ได้
`src/content/**` (ใหม่), `src/features/stories/data/**`, `src/features/faith/data.ts`, `src/lib/lessons.ts`, `src/features/moral/data.ts`, `src/features/moral/cartoon.ts`, `src/features/explore/data.ts`, type ที่เกี่ยวข้อง (`src/features/stories/types.ts` หรือที่ type อยู่จริง), `tests/evidence.test.mjs`, `output/evid-1/**`

## รายงาน `output/evid-1/report.md`
จำนวนรายการในทะเบียนแยก kind, ตารางทุกรายการ (id · ref · ใช้ที่ไหนบ้าง · url ถ้ามี), หัวข้อ "ไม่มีที่มา / ไม่ชัด", หัวข้อ "ที่มาที่ comment เขียนไม่ตรงกันระหว่างไฟล์" (เช่นหะดีษเดียวกันเลขต่างกัน — ห้ามเลือกเอง), ผล checks และผลเทียบข้อความ
