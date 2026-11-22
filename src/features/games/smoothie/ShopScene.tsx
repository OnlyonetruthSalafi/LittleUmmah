import { useEffect, useId, useState } from 'react';
import { CounterControls, CounterForeground, FruitPiece, StockDrawer } from './CounterObjects';
import type { Locale, Text } from '@/i18n/config';
import styles from './scene.module.css';

import { customers, type Fruit, type Stage } from './model';

/** Codex art for bought decorations, drawn in the scene's 900 × 530 space.
 *  Both stay inside x 140–760, the part phones show (scene.module.css). */
const decor = {
  flowers: { href: '/games/vip/shop/flowers.webp', x: 612, y: 166, size: 128 },
  lantern: { href: '/games/vip/shop/lantern.webp', x: 150, y: 44, size: 100 },
};
type SceneProps = {
  fruit: readonly Fruit[];
  stage: Stage;
  customer: number;
  arrived: boolean;
  onArrival: () => void;
  upgraded: boolean;
  kinds: readonly Fruit[];
  flowers: boolean;
  lantern: boolean;
  bigCup: boolean;
  lang: Locale;
  nextFruit: Fruit | undefined;
  guide: boolean;
  ready: boolean;
  onPick: (kind: Fruit) => void;
  onUndo: () => void;
  onUse: () => void;
  deferred: boolean;
  onTalk: () => void;
  onUpgrades: () => void;
  revision: number;
  actionLabel: string;
};


const description: Text = {
  th: 'มองจากหลังเคาน์เตอร์ เห็นมือของหนูและปลายแขนเสื้อ ตะกร้าผลไม้อยู่ด้านหน้า มีเครื่องปั่น แก้ว และถาดรับเหรียญ ลูกค้าอยู่ฝั่งตรงข้าม',
  en: 'From behind the counter, you see your hands and sleeves, the fruit baskets, blender, cup and coin tray. Your customer is on the other side.',
};

function Stall({ id }: { id: string }) {
  return <>
    <g fill="#dc9562">
      <path d="M9 0h26l-4 302H13zM864 0h27l-5 302h-21z" />
    </g>
    <path d="M18 20v258M873 20v258" stroke="#ffc38a" strokeWidth="5" />
    {Array.from({ length: 15 }, (_, i) => <g key={i} transform={`translate(${i * 60} 0)`}>
      <path d="M0-2h60v51c0 13-12 22-30 22S0 62 0 49Z" fill="#795140" opacity=".22" />
      <path d="M0-2h60v47c0 13-12 22-30 22S0 58 0 45Z" fill={`url(#${id}-${i % 2 ? 'cloth' : 'coral'})`} />
      <path d="M3 49c5 18 47 19 54 0" fill="none" stroke={i % 2 ? '#d6bb91' : '#d75d50'} strokeWidth="1.5" strokeDasharray="3 3" />
    </g>)}
    <path d="M0 36h900" stroke="#9e664b" strokeWidth="5" opacity=".24" />
    <path d="M0 33h900" stroke="#fff2ce" strokeWidth="2" opacity=".54" />
    <path d="m0 276 900-3v19L0 299Z" fill="#c28958" />
    <path d="m0 271 900-3v8L0 282Z" fill="#ffe2a2" />
    <path d="m0 295 900-6v211L0 512Z" fill={`url(#${id}-wood)`} />
    <g opacity=".48" fill="none" stroke="#c68d59" strokeWidth="2">
      <path d="m0 319 900-9M0 370l900-15M172 298l-65 109M660 291l50 102" />
      <path d="M505 379q66-3 111-1M13 339q64-4 134-3M778 321l68-2" strokeWidth="1" />
    </g>
    <path d="m0 501 900-15v45H0Z" fill={`url(#${id}-trim)`} />
    <path d="m0 497 900-15v9L0 509Z" fill="#ab6f47" />
    <path d="m0 493 900-13v5L0 500Z" fill="#ffe2a2" />
    <path d="m0 516 900-16" stroke="#b9f7df" opacity=".65" strokeWidth="3" />
  </>;
}

