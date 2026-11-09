import type { Text } from "@/i18n/config";

import type { ClassStep, ClassUnit } from "@/features/arabic/data/classroom";

/*
  ห้องเรียนภาษาอังกฤษ (เจ้าของโปรเจกต์สั่ง 9 พ.ย. 2026 "ทำห้องเรียนให้ครบเลย")
  เนื้อหาเขียนโดย Claude ตรวจตามข้อ 1 แล้ว: คำศัพท์เป็นสิ่งของ ธรรมชาติ และคำในบ้าน
  ไม่มีหมู เครื่องดนตรี (กลอง กระดิ่ง) หรือเทศกาลของศาสนาอื่น

  วงจรเหมือนห้องอาหรับ: ครูสอน (teach-<id> = body.th) -> ครูอ่านนำ (say-<id>) -> เด็กอ่านตาม -> คำชม
  board = ข้อความอังกฤษจริงบนกระดาน (ไม่ฝังในภาพ ข้อ 1.5)
  say = สิ่งที่เด็กอ่านตาม เขียนเป็นอังกฤษ เพราะต้องการให้ออกเสียงอังกฤษ (เสียงอัดส่งแบบไม่ล็อกภาษา)
*/

type Letter = { l: string; name: string; word: string; th: string };

// ชื่อตัวอักษรเป็นคำอ่านไทย (name) ใช้ในคำสอนภาษาไทย · word = คำที่ขึ้นต้นด้วยตัวนั้น · th = ความหมาย
const LETTERS: Letter[] = [
  { l: "A", name: "เอ", word: "apple", th: "แอปเปิล" },
  { l: "B", name: "บี", word: "ball", th: "ลูกบอล" },
  { l: "C", name: "ซี", word: "cup", th: "ถ้วย" },
  { l: "D", name: "ดี", word: "door", th: "ประตู" },
  { l: "E", name: "อี", word: "egg", th: "ไข่" },
  { l: "F", name: "เอฟ", word: "fish", th: "ปลา" },
  { l: "G", name: "จี", word: "grapes", th: "องุ่น" },
  { l: "H", name: "เอช", word: "house", th: "บ้าน" },
  { l: "I", name: "ไอ", word: "ice", th: "น้ำแข็ง" },
  { l: "J", name: "เจ", word: "juice", th: "น้ำผลไม้" },
  { l: "K", name: "เค", word: "kite", th: "ว่าว" },
  { l: "L", name: "แอล", word: "leaf", th: "ใบไม้" },
  { l: "M", name: "เอ็ม", word: "moon", th: "ดวงจันทร์" },
  { l: "N", name: "เอ็น", word: "nest", th: "รังนก" },
  { l: "O", name: "โอ", word: "orange", th: "ส้ม" },
  { l: "P", name: "พี", word: "pen", th: "ปากกา" },
  { l: "Q", name: "คิว", word: "quilt", th: "ผ้าห่มนวม" },
  { l: "R", name: "อาร์", word: "rain", th: "ฝน" },
  { l: "S", name: "เอส", word: "sun", th: "ดวงอาทิตย์" },
  { l: "T", name: "ที", word: "tree", th: "ต้นไม้" },
  { l: "U", name: "ยู", word: "umbrella", th: "ร่ม" },
  { l: "V", name: "วี", word: "van", th: "รถตู้" },
  { l: "W", name: "ดับเบิลยู", word: "water", th: "น้ำ" },
  { l: "X", name: "เอ็กซ์", word: "box", th: "กล่อง" },
  { l: "Y", name: "วาย", word: "yellow", th: "สีเหลือง" },
  { l: "Z", name: "แซด", word: "zero", th: "ศูนย์" },
];

const letterStep = ({ l, name, word, th }: Letter): ClassStep => ({
  id: `en-${l.toLowerCase()}`,
  group: "kids",
  board: `${l}${l.toLowerCase()}`,
  boardSize: "glyph",
  title: { th: `ตัว ${l}`, en: `Letter ${l}` },
  body:
    l === "X"
      ? {
          th: `ตัวนี้คือตัว ${name} ตัว X มักอยู่ท้ายคำ เช่น ${word} แปลว่า ${th} ฟังเสียงท้ายคำนะ`,
          en: `This is X. X often comes at the end of a word, like ${word}.`,
        }
      : {
          th: `ตัวนี้คือตัว ${name} ตัว ${l} ใช้ขึ้นต้นคำว่า ${word} แปลว่า ${th}`,
          en: `This is ${l}. ${l} is for ${word}.`,
        },
  say: `${l} ... ${word}`,
  meaning: { th: `${word} = ${th}`, en: word },
});

const phrase = (id: string, board: string, title: Text, body: Text, meaning?: Text): ClassStep => ({
  id: `en-${id}`,
  group: "juniors",
  board,
  boardSize: "phrase",
  title,
  body,
  say: board,
  meaning,
});

const KIDS_STEPS = LETTERS.map(letterStep);

