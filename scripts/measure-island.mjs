/* วัด "ผิวเล่น" ของภาพเกาะ — พื้นที่สี่เหลี่ยมที่ใหญ่ที่สุดซึ่งเป็นผิวครีมโล่ง ไม่มีของประดับทับ
 *
 *   node scripts/measure-island.mjs public/games/shapegame/island-shape.png
 *
 * ใช้ตรวจรับภาพเกาะจาก Codex ใช้หาค่า --surface-l/r/t/b ที่จะใส่ใน CSS ของเกมนั้น
 *
 * เกณฑ์ "ผิวครีม" = ทึบแสง + สว่าง + สีจาง (ของประดับอย่างโดม ต้นไม้ คริสตัล จะตกเกณฑ์ความอิ่มสี)
 */
import sharp from 'sharp';

const file = process.argv[2];
if (!file) { console.error('ใช้: node scripts/measure-island.mjs <ไฟล์ภาพ>'); process.exit(1); }

const MIN_ALPHA = 200, MIN_LIGHT = 0.70, MAX_SAT = 0.28;

const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

const surface = new Uint8Array(W * H);
for (let i = 0, p = 0; i < W * H; i++, p += C) {
  const r = data[p] / 255, g = data[p + 1] / 255, b = data[p + 2] / 255, a = data[p + 3];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  surface[i] = a >= MIN_ALPHA && max >= MIN_LIGHT && sat <= MAX_SAT ? 1 : 0;
}

/* สี่เหลี่ยมที่ใหญ่ที่สุดในตารางบิต — สะสมความสูงทีละแถว แล้วหา largest rectangle in histogram */
const heights = new Int32Array(W);
let best = { area: 0, x0: 0, y0: 0, x1: 0, y1: 0 };
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) heights[x] = surface[y * W + x] ? heights[x] + 1 : 0;
  const stack = [];
  for (let x = 0; x <= W; x++) {
    const h = x === W ? 0 : heights[x];
    let start = x;
    while (stack.length && stack[stack.length - 1].h >= h) {
      const top = stack.pop();
      const area = top.h * (x - top.x);
      if (area > best.area) best = { area, x0: top.x, x1: x - 1, y0: y - top.h + 1, y1: y };
      start = top.x;
    }
    stack.push({ x: start, h });
  }
}

const pct = (n, total) => (n / total * 100).toFixed(1);
const w = best.x1 - best.x0 + 1, h = best.y1 - best.y0 + 1;
console.log(`ภาพ: ${file}  ${W} x ${H}`);
console.log(`ผิวเล่นที่ใหญ่ที่สุด: ${w} x ${h} px  =  ${pct(w, W)}% x ${pct(h, H)}% ของภาพ`);
console.log(`กรอบ: x ${best.x0}–${best.x1}  y ${best.y0}–${best.y1}`);
console.log('\nค่าที่เอาไปใส่ CSS ได้เลย:');
console.log(`  --surface-l: ${pct(best.x0, W)}%; --surface-r: ${pct(W - 1 - best.x1, W)}%;`);
console.log(`  --surface-t: ${pct(best.y0, H)}%; --surface-b: ${pct(H - 1 - best.y1, H)}%;`);

console.log(`
เอาไปใส่ --surface-* ของเกมนั้นได้เลย ถ้าอยากเผื่อให้ของล้นมุมนิดหน่อยก็ลดค่าลงได้
   ตัวคำนวณ min() ใน CSS การันตีว่าชิ้นส่วนจะไม่ล้นกรอบที่ประกาศไว้อยู่แล้ว`);
