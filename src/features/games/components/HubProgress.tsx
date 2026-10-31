'use client';
import { fmt } from '@/i18n/dict';
import { useDict } from '@/i18n/LocaleProvider';

import { useSyncExternalStore } from 'react';
import { StarIcon } from '@/components/icons/StarIcon';
import type { GameDefinition } from '../data/catalog';
import { games } from '../data/catalog';
import { gameProgress } from '../engine/progress';
const subscribe = (notify: () => void) => { window.addEventListener('storage', notify); return () => window.removeEventListener('storage', notify); };
export function useHubStars(list: GameDefinition[]) {
  return useSyncExternalStore(subscribe, () => list.filter(game => game.enabled).reduce((sum, game) => sum + gameProgress.read(game.slug).stars, 0), () => 0);
}
export function HubProgress() {
  const { t, sub } = useDict();
  const stars = useHubStars(games);
  return <span className="gh-total-stars" aria-label={fmt(t.games.hubProgress.collected, { stars })}><StarIcon /><span><b>{stars} {t.games.hubProgress.stars}</b>{sub && <small lang="en">{fmt(sub.games.hubProgress.collected, { stars })}</small>}</span></span>;
}
