import type { Cartoon, ScenePhoto, Word } from "@/features/moral/cartoon";
import type { AgeId, AgeSection, GuideStep } from "@/features/moral/data";
import type { Lesson } from "@/lib/lessons";

/*
  ข้อมูลเฉพาะหน้าเกาะสำรวจโลก (/learn/explore) — หน้าตาและส่วนประกอบเดียวกับเกาะมารยาท (features/moral)

  สองหมวดต่อช่วงวัย
  - "สัตว์และบ้านของมัน" (ใหม่ 2 ต.ค. 2026): การ์ตูนครูนูรีพาไปดูถิ่นที่อยู่ของสัตว์ แล้วให้ดูภาพถ่ายสัตว์จริง
    รอบแรกมีทะเลทราย ถิ่นอื่น (ป่า ทะเล ขั้วโลก) ตามมาหลังเจ้าของโปรเจกต์ตรวจรอบนี้
  - "สิ่งรอบตัว": บทเดิมจาก lib/lessons.ts (ดวงอาทิตย์ ดวงจันทร์ ฯลฯ) เปิดเป็นหน้าต่างข้อความ

  ภาพการ์ตูนจาก Codex (CODEX_EXPLORE_BRIEF.md) สัตว์ใบหน้าว่างตาม AGENTS.md ข้อ 1.1 ไม่มีตัวหนังสือในภาพ
  ภาพถ่ายใช้ตามข้อ "ภาพถ่ายสัตว์เพื่อการสอน" ในข้อ 1.1 — เฉพาะฉากสอน ไม่ใช้บนการ์ด เครดิตอยู่ใน PHOTO_CREDITS
  ข้อความไทยของทุกฉากต้องตรงกับบทใน scripts/make-explore-voice.mjs (เสียงพูดอาจมี "พูดตามครู" ต่อท้าย)
*/

export const AGE_SECTIONS: Record<AgeId, AgeSection> = {
  kids: {
    labelTh: "วัย 3-6 ปี",
    labelEn: "Ages 3-6",
    descTh: "รู้จักสัตว์และสิ่งรอบตัวที่อัลลอฮ์ทรงสร้าง",
    descEn: "Animals and the world Allah created",
    badge: "/moral/age-kids.webp",
  },
  juniors: {
    labelTh: "วัย 7 ปีขึ้นไป",
    labelEn: "Ages 7+",
    descTh: "สำรวจว่าสัตว์อยู่ในบ้านของมันได้อย่างไร",
    descEn: "How animals live in their homes",
    badge: "/moral/age-juniors.webp",
  },
};

/* บทของหุ่นยนต์นำทาง — ข้อความไทยตรงกับ scripts/make-explore-voice.mjs */
export const GUIDE_STEPS: GuideStep[] = [
  {
    clip: "explore-intro",
    pose: "wave",
    th: "อัสสะลามุอะลัยกุม ยินดีต้อนรับสู่เกาะสำรวจโลก มาดูสิ่งที่อัลลอฮ์ทรงสร้างไปด้วยกันนะ",
    en: "Assalamu alaikum! Welcome to Explore Island.",
    ms: 5500,
  },
  {
    clip: "explore-kids",
    pose: "point",
    focus: "kids",
    th: "น้องวัย 3-6 ขวบ กดปุ่มสีเหลือง ไปเที่ยวทะเลทรายกับครู แล้วดูอูฐตัวจริงกัน",
    en: "Ages 3-6: tap the yellow button to visit the desert with me.",
    ms: 6000,
  },
  {
    clip: "explore-juniors",
    pose: "point",
    focus: "juniors",
    th: "พี่ๆ 7 ขวบขึ้นไป กดปุ่มสีเขียว ไปสำรวจว่าสัตว์อยู่ในทะเลทรายได้อย่างไร",
    en: "Ages 7+: tap the green button to find out how animals live in the desert.",
    ms: 6000,
  },
  {
    clip: "explore-howto",
    pose: "stand",
    th: "แตะการ์ดแล้วดูการ์ตูนไปด้วยกัน มีภาพสัตว์ตัวจริงให้ดูด้วยนะ ถ้าอยากฟังอีก แตะที่ตัวหุ่นยนต์ได้เลย",
    en: "Tap a card to watch. You will see real animal photos too. Tap me to hear this again.",
    ms: 6500,
  },
];

