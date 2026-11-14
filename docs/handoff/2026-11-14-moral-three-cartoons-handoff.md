# Handoff — การ์ตูนเกาะมารยาท 3 การ์ด (14 พ.ย. 2026)

## ล่าสุด — เจ้าของอนุมัติฉากหยิบ ถือ บิดตัว วาง และสั่งขึ้นเว็บจริง

เจ้าของตรวจคลิปสั้น 22 วินาทีแล้วตอบว่า “โอเครครับผ่าน แก้ไข แล้วขึ้นเว็บจริงได้ครับ” จึงยกเลิกการรออนุมัติของฉบับนี้ และอนุญาตให้รวมคลิปเต็ม อัปโหลด R2 และ deploy Vercel ได้แล้ว

ฉบับเต็มช่วยเพื่อนยาว 137.440001s ใช้ชื่อไฟล์ใหม่ **help-friend-hold-turn-v2** ทั้ง MP4 720p/1080p, poster และ VTT เพื่อเลี่ยง cache ของฉบับเก่า ภาพการ์ดเปลี่ยนเป็น **card-help-friend-film-v3.webp** อีกสองเรื่องคงเดิม

การแสดงใหม่: ซาฟีหยิบขึ้นมาถือให้เห็น ค้าง 0.5 วินาที บิดตัวไปทางตู้ แล้ววางและปล่อยมือ ฟาฮีมรับเล่มสีเขียว ถือและหันไปวางบนชั้น หนังสือที่ถืออยู่เป็นส่วนหนึ่งของโครงตัวละครจึงตามการบิดตัว เส้นทางมือช่วงใหม่นี้คลาดเคลื่อนไม่เกิน 0.6px; ตรวจการบังใบหน้า 4,067 ตัวอย่างผ่าน ใช้ปาก mouth-wide เดิมที่สะอาดแทน mouth-open ของซาฟีซึ่งมีเศษแสงตาติดภาพเก่า

ต้นทางใหม่อยู่ output/moral-three/pickup-hold-turn.mjs, stage-help.mjs, film-builder.mjs และ engine.mjs ของ help-friend (รองรับ book attachment) ภาพ/คลิปก่อนแก้อยู่ output/car-hf/help-friend/versions/before-hold-turn/ ไม่มีเสียงพากย์หรือ Foley ใหม่ ไม่มีดนตรี

หลักฐาน: qa/hold-turn-review.json และ hold-turn-browser-report.json สำหรับคลิปที่เจ้าของอนุมัติ; qa/media-report.json, physical-review.json, r2-upload.json สำหรับคลิปเต็ม; รายงาน build/แอป/เว็บจริงชุดล่าสุดอยู่ output/moral-three/ ส่วนหลักฐาน release 41bb334 รอบก่อนเก็บใน output/moral-three/versions/41bb334-release/

ยังใช้ Vercel CLI บัญชีเดิมเผยแพร่จาก git archive ของ commit ที่ตรวจแล้ว เนื่องจากไม่มี GitHub credential ในเซสชันนี้ จึงต้องซิงก์ local main ขึ้น GitHub ภายหลัง รายงาน deploy-result.json และ release.json ระบุ SHA ล่าสุด

เจ้าของสั่งให้ตรวจและแก้การทับซ้อน/ความไม่สมจริงของอีกสองเรื่อง ผูกภาพการ์ดให้ตรงกับการ์ตูน และนำขึ้นเว็บจริงเพื่อมาตรวจตอนตื่น คำสั่งล่าสุดนี้อนุญาตให้ commit, push และ upload R2 สำหรับงานชุดนี้แล้ว แทนสถานะรอตรวจใน handoff รุ่นก่อน

เว็บสำหรับตรวจ: https://www.littleummahworld.com/learn/moral#kids

**ช่องทางเผยแพร่:** ใช้ Vercel CLI ด้วยบัญชีเดิมในโปรเจกต์ little_ummah_project โดยตรง เพราะ Git Credential Manager ของเซสชันนี้ไม่มีข้อมูลรับรอง GitHub (ตรวจแบบไม่โต้ตอบแล้ว) การ push จึงยังไม่สำเร็จ หยุดกระบวนการที่ค้างรอ login แล้ว วิดีโอ R2 อัปโหลดครบ บันทึกโค้ดทั้งหมดเป็น commit ในเครื่อง

