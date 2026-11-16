# รายงาน FILM-KIT-1

วันที่ 16 พฤศจิกายน 2026 · ผู้ลงมือ: Codex ตระกูล GPT-6 (runtime ไม่เปิดเผย model ID ย่อย)

ทำครบเกณฑ์ 1–7 ของ brief และรันตรวจจริงแล้ว ไม่มี commit/push ไม่มีการเรียก ElevenLabs ไม่มีภาพ เสียงพากย์ หรือเนื้อหาศาสนาใหม่ ไม่แก้ต้นฉบับ `output/car-share/`, `output/car-truth-v2/`, `src/`, `public/` หรือไฟล์นอกขอบเขตงาน เก็บการแก้ไขเดิมและงานอื่นที่มีอยู่ใน working tree ไว้ตามเดิม

## ไฟล์ที่สร้าง

ใน `scripts/film-kit/`:

- `README.md`: คู่มือภาษาไทย เริ่มเรื่องใหม่ การจัดบท/config/เสียง/ภาพ API ทั้งหมด และค่า CAST
- `engine.js`: runtime canvas จากต้นฉบับ เปลี่ยน contact shadow เป็นค่าจาก CAST และรองรับ body follow หลายมือพร้อมกัน
- `cast-base.js`: turn, drive, joints, gesture, head, grip, frontGrip, cut, camTo, place, prop, shadow และท่าพื้นฐาน ไม่มีค่าประจำตัวละคร
- `characters.js`: ค่ามาตรฐานทั้งสี่ตัวตามต้นฉบับ พร้อม grip/follow ต่อมุมและต่อมือ
- `stage.html`: โหลดข้อมูลและ runtime ตามลำดับ ใช้ path สัมพัทธ์ต่อเรื่อง โดย prepare สร้างสำเนา runtime ให้
- `prepare.mjs`, `render.mjs`, `mix.mjs`, `make-voice.mjs`, `check-motion.mjs`, `new-film.mjs`
- `lib/common.mjs`, `lib/playwright.mjs`: รับโฟลเดอร์เรื่อง โหลด config/story หา Playwright และ Chrome จาก environment/fallback
- `verify-port.mjs`: ตรวจ timing เทียบภาพ 19 เวลา และสรุปตัวเลข motion เทียบต้นฉบับ โดยเขียนหลักฐานลงฝั่งเรื่องที่ port เท่านั้น
- `assets/kits/`: kits เดิม 12 ชุด รวม 298 ไฟล์ และ `MANIFEST.json` มีต้นทาง ขนาด และ sha256
- `assets/backgrounds/park.jpg`: ภาพเดิม
- `assets/sfx/`: เสียงเดิม 7 ไฟล์ และ `PROVENANCE.md`
- `evidence/acceptance.json`, `lint-summary.json`, `supported-arms.json`, `demo-still.jpg`, `demo-mix.json`: หลักฐานตรวจรับ

ใน `output/car-share-kit/`: `film.config.mjs`, `story.mjs` ซึ่งเหลือแค่ names/lines/scenes, `film.js` ที่ใช้ API กลาง, `film.checks.js` สำหรับ gate เฉพาะเรื่อง, สำเนา `voice/`, `props/` เดิม และผล prepare/runtime/QA

ใน `output/film-kit-ik-test/`: เรื่องทดสอบเงียบ 8 วินาที สร้างโครงด้วย new-film แล้วกำกับฮาดีมือซ้าย ซาบิรสองมือ นูรีมือขวามุม front พร้อม config/story/film/props/runtime/QA

`output/demo-x/` สร้างด้วย new-film เพื่อทดสอบ และลบออกหลังเก็บหลักฐานตาม brief

## ผลเกณฑ์ 1 — port และ timing

คำสั่งจริง: `node scripts/film-kit/prepare.mjs output/car-share-kit`

35 บรรทัดเสียง, 7 ฉาก, รวม **204.821 วินาที** เทียบโครงสร้าง `timing.json` ด้วย `assert.deepEqual` ผ่านทุกค่า รวม id/title/shots/audio/total ไม่ใช่แค่เวลารวม เสียงทั้งหมดเป็นสำเนาจากต้นฉบับ ไม่มีการสร้างเสียง

