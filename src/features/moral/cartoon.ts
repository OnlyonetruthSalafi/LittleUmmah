import type { Text } from "@/i18n/config";
import type { FriendId, FriendPose } from "@/lib/friends";

import type { GuidePose } from "./data";

/*
  การ์ตูนบทเรียนบนเกาะมารยาท — ครูหุ่นยนต์ "นูรี" (หุ่นยนต์ตัวหลักของเว็บ) พาไปดูเหตุการณ์ทีละฉาก

  ตัวละครในฉาก = หุ่นยนต์ทั้งหมด ไม่มีเด็กหรือคนเลย แม้หันหลัง (เจ้าของโปรเจกต์ตัดสิน 2 ต.ค. 2026)
  หุ่นยนต์ในฉากมาจากแผ่นตัวละครที่เจ้าของโปรเจกต์อนุมัติ (docs/briefs/archive/CODEX_MORAL_CAST_BRIEF.md):
  น้องหุ่นส้ม (ตัวเดินเรื่อง) น้องหุ่นเขียว (เพื่อน) พ่อหุ่น (น้ำเงิน) แม่หุ่น (ม่วง)
  ส่วนนูรีวางด้วยโค้ดทางขวาเสมอ ภาพฉาก (docs/briefs/archive/CODEX_MORAL_SCENES_BRIEF.md) เว้นพื้นด้านขวาไว้ให้ ไม่มีตัวหนังสือในภาพ
  สัตว์ในเรื่องเมตตาต่อสัตว์ใบหน้าว่างตามข้อ 1.1 (เจ้าของโปรเจกต์เลือก 2 ต.ค. 2026)

  วัย 3-6 ปี: สอนแค่สิ่งที่ต้องทำและคำที่ต้องพูด ไม่สอนดุอาอ์ยาว
  C-8 (8 พ.ย. 2026): เจ้าของอนุมัติดุอาอ์ก่อนนอนสั้นๆ พร้อมคำเกริ่นท่านนบีตาม brief
  วัย 7 ปีขึ้นไป: เล่าหะดีษเศาะฮีห์สั้นๆ ได้ (เจ้าของโปรเจกต์อนุญาต 2 ต.ค. 2026) หลักฐานกำกับไว้ใน lib/lessons.ts

  หนึ่งฉาก = ภาพฉาก + คลิปเสียง + ท่าของนูรี + ข้อความใต้ภาพ (ไทยนำ อังกฤษรอง)
  ข้อความไทยต้องตรงกับบทใน scripts/make-moral-cartoon-voice.mjs (เสียงพูดอาจมี "พูดตามครู" ต่อท้าย)
  sayAlong = จบคลิปแล้วเว้นจังหวะให้เด็กพูดตาม ป้ายคำบนฉากจะเด่นขึ้น
*/
/** compact = ป้ายตัวเล็กสำหรับข้อความยาวมาก (อายะฮ์บนเกาะสำรวจโลก) ป้ายดุอาอ์ของเกาะมารยาทไม่ใช้ */
export type Word = { ar: string; th: string; compact?: boolean };

/**
  ภาพถ่ายสัตว์จริงในช่วงสอน (เกาะสำรวจโลก) — AGENTS.md ข้อ 1.1 "ภาพถ่ายสัตว์เพื่อการสอน"
  วางในกรอบเหนือภาพฉาก ไม่ใช่ภาพพื้นหลัง และต้องมีเครดิตกำกับเสมอ
*/
export type ScenePhoto = {
  src: string;
  width: number;
  height: number;
  /** alt ภาษาไทย บอกว่าเป็นสัตว์อะไร ทำอะไร — ภาพนี้สื่อความหมาย ไม่ใช่ภาพตกแต่ง */
  alt: Text;
  /** ป้ายชื่อใต้ภาพ */
  label: { th: string; en: string };
  /** เครดิตสั้นใต้ภาพ เช่น "ภาพ: Drew Avery (CC BY 2.0)" */
  credit: Text;
};

export type CartoonScene = {
  bg: string;
  photo?: ScenePhoto;
  clip: string;
  pose: GuidePose;
  th: string;
  en: string;
  sayAlong?: boolean;
  /** ดุอาอ์เต็มบทยาวต้องเผื่อเวลาให้เด็กพูดตามมากกว่าคำสั้นๆ */
  sayAlongMs?: number;
  /** ป้ายคำเฉพาะฉากนี้ แทนป้ายของบท (null = ไม่แสดงป้ายในฉากนี้) */
  word?: Word | null;
  /** เวลาแสดงเมื่อไม่มีเสียง (ปิดเสียง หรือเล่นเสียงไม่ได้) */
  ms: number;
  /** ผองเพื่อนนูรีที่ยืนในฉาก (วางด้วยโค้ดทางซ้าย/กลาง นูรียืนขวาเสมอ) — ใช้เฉพาะบท meet-friends */
  cast?: { id: FriendId; pose: FriendPose }[];
  /** เพื่อนที่พูดในฉากนี้ (เสียงของเพื่อนตัวนั้น) แสดงชื่อเป็นข้อความเหนือคำบรรยาย ไม่มี = ครูนูรีพูด */
  speaker?: FriendId;
};

export type Cartoon = {
  /** ดุอาอ์ยาว: วางป้ายคำเหนือภาพเพื่อคงขนาดอ่านง่าย ไม่บังหุ่นยนต์ */
  wordPlacement?: "above";
  /** ป้ายคำที่สอนกลางฉาก (ข้อความจริง ไม่ฝังในภาพ ข้อ 1.5) ไม่แสดงในฉากแรก — บทที่ไม่มีคำให้พูดตามไม่ต้องใส่ */
  word?: Word;
  scenes: CartoonScene[];
};

const BG = (name: string) => `/moral/scenes/${name}.webp`;
const CLASS = BG("class");

