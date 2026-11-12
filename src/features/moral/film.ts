import type { Text } from "@/i18n/config";

/*
  การ์ตูนเต็มเรื่องของเกาะมารยาท (เจ้าของโปรเจกต์สั่ง 12 พ.ย. 2026: เลิกแบบภาพนิ่ง + เสียงบรรยาย เปลี่ยนเป็นการ์ตูนเด็กสอนศีลธรรม)
  บทเรียนที่มีการ์ตูนในไฟล์นี้จะเปิดเป็น FilmLesson แทน CartoonLesson เดิม บทที่ยังไม่มีใช้แบบเดิมไปก่อน

  ทำด้วย: ชิ้นส่วนตัวละคร (Codex ตัดจากภาพที่อนุมัติแล้ว) + ระบบกระดูก DOM/GSAP + HyperFrames
  ไฟล์ต้นทางอยู่ที่ output/car-salam2/ (บท script.md, ที่มาของตัวบทอยู่ในนั้น) และ output/car-hf/salam2/ (film.mjs)
  ตัวละครเป็นหุ่นยนต์ล้วน ไม่มีดนตรี มีแต่เสียงพูดและเสียงประกอบ (AGENTS 1.2, 1.3)

  วิดีโอ: <ชื่อ>-720.mp4 (มือถือ) <ชื่อ>-1080.mp4 (จอกว้าง) <ชื่อ>-poster.webp และคำบรรยาย <ชื่อ>.<ภาษา>.vtt
  ที่อยู่ไฟล์ทั้งหมดผ่าน FILM_BASE จุดเดียว — เมื่อย้ายวิดีโอไป Cloudflare R2 ให้ตั้ง NEXT_PUBLIC_FILM_BASE เป็นโดเมนของ bucket
*/
export const FILM_BASE = process.env.NEXT_PUBLIC_FILM_BASE ?? "/moral/film";

export type FilmWord = { ar: string; th: string };

export type Film = {
  /** ชื่อไฟล์ (ไม่มีนามสกุล) ใต้ FILM_BASE */
  name: string;
  /** ความยาว (วินาที) — ใช้แสดงแถบความคืบหน้าก่อนโหลด metadata */
  duration: number;
  /** ช่วงที่ให้เด็กพูด: วิดีโอหยุดที่ at แสดงป้ายคำ เด็กกด "หนูพูดแล้ว" -> ข้ามไปเล่นต่อที่ resumeAt */
  turns: { at: number; resumeAt: number; word: FilmWord }[];
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
  /*
    สลามรับสลาม — ที่มา (ตรวจ Shamela 12 พ.ย. 2026):
    บุคอรี 6233 «يُسَلِّمُ الرَّاكِبُ عَلَى الْمَاشِي، وَالْمَاشِي عَلَى الْقَاعِدِ، وَالْقَلِيلُ عَلَى الْكَثِيرِ» https://shamela.ws/book/1681/9333
    มุสลิม 54 «أَفْشُوا السَّلَامَ بَيْنَكُمْ» https://shamela.ws/book/1727/158
    อบูดาวูด 5208 / ติรมิซีย์ 2706 (อัลบานีย์: حسن صحيح) สลามตอนมาถึงและตอนจากไป https://shamela.ws/book/1726/7109
    อันนิซาอ์ 4:86 ความหมายไทยฉบับศูนย์กษัตริย์ฟะฮัด (quran.com 51) — ไม่อ่านตัวอาหรับ (AGENTS 1.6)
  */
  salam: {
    name: "salam",
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
