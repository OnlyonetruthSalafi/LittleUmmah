/*
  เสียงครูหุ่นยนต์ "นูรี" บนเกาะสำรวจโลก (หุ่นนำทางหน้า + การ์ตูนถิ่นที่อยู่ของสัตว์) -> public/audio/th/

  บทพูดอ่านจาก src/features/explore/data.ts โดยตรง (Node 24 อ่าน .ts ได้ เพราะไฟล์นั้น import แค่ type)
  ข้อความบนจอกับเสียงจึงตรงกันเสมอ ไม่ต้องแก้สองที่
  - ฉากที่มี voice ใช้ voice แทน th
  - คำทับศัพท์ที่อ่านเพี้ยน (การ์ด -> Card, เฟนเนค -> Fennec) แปลงเป็นอังกฤษใน scripts/lib/robot-voice.mjs
  - ฉาก sayAlong ต่อท้ายว่า "พูดตามครู <คำ>" (บนจอไม่มี)
  - อายะฮ์ หุ่นยนต์อ่านเฉพาะความหมายภาษาไทย ตัวอาหรับแสดงบนป้าย ไม่ให้เสียงสังเคราะห์อ่าน
  ใช้เสียงและฟิลเตอร์ชุดเดียวกับหุ่นยนต์ทั้งเว็บ (scripts/lib/robot-voice.mjs)

  วิธีใช้
    FFMPEG=<path ของ ffmpeg.exe> node scripts/make-explore-voice.mjs [ชื่อคลิป ...]
    node scripts/make-explore-voice.mjs --list     แสดงบทและจำนวนตัวอักษร ไม่เรียก ElevenLabs
*/
import path from "node:path";

import { renderRobotLines, voiceText } from "./lib/robot-voice.mjs";
import { CARTOONS, GUIDE_STEPS } from "../src/features/explore/data.ts";

const LINES = {};
for (const step of GUIDE_STEPS) LINES[step.clip] = step.th;
for (const cartoon of Object.values(CARTOONS)) {
  for (const scene of cartoon.scenes) {
    let text = scene.voice ?? scene.th;
    if (scene.sayAlong && scene.word) text += ` พูดตามครูนะ ${scene.word.th}`;
    if (LINES[scene.clip] && LINES[scene.clip] !== text) throw new Error(`คลิป ${scene.clip} ซ้ำแต่บทไม่ตรงกัน`);
    LINES[scene.clip] = text;
  }
}

const args = process.argv.slice(2);
if (args.includes("--list")) {
  let total = 0;
  for (const [clip, text] of Object.entries(LINES)) {
    total += text.length;
    console.log(`${clip.padEnd(20)} ${voiceText(text)}`);
  }
  console.log(`\n${Object.keys(LINES).length} คลิป รวม ${total} ตัวอักษร`);
} else {
  await renderRobotLines(LINES, path.join(process.cwd(), "public", "audio", "th"), args);
}
