// ตรวจต้นฉบับ/ภาพเว็บทุกพิกเซลและสร้างหลักฐาน C-9b; ไม่แก้ภาพต้นฉบับ
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const out = 'output/stories-c9';
await mkdir(`${out}/montage`, { recursive: true });
await mkdir(`${out}/detail-crops`, { recursive: true });
const manifest = JSON.parse(await readFile('scripts/source-images.json', 'utf8'));
const results = [];
for (const [slug, count] of [['garden-owners', 8], ['two-gardens', 10]]) {
  const dir = `public/stories/${slug}`;
  const names = (await readdir(dir)).filter(n => n.endsWith('.png')).sort();
  assert.equal(names.length, count + 2);
  const tiles = [];
  for (const [index, name] of names.entries()) {
    const src = `${dir}/${name}`;
    for (const path of [src, src.replace(/\.png$/, '.webp')]) {
      const bytes = await readFile(path);
      const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let nonOpaque = 0;
      let minimum = 255;
      for (let i = 3; i < data.length; i += 4) {
        minimum = Math.min(minimum, data[i]);
        if (data[i] !== 255) nonOpaque++;
      }
      assert.equal(nonOpaque, 0, `${path}: must be fully opaque`);
      const digest = createHash('sha256').update(bytes).digest('hex');
      if (path.endsWith('.png')) {
        assert.equal(manifest[path], digest, `${path}: source manifest`);
        assert.equal(info.width, name.startsWith('cover') ? 1024 : 1536);
        assert.equal(info.height, name.startsWith('cover') ? 1536 : 1024);
      }
      results.push({ path, width: info.width, height: info.height, bytes: bytes.length, minAlpha: minimum, nonOpaque, sha256: digest });
    }
    const label = Buffer.from(`<svg width="384" height="28"><rect width="384" height="28" fill="white"/><text x="8" y="20" font-size="17" fill="black">${slug}/${name}</text></svg>`);
    const thumb = await sharp(src).resize(384, 256, { fit: 'contain', background: '#e8eef0' }).png().toBuffer();
    tiles.push({ input: thumb, left: (index % 3) * 384, top: Math.floor(index / 3) * 284 });
    tiles.push({ input: label, left: (index % 3) * 384, top: Math.floor(index / 3) * 284 + 256 });
  }
  await sharp({ create: { width: 1152, height: Math.ceil(names.length / 3) * 284, channels: 3, background: 'white' } }).composite(tiles).png().toFile(`${out}/montage/${slug}-art.png`);
}
await writeFile(`${out}/alpha.json`, JSON.stringify(results, null, 2) + '\n');
console.log(`PASS: ${results.length} PNG/WebP files; alpha = 255 at every pixel; dimensions and source hashes match.`);
