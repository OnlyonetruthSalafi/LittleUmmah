import type { GuidePose } from "./data";

/*
  การ์ตูนบทเรียนบนเกาะมารยาท — ครูหุ่นยนต์ "นูรี" (หุ่นยนต์ตัวหลักของเว็บ) พาไปดูเหตุการณ์ทีละฉาก

  ตัวละครในฉาก = หุ่นยนต์ทั้งหมด ไม่มีเด็กหรือคนเลย แม้หันหลัง (เจ้าของโปรเจกต์ตัดสิน 2 ต.ค. 2026)
  หุ่นยนต์ในฉากมาจากแผ่นตัวละครที่เจ้าของโปรเจกต์อนุมัติ (CODEX_MORAL_CAST_BRIEF.md):
  น้องหุ่นส้ม (ตัวเดินเรื่อง) น้องหุ่นเขียว (เพื่อน) พ่อหุ่น (น้ำเงิน) แม่หุ่น (ม่วง)
  ส่วนนูรีวางด้วยโค้ดทางขวาเสมอ ภาพฉาก (CODEX_MORAL_SCENES_BRIEF.md) เว้นพื้นด้านขวาไว้ให้ ไม่มีตัวหนังสือในภาพ
  สัตว์ในเรื่องเมตตาต่อสัตว์ใบหน้าว่างตามข้อ 1.1 (เจ้าของโปรเจกต์เลือก 2 ต.ค. 2026)

  วัย 3-6 ปี: สอนแค่สิ่งที่ต้องทำและคำที่ต้องพูด ไม่ให้หุ่นยนต์เล่าหะดีษ ไม่สอนดุอาอ์ยาว
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
  alt: string;
  /** ป้ายชื่อใต้ภาพ */
  label: { th: string; en: string };
  /** เครดิตสั้นใต้ภาพ เช่น "ภาพ: Drew Avery (CC BY 2.0)" */
  credit: string;
};

export type CartoonScene = {
  bg: string;
  photo?: ScenePhoto;
  clip: string;
  pose: GuidePose;
  th: string;
  en: string;
  sayAlong?: boolean;
  /** ป้ายคำเฉพาะฉากนี้ แทนป้ายของบท (null = ไม่แสดงป้ายในฉากนี้) */
  word?: Word | null;
  /** เวลาแสดงเมื่อไม่มีเสียง (ปิดเสียง หรือเล่นเสียงไม่ได้) */
  ms: number;
};

export type Cartoon = {
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
        th: "วันนี้ครูจะสอนเรื่องพูดความจริง ท่านนบีสอนว่า ความสัตย์จริงนำไปสู่ความดี และความดีนำไปสู่สวรรค์",
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
        th: "วันนี้ครูจะสอนว่าเมื่อจามต้องพูดอะไร ท่านนบีสอนไว้สามประโยค มาดูกัน",
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
        th: "วันนี้ครูจะเล่าเรื่องที่ท่านนบีเล่าไว้ เรื่องเมตตาต่อสัตว์",
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
        th: "ท่านนบีบอกว่า ทำดีต่อสิ่งมีชีวิตทุกตัว ได้ผลบุญ เก่งมากนะ",
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
        th: "ท่านนบีสอนว่า ถ้าขออนุญาตสามครั้งแล้วไม่ได้รับอนุญาต ก็กลับไปก่อน ไม่ต้องโกรธ",
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
        th: "วันนี้ครูจะสอนเรื่องไม่โกรธ มีชายคนหนึ่งขอคำสั่งเสียจากท่านนบี ท่านตอบว่า อย่าโกรธ และพูดซ้ำหลายครั้ง",
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

/** ข้อความชวนพูดตาม ตอนจังหวะ sayAlong */
export const sayPrompt = (word: Word) => `ตาหนูแล้ว! พูดว่า ${word.th}`;

/** จังหวะเงียบให้เด็กพูดตามหลังจบคลิป */
export const SAY_ALONG_MS = 2600;