**ต้องซิงก์ GitHub ภายหลัง:** remote main ยังเป็น c84b4e6 ก่อนชุดนี้ ส่วน local main/feature เก็บ commit การ์ตูนไว้ เมื่อเข้าสู่ GitHub ได้ ให้ push main ตามปกติ ห้าม force push ระวังการ deploy จาก remote main รุ่นเก่าจะทับเว็บฉบับนี้

ทำโดย Codex เซสชันหลัก ไม่ได้เรียก Claude หรือ subagent มาตรวจ ไม่มี imagegen ใหม่ ใช้หุ่นยนต์เดิมและ SVG props ที่ทำเอง เสียงพูดเดิม 59 คลิปผ่านตัวกรองหุ่นยนต์ ไม่มีดนตรี ใช้ Foley เดิมที่มีอยู่ ไม่สร้างเสียงประกอบใหม่ การฟังตรวจโดยเจ้าของยังเป็นการตรวจรับงานครั้งถัดไป ไม่อ้างว่าเจ้าของฟังครบแล้ว

## ชุดเผยแพร่

| การ์ด | ตัวละคร | ความยาว | ภาพการ์ด |
|---|---|---:|---|
| ขอโทษเมื่อทำผิด (say-sorry) | ซาบิร รอสซาม ครูนูรี | 132.020s | card-say-sorry-film-v3.webp |
| ช่วยเพื่อนที่ต้องการความช่วยเหลือ (help-friend) | ฟาฮีม (kit qalam) ซาฟี ครูนูรี | 137.440s | card-help-friend-film-v3.webp |
| รอคิว (wait-turn) | ฮาดี ซาฟี รอสซาม ครูนูรี | 137.463s | card-wait-turn-film-v2.webp |

### say-sorry

ซาบิรอยู่หลังโต๊ะตลอดช่วงต่อหอคอย โต๊ะบังเฉพาะลำตัวส่วนล่าง ศีรษะและหน้าโต๊ะไม่ทับกัน รอสซามยังไม่เข้าฉากแรก เดินเข้าจากขวาภายหลัง ลำตัวไม่ผ่านหอคอย ฐานบล็อกอยู่บนโต๊ะและรอยต่อสูงขั้นละ 56px ตรงกัน

### help-friend

หนังสือตกจากกองที่มองเห็นในกล่อง ซาฟีหยิบทีละเล่ม แขนเคลื่อนต่อเนื่องตามจุดสัมผัส ไม่สลับท่าศอกฉับพลันและไม่ผ่านหน้า หนังสือบนพื้นอยู่หลังตัวละครเมื่ออยู่ไกลกว่า ชั้นหนังสือมีผิวรองรับตรงตำแหน่งวางจริง ส่งเล่มสีเขียวให้ฟาฮีมที่ตำแหน่งเดียวกัน ครูนูรียกกล่อง เคลื่อนย้าย แล้ววางลง กล่องคงอยู่ตำแหน่งใหม่ในฉากถัดไป

### wait-turn

ลูกบอลสัมผัสแนวรางด้วยรัศมีจริง หมุนตามระยะกลิ้ง ลงถาดและคงอยู่ในถาดระหว่างรอ ครูนูรีหยิบลูกเดิมไปวางบนจุดเริ่มก่อนเพื่อนคนต่อไป มือผู้เล่นแตะจุดปล่อยจริง ครูออกทางขวาเพื่อไม่เดินผ่านลูกบอลหรือเพื่อนที่ออกทางซ้าย

## ตำแหน่งไฟล์และการตรวจ

