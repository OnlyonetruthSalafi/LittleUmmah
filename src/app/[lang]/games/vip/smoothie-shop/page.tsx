import type { Viewport } from 'next';
import { GameViewport } from '@/features/games/components/GameViewport';
import { SmoothieShop } from '@/features/games/smoothie/SmoothieShop';
import { vip } from '@/features/games/vip/content';
import type { Locale } from '@/i18n/config';

export const viewport: Viewport = { viewportFit: 'cover' };

export async function generateMetadata({ params }: PageProps<'/[lang]/games/vip/smoothie-shop'>) {
  const { lang } = await params;
  return { title: vip.shop[lang as Locale] };
}
export default function SmoothiePage() {
  return process.env.NODE_ENV === 'development' ? <GameViewport><SmoothieShop /></GameViewport> : null;
}
