/* ภาพประกอบเกมจิ๊กซอว์แบบ 2.5D — ภาพจาก Codex ตาม CODEX_PUZZLE_BRIEF.md
 * ภาพตัวอย่างคือ public/games/hub/puzzle.png (ถาดจิ๊กซอว์ขอบทองบนเกาะ มองเฉียงจากมุม)
 *
 * ภาพเกาะมีถาดเปล่า ภาพบนจิ๊กซอว์เป็นภาพจัตุรัสแยกไฟล์ต่อด่าน
 * โค้ดตัดภาพเป็นชิ้นจิ๊กซอว์ (SVG) บนระนาบกระดาน 1000×1000 หน่วย
 * แล้ว map ระนาบนั้นลงพื้นถาดด้วย homography (CSS matrix3d) จากมุมทั้งสี่ที่วัดจากภาพ
 * มุมถาดวัดด้วย scripts/measure-puzzle-art.mjs → output/puzzle-art/measurements.json ห้ามกะด้วยตา
 */
export const PUZZLE_ISLAND = { src: '/games/puzzle/island.webp', width: 1100, height: 1100 };
/* ภาพบนจิ๊กซอว์ของแต่ละด่านอยู่ใน data/presentation.ts (levelArt) — จัตุรัสทุกภาพ ด่าน 2 ตัดเป็นช่องผืนผ้า 3×2 */
/** ขนาดระนาบกระดาน (หน่วย SVG) */
export const BOARD = 1000;

export type Point = { x: number; y: number };
/** มุมพื้นถาดเป็นสัดส่วนของภาพเกาะ (0–1) เรียงตามมุมของ "ภาพ": ซ้ายบน ขวาบน ขวาล่าง ซ้ายล่าง */
export type Quad = { tl: Point; tr: Point; br: Point; bl: Point };

/* ค่าจาก output/puzzle-art/measurements.json (island.trayFloor)
   ถาดเป็นทรงข้าวหลามตัด ด้านบนของภาพอยู่ที่ขอบถาดด้านหลังซ้าย (มุมซ้าย → มุมบน) */
export const TRAY: Quad = {
  tl: { x: 0.1935354, y: 0.4284529 }, // left
  tr: { x: 0.4930532, y: 0.2693747 }, // top
  br: { x: 0.8376722, y: 0.4336309 }, // right
  bl: { x: 0.5436887, y: 0.6415488 }, // bottom
};

/** H (3×3 แถวต่อแถว) ที่ส่ง (u,v) ∈ [0,1]² ไปยังจุดบนภาพเกาะ (สัดส่วน) */
export function homography(q: Quad): number[] {
  const { tl: p0, tr: p1, br: p2, bl: p3 } = q;
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x, dy1 = p1.y - p2.y, dy2 = p3.y - p2.y;
  const sx = p0.x - p1.x + p2.x - p3.x, sy = p0.y - p1.y + p2.y - p3.y;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den;
  return [p1.x - p0.x + g * p1.x, p3.x - p0.x + h * p3.x, p0.x, p1.y - p0.y + g * p1.y, p3.y - p0.y + h * p3.y, p0.y, g, h, 1];
}

export function project(H: number[], u: number, v: number): Point {
  const w = H[6] * u + H[7] * v + H[8];
  return { x: (H[0] * u + H[1] * v + H[2]) / w, y: (H[3] * u + H[4] * v + H[5]) / w };
}

/** CSS matrix3d ของชั้นกระดานขนาด side×side px ที่ transform-origin 0 0 ภายในกล่องเกาะกว้าง width px
 *  พิกัดในชั้น (px) → (u,v) = px/side → ภาพเกาะ (สัดส่วน) × width */
export function trayMatrix(H: number[], side: number, width: number): string {
  const [a, b, c, d, e, f, g, h] = H;
  const k = width / side;
  // คอลัมน์ของ matrix3d (column-major): x' = (a k x + b k y + c W) / (g x/side + h y/side + 1)
  const m = [a * k, d * k, 0, g / side, b * k, e * k, 0, h / side, 0, 0, 1, 0, c * width, f * width, 0, 1];
  return `matrix3d(${m.map(n => +n.toFixed(8)).join(',')})`;
}

