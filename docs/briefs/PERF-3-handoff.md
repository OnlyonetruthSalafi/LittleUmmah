# PERF-3: Handoff ความเร็วมือถือ — ไล่ LCP จาก 2.9–3.8 วิ ให้ถึง ≤ 2.5 วิ
**เขียน 12 พ.ย. 2026 โดย Fable · ส่งต่อให้ Opus (วางแผน/ตรวจรับ/รายงาน) และ Codex (ลงมือ/วัด/review)**
**ฐาน: main `0fd282e` · worktree ใหม่ `D:/Littleummah-perf3` (branch `feature/perf-3`) · port 3170**

อ่านก่อน: `AGENTS.md` ข้อ 1.5, 2, 2.1, 3, 4, 5 · `docs/briefs/P1-5-perf-round2.md` (กติกาเดิมยังใช้) · บันทึกนี้ทั้งไฟล์
รายงานและข้อความถึงเจ้าของโปรเจกต์เป็น **ภาษาไทยเท่านั้น** · ห้าม commit/push ก่อนเจ้าของโปรเจกต์อนุมัติ

## 1. สถานะตอนส่งต่อ

มาตรฐาน: Lighthouse มือถือ (Slow 4G, Moto G Power, CPU×4) **LCP ≤ 2.5 วิ, CLS 0** วัดบน production
ทำมาแล้ว 3 รอบ: `fdc91aa` (P1-4), `b4e777f` (P1-5), `0fd282e` (เกาะเกม) ผล production ล่าสุด (ค่ากลาง 3 รอบ, 12 พ.ย.):

| หน้า | LCP | คะแนน | ภาพ | JS | CSS | ฟอนต์ |
|---|---|---|---|---|---|---|
| `/` (วัด 11 พ.ย.) | 2.9 วิ | 95 | – | – | – | – |
| `/games/memory` | 2.88 วิ | 95 | 52 KB | 244 KB | 52 KB | 87 KB |
| `/games/shape-match` | 3.33 วิ | 92 | 142 KB | 244 KB | 52 KB | 88 KB |
| `/games/puzzle` | 3.48 วิ | 91 | 122 KB | 245 KB | 52 KB | 87 KB |
| `/games` | 3.56 วิ | 90 | 374 KB | 222 KB | 55 KB | 180 KB |
| `/games/light-maze` | 3.71 วิ | 89 | 205 KB | 244 KB | 52 KB | 87 KB |
| `/games/coin-box` | 3.78 วิ | 89 | 87 KB | 244 KB | 52 KB | 87 KB |
| `/learn/stories` (วัด 11 พ.ย.) | 3.8 วิ | – | – | – | – | – |

ผลดิบ: `output/perf-games/prod-before`, `prod-after` (โฟลเดอร์ `output/` ถูก ignore อยู่ใน checkout หลัก `D:/Littleummah` เท่านั้น)

## 2. ทำไมยังไม่ถึง 2.5 วิ (ต้องเข้าใจก่อนลงมือ)

Lighthouse แบบ simulated (Lantern) **นับทุก request ที่โหลดจบก่อน LCP ที่สังเกตได้** ไม่ใช่เฉพาะภาพ LCP
หน้า memory มีภาพแค่ 52 KB แล้วยังได้ 2.88 วิ แปลว่าส่วนคงที่ของทุกหน้ากินเวลาไปราว 2.8–2.9 วิ:

- **JS 244 KB ใน 18 chunk** ทุกหน้า ก้อนใหญ่คือ `0obbn5cs…` 73 KB, `1l5fm5…` 50 KB, `32vmgsee…` 24 KB (ชื่อ hash เปลี่ยนทุก build)
- **ฟอนต์ preload 3 ไฟล์ 87 KB** (Baloo 2 + Noto Sans Thai Looped 2 ไฟล์)
- **CSS 52 KB ใน 10–12 ไฟล์** render-blocking
- **prefetch ช่วงแรก**: RSC ของ `/games`, `/`, `/parents` พร้อม CSS/JS ของหน้านั้น เริ่มที่ราว 400–700 ms
- **`/Character/welcome.webp` 43 KB + favicon 9 KB ทุกหน้า** — มาจาก `icons` ใน `src/app/manifest.ts`
- **เสียงแนะนำ**: `howto-coin-box.mp3` 93 KB เริ่มโหลดที่ 337 ms ก่อน LCP

ดังนั้นงานภาพอย่างเดียวพาได้แค่ถึง ~2.9 วิ จะต่ำกว่านั้นต้องลดส่วนคงที่

## 3. งานที่เหลือ เรียงตามความคุ้ม

