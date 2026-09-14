import type { LessonIconName } from "@/components/icons/LessonIcon";
import { ISLAND_CONTENT } from "@/lib/lessons";

import { STORIES } from "./index";

export type ShelfBook = {
  id: string;
  titleTh: string;
  titleEn: string;
  icon: LessonIconName;
  /** มีเฉพาะเรื่องที่ทำหนังสือนิทานแล้ว เรื่องอื่นเป็นหนังสือ "เร็วๆ นี้" */
  cover?: string;
  href?: string;
};

/*
  หนังสือบนตู้ = เรื่องเล่าทั้งหมดของเกาะ (ข้อมูลเดิมใน lessons.ts) แยกชั้นตามช่วงวัย
  เรื่องที่มีหนังสือนิทานแล้วใช้ปกจริง เรื่องที่ยังไม่มีเป็นปก CSS พร้อมแถบ "เร็วๆ นี้"
*/
export function shelfBooks() {
  const island = ISLAND_CONTENT.find((i) => i.slug === "stories");
  if (!island) throw new Error("ไม่พบข้อมูลเกาะเรื่องเล่า");
  const toBook = (lesson: (typeof island.kids)[number]): ShelfBook => {
    const story = STORIES.find((s) => s.slug === lesson.id);
    return {
      id: lesson.id,
      titleTh: story?.titleTh ?? lesson.titleTh,
      titleEn: story?.titleEn ?? lesson.titleEn,
      icon: lesson.icon,
      cover: story?.cover,
      href: story ? `/learn/stories/${story.slug}` : undefined,
    };
  };
  return { kids: island.kids.map(toBook), juniors: island.juniors.map(toBook) };
}

type Rect = { l: number; r: number; t: number; b: number };
export type ShelfArt = {
  src: string;
  width: number;
  height: number;
  plaque: Rect;
  /** ช่องวางหนังสือ: l/r = ขอบผนังใน, t = บนสุดของช่อง, b = ระดับที่หนังสือยืน (ผิวบนของไม้ชั้น) — % ของภาพ */
  rows: { t: number; b: number }[];
  l: number;
  r: number;
};

/*
  ค่าวัดจากพิกเซลจริงด้วย scripts/measure-shelf.mjs (ผนังในสีเขียวน้ำทะเล + ขอบไม้ชั้น)
  ระดับยืนของหนังสืออยู่กลางผิวบนของไม้ชั้น ระหว่างขอบล่างผนังกับขอบหน้าไม้
  ป้ายด้านบนวัดด้วยตาจากภาพ เพราะแสงสีทองรอบตู้ทำให้ตัววัดสีครีมจับผิด
  ถ้าเปลี่ยนภาพตู้ต้องวัดใหม่ทั้งหมด
*/
export const SHELF_WIDE: ShelfArt = {
  src: "/stories/shelf/shelf-wide.webp",
  width: 1536,
  height: 1024,
  plaque: { l: 28, r: 28, t: 4.6, b: 79.5 },
  l: 14.8,
  r: 14.8,
  rows: [
    { t: 30.1, b: 52.8 },
    { t: 57.4, b: 80.6 },
  ],
};

export const SHELF_TALL: ShelfArt = {
  src: "/stories/shelf/shelf-tall.webp",
  width: 1024,
  height: 1536,
  plaque: { l: 30, r: 29.5, t: 4.2, b: 87.6 },
  l: 25.5,
  r: 25.3,
  rows: [
    { t: 22.6, b: 32.3 },
    { t: 39.6, b: 50.7 },
    { t: 57, b: 68.6 },
    { t: 72, b: 86.4 },
  ],
};
