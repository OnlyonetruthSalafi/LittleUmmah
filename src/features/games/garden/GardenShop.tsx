import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import type { Text } from '@/i18n/config';
import { Label } from '../vip/Labels';
import { vip, coinText, needCoinsText, needItemText } from '../vip/content';
import styles from '../vip/vip.module.css';
import modal from '../smoothie/conversation.module.css';
import { updateShop, useShop } from '../smoothie/store';
import { gardenBlocker, gardenItems, type Garden, type GardenBlocker, type GardenItem } from './model';
import { updateGarden } from './store';
import { garden as text } from './text';

const pictures: Record<GardenItem, string> = { tomato: 'tomato', beds: 'hoe', corn: 'corn', sprinkler: 'sprinkler', pumpkin: 'pumpkin' };

function reason(block: GardenBlocker): Text | undefined {
  switch (block.kind) {
    case 'needs': return needItemText(text.items[block.item].name);
    case 'delivered': return text.deliverMore(block.count);
    case 'coins': return needCoinsText(block.count);
    default: return undefined;
  }
}

/** Seeds and tools for the garden, paid with the smoothie shop's coins (one shared wallet). */
export function GardenShop({ farm, onClose, onBought }: { farm: Garden; onClose: () => void; onBought: () => void }) {
  const lang = useLocale();
  const { shop } = useShop();
  const dialog = useRef<HTMLDialogElement>(null);
  const [news, setNews] = useState<Text | null>(null);
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => node?.close();
  }, []);
  async function buy(item: GardenItem) {
    const price = gardenItems.find(i => i.id === item)!.price;
    // Take the coins first; only a successful payment hands over the item.
    let paid = false;
    await updateShop(current => {
      if (gardenBlocker(farm, current.coins, item)) return current;
      paid = true;
      return { ...current, coins: current.coins - price };
    });
    if (!paid) return;
    await updateGarden(g => g[item] ? g : { ...g, [item]: true });
    onBought();
    const { name } = text.items[item];
    setNews({ th: vip.bought.th + ': ' + name.th, en: vip.bought.en + ': ' + name.en });
  }
  return <dialog ref={dialog} className={modal.popup} aria-labelledby="seed-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className={modal.content}>
      <header><h2 id="seed-title"><Label text={text.shop} /></h2></header>
      <p className={styles.stockSummary}><Label text={coinText(shop.coins)} /> · <Label text={text.delivered(farm.delivered)} /></p>
      <p role="status" className={styles.stockNews}>{news && <Label text={news} />}</p>
      <ul className={styles.stockList}>
        {gardenItems.map(({ id, price }) => {
          const { name, benefit } = text.items[id];
          const block = gardenBlocker(farm, shop.coins, id);
          const why = block && reason(block);
          const owned = block?.kind === 'owned';
          const cost = coinText(price);
          return <li key={id} className={styles.stockItem} data-upgrade={id} data-state={owned ? 'owned' : block ? 'locked' : 'ready'}>
            <Image src={`/games/vip/garden/${pictures[id]}.webp`} alt="" width={64} height={64} className={styles.stockArt} />
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
                aria-label={name[lang] + ' · ' + cost[lang] + (why ? ' · ' + why[lang] : '')} onClick={() => void buy(id)}>
                <Label text={cost} />
              </button>}
          </li>;
        })}
      </ul>
      <button type="button" className={modal.later} onClick={onClose}><Label text={text.back} /></button>
    </div>
  </dialog>;
}