เครื่องนี้ไม่มี ffmpeg ใน PATH จึงตั้ง `FFMPEG` ชี้ executable ที่มีอยู่แล้ว: `output/backup-2026-11-11/had3voice/had-3-voice/tools/node_modules/ffmpeg-static/ffmpeg.exe` ไม่มีการดาวน์โหลดหรือติดตั้ง dependency เพิ่ม

## ผลเกณฑ์ 2 — ภาพทั้ง 19 เวลา

คำสั่งจริง: `node scripts/film-kit/verify-port.mjs output/car-share output/car-share-kit`

เรนเดอร์ผ่าน render.mjs จาก **stage ของต้นฉบับจริง** และ stage ของเรื่องที่ port เป็น PNG lossless ขนาด **1920×1080** เทียบ RGB ทุกช่อง รวม **2,073,600 พิกเซลต่อภาพ** ไม่มี JPEG compression บังความแตกต่าง

ภาพต้นฉบับอยู่ใน `output/car-share-kit/qa/original/` และภาพจาก kit อยู่ใน `output/car-share-kit/qa/port/` ใช้ `--dest` จึงไม่เขียน qa หรือ sfx.json ของต้นฉบับ

| เวลา (วินาที) | พิกเซลต่าง | ต่าง (%) | ความต่างช่องสีสูงสุด /255 | ผล |
|---:|---:|---:|---:|---|
| 0 | 0 | 0 | 0 | ผ่าน |
| 5 | 0 | 0 | 0 | ผ่าน |
| 16 | 0 | 0 | 0 | ผ่าน |
| 28 | 0 | 0 | 0 | ผ่าน |
| 40 | 0 | 0 | 0 | ผ่าน |
| 51 | 0 | 0 | 0 | ผ่าน |
| 65 | 0 | 0 | 0 | ผ่าน |
| 81 | 0 | 0 | 0 | ผ่าน |
| 94 | 0 | 0 | 0 | ผ่าน |
| 96.6 | 0 | 0 | 0 | ผ่าน |
| 100 | 0 | 0 | 0 | ผ่าน |
| 108 | 0 | 0 | 0 | ผ่าน |
| 125.5 | 0 | 0 | 0 | ผ่าน |
| 133 | 0 | 0 | 0 | ผ่าน |
| 144 | 0 | 0 | 0 | ผ่าน |
| 155 | 0 | 0 | 0 | ผ่าน |
| 166 | 0 | 0 | 0 | ผ่าน |
| 190 | 0 | 0 | 0 | ผ่าน |
| 203 | 0 | 0 | 0 | ผ่าน |

ผ่านเกณฑ์ ≤0.1% และทุกช่องสีต่าง ≤8/255 ทั้ง 19 ภาพ หลักฐานละเอียดอยู่ใน `output/car-share-kit/qa/port-regression.json` และสำเนาใน `evidence/acceptance.json`

## ผลเกณฑ์ 3 — motion ของเรื่อง port

คำสั่งจริง: `node scripts/film-kit/check-motion.mjs output/car-share-kit`

**passed:true**, 4,916 เฟรม, 1,475 ตัวอย่างจับ, 14 grips ความคลาดเคลื่อนสูงสุด **0.00011420428564680778 px@720p** จำนวนเฟรม จำนวนตัวอย่าง และความคลาดเคลื่อนของทุก grip **ต่างจาก motion-report ต้นฉบับเป็น 0**

Gate กลางตรวจ head/dome ของทุกตัวขณะจับรวมช่วงเข้า/ออกและขอบกล้องทั้งสี่ด้าน: margin ต่ำสุด **182.2263280877996 px@1080p** (ซาบิร) ไม่หลุดขอบกล้อง ไม่มีการวาดภาพเพื่อวัดตัวเลขนี้ ใช้ matrix กล้องเดียวกับ render

Gate เฉพาะเรื่องอยู่ใน `output/car-share-kit/film.checks.js` และรายงานใต้ `story`:

