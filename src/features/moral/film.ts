import type { Text } from "@/i18n/config";
import type { ScenePhoto } from "./cartoon";

/*
  การ์ตูนเต็มเรื่องของเกาะมารยาท (เจ้าของโปรเจกต์สั่ง 12 พ.ย. 2026: เลิกแบบภาพนิ่ง + เสียงบรรยาย เปลี่ยนเป็นการ์ตูนเด็กสอนศีลธรรม)
  บทเรียนที่มีการ์ตูนในไฟล์นี้จะเปิดเป็น FilmLesson แทน CartoonLesson เดิม บทที่ยังไม่มีใช้แบบเดิมไปก่อน

  ทำด้วย: ชิ้นส่วนตัวละคร (Codex ตัดจากภาพที่อนุมัติแล้ว) + ระบบกระดูก DOM/GSAP + HyperFrames
  ไฟล์ต้นทางอยู่ที่ output/car-salam2/ (บท script.md, ที่มาของตัวบทอยู่ในนั้น) และ output/car-hf/salam2/ (film.mjs)
  ตัวละครเป็นหุ่นยนต์และเด็กใบหน้าว่าง ไม่มีดนตรี มีแต่เสียงพูดและเสียงประกอบ (AGENTS 1.2, 1.3)

  ไฟล์ของแต่ละเรื่อง: <ชื่อ>-720.mp4 (มือถือ) <ชื่อ>-1080.mp4 (จอกว้าง) <ชื่อ>-poster.webp และคำบรรยาย <ชื่อ>.<ภาษา>.vtt

  วิดีโอ (.mp4) อยู่ที่ Cloudflare R2 bucket "littleummah-media" ผ่านโดเมน media.littleummahworld.com (เจ้าของตั้ง 12 พ.ย. 2026)
  ค่าส่งข้อมูลฟรี ไม่กินโควต้า Vercel · อัปโหลด: npx wrangler r2 object put littleummah-media/moral/film/<ไฟล์> --file <ไฟล์>
    --content-type video/mp4 --cache-control "public, max-age=604800" --remote
  (แก้วิดีโอเดิม = อัปโหลดทับชื่อเดิม cache ที่เครื่องผู้ใช้หมดใน 7 วัน ถ้าต้องเห็นทันทีให้ตั้งชื่อไฟล์ใหม่)
  ภาพปกและคำบรรยายไฟล์เล็ก อยู่ใน public/moral/film/ บน Vercel — <track> ข้ามโดเมนต้องตั้ง CORS จึงไม่ย้าย
  เปลี่ยนที่เก็บวิดีโอได้ที่ NEXT_PUBLIC_FILM_VIDEO_BASE จุดเดียว
*/
/* 16 พ.ย. 2026: ลดเสียงเอฟเฟกต์/บรรยากาศทุกเรื่อง (เจ้าของ: ในมือถือดังมาก) — ภาพเดิม เสียงผสมใหม่ จึงขึ้นเลขรุ่นชื่อไฟล์ใหม่ทุกเรื่อง
   ที่มีเอฟเฟกต์ (กัน cache 7 วัน) · สูตรและผลวัด: output/remix-1116/ · docs/films/2026-11-16-audio-remix.txt */
export const FILM_BASE = "/moral/film";
export const FILM_VIDEO_BASE = process.env.NEXT_PUBLIC_FILM_VIDEO_BASE ?? "https://media.littleummahworld.com/moral/film";

/* เกาะอื่นเก็บไฟล์ในโฟลเดอร์ของเกาะนั้น (เช่น explore/film) ทั้งบน R2 และ public/ — โครงเดียวกับ moral/film */
export function filmPaths(film: Film) {
  const dir = film.dir ?? "moral/film";
  return {
    base: `/${dir}/${film.name}`,
    video: `${FILM_VIDEO_BASE.replace(/\/moral\/film\/?$/, "")}/${dir}/${film.name}`,
  };
}

