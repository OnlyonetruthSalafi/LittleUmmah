import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Round 2 changes only island. Never regenerate the protected pad/block sprites.
const input = process.argv[2] ?? 'output/sequence-art/originals/island-round2.png';
const png = 'public/games/sequence/island.png';
const metadata = await sharp(input).metadata();
if (!metadata.hasAlpha) throw new Error('Generated island must have real alpha');
await sharp(input).resize(1100, 1100, { fit: 'contain', background: '#00000000' }).png().toFile(png);
// Same settings as optimize-images.mjs sequence job, scoped to island only.
await sharp(png).webp({ quality: 88, effort: 6 }).toFile('public/games/sequence/island.webp');
const manifest = JSON.parse(await readFile('scripts/source-images.json', 'utf8'));
manifest[png] = createHash('sha256').update(await readFile(png)).digest('hex');
await writeFile('scripts/source-images.json', JSON.stringify(manifest, null, 2) + '\n');
await writeFile('output/sequence-art/preparation-round2.json', JSON.stringify({ input, originalSize: [metadata.width, metadata.height], outputSize: [1100, 1100], crop: null, alpha: 'Preserved generated alpha; no background removal or painted edits', webp: { quality: 88, effort: 6 }, sha256: manifest[png] }, null, 2) + '\n');
