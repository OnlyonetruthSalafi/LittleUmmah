import assert from 'node:assert/strict';
import test from 'node:test';
import { sequenceLevel, mixSequence, placeSequence } from '../src/features/games/data/sequence.ts';

// ตัวหนังสือบนจอของเกมนี้เหลือสองจุด: ปุ่มคำใบ้ (.gc-button พื้นขาว) และป้ายชิ้นที่เลือก (#123a72 ขอบขาว)
// พื้นป้าย/ถาดสีเดิม (#eaf6ff #f5e5bc ...) ถูกตัดออกพร้อมตัวหนังสือแล้ว
test('sequence text contrast exceeds 4.5:1 on the surfaces that still carry text', () => {
  const luminance = hex => {
    const c = hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
  };
  const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  assert.ok(ratio('#ffffff', '#1f2937') >= 4.5);
  assert.ok(ratio('#ffffff', '#123a72') >= 4.5);
});

test('sequence pads follow one front-left to back-right path for 3 and 4 pieces', async () => {
  const { padAt } = await import('../src/features/games/data/sequenceArt.ts');
  for (const count of [3, 4]) {
    const pads = Array.from({ length: count }, (_, i) => padAt(i, count));
    for (let i = 1; i < count; i++) {
      assert.ok(pads[i].x > pads[i - 1].x, 'แท่นถัดไปอยู่ทางขวา');
      assert.ok(pads[i].y < pads[i - 1].y, 'แท่นถัดไปอยู่ลึกเข้าไป');
    }
  }
});

for (const level of [1, 2, 3]) for (const variant of [0, 1]) {
  test(`sequence level ${level} variant ${variant}: wrong homes, duplicate taps, completion and fresh replay`, () => {
    const { pieces } = sequenceLevel(level, variant);
    assert.equal(pieces.length, level === 1 ? 3 : 4);
    assert.equal(new Set(pieces.map(p => p.id)).size, pieces.length);
    assert.equal(new Set(pieces.map(p => p.rank)).size, pieces.length);
    assert.equal(new Set(pieces.map(p => p.th)).size, pieces.length);
    for (const piece of pieces) assert.ok(piece.th && piece.en);
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
    const fresh = sequenceLevel(level, variant);
    assert.deepEqual(fresh, sequenceLevel(level, variant));
    assert.equal(placeSequence(fresh.pieces, [], pieces[0].id, 'sequence-slot-0').length, 1);
  });
  test(`sequence level ${level} variant ${variant}: shuffle preserves every toy and never starts solved`, () => {
    const { pieces } = sequenceLevel(level, variant);
    for (const random of [() => 0, () => 0.5, () => 0.999999, Math.random]) {
      const mixed = mixSequence(pieces, random);
      assert.notDeepEqual(mixed.map(p => p.id), pieces.map(p => p.id));
      assert.deepEqual(mixed.map(p => p.id).sort(), pieces.map(p => p.id).sort());
    }
    assert.deepEqual(pieces.map(p => p.rank), pieces.map((_, i) => i));
  });
}

test('all three new sets keep the level rule and reject IDs from the other set', () => {
  const assets = new Set();
  for (const level of [1, 2, 3]) {
    const original = sequenceLevel(level);
    const added = sequenceLevel(level, 1);
    assets.add(added.art);
    assert.equal(added.kind, original.kind);
    assert.equal(added.pieces.length, original.pieces.length);
    for (const piece of original.pieces) {
      const empty = [];
      assert.equal(placeSequence(added.pieces, empty, piece.id, `sequence-slot-${piece.rank}`), empty);
    }
  }
  assert.deepEqual([...assets], ['ball', 'cylinder', 'wood']);
});

test('replaying either toy set does not duplicate stars or complete another level/game', async () => {
  const { createProgressRepository } = await import('../src/features/games/engine/progress.ts');
  const data = new Map();
  const repo = createProgressRepository(() => ({ getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }));
  for (const level of [1, 2, 3]) {
    for (const variant of [0, 1]) {
      const { pieces } = sequenceLevel(level, variant);
      const placed = pieces.reduce((placed, piece) => placeSequence(pieces, placed, piece.id, `sequence-slot-${piece.rank}`), []);
      assert.equal(placed.length, pieces.length);
      const progress = repo.complete('sequence', level, 3);
      assert.equal(progress.stars, level * 3);
      assert.deepEqual(progress.completedLevels, Array.from({ length: level }, (_, i) => i + 1));
    }
  }
  assert.equal(repo.read('memory').stars, 0);
});
