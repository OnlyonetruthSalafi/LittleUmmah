export type Weight = 1 | 2 | 3;
export type Comparison = 'left' | 'right' | 'equal';
export type BalanceQuestion = { id: string; mode: 'balance' | 'compare'; leftObject: number; rightObject: number; left: number; right: number };

export function totalWeight(blocks: readonly number[]): number { return blocks.reduce((sum, n) => sum + n, 0); }
export function compareWeights(left: number, right: number): Comparison { return left > right ? 'left' : left < right ? 'right' : 'equal'; }
// Positive CSS rotation lowers the right arm; heavier left requires negative rotation.
export function balanceAngle(left: number, right: number): number { return Math.max(-9, Math.min(9, (right - left) * 3)); }
export function weightsForLevel(level: number): Weight[] { return level <= 1 ? [1] : level === 2 ? [1, 2] : [1, 2, 3]; }
export function questionPool(level: number, round: number): BalanceQuestion[] {
  const mode = level >= 3 && round % 2 === 0 ? 'compare' : 'balance';
  const pool: BalanceQuestion[] = [];
  for (let object = 0; object < 6; object++) {
    for (let left = level <= 1 ? 1 : 2; left <= (level <= 1 ? 3 : 4); left++) {
      for (const right of mode === 'compare' ? [2, 3, 4] : [0]) {
        const rightObject = (object + 1 + (left + right) % 5) % 6;
        pool.push({ id: `${mode}-${object}-${left}-${rightObject}-${right}`, mode, leftObject: object, rightObject, left, right });
      }
    }
  }
  return pool;
}
export function nextBalanceQuestion(level: number, round: number, previous = '', random = Math.random()): BalanceQuestion {
  const pool = questionPool(level, round).filter(q => q.id !== previous);
  return pool[Math.min(pool.length - 1, Math.max(0, Math.floor(random * pool.length)))];
}
export function acceptsBalance(question: BalanceQuestion, blocks: readonly number[], choice?: Comparison): boolean {
  return question.mode === 'compare' ? choice === compareWeights(question.left, question.right) : totalWeight(blocks) === question.left;
}
