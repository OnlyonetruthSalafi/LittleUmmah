import type { Text } from "@/i18n/config";

import type { ClassStep, ClassUnit } from "@/features/arabic/data/classroom";

/*
  ห้องเรียนภาษาไทย (เจ้าของโปรเจกต์สั่ง 9 พ.ย. 2026 "ทำห้องเรียนให้ครบเลย")
  เนื้อหาเขียนโดย Claude ตรวจตามข้อ 1 แล้ว

  พยัญชนะ 44 ตัว ใช้คำประจำตัวแบบที่เรียนในโรงเรียน ยกเว้น 7 ตัวที่คำประจำขัดข้อ 1
  เจ้าของโปรเจกต์ตัดสิน (9 พ.ย. 2026): **อ่านแค่ชื่อพยัญชนะ ไม่มีคำประจำ** ห้ามเติมคำทดแทนเอง
    ฆ ระฆัง — กระดิ่ง: มุสลิม 2114 «الجرس مزامير الشيطان» (https://shamela.ws/book/1727/5479)
    ฉ ฉิ่ง — เครื่องดนตรี (ข้อ 1.3)
    ฎ ชฎา — เครื่องสวมหัวนาฏศิลป์
    ณ เณร — สามเณร
    ฑ มณโฑ, ย ยักษ์ — ตัวละครรามเกียรติ
    ษ ฤๅษี — นักบวช

  วงจรเหมือนห้องอาหรับ: ครูสอน (teach-<id> = body.th) -> ครูอ่านนำ (say-<id>) -> เด็กอ่านตาม -> คำชม
*/

type Consonant = { id: string; c: string; name: string; word?: string; en?: string; hint?: string; note?: string };

const CONSONANTS: Consonant[] = [
  { id: "ko", c: "ก", name: "กอ", word: "ไก่", en: "chicken", note: "เป็นพยัญชนะตัวแรกของภาษาไทย" },
  { id: "kho", c: "ข", name: "ขอ", word: "ไข่", en: "egg" },
  { id: "kho-khuat", c: "ฃ", name: "ขอ", word: "ขวด", en: "bottle", note: "ปัจจุบันไม่ค่อยใช้แล้ว แต่ยังอยู่ในพยัญชนะสี่สิบสี่ตัว" },
  { id: "kho-khwai", c: "ค", name: "คอ", word: "ควาย", en: "buffalo" },
  { id: "kho-khon", c: "ฅ", name: "คอ", word: "คน", en: "person", note: "ปัจจุบันไม่ค่อยใช้แล้ว แต่ยังอยู่ในพยัญชนะสี่สิบสี่ตัว" },
  { id: "kho-rakhang", c: "ฆ", name: "คอ", hint: "เสียงเหมือน ค ควาย แต่หน้าตาต่างกัน ดูรูปบนกระดานให้ดีนะ" },
  { id: "ngo", c: "ง", name: "งอ", word: "งู", en: "snake" },
  { id: "cho", c: "จ", name: "จอ", word: "จาน", en: "plate" },
  { id: "cho-ching", c: "ฉ", name: "ฉอ", hint: "เสียงคล้าย ช ช้าง แต่เป็นเสียงสูง ดูรูปบนกระดานให้ดีนะ" },
  { id: "cho-chang", c: "ช", name: "ชอ", word: "ช้าง", en: "elephant" },
  { id: "so", c: "ซ", name: "ซอ", word: "โซ่", en: "chain" },
  { id: "cho-choe", c: "ฌ", name: "ชอ", word: "เฌอ", en: "tree" },
  { id: "yo-ying", c: "ญ", name: "ยอ", word: "หญิง", en: "woman" },
  { id: "do-chada", c: "ฎ", name: "ดอ", hint: "เสียงเหมือน ด เด็ก แต่หน้าตาต่างกัน ดูรูปบนกระดานให้ดีนะ" },
  { id: "to-patak", c: "ฏ", name: "ตอ", word: "ปฏัก", en: "goad" },
  { id: "tho-than", c: "ฐ", name: "ถอ", word: "ฐาน", en: "base" },
  { id: "tho-montho", c: "ฑ", name: "ทอ", hint: "เสียงเหมือน ท ทหาร แต่หน้าตาต่างกัน ดูรูปบนกระดานให้ดีนะ" },
  { id: "tho-phuthao", c: "ฒ", name: "ทอ", word: "ผู้เฒ่า", en: "old man" },
  { id: "no-nen", c: "ณ", name: "นอ", hint: "เสียงเหมือน น หนู แต่หน้าตาต่างกัน ดูรูปบนกระดานให้ดีนะ" },
  { id: "do", c: "ด", name: "ดอ", word: "เด็ก", en: "child" },
  { id: "to", c: "ต", name: "ตอ", word: "เต่า", en: "turtle" },
  { id: "tho-thung", c: "ถ", name: "ถอ", word: "ถุง", en: "bag" },
  { id: "tho-thahan", c: "ท", name: "ทอ", word: "ทหาร", en: "soldier" },
  { id: "tho-thong", c: "ธ", name: "ทอ", word: "ธง", en: "flag" },
  { id: "no", c: "น", name: "นอ", word: "หนู", en: "mouse" },
  { id: "bo", c: "บ", name: "บอ", word: "ใบไม้", en: "leaf" },
  { id: "po", c: "ป", name: "ปอ", word: "ปลา", en: "fish" },
  { id: "pho-phueng", c: "ผ", name: "ผอ", word: "ผึ้ง", en: "bee" },
  { id: "fo-fa", c: "ฝ", name: "ฝอ", word: "ฝา", en: "lid" },
  { id: "pho-phan", c: "พ", name: "พอ", word: "พาน", en: "tray" },
  { id: "fo-fan", c: "ฟ", name: "ฟอ", word: "ฟัน", en: "tooth" },
  { id: "pho-samphao", c: "ภ", name: "พอ", word: "สำเภา", en: "sailing ship" },
  { id: "mo", c: "ม", name: "มอ", word: "ม้า", en: "horse" },
  { id: "yo-yak", c: "ย", name: "ยอ", hint: "เป็นพยัญชนะที่ใช้บ่อยมาก ดูรูปบนกระดานให้ดีนะ" },
  { id: "ro", c: "ร", name: "รอ", word: "เรือ", en: "boat" },
  { id: "lo", c: "ล", name: "ลอ", word: "ลิง", en: "monkey" },
  { id: "wo", c: "ว", name: "วอ", word: "แหวน", en: "ring" },
  { id: "so-sala", c: "ศ", name: "สอ", word: "ศาลา", en: "pavilion" },
  { id: "so-rusi", c: "ษ", name: "สอ", hint: "เสียงเหมือน ส เสือ แต่หน้าตาต่างกัน ดูรูปบนกระดานให้ดีนะ" },
  { id: "so-suea", c: "ส", name: "สอ", word: "เสือ", en: "tiger" },
  { id: "ho-hip", c: "ห", name: "หอ", word: "หีบ", en: "chest" },
  { id: "lo-chula", c: "ฬ", name: "ลอ", word: "จุฬา", en: "star kite" },
  { id: "o", c: "อ", name: "ออ", word: "อ่าง", en: "basin" },
  { id: "ho-nokhuk", c: "ฮ", name: "ฮอ", word: "นกฮูก", en: "owl", note: "เป็นพยัญชนะตัวสุดท้าย ครบสี่สิบสี่ตัวแล้ว" },
];

