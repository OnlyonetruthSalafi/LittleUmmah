'use client';

import type { ReactNode } from 'react';
import { LocaleLink } from '@/i18n/LocaleProvider';
import { useGarden } from '../garden/store';
import { useShop } from '../smoothie/store';
import { Label } from './Labels';
import { vip } from './content';
import { islandProgress, places, type IslandGoal } from './route';
import styles from './vip.module.css';

export function IslandAccess({ stop, children }: { stop: IslandGoal['stop']; children: ReactNode }) {
  const { shop } = useShop();
  const { garden } = useGarden();
  const { open, goal } = islandProgress(shop.earnedCoins, garden.earnedCoins);
  if (!goal || open.includes(stop)) return children;
  return <main className={styles.page}><div className={styles.mapPanel}>
    <h1><Label text={places.find(place => place.stop === stop)!.name} /></h1>
    <p><Label text={goal.hint} /></p>
    <LocaleLink className={styles.back} href={`/games/vip#${open[open.length - 1]}`}><Label text={vip.backMap} /></LocaleLink>
  </div></main>;
}
