import railway from '../data/railway.json';

const scale = 1000 / railway.cameraWidth;
const angle = railway.cameraAngle * Math.PI / 180;
const up = Math.sin(angle);
const height = Math.cos(angle);

export const routes = railway.routes;
export type RailRoute = typeof routes[number];
export const headings = [-1, 0, 1] as const;

export function railPoint(route: RailRoute, span: number, t: number, offset = 0) {
  const turn = route.steps[span];
  const slope = turn * railway.rise * 6 * t * (1 - t) / railway.span;
  const normal = offset / Math.hypot(1, slope);
  const x = railway.startX + (span + t) * railway.span - normal * slope;
  const y = route.startY + railway.rise * (route.steps.slice(0, span).reduce((sum, n) => sum + n, 0) + turn * t * t * (3 - 2 * t)) + normal;
  return { x: 500 + x * scale, y: 250 - (up * y + height * (railway.railZ - railway.cameraZ)) * scale,
    heading: Math.atan(slope) * 180 / Math.PI };
}

function trace(route: RailRoute, span: number, side: number) {
  return Array.from({ length: 19 }, (_, i) => {
    const p = railPoint(route, span, i / 18, side);
    return (i ? 'L' : 'M') + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
  }).join(' ');
}

export function railArt(route: RailRoute, span: number) {
  const ties = Array.from({ length: 8 }, (_, i) => {
    const t = (i + .5) / 8;
    const a = railPoint(route, span, t, -.49);
    const b = railPoint(route, span, t, .49);
    return 'M' + a.x.toFixed(2) + ' ' + a.y.toFixed(2) + 'L' + b.x.toFixed(2) + ' ' + b.y.toFixed(2);
  }).join(' ');
  return { ties, rails: trace(route, span, -railway.gauge/2) + ' ' + trace(route, span, railway.gauge/2),
    center: trace(route, span, 0) };
}

// The sprites were baked with the same lens and ground contact point as the bridge.
export const engineSize = 3.35 * scale;
export const engineGround = engineSize / 2 + .66 * height * scale;
export function waitPosition(route: RailRoute, laid: number) {
  const next = route.gaps[laid];
  return next === undefined ? route.steps.length - .14 : next - .54;
}
