// เสียงครูนูรีของเกาะคณิต (ส่วนรู้จักตัวเลข) — ElevenLabs Leo + ฟิลเตอร์หุ่นยนต์ (scripts/lib/robot-voice.mjs)
// หนึ่ง–สิบ ใช้คลิปเดิมของเกมกล่องเหรียญ (public/audio/th/coin-count-1..10.mp3) ไม่อัดซ้ำ
// รัน: node scripts/make-math-voice.mjs [key...]
import { renderRobotLines } from './lib/robot-voice.mjs';
import { TEEN_WORDS, NUMBER_TEXT } from '../src/features/math/numbers.ts';
export const lines = {
  ...Object.fromEntries(TEEN_WORDS.map((w, i) => [`num-${i + 11}`, w.th])),
  'num-howto-kids': NUMBER_TEXT.howtoKids.th,
  'num-howto-juniors': NUMBER_TEXT.howtoJuniors.th,
};
await renderRobotLines(lines, 'public/audio/th/math', process.argv.slice(2));
