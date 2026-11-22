export type Sand = 0 | 1 | 2; // dry, damp, soggy
export type Piece = { id: string; shape: 'tower' | 'keep'; x: number; y: number; size: number; atop?: string };
export type CastlePlan = { plots: Piece[]; batches: Sand[] };
const gate: Piece = { id:'gate', shape:'keep', x:480, y:285, size:244 };
const flanks: Piece[] = [
  { id:'west', shape:'tower', x:306, y:325, size:164 },
  { id:'east', shape:'tower', x:654, y:325, size:164 },
];
const plans: CastlePlan[] = [
  { plots:[{ id:'tower', shape:'tower', x:480, y:310, size:218 }], batches:[0] },
  { plots:[gate,...flanks], batches:[2,1,0] },
  { plots:[gate,...flanks,{ id:'turret', shape:'tower', x:480, y:152, size:108, atop:'gate' }], batches:[0,2,0,2] },
];
export function castlePlan(level:number) { return plans[level-1] ?? plans[0]; }
export function availablePlots(plan:CastlePlan, built:readonly string[]) {
  return plan.plots.filter(p=>!built.includes(p.id) && (!p.atop || built.includes(p.atop)));
}
export function mixSand(sand:Sand, tool:'water'|'scoop'):Sand {
  return Math.max(0, Math.min(2, sand + (tool==='water'?1:-1))) as Sand;
}
