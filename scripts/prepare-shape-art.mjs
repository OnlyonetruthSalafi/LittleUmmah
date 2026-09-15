/* เตรียมภาพเกมจับคู่รูปทรง — จาก PNG ต้นฉบับใน `public/games/shape match/` ไปเป็น WebP ใน `public/games/shape/`
 *
 *   node scripts/prepare-shape-art.mjs
 *
 * เจ้าของโปรเจกต์วาดภาพแผ่นฐานไว้ครบทุกสถานะ: หยอดแล้ว 0,1,2,3,4,5 ชิ้น
 * รวม 32 ภาพ = ทุกชุดย่อยของห้ารูปทรงพอดี เกมจึงแสดงผลสะสมได้จริง ไม่ใช่โชว์แค่ชิ้นล่าสุด
 *
 * ต้นฉบับแต่ละใบเรนเดอร์แยกกัน สคริปต์นี้จึง trim ขอบโปร่งใสแล้ววางกึ่งกลางผืนผ้าใบเดียวกันทุกใบ
 * เพื่อให้ภาพไม่กระตุกตอนสลับ แล้ว**อ่านเองว่าแต่ละใบหยอดรูปทรงไหนไปแล้วบ้าง**
 * โดยเทียบสีตรงตำแหน่งหลุมกับภาพอ้างอิง (แผ่นเปล่า กับแผ่นที่หยอดทีละชิ้น)
 * ผลลัพธ์ตั้งชื่อเป็นบิตมาสก์ตามลำดับ circle,square,triangle,rectangle,star เช่น `plate-10100.webp`
 */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

const SRC = 'public/games/shape match';
const OUT = 'public/games/shape';
const PLATE_W = 900, PLATE_H = 860, BLOCK = 420, ISLAND_W = 1100;

const SHAPES = ['circle', 'square', 'triangle', 'rectangle', 'star'];
/* ตำแหน่งหลุมบนผืนผ้าใบที่ normalize แล้ว หาจากคิ้วทองรอบหลุมใน plate.webp (% ของภาพ) */
const HOLES = {
  circle: { x: 38.2, y: 20.3 }, square: { x: 76.1, y: 28.0 }, triangle: { x: 23.2, y: 51.9 },
  rectangle: { x: 60.2, y: 64.2 }, star: { x: 51.0, y: 40.0 },
};

const BASE = `${SRC}/object/ChatGPT Image Sep 13, 2026, 07_59_49 PM (1).png`;
/* ห้าใบนี้ระบุด้วยการดูภาพจริง ใช้เป็นตัวอ้างอิง "หยอดแล้ว" ของแต่ละรูปทรง */
const SINGLES = {
  triangle: `${SRC}/done/ChatGPT Image Sep 13, 2026, 08_11_58 PM (1).png`,
  circle: `${SRC}/done/ChatGPT Image Sep 13, 2026, 08_11_59 PM (2).png`,
  star: `${SRC}/done/ChatGPT Image Sep 13, 2026, 08_11_59 PM (3).png`,
  rectangle: `${SRC}/done/ChatGPT Image Sep 13, 2026, 08_12_00 PM (4).png`,
  square: `${SRC}/done/ChatGPT Image Sep 13, 2026, 08_12_00 PM (5).png`,
};

const BLOCKS = {
  circle: '07_59_51 PM (3)', square: '07_59_51 PM (4)', triangle: '07_59_52 PM (5)',
  rectangle: '07_59_53 PM (6)', star: '07_59_54 PM (7)',
};
const ISLAND = `${SRC}/object/ChatGPT Image Sep 13, 2026, 07_59_50 PM (2).png`;

const hashes = {};
let sourceBytes = 0, outBytes = 0;

/** ภาพบางชุดส่งมาเป็น PNG ทึบพื้นหลังดำ ไม่มี alpha
 *  จึงต้องคีย์พื้นหลังออกก่อน โดยไล่จากขอบภาพเข้ามาเฉพาะพิกเซลดำที่ต่อเนื่องกับขอบ
 *  (ถ้าลบทุกพิกเซลที่ดำ เงาเข้มๆ กลางแผ่นจะหายไปด้วย) */
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

/** trim ขอบโปร่งใส แล้ววางกึ่งกลางผืนผ้าใบขนาดคงที่ — คืน buffer PNG ที่ยัง raw ได้ */
async function normalize(src, width, height) {
  const raw = await readFile(src);
  sourceBytes += raw.length;
  const opaque = !(await sharp(raw).metadata()).hasAlpha;
  const source = opaque ? await cutBlackBackground(raw) : raw;
  const trimmed = await sharp(source).ensureAlpha().trim({ threshold: 6 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const scale = Math.min(width / meta.width, height / meta.height);
  const w = Math.round(meta.width * scale), h = Math.round(meta.height * scale);
  return sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await sharp(trimmed).resize(w, h).toBuffer(), left: Math.round((width - w) / 2), top: Math.round((height - h) / 2) }])
    .png().toBuffer();
}