/** The cup, drawn in scene coordinates. While serving it is drawn again inside the draggable control. */
export function CupArt({ id, stage, drink, topping, bigCup }: { id: string; stage: Stage; drink: string; topping: string; bigCup: boolean }) {
  const fullCup = stage === 'serve' || stage === 'collect';
  return <>
      <g transform={stage === 'collect' ? 'translate(473 234) scale(.65)' : 'translate(421 275)'}>
        <g transform={bigCup ? 'translate(33 69) scale(1.22) translate(-33 -69)' : undefined}>
        <ellipse cx="33" cy="69" rx="47" ry="9" fill={`url(#${id}-shadow)`} />
        <path d="M0 4q30-9 65-2l-7 60q-22 12-48 2Z" fill={`url(#${id}-glass)`} stroke="#64a1a0" strokeWidth="2.8" />
        {(fullCup || stage === 'pouring') && <g className={stage === 'pouring' ? styles.filling : undefined}>
          <path d="M4 14q25-6 57-2l-6 48q-20 10-42 2Z" fill={drink} />
          <ellipse cx="33" cy="13" rx="29" ry="4.5" fill={topping} />
        </g>}
        {fullCup && <><path d="m39 13 6-29 11-8" fill="none" stroke="#f7fff5" strokeWidth="6" />
          <path d="m39 13 6-29 11-8" fill="none" stroke="#eb8678" strokeWidth="6" strokeDasharray="4 5" />
        </>}
        <ellipse cx="32.5" cy="3" rx="33" ry="5" fill="none" stroke="#d5f4ea" strokeWidth="3" />
        <path d="m8 11 5 36" stroke="#fff" strokeWidth="4" opacity=".78" strokeLinecap="round" />
        </g>
      </g>
  </>;
}

/** A dashed path from the cup up to the customer shows where to drag it. */
function ServeGuide() {
  const path = 'M418 262C384 236 386 200 414 180';
  return <g aria-hidden="true" pointerEvents="none">
    <ellipse cx="478" cy="160" rx="92" ry="62" fill="#fff7c8" fillOpacity=".3" stroke="#fff" strokeWidth="11" strokeDasharray="18 12" />
    <ellipse cx="478" cy="160" rx="92" ry="62" fill="none" stroke="#e5413a" strokeWidth="6" strokeDasharray="18 12" />
    <path d={path} fill="none" stroke="#fff" strokeWidth="15" strokeDasharray="14 11" strokeLinecap="round" />
    <path d={path} fill="none" stroke="#e5413a" strokeWidth="8" strokeDasharray="14 11" strokeLinecap="round" />
    <path d="m400 176 34-6-11 31Z" fill="#e5413a" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
  </g>;
}

