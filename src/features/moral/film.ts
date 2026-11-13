import type { Text } from "@/i18n/config";
import type { ScenePhoto } from "./cartoon";

/*
  การ์ตูนเต็มเรื่องของเกาะมารยาท (เจ้าของโปรเจกต์สั่ง 12 พ.ย. 2026: เลิกแบบภาพนิ่ง + เสียงบรรยาย เปลี่ยนเป็นการ์ตูนเด็กสอนศีลธรรม)
  บทเรียนที่มีการ์ตูนในไฟล์นี้จะเปิดเป็น FilmLesson แทน CartoonLesson เดิม บทที่ยังไม่มีใช้แบบเดิมไปก่อน

  ทำด้วย: ชิ้นส่วนตัวละคร (Codex ตัดจากภาพที่อนุมัติแล้ว) + ระบบกระดูก DOM/GSAP + HyperFrames
  ไฟล์ต้นทางอยู่ที่ output/car-salam2/ (บท script.md, ที่มาของตัวบทอยู่ในนั้น) และ output/car-hf/salam2/ (film.mjs)
  ตัวละครเป็นหุ่นยนต์ล้วน ไม่มีดนตรี มีแต่เสียงพูดและเสียงประกอบ (AGENTS 1.2, 1.3)

  ไฟล์ของแต่ละเรื่อง: <ชื่อ>-720.mp4 (มือถือ) <ชื่อ>-1080.mp4 (จอกว้าง) <ชื่อ>-poster.webp และคำบรรยาย <ชื่อ>.<ภาษา>.vtt

  วิดีโอ (.mp4) อยู่ที่ Cloudflare R2 bucket "littleummah-media" ผ่านโดเมน media.littleummahworld.com (เจ้าของตั้ง 12 พ.ย. 2026)
  ค่าส่งข้อมูลฟรี ไม่กินโควต้า Vercel · อัปโหลด: npx wrangler r2 object put littleummah-media/moral/film/<ไฟล์> --file <ไฟล์>
    --content-type video/mp4 --cache-control "public, max-age=604800" --remote
  (แก้วิดีโอเดิม = อัปโหลดทับชื่อเดิม cache ที่เครื่องผู้ใช้หมดใน 7 วัน ถ้าต้องเห็นทันทีให้ตั้งชื่อไฟล์ใหม่)
  ภาพปกและคำบรรยายไฟล์เล็ก อยู่ใน public/moral/film/ บน Vercel — <track> ข้ามโดเมนต้องตั้ง CORS จึงไม่ย้าย
  เปลี่ยนที่เก็บวิดีโอได้ที่ NEXT_PUBLIC_FILM_VIDEO_BASE จุดเดียว
*/
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

export type FilmWord = { ar: string; th: string; prompt?: Text };

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
  /** คำอธิบายวิดีโอสำหรับ screen reader */
  label: Text;
};

const SALAM: FilmWord = { ar: "السَّلَامُ عَلَيْكُمْ", th: "อัสสะลามุอะลัยกุม" };
const REPLY: FilmWord = { ar: "وَعَلَيْكُمُ السَّلَامُ", th: "วะอะลัยกุมุสสะลาม" };

export const FILMS: Record<string, Film> = {
  // BEGIN wait-turn full cartoon
  // General manners adapted from the existing lesson; no new religious quotation.
  // Storyboard: docs/films/wait-turn-script.md. Cast: ครูนูรี, ฮาดี, ซาฟี, รอสซาม.
  "wait-turn": {
    "name": "wait-turn",
    "duration": 137.463,
    "turns": [
      {
        "at": 122.597,
        "resumeAt": 126.697,
        "word": {
          "ar": "",
          "th": "เราจะต่อท้ายแถว แล้วรอให้ถึงตา",
          "prompt": {
            "th": "เราจะต่อท้ายแถว แล้วรอให้ถึงตา",
            "en": "I’ll join the line and wait my turn."
          }
        }
      }
    ],
    "words": [],
    "captions": [
      "th"
    ],
    "label": {
      "th": "การ์ตูนรอคิว — ผลัดกันเล่นทางลูกบอล: ฮาดีมาต่อท้ายซาฟี รอรอสซามเล่นเสร็จ แล้วผลัดกันปล่อยลูกบอลโดยไม่แซงหรือผลัก",
      "en": "Hadi joins behind Safi, waits for Rassam to finish and takes a turn at the ball ramp."
    },
  },
  // END wait-turn full cartoon

  // BEGIN help-friend full cartoon
  // General manners adapted from the existing lesson; no new religious quotation.
  // Storyboard: docs/films/help-friend-script.md. Cast: ครูนูรี, ฟาฮีม, ซาฟี.
  "help-friend": {
    "name": "help-friend",
    "duration": 133.34,
    "turns": [
      {
        "at": 118.161,
        "resumeAt": 122.261,
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
      "th": "การ์ตูนช่วยเพื่อน — ถามก่อน แล้วช่วยเท่าที่ไหว: ซาฟีถามก่อนช่วยฟาฮีมเก็บหนังสือเบา ๆ ส่วนกล่องหนักขอให้ครูนูรีช่วย",
      "en": "Safi asks before helping Faheem collect light books; Nuri helps with the heavy box."
    },
  },
  // END help-friend full cartoon

  // BEGIN say-sorry full cartoon
  // General manners adapted from the existing lesson; no new religious quotation.
  // Storyboard: docs/films/say-sorry-script.md. Cast: ครูนูรี, ซาบิร, รอสซาม.
  "say-sorry": {
    "name": "say-sorry",
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
    "name": "meet-friends",
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
    name: "salam-v2",
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
