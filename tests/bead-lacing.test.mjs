import assert from 'node:assert/strict';
import test from 'node:test';
import { BEADS, BEAD_LEVELS, BEAD_TEXT, beadHint } from '../src/features/games/data/beadLacing.ts';
import { laceBead, lacingStart, lacingDone } from '../src/features/games/engine/beadLacing.ts';
import { createProgressRepository } from '../src/features/games/engine/progress.ts';
import { gamePresentation } from '../src/features/games/data/presentation.ts';
import { readFile, stat } from 'node:fs/promises';
test('four colors times three shapes, bilingual labels and hints', () => {
 assert.equal(BEADS.length,12); assert.equal(new Set(BEADS.map(b=>b.id)).size,12);
 for(const b of BEADS){assert.ok(b.label.th&&b.label.en);assert.ok(beadHint(b.id).th.includes(b.label.th));}
 for(const t of Object.values(BEAD_TEXT))assert.ok(t.th&&t.en);
});
for(const [l,rounds] of BEAD_LEVELS.entries())test(`level ${l+1}: three rounds reject wrong beads and complete in exact order`,()=>{
 assert.equal(rounds.length,3);
 for(const r of rounds){
  assert.equal(r.choices.length,4);assert.ok(r.pattern.every(id=>r.choices.includes(id)));
  let placed=lacingStart(r);assert.equal(lacingDone(r,placed),false);
  const initial=[...placed];
  for(let i=r.prefilled;i<r.pattern.length;i++){
   for(const wrong of r.choices.filter(id=>id!==r.pattern[i]))assert.equal(laceBead(r,placed,wrong,'bead-cord-tip'),placed);
   assert.equal(laceBead(r,placed,r.pattern[i],'outside'),placed);
   assert.equal(laceBead(r,placed,'unknown','bead-cord-tip'),placed);
   const prev=placed;placed=laceBead(r,placed,r.pattern[i],'bead-cord-tip');assert.equal(placed.length,prev.length+1);
  }
  assert.ok(lacingDone(r,placed));assert.equal(laceBead(r,placed,r.pattern[0],'bead-cord-tip'),placed);
  assert.deepEqual(lacingStart(r),initial);
  if(l<2)assert.equal(r.pattern.length,l===0?3:5);
  else{assert.ok([2,3].includes(r.pattern.length-r.prefilled));const period=r.prefilled===4?2:3;assert.deepEqual(r.pattern.slice(0,period),r.pattern.slice(period,period*2));}
 }
});
test('all beads appear in actual rounds; completed levels earn one star each, replay cannot farm stars',()=>{
 assert.deepEqual([...new Set(BEAD_LEVELS.flat().flatMap(r=>r.pattern))].sort(),BEADS.map(b=>b.id).sort());
 const values=new Map();const repo=createProgressRepository(()=>({getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)}));
 for(const level of [1,2,3]){repo.complete('bead-lacing',level,gamePresentation['bead-lacing'].starsPerLevel);repo.complete('bead-lacing',level,gamePresentation['bead-lacing'].starsPerLevel);}
 assert.equal(repo.read('bead-lacing').stars,3);
});
test('new text backgrounds meet contrast and all runtime assets and speech exist',async()=>{
 const lum=hex=>{const c=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 for(const bg of ['ffffff','eef8ff','fff9e9'])assert.ok((lum(bg)+.05)/(lum('1f2937')+.05)>4.5);
 for(const b of BEADS){assert.ok((await stat(`public${b.src}`)).size>100);assert.ok((await stat(`public${b.threaded}`)).size>100);assert.ok((await stat(`public/audio/th/bead-hint-${b.id}.mp3`)).size>1000);}
 const p=await readFile('src/features/games/data/comingSoon.ts','utf8');assert.ok(!p.includes('bead-lacing'));
});
