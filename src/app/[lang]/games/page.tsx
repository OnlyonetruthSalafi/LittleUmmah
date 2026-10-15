import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { dict } from '@/i18n/dict';
import { GameHub } from '@/features/games/components/GameHub';
export async function generateMetadata({ params }: PageProps<'/[lang]/games'>): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return { title: t.games.hub.metadataTitle, description: t.games.hub.metadataDescription };
}
export default async function GamesPage({ params }: PageProps<'/[lang]/games'>) {
  const { lang } = await params;
  return <GameHub locale={lang as Locale} />;
}
