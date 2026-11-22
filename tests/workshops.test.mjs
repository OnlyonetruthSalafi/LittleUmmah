import test from 'node:test';
import assert from 'node:assert/strict';
import { availablePlots, castlePlan, mixSand } from '../src/features/games/engine/sandcastle.ts';
import { canalMission, nextLockAction, operateLock } from '../src/features/games/engine/canalLock.ts';

test('the lock equalises before each crossing, and every reachable height can recover', () => {
  for (const level of [1, 2, 3]) {
    const mission = canalMission(level);
    for (const berth of ['approach', 'chamber']) {
      for (const water of [0, 1, 2]) {
        let state = { berth, water };
        const target = berth === 'approach' ? mission.left : mission.right;
        if (water !== target) assert.equal(operateLock(mission, state, 'open'), state);
        if (!water) assert.equal(operateLock(mission, state, 'drain'), state);
        if (water === 2) assert.equal(operateLock(mission, state, 'fill'), state);
        for (let i = 0; i < 7 && state.berth !== 'harbour'; i++) {
          state = operateLock(mission, state, nextLockAction(mission, state));
        }
        assert.deepEqual(state, { berth: 'harbour', water: mission.right });
        assert.equal(operateLock(mission, state, 'open'), state);
      }
    }
  }
});
import { branch, followMarble, marbleMachine, nextMarbleGate, rollPosition } from '../src/features/games/engine/marbleRun.ts';

for(const level of [1,2,3]){
  test('Castle '+level+' has enough batches, reachable sites and reversible mixing',()=>{
    const plan=castlePlan(level),built=[];
    assert.equal(plan.plots.length,plan.batches.length);
    assert.equal(availablePlots(plan,[]).some(p=>p.atop),false);
    for(const batch of plan.batches){
      assert.equal(batch===1?batch:mixSand(batch,batch===0?'water':'scoop'),1);
      const plot=availablePlots(plan,built).at(-1);
      assert.ok(plot && !built.includes(plot.id));
      built.push(plot.id);
    }
    assert.deepEqual(availablePlots(plan,built),[]);
    assert.equal(mixSand(0,'scoop'),0);assert.equal(mixSand(2,'water'),2);
  });
  test('Idle arrows lead each possible switch configuration to the target on level '+level,()=>{
    const machine=marbleMachine(level);
    for(let layout=0;layout<3**machine.gates.length;layout++){
      const initial=machine.gates.map((_,i)=>Math.floor(layout/3**i)%3-1);
      for(const target of machine.goals){
        const dirs=[...initial];
        for(let flips=0;flips<=4;flips++){
          const gate=nextMarbleGate(machine,dirs,target);
          if(followMarble(machine,dirs).cup===target){assert.equal(gate,null);break;}
          assert.ok(Number.isInteger(gate) && flips<4);
          dirs[gate]=dirs[gate]===-1?1:-1;
        }
      }
    }
  });
  test('Marble machine '+level+' delivers to every target and detects gaps',()=>{
    const machine=marbleMachine(level);
    const empty=machine.gates.map(()=>0);
    assert.equal(followMarble(machine,empty).cup,-1);
    for(const cup of machine.goals){
      const dirs=[...empty];
      if(dirs.length===1)dirs[0]=cup===1?1:-1;
      else {
        dirs[0]=cup<2?-1:1;
        assert.equal(followMarble(machine,dirs).cup,-1);
        dirs[cup<2?1:2]=cup%2===0?-1:1;
      }
      const {points,cup:landed}=followMarble(machine,dirs);
      assert.equal(landed,cup);
      const firstRamp=branch(machine,0,dirs[0]).track;
      assert.deepEqual(points.slice(1,1+firstRamp.length),firstRamp);
      assert.deepEqual(firstRamp[0],machine.gates[0]);
      assert.ok(firstRamp.length>10 && firstRamp.at(-1).y<branch(machine,0,dirs[0]).to.y);
      assert.deepEqual(rollPosition(points,5000),machine.cups[cup]);
    }
  });
}
