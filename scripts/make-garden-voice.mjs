import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderRobotLines } from './lib/robot-voice.mjs';
import { FRIENDS } from '../src/lib/friends.ts';
import { allRequests } from '../src/features/games/garden/model.ts';
import lines from '../src/features/games/garden/lines.json' with { type: 'json' };

// Garden friends' lines (VIP game 2). Records only missing clips unless keys are named.
const folder = 'public/audio/th/garden';
mkdirSync(folder, { recursive: true });
const selected = process.argv.slice(2);
const shouldRecord = key => selected.length ? selected.includes(key) : !existsSync(join(folder, key + '.mp3'));

for (const visitor of ['hadi', 'safi', 'sabir']) {
  const batch = {};
  for (const r of allRequests.filter(r => r.visitor === visitor)) {
    const key = `${visitor}-${r.id}`;
    if (shouldRecord(key)) batch[key] = lines.requests[r.id].th;
  }
  for (const [hint, text] of Object.entries(lines.hints)) {
    const key = `${visitor}-${hint}`;
    if (shouldRecord(key)) batch[key] = visitor === 'safi' ? text.safi : text.th;
  }
  if (Object.keys(batch).length) {
    const { voiceId, pitch } = FRIENDS[visitor];
    await renderRobotLines(batch, folder, [], { voiceId, pitch });
  }
}