### ขั้น A — งานเล็ก เสี่ยงต่ำ (Codex `gpt-6.1-sol`)
แต่ละข้อต้องวัดก่อน/หลังแยกกัน ถ้าข้อไหนไม่ช่วยให้ถอนออก

1. **ไอคอน manifest**: ทำ derivative ขนาดเล็ก (192 และ 512 px) ผ่าน `scripts/optimize-images.mjs` แทนการชี้ `welcome.webp` 400×400 43 KB
2. **หน้า coin-box และเกมที่ใช้ `VoiceIntro`**: `<Thumbnail large />` ที่ `VoiceIntro.tsx:90` ยังไม่ส่ง `sizes` จึงได้ไฟล์ w=640 (42 KB) วัดความกว้างจริงใน DOM ทุก breakpoint แล้วใส่ `sizes` ให้ตรง (วิธีเดียวกับ `GameIntro.tsx:29`)
3. **เสียง howto**: อย่าเริ่มโหลดพร้อมภาพ LCP ให้เตรียมหลังฉากแรกวาดเสร็จ (`afterScenePaint`) หรือเมื่อจะเล่น — ปุ่มฟังซ้ำและจังหวะเสียงต้องเหมือนเดิม
4. **light-maze**: `backdrop-neon.webp` 100 KB เป็น LCP จอตั้งเห็นแค่แถบกลาง ทำ centre-crop derivative แบบเดียวกับ `game-hub-bg` (ขั้น `CROPS` ใน `optimize-images.mjs`, media query ตาม aspect-ratio) ต้องทำครบทุกธีมของ backdrop และ preload ใน `GameTutorial.tsx` ต้องชี้ไฟล์ที่ตรงกับจอ
5. **`RotateGate.tsx:36`**: ภาพ phone-portrait/landscape โหลดทั้งที่ยังไม่แสดง (20 KB × 2) ให้โหลดเมื่อ gate จะแสดงจริง
6. **`/games`**: ฟอนต์อาหรับ 92 KB โหลดที่ 678 ms หาว่าตัวอักษรไหนเรียก ถ้าอยู่นอกจอแรกให้ไม่แย่งเน็ตช่วง LCP (ห้ามเปลี่ยนฟอนต์ ห้ามทำให้ตัวอาหรับกระพริบเปลี่ยนรูปตอนเลื่อนถึง); ภาพ `islands/games.webp` ได้ w=640 77 KB ตรวจว่า `sizes` ตรง DOM จริงหรือยัง
7. **prefetch**: ลิงก์ Header/Footer (`/`, `/parents`, `/games`) prefetch ทันทีที่โหลด เลื่อนไปหลังฉากแรกนิ่งหรือเมื่อใกล้กด เฉพาะจุด ไม่ปิดทั้งเว็บ (ดูข้อ 6 ของ P1-5 ว่าเคยทำอะไรไปแล้วใน `LocaleProvider`)

คาดผลขั้น A: หน้าเกมทั้งหมดลงมาใกล้ 2.9–3.1 วิ (ประมาณการ ยังไม่ได้วัด)

### ขั้น B — ลดส่วนคงที่ (Codex `gpt-6-astra` · Opus ต้องอนุมัติแผนก่อนลงมือ)
เริ่มด้วย **รายงานอย่างเดียว ยังไม่แก้โค้ด**: ใน 244 KB มีอะไรบ้าง (ใช้ `output/perf-games/chunks.mjs` + bundle analyzer ของ Next 16 ตามเอกสารใน `node_modules/next/dist/docs/`) แยกเป็น framework / โค้ดเรา / dictionary / ข้อมูลเกม

แนวทางที่ควรตรวจ เรียงจากเสี่ยงน้อย:
1. **client boundary กว้างเกิน**: หา `'use client'` ที่ครอบทั้งหน้า/layout ทั้งที่ส่วนใหญ่เป็นเนื้อหานิ่ง ย้ายลงไปที่ชิ้นที่โต้ตอบจริง
2. **dictionary และข้อมูลเกมใน client bundle**: `LocaleProvider` ส่ง dictionary ทั้งก้อนหรือเฉพาะหน้า ข้อมูลด่านของเกมอื่นติดมาในหน้าเลือกด่านหรือไม่
3. **dynamic import ของสิ่งที่ยังไม่ใช้ตอนเปิดหน้า**: ตัวเกมจริง (หน้าแรกเห็นแค่ intro), ระบบ Learning Stars, ตัวเล่นเสียง, tutorial
4. **ฟอนต์**: Noto Sans Thai Looped ขอ 5 น้ำหนัก (400/600/700/800/900) ตรวจว่าใช้จริงกี่น้ำหนักและ preload กี่ไฟล์ ลดได้เฉพาะน้ำหนักที่ไม่มีที่ใช้ — **ห้ามเปลี่ยนตระกูลฟอนต์** (AGENTS ข้อ 3) และตัวหนังสือต้องหน้าตาเหมือนเดิม
5. **CSS**: 10–12 ไฟล์ render-blocking มีของหน้าอื่นติดมาหรือไม่ (เช่น CSS เกมอื่นในหน้าเลือกด่าน)

