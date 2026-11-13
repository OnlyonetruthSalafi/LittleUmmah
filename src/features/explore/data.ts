import type { Cartoon, CartoonScene, ScenePhoto, Word } from "@/features/moral/cartoon";
import type { Film, FilmWord } from "@/features/moral/film";
import type { AgeId, AgeSection, GuidePose, GuideStep } from "@/features/moral/data";
import type { Lesson } from "@/lib/lessons";
import type { Text } from "@/i18n/config";

/*
  ข้อมูลเฉพาะหน้าเกาะสำรวจโลก (/learn/explore) — หน้าตาและส่วนประกอบเดียวกับเกาะมารยาท (features/moral)

  สองหมวดต่อช่วงวัย
  - "สัตว์และบ้านของมัน" (2 ต.ค. 2026): การ์ตูนครูนูรีพาไปดูถิ่นที่อยู่ของสัตว์ แล้วให้ดูภาพถ่ายสัตว์จริง
    Ten habitats: desert, forest, sea, polar, pond, savanna, farm, garden, mountain and beach.
  - "สิ่งรอบตัว": บทเดิมจาก lib/lessons.ts (ดวงอาทิตย์ ดวงจันทร์ ฯลฯ) เปิดเป็นหน้าต่างข้อความ

  ภาพการ์ตูนจาก Codex (docs/briefs/archive/CODEX_EXPLORE_BRIEF.md, docs/briefs/archive/CODEX_EXPLORE_BRIEF_2.md) สัตว์ใบหน้าว่างตาม AGENTS.md ข้อ 1.1
  ภาพถ่ายใช้ตามข้อ "ภาพถ่ายสัตว์เพื่อการสอน" ในข้อ 1.1 — เฉพาะฉากสอน ไม่ใช้บนการ์ด เฉพาะสาธารณสมบัติ/CC0

  เสียงพากย์สร้างจากข้อความไทยในไฟล์นี้โดยตรง (scripts/make-explore-voice.mjs import ไฟล์นี้)
  ไฟล์นี้จึง import ได้แค่ type เท่านั้น — Node อ่านไฟล์ .ts ได้เมื่อไม่มี import ที่ต้องรันจริง
  ฉาก sayAlong เสียงต่อท้ายว่า "พูดตามครู ..." และฉากที่มี voice ใช้ข้อความนั้นแทน th
  คำทับศัพท์ที่เสียงอ่านเพี้ยน (การ์ด, เฟนเนค) แปลงเป็นอังกฤษใน scripts/lib/robot-voice.mjs ไม่ต้องแก้ที่นี่
*/

