import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { SmoothieFruit } from '@/components/icons/SmoothieFruit';
import { vip } from '../vip/content';
import type { Locale } from '@/i18n/config';
import { fruitNames, type Fruit, type Stage } from './model';
import styles from './scene.module.css';
import { Forearms } from './Forearms';

/** Baskets share the counter front. Up to three keep the original spacing; four or five shrink to fit.
 *  Phones crop the scene to about x 140–760 (scene.module.css), so every basket stays inside that band. */
const rows: Record<number, { x: number[]; scale: number }> = {
  2: { x: [236, 449], scale: 1 }, 3: { x: [236, 449, 662], scale: 1 },
  4: { x: [210, 370, 530, 690], scale: .8 }, 5: { x: [195, 322.5, 450, 577.5, 705], scale: .68 },
};
export function binLayout(kinds: readonly Fruit[]) {
  const row = rows[kinds.length] ?? rows[5];
  const centers = Object.fromEntries(kinds.map((kind, i) => [kind, row.x[i]])) as Partial<Record<Fruit, number>>;
  return { centers, scale: row.scale };
}
export function FruitPiece({ kind, x, y, size, angle = 0 }: {
  kind: Fruit; x: number; y: number; size: number; angle?: number;
}) {
  return <g transform={`translate(${x} ${y}) rotate(${angle} ${size / 2} ${size / 2})`}>
    <svg width={size} height={size} viewBox="0 0 64 64"><SmoothieFruit kind={kind} /></svg>
  </g>;
}

function FruitBin({ kind, id, revision, x, scale }: { kind: Fruit; id: string; revision: number; x: number; scale: number }) {
  return <g transform={`translate(${x} 435) scale(${scale})`}>
    <ellipse cy="37" rx="96" ry="13" fill={`url(#${id}-shadow)`}/>
    <path d="m-84-28 158-3 12 24-5 35q0 8-10 9l-138 5q-10 0-12-9l-11-40Z" fill="#be8050" stroke="#955e36" strokeWidth="3"/>
    <path d="m-78-25 146-4 11 15-153 7Z" fill="#835b3c"/>
    <g key={revision} className={revision > 0 ? styles.picked : undefined}>
      <FruitPiece kind={kind} x={-67} y={-72} size={67} angle={-12}/>
      <FruitPiece kind={kind} x={-15} y={-72} size={71} angle={12}/>
      <FruitPiece kind={kind} x={-41} y={-55} size={69} angle={19}/>
      <FruitPiece kind={kind} x={28} y={-52} size={55} angle={-9}/>
    </g>
    <path d="M-88-10 81-17l5 10-167 10Z" fill="#ffe2a7" stroke="#ad7543" strokeWidth="2"/>
    <path d="m-81 3 168-10-5 35q0 8-9 9l-140 5q-7 1-9-6Z" fill={`url(#${id}-wood)`} stroke="#ad7543" strokeWidth="2"/>
    <path d="m-72 22 150-7" stroke="#ce965b" strokeWidth="2"/>
    <g fill="#936841"><circle cx="-68" cy="12" r="2.6"/><circle cx="73" cy="4" r="2.6"/><circle cx="-64" cy="32" r="2.6"/><circle cx="69" cy="27" r="2.6"/></g>
  </g>;
}

function FlyingFruit({ from, children }: { from: number; children: ReactNode }) {
  const vars = { '--from-x': `${from}px`, '--apex-x': `${(from+292)*.5}px` } as CSSProperties;
  return <g className={styles.flying} style={vars} pointerEvents="none">{children}</g>;
}

// The rack is keyed by successful pick revision. Undo cancels the flight;
// it cannot launch the previous fruit or make its basket squash again.
export function CounterForeground({ kinds, fruit, revision, stage, id }: {
  kinds: readonly Fruit[]; fruit: readonly Fruit[]; revision: number; stage: Stage; id: string;
}) {
  const { centers, scale } = binLayout(kinds);
  const [pick] = useState(() => ({ count: fruit.length, kind: revision ? fruit.at(-1) : undefined }));
  const flying = stage === 'prepare' && fruit.length === pick.count ? pick.kind : undefined;
  return <>
    {kinds.map(kind =>
      <FruitBin key={kind} kind={kind} id={id} x={centers[kind]!} scale={scale} revision={kind === flying ? revision : 0}/>)}
    <Forearms id={id} stage={stage} reachX={flying ? centers[flying] : undefined}/>
    {flying && centers[flying] !== undefined && <FlyingFruit from={centers[flying]!}>
      <FruitPiece kind={flying} x={-26} y={-26} size={52}/></FlyingFruit>}
  </>;
}

export function StockDrawer({ id }: { id: string }) {
  return <g transform="translate(678 302)">
    <ellipse cy="33" rx="78" ry="11" fill={`url(#${id}-shadow)`}/>
    <path d="m-69-23 105-6 30 11-109 10Z" fill="#f4d9a1" stroke="#a1875c" strokeWidth="2"/>
    <path d="m36-29 30 11 1 39-29 9Z" fill="#977647"/>
    <path d="m-69-23 110-6 1 51-110 7Z" fill="#1e8f88" stroke="#346861" strokeWidth="2.7"/>
    <path d="m-63-16 99-5 1 35-99 6Z" fill="#67c9b2" stroke="#387e74" strokeWidth="2"/>
    <path d="M-23 0q8 9 20-1" fill="none" stroke="#906825" strokeWidth="6" strokeLinecap="round"/>
    <path d="M-23-2q8 9 20-1" fill="none" stroke="#ffdf80" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="-50" cy="3" r="3" fill="#fff0aa"/>
  </g>;
}

