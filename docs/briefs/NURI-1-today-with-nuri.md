# NURI-1: "วันนี้กับนูรี" — roadmap 10.2 ข้อ 1 (ตัดสิน 7 ต.ค., แผน P5-1)
**model `gpt-6-astra` (medium) · timeout 7200 · worktree `D:/Littleummah-nuri` (branch `feature/nuri-1`, จาก main) · port 3174**

อ่านก่อน: `AGENTS.md` ทั้งหมด (1.1–1.3, 2, 2.1, 3), `docs/meetings/2026-10-07-hub-direction.md`, `docs/meetings/2026-11-10-fable-hub-review.md` ข้อ 1 และตาราง 10.2,
memory การตัดสิน 1 พ.ย.: ดาวเรียนรู้ 1 ดวง/บท/วัน, **ไม่มี streak ไม่มีรางวัลสุ่ม ไม่มีตัวนับวันติดกัน**
อ่านคู่มือ Next ใน `node_modules/next/dist/docs/` ก่อนสร้าง route · รายงานไทยที่ `output/nuri-1/report.md` · ห้าม commit / reset

## แนวคิด
ชุดกิจกรรมสั้นประจำวันสำหรับเด็ก 1 ชุด: **ฟัง 1 → ลอง 1 → ทำกับครอบครัว 1** แล้วจบด้วย **"วันนี้พอแล้ว"** (ชวนพักจอ ไม่ใช่ชวนเล่นต่อ)
เป้าหมายคือให้เด็กมีจุดเริ่มที่ชัดและรู้ว่าจบเมื่อไร — ไม่ใช่เพิ่มเวลาหน้าจอ

## งาน
1. **route ใหม่ `/today`** (ไทย URL `/today`, อังกฤษ `/en/today`) ใน `src/app/[lang]/today/` ใช้ `pageMetadata` แบบหน้าเดิม เพิ่มใน sitemap
2. **ขั้นที่ 1 ฟัง** — เลือก 1 บทการ์ตูน/บทเรียนจากเกาะมารยาท + อิสลามพื้นฐาน (+ สำรวจโลก) ตามช่วงวัยจาก `lu-age` (`src/lib/ageStore.ts`; ยังไม่เลือก → ให้เลือกวัยก่อนด้วยปุ่มใหญ่ 2 ปุ่ม)
   เลือกบทที่ **ยังไม่ได้ดาว/ยังไม่ฝึก** ก่อน (อ่านจาก progress store เดิม อ่านอย่างเดียว) ถ้าฝึกครบแล้ววนบทที่ฝึกนานที่สุด
   การเลือกต้อง **คงที่ทั้งวัน** (seed จากวันที่ท้องถิ่น YYYY-MM-DD + วัย) ไม่ใช้ `Math.random` · กดแล้วไปหน้าบทเดิม (`LocaleLink`) ไม่สร้างตัวเล่นบทใหม่
3. **ขั้นที่ 2 ลอง** — 1 ด่านเกม/กิจกรรมจากเกาะเกม (`src/features/games/`) หรือเกาะภาษา/ศิลปะ ที่เหมาะกับวัย เลือกคงที่ทั้งวันเหมือนกัน
   **ต้องเคารพระบบดาวเรียนรู้และจำกัดเวลาเดิม** (`learning-stars`) — ไม่ข้ามประตูดาว ไม่ให้ดาวเพิ่ม
4. **ขั้นที่ 3 ทำกับครอบครัว** — การ์ด 1 ใบจากรายการด้านล่าง (ใช้ถ้อยคำตามนี้เท่านั้น Claude เขียนและตรวจแล้ว) เลือกคงที่ทั้งวัน
   ปุ่ม "ทำแล้ว" (ผู้ปกครองหรือเด็กกด) — ไม่ต้องพิสูจน์ ไม่ให้ดาว
5. **"วันนี้พอแล้ว"** — ปุ่มที่เห็นตลอด กดแล้วไปจอจบ: นูรีโบกมือ (`public/Character/` ท่าที่มีอยู่ เช่น `welcome`/`celebrate`) ข้อความ "เก่งมาก วันนี้พอแล้ว ไปพักสายตา แล้วเจอกันพรุ่งนี้นะ อินชาอัลลอฮ์" + ลิงก์เล็กกลับหน้าแรก
   จอจบ **ห้าม** ชวนเล่นต่อ ห้ามแสดงจำนวนวันติดกัน/สถิติ