ส่วน React/Next runtime เอง (~125 KB) ลดไม่ได้ อย่าเสียเวลา ถ้ารายงานบอกว่าส่วนที่ลดได้รวมกันไม่ถึง ~60 KB ให้ Opus แจ้งเจ้าของโปรเจกต์ตรงๆ ว่าเป้า 2.5 วิ ไม่คุ้ม และเสนอเป้าใหม่ (เช่น ≤ 3.0 วิ ทุกหน้า)

### ขั้น C — หน้าอื่นที่ยังช้า
`/learn/stories` 3.8 วิ และข้อ 5–13 ที่ค้างใน `D:/Littleummah-faith/output/p1-4/report.md` ทำหลังขั้น A

### งานข้างเคียง (sol)
`scripts/check-puzzle-browser.mjs` (ต้องมี `BASE_URL`, timeout ที่ `.pz-cell`) และ `scripts/check-game-landscape-browser.mjs` (fullscreen ล้ม 2/5 ใน headless) ล้มตั้งแต่ก่อน `0fd282e` ซ่อมสคริปต์ให้ตรงกับหน้าปัจจุบัน ถ้าพบว่าเป็นบั๊กจริงของหน้า ให้รายงาน ไม่ใช่แก้สคริปต์ให้ผ่าน

## 4. วิธีวัด (ใช้แบบเดียวกันทุกรอบ)

```bash
# Git Bash · Lighthouse 13.6 · ต้องมี CHROME_PATH (ตั้งในสคริปต์แล้ว)
cd output/perf-games
BASE=https://littleummahproject.vercel.app bash measure.sh <โฟลเดอร์ผล> 3   # production
bash measure.sh <โฟลเดอร์ผล> 3                                              # localhost:3170
node table.mjs <โฟลเดอร์ผล>                 # ตารางค่ากลาง
REQS=1 node sum.mjs <โฟลเดอร์ผล>/games-2.json   # request ทีละตัว + LCP element
bash measure-real.sh <โฟลเดอร์ผล> 3         # --throttling-method=devtools
```

- **ตัวเลขจริงต้องวัดบน production** localhost (`next start`, HTTP/1.1) สูงกว่าราว 1–1.4 วิ ใช้เทียบก่อน/หลังเท่านั้น
- ก่อน push ทุกครั้ง วัด production 3 รอบเก็บเป็น baseline ก่อน (ค่าขึ้นลงได้ ±0.3 วิ ระหว่างรอบ) ใช้ค่ากลาง ห้ามเลือกรอบที่ดีที่สุด
- ใน Git Bash อาร์กิวเมนต์ที่ขึ้นต้นด้วย `/` ต้องตั้ง `MSYS_NO_PATHCONV=1`
- ใน simulation ภาพ `preload` แสดง priority Low และถูกนับน้อยกว่าจริง ส่วน `fetchPriority="high"` ดูแย่ลง ~0.15 วิ แต่เป็นผลดีกับผู้ใช้จริง — อย่าย้อนกลับเพื่อคะแนน
- เครื่องมือช่วย: `sizes2.mjs` (วัดความกว้างภาพใน DOM เทียบไฟล์ที่ได้), `bgdiff.mjs` (เทียบพิกเซล crop กับภาพเต็ม), `cold-tour.mjs` (ทัวร์นูรีบนเน็ตช้า)

## 5. ห้าม (เหมือน P1-5 และเพิ่ม)

- โกงคะแนน: ซ่อนภาพ ย่อจนเบลอ ลด quality, placeholder ที่ทำให้ LCP เปลี่ยน element, แยกโค้ดตาม user agent
- เปลี่ยนดีไซน์ ภาพที่อนุมัติแล้ว หุ่นยนต์ ตำแหน่งองค์ประกอบ ข้อความ เสียง ตระกูลฟอนต์
- เพิ่ม analytics / ระบบติดตาม / สคริปต์ภายนอก / CDN นอก Vercel
- ทำให้ motion ผิดข้อ 2.1, tap target < 64px, CLS > ค่าปัจจุบัน, hydration error
- แตะ content data (`src/features/*/data*`, `public/audio`, ภาพต้นฉบับ) · derivative ใหม่ต้องผ่าน `optimize-images.mjs`
- หยุด server ที่ port 3000 หรือ 3200

