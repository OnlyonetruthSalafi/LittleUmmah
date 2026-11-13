# Handoff — วิธีทำการ์ตูนเต็มเรื่อง (film) สำหรับ Codex

เขียนโดย Claude 13 พ.ย. 2026 · ใช้กับเกาะมารยาท (`/learn/moral` เรื่อง salam) และเกาะสำรวจโลก (`/learn/explore` เรื่อง desert)
อ่านทั้งไฟล์ก่อนลงมือ และอ่าน `AGENTS.md` ข้อ 1 (ศาสนา/ภาพ/เสียง), 2 (UX), 4–5 (ขั้นตอน) ให้ครบ

เจ้าของโปรเจกต์สั่ง 13 พ.ย.: **"ให้เป็นการ์ตูนจริงๆ"** — ตัวละครต้องขยับร่างกายจริงทุกช็อต (เดิน ขับ บิน ชี้ โบก ก้ม กระโดด)
ห้ามกลับไปเป็นแบบ "ภาพนิ่ง + เสียงบรรยาย" หรือ "แค่หุ่นส่ายหัว" (ฉบับแรกของเกาะมารยาทโดนตีกลับเพราะข้อนี้)

---

## 0. สถานะตอนส่งต่อ (13 พ.ย. 2026)

| เรื่อง | สถานะ |
|---|---|
| salam (เกาะมารยาท) | อยู่บน main แล้ว วิดีโอบน R2 `moral/film/` |
| desert "ไปเที่ยวทะเลทราย" (เกาะสำรวจโลก บท `desert-home` วัย 3–6) | ฉบับ v2 เสร็จ (100.6 วิ) · branch `feature/explore-film` worktree `D:/Littleummah-exfilm` **ยังไม่ commit** · รอเจ้าของตรวจ |

**งานค้างของ desert (ทำหลังเจ้าของผ่านเท่านั้น):**
1. อัปโหลดวิดีโอขึ้น R2 (ข้อ 8)
2. ลบไฟล์ทดสอบในเครื่องก่อน commit: `D:/Littleummah-exfilm/public/explore/film/desert-720.mp4`, `desert-1080.mp4`, และ `D:/Littleummah-exfilm/.env.local`
   (เก็บ `desert-poster.webp` และ `desert.th.vtt` ไว้ — สองไฟล์นี้ต้อง commit)
3. `npm run build` + `npm test` + `scripts/check-explore-browser.mjs` ผ่าน → เจ้าของอนุมัติ → commit
4. สคริปต์ `scripts/check-moral-browser.mjs` ไม่ผ่านที่ข้อ "เกาะอื่นห้าเกาะ" (`.oi-wrap img` = 0) — **เป็นของเดิมบน main ไม่ได้เกิดจากงานนี้** ยังไม่มีใครแก้
5. การตัดสินใจที่ Claude ทำเอง รอเจ้าของยืนยัน: ให้ฮาดีกับซาฟีร่วมเรื่องทะเลทราย

ผลตรวจล่าสุด: `output/car-desert/test-report.md` (Codex sol ทดสอบเครื่องเล่น 13 พ.ย. — ผ่าน)

---

## 1. ภาพรวม pipeline

```
บท script.md ──► เสียงพากย์ (ElevenLabs) ─┐
     │                                      ├─► film.mjs (ฉาก + แอนิเมชัน) ─► index.html ─► HyperFrames render ─► render.mp4 (ไม่มีเสียง)
     └─► brief ภาพ ─► Codex imagegen ─────┘                                  └► timing.json ─► mix.mjs ─► master.mp4
          (ฉาก plates + ชุดชิ้นส่วน kits)                                         └► turns.json (จุดหยุดในเว็บ)
                                                                                   └► vtt.mjs ─► คำบรรยาย .vtt
master.mp4 ─► ffmpeg ─► <ชื่อ>-720.mp4 / -1080.mp4 / -poster.webp ─► R2 + public/ ─► ข้อมูล FILMS ในเว็บ ─► FilmLesson
```

