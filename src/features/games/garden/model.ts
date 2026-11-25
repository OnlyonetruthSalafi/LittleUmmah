import type { Text } from '@/i18n/config';

/*
  Garden (VIP game 2). Everything here is pure: a plot's look is worked out from the save plus the
  current time, so nothing grows from a running timer and the rules can be tested in node.
  Growth takes seconds, not hours: the players are 3–7 years old.
*/
export type Crop = 'carrot' | 'lettuce' | 'tomato' | 'corn' | 'pumpkin';
export const crops: Crop[] = ['carrot', 'lettuce', 'tomato', 'corn', 'pumpkin'];
export const cropNames: Record<Crop, Text> = {
  carrot: { th: 'แครอท', en: 'Carrot' }, lettuce: { th: 'ผักกาด', en: 'Lettuce' }, tomato: { th: 'มะเขือเทศ', en: 'Tomato' },
  corn: { th: 'ข้าวโพด', en: 'Corn' }, pumpkin: { th: 'ฟักทอง', en: 'Pumpkin' },
};
/** Watered milliseconds a crop needs from seed to harvest. */
export const growTime: Record<Crop, number> = { carrot: 9000, lettuce: 8000, tomato: 12000, corn: 15000, pumpkin: 18000 };
/** One full watering lasts this long. Longer crops need watering again while they grow. */
export const WATER_TIME = 7000;
/** A weed appears once per crop when it is this far grown, and halves growth until pulled. */
export const WEED_AT = 0.4;

export type Plot =
  | { kind: 'wild' }
  | { kind: 'tilled' }
  | { kind: 'crop'; crop: Crop; growth: number; water: number; weed: 'none' | 'growing' | 'pulled'; at: number };
export type Basket = Record<Crop, number>;
export type GardenItem = 'tomato' | 'beds' | 'corn' | 'sprinkler' | 'pumpkin';
export type Garden = {
  delivered: number;
  earnedCoins: number;
  activeOrder: string | null;
  nextOrder: string | null;
  plots: Plot[];
  basket: Basket;
} & Record<GardenItem, boolean>;

export const BED_COUNT = 6;
export const emptyBasket: Basket = { carrot: 0, lettuce: 0, tomato: 0, corn: 0, pumpkin: 0 };
export const emptyGarden: Garden = {
  delivered: 0, earnedCoins: 0, activeOrder: null, nextOrder: null, plots: Array.from({ length: BED_COUNT }, () => ({ kind: 'wild' }) as Plot), basket: emptyBasket,
  tomato: false, beds: false, corn: false, sprinkler: false, pumpkin: false,
};
export const GARDEN_KEY = 'little-ummah:games:garden:v1';

/** Beds the child can use: four at first, six after buying the extra beds. */
export function openBeds(garden: Pick<Garden, 'beds'>) { return garden.beds ? 6 : 4; }
export function seeds(garden: Pick<Garden, 'tomato' | 'corn' | 'pumpkin'>): Crop[] {
  return crops.filter(crop => crop === 'carrot' || crop === 'lettuce' || garden[crop as 'tomato' | 'corn' | 'pumpkin']);
}

/* ---------- time ---------- */

/** Bring one plot up to `now`. Growth only happens while there is water; a weed halves it. */
export function advance(plot: Plot, now: number, sprinkler = false): Plot {
  if (plot.kind !== 'crop') return plot;
  const elapsed = Math.max(0, now - plot.at);
  if (!elapsed) return plot;
  const total = growTime[plot.crop];
  const wet = sprinkler ? elapsed : Math.min(elapsed, plot.water);
  let growth = plot.growth;
  let weed = plot.weed;
  let left = wet;
  // Grow at full speed up to the weed point, then at half speed while a weed is there.
  if (weed === 'none' && growth < total * WEED_AT) {
    const step = Math.min(left, total * WEED_AT - growth);
    growth += step; left -= step;
    if (growth >= total * WEED_AT) weed = 'growing';
  }
  growth += weed === 'growing' ? left / 2 : left;
  return { ...plot, growth: Math.min(total, growth), water: sprinkler ? WATER_TIME : Math.max(0, plot.water - elapsed), weed, at: now };
}
export function advanceAll(garden: Garden, now: number): Garden {
  const plots = garden.plots.map(plot => advance(plot, now, garden.sprinkler));
  return plots.every((plot, i) => plot === garden.plots[i]) ? garden : { ...garden, plots };
}

