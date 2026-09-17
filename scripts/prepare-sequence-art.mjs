import sharp from 'sharp';
import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Built-in imagegen originals. Optional directory argument supports another machine.
const source = process.argv[2] ?? 'C:/Users/User/.codex/generated_images/01a0ac63-25b6-7732-915c-7435a8444175';
const files = { island: 'exec-34e22203-a587-42de-97f7-db48ca5b98b7.png', pad: 'exec-af61b873-685b-461c-993f-f9d7c1c7a4a5.png', block: 'exec-b7acacd0-bf3f-4337-8f2f-6c8acd25825c.png' };
await mkdir('output/sequence-art/originals', { recursive: true });
const manifest = JSON.parse(await readFile('scripts/source-images.json', 'utf8'));
const preparation = {};
for (const [name, file] of Object.entries(files)) {
  const input = path.join(source, file);
  await copyFile(input, `output/sequence-art/originals/${name}.png`);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1, transparent = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const a = data[(y * info.width + x) * 4 + 3];
    if (a === 0) transparent++;
    if (a > 16) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
  }
  if (!transparent) throw new Error(`${name}: missing real alpha`);
  // Crop alpha noise at <=16 only at outer canvas; preserve all internal generated alpha.
  const crop = name === 'island' ? { left: 0, top: 0, width: info.width, height: info.height } : { left: Math.max(0, left - 4), top: Math.max(0, top - 4), width: Math.min(info.width, right + 5) - Math.max(0, left - 4), height: Math.min(info.height, bottom + 5) - Math.max(0, top - 4) };
  const size = name === 'island' ? 1100 : 512;
  const output = `public/games/sequence/${name}.png`;
  await sharp(input).extract(crop).resize(size, size, { fit: 'contain', background: '#00000000' }).png().toFile(output);
  manifest[output] = createHash('sha256').update(await readFile(output)).digest('hex');
  preparation[name] = { original: file, originalSize: [info.width, info.height], crop, outputSize: [size, size], note: 'Aspect ratio preserved; non-square pad uses transparent vertical padding.' };
}
await writeFile('scripts/source-images.json', JSON.stringify(manifest, null, 2) + '\n');
await writeFile('output/sequence-art/preparation.json', JSON.stringify(preparation, null, 2) + '\n');
console.log(preparation);