ไม่มี Blender ในเวอร์ชันนี้ — ตัวละครเป็นชิ้นภาพ PNG ซ้อนเป็นข้อต่อ DOM แล้วขยับด้วย GSAP (cut-out animation)

---

## 2. โฟลเดอร์และไฟล์

ไฟล์ใน `output/` ไม่อยู่ใน git — **ห้าม `git worktree remove` ก่อนคัดลอก output ออก** (เคยหายมาแล้ว)

| ที่ | ใช้ทำอะไร |
|---|---|
| `output/car-salam2/kits/<id>/` | ชุดชิ้นส่วนหุ่นยนต์ nuri hadi sabir rassam qalam(=ฟาฮีม) safi + `rig.json` — **ใช้ซ้ำทุกเรื่อง ไม่ต้องทำใหม่** |
| `output/car-salam2/` | เรื่อง salam: `script.md`, `brief-kits.md` (brief ตัดชิ้นส่วนหุ่นยนต์), `make-voice.mjs`, `voice/`, `sfx/` |
| `output/car-hf/salam2/` | engine เดิม + `film.mjs` ของ salam |
| `output/car-desert/` | เรื่อง desert: `script.md`, `brief-art.md` (brief ภาพฉาก+สัตว์ — **ใช้เป็นแม่แบบ**), `kits/camel`, `kits/fennec`, `plates/`, `props/`, `voice/`, `sfx/`, `make-voice.mjs`, `check-film.mjs`, `qa/` |
| `output/car-hf/desert/` | **ต้นแบบล่าสุด — คัดลอกโฟลเดอร์นี้เมื่อเริ่มเรื่องใหม่**: `engine.mjs` `film.mjs` `mix.mjs` `vtt.mjs` `preview.mjs` `hyperframes.json` `assets/` `web/` |

`assets/` ของโปรเจกต์ HyperFrames ต้องมี: `gsap.min.js`, `kits/<id>/` (คัดลอกจากต้นทาง), `plates/<ชื่อ>.jpg` (แปลงจาก PNG ด้วย `ffmpeg -q:v 2`), `props/*.png|svg`

---

## 3. ขั้นตอนทำเรื่องใหม่ (ตามลำดับ)

### 3.1 เลือกบทและเขียน script.md
- เลือกบทที่มีอยู่แล้วในเว็บ (เช่นบทใน `src/features/explore/data.ts` `CARTOONS` หรือ `src/features/moral/cartoon.ts`)
- **ข้อเท็จจริงต้องไม่เกินบทเดิมที่ผ่านแล้ว** — ไม่เพิ่มข้อมูลใหม่ (ชื่อ ตัวเลข สถานที่)
- ตารางช็อต: `# | ช็อต | ภาพ/การแสดง | เสียง` (ดู `output/car-desert/script.md`) ยาว ~90–100 วิ 12–15 ช็อต
- ทุกช็อตต้องมีการขยับร่างกายที่เล่าเรื่อง (ไม่ใช่แค่ยืนพูด) และมีมุขเล็กๆ ที่สอนเนื้อหา (เช่นล้อฮาดีจมทราย vs เท้าอูฐไม่จม)
- จบด้วยนูรีหันหากล้องชวนเด็กพูดตาม (ซิกรุ/คำที่เรียน) → จุดหยุดให้เด็กพูด → นูรีชม

**กฎเนื้อหาที่ต้องจำ**
- **ห้ามตัวละครบ่นเรื่องสภาพอากาศ** (เจ้าของแก้ 13 พ.ย.: เป็นตัวอย่างเชิงลบ ผิดหลักศาสนา) — บอกเป็นข้อเท็จจริงแทน
  ✗ "ร้อนจังเลย!" "แดดร้อนมาก" · ✓ "กลางวันอุณหภูมิสูง กลางคืนอากาศเย็น"