- โค้ดแอป: worktree D:/Littleummah/output/moral-three-app, branch feature/moral-three-cartoons เริ่มจาก c84b4e6
- จุดเชื่อม: src/features/moral/data.ts (ภาพการ์ด), film.ts (วิดีโอและจุดหยุดฝึกพูด), components/FilmLesson.tsx (คำฝึกพูดไทย/อังกฤษ) ใช้แหล่งวิดีโอ R2 เดิม ไม่ใส่ localhost override ใน production
- MP4 720p/1080p ทั้ง 6 ไฟล์อยู่ที่ https://media.littleummahworld.com/moral/film/ ตามชื่อการ์ด เช่น say-sorry-720.mp4; poster/VTT อยู่ public/moral/film บน Vercel
- บทและรายละเอียดภาพ: docs/films/*-script.md; cast/เวลา/จุดหยุด/ขนาดและ SHA-256: docs/assets/*-media.json
- ต้นฉบับและเสียงทุกเทค: output/car-<id>/; วิดีโอและฉาก: output/car-hf/<id>/; ไฟล์จัดฉากร่วม: output/moral-three/film-builder.mjs, stage-sorry.mjs, stage-help.mjs, stage-others.mjs, queue-physics.mjs
- เก็บเวอร์ชันก่อนแก้ใน output/car-hf/<id>/versions/ ห้ามล้าง output หรือเอาไฟล์ render-scene-fixed.mp4 เก่ามาทับ render.mp4 ฉบับสุดท้าย media.mjs เลือก render.mp4 เท่านั้น
- npm run verify ผ่าน typecheck, lint, 185 tests, production build ผล output/moral-three/verify-app-result.json
- ตรวจการ์ดและเล่นจาก R2 บนแอป 3 ขนาดจอ พร้อมคำฝึกพูดภาษาอังกฤษและ reduced motion รวม 12 กรณี: output/moral-three/app-report.json
- ตรวจสื่อจริง H264/AAC, faststart, ไม่พบช่วงดำ, ระดับเสียงประมาณ -16 LUFS: output/car-hf/<id>/qa/media-report.json และภาพ final-film-sheet.jpg
- ขอโทษ: qa/staging-fix-report.json ตรวจลำดับหน้า/หลังโต๊ะ ฐานหอคอย และตัวละครไม่ชนหอคอย
- อีกสองเรื่อง: qa/physical-review.json ตรวจตลอดเวลา รวม 8,204 ตัวอย่าง ไม่พบใบหน้าถูกสิ่งของบังหรือซ้อนใบหน้า ตัวตรวจใช้ alpha ของภาพ SVG เพื่อไม่ตีพื้นที่โปร่งใสของรางเป็นวัตถุทึบ
- ช่วยเพื่อน: เส้นทางมือหยิบของคลาดเคลื่อนไม่เกิน 4.5px ระหว่างขนย้าย เลือกมุมแขนต่อเนื่องเพื่อเลี่ยงการสลับศอกสองคำตอบของ IK
- รอคิว: qa/ramp-geometry.json บันทึกแนวราง รัศมี และจุดสัมผัสลูกบอล
- อัปโหลด R2 และตรวจ HTTP 206 พร้อมเทียบ 1,024 ไบต์แรกกับต้นฉบับทุกไฟล์: qa/r2-upload.json
- ชุดนี้ผ่าน npm run verify ในเครื่องแล้ว แต่ยังไม่มี GitHub CI ของ commit นี้เพราะยัง push ไม่ได้ อย่าใช้ github-status.json ของ main เก่ามาอ้างว่าชุดนี้ผ่าน CI บน GitHub
- ผล Vercel production: output/moral-three/deploy-result.json; ผลตรวจโดเมนจริง: output/moral-three/live-app-report.json และ release.json

## วิธีเปิดและสร้างใหม่

ตัวอย่าง local ที่เก็บไว้: http://localhost:3310/moral-three/index.html และ http://localhost:3306/learn/moral#kids (production build ใช้ R2)

รันจาก root ผ่าน output/moral-three/run.ps1 ด้วย Task film, media, verify และ Story say-sorry/help-friend/wait-turn; เรนเดอร์ใช้ node output/moral-three/render.mjs <id>; integrate ใช้ node output/moral-three/integrate.mjs <id> หลังสร้าง media เสร็จ อย่ารันสร้างเสียงซ้ำโดยไม่จำเป็น

Root main เดิมมีเพียงการแก้ AGENTS และ handoff ของงานนี้ ไม่แตะ .claude/ หรือ worktree อื่น การเผยแพร่ Vercel ใช้ snapshot จาก git archive ของ commit นี้เท่านั้น ไม่อัปโหลด MP4/PNG ต้นฉบับหรือไฟล์ .env ใน worktree การซิงก์ GitHub ภายหลังใช้ fast-forward ไม่ force push ตรวจ main ล่าสุดก่อน pushทุกครั้ง
