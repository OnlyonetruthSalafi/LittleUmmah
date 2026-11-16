import { existsSync, writeFileSync, readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import {filmRoot,loadFilm} from './lib/common.mjs';
const root=filmRoot(), {story:{lines}}=await loadFilm(root);
if(!process.argv.includes('--generate'))throw Error('Offline default: copied voice only. Generation requires --generate and owner authorization.');
const {renderRobotLines}=await import('../lib/robot-voice.mjs');
const {FRIENDS}=await import('../../src/lib/friends.ts');

const ff = process.env.FFMPEG ?? 'ffmpeg';
process.env.FFMPEG = ff;
mkdirSync(`${root}/voice`, { recursive: true });
const only = process.argv.slice(3).filter(x=>x!=='--generate');
const run = (args) => execFileSync(ff, ['-y', '-v', 'error', ...args]);

for (const [key, [who, text, opt = {}]] of Object.entries(lines)) {
  if (only.length && !only.includes(key)) continue;
  const out = `${root}/voice/${key}.mp3`, hashFile = out + '.sha256';
  const hash = createHash('sha256').update(JSON.stringify([who, text, opt])).digest('hex');
  if (!only.length && existsSync(out) && existsSync(hashFile) && readFileSync(hashFile, 'utf8') === hash) continue;
  if (opt.reuse) {
    run(['-i', opt.reuse, '-ac', '1', '-ar', '44100', '-b:a', '64k', out]);
  } else if (opt.group) {
    // ตอบสลามพร้อมกัน: ผสมคลิปเดิมของแต่ละตัว เหลื่อมกันเล็กน้อยให้ฟังเป็นหลายเสียง
    const delays = [0, 90, 170];
    run([...opt.group.flatMap((f) => ['-i', f]), '-filter_complex',
      opt.group.map((_, i) => `[${i}:a]adelay=${delays[i]}:all=1[a${i}]`).join(';') + ';' + opt.group.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${opt.group.length}:normalize=0,volume=0.8[o]`,
      '-map', '[o]', '-ac', '1', '-ar', '44100', '-b:a', '64k', out]);
  } else {
    // "ท่านนบี ﷺ" ใช้เสียงมาตรฐาน scripts/voice-assets/nabi-salawat.wav ต่อหน้าท่อนที่เหลือ (เจ้าของสั่ง 10 พ.ย. 2026)
    const spoken = opt.nabi ? text.replace('ท่านนบี ﷺ ', '') : text;
    if (opt.nabi && spoken === text) throw new Error(`${key}: ไม่พบ "ท่านนบี ﷺ " ต้นบรรทัด`);
    if (existsSync(out)) { mkdirSync(`${root}/voice-old`, { recursive: true }); copyFileSync(out, `${root}/voice-old/${key}-${Date.now()}.mp3`); }
    await renderRobotLines({ [key]: spoken }, path.resolve(`${root}/voice`), [key], who === 'nuri' ? {} : { voiceId: FRIENDS[who].voiceId, pitch: FRIENDS[who].pitch });
    if (opt.nabi) {
      const tmp = `${root}/voice/${key}-tail.mp3`;
      copyFileSync(out, tmp);
      run(['-i', 'scripts/voice-assets/nabi-salawat.wav', '-i', tmp, '-filter_complex',
        '[0:a]aresample=44100,aformat=channel_layouts=mono[a];[1:a]aresample=44100,aformat=channel_layouts=mono[b];[a][b]concat=n=2:v=0:a=1[o]',
        '-map', '[o]', '-b:a', '64k', out]);
    }
  }
  writeFileSync(hashFile, hash);
  console.log('ok', key);
}
