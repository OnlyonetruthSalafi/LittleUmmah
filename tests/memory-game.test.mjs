import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { memorySymbols, CARD_ART } from '../src/features/games/data/memoryArt.ts';
import { createMemoryFromPool, flipCard, settleMemory } from '../src/features/games/engine/rules.ts';
import { MEMORY_ITEMS } from "../src/lib/games.ts";
import { chooseMemoryCard, createMemoryState, isMemoryMatch, settleMemoryTurn, startMemoryRound } from "../src/lib/memory-game.ts";

function seeded(seed) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
}

test('art library contains all 8 original and 8 new bilingual cards with matching dimensions', async () => {
  const ids = ['crescent', 'star', 'lantern', 'masjid', 'arch', 'tasbih', 'gem', 'palm', 'toy-car', 'ball', 'umbrella', 'watering-can', 'cup', 'basket', 'plant-pot', 'wooden-blocks'];
  assert.deepEqual(memorySymbols.map(s => s.id), ids);
  assert.equal(new Set(memorySymbols.map(s => s.art)).size, 16);
  for (const symbol of memorySymbols) {
    assert.ok(symbol.th && symbol.en);
    const bytes = await readFile(`public/games/memory/${symbol.art}.webp`);
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, CARD_ART.width);
    assert.equal(meta.height, CARD_ART.height);
    assert.ok(meta.hasAlpha);
  }
});

for (const count of [3, 6, 8]) {
  test(`live board ${count} pairs: entire library reachable, exactly two copies, playable and reproducible`, () => {
    const pool = memorySymbols.map(s => s.id);
    const original = [...pool];
    const seen = new Set();
    const selections = new Set();
    for (let seed = 1; seed <= 512; seed++) {
      let state = createMemoryFromPool(pool, count, seeded(seed));
      assert.deepEqual(state, createMemoryFromPool(pool, count, seeded(seed)));
      assert.equal(state.deck.length, count * 2);
      assert.equal(new Set(state.deck.map(c => c.id)).size, count * 2);
      const values = [...new Set(state.deck.map(c => c.value))];
      assert.equal(values.length, count);
      selections.add([...values].sort().join(','));
      for (const value of values) {
        seen.add(value);
        assert.equal(state.deck.filter(c => c.value === value).length, 2);
        state = flipCard(state, `${value}-0`);
        assert.equal(flipCard(state, `${value}-0`), state);
        state = flipCard(state, `${value}-1`);
        state = settleMemory(state);
      }
      assert.equal(state.matched.length, count);
      assert.equal(state.moves, count);
    }
    assert.deepEqual([...seen].sort(), [...pool].sort());
    assert.ok(selections.size > 100, 'rounds sample different subsets, not a fixed prefix');
    assert.deepEqual(pool, original);
  });
}

test('pool validation cannot produce extra copies or incomplete rounds', () => {
  const state = createMemoryFromPool(['a', 'a', 'b'], 2, seeded(4));
  assert.equal(state.deck.length, 4);
  for (const count of [0, -1, 1.5, 3]) assert.throws(() => createMemoryFromPool(['a', 'b'], count), RangeError);
});

for (const pairs of [3, 6]) {
  test(`${pairs} pairs: deterministic initial state, shuffle, complete round and replay`, () => {
    const initial = createMemoryState(MEMORY_ITEMS.slice(0, pairs));
    assert.deepEqual(initial, createMemoryState(MEMORY_ITEMS.slice(0, pairs)));
    assert.equal(initial.deck.length, pairs * 2);
    assert.equal(chooseMemoryCard(initial, initial.deck[0].id), initial);
    let round = startMemoryRound(initial, () => 0);
    assert.notDeepEqual(round.deck, initial.deck);
    assert.deepEqual(round.deck.map(card => card.id).sort(), initial.deck.map(card => card.id).sort());
    assert.equal(new Set(round.deck.map(card => card.id)).size, pairs * 2);
    for (const item of MEMORY_ITEMS.slice(0, pairs)) {
      round = chooseMemoryCard(round, `${item.icon}-0`);
      assert.equal(chooseMemoryCard(round, `${item.icon}-0`), round);
      round = chooseMemoryCard(round, `${item.icon}-1`);
      assert.ok(isMemoryMatch(round));
      round = settleMemoryTurn(round);
      assert.ok(round.matched.includes(item.icon));
      assert.equal(chooseMemoryCard(round, `${item.icon}-1`), round);
    }
    assert.equal(round.matched.length, pairs);
    assert.equal(round.moves, pairs);
    const replay = startMemoryRound(round, () => 0.5);
    assert.equal(replay.moves, 0);
    assert.deepEqual(replay.matched, []);
    assert.deepEqual(replay.open, []);
    assert.equal(replay.deck.length, pairs * 2);
  });
}

test("a mismatch locks further input until settled, counts one move, then permits retry", () => {
  let round = startMemoryRound(createMemoryState(MEMORY_ITEMS.slice(0, 3)));
  assert.equal(chooseMemoryCard(round, "missing"), round);
  round = chooseMemoryCard(round, "moon-0");
  assert.equal(round.moves, 0);
  assert.equal(settleMemoryTurn(round), round);
  round = chooseMemoryCard(round, "lantern-0");
  assert.equal(round.moves, 1);
  assert.equal(isMemoryMatch(round), false);
  assert.equal(chooseMemoryCard(round, "dates-0"), round);
  const settled = settleMemoryTurn(round);
  assert.deepEqual(settled.open, []);
  assert.deepEqual(settled.matched, []);
  assert.equal(settled.moves, 1);
  assert.deepEqual(chooseMemoryCard(settled, "dates-0").open, ["dates-0"]);
  assert.equal(round.open.length, 2);
});
