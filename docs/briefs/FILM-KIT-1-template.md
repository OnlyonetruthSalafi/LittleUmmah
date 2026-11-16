# FILM-KIT-1 — ยกการ์ตูน "แบ่งของเล่น" (output/car-share) เป็นแม่แบบใช้ซ้ำ

ผู้สั่ง: เจ้าของโปรเจกต์ 16 พ.ย. 2026 · ผู้เขียน brief: Claude · ผู้ลงมือ: Codex
อ่านก่อน: `docs/animation/2026-11-16-car-share-lessons.txt` (ข้อ 5 = ปัญหาที่ต้องแก้), AGENTS.md §1, §3.1

## เป้าหมาย
แก้ 3 เรื่องให้เรื่องใหม่เริ่มได้ด้วยคำสั่งเดียว โดยไม่ต้องคัดลอก/แก้ engine
1. **path ฝังในโค้ด** — `root='output/car-share'` ใน prepare/mix/assets/make-voice, playwright จาก `output/kufic/.tools`
   และค่าเฉพาะตัวละครใน engine/film (contactShadow เฉพาะ hadi/sabir, `GRIP`, `follow` offset ใน `grip()`)
2. **IK มีแค่แขนขวา ชุดมุม q** — ให้เลือกแขน (l/r) และมุม (front/q/side/back ที่ rig มีข้อต่อแขน) ได้ และจับสองมือพร้อมกันได้
3. **kits/asset พื้นฐานอยู่นอก git** (`output/car-truth-v2/assets/kits`, `output/park-clear/assets/park.jpg`, `output/car-truth-v2/sfx`)

## ขอบเขตไฟล์
- สร้างใหม่: `scripts/film-kit/**` (อยู่ใน git) — แก้ได้ทุกอย่างในนี้
- สร้างใหม่: `output/car-share-kit/` (เรื่องทดสอบ port จาก car-share)
- **ห้ามแก้** `output/car-share/`, `output/car-truth-v2/`, `src/`, `public/`, ไฟล์อื่นใน repo — ห้าม commit ห้าม push

## โครงที่ต้องการ
```
scripts/film-kit/
  README.md            ภาษาไทย: วิธีเริ่มเรื่องใหม่ทีละขั้น + API (turn/drive/gesture/head/joints/grip/frontGrip/cut/camTo/prop/place) + ค่าใน CAST
  engine.js            จาก car-share/engine.js — generic ไม่มีชื่อตัวละครในโค้ด
  cast-base.js         turn / drive / joints / gesture / head / grip / frontGrip / cut / camTo / place / prop (ย้ายตัวช่วยทั่วไปจาก film.js มาด้วย)
  characters.js        ค่าประจำตัวละครมาตรฐาน nuri/hadi/sabir/safi: scale, shadow, shadowMode ('contact'|'ellipse'), blink, hover, wheels,
                       skip, และต่อชุดมุม: grip point ของมือ l/r, reach offset (follow) — ค่าเดิมจาก car-share ต้องตรงทุกตัวเลข
  stage.html           โหลด data.js ของเรื่อง + engine + cast-base + characters + film.js ของเรื่อง (path ผ่าน query หรือสร้างต่อเรื่องโดย prepare)
  prepare.mjs / render.mjs / mix.mjs / make-voice.mjs / check-motion.mjs
                       รับโฟลเดอร์เรื่องเป็น argument: `node scripts/film-kit/prepare.mjs output/<id>`
  new-film.mjs         `node scripts/film-kit/new-film.mjs <id>` สร้าง output/<id>/ พร้อม film.config.mjs, story.mjs, film.js ตัวอย่างสั้น, props/
  lib/playwright.mjs   หา playwright-core: env PLAYWRIGHT_CORE → output/kufic/.tools → error ที่บอกวิธีติดตั้ง; Chrome path จาก env CHROME_PATH หรือค่าเดิม
  assets/kits/         สำเนา kits ทั้ง 12 ชุดจาก output/car-truth-v2/assets/kits (ไม่เปลี่ยนภาพ) + MANIFEST.json (sha256 ทุกไฟล์ + ที่มา)
  assets/backgrounds/park.jpg
  assets/sfx/          สำเนา sfx 7 ไฟล์ + PROVENANCE.md (ที่มาเท่าที่หาได้จากไฟล์ README/production ของ car-truth-v2; ถ้าไม่พบให้เขียนว่าไม่พบ)
```
- `output/<id>/film.config.mjs`: `id, title, background, cast: {nuri:['front','q','side'], ...}` (อ้าง kits ใน film-kit), `turnAfter`, ค่าเสียง ambience
- `story.mjs` ของเรื่องเหลือแค่ `names, lines, scenes`
- override ค่าตัวละครต่อเรื่องได้ใน film.js (`CAST.sabir.scale=.55` แบบเดิม)
- gate ของ check-motion: ส่วนทั่วไป (จุดจับคลาด ≤2px@720p ทุก grip, หัวไม่หลุดขอบกล้องสำหรับทุกตัวขณะ grip) อยู่ใน kit;
  gate เฉพาะเรื่อง (EVENTS jump, minTruckGap, ล้อค้าง) ให้เรื่องประกาศเองใน `film.checks.js` หรือ export ใน config
