import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPlans, blockKinds, BUILD_ROUNDS } from '../src/features/games/data/blockBuilders.ts';
import { nextBuildPlan, placeBlock, buildComplete } from '../src/features/games/engine/blockBuilders.ts';
test('every blueprint has the required piece count, real supports and can be built bottom up',()=>{
  assert.equal(BUILD_ROUNDS,3);
  for(const plan of buildPlans){
    assert.ok(plan.slots.length>=[3,5,7][plan.level-1]&&plan.slots.length<=[4,6,8][plan.level-1]);
    assert.equal(new Set(plan.slots.map(s=>s.id)).size,plan.slots.length);
    let placed=[];
    for(const slot of [...plan.slots].sort((a,b)=>a.y-b.y)){
      assert.ok(slot.y===0||slot.supports.length);
      for(const id of slot.supports){const s=plan.slots.find(p=>p.id===id);assert.ok(s&&s.y===slot.y-1&&s.x<slot.x+slot.w&&s.x+s.w>slot.x);}
      const result=placeBlock(plan,placed,slot,slot.id);assert.equal(result.reason,'ok');placed=result.placed;
    }
    assert.equal(buildComplete(plan,placed),true);
  }
});
test('all upper blocks reject missing or partial support; wrong shape/color and duplicate drops never progress',()=>{
  for(const plan of buildPlans)for(const slot of plan.slots){
    const before=[...slot.supports];
    if(slot.supports.length){
      assert.equal(placeBlock(plan,[],slot,slot.id).reason,'support');
      for(const support of slot.supports)assert.equal(placeBlock(plan,before.filter(s=>s!==support),slot,slot.id).reason,'support');
    }
    for(const shape of Object.keys(blockKinds).filter(s=>s!==slot.shape))assert.equal(placeBlock(plan,before,{shape,color:slot.color},slot.id).reason,'retry');
    assert.equal(placeBlock(plan,before,{...slot,color:'wrong'},slot.id).reason,'retry');
    const first=placeBlock(plan,before,slot,slot.id);assert.equal(first.reason,'ok');
    assert.deepEqual(placeBlock(plan,first.placed,slot,slot.id).placed,first.placed);
    assert.deepEqual(before,slot.supports);
  }
});
test('independent bases can be placed in either order; plans never repeat immediately',()=>{
  const p=buildPlans[0];let state=[];
  for(const s of [p.slots[1],p.slots[0],p.slots[2]])state=placeBlock(p,state,s,s.id).placed;
  assert.ok(buildComplete(p,state));
  for(const p of buildPlans)for(const r of [0,.2,.5,.9,1])assert.notEqual(nextBuildPlan(p.level,p.id,r).id,p.id);
  assert.throws(()=>nextBuildPlan(4));
});
test('uses shared chrome, one star, scoped motion and legible opaque label colors',async()=>{
  const css=await readFile('src/features/games/block-builders.css','utf8');
  assert.doesNotMatch(css,/gc-game-header|ui-label|transition-all/);
  assert.match(css,/prefers-reduced-motion:no-preference/);
  const board=await readFile('src/features/games/games/BlockBuildersBoard.tsx','utf8');assert.match(board,/<DragItem/);assert.doesNotMatch(board,/<header/);
  const lum=h=>h.match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);
  for(const bg of ['ffffff','fff8e4'])for(const fg of ['123a72','1f2937'])assert.ok((lum(bg)+.05)/(lum(fg)+.05)>=4.5);
});
