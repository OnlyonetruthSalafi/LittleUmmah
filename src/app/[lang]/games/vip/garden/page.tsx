import { GardenGame } from '@/features/games/garden/GardenGame';
import { IslandAccess } from '@/features/games/vip/IslandAccess';
import { garden } from '@/features/games/garden/text';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({ params }: PageProps<'/[lang]/games/vip/garden'>) {
  const { lang } = await params;
  return { title: garden.title[lang as Locale] };
}
export default function GardenPage() {
  return process.env.NODE_ENV === 'development' ? <IslandAccess stop="garden"><GardenGame /></IslandAccess> : null;
}
