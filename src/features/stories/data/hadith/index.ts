import type { LessonIconName } from "@/components/icons/LessonIcon";

import type { Story } from "../../types";
import { CLOUD_GARDEN_STORY } from "./cloud-garden";
import { CRYING_TRUNK_STORY } from "./crying-trunk";
import { GOLD_JAR_STORY } from "./gold-jar";
import { KIND_MERCHANT_STORY } from "./kind-merchant";
import { SULAYMAN_JUDGMENT_STORY } from "./sulayman-judgment";
import { TALKING_COW_STORY } from "./talking-cow";
import { THORN_BRANCH_STORY } from "./thorn-branch";
import { THREE_MEN_STORY } from "./three-men";
import { WATER_DOG_STORY } from "./water-dog";
import { WATER_FINGERS_STORY } from "./water-fingers";

import { LITTLE_BIRD_STORY } from "./little-bird";
import { PALM_RIDDLE_STORY } from "./palm-riddle";
import { MOTHER_BIRD_STORY } from "./mother-bird";
import { CAMEL_COMPLAINT_STORY } from "./camel-complaint";
import { SEA_PLANK_STORY } from "./sea-plank";
import { VISIT_BROTHER_STORY } from "./visit-brother";

/*
  หนังสือบนตู้ "เรื่องจริงจากหะดีษ" เรียงตามวัย (ชุดแรก 10 เล่ม เจ้าของโปรเจกต์อนุมัติ 9 พ.ย. 2026)
  ready = มีภาพและเสียงครบแล้ว จึงสร้างหน้าหนังสือและเปิดได้ เล่มที่ยังไม่ ready ขึ้นตู้เป็น "เร็วๆ นี้"
  icon = ปก CSS ระหว่างรอภาพจริง
*/
export type HadithShelfEntry = { story: Story; icon: LessonIconName; ready: boolean };

export const HADITH_SHELF: { kids: HadithShelfEntry[]; juniors: HadithShelfEntry[] } = {
  kids: [
    { story: WATER_DOG_STORY, icon: "well", ready: true },
    { story: THORN_BRANCH_STORY, icon: "tree", ready: true },
    { story: CLOUD_GARDEN_STORY, icon: "cloud", ready: true },
    { story: CRYING_TRUNK_STORY, icon: "heart", ready: true },
    { story: WATER_FINGERS_STORY, icon: "drop", ready: true },
    { story: TALKING_COW_STORY, icon: "sun", ready: true },
  ],
  juniors: [
    { story: THREE_MEN_STORY, icon: "star8", ready: true },
    { story: GOLD_JAR_STORY, icon: "home", ready: true },
    { story: KIND_MERCHANT_STORY, icon: "jug", ready: true },
    { story: SULAYMAN_JUDGMENT_STORY, icon: "shield", ready: true },
  ],
};

/** ชุดที่ 2 — ภาพ (HAD-3) และเสียงครบ 10 พ.ย. 2026 เปิดอ่านได้ทุกเล่ม */
export const HADITH_SHELF_2: { kids: HadithShelfEntry[]; juniors: HadithShelfEntry[] } = {
  kids: [
    { story: LITTLE_BIRD_STORY, icon: "heart", ready: true },
    { story: PALM_RIDDLE_STORY, icon: "tree", ready: true },
    { story: MOTHER_BIRD_STORY, icon: "home", ready: true },
    { story: CAMEL_COMPLAINT_STORY, icon: "sun", ready: true },
  ],
  juniors: [
    { story: SEA_PLANK_STORY, icon: "boat", ready: true },
    { story: VISIT_BROTHER_STORY, icon: "heart", ready: true },
  ],
};

/** เล่มที่พร้อมเปิด — รวมเข้า STORIES เพื่อสร้างหน้า /learn/stories/<slug> */
export const READY_HADITH_STORIES: Story[] = [...HADITH_SHELF.kids, ...HADITH_SHELF.juniors, ...HADITH_SHELF_2.kids, ...HADITH_SHELF_2.juniors]
  .filter((e) => e.ready)
  .map((e) => e.story);
