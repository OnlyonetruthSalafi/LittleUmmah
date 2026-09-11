import type { Metadata } from "next";

import { AgeHome } from "@/components/learn/AgeHome";

export const metadata: Metadata = { title: "วัย 3-6 ปี" };

export default function KidsPage() {
  return (
    <AgeHome
      anchor="kids"
      robot="/Character/glad.webp"
      titleTh="วัย 3-6 ปี"
      titleEn="Ages 3–6"
      hintTh="เรียนรู้ผ่านการเล่น แตะเกาะที่อยากไปได้เลย"
      hintEn="Learn through play. Tap an island to begin."
    />
  );
}
