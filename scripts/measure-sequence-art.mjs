import sharp from 'sharp';
import { mkdir, writeFile, stat } from 'node:fs/promises';

const out = 'output/sequence-art';
await mkdir(out, { recursive: true });
const round = n => Math.round(n * 1000) / 1000;
function box(mask, w, h) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let i = 0; i < mask.length; i++) if (mask[i]) {
    const x = i % w, y = Math.floor(i / w);
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  if (x1 < 0) throw new Error('Empty measurement mask');
  return { px: { x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }, percent: { x: round(x0 / w * 100), y: round(y0 / h * 100), width: round((x1 - x0 + 1) / w * 100), height: round((y1 - y0 + 1) / h * 100) } };
}
function largest(mask, w, h) {
  const seen = new Uint8Array(mask.length), queue = new Int32Array(mask.length);
  let best = [];
  for (let seed = 0; seed < mask.length; seed++) if (mask[seed] && !seen[seed]) {
    let head = 0, tail = 1; queue[0] = seed; seen[seed] = 1;
    while (head < tail) {
      const i = queue[head++], x = i % w, y = Math.floor(i / w);
      for (const n of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
        if (n >= 0 && mask[n] && !seen[n]) { seen[n] = 1; queue[tail++] = n; }
      }
    }
    if (tail > best.length) best = Array.from(queue.subarray(0, tail));
  }
  const result = new Uint8Array(mask.length);
  for (const i of best) result[i] = 1;
  return result;
}
function spans(mask, w, y) {
  const result = [];
  for (let x = 0; x < w; x++) if (mask[y * w + x]) {
    const left = x;
    while (x + 1 < w && mask[y * w + x + 1]) x++;
    if (x - left >= 5) result.push([left, x]);
  }
  return result;
}
const measurements = { units: 'Coordinates relative to complete PNG canvas; percent values are 0–100. Pixel boxes are inclusive.', method: 'alpha >= 240 for opaque bbox; alpha > 16 for silhouette. Color-derived geometry is an approximation, not semantic 3D reconstruction.', assets: {} };
for (const name of ['island', 'pad', 'block']) {
  const file = `public/games/sequence/${name}.png`;
  const { data, info: { width: w, height: h } } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const select = predicate => Uint8Array.from({ length: w * h }, (_, i) => predicate(...data.subarray(i * 4, i * 4 + 4), i % w, Math.floor(i / w)) ? 1 : 0);
  const opaque = select((r, g, b, a) => a >= 240), silhouette = select((r, g, b, a) => a > 16);
  const point = (x, y) => ({ px: { x: round(x), y: round(y) }, percent: { x: round(x / w * 100), y: round(y / h * 100) } });
  const asset = { png: { width: w, height: h, bytes: (await stat(file)).size }, opaqueBbox: box(opaque, w, h), silhouetteBbox: box(silhouette, w, h) };
  const webp = `public/games/sequence/${name}.webp`;
  const wm = await sharp(webp).metadata();
  const alpha = await sharp(webp).ensureAlpha().extractChannel(3).raw().toBuffer();
  const transparentPixels = alpha.reduce((n, a) => n + (a === 0), 0);
  if (!wm.hasAlpha || !transparentPixels || !alpha.some(a => a === 255)) throw new Error(`${name}: invalid WebP transparency`);
  asset.webp = { width: wm.width, height: wm.height, bytes: (await stat(webp)).size, hasAlpha: wm.hasAlpha, transparentPixels };
  let mask;
  if (name === 'island') {
    mask = largest(select((r, g, b, a) => a >= 240 && r >= 25 && r <= 130 && g >= 178 && b >= 155 && g >= b * 0.90 && g <= b * 1.24 && g - r >= 65), w, h);
    const bounds = box(mask, w, h), rows = [];
    for (let percent = 35; percent <= 75; percent += 5) {
      const y = Math.round(h * percent / 100);
      const runs = spans(mask, w, y);
      rows.push({ y: percent, left: runs.length ? round(runs[0][0] / w * 100) : null, right: runs.length ? round(runs.at(-1)[1] / w * 100) : null, spans: runs.map(s => s.map(x => round(x / w * 100))) });
    }
    asset.surface = { threshold: 'A>=240; R 25..130; G>=178; B>=155; .90<=G/B<=1.24; G-R>=65; largest 4-connected component', bbox: bounds, pixels: mask.reduce((a, b) => a + b, 0), rowsEvery5Percent: rows, polygonPercent: [...rows.map(r => [r.left, r.y]), ...rows.toReversed().map(r => [r.right, r.y])], warning: 'Approximate outer envelope can bridge holes. Use surface-mask.png and row spans for occupancy checks. Color selection may include bright rim pixels; keep placements inset.' };
    asset.surface.requiredRegions = [];
    for (const [name, y0] of [['clearCourtyard', 36], ['waitingCourtyard', 55]]) {
      let inside = 0, total = 0;
      for (let y = Math.ceil(h * y0 / 100); y <= Math.floor(h * .72); y++) {
        for (let x = Math.ceil(w * .12); x <= Math.floor(w * .88); x++) {
          total++;
          inside += mask[y * w + x];
        }
      }
      asset.surface.requiredRegions.push({ name, percent: { left: 12, right: 88, top: y0, bottom: 72 }, pixels: total, surfacePixels: inside, coverage: inside / total });
      if (inside / total < .999) throw new Error(`${name}: required courtyard is not clear`);
    }
    await sharp(Buffer.from(mask.map(x => x * 255)), { raw: { width: w, height: h, channels: 1 } }).png().toFile(`${out}/surface-mask.png`);
  } else {
    const bounds = asset.opaqueBbox.px;
    const gold = largest(select((r, g, b, a) => a >= 240 && r > 200 && g > 115 && r > b * 1.35 && g > b * 1.15), w, h);
    const gb = box(gold, w, h).px;
    const cx = name === 'pad' ? bounds.x + bounds.width / 2 : gb.x + gb.width / 2;
    // Bright bevel bands reveal the near edge of the top plane. Average a narrow central strip.
    const rowLight = y => {
      let value = 0, count = 0;
      for (let x = Math.round(cx - w * .045); x <= Math.round(cx + w * .045); x++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] >= 240) { value += .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2]; count++; }
      }
      return count ? value / count : 0;
    };
    const start = name === 'pad' ? Math.floor(bounds.y + bounds.height * .55) : Math.floor(bounds.y + bounds.height * .1);
    const end = name === 'pad' ? Math.floor(bounds.y + bounds.height * .9) : gb.y;
    let frontY = start, maxLight = -1;
    for (let y = start; y < end; y++) {
      const light = (rowLight(y - 1) + rowLight(y) + rowLight(y + 1)) / 3;
      if (light > maxLight) { maxLight = light; frontY = y; }
    }
    let baseY = h - 1;
    while (!opaque[baseY * w + Math.round(cx)] && baseY > 0) baseY--;
    asset.topFrontAnchor = point(cx, frontY);
    asset.baseAnchor = name === 'pad' ? point(cx, frontY) : point(cx, baseY);
    asset.topHeight = { px: frontY - bounds.y, percent: round((frontY - bounds.y) / h * 100) };
    asset.stackStep = name === 'block' ? { px: baseY - frontY, percent: round((baseY - frontY) / h * 100) } : null;
    asset.anchorMethod = 'X: opaque center for pad, gold front-panel bbox center for block. Top front Y: brightest averaged bevel band in color-derived search range. Block base Y: lowest opaque pixel at that X. Values are sprite alignment estimates; inspect stack composite.';
    asset.goldBbox = box(gold, w, h);
    mask = gold;
  }
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < mask.length; i++) if (mask[i]) { rgba[i * 4] = 255; rgba[i * 4 + 2] = 150; rgba[i * 4 + 3] = 100; }
  const svg = name === 'island' ? '' : `<svg width="${w}" height="${h}"><circle cx="${asset.baseAnchor.px.x}" cy="${asset.baseAnchor.px.y}" r="6" fill="red"/><circle cx="${asset.topFrontAnchor.px.x}" cy="${asset.topFrontAnchor.px.y}" r="5" fill="lime"/></svg>`;
  const layers = [{ input: rgba, raw: { width: w, height: h, channels: 4 } }];
  if (svg) layers.push({ input: Buffer.from(svg) });
  await sharp(file).flatten({ background: '#e5edf4' }).composite(layers).png().toFile(`${out}/measurement-${name}.png`);
  measurements.assets[name] = asset;
}
await writeFile(`${out}/measurements.json`, JSON.stringify(measurements, null, 2) + '\n');
console.log(JSON.stringify(measurements, null, 2));
