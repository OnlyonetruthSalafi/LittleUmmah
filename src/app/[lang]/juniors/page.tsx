import { pageMetadata } from "@/lib/seo";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

import { AgeHome } from "@/components/learn/AgeHome";

export async function generateMetadata({ params }: PageProps<"/[lang]/juniors">): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/juniors", t.ageHome.juniorsTitle, t.seo.juniorsDescription, "welcome");
}

export default async function JuniorsPage({ params }: PageProps<"/[lang]/juniors">) {
  const { lang } = await params;
  const locale = lang as Locale;
  return (
    <AgeHome
      locale={locale}
      anchor="juniors"
      robot="/Character/read.webp"
    />
  );
}
