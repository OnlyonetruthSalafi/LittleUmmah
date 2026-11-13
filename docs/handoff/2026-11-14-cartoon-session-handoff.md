# Handoff ให้ Claude — การ์ตูน 3 ชุด / ปิด session 14 พ.ย. 2026

## เริ่มอ่านตรงนี้

เจ้าของสั่งให้ Codex ทำการ์ตูนให้เสร็จแล้วส่ง handoff ให้ Claude จัดการรวมทีเดียว รวมงาน commit/push และฝากวิดีโอด้วย Wrangler ภายหลัง **การขอ handoff ครั้งนี้ยังไม่ใช่คำสั่งเผยแพร่** งานไม่ได้ commit/push/merge/upload ใน session นี้ เจ้าของจะตรวจฟังตอนท้าย ไม่ต้องหยุดรอฟังระหว่างผลิต

งานเขียน/ผลิตโดย Codex ใน session นี้ ไม่ได้เรียก Claude หรือ subagent มาตรวจ จึงอย่ารายงานว่าผ่านการตรวจของ Claude แล้ว ไม่สร้างภาพใหม่ด้วย imagegen (0 ครั้ง) ใช้ asset เดิมและ SVG props ที่ทำเอง

อ่าน `AGENTS.md` และ `docs/handoff/2026-11-13-cartoon-film-pipeline.md` ประกอบ กฎเจ้าของล่าสุดเหนือคู่มือเก่า: เจ้าของให้ Codex ปรับบทต่อเอง ไม่ต้องรอปรึกษา Claude; เก็บบท/เหตุการณ์และไฟล์ต้นฉบับไว้ครบ

**สำคัญ: output ไม่เข้า Git แต่มีไฟล์ผลิตจริงทั้งหมด ห้ามล้าง output หรือ remove worktree ก่อนสำรองไฟล์เหล่านี้** อย่ารัน `git add .` เพราะมี MP4 ทดสอบและ `.claude/` ของเจ้าของ

## สถานะ repository

- Root `D:/Littleummah`: main ที่ `5cc9897` ตอนตรวจครั้งล่าสุด ก่อนเขียนเอกสารนี้มีเพียง `.claude/` untracked ซึ่งไม่ได้แตะ
- Worktree งานแอป `D:/Littleummah/output/meet-friends-app`, branch `feature/meet-friends-film`, เริ่มจาก `5cc9897` ยังไม่มี commit
- Origin `https://github.com/OnlyonetruthSalafi/LittleUmmah.git`
- Worktree อื่นมีอยู่แล้ว (`Littleummah-carm`, `Littleummah-exfilm`, `Littleummah-nuri`, `Littleummah-quiz`) ไม่ได้แก้ ไม่ต้องลบ
- เอกสาร handoff นี้กับ pointer ใน AGENTS เป็นการแก้ root เพิ่มในตอนปิด session ให้นำไปรวมใน commit เอกสารที่เหมาะสม

## 1. ครูนูรีกับแสงอุ่นในสวน — ฉบับล่าสุด sun-v5

**ใช้ v5 เท่านั้น** ไม่เอา `car-hf/sun/` หรือ `car-sun/` เก่ามาทับ