| ค่า | ผลของ kit | เทียบต้นฉบับ |
|---|---:|---|
| jump ตอน take/release/returnLand | 0 px@720p | เท่ากัน |
| jump ตอน land | 0.00008138020833333333 px@720p | เท่ากัน |
| cargoBlue attach | 0.006673177083333333 px@720p | เท่ากัน |
| cargoGold attach | 0.006675948865617298 px@720p | เท่ากัน |
| minTruckGap | 8 px โลก | เท่ากัน |
| minSafiHeadMargin | 182.93526196479792 px@1080p | เท่ากัน |
| airWheelDrift | 0 | เท่ากัน |

รายละเอียด: `output/car-share-kit/qa/motion-report.json`

## ผลเกณฑ์ 4 — IK ใหม่

สร้างด้วย `node scripts/film-kit/new-film.mjs film-kit-ik-test` แล้วแก้ config/film/props ในโฟลเดอร์ทดสอบ รัน prepare, check-motion และ `render --stills 0,1,2,3,5,7 --w 1280` จริง

**passed:true**, ความยาว 8 วินาที, 192 เฟรม, 580 ตัวอย่างจับ (145 ต่อมือ) ซาบิรใช้ truck เดียวกัน จับด้วยสองมือพร้อมกันช่วงวินาที 1–7 พร้อมยก/วางและ body follow ที่ใช้เป้าของทั้งสองมือ

| ตัวละคร / มุม / มือ | error สูงสุด px@720p |
|---|---:|
| ฮาดี / q / ซ้าย | 0.000025329795667773412 |
| ซาบิร / q / ซ้าย | 0.00003993496813889183 |
| ซาบิร / q / ขวา | 0.000013177885681520506 |
| นูรี / front / ขวา | 0.000041233814452786195 |

ทุกค่าต่ำกว่า 2px margin หัวต่ำสุด **297.999999076128 px@1080p** มี stills ครบ 6 ภาพใน `output/film-kit-ik-test/qa/` ตรวจภาพรวมด้วย contact sheet แล้ว ไม่มีการสร้าง artwork ใหม่ รูปใน contact sheet เป็นเพียงภาพจาก canvas ของ asset เดิม

ตรวจ smoke เพิ่มแบบเป้าโลกคงที่กับ **20 arm chains ที่ rig มีจริง** ครอบคลุม front/q/side/back ทั้งหมด ผ่านทุกชุด error สูงสุด **0.000056973698045026524 px@720p** ผลอยู่ใน `evidence/supported-arms.json` ใช้ scale มาตรฐาน ยกเว้นซาบิรมือขวา q ใช้ .55 ตาม choreography ต้นฉบับที่ profile เดิมปรับไว้

## ผลเกณฑ์ 5 — เริ่มเรื่องใหม่

รันจริงตามลำดับ:

```text
node scripts/film-kit/new-film.mjs demo-x
node scripts/film-kit/prepare.mjs output/demo-x
node scripts/film-kit/render.mjs output/demo-x --stills 1
```

ผ่านทันที: เรื่องเงียบ 8 วินาที 0 บรรทัด สร้าง still ที่วินาที 1 ได้ โดยไม่ต้องมี voice ทดสอบเพิ่มเติม render ทั้ง 8 วินาทีและ mix สำเร็จด้วย ffmpeg เดิม ไม่มีการเรียกบริการเสียง รองรับรายการ dialogue/cues ว่างและสร้าง stems ได้

เก็บภาพกับผล mix ที่ `evidence/demo-still.jpg`, `evidence/demo-mix.json` แล้ว **ลบ output/demo-x ออกแล้ว**

## ผลเกณฑ์ 6 — ไม่มีชื่อเรื่อง/ตัวละครใน core

รันจริง:

```text
rg -n 'car-share|car-truth|hadi|sabir' scripts/film-kit/engine.js scripts/film-kit/cast-base.js
```

ผล **0 matches** (rg exit 1 หมายถึงไม่พบ) ค่า contact shadow และ grip/follow อยู่ใน characters.js ทั้งหมด

## ผลเกณฑ์ 7 — lint

รัน `npm.cmd run lint -- --output-file scripts/film-kit/lint-result.json --format json` จริง: **exit 0, 0 errors, 0 warnings** ตรวจทั้งหมด 421 ไฟล์ รวม JavaScript/MJS ใหม่ **12 ไฟล์** ใน film-kit ดังนั้น eslint ครอบคลุม scripts ชุดนี้จริง ไม่ใช่ถูก ignore

