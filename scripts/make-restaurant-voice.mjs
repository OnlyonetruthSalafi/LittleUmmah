import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderRobotLines } from './lib/robot-voice.mjs';
import { FRIENDS } from '../src/lib/friends.ts';
import { meals } from '../src/features/games/restaurant/model.ts';
import lines from '../src/features/games/restaurant/lines.json' with { type: 'json' };

// Restaurant lines (VIP game 3). Friends speak their wishes; Rassam is the waiter.
// Records only missing clips unless keys are named.
const folder = 'public/audio/th/restaurant';
mkdirSync(folder, { recursive: true });
const selected = process.argv.slice(2);
const shouldRecord = key => selected.length ? selected.includes(key) : !existsSync(join(folder, key + '.mp3'));

for (const diner of ['hadi', 'safi', 'sabir']) {
  const batch = {};
  for (const m of meals) for (const seat of m.seats) {
    if (seat.diner === diner && shouldRecord(seat.line)) batch[seat.line] = lines.seats[seat.line].th;
  }
  for (const [key, text] of Object.entries(lines.friend)) {
    const name = `${diner}-${key}`;
    if (shouldRecord(name)) batch[name] = diner === 'safi' ? text.safi : text.th;
  }
  if (Object.keys(batch).length) {
    const { voiceId, pitch } = FRIENDS[diner];
    await renderRobotLines(batch, folder, [], { voiceId, pitch });
  }
}
const waiter = {};
for (const [key, text] of Object.entries(lines.waiter)) if (shouldRecord(`waiter-${key}`)) waiter[`waiter-${key}`] = text.th;
if (Object.keys(waiter).length) {
  const { voiceId, pitch } = FRIENDS.rassam;
  await renderRobotLines(waiter, folder, [], { voiceId, pitch });
}
