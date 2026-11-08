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

/*
  คำทับศัพท์ที่ ElevenLabs อ่านตัวไทยเพี้ยน — ส่งเป็นภาษาอังกฤษแทน (เจ้าของโปรเจกต์สั่ง 2 ต.ค. 2026:
  "คำพ้องเสียงไทย-อังกฤษ ให้อ่านทับศัพท์อังกฤษไปเลย") ใช้กับทุกสคริปต์อัตโนมัติ บทบนจอยังเขียนไทยตามเดิม
  เจอคำที่อ่านเพี้ยนอีก ให้เพิ่มที่นี่ แล้วอัดใหม่ทั้งประโยค
    การ์ด  -> "กาด" (เคยแก้ด้วย "ก๊าด" ก็ยังเพี้ยน)
    เฟนเนค -> "เฟนเจาะ"
*/
const SAY_AS_ENGLISH = [
  ["การ์ด", "Card"],
  ["ก๊าด", "Card"],
  ["เฟนเนค", "Fennec"],
  ["มาร์มอต", "Marmot"],
  ["ซิลเวอร์", "Silver"],
  ["แคริบเบียน", "Caribbean"],
];

/*
  คำอาหรับที่เขียนเป็นคำอ่านไทย -> ส่งเป็นตัวอาหรับมีสระแทน (เจ้าของโปรเจกต์สั่ง 8 พ.ย. 2026: "แก้คำไทย-อาหรับทั้งเว็บ")
  เหตุผล: อักษรไทยไม่มีเสียง ث ح خ ع ج ز ق ฯลฯ ส่งคำอ่านไทยไปกี่รอบโมเดลก็ออกเสียงเป็นไทย (ث→ส, ج→ย, خ→ค)
  วัดแล้ว 8 พ.ย.: جزاك الله خيرا ตัวอักษรถูก 67% -> 92%, ตัวเลขอาหรับ 78% -> 91% (output/ar-voice-trial/report.md)
  บรรทัดที่มีตัวอาหรับจะส่งโดยไม่ล็อก language_code (ดู renderRobotLines) ท่อนไทยยังอ่านเป็นไทย (ตรวจด้วย ASR ไทยแล้ว)
  ข้อความบนจอไม่เปลี่ยน เปลี่ยนเฉพาะบทที่ป้อน TTS
  ตัวบททุกวลีตรงกับ src/lib/lessons.ts / ไฟล์ข้อมูลที่ตรวจกับ Shamela แล้ว (Claude ตรวจ 8 พ.ย. 2026):
    ดุอาอ์ก่อนนอน/ตื่นนอน บุคอรี 6324 · ดุอาอ์หลังกิน อบูดาวูด 4023 / ติรมิซีย์ 3458 · ดุอาอ์ออกจากบ้าน อบูดาวูด 5095 / ติรมิซีย์ 3426
    ตอบคนจาม บุคอรี 6224 · ญะซากัลลอฮุค็อยร็อน ติรมิซีย์ 2035 · อะอูซุบิลลาฮ์เมื่อโกรธ บุคอรี 6115
  **ห้ามเพิ่มอายะฮ์อัลกุรอาน** — หุ่นยนต์ไม่อ่านอายะฮ์เป็นอาหรับ (AGENTS.md ข้อ 1.6)
  เรียงวลียาวก่อนวลีสั้น เพราะแทนที่ตามลำดับ
*/
const SAY_AS_ARABIC = [
  ["ศ็อลลัลลอฮุอะลัยฮิวะซัลลัม", "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ"],
  ["อะอูซุบิลลาฮิมินัชชัยฏอนิรรอญีม", "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ"],
  ["อัลฮัมดุลิลลาฮิลละซี อะห์ยานา บะอ์ดะมา อะมาตะนา วะอิลัยฮินนุชูร", "اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ"],
  ["อัลฮัมดุลิลลาฮิลละซี อัฏอะมะนี ฮาซัฏเฏาะอาม", "اَلْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا الطَّعَامَ"],
  ["วะเราะซะเกาะนีฮิ มิน ฆ็อยริ เหาลิน มินนี วะลา กุววะฮ์", "وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ"],
  ["บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา", "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا"],
  ["ลาเหาละ วะลา กุววะตะ อิลลา บิลลาฮ์", "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ"],
  ["ตะวักกัลตุ อะลัลลอฮ์", "تَوَكَّلْتُ عَلَى اللَّهِ"],
  ["ยะฮ์ดีกุมุลลอฮ์ วะยุศลิหุบาละกุม", "يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ"],
  ["ยะฮ์ดีกุมุลลอฮ์", "يَهْدِيكُمُ اللَّهُ"],
  ["ยัรฮะมุกัลลอฮ์", "يَرْحَمُكَ اللَّهُ"],
  ["ญะซากัลลอฮุค็อยร็อน", "جَزَاكَ اللَّهُ خَيْرًا"],
  ["ซุบฮานัลลอฮิวะบิฮัมดิฮ์", "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"],
  ["ซุบฮานัลลอฮิ วะบิฮัมดิฮ์", "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"],
  ["ลาอิลาฮะอิลลัลลอฮ์", "لَا إِلَهَ إِلَّا اللَّهُ"],
  ["ลาอิลาฮะ อิลลัลลอฮ์", "لَا إِلَهَ إِلَّا اللَّهُ"],
  ["อะอูซุบิลลาฮ์", "أَعُوذُ بِاللَّهِ"],
  ["ซุบฮานัลลอฮ์", "سُبْحَانَ اللَّهِ"],
  ["อัลฮัมดุลิลลาฮ์", "اَلْحَمْدُ لِلَّهِ"],
  ["มาชาอัลลอฮ์", "مَا شَاءَ اللَّهُ"],
  ["บิสมิลลาฮ์", "بِسْمِ اللَّهِ"],
  ["อัสสะลามุอะลัยกุม", "اَلسَّلَامُ عَلَيْكُمْ"],
  ["อัสสลามุอะลัยกุม", "اَلسَّلَامُ عَلَيْكُمْ"],
  ["อัลญูดีย์", "الْجُودِيّ"],
  ["อัลลอฮ์", "اللَّه"],
];

