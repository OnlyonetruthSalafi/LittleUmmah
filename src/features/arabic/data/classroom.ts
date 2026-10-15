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
  // อักษร 28 ตัว: อ่านตามชื่อตัวอักษร
  alif: "อะลิฟ",
  ba: "บาอ์",
  ta: "ตาอ์",
  tha: "ษาอ์",
  jim: "ญีม",
  haa: "หาอ์",
  kha: "คออ์",
  dal: "ดาล",
  dhal: "ซาล",
  ra: "รออ์",
  zay: "ซาย",
  sin: "ซีน",
  shin: "ชีน",
  sad: "ศ็อด",
  dad: "ฎ็อด",
  taa: "ฏออ์",
  zaa: "ซออ์",
  ayn: "อัยน์",
  ghayn: "ฆ็อยน์",
  fa: "ฟาอ์",
  qaf: "ก็อฟ",
  kaf: "กาฟ",
  lam: "ลาม",
  mim: "มีม",
  nun: "นูน",
  ha: "ฮาอ์",
  waw: "วาว",
  ya: "ยาอ์",
  salam: "อัสสะลามุอะลัยกุม",
  jazak: "ญะซากัลลอฮุค็อยร็อน",
  bismillah: "บิสมิลลาฮ์",
  alhamdulillah: "อัลฮัมดุลิลลาฮ์",
  fatha: "บะ ตะ ษะ",
  kasra: "บิ ติ ษิ",
  damma: "บุ ตุ ษุ",
  sukun: "อับ อุม",
  numbers: "วาฮิด อิษนาน ษะลาษะฮ์ อัรบะอะฮ์ ค็อมสะฮ์",
  numbers2: "ซิตตะฮ์ ซับอะฮ์ ษะมานิยะฮ์ ติสอะฮ์ อะชะเราะฮ์",
  digits: "วาฮิด อิษนาน ษะลาษะฮ์ อัรบะอะฮ์ ค็อมสะฮ์",
  words: "กิตาบ เกาะลัม บัยต์ มาอ์",
  home: "บาบ กุรซีย์ ซะรีร นาฟิซะฮ์",
  nature: "ชัมส์ เกาะมัร นัจญ์ม์ ชะญะเราะฮ์",
  family: "อับ อุมม์ อัค อุคต์",
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

/*
  ชุดบทเรียน (เจ้าของโปรเจกต์สั่งทำเกาะให้ครบ 8 ต.ค. 2026)
  วัย 3-6 ปี: อักษร 28 ตัว แบ่งชุดละ 4 ตัวตามลำดับ — เรียนทีละน้อย จบชุดแล้วไปชุดถัดไป
  วัย 7+: 4 หมวด ตามรหัสบทใน lessons.ts
  preview = สิ่งที่แสดงบนปุ่มเลือกชุด (ตัวอักษรของชุด หรือตัวอย่างอาหรับสั้นๆ)
*/
export type ClassUnit = { id: string; titleTh: string; titleEn: string; preview: string; steps: ClassStep[] };

const JUNIOR_UNITS: { id: string; titleTh: string; titleEn: string; preview: string; ids: string[] }[] = [
  { id: "manners", titleTh: "มารยาทและคำทักทาย", titleEn: "Manners", preview: "سَلَام", ids: ["salam", "jazak", "bismillah", "alhamdulillah"] },
  { id: "harakat", titleTh: "สระอาหรับ", titleEn: "Vowel marks", preview: "بَ بِ بُ", ids: ["fatha", "kasra", "damma", "sukun"] },
  { id: "numbers", titleTh: "ตัวเลข", titleEn: "Numbers", preview: "١ ٢ ٣", ids: ["numbers", "numbers2", "digits"] },
  { id: "words", titleTh: "คำศัพท์", titleEn: "Words", preview: "كِتَاب", ids: ["words", "home", "nature", "family"] },
];

function buildUnits(group: AgeGroupId): ClassUnit[] {
  const steps = CLASS_STEPS[group];
  if (group === "kids") {
    return Array.from({ length: Math.ceil(steps.length / 4) }, (_, i) => {
      const chunk = steps.slice(i * 4, i * 4 + 4);
      return {
        id: `letters-${i + 1}`,
        titleTh: `ชุดที่ ${i + 1}`,
        titleEn: `Set ${i + 1}`,
        preview: chunk.map((s) => s.board).join(" "),
        steps: chunk,
      };
    });
  }
  return JUNIOR_UNITS.map(({ ids, ...unit }) => ({
    ...unit,
    steps: ids.map((id) => {
      const step = steps.find((s) => s.id === id);
      if (!step) throw new Error(`ไม่พบบทเรียน ${id}`);
      return step;
    }),
  }));
}

export const CLASS_UNITS: Record<AgeGroupId, ClassUnit[]> = {
  kids: buildUnits("kids"),
  juniors: buildUnits("juniors"),
};

/** ไฟล์เสียงห้องเรียน — แยกโฟลเดอร์จาก /audio/th เพราะเล่นด้วย playNarration ไม่ผ่านทะเบียน RECORDED_CLIPS */
export function classAudio(key: string) {
  return `/audio/class/${key}.mp3`;
}

/** คำชมสามแบบ หมุนไปเรื่อยๆ เพื่อไม่ให้ซ้ำจนเด็กเบื่อ */
export const CHEER_COUNT = 3;