/** อนุพันธ์ของ H ที่ (u,v): เวกเตอร์บนจอที่ได้จากการขยับ u และ v ทีละหน่วย */
export function jacobian(H: number[], u: number, v: number) {
  const e = 1e-4, p = project(H, u, v), pu = project(H, u + e, v), pv = project(H, u, v + e);
  return { ux: (pu.x - p.x) / e, uy: (pu.y - p.y) / e, vx: (pv.x - p.x) / e, vy: (pv.y - p.y) / e };
}

/** เวกเตอร์บนระนาบกระดาน (หน่วย BOARD) ที่ชี้ "ลงจอ" ยาว length — ใช้วาดความหนาของชิ้นให้ตกลงด้านล่างเสมอ */
export function screenDown(H: number[], length: number): Point {
  const j = jacobian(H, 0.5, 0.5);
  const det = j.ux * j.vy - j.vx * j.uy;
  const u = -j.vx / det, v = j.ux / det; // J⁻¹ (0,1)
  const n = Math.hypot(u, v);
  return { x: (u / n) * length, y: (v / n) * length };
}

/* ── ถาดวางชิ้นที่รอต่อ (ใต้เกาะ) ──────────────────────────────────────
   วาดด้วยโค้ดบนระนาบเอียงเดียวกับถาดบนเกาะ (affine ที่กลางถาด ปรับ det = 1 หน่วยระนาบ ≈ px บนจอ)
   ชิ้นที่รอวางจึงเอียงและใหญ่เท่าช่องในถาดบนเกาะ เด็กเทียบรูปทรงกับช่องได้ตรงๆ
   ถาดเรียงช่องแบบเดียวกับกระดาน (cols × rows) ช่องผืนผ้าของด่าน 2 จึงทำให้ระนาบเป็นจัตุรัสเสมอ */
export type Affine = { a: number; b: number; c: number; d: number };

/** affine ที่กลางถาดบนเกาะ ปรับให้ไม่ย่อ/ขยายพื้นที่ (det = 1) — (x, y) บนระนาบ → (a x + c y, b x + d y) บนจอ */
export function planeAffine(H: number[]): Affine {
  const j = jacobian(H, 0.5, 0.5);
  const s = Math.sqrt(Math.abs(j.ux * j.vy - j.vx * j.uy));
  return { a: j.ux / s, b: j.uy / s, c: j.vx / s, d: j.vy / s };
}

/** ระยะขอบถาด (ผนังทอง + เผื่อหัวจิ๊กซอว์ที่ยื่น) เทียบกับด้านสั้นของช่อง */
export const BENCH_PAD = 0.34;
/** ความหนาของถาดบนจอ เทียบกับความกว้างช่อง */
export const BENCH_DEPTH = 0.2;

/** จัดถาดวางชิ้นให้กว้างพอดี width px บนจอ (ช่องกว้างไม่เกิน maxCell px บนระนาบ)
 *  คืนขนาดระนาบ S×S, ขนาดช่อง, ตำแหน่ง transform ของระนาบ และฟังก์ชันหาจุดกลางช่องบนจอ */
export function benchLayout(A: Affine, cols: number, rows: number, width: number, maxCell = 130) {
  const aspect = cols / rows; // ด้านสูง/ด้านกว้างของช่อง = สัดส่วนของตัวชิ้น
  const padUnit = BENCH_PAD * Math.min(1, aspect);
  const xs = [0, A.a, A.c, A.a + A.c], ys = [0, A.b, A.d, A.b + A.d];
  const spanX = Math.max(...xs) - Math.min(...xs), spanY = Math.max(...ys) - Math.min(...ys);
  const cw = Math.min(maxCell, width / spanX / (cols + 2 * padUnit));
  const ch = cw * aspect, pad = cw * padUnit, S = cols * cw + 2 * pad;
  const depth = BENCH_DEPTH * cw;
  const tx = (width - S * spanX) / 2 - S * Math.min(...xs), ty = -S * Math.min(...ys);
  const toScreen = (x: number, y: number) => ({ x: A.a * x + A.c * y + tx, y: A.b * x + A.d * y + ty });
  /** เวกเตอร์บนระนาบที่ชี้ลงจอยาว depth px: A⁻¹ (0, depth) */
  const wall = { x: -A.c * depth, y: A.a * depth };
  return {
    cw, ch, pad, S, height: S * spanY + depth, wall, toScreen,
    matrix: `matrix(${[A.a, A.b, A.c, A.d, tx, ty].map(n => +n.toFixed(5)).join(',')})`,
    /** จุดกลางช่องที่ slot (เรียงซ้าย→ขวา บน→ล่าง บนระนาบ) บนจอ */
    center: (slot: number) => toScreen(pad + ((slot % cols) + 0.5) * cw, pad + (Math.floor(slot / cols) + 0.5) * ch),
  };
}

