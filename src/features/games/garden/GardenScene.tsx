'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { HandTapIcon } from '@/components/icons/HandTapIcon';
import type { Locale, Text } from '@/i18n/config';
import { cropNames, look, thirsty, weedy, type Basket, type Crop, type Plot, type Tool, type Visitor } from './model';
import { Bed, Weed, YoungPlant } from './Plants';
import { bedName, bedState, garden as text } from './text';
import styles from './garden.module.css';

export type FriendPose = 'stand' | 'point' | 'wait' | 'cheer';

/** Bed centres and depth scale in the 900 × 530 scene. Beds 1–3 are the front row. */
export const beds: [x: number, y: number, s: number][] = [
  [175, 458, .88], [390, 458, .88], [605, 458, .88], [215, 352, .74], [395, 352, .74], [575, 352, .74],
];
const FRIEND = { x: 640, y: 96, size: 220 };
const friendZone = { x: 750, y: 210, w: 200, h: 230 };
const BASKET = { x: 765, y: 468 };
// Position of the raised claw on each mirrored thank-you sprite, in scene coordinates.
const grip: Record<Visitor, [number, number]> = { hadi: [703, 163], safi: [699, 221], sabir: [668, 147] };
const carrySize = 92;
const TILL_DISTANCE = 240;
const WATER_HOLD = 650;

const art = (name: string) => `/games/vip/garden/${name}.webp`;
export const toolArt = (tool: Tool) => tool === 'hoe' ? art('hoe') : tool === 'can' ? art('watering-can')
  : tool === 'fork' ? art('hand-fork') : art(tool.slice(5));
/** Scrubbing this far (scene units) kicks up a clump of soil and a scrape sound. */
const SCRAPE_EVERY = 55;
type Burst = { id: number; x: number; y: number; big: boolean };
type Flight = { id: number; crop: Crop; x: number; y: number };
const FLIGHT_MS = 750;
/** Where each vegetable sits in the basket, back row first (percent of the basket box). */
const PILE: [x: number, y: number, turn: number][] = [[34, 40, -12], [66, 40, 14], [50, 36, -4], [30, 50, -10], [50, 52, 6], [70, 50, 18], [42, 58, -4], [58, 58, 10]];

type BedAction = 'dig' | 'sow' | 'water' | 'weed' | 'harvest' | 'grow';
const signArt = { dig: 'hoe', sow: 'seed-sack', water: 'watering-can', weed: 'hand-fork', harvest: 'hand-fork' };

function BedSign({ bed, action, crop }: { bed: number; action: BedAction; crop?: Crop }) {
  const edge = action === 'weed' ? '#387147' : action === 'water' ? '#25688a' : '#795129';
  const position = action === 'dig' || action === 'sow' ? 'translate(-50 -35)' : 'translate(68 -70)';
  return <g transform={position + ' scale(1.25)'} aria-hidden="true" pointerEvents="none" data-bed-sign={action} data-for-bed={bed}>
    <path d="m-8 21 8 13 8-13" fill="#fff8df" stroke={edge} strokeWidth="3" strokeLinejoin="round" />
    <circle r="28" fill="#fff8df" stroke={edge} strokeWidth="3" />
    {action === 'grow' ? <g stroke="#795129" strokeWidth="3" strokeLinejoin="round">
      <path d="M-11-15h22c0 8-3 11-9 15 6 4 9 7 9 15h-22c0-8 3-11 9-15-6-4-9-7-9-15Z" fill="#e6f5f4" />
      <path d="m-6-9 6 6 6-6Zm0 21 6-7 6 7Z" fill="#bb7928" stroke="none" />
    </g> : <image href={art(signArt[action])} x={action === 'harvest' ? -14 : -24} y="-24" width={action === 'harvest' ? 38 : 48} height="48" />}
    {action === 'sow' && crop && <image href={art(crop)} x="-12" y="-3" width="24" height="24" />}
    {action === 'harvest' && crop && <image href={art(crop)} x="-25" y="-4" width="29" height="29" />}
  </g>;
}

