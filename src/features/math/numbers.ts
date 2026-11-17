import type { Text } from "@/i18n/config";

/*
  ส่วน "รู้จักตัวเลข" ของเกาะคณิต (Claude, 18 พ.ย. 2026 — เจ้าของสั่งให้มีการสอนตัวเลขพื้นฐานบนเกาะ)
  วัย 3–6: 1–10 แตะตัวเลขแล้วนิ้วบนสองมือเหยียดขึ้นทีละนิ้วตามเสียงนับ (เจ้าของสั่ง 18 พ.ย. 2026: เด็กชอบนับนิ้ว)
  วัย 7+: 11–20 ดาวสิบดวงเต็มแผงก่อน ("สิบ") แล้วนับต่อ — สอนว่า 13 = สิบ กับ สาม
  เสียง: หนึ่ง–สิบใช้คลิปเดิม public/audio/th/coin-count-N.mp3 · สิบเอ็ด–ยี่สิบ + คำแนะนำ อยู่ที่ public/audio/th/math/
  (scripts/make-math-voice.mjs) · ไม่มีดนตรี ไม่มีภาพสิ่งมีชีวิต (ดาวเป็น SVG)
*/
export const ONE_TO_TEN: Text[] = ["หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ"].map((th, i) => ({
  th,
  en: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][i],
}));
export const TEEN_WORDS: Text[] = ["สิบเอ็ด", "สิบสอง", "สิบสาม", "สิบสี่", "สิบห้า", "สิบหก", "สิบเจ็ด", "สิบแปด", "สิบเก้า", "ยี่สิบ"].map((th, i) => ({
  th,
  en: ["eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"][i],
}));

export const numberWord = (n: number): Text => (n <= 10 ? ONE_TO_TEN[n - 1] : TEEN_WORDS[n - 11]);
/** เสียงของเลข n (ไฟล์ใน public/audio/th/) */
export const numberClip = (n: number) => (n <= 10 ? `coin-count-${n}` : `math/num-${n}`);
const THAI_DIGITS = "๐๑๒๓๔๕๖๗๘๙";
export const thaiDigits = (n: number) => String(n).replace(/\d/g, (d) => THAI_DIGITS[+d]);

export const NUMBER_TEXT = {
  titleKids: { th: "รู้จักตัวเลข 1–10", en: "Meet the numbers 1–10" },
  titleJuniors: { th: "ตัวเลข 11–20: สิบ กับอีกเท่าไร", en: "Numbers 11–20: ten and some more" },
  howtoKids: { th: "แตะตัวเลข แล้วชูนิ้วนับไปพร้อมกับครูนะ นับหนึ่ง ชูนิ้วหนึ่งนิ้ว", en: "Tap a number and count on your fingers with me. One count, one finger." },
  howtoJuniors: { th: "แตะตัวเลข ดาวสิบดวงเต็มแผงแรก แล้วนับต่อจากสิบในแผงที่สองนะ", en: "Tap a number. The first frame holds ten stars, then count on from ten." },
  again: { th: "นับอีกครั้ง", en: "Count again" },
  listen: { th: "ฟังวิธีเล่น", en: "How to play" },
  pick: { th: "เลือกตัวเลข", en: "Choose a number" },
  tenAnd: { th: "สิบ กับ", en: "ten and" },
  stars: { th: "ดวง", en: "stars" },
} satisfies Record<string, Text>;
