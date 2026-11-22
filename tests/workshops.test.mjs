import test from 'node:test';
import assert from 'node:assert/strict';
import { sandTrail, traceTo } from '../src/features/games/engine/sandTrails.ts';
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
  test('Sand trail '+level+' follows the guide and rejects a shortcut',()=>{
    const trail=sandTrail(level);
    const shortcut=traceTo(trail,0,trail[0],trail.at(-1));
    assert.ok(shortcut.index<trail.length-1);
    let index=0;
    for(let i=1;i<trail.length;i++){
      const move=traceTo(trail,index,trail[i-1],trail[i]);
      assert.equal(move.off,false);
      index=move.index;
    }
    assert.equal(index,trail.length-1);
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
