'use client';

import { GameFullscreenButton } from '../components/GameViewport';
import { useCallback, useEffect, useState } from 'react';
import { SmoothieFruit } from '@/components/icons/SmoothieFruit';
import { ShopCoin } from '@/components/icons/ShopCoin';
import { LocaleLink, useLocale } from '@/i18n/LocaleProvider';
import { FRIENDS } from '@/lib/friends';
import type { Text } from '@/i18n/config';
import { LearningNotice, LockScreen, useBlockedReason, usePlayLimit } from '@/features/learning-stars/components';
import { beginRound, finishRound } from '@/features/learning-stars/store';
import { useSfx } from '../audio/useSfx';
import { ShopUpgrades } from './ShopUpgrades';
import play from './worktop.module.css';
import { CounterConversation, type Exchange } from './CounterConversation';
import conversation from './conversation.json';
import { SoundToggle } from '@/components/sound/SoundToggle';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';
import { useOrderVoice } from './useOrderVoice';
import orderLines from './orders.json';
import { Label } from '../vip/Labels';
import { vip, coinText, collectText, earnedText } from '../vip/content';
import styles from '../vip/vip.module.css';
import { ShopScene } from './ShopScene';
import { collect, customers, fruitKinds, fruitNames, needsFruit, stocked, ticket, type Fruit, type Ledger, type Stage } from './model';
import { updateShop, useShop } from './store';

const sounds = {
  pick: { file: '/audio/sfx/tap.mp3', volume: 0.5 },
  switch: { file: '/audio/sfx/meet-friends/click.mp3', volume: 0.7 },
  coins: { file: '/audio/sfx/smoothie-coins.mp3', volume: 0.95 },
};

