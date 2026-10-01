import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/ui/BackLink";
import { MoralHero } from "@/features/moral/components/MoralHero";
import { MoralSection } from "@/features/moral/components/MoralLessons";
import { OtherIslands } from "@/components/islands/OtherIslands";
import { CATEGORIES } from "@/lib/categories";
import { getIslandContent } from "@/lib/lessons";

/*
  เกาะมารยาทและศีลธรรม — หน้าตาตาม mock ของเจ้าของโปรเจกต์ (tests/MoralPage.png)
  โฟลเดอร์ literal นี้ชนะ learn/[slug] (แบบเดียวกับ arabic, stories) และ [slug] ไม่สร้างหน้า moral แล้ว
  บทเรียนยังมาจาก lib/lessons.ts ที่เดียว หน้าแรกของช่วงวัยลิงก์มาที่ #kids / #juniors ได้เหมือนเดิม
*/
export const metadata: Metadata = { title: "เกาะมารยาทและศีลธรรม" };

export default function MoralIslandPage() {
  const island = getIslandContent("moral");
  const category = CATEGORIES.find((c) => c.slug === "moral");
  if (!island || !category) notFound();

  return (
    <div className="mrl-page">
      <BackLink />
      <MoralHero
        titleTh={category.nameTh}
        titleEn={category.nameEn}
        introTh={island.introTh}
        introEn={island.introEn}
      />
      <MoralSection age="kids" lessons={island.kids} />
      <MoralSection age="juniors" lessons={island.juniors} />
      <OtherIslands current="moral" />
    </div>
  );
}
