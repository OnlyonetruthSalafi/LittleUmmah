import { LocaleLink } from '@/i18n/LocaleProvider';
import { MarketMapArt } from '../smoothie/MarketMapArt';
import { vip } from './content';
import { Label } from './Labels';
import styles from './vip.module.css';

export function ClosedIsland() {
  return <main className={styles.page}><div className={styles.frame}>
    <div className={styles.top}><LocaleLink href="/games" className={styles.back}><Label text={vip.games} /></LocaleLink></div>
    <div className={styles.mapLayout}><div className={styles.mapImage}><MarketMapArt /></div>
      <section className={styles.mapPanel}><div className={styles.eyebrow}><Label text={vip.zone} /></div>
        <h1><Label text={vip.map} /></h1><p><Label text={vip.closed} /></p>
      </section>
    </div>
  </div></main>;
}
