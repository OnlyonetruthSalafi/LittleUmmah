import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { renderRobotLines } from './lib/robot-voice.mjs';
import { FRIENDS } from '../src/lib/friends.ts';
import orders from '../src/features/games/smoothie/orders.json' with { type: 'json' };

const folder = 'public/audio/th/smoothie';
const selected = process.argv.slice(2);

function shouldRecord(key) {
  return selected.length ? selected.includes(key) : !existsSync(join(folder, key + '.mp3'));
}

for (const customer of ['sabir', 'safi', 'hadi']) {
  const lines = {};
  const greeting = `${customer}-shop-salam`;
  // Speak the Arabic greeting in the customer's voice. Its Thai reading is in conversation.json.
  if (shouldRecord(greeting)) lines[greeting] = 'السَّلَامُ عَلَيْكُمْ';
  for (const [recipe, { th }] of Object.entries(orders)) {
    const key = `${customer}-${recipe}`;
    if (!shouldRecord(key)) continue;
    lines[key] = customer === 'safi' ? th.replaceAll('ครับ', 'ค่ะ') : th;
  }
  if (Object.keys(lines).length) {
    const { voiceId, pitch } = FRIENDS[customer];
    await renderRobotLines(lines, folder, [], { voiceId, pitch });
  }
}
