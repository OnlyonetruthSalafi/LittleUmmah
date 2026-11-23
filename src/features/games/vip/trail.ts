// Arc-length samples of the painted road, in the world artwork's coordinates.
const start = { x: 155, y: 385 };
const curves = [
  [195,381,251,365,285,345], [321,323,328,277,365,275],
  [406,272,465,317,515,310], [553,305,596,256,630,230],
  // Past the smoothie shop: down the east shore, over the bridge, to the garden.
  [662,240,702,266,740,271], [772,275,812,282,852,290],
  // From the garden north over a second bridge to the restaurant.
  [876,282,902,264,924,243], [936,229,944,212,958,190],
];
/** The curve after which each stop is reached. */
const STOP_AFTER = { shop: 4, garden: 6, restaurant: 8 } as const;
export const trailPath = 'M155 385' + curves.map(c => 'C' + c.join(' ')).join('');
const samples = [{ ...start, distance: 0 }];
const reached: Record<string, number> = {};
for (const [n, [cx,cy,dx,dy,ex,ey]] of curves.entries()) {
  const origin = samples[samples.length - 1];
  for (let i = 1; i <= 32; i++) {
    const t = i / 32, u = 1 - t;
    const x = u**3 * origin.x + 3*u*u*t*cx + 3*u*t*t*dx + t**3*ex;
    const y = u**3 * origin.y + 3*u*u*t*cy + 3*u*t*t*dy + t**3*ey;
    const previous = samples[samples.length - 1];
    samples.push({ x, y, distance: previous.distance + Math.hypot(x - previous.x, y - previous.y) });
  }
  for (const [stop, after] of Object.entries(STOP_AFTER)) if (n === after - 1) reached[stop] = samples[samples.length - 1].distance;
}
export const trailLength = samples[samples.length - 1].distance;
/** Named stops along the trail, measured from the dock. */
export const stops = reached as Record<keyof typeof STOP_AFTER, number>;
export type Stop = keyof typeof stops;
/** Plank bridges over the water along the trail (drawn in MarketMapArt). */
export const bridges = {
  garden: { from: { x: 742, y: 271 }, to: { x: 812, y: 283 } },
  restaurant: { from: { x: 925, y: 241 }, to: { x: 952, y: 201 } },
};
export function pointOnTrail(distance: number) {
  const d = Math.max(0, Math.min(trailLength, distance));
  const index = Math.max(1, samples.findIndex(p => p.distance >= d));
  const a = samples[index-1], b = samples[index];
  const fraction = (d-a.distance)/(b.distance-a.distance);
  return { x: a.x + (b.x-a.x)*fraction, y: a.y + (b.y-a.y)*fraction };
}
export function nearestTrailPoint(x: number, y: number) {
  let nearest = samples[0], best = Infinity;
  for (const p of samples) {
    const d = (p.x-x)**2 + (p.y-y)**2;
    if (d < best) { nearest = p; best = d; }
  }
  return nearest.distance;
}
