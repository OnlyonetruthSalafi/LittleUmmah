import type { Metadata } from "next";

import { AgeHome } from "@/components/learn/AgeHome";

export const metadata: Metadata = { title: "วัย 7 ปีขึ้นไป" };

export default function JuniorsPage() {
  return (
    <AgeHome
      anchor="juniors"
      robot="/Character/read.webp"
      title={{ th: "วัย 7 ปีขึ้นไป", en: "Ages 7+" }}
      hint={{ th: "อ่านเองได้ สำรวจเอง เลือกเกาะที่อยากเรียนรู้", en: "Read and explore on your own. Pick an island." }}
    />
  );
}