- อายะฮ์อัลกุรอาน: **ความหมายไทยเท่านั้น** ไม่ยกตัวอาหรับ ไม่ให้หุ่นอ่านอาหรับ (AGENTS 1.6) คำแปล quran.com id 51
- หะดีษ: เศาะฮีห์/หะซันเท่านั้น ใส่ที่มาใน comment · **ห้ามอิสรออีลียาต**
- ซิกรุ/ดุอาอ์ (ซุบฮานัลลอฮ์ ฯลฯ) ให้หุ่นพูดได้
- **Claude ต้องตรวจเนื้อหาศาสนาทุกบรรทัดก่อนอัดเสียง** (AGENTS ข้อ 4) — Codex ร่างได้ ตัดสินไม่ได้
- เกาะมารยาท: ตัวละครเป็นหุ่นยนต์ล้วน ห้ามเด็ก (แม้หันหลัง)
- เพื่อนนูรี (ฮาดี ซาบิร รอสซาม ฟาฮีม ซาฟี): ใช้ได้ในการ์ตูน แต่บอกเจ้าของทุกครั้งว่าใส่ตัวไหน

### 3.2 brief ภาพให้ Codex imagegen (gpt-6-astra)
แม่แบบ: `output/car-desert/brief-art.md` — ปรับชื่อสัตว์/ฉาก
- **งบ imagegen ระบุเป็นตัวเลข** (desert ใช้ 10 ครั้ง) ตัดจากภาพเดิมก่อน
- **สัตว์: ใบหน้าว่างเปล่า** ไม่มีตา จมูก ปาก คิ้ว ขนตา แก้มแดง เงารูปตา (AGENTS 1.1) — ส่ง `qa/heads.png` ขยายหัว 4 เท่า
- ดีไซน์สัตว์อ้างอิงภาพเดิมที่เจ้าของผ่านแล้วใน `public/explore/scenes/` · **ภาพสัตว์ที่สร้างใหม่ต้องให้เจ้าของดูหน้าที่ขนาดเต็มทุกครั้ง**
- ฉาก 1920×1080 **ไม่มีคน ไม่มีสัตว์ ไม่มีตัวหนังสือ ไม่มีสัญลักษณ์ดนตรี** พื้นด้านล่างว่าง ≥ 35–40% · ส่ง `plates/ground.json`
- ชุดชิ้นส่วนสัตว์: ผ้าใบ 1024×1024 **หันขวา** ท่ายืนตรง แยกข้อต่อ (ลำตัว คอ หัว หู หาง ขาบน/ล่าง) + `rig.json` (x,y,w,h,pivot,parent,z ในพิกัดผ้าใบ) + เติมส่วนที่ถูกบังให้หมุน ±35° ไม่เห็นรอย
- **ตรวจ alpha ทุก PNG** (imagegen คืนภาพโปร่งแสงครึ่งเดียวบ่อย)
- ชั้นบังหน้า (เช่น `burrow-front.png`) สำหรับให้สัตว์อยู่ "ในโพรง"
- รันแบบนี้ (prompt ก่อน `-i` เสมอ):
  ```
  cd output/car-<เรื่อง>
  echo "อ่านและทำตาม brief-art.md ในโฟลเดอร์นี้ให้ครบ ทำงานเฉพาะในโฟลเดอร์นี้ ตอบสรุปเป็นภาษาไทย" | codex exec -m gpt-6-astra -c model_reasoning_effort=medium -s workspace-write -C . - > codex-art.log 2>&1
  ```
- ดูโควต้า Codex ก่อน: `grep -o '"used_percent":[0-9.]*' <rollout ล่าสุดใน ~/.codex/sessions>` — เกิน 60% ให้ทำเฉพาะภาพ (memory codex-budget-plan)

