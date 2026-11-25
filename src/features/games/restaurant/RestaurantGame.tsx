'use client';

import { GameFullscreenButton } from '../components/GameViewport';
import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from 'react';
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
import { updateShop, useShop } from '../smoothie/store';
import play from '../smoothie/worktop.module.css';
import { cropNames } from '../garden/model';
import { Label } from '../vip/Labels';
import { vip } from '../vip/content';
import styles from '../vip/vip.module.css';
import lines from './lines.json';
import { dishById, dishes, meal, readLunch, RESTAURANT_KEY, reward, total, verdict, type Dish, type DishId, type Order, type Want } from './model';
import { lunch as text } from './text';
import css from './restaurant.module.css';

const sounds = {
  place: { file: '/audio/sfx/meet-friends/click.mp3', volume: 0.6 },
  good: { file: '/audio/sfx/correct.mp3', volume: 0.5 },
  wrong: { file: '/audio/sfx/wrong.mp3', volume: 0.4 },
  coins: { file: '/audio/sfx/smoothie-coins.mp3', volume: 0.95 },
};

/* Save: how many meals the child has finished. Same pattern as the other VIP saves. */
const changed = 'lu-restaurant-change';
function snapshot() { try { return localStorage.getItem(RESTAURANT_KEY); } catch { return null; } }
function subscribe(listener: () => void) {
  window.addEventListener('storage', listener); window.addEventListener(changed, listener);
  return () => { window.removeEventListener('storage', listener); window.removeEventListener(changed, listener); };
}
function saveLunch(eaten: number) {
  try { localStorage.setItem(RESTAURANT_KEY, JSON.stringify({ eaten })); } catch { /* play on without saving */ }
  window.dispatchEvent(new Event(changed));
}

/** Seat centres across the table for one, two or three friends (900 × 530 scene). */
const seatX: Record<number, number[]> = { 1: [421], 2: [220, 624], 3: [220, 421, 624] };
const WAITER = { x: 712, y: 120, size: 200 };
const MAT_Y = 440;

type Stage = 'choose' | 'cooking' | 'tasting' | 'paid';

function WantChip({ want }: { want: Want }) {
  const label: Text = want.kind === 'has' ? text.has(cropNames[want.crop]) : text[want.kind];
  return <li className={css.want} data-want={want.kind}>
    {want.kind === 'has' ? <Image src={`/games/vip/garden/${want.crop}.webp`} alt="" width={28} height={28} /> : <WantIcon kind={want.kind} />}
    <Label text={label} />
  </li>;
}
function WantIcon({ kind }: { kind: 'hot' | 'cold' | 'mild' | 'spicy' | 'big' | 'small' }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    {kind === 'hot' && <path d="M7 20q-3-4 0-8t0-8m5 16q-3-4 0-8t0-8m5 16q-3-4 0-8t0-8" fill="none" stroke="#e0602e" strokeWidth="2.4" strokeLinecap="round" />}
    {kind === 'cold' && <path d="M12 2v20M3.5 7l17 10M3.5 17l17-10M9 4l3 3 3-3M9 20l3-3 3 3" fill="none" stroke="#2b8ac2" strokeWidth="2.2" strokeLinecap="round" />}
    {(kind === 'spicy' || kind === 'mild') && <><path d="M6 19q10 2 13-11 1-3-2-3-2 6-11 10-2 2 0 4Z" fill="#e23b32" /><path d="M17 5q0-3 3-3" stroke="#3f8f45" strokeWidth="2.4" fill="none" /></>}
    {kind === 'mild' && <path d="M3 3l18 18" stroke="#2c3e50" strokeWidth="3" strokeLinecap="round" />}
    {kind === 'big' && <><ellipse cx="12" cy="13" rx="11" ry="6" fill="#fff" stroke="#6b7c85" strokeWidth="2" /><ellipse cx="12" cy="12" rx="6" ry="3" fill="#f0b45a" /></>}
    {kind === 'small' && <ellipse cx="12" cy="14" rx="6" ry="3.5" fill="#fff" stroke="#6b7c85" strokeWidth="2" />}
  </svg>;
}

