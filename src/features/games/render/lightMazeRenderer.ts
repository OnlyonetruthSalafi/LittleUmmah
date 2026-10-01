/* วาดเกมเขาวงกตแสงแบบ isometric 2:1 บน Canvas 2D — กล้องเฉียง 45° แบบภาพ tests/MockOrbGame.png
 *
 * ตำแหน่งโลก (c, r, z) → จอ: x = ox + (c − r)·T/2 , y = oy + (c + r)·T/4 − z   (T = ความกว้างช่องบนจอ)
 * ผนังเป็นปริซึม: หน้าบน + หน้าซ้ายล่าง (+r) + หน้าขวาล่าง (+c) แต่ละหน้าเป็นสี่เหลี่ยมด้านขนาน
 * map texture หน้าตรงลงไปด้วย affine transform จึงตรงเป๊ะไม่มีรอยต่อ ไม่มีภาพแล้วใช้สีธีมแทน
 * เรียงลึกด้วย c + r (ผนังเต็มช่อง ตัวละครยืนบนทางเดินเท่านั้น จึงพอ ไม่ต้องใช้ precedence graph)
 * พื้น เงาผนัง และแผ่นบนพื้น วาดครั้งเดียวลง layer นิ่ง แล้วค่อยวาดของที่ขยับทับทุกเฟรม
 */
import { isWall, walkerPos, type Cell, type Dir, type Maze, type SeekerId } from '../data/lightMaze';
import type { Palette } from '../data/lightMazeArt';
import type { Sim } from '../engine/lightMazeSim';

export type Pt = { x: number; y: number };
export type Sprite = { img: CanvasImageSource; w: number; h: number; ax: number; ay: number };
/** รูปที่โหลดเสร็จแล้ว key = ชื่อสั้น (เช่น 'orb-se', 'tex-floor'); ไม่มี key = ยังไม่มีภาพ ใช้ของสำรอง */
export type ArtSet = Map<string, Sprite>;
export type IslandFit = { top: Pt; right: Pt; bottom: Pt; left: Pt } | null;

/** ความสูงผนัง (× T) — หนาพอดูเป็นบล็อกหินแบบ Mock แต่ไม่บังเม็ดแสงช่องหลังผนัง (texture ข้าง 2:1 ไม่ยืดมาก) */
export const WALL = 0.42;
/** ขอบเกาะรอบเขาวงกต (ช่อง) — แบบ Mock ผนังรอบนอกคือขอบเวทีเลย เหลือแค่ปากหน้าผาแคบๆ ให้พุ่มไม้ห้อย */
const RIM = 0.3;
/** พื้นที่เหนือเขาวงกตสำหรับหัวตัวละคร/ต้นไม้ และใต้เกาะสำหรับหน้าผา (× T) */
const HEAD = 1.1, CLIFF = 1.15;
/** ภาพเกาะ: เห็นหน้าผาใต้ขอบเวทีได้สูงสุดเท่านี้ (× T) และหินยื่นข้างเท่านี้ ส่วนที่เกินให้ขอบฉากตัด แบบ Mock ที่ซูมเข้าเขาวงกต */
const CLIFF_VIEW = 1.7, SIDE_VIEW = 0.5;

export class MazeRenderer {
  T = 64; ox = 0; oy = 0; w = 0; h = 0;
  /** กล้องตามหุ่น: ใช้เมื่อย่อทั้งเกาะให้พอดีจอแล้วช่องเล็กกว่า minT (มือถือ) */
  follow = false;
  /** ขอบเขตของเกาะเทียบกับจุดกำเนิด (พิกเซล) และตำแหน่งจุดกำเนิดใน layer พื้น */
  private box = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  private floor: HTMLCanvasElement | null = null;
  private bead: HTMLCanvasElement | null = null;
  private trail: Pt[] = [];

  constructor(private maze: Maze, private pal: Palette, private art: ArtSet, private island: IslandFit) {}

  iso(c: number, r: number, z = 0): Pt { return { x: this.ox + (c - r) * this.T / 2, y: this.oy + (c + r) * this.T / 4 - z }; }
  /** จอ → ช่องโลกบนพื้น (z = 0) ใช้กับการแตะ */
  ground(x: number, y: number) { const u = (x - this.ox) / (this.T / 2), v = (y - this.oy) / (this.T / 4); return { c: (u + v) / 2, r: (v - u) / 2 }; }

