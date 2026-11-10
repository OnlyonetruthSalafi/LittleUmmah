import test from 'node:test';
import assert from 'node:assert/strict';
import { initial, seed, earn, startRound, completeRound, clearStars, rollover, tick, visibleInterval, shouldWarn, timeLocked, unlock, readState, writeState, MINUTE } from '../src/features/learning-stars/model.ts';
const now = new Date(2026,10,10,12).getTime();
const tomorrow = new Date(2026,10,11,12).getTime();
const fresh = () => seed(initial(now));
test('shared clock never rewinds on delayed tab callbacks; hidden intervals and local midnight', () => {
  let first=visibleInterval(now,now+MINUTE,now,true);assert.equal(first.elapsed,MINUTE);
  let second=visibleInterval(now,now+1000,first.watermark,true);assert.equal(second.elapsed,0);assert.equal(second.watermark,first.watermark);
  second=visibleInterval(now+1000,now+MINUTE,second.watermark,true);assert.equal(second.elapsed,0);
  assert.equal(visibleInterval(now,now+MINUTE,now,false).elapsed,0);
  const midnight=new Date(2026,10,11,0).getTime();assert.equal(visibleInterval(midnight-1000,midnight+1000,0,true).elapsed,1000);
});
test('starter stars only once, including clearing progress', () => {
  const s = fresh(); assert.equal(s.stars.balance,3);
  assert.equal(seed(s).stars.balance,3);
  assert.equal(seed(clearStars(s)).stars.balance,0);
});
test('one star per lesson per local day, namespaced lessons, maximum 20', () => {
  let s = earn(fresh(),'moral:a',now).state;
  assert.equal(s.stars.balance,4);
  assert.equal(earn(s,'moral:a',now).result,'duplicate');
  s = earn(s,'explore:a',now).state; assert.equal(s.stars.balance,5);
  s = earn(s,'moral:a',tomorrow).state; assert.equal(s.stars.balance,6);
  for(let i=0;i<30;i++) s=earn(s,`story:${i}`,tomorrow).state;
  assert.equal(s.stars.balance,20); assert.equal(earn(s,'arabic:a',tomorrow).result,'full');
});
test('free daily round, credit survives restart / another game / midnight until a level passes', () => {
  let s=startRound(fresh(),now).state; assert.equal(s.stars.balance,3); assert.ok(s.stars.activeRound);
  for(let i=0;i<5;i++) s=startRound(s,now).state;
  assert.equal(s.stars.balance,3);
  s=completeRound(s); s=startRound(s,now).state; assert.equal(s.stars.balance,2);
  s=startRound(s,tomorrow).state; assert.equal(s.stars.balance,2);
  s=startRound(completeRound(s),tomorrow).state; assert.equal(s.stars.balance,2);
  s=startRound(completeRound(s),tomorrow).state; assert.equal(s.stars.balance,1);
  s=startRound(completeRound(s),tomorrow).state; s=completeRound(s);
  assert.equal(startRound(s,tomorrow).blocked,'stars');
});
test('clear preserves settings, today time and free round', () => {
  let s=startRound(fresh(),now).state; s=tick(s,5*MINUTE,true,now);
  const cleared=clearStars(s); assert.deepEqual(cleared.settings,s.settings); assert.deepEqual(cleared.time,s.time);
  assert.equal(startRound(cleared,now).blocked,'stars');
});
test('visible only, two minute warning, current level grace capped at five minutes', () => {
  let s=fresh(); s.settings={...s.settings,timeEnabled:true,minutes:15};
  s=tick(s,13*MINUTE,false,now); assert.equal(s.time.used,0);
  s=tick(s,13*MINUTE,true,now); assert.ok(shouldWarn(s));
  s={...s,time:{...s.time,warned:true}}; assert.equal(shouldWarn(s),false);
  s=tick(s,2*MINUTE,true,now); assert.ok(timeLocked(s)); assert.equal(timeLocked(s,true),false);
  assert.equal(startRound(s,now).blocked,'time');
  s=tick(s,5*MINUTE-1,true,now); assert.equal(timeLocked(s,true),false);
  s=tick(s,1,true,now); assert.ok(timeLocked(s,true));
  assert.equal(timeLocked(rollover(s,tomorrow)),false); assert.equal(rollover(s,tomorrow).time.used,0);
});
test('unlock +15 / +30 gives full extra interval after overrun, whole day resets tomorrow', () => {
  let s=fresh(); s.settings={...s.settings,timeEnabled:true,minutes:15}; s=tick(s,20*MINUTE,true,now);
  for(const n of [15,30]) { const u=unlock(s,n); assert.equal(timeLocked(tick(u,(n-1)*MINUTE,true,now)),false); assert.ok(timeLocked(tick(u,n*MINUTE,true,now))); }
  s=unlock(s,'day'); assert.equal(timeLocked(tick(s,900*MINUTE,true,now)),false);
  assert.equal(rollover(s,tomorrow).time.unlimited,false);
});
test('storage read/write/corruption failures fail open; settings off retains balance', () => {
  const bad={getItem(){throw Error('private');},setItem(){throw Error('quota');}};
  assert.equal(readState(bad,now).available,false);
  assert.equal(startRound(readState(bad,now),now).blocked,undefined);
  assert.equal(writeState(bad,fresh()).available,false);
  assert.equal(readState({getItem:()=>'{bad',setItem(){}},now).available,false);
  let s=fresh(); s.settings.starsEnabled=false;
  for(let i=0;i<50;i++) s=completeRound(startRound(s,now).state);
  assert.equal(s.stars.balance,3);
});
