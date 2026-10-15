import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

import { AgeHome } from "@/components/learn/AgeHome";

export async function generateMetadata({ params }: PageProps<"/[lang]/kids">): Promise<Metadata> {
  const { lang } = await params;
  return { title: dict(lang as Locale).t.ageHome.kidsTitle };
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
