import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";
import { MemoryGame } from "@/components/games/MemoryGame";

export async function generateMetadata({ params }: PageProps<"/[lang]/learn/games/memory/hard">): Promise<Metadata> {
  const { lang } = await params;
  return { title: dict(lang as Locale).t.memoryPage.hardTitle };
}
export default function HardMemoryPage() { return <MemoryGame key="hard" ageGroup="juniors" />; }
