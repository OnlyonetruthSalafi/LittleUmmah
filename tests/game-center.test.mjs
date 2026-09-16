import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
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

/*
  หน้าแนะนำเกมแบบหุ่นยนต์สอนด้วยเสียง (voiceIntro)
  คำสั่งวางอยู่บนป้ายพื้นครีม ไม่ใช่บนภาพฉากตรงๆ ค่าคู่สีจึงวัดได้แน่นอน
  ถ้ามีคนเปลี่ยนสีป้ายในอนาคต เทสต์นี้จะจับได้ก่อนขึ้นเว็บ
*/
test('ป้ายคำสั่งของหน้าแนะนำแบบเสียง ผ่านเกณฑ์ contrast', () => {
  const luminance = hex => {
    const c = hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
  };
  const ratio = (a, b) => (luminance(a) + .05) / (luminance(b) + .05);
  // #fff7d5 = พื้นป้าย, #1e5fbf = ตัวอักษรไทย, #1f2937 = บรรทัดอังกฤษ, #4a2600 = ตัวอักษรบนปุ่มเริ่มเล่น
  assert.ok(ratio('#fff7d5', '#1e5fbf') >= 4.5);
  assert.ok(ratio('#fff7d5', '#1f2937') >= 4.5);
  assert.ok(ratio('#f5a623', '#4a2600') >= 4.5);
});

/*
  บล็อกสี่เหลี่ยมจัตุรัสในถาดของเกมหยอดรูปทรง

  ต้นฉบับที่เจ้าของโปรเจกต์วาด (object/…(4).png) เป็น "ลูกบาศก์หันมุมเข้าหาคนดู"
  หน้าบนจึงเป็นข้าวหลามตัด ไม่เหมือนหลุมบนแผ่นซึ่งเป็นสี่เหลี่ยมวางตรง เด็กจับคู่ไม่ถูก
  scripts/prepare-shape-art.mjs จึงตัดแผ่นที่หยอดแล้วจากภาพแผ่นฐานมาใช้แทน แล้วปั้นความหนาต่อ

  ภาพชุดใหม่สร้างบล็อกวางตรงแยกไฟล์แล้ว ไม่ต้องตัดจากถาดอีก
  เทสต์นี้คุมสองอย่างที่เคยพังมาแล้วทั้งคู่:
  1. หน้าบนวางตรง ไม่หันมุมจนกลายเป็นข้าวหลามตัด
  2. ต้องมีความหนา — ด้านล่างของบล็อกต้องเข้มกว่าหน้าบนชัดเจน (แผ่นแบนล้วนจะสว่างเท่ากันทั้งใบ)
*/
test('บล็อกสี่เหลี่ยมจัตุรัสวางตรง ไม่หันมุมเป็นข้าวหลามตัด', async () => {
  const sources = JSON.parse(await readFile('scripts/source-images.json', 'utf8'));
  const entry = sources['public/games/shape/block-square.webp'];
  assert.ok(entry, 'ต้องบันทึกที่มาของ block-square.webp ไว้ใน source-images.json');
  assert.match(entry.sha256, /^[a-f\d]{64}$/);
  const sharp = (await import('sharp')).default;
  const { data, info } = await sharp('public/games/shape/block-square.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rows = Array.from({ length: info.height }, (_, y) => {
    let count = 0;
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 200) count++;
    return count;
  });
  const y0 = rows.findIndex(n => n > 20), y1 = rows.findLastIndex(n => n > 20);
  // A diamond has a narrow apex; the aligned block has a broad horizontal rear edge.
  // วัดที่ 20% ของความสูง: บล็อกชุดใหม่หันเฉียง 3/4 ตามภาพเกาะตัวอย่าง มุมโค้งด้านหลังจึงแคบกว่าที่ 8%
  // แต่ข้าวหลามตัดที่ 20% ยังกว้างไม่ถึงครึ่ง จึงยังแยกสองแบบออกจากกันได้
  const rearWidth = rows[Math.round(y0 + (y1 - y0) * .2)];
  assert.ok(rearWidth / Math.max(...rows) > .75, 'ขอบหลังของหน้าบนต้องกว้าง ไม่เป็นยอดแหลม');
});

test('บล็อกสี่เหลี่ยมจัตุรัสมีความหนา ไม่ใช่แผ่นแบนราบ', async () => {
  const sharp = (await import('sharp')).default;
  const { data, info } = await sharp('public/games/shape/block-square.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const opaque = i => data[i * 4 + 3] >= 40;
  let y0 = info.height, y1 = -1;
  for (let y = 0; y < info.height; y += 1) for (let x = 0; x < info.width; x += 1) {
    if (!opaque(y * info.width + x)) continue;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  const band = (from, to) => {
    let sum = 0, n = 0;
    for (let y = Math.round(y0 + (y1 - y0) * from); y <= Math.round(y0 + (y1 - y0) * to); y += 1)
      for (let x = 0; x < info.width; x += 1) {
        const i = y * info.width + x;
        if (!opaque(i)) continue;
        sum += (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
        n += 1;
      }
    return n ? sum / n : 0;
  };
  const ratio = band(0.88, 1) / band(0.1, 0.5);
  // บล็อกอีกสี่ชิ้นอยู่ในช่วง 0.50–0.70 ชิ้นนี้เข้มกว่าเล็กน้อยเพราะด้านข้างสูงกว่า
  assert.ok(ratio > 0.25 && ratio < 0.8, `ด้านล่างควรเข้มกว่าหน้าบน (0.25–0.8) แต่ได้ ${ratio.toFixed(2)}`);
});
