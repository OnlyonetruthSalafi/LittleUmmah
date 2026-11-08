import { pageMetadata } from "@/lib/seo";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

import { AgeHome } from "@/components/learn/AgeHome";

export async function generateMetadata({ params }: PageProps<"/[lang]/kids">): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/kids", t.ageHome.kidsTitle, t.seo.kidsDescription, "play");
}

export default async function KidsPage({ params }: PageProps<"/[lang]/kids">) {
  const { lang } = await params;
  const locale = lang as Locale;
  return (
    <AgeHome
      locale={locale}
      anchor="kids"
      robot="/Character/play.webp"
    />
  );
}
