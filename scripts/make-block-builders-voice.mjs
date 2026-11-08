import { renderRobotLines } from './lib/robot-voice.mjs';
import { buildVoice } from '../src/features/games/data/blockBuilders.ts';
await renderRobotLines(Object.fromEntries(Object.entries(buildVoice).map(([key,value])=>[key,value.th])), 'public/audio/th', process.argv.slice(2));