  /** จัดกล้องให้เห็นทั้งเกาะ (แบบ Mock) w/h เป็นพิกเซลจริงของ canvas
   *  ถ้าช่องจะเล็กกว่า minT (มือถือ) ใช้ช่องขนาด minT แล้วให้กล้องตามหุ่นแทน */
  resize(w: number, h: number, minT = 0) {
    // ขอบเขตเกาะเป็นหน่วย T เทียบจุดกำเนิด: ข้าวหลามตัดขอบเวที + ที่หัวตัวละคร + หน้าผา
    // มีภาพเกาะจาก Codex ใช้ขอบภาพจริงหลังแปลง affine (หน้าผา/ขอบหินยื่นออกนอกข้าวหลามตัด)
    const u = this.unitBox();
    const fitT = Math.max(8, Math.min(w / (u.maxX - u.minX + 0.2), h / (u.maxY - u.minY)));
    this.follow = fitT < minT;
    this.T = this.follow ? minT : fitT;
    this.w = w; this.h = h;
    this.ox = w / 2 - (u.minX + u.maxX) / 2 * this.T;
    this.oy = h / 2 - (u.minY + u.maxY) / 2 * this.T;
    this.box = { minX: u.minX * this.T, maxX: u.maxX * this.T, minY: u.minY * this.T, maxY: u.maxY * this.T };
    this.floor = null; this.bead = null; this.trail = [];
    this.camReady = false;
  }

  /** มุมข้าวหลามตัดขอบเวที (โลก) */
  private rimCells() { const m = this.maze, lo = -0.5 - RIM, hc = m.cols - 0.5 + RIM, hr = m.rows - 0.5 + RIM; return { top: [lo, lo], right: [hc, lo], bottom: [hc, hr], left: [lo, hr] } as const; }

  /** affine จากพิกเซลภาพเกาะ → จอ: มุมบน/ขวา/ซ้ายของข้าวหลามตัดบนภาพ (manifest) ตรงกับมุมขอบเวทีเป๊ะ
   *  ใช้ 3 มุมแทนการย่อเท่ากันทุกแกน เพราะภาพจาก imagegen เอียงไม่ตรง 2:1 เป๊ะ */
  private islandMatrix(): [number, number, number, number, number, number] | null {
    const I = this.island;
    if (!I || !this.art.get('island')) return null;
    const k = this.rimCells(), P = (c: readonly [number, number]) => this.iso(c[0], c[1]);
    const t = P(k.top), rt = P(k.right), lf = P(k.left);
    // ภาพ: top + a·(right−top) + b·(left−top)  →  จอ: t + a·(rt−t) + b·(lf−t)
    const ux = I.right.x - I.top.x, uy = I.right.y - I.top.y, vx = I.left.x - I.top.x, vy = I.left.y - I.top.y, det = ux * vy - uy * vx;
    // เมทริกซ์ผกผันของภาพ (พิกเซล → a,b)
    const ia = vy / det, ib = -vx / det, ic = -uy / det, id = ux / det;
    const Ax = rt.x - t.x, Ay = rt.y - t.y, Bx = lf.x - t.x, By = lf.y - t.y;
    const a = Ax * ia + Bx * ic, b = Ay * ia + By * ic, c = Ax * ib + Bx * id, d = Ay * ib + By * id;
    return [a, b, c, d, t.x - a * I.top.x - c * I.top.y, t.y - b * I.top.x - d * I.top.y];
  }

  private unitBox() {
    const keep = { T: this.T, ox: this.ox, oy: this.oy };
    this.T = 1; this.ox = 0; this.oy = 0;
    const k = this.rimCells(), pts = [k.top, k.right, k.bottom, k.left].map(c => this.iso(c[0], c[1]));
    let minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
    let minY = pts[0].y - HEAD, maxY = pts[2].y + CLIFF;
    const M = this.islandMatrix(), img = this.art.get('island');
    if (M && img) {
      for (const [x, y] of [[0, 0], [img.w, 0], [0, img.h], [img.w, img.h]]) {
        const X = M[0] * x + M[2] * y + M[4], Y = M[1] * x + M[3] * y + M[5];
        minX = Math.min(minX, X); maxX = Math.max(maxX, X); maxY = Math.max(maxY, Y); minY = Math.min(minY, Y);
      }
      minX = Math.max(minX, pts[3].x - SIDE_VIEW); maxX = Math.min(maxX, pts[1].x + SIDE_VIEW); maxY = Math.min(maxY, pts[2].y + CLIFF_VIEW);
    }
    this.T = keep.T; this.ox = keep.ox; this.oy = keep.oy;
    return { minX, maxX, minY, maxY };
  }

