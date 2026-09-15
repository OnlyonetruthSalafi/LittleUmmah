import assert from 'node:assert/strict';
import test from 'node:test';
import { sequenceLevel, mixSequence, placeSequence } from '../src/features/games/data/sequence.ts';

test('sequence text contrast exceeds 4.5:1 on all new solid surfaces', () => {
  const luminance = hex => {
    const c = hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
  };
  for (const background of ['#ffffff', '#fffdf2', '#f5e5bc', '#e6c878', '#d9f7ee', '#bde8dc', '#97cebb', '#eaf6ff']) {
    assert.ok((luminance(background) + .05) / (luminance('#1f2937') + .05) >= 4.5, background);
  }
  assert.ok((luminance('#ffffff') + .05) / (luminance('#1e5fbf') + .05) >= 4.5);
});

for (const level of [1, 2, 3]) {
  test(`sequence level ${level}: wrong homes, duplicate taps, completion and fresh replay`, () => {
    const { pieces } = sequenceLevel(level);
    let placed = [];
    assert.equal(placeSequence(pieces, placed, 'unknown', 'sequence-slot-0'), placed);
    assert.equal(placeSequence(pieces, placed, pieces[0].id, 'sequence-slot-1'), placed);
    for (const piece of [...pieces].reverse()) {
      const previous = placed;
      placed = placeSequence(pieces, placed, piece.id, `sequence-slot-${piece.rank}`);
      assert.equal(placed.length, previous.length + 1);
      assert.equal(placeSequence(pieces, placed, piece.id, `sequence-slot-${piece.rank}`), placed);
    }
    assert.equal(placed.length, pieces.length);
    assert.equal(placeSequence(pieces, placed, pieces[0].id, 'sequence-slot-0'), placed);
    const fresh = sequenceLevel(level);
    assert.deepEqual(fresh, sequenceLevel(level));
    assert.equal(placeSequence(fresh.pieces, [], pieces[0].id, 'sequence-slot-0').length, 1);
  });
  test(`sequence level ${level}: shuffle preserves every toy and never starts solved`, () => {
    const { pieces } = sequenceLevel(level);
    for (const random of [() => 0, () => 0.5, () => 0.999999, Math.random]) {
      const mixed = mixSequence(pieces, random);
      assert.notDeepEqual(mixed.map(p => p.id), pieces.map(p => p.id));
      assert.deepEqual(mixed.map(p => p.id).sort(), pieces.map(p => p.id).sort());
    }
    assert.deepEqual(pieces.map(p => p.rank), pieces.map((_, i) => i));
  });
}
