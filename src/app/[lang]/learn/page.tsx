import { pageMetadata } from "@/lib/seo";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

import { IslandPicker } from "@/components/learn/IslandPicker";
import { BackLink } from "@/components/ui/BackLink";

export async function generateMetadata({ params }: PageProps<"/[lang]/learn">): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/learn", t.learnIndex.metadataTitle, t.seo.learnDescription, "welcome");
}

/* /learn ไม่มีลิงก์ชี้มาตรงๆ แต่คนพิมพ์ URL ตัดท้ายได้ จึงแสดงเกาะทั้งหมดแทน 404 */
export default async function LearnIndexPage({ params }: PageProps<"/[lang]/learn">) {
  const { lang } = await params;
  const { t, sub } = dict(lang as Locale);
  return (
    <>
      <BackLink />
      <h1 className="font-display title-sticker mt-6 mb-6 text-center text-3xl font-extrabold sm:text-4xl">
        {t.learnIndex.title}
        {sub && <span lang="en" className="block text-lg font-semibold">
          {sub.learnIndex.title}
        </span>}
      </h1>
      <IslandPicker />
    </>
  );
}