const JUNIOR_UNITS: ClassUnit[] = [
  {
    id: "en-manners",
    title: { th: "คำสุภาพ", en: "Polite words" },
    preview: "Hello",
    steps: [
      phrase("hello", "Hello", { th: "ทักทาย", en: "Hello" }, { th: "Hello ใช้ทักทายเมื่อพบกัน ถ้าเจอพี่น้องมุสลิม เรากล่าวสลามนะ", en: "Say hello when you meet someone." }, { th: "สวัสดี", en: "Hello" }),
      phrase("thank-you", "Thank you", { th: "ขอบคุณ", en: "Thank you" }, { th: "Thank you แปลว่า ขอบคุณ พูดเมื่อมีคนช่วยเรา หรือให้ของเรา", en: "Say thank you when someone helps you." }, { th: "ขอบคุณ", en: "Thank you" }),
      phrase("please", "Please", { th: "ขอร้องอย่างสุภาพ", en: "Please" }, { th: "Please ใช้ตอนขอสิ่งของอย่างสุภาพ เช่น ขอน้ำหน่อย water please", en: "Say please when you ask for something." }, { th: "ได้โปรด / ขอหน่อยนะ", en: "Please" }),
      phrase("sorry", "Sorry", { th: "ขอโทษ", en: "Sorry" }, { th: "Sorry แปลว่า ขอโทษ พูดเมื่อเราทำผิด หรือทำให้เพื่อนเสียใจ", en: "Say sorry when you make a mistake." }, { th: "ขอโทษ", en: "Sorry" }),
    ],
  },
  {
    id: "en-numbers",
    title: { th: "ตัวเลข", en: "Numbers" },
    preview: "1 2 3",
    steps: [
      phrase("one-five", "one two three four five", { th: "นับ 1 ถึง 5", en: "Count 1 to 5" }, { th: "มานับหนึ่งถึงห้าเป็นภาษาอังกฤษกัน ชูนิ้วตามครูไปด้วยนะ", en: "Let's count from one to five." }, { th: "1 2 3 4 5", en: "1 2 3 4 5" }),
      phrase("six-ten", "six seven eight nine ten", { th: "นับ 6 ถึง 10", en: "Count 6 to 10" }, { th: "นับต่อจากหก ไปจนถึงสิบ ใช้นิ้วทั้งสองมือเลย", en: "Let's count from six to ten." }, { th: "6 7 8 9 10", en: "6 7 8 9 10" }),
    ],
  },
  {
    id: "en-colors",
    title: { th: "สี", en: "Colours" },
    preview: "red",
    steps: [
      phrase("colors-1", "red blue yellow", { th: "แม่สี", en: "Primary colours" }, { th: "red คือสีแดง blue คือสีน้ำเงิน yellow คือสีเหลือง เป็นแม่สีสามสี", en: "Red, blue and yellow are the primary colours." }, { th: "แดง น้ำเงิน เหลือง", en: "red, blue, yellow" }),
      phrase("colors-2", "green white black", { th: "สีรอบตัว", en: "Colours around us" }, { th: "green คือสีเขียวเหมือนใบไม้ white คือสีขาวเหมือนเมฆ black คือสีดำเหมือนท้องฟ้ากลางคืน", en: "Green like leaves, white like clouds, black like the night sky." }, { th: "เขียว ขาว ดำ", en: "green, white, black" }),
    ],
  },
  {
    id: "en-words",
    title: { th: "คำศัพท์", en: "Words" },
    preview: "book",
    steps: [
      phrase("school", "book pen bag chair", { th: "ของในห้องเรียน", en: "In the classroom" }, { th: "book คือหนังสือ pen คือปากกา bag คือกระเป๋า chair คือเก้าอี้", en: "Things we use at school." }, { th: "หนังสือ ปากกา กระเป๋า เก้าอี้", en: "book, pen, bag, chair" }),
      phrase("family", "mother father brother sister", { th: "ครอบครัว", en: "Family" }, { th: "mother คือแม่ father คือพ่อ brother คือพี่ชายหรือน้องชาย sister คือพี่สาวหรือน้องสาว", en: "The people in our family." }, { th: "แม่ พ่อ พี่น้องชาย พี่น้องสาว", en: "mother, father, brother, sister" }),
      phrase("nature", "sun moon star tree", { th: "ธรรมชาติ", en: "Nature" }, { th: "sun คือดวงอาทิตย์ moon คือดวงจันทร์ star คือดาว tree คือต้นไม้ อัลลอฮ์ทรงสร้างทั้งหมดนี้", en: "Allah created the sun, the moon, the stars and the trees." }, { th: "ดวงอาทิตย์ ดวงจันทร์ ดาว ต้นไม้", en: "sun, moon, star, tree" }),
      phrase("food", "rice milk bread water", { th: "อาหาร", en: "Food" }, { th: "rice คือข้าว milk คือนม bread คือขนมปัง water คือน้ำ ก่อนกินอย่าลืมกล่าวบิสมิลลาฮ์นะ", en: "Say bismillah before you eat." }, { th: "ข้าว นม ขนมปัง น้ำ", en: "rice, milk, bread, water" }),
    ],
  },
];

export const ENGLISH_UNITS: Record<"kids" | "juniors", ClassUnit[]> = {
  kids: [{ id: "en-letters", title: { th: "ตัวอักษร A–Z", en: "Letters A–Z" }, preview: "A B C", steps: KIDS_STEPS }],
  juniors: JUNIOR_UNITS,
};

/** คลิป course-done ของห้องนี้ (จบ A–Z) */
export const ENGLISH_COURSE_DONE = {
  th: "เก่งมากเลย หนูเรียนตัวอักษรภาษาอังกฤษครบยี่สิบหกตัว ตั้งแต่ A ถึง Z แล้ว กลับมาทบทวนกับครูได้ทุกวันนะ",
  en: "Well done! You learned all 26 letters from A to Z.",
};