function Worktop({ shop, message, onMessage, sound }: {
  shop: Ledger; message: Text | null; onMessage: (text: Text | null) => void;
  sound: (effect: keyof typeof sounds) => void;
}) {
  const lang = useLocale();
  const [arrived, setArrived] = useState(false);
  const [exchange, setExchange] = useState<Exchange>('greeting');
  const [deferred, setDeferred] = useState(false);
  const onArrival = useCallback(() => setArrived(true), []);
  const [stage, setStage] = useState<Stage>('order');
  const [order] = useState(() => ticket(shop));
  const [basket, setBasket] = useState<{ fruit: Fruit[]; revision: number }>({ fruit: [], revision: 0 });
  const { fruit, revision } = basket;
  const [guide, setGuide] = useState(shop.served === 0);
  const [shelfOpen, setShelfOpen] = useState(false);
  const [retry, setRetry] = useState(false);
  const [blocked, setBlocked] = useState<'time' | 'stars'>();
  const timeLimit = usePlayLimit(stage !== 'order');
  const denial = useBlockedReason(blocked);
  const lock = timeLimit ? 'time' : denial;
  const customer = customers[order.id % customers.length];
  const friend = FRIENDS[customer];
  const recipe = order.fruit.join('-') as keyof typeof orderLines;
  const script = orderLines[recipe];
  const line = customer === 'safi' ? { th: script.th.replaceAll('ครับ','ค่ะ'), en: script.en } : script;
  const talking = arrived && stage === 'order' && !deferred && !shelfOpen && !lock;
  const answering = exchange === 'reply' || exchange === 'replyLong';
  const greeting = exchange !== 'ordering';
  const spoken = greeting ? conversation.greeting : line;
  const clip = `/audio/th/smoothie/${customer}-${greeting ? 'shop-salam' : recipe}.mp3`;
  const voice = useOrderVoice(clip, spoken[lang], lang, !lock && (stage === 'prepare' || (talking && !answering)), greeting);
  useEffect(() => {
    if (!talking || !answering) return;
    const timer = window.setTimeout(() => setExchange('ordering'), voice.enabled ? 1800 : 1200);
    return () => window.clearTimeout(timer);
  }, [talking, answering, voice.enabled]);
  const nextFruit = order.fruit.find(kind => needsFruit(order.fruit, fruit, kind));
  const ready = !nextFruit;

  useEffect(() => {
    if ((stage !== 'blend' && stage !== 'pouring') || lock) return;
    const timer = stage === 'pouring'
      ? window.setTimeout(() => setStage('serve'), 800)
      : window.setTimeout(() => setStage('pour'), shop.gold ? 550 : 1450);
    return () => window.clearTimeout(timer);
  }, [stage, lock, shop.gold]);

  function add(kind: Fruit) {
    if (lock || stage !== 'prepare') return;
    const needed = needsFruit(order.fruit, fruit, kind);
    setRetry(!needed);
    if (!needed) return;
    sound('pick');
    setBasket(previous => needsFruit(order.fruit, previous.fruit, kind)
      ? { fruit: [...previous.fruit, kind], revision: previous.revision + 1 }
      : previous);
  }
  function undo() {
    if (stage !== 'prepare' || lock) return;
    setRetry(false);
    setBasket(previous => ({ ...previous, fruit: previous.fruit.slice(0, -1) }));
  }
  function act() {
    if (lock || !arrived) return;
    switch (stage) {
      case 'order': {
        if (!talking || exchange !== 'ordering') return;
        const reason = beginRound();
        if (reason) { setBlocked(reason); return; }
        voice.retryOnGesture();
        onMessage(null); setStage('prepare');
        break;
      }
      case 'prepare': if (ready) { sound('switch'); setRetry(false); setStage('blend'); } break;
      case 'pour': setStage('pouring'); break;
      case 'serve': setStage('collect'); break;
      case 'collect':
        void updateShop(current => collect(current, order)).then(saved => {
          if (saved) {
            sound('coins');
            finishRound();
            onMessage(earnedText(order.value));
          }
        });
        break;
    }
  }
  const actionText = { order: vip.talk, prepare: ready ? vip.mix : vip.add, blend: vip.mixing, pour: vip.pour, pouring: vip.pouring, serve: vip.serve, collect: collectText(order.value) }[stage];
  const hint = nextFruit && guide && stage === 'prepare'
    ? { th: 'แตะ' + fruitNames[nextFruit].th + 'ใส่โถปั่น', en: 'Tap the ' + fruitNames[nextFruit].en.toLowerCase() + ' to add it.' }
    : actionText;
  const waiting = arrived && deferred ? vip.resume : message ?? (arrived ? vip.talk : vip.arriving);
  const cue = stage === 'order' ? waiting : retry ? vip.wrong : hint;
  const kinds = fruitKinds.filter(kind => order.fruit.includes(kind));

  const ingredients = <ul className={styles.recipe}>{kinds.map(kind => <li key={kind}>
    <span className={styles.receiptFruit}><SmoothieFruit kind={kind} /></span>
    <Label text={fruitNames[kind]} /><strong>×{order.fruit.filter(item => item === kind).length}</strong>
  </li>)}</ul>;
  const price = <div className={styles.ticketPrice}><ShopCoin /><Label text={coinText(order.value)} /></div>;
  return <><section className={play.game} aria-label={vip.shop[lang]} data-shop-stage={stage} inert={!!lock}>
      <div className={play.rail}>
        <div role="status" className={play.cue}><Label text={cue} /></div>
        {stage !== 'order' && <ul aria-label={vip.ticket[lang]} className={play.ticket}>
          {kinds.map(kind => {
            const quantity = fruit.filter(item => item === kind).length + '/' + order.fruit.filter(item => item === kind).length;
            return <li key={kind}><span aria-hidden="true"><SmoothieFruit kind={kind} /></span>
              <span className="sr-only">{fruitNames[kind][lang]} </span>{quantity}</li>;
          })}
        </ul>}
        {stage === 'prepare' && <button type="button" className={play.tool} disabled={!voice.enabled}
          aria-label={vip.replay[lang]} title={vip.replay[lang]} onClick={voice.listen}><SpeakerIcon on={voice.enabled} /></button>}
        <button type="button" className={play.tool} aria-pressed={guide} onClick={() => setGuide(previous => !previous)}>
          <Label text={vip.guide} />
        </button>
      </div>
      <ShopScene fruit={fruit} stage={stage} customer={order.id} arrived={arrived} onArrival={onArrival}
        upgraded={shop.gold} kinds={stocked(shop)} flowers={shop.flowers} lantern={shop.lantern} bigCup={shop.bigCup} lang={lang} ready={ready} guide={guide}
        nextFruit={nextFruit} revision={revision} actionLabel={actionText[lang]} onPick={add} onUndo={undo}
        onUse={act} deferred={deferred} onTalk={() => setDeferred(false)} onUpgrades={() => setShelfOpen(true)} />
    </section>
    {shelfOpen && !lock && <ShopUpgrades shop={shop} onClose={() => setShelfOpen(false)} onBought={() => sound('coins')} />}
    {talking && <CounterConversation key={exchange === 'ordering' ? 'ticket' : 'salam'} phase={exchange}
      speaker={answering ? vip.seller : friend.name} line={answering ? conversation[exchange] : spoken}
      enabled={voice.enabled} greeted={voice.greeted} needsTap={voice.needsTap} onHear={voice.hearGreeting} onListen={voice.listen} ticket={<>{ingredients}{price}</>}
      onReply={reply => setExchange(reply)} onAccept={act} onDefer={() => {
        if (answering) setExchange('ordering');
        setDeferred(true);
      }} />}
    <LearningNotice />{lock && <LockScreen reason={lock} onClose={() => setBlocked(undefined)} />}</>;
}

export function SmoothieShop() {
  const { shop, temporary } = useShop();
  // The till stays mounted so the payment can ring out as the next customer enters.
  const sound = useSfx(sounds);
  const [message, setMessage] = useState<Text | null>(null);
  return <main className={styles.page}><div className={styles.frame}>
    <header className={styles.shopTop}><LocaleLink href="/games/vip#shop" className={styles.back}><Label text={vip.backMap} /></LocaleLink>
      <h1><Label text={vip.shop} /></h1>
      <div className={styles.shopTools}><SoundToggle /><GameFullscreenButton /><div className={styles.wallet}><ShopCoin /><strong>{shop.coins}</strong><Label text={vip.till} /></div></div>
    </header>
    <Worktop key={shop.served} shop={shop} message={message} onMessage={setMessage} sound={sound} />
    {temporary && <p role="status"><Label text={vip.temporary} /></p>}
  </div></main>;
}