### 3.3 เสียงพากย์
- คัดลอก `output/car-desert/make-voice.mjs` → แก้ `LINES` (`key: [ตัวละคร, ข้อความ]`) และโฟลเดอร์ output
- รันจาก root repo: `FFMPEG=ffmpeg node output/car-<เรื่อง>/make-voice.mjs [key ...]`
- นูรี = ElevenLabs Leo + ฟิลเตอร์หุ่นยนต์ (`scripts/lib/robot-voice.mjs`) · เพื่อนแต่ละตัวใช้ `voiceId`/`pitch` ใน `src/lib/friends.ts`
- คำทับศัพท์ที่อ่านเพี้ยนแก้ที่ `SAY_AS_ENGLISH` / `SAY_AS_THAI` ใน robot-voice.mjs
- **คำอาหรับในเสียง** (ซุบฮานัลลอฮ์, สลาม): ตรวจด้วย skill `thai-voice-check` (`D:/tools/thai-asr/ar_check.py pairs.json`) ถ้าต่ำกว่า ~85% **อัดใหม่ทั้งบรรทัด** (เจ้าของไม่รับการตัดต่อเสียง) แล้วเลือก take ที่ดีที่สุด
- คลิป "ท่านนบี ﷺ" ต้องต่อเสียงมาตรฐาน (memory nabi-salawat-standard-clip) · สลามใช้ท่อนสลามมาตรฐาน (ดู salam `make-voice.mjs`)
- ไฟล์เสียงเดิมที่แทนแล้ว ย้ายไป `voice-old/` อย่าลบ
- เสียงใหม่ทุกไฟล์: แจ้งเจ้าของให้ฟัง (บทพูดลงทะเบียนได้ก่อนอนุมัติ แต่ต้องแจ้ง)

### 3.4 เสียงประกอบ (SFX)
- สร้างด้วย ElevenLabs `/v1/sound-generation` — ตัวอย่าง `output/car-desert/sfx/gen.py`
- ทุก prompt ต่อท้าย: `no music, no melody, no drums, no percussion, no horns, no singing, no human voices, no speech, no animal vocalizations` (AGENTS 1.3)
- เขียน "clearly audible" เสมอ — prompt "soft/gentle" ได้ไฟล์เงียบเกือบ −70 dB · วัดด้วย `ffmpeg -af volumedetect` แล้วสร้างใหม่ถ้า mean < −50 dB
- ห้ามใช้ไฟล์จาก `D:\Effectsound` (ยังไม่มีสิทธิ์ใช้)
- **ทุกไฟล์ต้องให้เจ้าของฟังอนุมัติก่อน commit**

### 3.5 เขียน film.mjs (แอนิเมชัน)
คัดลอก `output/car-hf/desert/` ทั้งโฟลเดอร์ แล้วแก้:
- `engine.mjs` บรรทัดต้นไฟล์: `KITS_DIR` (หุ่นยนต์ = car-salam2/kits), `ANIMAL_KITS_DIR` + ชุด `ANIMALS` (ชื่อสัตว์ของเรื่องนี้), `VOICE_DIR`
- `mix.mjs`: `V` / `S` (โฟลเดอร์เสียง) และไฟล์ ambience หลัก (`wind.mp3`)
- `vtt.mjs`: path ของ make-voice.mjs/voice และข้อความรวมของบรรทัด `g-*` (พูดพร้อมกัน)
- เพิ่ม gait ของสัตว์ใหม่ใน `GAIT` ของ film.mjs (`legs` = ชื่อขา: เฟส 0/1, `upper`/`lower` องศา, `stride` px, `bob`)

