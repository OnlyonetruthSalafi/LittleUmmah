import { useEffect, useRef } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import { Label } from '../vip/Labels';
import { vip, coinText } from '../vip/content';
import styles from '../vip/vip.module.css';
import modal from './conversation.module.css';
import { prices, unlock, type Ledger } from './model';
import { updateShop } from './store';

export function ShopUpgrades({ shop, onClose }: { shop: Ledger; onClose: () => void }) {
  const lang = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
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
      <p aria-live="polite"><Label text={coinText(shop.coins)} /></p>
      {(['berry', 'gold'] as const).map(item => {
        const name = item === 'berry' ? vip.berryUpgrade : vip.goldUpgrade;
        const cost = shop[item] ? vip.owned : coinText(prices[item]);
        return <div key={item} className={styles.stockItem}>
          <div><strong><Label text={name} /></strong><p><Label text={item === 'berry' ? vip.berryBenefit : vip.goldBenefit} /></p></div>
          <button type="button" className={styles.secondary} disabled={shop[item] || shop.coins < prices[item]}
            aria-label={name[lang] + ' · ' + cost[lang]} onClick={() => void updateShop(current => unlock(current, item))}>
            <Label text={cost} />
          </button>
        </div>;
      })}
      <button type="button" className={modal.later} onClick={onClose}><Label text={vip.backCounter} /></button>
    </div>
  </dialog>;
}
