'use client';

import { GameFullscreenButton } from '../components/GameViewport';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ShopCoin } from '@/components/icons/ShopCoin';
import { SeedShopIcon } from '@/components/icons/SeedShopIcon';
import { SoundToggle } from '@/components/sound/SoundToggle';
import { useSound } from '@/components/sound/SoundProvider';
import { LocaleLink, useLocale } from '@/i18n/LocaleProvider';
import type { Text } from '@/i18n/config';
import { FRIENDS } from '@/lib/friends';
import { isSpeaking, playNarration, speakWithSynth, stopSpeechIf } from '@/lib/speech';
import { LearningNotice, LockScreen, useBlockedReason, usePlayLimit } from '@/features/learning-stars/components';
import { beginRound, finishRound } from '@/features/learning-stars/store';
import { useSfx } from '../audio/useSfx';
import { CounterConversation, type Exchange } from '../smoothie/CounterConversation';
import conversation from '../smoothie/conversation.json';
import { useOrderVoice } from '../smoothie/useOrderVoice';
import { updateShop, useShop } from '../smoothie/store';
import play from '../smoothie/worktop.module.css';
import { Label } from '../vip/Labels';
import { vip, coinText } from '../vip/content';
import styles from '../vip/vip.module.css';
import { GardenScene, type FriendPose } from './GardenScene';
import { GardenShop } from './GardenShop';
import lines from './lines.json';
import {
  advance, advanceAll, cropNames, deliver, harvest, look, missing, nextGardenStep, openBeds, prepareOrder, pullWeed, request, seeds, sow, till,
  water, weedy, type Basket, type Crop, type Garden, type Tool,
} from './model';
import { updateGarden, useGarden } from './store';
import { garden as text } from './text';
import css from './garden.module.css';

const sounds = {
  scrape: { file: '/audio/sfx/garden-dig.mp3', volume: 0.6 },
  tilled: { file: '/audio/sfx/garden-tilled.mp3', volume: 0.8 },
  pull: { file: '/audio/sfx/garden-pull.mp3', volume: 0.75 },
  basket: { file: '/audio/sfx/garden-basket.mp3', volume: 0.85 },
  plop: { file: '/audio/sfx/meet-friends/click.mp3', volume: 0.6 },
  pick: { file: '/audio/sfx/correct.mp3', volume: 0.5 },
  wrong: { file: '/audio/sfx/wrong.mp3', volume: 0.4 },
  coins: { file: '/audio/sfx/smoothie-coins.mp3', volume: 0.95 },
};
type Hint = keyof typeof lines.hints;
type Stage = 'talk' | 'work' | 'thanks';

/** Re-render a few times a second so plants visibly grow and dry out. */
function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [active]);
  return now;
}

