import type { Metadata } from "next";

import { AgeHome } from "@/components/learn/AgeHome";

export const metadata: Metadata = { title: "วัย 7 ปีขึ้นไป" };

export default function JuniorsPage() {
  return (
    <AgeHome
      anchor="juniors"
      robot="/Character/read.webp"
      titleTh="วัย 7 ปีขึ้นไป"
      titleEn="Ages 7+"
      hintTh="อ่านเองได้ สำรวจเอง เลือกเกาะที่อยากเรียนรู้"
      hintEn="Read and explore on your own. Pick an island."
    />
  );
}
