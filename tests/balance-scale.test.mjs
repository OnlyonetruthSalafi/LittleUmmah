import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BALANCE_ROUNDS, MAX_BLOCKS, balanceObjects } from '../src/features/games/data/balanceScale.ts';
import { totalWeight, compareWeights, balanceAngle, weightsForLevel, questionPool, nextBalanceQuestion, acceptsBalance } from '../src/features/games/engine/balanceScale.ts';

test('weight totals, all comparisons and tilt direction use the actual sums', () => {
  assert.equal(totalWeight([]), 0); assert.equal(totalWeight([1,2,3]), 6);
  for (let left=0;left<=12;left++) for(let right=0;right<=12;right++) {
    assert.equal(compareWeights(left,right),left===right?'equal':left>right?'left':'right');
    assert.equal(Math.sign(balanceAngle(left,right)),Math.sign(right-left));
    assert.ok(Math.abs(balanceAngle(left,right))<=9);
  }
});
test('every generated puzzle is solvable; every valid combination and order is accepted', () => {
  assert.equal(BALANCE_ROUNDS,3);
  for(let level=1;level<=3;level++) for(let round=0;round<3;round++) {
    const pool=questionPool(level,round);
    assert.equal(new Set(pool.map(q=>q.id)).size,pool.length);
    for(const q of pool) {
      assert.ok(balanceObjects[q.leftObject] && balanceObjects[q.rightObject]);
      assert.equal(q.mode,level===3&&round%2===0?'compare':'balance');
      if(q.mode==='compare') {
        for(const c of ['left','right','equal']) assert.equal(acceptsBalance(q,[],c),c===compareWeights(q.left,q.right));
      } else {
        let correct=0;
        const visit=(blocks)=>{assert.equal(acceptsBalance(q,blocks),totalWeight(blocks)===q.left);if(acceptsBalance(q,blocks))correct++;if(blocks.length<MAX_BLOCKS)for(const w of weightsForLevel(level))visit([...blocks,w]);};
        visit([]);assert.ok(correct>0);if(level===2)assert.ok(correct>1);
      }
    }
  }
});
test('new questions never immediately repeat, including same-round rerolls', () => {
  for(let level=1;level<=3;level++)for(let round=0;round<3;round++)for(const q of questionPool(level,round))for(const random of [0,.25,.5,.75,.999999,1])assert.notEqual(nextBalanceQuestion(level,round,q.id,random).id,q.id);
});
test('game retains shared chrome and readable contrast', async () => {
  const css=await readFile('src/features/games/balance-scale.css','utf8');
  assert.doesNotMatch(css,/gc-game-header|ui-label|transition-all/);
  assert.doesNotMatch(await readFile('src/features/games/games/BalanceScaleBoard.tsx','utf8'),/<header|gc-game-header/);
  const luminance=hex=>hex.match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  for(const bg of ['ffffff','fff8e4','eee0c4'])assert.ok((luminance(bg)+.05)/(luminance('123a72')+.05)>=4.5);
});
