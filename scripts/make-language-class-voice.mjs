/*
  เสียงครูนูรีของห้องเรียนภาษาอังกฤษและภาษาไทย (เจ้าของโปรเจกต์สั่ง 9 พ.ย. 2026)
  -> public/audio/th/class/en/ และ public/audio/th/class/th/

  บทพูดสร้างจากข้อมูลห้องเรียน ไม่เขียนซ้ำ:
    teach-<id> = step.body.th   (ครูชี้กระดานแล้วสอน)
    say-<id>   = "ครูอ่านนำก่อนนะ ... <say> ... ทีนี้ตาหนูแล้ว อ่านตามครูดังๆ"
    course-done = จบเส้นทางตัวอักษรของห้องนั้น
  คำชม (cheer-1..3) และ done ใช้คลิปกลางของห้องอาหรับ (public/audio/th/class/) ซึ่งพูดกลางๆ ไม่ผูกภาษา

  บรรทัดที่มีตัวอักษรอังกฤษส่งแบบไม่ล็อกภาษา ให้โมเดลอ่านท่อนอังกฤษเป็นสำเนียงอังกฤษ
  เสียงพูดล้วน ไม่มีดนตรี (ข้อ 1.3) — เจ้าของโปรเจกต์ฟังก่อน commit

  วิธีใช้
    FFMPEG=<ffmpeg.exe> node scripts/make-language-class-voice.mjs en            ทั้งห้องอังกฤษ
    FFMPEG=<ffmpeg.exe> node scripts/make-language-class-voice.mjs th teach-th-ko say-th-ko
*/
import path from "node:path";

import { renderRobotLines } from "./lib/robot-voice.mjs";
import { ENGLISH_COURSE_DONE, ENGLISH_UNITS } from "../src/features/languages/data/english.ts";
import { THAI_COURSE_DONE, THAI_UNITS } from "../src/features/languages/data/thai.ts";

const COURSES = {
  en: { units: ENGLISH_UNITS, done: ENGLISH_COURSE_DONE },
  th: { units: THAI_UNITS, done: THAI_COURSE_DONE },
};

export function courseLines(course) {
  const { units, done } = COURSES[course];
  const lines = { "course-done": done.th };
  for (const step of [...units.kids, ...units.juniors].flatMap((u) => u.steps)) {
    lines[`teach-${step.id}`] = step.body.th;
    lines[`say-${step.id}`] = `ครูอ่านนำก่อนนะ ... ${step.say} ... ทีนี้ตาหนูแล้ว อ่านตามครูดังๆ`;
  }
  return lines;
}

if (process.argv[1] && import.meta.filename === path.resolve(process.argv[1])) {
  const [course, ...only] = process.argv.slice(2);
  if (!COURSES[course]) throw new Error("ระบุห้อง: en หรือ th");
  const lines = courseLines(course);
  const outDir = path.join(process.cwd(), "public", "audio", "th", "class", course);
  const latin = Object.keys(lines).filter((k) => /[A-Za-z]/.test(lines[k]));
  const plain = Object.keys(lines).filter((k) => !latin.includes(k));
  const pick = (keys) => (only.length ? keys.filter((k) => only.includes(k)) : keys);
  // ไทยล้วน: ล็อกภาษาไทยเหมือนเดิม · มีอังกฤษ: ไม่ล็อกภาษา
  if (pick(plain).length) await renderRobotLines(Object.fromEntries(plain.map((k) => [k, lines[k]])), outDir, pick(plain));
  if (pick(latin).length) await renderRobotLines(Object.fromEntries(latin.map((k) => [k, lines[k]])), outDir, pick(latin), { languageCode: null });
}
