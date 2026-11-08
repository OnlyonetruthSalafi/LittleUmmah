import { categoryMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { dict } from "@/i18n/dict";

import { ValueBar } from "@/components/landing/ValueBar";
import { BackLink } from "@/components/ui/BackLink";
import { Classroom } from "@/features/arabic/components/Classroom";
import { getIslandContent } from "@/lib/lessons";

/*
  เกาะภาษาอาหรับ = ห้องเรียนหุ่นยนต์
  โฟลเดอร์ literal นี้ชนะ learn/[slug] (แบบเดียวกับ learn/games และ learn/stories)
  และ [slug] ไม่สร้างหน้า arabic แล้ว
*/
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return categoryMetadata(lang as Locale, "arabic", t.arabic.classroom.metadataTitle);
}

export default async function ArabicIslandPage({ params }: Props) {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  const island = getIslandContent("arabic");

  return (
    <>
      <BackLink />
      <Classroom intro={island?.intro ?? { th: "", en: "" }} />

      <div className="mt-12">
        <h2 className="font-display mb-4 text-center text-2xl font-bold">{t.arabic.classroom.otherIslands}</h2>
        <ValueBar />
      </div>
    </>
  );
}