- เสียง: make-voice ใช้ `scripts/lib/robot-voice.mjs` + `src/lib/friends.ts` เหมือนเดิม — **ห้ามเรียก ElevenLabs ในงานนี้** (ใช้ไฟล์เสียงเดิมที่คัดลอกมา)

## เกณฑ์ผ่าน (ต้องรันจริงและแนบผล)
1. port car-share ไป `output/car-share-kit/` ด้วยแม่แบบ (คัดลอก voice/, props/, เขียน config/story/film.js ใหม่ที่ใช้ API ของ kit)
   แล้ว `prepare` → timing.json ต้องเท่ากับของเดิมทุกค่า
2. render stills ที่ 0, 5, 16, 28, 40, 51, 65, 81, 94, 96.6, 100, 108, 125.5, 133, 144, 155, 166, 190, 203 วิ
   จากทั้ง `output/car-share` (ต้นฉบับ — render แบบ --stills ลงโฟลเดอร์ชั่วคราวนอก car-share หรือใช้ --page/สำเนา ห้ามเขียนทับ qa ของเดิม)
   และ `output/car-share-kit` แล้วเทียบพิกเซล: **ต่างได้ไม่เกิน 0.1% ของพิกเซล และไม่มีพิกเซลต่างเกิน 8/255** — รายงานค่าทุกภาพ
3. `check-motion` ของ car-share-kit `passed:true` และตัวเลขใกล้ `output/car-share/qa/motion-report.json`
4. ทดสอบ IK ใหม่: เรื่องสั้น `output/film-kit-ik-test/` (สร้างด้วย new-film.mjs) ~8 วิ ไม่ต้องมีเสียง (ใส่ lines ว่าง/timing สั้น ๆ ได้)
   - ฮาดีมุม q จับรถด้วยมือซ้าย, ซาบิรจับด้วยสองมือพร้อมกัน, นูรีมุม front จับด้วยมือขวา (ถ้า rig ไม่มีข้อต่อที่จำเป็นให้รายงาน ไม่ต้องฝืน)
   - check-motion ผ่านเกณฑ์จุดจับ ≤2px และ stills 6 ภาพ
5. `new-film.mjs demo-x` แล้ว `prepare` + `render --stills 1` ต้องรันได้ทันที (ลบ demo-x ออกหลังทดสอบ)
6. `grep` ใน scripts/film-kit ต้องไม่เจอ `car-share`, `car-truth`, `hadi`/`sabir` ใน engine.js/cast-base.js (characters.js มีได้)
7. `npm run lint` ไม่พังจากไฟล์ใหม่ (ถ้า eslint ไม่ครอบ scripts/ ให้รายงาน)

## ส่งงาน
เขียนรายงานภาษาไทยที่ `scripts/film-kit/REPORT-FILM-KIT-1.md`: ไฟล์ที่สร้าง, ผลเกณฑ์ 1–7 พร้อมตัวเลข, สิ่งที่ทำไม่ได้, ขนาด assets ที่จะเข้า git
ไม่มีงานภาพใหม่ ไม่มีเสียงใหม่ ไม่มีเนื้อหาศาสนาใหม่
