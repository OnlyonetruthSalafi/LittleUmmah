import { renderRobotLines } from './lib/robot-voice.mjs';
import { balanceVoice } from '../src/features/games/data/balanceScale.ts';
await renderRobotLines(Object.fromEntries(Object.entries(balanceVoice).map(([key, value]) => [key, value.th])), 'public/audio/th', process.argv.slice(2));
