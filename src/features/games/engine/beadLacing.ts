/** Pure lacing rules: neither rejected drops nor repeated events advance a round. */
export type LacingRound = { pattern: readonly string[]; prefilled: number; choices: readonly string[] };
export function laceBead(round: LacingRound, placed: readonly string[], id: string, target: string): readonly string[] {
  if (target !== 'bead-cord-tip' || !round.choices.includes(id) || round.pattern[placed.length] !== id) return placed;
  if (placed.length < round.prefilled || placed.some((value, i) => value !== round.pattern[i])) return placed;
  return [...placed, id];
}
export const lacingStart = (round: LacingRound) => round.pattern.slice(0, round.prefilled);
export const lacingDone = (round: LacingRound, placed: readonly string[]) => placed.length === round.pattern.length && placed.every((id, i) => id === round.pattern[i]);
