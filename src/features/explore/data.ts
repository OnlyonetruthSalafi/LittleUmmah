import type { Cartoon, CartoonScene, ScenePhoto, Word } from "@/features/moral/cartoon";
import type { AgeId, AgeSection, GuidePose, GuideStep } from "@/features/moral/data";
import type { Lesson } from "@/lib/lessons";

/*
  ข้อมูลเฉพาะหน้าเกาะสำรวจโลก (/learn/explore) — หน้าตาและส่วนประกอบเดียวกับเกาะมารยาท (features/moral)

  สองหมวดต่อช่วงวัย
  - "สัตว์และบ้านของมัน" (2 ต.ค. 2026): การ์ตูนครูนูรีพาไปดูถิ่นที่อยู่ของสัตว์ แล้วให้ดูภาพถ่ายสัตว์จริง
    สี่ถิ่น: ทะเลทราย ป่า ทะเล ขั้วโลก
  - "สิ่งรอบตัว": บทเดิมจาก lib/lessons.ts (ดวงอาทิตย์ ดวงจันทร์ ฯลฯ) เปิดเป็นหน้าต่างข้อความ

  ภาพการ์ตูนจาก Codex (CODEX_EXPLORE_BRIEF.md, CODEX_EXPLORE_BRIEF_2.md) สัตว์ใบหน้าว่างตาม AGENTS.md ข้อ 1.1
  ภาพถ่ายใช้ตามข้อ "ภาพถ่ายสัตว์เพื่อการสอน" ในข้อ 1.1 — เฉพาะฉากสอน ไม่ใช้บนการ์ด เฉพาะสาธารณสมบัติ/CC0

  เสียงพากย์สร้างจากข้อความไทยในไฟล์นี้โดยตรง (scripts/make-explore-voice.mjs import ไฟล์นี้)
  ไฟล์นี้จึง import ได้แค่ type เท่านั้น — Node อ่านไฟล์ .ts ได้เมื่อไม่มี import ที่ต้องรันจริง
  ฉาก sayAlong เสียงต่อท้ายว่า "พูดตามครู ..." และฉากที่มี voice ใช้ข้อความนั้นแทน th
  คำทับศัพท์ที่เสียงอ่านเพี้ยน (การ์ด, เฟนเนค) แปลงเป็นอังกฤษใน scripts/lib/robot-voice.mjs ไม่ต้องแก้ที่นี่
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

/* บทของหุ่นยนต์นำทางหน้า */
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
    th: "น้องวัย 3-6 ขวบ กดปุ่มสีเหลือง ไปเที่ยวทะเลทราย ป่า ทะเล และขั้วโลกกับครู แล้วดูสัตว์ตัวจริงกัน",
    en: "Ages 3-6: tap the yellow button to visit the desert, forest, sea and polar lands with me.",
    ms: 7000,
  },
  {
    clip: "explore-juniors",
    pose: "point",
    focus: "juniors",
    th: "พี่ๆ 7 ขวบขึ้นไป กดปุ่มสีเขียว ไปสำรวจว่าสัตว์อยู่ในบ้านของมันได้อย่างไร",
    en: "Ages 7+: tap the green button to find out how animals live in their homes.",
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

/* ---------- ภาพถ่ายสัตว์จริง ----------
  AGENTS.md ข้อ 1.1: เฉพาะสาธารณสมบัติหรือ CC0 (เว็บอาจหารายได้ในอนาคต)
  สัญญาอนุญาตตรวจจาก metadata ของ Wikimedia Commons ทีละภาพ (2 ต.ค. 2026) ไม่มีคน ลายน้ำ หรือตัวหนังสือในภาพ
  ไฟล์ย่อเป็น WebP กว้าง 1200px (แสดงในกรอบกว้างสุดราว 540px)
  เครดิตใต้ภาพและรายการท้ายหน้าสร้างจากข้อมูลชุดนี้ จึงตรงกันเสมอ */
type PhotoSource = {
  file: string;
  width: number;
  height: number;
  alt: string;
  label: { th: string; en: string };
  author: string;
  license: "สาธารณสมบัติ" | "CC0";
  /** ชื่อไฟล์ต้นฉบับบน Wikimedia Commons */
  title: string;
  page: string;
};

const PHOTOS = {
  camel: {
    file: "camel",
    width: 1200,
    height: 800,
    alt: "ภาพถ่ายอูฐโหนกเดียวตัวจริง ยืนอยู่บนพื้นทรายในทะเลทราย",
    label: { th: "อูฐตัวจริง", en: "A real camel" },
    author: "Tamar Assaf",
    license: "สาธารณสมบัติ",
    title: "Dromedary in Israel",
    page: "https://commons.wikimedia.org/wiki/File:Dromedary_in_Israel.jpg",
  },
  fennec: {
    file: "fennec",
    width: 1200,
    height: 800,
    alt: "ภาพถ่ายจิ้งจอกเฟนเนคตัวจริง ขนสีทราย นอนขดตัว หูใหญ่มาก",
    label: { th: "จิ้งจอกเฟนเนคตัวจริง", en: "A real fennec fox" },
    author: "Marco Almbauer",
    license: "สาธารณสมบัติ",
    title: "Wüstenfuchs (Vulpes zerda)",
    page: "https://commons.wikimedia.org/wiki/File:W%C3%BCstenfuchs_(Vulpes_zerda).jpg",
  },
  fennecRest: {
    file: "fennec-burrow",
    width: 1200,
    height: 596,
    alt: "ภาพถ่ายจิ้งจอกเฟนเนคตัวจริง นอนหลับพักตอนกลางวัน หูใหญ่ตั้งขึ้น",
    label: { th: "จิ้งจอกเฟนเนคตัวจริง", en: "A real fennec fox" },
    author: "LadyofHats",
    license: "สาธารณสมบัติ",
    title: "Vulpes zerda sleeping",
    page: "https://commons.wikimedia.org/wiki/File:Vulpes_zerda_sleeping.jpg",
  },
  elephant: {
    file: "elephant-khaoyai",
    width: 1200,
    height: 921,
    alt: "ภาพถ่ายช้างเอเชียตัวจริงสองตัว ในป่าอุทยานแห่งชาติเขาใหญ่",
    label: { th: "ช้างตัวจริง", en: "Real elephants" },
    author: "Mammalwatcher",
    license: "CC0",
    title: "Wild Asian elephants at Khao Yai NP",
    page: "https://commons.wikimedia.org/wiki/File:Wild_Asian_elephants_at_Khao_Yai_NP.JPG",
  },
  squirrel: {
    file: "squirrel",
    width: 1200,
    height: 800,
    alt: "ภาพถ่ายกระรอกตัวจริง ห้อยตัวอยู่บนกิ่งไม้ หางเป็นพวง",
    label: { th: "กระรอกตัวจริง", en: "A real squirrel" },
    author: "Andrew Holle",
    license: "CC0",
    title: "Callosciurus notatus 451486986",
    page: "https://commons.wikimedia.org/wiki/File:Callosciurus_notatus_451486986.jpg",
  },
  turtle: {
    file: "turtle",
    width: 1200,
    height: 900,
    alt: "ภาพถ่ายเต่าตนุตัวจริง ว่ายน้ำอยู่เหนือแนวปะการัง",
    label: { th: "เต่าทะเลตัวจริง", en: "A real sea turtle" },
    author: "kfa",
    license: "CC0",
    title: "Chelonia mydas near Naha in Japan",
    page: "https://commons.wikimedia.org/wiki/File:Chelonia_mydas_near_Naha_in_Japan.jpg",
  },
  turtleReef: {
    file: "turtle-reef",
    width: 1200,
    height: 900,
    alt: "ภาพถ่ายเต่าตนุตัวจริง พักอยู่บนแนวปะการัง",
    label: { th: "เต่าทะเลตัวจริง", en: "A real sea turtle" },
    author: "Anne Laudisoit",
    license: "CC0",
    title: "Chelonia mydas 175714490",
    page: "https://commons.wikimedia.org/wiki/File:Chelonia_mydas_175714490.jpg",
  },
  dolphin: {
    file: "dolphin",
    width: 1200,
    height: 776,
    alt: "ภาพถ่ายโลมาตัวจริง กระโดดขึ้นเหนือผิวน้ำทะเล",
    label: { th: "โลมาตัวจริง", en: "A real dolphin" },
    author: "Kiloueka",
    license: "CC0",
    title: "Common Bottlenose Dolphin (Tursiops truncatus) Catalina jumping",
    page: "https://commons.wikimedia.org/wiki/File:Common_Bottlenose_Dolphin_(Tursiops_truncatus)_Catalina_jumping.jpg",
  },
  polarBear: {
    file: "polar-bear",
    width: 1200,
    height: 805,
    alt: "ภาพถ่ายแม่หมีขั้วโลกกับลูกตัวจริง นอนพักบนหิมะ",
    label: { th: "หมีขั้วโลกตัวจริง", en: "Real polar bears" },
    author: "Scott Schliebe (U.S. Fish and Wildlife Service)",
    license: "สาธารณสมบัติ",
    title: "Ursus maritimus Polar bear with cub 2",
    page: "https://commons.wikimedia.org/wiki/File:Ursus_maritimus_Polar_bear_with_cub_2.jpg",
  },
  seal: {
    file: "seal",
    width: 1200,
    height: 901,
    alt: "ภาพถ่ายลูกแมวน้ำวงแหวนตัวจริง อยู่บนน้ำแข็งที่ขั้วโลกเหนือ",
    label: { th: "แมวน้ำตัวจริง", en: "A real seal" },
    author: "Shawn Dahle (NOAA)",
    license: "สาธารณสมบัติ",
    title: "Pusa hispida pup",
    page: "https://commons.wikimedia.org/wiki/File:Pusa_hispida_pup.jpg",
  },
} satisfies Record<string, PhotoSource>;

type PhotoId = keyof typeof PHOTOS;

function photo(id: PhotoId): ScenePhoto {
  const s: PhotoSource = PHOTOS[id];
  return {
    src: `/explore/photos/${s.file}.webp`,
    width: s.width,
    height: s.height,
    alt: s.alt,
    label: s.label,
    credit: `ภาพ: ${s.author} — ${s.license} (Wikimedia Commons)`,
  };
}

/** เครดิตเต็มพร้อมลิงก์ต้นฉบับ — แสดงท้ายหน้าสำหรับผู้ใหญ่ */
export const PHOTO_CREDITS = Object.values(PHOTOS).map((s: PhotoSource) => ({
  title: s.title,
  author: s.author,
  license: s.license,
  page: s.page,
}));

/* ---------- หมวด "สัตว์และบ้านของมัน" ---------- */

export const HABITAT_GROUP = { titleTh: "สัตว์และบ้านของมัน", titleEn: "Animals and their homes" };
export const WORLD_GROUP = { titleTh: "สิ่งรอบตัว", titleEn: "The world around us" };

/* id ไม่ซ้ำกับบทของเกาะอื่น (ดาวเก็บแยกเกาะอยู่แล้ว แต่กันสับสน) — body ใช้เมื่อไม่มีการ์ตูนเท่านั้น */
export const HABITAT_LESSONS: Record<AgeId, Lesson[]> = {
  kids: [
    { id: "desert-home", icon: "sun", titleTh: "ทะเลทราย", titleEn: "The desert", body: "อูฐและจิ้งจอกเฟนเนคอยู่ในทะเลทรายที่ร้อนและแห้งได้" },
    { id: "forest-home", icon: "tree", titleTh: "ป่าไม้", titleEn: "The forest", body: "ช้างและกระรอกอยู่ในป่าที่มีต้นไม้สูงใหญ่" },
    { id: "sea-home", icon: "wave", titleTh: "ทะเล", titleEn: "The sea", body: "เต่าทะเลและโลมาว่ายน้ำอยู่ในทะเลกว้าง" },
    { id: "polar-home", icon: "mountain", titleTh: "ขั้วโลก", titleEn: "The polar lands", body: "หมีขั้วโลกและแมวน้ำอยู่ในที่หนาวที่สุด" },
  ],
  juniors: [
    { id: "desert-life", icon: "sun", titleTh: "ชีวิตในทะเลทราย", titleEn: "Life in the desert", body: "อูฐและจิ้งจอกเฟนเนคปรับตัวให้อยู่ในความร้อนได้" },
    { id: "forest-life", icon: "tree", titleTh: "ชีวิตในป่า", titleEn: "Life in the forest", body: "ป่ามีหลายชั้น ช้างและกระรอกช่วยให้ป่าเติบโต" },
    { id: "sea-life", icon: "wave", titleTh: "ชีวิตในทะเล", titleEn: "Life in the sea", body: "เต่าทะเลและโลมาหายใจด้วยปอด แต่ใช้ชีวิตในทะเล" },
    { id: "polar-life", icon: "mountain", titleTh: "ชีวิตที่ขั้วโลก", titleEn: "Life at the poles", body: "หมีขั้วโลกและแมวน้ำมีไขมันหนากันหนาว" },
  ],
};

/* ---------- การ์ตูน ---------- */

const BG = (name: string) => `/explore/scenes/${name}.webp`;
const SUBHANALLAH: Word = { ar: "سُبْحَانَ اللَّهِ", th: "ซุบฮานัลลอฮ์" };

type SceneExtra = Partial<Pick<CartoonScene, "photo" | "word" | "sayAlong">> & {
  /** ข้อความที่ส่งให้เสียงสังเคราะห์ แทน th (เช่น ชื่อที่ต้องเขียนอังกฤษให้อ่านถูก) */
  voice?: string;
};
export type ExploreScene = CartoonScene & { voice?: string };

// หนึ่งฉาก — ms = เวลาแสดงเมื่อไม่มีเสียง (ประมาณจากความยาวข้อความ)
function scene(bg: string, clip: string, pose: GuidePose, th: string, en: string, extra: SceneExtra = {}): ExploreScene {
  return { bg: BG(bg), clip, pose, th, en, ms: Math.max(4500, th.length * 65), ...extra };
}

// ฉากลาท้ายบท — ให้เด็กพูดตาม ซุบฮานัลลอฮ์
const bye = (bg: string, clip: string, th: string, en: string) =>
  scene(bg, clip, "wave", th, en, { word: SUBHANALLAH, sayAlong: true });

export const CARTOONS: Record<string, Cartoon & { scenes: ExploreScene[] }> = {
  // ================= ทะเลทราย =================
  "desert-home": {
    scenes: [
      scene("desert-arrive", "dsk-hello", "wave",
        "อัสสะลามุอะลัยกุม วันนี้ครูนูรีพามาเที่ยวทะเลทราย ทะเลทรายมีทรายเต็มไปหมด แดดร้อนมาก และฝนตกน้อยมาก",
        "Assalamu alaikum! Today Nuri takes you to the desert. Lots of sand, hot sun, very little rain."),
      scene("desert-camel", "dsk-camel", "point",
        "นี่คืออูฐ อูฐมีโหนกบนหลัง ขายาว และเท้ากว้าง เดินบนทรายร้อนได้สบาย",
        "This is a camel. It has a hump, long legs and wide feet for walking on hot sand."),
      scene("desert-camel", "dsk-camel-real", "point",
        "ดูสิ นี่คืออูฐตัวจริง ที่อัลลอฮ์ทรงสร้าง",
        "Look! This is a real camel that Allah created.", { photo: photo("camel") }),
      scene("desert-oasis", "dsk-drink", "point",
        "อูฐดื่มน้ำทีละมากๆ แล้วเดินต่อได้อีกหลายวัน",
        "A camel drinks a lot of water at once, then can walk for many days."),
      scene("desert-fox", "dsk-fox", "point",
        "นี่คือจิ้งจอกเฟนเนค หูของมันใหญ่มาก กลางวันมันหลบแดดอยู่ในโพรงใต้ทราย",
        "This is a fennec fox. Its ears are very big. In the day it hides from the sun in a hole under the sand."),
      scene("desert-fox", "dsk-fox-real", "point",
        "ดูสิ นี่คือจิ้งจอกเฟนเนคตัวจริง หูใหญ่จริงๆ เลย",
        "Look! This is a real fennec fox. Its ears really are big!", { photo: photo("fennec") }),
      bye("desert-arrive", "dsk-bye",
        "ทะเลทรายคือบ้านของอูฐและจิ้งจอกเฟนเนค อัลลอฮ์ทรงสร้างพวกมันเก่งมาก เราพูดว่า ซุบฮานัลลอฮ์",
        "The desert is home to camels and fennec foxes. Allah made them so well. We say SubhanAllah!"),
    ],
  },
  "desert-life": {
    scenes: [
      scene("desert-arrive", "dsj-hello", "wave",
        "อัสสะลามุอะลัยกุม วันนี้เราไปสำรวจทะเลทรายกัน กลางวันร้อนจัด กลางคืนหนาวเย็น และฝนตกน้อยมากทั้งปี",
        "Assalamu alaikum! Let's explore the desert: very hot days, cold nights and little rain all year."),
      scene("desert-camel", "dsj-camel", "point",
        "อูฐมีเท้ากว้างและนุ่ม จึงไม่จมลงไปในทราย โหนกบนหลังเก็บไขมันไว้เป็นพลังงานยามขาดอาหาร",
        "Camels have wide, soft feet that don't sink in sand. The hump stores fat for energy when food is scarce."),
      scene("desert-camel", "dsj-camel-real", "point",
        "นี่คืออูฐตัวจริง อูฐโหนกเดียวพบมากในคาบสมุทรอาหรับและแอฟริกาเหนือ",
        "This is a real one-humped camel. They live in Arabia and North Africa.", { photo: photo("camel") }),
      // อัลฆอชิยะฮ์ 88:17 — ตัวบทตรวจกับตัฟซีรอิบนุ กะษีร ใน Shamela (https://shamela.ws/book/8473/4432)
      // บรรทัดไทยบนป้ายเป็นชื่อซูเราะฮ์ ความหมายอยู่ในข้อความใต้ภาพแล้ว (ป้ายยาวจะบังฉากบนมือถือ)
      scene("desert-oasis", "dsj-ayah", "point",
        "อัลลอฮ์ตรัสในอัลกุรอานว่า พวกเขาไม่มองดูอูฐหรือว่า มันถูกสร้างขึ้นมาอย่างไร",
        "Allah says in the Quran: Do they not look at the camels, how they are created?",
        { word: { ar: "أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ", th: "ซูเราะฮ์อัลฆอชิยะฮ์", compact: true } }),
      scene("desert-fox", "dsj-fox", "point",
        "จิ้งจอกเฟนเนคเป็นจิ้งจอกที่ตัวเล็กที่สุดในโลก หูที่ใหญ่ช่วยระบายความร้อนออกจากตัว และได้ยินเสียงแมลงที่ซ่อนอยู่ใต้ทราย",
        "The fennec is the smallest fox in the world. Its big ears let out heat and hear insects hiding under the sand."),
      scene("desert-fox", "dsj-fox-real", "point",
        "นี่คือจิ้งจอกเฟนเนคตัวจริง กลางวันมันนอนพักในโพรงหรือที่ร่ม เพราะใต้ทรายเย็นกว่าข้างบน",
        "This is a real fennec fox. By day it sleeps in its burrow or in the shade — under the sand is cooler.",
        { photo: photo("fennecRest") }),
      scene("desert-night", "dsj-night", "point",
        "พอกลางคืนอากาศเย็นลง มันจึงออกมาหาอาหาร",
        "When the night cools down, it comes out to find food."),
      bye("desert-arrive", "dsj-bye",
        "อัลลอฮ์ทรงสร้างสัตว์ทุกชนิดให้เหมาะกับบ้านของมัน เมื่อเห็นความเก่งนี้ เราพูดว่า ซุบฮานัลลอฮ์",
        "Allah made every animal fit its home. When we see this, we say SubhanAllah!"),
    ],
  },

  // ================= ป่า =================
  "forest-home": {
    scenes: [
      scene("forest-arrive", "frk-hello", "wave",
        "อัสสะลามุอะลัยกุม วันนี้ครูนูรีพามาเที่ยวป่า ในป่ามีต้นไม้สูงใหญ่ มีลำธารใสๆ และร่มเย็นสบาย",
        "Assalamu alaikum! Today Nuri takes you to the forest: tall trees, a clear stream and cool shade."),
      scene("forest-elephant", "frk-elephant", "point",
        "นี่คือช้าง ช้างตัวใหญ่มาก มีงวงยาว ใช้งวงหยิบอาหารและดูดน้ำ",
        "This is an elephant. It is very big and uses its long trunk to pick up food and drink water."),
      scene("forest-elephant", "frk-elephant-real", "point",
        "ดูสิ นี่คือช้างตัวจริง เป็นช้างป่าในประเทศไทยของเราเอง",
        "Look! These are real wild elephants, right here in Thailand.", { photo: photo("elephant") }),
      scene("forest-river", "frk-bath", "point",
        "ช้างชอบลงเล่นน้ำ มันใช้งวงพ่นน้ำรดตัวให้เย็นสบาย",
        "Elephants love the water. They spray water over their backs with their trunks to keep cool."),
      scene("forest-squirrel", "frk-squirrel", "point",
        "นี่คือกระรอก กระรอกปีนต้นไม้เก่งมาก ชอบกินถั่วและผลไม้",
        "This is a squirrel. It climbs trees very well and likes nuts and fruit."),
      scene("forest-squirrel", "frk-squirrel-real", "point",
        "ดูสิ นี่คือกระรอกตัวจริง หางเป็นพวงสวยจัง",
        "Look! This is a real squirrel. What a fluffy tail!", { photo: photo("squirrel") }),
      bye("forest-arrive", "frk-bye",
        "ป่าคือบ้านของช้างและกระรอก อัลลอฮ์ทรงสร้างพวกมันเก่งมาก เราพูดว่า ซุบฮานัลลอฮ์",
        "The forest is home to elephants and squirrels. Allah made them so well. We say SubhanAllah!"),
    ],
  },
  "forest-life": {
    scenes: [
      scene("forest-arrive", "frj-hello", "wave",
        "อัสสะลามุอะลัยกุม วันนี้เราไปสำรวจป่าเขตร้อนกัน ฝนตกชุก ต้นไม้จึงเขียวทั้งปี และเป็นบ้านของสัตว์มากมาย",
        "Assalamu alaikum! Let's explore the tropical forest: lots of rain, green all year, home to many animals."),
      scene("forest-canopy", "frj-layers", "point",
        "ป่ามีหลายชั้น ชั้นบนสุดเป็นยอดไม้สูง ชั้นกลางเป็นเรือนยอดหนาทึบ และพื้นป่าข้างล่างร่มและชื้น สัตว์แต่ละชนิดอยู่ชั้นที่เหมาะกับตัวมัน",
        "A forest has layers: the tallest treetops, the thick canopy, and the shady, damp forest floor. Each animal lives in the layer that suits it."),
      scene("forest-elephant", "frj-elephant", "point",
        "ช้างเอเชียเป็นสัตว์บกที่ใหญ่ที่สุดในเอเชีย งวงของมันคือจมูกที่ยาวมาก ใช้ดมกลิ่น หยิบอาหาร และดูดน้ำ",
        "The Asian elephant is the largest land animal in Asia. Its trunk is a very long nose for smelling, grabbing food and sucking up water."),
      scene("forest-elephant", "frj-elephant-real", "point",
        "นี่คือช้างป่าตัวจริงที่อุทยานแห่งชาติเขาใหญ่ ประเทศไทย ช้างอยู่กันเป็นครอบครัว",
        "These are real wild elephants in Khao Yai National Park, Thailand. Elephants live in families.",
        { photo: photo("elephant") }),
      scene("forest-river", "frj-seeds", "point",
        "ช้างกินพืชวันละมากๆ และเดินไปทั่วป่า เมล็ดพืชที่ติดไปกับมูลของมันงอกเป็นต้นไม้ใหม่ ช้างจึงช่วยปลูกป่า",
        "Elephants eat lots of plants and walk all over the forest. Seeds in their dung grow into new trees, so elephants help plant the forest."),
      scene("forest-squirrel", "frj-squirrel-real", "point",
        "นี่คือกระรอกตัวจริง หางที่เป็นพวงช่วยทรงตัวเวลากระโดดจากกิ่งหนึ่งไปอีกกิ่ง",
        "This is a real squirrel. Its bushy tail helps it balance when it jumps from branch to branch.",
        { photo: photo("squirrel") }),
      // อัลอันอาม 6:38 — ตัวบทตรวจกับตัฟซีรอิบนุ กะษีร ใน Shamela (https://shamela.ws/book/8473/1518)
      scene("forest-canopy", "frj-ayah", "point",
        "อัลลอฮ์ตรัสในอัลกุรอานว่า ไม่มีสัตว์ใดบนแผ่นดิน และไม่มีนกใดที่บินด้วยปีกทั้งสองของมัน เว้นแต่เป็นประชาชาติเหมือนกับพวกเจ้า",
        "Allah says in the Quran: There is no creature on earth, nor bird flying with its wings, but they are communities like you.",
        { word: { ar: "وَمَا مِن دَابَّةٍ فِي الْأَرْضِ وَلَا طَائِرٍ يَطِيرُ بِجَنَاحَيْهِ إِلَّا أُمَمٌ أَمْثَالُكُم", th: "ซูเราะฮ์อัลอันอาม", compact: true } }),
      bye("forest-arrive", "frj-bye",
        "สัตว์ทุกชนิดในป่าก็เป็นประชาชาติหนึ่งเหมือนเรา อัลลอฮ์ทรงดูแลพวกมันทั้งหมด เราพูดว่า ซุบฮานัลลอฮ์",
        "Every forest animal is a community like us, and Allah cares for them all. We say SubhanAllah!"),
    ],
  },

  // ================= ทะเล =================
  "sea-home": {
    scenes: [
      scene("sea-arrive", "sek-hello", "wave",
        "อัสสะลามุอะลัยกุม วันนี้ครูนูรีพาดำลงไปใต้ทะเล ใต้ทะเลมีปะการังหลากสี และปลาตัวน้อยมากมาย",
        "Assalamu alaikum! Today Nuri takes you under the sea: colorful coral and lots of little fish."),
      scene("sea-turtle", "sek-turtle", "point",
        "นี่คือเต่าทะเล มันมีกระดองแข็ง และขาเหมือนใบพาย ว่ายน้ำเก่งมาก",
        "This is a sea turtle. It has a hard shell and paddle-like flippers. It swims very well."),
      scene("sea-turtle", "sek-turtle-real", "point",
        "ดูสิ นี่คือเต่าทะเลตัวจริง ที่อัลลอฮ์ทรงสร้าง",
        "Look! This is a real sea turtle that Allah created.", { photo: photo("turtle") }),
      scene("sea-beach", "sek-babies", "point",
        "แม่เต่าวางไข่บนหาดทราย พอลูกเต่าออกจากไข่ ก็คลานลงทะเลไปเอง",
        "Mother turtles lay eggs on the beach. When the babies hatch, they crawl to the sea all by themselves."),
      scene("sea-dolphin", "sek-dolphin", "point",
        "นี่คือโลมา โลมาว่ายน้ำเร็ว และกระโดดขึ้นจากน้ำได้สูง",
        "This is a dolphin. Dolphins swim fast and can leap high out of the water."),
      scene("sea-dolphin", "sek-dolphin-real", "point",
        "ดูสิ นี่คือโลมาตัวจริง กระโดดสูงจังเลย",
        "Look! This is a real dolphin. What a big jump!", { photo: photo("dolphin") }),
      bye("sea-arrive", "sek-bye",
        "ทะเลคือบ้านของเต่าทะเลและโลมา อัลลอฮ์ทรงสร้างพวกมันเก่งมาก เราพูดว่า ซุบฮานัลลอฮ์",
        "The sea is home to sea turtles and dolphins. Allah made them so well. We say SubhanAllah!"),
    ],
  },
  "sea-life": {
    scenes: [
      scene("sea-arrive", "sej-hello", "wave",
        "อัสสะลามุอะลัยกุม วันนี้เราไปสำรวจทะเลกัน ทะเลกว้างใหญ่มาก ปกคลุมพื้นผิวโลกเกือบสามในสี่ส่วน",
        "Assalamu alaikum! Let's explore the sea. It is huge — it covers almost three quarters of the Earth."),
      scene("sea-turtle", "sej-turtle", "point",
        "เต่าทะเลหายใจด้วยปอด จึงต้องขึ้นมาหายใจที่ผิวน้ำ ขาคู่หน้าเป็นครีบใหญ่ ช่วยให้ว่ายน้ำได้ไกลมาก",
        "Sea turtles breathe air with lungs, so they come up to the surface. Their big front flippers let them swim very far."),
      scene("sea-turtle", "sej-turtle-real", "point",
        "นี่คือเต่าตนุตัวจริง เต่าตนุโตแล้วกินหญ้าทะเลและสาหร่าย",
        "This is a real green turtle. Grown-up green turtles eat sea grass and seaweed.",
        { photo: photo("turtleReef") }),
      scene("sea-beach", "sej-babies", "point",
        "แม่เต่ากลับมาวางไข่บนหาดทราย ลูกเต่าออกจากไข่แล้วคลานลงทะเลเอง โดยไม่มีใครพาไป อัลลอฮ์ทรงให้มันรู้ทางเอง",
        "Mother turtles come back to lay eggs on the beach. The babies find their own way to the sea — Allah guides them."),
      scene("sea-dolphin", "sej-dolphin", "point",
        "โลมาไม่ใช่ปลา มันเป็นสัตว์เลี้ยงลูกด้วยนม หายใจทางรูบนหัว และอยู่กันเป็นฝูง",
        "Dolphins are not fish. They are mammals that breathe through a hole on the top of the head and live in groups."),
      scene("sea-dolphin", "sej-dolphin-real", "point",
        "นี่คือโลมาตัวจริง กำลังกระโดดขึ้นเหนือผิวน้ำ",
        "This is a real dolphin leaping above the water.", { photo: photo("dolphin") }),
      // อันนูร 24:45 — ตัวบทตรวจกับตัฟซีรอิบนุ กะษีร ใน Shamela (https://shamela.ws/book/8473/2979)
      scene("sea-arrive", "sej-ayah", "point",
        "อัลลอฮ์ตรัสในอัลกุรอานว่า และอัลลอฮ์ทรงสร้างสัตว์ทุกชนิดมาจากน้ำ",
        "Allah says in the Quran: And Allah created every living creature from water.",
        { word: { ar: "وَاللَّهُ خَلَقَ كُلَّ دَابَّةٍ مِّن مَّاءٍ", th: "ซูเราะฮ์อันนูร", compact: true } }),
      bye("sea-arrive", "sej-bye",
        "ทุกชีวิตต้องการน้ำ และทะเลก็เต็มไปด้วยสิ่งที่อัลลอฮ์ทรงสร้าง เราพูดว่า ซุบฮานัลลอฮ์",
        "Every life needs water, and the sea is full of Allah's creation. We say SubhanAllah!"),
    ],
  },

  // ================= ขั้วโลก =================
  "polar-home": {
    scenes: [
      scene("polar-arrive", "pok-hello", "wave",
        "อัสสะลามุอะลัยกุม วันนี้ครูนูรีพาไปขั้วโลก ที่นี่หนาวมาก มีหิมะและน้ำแข็งขาวไปหมด",
        "Assalamu alaikum! Today Nuri takes you to the polar lands. It is very cold, with snow and ice everywhere."),
      scene("polar-bear", "pok-bear", "point",
        "นี่คือหมีขั้วโลก ขนสีขาวหนาฟู ช่วยให้มันอบอุ่น",
        "This is a polar bear. Its thick white fur keeps it warm."),
      scene("polar-bear", "pok-bear-real", "point",
        "ดูสิ นี่คือหมีขั้วโลกตัวจริง แม่หมีกับลูกหมีกำลังพักอยู่บนหิมะ",
        "Look! These are real polar bears — a mother and her cub resting on the snow.",
        { photo: photo("polarBear") }),
      scene("polar-seal", "pok-seal", "point",
        "นี่คือแมวน้ำ มันนอนพักบนน้ำแข็ง แล้วลงไปว่ายน้ำในทะเลเย็นๆ",
        "This is a seal. It rests on the ice, then goes swimming in the cold sea."),
      scene("polar-seal", "pok-seal-real", "point",
        "ดูสิ นี่คือแมวน้ำตัวจริง ตัวอ้วนกลมน่ารัก",
        "Look! This is a real seal. So round and chubby!", { photo: photo("seal") }),
      scene("polar-swim", "pok-swim", "point",
        "แมวน้ำว่ายน้ำเก่งมาก ว่ายอยู่ใต้น้ำแข็งได้สบาย",
        "Seals are great swimmers. They swim easily under the ice."),
      bye("polar-arrive", "pok-bye",
        "ขั้วโลกคือบ้านของหมีขั้วโลกและแมวน้ำ อัลลอฮ์ทรงสร้างพวกมันเก่งมาก เราพูดว่า ซุบฮานัลลอฮ์",
        "The polar lands are home to polar bears and seals. Allah made them so well. We say SubhanAllah!"),
    ],
  },
  "polar-life": {
    scenes: [
      scene("polar-arrive", "poj-hello", "wave",
        "อัสสะลามุอะลัยกุม วันนี้เราไปสำรวจขั้วโลกเหนือกัน อากาศหนาวจัดจนทะเลกลายเป็นน้ำแข็ง และฤดูหนาวมืดเกือบทั้งวัน",
        "Assalamu alaikum! Let's explore the Arctic. It is so cold the sea freezes, and in winter it is dark almost all day."),
      scene("polar-bear", "poj-bear", "point",
        "หมีขั้วโลกมีไขมันหนาใต้ผิวหนัง และขนสองชั้นกันหนาว ฝ่าเท้ากว้างมีขน ช่วยไม่ให้ลื่นบนน้ำแข็ง",
        "Polar bears have thick fat under the skin and two layers of fur. Their wide, furry paws stop them slipping on ice."),
      scene("polar-den", "poj-den", "point",
        "แม่หมีขุดถ้ำในหิมะ แล้วคลอดลูกในนั้น ถ้ำหิมะช่วยกันลมหนาวให้ลูกหมีอบอุ่น",
        "A mother bear digs a den in the snow and has her cubs there. The den keeps the cubs safe from the freezing wind."),
      scene("polar-den", "poj-bear-real", "point",
        "นี่คือแม่หมีขั้วโลกกับลูกตัวจริง ลูกหมีอยู่กับแม่ประมาณสองปี เพื่อเรียนรู้การหาอาหาร",
        "These are a real mother polar bear and cub. Cubs stay with their mother for about two years to learn to find food.",
        { photo: photo("polarBear") }),
      scene("polar-seal", "poj-seal", "point",
        "แมวน้ำมีไขมันหนาเป็นชั้น เหมือนเสื้อกันหนาวในตัว มันจึงว่ายน้ำในทะเลเย็นจัดได้",
        "Seals have a thick layer of fat, like a coat inside their body, so they can swim in icy water."),
      scene("polar-swim", "poj-hole", "point",
        "แมวน้ำวงแหวนทำรูหายใจในน้ำแข็ง แล้วโผล่ขึ้นมาหายใจที่รูนั้น",
        "Ringed seals keep breathing holes in the ice and come up there to breathe."),
      scene("polar-seal", "poj-seal-real", "point",
        "นี่คือลูกแมวน้ำวงแหวนตัวจริง อยู่บนน้ำแข็งที่ขั้วโลกเหนือ",
        "This is a real ringed seal pup on the Arctic ice.", { photo: photo("seal") }),
      bye("polar-arrive", "poj-bye",
        "ทั้งที่ร้อนที่สุดและหนาวที่สุด อัลลอฮ์ทรงสร้างสัตว์ให้อยู่ได้ทุกที่ เราพูดว่า ซุบฮานัลลอฮ์",
        "From the hottest places to the coldest, Allah made animals to live everywhere. We say SubhanAllah!"),
    ],
  },
};

/* ---------- ภาพการ์ด (ไม่มีภาพถ่ายบนการ์ด — ข้อ 1.1) ---------- */
export const CARD_ART: Record<string, string> = {
  "desert-home": "/explore/card-desert.webp",
  "desert-life": "/explore/card-desert.webp",
  "forest-home": "/explore/card-forest.webp",
  "forest-life": "/explore/card-forest.webp",
  "sea-home": "/explore/card-sea.webp",
  "sea-life": "/explore/card-sea.webp",
  "polar-home": "/explore/card-polar.webp",
  "polar-life": "/explore/card-polar.webp",
  sun: "/explore/card-sun.webp",
  moon: "/explore/card-moon.webp",
  water: "/explore/card-water.webp",
  tree: "/explore/card-tree.webp",
  honey: "/explore/card-honey.webp",
  rain: "/explore/card-rain.webp",
  mountain: "/explore/card-mountain.webp",
  "day-night": "/explore/card-daynight.webp",
};
