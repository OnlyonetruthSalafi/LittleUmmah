# P1-5: ความเร็วมือถือ รอบ 2 — ลดสิ่งที่แย่งเน็ตกับภาพ LCP
**model `gpt-6-astra` (medium) · timeout 7200 · worktree `D:/Littleummah-perf2` (branch `feature/perf-2`, จาก main `11ad70b`) · port 3170**

อ่านก่อน: `AGENTS.md` ข้อ 1.5, 2, 2.1, 3 และรายงานรอบแรก `D:/Littleummah-faith/output/p1-4/report.md` ทั้งไฟล์
(วิธีวัด `measure.ps1`, ข้อเสนอ 5–13, ข้อที่ "ไม่ควรเสนอ") — ข้อ 1–4 ทำแล้วใน `fdc91aa`
รายงานเป็นภาษาไทย · ห้าม commit / reset / unstage

## เป้า
ภาพ LCP ทุกหน้าคือ `/BG/bg.webp` 52KB แต่ LCP 4.8–8.7 วินาที (Lighthouse มือถือ Slow 4G) เพราะมีของอื่นแย่งเน็ตช่วงแรก
เป้าคือ **LCP ≤ 2.5s** ถ้าทำไม่ได้ทุกหน้า ให้ได้มากที่สุดโดยไม่เสียประสบการณ์เด็ก — ห้ามโกงคะแนน (เช่น ซ่อนภาพ/ย่อภาพจนเบลอ)

## ก่อนแก้: หาสาเหตุให้แน่
- ดู trace/`lcp-breakdown` ของ Lighthouse (TTFB, resource load delay, load duration, render delay) ว่าช้าเพราะเริ่มโหลดช้า โหลดนาน หรือวาดช้า
  เช่น ภาพมี fade-in/opacity animation, hydration ก่อนแสดง, หรือ CSS ที่ซ่อนไว้จน JS พร้อม
- เขียนผลไว้ในรายงานก่อนลงมือ — ถ้าสาเหตุหลักไม่ใช่การแย่งเน็ต ให้แก้ที่สาเหตุจริงก่อน

## ทำ (เรียงตามรายงานรอบแรก — เลือก/ปรับได้ตามที่พบ)
- ข้อ 5: prefetch หนังสือทุกเล่มใน `Bookshelf.tsx` → เฉพาะเมื่อใกล้กด/โฟกัส/หลังจอแรกนิ่ง
- ข้อ 6: prefetch เกาะที่ยังไม่เลือกใน `IslandOrbit.tsx` / `IslandCard.tsx` / `LocaleProvider` — เฉพาะจุด ไม่ปิดทั้งเว็บ; ฟอนต์เบงกาลียังต้องโหลดเมื่อเข้า `/learn/languages`
- ข้อ 7: โลโก้ (`Logo.tsx`) ส่ง raster ขนาดเหมาะกับที่แสดงจริง ผ่าน next/image `sizes` หรือ derivative ผ่าน `scripts/optimize-images.mjs` + `source-images.json` — หน้าตาโลโก้ต้องเหมือนเดิมทุกพิกเซลที่มองเห็น
- ข้อ 8: วงโคจรเกาะ — ภาพเกาะด้านหน้าก่อน ด้านหลังเลื่อนไปหลัง LCP แต่ต้องพร้อมก่อนหมุนมา (ไม่มีช่องว่าง/กระพริบ — เคยแก้ปัญหากระพริบไปแล้วใน `1bdafe4` ห้ามทำให้กลับมา)
- ข้อ 9: ภาพนอกจอในแถวล่าง (`GameHub`, `MoralLessons`, `OtherIslands`) — เลื่อนโหลดโดยจองพื้นที่เดิม (CLS ต้องเป็น 0 เหมือนเดิม)
- ข้อ 10: เสียงแนะนำ (`StoryGuide.tsx`, `useHeroGuide.ts`) — อย่าเริ่มโหลดพร้อมภาพสำคัญ เตรียมหลัง LCP/เมื่อจะเล่น; ปุ่มฟังซ้ำและจังหวะท่าทางนูรีต้องตรงเหมือนเดิม
- ข้อ 11: hint ความสำคัญของภาพ LCP ใน `SkyScene.tsx` ตามเอกสาร Next 16 (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` — ห้ามใช้ `preload` ร่วมกับ `loading`/`fetchPriority`)
- ข้อ 12–13: ทำเฉพาะถ้ายังไม่ถึงเป้าและวัดแล้วคุ้ม

## ห้าม
- เปลี่ยนดีไซน์/ภาพที่อนุมัติแล้ว, หุ่นยนต์, ตำแหน่งองค์ประกอบ, ข้อความ, เสียง
- เพิ่ม analytics/ระบบติดตาม/สคริปต์ภายนอก
- ทำให้ motion ผิดมาตรฐานข้อ 2.1 หรือ tap target < 64px
- แตะ content data (`src/features/*/data*`, `public/audio`, ภาพต้นฉบับ)

## ตรวจ (ทำเองก่อนส่ง)
- `npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`
- วัดซ้ำด้วยวิธีเดียวกับรอบแรก 9 หน้า × 3 รอบ (Lighthouse version/config เดิม) — ตารางก่อน/หลัง (ค่าก่อน = รายงานรอบแรก; หน้า stories/faith/explore/games/home ใช้ค่าหลัง `fdc91aa` ถ้าวัดใหม่ได้)
- browser checks (ตั้ง `PLAYWRIGHT_MODULE=file:///C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs` และ `PLAYWRIGHT_EXECUTABLE="C:/Program Files/Google/Chrome/Application/chrome.exe"`; สคริปต์ games-hub ใช้ path โฟลเดอร์ ไม่ใช่ file URL):
  `check-home-browser.mjs`, `check-storybook-browser.mjs --story=water-dog`, `check-explore-browser.mjs`, `check-faith-browser.mjs`, `check-games-hub-browser.mjs`, `check-learning-stars-browser.mjs`, `check-ipad-webkit.mjs`
- ทดสอบ cold load บนเน็ตช้า (Chrome throttling) ว่า: เกาะหน้าแรกหมุนแล้วไม่มีช่องว่าง, เปิดหนังสือครั้งแรกไม่ค้าง, ทัวร์นูรีเริ่มแล้วไม่กระพริบ, เสียงแนะนำเล่นได้
- ห้ามหยุด server ที่ port 3200 หรือ 3000 · ปิด server 3170 ที่เปิดเองก่อนจบ

## แก้ได้
`src/components/**`, `src/features/**/components/**`, `src/features/**/use*.ts`, `src/i18n/LocaleProvider.tsx`, `src/app/fonts.ts`, `next.config.ts` (images เท่านั้น),
`scripts/optimize-images.mjs` (JOBS), `scripts/source-images.json`, `public/` เฉพาะ derivative ใหม่ของโลโก้, tests ใหม่, `output/p1-5/**`

## รายงาน `output/p1-5/report.md` (ไทย)
สาเหตุ LCP ที่พบ, สิ่งที่แก้ (ไฟล์:บรรทัด + เหตุผล), ตารางก่อน/หลัง, ผล checks, สิ่งที่ลองแล้วไม่ได้ผล, ความเสี่ยงที่เหลือ
