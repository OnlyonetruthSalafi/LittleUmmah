import { notFound } from 'next/navigation';
import { games } from '@/features/games/data/catalog';
import { GamePlayer } from '@/features/games/components/GamePlayer';
export function generateStaticParams() { return games.map(game => ({ slug: game.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const game = games.find(g => g.slug === slug); return { title: game ? `${game.title.th} — ${game.title.en}` : 'ไม่พบเกม' }; }
export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const game = games.find(g => g.slug === slug && g.enabled); if (!game) notFound(); return <GamePlayer game={game} />; }