function Table({ eaten, onHold, onDone, sound }: { eaten: number; onHold: () => void; onDone: () => void; sound: (s: keyof typeof sounds) => void }) {
  const lang = useLocale();
  const { enabled } = useSound();
  const [m] = useState(() => meal(eaten));
  const [order, setOrder] = useState<Order>(() => m.seats.map(() => null));
  const [heard, setHeard] = useState<boolean[]>(() => m.seats.map(() => false));
  const [picked, setPicked] = useState<DishId | null>(null);
  const [stage, setStage] = useState<Stage>('choose');
  const [happy, setHappy] = useState<(boolean | null)[]>(() => m.seats.map(() => null));
  const [swaps, setSwaps] = useState(0);
  const [cue, setCue] = useState<Text | null>(null);
  const [blocked, setBlocked] = useState<'time' | 'stars'>();
  const [round, setRound] = useState(false);
  const [ghost, setGhost] = useState<{ dish: DishId; x: number; y: number } | null>(null);
  const plane = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dish: DishId; id: number; x: number; y: number; moved: boolean } | null>(null);
  const timeLimit = usePlayLimit(round);
  const denial = useBlockedReason(blocked);
  const lock = timeLimit ? 'time' : denial;
  const xs = seatX[m.seats.length];
  const spent = total(order);
  const say = (clip: string) => { if (enabled) playNarration(`/audio/th/restaurant/${clip}.mp3`, { onEnded() {}, onStopped() {}, onFail() {} }); };

  useEffect(() => {
    // The waiter greets the table once; browsers that block sound before a tap simply skip it.
    const timer = window.setTimeout(() => { if (enabled) playNarration('/audio/th/restaurant/waiter-welcome.mp3', { onEnded() {}, onStopped() {}, onFail() {} }); }, 500);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  function ask(i: number) {
    say(m.seats[i].line);
    setHeard(h => h.map((v, j) => j === i ? true : v));
  }
  function place(i: number, dish: DishId | null) {
    if (stage !== 'choose' || lock) return;
    setOrder(o => o.map((v, j) => j === i ? dish : v));
    setHappy(h => h.map((v, j) => j === i ? null : v));
    if (dish) sound('place');
    setPicked(null);
    setCue(null);
  }
  function seatAt(clientX: number, clientY: number) {
    const box = plane.current?.getBoundingClientRect();
    if (!box) return -1;
    const x = (clientX - box.left) / box.width * 900, y = (clientY - box.top) / box.height * 530;
    if (y < 250 || y > 530) return -1;
    let best = -1, gap = 120;
    xs.forEach((sx, i) => { if (Math.abs(x - sx) < gap) { best = i; gap = Math.abs(x - sx); } });
    return best;
  }
  function cardDown(dish: DishId, e: ReactPointerEvent<HTMLButtonElement>) {
    if (stage !== 'choose') return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* fine */ }
    drag.current = { dish, id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
  }
  function cardMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 10) return;
    if (!d.moved && Math.abs(e.clientX - d.x) > Math.abs(e.clientY - d.y)) { drag.current = null; return; }
    d.moved = true;
    setGhost({ dish: d.dish, x: e.clientX, y: e.clientY });
  }
  function cardUp(e: ReactPointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    drag.current = null;
    setGhost(null);
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) { setPicked(d.dish); setCue(text.chosen(dishById[d.dish].name)); return; }
    const seat = seatAt(e.clientX, e.clientY);
    if (seat >= 0) place(seat, d.dish);
  }

  function submit() {
    if (stage !== 'choose' || lock || order.some(d => !d)) return;
    if (spent > m.budget) { say('waiter-broke'); sound('wrong'); setCue(lines.waiter.broke); return; }
    if (!round) {
      const reason = beginRound();
      if (reason) { setBlocked(reason); return; }
      setRound(true);
    }
    say('waiter-ok');
    setStage('cooking');
  }
  // Cooking, then each friend tastes in turn and says whether it is what they wanted.
  useEffect(() => {
    if (stage === 'cooking') {
      const timer = window.setTimeout(() => setStage('tasting'), 2200);
      return () => window.clearTimeout(timer);
    }
    if (stage !== 'tasting') return;
    const result = verdict(m, order);
    const next = happy.findIndex(v => v === null);
    if (next === -1) {
      // A short pause after the last friend has tasted, then pay or send plates back.
      const timer = window.setTimeout(() => {
        if (result.every(Boolean)) {
          const coins = reward(m, spent, swaps);
          onHold();
          void updateShop(shop => ({ ...shop, coins: shop.coins + coins })).then(() => {
            finishRound(); setRound(false); sound('coins'); setStage('paid'); setCue(text.done(coins));
            saveLunch(eaten + 1);
          });
        } else {
          // Wrong plates go back to the kitchen. The child chooses again for those friends.
          say('waiter-swap');
          setSwaps(s => s + result.filter(v => !v).length);
          setOrder(o => o.map((d, i) => result[i] ? d : null));
          setStage('choose');
          setCue(text.fix);
        }
      }, 1800);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      const good = result[next];
      const diner = m.seats[next].diner;
      sound(good ? 'good' : 'wrong');
      say(`${diner}-${good ? 'yum' : 'oops'}`);
      setHappy(h => h.map((v, i) => i === next ? good : v));
    }, next === 0 ? 400 : 2300);
    return () => window.clearTimeout(timer);
  }, [stage, happy, m, order, spent, swaps, eaten, sound]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (stage !== 'paid') return;
    const timer = window.setTimeout(onDone, 3600);
    return () => window.clearTimeout(timer);
  }, [stage, onDone]);

  const status = cue ?? (stage === 'cooking' ? text.cooking : stage === 'tasting' ? text.tasting
    : heard.some(h => !h) ? text.ask : text.pick);
  const showFood = stage === 'tasting' || stage === 'paid';
  return <>
    <section className={play.game} aria-label={text.title[lang]} data-lunch-stage={stage} inert={!!lock}>
      <div className={play.rail}>
        <div role="status" className={play.cue}><Label text={status} /></div>
        <p className={css.purse} data-over={spent > m.budget || undefined}>
          <ShopCoin /><span><Label text={text.money(m.budget)} /><br /><Label text={text.spent(spent, m.budget)} /></span>
        </p>
      </div>
      <div className={css.window}><div className={css.plane} ref={plane}>
        <svg className={css.scene} viewBox="0 0 900 530" role="img" aria-label={text.scene[lang]}>
          <rect width="900" height="530" fill="#bfe6ef" />
          <image href="/games/vip/restaurant-bg/bg.webp" width="900" height="530" preserveAspectRatio="xMidYMid slice" />
          <image href={`/Character/friends/rassam${stage === 'cooking' ? '-action' : stage === 'paid' ? '-cheer' : ''}.webp`}
            x={stage === 'cooking' || stage === 'tasting' ? WAITER.x - 60 : WAITER.x} y={WAITER.y} width={WAITER.size} height={WAITER.size}
            className={css.waiter} />
          {m.seats.map((seat, i) => {
            const pose = happy[i] === true ? '-cheer' : happy[i] === false ? '-think' : !heard[i] ? '' : '-point';
            return <image key={seat.diner} href={`/Character/friends/${seat.diner}${pose}.webp`} x={xs[i] - 105} y="118" width="210" height="210" />;
          })}
          {m.seats.map((seat, i) => <g key={i} transform={`translate(${xs[i]} ${MAT_Y})`}>
            <ellipse rx="96" ry="40" fill="#fffaf0" opacity=".85" stroke={happy[i] === false ? '#e23b32' : '#c8a36e'} strokeWidth="4"
              strokeDasharray={order[i] ? undefined : '12 9'} />
            {order[i] && <image href={`/games/vip/restaurant/${order[i]}.webp`} x={showFood ? -78 : -62} y={showFood ? -98 : -80}
              width={showFood ? 156 : 124} height={showFood ? 156 : 124} opacity={showFood ? 1 : .55} />}
          </g>)}
        </svg>
        <div className={css.targets}>
          {m.seats.map((seat, i) => {
            const name = FRIENDS[seat.diner].name;
            const dish = order[i] ? dishById[order[i]!].name[lang] : text.empty[lang];
            return <div key={i}>
              <button type="button" className={css.friend} data-seat-friend={i} style={{ left: `${xs[i] / 9}%`, top: `${220 / 5.3}%` }}
                aria-label={text.ask1(name)[lang]} onClick={() => ask(i)} />
              <button type="button" className={css.mat} data-seat={i} disabled={stage !== 'choose'}
                style={{ left: `${xs[i] / 9}%`, top: `${MAT_Y / 5.3}%` }}
                aria-label={`${text.place(name)[lang]}: ${dish}`}
                onClick={() => picked ? place(i, picked) : order[i] ? place(i, null) : setCue(text.pick)} />
            </div>;
          })}
        </div>
        {m.seats.map((seat, i) => heard[i] && <ul key={i} className={css.wish} style={{ left: `${xs[i] / 9}%` }}
          aria-label={FRIENDS[seat.diner].name[lang]}>
          {seat.wants.map((w, j) => <WantChip key={j} want={w} />)}
        </ul>)}
      </div></div>
      <div className={css.menuBar}>
        <h2><Label text={text.menu} /></h2>
        <button type="button" className={styles.primary} disabled={stage !== 'choose' || order.some(d => !d)} onClick={submit}>
          <Label text={text.order} />
        </button>
      </div>
      <ul className={css.menu}>
        {dishes.map(dish => <li key={dish.id}><DishCard dish={dish} lang={lang} picked={picked === dish.id} disabled={stage !== 'choose'}
          onDown={e => cardDown(dish.id, e)} onMove={cardMove} onUp={cardUp} onCancel={() => { drag.current = null; setGhost(null); }}
          onKey={() => { setPicked(dish.id); setCue(text.chosen(dish.name)); }} /></li>)}
      </ul>
    </section>
    {ghost && <Image className={css.ghost} src={`/games/vip/restaurant/${ghost.dish}.webp`} alt="" width={110} height={110}
      style={{ left: ghost.x, top: ghost.y }} />}
    <LearningNotice />{lock && <LockScreen reason={lock} onClose={() => setBlocked(undefined)} />}
  </>;
}

