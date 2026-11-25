import type { Viewport } from 'next';
import { GameViewport } from '@/features/games/components/GameViewport';
import { RestaurantGame } from '@/features/games/restaurant/RestaurantGame';
import { IslandAccess } from '@/features/games/vip/IslandAccess';
import { lunch } from '@/features/games/restaurant/text';
import type { Locale } from '@/i18n/config';

export const viewport: Viewport = { viewportFit: 'cover' };

export async function generateMetadata({ params }: PageProps<'/[lang]/games/vip/restaurant'>) {
  const { lang } = await params;
  return { title: lunch.title[lang as Locale] };
}
export default function RestaurantPage() {
  return process.env.NODE_ENV === 'development' ? <IslandAccess stop="restaurant"><GameViewport><RestaurantGame /></GameViewport></IslandAccess> : null;
}