export type Look = 'wild' | 'tilled' | 'seed' | 'sprout' | 'leafy' | 'ready';
export function look(plot: Plot): Look {
  if (plot.kind !== 'crop') return plot.kind;
  const share = plot.growth / growTime[plot.crop];
  if (share >= 1) return 'ready';
  if (share >= .55) return 'leafy';
  if (share >= .15) return 'sprout';
  return 'seed';
}
/** A crop that still needs water and has none left. It stops growing; it never dies. */
export function thirsty(plot: Plot, sprinkler = false) {
  return plot.kind === 'crop' && !sprinkler && plot.water <= 0 && plot.growth < growTime[plot.crop];
}
export function weedy(plot: Plot) { return plot.kind === 'crop' && plot.weed === 'growing'; }

/* ---------- actions (each returns the same object when nothing changes) ---------- */

function setPlot(garden: Garden, index: number, plot: Plot): Garden {
  if (index < 0 || index >= openBeds(garden)) return garden;
  return { ...garden, plots: garden.plots.map((old, i) => i === index ? plot : old) };
}
export function till(garden: Garden, index: number): Garden {
  return garden.plots[index]?.kind === 'wild' ? setPlot(garden, index, { kind: 'tilled' }) : garden;
}
export function sow(garden: Garden, index: number, crop: Crop, now: number): Garden {
  if (garden.plots[index]?.kind !== 'tilled' || !seeds(garden).includes(crop)) return garden;
  return setPlot(garden, index, { kind: 'crop', crop, growth: 0, water: 0, weed: 'none', at: now });
}
export function water(garden: Garden, index: number, now: number): Garden {
  const plot = advance(garden.plots[index] ?? { kind: 'wild' }, now, garden.sprinkler);
  if (plot.kind !== 'crop' || look(plot) === 'ready' || plot.water >= WATER_TIME) return garden;
  return setPlot(garden, index, { ...plot, water: WATER_TIME });
}
export function pullWeed(garden: Garden, index: number, now: number): Garden {
  const plot = advance(garden.plots[index] ?? { kind: 'wild' }, now, garden.sprinkler);
  if (plot.kind !== 'crop' || plot.weed !== 'growing') return garden;
  return setPlot(garden, index, { ...plot, weed: 'pulled' });
}
/** Harvest into the basket. Prepare the soil again before planting the next crop. */
export function harvest(garden: Garden, index: number, now: number): Garden {
  const plot = advance(garden.plots[index] ?? { kind: 'wild' }, now, garden.sprinkler);
  if (plot.kind !== 'crop' || weedy(plot) || look(plot) !== 'ready') return garden;
  const next = setPlot(garden, index, { kind: 'wild' });
  return next === garden ? garden : { ...next, basket: { ...garden.basket, [plot.crop]: garden.basket[plot.crop] + 1 } };
}

/* ---------- friends' requests ---------- */