function DishCard({ dish, lang, picked, disabled, onDown, onMove, onUp, onCancel, onKey }: {
  dish: Dish; lang: 'th' | 'en'; picked: boolean; disabled: boolean;
  onDown: (e: ReactPointerEvent<HTMLButtonElement>) => void; onMove: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onUp: (e: ReactPointerEvent<HTMLButtonElement>) => void; onCancel: () => void; onKey: () => void;
}) {
  const tags: { kind: 'hot' | 'cold' | 'spicy' | 'big' | 'small'; label: Text }[] = [
    dish.hot ? { kind: 'hot', label: text.hot } : { kind: 'cold', label: text.cold },
    ...(dish.spicy ? [{ kind: 'spicy' as const, label: text.spicy }] : []),
    dish.big ? { kind: 'big', label: text.big } : { kind: 'small', label: text.small },
  ];
  const summary = [dish.name[lang], text.price(dish.price)[lang], ...tags.map(t => t.label[lang]), ...dish.has.map(c => cropNames[c][lang])].join(' · ');
  return <button type="button" className={css.card} aria-pressed={picked} disabled={disabled} aria-label={summary} data-dish={dish.id}
    onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel} onClick={e => { if (e.detail === 0) onKey(); }}>
    <Image src={`/games/vip/restaurant/${dish.id}.webp`} alt="" width={96} height={96} />
    <strong><Label text={dish.name} /></strong>
    <span className={css.price}><ShopCoin />{dish.price}</span>
    <span className={css.tags} aria-hidden="true">{tags.map(t => <span key={t.kind}><WantIcon kind={t.kind} />{t.label[lang]}</span>)}</span>
    <span className={css.has} aria-hidden="true">{dish.has.map(c => <Image key={c} src={`/games/vip/garden/${c}.webp`} alt="" width={22} height={22} />)}</span>
  </button>;
}

export function RestaurantGame() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const { eaten } = readLunch(raw);
  const { shop } = useShop();
  const sound = useSfx(sounds);
  const [held, setHeld] = useState<number | null>(null);
  // Keep the finished table on screen until the thank-you is over.
  const current = held ?? eaten;
  return <main className={styles.page}><div className={styles.frame}>
    <header className={styles.shopTop}><LocaleLink href="/games/vip#restaurant" className={styles.back}><Label text={text.backMap} /></LocaleLink>
      <h1><Label text={text.title} /></h1>
      <div className={styles.shopTools}><SoundToggle /><GameFullscreenButton /><div className={styles.wallet}><ShopCoin /><strong>{shop.coins}</strong><Label text={vip.till} /></div></div>
    </header>
    <Table key={current} eaten={current} sound={sound} onHold={() => setHeld(eaten)} onDone={() => setHeld(null)} />
  </div></main>;
}