function Visit({ farm, onHold, onDone, sound }: { farm: Garden; onHold: () => void; onDone: () => void; sound: (s: keyof typeof sounds) => void }) {
  const lang = useLocale();
  const { enabled } = useSound();
  const [order] = useState(() => request(farm));
  const [visitNumber] = useState(farm.delivered);
  const selling = useRef(false);
  const accepting = useRef(false);
  const [soldBasket, setSoldBasket] = useState<Basket | undefined>(undefined);
  const visitor = order.visitor;
  const friend = FRIENDS[visitor];
  const [arrived, setArrived] = useState(false);
  const [exchange, setExchange] = useState<Exchange>('greeting');
  const [deferred, setDeferred] = useState(false);
  const [stage, setStage] = useState<Stage>('talk');
  const [reminderAt, setReminderAt] = useState<number | null>(null);
  const [tool, setTool] = useState<Tool | null>(null);
  const [cue, setCue] = useState<Text | null>(null);
  useEffect(() => {
    if (!cue) return;
    const timer = window.setTimeout(() => setCue(null), 3200);
    return () => window.clearTimeout(timer);
  }, [cue]);
  const [hint, setHint] = useState<{ kind: Hint; at: number } | null>(null);
  const [blocked, setBlocked] = useState<'time' | 'stars'>();
  const [shelf, setShelf] = useState(false);
  const spoken = useRef<Partial<Record<Hint, number>>>({});
  const timeLimit = usePlayLimit(stage === 'work');
  const denial = useBlockedReason(blocked);
  const lock = timeLimit ? 'time' : denial;
  const now = useNow(!lock);
  const plots = farm.plots.map(plot => advance(plot, now, farm.sprinkler));
  const open = openBeds(farm);
  const lacking = missing(farm, order.items);
  const step = nextGardenStep(plots.slice(0, open), lacking, farm.sprinkler);
  const complete = step.task === 'sell';
  const reminding = reminderAt !== null && stage === 'work' && !complete && !lock && !shelf;
  useEffect(() => {
    if (reminderAt === null) return;
    const timer = window.setTimeout(() => setReminderAt(null), 10000);
    return () => window.clearTimeout(timer);
  }, [reminderAt]);

  const talking = arrived && stage === 'talk' && !deferred && !lock && !shelf;
  const answering = exchange === 'reply' || exchange === 'replyLong';
  const greeting = exchange !== 'ordering';
  const ask = lines.requests[order.id as keyof typeof lines.requests];
  const clip = greeting ? `/audio/th/smoothie/${visitor}-shop-salam.mp3` : `/audio/th/garden/${visitor}-${order.id}.mp3`;
  const voice = useOrderVoice(clip, (greeting ? conversation.greeting : ask)[lang], lang, (talking && !answering) || reminding, greeting);
  const repeatRequest = voice.listen;
  useEffect(() => {
    if (!talking || !answering) return;
    const timer = window.setTimeout(() => setExchange('ordering'), voice.enabled ? 1800 : 1200);
    return () => window.clearTimeout(timer);
  }, [talking, answering, voice.enabled]);

  /* The friend notices what the garden needs and says so, once in a while. */
  const want: Hint | null = stage !== 'work' || reminding ? null : step.task === 'harvest' ? 'ready'
    : step.task === 'water' || step.task === 'weed' ? step.task : null;
  useEffect(() => {
    if (!want || lock || shelf) return;
    const last = spoken.current[want] ?? 0;
    if (want !== 'weed' && Date.now() - last < 15000) return;
    let stop: (() => void) | undefined;
    const timer = window.setTimeout(() => {
      setHint({ kind: want, at: Date.now() });
      if (!enabled) return;
      spoken.current[want] = Date.now();
      if (lang === 'th') {
        stop = playNarration(`/audio/th/garden/${visitor}-${want}.mp3`, { onEnded() {}, onStopped() {}, onFail() {} });
      } else {
        const line = lines.hints[want].en;
        speakWithSynth(line);
        stop = () => stopSpeechIf('', line);
      }
    }, want === 'weed' ? 0 : want === 'water' ? 4000 : 1600);
    return () => { window.clearTimeout(timer); stop?.(); };
  }, [want, lock, shelf, enabled, visitor, lang]);
  useEffect(() => {
    if (!hint) return;
    const timer = window.setTimeout(() => setHint(null), 4200);
    return () => window.clearTimeout(timer);
  }, [hint]);

  const apply = useCallback((bed: number, used: Tool) => {
    if (stage !== 'work' || lock) return;
    const at = Date.now();
    const plot = advance(farm.plots[bed], at, farm.sprinkler);
    let action: ((g: Garden) => Garden) | null = null;
    let effect: keyof typeof sounds = 'tilled';
    let wrong: Text | null = null;
    if (used === 'hoe') {
      if (plot.kind === 'wild') action = g => till(g, bed);
      else wrong = { th: 'แปลงนี้พรวนแล้ว', en: 'This bed is already dug' };
    } else if (used !== 'fork' && used !== 'can' && (look(plot) === 'ready' || weedy(plot))) {
      wrong = look(plot) === 'ready' ? text.useForkReady : text.useForkWeed;
    } else if (used === 'can') {
      if (plot.kind === 'crop' && look(plot) !== 'ready') { action = g => water(g, bed, at); effect = 'plop'; }
      else wrong = plot.kind === 'crop' ? text.useForkReady : { th: 'ใส่เมล็ดก่อน แล้วค่อยรดน้ำ', en: 'Sow seeds first' };
    } else if (used.startsWith('seed:')) {
      const crop = used.slice(5) as Crop;
      if (plot.kind === 'tilled') {
        if (!complete && !missing(farm, order.items)[crop]) {
          setCue(null);
          setReminderAt(at);
          if (reminding && !isSpeaking()) repeatRequest();
          return;
        }
        setReminderAt(null);
        action = g => sow(g, bed, crop, at);
        effect = 'plop';
      }
      else wrong = plot.kind === 'wild' ? { th: 'ดินยังแข็ง ใช้จอบพรวนก่อนนะ', en: 'Dig the soil with the hoe first' } : { th: 'แปลงนี้มีผักอยู่แล้ว', en: 'Something is already growing here' };
    } else {
      if (weedy(plot)) { action = g => pullWeed(g, bed, at); effect = 'pull'; }
      else if (look(plot) === 'ready') { action = g => harvest(g, bed, at); effect = 'pull'; }
      else wrong = { th: 'ยังไม่มีอะไรให้ถอน ส้อมพรวนใช้ตอนมีวัชพืชหรือผักโตแล้วนะ', en: 'Nothing to dig up yet. Use the fork for weeds and ripe vegetables.' };
    }
    if (wrong) { setCue(wrong); sound('wrong'); return; }
    setCue(null);
    sound(effect);
    void updateGarden(g => g.delivered === visitNumber && g.activeOrder === order.id ? action!(advanceAll(g, at)) : g);
  }, [farm, stage, lock, sound, visitNumber, order, complete, reminding, repeatRequest]);

  async function accept() {
    if (!talking || exchange !== 'ordering' || accepting.current) return;
    accepting.current = true;
    voice.retryOnGesture();
    try {
      let accepted = false;
      await updateGarden(g => {
        if (g.delivered !== visitNumber || request(g).id !== order.id) return g;
        const reason = beginRound();
        if (reason) { setBlocked(reason); return g; }
        accepted = true;
        return prepareOrder(g, order.id);
      });
      if (accepted) setStage('work');
    } finally { accepting.current = false; }
  }
  async function give() {
    if (stage !== 'work' || lock || selling.current) return;
    if (!complete) { setCue(text.needMore); sound('wrong'); return; }
    selling.current = true;
    onHold();
    let packed: Basket | undefined;
    const saved = await updateGarden(g => {
      if (g.delivered !== visitNumber) return g;
      packed = g.basket;
      return deliver(g, order);
    });
    if (!saved) { selling.current = false; onDone(); return; }
    await updateShop(shop => ({ ...shop, coins: shop.coins + order.reward }));
    finishRound();
    sound('coins');
    setSoldBasket(packed);
    setStage('thanks');
    if (enabled) playNarration(`/audio/th/garden/${visitor}-thanks.mp3`, { onEnded() {}, onStopped() {}, onFail() {} });
    window.setTimeout(onDone, 3200);
  }

  const pose: FriendPose = stage === 'thanks' ? 'cheer' : reminding || hint ? 'point' : stage === 'work' ? 'wait' : 'stand';
  const tools: Tool[] = ['hoe', ...seeds(farm).map(c => `seed:${c}` as Tool), 'can', 'fork'];
  const wishList = <ul className={css.wish} aria-label={text.wish[lang]}>
    {(Object.entries(order.items) as [Crop, number][]).map(([crop, n]) => {
      const have = stage === 'thanks' ? n : Math.min(n, farm.basket[crop]);
      return <li key={crop} data-done={have >= n || undefined}>
        <Image src={`/games/vip/garden/${crop}.webp`} alt="" width={36} height={36} />
        <span className="sr-only">{cropNames[crop][lang]} </span>{have}/{n}
      </li>;
    })}
  </ul>;
  const nextAction = step.task === 'sell' ? text.give
    : step.task === 'sow' ? text.sow(cropNames[step.crop]) : text[step.task];
  const status = stage === 'talk' ? (arrived ? text.talk : text.arriving)
    : stage === 'thanks' ? text.paid(order.reward) : complete ? nextAction : cue ?? (reminding ? ask : nextAction);

  return <>
    <section className={play.game} aria-label={text.title[lang]} data-garden-stage={stage} inert={!!lock}>
      <div className={`${play.rail} ${css.orderRail}`}>
        <div role="status" className={play.cue} data-garden-task={step.task}><Label text={status} /></div>
        {stage !== 'talk' && <div className={css.orderTicket}>
          {wishList}<span className={css.price}><ShopCoin /><span className="sr-only">{text.salePrice[lang]} </span>{order.reward}</span>
        </div>}
      </div>
      <GardenScene key={lock ?? 'open'} lang={lang} plots={plots} open={open} sprinkler={farm.sprinkler} working={stage === 'work' && !lock}
        tool={tool} tools={tools} onTool={next => { setTool(next); setCue(null); }} onApply={apply} onBlocked={setCue}
        guideTool={step.tool} guideBed={step.tool && step.tool === tool ? step.bed : -1} sowCrop={step.task === 'sow' ? step.crop : undefined}
        visitor={visitor} pose={pose} arrived={arrived} onArrival={() => setArrived(true)}
        requestedCrops={reminding ? lacking : undefined}
        soldItems={stage === 'thanks' ? soldBasket : undefined}
        onFriend={() => { if (stage === 'talk') setDeferred(false); else if (stage === 'work') give(); }}
        basket={farm.basket} canGive={stage === 'work' && complete} onGive={give} speaking={!!hint && hint.kind === want} onScrape={() => sound('scrape')} onLand={() => sound('basket')} />
      <div className={css.gardenOptions}>
        <button type="button" className={css.seedShop} aria-haspopup="dialog" onClick={() => { onHold(); setShelf(true); }} disabled={stage === 'thanks'}>
          <SeedShopIcon /><Label text={text.shop} />
        </button>
      </div>
    </section>
    {shelf && !lock && <GardenShop farm={farm} onClose={() => { setShelf(false); onDone(); }} onBought={() => sound('coins')} />}
    {talking && <CounterConversation key={exchange === 'ordering' ? 'ticket' : 'salam'} phase={exchange}
      speaker={answering ? text.you : friend.name} line={answering ? conversation[exchange] : greeting ? conversation.greeting : ask}
      enabled={voice.enabled} greeted={voice.greeted} needsTap={voice.needsTap} onHear={voice.hearGreeting} onListen={voice.listen}
      ticket={<>{wishList}<p className={styles.ticketPrice}><ShopCoin /><Label text={coinText(order.reward)} /></p></>}
      acceptText={text.accept} ticketTitle={text.wish}
      onReply={reply => setExchange(reply)} onAccept={accept} onDefer={() => {
        if (answering) setExchange('ordering');
        setDeferred(true);
      }} />}
    <LearningNotice />{lock && <LockScreen reason={lock} onClose={() => setBlocked(undefined)} />}
  </>;
}

export function GardenGame() {
  const { garden: farm } = useGarden();
  const { shop } = useShop();
  const sound = useSfx(sounds);
  // Finish shopping or handing over the basket before a different customer walks in.
  const [held, setHeld] = useState<string | null>(null);
  const current = held ?? `${farm.delivered}/${request(farm).id}`;
  return <main className={styles.page}><div className={styles.frame}>
    <header className={styles.shopTop}><LocaleLink href="/games/vip#garden" className={styles.back}><Label text={text.backMap} /></LocaleLink>
      <h1><Label text={text.title} /></h1>
      <div className={styles.shopTools}><SoundToggle /><GameFullscreenButton /><div className={styles.wallet}><ShopCoin /><strong>{shop.coins}</strong><Label text={vip.till} /></div></div>
    </header>
    <Visit key={current} farm={farm} sound={sound} onHold={() => setHeld(current)} onDone={() => setHeld(null)} />
  </div></main>;
}
