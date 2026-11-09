# Little Ummah

เว็บไซต์เรียนรู้อิสลามสำหรับเด็ก ภาษาไทยนำ อังกฤษรอง สองช่วงวัย: 3–6 ปี และ 7 ปีขึ้นไป
ใช้ฟรี ไม่มีโฆษณา ไม่มีบัญชีผู้ใช้ ไม่มีระบบติดตาม — ข้อมูลความคืบหน้าเก็บในเบราว์เซอร์ของเครื่องเท่านั้น

**ก่อนแก้อะไรในโปรเจกต์ อ่าน [`AGENTS.md`](AGENTS.md) ให้ครบ** — กฎเนื้อหาศาสนา (ภาพ ดนตรี หลักฐาน),
มาตรฐาน UX/motion, สิทธิ์ใช้งาน asset และขั้นตอนก่อน commit อยู่ในนั้นทั้งหมด

## เนื้อหา

| เกาะ | เส้นทาง |
|---|---|
| ภาษาอาหรับ | `/learn/languages` |
| มารยาท | `/learn/moral` |
| เรื่องเล่า (หนังสือนิทาน) | `/learn/stories` |
| สำรวจโลก | `/learn/explore` |
| เกม | `/games` |
| ศิลปะ | `/learn/art` |
| ผู้ปกครอง | `/parents` |

## เริ่มพัฒนา

```bash
npm install
npm run dev        # http://localhost:3000
```

ก่อน commit (AGENTS.md ข้อ 5):

```bash
npm run typecheck
npm run lint
npm test
npm run build      # ต้องผ่าน — dev ผ่านอย่างเดียวไม่พอ
```

## โครงสร้าง

- `src/app` — หน้าเว็บ (Next.js App Router)
- `src/features/*` — แต่ละเกาะ (arabic, explore, games, moral, stories)
- `src/lib/lessons.ts` — ข้อมูลบทเรียนของทุกเกาะ
- `src/app/globals.css` — design token (Tailwind v4 `@theme` ไม่มี tailwind.config)
- `public/` — เฉพาะไฟล์ที่เสิร์ฟจริง (WebP/MP3) ภาพต้นฉบับ PNG ถูก ignore และแปลงด้วย `scripts/optimize-images.mjs`
- `scripts/` — สร้างเสียงพากย์ แปลงภาพ วัดพิกัดภาพ และตรวจในเบราว์เซอร์
- `docs/meetings/` — บันทึกการประชุมเรื่องทิศทางเว็บ

## Deploy

**Deploy จาก git เท่านั้น** อย่าอัปโหลดโฟลเดอร์จากเครื่องตรงๆ
เพราะในเครื่องมีไฟล์ที่ไม่มีสิทธิ์ใช้งานหรือไม่ควรขึ้นเว็บ (เช่น `public/audio/sfx/IMPACTS/`, ภาพต้นฉบับ PNG ขนาดใหญ่)
ซึ่งถูก `.gitignore` กันไว้แล้ว
