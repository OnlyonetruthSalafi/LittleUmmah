import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { measureShapeHoles } from './shape-art-masks.mjs';

// One empty plate + one edited filled plate. Only socket masks ever change.
const SRC = 'public/games/shape match', OUT = 'public/games/shape';
const PLATE_W = 900, BLOCK = 420, ISLAND_W = 1100;
const SHAPES = ['circle', 'square', 'triangle', 'rectangle', 'star'];
const BASE = `${SRC}/object/ChatGPT Image Sep 13, 2026, 07_59_49 PM (1).png`;
const FULL = `${SRC}/done/ChatGPT Image Sep 13, 2026, 08_12_01 PM (6).png`;
const ISLAND = `${SRC}/object/ChatGPT Image Sep 13, 2026, 07_59_50 PM (2).png`;
const BLOCKS = { circle: '07_59_51 PM (3)', square: '07_59_51 PM (4)', triangle: '07_59_52 PM (5)', rectangle: '07_59_53 PM (6)', star: '07_59_54 PM (7)' };
const hashes = {};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

async function source(file) {
  const raw = await readFile(file);
  const meta = await sharp(raw).metadata();
  return meta.hasAlpha ? raw : cutBlackBackground(raw);
}
async function bounds(png) {
  const { data, info: { width: w, height: h } } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  // Ignore sparse alpha fringe; retain the silhouette and two pixels of antialiasing.
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 200) {
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  x0 = Math.max(0, x0 - 2); y0 = Math.max(0, y0 - 2); x1 = Math.min(w - 1, x1 + 2); y1 = Math.min(h - 1, y1 + 2);
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}
async function writeAsset(src, name, width, height) {
  const input = await source(src);
  const crop = await sharp(input).extract(await bounds(input)).png().toBuffer();
  const buffer = await sharp(crop).resize(width, height, { fit: 'contain', background: '#00000000' }).webp({ quality: 90, effort: 6 }).toBuffer();
  await writeFile(`${OUT}/${name}.webp`, buffer);
  hashes[`${OUT}/${name}.webp`] = { source: src, sha256: hash(await readFile(src)) };
}
await mkdir(OUT, { recursive: true });
await mkdir('output/shape-rework', { recursive: true });
const baseSource = await source(BASE), fullSource = await source(FULL);
const crop = await bounds(baseSource);
const PLATE_H = Math.round(PLATE_W * crop.height / crop.width);
const base = await sharp(baseSource).extract(crop).resize(PLATE_W, PLATE_H, { fit: 'fill' }).png().toBuffer();
// Use exactly the same crop/resize for the edit; independent trim causes misalignment.
const full = await sharp(fullSource).extract(crop).resize(PLATE_W, PLATE_H, { fit: 'fill' }).png().toBuffer();
const sockets = await measureShapeHoles(base);
for (const shape of SHAPES) {
  await writeFile(`output/shape-rework/mask-${shape}.png`, sockets[shape].mask);
}
const basePixels = await sharp(base).ensureAlpha().raw().toBuffer();
const fullPixels = await sharp(full).ensureAlpha().raw().toBuffer();
// ภาพที่คีย์พื้นหลังออกมีจุดดำจางๆ หลงอยู่นอกตัวถาด (alpha ต่ำ) ลบทิ้งให้โปร่งใสจริง
for (const px of [basePixels, fullPixels]) for (let i = 3; i < px.length; i += 4) if (px[i] < 24) px[i] = 0;
const maskPixels = await Promise.all(SHAPES.map(s => sharp(sockets[s].mask).raw().toBuffer()));
let outsideChanges = 0;
for (let bits = 0; bits < 32; bits++) {
  const mask = bits.toString(2).padStart(5, '0');
  const pixels = Buffer.from(basePixels);
  for (let i = 0; i < pixels.length; i += 4) {
    if (maskPixels.some((m, j) => mask[j] === '1' && m[i + 3])) fullPixels.copy(pixels, i, i, i + 4);
  }
  const composed = await sharp(pixels, { raw: { width: PLATE_W, height: PLATE_H, channels: 4 } }).png().toBuffer();
  for (let i = 0; i < pixels.length; i += 4) {
    if (maskPixels.some((m, j) => mask[j] === '1' && m[i + 3])) continue;
    for (let c = 0; c < 4; c++) if (pixels[i + c] !== basePixels[i + c]) outsideChanges++;
  }
  // lossy q88 ไม่ใช่ lossless: lossless ได้ใบละ ~620KB รวม 32 ใบ 20MB หนักเกินไปสำหรับมือถือ
  // q88 เหลือราวใบละ 60–90KB ตาเปล่าแยกไม่ออก tests/shape-art.test.mjs จึงตรวจด้วยสีเฉลี่ยในแต่ละหลุมแทนการเทียบทีละพิกเซล
  await sharp(composed).webp({ quality: 88, alphaQuality: 90, effort: 6 }).toFile(`${OUT}/plate-${mask}.webp`);
  hashes[`${OUT}/plate-${mask}.webp`] = {
    source: BASE, sha256: hash(await readFile(BASE)),
    editedSource: FULL, editedSha256: hash(await readFile(FULL)),
    mask, recipe: 'scripts/prepare-shape-art.mjs + scripts/shape-art-masks.mjs',
  };
}
if (outsideChanges) throw new Error(`Pixels changed outside active sockets: ${outsideChanges}`);
for (const [shape, stamp] of Object.entries(BLOCKS)) await writeAsset(`${SRC}/object/ChatGPT Image Sep 13, 2026, ${stamp}.png`, `block-${shape}`, BLOCK, BLOCK);
// Keep the reference canvas: trimming the empty island shifts its cream surface.
await sharp(await source(ISLAND)).resize(ISLAND_W, ISLAND_W).webp({ quality: 90, effort: 6 }).toFile(`${OUT}/island.webp`);
hashes[`${OUT}/island.webp`] = { source: ISLAND, sha256: hash(await readFile(ISLAND)) };
const measurements = Object.fromEntries(SHAPES.map(s => [s, { bounds: sockets[s].bounds, ...sockets[s].hole }]));
await writeFile('output/shape-rework/hole-measurements.json', JSON.stringify({ plate: { width: PLATE_W, height: PLATE_H }, sourceCrop: crop, holes: measurements, outsideChanges }, null, 2) + '\n');
const dataFile = 'src/features/games/data/shapeArt.ts';
const data = await readFile(dataFile, 'utf8');
const holeCode = SHAPES.map(s => `  ${s}: ${JSON.stringify(sockets[s].hole)},`).join('\n');
await writeFile(dataFile, data.replace(/export const HOLES:[\s\S]*?\n};/, `export const HOLES: Record<ShapeId, { x: number; y: number; w: number; h: number }> = {\n${holeCode}\n};`).replace(/export const PLATE = .*?;/, `export const PLATE = { width: ${PLATE_W}, height: ${PLATE_H} };`));
const manifestFile = 'scripts/source-images.json';
const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
await writeFile(manifestFile, JSON.stringify({ ...manifest, ...hashes }, null, 2) + '\n');
console.log(JSON.stringify({ states: 32, outsideChanges, measurements }, null, 2));