- บท/Storyboard: `output/car-sun-v5/script.md`; ข้อมูลบท `story.mjs`
- รายงานละเอียดที่ต้องอ่าน: `output/car-sun-v5/REVIEW.md`
- ต้นทางแอนิเมชัน: `output/car-hf/sun-v5/film.mjs`, `engine.mjs`
- ชุดฮาดีแก้ทิศ: `output/car-hf/sun-v5/assets/kits/hadi-right-v2/` หัว อก ล้อหันตรงกัน ใช้ซ้ำได้ ห้ามกลับไปใช้วิธีเลื่อนหน้าทับตัว
- ส่งเว็บ: `output/car-hf/sun-v5/web/sun-720.mp4`, `sun-1080.mp4`, `sun-poster.webp`, `sun.th.vtt`
- ความยาวจริง 140.466667 วินาที, 13 ช็อต, 25 ช่วงบทพูด
- จุดหยุดจาก `turns.json`: at 134.327492, resumeAt 138.327492, kind `say:subhanallah` (แปลงเป็น word ตาม Film type เมื่อต่อเข้าเว็บ)
- ตัวอย่าง `http://localhost:3310/car-hf/sun-v5/watch.html`
- คงสาระเดิมครบ ปรับคำพูดให้เด็กเข้าใจและเหมาะเว็บเด็กมุสลิม ครูแทนตัวว่าครู ฮาดีใช้เรา ไม่ใช้ครับ/ค่ะ
- เก็บข้อเตือนห้ามมองดวงอาทิตย์และคำชี้แจงภาพต้นไม้เร่งเวลา แยกคำขอบคุณอัลลอฮ์ออกจากความหมายซุบฮานัลลอฮ์
- ไม่เพิ่ม SFX ใหม่ ไม่มีดนตรี ใช้ภาพ/เสียงตัวละครเดิมและเก็บทุกเทค
- ตรวจภาพทุกช็อต/ทิศฮาดี, H264+AAC, faststart, -16.3 LUFS, ไม่มีช่วงภาพดำ และเครื่องเล่น 3 จอผ่าน ดู `qa/media-report.json`, `qa/browser-report.json`, `qa/final-film-sheet.jpg`
- Thai ASR ไม่ใช่ทุกคลิปผ่าน; Arabic CTC 6 จุดได้ 100% ตาม REVIEW เป็นเพียงเครื่องมือช่วย ไม่แทนการฟังโดยมนุษย์
- **ยังไม่ได้ต่อข้อมูลตอนนี้เข้าแอป Next** ให้ Claude ตรวจตำแหน่งการ์ดที่เหมาะสมจากโปรเจกต์ อย่าเดา slug หรือทับการ์ดเรื่องอื่น

## 2. การ์ดรู้จักเพื่อนใหม่ — การ์ตูนพร้อมแอปทดสอบ

ชื่อเรื่อง “รู้จักเพื่อนใหม่ — มาช่วยกันทำมุมอ่านหนังสือ” 152.600 วินาที (ไฟล์จริง), 16 ช็อต, 26 คลิปเสียง ตัวละครนูรี ฮาดี ซาบิร รอสซาม ฟาฮีม และซาฟี

คอนเซปต์: ร่วมกันทำมุมอ่านหนังสือ แนะนำชื่อและสิ่งที่ชอบ ถามชื่ออย่างสุภาพ ขอช่วยวางที่คั่นหนังสือ ทักสลามและชวนเด็กแนะนำตัว เนื้อหาทั่วไป ไม่เพิ่มคำอ้างศาสนาใหม่ ฐานการเผยแผ่สลาม Muslim 54 ตรวจ Shamela แล้ว ใส่ comment ใน source

- บท/Storyboard `output/car-meet-friends/script.md`; ข้อมูล `story.mjs`
- แอนิเมชัน `output/car-hf/meet-friends/film.mjs`, `engine.mjs`, props SVG `prepare-props.mjs`
- สร้าง media `build-media.mjs`; ใช้ `timing.json` และ `turns.json`
- ส่งเว็บ `output/car-hf/meet-friends/web/meet-friends-720.mp4`, `meet-friends-1080.mp4`, `meet-friends-poster.webp`, `meet-friends.th.vtt`
- ตัวอย่าง `http://localhost:3310/car-hf/meet-friends/watch.html`
- ฟัง SFX แยก `http://localhost:3310/car-meet-friends/sound-review.html`
- มี 2 ช่วงตอบ: salam at 123.545856 → resume 127.545856; แนะนำตัว at 136.693816 → resume 140.693816
- ใช้ฮาดีชุดแก้ทิศเดิม ฉากกลุ่มแก้ของบังหน้าแล้วทุกตัวมองเห็นหน้า
- SFX original ของโปรเจกต์ 7 แบบ 17 cues: wheels, tracks, wood, brush, page, hover, click; ไม่มีดนตรี
- ต้นทาง/พรอมป์ต์ `output/car-meet-friends/sfx-plan.mjs`, `sfx-manifest.json`, `sfx/source/`; ไฟล์ใช้จริง `sfx/*.mp3` mono ≤20KB
- ตรวจบัญชี ElevenLabs Creator active ก่อนสร้าง: `license-account-check.json` ไม่เก็บ/พิมพ์ API key ลงรายงาน
- ภาพ/เสียงแยกมิกซ์, SFX เบาลงขณะพูด, ทั้งเรื่อง -16.3 LUFS; ผล `qa/media-report.json`, `qa/audio-mix.json`

