import { MarketWorld } from '@/features/games/vip/MarketWorld';
import { vip } from '@/features/games/vip/content';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({ params }: PageProps<'/[lang]/games/vip'>) {
  const { lang } = await params;
  return { title: vip.map[lang as Locale] };
}
export default function VipIslandPage() {
  return process.env.NODE_ENV === 'development' ? <MarketWorld /> : null;
}
