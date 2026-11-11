# AGE-1: จำช่วงวัยที่เลือก (`lu-age`) — roadmap 10.2 ข้อ 2
**model `gpt-6-astra` (medium) · timeout 7200 · worktree `D:/Littleummah-age` (branch `feature/age-1`, จาก main `678cce0`) · port 3172**

อ่านก่อน: `AGENTS.md` ข้อ 1.2, 2, 2.1, 3 ทั้งหมด, `docs/meetings/2026-11-10-fable-hub-review.md` ข้อ 4 (ปัญหาข้อ 4 "สองวัยในหน้าเดียว") และตาราง 10.2 ข้อ 2
รายงานเป็นภาษาไทยที่ `output/age-1/report.md` · ห้าม commit / reset / unstage

## ปัญหา
ทุกเกาะแสดงสองวัยในหน้าเดียว (`AGE_GROUPS.map` / `AGE_SECTIONS`) มือถือยาวมาก เด็ก 3 ขวบต้องเลื่อนผ่านบท 7+
การเลือกวัยที่ `/kids` `/juniors` ไม่ถูกจำ จึงต้องเลือกใหม่ทุกเกาะ

## เป้า
1. จำวัยที่เด็กเลือกใน localStorage key **`lu-age`** (`"kids" | "juniors"`) — ตั้งเมื่อเข้า `/kids` หรือ `/juniors`, และเมื่อกดสลับวัยบนหน้าเกาะ
   ใช้แบบ store นอก React + `useSyncExternalStore` เหมือน `src/lib/soundStore.ts` (try/catch ทุกครั้ง โหมดส่วนตัวต้องไม่พัง)
2. หน้าเกาะที่มีสองวัย: ถ้ามี `lu-age` → แสดงวัยนั้นก่อน อีกวัย **พับไว้** มีปุ่มชัดเจนให้เปิด/สลับ (ข้อความไทยนำ เช่น "ดูบทของวัย 7 ปีขึ้นไป", ปุ่มเด็ก ≥ 64px)
   ถ้ายังไม่มี `lu-age` → หน้าเหมือนเดิมทุกอย่าง (สองวัย เรียงเดิม)
   หน้าที่ต้องครอบ (ตรวจหาเพิ่มเองด้วย `grep AGE_GROUPS\|AGE_SECTIONS\|AgeId`): `learn/[slug]`, `learn/moral`, `learn/explore`, `learn/faith-basics`, ตู้หนังสือ (`Bookshelf.tsx`), หน้ารวมเกม/หมวดเกม และหน้า memory — ถ้าหน้าไหนไม่เหมาะ (เช่นแยกวัยเป็นคนละ URL อยู่แล้ว) ให้เขียนเหตุผลในรายงาน
3. ลิงก์ที่มี hash `#kids` / `#juniors` (จาก `IslandPicker`/ผู้ปกครองส่งลิงก์) → วัยใน hash ชนะ: เปิดส่วนนั้นและเลื่อนไปถึงเหมือนเดิม
4. **ไม่กระตุก:** HTML ฝั่งเซิร์ฟเวอร์ไม่รู้ `lu-age` — ห้าม hydration mismatch และ CLS ต้องเป็น 0 เหมือนเดิม
   ชั่งทางเลือกแล้วเขียนเหตุผลในรายงาน เช่น สคริปต์ inline เล็กๆ ใน `<head>` ตั้ง `data-age` บน `<html>` ก่อนวาด + CSS ซ่อน/เรียง (ดู CSP report-only ใน `next.config.ts` — ถ้าต้องแก้ CSP ให้ใช้ hash ไม่ใช้ `unsafe-inline` ใหม่) หรือวิธีอื่นที่ดีกว่า
   ส่วนที่พับต้องซ่อนจาก screen reader ด้วย (ไม่ใช่แค่มองไม่เห็น) และปุ่มเปิดมี `aria-expanded`/`aria-controls`
5. หน้าผู้ปกครอง: เพิ่ม `lu-age` ในรายการสิ่งที่เว็บจำ (`src/app/[lang]/parents/content.ts` ทั้ง th/en — ข้อความเดิมห้ามเปลี่ยนนอกจากเติมรายการนี้) และให้ `ClearProgress.tsx` ล้างด้วยถ้าเหมาะ (เขียนเหตุผล)
6. หน้าแรก (`IslandOrbit`/การ์ดเลือกวัย) ไม่ต้องเปลี่ยนในงานนี้

## ห้าม
- เปลี่ยนดีไซน์ ภาพ หุ่นยนต์ ข้อความเนื้อหา เสียง ลำดับบทภายในวัย
- คุกกี้ (เว็บประกาศว่าไม่มีคุกกี้), analytics, สคริปต์ภายนอก
- motion ผิดข้อ 2.1 (การพับ/เปิดถ้ามีแอนิเมชันต้อง `motion-safe:` และไม่ใช้ `transition-all`)
- แตะ content data (`src/features/*/data*`, `src/lib/lessons.ts` ส่วนเนื้อหา, `public/audio`)

## ตรวจก่อนส่ง
- `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`
- tests ใหม่สำหรับ store (อ่าน/เขียน/ค่าผิดรูปแบบ/ไม่มี localStorage) รูปแบบเดียวกับ `tests/*.test.mjs`
- browser check ใหม่ `scripts/check-age-memory-browser.mjs` (ตั้ง `PLAYWRIGHT_MODULE=file:///C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs`, `PLAYWRIGHT_EXECUTABLE="C:/Program Files/Google/Chrome/Application/chrome.exe"`):
  ทุกหน้าในข้อ 2 × (ไม่มี lu-age / kids / juniors / hash ขัดกับ lu-age) × 390×844 และ 1024×768 — วัด CLS, ไม่มี hydration error ใน console, ปุ่มสลับ ≥ 64px, ลำดับ/การพับถูก, โฟกัสแป้นพิมพ์เปิดได้
- รัน `check-home-browser.mjs`, `check-faith-browser.mjs`, `check-explore-browser.mjs`, `check-storybook-browser.mjs --story=water-dog`, `check-games-hub-browser.mjs` ให้ผ่านเหมือนเดิม
- ห้ามหยุด server ที่ port 3200 หรือ 3000 · ปิด server 3172 ที่เปิดเองก่อนจบ

## แก้ได้
`src/lib/**` (store ใหม่), `src/components/**`, `src/features/**/components/**`, `src/app/[lang]/**/page.tsx`, `src/app/[lang]/layout.tsx`, `src/app/[lang]/parents/content.ts` (เติมรายการ key เท่านั้น), `src/app/[lang]/parents/ClearProgress.tsx`, `src/app/globals.css` และ css ของ feature, `src/i18n/dict/**` (ข้อความปุ่มใหม่ ไทย+อังกฤษ), `next.config.ts` (CSP เท่านั้น ถ้าจำเป็น), tests ใหม่, `scripts/check-age-memory-browser.mjs`, `output/age-1/**`

## รายงาน `output/age-1/report.md` (ไทย)
ทางเลือกที่ชั่งและเหตุผล, ไฟล์ที่แก้ (ไฟล์:บรรทัด), ผล checks, ตาราง browser check, ความเสี่ยงที่เหลือ