export const visitors = ['hadi', 'safi', 'sabir'] as const;
export type Visitor = typeof visitors[number];
export type Request = { id: string; visitor: Visitor; items: Partial<Basket> };
/** Easy to hard: one crop, then two of a kind, then mixed baskets that need planning. */
const requestList: Request[] = [
  { id: 'carrot-1', visitor: 'hadi', items: { carrot: 1 } },
  { id: 'lettuce-1', visitor: 'safi', items: { lettuce: 1 } },
  { id: 'carrot-2', visitor: 'sabir', items: { carrot: 2 } },
  { id: 'carrot-lettuce', visitor: 'hadi', items: { carrot: 1, lettuce: 1 } },
  { id: 'tomato-2', visitor: 'safi', items: { tomato: 2 } },
  { id: 'salad', visitor: 'sabir', items: { lettuce: 1, tomato: 1, carrot: 1 } },
  { id: 'corn-1', visitor: 'hadi', items: { corn: 1 } },
  { id: 'corn-tomato', visitor: 'safi', items: { corn: 1, tomato: 2 } },
  { id: 'pumpkin-1', visitor: 'sabir', items: { pumpkin: 1 } },
  { id: 'soup', visitor: 'hadi', items: { pumpkin: 1, carrot: 2 } },
  { id: 'feast', visitor: 'safi', items: { corn: 1, lettuce: 2, pumpkin: 1 } },
];
export const allRequests = requestList;
const value: Record<Crop, number> = { carrot: 2, lettuce: 2, tomato: 3, corn: 4, pumpkin: 5 };
function availableRequests(garden: Garden) {
  const owned = seeds(garden);
  return requestList.filter(r => Object.keys(r.items).every(crop => owned.includes(crop as Crop)));
}
/** Keep accepted orders stable. A seed purchase moves the next customer to that seed's first recipe. */
export function request(garden: Garden): Request & { reward: number } {
  const open = availableRequests(garden);
  const pick = open.find(r => r.id === (garden.activeOrder ?? garden.nextOrder)) ?? open[garden.delivered % open.length];
  const reward = 1 + Object.entries(pick.items).reduce((sum, [crop, n]) => sum + value[crop as Crop] * (n ?? 0), 0);
  return { ...pick, reward };
}
export function missing(garden: Garden, wanted: Partial<Basket>): Partial<Basket> {
  const out: Partial<Basket> = {};
  for (const [crop, n] of Object.entries(wanted) as [Crop, number][]) {
    if (garden.basket[crop] < n) out[crop] = n - garden.basket[crop];
  }
  return out;
}

export type Tool = 'hoe' | 'can' | 'fork' | `seed:${Crop}`;
type GardenStep =
  | { task: 'sow'; bed: number; tool: Tool; crop: Crop }
  | { task: 'dig' | 'water' | 'weed' | 'harvest' | 'grow' | 'sell'; bed: number; tool?: Tool };

/** Suggest one move for the current order, using the plots as they look right now. */
export function nextGardenStep(plots: Plot[], lacking: Partial<Basket>, sprinkler: boolean): GardenStep {
  const needed = crops.filter(crop => lacking[crop]);
  if (!needed.length) return { task: 'sell', bed: -1 };
  const weedBed = plots.findIndex(weedy);
  if (weedBed >= 0) return { task: 'weed', bed: weedBed, tool: 'fork' };
  const plantBeds = plots.flatMap((plot, bed) => plot.kind === 'crop' ? [{ plot, bed }] : []);
  const requested = plantBeds.filter(({ plot }) => needed.includes(plot.crop));
  const seed = needed.find(crop => requested.filter(({ plot }) => plot.crop === crop).length < lacking[crop]!);
  let empty = plots.findIndex(p => p.kind === 'tilled');
  if (empty < 0) empty = plots.findIndex(p => p.kind === 'wild');
  // If every bed holds a different crop, help clear a bed for the requested seed.
  const tending = seed && empty < 0 && !requested.length ? plantBeds : requested;
  for (const { plot, bed } of tending) {
    if (look(plot) === 'ready') return { task: 'harvest', bed, tool: 'fork' };
    if (thirsty(plot, sprinkler)) return { task: 'water', bed, tool: 'can' };
  }
  if (seed && empty >= 0) return plots[empty].kind === 'wild'
    ? { task: 'dig', bed: empty, tool: 'hoe' }
    : { task: 'sow', bed: empty, tool: `seed:${seed}`, crop: seed };
  return { task: 'grow', bed: tending[0].bed };
}
export function prepareOrder(garden: Garden, id: string): Garden {
  return garden.activeOrder === id ? garden : { ...garden, activeOrder: id, nextOrder: null, basket: emptyBasket, plots: emptyGarden.plots };
}

/** The customer takes the whole basket. The next order starts on unworked soil. */
export function deliver(garden: Garden, wanted: ReturnType<typeof request>): Garden {
  if (garden.activeOrder !== wanted.id || Object.keys(missing(garden, wanted.items)).length) return garden;
  const open = availableRequests(garden);
  const following = open[(open.findIndex(r => r.id === wanted.id) + 1) % open.length];
  return { ...garden, activeOrder: null, nextOrder: garden.nextOrder ?? following.id,
    basket: emptyBasket, plots: emptyGarden.plots, delivered: garden.delivered + 1, earnedCoins: garden.earnedCoins + wanted.reward };
}

/* ---------- shop items (paid with the smoothie shop's coins) ---------- */

