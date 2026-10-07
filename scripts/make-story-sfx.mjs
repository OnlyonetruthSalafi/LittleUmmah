/*
  สร้างเสียงของหนังสือนิทานแบบอลังการ -> public/audio/sfx/story-*.mp3
    story-book-open   เปิดปกหนังแข็ง (ครั้งเดียว)
    story-page-curl   พลิกกระดาษแผ่นใหญ่ (ครั้งเดียว)
    story-amb-*       เสียงบรรยากาศวนซ้ำใต้เสียงพากย์ (คลื่น ลม ฝน ใต้น้ำ) — useAmbience.ts

  ใช้ ElevenLabs Sound Effects แบบเดียวกับ scripts/make-game-sfx.mjs
  (ใช้ภายใต้ plan ที่เจ้าของโปรเจกต์จ่ายเงินแล้ว — มีสิทธิ์ใช้เชิงพาณิชย์ตาม AGENTS.md ข้อ 1.3/1.5)
  ทุก prompt ใส่ "no music" และห้ามเสียงสัตว์/คน (นก นางนวล แมลง ปลาวาฬ เสียงพูด)
  ทุกไฟล์ต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit — เกณฑ์ "ไม่ใช่ดนตรี" ตัดสินด้วยการฟัง

  ขนาดไฟล์ ≤ 20KB (GAME_SYSTEM_PLAN.md §10.2):
    เสียงครั้งเดียว  mono 22050Hz 48kbps ตัดความเงียบหัวท้าย
    เสียงวนซ้ำ     mono 22050Hz 24kbps ยาว ~6 วินาที เอาท้ายมาเฟดซ้อนหัว (crossfade) ให้วนต่อกันไม่มีรอย

  วิธีใช้
    FFMPEG=<path ของ ffmpeg.exe> node scripts/make-story-sfx.mjs [ชื่อไฟล์ ...]
*/
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

import { readApiKey } from "./lib/robot-voice.mjs";

const NO_MUSIC = "no music, no melody, no musical notes, no instruments";
const NO_LIFE = "no birds, no seagulls, no insects, no animals, no voices, no people";
const SFX = {
  "story-book-open": {
    seconds: 1.8,
    // เสียงเอี๊ยดของสันปกเบามาก ตัดความเงียบที่ -45dB แล้วเหลือแค่ 0.13 วินาที
    threshold: -62,
    text: `a heavy leather hardcover storybook cover slowly opening and landing softly on a wooden desk, gentle creak of the spine, soft thump, light paper rustle, ${NO_MUSIC}`,
  },
  "story-page-curl": {
    seconds: 1.1,
    text: `a single large thick paper storybook page turned slowly by hand, crisp paper swish and soft flutter, ${NO_MUSIC}`,
  },
  "story-amb-sea": { loop: true, text: `calm open sea ambience, gentle waves, soft sea breeze, peaceful, ${NO_LIFE}, ${NO_MUSIC}` },
  "story-amb-harbor": {
    loop: true,
    text: `quiet harbor ambience, gentle water lapping against a wooden sailing boat, soft wooden creaks and ropes, light breeze, ${NO_LIFE}, ${NO_MUSIC}`,
  },
  "story-amb-storm": {
    loop: true,
    text: `storm at sea ambience for a children's story, strong wind, steady rain and rolling waves, not scary, no thunder crack, ${NO_LIFE}, ${NO_MUSIC}`,
  },
  "story-amb-underwater": {
    loop: true,
    text: `deep underwater ambience, calm muffled low water rumble with soft rising bubbles, peaceful, no whale sounds, ${NO_LIFE}, ${NO_MUSIC}`,
  },
  "story-amb-shore": {
    loop: true,
    text: `gentle small waves washing onto a sandy beach in the early morning, soft breeze, peaceful, ${NO_LIFE}, ${NO_MUSIC}`,
  },
  // นิทานนบีมูซา (พายุฝุ่นทะเลทราย) และนบีนูห์ (ฝนตกก่อนน้ำท่วม) — 7 ต.ค. 2026
  "story-amb-wind": {
    loop: true,
    text: `soft steady desert wind ambience, gentle gusts with fine sand hissing over dunes, calm and not scary, ${NO_LIFE}, ${NO_MUSIC}`,
  },
  "story-amb-rain": {
    loop: true,
    text: `steady heavy rain falling on open land and on a large wooden boat roof, soft distant rumble, no thunder crack, not scary, ${NO_LIFE}, ${NO_MUSIC}`,
  },
  "story-amb-night": {
    loop: true,
    text: `calm night at the seaside, clearly audible gentle waves rolling onto rocks and a soft steady breeze, ${NO_LIFE}, no crickets, ${NO_MUSIC}`,
  },
};
const MAX_KB = 20;
const LOOP_SECONDS = 7;
const XFADE = 0.9;

