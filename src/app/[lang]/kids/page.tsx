import type { Metadata } from "next";

import { AgeHome } from "@/components/learn/AgeHome";

export const metadata: Metadata = { title: "วัย 3-6 ปี" };

export default function KidsPage() {
  return (
    <AgeHome
      anchor="kids"
      robot="/Character/play.webp"
      title={{ th: "วัย 3-6 ปี", en: "Ages 3–6" }}
      hint={{ th: "เรียนรู้ผ่านการเล่น แตะเกาะที่อยากไปได้เลย", en: "Learn through play. Tap an island to begin." }}
    />
  );
}
