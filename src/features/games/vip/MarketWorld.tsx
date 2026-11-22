'use client';

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LocaleLink, useLocale, useLocalePath } from '@/i18n/LocaleProvider';
import { PlayArea } from '@/features/learning-stars/components';
import { MarketMapArt } from '../smoothie/MarketMapArt';
import { Label } from './Labels';
import { vip } from './content';
import { nearestTrailPoint, pointOnTrail, trailLength } from './trail';
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
  const distance = useRef(0);
  const heldArrow = useRef<{ key: string; start: number; direction: number } | null>(null);
  const [position, setPosition] = useState(0);
  const [facing, setFacing] = useState(1);
  const [moving, setMoving] = useState(false);
  const [overview, setOverview] = useState(false);
  const [fogHint, setFogHint] = useState(false);
  const point = pointOnTrail(position);
  const arrived = position >= trailLength - 1 && !moving;

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
    const atShop = location.hash === '#shop';
    const d = atShop ? trailLength : 0;
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
    const end = Math.min(trailLength, Math.max(0, to));
    const initial = distance.current;
    setFogHint(false);
    setOverview(false);
    if (initial === end) { setMoving(false); follow(end,true); return; }
    setFacing(end > initial ? 1 : -1);
    const place = (d: number) => { distance.current = d; setPosition(d); follow(d); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      place(end); setMoving(false); return;
    }
    let previous = performance.now();
    setMoving(true);
    function tick(now: number) {
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
  function visitShop() {
    if (arrived) router.push(path('/games/vip/smoothie-shop'));
    else move(trailLength);
  }
  function steer(event: KeyboardEvent<HTMLButtonElement>) {
    const direction = {ArrowRight:1, ArrowUp:1, ArrowLeft:-1, ArrowDown:-1}[event.key];
    if (!direction) return;
    event.preventDefault();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { move(distance.current+direction*25); return; }
    if (heldArrow.current?.key === event.key) return;
    heldArrow.current = {key:event.key, start:distance.current, direction};
    move(direction > 0 ? trailLength : 0);
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
    const d = nearestTrailPoint(x,y), nearest = pointOnTrail(d);
    if (Math.hypot(x-nearest.x,y-nearest.y) <= 43) move(d);
    else setFogHint(true);
  }
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
        <Artwork />
        <button className={atlas.surface} aria-label={vip.mapHelp[lang]} onKeyDown={steer} onKeyUp={e=>releaseArrow(e.key)} onBlur={()=>releaseArrow()} onClick={tap}
          onPointerDown={panStart} onPointerMove={pan} onPointerCancel={() => {drag.current=null;}} />
        <span className={atlas.avatar} aria-hidden="true" style={{left:percentX(point.x),top:percentY(point.y)}}>
          <span className={atlas.chassis} style={{backgroundPositionX: `${frame/3*100}%`,transform: facing<0 ? 'scaleX(-1)' : undefined}} />
        </span>
        <button className={atlas.shopPin} aria-label={vip.shop[lang]} style={{left:percentX(630),top:percentY(101)}} onClick={visitShop}>
          <Label text={vip.shop} />
        </button>
      </div>
    </div>
    <footer className={atlas.hud}>
      <div className={atlas.hint} role="status"><Label text={fogHint ? vip.mist : arrived ? vip.arrive : vip.mapHelp} /></div>
      {arrived ? <LocaleLink className={styles.primary} href="/games/vip/smoothie-shop"><Label text={vip.open} /></LocaleLink>
        : <button className={styles.primary} onClick={()=>move(trailLength)}><Label text={moving ? vip.walking : vip.walk} /></button>}
    </footer>
  </main></PlayArea>;
}
