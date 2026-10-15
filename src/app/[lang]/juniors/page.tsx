import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

import { AgeHome } from "@/components/learn/AgeHome";

export async function generateMetadata({ params }: PageProps<"/[lang]/juniors">): Promise<Metadata> {
  const { lang } = await params;
  return { title: dict(lang as Locale).t.ageHome.juniorsTitle };
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
