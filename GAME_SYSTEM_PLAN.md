# GAME_SYSTEM_PLAN.md — ระบบ Mini Game Hub ของ Little Ummah

เอกสารนี้คือแบบก่อสร้าง (build spec) สำหรับ AI coding agent เช่น OpenAI Codex
อ่านจบแล้วต้องลงมือสร้างได้ทันทีโดยไม่ต้องถามกลับ

> **อ่าน `AGENTS.md` ก่อนเสมอ** — เอกสารนี้อยู่ใต้ `AGENTS.md` ทุกข้อ
> ถ้าข้อไหนขัดกัน ให้ `AGENTS.md` ชนะ แล้วถามเจ้าของโปรเจกต์
> จุดที่เอกสารนี้ตัดสินใจต่างจากคำสั่งตั้งต้นของเจ้าของโปรเจกต์ จะกำกับด้วย **⚠️ DECISION** ทุกจุด

---

## 0. สรุปการตัดสินใจที่ต่างจาก brief ตั้งต้น (อ่านก่อน)

| # | brief เดิม | เอกสารนี้ | สถานะ | เหตุผล |
|---|---|---|---|---|
| D1 | audio category มี `backgroundMusic` | **ตัด `backgroundMusic` ออกทั้งระบบ** | ✅ **อนุมัติ 2026-09-13** | `AGENTS.md` ข้อ 1.3 ห้ามดนตรีพื้นหลังทุกชนิด |
| D2 | reward ใช้ `⭐` / `★★★☆☆` | **ใช้ `StarIcon` inline SVG** (`src/components/icons/`) | ตามข้อ 3 | ข้อ 3 ระบุไอคอนเป็น inline SVG ห้ามใช้ emoji เป็นไอคอนหลัก |
| D3 | route คือ `/games` | **canonical `/games` + คง `/learn/games*` เป็น redirect 308** | ✅ **อนุมัติ 2026-09-13** | ข้อ "child focus mode" ต้องไม่สืบ `PageShell` ของเกาะ แต่ลิงก์เดิมที่ผู้ปกครองส่งต่อกันต้องไม่พัง (ดู comment ใน `src/lib/games.ts`) |
| D4 | Game 5 มี mode `letter → sound` | **สร้าง mode ไว้แต่ `enabled: false` จนมีไฟล์เสียง** | รอไฟล์เสียง | `speech.ts` ตั้ง `lang = "th-TH"` ตายตัว เสียงไทยอ่านอาหรับไม่ได้ (`lessons.ts` บันทึกไว้แล้ว) ถ้าเปิดใช้ตอนนี้เด็กจะกดแล้วเงียบสนิท |
| D5 | drag & drop (ไม่ระบุวิธี) | **Pointer Events เขียนเอง zero-dep + tap-to-select fallback** | ✅ **อนุมัติ 2026-09-13** | HTML5 Drag and Drop ใช้บน touch ไม่ได้ และแท็บเล็ตคืออุปกรณ์หลัก · **ห้ามลง DnD library** |
| D6 | soft 3D / clay illustration | **ภาพ raster (WebP) จากเจ้าของโปรเจกต์ + placeholder inline SVG** | รอภาพ | สไตล์ clay ทำด้วย SVG ไม่ได้จริง ระบบต้อง build ได้ก่อนภาพมาถึง |

---

## 1. UX Architecture

### 1.1 ผู้ใช้และอุปกรณ์

| กลุ่ม | อ่านหนังสือ | อุปกรณ์หลัก | ผลต่อ UI |
|---|---|---|---|
| 3–5 ปี | อ่านไม่ออก | แท็บเล็ตของผู้ปกครอง | ภาพนำ 100% ต้องมีเสียงอ่านโจทย์ ปุ่ม 72–80px ไม่มีเวลาจำกัด |
| 5–7 ปี | อ่านคำสั้นได้ | แท็บเล็ต / มือถือ | ภาพนำ + คำไทยสั้น ปุ่ม 64px+ |
| 7–10 ปี | อ่านได้ | มือถือ / เดสก์ท็อป | รับข้อความได้ เพิ่มระดับความยากและจำนวนด่านได้ |

### 1.2 หลักการ UX 8 ข้อ (บังคับทุกเกม)

1. **Visual > Text** — ทุกโจทย์ต้องเข้าใจได้จากภาพเพียงอย่างเดียว ข้อความคือชั้นเสริม
2. **แตะครั้งเดียวเข้าเนื้อหา** — ห้ามให้แตะรอบแรกเป็นการเปิด hover (ข้อ 2.1)
3. **≤ 2 interaction ถึงจะเริ่มเล่น** — จาก `/games` แตะไอคอน → เห็นคำสั่งภาพ → แตะ "เล่น" (หรือเริ่มเองอัตโนมัติ)
4. **ไม่มีทางตัน** — ทุกหน้าจอมีปุ่มบ้านซ้ายบนเสมอ
5. **ผิดไม่ใช่การลงโทษ** — ไม่มีจอแดง ไม่มี ✗ ใหญ่ ไม่มีเสียงตกใจ ไม่มีการตัดคะแนน ไม่มีการบังคับเริ่มใหม่
6. **ไม่มีเวลากดดัน** — timer เป็น optional ต่อเกม ค่าเริ่มต้นคือ `undefined` (ไม่จับเวลา)
7. **เสียงไม่ใช่เงื่อนไขบังคับ** — เกมต้องเล่นจบได้แม้ปิดเสียงหรืออุปกรณ์อ่านออกเสียงไม่ได้
8. **ไม่มีสิ่งรบกวน** — ในหน้าเกมห้ามมีโฆษณา, ลิงก์ออกนอกเว็บ, popup, social, ช้อปปิ้ง, เมนูหลายชั้น

### 1.3 Child focus mode

หน้าเกม (`/games/[slug]`) ใช้ layout ของตัวเองที่**ไม่มี `SiteHeader`** และไม่มีเมนูหมวดหมู่
มีแค่ 3 ปุ่มคงที่: บ้าน (ซ้ายบน) · ความคืบหน้า (กลาง) · เสียง (ขวาบน)

---

## 2. Information Architecture

### 2.1 โครงสร้าง route

```
/                              หน้าแรก (เกาะลอย 6 หมวด)
/games                         ⭐ Game Hub — โลกของเกม (canonical)
/games/[slug]                  หน้าเกมทุกเกม (route เดียว dynamic)
/games/[slug]/?level=2         ระดับอยู่ใน query ไม่ใช่ path (ดู 2.3)
/parents                       หน้าผู้ปกครอง (เพิ่มลิงก์ "ดูความคืบหน้า")

/learn/games        → redirect (permanent) → /games
/learn/games/memory → redirect → /games/memory
/learn/games/memory/easy → redirect → /games/memory?level=easy
/learn/games/memory/hard → redirect → /games/memory?level=hard
```

**⚠️ DECISION D3** — `/games` เป็น canonical เพราะ:
- `/learn/*` ถูกครอบด้วย `PageShell` (ฉากท้องฟ้า + `SiteHeader`) ซึ่งขัดกับ child focus mode
- URL สั้นจำง่าย และเหมาะกับ PWA `start_url` ในอนาคต (§18 Phase 3 ข้อ 31)

**ต้องทำพร้อมกัน**: แก้ `src/lib/categories.ts` → `games.href = "/games"`
และเพิ่ม redirects ใน `next.config.ts`:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // permanent: true = HTTP 308 — เจ้าของโปรเจกต์ยืนยัน D3 แล้ว (2026-09-13)
      { source: "/learn/games", destination: "/games", permanent: true },
      { source: "/learn/games/memory", destination: "/games/memory", permanent: true },
      { source: "/learn/games/memory/easy", destination: "/games/memory?level=easy", permanent: true },
      { source: "/learn/games/memory/hard", destination: "/games/memory?level=hard", permanent: true },
    ];
  },
};
```

> ลิงก์เดิมต้องไม่ 404 — comment ใน `src/lib/games.ts` บันทึกไว้ว่า URL เหล่านี้ตั้งใจให้ผู้ปกครองส่งต่อได้

### 2.2 หนึ่ง route สำหรับ 30–50 เกม

**ห้ามเขียนไฟล์ route แยกต่อเกม** ให้ใช้ `src/app/games/[slug]/page.tsx` ตัวเดียว
เกมใหม่ = เพิ่ม 1 entry ใน registry + 1 โฟลเดอร์ component เท่านั้น ไม่ต้องแตะ routing

```tsx
// src/app/games/[slug]/page.tsx  (Server Component)
export function generateStaticParams() {
  return GAME_REGISTRY.filter(g => g.enabled).map(g => ({ slug: g.slug }));
}
export const dynamicParams = false; // slug ที่ไม่มีในทะเบียน → 404
```

### 2.3 ระดับความยากอยู่ใน query ไม่ใช่ path

เดิม `/learn/games/memory/easy` เป็น path — ถ้าทำแบบนั้นกับ 50 เกม × 4 ระดับ = 200 ไฟล์
ใช้ `?level=easy` แทน แล้ว parse ด้วย `searchParams` ฝั่ง server แล้วส่งเป็น prop
ข้อดีเดิมยังอยู่: ผู้ปกครองยังส่งลิงก์ตรงระดับได้

### 2.4 การจัดกลุ่มใน Hub

จัดตาม **ช่วงวัย** เป็นหลัก (สอดคล้อง `AGE_GROUPS` ที่มีอยู่) และมีแถบกรองตาม `category` เป็นชั้นรอง
ห้ามใช้ tab ที่เป็น client state ทับกัน — ใช้ section ต่อกันลงมาแบบเดียวกับ `/learn/games` เดิม
(เด็กเห็นทั้งหมดทันที ไม่ต้องแตะเพิ่ม + ผู้ปกครองส่งลิงก์ `#kids` ได้)

---

## 3. Game Hub Layout (`/games`)

### 3.1 โครงหน้า

```
┌──────────────────────────────────────────────────────────┐
│  [☰ ไม่มี]   ท้องฟ้า gradient + ดาว + เมฆ (CSS ล้วน)      │
│                                                          │
│         ⌒ StickerArcTitle: "เกาะเกม / Games"            │
│    [หุ่นยนต์ play.webp]  ยินดีต้อนรับสู่โลกของเกม           │
│                                                          │
│  ── วัย 3-6 ปี · Ages 3–6 ───────────────────────────    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   ← 1:1 tile, radius ใหญ่   │
│  │scene│ │scene│ │scene│ │scene│                          │
│  └────┘ └────┘ └────┘ └────┘                             │
│   สีและรูปทรง จับคู่  จิ๊กซอว์  ค้นหาของ                    │
│                                                          │
│  ── วัย 7 ปีขึ้นไป · Ages 7+ ─────────────────────────    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                             │
│  ...                                                     │
│                                                          │
│  [⬅ หน้าแรก]                          [🔊 ปุ่มเสียง]      │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Grid — responsive จริง ไม่ fix

```
grid grid-cols-2 gap-x-5 gap-y-8
  sm:grid-cols-3 sm:gap-6      (≥40rem แท็บเล็ต)
  lg:grid-cols-4 lg:gap-8      (≥64rem เดสก์ท็อป)
  xl:grid-cols-5               (≥80rem จอกว้าง — กันไอคอนบวมเกิน 240px)
```

เพดานขนาด tile: `max-w-[15rem]` ต่อใบ + `justify-items-center`
เพราะที่ 4 คอลัมน์บนจอ 2560px ไอคอนจะโตเกินจนดูเป็นภาพแบนเนอร์

### 3.3 Game Tile — สเปกละเอียด

```
<li>
  <Link>                                  ← ลิงก์เดียวครอบทั้งใบ (ข้อ 2.1)
    <span class="frame">                  ← กรอบภาพ: อันนี้เท่านั้นที่ขยับตอน hover
       <Image scene />                     aspect-square, overflow-hidden, radius-card
       [ป้าย "เร็วๆ นี้" ถ้า !enabled]
       [แถวดาวที่เคยได้ ถ้ามี progress]
    </span>
    <span class="label">ชื่อไทย</span>      ← อยู่นิ่งสนิท ห้ามขยับ
    <span lang="en">English</span>
  </Link>