**API ที่ใช้บ่อย (film.mjs / engine.mjs)** — เวลาเป็นวินาทีนับจากต้นช็อต
| ฟังก์ชัน | ทำอะไร |
|---|---|
| `shot(id, dur, plate, cam, amb)` | ช็อตใหม่ · `cam {from:{scale,x,y}, to:{...}}` ถูก clamp ไม่ให้เห็นขอบดำ · `amb` = ระดับเสียงลมของช็อต |
| `robot(s, id, {x,y,s,flip,z})` / `animal(s, kit, {...})` | วางตัวละคร (x,y = จุดเท้าบนจอ) หายใจ/กระพริบตาอัตโนมัติ |
| `say(s, actor, clip, at, {head})` | พากย์ + ปากขยับตามเสียง + พยักหัว คืนค่าความยาวคลิป · voice-over ไม่มีตัว: `audio.push([clip, s.start + at])` |
| `walk` / `walkTo(s, a, x, y, at, {period})` | สัตว์เดิน (ความเร็วผูกกับก้าว เท้าไม่ไถล) |
| `s.placeTo` / `s.move` / `s.squash` | ย้ายตำแหน่ง / ลอยขึ้นลง / ยืดหด-เอียง |
| `s.rot` / `s.pose` | หมุนข้อต่อ (องศา + = ตามเข็มนาฬิกา) |
| `s.wave(a, "l"|"r", at, dur)` / `point(s, n, "l"|"r", at, hold)` | โบก / ชี้ — **"l" = แขนฝั่งซ้ายของจอ, "r" = ขวาของจอ** |
| `look(s, a, dx, at)` | เลื่อนตา+ปากบนหน้าจอหุ่นให้ "มอง" ไปทางสิ่งที่ดู (dx ลบ = ซ้ายจอ, ~30–40) |
| `s.eyes(a, "eyes-happy|open|wide|blink")` / `s.blink` | สีหน้า |
| `wheels` `propel` `hover` `capeWind` `s.tread` `s.spin` | ล้อ ใบพัด ซาฟีลอย ผ้าคลุมนูรีปลิว สายพาน |
| `puff(s, ...)` / `s.prop(...)` | ฝุ่นทราย / ของประกอบ (z สูง = อยู่หน้า เช่นชั้นบังโพรง) |
| `fx(s, name, at, gain)` | เสียงประกอบ (gain ×0.5 ใน mix) |
| `turns.push({at, resumeAt, kind})` | จุดหยุดในเว็บ (ภาพถ่าย / พูดตาม) |

**บทเรียนที่เจอ (ห้ามพลาดซ้ำ)**
- **ทิศหน้าและมือชี้ต้องตรงกับสิ่งที่ดู** (เจ้าของตีกลับ 13 พ.ย.) — สัตว์/ภาพถ่ายอยู่ซ้าย → `point(..., "l")` + `look(..., -35)` ทุกตัวในฉาก · ขับไปทางไหนมองทางนั้น · พูดกับเด็กค่อยมองกล้อง (`look(...,0)`)
- **ภาพถ่ายในเว็บขึ้นทางซ้ายของจอ** → ช็อตก่อนจุดหยุดภาพ ให้นูรียืนขวาและชี้ซ้าย
- ตัวละคร `flip: true` กลับทิศการหมุนทั้งหมด — อูฐหันซ้ายต้องก้มคอ `neck +70` (ไม่ใช่ −70) · `look()` กลับค่าให้เองแล้ว
- ตัวใหญ่เกินกล้องจะหัวขาด — หุ่นช็อตใกล้ใช้ s ~0.65–0.75 (hadi), นูรีช็อตใกล้ s ~1.0
- สัตว์เดินออกจากเฟรมเร็วเกินแล้วเหลือฉากว่าง — คำนวณระยะ/`period` ให้เดินเต็มช็อต
- ยกแขนชี้ฟ้าแล้วลดลงให้ลงตรงๆ ไม่ผ่านแนวนอน (ดูเหมือนชี้เพื่อน)
- ระยะช็อตต้อง ≥ เวลาพูด — `node film.mjs` จะพิมพ์ `WARN ... runs past shot` ถ้าเกิน
- ข้อความ/ตัวหนังสือห้ามฝังในวิดีโอ — คำบรรยายเป็น .vtt, ป้ายคำและภาพถ่ายเป็น HTML ในเครื่องเล่น