/** สีเฉลี่ยตรงกลางหลุมแต่ละหลุม ใช้เป็นลายนิ้วมือว่าหลุมนั้นว่างหรือมีของอยู่ */
async function holeColors(pngBuffer) {
  const { data, info } = await sharp(pngBuffer).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const out = {};
  for (const shape of SHAPES) {
    const cx = Math.round(HOLES[shape].x / 100 * W), cy = Math.round(HOLES[shape].y / 100 * H);
    const rx = Math.round(W * 0.045), ry = Math.round(H * 0.045);
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = cy - ry; y <= cy + ry; y++) for (let x = cx - rx; x <= cx + rx; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const p = (y * W + x) * C; r += data[p]; g += data[p + 1]; b += data[p + 2]; n++;
    }
    out[shape] = [r / n, g / n, b / n];
  }
  return out;
}

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

await mkdir(OUT, { recursive: true });

/* ── สร้างตัวอ้างอิง ─────────────────────────────────────────────────── */
const basePng = await normalize(BASE, PLATE_W, PLATE_H);
const emptyRef = await holeColors(basePng);
const filledRef = {};
for (const [shape, file] of Object.entries(SINGLES)) {
  const colors = await holeColors(await normalize(file, PLATE_W, PLATE_H));
  filledRef[shape] = colors[shape];
}

/* ── อ่านทุกภาพแผ่นฐาน แล้วบอกว่าหยอดรูปทรงไหนไปแล้วบ้าง ─────────────── */
/* จำนวนชิ้นที่หยอดแล้วรู้จากชื่อโฟลเดอร์ ใช้เป็นหลักยึดตอนอ่านภาพ
   ถ้าปล่อยให้ตัดสินทีละหลุมอิสระ หลุมที่สีใกล้กัน (เช่น ดาวทองในหลุมทอง) จะอ่านพลาดได้ */
const plateDirs = [{ dir: `${SRC}/done/2done`, filled: 2 }, { dir: `${SRC}/done/3done`, filled: 3 }, { dir: `${SRC}/done/4done`, filled: 4 }];
const plates = [];
for (const { dir, filled } of plateDirs) {
  for (const name of (await readdir(dir, { withFileTypes: true })).filter(e => e.isFile() && e.name.endsWith('.png'))) {
    const file = `${dir}/${name.name}`;
    plates.push({ file, filled, png: await normalize(file, PLATE_W, PLATE_H) });
  }
}

const seen = new Map();
const add = (mask, plate) => {
  if (seen.has(mask)) throw new Error(`มาสก์ ${mask} ซ้ำ:\n  ${seen.get(mask).file}\n  ${plate.file}`);
  seen.set(mask, plate);
};
/* แผ่นเปล่ากับห้าใบที่หยอดทีละชิ้นระบุไว้ตรงๆ แล้วข้างบน ใบที่เหลือในโฟลเดอร์ done คือหยอดครบห้า */
add('00000', { file: BASE, png: basePng });
for (const [shape, file] of Object.entries(SINGLES)) {
  add(SHAPES.map(s => s === shape ? '1' : '0').join(''), { file, png: await normalize(file, PLATE_W, PLATE_H) });
}
const singleFiles = new Set(Object.values(SINGLES));
for (const name of (await readdir(`${SRC}/done`, { withFileTypes: true })).filter(e => e.isFile() && e.name.endsWith('.png'))) {
  const file = `${SRC}/done/${name.name}`;
  if (singleFiles.has(file)) continue;
  add('11111', { file, png: await normalize(file, PLATE_W, PLATE_H) });
}
/* ใบที่เหลือ: เลือกหลุมที่ "เหมือนของที่หยอดแล้ว" มากที่สุด ตามจำนวนที่โฟลเดอร์บอก */
for (const plate of plates) {
  const colors = await holeColors(plate.png);
  // ต้องหารด้วยระยะห่างของสีอ้างอิงก่อน ไม่งั้นเทียบข้ามรูปทรงไม่ได้:
  // สามเหลี่ยมแดงกับหลุมเขียวห่างกันมาก คะแนนดิบจึงพองกว่าสี่เหลี่ยมน้ำเงินที่สีหลุมใกล้กัน
  const scored = SHAPES.map(shape => ({ shape,
    score: (distance(colors[shape], emptyRef[shape]) - distance(colors[shape], filledRef[shape]))
      / distance(emptyRef[shape], filledRef[shape]) }))
    .sort((a, b) => b.score - a.score);
  const filled = new Set(scored.slice(0, plate.filled).map(s => s.shape));
  add(SHAPES.map(s => filled.has(s) ? '1' : '0').join(''), plate);
}

