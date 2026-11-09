import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { pageMetadata } from "@/lib/seo";
import { OtherIslands } from "@/components/islands/OtherIslands";
import { BackLink } from "@/components/ui/BackLink";
import { RoomPicker } from "@/features/languages/RoomPicker";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/learn/languages", t.languages.title, t.languages.welcome);
}

export default function LanguageIslandPage() {
  return <><BackLink /><RoomPicker /><OtherIslands current="arabic" /></>;
}
