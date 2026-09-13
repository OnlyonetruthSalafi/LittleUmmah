/*
  อ่าน/เขียนไฟล์ WAV โดยไม่ต้องพึ่ง ffmpeg

  ไฟล์เสียงในคลังของเจ้าของโปรเจกต์ส่วนใหญ่เป็น MS ADPCM (format 2) ซึ่งบีบอัดไว้
  ตัวเล่นในเบราว์เซอร์บางตัวอ่านไม่ได้ และเราต้องวิเคราะห์คลื่นเสียงเพื่อเลือกไฟล์
  จึงต้องถอดรหัสเป็น PCM ก่อน
*/

const ADAPT = [230, 230, 230, 230, 307, 409, 512, 614, 768, 614, 512, 409, 307, 230, 230, 230];
const clamp16 = v => (v > 32767 ? 32767 : v < -32768 ? -32768 : v);

/** แยก chunk ของ RIFF ออกมาเป็นรายการ */
function chunks(buf) {
  const found = {};
  let pos = 12;
  while (pos + 8 <= buf.length) {
    const id = buf.toString('ascii', pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    found[id] = { offset: pos + 8, size: Math.min(size, buf.length - pos - 8) };
    pos += 8 + size + (size % 2);
  }
  return found;
}

/** คืน { rate, channels, samples: Float32Array (-1..1, ผสมเป็นโมโนแล้ว) } หรือ null ถ้าอ่านไม่ได้ */
export function decodeWav(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') return null;
  const c = chunks(buf);
  if (!c['fmt '] || !c.data) return null;
  const f = c['fmt '].offset;
  const format = buf.readUInt16LE(f);
  const channels = buf.readUInt16LE(f + 2);
  const rate = buf.readUInt32LE(f + 4);
  const blockAlign = buf.readUInt16LE(f + 12);
  const bits = buf.readUInt16LE(f + 14);
  const d = c.data.offset, dLen = c.data.size;

  if (format === 1) {
    const bytes = bits / 8;
    const frames = Math.floor(dLen / (bytes * channels));
    const out = new Float32Array(frames);
    for (let i = 0; i < frames; i++) {
      let sum = 0;
      for (let ch = 0; ch < channels; ch++) {
        const o = d + (i * channels + ch) * bytes;
        if (bits === 8) sum += (buf[o] - 128) / 128;
        else if (bits === 16) sum += buf.readInt16LE(o) / 32768;
        else if (bits === 24) sum += ((buf[o] | (buf[o + 1] << 8) | (buf.readInt8(o + 2) << 16))) / 8388608;
        else if (bits === 32) sum += buf.readInt32LE(o) / 2147483648;
      }
      out[i] = sum / channels;
    }
    return { rate, channels, samples: out };
  }

  if (format === 2) {
    // ตารางสัมประสิทธิ์อยู่ท้าย fmt chunk ไฟล์กำหนดเองได้ จึงต้องอ่านจากไฟล์ ไม่ใช่ใช้ค่าตั้งต้น
    const samplesPerBlock = buf.readUInt16LE(f + 18);
    const numCoef = buf.readUInt16LE(f + 20);
    const coef = [];
    for (let i = 0; i < numCoef; i++) coef.push([buf.readInt16LE(f + 22 + i * 4), buf.readInt16LE(f + 24 + i * 4)]);

    const blocks = Math.floor(dLen / blockAlign);
    const out = new Float32Array(blocks * samplesPerBlock);
    let w = 0;
    for (let b = 0; b < blocks; b++) {
      let p = d + b * blockAlign;
      const state = [];
      for (let ch = 0; ch < channels; ch++) state.push({ pred: Math.min(buf[p++], numCoef - 1) });
      for (let ch = 0; ch < channels; ch++) { state[ch].delta = buf.readInt16LE(p); p += 2; }
      for (let ch = 0; ch < channels; ch++) { state[ch].s1 = buf.readInt16LE(p); p += 2; }
      for (let ch = 0; ch < channels; ch++) { state[ch].s2 = buf.readInt16LE(p); p += 2; }
      // สองตัวอย่างแรกของบล็อกอยู่ในหัวบล็อกแล้ว
      if (channels === 1) { out[w++] = state[0].s2 / 32768; out[w++] = state[0].s1 / 32768; }
      else {
        out[w++] = (state[0].s2 + state[1].s2) / 2 / 32768;
        out[w++] = (state[0].s1 + state[1].s1) / 2 / 32768;
      }
      const step = (st, nibble) => {
        const [c1, c2] = coef[st.pred];
        const signed = nibble > 7 ? nibble - 16 : nibble;
        let value = ((st.s1 * c1 + st.s2 * c2) >> 8) + signed * st.delta;
        value = clamp16(value);
        st.s2 = st.s1; st.s1 = value;
        st.delta = Math.max(16, (ADAPT[nibble] * st.delta) >> 8);
        return value / 32768;
      };
      const remaining = samplesPerBlock - 2;
      for (let i = 0; i < remaining && p < d + dLen; i++) {
        const byte = buf[p];
        if (i % 2 === 0) {
          if (channels === 1) { out[w++] = step(state[0], byte >> 4); if (i + 1 < remaining) out[w++] = step(state[0], byte & 15); i++; p++; }
          else { const a = step(state[0], byte >> 4), bb = step(state[1], byte & 15); out[w++] = (a + bb) / 2; p++; }
        }
      }
    }
    return { rate, channels, samples: out.subarray(0, w) };
  }

  return null; // รูปแบบอื่น (เช่น mp3 ในกล่อง wav) ไม่รองรับ
}

/** เขียน PCM 16-bit โมโน */
export function encodeWav(samples, rate) {
  const bytes = samples.length * 2;
  const buf = Buffer.alloc(44 + bytes);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + bytes, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(bytes, 40);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  return buf;
}