/* ---------- หมวด "สัตว์และบ้านของมัน" ---------- */

export const HABITAT_GROUP = { titleTh: "สัตว์และบ้านของมัน", titleEn: "Animals and their homes" };
export const WORLD_GROUP = { titleTh: "สิ่งรอบตัว", titleEn: "The world around us" };

/* id ไม่ซ้ำกับบทของเกาะอื่น (ดาวเก็บแยกเกาะอยู่แล้ว แต่กันสับสน) */
export const HABITAT_LESSONS: Record<AgeId, Lesson[]> = {
  kids: [
    {
      id: "desert-home",
      icon: "sun",
      titleTh: "ทะเลทราย",
      titleEn: "The desert",
      body: "ทะเลทรายร้อนและมีทรายเต็มไปหมด อูฐและจิ้งจอกเฟนเนคอยู่ที่นี่ได้ เพราะอัลลอฮ์ทรงสร้างให้มันเหมาะกับบ้านของมัน",
    },
  ],
  juniors: [
    {
      id: "desert-life",
      icon: "sun",
      titleTh: "ชีวิตในทะเลทราย",
      titleEn: "Life in the desert",
      body: "อูฐมีเท้ากว้างไม่จมทราย และเก็บไขมันไว้ในโหนก จิ้งจอกเฟนเนคมีหูใหญ่ช่วยระบายความร้อน กลางวันหลบในโพรง กลางคืนออกหาอาหาร",
    },
  ],
};

const BG = (name: string) => `/explore/scenes/${name}.webp`;

/* ภาพถ่ายสัตว์จริง — ตรวจสัญญาอนุญาตจาก metadata ของ Wikimedia Commons แล้ว (2 ต.ค. 2026) */
const PHOTO_CAMEL: ScenePhoto = {
  src: "/explore/photos/camel.webp",
  width: 1600,
  height: 1067,
  alt: "ภาพถ่ายอูฐหนอกเดียวตัวจริง ยืนอยู่บนพื้นทรายในทะเลทราย",
  label: { th: "อูฐตัวจริง", en: "A real camel" },
  credit: "ภาพ: Tamar Assaf — สาธารณสมบัติ (Wikimedia Commons)",
};
const PHOTO_FENNEC: ScenePhoto = {
  src: "/explore/photos/fennec.webp",
  width: 1600,
  height: 1240,
  alt: "ภาพถ่ายจิ้งจอกเฟนเนคตัวจริง ขนสีทราย หูใหญ่มาก หางเป็นพวง",
  label: { th: "จิ้งจอกเฟนเนคตัวจริง", en: "A real fennec fox" },
  credit: "ภาพ: Drew Avery — CC BY 2.0 (Wikimedia Commons)",
};
const PHOTO_FENNEC_BURROW: ScenePhoto = {
  src: "/explore/photos/fennec-burrow.webp",
  width: 1024,
  height: 683,
  alt: "ภาพถ่ายจิ้งจอกเฟนเนคตัวจริง นอนพักบนพื้นทรายข้างโพรง",
  label: { th: "จิ้งจอกเฟนเนคตัวจริง", en: "A real fennec fox" },
  credit: "ภาพ: Derek Keats — CC BY 2.0 (Wikimedia Commons)",
};

/** เครดิตเต็มพร้อมลิงก์ต้นฉบับและสัญญาอนุญาต — แสดงท้ายหน้าสำหรับผู้ใหญ่ */
export const PHOTO_CREDITS: { title: string; author: string; license: string; licenseUrl?: string; page: string }[] = [
  {
    title: "Dromedary in Israel",
    author: "Tamar Assaf",
    license: "สาธารณสมบัติ (Public domain)",
    page: "https://commons.wikimedia.org/wiki/File:Dromedary_in_Israel.jpg",
  },
  {
    title: "Fennec Fox {Vulpes zerda}",
    author: "Drew Avery",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    page: "https://commons.wikimedia.org/wiki/File:Fennec_Fox_Vulpes_zerda.jpg",
  },
  {
    title: "Fennec (Vulpes zerda)",
    author: "Derek Keats",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    page: "https://commons.wikimedia.org/wiki/File:Fennec_(Vulpes_zerda)_(5258821282).jpg",
  },
];

