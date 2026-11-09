import { categoryMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { dict } from "@/i18n/dict";
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
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return categoryMetadata(lang as Locale, "explore", t.explore.metadataTitle);
}

export default function ExploreIslandPage({ params }: Props) {
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
        title={category.name}
        intro={island.intro}
        steps={GUIDE_STEPS}
        ageSections={AGE_SECTIONS}
        art={{ src: "/explore/hero-island.webp", width: 1063, height: 923 }}
        seenKey="lu-explore-guide-seen"
      />
      {section("kids")}
      {section("juniors")}

      <OtherIslands current="explore" />

      {/* เครดิตภาพถ่าย — ทุกภาพเป็นสาธารณสมบัติหรือ CC0 ไม่บังคับเครดิต แต่ใส่ชื่อผู้ถ่ายเป็นมารยาท ผู้อ่านเป็นผู้ใหญ่ วางล่างสุดของหน้า พับไว้ กดเปิดเอง ไม่รบกวนสายตา (เจ้าของโปรเจกต์สั่ง 2 ต.ค. 2026) */}
      <PhotoCredits params={params} />
    </div>
  );
}

async function PhotoCredits({ params }: Props) {
  const { lang } = await params;
  const { t, sub, pick } = dict(lang as Locale);
  return (
      <details className="mrl-credits">
        <summary className="mrl-credits-summary">
          {t.explore.photoCredits} {sub && <span lang="en">{sub.explore.photoCredits}</span>}
        </summary>
        <ul className="mrl-credit-list text-xs">
          {PHOTO_CREDITS.map((credit) => (
            <li key={credit.page}>
              <a href={credit.page} target="_blank" rel="noopener noreferrer" className="mrl-credit-link">
                “{credit.title}”<span className="sr-only">{t.explore.newTab}</span>
              </a>{" "}
              {t.explore.by} {credit.author} — {pick(credit.license)}
            </li>
          ))}
        </ul>
      </details>
  );
}
