/*
  สร้างเสียงพูดของหุ่นยนต์นำทาง — ใช้ร่วมกันทุกสคริปต์ที่ต้องอัดเสียงหุ่น

  เสียงและเอฟเฟคเป็นชุดที่เจ้าของโปรเจกต์เลือกไว้แล้ว ห้ามเปลี่ยนโดยพลการ
  หุ่นยนต์ต้องเสียงเดียวกันทั้งเว็บ ไม่งั้นเด็กจะรู้สึกว่าเป็นคนละตัว
  ElevenLabs เสียง "Leo - Cute Energetic Young Kid" + ฟิลเตอร์หุ่นยนต์ของ ffmpeg

  เป็นเสียงพูดล้วน ไม่มีดนตรี จึงไม่ขัด AGENTS.md ข้อ 1.3
  แต่ทุกไฟล์ยังต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit

  เครื่องนี้ไม่มี ffmpeg ส่วนกลาง ผู้เรียกต้องส่ง path ของ ffmpeg มาทาง env FFMPEG
*/

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const VOICE_ID = "1tDEBGOo8EqEPApM49eJ"; // Leo - Cute Energetic Young Kid
const MODEL_ID = "eleven_v3";
const ROBOT_FILTER =
  "flanger=delay=1.5:depth=1.5:regen=40:speed=0.4,aecho=0.85:0.6:9:0.3,highpass=f=120,volume=1.1";

const TMP_DIR = path.join(process.cwd(), ".next", "cache", "robot-voice");

export function readApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const env = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  const match = env.match(/^ELEVENLABS_API_KEY=(.+)$/m);
  if (!match) throw new Error("ไม่พบ ELEVENLABS_API_KEY ใน .env.local");
  return match[1].trim();
}

async function synth(key, text, apiKey) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "content-type": "application/json" },
      body: JSON.stringify({ text, model_id: MODEL_ID, language_code: "th" }),
    },
  );
  if (!response.ok) {
    throw new Error(`${key}: ElevenLabs ตอบ ${response.status} ${await response.text()}`);
  }
  mkdirSync(TMP_DIR, { recursive: true });
  const raw = path.join(TMP_DIR, `${key}.raw.mp3`);
  writeFileSync(raw, Buffer.from(await response.arrayBuffer()));
  return raw;
}

/**
  อัดบทพูดทั้งชุดลงโฟลเดอร์ปลายทาง
  lines = { ชื่อไฟล์ (ไม่มีนามสกุล): บทพูดภาษาไทย }
  only  = รายชื่อที่จะสร้างเฉพาะบางไฟล์ (ว่าง = ทั้งหมด)
*/
export async function renderRobotLines(lines, outDir, only = []) {
  const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
  const keys = only.length > 0 ? only : Object.keys(lines);
  const apiKey = readApiKey();
  mkdirSync(outDir, { recursive: true });

  let chars = 0;
  for (const key of keys) {
    const text = lines[key];
    if (!text) throw new Error(`ไม่รู้จักคลิปชื่อ ${key}`);
    const raw = await synth(key, text, apiKey);
    const outFile = path.join(outDir, `${key}.mp3`);
    // mono + 64k พอสำหรับเสียงพูด และทำให้ไฟล์เล็กพอจะ commit ได้
    execFileSync(ffmpeg, ["-y", "-i", raw, "-af", ROBOT_FILTER, "-ac", "1", "-b:a", "64k", outFile], {
      stdio: "ignore",
    });
    rmSync(raw, { force: true });
    chars += text.length;
    console.log(`${key}.mp3  (${text.length} ตัวอักษร)`);
  }

  console.log(`\nเสร็จ ${keys.length} ไฟล์ รวม ${chars} ตัวอักษรของโควตา ElevenLabs`);
  console.log("ต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit (AGENTS.md ข้อ 1.3)");
}
