/* เกมเขาวงกตแสง 2.5D (light-maze) — ตรรกะล้วน ไม่มี DOM ทดสอบได้ใน tests/light-maze.test.mjs
 *
 * หุ่นลูกกลม Luma เก็บเม็ดแสงบนเกาะลอยฟ้า เลือกทางหลบเพื่อนหุ่นยนต์สี่ตัว ใช้ดาว นาฬิกา โล่ และประตูวาร์ปช่วย
 * แนวเกมจากภาพ tests/MockOrbGame.png แผนเต็มอยู่ output/orbmaze-plan/PLAN.md
 * ใจดีกับเด็ก: ไม่มีชีวิต ไม่มีเกมโอเวอร์ โดนเพื่อนแตะแค่กลับจุดพักล่าสุด เม็ดแสงที่เก็บแล้วยังอยู่
 *
 * ผัง: # ผนัง · . เม็ดแสง · P จุดเริ่ม · C เสาคริสตัล (ทึบ เดินผ่านไม่ได้) · S จุดพัก
 *      * ดาวพลังแสง · T นาฬิกาชะลอเวลา · H โล่ · A/B ประตูวาร์ปคู่ · 1–4 แท่นชาร์จเพื่อนหุ่น (แดง ม่วง น้ำเงิน เขียว)
 */

export type Dir = 'up' | 'down' | 'left' | 'right';
export const STEP: Record<Dir, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
export const REVERSE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
export const DIRS: Dir[] = ['up', 'left', 'down', 'right'];

export type Cell = { c: number; r: number };
export type ItemKind = 'star' | 'clock' | 'shield';
export type SeekerId = 'red' | 'violet' | 'blue' | 'green';
export type Theme = 'neon' | 'grove' | 'sky';
export type Maze = {
  cols: number; rows: number;
  /** ช่องที่เดินไม่ได้ (ผนัง + เสาคริสตัล) */
  walls: boolean[];
  lights: Cell[]; start: Cell; crystal: Cell | null; checkpoints: Cell[];
  items: { kind: ItemKind; cell: Cell }[];
  portals: [Cell, Cell] | null;
  homes: { id: SeekerId; cell: Cell }[];
};
export type LevelRules = { playerSpeed: number; seekerSpeed: number; powerSeconds: number; slowSeconds: number };
export type Level = { theme: Theme; th: string; en: string; map: string[]; rules: LevelRules };

const SEEKERS: Record<string, SeekerId> = { 1: 'red', 2: 'violet', 3: 'blue', 4: 'green' };
const ITEMS: Record<string, ItemKind> = { '*': 'star', T: 'clock', H: 'shield' };

// ผังจาก output/orbmaze-plan/levels.json (Codex ออกแบบใหม่ ไม่ถอดจากเกมอื่น)
export const MAZE_LEVELS: Level[] = [
  { theme: 'neon', th: 'เมืองแสงสี', en: 'Neon Courtyard', map: [
    '#########',
    '#P......#',
    '#.##.#..#',
    '#....#..#',
    '#.#.C.#.#',
    '#.#.....#',
    '#...##..#',
    '#.......#',
    '#########',
  ], rules: { playerSpeed: 2.6, seekerSpeed: 0, powerSeconds: 10, slowSeconds: 8 } },
  { theme: 'grove', th: 'สวนคริสตัล', en: 'Crystal Grove', map: [
    '###########',
    '#P...#...A#',
    '#.##.#.#..#',
    '#..S...#..#',
    '#.#.##..#.#',
    '#...#C#...#',
    '#.#.....#.#',
    '#..#T.#.1.#',
    '#..#..#...#',
    '#B..*.H.2.#',
    '###########',
  ], rules: { playerSpeed: 2.8, seekerSpeed: 1.3, powerSeconds: 10, slowSeconds: 8 } },
  { theme: 'sky', th: 'ลานลอยฟ้า', en: 'Sky Ruins', map: [
    '#############',
    '#P....#....A#',
    '#.###.#.##..#',
    '#...S...#...#',
    '#.#..##...#.#',
    '#...#.C.#...#',
    '#.##....#.#.#',
    '#..T.#....1.#',
    '#.#..#.##...#',
    '#B..*.H.2.3.#',
    '#############',
  ], rules: { playerSpeed: 3, seekerSpeed: 1.5, powerSeconds: 10, slowSeconds: 8 } },
];