  private camReady = false;
  /** เลื่อนกล้องตามหุ่น ไม่ให้เห็นเลยขอบเกาะ; ลดการเคลื่อนไหว = กระโดดทีละช่วงเมื่อหุ่นออกนอกกลางจอ ไม่เลื่อนต่อเนื่อง */
  private camera(p: Pt, dt: number, still: boolean) {
    if (!this.follow) return;
    const px = (p.x - p.y) * this.T / 2, py = (p.x + p.y) * this.T / 4, b = this.box;
    const clampX = (v: number) => Math.min(-b.minX, Math.max(this.w - b.maxX, v)), clampY = (v: number) => Math.min(-b.minY, Math.max(this.h - b.maxY, v));
    const tx = clampX(this.w / 2 - px), ty = clampY(this.h / 2 - py);
    if (!this.camReady) { this.ox = tx; this.oy = ty; this.camReady = true; this.trail = []; return; }
    if (still) {
      const sx = this.ox + px, sy = this.oy + py;
      if (sx < this.w * 0.2 || sx > this.w * 0.8 || sy < this.h * 0.2 || sy > this.h * 0.8) { this.ox = tx; this.oy = ty; this.trail = []; }
      return;
    }
    const k = Math.min(1, dt * 5);
    this.ox += (tx - this.ox) * k; this.oy += (ty - this.oy) * k;
  }

  // ── ชั้นนิ่ง: เกาะ พื้น เงาผนัง แผ่นบนพื้น ──────────────────────────────
  private buildFloor() {
    const cv = document.createElement('canvas'), b = this.box, keep = { x: this.ox, y: this.oy };
    cv.width = Math.ceil(b.maxX - b.minX); cv.height = Math.ceil(b.maxY - b.minY);
    this.ox = -b.minX; this.oy = -b.minY;
    const g = cv.getContext('2d')!, m = this.maze, T = this.T, p = this.pal;
    const lo = -0.5 - RIM, hc = m.cols - 0.5 + RIM, hr = m.rows - 0.5 + RIM;
    const rim = { top: this.iso(lo, lo), right: this.iso(hc, lo), bottom: this.iso(hc, hr), left: this.iso(lo, hr) };

    // ใต้เกาะ: ภาพหน้าผาจาก Codex ถ้ามี (ย่อ/ขยายเท่ากันทุกแกน วางให้ข้าวหลามตัดบนภาพตรงกับขอบเกาะ) ไม่งั้นวาดหน้าผาเอง
    const cliff = this.art.get('island'), M = this.islandMatrix();
    if (cliff && M) {
      g.save(); g.setTransform(...M); g.drawImage(cliff.img, 0, 0, cliff.w, cliff.h); g.restore();
    } else {
      const d = CLIFF * T * 0.8;
      const face = (a: Pt, b: Pt, shade: string) => {
        const grad = g.createLinearGradient(0, a.y, 0, Math.max(a.y, b.y) + d);
        grad.addColorStop(0, shade); grad.addColorStop(1, '#0d1a38');
        g.fillStyle = grad; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(b.x, b.y + d * 0.55); g.lineTo((a.x + b.x) / 2, (a.y + b.y) / 2 + d); g.lineTo(a.x, a.y + d * 0.55); g.closePath(); g.fill();
      };
      face(rim.left, rim.bottom, p.cliff); face(rim.bottom, rim.right, shade(p.cliff, -0.25));
      // ผลึกฟ้าห้อยใต้เกาะ
      g.fillStyle = '#5fe3f0';
      for (const [a, b, f] of [[rim.left, rim.bottom, 0.3], [rim.left, rim.bottom, 0.7], [rim.bottom, rim.right, 0.35], [rim.bottom, rim.right, 0.75]] as [Pt, Pt, number][]) {
        const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f + d * 0.6;
        g.beginPath(); g.moveTo(x - T * 0.12, y); g.lineTo(x + T * 0.12, y); g.lineTo(x, y + T * 0.45); g.closePath(); g.fill();
      }
    }
    // ปากหน้าผา (เฉพาะตอนไม่มีภาพเกาะ — ภาพเกาะมีผิวบนและขอบหินของมันเอง): หินเข้มกว่าพื้น + คิ้วทองบางๆ
    if (!(cliff && M)) {
      g.fillStyle = shade(p.side, -0.1);
      poly(g, [rim.top, rim.right, rim.bottom, rim.left]); g.fill();
      g.strokeStyle = p.rim; g.lineWidth = Math.max(1.2, T * 0.025);
      g.beginPath(); g.moveTo(rim.left.x, rim.left.y); g.lineTo(rim.bottom.x, rim.bottom.y); g.lineTo(rim.right.x, rim.right.y); g.stroke();
    }

    // แผ่นพื้นทางเดิน
    const tex = this.art.get('tex-floor');
    for (let r = 0; r < m.rows; r++) for (let c = 0; c < m.cols; c++) {
      if (m.walls[r * m.cols + c] && !(m.crystal && m.crystal.c === c && m.crystal.r === r)) continue;
      const a = this.iso(c - 0.5, r - 0.5), b = this.iso(c + 0.5, r - 0.5), d = this.iso(c - 0.5, r + 0.5);
      if (tex) { mapImage(g, tex.img, tex.w, tex.h, a, b, d, 1.012); if (p.floorDim) { g.fillStyle = `rgba(6,10,30,${p.floorDim})`; poly(g, [a, b, this.iso(c + 0.5, r + 0.5), d]); g.fill(); } }
      else { g.fillStyle = (c + r) % 2 ? p.floor : p.floorAlt; poly(g, [a, b, this.iso(c + 0.5, r + 0.5), d]); g.fill(); }
      g.strokeStyle = 'rgba(0,0,0,.16)'; g.lineWidth = 1; poly(g, [a, b, this.iso(c + 0.5, r + 0.5), d]); g.stroke();
    }
    // เงาผนังตกไปทางขวาล่างของจอ (+c) — แสงมาจากซ้ายบน
    g.fillStyle = 'rgba(8,14,40,.32)';
    for (let r = 0; r < m.rows; r++) for (let c = 0; c < m.cols; c++) {
      if (!isWall(m, c, r) || isWall(m, c + 1, r) || c + 1 >= m.cols) continue;
      poly(g, [this.iso(c + 0.5, r - 0.5), this.iso(c + 0.95, r - 0.3), this.iso(c + 0.95, r + 0.5), this.iso(c + 0.5, r + 0.5)]); g.fill();
    }
    // แผ่นบนพื้น: แท่นชาร์จเพื่อนหุ่น ประตูวาร์ป จุดพัก
    for (const h of m.homes) this.decal(g, 'charger', h.cell, '#7fe7ff');
    for (const cell of m.portals ?? []) this.decal(g, 'portal', cell, '#c07bff');
    for (const cell of m.checkpoints) this.decal(g, '', cell, '#ffd36a');
    this.floor = cv;
    this.ox = keep.x; this.oy = keep.y;
  }

