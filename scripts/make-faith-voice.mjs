// Approved copy is imported directly. Only the TTS pronunciation and audio
// namespace are adapted here; no on-screen religious text is changed.
import path from 'node:path';
import { existsSync, statSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { renderRobotLines, voiceText } from './lib/robot-voice.mjs';
import { CARTOONS, GUIDE_STEPS } from '../src/features/faith/data.ts';

export const LINES = {};
const words = [...new Map(Object.values(CARTOONS).flatMap(c => c.scenes)
  .filter(s => s.word).map(s => [s.word.th, s.word])).values()]
  .sort((a, b) => b.th.length - a.th.length);
function arabicWords(text) {
  for (const word of words) text = text.replaceAll(word.th, word.ar);
  return text;
}
for (const step of GUIDE_STEPS) LINES[step.clip] = arabicWords(step.th);
for (const cartoon of Object.values(CARTOONS)) for (const scene of cartoon.scenes) {
  let text = scene.voice ?? scene.th;
  if (scene.sayAlong && scene.word) text += ` พูดตามครูนะ ${scene.word.th}`;
  text = arabicWords(text);
  if (LINES[scene.clip] && LINES[scene.clip] !== text) throw new Error(`Duplicate clip: ${scene.clip}`);
  LINES[scene.clip] = text;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const out = path.resolve(process.env.FAITH_VOICE_OUT ?? 'public/audio/th/faith');
  if (args.includes('--manifest')) {
    const entries = Object.entries(LINES).map(([clip, text]) => ({ clip, text, spoken: voiceText(text), file: path.join(out, `${clip}.mp3`) }));
    writeFileSync('output/faith-1/voice-manifest.json', JSON.stringify(entries, null, 2));
  } else if (args.includes('--list')) {
    let missing = 0;
    for (const [clip, text] of Object.entries(LINES)) {
      const file = path.join(out, `${clip}.mp3`);
      const present = existsSync(file) && statSync(file).size > 0;
      if (!present) missing++;
      console.log(`${present ? 'OK' : 'MISSING'} ${clip} ${voiceText(text)}`);
    }
    console.log(`${Object.keys(LINES).length} clips; ${missing} missing`);
    if (missing) process.exitCode = 1;
  } else {
    // renderRobotLines automatically removes the language lock for Arabic script.
    await renderRobotLines(LINES, out, args);
  }
}
