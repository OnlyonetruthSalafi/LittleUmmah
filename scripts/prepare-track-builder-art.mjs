import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

// Frames are camera-aligned and deliberately keep their transparent margins.
const frames = Array.from({ length: 10 }, (_, i) => ({
  input: 'output/track-builder/frames/' + i + '.png', left: (i % 5) * 224, top: Math.floor(i / 5) * 224,
}));
await sharp({ create: { width: 1120, height: 448, channels: 4, background: '#0000' } })
  .composite(frames).png().toFile('public/games/track-builder/locomotive.png');
for (const args of [['public/games/track-builder'], ['public/games/hub', 'track-builder.png']]) {
  execFileSync(process.execPath, ['scripts/optimize-images.mjs', ...args], { stdio: 'inherit' });
}