</li>
```

- `aspect-ratio: 1 / 1` บังคับ — ป้องกัน layout shift ก่อนภาพโหลด
- `rounded-card` (28px) + `border-4 border-cloud` ให้ดูเป็นสติกเกอร์นูน
- **ด้านในคือ "ฉาก" ไม่ใช่ไอคอนเส้น** เช่น Color Match = กล่องสี 4 กล่อง + ของเล่นลอยอยู่เหนือกล่อง
- ชื่อไทยไม่เกิน 2–3 คำ (`nameTh` ใน registry ต้องผ่านกฎนี้)
- `overflow-hidden` อยู่ที่ `.frame` เท่านั้น **ห้ามครอบทั้ง `<li>`** ไม่งั้นบัง focus outline

**Reference ที่ถูกต้องอยู่แล้วในโค้ด**: `src/components/games/GameTile.tsx`
ทำ motion + contrast + speak-on-hover ถูกทุกข้อแล้ว ให้ต่อยอดจากไฟล์นี้ ไม่ต้องเขียนใหม่จากศูนย์

### 3.4 ฉากพื้นหลังของ Hub — ห้ามเป็น dashboard

ต้องรู้สึกเป็น "โลก" ไม่ใช่ตารางการ์ด SaaS วิธีที่อนุญาต (CSS ล้วน ไม่ animate):
- gradient ฟ้าจากเข้มด้านบน → `sky-pale` ด้านล่าง (คัดลอกแนวจาก `.sky-backdrop` ใน `globals.css`)
- ดาวเป็น `radial-gradient` จุดเล็กกระจาย หรือ inline SVG `<StarField/>` ที่ `aria-hidden`
- เมฆใช้แนว `.cloud-bank-far` / `.cloud-bank-front` ที่มีอยู่
- เรขาคณิตแบบมัสยิด (ลายดาว 8 แฉก / ซุ้มโค้ง) เป็นลาย watermark opacity ต่ำ

**ห้าม**: `filter: blur()`, parallax ตามการเลื่อน, ดาวกระพริบวนตลอด, เมฆลอยวน
เหตุผลบันทึกไว้ใน `globals.css` แล้ว — ผู้ใช้จริงคือเด็กบนแท็บเล็ตราคาประหยัด

---

## 4. Game Flow

### 4.1 flow มาตรฐาน

```
/games (Hub)
   │ แตะไอคอน  (interaction #1)
   ▼
/games/[slug]  →  InstructionOverlay  ← ฉากคำสั่งด้วยภาพ + เสียงอ่าน
   │ แตะ "เล่น" (interaction #2)      (มีปุ่มเดียวใหญ่ 80px)
   ▼
PLAYING ──ตอบถูก──► CelebrationEffect (600ms) ──► โจทย์ถัดไป
   │                                                    │
   └──ตอบผิด──► gentle wiggle + soft sound ──► โจทย์เดิม (ไม่หักคะแนน)
                                                        │
                                        ครบทุกโจทย์ ────┘
                                                        ▼
                                          GameResultScreen
                                     ⭐⭐⭐  +  หุ่นยนต์ฉลอง
                          [เล่นอีกครั้ง] [เกมถัดไป] [กลับหน้าเกม]
```

### 4.2 state machine (ใช้ทุกเกม)

```ts
type GamePhase = "instruction" | "playing" | "feedback" | "complete";
```

- `instruction` → `playing` : แตะปุ่มเล่น (หรือ auto หลัง 2.5s ถ้า `autoStart: true`)
- `playing` → `feedback` : ผู้เล่นส่งคำตอบ
- `feedback` → `playing` : หมด `FEEDBACK_MS` และยังมีโจทย์เหลือ
- `feedback` → `complete` : หมด `FEEDBACK_MS` และโจทย์หมด
- `complete` → `instruction` : กด "เล่นอีกครั้ง"

`FEEDBACK_MS`: ถูก = 900ms, ผิด = 700ms
(ค่าเดียวกับที่ `MemoryGame.tsx` ใช้อยู่ — เว้นให้เด็กเห็นภาพจบก่อนคำชม)

### 4.3 InstructionOverlay ต้องสั้น

- ภาพ 1 ภาพ + ประโยคไทย 1 ประโยค (≤ 8 คำ) + บรรทัดอังกฤษ
- เสียงอ่านโจทย์อัตโนมัติ **เฉพาะเมื่อมี user interaction มาก่อนแล้ว** (ดู §10.4)
- ปุ่ม "เล่น" 80px มี `GameIcon name="play"`
- ปุ่ม "ฟังอีกครั้ง" ขนาด 64px — เด็กเล็กมักต้องฟังซ้ำ

---

## 5. Reusable Game Engine Architecture

### 5.1 สามชั้น — กฎเหล็ก

```
┌─ Layer 3: PRESENTATION ───────── src/components/games/**  ("use client")
│   UI, animation, theme, effects, drag interaction
│   ▲ อ่านจาก engine เท่านั้น ห้ามมีกติกา
├─ Layer 2: ENGINE ─────────────── src/lib/games/engines/**  (pure TS, ไม่มี React)
│   reducer, กติกา, score, level progression, timer logic
│   ▲ รับ content เป็น argument ห้ามรู้จักเนื้อหาใดๆ
└─ Layer 1: CONTENT ───────────── src/lib/games/content/**   (data ล้วน)
    ตัวอักษร ภาพ คำถาม เสียง คำแปล
```

**การทดสอบว่าแยกชั้นสำเร็จ**: ใน `src/lib/games/engines/*.ts`
- `grep -i "react\|useState\|className"` ต้องได้ 0 บรรทัด
- `grep` คำอิสลามเฉพาะ เช่น `"Bismillah"`, `"อาบน้ำละหมาด"`, `"ا"` ต้องได้ **0 บรรทัด**

ตัวอย่างที่ **ห้าม**เขียน:
```ts
if (answer === "Bismillah") score++;      // ❌ content ฝังใน engine
```
ตัวอย่างที่**ถูก**:
```ts
if (answer === challenge.correctId) score++;  // ✅ engine รู้แต่โครงสร้าง
```

### 5.2 สัญญาของ engine (Engine Contract)

ทุก engine ต้อง export 4 อย่างนี้ ไม่มีข้อยกเว้น:

```ts
// src/lib/games/engines/types.ts
export type EngineResult<S> = {
  state: S;
  /** สิ่งที่ presentation ต้องเล่น/แสดง engine ไม่ทำเอง */
  effects: GameEffect[];
};

export type GameEffect =
  | { kind: "correct"; targetId: string }
  | { kind: "wrong"; targetId: string }
  | { kind: "speak"; text: string; clipKey?: string }
  | { kind: "awardStar"; count: number }
  | { kind: "levelComplete"; stars: 1 | 2 | 3 };

export interface GameEngine<S, A, C> {
  /** สร้าง state เริ่มต้น ต้อง deterministic — ห้ามเรียก Math.random ที่นี่ */
  create(content: C, options: EngineOptions): S;
  /** สับ/สุ่มโจทย์ รับ random เป็น argument เพื่อให้ทดสอบได้ */
  start(state: S, random?: () => number): S;
  /** เดินหนึ่งก้าว pure function ทั้งหมด */
  reduce(state: S, action: A): EngineResult<S>;
  /** จบด่านหรือยัง + ได้กี่ดาว */
  evaluate(state: S): { done: boolean; stars: 0 | 1 | 2 | 3; total: number; solved: number };
}
```

**กฎ determinism** (คัดจาก `memory-game.ts` ที่ทำถูกอยู่แล้ว):
`create()` ต้องให้ผลเหมือนกันทุกครั้ง เพราะ HTML จากเซิร์ฟเวอร์ต้องตรงกับ client
การสุ่มเกิดใน `start()` เท่านั้น และ `start()` รับ `random = Math.random` เป็น parameter
เพื่อให้เทสต์ส่ง `() => 0` เข้าไปได้

### 5.3 ⚠️ ย้ายเกมความจำที่มีอยู่ ไม่ใช่ทิ้ง

`src/lib/memory-game.ts` วันนี้**ถูกต้องตามสถาปัตยกรรมนี้แล้ว** (pure reducer, รับ random เป็น arg)
ให้ถือเป็น reference implementation

ขั้นตอนย้าย (ต้องทำเป็น commit แรกของงานนี้):

| เดิม | ใหม่ | หมายเหตุ |
|---|---|---|
| `src/lib/memory-game.ts` | `src/lib/games/engines/memory.ts` | ห่อให้ตรง `GameEngine` interface เพิ่ม `effects` |
| `MEMORY_ITEMS` ใน `games.ts` | `src/lib/games/content/islamic-objects.ts` | กลายเป็น content pack ตัวแรก |
| `src/components/games/MemoryGame.tsx` | `src/components/games/memory/MemoryBoard.tsx` | ใช้ `GameShell` ครอบ |
| `tests/memory-game.test.mjs` | `tests/games/memory.test.mjs` | **ต้องยังผ่าน** แก้แค่ path import |

`tests/memory-game.test.mjs` ใช้ `node:test` import `.ts` ตรงๆ ไม่มี runner ภายนอก
ให้ทุก engine ใหม่ทดสอบด้วยรูปแบบเดียวกัน และเพิ่ม script:

```json
"test": "node --test \"tests/**/*.test.mjs\""
```

**ตรวจบนเครื่องจริงแล้ว** (Node v24.15.0):
- **ไม่ต้องใส่ `--experimental-strip-types`** — Node 24 อ่าน `.ts` ตรงๆ ได้เอง
- **เครื่องหมายคำพูดรอบ glob จำเป็น** — Node เป็นคนขยาย `**` เอง ถ้าไม่ใส่ PowerShell จะพัง
- `node --test tests/` (ชื่อโฟลเดอร์เปล่า) **ใช้ไม่ได้** บนเวอร์ชันนี้ ต้องเป็น glob เท่านั้น
- มี warning `MODULE_TYPELESS_PACKAGE_JSON` ขึ้นทุกครั้ง — เป็น warning ไม่ใช่ error
  ถ้าจะให้เงียบต้องเติม `"type": "module"` ใน `package.json` ซึ่งกระทบทั้งโปรเจกต์
  **อย่าเติมโดยไม่ถามเจ้าของโปรเจกต์**

---

## 6. Component Architecture

### 6.1 Shared shell & chrome

| Component | ชนิด | หน้าที่ | หมายเหตุสำคัญ |
|---|---|---|---|
| `GameShell` | client | ครอบทุกเกม: phase machine, header, overlay, result | จุดเดียวที่รู้จัก `GamePhase` |
| `GameHeader` | client | บ้าน(ซ้าย) · progress(กลาง) · เสียง(ขวา) | `position: sticky; top: 0` สูง 72px |
| `GameProgress` | server-safe | `3 / 5` + แถว `StarIcon` | ห้ามบอกความคืบหน้าด้วยสีเดียว ต้องมีตัวเลขกำกับ |
| `HomeButton` | client | กลับ `/games` | 64px ใช้ `GameIcon name="back"` |
| `SoundToggle` | client | มีอยู่แล้ว `src/components/sound/SoundToggle.tsx` | **ใช้ตัวเดิม ห้ามเขียนใหม่** |
| `InstructionOverlay` | client | ฉากคำสั่งภาพ + ปุ่มเล่น/ฟังซ้ำ | `role="dialog"` `aria-modal` + focus trap |
| `GameResultScreen` | client | ดาว + หุ่นยนต์ + 3 ปุ่มทางออก | โฟกัสไปที่ `<h2>` ทันที (แบบที่ `MemoryGame` ทำ) |
| `GameModal` | client | ยืนยันออกกลางเกม / พัก | `<dialog>` native ไม่ใช้ `alert()` |

> **ห้ามใช้ `window.alert/confirm/prompt`** ทั้งโปรเจกต์ — บล็อก event loop และไม่มี style

### 6.2 Interaction primitives

| Component | หน้าที่ | สเปก |
|---|---|---|
| `DragItem` | ของที่ลากได้ | Pointer Events + tap-to-select (ดู §14.2) |
| `DropZone` | ช่องรับของ | ≥ 64px, มี 3 สถานะ: idle / armed / hover |
| `DragProvider` | context เก็บ `pickedId`, `pointer`, `zones` | ตัวเดียวต่อหน้าเกม |
| `GameButton` | ปุ่มในเกม | สืบจาก `gameButtonClass` ที่มีอยู่ใน `GameNavigation.tsx` |
| `GameCard` | การ์ด/ตัวเลือกที่กดได้ | รองรับ `selected` / `matched` / `dimmed` |
| `GameGrid` | จัดกริดตามจำนวนชิ้น | คำนวณคอลัมน์จาก `items.length` ไม่ hard-code |

### 6.3 Feedback & reward

| Component | สเปก |
|---|---|
| `CelebrationEffect` | ดาวกระจาย 8–12 ดวง `StarIcon` ขนาดต่างกัน อายุ 600ms `pointer-events-none` `aria-hidden` |
| `StarReward` | ดาว 3 ดวง เติมทีละดวง 150ms ต่อดวง มี `outline` เป็นสถานะยังไม่ได้ |
| `WiggleFeedback` | สั่นซ้าย-ขวา 2 รอบ ±6px ใน 400ms |
| `StickerAlbum` (Phase 3) | สมุดสติกเกอร์สะสม — ออกแบบที่ว่างไว้ตอนนี้ ยังไม่สร้าง |

**บังคับ**: `CelebrationEffect` และ `WiggleFeedback` ใช้ `transform`
→ ต้องใส่ `motion-safe:` ทุกครั้ง เพราะ `prefers-reduced-motion` ใน `globals.css` ตัดแค่ *duration*
ค่า transform ยังกระโดดทันที (บันทึกไว้ใน `AGENTS.md` ข้อ 2.1)
fallback ตอนปิด motion: ดาวยัง**แสดงนิ่ง** 600ms แล้วหาย + ข้อความ "ถูกต้อง!" ขึ้นจริง

### 6.4 Audio

| Component/module | หน้าที่ |
|---|---|
| `SoundProvider` (มีอยู่) | เปิด/ปิดเสียง + `speak()` — **AudioManager ต่อยอดจากตัวนี้ ห้ามแทนที่** |
| `AudioManager` (ใหม่) | เพิ่ม sound effect ต่อ channel + preload + unlock |

---

## 7. Folder Structure

```
src/
├─ app/
│  ├─ games/
│  │  ├─ layout.tsx              ← child focus layout (ไม่มี SiteHeader)
│  │  ├─ page.tsx                ← Game Hub  (server)
│  │  └─ [slug]/
│  │     └─ page.tsx             ← โหลด component ของเกมด้วย next/dynamic
│  ├─ learn/…                    (เดิม — ลบ learn/games/** ออก ย้ายเป็น redirect)
│  └─ globals.css                ← เพิ่ม @theme token ของเกมที่นี่เท่านั้น
│
├─ components/
│  ├─ games/
│  │  ├─ shell/     GameShell, GameHeader, GameProgress, HomeButton,
│  │  │             InstructionOverlay, GameResultScreen, GameModal
│  │  ├─ hub/       GameTile, GameGrid, HubScene, AgeSection, CategoryFilter
│  │  ├─ dnd/       DragProvider, DragItem, DropZone, useDragOrTap
│  │  ├─ feedback/  CelebrationEffect, StarReward, WiggleFeedback, RobotReaction
│  │  ├─ ui/        GameButton, GameCard
│  │  ├─ color-match/    ColorMatchBoard.tsx
│  │  ├─ shape-match/    ShapeMatchBoard.tsx
│  │  ├─ memory/         MemoryBoard.tsx
│  │  ├─ puzzle/         PuzzleBoard.tsx
│  │  ├─ arabic-match/   ArabicMatchBoard.tsx
│  │  ├─ sequence/       SequenceBoard.tsx
│  │  ├─ find-object/    FindObjectBoard.tsx
│  │  └─ sort/           SortBoard.tsx
│  ├─ icons/         (เดิม) + StarIcon, ShapeIcon, ColorSwatchIcon, PuzzlePieceIcon
│  └─ sound/         (เดิม) SoundProvider, SoundToggle
│
├─ lib/
│  ├─ games/
│  │  ├─ registry.ts             ← ทะเบียนเกมทั้งหมด (single source of truth)
│  │  ├─ types.ts                ← ทุก type ใน §8
│  │  ├─ engines/
│  │  │  ├─ types.ts             GameEngine, GameEffect, EngineOptions
│  │  │  ├─ matching.ts          ใช้ร่วม: color-match, shape-match, arabic-match, sort
│  │  │  ├─ memory.ts            (ย้ายจาก src/lib/memory-game.ts)
│  │  │  ├─ puzzle.ts
│  │  │  ├─ sequence.ts
│  │  │  └─ search.ts            find-object
│  │  ├─ content/
│  │  │  ├─ types.ts             ContentPack, Challenge
│  │  │  ├─ colors.ts
│  │  │  ├─ shapes.ts
│  │  │  ├─ islamic-objects.ts   ← MEMORY_ITEMS เดิมย้ายมาที่นี่
│  │  │  ├─ arabic-letters.ts
│  │  │  ├─ numbers.ts
│  │  │  └─ sizes.ts
│  │  ├─ levels.ts               ตารางระดับต่อเกม
│  │  └─ audio/
│  │     ├─ channels.ts          ชื่อ channel + ไฟล์
│  │     └─ audioManager.ts      preload / unlock / play
│  ├─ progress/
│  │  ├─ progressStore.ts        ← external store แบบเดียวกับ soundStore.ts
│  │  └─ schema.ts               version + migration
│  ├─ categories.ts  lessons.ts  speech.ts  soundStore.ts   (เดิม)
│  └─ games.ts                   ← กลายเป็น re-export ชั่วคราว แล้วลบใน Phase 2
│
public/
├─ games/
│  ├─ README.md                  ← สเปกภาพ (โครงตาม public/islands/README.md)
│  ├─ tiles/     <slug>.webp     ไอคอนฉากของแต่ละเกม 1:1
│  └─ items/     <pack>/<id>.webp  ของในเกม
├─ audio/
│  ├─ sfx/       correct.mp3 wrong.mp3 tap.mp3 level-complete.mp3
│  ├─ th/        (เดิม) เสียงอ่านไทย
│  └─ ar/        <letter>.mp3   ← ยังไม่มี (ดู D4)
└─ Character/    (เดิม) หุ่นยนต์

tests/
└─ games/
   ├─ memory.test.mjs   matching.test.mjs   puzzle.test.mjs
   ├─ sequence.test.mjs  search.test.mjs
   ├─ registry.test.mjs      ← ตรวจ slug ไม่ซ้ำ / ชื่อไทยไม่เกิน 3 คำ / content pack มีจริง
   └─ progress.test.mjs      ← ตรวจ migration + โควตาเต็ม
```

---

## 8. TypeScript Data Model

ทั้งหมดอยู่ใน `src/lib/games/types.ts`

```ts
/* ───────────── ช่วงวัย / หมวด ───────────── */
export type AgeGroup = "kids" | "juniors";          // คงชื่อเดิมจาก src/lib/games.ts
export type GameCategory =
  | "matching" | "logic" | "memory" | "spatial" | "language" | "observation";
export type Difficulty = "easy" | "normal" | "hard" | "expert";

/* ───────────── ทะเบียนเกม ───────────── */
export type GameDefinition = {
  /** ใช้เป็น key ภายใน ไม่โผล่ใน URL */
  id: string;
  /** ใช้ใน URL /games/<slug> — kebab-case, ห้ามซ้ำ */
  slug: string;
  nameTh: string;      // ≤ 3 คำ (registry.test.mjs บังคับ)
  nameEn: string;
  /** ประโยคโจทย์สั้นสำหรับ InstructionOverlay */
  instructionTh: string;
  instructionEn: string;
  /** ภาพฉาก 1:1 ใน public/games/tiles/ — ถ้ายังไม่มีให้ใส่ null แล้วใช้ placeholder SVG */
  tileImage: string | null;
  /** ชื่อ placeholder SVG ใน src/components/icons/GameIcon.tsx */
  tileIcon: GameIconName;
  /** token สีพื้นกรอบ (ต้องมีใน @theme) */
  accent: GameAccent;
  ageGroups: AgeGroup[];          // เกมเดียวลงได้หลายวัย ต่างกันที่ level
  category: GameCategory;
  /** engine ที่ใช้ — หลายเกมใช้ engine เดียวกันได้ */
  engine: EngineId;
  /** content pack เริ่มต้น */
  defaultPack: ContentPackId;
  /** pack อื่นที่เกมนี้รองรับ (ใช้ตอนเพิ่ม Islamic pack ภายหลัง) */
  supportedPacks: ContentPackId[];
  levels: LevelDefinition[];
  /** lazy import ของ board component — ห้าม static import (ดู §17.2) */
  loader: () => Promise<{ default: React.ComponentType<GameBoardProps> }>;
  /** false = แสดงป้าย "เร็วๆ นี้" และ generateStaticParams ข้ามไป */
  enabled: boolean;
  /** เริ่มเล่นเองหลังคำสั่ง 2.5s — ใช้กับเกมที่เด็กเล็กสุด */
  autoStart?: boolean;
};

export type GameAccent =
  | "sky" | "game-peach" | "game-mint" | "game-lilac"
  | "game-sun" | "game-rose" | "game-teal" | "game-sand";   // 4 ตัวใหม่ ดู §11.4

export type GameBoardProps = {
  definition: GameDefinition;
  level: LevelDefinition;
  ageGroup: AgeGroup;
};

/* ───────────── ระดับ ───────────── */
export type LevelDefinition = {
  id: string;                     // "easy" | "1" | "9-pieces"
  labelTh: string;
  labelEn: string;
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  /** จำนวนโจทย์ในด่าน */
  rounds: number;
  /** พารามิเตอร์เฉพาะ engine เช่น { pairs: 6 } หรือ { pieces: 9 } */
  params: Record<string, number | string | boolean>;
  /** จำกัด content ที่ใช้ในด่านนี้ — undefined = ใช้ทั้ง pack */
  itemIds?: string[];
  reward: RewardSpec;
};

export type RewardSpec = {
  /** ดาวเต็มของด่านนี้ */
  maxStars: 1 | 2 | 3;
  /** จำนวนคำตอบถูกที่ต้องได้ต่อดาว เช่น [3, 5, 8] */
  starThresholds: number[];
  /** id สติกเกอร์ที่ปลดล็อก (Phase 3) */
  stickerId?: string;
};

/* ───────────── เนื้อหา (แยกจาก engine เด็ดขาด) ───────────── */
export type ContentPackId =
  | "colors" | "shapes" | "numbers" | "sizes"
  | "islamic-objects" | "arabic-letters"
  | "adab" | "wudu" | "salah" | "dua";              // 4 ตัวหลังยังว่าง รอเนื้อหา

export type ContentPack = {
  id: ContentPackId;
  nameTh: string;
  nameEn: string;
  /** true = เนื้อหาศาสนา ต้องให้เจ้าของโปรเจกต์ตรวจก่อนเปิดใช้ */
  requiresReview: boolean;
  items: ContentItem[];
  /** กลุ่มที่ใช้เป็น category ในเกม Sort */
  groups?: ContentGroup[];
};

export type ContentItem = {
  id: string;
  labelTh: string;
  labelEn: string;
  /** ข้อความอาหรับ — แสดงได้ แต่ห้ามส่งเข้า TTS ไทย (ดู lessons.ts) */
  arabic?: string;
  /** คำอ่านไทย — ตัวนี้คือตัวที่ส่งเข้า speak() */
  reading?: string;
  /** ภาพ raster ใน public/games/items/ */
  image?: string;
  /** ชื่อ inline SVG ใน GameIcon — ใช้เมื่อยังไม่มีภาพ */
  icon?: GameIconName;
  /** สี hex สำหรับ pack colors เท่านั้น */
  swatch?: string;
  /** key ของไฟล์เสียงใน RECORDED_CLIPS — ไม่มี = ไม่มีเสียง */
  audioKey?: string;
  /** id ของกลุ่มที่ item นี้สังกัด ใช้กับเกม Sort */
  groupId?: string;
  /** ลำดับ ใช้กับเกม Sequence */
  order?: number;
};

export type ContentGroup = {
  id: string; labelTh: string; labelEn: string;
  icon?: GameIconName; swatch?: string;
};

/* ───────────── โจทย์ที่ engine เห็น (ไม่มีคำศาสนาใดๆ) ───────────── */
export type Challenge = {
  id: string;
  /** ของที่เด็กต้องจัดการ */
  subjects: ContentItem[];
  /** ตัวเลือก/ช่องรับ */
  targets: ContentItem[];
  /** map subjectId -> targetId ที่ถูก */
  solution: Record<string, string>;
  /** ประโยคโจทย์รอบนี้ เช่น "หาดาว" */
  promptTh?: string;
  promptEn?: string;
  promptAudioKey?: string;
};

/* ───────────── ความคืบหน้า ───────────── */
export type LevelProgress = {
  levelId: string;
  stars: 0 | 1 | 2 | 3;
  completed: boolean;
  /** จำนวนครั้งที่เล่นจบ — ใช้โชว์ในหน้าผู้ปกครอง ไม่โชว์ให้เด็ก */
  plays: number;
  /** ISO string */
  lastPlayedAt: string;
};

export type GameProgress = {
  gameId: string;
  levels: Record<string, LevelProgress>;
};

export type ProgressSnapshot = {
  /** เลข schema สำหรับ migration */
  version: 1;
  games: Record<string, GameProgress>;
  totalStars: number;
  stickers: string[];
  lastGameSlug?: string;
};
```

### 8.1 กติกา registry (บังคับด้วยเทสต์)

`tests/games/registry.test.mjs` ต้องตรวจ:
1. `slug` ไม่ซ้ำ และเป็น kebab-case `/^[a-z][a-z0-9-]*$/`
2. `nameTh.split(/\s+/).length <= 3`
3. `defaultPack` ต้องอยู่ใน `supportedPacks`
4. ทุก `ContentPackId` ที่อ้างถึงมี pack จริงและ `items.length > 0`
5. `levels` ต้องมีอย่างน้อยหนึ่งด่านต่อ `ageGroups` ที่ประกาศ
6. `starThresholds.length === maxStars` และเรียงขึ้น
7. `accent` ต้องเป็น token ที่มีใน `globals.css`
8. pack ที่ `requiresReview: true` ห้ามถูกอ้างจากเกมที่ `enabled: true` (กันเนื้อหาศาสนาหลุดก่อนตรวจ)
   > `islamic-objects` ต้องเป็น `requiresReview: false` เพราะทั้ง 6 ชิ้นขึ้นเว็บจริงและผ่านการอนุมัติแล้ว
   > ไม่งั้นเกมจับคู่ภาพที่ใช้งานอยู่ทุกวันนี้จะเปิดไม่ได้ (ดู §13 Game 3)

---

## 9. State Management Design

### 9.1 สามวงของ state — อย่าปนกัน

| วง | เก็บที่ | ตัวอย่าง | เหตุผล |
|---|---|---|---|
| **Ephemeral** (ในรอบเล่น) | `useReducer` ใน `GameShell` | phase, state ของ engine, effect queue | หายเมื่อออกจากหน้า ถูกต้องแล้ว |
| **Session** | React context | `pickedId` ของ drag | ต้องอ่านจากหลาย component ในหน้าเดียว |
| **Persistent** | external store + `localStorage` | ดาว, ด่านที่ผ่าน, เสียงเปิด/ปิด, เกมล่าสุด | ต้องรอด refresh |

**ห้ามใช้ state library ภายนอก** — `package.json` มีแค่ next/react/react-dom
เจตนาเดิมคือ zero-dep การเพิ่ม dependency เป็นสิทธิ์ของเจ้าของโปรเจกต์

### 9.2 Persistent state ต้องใช้แพตเทิร์นของ `soundStore.ts`

`src/lib/soundStore.ts` มี comment อธิบายบั๊กที่ต้องหลีกเลี่ยงไว้แล้ว:
อ่าน `localStorage` ใน `useState` initializer → HTML ฝั่งเซิร์ฟเวอร์ไม่ตรงกับ client → hydration error

`src/lib/progress/progressStore.ts` ต้องมีรูปเดียวกันเป๊ะ:

```ts
const STORAGE_KEY = "little-ummah:progress";
const listeners = new Set<() => void>();
let cached: ProgressSnapshot | null = null;

function readFromStorage(): ProgressSnapshot { /* try/catch, fallback EMPTY */ }
export function subscribeProgress(onChange: () => void): () => void
export function getProgressSnapshot(): ProgressSnapshot          // cached ??= read()
export function getProgressServerSnapshot(): ProgressSnapshot    // คืน EMPTY เสมอ
export function recordLevelResult(gameId: string, levelId: string, stars: 0|1|2|3): void
export function resetProgress(): void                            // สำหรับหน้าผู้ปกครอง
```

ใช้ผ่าน `useSyncExternalStore(subscribeProgress, getProgressSnapshot, getProgressServerSnapshot)`

**ผลข้างเคียงที่ต้องยอมรับ**: ดาวบน tile ใน `/games` จะไม่ขึ้นในการเรนเดอร์ครั้งแรก
แล้วปรากฏหลัง hydrate — **ต้องกันไม่ให้ layout ขยับ** ด้วยการจองที่แถวดาวไว้ตั้งแต่ต้น
(`min-h-6` บนแถวดาว) ห้ามให้ tile กระโดด

### 9.3 Effect queue — เชื่อม engine (pure) กับเสียง/animation (impure)

`reduce()` คืน `effects: GameEffect[]` เท่านั้น ไม่เล่นเสียงเอง
`GameShell` มี effect เดียวที่ drain queue:

```
dispatch(action) → engine.reduce → setState + enqueue(effects)
useEffect: drain queue → audioManager.play(...) / setCelebration(...) / speak(...)
```

ข้อดี: engine ทดสอบได้ด้วย `node:test` โดยไม่มี DOM และการกดรัวๆ ไม่ทำให้เสียงซ้อน
(`stopAllSpeech()` ใน `speech.ts` จัดการจุดเดียวอยู่แล้ว)

### 9.4 cleanup ที่ห้ามลืม

ทุก `setTimeout` ต้องเก็บใน `useRef` และ clear ใน cleanup (`MemoryGame.tsx` ทำถูกแล้ว)
เด็กกดปุ่มบ้านกลางคัน timer ค้างจะ setState บน component ที่ unmount แล้ว

---

## 10. Audio Architecture

### 10.1 ⚠️ DECISION D1 — ไม่มี `backgroundMusic`

`AGENTS.md` ข้อ 1.3 ห้ามดนตรีพื้นหลัง เพลงบรรเลง และเครื่องดนตรีทุกชนิด
brief ตั้งต้นระบุ channel `backgroundMusic` — **ตัดออกจากสเปกนี้ทั้งหมด**
ถ้าเจ้าของโปรเจกต์ยืนยันว่าต้องการ ต้องแก้ `AGENTS.md` ข้อ 1.3 ก่อน ไม่ใช่แก้ที่นี่

ห้ามในงานออกแบบด้วย: โน้ตดนตรี ♪ ♫, กีตาร์, เปียโน, กลอง — รวมถึงไอคอนปุ่มเสียง
ปุ่มเสียงใช้ `SpeakerIcon`/คลื่นเสียง ที่มีอยู่แล้วใน `src/components/icons/SpeakerIcon.tsx`

### 10.2 Channel ที่อนุญาต

```ts
// src/lib/games/audio/channels.ts
export const AUDIO_CHANNELS = {
  tap:            { file: "/audio/sfx/tap.mp3",            volume: 0.5, maxConcurrent: 2 },
  correct:        { file: "/audio/sfx/correct.mp3",        volume: 0.7, maxConcurrent: 1 },
  wrong:          { file: "/audio/sfx/wrong.mp3",          volume: 0.4, maxConcurrent: 1 },
  levelComplete:  { file: "/audio/sfx/level-complete.mp3", volume: 0.7, maxConcurrent: 1 },
} as const;
// voiceInstruction ไม่อยู่ในตารางนี้ — ใช้ speak() ของ SoundProvider
```

**สเปกไฟล์ที่ต้องขอจากเจ้าของโปรเจกต์** (ยังไม่มีในโปรเจกต์):

| ไฟล์ | ลักษณะ | ยาว | ห้าม |
|---|---|---|---|
| `tap.mp3` | เสียงแตะนุ่ม เช่น ไม้เคาะเบา | ≤ 150ms | ไม่มีโทนเสียงดนตรี ไม่มีทำนอง |
| `correct.mp3` | เสียงสดใสขึ้นสูง เช่น ประกายหรือกระดิ่งเบา | ≤ 600ms | **ห้ามเป็นทำนองเพลง** ห้ามใช้เสียงเครื่องดนตรี |
| `wrong.mp3` | เสียงต่ำนุ่ม ไม่มีความตกใจ | ≤ 400ms | ห้าม buzzer ห้ามเสียงระเบิด ห้ามเสียงผิดหวังของมนุษย์ |
| `level-complete.mp3` | เสียงดาวกระจาย/ประกายต่อกัน | ≤ 1.5s | **ห้ามเป็นเพลงจบด่าน** |
| `/audio/ar/<letter>.mp3` | เสียงอ่านตัวอักษรอาหรับโดยผู้อ่านจริง | ≤ 2s | ต้องเป็นเสียงคนอ่าน ไม่ใช่ TTS |

ทุกไฟล์ mono, 48kbps mono MP3 พอ, ≤ 20KB ต่อไฟล์
**ทุกไฟล์ต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit** — เกณฑ์ "ไม่ใช่ดนตรี" ตัดสินด้วยการฟัง

### 10.3 `AudioManager` ต่อยอด `SoundProvider` ไม่แทนที่

```ts
// src/lib/games/audio/audioManager.ts
export function preloadChannels(keys: AudioChannelKey[]): void
export function playChannel(key: AudioChannelKey): void   // no-op ถ้า getSoundSnapshot() === false
export function unlockAudio(): void                       // เรียกจาก user gesture แรก
export function stopAllChannels(): void
```

- ตรวจ `getSoundSnapshot()` จาก `soundStore.ts` ทุกครั้งก่อนเล่น — **ปุ่ม mute เดียวคุมทั้งเว็บ**
- ห้ามสร้าง key `localStorage` ใหม่สำหรับเสียงเกม ใช้ `little-ummah:sound` เดิม
- `maxConcurrent` ป้องกันเด็กกดรัวแล้วเสียงทับเป็นเสียงรบกวน
- เสียงพูดยังไปทาง `useSound().speak()` เดิม ซึ่งมี `RECORDED_CLIPS` → TTS เป็นชั้นสำรองอยู่แล้ว

### 10.4 Autoplay policy

เบราว์เซอร์ห้ามเล่นเสียงก่อน user gesture ระบบต้องรับมือแบบนี้:

1. `unlockAudio()` ถูกเรียกจากการแตะครั้งแรกใน `/games` (แตะ tile)
2. `InstructionOverlay` เล่นเสียงอ่านโจทย์อัตโนมัติ **เฉพาะเมื่อ unlock แล้ว**
3. ถ้ายังไม่ unlock: ไม่เล่น ไม่ error และ**ขึ้นปุ่ม "ฟังคำสั่ง" ให้เห็นชัด**
4. `playRecordedClip()` เดิมจับ `NotAllowedError` แล้วเงียบไว้ถูกต้องแล้ว — อย่าเปลี่ยน
5. ถ้า `speechBroken === true` (อุปกรณ์ไม่มีเสียงไทย) → **ต้องบอกให้ผู้ใช้รู้**
   ไม่ปล่อยให้ปุ่มขึ้นว่าเปิดเสียงแต่เงียบสนิท
   **ตรวจโค้ดแล้ว**: `SoundToggle.tsx` ทำครบทั้งจุดสีส้มมุมปุ่ม, `title` อธิบาย และข้อความ `sr-only`
   → **ใช้ `<SoundToggle/>` ตัวเดิมในหน้าเกม ห้ามเขียนปุ่มเสียงใหม่** ไม่งั้นสัญญาณเตือนนี้จะหายไป

---

## 11. Asset Architecture

> **อ่าน `AGENTS.md` ข้อ 1.5 (Visual Asset Rules) ก่อนสร้าง asset ใดๆ** — ข้อนั้นคุมทั้งหมดนี้
> สรุปที่กระทบ §11 โดยตรง:
> - **Primary palette ของ artwork**: น้ำเงิน · เทอร์ควอยซ์ · ขาว · ทอง
>   ส่วน accent token ใน §11.4 (`game-rose` `game-sand` `game-peach` …) เป็น**สีพื้นของ tile**
>   ไม่ใช่สีของ artwork — คนละหน้าที่ **ไม่ขัดกัน อย่าแก้อันหนึ่งให้ตรงอีกอัน**
> - **ของที่ลากได้ในเกม** ต้องเป็น **WebP/PNG พื้นหลังโปร่งใส** แยกชิ้น ห้ามมีพื้นสีติดมา
> - งานกราฟิก UI ง่ายๆ ใช้ SVG/CSS · ภาพ raster ใหญ่ใช้ WebP
> - หุ่นยนต์: ใช้ตัวเดิม ห้าม redesign — แต่ **เพิ่มท่าใหม่ในดีไซน์เดิมทำได้** (ดู §11.5)
> - ลาย Islamic geometric ใช้เป็นลายตกแต่งบางๆ ได้ · ห้ามฝังตัวหนังสือในภาพ

### 11.1 ⚠️ DECISION D6 — ภาพฉากบน tile เป็น raster

สไตล์ soft-3D / clay ทำด้วย inline SVG ไม่ได้จริง
→ ภาพจริงเป็น WebP ที่เจ้าของโปรเจกต์วาด/จัดหา ผ่าน pipeline เดิม

**ต้องสร้าง `public/games/README.md`** โดยลอกโครงจาก `public/islands/README.md`
ซึ่งเป็นเทมเพลตที่ดีอยู่แล้ว ต้องมีครบ:
- ตารางชื่อไฟล์ ↔ เกม ↔ สิ่งที่ควรอยู่ในฉาก
- สเปก: WebP, **1024 × 1024 px (1:1)**, พื้นหลังโปร่งใสหรือพื้นสี accent, ≤ 120KB/ไฟล์
- เว้นขอบว่างรอบด้าน ~6% เผื่อ `scale-[1.03]` ตอน hover
- **คำเตือนบังคับ (คัดจาก islands/README.md)**:
  - ห้ามฝังตัวหนังสือชื่อเกมในภาพ — ชื่อเป็นข้อความจริงในหน้าเว็บ
  - **ห้ามมีใบหน้ามนุษย์/สัตว์ที่มีตา จมูก ปาก** ทุกจุด รวมของเล่นจิ๋วในฉากหลัง
  - **ห้ามมีสัญลักษณ์ดนตรี**ทุกชนิด
  - แสงมาจากทิศเดียวกันทุกใบ (ซ้ายบน)
- ตารางขนาดที่แสดงจริง: มือถือ 320px→~140px, แท็บเล็ต 768px→~220px, เดสก์ท็อป→~200px

### 11.2 Pipeline

ใช้ `scripts/optimize-images.mjs` + `scripts/source-images.json` ที่มีอยู่
- `.png` ต้นฉบับ **ไม่เข้า git** (ขนาดรวมเกิน) ไฟล์ที่ commit คือ `.webp`
- ทุกใบต้องบันทึก sha256 ของต้นฉบับใน `source-images.json`
- ต้องขยายสคริปต์ให้รับโฟลเดอร์ `public/games/tiles/` และ `public/games/items/`

### 11.3 Placeholder ก่อนภาพมาถึง

ระบบต้อง build และเล่นได้ก่อนภาพจริงมา:
- `tileImage: null` → `GameTile` เรนเดอร์ `<GameIcon name={tileIcon}/>` บนพื้น accent
- ต้องเพิ่ม `GameIconName` ใหม่ **เฉพาะที่ยังไม่มี**: `"palette" | "shapes" | "puzzle" | "sequence" | "search" | "sort" | "star" | "hint" | "replay"`
- **ใช้ของเดิม ห้ามสร้างซ้ำ** (ตรวจ `src/components/icons/` แล้ว):

  | ต้องการ | ใช้ตัวที่มีอยู่ |
  |---|---|
  | ปุ่มเล่น | `PlayIcon` (`src/components/icons/PlayIcon.tsx`) — **ห้ามเพิ่ม `"play"` ใน `GameIcon`** |
  | ปุ่มบ้าน / ย้อนกลับ | `GameIcon name="back"` (ลูกศรซ้าย) — ไม่ต้องมี `"home"` แยก ลดจำนวนสัญลักษณ์ที่เด็กต้องเรียนรู้ |
  | ปุ่มเสียง | `SpeakerIcon` (มี prop `on` อยู่แล้ว) |
  | ป้าย "เร็วๆ นี้" | `GameIcon name="lock"` |
  | ติ๊กถูก | `GameIcon name="check"` |
  | ประกาย | `SparkleIcon` หรือ `GameIcon name="sparkle"` |
- ไอคอนใหม่เขียนในสไตล์เดิมของ `GameIcon.tsx` — `viewBox="0 0 120 120"`, `strokeWidth="5"`, เติมสีด้วย `var(--color-*)`
- **ห้ามวาดหน้า** ในไอคอนใดๆ — มี precedent ใน `GameIcon.tsx` แล้ว:
  comment ที่ `name === "letters"` บันทึกว่าอะลิฟซ้อนบาอ์ทำให้จุดกับเส้นโค้งดูเหมือนหน้ายิ้ม จึงย้ายตำแหน่ง ให้ระวังแบบเดียวกัน

### 11.4 Design token ใหม่

เพิ่มใน `src/app/globals.css` ใต้ `@theme` **เท่านั้น** — Tailwind v4 ไม่อ่าน `tailwind.config.ts`
(สร้างไฟล์ config จะถูกเมินเงียบๆ)

ต้องวัด contrast ของ `--color-ink` (`#1f2937`) บนพื้นใหม่ทุกสี **ก่อน** commit
และเขียนค่าที่วัดได้ไว้ใน comment ตามสไตล์ที่มีอยู่:

```css
@theme {
  /* ── สีพื้น tile เกม: ต้องอ่อนพอให้ ink ผ่าน 4.5:1 ── */
  /* ค่า contrast ด้านล่างวัดกับ --color-ink (#1f2937) ด้วยสูตร WCAG sRGB แล้ว
     ถ้าแก้ค่า hex ต้องวัดใหม่ทุกครั้ง อย่าถือว่าผ่านโดยอัตโนมัติ */
  --color-game-sun:  #ffeeb8;  /* ink 12.70:1 */
  --color-game-rose: #ffd9e2;  /* ink 11.38:1 */
  --color-game-teal: #c6ecef;  /* ink 11.64:1 */
  --color-game-sand: #f0e4cf;  /* ink 11.68:1 */

  /* ── ระยะเวลาแอนิเมชัน ให้ค่ากลางที่เดียว ── */
  --duration-tap: 75ms;
  --duration-hover: 200ms;
  --duration-feedback: 600ms;
}
```

### 11.5 หุ่นยนต์นำทาง — ท่าที่มี vs ท่าที่ต้องขอเพิ่ม

มีอยู่ใน `public/Character/`: `faith` `fighting` `idea` `play` `read` `welcome`

| ต้องใช้ตอน | ใช้ไฟล์ที่มี | ต้องขอใหม่ |
|---|---|---|
| Hub ต้อนรับ | `play.webp` | — |
| คำสั่งก่อนเล่น | `idea.webp` | — |
| ตอบถูก | `fighting.webp` (ชูแขน) | — |
| จบด่าน / ผลลัพธ์ | `fighting.webp` | `celebrate.webp` (ยกสองคีมขึ้น + ดาวรอบตัว) |
| ตอบผิด / ให้กำลังใจ | — | **`encourage.webp`** (คีมข้างหนึ่งชี้ขึ้น ไม่ใช่ท่าเสียใจ) |
| ชี้ของ (สอน drag) | — | **`point.webp`** (คีมยื่นไปข้างหน้า) |
| ถือป้าย | — | `sign.webp` (ป้ายว่าง ให้ใส่ข้อความด้วย HTML ทับ ไม่ฝังในภาพ) |

**ห้ามสเปกพฤติกรรมที่ต้องใช้ไฟล์ที่ยังไม่มี** — ตอบผิดใน Phase 1 ใช้ `WiggleFeedback` ที่ตัวของในเกม
ไม่มีหุ่นยนต์ปลอบ จนกว่า `encourage.webp` จะมาถึง

ข้อบังคับตัวละคร (ข้อ 1.2): เป็นเครื่องจักรชัดเจน มีใบหน้าได้ (ตา/ปาก/หน้าจอ)
แขนกลไก มือเป็นคีม เคลื่อนที่ด้วยตีนตะขาบ/ล้อเดี่ยว **ห้ามมีสัดส่วนมนุษย์จริง**
ส่วนหูกลมของหุ่นยนต์เป็นชิ้นส่วนเครื่องจักร ไม่นับเป็นหูฟัง (`AGENTS.md` ข้อ 1.3)

---

## 12. Progress Architecture

### 12.1 Phase 1 — `localStorage`

key เดียว: `little-ummah:progress` เก็บ `ProgressSnapshot` เป็น JSON
key เสียงยังเป็น `little-ummah:sound` เดิม (คนละ key เจตนา — ผู้ปกครองรีเซ็ตความคืบหน้าไม่ควรรีเซ็ตเสียง)

### 12.2 กฎการบันทึก — สำคัญกับความรู้สึกของเด็ก

1. **ดาวเพิ่มได้ ลดไม่ได้** — `stars = Math.max(existing, earned)` เล่นซ้ำได้ผลแย่กว่าไม่ลบของเก่า
2. **`completed` เป็น true แล้วไม่กลับเป็น false**
3. บันทึกตอน `complete` เท่านั้น ไม่บันทึกกลางด่าน (เด็กปิดหน้ากลางเกมไม่เป็นความผิด)
4. เขียนแบบกันพัง: `try/catch` รอบทุก `localStorage` ทั้งอ่านและเขียน
   quota เต็มหรือโหมดส่วนตัว → เกมต้องยังเล่นได้ แค่ไม่จำ
5. JSON เสียหาย → คืน `EMPTY_PROGRESS` และเขียนทับ ห้าม throw ขึ้นไปทำหน้าขาว

### 12.3 Schema versioning

```ts
// src/lib/progress/schema.ts
export const CURRENT_VERSION = 1;
export function migrate(raw: unknown): ProgressSnapshot
```
`migrate()` ต้องรับ `unknown` แล้ว validate ทุก field (ข้อมูลใน localStorage ไม่เชื่อถือได้)
version ไม่ตรงหรือไม่รู้จัก → คืน `EMPTY_PROGRESS` ไม่ crash
`tests/games/progress.test.mjs` ต้องทดสอบ: JSON เสีย / version อนาคต / field หาย / quota throw

### 12.4 Phase 2 — เตรียมต่อ database

ออกแบบ `progressStore.ts` ให้ซ่อนที่เก็บไว้หลัง interface:

```ts
export interface ProgressAdapter {
  read(): Promise<ProgressSnapshot> | ProgressSnapshot;
  write(next: ProgressSnapshot): Promise<void> | void;
}
```
Phase 1 = `localStorageAdapter` · Phase 2 = `apiAdapter` (+ merge ด้วย `max(stars)` ตามข้อ 12.2.1)
**ห้ามให้ component เรียก `localStorage` ตรงๆ** ผ่าน store เท่านั้น

### 12.5 แสดงที่ไหน

- `/games` tile: แถวดาวสูงสุดที่เคยได้ (จองที่ `min-h-6` ไว้ตั้งแต่ SSR)
- หน้าเกม header: `3 / 5` + ดาวของรอบนี้
- `/parents`: ตารางสรุป + ปุ่ม "เริ่มนับใหม่" (มี `GameModal` ยืนยัน)
- **ไม่มีอันดับ ไม่มีการเปรียบเทียบกับเด็กคนอื่น ไม่มี streak ที่ทำให้รู้สึกผิดเวลาหยุดเล่น**

---

## 13. สเปก 8 มินิเกม

ตารางสรุป engine ที่ใช้ร่วม — นี่คือหัวใจของ scalability:

| # | เกม | slug | engine | content pack | accent |
|---|---|---|---|---|---|
| 1 | สีและรูปทรง | `color-match` | `matching` | `colors` | `game-rose` |
| 2 | จับคู่รูปทรง | `shape-match` | `matching` | `shapes` | `game-teal` |
| 3 | จับคู่ภาพ | `memory` | `memory` | `islamic-objects` | `sky` |
| 4 | จิ๊กซอว์ | `puzzle` | `puzzle` | (ภาพเดี่ยว) | `game-peach` |
| 5 | อักษรอาหรับ | `arabic-match` | `matching` | `arabic-letters` | `game-lilac` |
| 6 | เรียงลำดับ | `sequence` | `sequence` | `numbers`, `sizes` | `game-mint` |
| 7 | ค้นหาของ | `find-object` | `search` | `islamic-objects` | `game-sun` |
| 8 | แยกหมวด | `sort` | `matching` | `colors`, `shapes`, `sizes` | `game-sand` |

**4 เกมใช้ `matching` engine ตัวเดียวกัน** — ต่างกันแค่ content pack และ presentation
นี่คือเหตุผลว่าทำไมเกมที่ 9–50 จะเพิ่มได้เร็ว

---

### GAME 1 — สีและรูปทรง / Color Match

- **engine**: `matching` · **pack**: `colors` · **interaction**: drag หรือ tap-to-place
- **content**: แดง เหลือง น้ำเงิน เขียว ส้ม ม่วง
  ```ts
  { id: "red", labelTh: "แดง", labelEn: "Red", swatch: "#d93025", audioKey: "color-red" }
  ```
- **โจทย์**: มีของ 1 ชิ้น (สีใดสีหนึ่ง) + ช่องสี N ช่อง ลากของไปช่องที่สีตรงกัน
- **สุ่มทุกรอบ**: ทั้งของที่ออกและลำดับช่อง (ผ่าน `start(state, random)`)
- **levels**:
  | id | วัย | ช่องสี | รอบ | ดาว |
  |---|---|---|---|---|
  | `easy` | kids | 2 | 5 | 3 (threshold 3/4/5) |
  | `normal` | kids | 3 | 6 | 3 |
  | `hard` | juniors | 6 | 8 | 3 |
- **⚠️ กฎ accessibility ที่สำคัญที่สุดของเกมนี้**: ห้ามใช้สีอย่างเดียว
  ทุกช่องสีต้องมี **(ก) ชื่อสีเป็นข้อความไทย (ข) ลายเส้นในช่องต่างกัน** (เช่น จุด/ทางขวาง/ตาราง)
  เด็กตาบอดสีต้องเล่นได้ และ `aria-label` ต้องพูดชื่อสี
- **feedback**: ถูก → ของหล่นลงช่อง + glow + ดาวกระจาย · ผิด → ของเด้งกลับที่เดิม + wiggle

### GAME 2 — จับคู่รูปทรง / Shape Match

- **engine**: `matching` · **pack**: `shapes`
- **content**: วงกลม สี่เหลี่ยมจัตุรัส สามเหลี่ยม สี่เหลี่ยมผืนผ้า ดาว (ขยายภายหลัง: วงรี หกเหลี่ยม หัวใจ)
  แต่ละ item มี `icon` เป็น inline SVG ไม่ใช่ภาพ raster (รูปทรงเป็นเรขาคณิต SVG เหมาะกว่า)
- **โจทย์**: ช่องเว้าตามรูปทรง (silhouette สีจาง) + ชิ้นรูปทรงสีสด ลากลงช่องที่พอดี
- **levels**: easy 3 รูป / normal 4 / hard 5 / expert 5 + หมุนชิ้น 90°(juniors เท่านั้น)
- **สำคัญ**: สี่เหลี่ยมจัตุรัสกับผืนผ้าต่างกันแค่สัดส่วน → ในด่าน easy ห้ามอยู่ด้วยกัน
  (`itemIds` ของด่าน easy ต้องคัดออก) เด็ก 3 ขวบยังแยกไม่ได้และจะรู้สึกว่าถูกหลอก

### GAME 3 — จับคู่ภาพ / Memory Match  ✅ มีอยู่แล้ว

- **engine**: `memory` — **ย้ายจาก `src/lib/memory-game.ts` ตาม §5.3 ห้ามเขียนใหม่**
- **pack**: `islamic-objects` = 6 item เดิมจาก `MEMORY_ITEMS`
  (ดวงจันทร์ โคมไฟ อินทผลัม อัลกุรอาน เสื่อละหมาด เหยือกน้ำ)
- **`requiresReview: false`** — ของทั้ง 6 ชิ้นขึ้นเว็บจริงและเจ้าของโปรเจกต์อนุมัติแล้ว
  ถ้าตั้งเป็น `true` เกมนี้จะเปิดไม่ได้เลยตามกฎ registry ข้อ 8 (§8.1) และ Phase 0 จะไม่ผ่านเทสต์ตัวเอง
  **item ที่เพิ่มใหม่ภายหลังต้องให้เจ้าของโปรเจกต์ตรวจก่อนเสมอ**
- **levels** — ตาม brief 6/12/16 การ์ด (= 3/6/8 คู่) ซึ่งลงตัวทั้งหมด
  ตัวจำกัดจริงคือ pack มี item แค่ 6 ชิ้น จึงทำได้ถึง 12 การ์ดเท่านั้นในตอนนี้:
  | id | วัย | คู่ | การ์ด | grid |
  |---|---|---|---|---|
  | `easy` | kids | 3 | 6 | 2×3 / sm 3×2 |
  | `normal` | juniors | 6 | 12 | 3×4 / sm 4×3 |
  | `hard` | juniors | 8 | 16 | 4×4 |
  > `normal`/`hard` ต้องเพิ่ม item ใน pack ให้ถึง 8 ชิ้น — ขอภาพเพิ่ม 2 ชิ้น
  > ข้อเสนอ: พรม/สายประคำนับ (ไม่ใช่ตัวบุคคล) และดาวประดับ · เจ้าของโปรเจกต์เลือก
- **คงพฤติกรรมที่ถูกอยู่แล้วไว้ทั้งหมด**: การ์ดที่จับคู่แล้ว**ห้าม `disabled`** (โฟกัสคีย์บอร์ดจะหลุด)
  ใช้ `aria-disabled` แทน · เปิดภาพด้วย state ไม่ใช่หมุน 3D · `aria-label` บอกเลขใบและสถานะ

### GAME 4 — จิ๊กซอว์ / Puzzle

- **engine**: `puzzle` · **content**: ภาพเดี่ยวจาก `public/games/items/puzzle/*.webp`
- **ชิ้น**: 4 / 6 / 9 / 12 — **ตัดเป็นสี่เหลี่ยมกริดล้วน ไม่มีเดือยจิ๊กซอว์ใน Phase 1**
  (เดือยต้อง SVG clip-path ต่อชิ้น ซึ่งเกินขอบเขต Phase 1 — Phase 3 ค่อยทำ)
- **วิธี**: ชิ้นกระจายอยู่ในถาดด้านล่าง (มือถือ) หรือด้านข้าง (เดสก์ท็อป) ลากไปวางบนกริดเงา
- **snap**: ถ้าปล่อยห่างจากช่องที่ถูก ≤ 24px → snap เข้าที่ · ไกลกว่านั้น → กลับถาด
- **ผ่อนปรนเด็กเล็ก**: ด่าน 4 ชิ้น ถ้าปล่อยในกริดที่ไหนก็ได้และเป็นชิ้นเดียวที่เหลือ → ให้เข้าที่ถูก
- **ภาพที่ใช้ห้ามมีใบหน้า** — เลือกฉากเกาะ/มัสยิด/ลายเรขาคณิต
- **preview**: มีปุ่ม "ดูภาพเต็ม" กดค้างเพื่อดูภาพต้นฉบับจาง 30% ทับกริด

### GAME 5 — จับคู่อักษรอาหรับ / Arabic Letter Match

- **engine**: `matching` · **pack**: `arabic-letters`
- **content** — architecture ต้องรับ 28 ตัวได้ครบ แต่ Phase 1 ใส่ 7 ตัวแรกที่ `lessons.ts` มีแล้ว:
  ```ts
  { id: "alif", arabic: "ا", labelTh: "อะลิฟ", labelEn: "Alif",
    reading: "อะลิฟ", audioKey: "ar-alif" }   // reading คือตัวที่ส่งเข้า speak()
  ```
  ا ب ت ث ج ح خ → ขยายครบ 28 ตัวโดยเพิ่มใน `arabic-letters.ts` ที่เดียว ไม่แตะ engine
- **3 modes**:
  | mode | จับคู่ | สถานะ |
  |---|---|---|
  | `letter-letter` | ตัวอักษร ↔ ตัวอักษรเดียวกัน (คนละสี/ขนาด) | ✅ Phase 2 (§18 ข้อ 22) |
  | `letter-object` | ตัวอักษร ↔ ของที่ขึ้นต้นด้วยตัวนั้น | Phase 3 (รอภาพ) |
  | `letter-sound` | ฟังเสียง → เลือกตัวอักษร | **⚠️ `enabled: false`** ดู D4 |
- **⚠️ DECISION D4 — ทำไม `letter-sound` ปิดไว้**
  `speech.ts` ตั้ง `utterance.lang = "th-TH"` ตายตัว และ `lessons.ts` บันทึกไว้แล้วว่า
  *"ข้อความภาษาอาหรับ … ไม่ส่งให้เสียงอ่าน (เสียงไทยอ่านอาหรับไม่ได้)"*
  mode นี้จึงต้องพึ่งไฟล์เสียงจริงใน `public/audio/ar/` ซึ่งยังไม่มี
  ถ้าเปิดตอนนี้ เด็กที่อ่านไม่ออกจะกดแล้วเงียบสนิท — เป็นความล้มเหลวแบบเดียวกับที่
  `speechBroken` ถูกเขียนขึ้นมาป้องกัน
  **วิธีเปิดใช้**: วางไฟล์ → เพิ่ม key ใน `RECORDED_CLIPS` (`speech.ts`) → `enabled: true`
- **RTL**: ทุกกล่องที่แสดงอาหรับใส่ `lang="ar" dir="rtl"` และในด่านที่มีหลายตัวเรียงกัน
  ต้องเรียง**ขวาไปซ้าย** สอดคล้องกับที่ `lessons.ts` สอนไว้

### GAME 6 — เรียงลำดับ / Sequence

- **engine**: `sequence` · **pack**: `numbers`, `sizes`
- **content**: item มี `order: number` — engine เรียงตามฟิลด์นี้ ไม่รู้ว่าเรียงอะไร
  จึงใช้กับลำดับอื่นภายหลังได้ทันที (ขั้นตอนอาบน้ำละหมาด, เวลาละหมาด, ลำดับวัน)
- **โจทย์**: ช่องว่างเรียงกัน 3–6 ช่อง + ชิ้นสลับลำดับในถาด ลากใส่ให้เรียงถูก
- **levels**: 1→3 / 1→5 / เล็ก-กลาง-ใหญ่ / 1→10 (juniors)
- **ตรวจคำตอบตอนใส่ครบ** ไม่ตรวจทีละชิ้น — ต้องให้เด็กสลับที่ได้ระหว่างคิด
  ถ้าตรวจทีละชิ้นจะกลายเป็นเกมทายผิดถูกและเด็กแก้ไม่ได้
- **ทิศทาง**: ซ้าย→ขวา พร้อมลูกศรกำกับทิศทางชัดเจน (เด็กไทยอ่านซ้ายไปขวา)
  ถ้าภายหลังใช้กับลำดับอาหรับ ให้ค่า `direction: "rtl"` ใน `params` ได้

### GAME 7 — ค้นหาของ / Find the Object

- **engine**: `search` · **pack**: `islamic-objects` (ขยายเป็น scene pack ภายหลัง)
- **โจทย์**: ฉากมีของ 8–20 ชิ้นกระจาย + แถบโจทย์ "หาดาว" (ภาพ + ข้อความ + เสียงอ่าน)
- **interaction**: แตะของที่ถูก → glow + ติ๊กถูก · แตะผิด → ของนั้น wiggle เบา **ไม่หักคะแนน ไม่จำกัดครั้ง**
- **levels**: easy 8 ชิ้น หา 3 / normal 14 หา 5 / hard 20 หา 6 + ของหลอกที่คล้ายเป้าหมาย
- **hint**: ถ้าไม่แตะถูกภายใน 20 วินาที → ของเป้าหมายกระพริบขอบ 2 รอบ (ไม่ใช่แสงวูบ)
  ต้องมีปุ่ม "ช่วยหน่อย" ที่ bottom bar ด้วย เพื่อให้เด็กเรียกเองได้ไม่ต้องรอ
- **tap target**: ของทุกชิ้นต้องมี hit area ≥ 48px แม้ภาพจะเล็กกว่านั้น
  (ใช้ `padding` บน `<button>` ไม่ใช่ขยายภาพ)
- **⚠️ ฉากต้องไม่มีใบหน้า** — ตรวจภาพทุกใบก่อนวาง ข้อ 1.1 ครอบถึงของจิ๋วในฉากหลัง

### GAME 8 — แยกหมวด / Sort Objects

- **engine**: `matching` (ใช้ `ContentGroup` เป็น target) · **pack**: `colors`/`shapes`/`sizes`
- **โจทย์**: ตะกร้า 2–4 ใบ (กลุ่ม) + ของกองรวม ลากของใส่ตะกร้าที่ถูกกลุ่ม
- **levels**: 2 ตะกร้า 6 ชิ้น / 3 ตะกร้า 9 / 4 ตะกร้า 12
- **ป้ายตะกร้า**: ต้องมี **ไอคอน + ข้อความไทย** ห้ามใช้สีเป็นตัวบอกกลุ่มอย่างเดียว
- **ขยายเป็นเนื้อหาอิสลามภายหลัง**: เพิ่ม pack `adab` (`groups: ["ทำได้", "ไม่ควรทำ"]`) ได้โดยไม่แตะ engine
  **แต่** pack นั้นต้อง `requiresReview: true` และ `enabled: false` จนเจ้าของโปรเจกต์ตรวจเนื้อหา
  (เหตุผลเดียวกับที่ `lessons.ts` ไม่ใส่เลขอ้างอิงอายะฮ์/หะดีษ)

---

## 14. Mobile Responsive Behavior

### 14.1 Breakpoint และพฤติกรรม

| ช่วง | Hub grid | header | ถาดชิ้นเกม | ขนาดปุ่มหลัก |
|---|---|---|---|---|
| < 40rem (มือถือ) | 2 คอลัมน์ | สูง 64px ไอคอนล้วน | แถบล่าง เลื่อนขวางได้ | 72px |
| ≥ 40rem (แท็บเล็ต) | 3 คอลัมน์ | สูง 72px มีข้อความ | แถบล่าง | 80px |
| ≥ 64rem (เดสก์ท็อป) | 4 คอลัมน์ | สูง 72px | คอลัมน์ข้าง | 72px |
| ≥ 80rem | 5 คอลัมน์ | — | คอลัมน์ข้าง | 72px |

- ออกแบบจากจอเล็กขึ้นไป (mobile-first) — เขียน base class แล้วเติม `sm:` `lg:` ไม่ใช่ทางกลับ
- **แนวนอนบนมือถือ (เตี้ยมาก)**: `@media (max-height: 26rem)` → ย่อ header เป็น 56px
  และย้ายถาดชิ้นไปด้านขวา ไม่งั้นพื้นที่เล่นเหลือไม่ถึงครึ่งจอ
- **ห้ามให้หน้าเกม scroll แนวตั้ง** — พื้นที่เล่นต้องพอดีจอ ใช้ `dvh` ไม่ใช่ `vh`
  (`100vh` บน iOS Safari นับรวมแถบที่ยุบได้ ทำให้ปุ่มล่างถูกบัง)
  ```
  min-h-[100dvh]  และ  height: calc(100dvh - var(--game-header-h))
  ```
- **ตาราง/กริดที่กว้างเกิน** ให้ห่อ `overflow-x-auto` เฉพาะตัวมัน หน้าไม่เลื่อนขวาง

### 14.2 ⚠️ DECISION D5 — Drag & Drop: Pointer Events + tap fallback

**ห้ามใช้ HTML5 Drag and Drop API** (`draggable`, `dragstart`, `dataTransfer`)
เพราะบน touch ไม่ทำงาน และแท็บเล็ตคืออุปกรณ์หลัก
**ห้ามเพิ่ม library** (dnd-kit / react-dnd) โดยไม่ถามเจ้าของโปรเจกต์ — ค่าเริ่มต้นคือ zero-dep

**สองทางที่ทำงานพร้อมกัน หนึ่งกลไกเดียว ครบทั้ง touch/mouse/keyboard:**

```
ทาง A — ลาก (Pointer Events)
  pointerdown  → ถ้าเลื่อนเกิน 8px ภายใน 250ms = เริ่มลาก
                 setPointerCapture() ล็อก event ไว้กับ element
                 touch-action: none บนตัวที่ลาก (กันหน้าเลื่อนตาม)
  pointermove  → transform: translate3d(dx, dy, 0)  ← ห้ามแตะ left/top
                 หา DropZone ใต้นิ้วด้วยการเทียบ rect ที่ cache ไว้ตอน pointerdown
                 (ห้ามเรียก getBoundingClientRect ใน pointermove — jank)
  pointerup    → อยู่ใน zone → dispatch(drop) · ไม่อยู่ → เด้งกลับ 200ms
  pointercancel → เด้งกลับเสมอ (สายโทรเข้า, นิ้วที่สองแตะ)

ทาง B — แตะเลือกแล้วแตะวาง  ← เป็นทั้ง touch fallback และ keyboard path
  แตะของ (ไม่เลื่อน)   → ของนั้นถูก "ยกขึ้น": ขอบหนา + ยกลอย + DropZone ทุกช่องขึ้นสถานะ armed
                          speak(ชื่อของ) + aria-live "ยก <ชื่อ> แล้ว เลือกช่องที่จะวาง"
  แตะช่อง              → วาง
  แตะของเดิมซ้ำ / Esc  → ยกเลิก
```

**Keyboard = ทาง B ตรงๆ** ไม่ต้องเขียนโค้ดชุดที่สอง:
`Tab` ไปที่ของ → `Enter`/`Space` ยก → `Tab` ไปที่ช่อง → `Enter` วาง → `Esc` ยกเลิก

**สเปกที่ต้องทำตาม**:
- `DropZone` ≥ 64px ทุกด้าน (ข้อ 2) และมีระยะห่างกัน ≥ 12px กันวางผิดช่อง
- ตอนลาก ของต้องอยู่ใต้นิ้วพอดี แต่ **เลื่อนขึ้น 24px** ไม่งั้นนิ้วเด็กบังของทั้งชิ้น
- สถานะ zone 3 แบบต้องต่างกันด้วย **รูปทรง ไม่ใช่สีอย่างเดียว**:
  idle = เส้นประ · armed = เส้นทึบ + ลูกศรลง · hovered = เส้นหนา + พื้นเข้มขึ้น + ขยาย `scale-[1.05]`
- `user-select: none` บนพื้นที่เล่น (กันเด็กลากแล้วเลือกข้อความทั้งหน้า)
- **แตะครั้งเดียวต้องได้ผล** ห้ามให้แตะรอบแรกเป็นการเปิด hover (`AGENTS.md` ข้อ 2.1)

---

## 15. Accessibility

### 15.1 เช็กลิสต์บังคับต่อเกม (ต้องผ่านทุกข้อก่อน `enabled: true`)

| # | ข้อ | วิธีตรวจ |
|---|---|---|
| 1 | tap target ≥ 64px สำหรับเด็ก, ≥ 48px ฝั่งผู้ปกครอง | DevTools วัดจริง |
| 2 | contrast ข้อความปกติ ≥ 4.5:1, ใหญ่ ≥ 3:1 | วัดทุกคู่สี เขียนค่าใน comment |
| 3 | ไม่สื่อความหมายด้วยสีอย่างเดียว | ปิดสีเป็น grayscale แล้วยังเล่นจบได้ |
| 4 | ทุก element ที่โฟกัสได้มี focus state ชัด | Tab ทั้งหน้า (`:focus-visible` ใน `globals.css` มีให้แล้ว) |
| 5 | เล่นจบได้ด้วยคีย์บอร์ดล้วน | ไม่ใช้เมาส์เลย |
| 6 | `prefers-reduced-motion` → ไม่มี transform กระโดด | เปิด OS setting แล้วลอง |
| 7 | ปิดเสียง → ยังรู้ว่าถูก/ผิด | toggle mute แล้วเล่น |
| 8 | screen reader อ่านสถานะได้ | อ่านผ่าน `aria-live` ครบทุกการเปลี่ยน |
| 9 | ภาพสื่อความหมายมี alt จริง / ภาพตกแต่ง `alt=""` | ทบทวนทุก `<Image>` |
| 10 | หน้าไม่เลื่อนขวางที่ 320px | DevTools 320×568 |

### 15.2 ARIA — ใช้แบบที่โค้ดเดิมทำถูกอยู่แล้ว

- **`role="status" aria-live="polite" aria-atomic="true"`** สำหรับข้อความสถานะ
  `MemoryGame.tsx` ทำไว้ถูกแล้ว: `min-h-12` จองที่ไว้กัน layout ขยับตอนข้อความเปลี่ยน
  **ใช้แพตเทิร์นนี้ทุกเกม** ประกาศทุกครั้งที่: ยกของ / วางของ / ถูก / ผิด / จบด่าน
- **ห้าม `disabled`** บน element ที่ยังต้องโฟกัสได้ ใช้ `aria-disabled` แทน
  (comment ใน `MemoryGame.tsx` บันทึกเหตุผล: โฟกัสคีย์บอร์ดหลุดหายกลางเกม)
- `aria-label` ต้องบอก **ตำแหน่ง + เนื้อหา + สถานะ** เช่น
  `"การ์ดใบที่ 3, คว่ำอยู่"` / `"ช่องสีแดง, ว่าง, กด Enter เพื่อวาง"`
- `InstructionOverlay`: `role="dialog" aria-modal="true"` + focus trap + `Esc` ปิดได้
- ไอคอน SVG ตกแต่ง: `aria-hidden="true"` ให้ข้อความข้างๆ เป็นตัวอ่าน
- ภาพหุ่นยนต์ที่ซ้ำกับข้อความในลิงก์เดียวกัน: `alt=""`
  (เกณฑ์จาก `AGENTS.md` ข้อ 2: ลบภาพออกแล้วผู้ใช้ยังได้ข้อมูลครบ = ภาพตกแต่ง)

### 15.3 ภาษา

- `<html lang="th">` (มีแล้ว) · ข้อความอังกฤษใส่ `lang="en"` · อาหรับใส่ `lang="ar" dir="rtl"`
- **ไทยนำ อังกฤษรอง** ทุกป้ายที่เด็กต้องใช้นำทาง: ชื่อเกม ปุ่ม คำอธิบาย โจทย์
- ข้อความตกแต่ง (คำขวัญ/หัวเรื่องโค้ง) เป็นอังกฤษล้วนได้ ตามข้อยกเว้นใน `AGENTS.md`

---

## 16. Animation Specification

### 16.1 กฎเหล็กจาก `AGENTS.md` ข้อ 2.1 — คัดมาตรงตัว ห้ามตีความใหม่

| กรณี | สเปก |
|---|---|
| **การ์ด** (ภาพเหนือข้อความ) | hover ขยับ **กรอบภาพเท่านั้น** `-translate-y-1` + `scale-[1.03]` · **ข้อความอยู่นิ่ง** |
| **ปุ่ม** (ป้ายสั้น) | ยกทั้งปุ่มได้ `-translate-y-0.5` |
| ทั้งสอง | ~200ms ease-out · ระบุเฉพาะ property ที่เปลี่ยน **ห้าม `transition-all`** |
| เงา | **เพิ่มขึ้น**ตอน hover `shadow-soft` → `shadow-float` ไม่ใช่ลดลง |
| transform ทุกครั้ง | ต้องมี **`motion-safe:`** — `prefers-reduced-motion` ใน `globals.css` ตัดแค่ *duration* ค่า transform ยังกระโดด |
| fallback ปิด motion | เงาไม่ใช่ transform จึงยังทำงาน — **ทุกปุ่ม/การ์ดต้องมี** |
| แตะ | `active:scale-[0.98]` ~75ms |
| sticky hover | Tailwind v4 ครอบ `hover:` ด้วย `@media (hover:hover)` ให้แล้ว **ไม่ต้องเขียน media query เอง** |
| กัน layout ขยับ | กำหนด `aspect-ratio`/ขนาดคงที่ให้กรอบภาพตั้งแต่ต้น |
| การ์ดขยายทับกัน | `overflow-hidden` ที่ **กรอบภาพเท่านั้น** ห้ามครอบทั้งการ์ด (จะบัง focus outline) |
| หนึ่งการ์ด | หนึ่ง `<Link>` ครอบทั้งใบ ห้ามซ้อนลิงก์ย่อย |

**ห้ามเด็ดขาด**: กระพริบแสง · ลอย/เด้งวนตลอดเวลา · หมุน/เอียงตามเมาส์ · ซูมจนข้อความขยับ

> **Reference ที่ถูกต้อง**: `src/components/games/GameTile.tsx` และ `GameNavigation.tsx`
> ทำตามกฎนี้ครบแล้ว ให้ Codex ลอกรูปแบบ class จากสองไฟล์นี้ ไม่ต้องคิดใหม่

### 16.2 Animation ในเกม

| เหตุการณ์ | สเปก | motion-safe? |
|---|---|---|
| hover tile | กรอบภาพ `-translate-y-1 scale-[1.03]` + `shadow-float` 200ms | ✅ ต้องมี |
| แตะ tile | `scale-[0.98]` 75ms | ✅ |
| เข้า/ออกหน้าเกม | fade + `translate-y-2` 250ms | ✅ (ปิด motion → fade เพียว) |
| ยกของ (tap-to-select) | `scale-[1.06]` + `shadow-float` + ขอบหนา 150ms | ✅ (ปิด motion → ขอบหนาอยู่ ยังรู้ว่ายกแล้ว) |
| ลากของ | `translate3d` ตามนิ้ว **ไม่มี transition** | — |
| ปล่อยผิดที่ | เด้งกลับตำแหน่งเดิม 200ms ease-out | ✅ (ปิด motion → หายไปโผล่ที่เดิมทันที) |
| ตอบถูก | ของ glow 200ms → `CelebrationEffect` ดาว 8–12 ดวง 600ms | ✅ (ปิด motion → ดาวขึ้นนิ่ง 600ms + ข้อความ "ถูกต้อง!") |
| ตอบผิด | `WiggleFeedback` ±6px 2 รอบ 400ms | ✅ (ปิด motion → ขอบเปลี่ยนหนา + ข้อความ "ลองอีกครั้ง") |
| จบด่าน | ดาวลอยจากจุดที่ได้ไปที่ตัวนับ 400ms/ดวง ห่างกัน 150ms | ✅ (ปิด motion → ดาวเติมที่ตัวนับทีละดวง 150ms) |
| DropZone armed | เส้นประ → เส้นทึบ + ลูกศรลง (ไม่ใช่ transform) | ไม่ต้อง |

### 16.3 เทคนิค

- ใช้ `transform` และ `opacity` เท่านั้น — **ห้าม animate `left/top/width/height/margin`**
- `will-change: transform` ใส่**เฉพาะตอนกำลังลาก** แล้วเอาออก (ใส่ค้างกินหน่วยความจำ)
- ประกาศ property ชัดเจน: `transition-[transform,box-shadow]` ไม่ใช่ `transition-all`
- ห้าม animate อะไรวนลูปตลอดเวลาในหน้าเกม — พื้นที่เล่นต้องนิ่งให้เด็กคิด

---

## 17. Performance Strategy

### 17.1 เป้าหมาย

| ตัวชี้วัด | เป้า | อุปกรณ์อ้างอิง |
|---|---|---|
| animation | 60fps (ยอมได้ 30fps ต่ำสุด) | Android กลาง ~2 ปี / iPad รุ่นพื้นฐาน |
| JS ของ `/games` | ≤ 120KB gzip | — |
| JS ต่อเกม (lazy) | ≤ 60KB gzip | — |
| LCP `/games` | ≤ 2.5s บน 4G | — |
| ไม่มี CLS จาก tile | 0 | จอง `aspect-square` + `min-h` แถวดาว |

### 17.2 Code splitting — หัวใจของการรับ 30–50 เกม

**ห้าม static import board component ใดๆ ใน `registry.ts`** ถ้าทำ bundle ของ `/games` จะรวมทุกเกม

```ts
// ✅ ถูก — อยู่ใน GameDefinition
loader: () => import("@/components/games/color-match/ColorMatchBoard")

// ❌ ผิด — ดึงทุกเกมเข้า bundle ของ Hub
import ColorMatchBoard from "@/components/games/color-match/ColorMatchBoard";
```

ใน `app/games/[slug]/page.tsx` โหลดด้วย `next/dynamic` + `loading` skeleton ที่มีขนาดเท่าของจริง
Hub นำเข้าเฉพาะ metadata (ชื่อ/ภาพ/สี/ระดับ) — **`registry.ts` ต้องไม่ import โค้ดเกมใดๆ**

`tests/games/registry.test.mjs` ควรตรวจข้อนี้ด้วย: ทุก entry ต้องมี `loader` เป็น function

### 17.3 ภาพ

- ใช้ `next/image` ทุกที่ · WebP · `sizes` ตรงกับขนาดที่แสดงจริง (ดูตารางใน §14.1)
- tile ในหน้าจอแรก (2–4 ใบแรก): `priority` · ที่เหลือ lazy (ค่าเริ่มต้น)
- ภาพในเกมยัง **ไม่โหลด** จน navigate เข้าเกม (มาพร้อม dynamic chunk)
- **preload ตอน hover/focus tile**: `<link rel="prefetch">` หรือเรียก `loader()` ล่วงหน้า
  เพื่อให้แตะแล้วเข้าเกมทันที (ผลกระทบใหญ่ที่สุดต่อความรู้สึก "เป็นแอป")

### 17.4 เสียง

- `preloadChannels(["tap","correct","wrong"])` ตอนเข้าหน้าเกม (รวม ≤ 60KB)
- `level-complete.mp3` โหลดตอน `solved >= total - 1` (ใกล้จบ) ไม่ต้องโหลดตั้งแต่ต้น
- ไฟล์เสียงอ่านอาหรับโหลดเฉพาะตัวอักษรที่อยู่ในด่านนั้น ไม่โหลดทั้ง 28 ตัว

### 17.5 Runtime

- pointermove: cache `getBoundingClientRect()` ของทุก zone ตอน `pointerdown` ครั้งเดียว
- ไม่ setState ทุก pointermove — เขียน `transform` ตรงกับ DOM node ผ่าน `ref`
  แล้ว setState เฉพาะตอนเปลี่ยน zone (ลดการ re-render จาก 60/วิ เหลือไม่กี่ครั้ง)
- `CelebrationEffect`: ดาวไม่เกิน 12 ดวง ทุกดวงเป็น CSS animation ไม่ใช่ JS ราย frame
  ห้ามใช้ canvas particle library
- **ห้าม `filter: blur()` ในหน้าเกม** — เหตุผลบันทึกไว้ใน `globals.css` แล้ว (แท็บเล็ตราคาประหยัด)
- `GameShell` เป็น client แต่ `page.tsx` เป็น server — metadata, registry lookup, `generateStaticParams`
  ทำฝั่งเซิร์ฟเวอร์ทั้งหมด

---

## 18. Implementation Roadmap

แต่ละ Phase จบด้วยรอบตาม `AGENTS.md` ข้อ 5: `npm run build` ผ่าน → Codex review diff → เจ้าของโปรเจกต์อนุมัติ → commit
**ห้าม commit เองก่อนได้อนุมัติ**

### Phase 0 — ฐานราก (ไม่มีเกมใหม่ ไม่มีของหาย)
1. สร้าง `src/lib/games/types.ts` ครบตาม §8
2. สร้าง `src/lib/games/engines/types.ts` (`GameEngine`, `GameEffect`)
3. ย้าย `memory-game.ts` → `engines/memory.ts` + `MEMORY_ITEMS` → `content/islamic-objects.ts`
4. ย้าย `tests/memory-game.test.mjs` → `tests/games/memory.test.mjs` — **ต้องยังผ่าน**
5. เพิ่ม `"test"` script ใน `package.json`
6. สร้าง `src/lib/progress/progressStore.ts` + `schema.ts` + เทสต์
7. เพิ่ม `@theme` token 4 สี + `--duration-*` พร้อมค่า contrast ที่วัดจริง
8. เพิ่ม `StarIcon` และไอคอนใหม่ใน `GameIcon.tsx`

**ผลที่ได้**: เว็บทำงานเหมือนเดิมทุกอย่าง ไม่มีอะไรพัง โครงพร้อมรับของใหม่

### Phase 1 — Hub + 3 เกมแรก
9. `app/games/layout.tsx` + `app/games/page.tsx` + `[slug]/page.tsx`
10. redirects ใน `next.config.ts` + แก้ `categories.ts` → `/games` + ลบ `app/learn/games/**`
11. `GameShell` `GameHeader` `GameProgress` `InstructionOverlay` `GameResultScreen`
12. `AudioManager` + channel (ยังไม่มีไฟล์เสียงจริง → no-op เงียบๆ ไม่ error)
13. `CelebrationEffect` `StarReward` `WiggleFeedback`
14. **Memory** — เกมแรกที่ย้ายมาอยู่ใต้ `GameShell` (พิสูจน์ว่า shell ใช้ได้กับเกมที่มีอยู่)
15. `dnd/` ครบ (`DragProvider` `DragItem` `DropZone` `useDragOrTap`) + เทสต์ logic
16. **Color Match** และ **Shape Match** (ใช้ `matching` engine ตัวเดียว พิสูจน์การ reuse)
17. `public/games/README.md` + สเปกเสียงส่งให้เจ้าของโปรเจกต์
18. ไล่เช็กลิสต์ §15.1 ทั้ง 10 ข้อกับ 3 เกม

**เกณฑ์ผ่าน Phase 1**: 3 เกมเล่นจบได้ด้วยคีย์บอร์ดล้วน · เล่นได้ตอนปิดเสียง · เล่นได้ตอนปิด motion
· ที่ 320px ไม่เลื่อนขวาง · `npm run build` ผ่าน

### Phase 2 — เกมที่เหลือ 5 เกม
19. **Sort** (reuse `matching` — งานน้อยสุด ทำก่อน)
20. **Sequence** engine + เกม
21. **Find the Object** engine + เกม
22. **Arabic Letter Match** (`letter-letter` เท่านั้น · `letter-sound` `enabled: false`)
23. **Puzzle** engine + เกม (ซับซ้อนสุด ทำท้าย)
24. หน้า `/parents` เพิ่มตารางความคืบหน้า + ปุ่มรีเซ็ต
25. ใส่ไฟล์เสียง sfx จริงเมื่อได้รับและเจ้าของโปรเจกต์อนุมัติแล้ว

### Phase 3 — ขยายและขัดเงา
26. Content pack อิสลาม (`adab` `wudu` `salah` `dua`) — **ทุก pack `requiresReview: true`**
    เนื้อหาต้องผ่านเจ้าของโปรเจกต์ก่อน `enabled: true` (แนวเดียวกับ `lessons.ts`)
27. เสียงอ่านอาหรับ → เปิด `letter-sound`
28. สมุดสติกเกอร์สะสม (`StickerAlbum`)
29. ภาพ tile จริงแทน placeholder SVG
30. เดือยจิ๊กซอว์จริง (SVG clip-path)
31. PWA: `manifest.json` (`start_url: "/games"`, `display: "standalone"`), ไอคอน, service worker
    — ห้ามแคชแบบที่ทำให้เนื้อหาเก่าค้าง ต้องมี strategy ชัดเจน
32. `ProgressAdapter` + API สำหรับบัญชีผู้ใช้

---

## 19. สิ่งที่ต้องขอจากเจ้าของโปรเจกต์ (blocker list)

Codex สร้างระบบได้ครบโดยไม่มีของเหล่านี้ (มี placeholder ทุกจุด) แต่จะสมบูรณ์เมื่อได้:

| # | ของที่ต้องขอ | บล็อกอะไร | ทางสำรองระหว่างรอ |
|---|---|---|---|
| 1 | ไฟล์เสียง sfx 4 ไฟล์ (§10.2) **ที่มีสิทธิ์ใช้งาน** | เสียง feedback | `playChannel` no-op เงียบๆ |
| 2 | ภาพ tile 8 ใบ WebP 1:1 (§11.1) | หน้าตา Hub | inline SVG placeholder |
| 3 | หุ่นยนต์ `encourage` `point` `celebrate` `sign` | ปฏิกิริยาหุ่นยนต์ | ใช้ 6 ท่าที่มี + wiggle ที่ตัวของ |
| 4 | เสียงอ่านอาหรับ 28 ตัว | Game 5 mode `letter-sound` | `enabled: false` |
| 5 | ภาพของเพิ่ม 2 ชิ้นใน `islamic-objects` | Memory 12/16 การ์ด | เปิดแค่ด่าน 6 การ์ด |
| 6 | ภาพจิ๊กซอว์ (ไม่มีใบหน้า) | Game 4 | ใช้ภาพเกาะที่มีอยู่ใน `public/islands/` |
| 7 | ตรวจเนื้อหา content pack อิสลาม | Phase 3 | `requiresReview: true` + `enabled: false` |
| 8 | **สิทธิ์ใช้งานไฟล์เสียง** — ซื้อ license หรือเปลี่ยนไปใช้เสียง CC0 | ข้อ 1 | ไม่มีเสียง sfx |

> `D1` `D3` `D5` **เจ้าของโปรเจกต์อนุมัติแล้ว 2026-09-13** ออกจาก blocker list ดูสถานะใน §0
>
> **ข้อ 8 คืออะไร**: คลังเสียงในเครื่องที่ `D:\Effectsound` ใช้เลือกฟังได้ แต่ `Read.txt` ในโฟลเดอร์นั้น
> ระบุว่าเป็น torrent ที่มีคนซื้อแล้วนำมาแจกต่อ จึงยังไม่มีสิทธิ์ใช้บนเว็บสาธารณะ
> เป็น**คนละเรื่องกับข้อ 1.3** — และแยกจากกันชัดเจน:
> - **เรื่องลิขสิทธิ์** แก้ได้ด้วยการซื้อ license เองหรือเปลี่ยนไปใช้เสียง CC0/สาธารณสมบัติ
> - **เรื่องข้อ 1.3** โฟลเดอร์ `Pro Scores` (เพลงบรรเลง) และ `MUSIC` `DRUMS` `ANIMALS` `HUMANSND`
>   ใช้ไม่ได้อยู่แล้วไม่ว่าลิขสิทธิ์จะจบหรือไม่
>
> รายละเอียดทั้งหมดอยู่ใน `AGENTS.md` ข้อ 1.3 หัวข้อ "แหล่งที่มาของ sound effect"

---

## 20. กฎที่ Codex ห้ามละเมิดโดยไม่ถาม (สรุปสั้น)

1. **ห้ามวาดใบหน้าที่มีตา/จมูก/ปาก** ของมนุษย์หรือสัตว์ ในทุก asset ทุกไอคอน
2. **ห้ามใช้ emoji ที่เป็นคนหรือสัตว์** (👶 🧕 🐪 …) — ทุกตัววาดใบหน้ามาแล้ว
3. **ห้ามมีดนตรีหรือสัญลักษณ์ดนตรี** ทุกชนิด รวม `backgroundMusic` channel
4. **ห้ามใช้มัสยิดแทนอัลกุรอาน** — อัลกุรอานใช้มุศฮัฟ (หนังสือเปิด)
5. **ห้ามวาดบุคคลสำคัญทางศาสนา ศาสดา เศาะหาบะฮ์** ในทุกกรณี
6. **ห้ามสร้าง `tailwind.config.ts`** — Tailwind v4 ไม่อ่าน จะถูกเมินเงียบๆ token อยู่ใน `@theme`
7. **ห้ามใช้ `Baloo Thai 2`** — ไม่มีใน next/font ของ Next 16.3.4 (ตรวจแล้ว)
8. **ห้ามใช้ `transition-all`** และห้ามใช้ transform โดยไม่มี `motion-safe:`
9. **ห้ามเพิ่ม npm dependency** โดยไม่ถามเจ้าของโปรเจกต์
10. **ห้าม commit** ก่อน `npm run build` ผ่าน + Codex review + เจ้าของโปรเจกต์อนุมัติ (ข้อ 5)
11. **ห้ามฝังคำตอบเชิงเนื้อหาใน engine** — `if (answer === "Bismillah")` ผิดสถาปัตยกรรม
12. **ห้ามลบ redirect ของ `/learn/games*`** — ผู้ปกครองส่งลิงก์เดิมกันไว้แล้ว
