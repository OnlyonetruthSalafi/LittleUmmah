import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

// Artwork composites only: no CSS, browser, DOM or tap-target claims.
const dir = 'output/sequence-art';
const m = JSON.parse(await readFile(`${dir}/measurements.json`, 'utf8')).assets;
const size = m.island.png.width;
const layers = [], placement = [];
const surface = await sharp(`${dir}/surface-mask.png`).extractChannel(0).raw().toBuffer();
async function sprite(name, width, anchor, target, detail = {}) {
  const input = await sharp(`public/games/sequence/${name}.webp`).resize(width, width).png().toBuffer();
  const left = Math.round(target.x - anchor.x / 100 * width), top = Math.round(target.y - anchor.y / 100 * width);
  if (left < 0 || top < 0 || left + width > size || top + width > size) throw new Error('Sprite exceeds canvas');
  layers.push({ input, left, top });
  placement.push({ name, width, left, top, ...detail });
}
async function padCoverage(x, y, width) {
  const alpha = await sharp('public/games/sequence/pad.webp').resize(width, width).ensureAlpha().extractChannel(3).raw().toBuffer();
  const left = Math.round(x - .5 * width), top = Math.round(y - m.pad.baseAnchor.percent.y / 100 * width);
  let total = 0, inside = 0;
  for (let py = 0; py < width; py++) for (let px = 0; px < width; px++) if (alpha[py * width + px] >= 240) {
    total++;
    if (surface[(top + py) * size + left + px] > 0) inside++;
  }
  return inside / total;
}
const reports = {};
for (const type of ['towers', 'sizes', 'waiting']) {
  layers.length = 0; placement.length = 0;
  const count = type === 'sizes' ? 3 : 4;
  const padWidth = count === 3 ? 180 : 160;
  const targets = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const proposed = { x: size * (.325 + .425 * t), y: size * (.51 - .095 * t) };
    // Find nearest placement whose full opaque pad lies on measured turquoise.
    let best = null;
    for (let dy = -24; dy <= 24; dy += 4) for (let dx = -24; dx <= 24; dx += 4) {
      const x = proposed.x + dx, y = proposed.y + dy;
      const coverage = await padCoverage(x, y, padWidth);
      const score = coverage * 100 - Math.hypot(dx, dy) * .035;
      if (!best || score > best.score) best = { x, y, coverage, score };
    }
    if (best.coverage < .99) throw new Error(`Pad ${i + 1}: less than 99% inside measured surface`);
    targets.push(best);
  }
  // Back to front; tower layers bottom to top so the next cube occludes the top plane.
  for (let i = count - 1; i >= 0; i--) {
    const p = targets[i];
    await sprite('pad', padWidth, m.pad.baseAnchor.percent, p, { pad: i + 1, surfaceCoverage: p.coverage });
    if (type !== 'waiting') {
      const width = type === 'sizes' ? [74, 108, 140][i] : 78;
      const n = type === 'sizes' ? 1 : i + 1;
      for (let level = 0; level < n; level++) {
        await sprite('block', width, m.block.baseAnchor.percent, { x: p.x - width * .1, y: p.y - padWidth * .105 - level * width * m.block.stackStep.percent / 100 }, { pad: i + 1, level: level + 1 });
      }
    }
  }
  if (type === 'waiting') {
    // Waiting row follows foreground plane. All four contact points checked against measured mask.
    for (let i = 0; i < 4; i++) {
      const width = Math.round(size * .14);
      // Sprite boxes span x14..86%; align measured front-base anchors at y64%.
      const left = size * (.14 + (.72 - .14) * i / 3);
      const target = { x: left + width * m.block.baseAnchor.percent.x / 100, y: size * .64 };
      if (!surface[Math.round(target.y) * size + Math.round(target.x)]) throw new Error('Waiting base off measured courtyard');
      const alpha = await sharp('public/games/sequence/block.webp').resize(width, width).ensureAlpha().extractChannel(3).raw().toBuffer();
      const top = Math.round(target.y - width * m.block.baseAnchor.percent.y / 100);
      let total = 0, inside = 0;
      for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) if (alpha[y * width + x] >= 240) {
        total++;
        if (surface[(top + y) * size + Math.round(left) + x]) inside++;
      }
      if (inside / total < .99) throw new Error('Waiting sprite silhouette off measured courtyard');
      await sprite('block', width, m.block.baseAnchor.percent, target, { waiting: i + 1, basePercent: { x: target.x / size * 100, y: 64 }, surfaceCoverage: inside / total });
    }
  }
  const result = await sharp('public/games/sequence/island.webp').composite(layers).png().toBuffer();
  await sharp(result).png().toFile(`${dir}/preview-${type}.png`);
  await sharp(result).flatten({ background: '#edf5fb' }).resize(768, 768).png().toFile(`${dir}/preview-${type}-768.png`);
  await sharp(result).flatten({ background: '#edf5fb' }).resize(390, 390).png().toFile(`${dir}/preview-${type}-390.png`);
  reports[type] = { note: 'Sharp composition, not browser screenshot. Layout proposals, not production game coordinates.', placements: structuredClone(placement) };
}
await writeFile(`${dir}/preview-layouts.json`, JSON.stringify(reports, null, 2) + '\n');
console.log(Object.fromEntries(Object.entries(reports).map(([k, v]) => [k, v.placements.filter(p => p.name === 'pad')])));
