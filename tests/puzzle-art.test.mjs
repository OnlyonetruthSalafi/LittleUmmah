import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { PUZZLE_PICTURES, puzzleProgressId } from '../src/features/games/data/puzzlePictures.ts';
import { createProgressRepository } from '../src/features/games/engine/progress.ts';

test('three new square opaque pictures are optimized and source hashes match', async () => {
  const manifest = JSON.parse(await readFile('scripts/source-images.json', 'utf8'));
  assert.equal(PUZZLE_PICTURES.length, 4);
  for (const picture of PUZZLE_PICTURES.filter(p => p.src)) {
    const path = `public${picture.src}`;
    const source = path.replace('.webp', '.png');
    assert.match(manifest[source], /^[a-f0-9]{64}$/);
    // Source PNGs are intentionally gitignored; validate them when available locally.
    if (existsSync(source)) assert.equal(createHash('sha256').update(await readFile(source)).digest('hex'), manifest[source]);
    const meta = await sharp(path).metadata();
    assert.equal(meta.width, 900); assert.equal(meta.height, 900);
    assert.equal((await sharp(path).stats()).isOpaque, true);
    for (const [cols, rows] of [[2, 2], [3, 2], [3, 3]]) {
      for (let i = 0; i < cols * rows; i++) {
        const stats = await sharp(path).extract({ left: i % cols * (900 / cols), top: Math.floor(i / cols) * (900 / rows), width: 900 / cols, height: 900 / rows }).stats();
        assert.ok(stats.channels.slice(0, 3).some(c => c.stdev > 10), `${picture.id} ${cols}x${rows} tile ${i} has visual detail`);
      }
    }
  }
});

test('picture progress is separate by picture and level, preserves legacy stars and replay is idempotent', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const repo = createProgressRepository(() => storage);
  repo.complete('puzzle', 2, 2);
  for (const picture of PUZZLE_PICTURES.slice(1)) {
    const id = puzzleProgressId(picture.id);
    assert.equal(repo.read(id).stars, 0);
    for (const level of [1, 2, 3]) repo.complete(id, level, 3);
    repo.complete(id, 1, 3);
    assert.equal(repo.read(id).stars, 9);
  }
  assert.equal(createProgressRepository(() => storage).read('puzzle').stars, 2);
  assert.equal(puzzleProgressId('original'), 'puzzle');
});
import { BOARD, TRAY, homography, project, trayMatrix, screenDown, piecePath, pieceBox, KNOB_DEPTH } from '../src/features/games/data/puzzleArt.ts';

const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-6, `${message}: ${a} vs ${b}`);

test('homography maps the unit square onto the measured tray corners', () => {
  const H = homography(TRAY);
  for (const [u, v, corner] of [[0, 0, 'tl'], [1, 0, 'tr'], [1, 1, 'br'], [0, 1, 'bl']]) {
    const p = project(H, u, v);
    close(p.x, TRAY[corner].x, `${corner}.x`); close(p.y, TRAY[corner].y, `${corner}.y`);
  }
});

test('matrix3d sends the plane corners to the tray corners in pixels', () => {
  const H = homography(TRAY), width = 390;
  const m = trayMatrix(H, width, width).match(/matrix3d\((.*)\)/)[1].split(',').map(Number);
  const apply = (x, y) => { const w = m[3] * x + m[7] * y + m[15]; return { x: (m[0] * x + m[4] * y + m[12]) / w, y: (m[1] * x + m[5] * y + m[13]) / w }; };
  for (const [x, y, corner] of [[0, 0, 'tl'], [width, 0, 'tr'], [width, width, 'br'], [0, width, 'bl']]) {
    const p = apply(x, y);
    assert.ok(Math.abs(p.x - TRAY[corner].x * width) < 0.01 && Math.abs(p.y - TRAY[corner].y * width) < 0.01, corner);
  }
});

test('piece thickness points down the screen', () => {
  const H = homography(TRAY), d = screenDown(H, 16);
  const a = project(H, 0.5, 0.5), b = project(H, 0.5 + d.x / BOARD, 0.5 + d.y / BOARD);
  assert.ok(b.y > a.y && Math.abs(b.x - a.x) < 1e-3, 'offset is vertical on screen');
});

for (const [cols, rows] of [[2, 2], [3, 2], [3, 3]]) test(`jigsaw ${cols}×${rows}: closed paths, flat outer border, knobs inside their box`, () => {
  for (let i = 0; i < cols * rows; i++) {
    const col = i % cols, row = Math.floor(i / cols), d = piecePath(col, row, cols, rows);
    assert.match(d, /^M[\d.]+ [\d.]+ .* Z$/);
    const numbers = d.match(/-?[\d.]+/g).map(Number), xs = numbers.filter((_, k) => k % 2 === 0), ys = numbers.filter((_, k) => k % 2 === 1);
    const box = pieceBox(col, row, cols, rows, 0);
    assert.ok(Math.min(...xs) >= box.x - 1 && Math.max(...xs) <= box.x + box.w + 1, 'x inside box');
    assert.ok(Math.min(...ys) >= box.y - 1 && Math.max(...ys) <= box.y + box.h + 1, 'y inside box');
    // ขอบนอกของภาพต้องเรียบ ไม่มีหัวยื่นออกนอกถาด
    assert.ok(Math.min(...xs) >= 0 && Math.max(...xs) <= BOARD && Math.min(...ys) >= 0 && Math.max(...ys) <= BOARD, 'stays on the board');
  }
  // ชิ้นที่มีเพื่อนบ้านต้องมีหัวหรือรูอย่างน้อยหนึ่งจุด
  assert.ok(piecePath(0, 0, cols, rows).includes('C'));
  assert.ok(KNOB_DEPTH < 0.5);
});
