import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { filmRoot, loadFilm, kitRoot } from './lib/common.mjs';
import path from 'node:path';
const root=filmRoot(), {config,story}=await loadFilm(root);
const {id,title,cast,turnAfter}=config; const {lines,scenes,names}=story; const ff=process.env.FFMPEG??'ffmpeg';
mkdirSync(`${root}/assets/kits`, { recursive: true }); mkdirSync(`${root}/qa`, { recursive: true });
const background=config.background??'park.jpg';
const backgroundFile=existsSync(path.resolve(root,background))?path.resolve(root,background):path.resolve(kitRoot,'assets/backgrounds',background);
cpSync(backgroundFile, `${root}/assets/park.jpg`);
cpSync(`${kitRoot}/assets/sfx`, `${root}/sfx`, {recursive:true});
const kits = {};
for (const [who, views] of Object.entries(cast)) {
  kits[who] = {};
  for (const view of views) {
    const src=`${kitRoot}/assets/kits/${who}-${view}`;
    if (!existsSync(`${src}/rig.json`)) { throw Error(`Missing kit ${who}/${view}: ${src}`); }
    cpSync(src, `${root}/assets/kits/${who}-${view}`, { recursive: true });
    kits[who][view] = JSON.parse(readFileSync(`${src}/rig.json`, 'utf8'));
  }
}
const props = {};
if (existsSync(`${root}/props`)) {
  cpSync(`${root}/props`, `${root}/assets/props`, { recursive: true });
  for (const f of readdirSync(`${root}/props`)) if (/\.(png|webp)$/.test(f)) props[f.replace(/\.(png|webp)$/, '')] = `assets/props/${f}`;
}
const durations = {}, envelopes = {};
for (const key of Object.keys(lines)) {
  const file = `${root}/voice/${key}.mp3`;
  const b = execFileSync(ff, ['-v', 'error', '-i', file, '-ac', '1', '-ar', '12000', '-f', 'f32le', '-'], { maxBuffer: 64e6 });
  const samples = new Float32Array(b.buffer, b.byteOffset, b.length / 4), levels = [];
  durations[key] = samples.length / 12000;
  for (let i = 0; i < samples.length; i += 500) { let sum = 0; for (let j = i; j < Math.min(i + 500, samples.length); j++) sum += samples[j] ** 2; levels.push(Math.sqrt(sum / 500)); }
  const peak = Math.max(...levels)||1; envelopes[key] = levels.map((x) => Math.round((x / peak) * 1000) / 1000);
}
const shots = [], audio = []; let cursor = 0;
for (const scene of scenes) {
  const start = cursor; let at = cursor + scene.lead;
  for (const [key, gap] of scene.items) { at += gap; audio.push({ key, who: lines[key][0], text: lines[key][1], start: +at.toFixed(3), duration: +durations[key].toFixed(3), scene: scene.id }); at += durations[key]; }
  cursor = at + scene.tail; shots.push({ id: scene.id, start: +start.toFixed(3), duration: +(cursor - start).toFixed(3) });
}
const timing = { id, title, shots, audio, total: +cursor.toFixed(3) };
writeFileSync(`${root}/timing.json`, JSON.stringify(timing, null, 2));
writeFileSync(`${root}/data.js`, `const FILM_DATA=${JSON.stringify({ timing, kits, envelopes, names, props })};`);
const a = audio.find((x) => x.key === turnAfter), next = audio[audio.indexOf(a) + 1];
writeFileSync(`${root}/turns.json`, JSON.stringify(a && next ? [{ at: +(a.start + a.duration + 0.25).toFixed(3), resumeAt: +(next.start - 0.15).toFixed(3), kind: 'word' }] : [], null, 2));
const stamp = (t) => { const ms = Math.round(t * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`; };
// รูปแบบเดียวกับเครื่องเล่น FilmLesson: <v ชื่อผู้พูด>ข้อความ
writeFileSync(`${root}/${id}.th.vtt`, 'WEBVTT\n\n' + audio.map((x) => `${stamp(x.start)} --> ${stamp(x.start + x.duration)}\n<v ${names[x.who]}>${x.text}`).join('\n\n') + '\n');
console.log(`${audio.length} lines, total ${timing.total.toFixed(1)}s`, shots.map((s) => `${s.id}@${s.start.toFixed(1)}`).join(' '));

for(const file of ["engine.js","cast-base.js","characters.js","stage.html"]) cpSync(`${kitRoot}/${file}`,`${root}/${file}`);

if(!existsSync(`${root}/film.checks.js`))writeFileSync(`${root}/film.checks.js`, "// Optional story-specific motion gates.\n");