export function voiceText(text) {
  // ขยายเฉพาะบทพูดก่อนส่ง TTS; ข้อความในหน้าหนังสือยังใช้ ﷺ ตามเดิม
  let out = text.replaceAll("ﷺ", " ศ็อลลัลลอฮุอะลัยฮิวะซัลลัม ");
  for (const [th, ar] of SAY_AS_ARABIC) out = out.replaceAll(th, ` ${ar} `);
  for (const [th, en] of SAY_AS_ENGLISH) out = out.replaceAll(th, ` ${en} `);
  return out.replace(/ {2,}/g, " ").trim();
}

/** บรรทัดที่มีตัวอาหรับต้องไม่ล็อกภาษา ให้โมเดลอ่านท่อนอาหรับเป็นอาหรับ */
export const hasArabic = (text) => /[؀-ۿ]/.test(text);

export function readApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const env = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  const match = env.match(/^ELEVENLABS_API_KEY=(.+)$/m);
  if (!match) throw new Error("ไม่พบ ELEVENLABS_API_KEY ใน .env.local");
  return match[1].trim();
}

async function synth(key, text, apiKey, languageCode) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "content-type": "application/json" },
      // languageCode = null: ไม่ล็อกภาษา ให้โมเดลอ่านท่อนอาหรับ (ตัวอักษรอาหรับ) เป็นสำเนียงอาหรับ ส่วนไทยยังอ่านเป็นไทย
      body: JSON.stringify(languageCode ? { text, model_id: MODEL_ID, language_code: languageCode } : { text, model_id: MODEL_ID }),
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
export async function renderRobotLines(lines, outDir, only = [], { languageCode = "th" } = {}) {
  const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
  const keys = only.length > 0 ? only : Object.keys(lines);
  const apiKey = readApiKey();
  mkdirSync(outDir, { recursive: true });

  let chars = 0;
  for (const key of keys) {
    const text = lines[key];
    if (!text) throw new Error(`ไม่รู้จักคลิปชื่อ ${key}`);
    const spoken = voiceText(text);
    const raw = await synth(key, spoken, apiKey, hasArabic(spoken) ? null : languageCode);
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
