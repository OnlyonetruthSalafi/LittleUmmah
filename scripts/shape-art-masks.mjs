import sharp from 'sharp';

/** Detect the five gold socket rims. No hand-entered hole coordinates. */
export async function measureShapeHoles(png) {
  const { data, info: { width: w, height: h } } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const gold = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, p = i * 4;
    if (data[p + 3] > 200 && data[p] > 140 && data[p + 1] > 90 && data[p + 2] < data[p + 1] * .88 && data[p] > data[p + 1] * 1.015) gold[i] = 1;
  }
  // Close tiny highlight gaps in the gold before finding connected rims.
  const closed = new Uint8Array(w * h);
  for (let y = 2; y < h - 2; y++) for (let x = 2; x < w - 2; x++) {
    if (!gold[y * w + x]) continue;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) closed[(y + dy) * w + x + dx] = 1;
  }
  const visited = new Uint8Array(w * h), regions = [];
  for (let start = 0; start < closed.length; start++) {
    if (!closed[start] || visited[start]) continue;
    const pixels = [], queue = [start]; visited[start] = 1;
    let x0 = w, y0 = h, x1 = 0, y1 = 0;
    while (queue.length) {
      const i = queue.pop(), x = i % w, y = Math.floor(i / w);
      pixels.push(i); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
        if (j >= 0 && closed[j] && !visited[j]) { visited[j] = 1; queue.push(j); }
      }
    }
    // Socket rims are compact; reject the long connected gold edge of the tray.
    if (pixels.length > 500 && x1 - x0 > 80 && x1 - x0 < w * .5 && y1 - y0 > 35 && y1 - y0 < h * .5) regions.push({ x0, y0, x1, y1, pixels });
  }
  if (regions.length !== 5) throw new Error(`Expected five isolated socket rims, got ${regions.length}: ${JSON.stringify(regions.map(({ pixels, ...r }) => ({ ...r, area: pixels.length })))}`);
  const byY = regions.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const back = byY.slice(0, 2).sort((a, b) => a.x0 - b.x0);
  const front = byY.slice(3).sort((a, b) => a.x0 - b.x0);
  const named = { circle: back[0], square: back[1], star: byY[2], triangle: front[0], rectangle: front[1] };
  const result = {};
  for (const [shape, region] of Object.entries(named)) {
    // Flood from outside the rim. Preserve the star's concave notches.
    const silhouette = new Uint8Array(w * h);
    for (const i of region.pixels) silhouette[i] = 1;
    const exterior = new Uint8Array(w * h), queue = [0]; exterior[0] = 1;
    while (queue.length) {
      const i = queue.pop(), x = i % w, y = Math.floor(i / w);
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
        if (j >= 0 && !silhouette[j] && !exterior[j]) { exterior[j] = 1; queue.push(j); }
      }
    }
    for (let i = 0; i < silhouette.length; i++) silhouette[i] = exterior[i] ? 0 : 1;
    const rgba = Buffer.alloc(w * h * 4);
    const erosion = 8;
    let count = 0;
    for (let y = region.y0; y <= region.y1; y++) for (let x = region.x0; x <= region.x1; x++) {
      let inside = true;
      for (let dy = -erosion; dy <= erosion && inside; dy++) for (let dx = -erosion; dx <= erosion; dx++) {
        if (dx * dx + dy * dy > erosion * erosion) continue;
        if (!silhouette[(y + dy) * w + x + dx]) { inside = false; break; }
      }
      if (inside) { rgba.fill(255, (y * w + x) * 4, (y * w + x) * 4 + 4); count++; }
    }
    if (count < 1000) throw new Error(`Socket mask too small: ${shape}`);
    const { x0, x1, y0, y1 } = region;
    const round = n => +n.toFixed(3);
    result[shape] = {
      bounds: { x0, y0, x1, y1 },
      hole: { x: round((x0 + x1) / 2 / w * 100), y: round((y0 + y1) / 2 / h * 100), w: round((x1 - x0 + 1) / w * 100), h: round((y1 - y0 + 1) / h * 100) },
      mask: await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer(),
    };
  }
  return result;
}
