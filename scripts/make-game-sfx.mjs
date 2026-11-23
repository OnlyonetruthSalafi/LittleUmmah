/*
  สร้างเสียงเอฟเฟคของเกม -> public/audio/sfx/
    orbmaze-*    เกมเขาวงกตแสง
    countdown-*  นับถอยหลังก่อนเริ่มเล่น ใช้ทุกเกม (components/Countdown.tsx)
    garden-*     เกมสวนผัก โซน VIP (ขุดดิน ดินร่วน ถอนต้น ผักตกลงตะกร้า)

  ใช้ ElevenLabs Sound Effects แบบเดียวกับชุด tap / correct / wrong / level-complete
  (ใช้ภายใต้ plan ที่เจ้าของโปรเจกต์จ่ายเงินแล้ว — มีสิทธิ์ใช้งานตาม AGENTS.md ข้อ 1.3/1.5)
  ทุก prompt ใส่ "no music, no melody" และขอเป็นเสียงสั้นๆ ชิ้นเดียว ไม่มีโน้ตต่อกันเป็นทำนอง
  ทุกไฟล์ต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit — เกณฑ์ "ไม่ใช่ดนตรี" ตัดสินด้วยการฟัง

  แปลงเป็น MP3 mono ตัดความเงียบหัวท้าย ไม่เกิน 20KB ต่อไฟล์ (GAME_SYSTEM_PLAN.md §10.2)

  วิธีใช้
    FFMPEG=<path ของ ffmpeg.exe> node scripts/make-game-sfx.mjs [ชื่อไฟล์ ...]
*/
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

import { readApiKey } from "./lib/robot-voice.mjs";

const NO_MUSIC = "single short sound effect, no music, no melody, no musical notes, no instruments";
const SFX = {
  // เก็บเม็ดแสง — เกิดบ่อยมาก (40–65 ครั้งต่อด่าน) ต้องสั้นและเบา ไม่น่ารำคาญ
  "orbmaze-bead": { seconds: 0.5, text: `tiny soft sparkle pop of collecting a small glowing light orb in a cute video game, very short, ${NO_MUSIC}` },
  "orbmaze-star": { seconds: 1, text: `magical power-up shimmer whoosh rising up, bright sparkles, cute kids game, ${NO_MUSIC}` },
  "orbmaze-clock": { seconds: 0.8, text: `soft toy clock ticking slowing down, gentle mechanical ticks, ${NO_MUSIC}` },
  "orbmaze-shield": { seconds: 0.8, text: `soft sci-fi energy bubble shield turning on, gentle hum, cute kids game, ${NO_MUSIC}` },
  "orbmaze-warp": { seconds: 0.8, text: `cute sci-fi teleport portal whoosh with soft sparkles, ${NO_MUSIC}` },
  // ชนเพื่อนหุ่น — นุ่ม ไม่ทำให้เด็กตกใจ ไม่ใช่เสียงแพ้
  "orbmaze-bump": { seconds: 0.5, text: `gentle soft rubber boing bump of two small toy robots, friendly, not scary, ${NO_MUSIC}` },
  // นับถอยหลัง (ทุกเกม): ติ๊กสั้นใต้เสียงพูด "สาม สอง หนึ่ง" และเสียงพุ่งตอนเริ่ม
  "countdown-tick": { seconds: 0.5, text: `single soft wooden toy click tick, very short, ${NO_MUSIC}` },
  // สวนผัก VIP: ขูดดินตอนลากจอบ (เล่นซ้ำระหว่างถู ต้องสั้น) · ดินร่วนเสร็จ · ถอนต้นขึ้นจากดิน
  "garden-dig": { peak: true, seconds: 0.5, text: `short crunchy scrape of a small garden hoe digging into soft dry soil, single stroke, ${NO_MUSIC}` },
  "garden-tilled": { peak: true, seconds: 0.9, text: `soft crumbly soil turning over and settling with a gentle earthy thud and light patter of falling dirt, ${NO_MUSIC}` },
  "garden-pull": { peak: true, seconds: 0.6, text: `quick soft pop of a small plant root pulled out of moist soil with a little crumble of earth, ${NO_MUSIC}` },
  "garden-basket": { peak: true, seconds: 0.6, text: `soft muffled thump of one fresh vegetable dropping into a woven wicker basket with a light creak of the wicker, ${NO_MUSIC}` },
  "countdown-go": { seconds: 0.8, text: `quick bright whoosh launch with sparkles, start of a race in a cute kids game, ${NO_MUSIC}` },
};
const MAX_KB = 20;

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
    body: JSON.stringify({ text: spec.text, duration_seconds: spec.seconds, prompt_influence: 0.6 }),
  });
  if (!response.ok) throw new Error(`${key}: ElevenLabs ตอบ ${response.status} ${await response.text()}`);
  const raw = path.join(tmpDir, `${key}.raw.mp3`);
  writeFileSync(raw, Buffer.from(await response.arrayBuffer()));
  const out = path.join(outDir, `${key}.mp3`);
  // ตัดความเงียบหัวท้าย + fade ท้ายกันเสียงกึก, mono 22050Hz 48k พอสำหรับเอฟเฟคสั้น
  // peak: เสียงดิบเบามาก (ดินร่วนสูงสุด -30dB) ยกให้ยอดอยู่ที่ -1.5dB ก่อนตัดความเงียบ แทน loudnorm ที่ตัดจนเหลือเสี้ยววินาที
  const max = spec.peak ? Number(/max_volume: (-?[\d.]+) dB/.exec(spawnSync(ffmpeg, ["-hide_banner", "-i", raw, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" }).stderr)?.[1] ?? 0) : 0;
  const filter = spec.peak ? [
    `volume=${(-1.5 - max).toFixed(1)}dB`, "silenceremove=start_periods=1:start_threshold=-40dB",
    "areverse", "silenceremove=start_periods=1:start_threshold=-40dB", "afade=t=in:d=0.05", "areverse",
  ].join(",") : [
    "silenceremove=start_periods=1:start_threshold=-45dB",
    // กลับหัวแล้วตัดความเงียบท้าย + fade เข้า (= fade ออกเมื่อกลับคืน)
    "areverse", "silenceremove=start_periods=1:start_threshold=-45dB", "afade=t=in:d=0.04", "areverse",
    "loudnorm=I=-18:TP=-2",
  ].join(",");
  execFileSync(ffmpeg, ["-y", "-i", raw, "-af", filter, "-ac", "1", "-ar", "22050", "-b:a", "48k", out], { stdio: "ignore" });
  if (!process.env.KEEP_RAW) rmSync(raw, { force: true });
  const kb = statSync(out).size / 1024;
  console.log(`${key}.mp3  ${kb.toFixed(1)}KB${kb > MAX_KB ? "  ← เกิน 20KB" : ""}`);
}
console.log("\nต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit (AGENTS.md ข้อ 1.3)");