// Top of each pointing sprite's head in scene coordinates (the flying customer sits lower).
const headTop: Record<Visitor, number> = { hadi: 112, safi: 201, sabir: 138 };
function CustomerRequestSign({ items, visitor }: { items: Partial<Basket>; visitor: Visitor }) {
  const vegetables = (Object.entries(items) as [Crop, number][]).flatMap(([crop, count]) => Array<Crop>(count).fill(crop));
  const width = vegetables.length * 48 + 16;
  const head = FRIEND.x + FRIEND.size / 2;
  // Keep a mixed order inside the phone crop, with the pointer still above the customer.
  const left = Math.min(head - width / 2, 810 - width);
  const pointer = head - left;
  return <g transform={`translate(${left} ${headTop[visitor] - 82})`} pointerEvents="none" aria-hidden="true" data-customer-request="">
    <rect width={width} height="64" rx="32" fill="#fff8df" stroke="#25688a" strokeWidth="3" />
    <path d={`M${pointer - 9} 62l9 13 9-13`} fill="#fff8df" stroke="#25688a" strokeWidth="3" strokeLinejoin="round" />
    {vegetables.map((crop, i) => <image key={crop + i} href={art(crop)} data-request-crop={crop} x={8 + 48 * i} y="8" width="48" height="48" />)}
  </g>;
}

function BasketArt({ items = {}, flights = [] }: { items?: Partial<Basket>; flights?: Flight[] }) {
  const pile = (Object.entries(items) as [Crop, number][]).flatMap(([crop, count]) => {
    const landed = count - flights.filter(f => f.crop === crop).length;
    return Array<Crop>(Math.min(PILE.length, Math.max(0, landed))).fill(crop);
  }).slice(0, PILE.length);
  return <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
    <image href={art('basket')} width="100" height="100" />
    <g className={styles.pile}>
      {pile.map((crop, i) => {
        const [x, y, turn] = PILE[i];
        return <image key={i} data-crop={crop} href={art(crop)} x={x - 19} y={y - 19} width="38" height="38" transform={`rotate(${turn} ${x} ${y})`} />;
      })}
    </g>
  </svg>;
}

function pct(x: number, y: number, w?: number, h?: number): CSSProperties {
  return { left: `${x / 9}%`, top: `${y / 5.3}%`, ...(w ? { width: `max(64px,${w / 9}%)` } : {}), ...(h ? { height: `max(64px,${h / 5.3}%)` } : {}) };
}
/** Which open bed (if any) a scene point is over, including the plant standing on it. */
function bedAt(x: number, y: number, open: number) {
  for (let i = 0; i < open; i++) {
    const [cx, cy, s] = beds[i];
    if (Math.abs(x - cx) < 108 * s && y > cy - 90 * s && y < cy + 36 * s) return i;
  }
  return -1;
}

type Props = {
  lang: Locale; plots: Plot[]; open: number; sprinkler: boolean; working: boolean;
  tool: Tool | null; tools: Tool[]; onTool: (tool: Tool | null) => void;
  guideTool?: Tool; guideBed: number; sowCrop?: Crop;
  onApply: (bed: number, tool: Tool) => void; onBlocked: (message: Text) => void;
  visitor: Visitor; pose: FriendPose; arrived: boolean; onArrival: () => void; onFriend: () => void;
  soldItems?: Partial<Basket>;
  requestedCrops?: Partial<Basket>;
  basket: Record<Crop, number>; canGive: boolean; onGive: () => Promise<void>; speaking: boolean; onScrape: () => void; onLand: () => void;
};