/* ตรวจว่าครบทั้ง 32 ชุดย่อยจริง ถ้าอ่านผิดใบเดียวจะโผล่ตรงนี้ทันที */
const missing = [];
for (let i = 0; i < 32; i++) { const mask = i.toString(2).padStart(5, '0'); if (!seen.has(mask)) missing.push(mask); }
if (missing.length) throw new Error(`อ่านภาพได้ไม่ครบทุกสถานะ ขาดมาสก์: ${missing.join(', ')}`);

console.log(`แผ่นฐาน ${seen.size} สถานะ (ครบทุกชุดย่อยของห้ารูปทรง):`);
for (const [mask, plate] of [...seen].sort()) {
  const raw = await readFile(plate.file);
  hashes[`${OUT}/plate-${mask}.webp`] = { source: plate.file, sha256: createHash('sha256').update(raw).digest('hex') };
  const buffer = await sharp(plate.png).webp({ quality: 86, effort: 6 }).toBuffer();
  await writeFile(`${OUT}/plate-${mask}.webp`, buffer);
  outBytes += buffer.length;
  const names = SHAPES.filter((_, i) => mask[i] === '1');
  console.log(`  plate-${mask}  ${(buffer.length / 1024).toFixed(0).padStart(3)} KB  ${names.join(', ') || '(ยังไม่หยอดเลย)'}`);
}