  private decal(g: CanvasRenderingContext2D, key: string, cell: Cell, color: string) {
    const s = key ? this.art.get(key) : undefined, T = this.T, at = this.iso(cell.c, cell.r);
    if (s) { const w = T * 0.95, h = w * s.h / s.w; g.drawImage(s.img, at.x - w / 2, at.y - h / 2, w, h); return; }
    g.strokeStyle = color; g.lineWidth = Math.max(2, T * 0.05);
    g.beginPath(); g.ellipse(at.x, at.y, T * 0.34, T * 0.17, 0, 0, Math.PI * 2); g.stroke();
    g.fillStyle = color + '33'; g.fill();
  }

  private beadSprite() {
    // เม็ดแสงทองเรืองแบบ Mock: แกนใหญ่ ~0.12T รัศมีเรืองกว้าง
    const T = this.T, size = Math.ceil(T * 0.72), cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const g = cv.getContext('2d')!, c = size / 2, R = T * 0.12;
    const halo = g.createRadialGradient(c, c, R * 0.6, c, c, c);
    halo.addColorStop(0, 'rgba(255,200,70,.6)'); halo.addColorStop(0.45, 'rgba(255,190,60,.22)'); halo.addColorStop(1, 'rgba(255,190,60,0)');
    g.fillStyle = halo; g.fillRect(0, 0, size, size);
    const core = g.createRadialGradient(c - R * 0.35, c - R * 0.4, 0, c, c, R);
    core.addColorStop(0, '#fffdf0'); core.addColorStop(0.35, '#ffe27a'); core.addColorStop(0.8, '#ffb91f'); core.addColorStop(1, '#e08a00');
    g.fillStyle = core; g.beginPath(); g.arc(c, c, R, 0, Math.PI * 2); g.fill();
    this.bead = cv;
  }