export function GardenScene(p: Props) {
  const plane = useRef<HTMLDivElement>(null);
  const drag = useRef<{ tool: Tool; id: number; x: number; y: number; moved: boolean; bed: number; progress: number; scrape: number; last: [number, number]; timer?: number } | null>(null);
  useEffect(() => () => { window.clearInterval(drag.current?.timer); drag.current = null; }, [p.working]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);
  /** Soil flying up from the hoe: a small clump while scrubbing, a big puff when the bed is dug. */
  function burst(x: number, y: number, big: boolean) {
    const id = ++burstId.current;
    setBursts(list => [...list.slice(-6), { id, x, y, big }]);
    window.setTimeout(() => setBursts(list => list.filter(b => b.id !== id)), big ? 900 : 650);
  }
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bump, setBump] = useState(0);
  /** The fork used on a bed: a ripe vegetable (with no weed in the way) flies up in an arc and lands in the basket. */
  function fork(bed: number) {
    const plot = p.plots[bed];
    if (p.working && plot.kind === 'crop' && !weedy(plot) && look(plot) === 'ready') {
      const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (still) p.onLand();
      else {
        const [x, y, s] = beds[bed];
        const id = ++burstId.current;
        setFlights(list => [...list, { id, crop: plot.crop, x, y: y - 60 * s }]);
      }
    }
    p.onApply(bed, 'fork');
  }
  function landed(id: number) {
    setFlights(list => list.filter(f => f.id !== id));
    setBump(n => n + 1);
    p.onLand();
  }
  /** Fly a vegetable image from its bed to the basket mouth with the Web Animations API. */
  function launch(el: HTMLImageElement | null, f: Flight) {
    if (!el || el.dataset.flying) return;
    el.dataset.flying = '1';
    const box = plane.current!.getBoundingClientRect();
    const dx = (BASKET.x - f.x) / 900 * box.width, dy = (BASKET.y - 22 - f.y) / 530 * box.height;
    const lift = Math.max(60, box.height * .22);
    el.animate([
      { transform: 'translate(-50%, -50%) translate(0, 0) scale(1) rotate(0)' },
      { transform: `translate(-50%, -50%) translate(${dx * .45}px, ${dy * .45 - lift}px) scale(1.25) rotate(-25deg)`, offset: .45 },
      { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(.8) rotate(-40deg)` },
    ], { duration: FLIGHT_MS, easing: 'cubic-bezier(.3,.1,.5,1)', fill: 'forwards' }).finished.then(() => landed(f.id), () => landed(f.id));
  }
  const dig = (bed: number) => { const [x, y, s] = beds[bed]; burst(x, y - 6 * s, true); p.onApply(bed, 'hoe'); };
  const [ghost, setGhost] = useState<{ tool: Tool; x: number; y: number; bed: number; progress: number } | null>(null);
  const [lift, setLift] = useState<{ bed: number; dy: number } | null>(null);
  const [basketAt, setBasketAt] = useState<[number, number] | null>(null);
  const basketDrag = useRef<{ id: number; x: number; y: number } | null>(null);
  const basketMoved = useRef(false);
  const [droppedAt, setDroppedAt] = useState<[number, number] | null>(null);
  const pull = useRef<{ id: number; bed: number; y: number; moved: boolean } | null>(null);
  const wasPulled = useRef(-1);

  const scene = (clientX: number, clientY: number): [number, number] => {
    const box = plane.current!.getBoundingClientRect();
    return [(clientX - box.left) / box.width * 900, (clientY - box.top) / box.height * 530];
  };

  /* ----- dragging a tool from the shelf onto the beds ----- */
  function toolDown(tool: Tool, e: ReactPointerEvent<HTMLButtonElement>) {
    if (!p.working || drag.current) return;
    if (e.pointerType === 'mouse') e.preventDefault(); // no text selection or native image drag; focus stays for keyboard users
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* moves still arrive over the button */ }
    drag.current = { tool, id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, bed: -1, progress: 0, scrape: 0, last: scene(e.clientX, e.clientY) };
  }
  function toolMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
    d.moved = true;
    const [x, y] = scene(e.clientX, e.clientY);
    const bed = bedAt(x, y, p.open);
    if (bed !== d.bed) {
      d.bed = bed; d.progress = 0; d.scrape = 0; d.last = [x, y];
      window.clearInterval(d.timer); d.timer = undefined;
    }
    if (bed >= 0 && d.tool === 'hoe' && p.plots[bed].kind === 'wild') {
      // Scrubbing back and forth digs the bed.
      const step = Math.hypot(x - d.last[0], y - d.last[1]);
      d.progress += step; d.scrape += step;
      if (d.progress >= TILL_DISTANCE) { dig(bed); d.progress = 0; d.scrape = 0; }
      else if (d.scrape >= SCRAPE_EVERY) { d.scrape = 0; burst(x, y + 18, false); p.onScrape(); }
    }
    if (bed >= 0 && d.tool === 'can' && !d.timer) {
      // Holding the can over a bed pours until the soil is soaked.
      d.timer = window.setInterval(() => {
        const now = drag.current;
        if (!now || now.bed < 0) return;
        now.progress += 100;
        if (now.progress >= WATER_HOLD) { p.onApply(now.bed, 'can'); now.progress = 0; }
        setGhost(g => g && { ...g, progress: now.progress / WATER_HOLD });
      }, 100);
    }
    d.last = [x, y];
    setGhost({ tool: d.tool, x, y, bed, progress: d.tool === 'hoe' ? d.progress / TILL_DISTANCE : d.progress / WATER_HOLD });
  }
  function toolUp(e: ReactPointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    window.clearInterval(d.timer);
    drag.current = null;
    setGhost(null);
    if (!d.moved) { p.onTool(d.tool); return; }
    p.onTool(d.tool);
    if (d.bed >= 0 && d.tool === 'fork') fork(d.bed);
    else if (d.bed >= 0 && d.tool.startsWith('seed:')) p.onApply(d.bed, d.tool);
  }
  function toolCancel() { if (drag.current) window.clearInterval(drag.current.timer); drag.current = null; setGhost(null); }

  /* ----- pulling a ready vegetable or a weed straight up ----- */
  function bedDown(i: number, e: ReactPointerEvent<HTMLButtonElement>) {
    const plot = p.plots[i];
    if (!p.working || p.tool !== 'fork' || !(weedy(plot) || look(plot) === 'ready')) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* fine */ }
    pull.current = { id: e.pointerId, bed: i, y: e.clientY, moved: false };
  }
  function bedMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const d = pull.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = Math.min(0, scene(0, e.clientY)[1] - scene(0, d.y)[1]);
    if (dy < -6) d.moved = true;
    setLift({ bed: d.bed, dy: Math.max(-70, dy) });
  }
  function bedUp(i: number, e: ReactPointerEvent<HTMLButtonElement>) {
    const d = pull.current;
    pull.current = null;
    setLift(null);
    if (d && d.id === e.pointerId && d.moved) {
      wasPulled.current = i;
      if (scene(0, e.clientY)[1] - scene(0, d.y)[1] < -40) fork(i);
    }
  }
  function bedClick(i: number, e: ReactMouseEvent) {
    if (e.detail > 0 && wasPulled.current === i) { wasPulled.current = -1; return; }
    if (!p.working) { p.onBlocked(text.wait); return; }
    if (i >= p.open) { p.onBlocked(text.locked); return; }
    if (!p.tool) { p.onBlocked(p.plots[i].kind === 'wild' ? text.dig : text.pickFirst); return; }
    if (p.tool === 'hoe' && p.plots[i].kind === 'wild') { dig(i); return; }
    if (p.tool === 'fork') { fork(i); return; }
    p.onApply(i, p.tool);
  }

  /* ----- handing the basket to the friend ----- */
  function overFriend(clientX: number, clientY: number) {
    const [x, y] = scene(clientX, clientY);
    return Math.abs(x - friendZone.x) < friendZone.w / 2 + 30 && Math.abs(y - friendZone.y) < friendZone.h / 2 + 30;
  }

  const ready = (plot: Plot) => look(plot);
  const [handX, handY] = grip[p.visitor];
  const heldX = handX - carrySize / 2, heldY = handY - carrySize * .07;
  return <div className={styles.window}><div className={styles.plane} ref={plane}>
    <svg className={styles.scene} viewBox="0 0 900 530" role="img" aria-label={text.scene[p.lang]}>
      <rect width="900" height="530" fill="#9fd98a" />
      <image href="/games/vip/garden-bg/bg.webp" width="900" height="530" preserveAspectRatio="xMidYMid slice" />
      <g className={p.soldItems ? styles.departing : p.arrived ? undefined : styles.arriving} onAnimationEnd={e => { if (!p.arrived && e.target === e.currentTarget) p.onArrival(); }}>
        <ellipse cx={FRIEND.x + FRIEND.size / 2} cy={FRIEND.y + FRIEND.size * .95} rx="62" ry="11" fill="#2f5a2c" opacity=".25" />
        {/* The friend art faces right; mirrored, the friend turns toward the beds and points at them. */}
        <image href={`/Character/friends/${p.visitor}${p.pose === 'stand' ? '' : '-' + p.pose}.webp`}
          x={FRIEND.x} y={FRIEND.y} width={FRIEND.size} height={FRIEND.size}
          transform={`translate(${2 * FRIEND.x + FRIEND.size} 0) scale(-1 1)`} />
        {p.soldItems && <g className={styles.handoff} data-basket="carried" style={{
          '--from-x': `${(droppedAt?.[0] ?? BASKET.x) - handX}px`,
          '--from-y': `${(droppedAt?.[1] ?? BASKET.y) - (heldY + carrySize / 2)}px`,
        } as CSSProperties}>
          <svg x={heldX} y={heldY} width={carrySize} height={carrySize}><BasketArt items={p.soldItems} /></svg>
        </g>}
        {p.requestedCrops && <CustomerRequestSign items={p.requestedCrops} visitor={p.visitor} />}
        {p.speaking && !p.requestedCrops && <g transform={`translate(${FRIEND.x + 40} ${FRIEND.y + 20})`} aria-hidden="true">
          <path d="M-34-22h68a12 12 0 0 1 12 12v18a12 12 0 0 1-12 12H8L-2 34-4 20h-30a12 12 0 0 1-12-12v-18a12 12 0 0 1 12-12Z" fill="#fff" stroke="#2c6a68" strokeWidth="3" />
          <g fill="#2c6a68"><circle cx="-14" cy="-1" r="4" /><circle cx="0" cy="-1" r="4" /><circle cx="14" cy="-1" r="4" /></g>
        </g>}
      </g>
      {p.sprinkler && <image href={art('sprinkler')} x="352" y="352" width="92" height="92" />}
      {[3, 4, 5, 0, 1, 2].map(i => {
        const [x, y, s] = beds[i];
        const plot = p.plots[i];
        const closed = i >= p.open;
        const stage = closed ? 'closed' : ready(plot);
        const droop = thirsty(plot, p.sprinkler);
        const action = stage === 'wild' ? 'dig' : stage === 'tilled' ? 'sow' : weedy(plot) ? 'weed'
          : stage === 'ready' ? 'harvest' : droop ? 'water' : 'grow';
        const dy = lift?.bed === i ? lift.dy : 0;
        return <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <Bed look={stage} wet={plot.kind === 'crop' && (p.sprinkler || plot.water > 0)} closed={closed} />
          {plot.kind === 'crop' && !closed && <g transform={`translate(0 ${-6 + dy / s})`}>
            {stage === 'ready'
              ? <image href={art(plot.crop + '-plant')} x="-80" y={-150} width="160" height="170" preserveAspectRatio="xMidYMax meet" />
              : <YoungPlant crop={plot.crop} look={stage as never} droop={droop} />}
          </g>}
          {weedy(plot) && !closed && <g transform={`translate(70 ${2 + dy / s})`}><Weed /></g>}
          {!closed && p.working && !p.canGive &&
            <BedSign bed={i} action={action} crop={plot.kind === 'crop' ? plot.crop : p.sowCrop} />}
        </g>;
      })}
      {ghost && ghost.bed >= 0 && ghost.tool === 'hoe' && p.plots[ghost.bed].kind === 'wild' && ghost.progress > 0 && (() => {
        // The soil darkens strip by strip as the hoe turns it over.
        const [x, y, s] = beds[ghost.bed];
        const strips = Math.min(6, Math.floor(ghost.progress * 7));
        return <g transform={`translate(${x} ${y}) scale(${s})`} pointerEvents="none">
          {Array.from({ length: strips }, (_, k) => <g key={k}>
            <path d={`M${-84 + k * 29}-18h30l3 25h-36Z`} fill="#8a5a34" />
            <path d={`M${-78 + k * 29}-8h22`} stroke="#6b4226" strokeWidth="4" strokeLinecap="round" />
            <circle cx={-70 + k * 29} cy={2} r="3.5" fill="#6b4226" />
          </g>)}
        </g>;
      })()}
      {bursts.map(b => <g key={b.id} transform={`translate(${b.x} ${b.y})`} pointerEvents="none" aria-hidden="true"
        className={b.big ? styles.puff : styles.clods}>
        {b.big && <ellipse className={styles.dust} rx="70" ry="22" fill="#d9bf8c" />}
        {(b.big ? [[-60, -70], [-30, -96], [0, -110], [28, -92], [58, -74], [-44, -40], [44, -46]] : [[-24, -46], [4, -60], [26, -40]])
          .map(([dx, dy], k) => <path key={k} className={styles.clod} style={{ '--dx': dx, '--dy': dy } as CSSProperties}
            d="M-6-2q2-6 8-4 6 2 4 8-3 5-9 2-4-2-3-6Z" fill={k % 2 ? '#7a4d2b' : '#a87444'} />)}
      </g>)}
      {ghost && ghost.bed >= 0 && ghost.tool === 'can' && (() => {
        const [x, y, s] = beds[ghost.bed];
        return <g pointerEvents="none">
          <path d={`M${ghost.x - 46} ${ghost.y + 8}Q${x - 20} ${y - 80 * s} ${x} ${y - 10}`} fill="none" stroke="#8fd3f0" strokeWidth="7" strokeDasharray="3 9" strokeLinecap="round" />
        </g>;
      })()}
    </svg>

    <div className={styles.targets}>
      {beds.map(([x, y, s], i) => {
        const plot = p.plots[i];
        const closed = i >= p.open;
        const state = closed ? bedState.closed : weedy(plot) ? bedState.weed : thirsty(plot, p.sprinkler) ? bedState.thirsty : bedState[look(plot)];
        const crop = plot.kind === 'crop' ? ' · ' + cropNames[plot.crop][p.lang] : '';
        const label = `${bedName(i + 1)[p.lang]}${crop}: ${state[p.lang]}`;
        return <button key={i} type="button" className={styles.bed} data-bed={i} data-look={closed ? 'closed' : look(plot)}
          aria-label={label} title={label} style={pct(x, y - 30 * s, 210 * s, 120 * s)}
          onPointerDown={e => bedDown(i, e)} onPointerMove={bedMove} onPointerUp={e => bedUp(i, e)}
          onPointerCancel={() => { pull.current = null; setLift(null); }}
          onClick={e => bedClick(i, e)}>
          {p.working && p.guideBed === i && <HandTapIcon className={styles.tapHint} />}
        </button>;
      })}
      <button type="button" className={styles.friend} data-object="friend" disabled={!!p.soldItems} aria-label={(p.working ? text.sellToFriend : text.talk)[p.lang]} style={pct(friendZone.x, friendZone.y, friendZone.w, friendZone.h)}
        onClick={p.onFriend} />
      {p.soldItems ? <span className={`${styles.basket} ${styles.replacement}`} style={pct(BASKET.x, BASKET.y)} data-basket="replacement" aria-hidden="true"><BasketArt /></span>
        : <button type="button" className={styles.basket} data-drag="basket" disabled={!p.working}
        aria-label={`${text.basket[p.lang]} · ${text.give[p.lang]}`} title={text.give[p.lang]}
        style={{ ...pct(BASKET.x, BASKET.y), ...(basketAt ? { translate: `${basketAt[0]}px ${basketAt[1]}px` } : {}) }}
        data-dragging={basketAt ? true : undefined} data-ready={p.canGive || undefined}
        onPointerDown={e => {
          try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* fine */ }
          basketMoved.current = false;
          setDroppedAt(null);
          basketDrag.current = { id: e.pointerId, x: e.clientX, y: e.clientY }; setBasketAt([0, 0]);
        }}
        onPointerMove={e => {
          const b = basketDrag.current;
          if (b?.id !== e.pointerId) return;
          const dx = e.clientX - b.x, dy = e.clientY - b.y;
          if (Math.hypot(dx, dy) > 8) basketMoved.current = true;
          if (basketMoved.current) setBasketAt([dx, dy]);
        }}
        onPointerUp={async e => {
          const b = basketDrag.current;
          basketDrag.current = null;
          if (b?.id === e.pointerId && basketMoved.current && overFriend(e.clientX, e.clientY)) {
            if (p.canGive) {
              setDroppedAt(scene(e.clientX, e.clientY));
              setBasketAt([e.clientX - b.x, e.clientY - b.y]);
            }
            try { await p.onGive(); } finally { setBasketAt(null); }
          } else {
            setBasketAt(null);
          }
        }}
        onPointerCancel={() => { basketDrag.current = null; setBasketAt(null); }}
        onClick={e => { if (e.detail === 0 || !basketMoved.current) p.onGive(); }}>
        {p.canGive && <HandTapIcon className={styles.tapHint} />}
        <span key={bump} className={`${styles.basketArt} ${bump ? styles.bump : ''}`}>
          <BasketArt items={p.basket} flights={flights} />
        </span>
        <span className={styles.basketCount} aria-hidden="true">
          {Object.values(p.basket).reduce((a, b) => a + b, 0)}
        </span>
      </button>}
      {!p.soldItems && flights.map(f => <Image key={f.id} ref={el => launch(el, f)} className={styles.flight} src={art(f.crop)} alt="" width={84} height={84}
        draggable={false} aria-hidden="true" style={pct(f.x, f.y)} />)}
      {ghost && <span className={styles.ghost} aria-hidden="true" data-tool={ghost.tool} style={pct(ghost.x, ghost.y)}>
        {toolArt(ghost.tool) && <Image src={toolArt(ghost.tool)!} alt="" width={84} height={84} />}
        {ghost.bed >= 0 && ghost.progress > 0 && <svg className={styles.progress} viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" pathLength="1" strokeDasharray={`${Math.min(1, ghost.progress)} 1`} /></svg>}
      </span>}
    </div>
  </div>
    {/* The tools lie on wooden benches at the front of the garden: pick one up, then tap or drag it onto a bed. */}
    <div className={styles.bench} role="toolbar" aria-label={text.tools[p.lang]}>
      {/* With more than three seed types, move the hoe to the second bench to keep each sack reachable. */}
      {(p.tools.filter(t => t.startsWith('seed:')).length > 3
        ? [p.tools.filter(t => t.startsWith('seed:')), p.tools.filter(t => !t.startsWith('seed:'))]
        : [p.tools.filter(t => t === 'hoe' || t.startsWith('seed:')), p.tools.filter(t => t === 'can' || t === 'fork')]).map((group, g) =>
        <div key={g} className={styles.table} data-table={g ? 'water' : 'sow'}>
          {group.map(tool => {
            const crop = tool.startsWith('seed:') ? tool.slice(5) as Crop : null;
            const name = tool === 'hoe' ? text.hoe : tool === 'can' ? text.can : tool === 'fork' ? text.fork : text.seedOf(cropNames[crop!]);
            return <button key={tool} type="button" className={styles.item} aria-pressed={p.tool === tool} disabled={!p.working}
              aria-label={name[p.lang]} title={name[p.lang]} data-tool={tool} data-held={ghost?.tool === tool || undefined}
              onPointerDown={e => toolDown(tool, e)} onPointerMove={toolMove} onPointerUp={toolUp} onPointerCancel={toolCancel}
              onClick={e => { if (e.detail === 0) p.onTool(tool); }}>
              {crop ? <>
                <Image src={art('seed-sack')} alt="" width={96} height={96} className={styles.sack} draggable={false} />
                <Image src={art(crop)} alt="" width={56} height={56} className={styles.tag} draggable={false} />
              </> : <Image src={toolArt(tool)!} alt="" width={96} height={96} draggable={false} />}
              {p.working && p.guideTool === tool && p.tool !== tool && <HandTapIcon className={styles.tapHint} />}
            </button>;
          })}
        </div>)}
    </div>
  </div>;
}

