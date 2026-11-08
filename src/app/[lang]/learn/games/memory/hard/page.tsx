import { pageMetadata } from "@/lib/seo";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";
import { MemoryGame } from "@/components/games/MemoryGame";

export async function generateMetadata({ params }: PageProps<"/[lang]/learn/games/memory/hard">): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/learn/games/memory/hard", t.memoryPage.hardTitle, t.seo.gamesDescription, "play");
}
export default function HardMemoryPage() { return <MemoryGame key="hard" ageGroup="juniors" />; }
