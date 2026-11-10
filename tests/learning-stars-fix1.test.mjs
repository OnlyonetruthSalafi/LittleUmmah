import test from 'node:test';
import assert from 'node:assert/strict';
import { initial, seed, startRound, completeRound, isLastStar, starsOut, tick, MINUTE } from '../src/features/learning-stars/model.ts';
const now = new Date(2026,10,10,12).getTime();
const play = s => { const r = startRound(s, now); assert.equal(r.blocked, undefined); return r.state; };
test('last-star warning only when this start spends the final star', () => {
  let s = seed(initial(now));                        // 3 ดาว
  let next = play(s); assert.equal(isLastStar(s, next), false); // รอบฟรี
  s = completeRound(next);
  for (const left of [2, 1]) { next = play(s); assert.equal(isLastStar(s, next), false); assert.equal(next.stars.balance, left); s = completeRound(next); }
  next = play(s); assert.equal(next.stars.balance, 0); assert.equal(isLastStar(s, next), true);
  // เริ่มใหม่ด้วยเครดิตเดิม ไม่เตือนซ้ำ
  assert.equal(isLastStar(next, play(next)), false);
  assert.equal(starsOut(next), false);               // ยังมีเครดิต
  s = completeRound(next); assert.equal(starsOut(s), true);
  assert.equal(startRound(s, now).blocked, 'stars');
});
test('free round with zero stars is not a last-star warning; stars off never shows out', () => {
  let s = seed(initial(now)); s = { ...s, stars: { ...s.stars, balance: 0 } };
  const next = play(s); assert.equal(isLastStar(s, next), false);
  assert.equal(starsOut({ ...completeRound(next), settings: { ...s.settings, starsEnabled: false } }), false);
});
test('restarting the same unpassed level keeps the 5-minute grace; a new level does not', () => {
  let s = play(seed(initial(now)));
  s = { ...s, settings: { ...s.settings, timeEnabled: true, minutes: 15 }, time: { ...s.time, used: 16 * MINUTE } };
  assert.equal(startRound(s, now).blocked, 'time');
  assert.equal(startRound(s, now, true).blocked, undefined);
  s = { ...s, time: { ...s.time, used: 20 * MINUTE + 1 } };
  assert.equal(startRound(s, now, true).blocked, 'time');
});
test('play time is counted only while the parent limit is on', () => {
  const off = seed(initial(now));
  assert.equal(tick(off, MINUTE, true, now).time.used, 0);
  const on = { ...off, settings: { ...off.settings, timeEnabled: true } };
  assert.equal(tick(on, MINUTE, true, now).time.used, MINUTE);
});
