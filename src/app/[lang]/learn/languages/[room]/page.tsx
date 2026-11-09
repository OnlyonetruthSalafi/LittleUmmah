import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, type Locale, type Text } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { pageMetadata } from "@/lib/seo";
import { getIslandContent } from "@/lib/lessons";
import { OtherIslands } from "@/components/islands/OtherIslands";
import { BackLink } from "@/components/ui/BackLink";
import { Classroom } from "@/features/arabic/components/Classroom";
import { COURSES, isRoom } from "@/features/languages/courses";

type Props = { params: Promise<{ lang: string; room: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => Object.keys(COURSES).map((room) => ({ lang, room })));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, room } = await params;
  if (!isRoom(room)) notFound();
  const copy = dict(lang as Locale).t.languages.courses[room];
  return pageMetadata(lang as Locale, `/learn/languages/${room}`, copy.title, copy.intro);
}
export default async function LanguageRoomPage({ params }: Props) {
  const { room } = await params;
  if (!isRoom(room)) notFound();
  const th = dict("th").t.languages;
  const en = dict("en").t.languages;
  const intro: Text = room === "arabic"
    ? getIslandContent("arabic")!.intro
    : { th: th.courses[room].intro, en: en.courses[room].intro };
  return <>
    <BackLink href="/learn/languages" label={{ th: th.title, en: en.title }} />
    <Classroom config={COURSES[room]} intro={intro} />
    <OtherIslands current="arabic" />
  </>;
}
