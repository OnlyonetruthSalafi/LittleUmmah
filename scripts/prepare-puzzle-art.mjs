import sharp from 'sharp';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const dir = 'public/games/puzzle';
// C-5: prepare only new full-bleed pictures; never rewrite the measured island.
if (process.argv.includes('--new-pictures')) {
  const assets = [];
  for (const name of ['flower-garden', 'sailboat-bay', 'toy-station']) {
    const original = `output/C-5/originals/${name}.png`;
    const { data, info } = await sharp(original).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let nonOpaque = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] !== 255) nonOpaque++;
    assets.push({ original, width: info.width, height: info.height, nonOpaquePixels: nonOpaque, totalPixels: info.width * info.height });
    if (nonOpaque) throw new Error(`Picture must be opaque: ${original}`);
    await sharp(original).resize(1024, 1024).png().toFile(`${dir}/${name}.png`);
  }
  await writeFile('output/C-5/alpha-scan.json', JSON.stringify(assets, null, 2) + '\n');
  console.log('Prepared new PNGs. Run node scripts/optimize-images.mjs public/games/puzzle');
  process.exit(0);
}
const out = 'output/puzzle-art';
await mkdir(out, { recursive: true });
const hash = async p => createHash('sha256').update(await readFile(p)).digest('hex');
const traysOnly = process.argv.includes('--trays');
const protectedPaths = ['courtyard', ...(traysOnly ? ['island', 'picture-1', 'picture-2'] : [])].flatMap(name => ['png', 'webp'].map(ext => `${dir}/${name}.${ext}`));
const before = Object.fromEntries(await Promise.all(protectedPaths.map(async p => [p, await hash(p)])));
const manifestPath = 'scripts/source-images.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const assets = [];
for (const [name, original, size, height = size] of (traysOnly ? [
  ['tray-1row', 'tray-1row-round5.png', 1400, 560],
  ['tray-2row', 'tray-2row-round2.png', 1400, 820],
] : [
  ['island', 'island-round2.png', 1100],
  ['picture-1', 'picture-1-round1.png', 1024],
  ['picture-2', 'picture-2-round1.png', 1024],
])) {
  const input = `${out}/originals/${original}`;
  const png = `${dir}/${name}.png`;
  const webp = `${dir}/${name}.webp`;
  await sharp(input).resize(size, height, { fit: 'contain', background: '#00000000' }).png().toFile(png);
  await sharp(png).resize(traysOnly ? size : name === 'island' ? 1100 : 900).webp({ quality: 88, effort: 6 }).toFile(webp);
  manifest[png] = await hash(png);
  for (const file of [png, webp]) {
    const m = await sharp(file).metadata();
    assets.push({ file, width: m.width, height: m.height, alpha: m.hasAlpha, bytes: (await stat(file)).size, sha256: await hash(file) });
  }
}
for (const p of protectedPaths) if (await hash(p) !== before[p]) throw new Error(`Protected file changed: ${p}`);
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
await writeFile(`${out}/${traysOnly ? 'tray-' : ''}assets.json`, JSON.stringify(assets, null, 2) + '\n');
await writeFile(`${out}/${traysOnly ? 'tray-' : ''}protected-verification.json`, JSON.stringify({ unchanged: true, hashes: before }, null, 2) + '\n');
console.log(assets);