/* ── ชิ้นจิ๊กซอว์ ─────────────────────────────────────────────────────
   หัวจิ๊กซอว์ (knob) คิดเป็นสัดส่วนของ K = ด้านสั้นของช่อง ชิ้นผืนผ้าในด่าน 2 จึงได้หัวขนาดเท่ากันทุกด้าน
   จุด (dx, h): dx วัดจากกลางขอบตามแนวขอบ h วัดออกนอกชิ้น */
const KNOB: [number, number][][] = [
  [[-0.1, 0], [-0.05, 0.08], [-0.09, 0.14]],
  [[-0.14, 0.21], [-0.1, 0.29], [0, 0.29]],
  [[0.1, 0.29], [0.14, 0.21], [0.09, 0.14]],
  [[0.05, 0.08], [0.1, 0], [0.14, 0]],
];
export const KNOB_DEPTH = 0.29;

/** เครื่องหมายของขอบ: +1 = หัวยื่นไปทาง +x/+y, −1 = กลับด้าน สลับเป็นลายหมากรุกให้ทุกชิ้นมีทั้งหัวและรู */
const horizontalSign = (row: number, col: number) => ((row + col) % 2 ? 1 : -1);
const verticalSign = (row: number, col: number) => ((row + col) % 2 ? -1 : 1);

function edge(ax: number, ay: number, bx: number, by: number, nx: number, ny: number, sign: number, k: number) {
  if (!sign) return ` L${bx} ${by}`;
  const len = Math.hypot(bx - ax, by - ay), dx = (bx - ax) / len, dy = (by - ay) / len;
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  const at = ([t, h]: [number, number]) => `${+(mx + dx * t * k + nx * h * k * sign).toFixed(1)} ${+(my + dy * t * k + ny * h * k * sign).toFixed(1)}`;
  return ` L${at([-0.14, 0])}` + KNOB.map(c => ` C${c.map(at).join(' ')}`).join('') + ` L${bx} ${by}`;
}

/** เส้นรอบชิ้นในหน่วย BOARD */
export function piecePath(col: number, row: number, cols: number, rows: number) {
  const w = BOARD / cols, h = BOARD / rows, k = Math.min(w, h);
  const x0 = col * w, y0 = row * h, x1 = x0 + w, y1 = y0 + h;
  const top = row === 0 ? 0 : -horizontalSign(row - 1, col);
  const bottom = row === rows - 1 ? 0 : horizontalSign(row, col);
  const right = col === cols - 1 ? 0 : verticalSign(row, col);
  const left = col === 0 ? 0 : -verticalSign(row, col - 1);
  return `M${x0} ${y0}` + edge(x0, y0, x1, y0, 0, -1, top, k) + edge(x1, y0, x1, y1, 1, 0, right, k)
    + edge(x1, y1, x0, y1, 0, 1, bottom, k) + edge(x0, y1, x0, y0, -1, 0, left, k) + ' Z';
}

/** กล่อง viewBox ของชิ้น (เผื่อหัวที่ยื่นออกทุกด้าน + ความหนา) */
export function pieceBox(col: number, row: number, cols: number, rows: number, pad: number) {
  const w = BOARD / cols, h = BOARD / rows, m = Math.min(w, h) * KNOB_DEPTH + pad;
  return { x: col * w - m, y: row * h - m, w: w + 2 * m, h: h + 2 * m };
}
