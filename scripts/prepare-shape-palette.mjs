// Invoked by prepare-shape-art.mjs --pastel. Source edits were made with imagegen.
// Keep the existing tray and its measured gold rims; only the socket interiors change.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { measureShapeHoles } from './shape-art-masks.mjs';
import { HOLES, PLATE, shapeOrder } from '../src/features/games/data/shapeArt.ts';
import assert from 'node:assert/strict';

const source = 'output/C-11/originals', out = 'public/games/shape/pastel';
await mkdir(out, { recursive: true });
const basePath = 'public/games/shape/plate-00000.webp';
const base = await sharp(basePath).ensureAlpha().raw().toBuffer();
const fullPath = `${source}/plate-full.png`;
const full = await sharp(fullPath).resize(PLATE.width, PLATE.height, { fit: 'fill' }).ensureAlpha().raw().toBuffer();
const sockets = await measureShapeHoles(basePath);
const masks = await Promise.all(shapeOrder.map(s => sharp(sockets[s].mask).raw().toBuffer()));
// Measurements from the compressed original may differ by 1–2px from source PNG.
for (const shape of shapeOrder) for (const key of ['x', 'y', 'w', 'h']) {
  assert.ok(Math.abs(sockets[shape].hole[key] - HOLES[shape][key]) < 0.6, `${shape}.${key} moved`);
}
const manifestPath = 'scripts/source-images.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const hash = async p => createHash('sha256').update(await readFile(p)).digest('hex');
let outsideChanges = 0;
for (let bits = 0; bits < 32; bits++) {
  const mask = bits.toString(2).padStart(5, '0');
  const pixels = Buffer.from(base);
  for (let p = 0; p < pixels.length; p += 4) {
    if (masks.some((m, j) => mask[j] === '1' && m[p + 3])) {
      full.copy(pixels, p, p, p + 3);
      // The original tray is solid. Generated alpha never punches holes into it.
    } else if (!pixels.subarray(p, p + 4).equals(base.subarray(p, p + 4))) outsideChanges++;
  }
  await sharp(pixels, { raw: { ...PLATE, channels: 4 } }).png().toFile(`${out}/plate-${mask}.png`);
  manifest[`${out}/plate-${mask}.webp`] = {
    source: basePath, sha256: await hash(basePath), editedSource: fullPath, editedSha256: await hash(fullPath),
    mask, recipe: 'node scripts/prepare-shape-art.mjs --pastel; node scripts/optimize-images.mjs public/games/shape/pastel',
  };
}
assert.equal(outsideChanges, 0);
for (const shape of shapeOrder) {
  const src = `${source}/block-${shape}.png`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // Same low-alpha fringe cleanup as the original shape pipeline.
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 24) data[i] = 0;
    // imagegen can give solid plastic alpha 253. Make the opaque core truly solid,
    // retaining the edge antialiasing rather than flattening against a background.
    else if (data[i] > 200) data[i] = 255;
  }
  await sharp(data, { raw: info }).resize(420, 420, { fit: 'contain', background: '#00000000' }).png().toFile(`${out}/block-${shape}.png`);
  manifest[`${out}/block-${shape}.webp`] = { source: src, sha256: await hash(src), recipe: 'scripts/prepare-shape-art.mjs --pastel' };
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
await writeFile('output/C-11/hole-measurements.json', JSON.stringify({ plate: PLATE, holes: Object.fromEntries(shapeOrder.map(s => [s, sockets[s].hole])), outsideChanges }, null, 2) + '\n');
console.log('Prepared pastel: 32 plates + 5 blocks; original measured sockets retained. Run optimize-images.mjs public/games/shape/pastel.');