const SALAM: Word = { ar: "السَّلَامُ عَلَيْكُمْ", th: "อัสสะลามุอะลัยกุม" };
const HAMD: Word = { ar: "الْحَمْدُ لِلَّهِ", th: "อัลฮัมดุลิลลาฮ์" };
const YARHAM: Word = { ar: "يَرْحَمُكَ اللَّهُ", th: "ยัรฮะมุกัลลอฮ์" };
const YAHDI: Word = { ar: "يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ", th: "ยะฮ์ดีกุมุลลอฮ์ วะยุศลิหุบาละกุม" };
const AUDHU: Word = { ar: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", th: "อะอูซุบิลลาฮิมินัชชัยฏอนิรรอญีม" };

export const CARTOONS: Record<string, Cartoon> = {
  /*
    รู้จักเพื่อนใหม่ (9 พ.ย. 2026) — เจ้าของโปรเจกต์ขอเนื้อหาแนะนำครูนูรีและผองเพื่อน ใช้เสียงต่างกันได้
    มารยาทเมื่อเจอเพื่อนใหม่: ทักสลาม บอกชื่อ ถามชื่อเพื่อน ยิ้มให้กัน — วัย 3-6 ปี ไม่เล่าหะดีษ ไม่มีตัวบท
    เพื่อนพูดภาษาไทยล้วน (เสียงของเพื่อนยังไม่ได้ทดสอบการอ่านอาหรับ) ครูนูรีเป็นคนสอนสลามเหมือนบท salam
    ภาพฉาก = class.webp (ลานว่าง ไม่มีหุ่นชุดน้องหุ่นส้ม/เขียว จะได้ไม่ปนสองชุดตัวละคร) เพื่อนวางด้วยโค้ดจากภาพที่อนุมัติแล้ว
  */
  "meet-friends": {
    // ป้ายสลามขึ้นเฉพาะฉากที่ครูสอนสลาม (ไม่ใส่ word ระดับบท จะได้ไม่ขึ้นตอนเพื่อนแนะนำตัว)
    scenes: [
      {
        bg: CLASS,
        clip: "meet-hello",
        pose: "wave",
        cast: [{ id: "hadi", pose: "stand" }, { id: "sabir", pose: "stand" }, { id: "rassam", pose: "stand" }, { id: "qalam", pose: "stand" }, { id: "safi", pose: "stand" }],
        th: "วันนี้ครูนูรีพาเพื่อนหุ่นยนต์ห้าตัวมาให้รู้จัก เวลาเจอเพื่อนใหม่ เพื่อนๆ แนะนำตัวกันอย่างไร มาฟังกันนะ",
        en: "Today Teacher Nuri brings five robot friends for you to meet. How do they introduce themselves? Let's listen.",
        ms: 7000,
      },
      {
        bg: CLASS,
        clip: "meet-hadi",
        pose: "stand",
        speaker: "hadi",
        cast: [{ id: "hadi", pose: "action" }],
        th: "เราชื่อฮาดี เป็นนักสำรวจ ชอบส่องกล้องดูท้องฟ้าและภูเขาที่อัลลอฮ์ทรงสร้าง ยินดีที่ได้รู้จักนะ",
        en: "My name is Hadi, the explorer. I love looking at the sky and the mountains Allah created. Nice to meet you!",
        ms: 6500,
      },
      {
        bg: CLASS,
        clip: "meet-sabir",
        pose: "stand",
        speaker: "sabir",
        cast: [{ id: "sabir", pose: "action" }],
        th: "เราชื่อซาบิร เป็นนักสร้าง ชอบต่อบล็อกให้สูงๆ ถ้าล้มก็ค่อยๆ ต่อใหม่ ไม่ต้องรีบ",
        en: "My name is Sabir, the builder. I love stacking blocks up high. If they fall, I build again, slowly. No rush!",
        ms: 6000,
      },
      {
        bg: CLASS,
        clip: "meet-rassam",
        pose: "stand",
        speaker: "rassam",
        cast: [{ id: "rassam", pose: "action" }],
        th: "เราชื่อรอสซาม เป็นนักวาด ชอบระบายสีดอกไม้ ท้องฟ้า และสายรุ้ง",
        en: "My name is Rassam, the painter. I love colouring flowers, the sky and rainbows.",
        ms: 5000,
      },
      {
        bg: CLASS,
        clip: "meet-qalam",
        pose: "stand",
        speaker: "qalam",
        cast: [{ id: "qalam", pose: "action" }],
        th: "เราชื่อฟาฮีม เป็นนักอ่าน ชอบอ่านหนังสือ และหัดอ่านตัวอักษรอาหรับทุกวัน",
        en: "My name is Faheem, the reader. I love reading books, and I practise Arabic letters every day.",
        ms: 5500,
      },
      {
        bg: CLASS,
        clip: "meet-safi",
        pose: "stand",
        speaker: "safi",
        cast: [{ id: "safi", pose: "action" }],
        th: "เราชื่อซาฟี เป็นน้องเล็กสุดในแก๊ง กำลังหัดมารยาทอยู่เหมือนกัน มาเป็นเพื่อนกันนะ",
        en: "My name is Safi, the littlest in the gang. I'm learning good manners too. Let's be friends!",
        ms: 6000,
      },
      {
        bg: CLASS,
        clip: "meet-salam",
        pose: "point",
        th: "ทีนี้ถึงตาหนูแล้ว เจอเพื่อนใหม่ เราทักสลามก่อน พูดว่า อัสสะลามุอะลัยกุม",
        en: "Now it's your turn. When you meet a new friend, greet them first: Assalamu alaikum.",
        sayAlong: true,
        word: SALAM,
        ms: 6000,
      },
      {
        bg: CLASS,
        clip: "meet-name",
        pose: "point",
        cast: [{ id: "hadi", pose: "think" }, { id: "safi", pose: "think" }],
        th: "แล้วบอกชื่อของเรา ถ้าอยากรู้ชื่อเพื่อน ก็ถามดีๆ ว่า เธอชื่ออะไร",
        en: "Then tell them your name. If you want to know your friend's name, ask nicely: What's your name?",
        ms: 6000,
      },
      {
        bg: CLASS,
        clip: "meet-bye",
        pose: "wave",
        cast: [{ id: "hadi", pose: "cheer" }, { id: "sabir", pose: "cheer" }, { id: "rassam", pose: "cheer" }, { id: "qalam", pose: "cheer" }, { id: "safi", pose: "cheer" }],
        th: "เก่งมาก เจอเพื่อนใหม่ ทักสลาม บอกชื่อ แล้วยิ้มให้กันนะ",
        en: "Well done! Meet a new friend: say Salam, tell your name, and share a smile.",
        ms: 5000,
      },
    ],
  },

  // C-15: มารยาททั่วไป ไม่มีตัวบทหรือคำกล่าวอ้างทางศาสนา
  "say-sorry": {
    "scenes": [
      {
        "bg": "/moral/scenes/sorry-oops.webp",
        "clip": "c15-say-sorry-1",
        "pose": "wave",
        "th": "น้องหุ่นเขียวต่อบล็อกไว้ น้องหุ่นส้มเผลอชนล้มเลย",
        "en": "Little Green built a block tower. Little Orange accidentally knocked it over.",
        "ms": 7500
      },
      {
        "bg": "/moral/scenes/sorry-oops.webp",
        "clip": "c15-say-sorry-2",
        "pose": "point",
        "th": "น้องหุ่นส้มหยุดมอง ยังไม่รู้จะพูดอะไร",
        "en": "Little Orange stops and looks, unsure what to say.",
        "ms": 7500
      },
      {
        "bg": "/moral/scenes/sorry-oops.webp",
        "clip": "c15-say-sorry-3",
        "pose": "point",
        "th": "ครูชวนคิดนะ เราจะขอโทษ แล้วช่วยเพื่อนได้ไหม",
        "en": "Let’s think. Can we say sorry and help our friend?",
        "ms": 7500
      },
      {
        "bg": "/moral/scenes/sorry-help.webp",
        "clip": "c15-say-sorry-4",
        "pose": "point",
        "th": "น้องหุ่นส้มบอก ขอโทษนะ แล้วช่วยเพื่อนเก็บบล็อก",
        "en": "Little Orange says, “I’m sorry,” and helps pick up the blocks.",
        "ms": 7500
      },
      {
        "bg": "/moral/scenes/sorry-help.webp",
        "clip": "c15-say-sorry-5",
        "pose": "wave",
        "th": "ทำผิด ขอโทษ แล้วช่วยแก้ไขนะ",
        "en": "When you make a mistake, say sorry and help make it right.",
        "ms": 7500
      }
    ]
  },
  "help-friend": {
    "scenes": [
      {
        "bg": "/moral/scenes/help-dropped.webp",
        "clip": "c15-help-friend-1",
        "pose": "wave",
        "th": "ของเพื่อนหล่นจากกล่อง น้องหุ่นส้มเห็นพอดี",
        "en": "Things fall out of a friend’s box. Little Orange sees them.",
        "ms": 7500
      },
      {
        "bg": "/moral/scenes/help-dropped.webp",
        "clip": "c15-help-friend-2",
        "pose": "point",
        "th": "เพื่อนยกกล่องไม่ไหว น้องหุ่นส้มลังเลจะไปเล่น",
        "en": "The friend cannot lift the box. Little Orange wonders whether to go and play.",
        "ms": 7500
      },
      {
        "bg": "/moral/scenes/help-dropped.webp",
        "clip": "c15-help-friend-3",
        "pose": "point",
        "th": "ครูชวนคิดนะ ลองถามเพื่อนว่า ให้ช่วยไหม",
        "en": "Let’s think. Try asking your friend, “Would you like some help?”",
        "ms": 7500
      },
      {
        "bg": "/moral/scenes/help-together.webp",
        "clip": "c15-help-friend-4",
        "pose": "point",
        "th": "เพื่อนบอกให้ช่วยเก็บ เราเก็บของเบา ของหนักให้ผู้ใหญ่ช่วย",
        "en": "The friend asks for help picking things up. We pick up light things and ask an adult to help with heavy things.",
        "ms": 7500
      },
      {
        "bg": "/moral/scenes/help-together.webp",
        "clip": "c15-help-friend-5",
        "pose": "wave",
        "th": "เห็นเพื่อนลำบาก ถามก่อนช่วย ช่วยเท่าที่ไหวนะ",
        "en": "When a friend needs help, ask first and help with what you can manage.",
        "ms": 7500
      }
    ]
  },
  "keep-promise": {
    "scenes": [
      {
        "bg": "/moral/scenes/promise-meet.webp",
        "clip": "c15-keep-promise-1",
        "pose": "wave",
        "th": "น้องหุ่นส้มรับปากว่าจะมาเจอเพื่อนหลังเก็บของ และนำหนังสือที่ยืมมาคืน",
        "en": "Little Orange promised to meet a friend after tidying up and return a borrowed book.",
        "ms": 10000
      },
      {
        "bg": "/moral/scenes/promise-hesitate.webp",
        "clip": "c15-keep-promise-2",
        "pose": "point",
        "th": "ถึงเวลานัดแล้ว แต่น้องหุ่นส้มยังอยากเล่นต่อ หนังสือก็ยังไม่ได้คืน",
        "en": "It is time to meet, but Little Orange wants to keep playing. The book has not been returned yet.",
        "ms": 10000
      },
      {
        "bg": "/moral/scenes/promise-hesitate.webp",
        "clip": "c15-keep-promise-3",
        "pose": "point",
        "th": "ครูชวนคิดนะ เพื่อนกำลังรอสิ่งที่เรารับปากไว้ เราจะทำอย่างไรดี",
        "en": "Let’s think. Our friend is waiting for us to do what we promised. What could we do?",
        "ms": 10000
      },
      {
        "bg": "/moral/scenes/promise-meet.webp",
        "clip": "c15-keep-promise-4",
        "pose": "point",
        "th": "น้องหุ่นส้มเก็บของเล่น แล้วไปหาเพื่อนพร้อมหนังสือ คืนให้ตามที่บอกไว้",
        "en": "Little Orange puts the toys away, meets the friend, and returns the book as promised.",
        "ms": 10000
      },
      {
        "bg": "/moral/scenes/promise-meet.webp",
        "clip": "c15-keep-promise-5",
        "pose": "wave",
        "th": "รับปากแล้วทำตาม ถ้ารู้ว่าทำไม่ได้ รีบบอกเพื่อน และตกลงกันใหม่",
        "en": "Do what you promised. If you know you cannot, tell your friend promptly and agree on a new plan.",
        "ms": 10000
      }
    ]
  },
  "save-water-power": {
    "scenes": [
      {
        "bg": "/moral/scenes/save-running.webp",
        "clip": "c15-save-water-power-1",
        "pose": "wave",
        "th": "น้องหุ่นส้มใช้ก๊อกน้ำเสร็จแล้ว ห้องข้างๆ ก็เปิดไฟไว้ทั้งที่ไม่มีใครอยู่",
        "en": "Little Orange has finished using the tap. The light is also on in the empty room next door.",
        "ms": 10000
      },
      {
        "bg": "/moral/scenes/save-running.webp",
        "clip": "c15-save-water-power-2",
        "pose": "point",
        "th": "น้องหุ่นส้มกำลังจะไปเล่น แต่ลืมปิดก๊อก น้ำยังไหลอยู่เลย",
        "en": "Little Orange is about to go and play but has forgotten to turn off the tap. Water is still running.",
        "ms": 10000
      },
      {
        "bg": "/moral/scenes/save-running.webp",
        "clip": "c15-save-water-power-3",
        "pose": "point",
        "th": "ครูชวนคิดนะ เมื่อไม่ใช้แล้ว เราจะหยุดน้ำและไฟที่เปิดทิ้งไว้ได้อย่างไร",
        "en": "Let’s think. When we have finished, how can we stop leaving water running and lights on?",
        "ms": 10000
      },
      {
        "bg": "/moral/scenes/save-off.webp",
        "clip": "c15-save-water-power-4",
        "pose": "point",
        "th": "น้องหุ่นส้มปิดก๊อกจนสนิท เช็ดมือให้แห้ง แล้วปิดสวิตช์ไฟห้องที่ไม่มีใครใช้",
        "en": "Little Orange closes the tap, dries both hands, and switches off the light in the unused room.",
        "ms": 10000
      },
      {
        "bg": "/moral/scenes/save-off.webp",
        "clip": "c15-save-water-power-5",
        "pose": "wave",
        "th": "ใช้น้ำพอดี ใช้เสร็จปิดก๊อก ออกจากห้องที่ไม่มีคนใช้แล้วปิดไฟนะ",
        "en": "Use only the water you need and turn off the tap. Switch off the light when leaving an unused room.",
        "ms": 10000
      }
    ]
  },
  // C-3: มารยาททั่วไป ไม่มีตัวบทหรือคำกล่าวอ้างทางศาสนา
  "wait-turn": {
    scenes: [
      { bg: BG("wait-turn-eager"), clip: "wait-scene", pose: "wave", ms: 5500,
        th: "น้องหุ่นเขียวมาก่อน น้องหุ่นส้มอยากเล่นด้วย",
        en: "Little Green came first. Little Orange wants to play too." },
      { bg: BG("wait-turn-eager"), clip: "wait-eager", pose: "point", ms: 5500,
        th: "น้องหุ่นส้มอยากไปก่อน แต่เพื่อนยังรออยู่",
        en: "Little Orange wants to go first, but a friend is still waiting." },
      { bg: BG("wait-turn-eager"), clip: "wait-think", pose: "point", ms: 6000,
        th: "ครูชวนคิดนะ ใครมาก่อน เราต่อท้ายเพื่อนได้ไหม",
        en: "Let's think together. Who came first? Can we join behind our friend?" },
      { bg: BG("wait-turn-patient"), clip: "wait-do", pose: "point", ms: 6500,
        th: "น้องหุ่นส้มต่อท้ายแถว รอให้ถึงตา ไม่แซง ไม่ผลัก",
        en: "Little Orange joins the end of the line and waits. No cutting in or pushing." },
      { bg: BG("wait-turn-patient"), clip: "wait-remember", pose: "wave", ms: 5000,
        th: "ต่อท้ายแถว รอตาเรา ผลัดกันเล่นนะ",
        en: "Join the line, wait your turn, and take turns playing." },
    ],
  },
  "tidy-toys": {
    scenes: [
      { bg: BG("tidy-toys-left"), clip: "tidy-scene", pose: "wave", ms: 5500,
        th: "เล่นเสร็จแล้ว ของเล่นยังอยู่บนพื้นเลย",
        en: "Playtime is over. The toys are still on the floor." },
      { bg: BG("tidy-toys-left"), clip: "tidy-oops", pose: "point", ms: 5500,
        th: "น้องหุ่นส้มจะไปแล้ว อ๊ะ ยังไม่ได้เก็บของเล่น",
        en: "Little Orange is about to leave. Oops! The toys have not been put away." },
      { bg: BG("tidy-toys-left"), clip: "tidy-think", pose: "point", ms: 5500,
        th: "ครูชวนคิดนะ ของเล่นอยู่ตรงไหน ถึงจะไม่ขวางทาง",
        en: "Let's think. Where can the toys go so the path stays clear?" },
      { bg: BG("tidy-toys-box"), clip: "tidy-do", pose: "point", ms: 6000,
        th: "ช่วยกันเก็บทีละชิ้น ใส่กล่องของเล่น พื้นก็โล่งแล้ว",
        en: "They put the toys in the box, one by one. Now the floor is clear." },
      { bg: BG("tidy-toys-box"), clip: "tidy-remember", pose: "wave", ms: 5000,
        th: "เล่นแล้วเก็บ เข้าที่ทุกครั้งนะ",
        en: "After playing, put the toys away every time." },
    ],
  },
  "listen-friend": {
    scenes: [
      { bg: BG("listen-friend-interrupt"), clip: "listen-scene", pose: "wave", ms: 6500,
        th: "น้องหุ่นเขียวกำลังเล่าเรื่องสะพานที่ต่อจากบล็อก น้องหุ่นส้มก็มีเรื่องอยากเล่า",
        en: "Little Green is talking about a block bridge. Little Orange has something to share too." },
      { bg: BG("listen-friend-interrupt"), clip: "listen-oops", pose: "point", ms: 6500,
        th: "น้องหุ่นส้มตื่นเต้นจนเผลอพูดแทรก เพื่อนเลยยังเล่าไม่จบ",
        en: "Little Orange gets excited and interrupts. The friend has not finished yet." },
      { bg: BG("listen-friend-interrupt"), clip: "listen-think", pose: "point", ms: 7000,
        th: "ครูชวนคิดนะ ถ้าเราพูดพร้อมกัน จะฟังรู้เรื่องไหม ลองให้เพื่อนเล่าจบก่อนดีไหม",
        en: "Let's think. Can we follow the story if we speak at the same time? Shall we let our friend finish?" },
      { bg: BG("listen-friend-patient"), clip: "listen-do", pose: "point", ms: 7500,
        th: "น้องหุ่นส้มหยุดฟัง ให้เพื่อนเล่าจบ แล้วค่อยถามเรื่องสะพาน ตอนนี้ได้ฟังกันทั้งคู่",
        en: "Little Orange listens until the friend finishes, then asks about the bridge. Now both get a turn." },
      { bg: BG("listen-friend-patient"), clip: "listen-remember", pose: "wave", ms: 5500,
        th: "ฟังให้จบ แล้วค่อยพูด ถ้าไม่เข้าใจ ค่อยถามนะ",
        en: "Listen to the end, then speak. If something is unclear, ask a question." },
    ],
  },
  "shared-things": {
    scenes: [
      { bg: BG("shared-things-corner"), clip: "shared-scene", pose: "wave", ms: 6500,
        th: "วันนี้น้องหุ่นส้มกับเพื่อนอ่านหนังสือห้องสมุด หนังสือเล่มนี้มีคนอื่นใช้ด้วย",
        en: "Little Orange and a friend are reading library books. Other people use these books too." },
      { bg: BG("shared-things-corner"), clip: "shared-oops", pose: "point", ms: 6500,
        th: "น้องหุ่นส้มอยากจำหน้าที่อ่านไว้ จึงจับมุมกระดาษ แล้วลังเลว่าจะพับดีไหม",
        en: "Little Orange wants to remember the page, holds its corner, and wonders whether to fold it." },
      { bg: BG("shared-things-corner"), clip: "shared-think", pose: "point", ms: 7000,
        th: "ครูชวนคิดนะ เพื่อนคนถัดไปก็อยากอ่านหนังสือที่ไม่ยับ เราใช้อะไรคั่นหน้าแทนได้บ้าง",
        en: "Let's think. The next reader would like smooth pages too. What could we use to mark the page instead?" },
      { bg: BG("shared-things-bookmark"), clip: "shared-do", pose: "point", ms: 7500,
        th: "น้องหุ่นส้มใช้ที่คั่นหน้า ไม่พับกระดาษ อ่านเสร็จแล้วจะนำหนังสือไปวางที่จุดคืน",
        en: "Little Orange uses a bookmark without folding the paper. After reading, the book will go to the return point." },
      { bg: BG("shared-things-bookmark"), clip: "shared-remember", pose: "wave", ms: 6500,
        th: "ใช้เบามือ คืนให้ถูกที่ ของส่วนรวมก็พร้อมให้เพื่อนใช้ต่อ",
        en: "Handle shared things gently and return them to the right place, ready for the next person." },
    ],
  },
  // C-8: Claude ตรวจตัวบท 8 พ.ย. 2026 — บุคอรี 6324 https://shamela.ws/book/1681/9484
  "dua-sleep": {
    "wordPlacement": "above",
    "word": {
      "ar": "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      "th": "บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา"
    },
    "scenes": [
      {
        "bg": "/moral/scenes/bismillah-bed.webp",
        "clip": "dua-sleep-intro",
        "pose": "wave",
        "th": "ท่านนบี ﷺ เมื่อจะนอนกล่าวว่า…",
        "en": "When the Prophet ﷺ went to sleep, he said…",
        "word": null,
        "ms": 6000
      },
      {
        "bg": "/moral/scenes/bismillah-bed.webp",
        "clip": "dua-sleep-say-1",
        "pose": "point",
        "th": "พูดตามครูนะ บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา",
        "en": "Say this dua with me.",
        "word": {
          "ar": "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
          "th": "บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา"
        },
        "ms": 6000,
        "sayAlong": true,
        sayAlongMs: 12000
      },
      {
        "bg": "/moral/scenes/bismillah-bed.webp",
        "clip": "dua-sleep-meaning",
        "pose": "point",
        "th": "ด้วยพระนามของพระองค์ โอ้อัลลอฮ์ ข้าพเจ้าตายและข้าพเจ้ามีชีวิต",
        "en": "In Your name, O Allah, I die and I live.",
        "word": {
          "ar": "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
          "th": "บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา"
        },
        "ms": 7015
      },
      {
        "bg": "/moral/scenes/bismillah-bed.webp",
        "clip": "dua-sleep-explain",
        "pose": "point",
        "th": "การนอนเหมือนการตายชั่วคราว อัลลอฮ์ทรงให้เราตื่นขึ้นมาใหม่",
        "en": "Sleep is like a temporary death. Allah lets us wake up again.",
        "word": {
          "ar": "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
          "th": "บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา"
        },
        "ms": 6555
      },
      {
        "bg": "/moral/scenes/bismillah-bed.webp",
        "clip": "dua-sleep-again",
        "pose": "wave",
        "th": "ลองพูดตามครูอีกครั้งนะ บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา",
        "en": "Say this dua with me once more.",
        "word": {
          "ar": "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
          "th": "บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา"
        },
        "ms": 6210,
        "sayAlong": true,
        sayAlongMs: 12000
      }
    ]
  },

  // C-8: Claude ตรวจตัวบท 8 พ.ย. 2026 — บุคอรี 6324 https://shamela.ws/book/1681/9484 (หะดีษเดียวกับก่อนนอน)
  "dua-wake": {
    "wordPlacement": "above",
    "word": {
      "ar": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      "th": "อัลฮัมดุลิลลาฮิลละซี อะห์ยานา บะอ์ดะมา อะมาตะนา วะอิลัยฮินนุชูร"
    },
    "scenes": [
      {
        "bg": "/moral/scenes/dua-wake.webp",
        "clip": "dua-wake-intro",
        "pose": "wave",
        "th": "เมื่อตื่นนอนท่านนบี ﷺ กล่าวว่า…",
        "en": "When the Prophet ﷺ woke up, he said…",
        "word": null,
        "ms": 6000
      },
      {
        "bg": "/moral/scenes/dua-wake.webp",
        "clip": "dua-wake-say-1",
        "pose": "point",
        "th": "พูดตามครูนะ อัลฮัมดุลิลลาฮิลละซี อะห์ยานา บะอ์ดะมา อะมาตะนา วะอิลัยฮินนุชูร",
        "en": "Say this dua with me.",
        "word": {
          "ar": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
          "th": "อัลฮัมดุลิลลาฮิลละซี อะห์ยานา บะอ์ดะมา อะมาตะนา วะอิลัยฮินนุชูร"
        },
        "ms": 8625,
        "sayAlong": true,
        sayAlongMs: 12000
      },
      {
        "bg": "/moral/scenes/dua-wake.webp",
        "clip": "dua-wake-meaning",
        "pose": "point",
        "th": "การสรรเสริญเป็นของอัลลอฮ์ ผู้ทรงให้เรามีชีวิตหลังจากที่ทรงให้เราตาย และยังพระองค์คือการฟื้นคืนชีพ",
        "en": "Praise belongs to Allah, who gave us life after causing us to die, and to Him is the resurrection.",
        "word": {
          "ar": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
          "th": "อัลฮัมดุลิลลาฮิลละซี อะห์ยานา บะอ์ดะมา อะมาตะนา วะอิลัยฮินนุชูร"
        },
        "ms": 11155
      },
      {
        "bg": "/moral/scenes/dua-wake.webp",
        "clip": "dua-wake-explain",
        "pose": "point",
        "th": "การนอนเหมือนการตายชั่วคราว อัลลอฮ์ทรงให้เราตื่นขึ้นมาใหม่ เราจึงขอบคุณพระองค์",
        "en": "Sleep is like a temporary death. Allah lets us wake up again, so we thank Him.",
        "word": {
          "ar": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
          "th": "อัลฮัมดุลิลลาฮิลละซี อะห์ยานา บะอ์ดะมา อะมาตะนา วะอิลัยฮินนุชูร"
        },
        "ms": 8855
      },
      {
        "bg": "/moral/scenes/dua-wake.webp",
        "clip": "dua-wake-again",
        "pose": "wave",
        "th": "ลองพูดตามครูอีกครั้งนะ อัลฮัมดุลิลลาฮิลละซี อะห์ยานา บะอ์ดะมา อะมาตะนา วะอิลัยฮินนุชูร",
        "en": "Say this dua with me once more.",
        "word": {
          "ar": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
          "th": "อัลฮัมดุลิลลาฮิลละซี อะห์ยานา บะอ์ดะมา อะมาตะนา วะอิลัยฮินนุชูร"
        },
        "ms": 9890,
        "sayAlong": true,
        sayAlongMs: 12000
      }
    ]
  },

  // C-8: Claude ตรวจตัวบท 8 พ.ย. 2026 — อบูดาวูด 5095 (อัลบานีย์: เศาะฮีห์) https://shamela.ws/book/1726/6957 · ติรมิซีย์ 3426 https://shamela.ws/book/1435/5650
  "dua-leave-home": {
    "wordPlacement": "above",
    "word": {
      "ar": "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      "th": "บิสมิลลาฮ์ ตะวักกัลตุ อะลัลลอฮ์ ลาเหาละ วะลา กุววะตะ อิลลา บิลลาฮ์"
    },
    "scenes": [
      {
        "bg": "/moral/scenes/dua-leave-home.webp",
        "clip": "dua-leave-home-intro",
        "pose": "wave",
        "th": "ท่านนบี ﷺ สอนว่า เมื่อออกจากบ้านให้กล่าวว่า…",
        "en": "The Prophet ﷺ taught us to say this when leaving home…",
        "word": null,
        "ms": 6000
      },
      {
        "bg": "/moral/scenes/dua-leave-home.webp",
        "clip": "dua-leave-home-say-1",
        "pose": "point",
        "th": "พูดตามครูนะ บิสมิลลาฮ์",
        "en": "Say part 1 with me.",
        "word": {
          "ar": "بِسْمِ اللَّهِ،",
          "th": "บิสมิลลาฮ์"
        },
        "ms": 6000,
        "sayAlong": true,
        sayAlongMs: 12000
      },
      {
        "bg": "/moral/scenes/dua-leave-home.webp",
        "clip": "dua-leave-home-say-2",
        "pose": "point",
        "th": "พูดตามครูนะ ตะวักกัลตุ อะลัลลอฮ์",
        "en": "Say part 2 with me.",
        "word": {
          "ar": "تَوَكَّلْتُ عَلَى اللَّهِ،",
          "th": "ตะวักกัลตุ อะลัลลอฮ์"
        },
        "ms": 6000,
        "sayAlong": true,
        sayAlongMs: 12000
      },
      {
        "bg": "/moral/scenes/dua-leave-home.webp",
        "clip": "dua-leave-home-say-3",
        "pose": "point",
        "th": "พูดตามครูนะ ลาเหาละ วะลา กุววะตะ อิลลา บิลลาฮ์",
        "en": "Say part 3 with me.",
        "word": {
          "ar": "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
          "th": "ลาเหาละ วะลา กุววะตะ อิลลา บิลลาฮ์"
        },
        "ms": 6000,
        "sayAlong": true,
        sayAlongMs: 12000
      },
      {
        "bg": "/moral/scenes/dua-leave-home.webp",
        "clip": "dua-leave-home-meaning",
        "pose": "point",
        "th": "ด้วยพระนามของอัลลอฮ์ ข้าพเจ้ามอบหมายต่ออัลลอฮ์ ไม่มีพลังและไม่มีกำลังใดๆ นอกจากด้วยอัลลอฮ์",
        "en": "In the name of Allah. I put my trust in Allah. There is no power and no strength except through Allah.",
        "word": {
          "ar": "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
          "th": "บิสมิลลาฮ์ ตะวักกัลตุ อะลัลลอฮ์ ลาเหาละ วะลา กุววะตะ อิลลา บิลลาฮ์"
        },
        "ms": 10350
      },
      {
        "bg": "/moral/scenes/dua-leave-home.webp",
        "clip": "dua-leave-home-explain",
        "pose": "point",
        "th": "คนที่กล่าว จะมีเสียงบอกเขาว่า ท่านได้รับการชี้นำ ได้รับความพอเพียง และได้รับการคุ้มครองแล้ว",
        "en": "The person who says this will be told: You have been guided, given what you need, and protected.",
        "word": {
          "ar": "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
          "th": "บิสมิลลาฮ์ ตะวักกัลตุ อะลัลลอฮ์ ลาเหาละ วะลา กุววะตะ อิลลา บิลลาฮ์"
        },
        "ms": 10465
      }
    ]
  },

  // C-8: Claude ตรวจตัวบท 8 พ.ย. 2026 — อบูดาวูด 4023 (อัลบานีย์: หะซัน) https://shamela.ws/book/1726/5556
  "dua-after-eating": {
    "wordPlacement": "above",
    "word": {
      "ar": "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا الطَّعَامَ، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      "th": "อัลฮัมดุลิลลาฮิลละซี อัฏอะมะนี ฮาซัฏเฏาะอาม วะเราะซะเกาะนีฮิ มิน ฆ็อยริ เหาลิน มินนี วะลา กุววะฮ์"
    },
    "scenes": [
      {
        "bg": "/moral/scenes/dua-after-eating.webp",
        "clip": "dua-after-eating-intro",
        "pose": "wave",
        "th": "ท่านนบี ﷺ สอนว่า เมื่อกินอาหารเสร็จให้กล่าวว่า…",
        "en": "The Prophet ﷺ taught us to say this after finishing a meal…",
        "word": null,
        "ms": 6000
      },
      {
        "bg": "/moral/scenes/dua-after-eating.webp",
        "clip": "dua-after-eating-say-1",
        "pose": "point",
        "th": "พูดตามครูนะ อัลฮัมดุลิลลาฮิลละซี อัฏอะมะนี ฮาซัฏเฏาะอาม",
        "en": "Say part 1 with me.",
        "word": {
          "ar": "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا الطَّعَامَ،",
          "th": "อัลฮัมดุลิลลาฮิลละซี อัฏอะมะนี ฮาซัฏเฏาะอาม"
        },
        "ms": 6325,
        "sayAlong": true,
        sayAlongMs: 12000
      },
      {
        "bg": "/moral/scenes/dua-after-eating.webp",
        "clip": "dua-after-eating-say-2",
        "pose": "point",
        "th": "พูดตามครูนะ วะเราะซะเกาะนีฮิ มิน ฆ็อยริ เหาลิน มินนี วะลา กุววะฮ์",
        "en": "Say part 2 with me.",
        "word": {
          "ar": "وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
          "th": "วะเราะซะเกาะนีฮิ มิน ฆ็อยริ เหาลิน มินนี วะลา กุววะฮ์"
        },
        "ms": 7475,
        "sayAlong": true,
        sayAlongMs: 12000
      },
      {
        "bg": "/moral/scenes/dua-after-eating.webp",
        "clip": "dua-after-eating-meaning",
        "pose": "point",
        "th": "การสรรเสริญเป็นของอัลลอฮ์ ผู้ทรงให้อาหารนี้แก่ข้าพเจ้า และประทานมันแก่ข้าพเจ้า โดยไม่มีพลังและกำลังใดๆ จากตัวข้าพเจ้าเลย",
        "en": "Praise belongs to Allah, who fed me this food and provided it for me without any power or strength of my own.",
        "word": {
          "ar": "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا الطَّعَامَ، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
          "th": "อัลฮัมดุลิลลาฮิลละซี อัฏอะมะนี ฮาซัฏเฏาะอาม วะเราะซะเกาะนีฮิ มิน ฆ็อยริ เหาลิน มินนี วะลา กุววะฮ์"
        },
        "ms": 13800
      },
      {
        "bg": "/moral/scenes/dua-after-eating.webp",
        "clip": "dua-after-eating-explain",
        "pose": "point",
        "th": "อาหารมาจากอัลลอฮ์ เราไม่มีพลังหามาได้เองถ้าพระองค์ไม่ประทาน",
        "en": "Food comes from Allah. We have no power to obtain it ourselves unless He provides it.",
        "word": {
          "ar": "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا الطَّعَامَ، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
          "th": "อัลฮัมดุลิลลาฮิลละซี อัฏอะมะนี ฮาซัฏเฏาะอาม วะเราะซะเกาะนีฮิ มิน ฆ็อยริ เหาลิน มินนี วะลา กุววะฮ์"
        },
        "ms": 6785
      }
    ],
  },
  // ---------- วัย 3-6 ปี ----------
  bismillah: {
    word: { ar: "بِسْمِ اللَّهِ", th: "บิสมิลลาฮ์" },
    scenes: [
      {
        bg: CLASS,
        clip: "bis-hello",
        pose: "wave",
        th: "อัสสะลามุอะลัยกุม ครูชื่อ นูรี เป็นหุ่นยนต์ครูของเกาะมารยาท ยินดีที่ได้รู้จักนะ",
        en: "Assalamu alaikum! I'm Nuri, the robot teacher of Manners Island.",
        ms: 5500,
      },
      {
        bg: CLASS,
        clip: "bis-teach",
        pose: "stand",
        th: "วันนี้ครูจะสอนให้พูดว่า บิสมิลลาฮ์ แปลว่า ด้วยพระนามของอัลลอฮ์ พูดตามครูนะ บิสมิลลาฮ์",
        en: "Today we learn to say Bismillah — “in the name of Allah”. Say it with me!",
        sayAlong: true,
        ms: 6500,
      },
      {
        bg: BG("bismillah-eat"),
        clip: "bis-eat",
        pose: "point",
        th: "ก่อนกินข้าว เราพูดว่า บิสมิลลาฮ์ แล้วกินด้วยมือขวานะ",
        en: "Before eating, we say Bismillah and eat with our right hand.",
        sayAlong: true,
        ms: 5500,
      },
      {
        bg: BG("bismillah-door"),
        clip: "bis-door",
        pose: "point",
        th: "ตอนเข้าบ้าน เราพูดว่า บิสมิลลาฮ์",
        en: "When we come into the house, we say Bismillah.",
        sayAlong: true,
        ms: 4500,
      },
      {
        bg: BG("bismillah-car"),
        clip: "bis-car",
        pose: "point",
        th: "ตอนขึ้นรถ เราพูดว่า บิสมิลลาฮ์",
        en: "When we get into the car, we say Bismillah.",
        sayAlong: true,
        ms: 4500,
      },
      {
        bg: BG("bismillah-bed"),
        clip: "bis-bed",
        pose: "point",
        th: "ก่อนนอน เราพูดว่า บิสมิลลาฮ์",
        en: "Before we sleep, we say Bismillah.",
        sayAlong: true,
        ms: 4500,
      },
      {
        bg: CLASS,
        clip: "bis-bye",
        pose: "wave",
        th: "เก่งมากเลย จำไว้นะ ก่อนกิน ตอนเข้าบ้าน ตอนขึ้นรถ และก่อนนอน เราพูดว่า บิสมิลลาฮ์",
        en: "Well done! Before eating, coming home, getting in the car and sleeping — say Bismillah.",
        ms: 6500,
      },
    ],
  },

  salam: {
    word: SALAM,
    scenes: [
      {
        bg: CLASS,
        clip: "sal-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนกล่าวสลาม เวลาเจอกัน เราพูดว่า อัสสะลามุอะลัยกุม พูดตามครูนะ",
        en: "Today we learn to say Salam. When we meet, we say Assalamu alaikum. Say it with me!",
        sayAlong: true,
        word: SALAM,
        ms: 6000,
      },
      {
        bg: BG("salam-park"),
        clip: "sal-friend",
        pose: "point",
        th: "น้องหุ่นส้มเจอเพื่อน ก็พูดว่า อัสสะลามุอะลัยกุม",
        en: "Little Orange meets a friend and says Assalamu alaikum.",
        sayAlong: true,
        ms: 4500,
      },
      {
        bg: BG("salam-park"),
        clip: "sal-reply",
        pose: "point",
        th: "เพื่อนตอบว่า วะอะลัยกุมุสสะลาม เราตอบสลามให้กันนะ",
        en: "The friend answers: Wa alaikumus salam. We always answer the Salam.",
        word: { ar: "وَعَلَيْكُمُ السَّلَامُ", th: "วะอะลัยกุมุสสะลาม" },
        sayAlong: true,
        ms: 5000,
      },
      {
        bg: BG("salam-home"),
        clip: "sal-home",
        pose: "point",
        th: "กลับถึงบ้าน เจอพ่อแม่ ก็พูดว่า อัสสะลามุอะลัยกุม",
        en: "Back home, we greet our parents: Assalamu alaikum.",
        sayAlong: true,
        ms: 4500,
      },
      {
        bg: CLASS,
        clip: "sal-bye",
        pose: "wave",
        th: "เก่งมาก เจอเพื่อน เจอพ่อแม่ เราพูดว่า อัสสะลามุอะลัยกุม ด้วยเสียงใสๆ นะ",
        en: "Well done! Greet friends and parents with a bright Assalamu alaikum.",
        ms: 5500,
      },
    ],
  },

  smile: {
    scenes: [
      {
        bg: CLASS,
        clip: "smi-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนเรื่องยิ้มให้กัน การยิ้มให้กันเป็นความดีที่ทำได้ง่ายมากเลย",
        en: "Today's lesson: share a smile. Smiling is an easy good deed!",
        ms: 5000,
      },
      {
        bg: BG("smile-friends"),
        clip: "smi-friend",
        pose: "point",
        th: "เจอเพื่อน เรายิ้มให้เพื่อน เพื่อนก็ยิ้มตอบ ดีใจกันทั้งคู่",
        en: "We smile at our friend, and our friend smiles back. Both are happy.",
        ms: 4500,
      },
      {
        bg: BG("smile-home"),
        clip: "smi-home",
        pose: "point",
        th: "อยู่บ้าน เรายิ้มให้พ่อแม่ บ้านก็อบอุ่น",
        en: "At home we smile at our parents, and home feels warm.",
        ms: 4000,
      },
      {
        bg: CLASS,
        clip: "smi-bye",
        pose: "wave",
        th: "ลองยิ้มให้คนข้างๆ ตอนนี้เลย เก่งมาก ยิ้มให้กันทุกวันนะ",
        en: "Try smiling at someone next to you now. Well done — smile every day!",
        ms: 4500,
      },
    ],
  },

  clean: {
    scenes: [
      {
        bg: CLASS,
        clip: "cln-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนเรื่องรักความสะอาด อิสลามรักความสะอาดนะ",
        en: "Today's lesson: stay clean. Islam loves cleanliness.",
        ms: 4500,
      },
      {
        bg: BG("clean-meal"),
        clip: "cln-meal",
        pose: "point",
        th: "ก่อนกินข้าว ล้างมือให้สะอาด ถูสบู่ แล้วล้างน้ำ",
        en: "Before eating, wash your hands: soap, then rinse with water.",
        ms: 4500,
      },
      {
        bg: BG("clean-bathroom"),
        clip: "cln-toilet",
        pose: "point",
        th: "หลังเข้าห้องน้ำ ล้างมือทุกครั้ง",
        en: "After using the toilet, always wash your hands.",
        ms: 4000,
      },
      {
        bg: CLASS,
        clip: "cln-bye",
        pose: "wave",
        th: "เก่งมาก ก่อนกินและหลังเข้าห้องน้ำ ล้างมือทุกครั้งนะ",
        en: "Well done! Wash your hands before eating and after the toilet.",
        ms: 4500,
      },
    ],
  },

  thanks: {
    word: { ar: "جَزَاكَ اللَّهُ خَيْرًا", th: "ญะซากัลลอฮุค็อยร็อน" },
    scenes: [
      {
        bg: CLASS,
        clip: "thx-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนคำขอบคุณ เวลามีคนช่วยเรา เราพูดว่า ญะซากัลลอฮุค็อยร็อน แปลว่า ขออัลลอฮ์ตอบแทนความดีให้ พูดตามครูนะ",
        en: "Today we learn to say thank you: Jazakallahu khayran — “may Allah reward you with good”. Say it with me!",
        sayAlong: true,
        word: { ar: "جَزَاكَ اللَّهُ خَيْرًا", th: "ญะซากัลลอฮุค็อยร็อน" },
        ms: 8000,
      },
      {
        bg: BG("thanks-pencil"),
        clip: "thx-friend",
        pose: "point",
        th: "เพื่อนให้ยืมดินสอ เราพูดว่า ญะซากัลลอฮุค็อยร็อน",
        en: "A friend lends us a pencil. We say Jazakallahu khayran.",
        sayAlong: true,
        ms: 4500,
      },
      {
        bg: BG("thanks-meal"),
        clip: "thx-mom",
        pose: "point",
        th: "แม่ทำอาหารให้ เราพูดว่า ญะซากัลลอฮุค็อยร็อน",
        en: "Mum makes us food. We say Jazakallahu khayran.",
        sayAlong: true,
        ms: 4500,
      },
      {
        bg: CLASS,
        clip: "thx-bye",
        pose: "wave",
        th: "เก่งมาก ใครให้ของหรือช่วยเรา อย่าลืมพูดว่า ญะซากัลลอฮุค็อยร็อน นะ",
        en: "Well done! When someone gives or helps, say Jazakallahu khayran.",
        ms: 5000,
      },
    ],
  },

  share: {
    scenes: [
      {
        bg: CLASS,
        clip: "shr-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนเรื่องแบ่งปัน มาดูน้องหุ่นส้มกัน",
        en: "Today's lesson: sharing. Let's watch Little Orange.",
        ms: 4000,
      },
      {
        bg: BG("share-alone"),
        clip: "shr-want",
        pose: "point",
        th: "น้องหุ่นส้มมีของเล่นเยอะเลย เพื่อนก็อยากเล่นด้วย",
        en: "Little Orange has lots of toys. The friend wants to play too.",
        ms: 4500,
      },
      {
        bg: BG("share-give"),
        clip: "shr-give",
        pose: "point",
        th: "น้องหุ่นส้มแบ่งของเล่นให้เพื่อน ไม่แย่งกัน",
        en: "Little Orange shares a toy. No grabbing!",
        ms: 4000,
      },
      {
        bg: BG("share-together"),
        clip: "shr-play",
        pose: "point",
        th: "เล่นด้วยกัน สนุกกว่าเยอะเลย",
        en: "Playing together is much more fun.",
        ms: 3500,
      },
      {
        bg: CLASS,
        clip: "shr-bye",
        pose: "wave",
        th: "เก่งมาก แบ่งของเล่นให้เพื่อน เพื่อนก็มีความสุข เราก็มีความสุขนะ",
        en: "Well done! When we share, our friends are happy and so are we.",
        ms: 5000,
      },
    ],
  },

  // ---------- วัย 7 ปีขึ้นไป ----------
  parents: {
    scenes: [
      {
        bg: CLASS,
        clip: "par-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนเรื่องทำดีต่อพ่อแม่ อัลลอฮ์ทรงสั่งในอัลกุรอานให้เราทำดีต่อพ่อแม่",
        en: "Today's lesson: kindness to parents. Allah commands it in the Quran.",
        ms: 5500,
      },
      {
        bg: BG("parents-help"),
        clip: "par-help",
        pose: "point",
        th: "เราช่วยงานบ้านพ่อแม่ เช่น ช่วยถือของ ช่วยเก็บผ้า",
        en: "We help at home — carrying things, folding the laundry.",
        ms: 4500,
      },
      {
        bg: BG("parents-tidy"),
        clip: "par-uff",
        pose: "point",
        th: "เมื่อพ่อแม่ขอให้ทำอะไร แม้ไม่อยากทำ ก็ห้ามพูดว่า อุฟ หรือแสดงความรำคาญ ให้ตอบท่านด้วยคำพูดที่อ่อนโยน",
        en: "Even if we don't feel like it, we never say “uff” to them. We answer gently.",
        ms: 7000,
      },
      {
        bg: BG("parents-water"),
        clip: "par-water",
        pose: "point",
        th: "เวลาพ่อแม่เหนื่อย เรายกน้ำมาให้ และพูดกับท่านดีๆ",
        en: "When our parents are tired, we bring them water and speak kindly.",
        ms: 4500,
      },
      {
        bg: CLASS,
        clip: "par-bye",
        pose: "wave",
        th: "เก่งมาก ช่วยพ่อแม่ พูดกับท่านอ่อนโยน ทำทุกวันนะ",
        en: "Well done! Help your parents and speak gently to them every day.",
        ms: 4500,
      },
    ],
  },

  truth: {
    scenes: [
      {
        bg: CLASS,
        clip: "tru-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนเรื่องพูดความจริง ท่านนบี ﷺ สอนว่า ความสัตย์จริงนำไปสู่ความดี และความดีนำไปสู่สวรรค์",
        en: "Today's lesson: tell the truth. The Prophet ﷺ taught that truthfulness leads to goodness, and goodness leads to Paradise.",
        ms: 7000,
      },
      {
        bg: BG("truth-oops"),
        clip: "tru-oops",
        pose: "point",
        th: "น้องหุ่นส้มทำแจกันแตกโดยไม่ตั้งใจ ไม่มีใครเห็นเลย",
        en: "Little Orange broke a vase by accident. Nobody saw.",
        ms: 4500,
      },
      {
        bg: BG("truth-tell"),
        clip: "tru-tell",
        pose: "point",
        th: "แต่น้องหุ่นส้มเลือกพูดความจริง บอกแม่ว่า หนูทำแตกเอง ขอโทษนะ",
        en: "But Little Orange tells the truth: “I broke it. I'm sorry.”",
        ms: 5000,
      },
      {
        bg: BG("truth-cleanup"),
        clip: "tru-clean",
        pose: "point",
        th: "แม่ดีใจที่ลูกพูดความจริง แล้วช่วยกันเก็บกวาด",
        en: "Mum is glad to hear the truth, and they clean up together.",
        ms: 4500,
      },
      {
        bg: CLASS,
        clip: "tru-bye",
        pose: "wave",
        th: "จำไว้นะ แม้พูดความจริงแล้วจะโดนดุ ก็ยังดีกว่าโกหก",
        en: "Remember: even if the truth gets us scolded, it is better than lying.",
        ms: 5000,
      },
    ],
  },

  sneeze: {
    scenes: [
      {
        bg: CLASS,
        clip: "snz-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนว่าเมื่อจามต้องพูดอะไร ท่านนบี ﷺ สอนไว้สามประโยค มาดูกัน",
        en: "Today: what to say when we sneeze. The Prophet ﷺ taught us three sentences.",
        ms: 5000,
      },
      {
        bg: BG("sneeze-achoo"),
        clip: "snz-hamd",
        pose: "point",
        th: "เมื่อจาม คนที่จามพูดว่า อัลฮัมดุลิลลาฮ์",
        en: "The one who sneezes says: Alhamdulillah.",
        word: HAMD,
        sayAlong: true,
        ms: 4500,
      },
      {
        bg: BG("sneeze-reply"),
        clip: "snz-yarham",
        pose: "point",
        th: "เพื่อนที่ได้ยินตอบว่า ยัรฮะมุกัลลอฮ์ ขออัลลอฮ์ทรงเมตตาเธอ",
        en: "The friend who hears answers: Yarhamukallah — may Allah have mercy on you.",
        word: YARHAM,
        sayAlong: true,
        ms: 5500,
      },
      {
        bg: BG("sneeze-reply"),
        clip: "snz-yahdi",
        pose: "point",
        th: "แล้วคนที่จามตอบว่า ยะฮ์ดีกุมุลลอฮ์ วะยุศลิหุบาละกุม ขออัลลอฮ์ทรงชี้ทางและทำให้เรื่องของเธอดีขึ้น",
        en: "Then the one who sneezed says: Yahdikumullahu wa yuslihu balakum — may Allah guide you and set your affairs right.",
        word: YAHDI,
        sayAlong: true,
        ms: 7000,
      },
      {
        bg: CLASS,
        clip: "snz-bye",
        pose: "wave",
        th: "เก่งมาก จาม พูดอัลฮัมดุลิลลาฮ์ เพื่อนตอบยัรฮะมุกัลลอฮ์ แล้วเราตอบยะฮ์ดีกุมุลลอฮ์",
        en: "Well done! Alhamdulillah — Yarhamukallah — Yahdikumullah.",
        word: null,
        ms: 6000,
      },
    ],
  },

  animals: {
    scenes: [
      {
        bg: CLASS,
        clip: "ani-teach",
        pose: "wave",
        th: "วันนี้ครูจะเล่าเรื่องที่ท่านนบี ﷺ เล่าไว้ เรื่องเมตตาต่อสัตว์",
        en: "Today, a story the Prophet ﷺ told about mercy to animals.",
        ms: 4500,
      },
      {
        bg: BG("animals-well"),
        clip: "ani-thirst",
        pose: "point",
        th: "มีชายคนหนึ่งเดินทางแล้วกระหายน้ำ เขาลงไปดื่มน้ำในบ่อ ขึ้นมาก็เห็นสุนัขตัวหนึ่งหอบเพราะกระหายน้ำมาก",
        en: "A thirsty man drank from a well. Coming out, he saw a dog panting with thirst.",
        ms: 7000,
      },
      {
        bg: BG("animals-boot"),
        clip: "ani-boot",
        pose: "point",
        th: "เขาตักน้ำใส่รองเท้าหนังของเขา แล้วนำมาให้สุนัขดื่ม อัลลอฮ์ทรงรับความดีของเขา และทรงอภัยให้เขา",
        en: "He filled his leather sock with water and gave the dog a drink. Allah accepted his good deed and forgave him.",
        ms: 7000,
      },
      {
        bg: BG("animals-robot"),
        clip: "ani-us",
        pose: "point",
        th: "เราก็ทำได้ ให้น้ำและอาหารสัตว์ และไม่ทำร้ายพวกมัน",
        en: "We can do it too: give animals water and food, and never hurt them.",
        ms: 4500,
      },
      {
        bg: CLASS,
        clip: "ani-bye",
        pose: "wave",
        th: "ท่านนบี ﷺ บอกว่า ทำดีต่อสิ่งมีชีวิตทุกตัว ได้ผลบุญ เก่งมากนะ",
        en: "The Prophet ﷺ said there is reward in kindness to every living thing. Well done!",
        ms: 5000,
      },
    ],
  },

  permission: {
    word: SALAM,
    scenes: [
      {
        bg: CLASS,
        clip: "prm-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนเรื่องขออนุญาตก่อนเข้า อัลลอฮ์ทรงสอนในอัลกุรอานว่า อย่าเข้าบ้านคนอื่นจนกว่าจะขออนุญาตและกล่าวสลาม",
        en: "Today: ask before you enter. Allah teaches in the Quran not to enter others' homes until we ask and give Salam.",
        ms: 7500,
      },
      {
        bg: BG("permission-knock"),
        clip: "prm-knock",
        pose: "point",
        th: "ก่อนเข้าห้องพ่อแม่ เคาะประตูเบาๆ แล้วกล่าวสลาม",
        en: "Before entering our parents' room, knock gently and say Salam.",
        sayAlong: true,
        ms: 4500,
      },
      {
        bg: BG("permission-wait"),
        clip: "prm-wait",
        pose: "point",
        th: "รอให้ท่านอนุญาตก่อน แล้วค่อยเข้าไป",
        en: "Wait until they say yes, then go in.",
        ms: 4000,
      },
      {
        bg: BG("permission-back"),
        clip: "prm-back",
        pose: "point",
        th: "ท่านนบี ﷺ สอนว่า ถ้าขออนุญาตสามครั้งแล้วไม่ได้รับอนุญาต ก็กลับไปก่อน ไม่ต้องโกรธ",
        en: "The Prophet ﷺ taught: ask three times; if there's no permission, go back — without getting upset.",
        word: null,
        ms: 6000,
      },
      {
        bg: CLASS,
        clip: "prm-bye",
        pose: "wave",
        th: "เก่งมาก เคาะประตู กล่าวสลาม แล้วรอให้อนุญาตนะ",
        en: "Well done! Knock, say Salam, and wait for permission.",
        word: null,
        ms: 4500,
      },
    ],
  },

  calm: {
    word: AUDHU,
    scenes: [
      {
        bg: CLASS,
        clip: "calm-teach",
        pose: "wave",
        th: "วันนี้ครูจะสอนเรื่องไม่โกรธ มีชายคนหนึ่งขอคำสั่งเสียจากท่านนบี ﷺ ท่านตอบว่า อย่าโกรธ และพูดซ้ำหลายครั้ง",
        en: "Today: stay calm. A man asked the Prophet ﷺ for advice. He said, “Do not get angry,” again and again.",
        ms: 7000,
      },
      {
        bg: BG("calm-tower"),
        clip: "calm-upset",
        pose: "point",
        th: "เพื่อนชนตึกที่น้องหุ่นส้มต่อไว้พังหมดเลย น้องหุ่นส้มเริ่มโกรธ",
        en: "The friend knocked down Little Orange's tower. Little Orange starts to feel angry.",
        word: null,
        ms: 5000,
      },
      {
        bg: BG("calm-tower"),
        clip: "calm-say",
        pose: "point",
        th: "เมื่อโกรธ ให้พูดว่า อะอูซุบิลลาฮิมินัชชัยฏอนิรรอญีม",
        en: "When angry, say: A'udhu billahi minash shaytanir rajim.",
        sayAlong: true,
        ms: 5000,
      },
      {
        bg: BG("calm-sit"),
        clip: "calm-sit",
        pose: "point",
        th: "ถ้ายืนอยู่ ก็นั่งลง ใจจะเย็นลง",
        en: "If you are standing, sit down. Your heart calms down.",
        ms: 4000,
      },
      {
        bg: BG("calm-rebuild"),
        clip: "calm-friends",
        pose: "point",
        th: "แล้วช่วยกันต่อใหม่ เป็นเพื่อนกันเหมือนเดิม",
        en: "Then they build it again together, still good friends.",
        word: null,
        ms: 4000,
      },
      {
        bg: CLASS,
        clip: "calm-bye",
        pose: "wave",
        th: "เก่งมาก เมื่อโกรธ พูดอะอูซุบิลลาฮ์ แล้วนั่งลง ใจเย็นๆ นะ",
        en: "Well done! When angry, seek refuge in Allah and sit down. Stay calm.",
        word: null,
        ms: 5000,
      },
    ],
  },
};

/** จังหวะเงียบให้เด็กพูดตามหลังจบคลิป */
export const SAY_ALONG_MS = 2600;
