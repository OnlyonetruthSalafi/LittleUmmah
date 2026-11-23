'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ShopCoin } from '@/components/icons/ShopCoin';
import { SoundToggle } from '@/components/sound/SoundToggle';
import { useSound } from '@/components/sound/SoundProvider';
import { LocaleLink, useLocale } from '@/i18n/LocaleProvider';
import type { Text } from '@/i18n/config';
import { FRIENDS } from '@/lib/friends';
import { playNarration } from '@/lib/speech';
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
import { GardenScene, type FriendPose, type Tool } from './GardenScene';
import { GardenShop } from './GardenShop';
import lines from './lines.json';
import {
  advance, advanceAll, cropNames, deliver, harvest, look, missing, openBeds, pullWeed, request, seeds, sow, thirsty, till,
  water, weedy, type Crop, type Garden,
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
  const visitor = order.visitor;
  const friend = FRIENDS[visitor];
  const [arrived, setArrived] = useState(false);
  const [exchange, setExchange] = useState<Exchange>('greeting');
  const [deferred, setDeferred] = useState(false);
  const [stage, setStage] = useState<Stage>('talk');
  const [tool, setTool] = useState<Tool | null>(null);
  const [cue, setCue] = useState<Text | null>(null);
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

  const talking = arrived && stage === 'talk' && !deferred && !lock && !shelf;
  const answering = exchange === 'reply' || exchange === 'replyLong';
  const greeting = exchange !== 'ordering';
  const ask = lines.requests[order.id as keyof typeof lines.requests];
  const clip = greeting ? `/audio/th/smoothie/${visitor}-shop-salam.mp3` : `/audio/th/garden/${visitor}-${order.id}.mp3`;
  const voice = useOrderVoice(clip, (greeting ? conversation.greeting : ask)[lang], lang, !lock && talking, greeting);
  useEffect(() => {
    if (!talking || !answering) return;
    const timer = window.setTimeout(() => setExchange('ordering'), voice.enabled ? 1800 : 1200);
    return () => window.clearTimeout(timer);
  }, [talking, answering, voice.enabled]);

  const lacking = missing(farm, order.items);
  const complete = Object.keys(lacking).length === 0;

  /* The friend notices what the garden needs and says so, once in a while. */
  const want: Hint | null = stage !== 'work' ? null
    : plots.slice(0, open).some(weedy) ? 'weed'
    : plots.slice(0, open).some(p => thirsty(p, farm.sprinkler) && p.kind === 'crop') ? 'water'
    : plots.slice(0, open).some(p => look(p) === 'ready' && p.kind === 'crop' && (lacking[p.crop] ?? 0) > 0) ? 'ready'
    : null;
  useEffect(() => {
    if (!want || lock) return;
    const last = spoken.current[want] ?? 0;
    if (Date.now() - last < 15000) return;
    const timer = window.setTimeout(() => {
      spoken.current[want] = Date.now();
      setHint({ kind: want, at: Date.now() });
      if (enabled) playNarration(`/audio/th/garden/${visitor}-${want}.mp3`, { onEnded() {}, onStopped() {}, onFail() {} });
    }, want === 'water' ? 4000 : 1600);
    return () => window.clearTimeout(timer);
  }, [want, lock, enabled, visitor]);
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
      else wrong = plot.kind === 'crop' ? { th: 'ผักโตแล้ว ไม่ต้องรดน้ำ ดึงขึ้นมาได้เลย', en: 'It’s ready, pull it up' } : { th: 'ใส่เมล็ดก่อน แล้วค่อยรดน้ำ', en: 'Sow seeds first' };
    } else if (used.startsWith('seed:')) {
      const crop = used.slice(5) as Crop;
      if (plot.kind === 'tilled') { action = g => sow(g, bed, crop, at); effect = 'plop'; }
      else wrong = plot.kind === 'wild' ? { th: 'ดินยังแข็ง ใช้จอบพรวนก่อนนะ', en: 'Dig the soil with the hoe first' } : { th: 'แปลงนี้มีผักอยู่แล้ว', en: 'Something is already growing here' };
    } else {
      if (weedy(plot)) { action = g => pullWeed(g, bed, at); effect = 'pull'; }
      else if (look(plot) === 'ready') { action = g => harvest(g, bed, at); effect = 'pull'; }
      else wrong = { th: 'ยังไม่มีอะไรให้ถอน ส้อมพรวนใช้ตอนมีวัชพืชหรือผักโตแล้วนะ', en: 'Nothing to dig up yet. Use the fork for weeds and ripe vegetables.' };
    }
    if (wrong) { setCue(wrong); sound('wrong'); return; }
    setCue(null);
    sound(effect);
    void updateGarden(g => action!(advanceAll(g, at)));
  }, [farm, stage, lock, sound]);

  function accept() {
    if (!talking || exchange !== 'ordering') return;
    const reason = beginRound();
    if (reason) { setBlocked(reason); return; }
    voice.retryOnGesture();
    setStage('work');
    setTool(farm.plots.some(p => p.kind === 'wild') ? 'hoe' : null);
  }
  function give() {
    if (stage !== 'work' || lock) return;
    if (!complete) { setCue(text.needMore); sound('wrong'); return; }
    onHold();
    void updateGarden(g => deliver(g, order)).then(saved => {
      if (!saved) return;
      void updateShop(shop => ({ ...shop, coins: shop.coins + order.reward }));
      finishRound();
      sound('coins');
      setStage('thanks');
      setCue(text.paid(order.reward));
      if (enabled) playNarration(`/audio/th/garden/${visitor}-thanks.mp3`, { onEnded() {}, onStopped() {}, onFail() {} });
      window.setTimeout(onDone, 3200);
    });
  }

  const pose: FriendPose = stage === 'thanks' ? 'cheer' : hint ? 'point' : stage === 'work' ? 'wait' : 'stand';
  const tools: Tool[] = ['hoe', ...seeds(farm).map(c => `seed:${c}` as Tool), 'can', 'fork'];
  const wishList = <ul className={css.wish} aria-label={text.wish[lang]}>
    {(Object.entries(order.items) as [Crop, number][]).map(([crop, n]) => {
      const have = Math.min(n, farm.basket[crop]);
      return <li key={crop} data-done={have >= n || undefined}>
        <Image src={`/games/vip/garden/${crop}.webp`} alt="" width={36} height={36} />
        <span className="sr-only">{cropNames[crop][lang]} </span>{have}/{n}
      </li>;
    })}
  </ul>;
  const hintText = hint ? { th: (visitor === 'safi' ? lines.hints[hint.kind].safi : lines.hints[hint.kind].th), en: lines.hints[hint.kind].en } : null;
  const status = stage === 'talk' ? (arrived ? text.talk : text.arriving)
    : cue ?? (hintText ? { th: friend.name.th + ': ' + hintText.th, en: friend.name.en + ': ' + hintText.en } : complete ? text.give : text.pickTool);

  return <>
    <section className={play.game} aria-label={text.title[lang]} data-garden-stage={stage} inert={!!lock}>
      <div className={play.rail}>
        <div role="status" className={play.cue}><Label text={status} /></div>
        {stage !== 'talk' && wishList}
        <button type="button" className={`${play.tool} ${css.hintToggle}`} aria-pressed={farm.hints}
          onClick={() => void updateGarden(g => ({ ...g, hints: !g.hints }))}>
          <span className={css.hintMark} aria-hidden="true">1</span><Label text={text.hintsOn} />
          <span className={css.hintState}><Label text={farm.hints ? { th: 'เปิด', en: 'On' } : { th: 'ปิด', en: 'Off' }} /></span>
        </button>
        <button type="button" className={play.tool} onClick={() => setShelf(true)} disabled={stage === 'thanks'}>
          <Label text={text.shop} />
        </button>
      </div>
      <GardenScene lang={lang} plots={plots} open={open} sprinkler={farm.sprinkler} working={stage === 'work' && !lock}
        tool={tool} tools={tools} onTool={setTool} onApply={apply} onBlocked={setCue}
        visitor={visitor} pose={pose} arrived={arrived} onArrival={() => setArrived(true)}
        onFriend={() => { if (stage === 'talk') setDeferred(false); else if (stage === 'work') give(); }}
        basket={farm.basket} canGive={stage === 'work' && complete} onGive={give} speaking={!!hint} hints={farm.hints} onScrape={() => sound('scrape')} onLand={() => sound('basket')} />
    </section>
    {shelf && !lock && <GardenShop farm={farm} onClose={() => setShelf(false)} onBought={() => sound('coins')} />}
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
  // A new friend comes after the thank-you, not the moment the basket changes hands.
  const [held, setHeld] = useState<number | null>(null);
  const current = held ?? farm.delivered;
  return <main className={styles.page}><div className={styles.frame}>
    <header className={styles.shopTop}><LocaleLink href="/games/vip#garden" className={styles.back}><Label text={text.backMap} /></LocaleLink>
      <h1><Label text={text.title} /></h1>
      <div className={styles.shopTools}><SoundToggle /><div className={styles.wallet}><ShopCoin /><strong>{shop.coins}</strong><Label text={vip.till} /></div></div>
    </header>
    <Visit key={current} farm={farm} sound={sound} onHold={() => setHeld(farm.delivered)} onDone={() => setHeld(null)} />
  </div></main>;
}