export type FilmWord = {
  ar: string;
  th: string;
  prompt?: Text;
  /** Override repeat-after-me wording for an open question. */
  instruction?: Text;
};

export type Film = {
  /** ชื่อไฟล์ (ไม่มีนามสกุล) */
  name: string;
  /** โฟลเดอร์ทั้งบน R2 และใน public/ (ค่าเริ่มต้น "moral/film") */
  dir?: string;
  /** ความยาว (วินาที) — ใช้แสดงแถบความคืบหน้าก่อนโหลด metadata */
  duration: number;
  /** จุดหยุด: วิดีโอหยุดที่ at แล้วเด็กกดเล่นต่อ -> ข้ามไปที่ resumeAt
      word = ตาเด็กพูดตาม (ป้ายคำ + "หนูพูดแล้ว") · photo = ภาพถ่ายสัตว์จริง (HTML มี alt และเครดิต ไม่ฝังในวิดีโอ — AGENTS 1.1) */
  turns: ({ at: number; resumeAt: number } & ({ word: FilmWord; photo?: never } | { photo: ScenePhoto; word?: never }))[];
  /** ป้ายคำบนการ์ดสรุปตอนจบ */
  words: FilmWord[];
  /** ภาษาที่มีคำบรรยาย */
  captions: ("th" | "en")[];
  /** Omit for the usual 1080p/720p pair; native 720p films need no upscale. */
  resolutions?: (720 | 1080)[];
  /** Visible top-aligned frame after hiding a baked-in caption strip; VTT stays readable below. */
  captionCrop?: { width: number; height: number };
  /** คำอธิบายวิดีโอสำหรับ screen reader */
  label: Text;
};

const SALAM: FilmWord = { ar: "السَّلَامُ عَلَيْكُمْ", th: "อัสสะลามุอะลัยกุม" };
const REPLY: FilmWord = { ar: "وَعَلَيْكُمُ السَّلَامُ", th: "วะอะลัยกุมุสสะลาม" };

