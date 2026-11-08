import { buildPlans, type BlockKind, type BuildPlan } from '../data/blockBuilders.ts';
export function nextBuildPlan(level: number, previous = '', random = Math.random()): BuildPlan {
  const pool = buildPlans.filter(p => p.level === level && p.id !== previous);
  if (!pool.length) throw new Error('Unknown building level');
  return pool[Math.min(pool.length - 1, Math.max(0, Math.floor(random * pool.length)))];
}
export function placeBlock(plan: BuildPlan, placed: readonly string[], piece: BlockKind, target: string): { placed: string[]; reason: 'ok' | 'support' | 'retry' } {
  const slot = plan.slots.find(s => s.id === target);
  if (!slot || placed.includes(target) || slot.shape !== piece.shape || slot.color !== piece.color) return { placed: [...placed], reason: 'retry' };
  if (!slot.supports.every(id => placed.includes(id))) return { placed: [...placed], reason: 'support' };
  return { placed: [...placed, target], reason: 'ok' };
}
export function buildComplete(plan: BuildPlan, placed: readonly string[]) { return plan.slots.every(s => placed.includes(s.id)); }