### เสียงที่ต้องรู้ก่อน review

- เก็บเทคเดิมไว้; r02 เลือก take3 “ดอกไม้ของเราเสร็จแล้ว!”; f02 เลือก take2 “เธอชื่ออะไร เรามาเป็นเพื่อนกันนะ” อ่านได้ชัดขึ้นจาก ASR
- ใช้สลามมาตรฐานที่เจ้าของเคยเลือกจาก `output/car-salam2/voice-fixed/_reference-salam.wav` ไม่เปลี่ยนเป็นเทคสังเคราะห์ใหม่
- Arabic CTC: g01 มาตรฐานได้ 64% (diagnostic cuts 73% จึงไม่เปลี่ยน); g02 ตอบสลาม 100%, n06 สอนสลาม 91%, n07 ตอบ 100% — อย่ารายงานว่าอาหรับทุกคลิปผ่านเกณฑ์
- n06 มีคำชวนพูดตามและกล่าวสลามซ้ำ บทและ captions ปรับให้ตรงเสียงแล้ว
- Thai ASR รายงาน `voice-check-final.md` ยังมี 5 คลิปเกินเกณฑ์ ส่วนใหญ่คำอาหรับและคำพูดไม่เป็นทางการของ s02 เจ้าของยังต้องฟังเอง ไม่ได้อ้างว่าผู้ผลิตฟังรับรองแล้ว

### แอปทดสอบพร้อมแล้ว

Worktree `output/meet-friends-app` มีการแก้:

1. `src/features/moral/film.ts`: ลงทะเบียน FILMS["meet-friends"], turns/captions/label และเพิ่ม optional `Film.videoBase` เพื่อทดสอบเฉพาะเรื่องโดยไม่เปลี่ยนวิดีโอเรื่องอื่น
2. `docs/films/meet-friends-script.md` และ `docs/assets/meet-friends-media.json`
3. `public/audio/sfx/meet-friends/` 7 MP3
4. `public/moral/film/meet-friends-poster.webp`, `meet-friends.th.vtt`
5. MP4 2 ไฟล์วางใน public เฉพาะทดสอบ **ไม่ commit**
6. `.env.local` มีเพียง `NEXT_PUBLIC_MEET_FRIENDS_VIDEO_BASE=/moral/film` (ignored) เอาค่า override ออกก่อน build เพื่อทดสอบ R2 จริง

ต้นฉบับ CARTOONS/ภาพการ์ดเดิมอยู่ครบเป็น fallback; วิดีโอเรื่องเก่าใช้ R2 ตามเดิม

ตรวจผ่านแล้ว: Next production build, lint, tests 185/185, diff whitespace; ตรวจผ่านการ์ดจริงและ preview ที่ 390×844, 1366×900, 844×390 ทั้งเล่น/หยุด/captions/2 turns/ดูต่อ/เริ่มใหม่/ปุ่ม≥64px/ไม่ล้น/Escape ปิดคืน focus; ผล `output/car-hf/meet-friends/qa/app-report.json`, `preview-report.json`, `media-report.json`

แอปทดสอบ `http://localhost:3305/learn/moral#kids` กด “รู้จักเพื่อนใหม่” เป็น production Next server จาก worktree นี้

## 3. กล่าวสลามเมื่อพบกัน — เปลี่ยนเสียงใหม่ salam-audio-v2

เจ้าของแจ้งเสียงเคลื่อนที่ครูนูรีดังรบกวนและสั่ง **เปลี่ยนเป็นเสียงอื่นเลย ไม่ใช่ลดเสียงเดิมอย่างเดียว** งานนี้ทำเสร็จหลังงานข้อ 2