6. **สถานะ** เก็บใน localStorage key ใหม่ `lu-today` = `{ date, age, done: { listen, try, family }, ended }` เท่านั้น — ข้ามวันแล้วเริ่มใหม่ (ไม่เก็บประวัติวันก่อน)
   อ่านด้วย `useSyncExternalStore` (ไม่มี hydration mismatch) · ขั้นที่ 1–2 นับว่าทำแล้วเมื่อเด็กกลับมาที่ `/today` หลังกดเข้าไป (ไม่ต้องแก้หน้าบทเดิม) หรือเมื่อ progress store เดิมบอกว่าบทนั้นฝึกวันนี้แล้ว
   เพิ่ม `lu-today` ในทะเบียน storage ของหน้า privacy (`src/app/[lang]/parents/pages-content.ts`) และให้ `ClearProgress` ล้างด้วย
7. **ทางเข้า** — การ์ด "วันนี้กับนูรี" บนหน้า `/learn` (หน้ารวมเกาะ) ด้านบนสุด เท่านั้น **ห้ามแก้หน้าแรก/Hero** (เจ้าของโปรเจกต์ดูแลดีไซน์หน้าแรกเอง)
   ทำเป็น component แยกให้ย้ายที่ได้ง่าย แล้วเสนอในรายงานว่าควรวางที่หน้าแรกตรงไหน (ภาพ mockup ใน `output/nuri-1/`) ให้เจ้าของตัดสิน
8. **หน้า parents** — เพิ่มบรรทัดใน `content.ts` หัวข้อที่อธิบายสิ่งที่เว็บทำ (สั้น 1–2 ประโยค ตามจริง: มีชุดกิจกรรมวันละ 3 ขั้น จบด้วยปุ่มพัก ไม่มี streak)

## UI
- ลำดับ 3 ขั้นเป็นการ์ดใหญ่เรียงลง (มือถือ) / แถวเดียว (แท็บเล็ตแนวนอน+) มีเลข 1-2-3 และ **ไอคอน SVG เขียนเอง** (หู/ลำโพงสำหรับฟัง — ห้ามโน้ตดนตรี, ชิ้นจิ๊กซอว์/ดาวสำหรับลอง, บ้าน/มือสำหรับครอบครัว)
- สถานะทำแล้วต้องมี **ข้อความ + เครื่องหมายถูก** ไม่ใช้สีอย่างเดียว · ปุ่มเด็ก ≥64px · motion ตามข้อ 2.1 (`motion-safe:`, ไม่มี transition-all, การ์ดขยับเฉพาะกรอบภาพ)
- ข้อความ `Text {th,en}` ไทยนำ อังกฤษรองในหน้าไทย · `/en` อังกฤษล้วน
- ภาพ: หุ่นยนต์นูรีที่มีอยู่ + ภาพการ์ดของบท/เกมที่มีอยู่ — **ไม่สร้างภาพใหม่** ไม่มีคน/สัตว์ที่มีหน้า ไม่มี emoji คน/สัตว์
- เสียง: รอบนี้ **ไม่อัดเสียงใหม่** ใช้ปุ่มฟังที่มีอยู่ไม่ได้ก็ไม่เป็นไร — เขียนรายการบทพูดนูรีที่ควรมี (th) ไว้ในรายงาน Claude จะอัดเอง

