'use client';
import { useSyncExternalStore } from 'react';
import { games } from '../data/catalog';
import { gameProgress } from '../engine/progress';
const subscribe = (notify: () => void) => { window.addEventListener('storage', notify); return () => window.removeEventListener('storage', notify); };
const snapshot = () => games.reduce((sum, game) => sum + gameProgress.read(game.slug).stars, 0);
export function HubProgress() {
  const stars = useSyncExternalStore(subscribe, snapshot, () => 0);
  return <span className="gc-star-counter" aria-label={`สะสม ${stars} ดาว`}>★ {stars} <small>ดาว <span lang="en">Stars</span></small></span>;
}
