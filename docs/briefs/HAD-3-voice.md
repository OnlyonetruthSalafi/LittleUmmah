# HAD-3 voice: เสียงพากย์หนังสือหะดีษชุดที่ 2 (6 เล่ม)
**model `gpt-6.1-sol` (medium) · timeout 7200 · worktree `D:/Littleummah-had3voice` (branch `feature/had3-voice`, จาก main `9abab39`)**

อ่านก่อน: `AGENTS.md` ข้อ 1.3, 1.6, 3 และ handoff `docs/handoff/2026-11-10-handoff-opus.md` ข้อ 4.3
รายงานเป็นภาษาไทย · ห้าม commit / reset / unstage

## ขอบเขต
หนังสือ 6 เล่มใน `src/features/stories/data/hadith/`:
`little-bird` `palm-riddle` `mother-bird` `camel-complaint` `sea-plank` `visit-brother`
ภาพครบแล้ว (`public/stories/<slug>/`) ขาดแค่เสียง เมื่อเสียงครบ Claude จะเปิด `ready` เอง — **Codex ห้ามแก้ `ready`**

## ⚠️ ข้อความเป็นฉบับจริงแล้ว
ห้ามแก้ `th`, `en`, `title`, `alt`, comment ที่มา ในไฟล์ข้อมูลทุกไฟล์ ถ้าเห็นว่าควรแก้ ให้เขียนใต้หัวข้อ `REVIEW-RELIGIOUS` ในรายงาน

## 1. อัดเสียง
- `npm ci` ก่อน, คัดลอก `D:/Littleummah/.env.local` ถ้ายังไม่มี
- ffmpeg: ใช้ `FFMPEG=<path ของ ffmpeg-static ใน node_modules>` (ไม่มี ffmpeg ส่วนกลาง)
- ต่อเล่ม: `node scripts/make-story-voice.mjs --story=hadith/<slug> --takes=2`
  - ได้ 2 เทคต่อหน้าที่ `output/story-voice/hadith/<slug>/` (หรือที่สคริปต์พิมพ์บอก)
  - ทำแบบเดียวกับหนังสือหะดีษชุดแรก 10 เล่ม (`public/audio/th/stories/water-dog/` ฯลฯ) — ดูรูปแบบชื่อไฟล์ p00…pNN.mp3 จากชุดแรก
- เลือกเทคที่ดีกว่าต่อหน้าด้วย Thai ASR (`from check import transcribe` ใน `D:/tools/thai-asr`, venv `D:/tools/thai-asr/.venv/Scripts/python`) เทียบกับข้อความ `th` ของหน้า
  - ถ้าทั้งสองเทคผิดชัด (คำหาย, อ่านผิดคำ) อัดเพิ่มอีก 1–2 เทคเฉพาะหน้านั้น **ห้ามตัดต่อ** (memory: ออกเสียงผิด → อัดใหม่ทั้งบรรทัด)
  - คัดเทคที่ชนะไป `public/audio/th/stories/<slug>/pNN.mp3`
- **หน้าที่มีคำว่า "ท่านนบี ﷺ"** ต้อง splice คลิปมาตรฐาน หลังเลือกเทคแล้ว:
  ```
  D:/tools/thai-asr/.venv/Scripts/python D:/tools/thai-asr/nabi_splice.py <root> <out> <rel>[:count]
  ```
  `renderRobotLines` พิมพ์คำสั่งให้หลังอัด ใช้ตามนั้น เก็บไฟล์ก่อน splice ไว้ที่ `output/had-3-voice/pre-splice/`
- ถ้าหน้าไหนมีตัวอาหรับ (ดุอาอ์/ซิกรุจากหะดีษ) ให้ใช้ `--arabic` เฉพาะหน้านั้น แล้วตรวจด้วย `D:/tools/thai-asr/ar_check.py` — **ห้ามให้หุ่นอ่านอายะฮ์อัลกุรอาน** (ข้อ 1.6) ถ้าเจอ ให้รายงาน ไม่ต้องอัด
- ห้ามแตะเสียงของหนังสือเล่มอื่น

## 2. ตรวจ
- ไฟล์ครบทุกหน้าของทั้ง 6 เล่ม (นับเทียบจำนวน page ใน data + p00 ปก)
- ทุกไฟล์ mp3 เล่นได้ (ffprobe duration > 0.5 วินาที) ไม่มีเงียบยาวผิดปกติ > 2 วินาที
- ตาราง ASR ทุกไฟล์ (หน้า, เทคที่เลือก, คะแนน/ข้อความที่ถอดได้, หมายเหตุ)
- รายการคลิปที่ splice ﷺ และตรวจด้วย waveform/ASR ว่ามีเสียง salawat มาตรฐานอยู่จริง
- ทดลองเปิด `ready: true` **ในเครื่องเท่านั้น ชั่วคราว** เพื่อรัน `node scripts/check-storybook-browser.mjs` (หรือ flag ของสคริปต์สำหรับเล่มที่ระบุ) กับ production build ที่ port 3190 แล้ว **คืนค่า `ready: false` ก่อนส่ง**
- `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` ผ่าน

## แก้ได้เฉพาะ
- `public/audio/th/stories/{little-bird,palm-riddle,mother-bird,camel-complaint,sea-plank,visit-brother}/**` (ใหม่)
- `output/had-3-voice/**`, `output/story-voice/**`
- `scripts/lib/robot-voice.mjs` เฉพาะเพิ่มคำใน `SAY_AS_ENGLISH` ถ้าคำทับศัพท์อ่านเพี้ยน (บอกในรายงาน)

## รายงาน `output/had-3-voice/report.md` (ภาษาไทย)
- จำนวนไฟล์ต่อเล่ม, ตาราง ASR, หน้าที่อัดเพิ่ม, คำสั่ง splice ที่รัน
- ผล browser check และ checks
- หน้าที่ ASR ยังไม่มั่นใจ (ให้เจ้าของฟัง)
- `REVIEW-RELIGIOUS` ถ้ามี
