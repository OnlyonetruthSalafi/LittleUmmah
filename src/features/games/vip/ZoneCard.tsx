import { LocaleLink } from '@/i18n/LocaleProvider';
import { MarketMapArt } from '../smoothie/MarketMapArt';
import { vip } from './content';
import { Label } from './Labels';
import styles from './vip.module.css';

export function ZoneCard() {
  return <section id="vip-zone" className={styles.zoneCard} aria-labelledby="vip-title">
    <LocaleLink href="/games/vip" data-game-link prefetch={false} className={styles.zoneLink}>
      <div className={styles.thumbnail} aria-hidden="true"><MarketMapArt /></div>
      <div className={styles.cardCopy}>
        <div className={styles.eyebrow}><Label text={vip.zone} /></div>
        <h2 id="vip-title"><Label text={vip.map} /></h2><p><Label text={process.env.NODE_ENV === 'development' ? vip.invitation : vip.closed} /></p>
      </div>
    </LocaleLink>
  </section>;
}