ใช้ npm.cmd เพราะเครื่องปิดการรัน npm.ps1 ผ่าน PowerShell execution policy ไม่ได้เปลี่ยนนโยบายเครื่อง เก็บสรุปผลรายชื่อไฟล์ใน `evidence/lint-summary.json` แล้วลบ JSON รายงานเต็มที่มีรายการไฟล์ทั้ง repo ออก ไม่มีการรัน build/typecheck ของ Next.js เพราะงานนี้เป็น standalone canvas/Node scripts และ brief กำหนดให้ตรวจ lint โดยไม่แก้ไฟล์ส่วนแอป

## ขนาด asset ที่เตรียมเข้า git

| กลุ่ม | จำนวนไฟล์เดิม | ขนาด (bytes) |
|---|---:|---:|
| kits 12 ชุด | 298 | 10,481,062 |
| background park.jpg | 1 | 514,103 |
| SFX | 7 | 529,201 |
| รวม asset เดิม | **306** | **11,524,366** |

รวมประมาณ **11.52 MB / 10.99 MiB** ไม่รวมโค้ด เอกสาร manifest/provenance และภาพหลักฐาน ตรวจเทียบ bytes กับต้นทางและ sha256 ทุกไฟล์จริง: **0 mismatches** ไฟล์ตัวอย่างในคลัง assets ไม่ติด gitignore ตาม `git check-ignore` จึงพร้อมให้ผู้ตรวจพิจารณาเข้า git แต่ไม่ได้ git add/commit

## ข้อจำกัดและสิ่งที่ไม่ได้ทำ

- ไม่พบเอกสาร README/production ในต้นทาง car-truth-v2 ที่ยืนยันผู้สร้างหรือสัญญาอนุญาตรายไฟล์เสียงทั้ง 7 จึงเขียนว่า **ไม่พบ** ใน PROVENANCE.md ไม่อ้างสิทธิ์ CC0/สิทธิ์เผยแพร่ขึ้นเอง การคัดลอกเพื่อทดสอบครั้งนี้ไม่ใช่การอนุมัติให้เผยแพร่หรือ commit เสียง
- ไม่มี arm-l ในชุด side ทั้งสามตัวที่มี side และไม่มี arm-l ในซาบิร front; ไม่มี back ของนูรี/ซาบิร/ซาฟี ใช้เฉพาะ rig ที่มีจริงตาม brief ไม่วาดหรือเพิ่มข้อต่อปลอม แต่สามกรณี IK ที่กำหนดมีข้อต่อครบและผ่านทั้งหมด
- grip/follow สำหรับมุม/มือที่เพิ่มเป็นค่าตั้งต้นจาก rig ต้องตรวจภาพและปรับตามสเกล/เป้าของเรื่องใหม่ การจับพร้อมกันต้องมีระยะเอื้อมร่วมกันจริง profile ขวา q ของซาบิรคงตัวเลขเดิมซึ่งใช้กับ scale .55 ในเรื่องต้นฉบับ
- ไม่เรนเดอร์ master ทั้งเรื่อง port ใหม่ เพราะเกณฑ์ตรวจรับกำหนด stills/motion/timing; ได้ทดสอบ pipeline render/mix กับ demo 8 วินาทีแล้ว
- `make-voice` ถูกทดสอบเฉพาะการปฏิเสธโหมด offline (exit 1 ตามที่ตั้งใจ) โดยไม่มี `--generate` และ guard อยู่ก่อน import ตัวสร้างเสียง ไม่มีการเรียก ElevenLabs หรือสร้างเสียงพากย์
- ไม่มีเกณฑ์ตรวจรับข้อใดค้างอยู่ ไม่มี commit/push และไม่ลบไฟล์ต้นทางของเรื่องเดิม

ต้นทางงานที่ส่งอยู่ที่ **D:\Littleummah\scripts\film-kit\**, **D:\Littleummah\output\car-share-kit\** และ **D:\Littleummah\output\film-kit-ik-test\** โดยสองโฟลเดอร์ output เป็นงานตรวจรับที่อยู่นอก git ตามโครงเดิมของ repo
