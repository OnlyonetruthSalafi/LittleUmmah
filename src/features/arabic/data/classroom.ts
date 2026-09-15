import { getIslandContent } from "@/lib/lessons";

/*
  บทเรียนในห้องเรียนหุ่นยนต์ — เกาะภาษาอาหรับ

  เนื้อหาต้นทางอยู่ที่ `src/lib/lessons.ts` ที่เดียว ไฟล์นี้ไม่เขียนเนื้อหาซ้ำ
  เพิ่มให้เฉพาะสิ่งที่ห้องเรียนต้องใช้แต่การ์ดไม่ต้องใช้ คือ "คำที่เด็กต้องอ่านตาม" (`say`)

  `say` เป็นคำอ่านภาษาไทยเสมอ ไม่ใช่ตัวอาหรับ
  เพราะเสียงสังเคราะห์ของเบราว์เซอร์ (ทางสำรองเมื่อไฟล์เสียงเล่นไม่ได้) อ่านอักษรอาหรับไม่ได้
  ตัวอาหรับจริงไปอยู่บนกระดานดำในฐานะ "ข้อความจริง" ของหน้าเว็บ ไม่ได้ฝังอยู่ในภาพ
*/

export type AgeGroupId = "kids" | "juniors";

export type ClassStep = {
  id: string;
  group: AgeGroupId;
  /** ข้อความอาหรับบนกระดาน — เป็น text จริง screen reader อ่านได้ */
  board: string;
  /** ตัวเดียวเขียนเต็มกระดาน ส่วนวลีต้องเล็กลงจึงจะพอ */
  boardSize: "glyph" | "phrase";
  titleTh: string;
  titleEn: string;
  /** สิ่งที่ครูสอน อ่านเป็นเสียงในคลิป teach- */
  body: string;
  /** คำที่เด็กอ่านตามในจังหวะเว้นว่าง */
  say: string;
  meaning?: string;
};

/*
  คำที่ให้เด็กอ่านตาม แยกตามรหัสบทเรียน
  บทตัวอักษรอ่านชื่อตัวอักษร ส่วนบทของวัย 7+ อ่านคำอ่านไทยของวลีอาหรับ
  วลียาวตัดให้สั้นลงเพื่อให้เด็กอ่านตามจบในลมหายใจเดียว
*/
const SAY: Record<string, string> = {
  alif: "อะลิฟ",
  ba: "บาอ์",
  ta: "ตาอ์",
  tha: "ษาอ์",
  salam: "อัสสะลามุอะลัยกุม",
  jazak: "ญะซากัลลอฮุค็อยร็อน",
  numbers: "วาฮิด อิษนาน ษะลาษะฮ์ อัรบะอะฮ์ ค็อมสะฮ์",
  words: "กิตาบ เกาะลัม บัยต์ มาอ์",
};

function buildSteps(group: AgeGroupId): ClassStep[] {
  const island = getIslandContent("arabic");
  if (!island) return [];
  return island[group].map((lesson) => ({
    id: lesson.id,
    group,
    board: lesson.glyph ?? lesson.arabic ?? "",
    boardSize: lesson.glyph ? "glyph" : "phrase",
    titleTh: lesson.titleTh,
    titleEn: lesson.titleEn,
    body: lesson.body,
    say: SAY[lesson.id] ?? lesson.reading ?? lesson.titleTh,
    meaning: lesson.meaning,
  }));
}

export const CLASS_STEPS: Record<AgeGroupId, ClassStep[]> = {
  kids: buildSteps("kids"),
  juniors: buildSteps("juniors"),
};

/** ไฟล์เสียงห้องเรียน — แยกโฟลเดอร์จาก /audio/th เพราะเล่นด้วย playNarration ไม่ผ่านทะเบียน RECORDED_CLIPS */
export function classAudio(key: string) {
  return `/audio/class/${key}.mp3`;
}

/** คำชมสามแบบ หมุนไปเรื่อยๆ เพื่อไม่ให้ซ้ำจนเด็กเบื่อ */
export const CHEER_COUNT = 3;
