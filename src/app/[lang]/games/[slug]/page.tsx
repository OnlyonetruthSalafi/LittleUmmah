import { dict } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { games } from '@/features/games/data/catalog';
import { GamePlayer } from '@/features/games/components/GamePlayer';
export function generateStaticParams() { return games.map(game => ({ slug: game.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) { const { lang, slug } = await params; const { t, pick, pickSub } = dict(lang as Locale); const game = games.find(g => g.slug === slug); return { title: game ? `${pick(game.title)}${pickSub(game.title) ? ` — ${pickSub(game.title)}` : ''}` : t.games.player.notFound }; }
export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const game = games.find(g => g.slug === slug && g.enabled); if (!game) notFound(); return <GamePlayer game={game} />; }
