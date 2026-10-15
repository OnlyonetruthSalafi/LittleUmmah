import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";
import { MemoryGame } from "@/components/games/MemoryGame";

export async function generateMetadata({ params }: PageProps<"/[lang]/learn/games/memory/easy">): Promise<Metadata> {
  const { lang } = await params;
  return { title: dict(lang as Locale).t.memoryPage.easyTitle };
}
export default function EasyMemoryPage() { return <MemoryGame key="easy" ageGroup="kids" />; }
