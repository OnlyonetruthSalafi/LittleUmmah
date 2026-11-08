import { pageMetadata } from "@/lib/seo";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import { IslandOrbit } from "@/components/landing/IslandOrbit";
import { Hero } from "@/components/landing/Hero";
import { LowerScene } from "@/components/landing/LowerScene";
import { ObeyArc } from "@/components/landing/ObeyArc";
import { SiteFooter } from "@/components/layout/SiteFooter";
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
      <IslandNotice>
        <main className="flex flex-1 flex-col">
          {/* วงเกาะโคจร: ทั้งโซนเรียนรู้และโซนผจญภัยในวงเดียว (เจ้าของโปรเจกต์ 9 พ.ย. 2026) */}
          <IslandOrbit />
          <Hero locale={locale} />
        </main>
        {/* ตั้งแต่คำโค้ง "Love, Believe, Obey" ลงไปใช้ภาพพื้นหลัง BGLower ต่อยาวถึงหลังเมฆของ Footer
            คำขวัญเป็นข้อความตกแต่ง จึงอยู่นอก <main> ได้ · Footer เป็น landmark contentinfo ของตัวเอง */}
        <LowerScene>
          <ObeyArc locale={locale} />
          <SiteFooter />
        </LowerScene>
      </IslandNotice>
    </SkyScene>
  );
}
