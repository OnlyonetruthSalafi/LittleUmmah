// ทางเลือกสำรอง — สร้างไฟล์ sound effect เองด้วยคณิตศาสตร์ ไม่ได้คัดลอกจากคลังของใคร
// จึงไม่ติดปัญหาลิขสิทธิ์ตาม AGENTS.md ข้อ 1.3
//
// ตอนนี้ไฟล์ที่ใช้จริงมาจาก scripts/prepare-sfx.mjs (คลังเสียงของเจ้าของโปรเจกต์)
// เก็บสคริปต์นี้ไว้เผื่อต้องกลับมาใช้เสียงที่ไม่มีข้อผูกมัดด้านลิขสิทธิ์
//
// เกณฑ์ "ไม่ใช่ดนตรี" (ข้อ 1.3): ทุกเสียงเป็น blip/click/สวีปความถี่ต่อเนื่อง
// ไม่มีโน้ตเป็นตัวๆ ไม่มีทำนอง ไม่มีคอร์ด ไม่มีจังหวะซ้ำ
//
// ใช้: node scripts/make-sfx.mjs   →  public/audio/sfx/*.wav
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio', 'sfx');

/** เขียน WAV mono 16-bit จาก Float32 ในช่วง -1..1 */
function writeWav(name, rate, samples) {
  const bytes = samples.length * 2;
  const buffer = Buffer.alloc(44 + bytes);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + bytes, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(rate, 24);
  buffer.writeUInt32LE(rate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(bytes, 40);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32000), 44 + i * 2);
  }
  const file = resolve(outDir, `${name}.wav`);
  writeFileSync(file, buffer);
  return { name, rate, seconds: +(samples.length / rate).toFixed(3), kb: +(buffer.length / 1024).toFixed(1) };
}

/** ซองเสียงแบบ attack/decay กันเสียงป๊อกตอนเริ่มและตอนจบ */
const envelope = (t, total, attack = 0.008) =>
  t < attack ? t / attack : Math.pow(1 - (t - attack) / (total - attack), 2.2);

/** เสียงกลิ้งต่อเนื่อง ไม่ใช่โน้ต — ความถี่ไล่จาก from ไป to ตลอดความยาว */
function sweep(rate, seconds, from, to, { curve = 1, gain = 0.55, noise = 0 } = {}) {
  const total = Math.floor(rate * seconds);
  const out = new Float32Array(total);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / rate;
    const progress = Math.pow(i / total, curve);
    const freq = from + (to - from) * progress;
    phase += (2 * Math.PI * freq) / rate;
    // คลื่นเกือบไซน์ เติมฮาร์โมนิกเบาๆ ให้ไม่แห้งเกินไป
    const tone = Math.sin(phase) * 0.85 + Math.sin(phase * 2) * 0.15;
    const hiss = noise ? (Math.random() * 2 - 1) * noise : 0;
    out[i] = (tone + hiss) * envelope(t, seconds) * gain;
  }
  return out;
}

/** เสียงเคาะสั้นๆ แบบของเล่นไม้ ใช้ตอนแตะการ์ด */
function knock(rate, seconds, freq) {
  const total = Math.floor(rate * seconds);
  const out = new Float32Array(total);
  let phase = 0;
  for (let i = 0; i < total; i++) {
    const t = i / rate;
    phase += (2 * Math.PI * freq * (1 - t / seconds * 0.35)) / rate;
    const body = Math.sin(phase);
    const click = (Math.random() * 2 - 1) * Math.exp(-t * 260);
    out[i] = (body * 0.6 + click * 0.5) * Math.pow(1 - t / seconds, 3) * 0.6;
  }
  return out;
}

/** ผสมหลายชั้นเข้าด้วยกัน โดยเลื่อนเวลาเริ่มได้ */
function mix(rate, seconds, layers) {
  const total = Math.floor(rate * seconds);
  const out = new Float32Array(total);
  for (const { at = 0, data, gain = 1 } of layers) {
    const offset = Math.floor(at * rate);
    for (let i = 0; i < data.length && offset + i < total; i++) out[offset + i] += data[i] * gain;
  }
  return out;
}

/** ประกายเบาๆ — noise ที่ถูกกรองให้อยู่ย่านสูง ไม่มีระดับเสียงชัด จึงไม่เป็นทำนอง */
function shimmer(rate, seconds, gain = 0.18) {
  const total = Math.floor(rate * seconds);
  const out = new Float32Array(total);
  let previous = 0;
  for (let i = 0; i < total; i++) {
    const t = i / rate;
    const raw = Math.random() * 2 - 1;
    const highpass = raw - previous; // กรองความถี่ต่ำออก เหลือเสียงซ่าเบาๆ
    previous = raw;
    out[i] = highpass * Math.pow(1 - t / seconds, 1.6) * gain;
  }
  return out;
}

mkdirSync(outDir, { recursive: true });

const report = [
  // แตะการ์ด — เคาะสั้นมาก
  writeWav('tap', 22050, knock(22050, 0.08, 620)),
  // ถูก — สวีปขึ้นต่อเนื่อง + ประกาย (ไม่ใช่สองโน้ต)
  writeWav('correct', 22050, mix(22050, 0.4, [
    { data: sweep(22050, 0.34, 520, 1180, { curve: 0.55, gain: 0.5 }) },
    { data: shimmer(22050, 0.4, 0.16), at: 0.06 },
  ])),
  // ผิด — สวีปลงนุ่มๆ ไม่ดุ ไม่ทำให้เด็กตกใจ
  writeWav('wrong', 22050, sweep(22050, 0.34, 400, 230, { curve: 1.4, gain: 0.42 })),
  // ผ่านด่าน — สวีปขึ้นยาวกว่า + ประกายหลายชั้น
  writeWav('level-complete', 16000, mix(16000, 0.6, [
    { data: sweep(16000, 0.55, 430, 1320, { curve: 0.42, gain: 0.45 }) },
    { data: shimmer(16000, 0.58, 0.2), at: 0.02 },
    { data: shimmer(16000, 0.34, 0.14), at: 0.24 },
  ])),
];

for (const row of report) console.log(`${row.name}.wav  ${row.seconds}s  ${row.rate}Hz  ${row.kb}KB`);
const oversized = report.filter(r => r.kb > 20);
if (oversized.length) {
  console.error(`เกิน 20KB: ${oversized.map(r => r.name).join(', ')}`);
  process.exit(1);
}
