/*
  เลือกและแปลง sound effect จากคลังเสียงของเจ้าของโปรเจกต์ (audio-src/sfx-library)
  ให้เป็นไฟล์พร้อมเสิร์ฟที่ public/audio/sfx/

  ต้นฉบับเป็น MS ADPCM 22050Hz ซึ่งเบราว์เซอร์บางตัวเล่นไม่ได้ จึงต้องถอดเป็น PCM ก่อน
  แล้วตัดความเงียบ ปรับความดังให้เท่ากัน ใส่ fade กันเสียงกึก และลด sample rate
  เท่าที่จำเป็นให้ไฟล์ไม่เกิน 20KB ตาม GAME_SYSTEM_PLAN.md §10.2

  รันซ้ำได้:  node scripts/prepare-sfx.mjs
*/
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { decodeWav, encodeWav } from './lib/wav.mjs';

const SRC = 'audio-src/sfx-library';
const OUT = 'public/audio/sfx';
const MAX_KB = 20;

/*
  เลือกจากโฟลเดอร์ POPS ทั้งหมด เพราะเป็นเสียงนุ่ม ไม่มีเสียงรุนแรง
  (โฟลเดอร์ IMPACTS มีเสียงตี ฟาด แส้ และปืน ซึ่งไม่เหมาะกับเด็กเล็ก)
  ทุกไฟล์เป็น sound effect ไม่ใช่ดนตรี ไม่มีทำนองหรือจังหวะ ตาม AGENTS.md ข้อ 1.3

  ค่าที่ใช้ตัดสินมาจากการวิเคราะห์คลื่นจริงทุกไฟล์ (ความยาว ความสว่าง ทิศทางระดับเสียง)
  ทางเลือกอื่นที่ใกล้เคียงใส่ไว้ใน alt เผื่อเจ้าของโปรเจกต์ฟังแล้วอยากสลับ
*/
const PICKS = [
  { out: 'tap', src: 'POPS/POP2.WAV', gain: 0.55,
    why: 'ป๊อกสั้น 64ms โทนอุ่น ไม่แหลม เหมาะกับการแตะพลิกการ์ดที่เกิดบ่อย',
    alt: 'POP3 (32ms คมกว่า), POP1 (95ms ทุ้มกว่า), QUIETPOP (29ms เบาสุด)' },
  { out: 'correct', src: 'POPS/POP9.WAV', gain: 0.8,
    why: 'ป๊อก 151ms ระดับเสียงไล่ขึ้น ให้ความรู้สึกว่าถูกต้อง',
    alt: 'QUICKPOP (42ms ขึ้นชันมาก), FASTPOP (109ms), LONGPOP (498ms ยาวกว่า)' },
  { out: 'wrong', src: 'POPS/THHHPOP.WAV', gain: 0.5,
    why: 'ป๊อกลมๆ 204ms ระดับเสียงไล่ลง นุ่ม ไม่ดุ ไม่ทำให้เด็กตกใจ',
    alt: 'HOLOWPOP (361ms กลวงกว่า), WHIFFPOP (224ms), DBLPOP (244ms ทุ้มลึก)' },
  { out: 'level-complete', src: 'POPS/3WATER.WAV', gain: 0.8,
    why: 'หยดน้ำสามครั้งไล่ขึ้น 700ms ให้ความรู้สึกฉลองโดยไม่ต้องใช้ดนตรี',
    alt: 'KNOCKDN0 (677ms), LONGPOP (498ms), UNDWATPP (550ms)' },
];

/** ตัดความเงียบหัวท้ายที่เบากว่า 2% ของจุดดังสุด */
function trimSilence(s) {
  let peak = 0;
  for (const v of s) peak = Math.max(peak, Math.abs(v));
  const th = peak * 0.02;
  let a = 0, b = s.length - 1;
  while (a < b && Math.abs(s[a]) < th) a++;
  while (b > a && Math.abs(s[b]) < th) b--;
  return s.subarray(a, b + 1);
}

/** ลด sample rate พร้อมเฉลี่ยตัวอย่างที่ถูกยุบ กัน aliasing แบบง่ายๆ */
function resample(s, from, to) {
  if (to >= from) return s;
  const ratio = from / to;
  const out = new Float32Array(Math.floor(s.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const start = Math.floor(i * ratio), end = Math.min(s.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += s[j];
    out[i] = sum / Math.max(1, end - start);
  }
  return out;
}

/** ปรับจุดดังสุดให้เท่ากับ gain แล้วใส่ fade สั้นๆ หัวท้าย กันเสียง "กึก" ตอนเริ่มและจบ */
function shape(s, rate, gain) {
  let peak = 0;
  for (const v of s) peak = Math.max(peak, Math.abs(v));
  const scale = peak > 0 ? gain / peak : 1;
  const fadeIn = Math.min(Math.floor(rate * 0.002), s.length >> 2);
  const fadeOut = Math.min(Math.floor(rate * 0.012), s.length >> 2);
  const out = new Float32Array(s.length);
  for (let i = 0; i < s.length; i++) {
    let env = 1;
    if (i < fadeIn) env = i / fadeIn;
    const tail = s.length - 1 - i;
    if (tail < fadeOut) env = Math.min(env, tail / fadeOut);
    out[i] = s[i] * scale * env;
  }
  return out;
}

const LADDER = [22050, 16000, 12000, 11025, 8000];

console.log('cue             ต้นฉบับ            ความยาว  rate    ขนาด');
for (const pick of PICKS) {
  const decoded = decodeWav(readFileSync(`${SRC}/${pick.src}`));
  if (!decoded) throw new Error(`อ่าน ${pick.src} ไม่ได้`);
  const clip = trimSilence(decoded.samples);
  const ms = clip.length / decoded.rate * 1000;

  // เลือก sample rate สูงสุดเท่าที่ยังทำให้ไฟล์ไม่เกิน 20KB
  let chosen = LADDER[LADDER.length - 1];
  for (const rate of LADDER) {
    if (44 + Math.floor(clip.length / decoded.rate * rate) * 2 <= MAX_KB * 1024) { chosen = rate; break; }
  }
  const resampled = resample(clip, decoded.rate, chosen);
  const buffer = encodeWav(shape(resampled, chosen, pick.gain), chosen);
  const file = `${OUT}/${pick.out}.wav`;
  writeFileSync(file, buffer);
  const kb = statSync(file).size / 1024;
  if (kb > MAX_KB) throw new Error(`${pick.out} ใหญ่เกิน ${MAX_KB}KB (${kb.toFixed(1)}KB)`);
  console.log(`${pick.out.padEnd(15)} ${pick.src.padEnd(18)} ${ms.toFixed(0).padStart(5)}ms ${String(chosen).padStart(6)} ${kb.toFixed(1).padStart(6)}KB`);
  console.log(`   เหตุผล: ${pick.why}`);
  console.log(`   สลับได้: ${pick.alt}\n`);
}
console.log('เจ้าของโปรเจกต์ต้องฟังและอนุมัติทุกไฟล์ก่อน commit (AGENTS.md ข้อ 1.3)');
