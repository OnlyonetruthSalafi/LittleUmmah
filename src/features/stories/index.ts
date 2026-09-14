import { NUH_STORY } from "./data/nuh";
import type { Story } from "./types";

/** นิทานทั้งหมด — เพิ่มเรื่องใหม่ที่นี่ แล้วหน้า /learn/stories/<slug> จะถูกสร้างตอน build */
export const STORIES: Story[] = [NUH_STORY];

export function getStory(slug: string) {
  return STORIES.find((s) => s.slug === slug);
}

/**
  เสียงพากย์: p00 = ชื่อเรื่องบนปก, หน้าอื่นใช้ชื่อเดียวกับไฟล์ภาพ (p05.webp -> p05.mp3)
  ผูกกับชื่อภาพแทนลำดับหน้า แทรกหน้าใหม่ได้โดยไม่ต้องเปลี่ยนชื่อไฟล์เสียงหน้าอื่น
*/
export function narrationSrc(story: Story, index: number) {
  const key = index < 0 ? "p00" : story.pages[index].image.split("/").pop()!.replace(/\.\w+$/, "");
  return `/audio/stories/${story.slug}/${key}.mp3`;
}
