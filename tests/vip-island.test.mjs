import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { collect, customers, emptyShop, needsFruit, readLedger, ticket, unlock } from '../src/features/games/smoothie/model.ts';
import { nearestTrailPoint, pointOnTrail, trailLength } from '../src/features/games/vip/trail.ts';

test('map taps and keyboard travel can reach both trail ends and intermediate stops', () => {
  for (const [x,y] of [[155,385], [285,345], [365,275], [515,310], [630,230]]) {
    const p = pointOnTrail(nearestTrailPoint(x,y));
    assert.ok(Math.hypot(p.x - x, p.y - y) < 0.01);
  }
  assert.deepEqual(pointOnTrail(-100), {x:155, y:385});
  assert.deepEqual(pointOnTrail(trailLength + 50), {x:630, y:230});
});
test('sale and upgrade are credited once, only affordable items can be bought', () => {
  const order = ticket(emptyShop);
  assert.equal(needsFruit(order.fruit, ['orange'], 'orange'), false);
  assert.equal(needsFruit(order.fruit, ['orange'], 'banana'), true);
  assert.equal(unlock(emptyShop,'gold'), emptyShop);
  const paid = collect(emptyShop,order);
  assert.equal(paid.coins,5);
  assert.equal(collect(paid,order),paid);
  const upgraded = unlock(paid,'berry');
  assert.equal(upgraded.coins,0);
  assert.equal(unlock(upgraded,'berry'),upgraded);
  assert.ok(ticket(upgraded).fruit.includes('berry'));
  assert.deepEqual(readLedger(JSON.stringify(upgraded)),upgraded);
});
test('every ticket has a bilingual line and a recorded Thai order for its customer', () => {
  const lines = JSON.parse(readFileSync(new URL('../src/features/games/smoothie/orders.json',import.meta.url),'utf8'));
  const seen = new Set();
  for (const berry of [true,false]) for (let served=0; served<24; served++) {
    const recipe = ticket({...emptyShop, served, berry}).fruit.join('-');
    const visitor = customers[served % customers.length];
    const clip = `${visitor}-${recipe}`;
    if (seen.has(clip)) continue;
    seen.add(clip);
    assert.ok(lines[recipe].th && lines[recipe].en);
    const file = new URL(`../public/audio/th/smoothie/${clip}.mp3`,import.meta.url);
    assert.ok(readFileSync(file).length > 1000);
  }
  assert.equal(seen.size,24);
});

test('customers greet the player before ordering and the player has two distinct replies', () => {
  const read = path => readFileSync(new URL(path,import.meta.url));
  const lines = JSON.parse(read('../src/features/games/smoothie/conversation.json'));
  assert.equal(lines.greeting.th, 'อัสสลามมู่อ้าลัยกุ้ม');
  assert.notEqual(lines.reply.th, lines.replyLong.th);
  for (const name of customers.map(c => c+'-shop-salam')) {
    assert.ok(read('../public/audio/th/smoothie/'+name+'.mp3').length > 1000);
  }
  const recipes = JSON.parse(read('../src/features/games/smoothie/orders.json'));
  for (const line of Object.values(recipes)) assert.doesNotMatch(line.th, /สวัสดี|อัสสลาม/);
});

test('invalid data recovers a fresh shop', () => {
  for (const save of ['{', '{"served":-1,"coins":5}', 'null']) assert.deepEqual(readLedger(save),emptyShop);
});
