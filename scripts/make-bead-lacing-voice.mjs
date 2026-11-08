import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { renderRobotLines } from './lib/robot-voice.mjs';
import { BEADS, BEAD_TEXT, beadHint } from '../src/features/games/data/beadLacing.ts';
import { games } from '../src/features/games/data/catalog.ts';
const game = games.find(g => g.slug === 'bead-lacing');
const lines = {
  'name-bead-lacing': game.title.th,
  'game-bead-lacing': game.instruction.th,
  'howto-bead-lacing': BEAD_TEXT.howto.th,
  'bead-praise': BEAD_TEXT.praise.th,
  'bead-complete': BEAD_TEXT.complete.th,
  'bead-repeat': BEAD_TEXT.repeat.th,
  ...Object.fromEntries(BEADS.map(b => [`bead-hint-${b.id}`, beadHint(b.id).th])),
};
const encoders = execFileSync(process.env.FFMPEG ?? 'ffmpeg', ['-hide_banner', '-encoders'], { encoding: 'utf8' });
if (!encoders.includes('libmp3lame')) throw new Error('Use an FFmpeg build with libmp3lame; the CapCut MediaFoundation encoder may produce empty files.');
await renderRobotLines(lines, 'public/audio/th', process.argv.slice(2));

for (const key of (process.argv.length > 2 ? process.argv.slice(2) : Object.keys(lines))) {
  if (statSync(`public/audio/th/${key}.mp3`).size < 1000) throw new Error(`Empty or truncated clip: ${key}`);
}
