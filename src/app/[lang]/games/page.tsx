import { pageMetadata } from "@/lib/seo";
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { dict } from '@/i18n/dict';
import { PageShell } from '@/components/layout/PageShell';
import { GameHub } from '@/features/games/components/GameHub';
export async function generateMetadata({ params }: PageProps<'/[lang]/games'>): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/games", t.games.hub.metadataTitle, t.seo.gamesDescription, "play");
}
export default async function GamesPage({ params }: PageProps<'/[lang]/games'>) {
  await params;
  return <PageShell><GameHub /></PageShell>;
}
