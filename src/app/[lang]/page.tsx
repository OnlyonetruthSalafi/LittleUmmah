import { pageMetadata } from "@/lib/seo";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import { AgeGroupSelector } from "@/components/landing/AgeGroupSelector";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { Hero } from "@/components/landing/Hero";
import { LowerScene } from "@/components/landing/LowerScene";
import { ObeyArc } from "@/components/landing/ObeyArc";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ValueBar } from "@/components/landing/ValueBar";
import { SkyScene } from "@/components/landing/SkyScene";

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
      <main className="flex flex-1 flex-col">
        <CategoryGrid locale={locale} />
        <Hero locale={locale} />
        {/* ตั้งแต่คำโค้ง "Love, Believe, Obey" ลงไปใช้ภาพพื้นหลัง BGLower */}
        <LowerScene>
          <ObeyArc locale={locale} />
          <AgeGroupSelector />
          <ValueBar />
        </LowerScene>
      </main>
    </SkyScene>
  );
}
