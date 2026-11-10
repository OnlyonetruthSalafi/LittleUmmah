import type { Text } from "@/i18n/config";
import { STORIES } from "@/features/stories";
import {
  CARTOONS as FAITH_CARTOONS,
  LESSONS as FAITH_LESSONS,
} from "@/features/faith/data";
import { EVIDENCE, type Evidence } from "./evidence";

/** กลุ่มหลักฐานที่แสดงให้ผู้ปกครองดู — หนึ่งกลุ่มต่อหนึ่งเล่ม/บท ลำดับรายการตามที่ปรากฏในเนื้อหา */
export type EvidenceGroup = { key: string; title: Text; items: Evidence[] };

const BY_ID = new Map(EVIDENCE.map((e) => [e.id, e]));

/** เก็บ id จาก field `evidence` ทุกชั้นของข้อมูล (เล่ม หน้า ฉาก) ไม่ซ้ำ ตามลำดับที่พบ */
function collect(value: unknown, out: Set<string>) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) collect(item, out);
    return;
  }
  for (const [key, item] of Object.entries(value)) {
    if (key === "evidence" && Array.isArray(item))
      for (const id of item) out.add(id as string);
    else collect(item, out);
  }
}

function group(key: string, title: Text, ...sources: unknown[]): EvidenceGroup {
  const ids = new Set<string>();
  for (const s of sources) collect(s, ids);
  return {
    key,
    title,
    items: [...ids]
      .map((id) => BY_ID.get(id))
      .filter((e): e is Evidence => !!e),
  };
}

export const STORY_EVIDENCE: EvidenceGroup[] = STORIES.map((s) =>
  group(s.slug, s.title, s),
).filter((g) => g.items.length);

export const FAITH_EVIDENCE: EvidenceGroup[] = [
  ...FAITH_LESSONS.kids,
  ...FAITH_LESSONS.juniors,
]
  .map((l) => group(l.id, l.title, l, FAITH_CARTOONS[l.id]))
  .filter((g) => g.items.length);
