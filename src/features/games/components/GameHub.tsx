import { BackLink } from '@/components/ui/BackLink';
import { OtherIslands } from '@/components/islands/OtherIslands';
import { games } from '../data/catalog';
import { GAME_CATEGORIES } from '../data/hubCategories';
import { GamesHero } from './GamesHero';
import { GameHubCategory } from './GameHubCategory';
import { HubProgress } from './HubProgress';
import '../games-hub.css';

export function GameHub() {
  // เพิ่มหมวดได้จากข้อมูล หมวดว่างไม่ขึ้นทั้งใน Hero และรายการเกม
  const categories = GAME_CATEGORIES.filter(category => games.some(game => game.enabled && game.category === category.id));
  return <div className="gh-page">
    <div className="gh-utility"><BackLink /><HubProgress /></div>
    <GamesHero categories={categories} />
    {categories.map(category => <GameHubCategory key={category.id} category={category}
      games={games.filter(game => game.enabled && game.category === category.id)
        .sort((a, b) => category.order.indexOf(a.slug) - category.order.indexOf(b.slug))} />)}
    <OtherIslands current="games" />
  </div>;
}
