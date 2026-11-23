import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { cheapest, dishById, dishes, meal, meals, pleases, readLunch, reward, total, verdict } from '../src/features/games/restaurant/model.ts';

test('every meal can make all friends happy within the lunch money', () => {
  for (const m of meals) {
    assert.ok(cheapest(m) <= m.budget, `meal ${m.id}: cheapest ${cheapest(m)} > ${m.budget}`);
    for (const seat of m.seats) assert.ok(dishes.some(d => pleases(d, seat.wants)), `meal ${m.id} ${seat.diner}`);
  }
});

test('later meals need the budget: picking any matching dish is not always affordable', () => {
  const m = meals.at(-1);
  const priciest = m.seats.reduce((sum, seat) => sum + Math.max(...dishes.filter(d => pleases(d, seat.wants)).map(d => d.price)), 0);
  assert.ok(priciest > m.budget);
  assert.equal(cheapest(m), m.budget, 'the last meal is exactly affordable');
});

test('meals grow from one friend to three and then keep cycling the harder ones', () => {
  assert.equal(meal(0).seats.length, 1);
  assert.equal(meal(6).seats.length, 3);
  for (let i = 7; i < 30; i++) assert.ok(meal(i).seats.length >= 2);
});

test('wishes are checked one by one', () => {
  assert.equal(pleases(dishById['spicy-stirfry'], [{ kind: 'mild' }]), false);
  assert.equal(pleases(dishById['pumpkin-soup'], [{ kind: 'hot' }, { kind: 'has', crop: 'pumpkin' }]), true);
  assert.equal(pleases(dishById.sandwich, [{ kind: 'big' }]), false);
  const m = meals[2];
  assert.deepEqual(verdict(m, ['salad', 'grilled-corn']), [true, false]);
  assert.deepEqual(verdict(m, ['salad', null]), [true, false]);
  assert.equal(total(['salad', 'pumpkin-soup']), 9);
});

test('coins reward saving money and getting it right first time', () => {
  const m = meals[2];
  assert.equal(reward(m, 8, 0), 1 + 4);
  assert.ok(reward(m, 8, 2) < reward(m, 8, 0));
  assert.equal(reward(m, 99, 99), 1);
});

test('saves load safely', () => {
  assert.deepEqual(readLunch(null), { eaten: 0 });
  assert.deepEqual(readLunch('{"eaten":4}'), { eaten: 4 });
  assert.deepEqual(readLunch('{bad'), { eaten: 0 });
});

test('every line has text and a recorded clip', () => {
  const lines = JSON.parse(readFileSync('src/features/games/restaurant/lines.json', 'utf8'));
  for (const m of meals) for (const seat of m.seats) {
    assert.ok(lines.seats[seat.line]?.th, seat.line);
    assert.ok(existsSync(`public/audio/th/restaurant/${seat.line}.mp3`), seat.line);
  }
  for (const diner of ['hadi', 'safi', 'sabir']) for (const key of Object.keys(lines.friend)) {
    assert.ok(existsSync(`public/audio/th/restaurant/${diner}-${key}.mp3`), diner + key);
  }
  for (const key of Object.keys(lines.waiter)) assert.ok(existsSync(`public/audio/th/restaurant/waiter-${key}.mp3`), key);
});