export function parseMaze(map: readonly string[]): Maze {
  const rows = map.length, cols = map[0]?.length ?? 0;
  if (!rows || !cols) throw new Error('empty maze');
  const maze: Maze = { cols, rows, walls: [], lights: [], start: { c: -1, r: -1 }, crystal: null, checkpoints: [], items: [], portals: null, homes: [] };
  const portal: Partial<Record<'A' | 'B', Cell>> = {};
  map.forEach((line, r) => {
    if (line.length !== cols) throw new Error(`maze row ${r} has ${line.length} columns, expected ${cols}`);
    [...line].forEach((ch, c) => {
      const cell = { c, r };
      maze.walls.push(ch === '#' || ch === 'C');
      if (ch === '.') maze.lights.push(cell);
      else if (ch === 'P') { if (maze.start.c >= 0) throw new Error('two starts'); maze.start = cell; }
      else if (ch === 'C') maze.crystal = cell;
      else if (ch === 'S') maze.checkpoints.push(cell);
      else if (ch === 'A' || ch === 'B') portal[ch] = cell;
      else if (ITEMS[ch]) maze.items.push({ kind: ITEMS[ch], cell });
      else if (SEEKERS[ch]) maze.homes.push({ id: SEEKERS[ch], cell });
      else if (ch !== '#' && ch !== ' ') throw new Error(`unknown maze char ${ch}`);
    });
  });
  if (maze.start.c < 0) throw new Error('maze has no start');
  if (!!portal.A !== !!portal.B) throw new Error('portal needs both A and B');
  if (portal.A && portal.B) maze.portals = [portal.A, portal.B];
  maze.homes.sort((a, b) => a.id.localeCompare(b.id));
  return maze;
}

export const isWall = (maze: Maze, c: number, r: number) => c < 0 || r < 0 || c >= maze.cols || r >= maze.rows || maze.walls[r * maze.cols + c];
export const canGo = (maze: Maze, cell: Cell, dir: Dir) => !isWall(maze, cell.c + STEP[dir][0], cell.r + STEP[dir][1]);
export const cellKey = (cell: Cell) => `${cell.c},${cell.r}`;
export const sameCell = (a: Cell, b: Cell) => a.c === b.c && a.r === b.r;

/** เดินจากจุดศูนย์กลางช่อง (c,r) ไปทาง dir ได้ระยะ t (0–1) ช่อง dir = null คือหยุดนิ่งกลางช่อง */
export type Walker = { c: number; r: number; dir: Dir | null; t: number };
export const walkerAt = (cell: Cell): Walker => ({ c: cell.c, r: cell.r, dir: null, t: 0 });
export function walkerPos(w: Walker): { x: number; y: number } {
  if (!w.dir) return { x: w.c, y: w.r };
  const [dx, dy] = STEP[w.dir];
  return { x: w.c + dx * w.t, y: w.r + dy * w.t };
}
/** ช่องที่ walker อยู่ใกล้ที่สุด */
export function walkerCell(w: Walker): Cell {
  if (!w.dir || w.t < 0.5) return { c: w.c, r: w.r };
  return { c: w.c + STEP[w.dir][0], r: w.r + STEP[w.dir][1] };
}

/**
 * เดินไปข้างหน้า distance ช่อง ทุกครั้งที่ถึงกลางช่องจะถาม choose ว่าไปทางไหนต่อ (null = หยุด)
 * onCell ถูกเรียกทุกครั้งที่ถึงกลางช่องใหม่ คืน true เพื่อหยุดเดินส่วนที่เหลือ (เช่น เข้าประตูวาร์ป)
 */
export function walk(maze: Maze, w: Walker, distance: number, choose: (at: Cell, dir: Dir | null) => Dir | null, onCell?: (at: Cell) => boolean | void): Walker {
  let { c, r, dir, t } = w;
  let left = distance;
  // กันลูปไม่รู้จบถ้า distance ใหญ่ผิดปกติ
  for (let guard = 0; guard < 64 && left > 1e-9; guard++) {
    if (!dir) {
      dir = choose({ c, r }, null);
      if (!dir || !canGo(maze, { c, r }, dir)) return { c, r, dir: null, t: 0 };
    }
    const need = 1 - t;
    if (left < need) { t += left; left = 0; break; }
    left -= need;
    c += STEP[dir][0]; r += STEP[dir][1]; t = 0;
    if (onCell?.({ c, r })) return { c, r, dir: null, t: 0 };
    const next = choose({ c, r }, dir);
    dir = next && canGo(maze, { c, r }, next) ? next : null;
    if (!dir) return { c, r, dir: null, t: 0 };
  }
  return { c, r, dir, t };
}

