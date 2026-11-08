import { renderRobotLines } from './lib/robot-voice.mjs';
import { coinNumbers, coinText } from '../src/features/games/data/coinBox.ts';
export const lines = {
  'name-coin-box': 'กล่องเหรียญนับจำนวน',
  'game-coin-box': 'หยอดเหรียญ แล้วนับไปด้วยกัน',
  'howto-coin-box': 'มานับเหรียญกับครูนะ ลากเหรียญทีละเหรียญ ไปที่ช่องบนกล่อง หรือแตะเหรียญ แล้วแตะช่องหยอด ครบจำนวนแล้ว ไปต่อได้เลยนะ',
  'coin-praise': coinText.praise.th,
  'coin-retry': coinText.retry.th,
  ...Object.fromEntries(coinNumbers.map((n,i) => [`coin-count-${i+1}`, n.th])),
  ...Object.fromEntries(coinNumbers.map((n,i) => [`coin-target-${i+1}`, `ใส่เหรียญ ${n.th} เหรียญนะ`])),
};
await renderRobotLines(lines, 'public/audio/th', process.argv.slice(2));
