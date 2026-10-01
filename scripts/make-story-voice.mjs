/*
  สร้างเสียงพากย์นิทาน -> public/audio/stories/<slug>/

  ใช้เสียงและเอฟเฟคชุดเดียวกับหุ่นยนต์ทั้งเว็บ ผ่าน lib/robot-voice.mjs
  ElevenLabs เสียง "Leo - Cute Energetic Young Kid" + ฟิลเตอร์หุ่นยนต์ของ ffmpeg

  เป็นเสียงพูดล้วน ไม่มีดนตรี จึงไม่ขัด AGENTS.md ข้อ 1.3
  แต่ทุกไฟล์ยังต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit

  ── บทพูดมาจากไหน ───────────────────────────────────────────────
  ไฟล์เสียงชุดแรก (commit 2f155b4) สร้างโดยไม่มีสคริปต์เก็บไว้
  ข้อความที่ป้อน ElevenLabs จริงๆ ตอนนั้นจึงย้อนดูไม่ได้แล้ว
  สคริปต์นี้ถือไฟล์ข้อมูลนิทานใน src/features/stories/data/<slug>.ts เป็นต้นฉบับนับจากนี้
  และประกอบบทพูดแบบเดียวกับที่ StoryBook.tsx เล่นจริง
    ปก (p00) = titleTh
    หน้าอื่น = th ... reading ... meaning (เฉพาะที่มี) คั่นด้วย " ... "

  ── ทำไมต้องอัดหลายเทค ──────────────────────────────────────────
  ElevenLabs ไม่ได้อ่านเหมือนกันทุกครั้ง ข้อความเดิมเป๊ะๆ อัดสองรอบได้เสียงคนละอัน
  คำว่า "นบีนูห์" บางเทคอ่านถูก บางเทคอ่านเป็น "นั๊วะ"
  หน้า 2 3 4 อ่านถูกด้วยการสะกดปกติ ส่วนปกกับหน้า 6 ขึ้นไปอ่านผิด (2026-09-16)
  จึงไม่ใช่เรื่องการสะกด แต่เป็นความสุ่มของโมเดล — วิธีแก้คืออัดหลายเทคแล้วคัด

  วิธีใช้
    ELEVENLABS_API_KEY อยู่ใน .env.local แล้ว (สคริปต์อ่านให้เอง)
    เครื่องนี้ไม่มี ffmpeg ส่วนกลาง ให้ชี้ที่ ffmpeg-static:
      FFMPEG=<path ของ ffmpeg.exe> node scripts/make-story-voice.mjs p06

    --story=<slug> เลือกเรื่อง (nuh yunus musa) ไม่ใส่ = nuh
    <ชื่อหน้า...>   เลือกเฉพาะบางหน้า (p00 p06 p08b ...) ไม่ใส่ = ทุกหน้า
    --takes=N      อัด N เทคต่อหน้า ลง output/story-voice/<slug>/ ให้เลือกฟัง ไม่ทับของจริง
    --fix          ใช้ SPEECH_FIXES สะกดใหม่ก่อนป้อน TTS (ปกติไม่ใช้)
*/

import path from "node:path";

import { renderRobotLines } from "./lib/robot-voice.mjs";

/*
  คำที่สะกดใหม่ก่อนป้อน TTS (ใช้เมื่อสั่ง --fix เท่านั้น)

  หลักการ: หา "คำพ้องเสียง" ที่สะกดแล้วโมเดลอ่านง่ายกว่า ไม่ใช่การสะกดมั่วให้ได้เสียงบังเอิญ

  "นบีนูห์" -> "นบีนั๊วะ" (เจ้าของโปรเจกต์ 2026-09-16)
  ในภาษาไทย "นูห์" กับ "นั๊วะ" เสียงใกล้กัน แต่ ElevenLabs อ่าน "นูห์" เป็น "นู" เฉยๆ
  คือหายเสียงท้ายไป พอสะกดเป็น "นั๊วะ" โมเดลอ่านได้ตรงกับที่ควรเป็น

  ที่ลองแล้วไม่ผ่าน: ปก 15 เทค ทั้ง นู / นู้ / นู๊ / นูฮ์ / นู้ห์ / นู้ฮ์
  (ทุกตัวยังเป็นสระอู ไม่ได้แก้ที่เสียงท้ายซึ่งเป็นต้นเหตุ)
  และหน้า 6 8b 11 หน้าละ 3 เทคด้วยการสะกดปกติ

  ไม่ว่ากรณีใด ข้อความบนหน้าเว็บใน nuh.ts ต้องสะกดถูกตามหลักเสมอ ห้ามแก้ตามเสียง
*/
const SPEECH_FIXES = [
  // [ข้อความบนหน้าเว็บ, ข้อความที่ป้อน ElevenLabs]
  ["นูห์", "นั๊วะ"],
];

const applyFixes = text => SPEECH_FIXES.reduce((out, [from, to]) => out.replaceAll(from, to), text);

/** บทพูดของหน้าหนึ่ง ประกอบแบบเดียวกับ StoryBook.tsx */
const pageLine = page => [page.th, page.reading, page.meaning].filter(Boolean).join(" ... ");

/** ชื่อไฟล์เสียงผูกกับชื่อไฟล์ภาพ ตรงกับ narrationSrc ใน features/stories/index.ts */
const pageKey = page => page.image.split("/").pop().replace(/\.\w+$/, "");

const args = process.argv.slice(2);
const slug = args.find(arg => arg.startsWith("--story="))?.slice("--story=".length) ?? "nuh";
// ไฟล์ข้อมูลนิทานมี export เดียว (import แค่ type) Node จึงโหลด .ts ได้ตรงๆ
const story = Object.values(await import(`../src/features/stories/data/${slug}.ts`))[0];
const takesArg = args.find(arg => arg.startsWith("--takes="));
const useFixes = args.includes("--fix");
const only = args.filter(arg => !arg.startsWith("--"));

const prepare = text => (useFixes ? applyFixes(text) : text);
const ALL = {
  p00: prepare(story.titleTh),
  ...Object.fromEntries(story.pages.map(page => [pageKey(page), prepare(pageLine(page))])),
};

for (const key of only) if (!ALL[key]) throw new Error(`ไม่รู้จักหน้าชื่อ ${key}`);
const keys = only.length > 0 ? only : Object.keys(ALL);

if (takesArg) {
  /* โหมดคัดเทค: อัดหลายเทคลง output/ ซึ่งอยู่ใน .gitignore ไม่แตะไฟล์จริง
     เจ้าของโปรเจกต์ฟังแล้วบอกว่าหน้าไหนเอาเทคไหน ค่อยก๊อปทับ */
  const takes = Number(takesArg.slice("--takes=".length));
  if (!Number.isInteger(takes) || takes < 1) throw new Error("--takes ต้องเป็นจำนวนเต็มตั้งแต่ 1");
  const lines = {};
  for (const key of keys) {
    for (let i = 1; i <= takes; i++) lines[`${key}-เทค${i}`] = ALL[key];
  }
  console.log(`อัด ${takes} เทคต่อหน้า ${keys.length} หน้า ลง output/story-voice/${slug}/ (ไม่ทับไฟล์จริง)\n`);
  await renderRobotLines(lines, path.join(process.cwd(), "output", "story-voice", slug));
} else {
  await renderRobotLines(ALL, path.join(process.cwd(), "public", "audio", "stories", story.slug), keys);
}