/** ผู้เล่นกลับหลังหันได้ทันทีกลางทาง ไม่ต้องรอถึงกลางช่อง เด็กกดแล้วต้องเห็นผลทันที */
export function turnAround(w: Walker, want: Dir): Walker {
  if (!w.dir || REVERSE[w.dir] !== want || w.t === 0) return w;
  const [dx, dy] = STEP[w.dir];
  return { c: w.c + dx, r: w.r + dy, dir: want, t: 1 - w.t };
}

/** ทางเลือกของผู้เล่นที่กลางช่อง: ทางที่กดไว้ถ้าไปได้ ไม่งั้นเดินทางเดิมต่อ ไม่งั้นหยุด */
export const playerChoice = (maze: Maze, want: Dir | null) => (at: Cell, dir: Dir | null): Dir | null =>
  want && canGo(maze, at, want) ? want : dir && canGo(maze, at, dir) ? dir : null;

/** ระยะเดินจริง (BFS บนทางเดิน ไม่ทะลุผนัง) จากช่อง from ไปทุกช่อง; -1 = ไปไม่ถึง */
export function distances(maze: Maze, from: Cell): Int16Array {
  const out = new Int16Array(maze.cols * maze.rows).fill(-1);
  if (isWall(maze, from.c, from.r)) return out;
  out[from.r * maze.cols + from.c] = 0;
  const queue = [from];
  for (let i = 0; i < queue.length; i++) {
    const at = queue[i], d = out[at.r * maze.cols + at.c];
    for (const dir of DIRS) {
      if (!canGo(maze, at, dir)) continue;
      const next = { c: at.c + STEP[dir][0], r: at.r + STEP[dir][1] }, k = next.r * maze.cols + next.c;
      if (out[k] < 0) { out[k] = d + 1; queue.push(next); }
    }
  }
  return out;
}

/** ช่องทางเดินทั้งหมดที่ไปถึงได้จากจุดเริ่ม ใช้ตรวจว่าทุกเม็ดแสงเก็บได้จริง */
export function reachable(maze: Maze, from: Cell = maze.start): Set<string> {
  const d = distances(maze, from), out = new Set<string>();
  d.forEach((v, i) => { if (v >= 0) out.add(`${i % maze.cols},${Math.floor(i / maze.cols)}`); });
  return out;
}

/**
 * ทางเลือกของเพื่อนหุ่นที่กลางช่อง — ไม่กลับหลังถ้าไม่ใช่ทางตัน เลือกทางที่ทำให้ระยะ BFS ถึงเป้าหมายสั้นลง (หรือยาวขึ้นเมื่อหลบ)
 * targetDist = ระยะ BFS จากเป้าหมายไปทุกช่อง (คำนวณครั้งเดียวต่อเป้าหมาย ไม่ต้องทำทุกเฟรม)
 * wander = โอกาสเลือกทางสุ่ม ให้เด็กมีจังหวะหลบ; avoid = ช่องที่ห้ามเข้า (จุดเริ่ม จุดพัก ประตูวาร์ป)
 */
export function seekerChoice(maze: Maze, targetDist: Int16Array | null, away: boolean, wander: number, random: () => number, avoid: (at: Cell) => boolean = () => false) {
  return (at: Cell, dir: Dir | null): Dir | null => {
    const open = DIRS.filter(d => canGo(maze, at, d) && !avoid({ c: at.c + STEP[d][0], r: at.r + STEP[d][1] }));
    const forward = open.length > 1 && dir ? open.filter(d => d !== REVERSE[dir]) : open;
    if (!forward.length) return null;
    if (!targetDist || random() < wander) return forward[Math.floor(random() * forward.length)];
    const score = (d: Dir) => { const v = targetDist[(at.r + STEP[d][1]) * maze.cols + at.c + STEP[d][0]]; return v < 0 ? 999 : v; };
    return forward.reduce((best, d) => (away ? score(d) > score(best) : score(d) < score(best)) ? d : best);
  };
}

/** ระยะแตะกันระหว่างหุ่นลูกกลมกับเพื่อนหุ่น (หน่วยช่อง) */
export const TOUCH = 0.55;
export function touching(a: { x: number; y: number }, b: { x: number; y: number }) { return Math.hypot(a.x - b.x, a.y - b.y) < TOUCH; }
