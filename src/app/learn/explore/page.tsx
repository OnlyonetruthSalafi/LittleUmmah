import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OtherIslands } from "@/components/islands/OtherIslands";
import { BackLink } from "@/components/ui/BackLink";
import {
  AGE_SECTIONS,
  CARD_ART,
  CARTOONS,
  GUIDE_STEPS,
  HABITAT_GROUP,
  HABITAT_LESSONS,
  PHOTO_CREDITS,
  WORLD_GROUP,
} from "@/features/explore/data";
import { MoralHero } from "@/features/moral/components/MoralHero";
import { MoralSection } from "@/features/moral/components/MoralLessons";
import { CATEGORIES } from "@/lib/categories";
import { getIslandContent } from "@/lib/lessons";

/*
  เกาะสำรวจโลก — หน้าตาแบบเดียวกับเกาะมารยาท (เจ้าของโปรเจกต์สั่ง 2 ต.ค. 2026)
  โฟลเดอร์ literal นี้ชนะ learn/[slug] และ [slug] ไม่สร้างหน้า explore แล้ว (OWN_PAGE)
  ส่วนประกอบมาจาก features/moral ข้อมูลเฉพาะเกาะอยู่ที่ features/explore/data.ts
  บท "สิ่งรอบตัว" ยังมาจาก lib/lessons.ts ที่เดียว
*/
export const metadata: Metadata = { title: "เกาะสำรวจโลก" };

export default function ExploreIslandPage() {
  const island = getIslandContent("explore");
  const category = CATEGORIES.find((c) => c.slug === "explore");
  if (!island || !category) notFound();

  const section = (age: "kids" | "juniors") => (
    <MoralSection
      age={age}
      section={AGE_SECTIONS[age]}
      groups={[
        { id: `${age}-habitat`, ...HABITAT_GROUP, lessons: HABITAT_LESSONS[age] },
        { id: `${age}-world`, ...WORLD_GROUP, lessons: island[age] },
      ]}
      cardArt={CARD_ART}
      cartoons={CARTOONS}
      progressKey="lu-explore-progress"
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
        art={{ src: "/explore/hero-island.webp", width: 1063, height: 923 }}
        seenKey="lu-explore-guide-seen"
      />
      {section("kids")}
      {section("juniors")}

      <OtherIslands current="explore" />

      {/* เครดิตภาพถ่าย — ทุกภาพเป็นสาธารณสมบัติหรือ CC0 ไม่บังคับเครดิต แต่ใส่ชื่อผู้ถ่ายเป็นมารยาท ผู้อ่านเป็นผู้ใหญ่ วางล่างสุดของหน้า พับไว้ กดเปิดเอง ไม่รบกวนสายตา (เจ้าของโปรเจกต์สั่ง 2 ต.ค. 2026) */}
      <details className="mrl-credits">
        <summary className="mrl-credits-summary">
          เครดิตภาพถ่ายสัตว์ <span lang="en">Photo credits</span>
        </summary>
        <ul className="mrl-credit-list text-xs">
          {PHOTO_CREDITS.map((credit) => (
            <li key={credit.page}>
              <a href={credit.page} target="_blank" rel="noopener noreferrer" className="mrl-credit-link">
                “{credit.title}”<span className="sr-only"> (เปิดในแท็บใหม่)</span>
              </a>{" "}
              โดย {credit.author} — {credit.license}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
