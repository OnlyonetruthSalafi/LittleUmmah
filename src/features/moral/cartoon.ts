import type { GuidePose } from "./data";

/*
  การ์ตูนบทเรียนบนเกาะมารยาท — ครูหุ่นยนต์ "นูรี" (หุ่นยนต์ตัวหลักของเว็บ) พาเด็กไปดูเหตุการณ์ทีละฉาก

  บทเรียน "บิสมิลลาฮ์ก่อนกิน" (วัย 3-6 ปี) — เจ้าของโปรเจกต์กำหนด:
  สอนแค่ให้พูด "บิสมิลลาฮ์" ในแต่ละเหตุการณ์ ไม่ให้หุ่นยนต์พูดหะดีษ ไม่สอนดุอาอ์ยาว

  หนึ่งฉาก = ภาพฉาก + คลิปเสียง + ท่าของนูรี + ข้อความใต้ภาพ (ไทยนำ อังกฤษรอง)
  ข้อความไทยต้องตรงกับบทใน scripts/make-bismillah-voice.mjs
  sayAlong = จบคลิปแล้วเว้นจังหวะให้เด็กพูดตาม ป้าย บิสมิลลาฮ์ บนฉากจะเด่นขึ้น
  ภาพฉากจาก Codex (CODEX_BISMILLAH_BRIEF.md) เว้นพื้นด้านขวาไว้ให้นูรียืน ไม่มีตัวหนังสือในภาพ
*/
export type CartoonScene = {
  bg: string;
  clip: string;
  pose: GuidePose;
  th: string;
  en: string;
  sayAlong?: boolean;
  /** เวลาแสดงเมื่อไม่มีเสียง (ปิดเสียง หรือเล่นเสียงไม่ได้) */
  ms: number;
};

const BG = (name: string) => `/moral/bismillah/scene-${name}.webp`;

export const CARTOONS: Record<string, CartoonScene[]> = {
  bismillah: [
    {
      bg: BG("class"),
      clip: "bis-hello",
      pose: "wave",
      th: "อัสสะลามุอะลัยกุม เพื่อนๆ ครูชื่อ นูรี เป็นหุ่นยนต์ครูของเกาะมารยาท ยินดีที่ได้รู้จักนะ",
      en: "Assalamu alaikum! I'm Nuri, the robot teacher of Manners Island.",
      ms: 5500,
    },
    {
      bg: BG("class"),
      clip: "bis-teach",
      pose: "stand",
      th: "วันนี้ครูจะสอนให้พูดว่า บิสมิลลาฮ์ แปลว่า ด้วยพระนามของอัลลอฮ์ พูดตามครูนะ บิสมิลลาฮ์",
      en: "Today we learn to say Bismillah — “in the name of Allah”. Say it with me!",
      sayAlong: true,
      ms: 6500,
    },
    {
      bg: BG("eat"),
      clip: "bis-eat",
      pose: "point",
      th: "ก่อนกินข้าว เราพูดว่า บิสมิลลาฮ์ แล้วกินด้วยมือขวานะ",
      en: "Before eating, we say Bismillah and eat with our right hand.",
      sayAlong: true,
      ms: 5500,
    },
    {
      bg: BG("door"),
      clip: "bis-door",
      pose: "point",
      th: "ตอนเข้าบ้าน เราพูดว่า บิสมิลลาฮ์",
      en: "When we come into the house, we say Bismillah.",
      sayAlong: true,
      ms: 4500,
    },
    {
      bg: BG("car"),
      clip: "bis-car",
      pose: "point",
      th: "ตอนขึ้นรถ เราพูดว่า บิสมิลลาฮ์",
      en: "When we get into the car, we say Bismillah.",
      sayAlong: true,
      ms: 4500,
    },
    {
      bg: BG("bed"),
      clip: "bis-bed",
      pose: "point",
      th: "ก่อนนอน เราพูดว่า บิสมิลลาฮ์",
      en: "Before we sleep, we say Bismillah.",
      sayAlong: true,
      ms: 4500,
    },
    {
      bg: BG("class"),
      clip: "bis-bye",
      pose: "wave",
      th: "เก่งมากเลย จำไว้นะ ก่อนกิน ตอนเข้าบ้าน ตอนขึ้นรถ และก่อนนอน เราพูดว่า บิสมิลลาฮ์",
      en: "Well done! Before eating, coming home, getting in the car and sleeping — say Bismillah.",
      ms: 6500,
    },
  ],
};

/** จังหวะเงียบให้เด็กพูดตามหลังจบคลิป */
export const SAY_ALONG_MS = 2600;
