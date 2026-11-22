import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { Text } from '@/i18n/config';
import { Label } from '../vip/Labels';
import { vip, coinText, needCoinsText, needItemText, sellMoreText, servedText } from '../vip/content';
import styles from '../vip/vip.module.css';
import modal from './conversation.module.css';
import { blocker, upgrades, unlock, type Blocker, type Ledger, type Upgrade } from './model';
import { updateShop } from './store';

export const upgradeText: Record<Upgrade, { name: Text; benefit: Text; image: string }> = {
  berry: { name: vip.berryUpgrade, benefit: vip.berryBenefit, image: 'berry-basket' },
  gold: { name: vip.goldUpgrade, benefit: vip.goldBenefit, image: 'gold-blender' },
  flowers: { name: vip.flowersUpgrade, benefit: vip.flowersBenefit, image: 'flowers' },
  mango: { name: vip.mangoUpgrade, benefit: vip.mangoBenefit, image: 'mango-basket' },
  lantern: { name: vip.lanternUpgrade, benefit: vip.lanternBenefit, image: 'lantern' },
  bigCup: { name: vip.bigCupUpgrade, benefit: vip.bigCupBenefit, image: 'big-cup' },
  melon: { name: vip.melonUpgrade, benefit: vip.melonBenefit, image: 'melon-basket' },
};

function reason(block: Blocker): Text | undefined {
  switch (block.kind) {
    case 'needs': return needItemText(upgradeText[block.item].name);
    case 'served': return sellMoreText(block.count);
    case 'coins': return needCoinsText(block.count);
    default: return undefined;
  }
}

export function ShopUpgrades({ shop, onClose, onBought }: { shop: Ledger; onClose: () => void; onBought: () => void }) {
  const lang = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  const [news, setNews] = useState<Text | null>(null);
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => node?.close();
  }, []);
  return <dialog ref={dialog} className={modal.popup} aria-labelledby="stock-title" onCancel={event => {
    event.preventDefault();
    onClose();
  }}>
    <div className={modal.content}>
      <header><h2 id="stock-title"><Label text={vip.upgrades} /></h2></header>
      <p className={styles.stockSummary}><Label text={coinText(shop.coins)} /> · <Label text={servedText(shop.served)} /></p>
      <p role="status" className={styles.stockNews}>{news && <Label text={news} />}</p>
      <ul className={styles.stockList}>
        {upgrades.map(({ id, price }) => {
          const { name, benefit, image } = upgradeText[id];
          const block = blocker(shop, id);
          const why = block && reason(block);
          const owned = block?.kind === 'owned';
          const cost = owned ? vip.owned : coinText(price);
          return <li key={id} className={styles.stockItem} data-upgrade={id} data-state={owned ? 'owned' : block ? 'locked' : 'ready'}>
            {/* The item name is written beside the picture, so the picture itself is decorative. */}
            <Image src={`/games/vip/shop/${image}.webp`} alt="" width={64} height={64} className={styles.stockArt} />
            <div className={styles.stockCopy}>
              <strong><Label text={name} /></strong>
              <p><Label text={benefit} /></p>
              {why && <p className={styles.stockWhy}><svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" className={styles.lock}>
                <rect x="3.5" y="8.5" width="13" height="9.5" rx="2.4" fill="currentColor" />
                <path d="M6.5 8.5V6.3a3.5 3.5 0 0 1 7 0v2.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
              </svg><Label text={why} /></p>}
            </div>
            {owned
              ? <p className={styles.ownedTag}><svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
                  <path d="m4 10.5 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg><Label text={vip.owned} /></p>
              : <button type="button" className={styles.secondary} disabled={!!block}
                aria-label={name[lang] + ' · ' + cost[lang] + (why ? ' · ' + why[lang] : '')}
                onClick={() => void updateShop(current => unlock(current, id)).then(saved => {
                  if (!saved) return;
                  onBought();
                  setNews({ th: vip.bought.th + ': ' + name.th, en: vip.bought.en + ': ' + name.en });
                })}>
                <Label text={cost} />
              </button>}
          </li>;
        })}
      </ul>
      <button type="button" className={modal.later} onClick={onClose}><Label text={vip.backCounter} /></button>
    </div>
  </dialog>;
}