## 6. เกณฑ์ผ่านต่อรอบ

- `npm run verify` (typecheck, lint, test, build) ผ่าน
- browser checks ผ่าน: `check-games-hub-browser`, `check-memory-browser`, `check-learning-stars-browser`, `check-age-memory-browser`, `check-home-browser`, `check-storybook-browser --story=water-dog`, `check-ipad-webkit` (ตั้ง `PLAYWRIGHT_MODULE` / `PLAYWRIGHT_EXECUTABLE` ตาม P1-5)
- cold load บนเน็ตช้า: ทัวร์นูรีไม่มีเฟรมว่าง, เปิดเกมครั้งแรกไม่ค้าง, เสียงแนะนำเล่นได้และฟังซ้ำได้, เกาะหน้าแรกหมุนไม่กระพริบ
- ตารางก่อน/หลัง 3 รอบ ทั้ง localhost และ (หลัง deploy) production · CLS ไม่แย่ลง · ไม่มีหน้าไหน LCP แย่ลงเกิน 0.1 วิ
- ถ้าเพิ่ม derivative ของภาพพื้นหลัง: แนบผล `bgdiff.mjs` ว่าสเกลและตำแหน่งเท่าภาพเต็ม

## 7. แบ่งบทบาท

**Opus** (ทำหน้าที่ Claude ตาม AGENTS ข้อ 4)
- แตกขั้น A เป็น brief ย่อย (แนะนำ 2 ชุด: A1 ข้อ 1–5, A2 ข้อ 6–7) กำหนดไฟล์ที่แก้ได้และ timeout
- อนุมัติแผนขั้น B จากรายงานของ astra ก่อนให้แก้โค้ด ข้อไหนเปลี่ยนโครงสร้างหลัก (ย้าย client boundary ของ layout, เปลี่ยนวิธีส่ง dictionary) ให้ถามเจ้าของโปรเจกต์ก่อน
- ตรวจรับ: รัน `npm run verify` และวัดซ้ำเอง อ่าน diff จุดเสี่ยง (ลำดับโหลดภาพ/เสียง, dynamic import ที่อาจทำให้กดแล้วค้าง)
- แก้รอบ fix เอง (เจ้าของโปรเจกต์ตัดสิน 10 พ.ย.) แล้วให้ Codex sol review diff
- รายงานเจ้าของโปรเจกต์: ตัวเลขจริง ระบุ model ที่ใช้ ขอ approve ก่อน commit/push แล้ววัด production ซ้ำหลัง deploy
- อัปเดต `docs/briefs/QUEUE.md` ข้อ 7 เมื่อจบแต่ละขั้น

**Codex**
- `gpt-6.1-sol` medium: ขั้น A, ซ่อมสคริปต์ตรวจ, review diff (read-only)
- `gpt-6-astra` medium: รายงานและงานขั้น B
- ทำใน worktree เท่านั้น ใส่ `-m` ทุกครั้ง ห้าม commit / reset / unstage เขียนรายงานไทยที่ `output/perf-3/report.md`: สาเหตุ, สิ่งที่แก้ (ไฟล์:บรรทัด), ตารางก่อน/หลัง, สิ่งที่ลองแล้วไม่ได้ผล, ความเสี่ยงที่เหลือ

## 8. สิ่งที่ทำไปแล้วใน `0fd282e` (อย่าทำซ้ำ อย่าย้อนกลับ)

- `sizes` ตรง DOM จริง: `Artwork.tsx` (Thumbnail รับ prop `sizes`), `GameIntro.tsx`, `VoiceIntro.tsx` (เฉพาะหุ่น), `GamesHero.tsx`
- `game-hub-bg-square.webp` / `-narrow.webp` สำหรับจอตั้ง ใน `interiors.css` (`.gc-focus`) และ `games-hub.css` (`.gh-hero`)
- ท่านูรีใน `GamesHero.tsx` mount หลัง `afterScenePaint` (state `poses`) ปุ่มเล่นซ้ำเรียก `replay()`
- Thumbnail ใหญ่ใช้ `loading="eager"` + `fetchPriority="high"` (Next 16 ห้ามใช้ร่วมกับ `preload`)
- `GameTutorial.tsx`: `preload(theme.backdrop, { as: 'image', fetchPriority: 'high' })` สำหรับ LCP ที่เป็น CSS background
