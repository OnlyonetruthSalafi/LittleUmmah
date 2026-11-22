import Image from 'next/image';
import { LocaleLink } from '@/i18n/LocaleProvider';
import { vip } from './content';
import { Label } from './Labels';
import styles from './vip.module.css';

/** Teacher Nuri and friends stand on the beach in front of the island. Heights are a share of the cast box. */
const cast = [
  { name: 'safi', width: 288, height: 217, size: '56%' },
  { name: 'hadi', width: 230, height: 320, size: '92%' },
  { name: 'nuri', width: 315, height: 320, size: '100%' },
  { name: 'sabir', width: 346, height: 320, size: '88%' },
] as const;

export function ZoneCard() {
  const open = process.env.NODE_ENV === 'development';
  return <section id="vip-zone" className={styles.zoneCard} aria-labelledby="vip-title">
    <LocaleLink href="/games/vip" data-game-link prefetch={false} className={styles.zoneLink}>
      {/* The title and invitation below say everything the picture shows. */}
      <div className={styles.zoneArt} aria-hidden="true">
        <Image src="/games/vip/card/island.webp" alt="" fill sizes="(max-width: 900px) 100vw, 1100px" className={styles.zoneIsland} />
        <div className={styles.zoneCast}>
          {cast.map(({ name, width, height, size }) => <Image key={name} src={`/games/vip/card/${name}.webp`} alt=""
            width={width} height={height} style={{ height: size }} />)}
        </div>
      </div>
      <div className={styles.zoneCopy}>
        <p className={styles.vipBadge}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M3 8l4.5 3.5L12 4l4.5 7.5L21 8l-2 11H5Z" fill="#ffd56b" stroke="#a66a12" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="12" cy="14.5" r="1.8" fill="#a66a12" />
        </svg><Label text={vip.zone} /></p>
        <h2 id="vip-title"><Label text={vip.mystery} /></h2>
        <p className={styles.zoneInvite}><Label text={vip.mysteryInvite} /></p>
        <ul className={styles.zoneGames}>
          <li><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="m4 10.5 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <Label text={vip.firstGame} /></li>
          <li><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 12q3-3 6 0t6 0M3 7q3-3 6 0t6 0M5 16q3-2 6 0t5 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <Label text={vip.moreGames} /></li>
        </ul>
        <span className={styles.zoneGo}><Label text={open ? vip.explore : vip.comingSoon} />
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M4 10h11m-4-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </div>
    </LocaleLink>
  </section>;
}
