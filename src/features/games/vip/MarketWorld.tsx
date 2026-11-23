'use client';

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LocaleLink, useLocale, useLocalePath } from '@/i18n/LocaleProvider';
import { PlayArea } from '@/features/learning-stars/components';
import { MarketMapArt } from '../smoothie/MarketMapArt';
import { Label } from './Labels';
import { vip } from './content';
import { nearestTrailPoint, pointOnTrail, stops, type Stop } from './trail';
import { useShop } from '../smoothie/store';
import { openPlaces, places, route } from './route';
import { useGarden } from '../garden/store';
import styles from './vip.module.css';
import atlas from './world.module.css';

const Artwork = memo(MarketMapArt);
const world = { left: -600, top: -380, width: 2080, height: 1350 };
const percentX = (x: number) => (x - world.left) / world.width * 100 + '%';
const percentY = (y: number) => (y - world.top) / world.height * 100 + '%';

export function MarketWorld() {
  const lang = useLocale();
  const router = useRouter();
  const path = useLocalePath();
  const viewport = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const anim = useRef(0);
  const limitRef = useRef<number>(stops.shop);
  const distance = useRef(0);
  const heldArrow = useRef<{ key: string; start: number; direction: number } | null>(null);
  const [position, setPosition] = useState(0);
  const [facing, setFacing] = useState(1);
  const [moving, setMoving] = useState(false);
  const [overview, setOverview] = useState(false);
  const [fogHint, setFogHint] = useState(false);
  const { shop } = useShop();
  // The bridge to the garden opens once the child has sold a few smoothies.
  const { garden } = useGarden();
  // Each place opens the next: smoothies sold open the garden, garden deliveries open the restaurant.
  const open = openPlaces(shop.served, garden.delivered);
  const isOpen = (stop: Stop) => open.includes(stop);
  const limit = stops[open[open.length - 1]];
  const [fogText, setFogText] = useState(vip.mist);
  const point = pointOnTrail(position);
  const at: Stop | null = moving ? null : open.find(stop => Math.abs(position - stops[stop]) < 1) ?? null;
  const here = places.find(p => p.stop === at);

  // Keep Nuri in the central part of the view. Looking around manually is possible when stopped.
  const follow = useCallback((d: number, center = false) => {
    const v = viewport.current, b = board.current;
    if (!v || !b || b.dataset.overview === 'true') return;
    const p = pointOnTrail(d);
    const x = (p.x-world.left)/world.width * b.clientWidth;
    const y = (p.y-world.top)/world.height * b.clientHeight - b.clientWidth * .018;
    const bound = (value: number, min: number, max: number) => Math.min(max, Math.max(min,value));
    v.scrollLeft = center ? x - v.clientWidth * .4 : bound(v.scrollLeft, x-v.clientWidth*.62, x-v.clientWidth*.32);
    v.scrollTop = center ? y - v.clientHeight * .5 : bound(v.scrollTop, y-v.clientHeight*.62, y-v.clientHeight*.35);
  }, []);

  useLayoutEffect(() => {
    const hash = location.hash.slice(1);
    const d = hash in stops ? stops[hash as Stop] : 0;
    distance.current = d;
    const id = requestAnimationFrame(() => { setPosition(d); follow(d,true); });
    return () => { cancelAnimationFrame(id); cancelAnimationFrame(anim.current); };
  }, [follow]);
  useLayoutEffect(() => {
    const v = viewport.current;
    if (!v) return;
    if (overview) v.scrollTo(0,0);
    else follow(distance.current,true);
    const observer = new ResizeObserver(() => follow(distance.current,true));
    observer.observe(v);
    return () => observer.disconnect();
  }, [follow, overview]);
  useEffect(() => {
    if (!fogHint) return;
    const timer = window.setTimeout(() => setFogHint(false), 2200);
    return () => window.clearTimeout(timer);
  }, [fogHint]);

  function move(to: number) {
    cancelAnimationFrame(anim.current);
    const end = Math.min(limitRef.current, Math.max(0, to));
    const initial = distance.current;
    setFogHint(false);
    setOverview(false);
    if (initial === end) { setMoving(false); follow(end,true); return; }
    setFacing(end > initial ? 1 : -1);
    const place = (d: number) => { distance.current = d; setPosition(d); follow(d); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      place(end); setMoving(false); return;
    }
    // The first frame sets the clock, so no time is read outside the animation callback.
    let previous = -1;
    setMoving(true);
    function tick(now: number) {
      if (previous < 0) previous = now;
      const remaining = end-distance.current;
      const elapsed = Math.min(60, now-previous)/1000;
      const speed = Math.min(112, 52 + Math.abs(remaining)*1.65);
      previous = now;
      if (Math.abs(remaining) <= elapsed*speed) { place(end); setMoving(false); return; }
      place(distance.current + Math.sign(remaining)*elapsed*speed);
      anim.current = requestAnimationFrame(tick);
    }
    anim.current = requestAnimationFrame(tick);
  }
  function visit(stop: Stop) {
    const place = places.find(p => p.stop === stop)!;
    if (!isOpen(stop)) { setFogText(place.locked ?? vip.mist); setFogHint(true); return; }
    if (at === stop) router.push(path(place.href));
    else move(stops[stop]);
  }
  const visitShop = () => visit('shop');
  function steer(event: KeyboardEvent<HTMLButtonElement>) {
    const direction = {ArrowRight:1, ArrowUp:1, ArrowLeft:-1, ArrowDown:-1}[event.key];
    if (!direction) return;
    event.preventDefault();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { move(distance.current+direction*25); return; }
    if (heldArrow.current?.key === event.key) return;
    heldArrow.current = {key:event.key, start:distance.current, direction};
    move(direction > 0 ? limitRef.current : 0);
  }
  function releaseArrow(key?: string) {
    const held = heldArrow.current;
    if (!held || (key && held.key !== key)) return;
    heldArrow.current = null;
    cancelAnimationFrame(anim.current);
    if (key && Math.abs(distance.current-held.start) < 15) move(held.start+held.direction*15);
    else setMoving(false);
  }
  const drag = useRef<{x:number; y:number; left:number; top:number; moved:boolean} | null>(null);
  function panStart(e: PointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !viewport.current) return;
    drag.current = {x:e.clientX,y:e.clientY,left:viewport.current.scrollLeft,top:viewport.current.scrollTop,moved:false};
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function pan(e: PointerEvent<HTMLButtonElement>) {
    const from = drag.current, v = viewport.current;
    if (!from || !v || !e.buttons) return;
    const dx = e.clientX-from.x, dy=e.clientY-from.y;
    if (!from.moved && Math.hypot(dx,dy)<6) return;
    from.moved = true;
    v.scrollTo(from.left-dx,from.top-dy);
  }
  function tap(event: MouseEvent<HTMLButtonElement>) {
    if (!event.detail) { visitShop(); return; }
    const dragged = drag.current?.moved;
    drag.current = null;
    if (dragged) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX-rect.left)/rect.width*world.width+world.left;
    const y = (event.clientY-rect.top)/rect.height*world.height+world.top;
    if (x>565 && x<704 && y>95 && y<245) { visitShop(); return; }
    const spot = places.find(({ hit: [x1, y1, x2, y2] }) => x > x1 && x < x2 && y > y1 && y < y2);
    if (spot) { visit(spot.stop); return; }
    const d = nearestTrailPoint(x,y), nearest = pointOnTrail(d);
    if (Math.hypot(x-nearest.x,y-nearest.y) <= 43 && d <= limit + 1) move(d);
    else { setFogText(d > limit + 1 ? places.find(p => !isOpen(p.stop))?.locked ?? vip.mist : vip.mist); setFogHint(true); }
  }
  useEffect(() => { limitRef.current = limit; }, [limit]);
  const frame = moving ? Math.floor(position / 17) % 4 : 0;
  return <PlayArea><main className={atlas.world}>
    <header className={atlas.header}>
      <LocaleLink href="/games" className={styles.back}><Label text={vip.games} /></LocaleLink>
      <h1><Label text={vip.world} /></h1>
      <button className={styles.secondary} aria-pressed={overview} onClick={() => {setFogHint(false); setOverview(v=>!v);}}>
        <Label text={overview ? vip.follow : vip.overview} />
      </button>
    </header>
    <div className={atlas.viewport} ref={viewport}>
      <div className={atlas.board} data-overview={overview} ref={board}>
        <Artwork garden={isOpen('garden')} restaurant={isOpen('restaurant')} />
        <button className={atlas.surface} aria-label={vip.mapHelp[lang]} onKeyDown={steer} onKeyUp={e=>releaseArrow(e.key)} onBlur={()=>releaseArrow()} onClick={tap}
          onPointerDown={panStart} onPointerMove={pan} onPointerCancel={() => {drag.current=null;}} />
        <span className={atlas.avatar} aria-hidden="true" style={{left:percentX(point.x),top:percentY(point.y)}}>
          <span className={atlas.chassis} style={{backgroundPositionX: `${frame/3*100}%`,transform: facing<0 ? 'scaleX(-1)' : undefined}} />
        </span>
        {places.map(place => {
          const locked = !isOpen(place.stop);
          return <button key={place.stop} className={atlas.shopPin} data-locked={locked || undefined} data-stop={place.stop}
            style={{left:percentX(place.pin.x),top:percentY(place.pin.y)}}
            aria-label={locked ? place.name[lang] + ' · ' + place.locked?.[lang] : place.name[lang]} onClick={() => visit(place.stop)}>
            {locked && <LockIcon />}<Label text={place.name} />
          </button>;
        })}
        {route.soon.map(place => <button key={place.id} className={atlas.shopPin} data-locked style={{left:percentX(place.x),top:percentY(place.y)}}
          aria-label={place.name[lang] + ' · ' + route.inMist[lang]} onClick={() => { setFogText(route.inMist); setFogHint(true); }}>
          <LockIcon /><Label text={place.name} />
        </button>)}
      </div>
    </div>
    <footer className={atlas.hud}>
      <div className={atlas.hint} role="status"><Label text={fogHint ? fogText : here ? here.arrive : vip.mapHelp} /></div>
      <div className={atlas.actions}>
        {!moving && places.filter(p => p.stop !== at && p.stop !== 'shop' && isOpen(p.stop)).map(p =>
          <button key={p.stop} className={styles.secondary} onClick={()=>move(stops[p.stop])}><Label text={p.walk} /></button>)}
        {here ? <LocaleLink className={styles.primary} href={here.href}><Label text={here.enter} /></LocaleLink>
          : <button className={styles.primary} onClick={()=>move(stops.shop)}><Label text={moving ? vip.walking : vip.walk} /></button>}
        {here && at !== 'shop' && <button className={styles.secondary} onClick={()=>move(stops.shop)}><Label text={vip.walk} /></button>}
      </div>
    </footer>
  </main></PlayArea>;
}

function LockIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" style={{ marginRight: 4, verticalAlign: '-2px' }}>
    <rect x="3.5" y="8.5" width="13" height="9.5" rx="2.4" fill="currentColor" />
    <path d="M6.5 8.5V6.3a3.5 3.5 0 0 1 7 0v2.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
  </svg>;
}