  // ── วาดทุกเฟรม ─────────────────────────────────────────────────────
  draw(g: CanvasRenderingContext2D, sim: Sim, time: number, still: boolean, dt = 0) {
    const m = this.maze, T = this.T;
    this.camera(walkerPos(sim.player), dt, still);
    if (!this.floor) this.buildFloor();
    if (!this.bead) this.beadSprite();
    g.clearRect(0, 0, this.w, this.h);
    g.drawImage(this.floor!, Math.round(this.ox + this.box.minX), Math.round(this.oy + this.box.minY));

    // ของที่ตั้งบนพื้น เรียงจากไกลไปใกล้
    type Job = { key: number; order: number; run: () => void };
    const jobs: Job[] = [];
    for (let r = 0; r < m.rows; r++) for (let c = 0; c < m.cols; c++) {
      if (!isWall(m, c, r)) continue;
      if (m.crystal && m.crystal.c === c && m.crystal.r === r) jobs.push({ key: c + r, order: 1, run: () => this.crystal(g, c, r) });
      else jobs.push({ key: c + r, order: 0, run: () => this.wall(g, c, r) });
    }
    // เม็ดแสงอยู่ในลำดับลึกด้วย: ผนังช่องหลังวาดก่อน ไม่ทับหัวเม็ด ส่วนผนังช่องหน้าวาดทีหลัง
    // ลอย 0.2T ให้พ้นมุมสันผนังช่องหน้า (อยู่ที่ −0.17T จากกลางช่อง) เด็กเห็นเม็ดสุดท้ายเสมอ
    const bead = this.bead!;
    for (const l of m.lights) {
      if (sim.collected.has(`${l.c},${l.r}`)) continue;
      jobs.push({ key: l.c + l.r, order: 1.5, run: () => { const at = this.iso(l.c, l.r, T * 0.2); g.drawImage(bead, at.x - bead.width / 2, at.y - bead.height / 2); } });
    }
    for (const item of m.items) if (!sim.taken.has(`${item.cell.c},${item.cell.r}`)) jobs.push({ key: item.cell.c + item.cell.r, order: 2, run: () => this.item(g, item.kind, item.cell) });
    for (const cell of m.checkpoints) jobs.push({ key: cell.c + cell.r - 0.2, order: 2, run: () => this.prop(g, 'lantern', cell.c - 0.25, cell.r - 0.25, 0.55) });
    if (m.portals) { const a = m.portals[0]; jobs.push({ key: a.c + a.r - 0.6, order: 1, run: () => this.prop(g, 'arch', a.c - 0.3, a.r - 0.3, 1.05) }); }
    // ของประดับบนปากหน้าผา: เสาโคมมุมหลัง ต้นอินทผลัมมุมซ้าย/ขวา พุ่มไม้คร่อมขอบหน้าแบบ Mock (ไม่วางทับทางเดิน)
    const lo = -0.5 - RIM * 0.5, hc = m.cols - 0.5 + RIM * 0.5, hr = m.rows - 0.5 + RIM * 0.5;
    const deco: [string, number, number, number][] = [['post', lo, lo, 0.7], ['palm', lo, hr, 1.3], ['palm', hc, lo, 1.3], ['shrub', hc, hr, 0.8]];
    for (let f = 0.22; f < 0.9; f += 0.28) deco.push(['shrub', lo + (hc - lo) * f, hr + 0.15, 0.85], ['shrub', hc + 0.15, lo + (hr - lo) * f, 0.85]);
    for (const [name, c, r, size] of deco) jobs.push({ key: c + r, order: 1, run: () => this.prop(g, name, c, r, size) });
    for (const s of sim.seekers) { const p = walkerPos(s.w); jobs.push({ key: p.x + p.y, order: 3, run: () => this.actor(g, s.id, p, s.w.dir, s.mode !== 'active' || sim.clock < sim.powerUntil, false, time, still) }); }
    const me = walkerPos(sim.player);
    jobs.push({ key: me.x + me.y, order: 4, run: () => this.orb(g, sim, me, time, still) });
    jobs.sort((a, b) => a.key - b.key || a.order - b.order);
    for (const j of jobs) j.run();
  }

