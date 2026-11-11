# QUIZ-1 UI: คำถามท้ายบทวัย 7+ — roadmap 10.2 ข้อ 3
**model `gpt-6-astra` (medium) · timeout 7200 · worktree `D:/Littleummah-quiz` (branch `feature/quiz-1`, จาก main) · port 3175**

อ่านก่อน: `AGENTS.md` ทั้งหมด (1.1, 1.6, 2, 2.1, 3), **`docs/briefs/QUIZ-1-questions.md` (ตัวบทคำถาม — ใช้ตรงตัว ห้ามแต่ง/แก้ถ้อยคำ)**,
`src/features/moral/components/MoralLessons.tsx` + `CartoonLesson.tsx` (ตัวเล่นการ์ตูนที่ใช้ร่วมกับเกาะมารยาท/สำรวจโลก/อิสลามพื้นฐาน), `src/features/learning-stars/` (การตัดสิน 1 พ.ย.: 1 ดาว/บท/วัน ไม่มี streak ไม่มีรางวัลสุ่ม)
อ่านคู่มือ Next ใน `node_modules/next/dist/docs/` ก่อนแก้ component · รายงานไทย `output/quiz-1/report.md` · ห้าม commit / reset

## งาน
1. ข้อมูลคำถามใหม่ `src/features/quiz/questions.ts` — `Record<lessonId, { prompt: Text; options: [Text, Text, Text]; answer: 0|1|2 }>` 16 บทตามตาราง (ตัวเลือกที่ "ใช้ body.en ของบทต้นทาง" ให้อ้าง/คัดลอก body ของบทนั้นตรงตัว — เขียน test ยืนยันว่าตรง)
   ไฟล์นี้ import ได้แค่ type (สคริปต์เสียง Node จะ import ตรง — แบบเดียวกับ faith/data.ts)
2. **แสดงหลังการ์ตูนจบ เฉพาะบทวัย 7+ ที่มีคำถาม** — ตอนนี้การดูจบเรียก `markPractised` → `awardLesson` ทันที
   เปลี่ยนเฉพาะบทที่มีคำถาม: ดูจบ → จอคำถาม → **ตอบถูกจึงเรียก markPractised/awardLesson เดิม** · ตอบผิด = ข้อความลองใหม่ เลือกใหม่ได้ไม่จำกัด ไม่หักดาว ไม่จับเวลา
   บทวัย 3–6 และบทที่ไม่มีคำถาม ทำงานเหมือนเดิมทุกอย่าง (ห้ามเปลี่ยนพฤติกรรม)
   มีปุ่ม "ดูการ์ตูนอีกครั้ง" และปิดได้ (ปิดก่อนตอบ = ยังไม่ได้ดาว/ยังไม่นับฝึก)
3. ลำดับตัวเลือกสลับแบบคงที่ (hash ของ lessonId) ไม่ใช้ `Math.random`
4. หลังเลือก: ตัวเลือกที่ถูก/ผิดมี **ไอคอนถูก/กากบาท + ข้อความ** ไม่ใช้สีอย่างเดียว · ข้อความตอบถูก/ผิดตาม QUIZ-1-questions.md · ประกาศผลให้ screen reader (`aria-live="polite"`)
5. ภาพ: ฝั่งอิสลามพื้นฐาน ตัวเลือกใช้ภาพการ์ดของบทต้นทาง (`/faith/card-*.webp`, `alt=""` เพราะมีข้อความอยู่แล้ว) · ฝั่งมารยาทไม่ต้องมีภาพตัวเลือก ใช้นูรี (`public/Character/` ท่าเดิม) ประกอบจอคำถาม — **ไม่สร้างภาพใหม่**
6. เสียง: รอบนี้ไม่อัด — ถ้ามีปุ่มฟัง ให้ซ่อนเมื่อไม่มีไฟล์ · ใส่ path ที่คาดไว้ `public/audio/th/quiz/<lessonId>-q.mp3` และ `-o1..o3.mp3` ในรายงาน (Claude อัดเอง)
7. หน้า parents `content.ts`: เพิ่ม 1 ประโยคตามจริง (วัย 7+ ตอบคำถาม 1 ข้อหลังบทเพื่อรับดาว ตอบผิดลองใหม่ได้ไม่จำกัด)

## UI
- ปุ่มตัวเลือก ≥64px สูง เต็มความกว้างบนมือถือ, ข้อความยาวตัดบรรทัดได้ไม่ล้น · ไทยนำ อังกฤษรองในหน้าไทย (`Text`) · `/en` อังกฤษล้วน
- motion ตามข้อ 2.1 (`motion-safe:`, ไม่มี `transition-all`, ไม่มีเด้ง/กระพริบ) · focus ชัด · โฟกัสย้ายไปหัวข้อคำถามเมื่อเปิด และคืนโฟกัสเมื่อปิด
- ห้ามเปลี่ยนดีไซน์ตัวเล่นการ์ตูน หน้าเกาะ หรือระบบดาว นอกจากจุดเชื่อมข้อ 2

## ตรวจก่อนส่ง
- `npm ci` → `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`
- tests ใหม่ `tests/quiz.test.mjs`: ครบ 16 บท, id ตรงกับบท 7+ ที่มีอยู่, ตัวเลือกที่อ้าง body ตรงกับ body จริง, answer อยู่ในช่วง, ลำดับสลับคงที่, ไม่มีบท 3–6 ได้คำถาม
- browser check `scripts/check-quiz-browser.mjs` (env PLAYWRIGHT ตาม `docs/briefs/PAR-1-parents-pages.md`): faith-aina-j + calm + 1 บทวัย 3–6 (ต้องไม่มีคำถาม) × th/en × 360×780, 390×844, 1024×768 — ไม่เลื่อนแนวนอน, ไม่มี console/hydration error, ตอบผิดไม่ได้ดาว, ตอบถูกได้ดาว 1 ดวงครั้งเดียว/วัน (อ่าน `lu-ls-stars`), ปิดก่อนตอบไม่ได้ดาว, ปุ่ม ≥64px, contrast, focus
- รัน `check-faith-browser.mjs` / `check-moral-*` / `check-learning-stars*` ที่มีอยู่ (หาเอง) ให้ผ่านเหมือนเดิม · ปิด server 3175 เองก่อนจบ ห้ามหยุด port อื่น

## แก้ได้
`src/features/quiz/**` (ใหม่), `src/features/moral/components/MoralLessons.tsx` + `CartoonLesson.tsx` (จุดเชื่อมเท่านั้น), `src/app/[lang]/parents/content.ts` (1 ประโยค), `src/i18n/dict/**`, `src/components/icons/**`, tests ใหม่, `scripts/check-quiz-browser.mjs`, `output/quiz-1/**`

## รายงาน `output/quiz-1/report.md`
ไฟล์ที่แก้ (ไฟล์:บรรทัด), flow ก่อน/หลัง, ข้อความ UI ใหม่ทุกบรรทัด th/en, ผล checks, ตาราง browser, screenshot 390 + 1024 (คำถาม/ตอบผิด/ตอบถูก), ความเสี่ยง
