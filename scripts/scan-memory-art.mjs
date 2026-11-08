// C-4 alpha audit of both generated sources and delivered WebP cards.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const ids = ['toy-car', 'ball', 'umbrella', 'watering-can', 'cup', 'basket', 'plant-pot', 'wooden-blocks'];
const results = [];
await mkdir('output/C-4', { recursive: true });
for (const id of ids) {
  for (const file of [`public/games/memorygame/${id}.png`, `public/games/memory/face-${id}.webp`]) {
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const buckets = { transparent: 0, partial: 0, opaque: 0 };
    let centerMin = 255;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      buckets[a === 0 ? 'transparent' : a === 255 ? 'opaque' : 'partial']++;
      if (x > info.width * .2 && x < info.width * .8 && y > info.height * .2 && y < info.height * .8) centerMin = Math.min(centerMin, a);
    }
    assert.ok(buckets.transparent > 0, `${file}: real transparent background`);
    if (file.endsWith('.webp')) assert.equal(centerMin, 255, `${file}: card/object interior fully opaque`);
    if (file.endsWith('.webp')) assert.ok(buckets.opaque / (info.width * info.height) > .7, `${file}: solid card, not translucent`);
    results.push({ file, width: info.width, height: info.height, centerMin, ...buckets });
  }
}
await writeFile('output/C-4/alpha-scan.json', JSON.stringify(results, null, 2));
// Review actual 40px cards next to enlarged cards on a contrasting background.
const layers = [];
for (let i = 0; i < ids.length; i++) {
  const file = `public/games/memory/face-${ids[i]}.webp`;
  layers.push({ input: await sharp(file).resize(192, 178).toBuffer(), left: (i % 4) * 220 + 14, top: Math.floor(i / 4) * 240 + 8 });
  layers.push({ input: await sharp(file).resize(43, 40).toBuffer(), left: (i % 4) * 220 + 85, top: Math.floor(i / 4) * 240 + 190 });
}
await sharp({ create: { width: 880, height: 480, channels: 4, background: '#25485c' } }).composite(layers).png().toFile('output/C-4/card-review.png');
console.log('PASS: 8 source PNGs and 8 delivered WebPs scanned; delivered cards have transparent background and opaque center. output/C-4/alpha-scan.json');
