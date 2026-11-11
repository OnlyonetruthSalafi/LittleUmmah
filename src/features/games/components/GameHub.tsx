import { AgeSwitch } from "@/components/learn/AgeSections";
import { HubStarsHint, LearningBalance, PlayArea } from '@/features/learning-stars/components';
import { BackLink } from '@/components/ui/BackLink';
import { OtherIslands } from '@/components/islands/OtherIslands';
import { games } from '../data/catalog';
import { comingSoonGames } from '../data/comingSoon';
import { GAME_CATEGORIES } from '../data/hubCategories';
import { GamesHero } from './GamesHero';
import { GameHubCategory } from './GameHubCategory';
import { HubProgress } from './HubProgress';
import { SHOW_REWARD_STARS } from '@/lib/rewardStars';
import '../games-hub.css';

export function GameHub() {
  // เพิ่มหมวดได้จากข้อมูล หมวดว่างไม่ขึ้นทั้งใน Hero และรายการเกม
  const categories = GAME_CATEGORIES.filter(category => games.some(game => game.enabled && game.category === category.id));
  return <PlayArea><div className="gh-page" id="age-games" tabIndex={-1}>
    <div className="gh-utility"><BackLink /><LearningBalance />{SHOW_REWARD_STARS && <HubProgress />}</div>
    <HubStarsHint />
    <GamesHero categories={categories} />
    <span id="kids" /><span id="juniors" />
    {categories.map(category => <GameHubCategory key={category.id} category={category}
      games={games.filter(game => game.enabled && game.category === category.id)
        .sort((a, b) => category.order.indexOf(a.slug) - category.order.indexOf(b.slug))} />)}
    <AgeSwitch focusId="age-games" controls={{
      kids: [...games.filter(g => g.enabled && g.ageGroup === '3–6').map(g => `age-game-${g.slug}`), ...comingSoonGames.filter(g => g.ageGroup === '3–6').map(g => `age-soon-${g.id}`)].join(' '),
      juniors: [...games.filter(g => g.enabled && g.ageGroup === '7+').map(g => `age-game-${g.slug}`), ...comingSoonGames.filter(g => g.ageGroup === '7+').map(g => `age-soon-${g.id}`)].join(' '),
    }} />
    <OtherIslands current="games" />
  </div></PlayArea>;
}
