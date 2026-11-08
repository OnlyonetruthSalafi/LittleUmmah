import sharp from 'sharp';
import { cleanBalanceAlpha } from './lib/balance-alpha.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const dir = 'public/games/balance-scale';
await mkdir(dir, { recursive: true });
const sources = { island: 'island-b', base: 'base', beam: 'beam', 'pan-left': 'pan', 'pan-right': 'pan', block: 'block', apple: 'apple', orange: 'orange', watermelon: 'watermelon', pumpkin: 'pumpkin', basket: 'basket', book: 'book' };
const measurements = {};
for (const [name, source] of Object.entries(sources)) {
  const path = `output/g-3/options/${source}.png`;
  const cleaned = await cleanBalanceAlpha(path);
  const { data, info } = await sharp(cleaned).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] < 240) continue;
    left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  measurements[name] = { left, top, width: right - left + 1, height: bottom - top + 1 };
  // Crop cleaned alpha bounds; RGB artwork is unchanged.
  await sharp(cleaned).extract(measurements[name]).png().toFile(`${dir}/${name}.png`);
}
// Measure the cream island surface. Use its central scanline to derive safe pan anchors.
const { data, info } = await sharp(`${dir}/island.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const rows = [];
for (let y = 0; y < info.height; y++) {
  const xs = [];
  for (let x = 0; x < info.width; x++) { const k = (y * info.width + x) * 4; if (data[k + 3] >= 240 && data[k] > 220 && data[k + 1] > 195 && data[k + 2] > 150 && data[k] >= data[k + 2]) xs.push(x); }
  if (xs.length > info.width * .65) rows.push({ y, left: xs[0], right: xs.at(-1) });
}
if (!rows.length) throw new Error('No usable cream surface');
const center = rows[Math.floor(rows.length / 2)];
const safeLeft = center.left / info.width * 100, safeRight = center.right / info.width * 100;
const armSpan = (safeRight - safeLeft) * .57;
const geometry = { armSpan, panLeft: 50 - armSpan / 2, panRight: 50 + armSpan / 2, cream: { left: safeLeft, right: safeRight, top: rows[0].y / info.height * 100, bottom: rows.at(-1).y / info.height * 100 } };
await writeFile('src/features/games/data/balanceScaleArt.ts', `// Measured from generated island alpha/cream pixels by scripts/prepare-balance-scale-art.mjs.\nexport const SCALE_ART = ${JSON.stringify(geometry)} as const;\n`);
await writeFile('output/g-3/art-measurements.json', JSON.stringify({ measurements, geometry }, null, 2));
await writeFile('public/games/hub/balance-scale.png', await cleanBalanceAlpha('output/g-3/options/hub.png', 2));
// This is the same hub job as optimize-images.mjs, scoped to the new file only.
await sharp('public/games/hub/balance-scale.png').resize(640).webp({ quality: 85, effort: 6 }).toFile('public/games/hub/balance-scale.webp');
const manifest = JSON.parse(await readFile('scripts/source-images.json', 'utf8'));
manifest['public/games/hub/balance-scale.png'] = createHash('sha256').update(await readFile('public/games/hub/balance-scale.png')).digest('hex');
await writeFile('scripts/source-images.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(geometry);
