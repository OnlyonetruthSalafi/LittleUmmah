import { pageMetadata } from "@/lib/seo";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import { PlayIslands } from "@/components/landing/PlayIslands";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { Hero } from "@/components/landing/Hero";
import { LowerScene } from "@/components/landing/LowerScene";
import { ObeyArc } from "@/components/landing/ObeyArc";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkyScene } from "@/components/landing/SkyScene";
import { IslandNotice } from "@/components/landing/IslandNotice";
import "@/components/landing/home-islands.css";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/", t.seo.homeTitle, t.seo.description);
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = lang as Locale;
  return (
    <SkyScene>
      <SiteHeader />
      <IslandNotice><main className="flex flex-1 flex-col">
        <CategoryGrid locale={locale} />
        <Hero locale={locale} />
        {/* ตั้งแต่คำโค้ง "Love, Believe, Obey" ลงไปใช้ภาพพื้นหลัง BGLower */}
        <LowerScene>
          <ObeyArc locale={locale} />
          <PlayIslands locale={locale} />
        </LowerScene>
      </main></IslandNotice>
    </SkyScene>
  );
}