## รายการ "ทำกับครอบครัว" (ใช้ตามนี้ ห้ามแต่งเพิ่ม — เก็บใน `src/features/today/family.ts` เป็น `Text`)
1. th "กล่าวสลามกับทุกคนในบ้านเมื่อเจอกันวันนี้" · en "Say salam to everyone at home when you see them today"
2. th "ก่อนกินข้าวมื้อต่อไป กล่าว บิสมิลลาฮ์ พร้อมกันทั้งบ้าน" · en "Before your next meal, say Bismillah together as a family"
3. th "กินเสร็จแล้ว กล่าว อัลฮัมดุลิลลาฮ์ ให้คนข้างๆ ได้ยิน" · en "After eating, say Alhamdulillah so the person next to you can hear"
4. th "ช่วยกันเก็บของเล่นเข้าที่ก่อนนอน" · en "Tidy the toys away together before bed"
5. th "บอก ญะซากัลลอฮุค็อยร็อน กับคนในบ้านที่ช่วยเรา 1 คน" · en "Say Jazakallahu khayran to someone at home who helped you"
6. th "ถามพ่อแม่ว่า วันนี้ให้หนูช่วยอะไรไหม แล้วช่วยทำ 1 อย่าง" · en "Ask your parents, 'How can I help today?' and do one job"
7. th "แบ่งขนมหรือของเล่นให้พี่น้องหรือเพื่อน" · en "Share a snack or a toy with a brother, sister or friend"
8. th "เล่าเรื่องที่ฟังวันนี้ให้คนในบ้านฟัง" · en "Tell someone at home the story you heard today"
9. th "ชวนกันดูท้องฟ้าหรือต้นไม้ แล้วคุยกันว่าอัลลอฮ์ทรงสร้างอะไรบ้าง" · en "Look at the sky or a tree together and talk about what Allah created"
10. th "ล้างมือให้สะอาดก่อนกินข้าวด้วยตัวเอง" · en "Wash your hands well by yourself before eating"
11. th "ถ้าทำผิด พูดขอโทษ และพูดความจริง" · en "If you make a mistake, say sorry and tell the truth"
12. th "ยิ้มทักทายคนในบ้านตอนเช้า" · en "Greet your family with a smile in the morning"
13. th "ช่วยรดน้ำต้นไม้ในบ้าน" · en "Help water the plants at home"
14. th "เก็บรองเท้าของตัวเองให้เป็นระเบียบ" · en "Put your own shoes away neatly"

ข้อความจอ/ปุ่มอื่นที่ต้องเขียนใหม่: เขียนได้ แต่ห้ามมีเนื้อหาศาสนาใหม่ (ไม่อ้างหะดีษ/อายะฮ์ ไม่สัญญาผลบุญ) — ใส่ทุกบรรทัด th/en ในรายงานให้ Claude ตรวจ

## ห้าม
- streak, ตัวนับวัน, badge, รางวัลสุ่ม, แจ้งเตือน, ดาวเพิ่มจากหน้านี้
- แก้หน้าแรก, ดีไซน์หลัก, ข้อมูลเนื้อหา (`src/features/*/data*`, `src/content/**`, `public/**`), คุกกี้/analytics/สคริปต์ภายนอก

## ตรวจก่อนส่ง
- `npm ci` → `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`
- tests ใหม่ `tests/today.test.mjs`: การเลือกคงที่ทั้งวัน/เปลี่ยนเมื่อข้ามวัน, เลือกบทที่ยังไม่ฝึกก่อน, ไม่มี localStorage/ค่าเสีย, รีเซ็ตเมื่อข้ามวัน, ไม่เลือกบท ready=false
- browser check `scripts/check-today-browser.mjs` (env PLAYWRIGHT ตาม brief เดิม `docs/briefs/PAR-1-parents-pages.md`): `/today` + `/learn` × th/en × 360×780, 390×844, 768×1024, 1024×768, 844×390 — ไม่เลื่อนแนวนอน, ไม่มี hydration/console error, ปุ่ม ≥64px, contrast, focus, flow ครบ 3 ขั้น + "วันนี้พอแล้ว", รีโหลดแล้วสถานะคงอยู่, ข้ามวัน (mock Date) แล้วรีเซ็ต
- รัน `check-home-browser.mjs` และ `check-age-memory-browser.mjs` ให้ผ่านเหมือนเดิม · ปิด server 3174 เองก่อนจบ ห้ามหยุด port อื่น

## แก้ได้
`src/app/[lang]/today/**`, `src/features/today/**` (ใหม่), `src/app/[lang]/learn/page.tsx` (การ์ดทางเข้าเท่านั้น), `src/app/[lang]/parents/content.ts` + `pages-content.ts` (รายการ lu-today + 1–2 ประโยค), `src/components/**/ClearProgress.tsx` (ล้าง lu-today), `src/app/sitemap.ts`, `src/i18n/dict/**`, `src/components/icons/**` (ไอคอนใหม่), tests ใหม่, `scripts/check-today-browser.mjs`, `output/nuri-1/**`

## รายงาน `output/nuri-1/report.md`
flow และเหตุผล, ไฟล์ที่แก้, ข้อความใหม่ทุกบรรทัด th/en, กติกาเลือกบท/เกม, ผล checks, ตาราง browser check, screenshot 390 และ 1024 ของทุกสถานะ, mockup ตำแหน่งบนหน้าแรก, บทพูดนูรีที่ควรอัด, ความเสี่ยง
