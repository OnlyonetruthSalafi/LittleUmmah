'use client';
import { fmt } from '@/i18n/dict';
import { useDict } from '@/i18n/LocaleProvider';

import { useSyncExternalStore } from 'react';
import { games } from '../data/catalog';
import { gameProgress } from '../engine/progress';
const subscribe = (notify: () => void) => { window.addEventListener('storage', notify); return () => window.removeEventListener('storage', notify); };
const snapshot = () => games.reduce((sum, game) => sum + gameProgress.read(game.slug).stars, 0);
export function HubProgress() {
  const { t, sub } = useDict();
  const stars = useSyncExternalStore(subscribe, snapshot, () => 0);
  return <span className="gc-star-counter" aria-label={fmt(t.games.hubProgress.collected, { stars: stars })}>★ {stars} <small>{t.games.hubProgress.stars} {sub && <span lang="en">{sub.games.hubProgress.stars}</span>}</small></span>;
}
