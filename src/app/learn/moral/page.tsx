import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/ui/BackLink";
import { MoralHero } from "@/features/moral/components/MoralHero";
import { MoralSection } from "@/features/moral/components/MoralLessons";
import { CARTOONS } from "@/features/moral/cartoon";
import { AGE_SECTIONS, CARD_ART, CARD_BUBBLE, GUIDE_STEPS } from "@/features/moral/data";
import { OtherIslands } from "@/components/islands/OtherIslands";
import { CATEGORIES } from "@/lib/categories";
import { getIslandContent } from "@/lib/lessons";

/*
  เกาะมารยาทและศีลธรรม — หน้าตาตาม mock ของเจ้าของโปรเจกต์ (tests/MoralPage.png)
  โฟลเดอร์ literal นี้ชนะ learn/[slug] (แบบเดียวกับ arabic, stories) และ [slug] ไม่สร้างหน้า moral แล้ว
  บทเรียนยังมาจาก lib/lessons.ts ที่เดียว หน้าแรกของช่วงวัยลิงก์มาที่ #kids / #juniors ได้เหมือนเดิม
  ส่วนประกอบของหน้าใช้ร่วมกับเกาะสำรวจโลก (learn/explore) ข้อมูลเฉพาะเกาะส่งเข้าไปทาง props
*/
export const metadata: Metadata = { title: "เกาะมารยาทและศีลธรรม" };

export default function MoralIslandPage() {
  const island = getIslandContent("moral");
  const category = CATEGORIES.find((c) => c.slug === "moral");
  if (!island || !category) notFound();

  const section = (age: "kids" | "juniors") => (
    <MoralSection
      age={age}
      section={AGE_SECTIONS[age]}
      groups={[{ id: age, lessons: island[age] }]}
      cardArt={CARD_ART}
      cardBubble={CARD_BUBBLE}
      cartoons={CARTOONS}
      progressKey="lu-moral-progress"
    />
  );

  return (
    <div className="mrl-page">
      <BackLink />
      <MoralHero
        titleTh={category.nameTh}
        titleEn={category.nameEn}
        introTh={island.introTh}
        introEn={island.introEn}
        steps={GUIDE_STEPS}
        ageSections={AGE_SECTIONS}
        art={{ src: "/moral/hero-island.webp", width: 1063, height: 923 }}
        seenKey="lu-moral-guide-seen"
      />
      {section("kids")}
      {section("juniors")}
      <OtherIslands current="moral" />
    </div>
  );
}