/* ── บล็อกกับเกาะ ─────────────────────────────────────────────────────── */
async function write(src, out, width, height, quality) {
  const raw = await readFile(src);
  hashes[`${OUT}/${out}.webp`] = { source: src, sha256: createHash('sha256').update(raw).digest('hex') };
  const buffer = await sharp(await normalize(src, width, height)).webp({ quality, effort: 6 }).toBuffer();
  await writeFile(`${OUT}/${out}.webp`, buffer);
  outBytes += buffer.length;
  console.log(`  ${out.padEnd(16)} ${(buffer.length / 1024).toFixed(0)} KB`);
}
/*
  บล็อกสี่เหลี่ยมจัตุรัสในถาด: ต้นฉบับใน object/ วาดเป็น "ลูกบาศก์หันมุมเข้าหาคนดู"
  หน้าบนจึงเป็นข้าวหลามตัด ไม่เหมือนหลุมบนแผ่นซึ่งเป็นสี่เหลี่ยมวางตรง
  เด็กที่กำลังหัดรูปทรงจึงมองไม่ออกว่าชิ้นนี้คู่กับหลุมไหน (เจ้าของโปรเจกต์แจ้ง)

  แก้โดยตัด "แผ่นสี่เหลี่ยมสีน้ำเงินที่หยอดลงหลุมแล้ว" ออกมาจากภาพแผ่นฐานของเจ้าของโปรเจกต์เอง
  มุมมอง แสง และสัดส่วนจึงตรงกับหลุมเป๊ะ เพราะมาจากภาพเดียวกัน
  (ไม่ได้วาดใหม่ ไม่ได้เอาของคนอื่นมา — เป็นภาพชุดเดิมของโปรเจกต์)

  ถ้ามีภาพบล็อกสี่เหลี่ยมที่วาดใหม่มาแทน ให้ลบฟังก์ชันนี้แล้วใส่ square กลับเข้า BLOCKS ตามปกติ
*/
async function writeSquareFromPlate() {
  const src = SINGLES.square;
  const raw = await readFile(src);
  const { data, info } = await sharp(raw).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  // น้ำเงินของแผ่นเท่านั้น — เกณฑ์นี้ไม่ติดฟ้าเทอร์ควอยซ์ของถาดและคิ้วทองรอบหลุม
  const isBlue = (r, g, b) => b > 110 && b - r > 55 && b - g > 25;

  const rows = new Array(H).fill(0), cols = new Array(W).fill(0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    if (isBlue(data[i], data[i + 1], data[i + 2])) { rows[y]++; cols[x]++; }
  }
  // ตัดพิกเซลหลงเหลือจากขอบภาพทิ้ง ด้วยการนับว่าแถว/คอลัมน์นั้นมีสีน้ำเงินมากพอจริง
  const span = c => [c.findIndex(v => v > 8), c.length - 1 - [...c].reverse().findIndex(v => v > 8)];
  const [y0, y1] = span(rows), [x0, x1] = span(cols);
  const pad = 8;
  const left = Math.max(0, x0 - pad), top = Math.max(0, y0 - pad);
  const w = Math.min(W - left, x1 - x0 + 1 + pad * 2), h = Math.min(H - top, y1 - y0 + 1 + pad * 2);

  const mask = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((top + y) * W + (left + x)) * C, o = (y * w + x) * 4;
    mask[o] = mask[o + 1] = mask[o + 2] = 255;
    mask[o + 3] = isBlue(data[i], data[i + 1], data[i + 2]) ? 255 : 0;
  }
  // median กินจุดหลงเดี่ยวๆ ทิ้ง แล้ว blur ทำให้ขอบไม่เป็นฟันเลื่อย
  const maskPng = await sharp(mask, { raw: { width: w, height: h, channels: 4 } }).median(5).blur(1).png().toBuffer();
  const cut = await sharp(raw).extract({ left, top, width: w, height: h }).ensureAlpha()
    .composite([{ input: maskPng, blend: 'dest-in' }]).png().toBuffer();

  // trim ต้องแยกไปป์ไลน์ ไม่ต่อท้าย composite ได้ เพราะ sharp ทำ trim ก่อน composite เสมอ
  const topFace = await sharp(cut).trim({ threshold: 5 }).png().toBuffer();
  const face = await sharp(topFace).metadata();

  /*
    แผ่นที่ตัดมาจากหลุมเป็น "หน้าบน" อย่างเดียว ไม่มีความหนา เพราะด้านข้างจมอยู่ในหลุม
    จึงต้องปั้นความหนาขึ้นมาเอง: วางสำเนาหน้าบนซ้อนลงล่างทีละพิกเซล ไล่ให้เข้มลงเรื่อยๆ
    ได้เป็นบล็อกทึบที่มีด้านข้างเหมือนบล็อกอีกสี่ชิ้น
  */
  const depth = Math.round(face.height * 0.30);
  const offsets = Array.from({ length: depth }, (_, k) => depth - k);
  const shades = await Promise.all(offsets.map(async dy => ({
    input: await sharp(topFace).modulate({ brightness: 0.80 + 0.16 * (1 - dy / depth) }).png().toBuffer(),
    left: 0, top: dy,
  })));
  const canvas = () => sharp({ create: { width: face.width, height: face.height + depth, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } });

  /* ด้านข้างที่ได้จะมีริ้วของไฮไลต์บนหน้าบนติดมา เบลอเฉพาะ "สี" ให้เรียบ
     แล้วเอา alpha คมๆ ของกองเดิมมาครอบกลับ ขอบบล็อกจึงไม่ฟุ้ง */
  const white = await sharp(topFace).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < white.data.length; i += 4) { white.data[i] = 255; white.data[i + 1] = 255; white.data[i + 2] = 255; }
  const whitePng = await sharp(white.data, { raw: { width: white.info.width, height: white.info.height, channels: 4 } }).png().toBuffer();
  const silhouette = await canvas().composite(offsets.map(dy => ({ input: whitePng, left: 0, top: dy }))).png().toBuffer();
  const smooth = await sharp(await canvas().composite(shades).png().toBuffer()).blur(5).png().toBuffer();
  const side = await sharp(smooth).composite([{ input: silhouette, blend: 'dest-in' }]).png().toBuffer();
  const block = await sharp(side).composite([{ input: topFace, left: 0, top: 0 }]).png().toBuffer();

  const buffer = await sharp(block)
    .resize(BLOCK - 10, BLOCK - 10, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 5, bottom: 5, left: 5, right: 5, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, effort: 6 }).toBuffer();
  await writeFile(`${OUT}/block-square.webp`, buffer);
  hashes[`${OUT}/block-square.webp`] = { source: src, sha256: createHash('sha256').update(raw).digest('hex') };
  outBytes += buffer.length;
  console.log(`  ${'block-square'.padEnd(16)} ${(buffer.length / 1024).toFixed(0)} KB  (ตัดจากแผ่นที่หยอดแล้ว + ปั้นความหนา)`);
}

console.log('บล็อกรูปทรง:');
for (const [shape, stamp] of Object.entries(BLOCKS)) {
  if (shape === 'square') { await writeSquareFromPlate(); continue; }
  await write(`${SRC}/object/ChatGPT Image Sep 13, 2026, ${stamp}.png`, `block-${shape}`, BLOCK, BLOCK, 90);
}
console.log('เกาะ:');
await write(ISLAND, 'island', ISLAND_W, ISLAND_W, 88);

const file = 'scripts/source-images.json';
const existing = JSON.parse(await readFile(file, 'utf8').catch(() => '{}'));
for (const key of Object.keys(existing)) if (key.startsWith(`${OUT}/plate-`) && !(key in hashes)) delete existing[key];
await writeFile(file, JSON.stringify({ ...existing, ...hashes }, null, 2) + '\n');
console.log(`\nรวม ${(sourceBytes / 1024 / 1024).toFixed(1)} MB -> ${(outBytes / 1024).toFixed(0)} KB`);
