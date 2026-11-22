// Arc-length samples of the painted road, in the world artwork's coordinates.
const start = { x: 155, y: 385 };
const curves = [
  [195,381,251,365,285,345], [321,323,328,277,365,275],
  [406,272,465,317,515,310], [553,305,596,256,630,230],
];
export const trailPath = 'M155 385' + curves.map(c => 'C' + c.join(' ')).join('');
const samples = [{ ...start, distance: 0 }];
for (const [cx,cy,dx,dy,ex,ey] of curves) {
  const origin = samples[samples.length - 1];
  for (let i = 1; i <= 32; i++) {
    const t = i / 32, u = 1 - t;
    const x = u**3 * origin.x + 3*u*u*t*cx + 3*u*t*t*dx + t**3*ex;
    const y = u**3 * origin.y + 3*u*u*t*cy + 3*u*t*t*dy + t**3*ey;
    const previous = samples[samples.length - 1];
    samples.push({ x, y, distance: previous.distance + Math.hypot(x - previous.x, y - previous.y) });
  }
}
export const trailLength = samples[samples.length - 1].distance;
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