type ObjectName = Fruit | 'undo' | 'blender' | 'cup' | 'customer' | 'coins' | 'upgrades';
type Place = [x: number,y: number,w: number,h: number];
// Centres and hit areas share the illustration's 900 × 530 coordinate system.
const places: Record<Exclude<ObjectName, Fruit>,Place> = {
  undo:[281,171,127,102], blender:[292,315,103,83], cup:[452,307,99,98],
  customer:[478,184,145,135], coins:[572,345,111,81], upgrades:[675,295,155,96],
};
function location([x,y,w,h]: Place): CSSProperties {
  return { left: `${x / 9}%`, top: `${y / 5.3}%`, width: `max(64px,${w / 9}%)`, height: `max(64px,${h / 5.3}%)` };
}

type ControlsProps = {
  stage: Stage; lang: Locale; count: number; kinds: readonly Fruit[]; nextFruit?: Fruit;
  guide: boolean; ready: boolean; arrived: boolean; deferred: boolean; actionLabel: string;
  onPick:(kind:Fruit)=>void; onUndo:()=>void; onUse:()=>void; onTalk:()=>void; onUpgrades:()=>void;
  /** The full cup, drawn inside the control the child drags to the customer. */
  serveCup: ReactNode;
};
export function CounterControls(p: ControlsProps) {
  const layer = useRef<HTMLDivElement>(null);
  const keyboard = useRef(false);
  useEffect(() => {
    if (!keyboard.current) return;
    const next = layer.current?.querySelector<HTMLButtonElement>('[data-next-action]');
    if (next) {
      next.focus({ preventScroll: true });
      keyboard.current = false;
    }
  }, [p.stage, p.count, p.nextFruit, p.ready]);
  const { centers, scale } = binLayout(p.kinds);
  const place = (object: ObjectName): Place => object in places
    ? places[object as keyof typeof places]
    : [centers[object as Fruit] ?? 450, 423, 174 * scale, 115];
  const controls: { object:ObjectName; label:string; use:()=>void; arrow?:boolean }[]=[];
  if (p.stage === 'prepare') {
    for (const kind of p.kinds.filter(()=>!p.ready)) {
      controls.push({object:kind,label:fruitNames[kind][p.lang],use:()=>p.onPick(kind),arrow:kind===p.nextFruit && !p.ready});
    }
    if (p.count) controls.push({object:'undo',label:vip.remove[p.lang],use:p.onUndo});
    if (p.ready) controls.push({object:'blender',label:p.actionLabel,use:p.onUse,arrow:true});
  }
  if (p.stage === 'pour') controls.push({object:'cup',label:p.actionLabel,use:p.onUse,arrow:true});
  if (p.stage === 'collect') controls.push({object:'coins',label:p.actionLabel,use:p.onUse,arrow:true});
  if (p.stage === 'order') {
    controls.push({object:'upgrades',label:vip.upgrades[p.lang],use:p.onUpgrades});
    if (p.deferred && p.arrived) controls.push({object:'customer',label:vip.talk[p.lang],use:p.onTalk,arrow:true});
  }
  return <div ref={layer} className={styles.targets}>
    {p.stage === 'serve' && <ServeCup layer={layer} label={p.actionLabel} onServe={p.onUse}>{p.serveCup}</ServeCup>}
    {p.stage === 'order' && <span className={styles.drawerTag} aria-hidden="true">{p.lang==='th'?'ของในร้าน':'Upgrades'}</span>}
    {controls.map(({object,label,use,arrow})=><button type="button" key={object} data-object={object}
      aria-label={label} title={label} data-next-action={arrow || undefined} className={styles.hotspot} style={location(place(object))}
      onClick={event => { keyboard.current = event.detail === 0; use(); }}>
      {p.guide && arrow && <svg className={styles.arrow} data-guide-for={object} viewBox="0 0 45 49" aria-hidden="true">
        <path d="M15 4h16v18h9L23 44 5 22h10Z" fill="#ffda58" stroke="#224d58" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M19 8h7v18h6" fill="none" stroke="#fff8c8" strokeWidth="3" strokeLinecap="round"/>
      </svg>}
    </button>)}
  </div>;
}

/** The child drags the full cup up to the customer. Keyboard users press Enter on it instead. */
function ServeCup({ layer, label, onServe, children }: {
  layer: RefObject<HTMLDivElement | null>; label: string; onServe: () => void; children: ReactNode;
}) {
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const [offset, setOffset] = useState<[number, number] | null>(null);
  // Release over the customer (in the 900 × 530 scene) to hand the cup over.
  const overCustomer = (clientX: number, clientY: number) => {
    const box = layer.current?.getBoundingClientRect();
    if (!box) return false;
    const x = (clientX - box.left) / box.width * 900, y = (clientY - box.top) / box.height * 530;
    return y < 238 && Math.abs(x - 478) < 170;
  };
  const end = () => { drag.current = null; setOffset(null); };
  return <button type="button" data-object="cup" data-drag="serve" data-next-action aria-label={label} title={label}
    className={`${styles.hotspot} ${styles.dragCup}`} data-dragging={offset ? true : undefined}
    style={{ ...location(places.cup), ...(offset ? { translate: `${offset[0]}px ${offset[1]}px` } : {}) }}
    onPointerDown={event => {
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* The drag still follows moves over the cup. */ }
      setOffset([0, 0]);
    }}
    onPointerMove={event => {
      const start = drag.current;
      if (start?.id === event.pointerId) setOffset([event.clientX - start.x, event.clientY - start.y]);
    }}
    onPointerUp={event => {
      if (drag.current?.id !== event.pointerId) return;
      const served = overCustomer(event.clientX, event.clientY);
      end();
      if (served) onServe();
    }}
    onPointerCancel={end} onLostPointerCapture={end}
    onClick={event => { if (event.detail === 0) onServe(); }}>
    {children}
  </button>;
}
