import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { measureShapeHoles } from '../scripts/shape-art-masks.mjs';

/* ภาพถาด 32 สถานะเข้ารหัสแบบ lossy จึงเทียบทีละพิกเซลไม่ได้
   ตรวจแทนว่าในแต่ละหลุม สีเฉลี่ยใกล้ "ถาดครบ" เมื่อหยอดแล้ว และใกล้ "ถาดเปล่า" เมื่อยังไม่หยอด
   และพื้นที่นอกหลุมทั้งหมดยังเหมือนถาดเปล่า (ต่างกันแค่ระดับ noise ของการบีบอัด) */
test('32 shape plates accumulate exactly the requested sockets', async () => {
  const path = mask => `public/games/shape/plate-${mask}.webp`;
  const read = async mask => sharp(path(mask)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const base = await read('00000');
  assert.equal(base.info.width, 900);
  const sockets = await measureShapeHoles(path('00000'));
  const order = ['circle', 'square', 'triangle', 'rectangle', 'star'];
  const full = (await read('11111')).data;
  const masks = await Promise.all(order.map(s => sharp(sockets[s].mask).raw().toBuffer()));
  const mean = (px, m) => {
    const sum = [0, 0, 0]; let n = 0;
    for (let p = 0; p < px.length; p += 4) if (m[p + 3]) { sum[0] += px[p]; sum[1] += px[p + 1]; sum[2] += px[p + 2]; n++; }
    return sum.map(v => v / n);
  };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  for (let bits = 0; bits < 32; bits++) {
    const mask = bits.toString(2).padStart(5, '0');
    const { data } = await read(mask);
    order.forEach((shape, i) => {
      const got = mean(data, masks[i]), empty = mean(base.data, masks[i]), filled = mean(full, masks[i]);
      const want = mask[i] === '1' ? filled : empty, other = mask[i] === '1' ? empty : filled;
      assert.ok(dist(got, want) < dist(got, other), `${mask}: ${shape} ต้อง${mask[i] === '1' ? 'หยอดแล้ว' : 'ยังว่าง'}`);
    });
    let diff = 0, n = 0;
    for (let p = 0; p < data.length; p += 4) {
      if (masks.some(m => m[p + 3]) || !base.data[p + 3]) continue;
      diff += Math.abs(data[p] - base.data[p]) + Math.abs(data[p + 1] - base.data[p + 1]) + Math.abs(data[p + 2] - base.data[p + 2]); n++;
    }
    assert.ok(diff / n / 3 < 4, `${mask}: พื้นที่นอกหลุมต้องเหมือนถาดเปล่า (ต่างเฉลี่ย ${(diff / n / 3).toFixed(2)})`);
  }
});
