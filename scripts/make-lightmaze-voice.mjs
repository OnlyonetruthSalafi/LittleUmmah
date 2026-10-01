/*
  สร้างเสียงหุ่นยนต์ของเกมเขาวงกตแสง -> public/audio/th/

  ใช้เสียงและฟิลเตอร์ชุดเดียวกับหุ่นยนต์ทั้งเว็บ (scripts/lib/robot-voice.mjs)
  บทมาจาก output/orbmaze-plan/PLAN.md §7 — ใช้คำอิสลามให้ถูกที่: บิสมิลลาฮ์ก่อนเริ่ม
  มาชาอัลลอฮ์เป็นคำชมครั้งเดียว อัลฮัมดุลิลลาฮ์เมื่อทำสำเร็จ ไม่อ้างหะดีษหรืออายะฮ์ ไม่บอกว่าเล่นแล้วได้บุญ
  ทุกไฟล์ต้องให้เจ้าของโปรเจกต์ฟังและอนุมัติก่อน commit และก่อนเพิ่ม key ใน RECORDED_CLIPS (src/lib/speech.ts)

  วิธีใช้
    FFMPEG=<path ของ ffmpeg.exe> node scripts/make-lightmaze-voice.mjs [ชื่อคลิป ...]
*/
import path from "node:path";

import { renderRobotLines } from "./lib/robot-voice.mjs";

const LINES = {
  // ชื่อเกาะตอนชี้เมาส์ในหน้ารวมเกม (ไทยอย่างเดียว เหมือนเกาะอื่น)
  "name-light-maze": "เขาวงกตแสง",
  // ปุ่มฟังวิธีเล่น: ไทยแล้วต่อด้วยอังกฤษ เหมือนคลิป game-<slug> ของเกมอื่น
  "game-light-maze": "เก็บแสงให้ครบ เลือกทางหลบเพื่อนหุ่นยนต์นะ Collect every light, and find a way around the robot friends.",
  // ระหว่างเล่น ไทยอย่างเดียว สั้น ไม่รบกวนการเล่น
  "orbmaze-start": "บิสมิลลาฮ์ มาเก็บแสงกัน",
  "orbmaze-star": "ได้พลังแสงแล้ว เพื่อนหุ่นยนต์จะหลบให้สักครู่นะ",
  "orbmaze-slow": "เพื่อนหุ่นยนต์เดินช้าลงแล้ว ค่อยๆ เลือกทางนะ",
  "orbmaze-shield": "ได้โล่แล้ว ช่วยกันการแตะได้หนึ่งครั้ง",
  "orbmaze-warp": "ประตูนี้พาไปอีกจุด ลองเลือกทางต่อได้เลย",
  "orbmaze-bump": "ไม่เป็นไร แสงยังอยู่ครบ เราไปต่อกันนะ",
  "orbmaze-praise": "มาชาอัลลอฮ์ ตั้งใจเก็บแสงได้ดีเลย",
  "orbmaze-complete": "อัลฮัมดุลิลลาฮ์ เก็บแสงครบแล้ว",
};

await renderRobotLines(LINES, path.join(process.cwd(), "public", "audio", "th"), process.argv.slice(2));
