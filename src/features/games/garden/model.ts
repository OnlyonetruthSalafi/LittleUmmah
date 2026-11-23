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
  plots: Plot[];
  basket: Basket;
  /** Step numbers on the hoe, seeds, can and basket. On until the child turns them off. */
  hints: boolean;
} & Record<GardenItem, boolean>;

export const BED_COUNT = 6;
export const emptyBasket: Basket = { carrot: 0, lettuce: 0, tomato: 0, corn: 0, pumpkin: 0 };
export const emptyGarden: Garden = {
  delivered: 0, plots: Array.from({ length: BED_COUNT }, () => ({ kind: 'wild' }) as Plot), basket: emptyBasket, hints: true,
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
/** Pulling a ready crop puts it in the basket. The bed stays dug, ready for the next seed. */
export function harvest(garden: Garden, index: number, now: number): Garden {
  const plot = advance(garden.plots[index] ?? { kind: 'wild' }, now, garden.sprinkler);
  if (plot.kind !== 'crop' || look(plot) !== 'ready') return garden;
  const next = setPlot(garden, index, { kind: 'tilled' });
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
/** Requests the child can fill with the seeds they own, newest first after the opening three. */
export function request(garden: Garden): Request & { reward: number } {
  const owned = seeds(garden);
  const open = requestList.filter(r => Object.keys(r.items).every(crop => owned.includes(crop as Crop)));
  // Walk the list in order once; after that, cycle through what is available.
  const pick = garden.delivered < open.length ? open[garden.delivered] : open[garden.delivered % open.length];
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
/** Hand over the basket. Extra vegetables stay in the basket for the next friend. */
export function deliver(garden: Garden, wanted: Request): Garden {
  if (Object.keys(missing(garden, wanted.items)).length) return garden;
  const basket = { ...garden.basket };
  for (const [crop, n] of Object.entries(wanted.items) as [Crop, number][]) basket[crop] -= n;
  return { ...garden, basket, delivered: garden.delivered + 1 };
}

/* ---------- shop items (paid with the smoothie shop's coins) ---------- */

export const gardenItems: { id: GardenItem; price: number; delivered: number; needs?: GardenItem }[] = [
  { id: 'tomato', price: 8, delivered: 2 },
  { id: 'beds', price: 10, delivered: 3 },
  { id: 'corn', price: 14, delivered: 5, needs: 'tomato' },
  { id: 'sprinkler', price: 18, delivered: 6, needs: 'beds' },
  { id: 'pumpkin', price: 20, delivered: 7, needs: 'corn' },
];
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
    const garden: Garden = { ...emptyGarden, delivered: v.delivered, plots, basket, hints: v.hints !== false };
    for (const { id } of gardenItems) garden[id] = v[id] === true;
    return garden;
  } catch { /* A damaged save starts a new garden. */ }
  return emptyGarden;
}