### 3.6 ตรวจก่อนเรนเดอร์
```
cd output/car-hf/<เรื่อง>
node film.mjs                                  # สร้าง index.html timing.json turns.json, พิมพ์จุดหยุด
node preview.mjs index.html prev/a 3 9 14 ...  # ภาพนิ่งที่เวลาที่เลือก (PNG 960 กว้าง)
```
รวมภาพเป็นตาราง: `ffmpeg ... -filter_complex xstack=...` (ไม่มี PIL ในเครื่อง) แล้วดูทุกช็อต: ขอบดำ หัวขาด ตัวทับกัน ทิศหน้า มือชี้ หน้าสัตว์

### 3.7 เรนเดอร์ + เสียง + คำบรรยาย
```
HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 npx --no-install hyperframes render . -o render.mp4   # ~3.5 นาที
node mix.mjs render.mp4 master.mp4      # ใช้ gain คงที่จากการวัด ไม่ใช้ loudnorm แบบ dynamic (มันยกเสียงลมระหว่างประโยค)
node vtt.mjs <ชื่อ>.th.vtt
```
- แก้แค่เสียง/ระดับ SFX → รัน `node film.mjs` แล้ว `mix.mjs` ใหม่ ไม่ต้องเรนเดอร์ภาพซ้ำ (ถ้าเวลาไม่เปลี่ยน)
- ตรวจระดับเสียง: `ffmpeg -ss <วิ> -t <ยาว> -i master.mp4 -af volumedetect -f null -` · เสียงที่เป็นจุดสอน (เช่นเท้าอูฐ) ต้องดังกว่าเสียงลม
- ตรวจเฟรมจากวิดีโอจริง: `ffmpeg -i master.mp4 -vf "fps=1/3,scale=480:-1,tile=6x6" -frames:v 1 sheet.jpg`

### 3.8 ไฟล์สำหรับเว็บ
```
ffmpeg -i master.mp4 -vf scale=1280:720 -c:v libx264 -profile:v high -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k web/<ชื่อ>-720.mp4
ffmpeg -i master.mp4 -c:v libx264 -profile:v high -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k web/<ชื่อ>-1080.mp4
ffmpeg -ss 3.6 -i master.mp4 -frames:v 1 -vf scale=1280:720 -c:v libwebp -quality 80 web/<ชื่อ>-poster.webp
```
desert: 720p ≈ 12 MB, 1080p ≈ 27 MB

---

## 4. ต่อเข้าเว็บ

- ทำใน worktree แยก + `npm ci` จริง (node_modules แบบ junction ทำ Turbopack panic)
- `src/features/moral/film.ts` — type `Film`: `name`, `dir` (เช่น `"explore/film"`, ค่าเริ่มต้น `moral/film`), `duration`, `turns`, `words`, `captions`, `label`
  - `turns`: `{ at, resumeAt, photo }` = ภาพถ่ายสัตว์จริง หรือ `{ at, resumeAt, word }` = ให้เด็กพูดตาม · ค่ามาจาก `turns.json`
  - `filmPaths(film)` สร้าง path: poster/vtt จาก `public/<dir>/`, วิดีโอจาก R2 `https://media.littleummahworld.com/<dir>/`
- ข้อมูลของเกาะ: explore = `FILMS` ท้าย `src/features/explore/data.ts` · moral = `FILMS` ใน film.ts · หน้าเกาะส่ง `films={FILMS}` ให้ `MoralSection`
  - บทที่มีใน `FILMS` เปิด `FilmLesson` แทนแบบเดิม (`CARTOONS` เก็บไว้เป็นทางสำรอง)
- poster และ `.vtt` วางที่ `public/<dir>/` (commit) · วิดีโออยู่ R2 เท่านั้น (ไม่ commit mp4)
- **เครื่องเล่น `FilmLesson.tsx`**: ภาพถ่ายขึ้นทางซ้าย มี alt ไทย + เครดิตในกล่องคำบรรยาย · **นับถอยหลัง 6 วิ (`PHOTO_WAIT`) แล้วเล่นต่อเอง** ปุ่ม "ดูต่อ" กดได้ทันที (เจ้าของสั่ง 13 พ.ย.) · ย้อน 5 วิ = ยกเลิกการนับ
  - ภาพถ่ายสัตว์: เฉพาะ CC0/สาธารณสมบัติ ใช้ `photo("<id>")` จาก `PHOTOS` ใน explore/data.ts (มีเครดิตแล้ว) ห้ามฝังในวิดีโอ
