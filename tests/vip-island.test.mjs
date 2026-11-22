import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { allRecipes, blocker, collect, customers, emptyShop, menu, needsFruit, readLedger, stocked, ticket, unlock, upgrades } from '../src/features/games/smoothie/model.ts';
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
  assert.ok(ticket({ ...upgraded, served: upgraded.served + 1 }).fruit.includes('berry'));
  assert.deepEqual(readLedger(JSON.stringify(upgraded)),upgraded);
});
test('every recipe on every menu has a bilingual line and a recorded Thai order for each customer', () => {
  const lines = JSON.parse(readFileSync(new URL('../src/features/games/smoothie/orders.json',import.meta.url),'utf8'));
  const full = Object.fromEntries(upgrades.map(u => [u.id, true]));
  const keys = new Set(allRecipes.map(r => r.join('-')));
  assert.equal(keys.size, 17);
  assert.deepEqual(new Set(menu({ ...emptyShop, ...full }).map(r => r.join('-'))), keys);
  assert.deepEqual(Object.keys(lines).sort(), [...keys].sort());
  for (const recipe of keys) {
    assert.ok(lines[recipe].th && lines[recipe].en);
    for (const visitor of customers) {
      const file = new URL(`../public/audio/th/smoothie/${visitor}-${recipe}.mp3`,import.meta.url);
      assert.ok(readFileSync(file).length > 1000, visitor + '-' + recipe);
    }
  }
});

test('the first two customers keep the original orders and price', () => {
  assert.deepEqual(ticket(emptyShop), { id: 0, fruit: ['orange','banana'], value: 5 });
  assert.deepEqual(ticket({ ...emptyShop, served: 1 }).fruit, ['banana','banana']);
});

test('items unlock in order: cups sold, an earlier item, then coins', () => {
  const rich = { ...emptyShop, coins: 500 };
  assert.deepEqual(blocker(rich, 'berry'), { kind: 'served', count: 1 });
  assert.deepEqual(blocker({ ...rich, served: 20 }, 'mango'), { kind: 'needs', item: 'berry' });
  assert.deepEqual(blocker({ ...emptyShop, served: 20, berry: true, coins: 3 }, 'mango'), { kind: 'coins', count: 12 });
  let shop = { ...rich, served: 20 };
  for (const { id, price } of upgrades) {
    const before = shop.coins;
    shop = unlock(shop, id);
    assert.equal(shop[id], true);
    assert.equal(shop.coins, before - price);
    assert.equal(blocker(shop, id).kind, 'owned');
  }
  assert.equal(500 - shop.coins, 103);
  assert.deepEqual(stocked(shop), ['orange','banana','berry','mango','melon']);
});

test('every recipe only uses fruit that is in stock, and cups get harder', () => {
  let shop = { ...emptyShop, served: 30, coins: 1000 };
  let longest = 0;
  for (const { id } of upgrades) {
    shop = unlock(shop, id);
    const kinds = stocked(shop);
    for (const recipe of menu(shop)) for (const fruit of recipe) assert.ok(kinds.includes(fruit), id + ' ' + recipe);
    const top = Math.max(...menu(shop).map(r => r.length));
    assert.ok(top >= longest);
    longest = top;
  }
  assert.equal(longest, 4);
  assert.equal(menu({ ...emptyShop, berry: true, mango: true }).some(r => r.length === 4), false);
});

test('the customer after a purchase orders the newest recipe, even after a reload', () => {
  let shop = { ...emptyShop, served: 6, coins: 500, berry: true, menuStart: 2 };
  shop = unlock(shop, 'mango');
  assert.equal(shop.menuStart, 7);
  assert.ok(ticket(shop).fruit.length > 0);              // customer 6 still at the counter (reload case)
  assert.ok(ticket({ ...shop, served: 7 }).fruit.includes('mango'));
  shop = unlock({ ...shop, served: 10 }, 'bigCup');
  assert.equal(ticket({ ...shop, served: 11 }).fruit.length, 4);
  shop = unlock({ ...shop, served: 13 }, 'melon');
  assert.ok(ticket({ ...shop, served: 14 }).fruit.includes('melon'));
  const decorated = unlock({ ...shop, served: 20, flowers: false }, 'flowers');
  assert.equal(decorated.menuStart, shop.menuStart);
  for (let served = 0; served < 20; served++) assert.ok(ticket({ ...shop, served }).fruit);
});

test('decorations add a tip to every cup', () => {
  const plain = ticket({ ...emptyShop, served: 3 }).value;
  assert.equal(ticket({ ...emptyShop, served: 3, flowers: true, lantern: true }).value, plain + 2);
});

test('a save from before the item shelf keeps its coins and items', () => {
  const old = readLedger(JSON.stringify({ served: 7, coins: 9, berry: true, gold: false }));
  assert.equal(old.served, 7); assert.equal(old.coins, 9); assert.equal(old.berry, true);
  for (const id of ['gold','flowers','mango','lantern','bigCup','melon']) assert.equal(old[id], false);
  assert.equal(old.menuStart, 0);
  assert.deepEqual(ticket({ ...old, berry: false }).fruit, ticket({ ...emptyShop, served: 7 }).fruit);
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
