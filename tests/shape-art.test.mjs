import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { measureShapeHoles } from '../scripts/shape-art-masks.mjs';
import { HOLES, PLATE, shapeOrder } from '../src/features/games/data/shapeArt.ts';
import { nearestDropTarget } from '../src/features/games/engine/rules.ts';

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

/* กรอบสี่เหลี่ยมของหลุมคาบเกี่ยวกัน (หลุมดาวกินเข้าไปในวงกลมกับสี่เหลี่ยมจัตุรัส)
   ถ้าเลือกปลายทางด้วย "ชั้นบนสุดใน DOM" เด็กที่หยอดลงขอบล่างขวาของวงกลมจะถูกนับเป็นช่องดาว = ตอบผิดทั้งที่ทำถูก
   ตรวจกับพิกเซลที่วาดจริงจาก mask คิ้วทอง ไม่ใช่กรอบสี่เหลี่ยม */
test('เนื้อในของหลุมที่วาดจริงต้องตกกับหลุมของตัวเองเสมอ ไม่ไหลไปหลุมข้างเคียงที่กรอบทับกัน', async () => {
  const sockets = await measureShapeHoles('public/games/shape/plate-00000.webp');
  const { width: w, height: h } = (await sharp('public/games/shape/plate-00000.webp').metadata());
  assert.equal(w, PLATE.width);
  assert.equal(h, PLATE.height);

  // กรอบของแต่ละหลุมเป็นพิกเซล ตรงกับที่ ShapeBoard วาง (translate -50% -50%)
  const boxes = shapeOrder.map(shape => {
    const hole = HOLES[shape];
    const cx = hole.x / 100 * w, cy = hole.y / 100 * h, halfW = hole.w / 100 * w / 2, halfH = hole.h / 100 * h / 2;
    return { shape, cx, cy, rx: halfW, ry: halfH, left: cx - halfW, right: cx + halfW, top: cy - halfH, bottom: cy + halfH };
  });

  /* .shp-hole มี border-radius 26% เบราว์เซอร์จึงไม่ยิง hit-test ให้มุมที่ถูกตัดทิ้ง ต้องคิดตามนั้น */
  const contains = (box, x, y) => {
    if (x < box.left || x > box.right || y < box.top || y > box.bottom) return false;
    const rx = box.rx * 2 * 0.26, ry = box.ry * 2 * 0.26;
    const dx = Math.abs(x - box.cx) - (box.rx - rx), dy = Math.abs(y - box.cy) - (box.ry - ry);
    return dx <= 0 || dy <= 0 || (dx / rx) ** 2 + (dy / ry) ** 2 <= 1;
  };

  for (const shape of shapeOrder) {
    const mask = await sharp(sockets[shape].mask).raw().toBuffer();
    const self = boxes.find(box => box.shape === shape);
    let checked = 0, wrong = 0, deepWrong = 0, worst = null;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
      if (!mask[(y * w + x) * 4 + 3]) continue;
      checked++;
      const picked = nearestDropTarget(x, y, boxes.filter(box => contains(box, x, y)));
      if (!picked || picked.shape === shape) continue;
      wrong++;
      // ลึกเท่าไรเมื่อเทียบกับหลุมของตัวเอง 0 = กลางหลุมพอดี 1 = ริมสุด
      const depth = Math.hypot((x - self.cx) / self.rx, (y - self.cy) / self.ry);
      worst ??= `(${x},${y}) ลึก ${depth.toFixed(3)} ไปเข้า ${picked.shape}`;
      if (depth < 0.95) deepWrong++;
    }
    assert.ok(checked > 500, `${shape}: mask เล็กผิดปกติ (${checked} จุด)`);
    /* เนื้อในของหลุม (ลึกกว่าริม 5%) คือทั้งหมดที่เด็กเล็ง ตรงนี้ต้องไม่หลุดไปหลุมอื่นเลย */
    assert.equal(deepWrong, 0, `${shape}: ${deepWrong} จุดในเนื้อหลุมตกไปหลุมอื่น เช่น ${worst}`);
    /* ที่ปลายแหลมริมสุดยังเหลือเสี้ยวเล็กๆ ที่กรอบเพื่อนบ้านชนะ (สี่เหลี่ยมจัตุรัสราว 0.25% = แถบกว้าง ~5px บนมือถือ)
       ยอมได้เพราะกรอบหลุมตั้งใจให้ใหญ่กว่ารูปที่วาดไว้เพื่อให้นิ้วเด็กกดง่าย ถ้าหนีบให้พอดีรูปจะกดยากทั้งกระดาน
       แต่ห้ามโตกว่านี้ ถ้าเทสต์นี้แดงแปลว่าภาพหรือค่า HOLES ชุดใหม่ทำให้หลุมทับกันมากขึ้น */
    assert.ok(wrong / checked < 0.01, `${shape}: ${wrong}/${checked} จุดตกไปหลุมอื่น (เกิน 1%) เช่น ${worst}`);
  }
});
