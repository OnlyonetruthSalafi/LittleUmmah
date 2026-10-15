import { redirect } from 'next/navigation';
import { localePath } from '@/i18n/path';
import type { Locale } from '@/i18n/config';
// Preserve existing island links. Focus mode lives outside the /learn layout. คงภาษาเดิม (/en/learn/games -> /en/games)
export default async function GamesIslandPage({ params }: PageProps<'/[lang]/learn/games'>) { const { lang } = await params; redirect(localePath(lang as Locale, '/games')); }
