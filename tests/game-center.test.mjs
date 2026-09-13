import assert from 'node:assert/strict';
import test from 'node:test';
import { shuffle, canPlace, levelComplete, createMemory, flipCard, memoryMatches, settleMemory } from '../src/features/games/engine/rules.ts';
import { createProgressRepository } from '../src/features/games/engine/progress.ts';
import { boardContent, arabicLetters } from '../src/features/games/data/content.ts';
import { games } from '../src/features/games/data/catalog.ts';

test('shuffle is reproducible, preserves inputs, identities and multiplicities', () => {
  const input = ['a', 'b', 'c', 'a'];
  const output = shuffle(input, () => 0);
  assert.deepEqual(input, ['a', 'b', 'c', 'a']);
  assert.deepEqual(output, shuffle(input, () => 0));
  assert.deepEqual([...output].sort(), [...input].sort());
  assert.notDeepEqual(output, input);
  assert.deepEqual(shuffle([]), []);
});

for (const game of games.filter(g => !['memory', 'find-object'].includes(g.slug))) {
  for (const level of [1, 2, 3]) test(`${game.slug} level ${level}: every item has a valid target and the level can finish`, () => {
    const { items, targets } = boardContent(game.slug, level);
    assert.equal(new Set(items.map(i => i.id)).size, items.length);
    assert.equal(new Set(targets.map(i => i.id)).size, targets.length);
    const placed = [];
    for (const item of shuffle(items, () => 0.2)) {
      const wrong = targets.find(t => t.id !== item.target);
      assert.equal(canPlace(items, targets, placed, item.id, wrong.id), false);
      assert.equal(canPlace(items, targets, placed, 'missing', item.target), false);
      assert.equal(canPlace(items, targets, placed, item.id, item.target), true);
      placed.push(item.id);
      assert.equal(canPlace(items, targets, placed, item.id, item.target), false);
    }
    assert.equal(levelComplete(items.length, placed.length), true);
    assert.equal(levelComplete(items.length, placed.length - 1), false);
  });
}
test('puzzle levels have 4/6/9 pieces and sequence targets use generic stable IDs', () => {
  assert.deepEqual([1, 2, 3].map(level => boardContent('puzzle', level).items.length), [4, 6, 9]);
  assert.equal(boardContent('sequence', 2).items.length, 3);
  assert.equal(boardContent('sequence', 3).sequential, true);
  assert.equal(arabicLetters.length, 28);
  assert.equal(levelComplete(0, 0), false);
});
for (const pairs of [3, 6, 8]) test(`memory ${pairs * 2} cards: locks, mismatch, matching and completion`, () => {
  const values = Array.from({ length: pairs }, (_, i) => `item-${i}`);
  let state = createMemory(values, () => 0.2);
  assert.equal(state.deck.length, pairs * 2);
  state = flipCard(state, `${values[0]}-0`);
  assert.equal(flipCard(state, state.open[0]), state);
  state = flipCard(state, `${values[1]}-0`);
  assert.equal(memoryMatches(state), false);
  assert.equal(flipCard(state, `${values[2]}-0`), state);
  state = settleMemory(state);
  assert.deepEqual(state.open, []);
  assert.equal(state.moves, 1);
  for (const value of values) {
    state = flipCard(state, `${value}-0`);
    state = flipCard(state, `${value}-1`);
    assert.equal(memoryMatches(state), true);
    state = settleMemory(state);
    assert.equal(flipCard(state, `${value}-0`), state);
  }
  assert.equal(state.matched.length, pairs);
  assert.equal(state.moves, pairs + 1);
});

test('progress survives reload, keeps best stars, isolates games and deduplicates replay', () => {
  const records = new Map();
  const storage = { getItem: key => records.get(key) ?? null, setItem: (key, value) => records.set(key, value) };
  let repo = createProgressRepository(() => storage);
  assert.equal(repo.read('memory').stars, 0);
  repo.complete('memory', 1, 3);
  repo.complete('memory', 1, 2);
  repo.complete('memory', 3, 3);
  repo = createProgressRepository(() => storage);
  assert.equal(repo.read('memory').stars, 6);
  assert.deepEqual(repo.read('memory').completedLevels, [1, 3]);
  assert.equal(repo.read('memory').highestLevel, 3);
  assert.equal(repo.read('sort').stars, 0);
  assert.ok(repo.read('memory').lastPlayed);
});
test('corrupt, blocked, unavailable and tampered persistence remain playable', () => {
  const broken = createProgressRepository(() => { throw new Error('blocked'); });
  broken.complete('sort', 1, 3);
  assert.equal(broken.read('sort').stars, 3);
  const corrupt = createProgressRepository(() => ({ getItem: () => '{bad', setItem: () => {} }));
  assert.equal(corrupt.read('sort').stars, 0);
  const tampered = createProgressRepository(() => ({ getItem: () => JSON.stringify({ levelStars: { 1: 3, 2: 900, 3: '3', bad: 3 }, stars: 9000 }), setItem: () => {} }));
  assert.equal(tampered.read('sort').stars, 3);
  const unavailable = createProgressRepository(() => undefined);
  unavailable.complete('sort', 1, 3);
  assert.equal(unavailable.read('sort').stars, 3);
  assert.equal(unavailable.complete('sort', -1, 3).stars, 3);
  const full = createProgressRepository(() => ({ getItem: () => JSON.stringify({ levelStars: { 1: 3 } }), setItem: () => { throw new Error('quota'); } }));
  full.complete('sort', 2, 3);
  assert.equal(full.read('sort').stars, 6);
});

test('game UI text colors meet WCAG AA on every added surface', () => {
  const luminance = hex => { const values = hex.match(/[a-f0-9]{2}/gi).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4); return values[0] * .2126 + values[1] * .7152 + values[2] * .0722; };
  const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  for (const surface of ['ffffff','c8edff','fff7d5','eaf6ff','d5f4ec','c9efdb','ffdcc2','e3d8ff','a8d8f5','edf5f9']) assert.ok(ratio('1f2937', surface) >= 4.5, surface);
  assert.ok(ratio('ffffff', '1e5fbf') >= 4.5);
  assert.ok(ratio('1e5fbf', 'c8edff') >= 4.5);
  assert.ok(ratio('925008', 'ffffff') >= 4.5);
});