async function cutBlackBackground(raw) {
  const { data, info } = await sharp(raw).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const dark = i => Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) <= 60;
  const out = new Uint8Array(W * H);
  const queue = [];
  for (let x = 0; x < W; x++) for (const y of [0, H - 1]) { const i = y * W + x; if (!out[i] && dark(i)) { out[i] = 1; queue.push(i); } }
  for (let y = 0; y < H; y++) for (const x of [0, W - 1]) { const i = y * W + x; if (!out[i] && dark(i)) { out[i] = 1; queue.push(i); } }
  while (queue.length) {
    const i = queue.pop(), x = i % W, y = (i / W) | 0;
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
      if (j >= 0 && !out[j] && dark(j)) { out[j] = 1; queue.push(j); }
    }
  }
  for (let i = 0; i < W * H; i++) if (out[i]) data[i * 4 + 3] = 0;

  /* ลบแค่ alpha ไม่พอ — ต้องละเลงสีของขอบภาพออกไปในพื้นที่โปร่งใสด้วย
     ถ้าปล่อยให้ใต้ความโปร่งใสเป็นสีดำ พอ next/image ย่อภาพ สีดำจะถูกเฉลี่ยเข้ามาเป็นขอบดำรอบแผ่น
     (เจอจริงมาแล้ว: ภาพ 900px สะอาด แต่ตัวที่ย่อเหลือ 267px มีพิกเซลดำทึบ 18,000 จุด) */
  let frontier = new Set();
  for (let i = 0; i < W * H; i++) if (!out[i]) frontier.add(i);
  for (let pass = 0; pass < 10; pass++) {
    const next = new Set();
    for (const i of frontier) {
      const x = i % W, y = (i / W) | 0;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
        if (j < 0 || out[j] !== 1) continue;
        data[j * 4] = data[i * 4]; data[j * 4 + 1] = data[i * 4 + 1]; data[j * 4 + 2] = data[i * 4 + 2];
        out[j] = 2; next.add(j);
      }
    }
    if (!next.size) break;
    frontier = next;
  }
  return sharp(Buffer.from(data), { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}