const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const only = process.argv.slice(2);
const keys = only.length ? only : Object.keys(SFX);
const apiKey = readApiKey();
const outDir = path.join(process.cwd(), "public", "audio", "sfx");
const tmpDir = path.join(process.cwd(), ".next", "cache", "sfx");
mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

for (const key of keys) {
  const spec = SFX[key];
  if (!spec) throw new Error(`ไม่รู้จักเสียงชื่อ ${key}`);
  const response = await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", {
    method: "POST",
    headers: { "xi-api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify({
      text: spec.text,
      duration_seconds: spec.loop ? LOOP_SECONDS : spec.seconds,
      prompt_influence: 0.6,
    }),
  });
  if (!response.ok) throw new Error(`${key}: ElevenLabs ตอบ ${response.status} ${await response.text()}`);
  const raw = path.join(tmpDir, `${key}.raw.mp3`);
  writeFileSync(raw, Buffer.from(await response.arrayBuffer()));
  const out = path.join(outDir, `${key}.mp3`);

  if (spec.loop) {
    /*
      วนซ้ำไร้รอยต่อ: ผลลัพธ์ = [ท้าย XFADE วินาทีเฟดออก ซ้อนกับ หัว XFADE วินาทีเฟดเข้า] + ช่วงกลาง
      เล่นจบแล้ววนกลับ ช่วงกลางจบตรงจุดที่ "ท้าย" เริ่ม เสียงจึงต่อกันพอดี
    */
    const end = LOOP_SECONDS - XFADE;
    const filter = [
      `[0:a]atrim=0:${XFADE},asetpts=PTS-STARTPTS,afade=t=in:d=${XFADE}[head]`,
      `[2:a]atrim=${end}:${LOOP_SECONDS},asetpts=PTS-STARTPTS,afade=t=out:d=${XFADE}[tail]`,
      `[head][tail]amix=inputs=2:normalize=0[joint]`,
      `[1:a]atrim=${XFADE}:${end},asetpts=PTS-STARTPTS[mid]`,
      `[joint][mid]concat=n=2:v=0:a=1,loudnorm=I=-24:TP=-3[out]`,
    ].join(";");
    // อ่านไฟล์เดียวกันสามครั้งแทน asplit — asplit แล้วตัดช่วงซ้อนกัน ffmpeg ค้างแล้วไม่เขียนไฟล์
    execFileSync(ffmpeg, ["-y", "-i", raw, "-i", raw, "-i", raw, "-filter_complex", filter, "-map", "[out]", "-ac", "1", "-ar", "22050", "-b:a", "24k", out], { stdio: "ignore" });
  } else {
    const filter = [
      `silenceremove=start_periods=1:start_threshold=${spec.threshold ?? -45}dB`,
      "areverse", `silenceremove=start_periods=1:start_threshold=${spec.threshold ?? -45}dB`, "afade=t=in:d=0.04", "areverse",
      "loudnorm=I=-18:TP=-2",
    ].join(",");
    execFileSync(ffmpeg, ["-y", "-i", raw, "-af", filter, "-ac", "1", "-ar", "22050", "-b:a", "48k", out], { stdio: "ignore" });
  }
  rmSync(raw, { force: true });
  const kb = statSync(out).size / 1024;
  console.log(`${key}.mp3  ${kb.toFixed(1)}KB${kb > MAX_KB ? "  ← เกิน 20KB" : ""}`);
}
console.log("\nต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit (AGENTS.md ข้อ 1.3)");