- รายงาน/สร้างซ้ำ `output/car-hf/salam-audio-v2/README.md`, `build.mjs`
- ไฟล์ล่าสุด `output/car-hf/salam-audio-v2/web/salam-720.mp4`, `salam-1080.mp4`
- ภาพปก/VTT คัดจาก public เดิมมาเพื่อ preview ไม่ได้แก้เนื้อหา
- ตัวอย่าง `http://localhost:3310/car-hf/salam-audio-v2/watch.html` ครูนูรีเริ่มเคลื่อนที่วินาที 5.2
- เลิกใช้ tread, brake, boing, whoosh เดิมทั้งหมด เปลี่ยนเป็น tracks/click/hover จากชุด original Foley ในข้อ 2; tracks ไม่ใช่ไฟล์ tread เดิม
- tracks 5.2–10.8s และ 14.1–14.98s; click 11.78–12.43s; hover 22.85–23.45s
- Fade เข้า/ออก, lowpass 3.8kHz, ลดเอฟเฟกต์ใต้เสียงพูด ไม่มีเสียงเบรกแหลมเดิม
- น้ำพุคง envelope ที่เคยปรับไว้ ไม่ยกระดับเสียงพื้นหลังระหว่างประโยค
- ภาพ บท เสียงพากย์ เวลา 92.3s และจุดหยุดเดิม at86.5 → resume88.4 คงเดิม; copy video stream ไม่ encode ภาพซ้ำ เก็บต้นฉบับ salam2 ครบ
- ผลมิกซ์ -16.3 LUFS `qa/audio-report.json`; เครื่องเล่น 3 จอผ่าน `qa/preview-report.json`
- **ยังไม่ได้แทนที่วิดีโอ R2 หรือการ์ดเว็บจริง** แอปจริงยังใช้ salam เวอร์ชันเดิม

## เปิดตัวอย่างใหม่เมื่อ server หยุด

Session นี้มี server output ที่พอร์ต 3310 และ Next ที่ 3305 ไม่รับประกันว่าค้างหลังปิด session

เปิด server output จาก `D:/Littleummah` ด้วย Python ที่มีในเครื่อง:

```powershell
python -m http.server 3310 --bind 127.0.0.1 --directory D:/Littleummah/output
```

ถ้า python ไม่อยู่ PATH ใช้ตัวที่ติดตั้งใน `D:/tools/thai-asr/` หรือ static server ที่มีในโปรเจกต์ ตรวจ executable ก่อน ไม่ต้องติดตั้งแพ็กเกจใหม่

เปิดแอปจาก `D:/Littleummah/output/meet-friends-app` (มี npm ci จริงแล้ว ห้ามใช้ node_modules junction):

```powershell
npm run start -- -p 3305
```

ถ้าปรับ env หรือ source ให้ build ใหม่ก่อน start; ตรวจว่า server เดิมครองพอร์ตหรือไม่ก่อนเปิดซ้ำ ไม่ kill process อื่นแบบเหมา

## ขั้นตอน Claude รับต่อ / เผยแพร่ภายหลัง

1. ตรวจ git/worktree และไฟล์ข้างบนก่อน อย่ากลับไปผลิตจาก v เก่า อ่าน REVIEW ของ sun และตรวจบท/เสียงให้เจ้าของตามที่จำเป็น
2. ดูว่าการอนุมัติล่าสุดของเจ้าของครอบคลุม commit/push/upload หรือยัง ถ้ายังให้ส่งผล review ที่พร้อมตรวจได้ก่อน ขออนุมัติเป็นขั้นสุดท้ายตาม AGENTS §5 (handoff นี้ไม่ได้อนุมัติแทน)
3. รวมงานบน branch แยก เก็บโค้ดที่ทดสอบแล้วของ meet-friends; ต่อ sun กับการ์ดที่ถูกต้องหากเจ้าของต้องการเผยแพร่พร้อมกัน; salam เปลี่ยนเฉพาะวิดีโอ ไม่ต้องแก้บทหรือ turns
4. อัปโหลด MP4 ไป R2 ก่อนเปิดใช้ในเว็บ ตรวจ domain จริง ทั้ง status/content type/content length และ Range/seek
5. เอา local-video override ออกจาก env ทดสอบ แล้ว `npm run verify` + browser จุดตอบและ captions บนแหล่งวิดีโอจริง
6. Stage เจาะจงเฉพาะ source/docs/poster/VTT/เสียงที่อนุมัติ ไม่เอา MP4, output, .env.local หรือ .claude/ เข้า Git; review diff แล้ว commit/push feature branch ตรวจ CI ก่อนรวม main ตามคำสั่งเจ้าของ
7. Post-deploy smoke workflow ยังปิดการทำงานอัตโนมัติอยู่ ต้องตรวจหน้าเว็บจริงเอง ไม่อ้างว่า deploy ผ่านจาก build ในเครื่องอย่างเดียว