- คำอาหรับใหม่ในข้อมูล (`word`/`words`) ต้องมี `evidence` หรือเพิ่มใน `MISSING_SOURCE` ของ `tests/evidence.test.mjs` พร้อมเหตุผล (desert ใช้เหตุผลเดียวกับคำซิกรุในฉากลา)
- `scripts/check-explore-browser.mjs` รู้จักบทที่เป็น film แล้ว (ตรวจ source ใต้ `<dir>` และมีภาพถ่าย ≥ 2 จุด)

**ทดสอบในเครื่องก่อนขึ้น R2:** คัดลอก mp4 ไป `public/<dir>/` และใส่ `.env.local` ของ worktree:
`NEXT_PUBLIC_FILM_VIDEO_BASE=/moral/film` (บรรทัดเดียว มีขึ้นบรรทัดใหม่ท้ายไฟล์) แล้ว `npx next dev -p 3300`
ทดสอบด้วย `output/car-desert/check-film.mjs` (จอ 390×844, 1366×900, 844×390: ภาพขึ้น, ปุ่ม ≥ 64px, นับถอยหลังแล้วเล่นต่อ, จุดพูดตาม)
Playwright: `PLAYWRIGHT_MODULE=file:///D:/Littleummah/output/kufic/.tools/node_modules/playwright-core/index.mjs` และ `PLAYWRIGHT_EXECUTABLE="C:/Program Files/Google/Chrome/Application/chrome.exe"`
หลัง `npm run build` ถ้ามี dev server เดิมค้าง ให้ฆ่า pid ที่ฟังพอร์ตก่อน (`netstat -ano | grep :3300`)

---

## 5. ขึ้น R2 (หลังเจ้าของอนุมัติเท่านั้น)
```
npx wrangler@4 r2 object put littleummah-media/<dir>/<ชื่อ>-720.mp4  --file web/<ชื่อ>-720.mp4  --content-type video/mp4 --cache-control "public, max-age=604800" --remote
npx wrangler@4 r2 object put littleummah-media/<dir>/<ชื่อ>-1080.mp4 --file web/<ชื่อ>-1080.mp4 --content-type video/mp4 --cache-control "public, max-age=604800" --remote
```
แก้วิดีโอเดิม = อัปโหลดทับชื่อเดิม (cache เครื่องผู้ใช้หมดใน 7 วัน ถ้าต้องเห็นทันทีให้ตั้งชื่อไฟล์ใหม่)

---

## 6. ก่อนส่งให้เจ้าของ (checklist)
- [ ] หน้าสัตว์ว่างทุกเฟรม (ซูมดู) · ไม่มีคน/ตัวหนังสือ/สัญลักษณ์ดนตรีในฉาก
- [ ] ไม่มีตัวละครบ่นเรื่องอากาศหรือพูดเชิงลบ · เนื้อหาศาสนาผ่าน Claude
- [ ] ทิศหน้า มือชี้ สายตา ตรงกับสิ่งที่ดูทุกช็อต · ไม่มีขอบดำ หัวขาด ฉากว่าง
- [ ] เสียงคำอาหรับผ่าน thai-voice-check · เสียงจุดสอนดังพอ
- [ ] `npm run build` · `npm test` · check-explore/moral-browser · check-film ผ่าน
- [ ] รายงานเจ้าของ: model Codex ที่ใช้, จำนวน imagegen, โควต้า Codex หลังงาน, รายการเสียงใหม่ให้ฟัง, การตัดสินใจที่ทำเอง, ที่ดู (`localhost:3300/learn/<เกาะ>` — ไฟล์ mp4 ดิบไม่มีจุดหยุด)
- [ ] commit/push/อัปโหลด R2 รอเจ้าของสั่ง (AGENTS ข้อ 5)
