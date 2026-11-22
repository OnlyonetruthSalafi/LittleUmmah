import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const cell = 256;
const floor = 240;
const background = { r: 0, g: 0, b: 0, alpha: 0 };
const destination = 'public/games/vip/characters';
await mkdir(destination, { recursive: true });

// Register the moving chassis, not the cape, antenna or tool arm. The source
// cells include forward drift; movement across the world is handled by the game.
async function readFrame(path) {
  const { data, info: { width, height } } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < 115) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < left) throw new Error(`Empty sprite frame: ${path}`);
  let sumX = 0, count = 0;
  for (let y = Math.max(0, bottom - 49); y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (data[(y * width + x) * 4 + 3] < 115) continue;
      sumX += x;
      count++;
    }
  }
  const pivot = Math.round(sumX / count);
  // A narrow transparent margin retains soft antialiasing outside solid edges.
  const crop = { left: Math.max(0, left - 5), top: Math.max(0, top - 5) };
  crop.width = Math.min(width, right + 6) - crop.left;
  crop.height = Math.min(height, bottom + 6) - crop.top;
  return { path, crop, pivot: pivot - crop.left, bottom: bottom - crop.top };
}

for (const id of ['nuri', 'sabir', 'safi', 'hadi']) {
  const frames = await Promise.all([1, 2, 3, 4].map(n =>
    readFrame(`public/Character/Sprite Sheet/${id}/frames/move-0${n}.webp`)));
  // One scale for the full cycle prevents the character pulsing between steps.
  const scale = Math.min(...frames.map(({ crop, pivot, bottom }) =>
    Math.min((cell / 2 - 6) / Math.max(pivot, crop.width - pivot), (floor - 12) / bottom)));
  const layers = await Promise.all(frames.map(async ({ path, crop, pivot, bottom }, i) => ({
    input: await sharp(path).extract(crop).resize(Math.round(crop.width * scale)).png().toBuffer(),
    left: i * cell + cell / 2 - Math.round(pivot * scale),
    top: floor - Math.round(bottom * scale) - (id === 'safi' ? [0, 2, 4, 1][i] : 0),
  })));
  const result = await sharp({ create: { width: cell * frames.length, height: cell, channels: 4, background } })
    .composite(layers).webp({ quality: 89, alphaQuality: 100, effort: 6 }).toFile(`${destination}/${id}-walk.webp`);
  console.log(`${id}: ${result.width}×${result.height}, ${result.size} bytes`);
}