### Wrangler ที่ตรวจจากคู่มือแล้ว (ยังไม่เคยรัน upload ใน session นี้)

bucket `littleummah-media`; public media domain `https://media.littleummahworld.com`; อย่าใช้ `wrangler deploy` เพื่อฝาก MP4 ให้ใช้ `r2 object put --remote`

ตัวอย่างรันจาก root:

```powershell
npx wrangler@4 r2 object put littleummah-media/moral/film/meet-friends-720.mp4 --file output/car-hf/meet-friends/web/meet-friends-720.mp4 --content-type video/mp4 --cache-control "public, max-age=604800" --remote
npx wrangler@4 r2 object put littleummah-media/moral/film/meet-friends-1080.mp4 --file output/car-hf/meet-friends/web/meet-friends-1080.mp4 --content-type video/mp4 --cache-control "public, max-age=604800" --remote
```

สำหรับ salam ใช้ต้นทาง **salam-audio-v2/web/** อัปโหลดชื่อ `moral/film/salam-720.mp4` และ `salam-1080.mp4` ตามแนวทางเดิม หรือใช้ชื่อ version ใหม่พร้อมเปลี่ยน metadata หากต้องการเลี่ยง cache ทันที ห้ามอัปโหลด salam เก่าจาก car-salam2/web ซ้ำ ชื่อเดิม cache ได้ 7 วัน

สำหรับ sun ต้องตกลง dir/name ตอนต่อกับการ์ดให้ตรงกันก่อนอัปโหลด ไม่เดาว่าเป็น moral หรือ explore โดยไม่มีการตรวจ

ภาพปก/VTT อยู่ใน public บนเว็บ (commit); MP4 อยู่ R2 (ไม่ commit) ขนาดเล็กของ SFX ไม่ต้องแยกขึ้น R2 เพื่อเล่นหนัง เพราะมิกซ์อยู่ในวิดีโอแล้ว

ยังไม่ได้ตรวจสถานะล็อกอิน Wrangler หรือสิทธิ์ GitHub/Vercel ใน session นี้ `npx` ใช้ได้ แต่ไม่มี wrangler global การ push ทำให้ CI รัน; อย่าสรุปว่าตั้ง Vercel deployment แล้วโดยยังไม่ตรวจบัญชี/โปรเจกต์

อ้างอิงคำสั่ง: https://developers.cloudflare.com/workers/wrangler/commands/r2/

## ข้อจำกัดการทำซ้ำใน Windows

- ffmpeg ไม่อยู่ PATH ของ shell ใน session นี้ งาน salam ใช้ `output/backup-2026-11-11/faith-output/faith-1/tools/node_modules/ffmpeg-static/ffmpeg.exe` ใน build.mjs; ตรวจ path ก่อนรันเครื่องอื่น
- สคริปต์ชุดอื่นอาจเรียก `ffmpeg` ตรง ๆ ต้องเติม PATH/ตั้ง FFMPEG ตามสคริปต์ ไม่จำเป็นต้องเรนเดอร์ภาพใหม่ถ้าแก้เฉพาะเสียงและเวลาไม่เปลี่ยน
- Playwright ที่ใช้: `output/kufic/.tools/node_modules/playwright-core/index.mjs`; Chrome `C:/Program Files/Google/Chrome/Application/chrome.exe`
- Sandbox Windows เคยบล็อก Node/FFmpeg เขียนไฟล์แม้อยู่ workspace; รันแบบอนุมัติที่จำกัดงานแล้วผ่าน ไม่ใช่ไฟล์สื่อเสีย
- ไม่มีการยืนยันด้วยการฟังของเจ้าของในช่วงปิด session นี้ อย่าใส่สถานะ owner-approved ให้เสียงโดยอัตโนมัติ