export const gardenItems: { id: GardenItem; price: number; delivered: number; needs?: GardenItem }[] = [
  { id: 'tomato', price: 8, delivered: 2 },
  { id: 'beds', price: 10, delivered: 3 },
  { id: 'corn', price: 14, delivered: 5, needs: 'tomato' },
  { id: 'sprinkler', price: 18, delivered: 6, needs: 'beds' },
  { id: 'pumpkin', price: 20, delivered: 7, needs: 'corn' },
];
function firstRequestFor(crop: Crop) {
  return requestList.find(r => r.items[crop])!.id;
}
export function unlockGardenItem(garden: Garden, item: GardenItem): Garden {
  if (garden[item]) return garden;
  const nextOrder = item === 'beds' || item === 'sprinkler' ? garden.nextOrder : firstRequestFor(item);
  return { ...garden, [item]: true, nextOrder };
}
export type GardenBlocker = { kind: 'owned' } | { kind: 'needs'; item: GardenItem } | { kind: 'delivered'; count: number } | { kind: 'coins'; count: number };
export function gardenBlocker(garden: Garden, coins: number, item: GardenItem): GardenBlocker | undefined {
  const rule = gardenItems.find(i => i.id === item)!;
  if (garden[item]) return { kind: 'owned' };
  if (rule.needs && !garden[rule.needs]) return { kind: 'needs', item: rule.needs };
  if (garden.delivered < rule.delivered) return { kind: 'delivered', count: rule.delivered - garden.delivered };
  if (coins < rule.price) return { kind: 'coins', count: rule.price - coins };
  return undefined;
}

/* ---------- save ---------- */

function readPlot(v: unknown): Plot {
  if (!v || typeof v !== 'object') return { kind: 'wild' };
  const p = v as Record<string, unknown>;
  if (p.kind === 'tilled') return { kind: 'tilled' };
  if (p.kind === 'crop' && crops.includes(p.crop as Crop)
    && [p.growth, p.water, p.at].every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0)
    && ['none', 'growing', 'pulled'].includes(p.weed as string)) {
    const crop = p.crop as Crop;
    return { kind: 'crop', crop, growth: Math.min(growTime[crop], p.growth as number), water: Math.min(WATER_TIME, p.water as number),
      weed: p.weed as 'none' | 'growing' | 'pulled', at: p.at as number };
  }
  return { kind: 'wild' };
}
export function readGarden(raw: string | null): Garden {
  if (!raw) return emptyGarden;
  try {
    const v = JSON.parse(raw);
    if (!v || !Number.isSafeInteger(v.delivered) || v.delivered < 0) return emptyGarden;
    const plots = Array.from({ length: BED_COUNT }, (_, i) => readPlot(Array.isArray(v.plots) ? v.plots[i] : undefined));
    const basket = { ...emptyBasket };
    for (const crop of crops) {
      const n = v.basket?.[crop];
      if (Number.isSafeInteger(n) && n >= 0 && n <= 99) basket[crop] = n;
    }
    // Credit old deliveries at their minimum payout, including the third customer's two carrots.
    const earnedCoins = Number.isSafeInteger(v.earnedCoins) && v.earnedCoins >= 0 ? v.earnedCoins
      : Math.min(Number.MAX_SAFE_INTEGER, v.delivered * 3 + (v.delivered >= 3 ? 2 : 0));
    const garden: Garden = { ...emptyGarden, delivered: v.delivered, earnedCoins, plots, basket };
    for (const { id } of gardenItems) garden[id] = v[id] === true;
    const open = availableRequests(garden);
    garden.nextOrder = open.find(r => r.id === v.nextOrder)?.id ?? null;
    if (!('nextOrder' in v)) {
      const newest = seeds(garden).filter(crop => crop !== 'carrot' && crop !== 'lettuce').at(-1);
      if (newest && !open.find(r => r.id === v.activeOrder)?.items[newest]) garden.nextOrder = firstRequestFor(newest);
    }
    if (open.some(r => r.id === v.activeOrder)) {
      return { ...garden, activeOrder: v.activeOrder };
    }
    return { ...garden, plots: emptyGarden.plots, basket: emptyBasket };
  } catch { /* A damaged save starts a new garden. */ }
  return emptyGarden;
}
