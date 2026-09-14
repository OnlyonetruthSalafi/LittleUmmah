/* วัดช่องวางหนังสือของภาพตู้ (ผนังในสีเขียวน้ำทะเล) และป้ายครีมด้านบน คืนค่าเป็น % ของภาพ
 *   node scripts/measure-shelf.mjs public/stories/shelf/shelf-wide.png
 * ใช้ตอนเปลี่ยนภาพตู้ แล้วเอาค่าไปใส่ SHELVES ใน src/features/stories/shelf.ts
 */
import sharp from 'sharp';
const file = process.argv[2];
const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => { const p = (y * W + x) * 4; return [data[p], data[p + 1], data[p + 2], data[p + 3]]; };
// ผนังในตู้: ทึบ, ฟ้าอมเขียว (g,b สูงกว่า r ชัดเจน)
const teal = ([r, g, b, a]) => a > 200 && g > r + 25 && b > r + 25;
// ป้าย: ทึบ สว่าง สีจาง
const cream = ([r, g, b, a]) => a > 200 && Math.min(r, g, b) > 200 && Math.max(r, g, b) - Math.min(r, g, b) < 45;
const pct = (n, t) => +(n / t * 100).toFixed(1);

// แถวที่เป็นผนังในตู้ = แถวที่มีพิกเซลเขียวน้ำทะเลเกิน 40% ของความกว้าง
const rows = [];
for (let y = 0; y < H; y++) {
  let n = 0; for (let x = 0; x < W; x++) if (teal(px(x, y))) n++;
  rows.push(n / W > 0.4);
}
const bands = [];
for (let y = 0; y < H; y++) {
  if (rows[y] && (y === 0 || !rows[y - 1])) bands.push({ y0: y });
  if (rows[y] && (y === H - 1 || !rows[y + 1])) bands.at(-1).y1 = y;
}
const shelves = bands.filter((b) => b.y1 - b.y0 > H * 0.05).map((b) => {
  const mid = Math.round((b.y0 + b.y1) / 2);
  let x0 = W, x1 = 0;
  for (let x = 0; x < W; x++) if (teal(px(x, mid))) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  // ผิวบนของไม้ชั้น: ไล่ลงจากขอบล่างผนังจนเจอขอบหน้าไม้ (สว่างขึ้นแล้วมืดลงอีกครั้ง) — ใช้ครึ่งทางของแผ่นไม้ส่วนบน
  let y = b.y1 + 1; const cx = Math.round((x0 + x1) / 2);
  const lum = (yy) => { const [r, g, bb] = px(cx, yy); return r + g + bb; };
  let yFace = y; let best = 0;
  for (let yy = y; yy < Math.min(H, y + H * 0.08); yy++) { const d = lum(yy) - lum(Math.min(H - 1, yy + 2)); if (d > best) { best = d; yFace = yy; } }
  return { left: pct(x0, W), right: pct(W - 1 - x1, W), top: pct(b.y0, H), wallBottom: pct(b.y1, H), plankEdge: pct(yFace, H) };
});
let pb = { x0: W, x1: 0, y0: H, y1: 0 };
for (let y = 0; y < H * 0.3; y++) for (let x = 0; x < W; x++) if (cream(px(x, y))) { pb.x0 = Math.min(pb.x0, x); pb.x1 = Math.max(pb.x1, x); pb.y0 = Math.min(pb.y0, y); pb.y1 = Math.max(pb.y1, y); }
console.log(JSON.stringify({ file, W, H, shelves, plaque: { left: pct(pb.x0, W), right: pct(W - 1 - pb.x1, W), top: pct(pb.y0, H), bottom: pct(H - 1 - pb.y1, H) } }, null, 1));
