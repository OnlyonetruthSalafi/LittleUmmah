// Prepare the three C-10 imagegen sprites without touching the original island/pad/block.
// Usage: node scripts/prepare-sequence-sets.mjs [imagegen output directory]
import sharp from 'sharp';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const source = process.argv[2] ?? 'C:/Users/User/.codex/generated_images/01a1b7bb-ef76-7ae1-925a-afabec277644';
const files = {
  ball: 'exec-229f0875-c79c-49a7-b22b-689b87c00751.png',
  cylinder: 'exec-9d40477a-7cf4-465a-ad75-d20c079ea880.png',
  wood: 'exec-3aa33794-b05b-4ad3-a159-edbf90764a5f.png',
};
await mkdir('output/C-10/originals', { recursive: true });
const measurements = {};
for (const [name, file] of Object.entries(files)) {
  const input = path.join(source, file);
  await copyFile(input, `output/C-10/originals/${name}.png`);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] >= 128) {
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  const crop = { left, top, width: right - left + 1, height: bottom - top + 1 };
  // Match the original square sprite dimensions; preserve aspect and generated alpha.
  const sprite = await sharp(input).extract(crop).resize(504, 504, { fit: 'inside' }).png().toBuffer();
  const size = await sharp(sprite).metadata();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: '#00000000' } })
    .composite([{ input: sprite, left: Math.round((512 - size.width) / 2), top: 508 - size.height }])
    .png().toFile(`public/games/sequence/${name}.png`);
  measurements[name] = { source: file, original: [info.width, info.height], crop, sprite: [size.width, size.height], baseY: 508 / 512 };
}
await writeFile('output/C-10/preparation.json', JSON.stringify(measurements, null, 2) + '\n');
console.log(measurements);