  private wall(g: CanvasRenderingContext2D, c: number, r: number) {
    const m = this.maze, T = this.T, h = WALL * T, p = this.pal;
    const top = [this.iso(c - 0.5, r - 0.5, h), this.iso(c + 0.5, r - 0.5, h), this.iso(c + 0.5, r + 0.5, h), this.iso(c - 0.5, r + 0.5, h)];
    const side = this.art.get('tex-side'), cap = this.art.get('tex-top');
    // ร่องแสงแบบ Mock: ขีดสั้นแยกกัน ไม่ใช่ทุกหน้า เลือกจากตำแหน่งช่องแบบคงที่ (ไม่สุ่มทุกเฟรม)
    const seed = hash(c, r), glowZ = h * (0.3 + (seed % 3) * 0.12);
    // หน้าซ้ายล่าง (+r) แสงกลาง
    if (!solid(m, c, r + 1)) {
      const a = this.iso(c - 0.5, r + 0.5, h), b = this.iso(c + 0.5, r + 0.5, h), d = this.iso(c - 0.5, r + 0.5);
      this.face(g, side, a, b, d, p.side, 0.1);
      if (seed % 5 < 3) this.glow(g, this.iso(c - 0.5, r + 0.5, glowZ), this.iso(c + 0.5, r + 0.5, glowZ), seed);
    }
    // หน้าขวาล่าง (+c) มืดกว่า
    if (!solid(m, c + 1, r)) {
      const a = this.iso(c + 0.5, r + 0.5, h), b = this.iso(c + 0.5, r - 0.5, h), d = this.iso(c + 0.5, r + 0.5);
      this.face(g, side, a, b, d, shade(p.side, -0.25), 0.38);
      if ((seed >> 3) % 5 < 2) this.glow(g, this.iso(c + 0.5, r + 0.5, glowZ), this.iso(c + 0.5, r - 0.5, glowZ), seed >> 2);
    }
    // หน้าบนสว่างสุด — ไม่มี texture ใช้สีธีม + ขอบ bevel (texture ของ Codex มี bevel ในภาพแล้ว ไม่วาดซ้ำ)
    if (cap) { mapImage(g, cap.img, cap.w, cap.h, top[0], top[1], top[3], 1.015); if (p.topLift) { g.fillStyle = `rgba(190,205,255,${p.topLift})`; poly(g, top); g.fill(); } }
    else {
      g.fillStyle = shade(p.top, -0.12); poly(g, top); g.fill();
      g.fillStyle = p.top; poly(g, [this.iso(c - 0.38, r - 0.38, h), this.iso(c + 0.38, r - 0.38, h), this.iso(c + 0.38, r + 0.38, h), this.iso(c - 0.38, r + 0.38, h)]); g.fill();
    }
    // ขอบหน้าบนที่ไม่ติดผนังข้างเคียง: เส้นสว่างบางๆ ให้บล็อกดูมีสันแบบภาพ Mock
    g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = Math.max(1, T * 0.02);
    const edges: [boolean, Pt, Pt][] = [[solid(m, c, r - 1), top[0], top[1]], [solid(m, c + 1, r), top[1], top[2]], [solid(m, c, r + 1), top[2], top[3]], [solid(m, c - 1, r), top[3], top[0]]];
    g.beginPath();
    for (const [joined, a, b] of edges) if (!joined) { g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); }
    g.stroke();
  }

  private face(g: CanvasRenderingContext2D, tex: Sprite | undefined, a: Pt, b: Pt, d: Pt, fill: string, dark: number) {
    const q = [a, b, { x: b.x + d.x - a.x, y: b.y + d.y - a.y }, d];
    if (tex) mapImage(g, tex.img, tex.w, tex.h, a, b, d, 1.01);
    else { g.fillStyle = fill; poly(g, q); g.fill(); }
    if (dark) { g.fillStyle = `rgba(6,10,30,${dark})`; poly(g, q); g.fill(); }
  }

  /** ร่องแสงเรืองบนหน้าผนัง (นิ่ง ไม่กระพริบ) */
  private glow(g: CanvasRenderingContext2D, a: Pt, b: Pt, seed: number) {
    const start = 0.12 + (seed % 4) * 0.08, len = 0.32 + ((seed >> 2) % 3) * 0.1;
    const T = this.T, from = lerp(a, b, start), to = lerp(a, b, Math.min(0.9, start + len)), col = this.pal.glow;
    g.lineCap = 'round';
    g.strokeStyle = col + '40'; g.lineWidth = T * 0.09; line(g, from, to);
    g.strokeStyle = col; g.lineWidth = Math.max(1.2, T * 0.028); line(g, from, to);
    g.lineCap = 'butt';
  }

  private crystal(g: CanvasRenderingContext2D, c: number, r: number) {
    if (this.prop(g, 'crystal', c, r, 1.25)) return;
    const T = this.T, base = this.iso(c, r), h = T * 1.1;
    g.fillStyle = shade(this.pal.side, 0.1); poly(g, [this.iso(c - 0.4, r - 0.4, T * 0.2), this.iso(c + 0.4, r - 0.4, T * 0.2), this.iso(c + 0.4, r + 0.4, T * 0.2), this.iso(c - 0.4, r + 0.4, T * 0.2)]); g.fill();
    g.fillStyle = '#7ff3ff'; poly(g, [{ x: base.x, y: base.y - h }, { x: base.x + T * 0.16, y: base.y - T * 0.45 }, { x: base.x, y: base.y - T * 0.2 }, { x: base.x - T * 0.16, y: base.y - T * 0.45 }]); g.fill();
    g.fillStyle = 'rgba(255,255,255,.5)'; poly(g, [{ x: base.x, y: base.y - h }, { x: base.x - T * 0.16, y: base.y - T * 0.45 }, { x: base.x, y: base.y - T * 0.35 }]); g.fill();
  }

  /** วาด sprite ตั้งบนพื้นที่ (c, r) กว้าง size × T; คืน false ถ้ายังไม่มีภาพ */
  private prop(g: CanvasRenderingContext2D, key: string, c: number, r: number, size: number) {
    const s = this.art.get(key);
    if (!s) return false;
    const at = this.iso(c, r), w = this.T * size, k = w / s.w;
    g.drawImage(s.img, at.x - s.ax * k, at.y - s.ay * k, w, s.h * k);
    return true;
  }

  private item(g: CanvasRenderingContext2D, kind: 'star' | 'clock' | 'shield', cell: Cell) {
    this.shadow(g, cell.c, cell.r, 0.2);
    if (this.prop(g, kind, cell.c, cell.r, 0.74)) return;
    const T = this.T, at = this.iso(cell.c, cell.r, T * 0.32);
    g.fillStyle = kind === 'star' ? '#ffc933' : kind === 'clock' ? '#4fb3ff' : '#6fd8ff';
    g.beginPath(); g.arc(at.x, at.y, T * 0.17, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke();
  }

  private shadow(g: CanvasRenderingContext2D, c: number, r: number, size = 0.28) {
    const at = this.iso(c, r), T = this.T;
    g.fillStyle = 'rgba(5,10,30,.35)'; g.beginPath(); g.ellipse(at.x, at.y, T * size, T * size / 2, 0, 0, Math.PI * 2); g.fill();
  }

  /** เลือกภาพตามทิศโลก: +c (ขวาล่างจอ) = se, −r (ขวาบน) = ne, +r (ซ้ายล่าง) = se กลับด้าน, −c (ซ้ายบน) = ne กลับด้าน */
  private actor(g: CanvasRenderingContext2D, id: 'orb' | SeekerId, p: Pt, dir: Dir | null, resting: boolean, _unused: boolean, time: number, still: boolean) {
    const T = this.T, face = dir ?? 'right', back = face === 'up' || face === 'left', flip = face === 'down' || face === 'left';
    this.shadow(g, p.x, p.y);
    const s = (resting && id !== 'orb' ? this.art.get(`${id}-rest`) : undefined) ?? this.art.get(`${id}-${back ? 'ne' : 'se'}`);
    const at = this.iso(p.x, p.y), size = id === 'orb' ? 1.1 : 1.15;
    const bob = dir && !still ? Math.abs(Math.sin(time * 14)) * T * 0.025 : 0;
    g.save();
    if (resting) g.globalAlpha = 0.85;
    g.translate(at.x, at.y - bob);
    if (flip) g.scale(-1, 1);
    if (s) { const w = T * size, k = w / s.w; g.drawImage(s.img, -s.ax * k, -s.ay * k, w, s.h * k); }
    else {
      const colors: Record<string, string> = { orb: '#f4f8ff', red: '#ef5a4c', violet: '#9b6cf0', blue: '#3a78e8', green: '#8ccf3a' };
      g.fillStyle = colors[id]; g.beginPath(); g.ellipse(0, -T * 0.3, T * 0.28, T * 0.28, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#0f1b3a'; g.fillRect(-T * 0.16, -T * 0.4, T * 0.32, T * 0.16);
      g.fillStyle = '#6ff4ff'; g.fillRect(-T * 0.1, -T * 0.36, T * 0.05, T * 0.08); g.fillRect(T * 0.05, -T * 0.36, T * 0.05, T * 0.08);
    }
    g.restore();
  }

  private orb(g: CanvasRenderingContext2D, sim: Sim, p: Pt, time: number, still: boolean) {
    const T = this.T, moving = !!sim.player.dir;
    // หางแสงตามหลัง (แบบ Mock) เฉพาะตอนเคลื่อนที่ ปิดเมื่อผู้ใช้ลดการเคลื่อนไหว
    this.trail.push(this.iso(p.x, p.y, T * 0.3));
    if (this.trail.length > 9) this.trail.shift();
    if (!moving) this.trail = this.trail.slice(-1);
    if (!still && this.trail.length > 2) {
      g.lineCap = 'round';
      for (let i = 1; i < this.trail.length; i++) {
        const k = i / this.trail.length;
        // หางแสงขาวอมฟ้าแบบดาวหาง (Mock)
        g.strokeStyle = `rgba(200,240,255,${0.55 * k})`; g.lineWidth = T * 0.34 * k;
        line(g, this.trail[i - 1], this.trail[i]);
      }
      g.lineCap = 'butt';
    }
    if (sim.clock < sim.powerUntil) {
      const at = this.iso(p.x, p.y);
      const halo = g.createRadialGradient(at.x, at.y, 0, at.x, at.y, T * 0.6);
      halo.addColorStop(0, 'rgba(255,220,110,.55)'); halo.addColorStop(1, 'rgba(255,220,110,0)');
      g.fillStyle = halo; g.beginPath(); g.ellipse(at.x, at.y, T * 0.6, T * 0.3, 0, 0, Math.PI * 2); g.fill();
    }
    g.save();
    if (sim.clock < sim.safeUntil) g.globalAlpha = 0.55;
    this.actor(g, 'orb', p, sim.player.dir ?? sim.facing, false, false, time, still || !moving);
    g.restore();
    if (sim.shield) {
      const at = this.iso(p.x, p.y, T * 0.32);
      g.strokeStyle = 'rgba(120,220,255,.9)'; g.lineWidth = Math.max(2, T * 0.04);
      g.beginPath(); g.ellipse(at.x, at.y, T * 0.42, T * 0.42, 0, 0, Math.PI * 2); g.stroke();
    }
  }
}

// ── เครื่องมือวาด ─────────────────────────────────────────────────────
function poly(g: CanvasRenderingContext2D, pts: Pt[]) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.closePath(); }
function line(g: CanvasRenderingContext2D, a: Pt, b: Pt) { g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
/** ผนังจริงในผัง (นอกผัง = ว่าง) ใช้ตัดสินว่าจะวาดหน้าข้างไหม ผนังรอบนอกจึงเห็นหน้าหินด้านนอกแบบขอบเวทีใน Mock */
const solid = (m: Maze, c: number, r: number) => c >= 0 && r >= 0 && c < m.cols && r < m.rows && m.walls[r * m.cols + c];
/** ค่าคงที่ต่อช่อง ใช้เลือกลายร่องแสงแบบไม่สุ่มทุกเฟรม */
const hash = (c: number, r: number) => (((c * 73856093) ^ (r * 19349663)) >>> 0) & 1023;
const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/** วาดภาพสี่เหลี่ยมลงสี่เหลี่ยมด้านขนาน a→b (แกน x ของภาพ) a→d (แกน y) ขยายเล็กน้อยรอบจุดกลาง (grow) กันรอยต่อ sub-pixel */
function mapImage(g: CanvasRenderingContext2D, img: CanvasImageSource, w: number, h: number, a: Pt, b: Pt, d: Pt, grow = 1) {
  const cx = (b.x + d.x) / 2, cy = (b.y + d.y) / 2;
  const A = { x: cx + (a.x - cx) * grow, y: cy + (a.y - cy) * grow }, B = { x: cx + (b.x - cx) * grow, y: cy + (b.y - cy) * grow }, D = { x: cx + (d.x - cx) * grow, y: cy + (d.y - cy) * grow };
  g.save();
  g.setTransform((B.x - A.x) / w, (B.y - A.y) / w, (D.x - A.x) / h, (D.y - A.y) / h, A.x, A.y);
  g.drawImage(img, 0, 0, w, h);
  g.restore();
}

/** ปรับความสว่างสี hex (amount −1..1) */
export function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16), f = (v: number) => Math.round(Math.min(255, Math.max(0, amount < 0 ? v * (1 + amount) : v + (255 - v) * amount)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, '0')).join('')}`;
}
