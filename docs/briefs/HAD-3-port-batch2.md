# HAD-3 port: นำหนังสือหะดีษชุดที่ 2 (6 เล่ม) เข้าระบบ เป็นตู้ที่สาม สถานะ "เร็วๆ นี้"

Claude เขียน 10 พ.ย. 2026 · ผู้ทำ: Codex `gpt-6.1-sol` (effort medium) · worktree `D:/Littleummah-had3` (branch `had3-port`) · timeout 60 นาที

## ต้นฉบับ
- `docs/drafts/HAD-3-hadith-batch2.md` — ข้อความทุกหน้า (ไทย/อังกฤษ), alt, PROMPT ภาพ, ที่มาหะดีษและตัวบทอาหรับ
- **ข้อความศาสนาทั้งหมด Claude เขียนและตรวจกับ Shamela แล้ว ห้ามแก้ถ้อยคำ ห้ามเติม ห้ามตัด** ถ้าเห็นว่าผิดให้เขียนไว้ในรายงาน ไม่ต้องแก้เอง
- ตัวอย่างรูปแบบไฟล์: `src/features/stories/data/hadith/water-dog.ts`, `common.ts`, `index.ts`

## สิ่งที่ต้องทำ
1. สร้างไฟล์ข้อมูล 6 ไฟล์ใน `src/features/stories/data/hadith/` ตาม slug ในร่าง (little-bird, palm-riddle, mother-bird, camel-complaint, sea-plank, visit-brother)
   - comment หัวไฟล์: ชื่อเล่ม วัย ที่มา (ผู้บันทึก+เลข, ลิงก์ Shamela, ตัวบทอาหรับ, หมายเหตุสถานะหะดีษ) และข้อห้ามภาพ ตามร่าง
   - ทุกหน้าใส่ `// PROMPT:` จากร่าง, `image: "/stories/<slug>/pNN.webp"`, `alt`, `th`, `en` ตามร่างคำต่อคำ
   - cover `/stories/<slug>/cover.webp` และ deluxe block แบบเดียวกับ water-dog (inline ในไฟล์ เพราะ `make-story-voice.mjs` และ `check-storybook-browser.mjs` โหลดไฟล์ด้วย Node ธรรมดา)
   - `fx` / `ambience` เลือกจากค่าที่มีอยู่แล้วใน type `Story` ให้เข้ากับฉาก
2. `data/hadith/index.ts`: เพิ่ม `HADITH_SHELF_2 = { kids: [...4 เล่ม], juniors: [...2 เล่ม] }` ทุกเล่ม `ready: false` icon เลือกจาก `LessonIconName` ที่มีอยู่
   - `READY_HADITH_STORIES` รวมทั้งสองตู้ (ตอนนี้ชุด 2 ยังไม่ ready จึงไม่สร้างหน้า)
3. `shelf.ts`: ฟังก์ชันสำหรับตู้ที่สาม (ใช้ toBook เดิมร่วมกัน ไม่ copy โค้ด)
4. `Bookshelf.tsx`: `shelf` รับ `"hadith2"` ป้ายตู้ใช้ `t.stories.shelf.hadith2Title`
   - CSS ที่ผูกกับ `data-shelf="hadith"` ให้ตู้ hadith2 ได้หน้าตาเดียวกัน
5. dict: th `hadith2Title: "เรื่องจริงจากหะดีษ ชุดที่ 2"`, en `"True Stories from the Hadith 2"` (type ของ dict ต้องตรงกันทั้งสองภาษา)
6. `src/app/[lang]/learn/stories/page.tsx`: แสดงตู้ที่สามต่อจากตู้หะดีษ

## ห้าม
- ห้ามสร้าง/แก้ภาพหรือเสียง ห้ามรันสคริปต์อัดเสียง ห้ามเรียก ElevenLabs
- ห้ามแตะหนังสือ 10 เล่มเดิมและตู้อัลกุรอาน ห้าม emoji คน/สัตว์ (AGENTS ข้อ 1.1)
- ห้าม commit ห้าม push ห้ามแก้นอกไฟล์ที่ระบุ (ถ้าจำเป็นต้องแก้ไฟล์อื่น ให้เขียนเหตุผลในรายงาน)

## เกณฑ์ผ่าน (รันเองก่อนส่ง)
- `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` ผ่าน
- ตู้ที่สามแสดง 6 เล่ม เป็นปก CSS พร้อมแถบ "เร็วๆ นี้" ไม่มีลิงก์ไปหน้าที่ไม่มีอยู่
- ข้อความ th/en ทุกหน้าตรงกับร่างคำต่อคำ (เทียบด้วยสคริปต์ได้)

## รายงาน (ภาษาไทย)
รายการไฟล์ที่แก้ ผลการตรวจแต่ละข้อ และจุดที่ไม่แน่ใจ เขียนลง `output/HAD-3-port-report.md`