export const FILMS: Record<string, Film> = {
  // Fictional robots illustrating the existing sharing lesson; no new religious quotation.
  // Source: output/car-share/; script and production record: docs/films/share-v1-production.txt.
  share: {
    name: "share-v2",
    duration: 204.821,
    turns: [{ at: 194.742, resumeAt: 198.742, word: { ar: "", th: "มาเล่นด้วยกันไหม", prompt: { th: "มาเล่นด้วยกันไหม", en: "Would you like to play together?" } } }],
    words: [],
    captions: ["th"],
    label: {
      th: "รถสองคัน เล่นด้วยกัน — ฮาดีแบ่งรถของเล่นให้ซาบิร ซาฟีช่วยขนบล็อก เพื่อน ๆ เล่นอย่างเบามือและคืนของเมื่อเล่นเสร็จ ครูนูรีชวนเด็กฝึกขอและแบ่งกันเล่น",
      en: "Two trucks, one shared game — Hadi lends Sabir a toy truck, Safi shares blocks, and the friends play gently and return their toys. Nuri invites children to practise asking and sharing.",
    },
  },
  // BEGIN dua-sleep full cartoon — "ฟาฮีมเข้านอน" (Claude, 16 พ.ย. 2026) บน scripts/film-kit
  // บุคอรี 6320 ปัดที่นอน https://shamela.ws/book/1681/9477 · บุคอรี 247 นอนตะแคงขวา https://shamela.ws/book/1681/430
  // บุคอรี 6324 «بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا» https://shamela.ws/book/1681/9484 (ตรวจกับ Shamela 16 พ.ย. 2026)
  // เรื่องสมมุติของหุ่นยนต์ ต้นทาง/บท/ที่มา: output/car-sleep/ (story.mjs, film.js) · เสียงดุอาอ์ของครูนูรีใช้คลิปเดิมที่อนุมัติแล้ว (C-8)
  "dua-sleep": {
    name: "sleep-v2",
    duration: 150.988,
    turns: [{ at: 141.869, resumeAt: 145.869, word: { ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", th: "บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา" } }],
    words: [{ ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", th: "บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา" }],
    captions: ["th"],
    label: {
      th: "การ์ตูนฟาฮีมเข้านอน — ฟาฮีมอ่านหนังสือจนง่วง เก็บหนังสือเข้าชั้น ปัดที่นอน นอนตะแคงขวา แล้วอ่านดุอาอ์ก่อนนอนกับครูนูรี",
      en: "Faheem goes to bed — after reading, Faheem puts the book away, dusts the bed, lies on the right side and says the bedtime dua with Nuri.",
    },
  },
  // END dua-sleep full cartoon
  // BEGIN truth full cartoon — "ฮาดีพูดความจริง" (Claude, 16 พ.ย. 2026)
  // บุคอรี 6094 https://shamela.ws/book/1681/9128 / มุสลิม 2607 https://shamela.ws/book/1727/6572 «إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ»
  // อัลหะดีด 57:4 ท่อนท้าย ความหมายไทยฉบับศูนย์กษัตริย์ฟะฮัด (quran.com 51) — ไม่อ่านตัวอาหรับ (AGENTS 1.6)
  // เรื่องสมมุติของหุ่นยนต์ บท/ที่มา/ลำดับเวลา: output/car-truth/story.mjs
  // ภาพฉบับแก้ + เสียงเดิม: output/car-truth-v2/ · รายงาน: docs/films/truth-v2-production.txt (AGENTS 3.1)
  truth: {
    name: "truth-v3",
    duration: 236.233,
    turns: [{ at: 227.394, resumeAt: 231.394, word: { ar: "", th: "เราจะพูดความจริงเสมอ", prompt: { th: "เราจะพูดความจริงเสมอ", en: "I will always tell the truth." } } }],
    words: [],
    captions: ["th"],
    label: {
      th: "การ์ตูนพูดความจริง — ฮาดีเผลอชนโต๊ะจนกังหันลมของซาบิรหักตอนไม่มีใครเห็น แต่เลือกบอกความจริง ขอโทษ และช่วยซ่อม ครูนูรีสอนว่าอัลลอฮ์ทรงเห็นทุกสิ่งที่เราทำ",
      en: "Hadi accidentally breaks Sabir's wind spinner when nobody is looking, chooses to tell the truth, says sorry and helps fix it. Nuri teaches that Allah sees everything we do.",
    },
  },
  // END truth full cartoon
  // Sahih Muslim 1009: «وتميط الأذى عن الطريق صدقة».
  // Verified through Shamela MCP: https://shamela.ws/book/711/2767
  // Fictional robot example; the hadith meaning is separate from the practical advice.
  // Script and provenance: docs/films/clear-path-script.txt; docs/assets/clear-path-media.json.
  // ทางเดินของทุกคน v2 (17 พ.ย. 2026): ทำใหม่บน scripts/film-kit + directing.js (ต้นแบบพูดความจริง) ตามที่เจ้าของสั่ง —
  // เด็ก ๆ เล่นของเล่นกันก่อน ครูนูรีเกือบชนรถของเล่นกลางทาง แล้วช่วยกันเก็บลงกล่อง · ไม่มีตัวหนังสือในภาพ (เลิก captionCrop ตาม AGENTS 3.1)
  // ตัวบท มุสลิม 1009 https://shamela.ws/book/711/2767 · ต้นทาง output/car-clear2/ · บันทึก docs/films/clear-path-v2-production.txt
  "tidy-toys": {
    name: "clear-path-v2",
    duration: 171.19,
    turns: [{ at: 148.242, resumeAt: 152.842, word: {
      ar: "",
      th: "รถของเล่นอยู่กลางทางเดิน หนูจะทำอย่างไรดี?",
      prompt: { th: "รถของเล่นอยู่กลางทางเดิน หนูจะทำอย่างไรดี?", en: "Your toy car is in the middle of the path. What will you do?" },
      instruction: { th: "ลองตอบครูออกเสียง แล้วกดปุ่มเมื่อตอบแล้ว", en: "Answer Nuri aloud, then press the button." },
    } }],
    words: [],
    captions: ["th"],
    label: {
      th: "ทางเดินของทุกคน — ซาบิร ซาฟี และฮาดีเล่นของเล่นกันอยู่ ครูนูรีเกือบชนรถของเล่นกลางทาง ทุกคนจึงช่วยกันเก็บลงกล่องและเข็นกล่องพ้นทาง พร้อมหะดีษเรื่องนำสิ่งที่เป็นอันตรายออกจากทาง",
      en: "Keeping our path clear — Sabir, Safi and Hadi are playing; Nuri nearly bumps a toy car on the path, so everyone puts the toys in a box and moves it aside, then learns the hadith about removing harm from the path.",
    },
  },
  // BEGIN wait-turn full cartoon
  // General manners; no new religious quotation.
  // Story: docs/films/wait-turn-park-v2-script.md. Nuri and Faheem speak; children have blank faces.
  "wait-turn": {
    "name": "wait-turn-park-v2",
    "duration": 241.484,
    "turns": [
      {
        "at": 231.805,
        "resumeAt": 235.805,
        "word": {
          "ar": "",
          "th": "ต่อท้ายแถว รอตาเรา ผลัดกันเล่น",
          "prompt": {
            "th": "ต่อท้ายแถว รอตาเรา ผลัดกันเล่น",
            "en": "Join the back of the line, wait your turn, and take turns playing."
          }
        }
      }
    ],
    "words": [],
    "captions": [
      "th"
    ],
    "label": {
      "th": "รู้จักรอคิว — ครูนูรีและฟาฮีมชวนเรียนรู้การต่อท้ายแถว รออย่างใจเย็น และผลัดกันเล่น ผ่านเด็กหญิงสวมฮิญาบกับเพื่อนในสวน",
      "en": "Learning to wait — Nuri and Faheem explore joining the back of the line, waiting patiently, and taking turns through a girl in a hijab and her friends at the park."
    }
  },
  // END wait-turn full cartoon

  // BEGIN help-friend full cartoon
  // General manners adapted from the existing lesson; no new religious quotation.
  // Storyboard: docs/films/help-friend-script.md. Cast: ครูนูรี, ฟาฮีม, ซาฟี.
  "help-friend": {
    "name": "help-friend-library-v5",
    "duration": 137.44,
    "turns": [
      {
        "at": 122.261,
        "resumeAt": 126.361,
        "word": {
          "ar": "",
          "th": "ให้เราช่วยไหม",
          "prompt": {
            "th": "ให้เราช่วยไหม",
            "en": "Would you like some help?"
          }
        }
      }
    ],
    "words": [],
    "captions": [
      "th"
    ],
    "label": {
      "th": "ซาฟีถามก่อนช่วยฟาฮีมเก็บหนังสือ ทั้งสองเว้นทางให้ครูนูรียกกล่องหนักอ้อมไปหลังตู้แล้ววางบนตู้หนังสือ",
      "en": "Safi asks before helping Faheem pick up the books. They clear a path for Nuri to carry the heavy box around the bookcase and set it on top."
    },
  },
  // END help-friend full cartoon

  // BEGIN say-sorry full cartoon
  // General manners adapted from the existing lesson; no new religious quotation.
  // Storyboard: docs/films/say-sorry-script.md. Cast: ครูนูรี, ซาบิร, รอสซาม.
  "say-sorry": {
    "name": "say-sorry-v2",
    "duration": 132.02,
    "turns": [
      {
        "at": 111.882,
        "resumeAt": 115.982,
        "word": {
          "ar": "",
          "th": "ขอโทษนะ เราช่วยเก็บให้",
          "prompt": {
            "th": "ขอโทษนะ เราช่วยเก็บให้",
            "en": "I’m sorry. I’ll help pick it up."
          }
        }
      }
    ],
    "words": [],
    "captions": [
      "th"
    ],
    "label": {
      "th": "การ์ตูนขอโทษเมื่อทำผิด — หอคอยที่ช่วยกันต่อ: รอสซามเผลอชนหอคอยของซาบิร จึงขอโทษและช่วยต่อใหม่",
      "en": "Rassam accidentally knocks over Sabir’s tower, says sorry and helps rebuild it."
    },
  },
  // END say-sorry full cartoon

  // BEGIN generated meet-friends film
  // Storyboard: docs/films/meet-friends-script.md. General manners; no new quoted religious text.
  // Salam basis: Muslim 54, https://shamela.ws/book/1727/158 (checked 14 Nov 2026).
  "meet-friends": {
    "name": "meet-friends-v2",
    "duration": 152.575,
    "turns": [
      {
        "at": 123.546,
        "resumeAt": 127.546,
        "word": {
          "ar": "السَّلَامُ عَلَيْكُمْ",
          "th": "อัสสะลามุอะลัยกุม"
        }
      },
      {
        "at": 136.694,
        "resumeAt": 140.694,
        "word": {
          "ar": "",
          "th": "เราชื่อ… ยินดีที่ได้รู้จัก"
        }
      }
    ],
    "words": [
      {
        "ar": "السَّلَامُ عَلَيْكُمْ",
        "th": "อัสสะลามุอะลัยกุม"
      }
    ],
    "captions": [
      "th"
    ],
    "label": {
      "th": "การ์ตูนรู้จักเพื่อนใหม่: ครูนูรีและเพื่อนห้าตัวช่วยกันทำมุมอ่านหนังสือ ฝึกทักสลาม บอกชื่อ และถามชื่ออย่างสุภาพ",
      "en": "Meet new friends: Nuri and five robot friends build a reading corner and practise salam, introductions and polite questions."
    },
  },
  // END generated meet-friends film
  /*
    สลามรับสลาม — ที่มา (ตรวจ Shamela 12 พ.ย. 2026):
    บุคอรี 6233 «يُسَلِّمُ الرَّاكِبُ عَلَى الْمَاشِي، وَالْمَاشِي عَلَى الْقَاعِدِ، وَالْقَلِيلُ عَلَى الْكَثِيرِ» https://shamela.ws/book/1681/9333
    มุสลิม 54 «أَفْشُوا السَّلَامَ بَيْنَكُمْ» https://shamela.ws/book/1727/158
    อบูดาวูด 5208 / ติรมิซีย์ 2706 (อัลบานีย์: حسن صحيح) สลามตอนมาถึงและตอนจากไป https://shamela.ws/book/1726/7109
    อันนิซาอ์ 4:86 ความหมายไทยฉบับศูนย์กษัตริย์ฟะฮัด (quran.com 51) — ไม่อ่านตัวอาหรับ (AGENTS 1.6)
  */
  salam: {
    // salam-v2 (14 พ.ย. 2026): เปลี่ยนเสียงเคลื่อนที่ของนูรีตามที่เจ้าของสั่ง ภาพ/บท/เวลาเดิม · ต้นทาง output/car-hf/salam-audio-v2/
    // ตั้งชื่อไฟล์ใหม่เพื่อไม่ให้ cache 7 วันของไฟล์ salam เดิมค้าง
    name: "salam-v3",
    duration: 92.3,
    // นูรีชวนเด็กทักสลาม (คลิปจบ 85.6 วิ) หยุดตอนเอามือป้องหูฟัง แล้วข้ามไปก่อนนูรีตอบสลาม (89.1 วิ)
    turns: [{ at: 86.5, resumeAt: 88.4, word: SALAM }],
    words: [SALAM, REPLY],
    captions: ["th"],
    label: {
      th: "การ์ตูนสลามรับสลาม: ครูนูรีมาเจอเพื่อนๆ ในสวน ให้สลาม แล้วเพื่อนๆ ตอบสลาม",
      en: "Cartoon: Nuri meets friends in the park, greets them with salam, and they answer.",
    },
  },
};
