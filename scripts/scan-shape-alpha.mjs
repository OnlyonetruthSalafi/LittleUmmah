// Quantify transparency in generated sources and shipped assets, including solid cores.
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const entries = [];
for (const dir of ['output/C-11/originals', 'public/games/shape/pastel']) {
  for (const name of (await readdir(dir)).filter(n => dir.startsWith('output') ? n.endsWith('.png') : n.endsWith('.webp')).sort()) {
    const path = `${dir}/${name}`;
    const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let transparent = 0, partial = 0, opaque = 0, corePartial = 0;
    const w = info.width, h = info.height;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const a = data[(y * w + x) * 4 + 3];
      if (a === 0) transparent++; else if (a === 255) opaque++; else partial++;
      if (name.startsWith('block-') && x > w * .4 && x < w * .6 && y > h * .4 && y < h * .6 && a !== 255) corePartial++;
    }
    entries.push({ path, width: w, height: h, transparent, partial, opaque, corePartial: name.startsWith('block-') ? corePartial : null });
    assert.ok(transparent > 0, `${path}: real transparent background required`);
    if (path.startsWith('public') && name.startsWith('block-')) assert.equal(corePartial, 0, `${path}: no translucent plastic core`);
  }
}
await mkdir('output/C-11', { recursive: true });
await writeFile('output/C-11/alpha-scan.json', JSON.stringify(entries, null, 2) + '\n');
console.log(`Alpha scan passed: ${entries.length} files; output/C-11/alpha-scan.json`);
