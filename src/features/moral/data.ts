/*
  ข้อมูลเฉพาะหน้าเกาะมารยาท (/learn/moral) — ตัวบทเรียนยังอยู่ที่ lib/lessons.ts ที่เดียว
  ไฟล์นี้เก็บเฉพาะสิ่งที่หน้าตาใหม่ (ตาม mock tests/MoralPage.png) ต้องใช้เพิ่ม:
  ภาพการ์ด, คำอธิบายช่วงวัย, และบทพูดของหุ่นยนต์นำทาง

  ภาพทุกใบจาก Codex (CODEX_MORAL_BRIEF.md) ไม่มีตัวหนังสือฝังในภาพ (AGENTS.md ข้อ 1.5)
  ข้อความ الحمد لله บนการ์ด "เมื่อจาม" จึงเป็นข้อความจริงที่วางทับบอลลูนว่างในภาพ
*/

export type AgeId = "kids" | "juniors";

/** ภาพประกอบการ์ดของแต่ละบทเรียน (key = id ใน lib/lessons.ts) */
export const CARD_ART: Record<string, string> = {
  bismillah: "/moral/card-bismillah.webp",
  salam: "/moral/card-salam.webp",
  smile: "/moral/card-smile.webp",
  clean: "/moral/card-clean.webp",
  parents: "/moral/card-parents.webp",
  truth: "/moral/card-truth.webp",
  sneeze: "/moral/card-sneeze.webp",
  animals: "/moral/card-animals.webp",
};

/**
  ข้อความบนบอลลูนว่างในภาพ — ตำแหน่งเป็น % ของกรอบภาพ วัดจากภาพจริง
  ตัวอาหรับเป็นข้อความจริง เบราว์เซอร์จัดทิศเอง (lang="ar" dir="rtl")
*/
export const CARD_BUBBLE: Record<string, { text: string; left: number; top: number; width: number }> = {
  sneeze: { text: "الْحَمْدُ لِلَّهِ", left: 47, top: 11, width: 44 },
};

export const AGE_SECTIONS: Record<
  AgeId,
  { labelTh: string; labelEn: string; descTh: string; descEn: string; badge: string }
> = {
  kids: {
    labelTh: "วัย 3-6 ปี",
    labelEn: "Ages 3-6",
    descTh: "เรียนรู้มารยาทพื้นฐานในชีวิตประจำวัน",
    descEn: "Everyday good manners",
    badge: "/moral/age-kids.webp",
  },
  juniors: {
    labelTh: "วัย 7 ปีขึ้นไป",
    labelEn: "Ages 7+",
    descTh: "ฝึกมารยาทที่ลึกขึ้น เพื่อเป็นมุสลิมที่ดีในทุกสถานการณ์",
    descEn: "Deeper manners for every situation",
    badge: "/moral/age-juniors.webp",
  },
};

/*
  บทของหุ่นยนต์นำทาง — หนึ่งจังหวะ = หนึ่งคลิปเสียง + หนึ่งท่า + ข้อความในบอลลูน
  ข้อความไทยต้องตรงกับบทใน scripts/make-moral-voice.mjs (เสียงอัดจากบทนั้น)
  focus = ปุ่มช่วงวัยที่หุ่นยนต์ชี้ในจังหวะนั้น ปุ่มจะมีวงแสงรอบหนึ่งครั้ง (ไม่กะพริบวน ข้อ 2.1)
  ms = เวลาแสดงเมื่อไม่มีเสียง (ปิดเสียงอยู่ หรือเบราว์เซอร์ไม่ยอมเล่นเสียงอัตโนมัติ)
*/
export type GuidePose = "wave" | "point" | "stand";

export const GUIDE_STEPS: {
  clip: string;
  pose: GuidePose;
  focus?: AgeId;
  th: string;
  en: string;
  ms: number;
}[] = [
  {
    clip: "moral-intro",
    pose: "wave",
    th: "อัสสะลามุอะลัยกุม ยินดีต้อนรับสู่เกาะมารยาท มาฝึกเป็นมุสลิมที่มีมารยาทดีไปด้วยกันนะ",
    en: "Assalamu alaikum! Welcome to Manners Island.",
    ms: 5000,
  },
  {
    clip: "moral-kids",
    pose: "point",
    focus: "kids",
    th: "น้องวัย 3-6 ขวบ กดปุ่มสีเหลือง ไปดูมารยาทง่ายๆ เช่น กล่าวบิสมิลลาฮ์ก่อนกิน และกล่าวสลามเมื่อพบกัน",
    en: "Ages 3-6: tap the yellow button for simple everyday manners.",
    ms: 6000,
  },
  {
    clip: "moral-juniors",
    pose: "point",
    focus: "juniors",
    th: "พี่ๆ 7 ขวบขึ้นไป กดปุ่มสีเขียว ไปฝึกมารยาทที่ลึกขึ้น เช่น ทำดีต่อพ่อแม่ และพูดความจริง",
    en: "Ages 7+: tap the green button for deeper manners.",
    ms: 6000,
  },
  {
    clip: "moral-howto",
    pose: "stand",
    th: "แตะการ์ดแล้วฟังเรื่องไปด้วยกัน ฝึกทุกวันจะได้ดาวเพิ่มนะ ถ้าอยากฟังอีก แตะที่ตัวหุ่นยนต์ได้เลย",
    en: "Tap a card to listen. Practise every day to earn stars. Tap me to hear this again.",
    ms: 6000,
  },
];
