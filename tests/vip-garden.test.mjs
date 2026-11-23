import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  advance, allRequests, deliver, emptyGarden, gardenBlocker, gardenItems, growTime, harvest, look, missing, openBeds,
  pullWeed, readGarden, request, seeds, sow, thirsty, till, water, WATER_TIME, weedy,
} from '../src/features/games/garden/model.ts';

const t0 = 1_000_000;
function planted(crop = 'carrot', index = 0) {
  return sow(till(emptyGarden, index), index, crop, t0);
}

test('a bed must be dug before seeds go in, and only owned seeds can be sown', () => {
  assert.equal(sow(emptyGarden, 0, 'carrot', t0), emptyGarden);
  const dug = till(emptyGarden, 0);
  assert.equal(dug.plots[0].kind, 'tilled');
  assert.equal(sow(dug, 0, 'tomato', t0), dug);
  assert.equal(sow(dug, 0, 'carrot', t0).plots[0].kind, 'crop');
  assert.equal(till(emptyGarden, 5), emptyGarden, 'beds 5–6 are closed until bought');
  assert.equal(openBeds({ beds: true }), 6);
});

test('crops grow only while watered, wilt when dry, and never die', () => {
  let g = planted();
  assert.equal(thirsty(g.plots[0]), true, 'a new seed asks for water');
  assert.equal(advance(g.plots[0], t0 + 60_000).growth, 0, 'no water, no growth');
  g = water(g, 0, t0);
  const later = advance(g.plots[0], t0 + WATER_TIME + 60_000);
  assert.ok(later.growth > 0 && later.growth < growTime.carrot);
  assert.equal(thirsty(later), true);
  assert.equal(later.kind, 'crop', 'a dry crop waits for water');
});

test('a weed appears part way and halves growth until pulled', () => {
  let g = water(planted(), 0, t0);
  const at = growTime.carrot * 0.4;
  const weedy1 = advance(g.plots[0], t0 + at + 1000);
  assert.equal(weedy(weedy1), true);
  assert.ok(Math.abs(weedy1.growth - (at + 500)) < 1, 'half speed after the weed shows');
  g = { ...g, plots: [weedy1, ...g.plots.slice(1)] };
  g = pullWeed(g, 0, t0 + at + 1000);
  assert.equal(g.plots[0].weed, 'pulled');
  assert.equal(pullWeed(g, 0, t0 + at + 1000), g);
});

test('a watered carrot can be harvested into the basket and the bed stays dug', () => {
  let g = planted();
  let now = t0;
  while (look(advance(g.plots[0], now)) !== 'ready' && now < t0 + 120_000) {
    g = water(g, 0, now);
    g = pullWeed(g, 0, now) ;
    now += 1000;
  }
  assert.equal(look(advance(g.plots[0], now)), 'ready');
  const picked = harvest(g, 0, now);
  assert.equal(picked.basket.carrot, 1);
  assert.equal(picked.plots[0].kind, 'tilled');
  assert.equal(harvest(picked, 0, now), picked);
  assert.equal(water(g, 0, now + 99_000).plots[0].water <= WATER_TIME, true);
});

test('requests go from easy to hard and only ask for owned seeds', () => {
  assert.deepEqual(request(emptyGarden).items, { carrot: 1 });
  for (let delivered = 0; delivered < 30; delivered++) {
    const r = request({ ...emptyGarden, delivered });
    for (const crop of Object.keys(r.items)) assert.ok(seeds(emptyGarden).includes(crop));
  }
  const all = { ...emptyGarden, tomato: true, corn: true, pumpkin: true };
  const sizes = allRequests.map(r => Object.values(r.items).reduce((a, b) => a + b, 0));
  assert.ok(sizes.at(-1) > sizes[0]);
  assert.ok(request({ ...all, delivered: 10 }).reward > request(all).reward);
});

test('delivery needs every vegetable and keeps the extras', () => {
  const r = request(emptyGarden);
  assert.deepEqual(missing(emptyGarden, r.items), { carrot: 1 });
  assert.equal(deliver(emptyGarden, r), emptyGarden);
  const full = { ...emptyGarden, basket: { ...emptyGarden.basket, carrot: 3 } };
  const done = deliver(full, r);
  assert.equal(done.delivered, 1);
  assert.equal(done.basket.carrot, 2);
});

test('garden items unlock in order and cost coins', () => {
  assert.deepEqual(gardenBlocker(emptyGarden, 100, 'tomato'), { kind: 'delivered', count: 2 });
  assert.deepEqual(gardenBlocker({ ...emptyGarden, delivered: 9 }, 100, 'corn'), { kind: 'needs', item: 'tomato' });
  assert.deepEqual(gardenBlocker({ ...emptyGarden, delivered: 9 }, 3, 'tomato'), { kind: 'coins', count: 5 });
  assert.equal(gardenBlocker({ ...emptyGarden, delivered: 9 }, 8, 'tomato'), undefined);
  assert.equal(gardenItems.reduce((sum, i) => sum + i.price, 0), 70);
});

test('saves load safely, including damaged ones', () => {
  assert.equal(readGarden(null), emptyGarden);
  assert.equal(readGarden('{bad'), emptyGarden);
  const g = water(planted('lettuce'), 0, t0);
  const back = readGarden(JSON.stringify({ ...g, tomato: true, plots: [...g.plots.slice(0, 5), { kind: 'crop', crop: 'x' }] }));
  assert.equal(back.plots[0].crop, 'lettuce');
  assert.equal(back.plots[5].kind, 'wild');
  assert.equal(back.tomato, true);
  assert.equal(readGarden('{"delivered":-1}'), emptyGarden);
});

test('every request and hint has a Thai line and a recorded clip', () => {
  const lines = JSON.parse(readFileSync('src/features/games/garden/lines.json', 'utf8'));
  for (const r of allRequests) {
    assert.ok(lines.requests[r.id]?.th && lines.requests[r.id]?.en, r.id);
    assert.ok(existsSync(`public/audio/th/garden/${r.visitor}-${r.id}.mp3`), r.id);
  }
  for (const visitor of ['hadi', 'safi', 'sabir']) for (const key of Object.keys(lines.hints)) {
    assert.ok(existsSync(`public/audio/th/garden/${visitor}-${key}.mp3`), visitor + key);
  }
});
