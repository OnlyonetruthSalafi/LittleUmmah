import assert from 'node:assert/strict';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const report = [];
for (const name of ['ball', 'cylinder', 'wood']) for (const ext of ['png', 'webp']) {
  const file = `public/games/sequence/${name}.${ext}`;
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let transparent = 0, partial = 0, opaque = 0, nearOpaque = 0, interiorMin = 255;
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const alpha = data[(y * info.width + x) * 4 + 3];
    if (!alpha) transparent++; else if (alpha === 255) opaque++; else partial++;
    if (alpha >= 250) nearOpaque++;
    if (alpha >= 128) { left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); }
    if (x > info.width * .35 && x < info.width * .65 && y > info.height * .4 && y < info.height * .7) interiorMin = Math.min(interiorMin, alpha);
  }
  assert.ok(transparent > info.width * info.height * .1, `${file}: transparent surround`);
  // Built-in imagegen currently returns alpha 252–253 inside these solid toys.
  // Preserve source alpha, quantify it, and reject materially translucent interiors.
  assert.ok(nearOpaque > info.width * info.height * .3, `${file}: near-opaque object`);
  assert.ok(interiorMin >= 250, `${file}: center opacity at least 98%`);
  assert.ok(left > 0 && top > 0 && right < info.width - 1 && bottom < info.height - 1, `${file}: unclipped silhouette`);
  report.push({ file, width: info.width, height: info.height, transparent, partial, opaque, nearOpaque, interiorMin, bbox: { left, top, right, bottom } });
}
await mkdir('output/C-10', { recursive: true });
await writeFile('output/C-10/alpha-scan.json', JSON.stringify(report, null, 2) + '\n');
console.log(report);
