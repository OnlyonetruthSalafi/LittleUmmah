import assert from "node:assert/strict";
import test from "node:test";
import { MEMORY_ITEMS } from "../src/lib/games.ts";
import { chooseMemoryCard, createMemoryState, isMemoryMatch, settleMemoryTurn, startMemoryRound } from "../src/lib/memory-game.ts";

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