const SUBHANALLAH: Word = { ar: "سُبْحَانَ اللَّهِ", th: "ซุบฮานัลลอฮ์" };

export const CARTOONS: Record<string, Cartoon> = {
  // ---------- วัย 3-6 ปี: ทะเลทราย ----------
  "desert-home": {
    scenes: [
      {
        bg: BG("desert-arrive"),
        clip: "dsk-hello",
        pose: "wave",
        th: "อัสสะลามุอะลัยกุม วันนี้ครูนูรีพามาเที่ยวทะเลทราย ทะเลทรายมีทรายเต็มไปหมด แดดร้อนมาก และฝนตกน้อยมาก",
        en: "Assalamu alaikum! Today Nuri takes you to the desert. Lots of sand, hot sun, very little rain.",
        ms: 7000,
      },
      {
        bg: BG("desert-camel"),
        clip: "dsk-camel",
        pose: "point",
        th: "นี่คืออูฐ อูฐมีโหนกบนหลัง ขายาว และเท้ากว้าง เดินบนทรายร้อนได้สบาย",
        en: "This is a camel. It has a hump, long legs and wide feet for walking on hot sand.",
        ms: 6000,
      },
      {
        bg: BG("desert-camel"),
        photo: PHOTO_CAMEL,
        clip: "dsk-camel-real",
        pose: "point",
        th: "ดูสิ นี่คืออูฐตัวจริง ที่อัลลอฮ์ทรงสร้าง",
        en: "Look! This is a real camel that Allah created.",
        ms: 5000,
      },
      {
        bg: BG("desert-oasis"),
        clip: "dsk-drink",
        pose: "point",
        th: "อูฐดื่มน้ำทีละมากๆ แล้วเดินต่อได้อีกหลายวัน",
        en: "A camel drinks a lot of water at once, then can walk for many days.",
        ms: 5000,
      },
      {
        bg: BG("desert-fox"),
        clip: "dsk-fox",
        pose: "point",
        th: "นี่คือจิ้งจอกเฟนเนค หูของมันใหญ่มาก กลางวันมันหลบแดดอยู่ในโพรงใต้ทราย",
        en: "This is a fennec fox. Its ears are very big. In the day it hides from the sun in a hole under the sand.",
        ms: 6500,
      },
      {
        bg: BG("desert-fox"),
        photo: PHOTO_FENNEC,
        clip: "dsk-fox-real",
        pose: "point",
        th: "ดูสิ นี่คือจิ้งจอกเฟนเนคตัวจริง หูใหญ่จริงๆ เลย",
        en: "Look! This is a real fennec fox. Its ears really are big!",
        ms: 5000,
      },
      {
        bg: BG("desert-arrive"),
        clip: "dsk-bye",
        pose: "wave",
        th: "ทะเลทรายคือบ้านของอูฐและจิ้งจอกเฟนเนค อัลลอฮ์ทรงสร้างพวกมันเก่งมาก เราพูดว่า ซุบฮานัลลอฮ์",
        en: "The desert is home to camels and fennec foxes. Allah made them so well. We say SubhanAllah!",
        word: SUBHANALLAH,
        sayAlong: true,
        ms: 7000,
      },
    ],
  },

  // ---------- วัย 7 ปีขึ้นไป: ชีวิตในทะเลทราย ----------
  "desert-life": {
    scenes: [
      {
        bg: BG("desert-arrive"),
        clip: "dsj-hello",
        pose: "wave",
        th: "อัสสะลามุอะลัยกุม วันนี้เราไปสำรวจทะเลทรายกัน กลางวันร้อนจัด กลางคืนหนาวเย็น และฝนตกน้อยมากทั้งปี",
        en: "Assalamu alaikum! Let's explore the desert: very hot days, cold nights and little rain all year.",
        ms: 7500,
      },
      {
        bg: BG("desert-camel"),
        clip: "dsj-camel",
        pose: "point",
        th: "อูฐมีเท้ากว้างและนุ่ม จึงไม่จมลงไปในทราย โหนกบนหลังเก็บไขมันไว้เป็นพลังงานยามขาดอาหาร",
        en: "Camels have wide, soft feet that don't sink in sand. The hump stores fat for energy when food is scarce.",
        ms: 8000,
      },
      {
        bg: BG("desert-camel"),
        photo: PHOTO_CAMEL,
        clip: "dsj-camel-real",
        pose: "point",
        th: "นี่คืออูฐตัวจริง อูฐโหนกเดียวพบมากในคาบสมุทรอาหรับและแอฟริกาเหนือ",
        en: "This is a real one-humped camel. They live in Arabia and North Africa.",
        ms: 6500,
      },
      {
        // อัลฆอชิยะฮ์ 88:17 — ตัวบทตรวจกับตัฟซีรอิบนุ กะษีร ใน Shamela (https://shamela.ws/book/8473/4432)
        bg: BG("desert-oasis"),
        clip: "dsj-ayah",
        pose: "point",
        th: "อัลลอฮ์ตรัสในอัลกุรอานว่า พวกเขาไม่มองดูอูฐหรือว่า มันถูกสร้างขึ้นมาอย่างไร",
        en: "Allah says in the Quran: Do they not look at the camels, how they are created?",
        // บรรทัดไทยบนป้ายเป็นชื่อซูเราะฮ์ ความหมายอยู่ในข้อความใต้ภาพแล้ว (ป้ายยาวจะบังฉากบนมือถือ)
        word: { ar: "أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ", th: "ซูเราะฮ์อัลฆอชิยะฮ์", compact: true },
        ms: 7000,
      },
      {
        bg: BG("desert-fox"),
        clip: "dsj-fox",
        pose: "point",
        th: "จิ้งจอกเฟนเนคเป็นจิ้งจอกที่ตัวเล็กที่สุดในโลก หูที่ใหญ่ช่วยระบายความร้อนออกจากตัว และได้ยินเสียงแมลงที่ซ่อนอยู่ใต้ทราย",
        en: "The fennec is the smallest fox in the world. Its big ears let out heat and hear insects hiding under the sand.",
        ms: 8500,
      },
      {
        bg: BG("desert-fox"),
        photo: PHOTO_FENNEC_BURROW,
        clip: "dsj-fox-real",
        pose: "point",
        th: "นี่คือจิ้งจอกเฟนเนคตัวจริง กลางวันมันพักอยู่ในโพรงหรือข้างโพรง เพราะใต้ทรายเย็นกว่าข้างบน",
        en: "This is a real fennec fox. By day it rests in or by its burrow — under the sand is cooler.",
        ms: 7000,
      },
      {
        bg: BG("desert-night"),
        clip: "dsj-night",
        pose: "point",
        th: "พอกลางคืนอากาศเย็นลง มันจึงออกมาหาอาหาร",
        en: "When the night cools down, it comes out to find food.",
        ms: 4500,
      },
      {
        bg: BG("desert-arrive"),
        clip: "dsj-bye",
        pose: "wave",
        th: "อัลลอฮ์ทรงสร้างสัตว์ทุกชนิดให้เหมาะกับบ้านของมัน เมื่อเห็นความเก่งนี้ เราพูดว่า ซุบฮานัลลอฮ์",
        en: "Allah made every animal fit its home. When we see this, we say SubhanAllah!",
        word: SUBHANALLAH,
        sayAlong: true,
        ms: 7000,
      },
    ],
  },
};

/* ---------- ภาพการ์ด (ไม่มีภาพถ่ายบนการ์ด — ข้อ 1.1) ---------- */
export const CARD_ART: Record<string, string> = {
  "desert-home": "/explore/card-desert.webp",
  "desert-life": "/explore/card-desert.webp",
  sun: "/explore/card-sun.webp",
  moon: "/explore/card-moon.webp",
  water: "/explore/card-water.webp",
  tree: "/explore/card-tree.webp",
  honey: "/explore/card-honey.webp",
  rain: "/explore/card-rain.webp",
  mountain: "/explore/card-mountain.webp",
  "day-night": "/explore/card-daynight.webp",
};