const consonantStep = ({ id, c, name, word, en, hint, note }: Consonant): ClassStep => {
  const label = word ? `${c} ${word}` : c;
  const extra = note ? ` ${note}` : "";
  return {
    id: `th-${id}`,
    group: "kids",
    board: c,
    boardSize: "glyph",
    title: { th: label, en: word ? `Letter ${c} – ${en}` : `Thai letter ${c}` },
    body: word
      ? { th: `ตัวนี้คือ ${name} ${word}${extra}`, en: `This letter is called ${c} ${word}, like "${en}".` }
      : { th: `ตัวนี้คือ ${c} อ่านว่า ${name} ${hint ?? ""}`.trim(), en: `This letter is ${c}.` },
    say: word ? `${name} ${word}` : name,
  };
};

const phrase = (id: string, board: string, say: string, title: Text, body: Text, meaning?: Text): ClassStep => ({
  id: `th-${id}`,
  group: "juniors",
  board,
  boardSize: "phrase",
  title,
  body,
  say,
  meaning,
});

const KIDS_STEPS = CONSONANTS.map(consonantStep);

const JUNIOR_UNITS: ClassUnit[] = [
  {
    id: "th-vowels",
    title: { th: "สระ", en: "Vowels" },
    preview: "กะ กา",
    steps: [
      phrase("vowel-a", "กะ กา", "กะ กา", { th: "สระอะ สระอา", en: "Short and long a" }, { th: "สระอะเสียงสั้น สระอาเสียงยาว ลองฟังความต่าง กะ กับ กา", en: "Short a and long a." }),
      phrase("vowel-i", "กิ กี", "กิ กี", { th: "สระอิ สระอี", en: "Short and long i" }, { th: "สระอิเสียงสั้น สระอีเสียงยาว กิ กับ กี", en: "Short i and long i." }),
      phrase("vowel-u", "กุ กู", "กุ กู", { th: "สระอุ สระอู", en: "Short and long u" }, { th: "สระอุกับสระอูอยู่ใต้พยัญชนะ กุ กับ กู", en: "These vowels sit under the letter." }),
      phrase("vowel-e", "เก แก โก", "เก แก โก", { th: "สระเอ แอ โอ", en: "e, ae, o" }, { th: "สระเอ แอ โอ เขียนไว้ข้างหน้าพยัญชนะ แต่อ่านทีหลัง เก แก โก", en: "These vowels are written before the letter." }),
    ],
  },
  {
    id: "th-tones",
    title: { th: "วรรณยุกต์", en: "Tones" },
    preview: "ก่ ก้",
    steps: [
      phrase("tones-ka", "กา ก่า ก้า ก๊า ก๋า", "กา ก่า ก้า ก๊า ก๋า", { th: "ผันเสียง กา", en: "Five tones" }, { th: "ภาษาไทยมีห้าเสียง เติมไม้เอก ไม้โท ไม้ตรี ไม้จัตวา เสียงก็เปลี่ยน", en: "Thai has five tones." }),
      phrase("tones-ma", "มา ม่า ม้า", "มา ม่า ม้า", { th: "ผันเสียง มา", en: "Tones with ma" }, { th: "มา คือเดินมาหา ม้า คือสัตว์ที่เราขี่ เติมวรรณยุกต์แล้วความหมายเปลี่ยนเลย", en: "A tone mark can change the meaning." }),
    ],
  },
  {
    id: "th-numbers",
    title: { th: "เลขไทย", en: "Thai numbers" },
    preview: "๑ ๒ ๓",
    steps: [
      phrase("numbers-1", "๑ ๒ ๓ ๔ ๕", "หนึ่ง สอง สาม สี่ ห้า", { th: "เลขไทย ๑ ถึง ๕", en: "Thai digits 1–5" }, { th: "นี่คือเลขไทย หนึ่งถึงห้า ชูนิ้วตามครูไปด้วยนะ", en: "Thai digits one to five." }, { th: "1 2 3 4 5", en: "1 2 3 4 5" }),
      phrase("numbers-2", "๖ ๗ ๘ ๙ ๑๐", "หก เจ็ด แปด เก้า สิบ", { th: "เลขไทย ๖ ถึง ๑๐", en: "Thai digits 6–10" }, { th: "นับต่อจากหก ไปจนถึงสิบ เลขสิบเขียนด้วยเลขหนึ่งกับเลขศูนย์", en: "Thai digits six to ten." }, { th: "6 7 8 9 10", en: "6 7 8 9 10" }),
    ],
  },
  {
    id: "th-words",
    title: { th: "คำง่ายๆ", en: "Easy words" },
    preview: "บ้าน",
    steps: [
      phrase("home", "บ้าน ประตู หน้าต่าง", "บ้าน ประตู หน้าต่าง", { th: "ในบ้าน", en: "At home" }, { th: "คำที่เจอในบ้าน บ้าน ประตู หน้าต่าง ก่อนเข้าบ้านกล่าวสลามนะ", en: "Words at home." }, { th: "บ้าน ประตู หน้าต่าง", en: "house, door, window" }),
      phrase("family", "พ่อ แม่ พี่ น้อง", "พ่อ แม่ พี่ น้อง", { th: "ครอบครัว", en: "Family" }, { th: "พ่อ แม่ พี่ น้อง คือครอบครัวของเรา เราเชื่อฟังและทำดีกับพ่อแม่", en: "We are kind to our parents." }, { th: "พ่อ แม่ พี่ น้อง", en: "father, mother, older sibling, younger sibling" }),
      phrase("nature", "ฟ้า ฝน ดาว", "ฟ้า ฝน ดาว", { th: "ธรรมชาติ", en: "Nature" }, { th: "ฟ้า ฝน ดาว อัลลอฮ์ทรงสร้างทั้งหมดนี้ ฝนทำให้ต้นไม้เติบโต", en: "Allah created the sky, the rain and the stars." }, { th: "ฟ้า ฝน ดาว", en: "sky, rain, star" }),
    ],
  },
];

export const THAI_UNITS: Record<"kids" | "juniors", ClassUnit[]> = {
  kids: [{ id: "th-letters", title: { th: "พยัญชนะ ก–ฮ", en: "Consonants ก–ฮ" }, preview: "ก ข ค", steps: KIDS_STEPS }],
  juniors: JUNIOR_UNITS,
};

/** คลิป course-done ของห้องนี้ (จบ ก–ฮ) */
export const THAI_COURSE_DONE = {
  th: "เก่งมากเลย หนูเรียนพยัญชนะไทยครบสี่สิบสี่ตัว ตั้งแต่ กอ ไก่ ถึง ฮอ นกฮูก แล้ว กลับมาทบทวนกับครูได้ทุกวันนะ",
  en: "Well done! You learned all 44 Thai consonants.",
};
