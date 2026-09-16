/*
  สร้างเสียงพากย์นิทาน -> public/audio/stories/<slug>/

  ใช้เสียงและเอฟเฟคชุดเดียวกับหุ่นยนต์ทั้งเว็บ ผ่าน lib/robot-voice.mjs
  ElevenLabs เสียง "Leo - Cute Energetic Young Kid" + ฟิลเตอร์หุ่นยนต์ของ ffmpeg

  เป็นเสียงพูดล้วน ไม่มีดนตรี จึงไม่ขัด AGENTS.md ข้อ 1.3
  แต่ทุกไฟล์ยังต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit

  ── บทพูดมาจากไหน ───────────────────────────────────────────────
  ไฟล์เสียงชุดแรก (commit 2f155b4) สร้างโดยไม่มีสคริปต์เก็บไว้
  ข้อความที่ป้อน ElevenLabs จริงๆ ตอนนั้นจึงย้อนดูไม่ได้แล้ว
  สคริปต์นี้ถือ NUH_STORY ใน src/features/stories/data/nuh.ts เป็นต้นฉบับนับจากนี้
  และประกอบบทพูดแบบเดียวกับที่ StoryBook.tsx เล่นจริง
    ปก (p00) = titleTh
    หน้าอื่น = th ... reading ... meaning (เฉพาะที่มี) คั่นด้วย " ... "

  ── SPEECH_FIXES ────────────────────────────────────────────────
  ElevenLabs อ่านคำไทยบางคำผิด แก้ด้วยการสะกดใหม่ "เฉพาะขาเข้า TTS"
  ข้อความบนหน้าเว็บต้องสะกดถูกตามหลักเสมอ ห้ามแก้ nuh.ts ตามเสียง

  วิธีใช้
    ELEVENLABS_API_KEY อยู่ใน .env.local แล้ว (สคริปต์อ่านให้เอง)
    เครื่องนี้ไม่มี ffmpeg ส่วนกลาง ให้ชี้ที่ ffmpeg-static:
      FFMPEG=<path ของ ffmpeg.exe> node scripts/make-story-voice.mjs p00
    ไม่ใส่ชื่อ = สร้างทุกหน้า (ระวังโควตา และต้องให้เจ้าของโปรเจกต์ฟังใหม่ทุกไฟล์)

    --try=<ก,ข,ค>  อัดปกหลายแบบเทียบเสียงลง output/story-voice/ แทนการทับของจริง
      ใช้ตอนหาวิธีสะกดที่ ElevenLabs อ่านถูก เจ้าของโปรเจกต์ฟังแล้วเลือกเอง
*/

import path from "node:path";

import { NUH_STORY } from "../src/features/stories/data/nuh.ts";
import { renderRobotLines } from "./lib/robot-voice.mjs";

/*
  คำที่ ElevenLabs อ่านผิด -> วิธีสะกดที่อ่านถูก (ใช้กับขาเข้า TTS เท่านั้น)

  "นบีนูห์" ตัว ห์ มีทัณฑฆาตจึงไม่ออกเสียง ควรได้ยินว่า "นะ-บี-นู"
  แต่ ElevenLabs อ่านท้ายเป็น "นั๊วะ" (เจ้าของโปรเจกต์ฟังเจอในปก p00 2026-09-16)
*/
const SPEECH_FIXES = [
  // [ข้อความบนหน้าเว็บ, ข้อความที่ป้อน ElevenLabs]
  ["นูห์", "นู"],
];

const forSpeech = text => SPEECH_FIXES.reduce((out, [from, to]) => out.replaceAll(from, to), text);

/** บทพูดของหน้าหนึ่ง ประกอบแบบเดียวกับ StoryBook.tsx */
const pageLine = page => [page.th, page.reading, page.meaning].filter(Boolean).join(" ... ");

/** ชื่อไฟล์เสียงผูกกับชื่อไฟล์ภาพ ตรงกับ narrationSrc ใน features/stories/index.ts */
const pageKey = page => page.image.split("/").pop().replace(/\.\w+$/, "");

const story = NUH_STORY;
const outDir = path.join(process.cwd(), "public", "audio", "stories", story.slug);

const args = process.argv.slice(2);
const tryArg = args.find(arg => arg.startsWith("--try="));

if (tryArg) {
  /* โหมดเทียบเสียง: อัดชื่อเรื่องหลายวิธีสะกดลง output/ ซึ่งอยู่ใน .gitignore
     ไม่แตะไฟล์จริง เจ้าของโปรเจกต์ฟังแล้วบอกว่าเอาอันไหน ค่อยก๊อปทับ */
  const variants = tryArg.slice("--try=".length).split(",").filter(Boolean);
  const lines = Object.fromEntries(
    variants.map((text, i) => [`p00-${String.fromCharCode(97 + i)}`, text]),
  );
  console.log("อัดเทียบเสียงชื่อเรื่อง ไม่ทับไฟล์จริง:");
  for (const [key, text] of Object.entries(lines)) console.log(`  ${key}.mp3  ${text}`);
  console.log();
  await renderRobotLines(lines, path.join(process.cwd(), "output", "story-voice"));
} else {
  const lines = {
    p00: forSpeech(story.titleTh),
    ...Object.fromEntries(story.pages.map(page => [pageKey(page), forSpeech(pageLine(page))])),
  };
  await renderRobotLines(lines, outDir, args);
}