export const AGE_SECTIONS: Record<AgeId, AgeSection> = {
  kids: {
    label: { th: "วัย 3-6 ปี", en: "Ages 3-6" },
    desc: { th: "รู้จักสัตว์และสิ่งรอบตัวที่อัลลอฮ์ทรงสร้าง", en: "Animals and the world Allah created" },
    badge: "/moral/age-kids.webp",
  },
  juniors: {
    label: { th: "วัย 7 ปีขึ้นไป", en: "Ages 7+" },
    desc: { th: "สำรวจว่าสัตว์อยู่ในบ้านของมันได้อย่างไร", en: "How animals live in their homes" },
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
    th: "น้องวัย 3-6 ขวบ กดปุ่มสีเหลือง ไปเที่ยวบ้านของสัตว์หลายแห่งกับครู แล้วดูสัตว์ตัวจริงกัน",
    en: "Ages 3-6: tap the yellow button to visit different animal homes with me and see real animals.",
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
  alt: Text;
  label: { th: string; en: string };
  author: string;
  license: "สาธารณสมบัติ" | "CC0";
  /** ชื่อไฟล์ต้นฉบับบน Wikimedia Commons */
  title: string;
  page: string;
};

const PHOTOS = {
  // C-14: Commons extmetadata checked 2026-11-08; evidence: output/C-14/metadata/photo-*.json.
  mountainGoat: {
    file: "mountain-goat",
    width: 1200,
    height: 800,
    alt: { th: "ภาพถ่ายแพะภูเขาตัวจริง ขนสีขาว มีเขา ฉากหลังเป็นโขดหิน", en: "Photo of a real mountain goat with white fur and horns, in front of rocks" },
    label: {
      th: "แพะภูเขาตัวจริง",
      en: "A real mountain goat",
    },
    author: "GlacierNPS (National Park Service)",
    license: "สาธารณสมบัติ",
    title: "Mountain Goat - Oreamnos americanus (51361810348).jpg",
    page: "https://commons.wikimedia.org/wiki/File:Mountain_Goat_-_Oreamnos_americanus_(51361810348).jpg",
  },
  mountainMarmot: {
    file: "mountain-marmot",
    width: 1200,
    height: 800,
    alt: { th: "ภาพถ่ายมาร์มอตท้องเหลืองตัวจริง พักอยู่บนขอนไม้", en: "Photo of a real yellow-bellied marmot resting on a log" },
    label: {
      th: "มาร์มอตตัวจริง",
      en: "A real marmot",
    },
    author: "Neal Herbert / Yellowstone National Park",
    license: "สาธารณสมบัติ",
    title: "Yellow-bellied marmot, Sepulcher Peak Trail (22311274306).jpg",
    page: "https://commons.wikimedia.org/wiki/File:Yellow-bellied_marmot,_Sepulcher_Peak_Trail_(22311274306).jpg",
  },
  beachHermit: {
    file: "beach-hermit",
    width: 1200,
    height: 900,
    alt: { th: "ภาพถ่ายปูเสฉวนบกแคริบเบียนตัวจริง อยู่ในเปลือกหอยบนพื้นดิน", en: "Photo of a real Caribbean hermit crab in its shell on the ground" },
    label: {
      th: "ปูเสฉวนตัวจริง",
      en: "A real hermit crab",
    },
    author: "ZooFari",
    license: "สาธารณสมบัติ",
    title: "Hermit-Crab.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Hermit-Crab.jpg",
  },
  beachGull: {
    file: "beach-gull",
    width: 1200,
    height: 900,
    alt: { th: "ภาพถ่ายนกนางนวลซิลเวอร์ตัวจริง ยืนอยู่บนหญ้า", en: "Photo of a real silver gull standing on grass" },
    label: {
      th: "นกนางนวลตัวจริง",
      en: "A real silver gull",
    },
    author: "Vicki",
    license: "CC0",
    title: "Gull, Silver (Public Domain).JPG",
    page: "https://commons.wikimedia.org/wiki/File:Gull,_Silver_(Public_Domain).JPG",
  },

  // C-7: ตรวจ extmetadata และภาพจริง 8 พ.ย. 2026 — หลักฐาน output/C-7/metadata/
  mallard: {
    file: "mallard", width: 1200, height: 1054,
    alt: { th: "ภาพถ่ายเป็ดมัลลาร์ดตัวจริง ยืนอยู่บนหญ้าริมบึง", en: "Photo of a real mallard duck standing on grass by a pond" },
    label: { th: "เป็ดมัลลาร์ดตัวจริง", en: "Real mallards" },
    author: "Bruxton", license: "CC0",
    title: "Male Mallard by pond",
    page: "https://commons.wikimedia.org/wiki/File:Male_Mallard_by_pond.jpg",
  },
  frog: {
    file: "frog", width: 1200, height: 803,
    alt: { th: "ภาพถ่ายกบสีน้ำตาลยุโรปตัวจริง อยู่บนมอสสีเขียว", en: "Photo of a real European common frog on green moss" },
    label: { th: "กบตัวจริง", en: "A real common frog" },
    author: "Ernie", license: "สาธารณสมบัติ",
    title: "AD2009Sep13 Rana temporaria 01",
    page: "https://commons.wikimedia.org/wiki/File:AD2009Sep13_Rana_temporaria_01.jpg",
  },
  zebra: {
    file: "zebra", width: 1200, height: 675,
    alt: { th: "ภาพถ่ายม้าลายตัวจริงในทุ่งหญ้ามาไซมารา", en: "Photo of a real zebra on the grasslands of the Maasai Mara" },
    label: { th: "ม้าลายตัวจริง", en: "A real zebra" },
    author: "HasselbladWhisperer", license: "CC0",
    title: "Masai Mara Zebra",
    page: "https://commons.wikimedia.org/wiki/File:Masai_Mara_Zebra.jpg",
  },
  giraffe: {
    file: "giraffe", width: 1200, height: 1500,
    alt: { th: "ภาพถ่ายยีราฟตัวจริง ยืนอยู่ท่ามกลางต้นไม้ในเขตอนุรักษ์บันเดีย", en: "Photo of a real giraffe standing among trees in the Bandia reserve" },
    label: { th: "ยีราฟตัวจริง", en: "A real giraffe" },
    author: "Gromane", license: "CC0",
    title: "Giraffe in Bandia reserve near Dakar Senegal",
    page: "https://commons.wikimedia.org/wiki/File:Giraffe_in_Bandia_reserve_near_Dakar_Senegal.jpg",
  },
  farmCow: {
    file: "farm-cow", width: 1200, height: 900,
    alt: { th: "ภาพถ่ายวัวตัวจริงสีน้ำตาล ยืนในทุ่งหญ้า", en: "Photo of a real brown cow standing in a meadow" },
    label: { th: "วัวตัวจริง", en: "A real cow" },
    author: "Gerda Arendt", license: "CC0",
    title: "Cow on pasture, Ehrenbach",
    page: "https://commons.wikimedia.org/wiki/File:Cow_on_pasture,_Ehrenbach.jpg",
  },
  farmSheep: {
    file: "farm-sheep", width: 1200, height: 898,
    alt: { th: "ภาพถ่ายแกะตัวจริงเป็นฝูง อยู่บนเนินหญ้า", en: "Photo of a real flock of sheep on a grassy hill" },
    label: { th: "แกะตัวจริง", en: "Real sheep" },
    author: "Ajznponar", license: "CC0",
    title: "Sheep grazing at Begunjscica 03",
    page: "https://commons.wikimedia.org/wiki/File:Sheep_grazing_at_Begunjscica_03.jpg",
  },
  gardenButterfly: {
    file: "garden-butterfly", width: 1200, height: 863,
    alt: { th: "ภาพถ่ายผีเสื้อตัวจริงปีกสีเหลืองดำ เกาะดอกไม้", en: "Photo of a real butterfly with yellow and black wings on a flower" },
    label: { th: "ผีเสื้อตัวจริง", en: "A real butterfly" },
    author: "Bruce Emmerling", license: "CC0",
    title: "A butterfly on a flower",
    page: "https://commons.wikimedia.org/wiki/File:A_butterfly_on_a_flower.jpg",
  },
  gardenBee: {
    file: "garden-bee", width: 1200, height: 1063,
    alt: { th: "ภาพถ่ายผึ้งตัวจริงเกาะดอกไม้สีฟ้า มีเกสรติดที่ขาหลัง", en: "Photo of a real bee on a blue flower, with pollen on its back legs" },
    label: { th: "ผึ้งตัวจริง", en: "A real honey bee" },
    author: "Dinkum", license: "CC0",
    title: "Apis mellifera on centaurea cyanus 3",
    page: "https://commons.wikimedia.org/wiki/File:Apis_mellifera_on_centaurea_cyanus_3.JPG",
  },
  camel: {
    file: "camel",
    width: 1200,
    height: 800,
    alt: { th: "ภาพถ่ายอูฐโหนกเดียวตัวจริง ยืนอยู่บนพื้นทรายในทะเลทราย", en: "Photo of a real one-humped camel standing on desert sand" },
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
    alt: { th: "ภาพถ่ายจิ้งจอกเฟนเนคตัวจริง ขนสีทราย นอนขดตัว หูใหญ่มาก", en: "Photo of a real fennec fox with sandy fur, curled up, with very big ears" },
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
    alt: { th: "ภาพถ่ายจิ้งจอกเฟนเนคตัวจริง นอนหลับพักตอนกลางวัน หูใหญ่ตั้งขึ้น", en: "Photo of a real fennec fox napping in the daytime, its big ears standing up" },
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
    alt: { th: "ภาพถ่ายช้างเอเชียตัวจริงสองตัว ในป่าอุทยานแห่งชาติเขาใหญ่", en: "Photo of two real Asian elephants in the forest of Khao Yai National Park" },
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
    alt: { th: "ภาพถ่ายกระรอกตัวจริง ห้อยตัวอยู่บนกิ่งไม้ หางเป็นพวง", en: "Photo of a real squirrel hanging from a branch, with a bushy tail" },
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
    alt: { th: "ภาพถ่ายเต่าตนุตัวจริง ว่ายน้ำอยู่เหนือแนวปะการัง", en: "Photo of a real green sea turtle swimming above a coral reef" },
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
    alt: { th: "ภาพถ่ายเต่าตนุตัวจริง พักอยู่บนแนวปะการัง", en: "Photo of a real green sea turtle resting on a coral reef" },
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
    alt: { th: "ภาพถ่ายโลมาตัวจริง กระโดดขึ้นเหนือผิวน้ำทะเล", en: "Photo of a real dolphin leaping above the sea" },
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
    alt: { th: "ภาพถ่ายแม่หมีขั้วโลกกับลูกตัวจริง นอนพักบนหิมะ", en: "Photo of a real polar bear mother and cub resting on the snow" },
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
    alt: { th: "ภาพถ่ายลูกแมวน้ำวงแหวนตัวจริง อยู่บนน้ำแข็งที่ขั้วโลกเหนือ", en: "Photo of a real ringed seal pup on the Arctic ice" },
    label: { th: "แมวน้ำตัวจริง", en: "A real seal" },
    author: "Shawn Dahle (NOAA)",
    license: "สาธารณสมบัติ",
    title: "Pusa hispida pup",
    page: "https://commons.wikimedia.org/wiki/File:Pusa_hispida_pup.jpg",
  },
} satisfies Record<string, PhotoSource>;

type PhotoId = keyof typeof PHOTOS;
const LICENSE_EN: Record<PhotoSource["license"], string> = { "สาธารณสมบัติ": "Public domain", CC0: "CC0" };

function photo(id: PhotoId): ScenePhoto {
  const s: PhotoSource = PHOTOS[id];
  return {
    src: `/explore/photos/${s.file}.webp`,
    width: s.width,
    height: s.height,
    alt: s.alt,
    label: s.label,
    credit: { th: `ภาพ: ${s.author} — ${s.license} (Wikimedia Commons)`, en: `Photo: ${s.author} — ${LICENSE_EN[s.license]} (Wikimedia Commons)` },
  };
}

/** เครดิตเต็มพร้อมลิงก์ต้นฉบับ — แสดงท้ายหน้าสำหรับผู้ใหญ่ */
export const PHOTO_CREDITS = Object.values(PHOTOS).map((s: PhotoSource) => ({
  title: s.title,
  author: s.author,
  license: { th: s.license, en: LICENSE_EN[s.license] } as Text,
  page: s.page,
}));

/* ---------- หมวด "สัตว์และบ้านของมัน" ---------- */

export const HABITAT_GROUP = { title: { th: "สัตว์และบ้านของมัน", en: "Animals and their homes" } };
export const WORLD_GROUP = { title: { th: "สิ่งรอบตัว", en: "The world around us" } };

// เก็บข้อความใหม่เป็น Text; body ของ Lesson เดิมยังเป็น string และไม่ใช้เมื่อมีการ์ตูน
export const HABITAT_SUMMARIES: Record<string, Text> = {
  "mountain-home": { th: "แพะภูเขาปีนหิน มาร์มอตอยู่ใกล้ทุ่งหญ้า", en: "Mountain goats climb rocks; marmots live near meadows." },
  "mountain-life": { th: "สำรวจกีบเท้า ขนกันหนาว และการจำศีล", en: "Explore gripping hooves, warm coats and hibernation." },
  "beach-home": { th: "รู้จักปูเสฉวนและนกนางนวลริมชายหาด", en: "Meet hermit crabs and gulls by the beach." },
  "beach-life": { th: "เปลือกหอยเป็นที่ป้องกันตัว และชายฝั่งเป็นบ้านของนก", en: "Shells protect crabs, and coasts are home to birds." },
  "pond-home": { th: "เป็ดว่ายน้ำ กบอยู่ริมน้ำ", en: "Ducks swim and frogs live near water." },
  "pond-life": { th: "เรียนรู้เท้าพังผืดของเป็ดและการเติบโตของกบ", en: "Explore webbed feet and how frogs grow." },
  "savanna-home": { th: "ม้าลายกินหญ้า ยีราฟกินใบไม้", en: "Zebras eat grass and giraffes eat leaves." },
  "savanna-life": { th: "ม้าลายกับยีราฟหาอาหารต่างระดับ", en: "Zebras and giraffes feed at different heights." },
};

/* id ไม่ซ้ำกับบทของเกาะอื่น (ดาวเก็บแยกเกาะอยู่แล้ว แต่กันสับสน) — body ใช้เมื่อไม่มีการ์ตูนเท่านั้น */
export const HABITAT_LESSONS: Record<AgeId, Lesson[]> = {
  kids: [
    { id: "mountain-home", icon: "mountain", title: { th: "ภูเขา", en: "The mountains" }, body: HABITAT_SUMMARIES["mountain-home"] },
    { id: "beach-home", icon: "wave", title: { th: "ชายหาด", en: "The beach" }, body: HABITAT_SUMMARIES["beach-home"] },
    { id: "farm-home", icon: "tree", title: { th: "ฟาร์ม", en: "The farm" }, body: { th: "วัวและแกะกินหญ้า และต้องการน้ำสะอาด", en: "Cows and sheep eat grass, and they need clean water." } },
    { id: "garden-home", icon: "tree", title: { th: "สวนดอกไม้", en: "The flower garden" }, body: { th: "ดอกไม้เป็นแหล่งอาหารของผีเสื้อและผึ้ง", en: "Flowers are food for butterflies and bees." } },
    { id: "desert-home", icon: "sun", title: { th: "ทะเลทราย", en: "The desert" }, body: { th: "อูฐและจิ้งจอกเฟนเนคอยู่ในทะเลทรายที่ร้อนและแห้งได้", en: "Camels and fennec foxes can live in the hot, dry desert." } },
    { id: "forest-home", icon: "tree", title: { th: "ป่าไม้", en: "The forest" }, body: { th: "ช้างและกระรอกอยู่ในป่าที่มีต้นไม้สูงใหญ่", en: "Elephants and squirrels live in forests full of tall trees." } },
    { id: "sea-home", icon: "wave", title: { th: "ทะเล", en: "The sea" }, body: { th: "เต่าทะเลและโลมาว่ายน้ำอยู่ในทะเลกว้าง", en: "Sea turtles and dolphins swim in the wide sea." } },
    { id: "polar-home", icon: "mountain", title: { th: "ขั้วโลก", en: "The polar lands" }, body: { th: "หมีขั้วโลกและแมวน้ำอยู่ในที่หนาวที่สุด", en: "Polar bears and seals live in the coldest places." } },
    { id: "pond-home", icon: "drop", title: { th: "ริมบึง", en: "The freshwater pond" }, body: HABITAT_SUMMARIES["pond-home"] },
    { id: "savanna-home", icon: "tree", title: { th: "ทุ่งหญ้าสะวันนา", en: "The savanna" }, body: HABITAT_SUMMARIES["savanna-home"] },
  ],
  juniors: [
    { id: "mountain-life", icon: "mountain", title: { th: "ชีวิตบนภูเขา", en: "Life in the mountains" }, body: HABITAT_SUMMARIES["mountain-life"] },
    { id: "beach-life", icon: "wave", title: { th: "ชีวิตริมชายหาด", en: "Life by the beach" }, body: HABITAT_SUMMARIES["beach-life"] },
    { id: "farm-life", icon: "tree", title: { th: "ชีวิตในฟาร์ม", en: "Life on the farm" }, body: { th: "วัวและแกะเคี้ยวเอื้อง ช่วยย่อยอาหารจากพืช", en: "Cows and sheep chew the cud, which helps them digest plants." } },
    { id: "garden-life", icon: "tree", title: { th: "ชีวิตในสวนดอกไม้", en: "Life in the flower garden" }, body: { th: "ผีเสื้อเติบโตผ่านสี่ระยะ และผึ้งช่วยถ่ายละอองเรณู", en: "Butterflies grow through four stages, and bees help carry pollen." } },
    { id: "desert-life", icon: "sun", title: { th: "ชีวิตในทะเลทราย", en: "Life in the desert" }, body: { th: "อูฐและจิ้งจอกเฟนเนคปรับตัวให้อยู่ในความร้อนได้", en: "Camels and fennec foxes are made to cope with the heat." } },
    { id: "forest-life", icon: "tree", title: { th: "ชีวิตในป่า", en: "Life in the forest" }, body: { th: "ป่ามีหลายชั้น ช้างและกระรอกช่วยให้ป่าเติบโต", en: "A forest has many layers, and elephants and squirrels help it grow." } },
    { id: "sea-life", icon: "wave", title: { th: "ชีวิตในทะเล", en: "Life in the sea" }, body: { th: "เต่าทะเลและโลมาหายใจด้วยปอด แต่ใช้ชีวิตในทะเล", en: "Sea turtles and dolphins breathe with lungs, but they live in the sea." } },
    { id: "polar-life", icon: "mountain", title: { th: "ชีวิตที่ขั้วโลก", en: "Life at the poles" }, body: { th: "หมีขั้วโลกและแมวน้ำมีไขมันหนากันหนาว", en: "Polar bears and seals have thick fat to keep out the cold." } },
    { id: "pond-life", icon: "drop", title: { th: "ชีวิตริมบึง", en: "Life at the pond" }, body: HABITAT_SUMMARIES["pond-life"] },
    { id: "savanna-life", icon: "tree", title: { th: "ชีวิตในสะวันนา", en: "Life in the savanna" }, body: HABITAT_SUMMARIES["savanna-life"] },
  ],
};

/* ---------- การ์ตูน ---------- */

const BG = (name: string) => `/explore/scenes/${name}.webp`;
const SUBHANALLAH: Word = { ar: "سُبْحَانَ اللَّهِ", th: "ซุบฮานัลลอฮ์" };

type SceneExtra = Partial<Pick<CartoonScene, "photo" | "word" | "sayAlong" | "evidence">> & {
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
  // C-14: NPS mountain-goats; Yellowstone yellow-bellied-marmot; Smithsonian land-hermit-crab;
  // Australian Museum silver-gull. Exact URLs, claims and photo extmetadata: output/C-14/report.md.
  // Beach examples come from different coastlines; they are not presented as one local community.
  "mountain-home": {
    scenes: [
      scene("mountain-arrive", "mountain-k-hello", "wave",
        "วันนี้ครูพาไปเที่ยวภูเขา มีก้อนหินและทุ่งหญ้าด้วย",
        "Today we visit the mountains. There are rocks and grassy meadows."),
      scene("mountain-goat", "mountain-k-goat", "point",
        "นี่คือแพะภูเขา มันปีนทางหินเก่งมาก",
        "This is a mountain goat. It climbs rocky slopes very well."),
      scene("mountain-goat", "mountain-k-goat-real", "point",
        "ดูสิ นี่คือแพะภูเขาตัวจริง ขนหนาช่วยกันหนาว",
        "Look! This is a real mountain goat. Its thick coat keeps it warm.", { photo: photo("mountainGoat") }),
      scene("mountain-goat", "mountain-k-grass", "point",
        "แพะภูเขากินหญ้าและพืชอื่นๆ ที่ขึ้นบนภูเขา",
        "Mountain goats eat grass and other plants that grow in the mountains."),
      scene("mountain-marmot", "mountain-k-marmot", "point",
        "นี่คือมาร์มอต มันขุดโพรงใกล้ก้อนหิน และออกมากินหญ้า",
        "This is a marmot. It digs a burrow near rocks and comes out to eat grass."),
      scene("mountain-marmot", "mountain-k-marmot-real", "point",
        "ดูสิ นี่คือมาร์มอตตัวจริง ตัวนี้มีขนสีน้ำตาล",
        "Look! This is a real marmot. It has brown fur.", { photo: photo("mountainMarmot") }),
      scene("mountain-arrive", "mountain-k-bye", "wave",
        "ภูเขาเป็นบ้านของสัตว์ เราดูอยู่ห่างๆ และไม่ให้อาหารนะ",
        "Mountains are animals' homes. Watch from a distance and do not feed them."),
    ],
  },
  "mountain-life": {
    scenes: [
      scene("mountain-arrive", "mountain-j-hello", "wave",
        "วันนี้เราสำรวจสัตว์บนภูเขาในอเมริกาเหนือ ที่นี่มีทั้งทางหินชันและทุ่งหญ้า",
        "Today we explore mountain animals in North America, where there are steep rocky slopes and meadows."),
      scene("mountain-goat", "mountain-j-hooves", "point",
        "กีบของแพะภูเขาแยกเป็นสองส่วนและกางออกได้ แผ่นรองใต้กีบช่วยเกาะหินเวลาปีน",
        "A mountain goat's hooves split into two parts that can spread apart. Pads underneath help grip rocks while climbing."),
      scene("mountain-goat", "mountain-j-goat-real", "point",
        "นี่คือแพะภูเขาตัวจริง ขนหนาช่วยเก็บความอบอุ่นในอากาศหนาว",
        "This is a real mountain goat. Its thick coat helps retain warmth in cold weather.", { photo: photo("mountainGoat") }),
      scene("mountain-goat", "mountain-j-food", "point",
        "แพะภูเขากินพืช เช่น หญ้าและพุ่มไม้เตี้ย มันเลือกกินพืชที่หาได้ตามฤดูกาล",
        "Mountain goats eat plants such as grasses and low shrubs. They feed on plants available in each season."),
      scene("mountain-marmot", "mountain-j-burrow", "point",
        "มาร์มอตท้องเหลืองอยู่ใกล้ทุ่งหญ้าและก้อนหิน มันขุดโพรงใต้หินเพื่อเป็นที่หลบภัย",
        "Yellow-bellied marmots live near meadows and rocks. They dig burrows under rocks for shelter."),
      scene("mountain-marmot", "mountain-j-marmot-real", "point",
        "นี่คือมาร์มอตท้องเหลืองตัวจริง มันกินหญ้า พืชใบกว้าง และเมล็ดพืช",
        "This is a real yellow-bellied marmot. It eats grasses, broad-leaved plants and seeds.", { photo: photo("mountainMarmot") }),
      scene("mountain-marmot", "mountain-j-winter", "point",
        "ก่อนฤดูหนาว มาร์มอตสะสมไขมัน แล้วจำศีลในโพรง ร่างกายทำงานช้าลงเพื่อประหยัดพลังงาน",
        "Before winter, marmots store fat and then hibernate in burrows. Their bodies slow down to save energy."),
      scene("mountain-arrive", "mountain-j-bye", "wave",
        "กีบเท้า ขนหนา และการจำศีลช่วยสัตว์อยู่บนภูเขา เราชมจากระยะห่างและไม่ให้อาหารสัตว์ป่า",
        "Gripping hooves, thick coats and hibernation help mountain animals survive. Watch from a distance and never feed wildlife."),
    ],
  },
  "beach-home": {
    scenes: [
      scene("beach-arrive", "beach-k-hello", "wave",
        "วันนี้ครูพามาชายหาด มีทรายและคลื่นซัดเบาๆ",
        "Today we visit the beach. There is sand and gentle surf."),
      scene("beach-hermit", "beach-k-hermit", "point",
        "นี่คือปูเสฉวน มันใช้เปลือกหอยว่างป้องกันตัว",
        "This is a hermit crab. It uses an empty seashell to protect itself."),
      scene("beach-hermit", "beach-k-hermit-real", "point",
        "ดูสิ นี่คือปูเสฉวนบกตัวจริง มันแบกเปลือกหอยไปด้วย",
        "Look! This is a real land hermit crab. It carries its shell along.", { photo: photo("beachHermit") }),
      scene("beach-hermit", "beach-k-shell", "point",
        "พอตัวโตขึ้น ปูเสฉวนต้องหาเปลือกหอยใบใหญ่ขึ้น",
        "As it grows, a hermit crab needs to find a larger shell."),
      scene("beach-gull", "beach-k-gull", "point",
        "ชายหาดหลายแห่งมีนกนางนวล มันใช้ปีกบินเหนือชายฝั่ง",
        "Many beaches have gulls. They use their wings to fly over the coast."),
      scene("beach-gull", "beach-k-gull-real", "point",
        "ดูสิ นี่คือนกนางนวลตัวจริง มีขนสีขาวและสีเทา",
        "Look! This is a real gull. It has white and grey feathers.", { photo: photo("beachGull") }),
      scene("beach-arrive", "beach-k-bye", "wave",
        "เราไม่จับสัตว์กลับบ้าน และไม่ทิ้งขยะบนหาดนะ",
        "Leave animals in their homes and do not leave litter on the beach."),
    ],
  },
  "beach-life": {
    scenes: [
      scene("beach-arrive", "beach-j-hello", "wave",
        "ชายหาดคือบริเวณที่แผ่นดินพบทะเล วันนี้เราจะรู้จักสัตว์จากชายฝั่งต่างแห่งกัน",
        "A beach is where land meets the sea. Today we meet animals from different coastlines."),
      scene("beach-hermit", "beach-j-shell", "point",
        "ส่วนท้องของปูเสฉวนนิ่ม มันจึงใช้เปลือกหอยว่างคลุมไว้ เปลือกนี้ไม่ได้งอกมาจากตัวปู",
        "A hermit crab has a soft abdomen, so it covers it with an empty snail shell. This shell does not grow from the crab's body."),
      scene("beach-hermit", "beach-j-hermit-real", "point",
        "นี่คือปูเสฉวนบกแคริบเบียนตัวจริง ปูเสฉวนบกอยู่ใกล้ชายฝั่งและต้องการทั้งบกและน้ำ",
        "This is a real Caribbean land hermit crab. Land hermit crabs live near coasts and need both land and water.", { photo: photo("beachHermit") }),
      scene("beach-hermit", "beach-j-grow", "point",
        "เมื่อโตขึ้น ปูเสฉวนจะหาเปลือกหอยที่ใหญ่กว่า เราจึงควรปล่อยเปลือกหอยไว้บนหาด",
        "As a hermit crab grows, it finds a larger shell. Leaving shells on the beach helps keep homes available."),
      scene("beach-gull", "beach-j-gull", "point",
        "นกนางนวลซิลเวอร์พบได้ตามชายฝั่งออสเตรเลีย และแหล่งน้ำในแผ่นดินด้วย",
        "Silver gulls live along Australian coasts and also around inland waters."),
      scene("beach-gull", "beach-j-gull-real", "point",
        "นี่คือนกนางนวลซิลเวอร์ตัวจริง สังเกตลำตัวสีขาว ปีกสีเทา และขาสีแดง",
        "This is a real silver gull. Notice its white body, grey wings and red legs.", { photo: photo("beachGull") }),
      scene("beach-gull", "beach-j-care", "point",
        "เราไม่ให้อาหารนกนางนวล ให้มันหาอาหารตามธรรมชาติ และเก็บขยะของเราให้เรียบร้อย",
        "Do not feed gulls. Let them find their natural food, and take your litter away."),
      scene("beach-arrive", "beach-j-bye", "wave",
        "ชายหาดเป็นบ้านของสัตว์หลายชนิด ดูโดยไม่รบกวน ไม่จับสัตว์ และปล่อยเปลือกหอยไว้ที่เดิม",
        "Beaches are home to many animals. Watch without disturbing them, do not collect animals, and leave shells where they are."),
    ],
  },
  // C-7 ข้อเท็จจริง: Cornell Lab (Mallard/lifehistory), WWT (ducks-found-in-uk-wetlands),
  // NHM (frogspawn-tadpoles-and-froglets; ways-to-help-frogs-and-toads),
  // Animal Diversity Web (Rana_temporaria), San Diego Zoo (animals/zebra; animals/giraffe; habitats/savanna).
  // URL และข้อเท็จจริงที่ใช้ทั้งหมด: output/C-7/report.md — ไม่มีตัวบทหรือข้อความศาสนาใหม่
  "pond-home": {
    scenes: [
      scene("pond-arrive", "pdk-hello", "wave",
        "วันนี้ครูพามาริมบึง ที่นี่มีน้ำจืดและต้นไม้ริมน้ำ",
        "Today we visit a pond. It has fresh water and plants along the edge."),
      scene("pond-duck", "pdk-duck", "point",
        "นี่คือเป็ด เป็ดใช้เท้าพุ้ยน้ำไปข้างหน้า",
        "This is a duck. It paddles forward with its feet."),
      scene("pond-duck", "pdk-duck-real", "point",
        "ดูสิ นี่คือเป็ดตัวจริง เป็ดชนิดนี้ชื่อมัลลาร์ด",
        "Look! These are real ducks. They are called mallards.", { photo: photo("mallard") }),
      scene("pond-duck", "pdk-food", "point",
        "เป็ดมัลลาร์ดกินเมล็ดพืช พืชน้ำ และสัตว์เล็กๆ",
        "Mallards eat seeds, water plants and small animals."),
      scene("pond-frog", "pdk-frog", "point",
        "นี่คือกบ ขาหลังแข็งแรงช่วยให้มันกระโดดได้",
        "This is a frog. Strong back legs help it jump."),
      scene("pond-frog", "pdk-frog-real", "point",
        "ดูสิ นี่คือกบตัวจริง กบชนิดนี้ชอบที่ชื้นและกินแมลง",
        "Look! This is a real common frog. It likes damp places and eats insects.", { photo: photo("frog") }),
      scene("pond-arrive", "pdk-bye", "wave",
        "บึงเป็นบ้านของสัตว์หลายชนิด เราดูอยู่ห่างๆ และไม่ทิ้งขยะนะ",
        "Ponds are home to many animals. Watch from a distance and leave no litter."),
    ],
  },
  "pond-life": {
    scenes: [
      scene("pond-arrive", "pdj-hello", "wave",
        "วันนี้เราสำรวจบึงน้ำจืด น้ำและพืชริมน้ำเป็นทั้งแหล่งอาหารและที่หลบภัยของสัตว์",
        "Today we explore a freshwater pond. Its water and waterside plants provide food and shelter."),
      scene("pond-duck", "pdj-feet", "point",
        "เป็ดมีพังผืดเชื่อมระหว่างนิ้วเท้า เมื่อกางเท้าพุ้ยน้ำ พังผืดช่วยดันน้ำให้ตัวเคลื่อนไป",
        "Ducks have webbing between their toes. Spreading their feet helps them push against the water and move."),
      scene("pond-duck", "pdj-duck-real", "point",
        "นี่คือเป็ดมัลลาร์ดตัวจริง ตัวผู้มีหัวสีเขียว เป็ดชนิดนี้พบได้ตามบึงและแหล่งน้ำหลายแบบ",
        "These are real mallards. Males have green heads. Mallards live on ponds and many other wetlands.", { photo: photo("mallard") }),
      scene("pond-duck", "pdj-food", "point",
        "มัลลาร์ดกินได้ทั้งพืชและสัตว์เล็กๆ เช่น เมล็ดพืช พืชน้ำ และตัวอ่อนแมลง อาหารเปลี่ยนไปตามฤดูกาล",
        "Mallards eat both plants and small animals, including seeds, water plants and insect larvae. Their diet changes with the seasons."),
      scene("pond-frog", "pdj-frog", "point",
        "กบสีน้ำตาลยุโรปชอบที่ชื้น มันมีขาหลังแข็งแรงสำหรับกระโดด และกินแมลงกับสัตว์ไม่มีกระดูกสันหลังเล็กๆ",
        "Common frogs like damp places. Strong back legs help them jump. They eat insects and other small invertebrates."),
      scene("pond-frog", "pdj-frog-real", "point",
        "นี่คือกบสีน้ำตาลยุโรปตัวจริง เราสังเกตมันโดยไม่จับ เพื่อไม่รบกวนสัตว์",
        "This is a real common frog. We observe without handling it, so we do not disturb it.", { photo: photo("frog") }),
      scene("pond-arrive", "pdj-grow", "point",
        "กบชนิดนี้วางไข่ในน้ำ ไข่ฟักเป็นลูกอ๊อดที่มีเหงือก ต่อมาขางอกและหางค่อยๆ หายไป จนเป็นกบเล็ก",
        "Common frogs lay eggs in water. Tadpoles hatch with gills, then grow legs and gradually absorb their tails to become froglets."),
      scene("pond-arrive", "pdj-bye", "wave",
        "เป็ดกับกบใช้บึงต่างกัน เราช่วยดูแลบ้านของมันได้ด้วยการไม่ทิ้งขยะ และไม่ย้ายไข่หรือลูกอ๊อดไปบึงอื่น",
        "Ducks and frogs use ponds in different ways. Help by leaving no litter and never moving eggs or tadpoles to another pond."),
    ],
  },
  "savanna-home": {
    scenes: [
      scene("savanna-arrive", "svk-hello", "wave",
        "วันนี้ครูพามาทุ่งหญ้าสะวันนา มีหญ้ากว้างใหญ่และต้นไม้ขึ้นห่างๆ กัน",
        "Today we visit the savanna. It has wide grasslands with scattered trees."),
      scene("savanna-zebra", "svk-zebra", "point",
        "นี่คือม้าลาย ตัวของมันมีลายสีดำกับสีขาว",
        "This is a zebra. Its body has black and white stripes."),
      scene("savanna-zebra", "svk-zebra-real", "point",
        "ดูสิ นี่คือม้าลายตัวจริง ม้าลายกินหญ้าเป็นอาหารหลัก",
        "Look! This is a real zebra. Zebras mostly eat grass.", { photo: photo("zebra") }),
      scene("savanna-giraffe", "svk-giraffe", "point",
        "นี่คือยีราฟ คอของมันยาวมาก",
        "This is a giraffe. It has a very long neck."),
      scene("savanna-giraffe", "svk-giraffe-real", "point",
        "ดูสิ นี่คือยีราฟตัวจริง มีลายสีน้ำตาลบนตัว",
        "Look! This is a real giraffe. It has brown patches on its body.", { photo: photo("giraffe") }),
      scene("savanna-giraffe", "svk-leaves", "point",
        "คอยาวช่วยให้ยีราฟเอื้อมกินใบไม้บนกิ่งสูงได้",
        "A long neck helps a giraffe reach leaves on high branches."),
      scene("savanna-arrive", "svk-bye", "wave",
        "ม้าลายกินหญ้า ยีราฟกินใบไม้ บ้านเดียวกันมีอาหารหลายแบบเลย",
        "Zebras eat grass. Giraffes eat leaves. One habitat has many kinds of food!"),
    ],
  },
  "savanna-life": {
    scenes: [
      scene("savanna-arrive", "svj-hello", "wave",
        "วันนี้เราสำรวจสะวันนาในแอฟริกา เป็นทุ่งหญ้าที่มีต้นไม้กระจายอยู่ และมีฤดูฝนสลับฤดูแล้ง",
        "Today we explore an African savanna: grassland with scattered trees and alternating wet and dry seasons."),
      scene("savanna-zebra", "svj-zebra", "point",
        "ม้าลายทุ่งราบเป็นสัตว์กินพืช มันกินหญ้าเป็นหลัก และใช้เวลาหลายชั่วโมงต่อวันเล็มหญ้า",
        "Plains zebras are herbivores. They mostly eat grass and spend many hours each day grazing."),
      scene("savanna-zebra", "svj-zebra-real", "point",
        "นี่คือม้าลายตัวจริงในมาไซมารา ประเทศเคนยา ม้าลายทุ่งราบอยู่รวมกันเป็นกลุ่มครอบครัว",
        "This is a real zebra in Kenya's Masai Mara. Plains zebras live in family groups.", { photo: photo("zebra") }),
      scene("savanna-zebra", "svj-water", "point",
        "เมื่อฤดูแล้งทำให้หญ้าลดลง ฝูงม้าลายจะเดินทางหาอาหารและแหล่งน้ำ",
        "When grass becomes scarce in the dry season, zebra herds travel to find food and water."),
      scene("savanna-giraffe", "svj-giraffe", "point",
        "ยีราฟมีคอยาวและขายาว จึงเอื้อมกินใบไม้บนกิ่งสูงที่สัตว์กินหญ้าหลายชนิดเอื้อมไม่ถึง",
        "A giraffe's long neck and legs help it reach high leaves that many grazing animals cannot reach."),
      scene("savanna-giraffe", "svj-giraffe-real", "point",
        "นี่คือยีราฟตัวจริงในเขตอนุรักษ์บันเดีย ประเทศเซเนกัล สังเกตคอและขาที่ยาวของมัน",
        "This is a real giraffe in Bandia Reserve, Senegal. Notice its long neck and legs.", { photo: photo("giraffe") }),
      scene("savanna-giraffe", "svj-food", "point",
        "ยีราฟกินใบไม้ เช่น ใบอะเคเซีย ส่วนม้าลายกินหญ้าเป็นหลัก สัตว์สองชนิดนี้จึงหาอาหารต่างระดับกัน",
        "Giraffes eat leaves, such as acacia leaves, while zebras mostly eat grass. They feed at different heights."),
      scene("savanna-arrive", "svj-bye", "wave",
        "ในสะวันนา หญ้า ต้นไม้ และแหล่งน้ำล้วนสำคัญ การดูแลถิ่นอาศัยช่วยให้สัตว์มีอาหารและน้ำต่อไป",
        "Grass, trees and water all matter in the savanna. Protecting habitats helps animals keep finding food and water."),
    ],
  },
  // C-12: ข้อเท็จจริงและ metadata ภาพถ่าย: output/C-12/report.md และ licenses/*.json
  // Ruminants: https://extension.sdstate.edu/ruminants-digestive-powerhouse
  // Sheep care: https://livestock.extension.wisc.edu/articles/introduction-to-raising-healthy-sheep-a3858-02/
  "farm-home": {
    scenes: [
      scene("farm-arrive", "fmk-hello", "wave",
        "วันนี้ครูพามาเที่ยวฟาร์ม ที่นี่มีหญ้า น้ำ และโรงนา",
        "Today we are visiting a farm. There is grass, water and a barn."),
      scene("farm-cow", "fmk-cow", "point",
        "นี่คือวัว วัวกินหญ้า และดื่มน้ำสะอาด",
        "This is a cow. Cows eat grass and drink clean water."),
      scene("farm-cow", "fmk-cow-real", "point",
        "ดูสิ นี่คือวัวตัวจริง ตัวนี้มีขนสีน้ำตาล",
        "Look! This is a real cow. This one has brown hair.", { photo: photo("farmCow") }),
      scene("farm-sheep", "fmk-sheep", "point",
        "นี่คือแกะ แกะกินหญ้าเหมือนกัน และชอบอยู่รวมกันเป็นฝูง",
        "This is a sheep. Sheep eat grass too and like to stay together in a flock."),
      scene("farm-sheep", "fmk-sheep-real", "point",
        "ดูสิ นี่คือแกะตัวจริง หลายตัวอยู่ด้วยกันบนเนินหญ้า",
        "Look! These are real sheep together on a grassy hill.", { photo: photo("farmSheep") }),
      scene("farm-arrive", "fmk-care", "point",
        "สัตว์ในฟาร์มต้องมีน้ำสะอาด อาหาร และที่หลบแดดฝน",
        "Farm animals need clean water, food and shelter from sun and rain."),
      scene("farm-arrive", "fmk-bye", "wave",
        "วันนี้เรารู้จักวัวกับแกะแล้ว ไปฟาร์มกับผู้ใหญ่ แล้วดูสัตว์เงียบๆ นะ",
        "Today we met cows and sheep. Visit a farm with an adult and watch the animals quietly."),
    ],
  },
  "farm-life": {
    scenes: [
      scene("farm-arrive", "fmj-hello", "wave",
        "วันนี้เราสำรวจฟาร์มกัน ฟาร์มเป็นที่เลี้ยงสัตว์ ซึ่งต้องได้รับอาหาร น้ำ และการดูแล",
        "Today we explore a farm, where animals are raised and need food, water and care."),
      scene("farm-cow", "fmj-cow", "point",
        "วัวเป็นสัตว์เคี้ยวเอื้อง มันนำอาหารที่กลืนไปแล้วกลับมาเคี้ยวอีกครั้ง",
        "Cattle are ruminants. They bring swallowed food back up to chew it again."),
      scene("farm-cow", "fmj-cow-real", "point",
        "นี่คือวัวตัวจริง วัวกินพืช เช่น หญ้าและหญ้าแห้ง",
        "This is a real cow. Cattle eat plants such as grass and hay.", { photo: photo("farmCow") }),
      scene("farm-cow", "fmj-digest", "point",
        "วัวมีกระเพาะหนึ่งใบที่แบ่งเป็นสี่ส่วน จุลินทรีย์ในกระเพาะช่วยย่อยเส้นใยจากพืช",
        "Cattle have one stomach with four compartments. Microbes in the stomach help break down plant fibre."),
      scene("farm-sheep", "fmj-sheep", "point",
        "แกะเป็นสัตว์เคี้ยวเอื้องเช่นกัน มันกินหญ้าและพืชชนิดอื่น และอยู่รวมกันเป็นฝูง",
        "Sheep are ruminants too. They eat grass and other plants and live in flocks."),
      scene("farm-sheep", "fmj-sheep-real", "point",
        "นี่คือแกะตัวจริง ฝูงนี้กำลังกินหญ้าและพักบนเนินเขา",
        "These are real sheep. This flock is grazing and resting on a hillside.", { photo: photo("farmSheep") }),
      scene("farm-arrive", "fmj-care", "point",
        "แม้มีทุ่งหญ้า สัตว์ก็ยังต้องมีน้ำสะอาดและที่หลบอากาศร้อนหรือฝน ผู้เลี้ยงต้องดูแลสุขภาพของมันด้วย",
        "Even with a pasture, animals need clean water and shelter from heat or rain. Their carers must look after their health too."),
      scene("farm-arrive", "fmj-bye", "wave",
        "การเคี้ยวเอื้องช่วยให้วัวและแกะใช้ประโยชน์จากพืช ไปเยี่ยมฟาร์มกับผู้ใหญ่ และไม่ให้อาหารสัตว์เองนะ",
        "Rumination helps cattle and sheep use plant food. Visit farms with an adult and do not feed animals on your own."),
    ],
  },
  // Butterfly stages: https://www.floridamuseum.ufl.edu/discover-butterflies/faq/
  // Pollination: https://www.nrcs.usda.gov/conservation-basics/animals/insects-pollinators
  "garden-home": {
    scenes: [
      scene("garden-arrive", "fgk-hello", "wave",
        "วันนี้ครูพามาสวนดอกไม้ ดอกไม้เป็นอาหารของแมลงหลายชนิด",
        "Today we visit a flower garden. Flowers provide food for many insects."),
      scene("garden-butterfly", "fgk-butterfly", "point",
        "นี่คือผีเสื้อ ผีเสื้อหลายชนิดกินน้ำหวานจากดอกไม้",
        "This is a butterfly. Many butterflies drink nectar from flowers."),
      scene("garden-butterfly", "fgk-butterfly-real", "point",
        "ดูสิ นี่คือผีเสื้อตัวจริง เกาะอยู่บนดอกไม้",
        "Look! This is a real butterfly resting on flowers.", { photo: photo("gardenButterfly") }),
      scene("garden-growth", "fgk-growth", "point",
        "ผีเสื้อเริ่มจากไข่ เป็นหนอน แล้วเป็นดักแด้ ก่อนออกมาเป็นผีเสื้อ",
        "A butterfly starts as an egg, becomes a caterpillar, then a chrysalis, and emerges as a butterfly."),
      scene("garden-bee", "fgk-bee", "point",
        "นี่คือผึ้ง ผึ้งไปหาน้ำหวานและเกสรที่ดอกไม้",
        "This is a bee. Bees visit flowers for nectar and pollen."),
      scene("garden-bee", "fgk-bee-real", "point",
        "ดูสิ นี่คือผึ้งตัวจริง มีเกสรสีเหลืองติดอยู่ที่ขาหลัง",
        "Look! This is a real honey bee with yellow pollen on its back legs.", { photo: photo("gardenBee") }),
      scene("garden-arrive", "fgk-bye", "wave",
        "ผึ้งช่วยพาเกสรไปอีกดอก ทำให้พืชหลายชนิดเกิดเมล็ด เราดูแมลงห่างๆ ไม่จับนะ",
        "Bees carry pollen to other flowers, helping many plants make seeds. Watch insects from a distance without touching."),
    ],
  },
  "garden-life": {
    scenes: [
      scene("garden-arrive", "fgj-hello", "wave",
        "มาสำรวจสวนดอกไม้กัน น้ำหวานและละอองเรณูในดอกไม้เป็นอาหารของแมลงหลายชนิด",
        "Let's explore a flower garden. Nectar and pollen in flowers feed many kinds of insects."),
      scene("garden-butterfly", "fgj-butterfly", "point",
        "ผีเสื้อโตเต็มวัยหลายชนิดกินน้ำหวานจากดอกไม้ แต่หนอนผีเสื้อส่วนใหญ่กินใบพืช",
        "Many adult butterflies drink flower nectar, while most caterpillars eat plant leaves."),
      scene("garden-butterfly", "fgj-butterfly-real", "point",
        "นี่คือผีเสื้อตัวจริง มันมีปีกสองคู่ และหนวดหนึ่งคู่",
        "This is a real butterfly. It has two pairs of wings and one pair of antennae.", { photo: photo("gardenButterfly") }),
      scene("garden-growth", "fgj-growth", "point",
        "ผีเสื้อเติบโตผ่านสี่ระยะ คือ ไข่ หนอน ดักแด้ และตัวเต็มวัย ระยะดักแด้ร่างกายเปลี่ยนแปลง ก่อนออกมาเป็นผีเสื้อ",
        "Butterflies grow through four stages: egg, caterpillar, chrysalis and adult. The body changes inside the chrysalis before the butterfly emerges."),
      scene("garden-bee", "fgj-bee", "point",
        "ผึ้งเก็บน้ำหวานและละอองเรณูจากดอกไม้ ระหว่างนั้นละอองเรณูบางส่วนติดตามตัวมัน",
        "Bees collect nectar and pollen from flowers. Some pollen sticks to their bodies as they visit."),
      scene("garden-bee", "fgj-bee-real", "point",
        "นี่คือผึ้งตัวจริง ก้อนสีเหลืองที่ขาหลังคือละอองเรณูที่มันรวบรวมไว้",
        "This is a real honey bee. The yellow loads on its hind legs are pollen it has collected.", { photo: photo("gardenBee") }),
      scene("garden-bee", "fgj-pollen", "point",
        "เมื่อผึ้งไปอีกดอก ละอองเรณูอาจติดที่ยอดเกสรตัวเมีย การถ่ายละอองเรณูนี้ช่วยให้พืชหลายชนิดสร้างเมล็ด",
        "When a bee visits another flower, pollen may reach its stigma. This transfer of pollen helps many plants produce seeds."),
      scene("garden-arrive", "fgj-bye", "wave",
        "สวนที่มีทั้งดอกไม้และพืชอาหารของหนอนช่วยผีเสื้อได้หลายช่วงวัย เราสังเกตแมลงห่างๆ และไม่รบกวนรังผึ้งนะ",
        "Gardens with flowers and caterpillar food plants support butterflies at different stages. Observe insects from a distance and leave bee nests alone."),
    ],
  },
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
        { evidence: ["quran-88-17"], word: { ar: "أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ", th: "ซูเราะฮ์อัลฆอชิยะฮ์", compact: true } }),
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
        { evidence: ["quran-6-38"], word: { ar: "وَمَا مِن دَابَّةٍ فِي الْأَرْضِ وَلَا طَائِرٍ يَطِيرُ بِجَنَاحَيْهِ إِلَّا أُمَمٌ أَمْثَالُكُم", th: "ซูเราะฮ์อัลอันอาม", compact: true } }),
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
        { evidence: ["quran-24-45"], word: { ar: "وَاللَّهُ خَلَقَ كُلَّ دَابَّةٍ مِّن مَّاءٍ", th: "ซูเราะฮ์อันนูร", compact: true } }),
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
  "mountain-home": "/explore/mountain-card.webp",
  "mountain-life": "/explore/mountain-card.webp",
  "beach-home": "/explore/beach-card.webp",
  "beach-life": "/explore/beach-card.webp",
  "pond-home": "/explore/card-pond.webp",
  "pond-life": "/explore/card-pond.webp",
  "savanna-home": "/explore/card-savanna.webp",
  "savanna-life": "/explore/card-savanna.webp",
  "farm-home": "/explore/card-farm.webp",
  "farm-life": "/explore/card-farm.webp",
  "garden-home": "/explore/card-garden.webp",
  "garden-life": "/explore/card-garden.webp",
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

