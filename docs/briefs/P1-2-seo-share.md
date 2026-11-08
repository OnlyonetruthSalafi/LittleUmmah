# P1-2 — SEO และการแชร์

**model: `gpt-6-astra` (medium) · timeout 5400** — ต้องเลือกภาพแชร์และเขียน metadata ที่ผู้ปกครองเห็น

ตอบและเขียนรายงานเป็นภาษาไทย ทำงานใน `D:/Littleummah-p1-2` (branch `codex/p1-2-seo` จาก main `197aae4`) เท่านั้น **ห้าม commit / push**
อ่าน `AGENTS.md` ทั้งไฟล์ (ข้อ 1.1, 1.2, 1.5, 3) และ **อ่าน `node_modules/next/dist/docs/` เรื่อง metadata, sitemap, robots, manifest, opengraph-image ก่อนเขียนโค้ด** — Next 16 ต่างจากที่คุณรู้
dev/preview server พอร์ต **3105** เท่านั้น ปิดก่อนจบ

## บริบท
- ไทย URL ไม่มี prefix (`src/proxy.ts` rewrite ไป `/th/...`) · `/en` ยังไม่เปิด: `src/app/[lang]/layout.tsx` ใส่ `robots: noindex` ให้ `en` แล้ว
- ผู้ที่เห็นการแชร์คือ **ผู้ปกครอง** (LINE, Facebook) — ชื่อและคำอธิบายต้องบอกชัดว่าเป็นเว็บเรียนรู้อิสลามสำหรับเด็ก ฟรี ไม่มีโฆษณา
- โดเมนยังไม่ตัดสิน (D3 ในแผน) → อ่านจาก env `NEXT_PUBLIC_SITE_URL` มีค่า fallback ชัดเจน และเขียนในรายงานว่าต้องตั้งค่าเมื่อได้โดเมน

## งาน
1. `metadataBase`, `title.template`, `description` ระดับเว็บ (ไทยนำ) ใน layout ที่เหมาะ
2. `generateMetadata` / `metadata` ต่อหน้าหลัก: หน้าแรก, `/kids`, `/juniors`, `/learn/*` แต่ละหมวด, `/games`, `/parents`, นิทานแต่ละเล่ม
   ข้อความดึงจาก dictionary/ข้อมูลที่มีอยู่ (`src/i18n/dict/th.ts`) ก่อน ถ้าต้องเขียนใหม่ให้เพิ่มใน dictionary ทั้ง `th` และ `en`
3. OpenGraph + Twitter card: ภาพแชร์ใช้ **ภาพที่มีอยู่แล้ว** (ภาพเกาะใน `public/islands/`, หุ่นนูรี `public/Character/`) ห้ามสร้างภาพใหม่
   - **ไม่มีตัวหนังสือในภาพ** และไม่ใช้ `ImageResponse` วาดข้อความ (ข้อความกลายเป็นพิกเซล)
   - ขนาด 1200×630 ถ้าต้อง crop/pad ให้ทำด้วยสคริปต์ (sharp ที่มีอยู่) เก็บผลใน `public/og/` เป็น WebP/JPEG ≤ 200KB
     บันทึกต้นทาง+sha256 ใน `scripts/source-images.json` ตามข้อ 1.5
   - **ตรวจภาพทุกภาพตามข้อ 1.1**: ซูมศีรษะทุกตัว ห้ามมีใบหน้า (หุ่นยนต์มีหน้าได้) ส่งภาพ crop ศีรษะมาในรายงาน
   - `og:image:alt` เป็นภาษาไทยที่มีความหมาย
4. `src/app/sitemap.ts` (เฉพาะหน้าไทย **ไม่มี `/en`**), `robots.ts`, `manifest.ts` (ชื่อ ไอคอน สีจาก token ใน `globals.css`)
5. ลบไฟล์ตัวอย่างของ Next ใน `public/`: `file.svg` `globe.svg` `next.svg` `vercel.svg` `window.svg` — **grep ยืนยันก่อนว่าไม่มีที่ใช้**

## เกณฑ์ผ่าน
- `npm run verify` ผ่าน
- `curl` หน้าหลักแต่ละหน้าจาก `next start -p 3105` แล้วแปะ `<title>`, `og:*`, `twitter:*`, `canonical` ในรายงาน
- `/sitemap.xml` ไม่มี `/en` · `/en/...` ยังมี `noindex` · `/robots.txt` ถูกต้อง
- HTML ส่วน `<body>` ของหน้าไทยไม่เปลี่ยน (เทียบด้วย `scripts/html-snapshot.mjs` + `html-compare.mjs` กับ main)

## ห้าม
- สร้างภาพใหม่ / วาดท่าหุ่นใหม่ · ฝังข้อความในภาพ · ใส่ analytics/tracking ใดๆ (เว็บเด็ก ไม่ติดตาม — ข้อ 1.5)
- เปิด `/en` หรือเอา noindex ออก (เป็นงาน P4)
- แตะข้อความศาสนา (ถ้าคำอธิบายต้องพูดถึงอัลกุรอาน/หะดีษ ให้เขียนกลางๆ แล้วติด `// REVIEW-RELIGIOUS` ให้ Claude ตรวจ)
- commit / push / reset · แตะ worktree อื่น

## ส่ง
- `output/p1-2/report.md`: ตาราง หน้า → title / description / ภาพแชร์ · ภาพ crop ศีรษะ · ผลตรวจ · ไฟล์ที่แก้ · สิ่งที่ต้องตั้งเมื่อได้โดเมน
- ข้อความตอบสุดท้ายใช้รูปแบบรายงานใน `D:/Littleummah/docs/meetings/2026-11-07-global-hub-plan.md` ข้อ 5.3

## เวลา
90 นาที