export function ShopScene(props: SceneProps) {
  const { fruit, stage, customer, arrived, onArrival, upgraded, kinds, lang, revision } = props;
  const id = useId();
  const [walkLoaded, setWalkLoaded] = useState(false);
  const paint = (name: string) => `url(#${id}-${name})`;
  const visitor = customers[customer % customers.length];
  const walkSheet = `/games/vip/characters/${visitor}-walk.webp`;
  useEffect(() => {
    // SVG images can finish loading before React hydrates a refreshed page.
    const image = new Image();
    image.onload = () => setWalkLoaded(true);
    image.onerror = onArrival;
    image.src = walkSheet;
    return () => { image.onload = null; image.onerror = null; };
  }, [walkSheet,onArrival]);
  const drink = fruit.includes('melon') ? '#f2646e' : fruit.includes('berry') ? '#ed8293'
    : fruit.includes('mango') ? '#ffc23a' : fruit.includes('orange') ? '#ffaa42' : '#f2d56c';
  const topping = fruit.includes('berry') || fruit.includes('melon') ? '#ffd9dc' : '#fff1bd';

  return <div className={styles.window}><div className={styles.plane}>
    <svg className={styles.scene} viewBox="0 0 900 530" role="img" aria-label={description[lang]}>
      <defs>
        <linearGradient id={`${id}-cloth`} x2="0%" y2="100%">
          <stop stopColor="#fffaf1" /><stop offset=".65" stopColor="#fff1cd" /><stop offset="1" stopColor="#e8ce9e" />
        </linearGradient>
        <linearGradient id={`${id}-coral`} x2="0%" y2="100%">
          <stop stopColor="#ff977e" /><stop offset=".64" stopColor="#f27662" /><stop offset="1" stopColor="#c9584b" />
        </linearGradient>
        <linearGradient id={`${id}-wood`} x2="5%" y2="100%">
          <stop stopColor="#f8c579" /><stop offset=".16" stopColor="#ffdc9b" /><stop offset=".78" stopColor="#efb673" /><stop offset="1" stopColor="#d5945d" />
        </linearGradient>
        <linearGradient id={`${id}-trim`} x2="0%" y2="100%">
          <stop stopColor="#69dac4" /><stop offset=".2" stopColor="#33b6a7" /><stop offset="1" stopColor="#188b87" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x2="95%" y2="38%">
          <stop stopColor={upgraded ? '#cf851f' : '#107d82'} /><stop offset=".25" stopColor={upgraded ? '#ffe48a' : '#6be0cd'} />
          <stop offset=".72" stopColor={upgraded ? '#f4bb44' : '#35b4a6'} /><stop offset="1" stopColor={upgraded ? '#c27918' : '#178a8a'} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x2="100%" y2="10%">
          <stop stopColor="#ecffff" stopOpacity=".8" /><stop offset=".2" stopColor="#fff" stopOpacity=".41" />
          <stop offset=".61" stopColor="#a8eadf" stopOpacity=".26" /><stop offset="1" stopColor="#86cfd0" stopOpacity=".77" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}><stop stopColor="#743e2c" stopOpacity=".42" /><stop offset="1" stopColor="#935135" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}-coin`} cx=".35" cy=".28" r=".85">
          <stop stopColor="#fff7aa" /><stop offset=".53" stopColor="#ffd34a" /><stop offset="1" stopColor="#df9220" />
        </radialGradient>
        <clipPath id={`${id}-jar`}><path d="m241 174 106 3-12 94q-36 11-76-2Z" /></clipPath>
      </defs>
      <rect width="900" height="530" fill="#a2e9f0" />
      <image href="/explore/scenes/beach-arrive.webp" x="0" y="-12" width="900" height="424" preserveAspectRatio="xMidYMin slice" />
      <path d="M0 235q235 12 404 0t496-6v66H0Z" fill="#fcecb9" opacity=".42" />
      <g fill="#e9bb7d" stroke="#be8759" strokeWidth="2">
        {[55,166,735,833].map(x => <path key={x} d={`M${x} 246v-43q5-8 10 0v43z`} />)}
      </g>
      <g fill="none" stroke="#c69764" strokeWidth="4">
        <path d="M0 209q30 18 59-3 47 32 113 0M740 206q49 29 98 0 32 18 62 0" />
      </g>
      <g data-customer={visitor} data-arrived={arrived}
        className={arrived ? undefined : walkLoaded ? styles.approaching : styles.waiting}
        onAnimationEnd={e => { if (e.target === e.currentTarget && !arrived) onArrival(); }}>
        {stage === 'collect' || (arrived && !walkLoaded) ? <image href={`/Character/friends/${visitor}${stage === 'collect' ? '-cheer' : ''}.webp`}
          x={visitor === 'safi' ? 310 : 357} y={visitor === 'safi' ? -13 : 59}
          width={visitor === 'safi' ? 330 : 242} height={visitor === 'safi' ? 330 : 261} />
          : <svg x={visitor === 'safi' ? 407 : 362} y={visitor === 'safi' ? 144 : 80}
              width={visitor === 'safi' ? 145 : 232} height={visitor === 'safi' ? 145 : 232}
              viewBox="0 0 256 256" overflow="hidden">
              <image href={walkSheet} width="1024" height="256"
                className={walkLoaded && !arrived ? styles.runningGear : undefined} />
            </svg>}
      </g>
      <Stall id={id} />
      {props.lantern && <g aria-hidden="true">
        <path d={`M${decor.lantern.x + decor.lantern.size / 2} 34v${decor.lantern.y - 30}`} stroke="#8a6532" strokeWidth="3" />
        <image href={decor.lantern.href} x={decor.lantern.x} y={decor.lantern.y} width={decor.lantern.size} height={decor.lantern.size} />
      </g>}
      {props.flowers && <image href={decor.flowers.href} x={decor.flowers.x} y={decor.flowers.y}
        width={decor.flowers.size} height={decor.flowers.size} aria-hidden="true" />}
      <StockDrawer id={id} />

      <ellipse cx="290" cy="357" rx="98" ry="17" fill={paint('shadow')} />
      <g className={stage === 'blend' ? styles.blending : stage === 'pouring' ? styles.tipped : undefined}>
        <path d="M350 184c43-9 43 59-7 57" fill="none" stroke="#598d90" strokeWidth="12" />
        <path d="M350 182c40-7 39 54-6 55" fill="none" stroke="#bce5df" strokeWidth="7" />
        <path d="m225 163 127 4-15 108q-38 15-80-3l-18-95Z" fill={paint('glass')} stroke="#538e91" strokeWidth="3.5" strokeLinejoin="round" />
        <g clipPath={paint('jar')}>
          {stage === 'prepare' && fruit.slice(0,4).map((kind, index) =>
            <g key={index} className={styles.dropped}><FruitPiece kind={kind} x={252 + [0,29,16,42][index]} y={233 - Math.floor(index / 2)*22} size={38} angle={index*14-10}/></g>)}
          {stage === 'blend' && <>
            <path d="M241 214q15-18 42 3 15 12 25 0 15-14 38-8v67H242Z" fill={drink}/>
            <g className={styles.vortex} fill="none" strokeLinecap="round">
              <path d="M243 217q23-15 53 7 14 9 44-11m-93 19q23-10 44 2t47-3m-78 20q22-8 39 0t24-2" stroke={topping} strokeWidth="4"/>
              <path d="M257 223q12-1 23 4m26 16 13-3m-49 20 20-1" stroke="#fffce7" strokeWidth="3"/>
            </g>
            <g fill={topping}><circle cx="249" cy="209" r="5"/><circle cx="258" cy="206" r="3"/><circle cx="329" cy="210" r="5"/><circle cx="337" cy="206" r="3"/></g>
            <g className={styles.pulp}>
              <g className={styles.chunks}>
                {fruit.map((kind,i)=><FruitPiece key={i} kind={kind} x={259+i*19} y={i%2 ? 235 : 222} size={21} angle={i*48}/>)}
              </g>
            </g>
          </>}
          {(stage === 'pour' || stage === 'pouring') && <>
            <path d="M244 211q24-6 44 1t55-2v68h-99Z" fill={drink} />
            <path d="M244 212q24-7 44 0t55-2" fill="none" stroke={topping} strokeWidth="5" />
          </>}
        </g>
        <path d="m249 180 11 63" stroke="white" opacity=".78" strokeWidth="5" strokeLinecap="round" />
        <path d="M319 196h16m-14 13h11m-15 15h14m-12 13h10" fill="none" stroke="#57979a" strokeWidth="2.4" opacity=".75" />
        {stage === 'prepare' && fruit.length > 0 && <g transform="translate(279 174)">
          <rect x="-16" y="-12" width="32" height="25" rx="8" fill="#fff6dc" stroke="#517a77" strokeWidth="2"/>
          <path d="M-8-2h9q11 1 5 9M-8-2l5-5m-5 5 5 4" fill="none" stroke="#285f63" strokeWidth="2.6" strokeLinecap="round"/>
        </g>}
        {stage === 'prepare' && <ellipse cx="289" cy="164" rx="62" ry="7" fill="#d5f2e7" fillOpacity=".38" stroke="#75a9a6" strokeWidth="3"/>}
        <g transform={stage === 'prepare' ? 'translate(-19 191) scale(.70)' : undefined}>
        <path d="m227 162 9-11q55-14 108 4l8 12q-62 12-125-5Z" fill="#30585d" stroke="#235057" strokeWidth="2" />
        <ellipse cx="292" cy="153" rx="37" ry="5.5" fill="#527b7b" />
        <rect x="278" y="144" width="28" height="10" rx="5" fill="#517577" />
        </g>
      </g>
      <path d="M254 272q40 12 83 0l10 14-99 3Z" fill="#315e65" />
      <path d="M241 283q50-8 105 0l18 53q4 13-10 16-62 11-124 0-12-2-8-16Z" fill={paint('metal')} stroke={upgraded ? '#a26c20' : '#267f80'} strokeWidth="3" />
      <path d="M226 344q65 12 134-1v7q-70 15-135 1Z" fill="#315d64" />
      <path d="m242 299-9 29" stroke="#fff9dc" strokeWidth="5" opacity=".59" strokeLinecap="round" />
      {/* A big red switch so the child can see where to press. */}
      {stage === 'prepare' && props.ready && <g aria-hidden="true">
        <circle cx="292" cy="315" r="31" fill="#fff7c8" fillOpacity=".35" stroke="#fff" strokeWidth="5" strokeDasharray="9 7" />
        <circle cx="292" cy="315" r="31" fill="none" stroke="#c62828" strokeWidth="3" strokeDasharray="9 7" />
      </g>}
      <g className={stage === 'blend' ? styles.pressedDial : undefined}>
      <circle cx="292" cy="317" r="21" fill={upgraded ? '#b77a1f' : '#7a1717'} />
      <circle cx="292" cy="313" r="17" fill="#e23b32" stroke={upgraded ? '#ffe08a' : '#ff8a7a'} strokeWidth="2.5" />
      <ellipse cx="286" cy="307" rx="7" ry="4" fill="#fff" opacity=".5" />
      <path d="M286.5 308.5a8 8 0 1 0 11 0M292 304v8" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      </g>
      {stage === 'pouring' && <path d="M463 183 Q456 213 452 308" fill="none" stroke={drink} strokeWidth="8" strokeLinecap="round" />}

      {stage === 'serve' ? <ServeGuide /> : <CupArt id={id} stage={stage} drink={drink} topping={topping} bigCup={props.bigCup} />}
      <g transform="translate(548 337)">
        <ellipse cx="24" cy="22" rx="50" ry="10" fill={paint('shadow')} />
        <path d="m-17 2 54-4 22 14-73 5Z" fill="#2d8f88" stroke="#237772" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="m-11 2 47-2 15 10-61 5Z" fill="#5bc9ad" />
        {stage === 'collect' && <g className={styles.payment}>
          {[[-2,1],[12,-4],[18,4]].map(([x,y]) => <g key={x} transform={`translate(${x} ${y}) rotate(-12)`}>
            <ellipse cx="12" cy="4" rx="12" ry="7" fill="#bd7b21" />
            <ellipse cx="12" cy="1" rx="12" ry="7" fill={paint('coin')} stroke="#e7aa33" strokeWidth="1.4" />
            <ellipse cx="12" cy="1" rx="7" ry="3.3" fill="none" stroke="#e2ad36" />
          </g>)}
        </g>}
      </g>
      <CounterForeground key={revision} kinds={kinds} id={id} fruit={fruit} stage={stage} revision={revision}/>
    </svg>
    <CounterControls {...props} count={fruit.length} serveCup={<svg viewBox="402 250 100 104" width="100%" height="100%" overflow="visible">
      <CupArt id={id} stage="serve" drink={drink} topping={topping} bigCup={props.bigCup} /></svg>} />
  </div></div>;
}