/* ---------- การ์ตูนเต็มเรื่อง (เจ้าของโปรเจกต์สั่ง 13 พ.ย. 2026: "ให้เป็นการ์ตูนจริงๆ เหมือนเกาะศีลธรรม") ----------
  บทที่มีในนี้เปิดเป็น FilmLesson แทนแบบภาพนิ่ง (CARTOONS ยังเก็บไว้เป็นทางสำรอง)
  ต้นทาง: output/car-desert/ (บท script.md ชิ้นส่วนสัตว์ เสียง) + output/car-hf/desert/ (film.mjs)
  สัตว์ใบหน้าว่าง (ข้อ 1.1) · ภาพถ่ายสัตว์จริงไม่ฝังในวิดีโอ — วิดีโอหยุดแล้วแสดงเป็น HTML พร้อม alt และเครดิต
  ข้อเท็จจริงเท่ากับบท desert-home เดิมข้างบน · ไฟล์อยู่ใต้ explore/film ทั้งบน R2 และ public/ */
const FILM_SUBHANALLAH: FilmWord = { ar: "سُبْحَانَ اللهِ", th: "ซุบฮานัลลอฮ์" };

export const FILMS: Record<string, Film> = {
  "desert-home": {
    name: "desert",
    dir: "explore/film",
    duration: 100.6,
    // หยุดหลังนูรีพูด "นี่คืออูฐตัวจริง" / "นี่คือจิ้งจอกเฟนเนคตัวจริง" -> แสดงภาพถ่าย (นับถอยหลังแล้วเล่นต่อเอง) และหลังนูรีชวนพูด "ซุบฮานัลลอฮ์"
    // ค่าเวลามาจาก output/car-hf/desert/turns.json (สร้างโดย film.mjs)
    turns: [
      { at: 46.52, resumeAt: 47.07, photo: photo("camel") },
      { at: 77.95, resumeAt: 78.5, photo: photo("fennec") },
      { at: 96.7, resumeAt: 98.5, word: FILM_SUBHANALLAH },
    ],
    words: [FILM_SUBHANALLAH],
    captions: ["th"],
    label: {
      th: "การ์ตูนไปเที่ยวทะเลทราย: ครูนูรี ฮาดี และซาฟี ไปดูอูฐเดินบนทรายและดื่มน้ำที่โอเอซิส แล้วเจอจิ้งจอกเฟนเนคหูใหญ่ในโพรง",
      en: "Cartoon: Nuri, Hadi and Safi visit the desert, watch a camel walk on sand and drink at an oasis, then meet a big-eared fennec fox in its burrow.",
    },
  },
  /* ครูนูรีกับแสงอุ่นในสวน (sun-v5, 14 พ.ย. 2026) ต้นทาง output/car-sun-v5/ (script.md, story.mjs) + output/car-hf/sun-v5/ (film.mjs)
    ฐานเนื้อหา (ตรวจ Shamela 14 พ.ย. 2026 — ไม่ยกอายะฮ์ในวิดีโอ):
    อันนะบะอ์ 78:13 อัสสะอ์ดีย์ https://shamela.ws/book/42/2063 · อัลวากิอะฮ์ 56:63–64 https://shamela.ws/book/42/1909
    อันนะห์ลุ 16:53 https://shamela.ws/book/42/957 · 16:114 https://shamela.ws/book/42/988
    จุดหยุดจาก output/car-hf/sun-v5/turns.json */
  sun: {
    name: "sun",
    dir: "explore/film",
    duration: 140.47,
    turns: [{ at: 134.33, resumeAt: 138.33, word: FILM_SUBHANALLAH }],
    words: [FILM_SUBHANALLAH],
    captions: ["th"],
    label: {
      th: "การ์ตูนครูนูรีกับแสงอุ่นในสวน: ครูนูรีกับฮาดีสำรวจแสงสว่างและความอบอุ่นจากดวงอาทิตย์ที่ช่วยให้ต้นไม้เติบโต และห้ามมองดวงอาทิตย์ตรงๆ",
      en: "Cartoon: Nuri and Hadi explore the light and warmth of the sun that help plants grow, and learn never to look straight at the sun.",
    },
  },
};
