import test from 'node:test';
import assert from 'node:assert/strict';
import { coinLimit, nextCoinTarget, addCoin, COIN_ROUNDS } from '../src/features/games/data/coinBox.ts';

test('three rounds per level, ranges 1–3/1–5/1–10 without adjacent repeats', () => {
  assert.equal(COIN_ROUNDS, 3);
  for (const [level, max] of [[1,3],[2,5],[3,10]]) {
    assert.equal(coinLimit(level), max);
    for (let previous = 0; previous <= 10; previous++) {
      const seen = new Set();
      for (let i = 0; i < 1000; i++) {
        const n = nextCoinTarget(level, previous, i / 1000);
        assert.ok(n >= 1 && n <= max); assert.notEqual(n, previous); seen.add(n);
      }
      assert.equal(seen.size, max - (previous >= 1 && previous <= max ? 1 : 0));
    }
  }
});
test('one drop is one coin; completion prevents overflow including rapid duplicate input', () => {
  for (let target = 1; target <= 10; target++) {
    let n = 0;
    for (let i = 0; i < target; i++) { n = addCoin(n, target); assert.equal(n, i + 1); }
    assert.equal(addCoin(n, target), target);
  }
});
test('coin labels and pale surfaces retain readable contrast', () => {
  const lum = hex => hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  for(const [a,b] of [['123a72','ffffff'],['123a72','ffce59'],['123a72','f5e5bc']]) assert.ok((lum(b)+.05)/(lum(a)+.05)>=4.5);
});
