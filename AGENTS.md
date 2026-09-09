<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Little Ummah — ข้อกำหนดของโปรเจกต์ (Project Guidelines)

เว็บไซต์เรียนรู้อิสลามสำหรับเด็ก 2 ช่วงวัย: 3–6 ปี (`/kids`) และ 7 ปีขึ้นไป (`/juniors`)
เนื้อหาสองภาษา **ไทยนำ อังกฤษรอง**

## 1. แนวทางเนื้อหา — สายสลัฟี (Salafi content policy) — บังคับทั้งโปรเจกต์

กฎเหล่านี้มีผลกับทุกไฟล์ ทุกหน้า ทุก component ทุก asset ห้ามละเมิดโดยไม่ถามเจ้าของโปรเจกต์ก่อน

### 1.1 ห้ามแสดง "ใบหน้า" ของมนุษย์และสัตว์

เกณฑ์คือ **ใบหน้าที่มีอวัยวะ** (ตา จมูก ปาก) ไม่ใช่ตัวสิ่งมีชีวิตทั้งตัว

**ห้าม**
- วาด/สร้าง/แปะรูปมนุษย์หรือสัตว์ที่ **เห็นใบหน้าและมีอวัยวะบนใบหน้า** ทุกรูปแบบ ทั้ง SVG, ภาพประกอบ, ภาพถ่าย, ไอคอน, avatar, mascot
- ครอบคลุมถึงภาพการ์ตูน ภาพเรียบง่าย และภาพลายเส้น ที่ยังมีตา/จมูก/ปาก
- **ห้ามใช้ emoji ที่เป็นคนหรือสัตว์** เช่น 👶 👨‍👩‍👧 🧕 🐪 🐱 🦁 เพราะทุกตัววาดใบหน้ามาแล้ว

**อนุญาต**
- รูปมนุษย์หรือสัตว์ที่ **ใบหน้าว่างเปล่า ไม่มีอวัยวะใดๆ** (faceless)
- รูปที่ใช้เทคนิค **หันหลัง** หรือหันข้างจนไม่เห็นใบหน้า
- ส่วนของร่างกายที่ไม่ใช่ใบหน้า เช่น มือ

### 1.2 ตัวละครนำทาง = หุ่นยนต์

- เมื่อจำเป็นต้องมีตัวละครนำทาง/มาสคอต **ให้ใช้หุ่นยนต์** — หุ่นยนต์ **มีใบหน้าได้** (ตา ปาก หน้าจอ)
- หุ่นยนต์ต้องดูเป็นเครื่องจักรชัดเจน ไม่ใช่มนุษย์หรือสัตว์ที่ใส่ชุดหุ่นยนต์
- ถ้าต้องแสดงเด็กจริง ให้ใช้วิธีในข้อ 1.1 (หันหลัง หรือใบหน้าว่าง)

### 1.3 ไม่มีดนตรีในเว็บ
- **ห้าม** ใส่เสียงดนตรี, background music, เพลงบรรเลง, เครื่องดนตรีทุกชนิด
- **ห้ามใช้สัญลักษณ์ดนตรี** ในงานออกแบบ — โน้ตดนตรี ♪ ♫, กีตาร์, เปียโน, กลอง, หูฟังที่สื่อถึงการฟังเพลง
- เสียงที่อนุญาต: **sound effect** (เจ้าของโปรเจกต์จะจัดหามาให้ภายหลัง) และเสียงพูด/อ่าน
- หมวดหมู่เดิมชื่อ "Music" **เปลี่ยนเป็น "เสียงและการฟัง / Listen"** — ใช้ไอคอนคลื่นเสียงหรือลำโพง ห้ามใช้โน้ตดนตรี

### 1.4 สัญลักษณ์ทางศาสนา
- อัลกุรอานใช้รูป **มุศฮัฟ (หนังสือเปิด)** ห้ามใช้รูปมัสยิดแทน — สื่อคนละความหมาย
- ไม่วาดรูปบุคคลสำคัญทางศาสนา ศาสดา หรือเศาะหาบะฮ์ ในทุกกรณี

## 2. ข้อกำหนดด้าน UX/UI

- **Responsive first** — ผู้ใช้หลักคือเด็กบนแท็บเล็ต/มือถือ ออกแบบจากจอเล็กขึ้นไป
- **Tap target ขั้นต่ำ 64px** สำหรับปุ่มที่เด็กกด, 48px สำหรับปุ่มฝั่งผู้ปกครอง
- **ทุก `<img>` ต้องมี alt text** ที่มีความหมายจริง
- ไอคอนตกแต่งใส่ `aria-hidden="true"` แล้วให้ข้อความข้างๆ เป็นตัวอ่านของ screen reader
- **Contrast**: ตัวอักษรปกติ ≥ 4.5:1, ตัวอักษรใหญ่ ≥ 3:1 — ตรวจก่อน commit เสมอ
- ห้ามสื่อความหมายด้วยสีอย่างเดียว ต้องมีข้อความหรือรูปทรงกำกับ
- ทุก element ที่โฟกัสได้ต้องมี focus state ที่มองเห็นชัด

## 3. Stack และโครงสร้าง

- Next.js (App Router) + TypeScript + Tailwind **v4**
- **Design token อยู่ใน `src/app/globals.css` ใต้ `@theme`** — Tailwind v4 ไม่ใช้ `tailwind.config.ts` แล้ว การสร้างไฟล์ config จะถูกเมินเงียบๆ
- ฟอนต์โหลดผ่าน `next/font/google` เท่านั้น (self-host, ไม่มี layout shift)
  - display ละติน: **Baloo 2** — ตัวอ้วนมนตามอารมณ์ mockup ไม่มีชุดอักษรไทย
  - ไทยทั้งหมด + body: **Noto Sans Thai Looped** — เลือกแบบ **"มีหัว"** เพราะเป็นรูปอักษรที่เด็กไทยหัดอ่านตอนต้น ฟอนต์ไม่มีหัวอย่าง Kanit/Prompt อ่านยากกว่าสำหรับเด็กเล็ก
  - `--font-display` เรียง Baloo 2 ก่อนแล้วตกไปฟอนต์ไทยอัตโนมัติเมื่อเจอตัวอักษรไทย
  - **หมายเหตุ**: `Baloo Thai 2` ไม่มีใน next/font ของ Next 16.3.4 (ตรวจแล้วใน `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`) อย่าเปลี่ยนกลับไปใช้
- ไอคอนเป็น **inline SVG** เขียนเอง เก็บใน `src/components/icons/` ไม่ใช้ emoji เป็นไอคอนหลัก

## 4. กติกาก่อน commit

1. `npm run build` ต้องผ่าน (dev ผ่านอย่างเดียวไม่พอ)
2. ให้ Codex review diff แล้วสรุปให้เจ้าของโปรเจกต์ดู
3. เจ้าของโปรเจกต์อนุมัติ แล้วค่อย commit
