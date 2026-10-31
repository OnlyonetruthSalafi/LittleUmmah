'use client';

import { useDict } from '@/i18n/LocaleProvider';
import { fmt } from '@/i18n/dict';
import { GameCategoryIcon } from '@/components/icons/GameCategoryIcon';
import { GamePlayIcon } from '@/components/icons/GamePlayIcon';
import { StarIcon } from '@/components/icons/StarIcon';
import type { GameDefinition } from '../data/catalog';
import type { GameCategory } from '../data/hubCategories';
import { Thumbnail } from './Artwork';
import { HubTileLink } from './HubTileLink';
import { useHubStars } from './HubProgress';

export function GameHubCategory({ category, games }: { category: GameCategory; games: GameDefinition[] }) {
  const { t, sub, pick, pickSub } = useDict();
  const total = useHubStars(games);
  return <section id={category.id} className={`gh-section gh-${category.theme}`} aria-labelledby={`${category.id}-title`}>
    <div className="gh-section-head">
      <h2 className="gh-category-label" id={`${category.id}-title`}>
        <GameCategoryIcon name={category.icon} />
        <span>{pick(category.label)}{sub && <small lang="en">{pickSub(category.label)}</small>}</span>
      </h2>
      <p className="gh-section-desc">{pick(category.desc)}{sub && <span lang="en">{pickSub(category.desc)}</span>}</p>
      <div className="gh-category-progress"><StarIcon /><div>
        <strong>{fmt(t.games.hub.collected, { stars: total })}</strong>
        {sub && <small lang="en">{fmt(sub.games.hub.collected, { stars: total })}</small>}
      </div></div>
    </div>
    <ul className="gh-grid">{games.map(game => <GameCard key={game.slug} game={game} />)}</ul>
  </section>;
}

function GameCard({ game }: { game: GameDefinition }) {
  const { t, sub, pick, pickSub } = useDict();
  const stars = useHubStars([game]);
  const label = fmt(t.games.hub.playLabel, { name: pick(game.title), stars });
  return <li><HubTileLink href={`/games/${game.slug}`} slug={game.slug} name={pick(game.title)}
    ariaLabel={sub ? `${label} / ${fmt(sub.games.hub.playLabel, { name: pickSub(game.title)!, stars })}` : label} className="gh-card">
    <div className="gh-card-art"><Thumbnail slug={game.slug} />
      <span className="gh-age">{game.ageGroup} {t.games.hub.ageUnit}{sub && <span lang="en"> / {sub.games.hub.ageUnit}</span>}</span>
    </div>
    <div className="gh-card-copy"><h3 className="gh-card-title">{pick(game.title)}</h3>
      {sub && <span className="gh-card-en" lang="en">{pickSub(game.title)}</span>}
    </div>
    <div className="gh-card-foot"><span className="gh-card-stars"><StarIcon /><span>{stars} <span className="sr-only">{t.games.hubProgress.stars}</span></span></span><GamePlayIcon className="gh-card-play" /></div>
  </HubTileLink></li>;
}
