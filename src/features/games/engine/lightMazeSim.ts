/* จำลองเกมเขาวงกตแสงทีละก้าว — ไม่มี DOM ไม่มีภาพ ทดสอบได้ใน tests/light-maze.test.mjs
 * Board เรียก stepSim ทุกเฟรม แล้วอ่าน events ไปเล่นเสียง/อัปเดตตัวนับ ไม่เรียก feedback ทุกเฟรม
 * กติกาใจดีตาม output/orbmaze-plan/PLAN.md §3: ไม่มีชีวิต ไม่มีเกมโอเวอร์ โดนแตะกลับจุดพักล่าสุด เม็ดแสงไม่หาย
 */
import { STEP, canGo, cellKey, distances, parseMaze, playerChoice, sameCell, seekerChoice, touching, turnAround, walk, walkerAt, walkerCell, walkerPos, type Cell, type Dir, type Level, type Maze, type SeekerId, type Walker } from '../data/lightMaze.ts';

export type SeekerMode = 'docked' | 'active' | 'returning';
export type Seeker = { id: SeekerId; w: Walker; home: Cell; mode: SeekerMode; dockUntil: number; pauseUntil: number; nextPause: number };
export type SimEvent = 'bead' | 'star' | 'clock' | 'shield' | 'shieldUsed' | 'warp' | 'checkpoint' | 'bump' | 'yield' | 'complete';
export type Sim = {
  maze: Maze; level: Level;
  player: Walker; want: Dir | null; started: boolean; done: boolean;
  seekers: Seeker[]; clock: number;
  collected: Set<string>; taken: Set<string>; checkpoint: Cell;
  powerUntil: number; slowUntil: number; shield: number; safeUntil: number; warpUntil: number;
  /** ทิศล่าสุดที่หุ่นลูกกลมหันไป (ใช้เลือกภาพ) */
  facing: Dir;
  /** ระยะ BFS ที่คำนวณไว้แล้ว key = ช่อง */
  cache: Map<string, Int16Array>;
};

/** เพื่อนหุ่นออกจากแท่นชาร์จหลังเด็กเริ่มเดินกี่วินาที และพักกี่วินาทีเมื่อกลับแท่น */
const WAKE = 3, DOCK = 3;

export function createSim(level: Level): Sim {
  const maze = parseMaze(level.map);
  return {
    maze, level, player: walkerAt(maze.start), want: null, started: false, done: false,
    seekers: maze.homes.map(h => ({ id: h.id, w: walkerAt(h.cell), home: h.cell, mode: 'docked', dockUntil: WAKE, pauseUntil: 0, nextPause: 2 })),
    clock: 0, collected: new Set(), taken: new Set(), checkpoint: maze.start,
    powerUntil: 0, slowUntil: 0, shield: 0, safeUntil: 0, warpUntil: 0, facing: 'right', cache: new Map(),
  };
}

export const beadsLeft = (sim: Sim) => sim.maze.lights.length - sim.collected.size;
export const powered = (sim: Sim) => sim.clock < sim.powerUntil;
export const slowed = (sim: Sim) => sim.clock < sim.slowUntil;

function distFrom(sim: Sim, cell: Cell) {
  const key = cellKey(cell);
  let d = sim.cache.get(key);
  if (!d) { d = distances(sim.maze, cell); sim.cache.set(key, d); }
  return d;
}

/** เด็กกดทิศ — เริ่มเกม และกลับหลังได้ทันทีกลางทาง */
export function steer(sim: Sim, dir: Dir) {
  if (sim.done) return;
  if (!sim.started) { sim.started = true; for (const s of sim.seekers) s.dockUntil = sim.clock + WAKE; }
  sim.want = dir;
  sim.player = turnAround(sim.player, dir);
}

/** ช่องปลอดภัยที่เพื่อนหุ่นไม่เข้า: จุดเริ่ม จุดพัก ประตูวาร์ป */
function safeCell(sim: Sim, at: Cell) {
  const m = sim.maze;
  return sameCell(at, m.start) || m.checkpoints.some(c => sameCell(c, at)) || !!m.portals?.some(p => sameCell(p, at));
}

export function stepSim(sim: Sim, dt: number, random: () => number = Math.random): SimEvent[] {
  const events: SimEvent[] = [];
  if (sim.done) return events;
  sim.clock += dt;
  const m = sim.maze, rules = sim.level.rules;

  // ── หุ่นลูกกลม ──
  let warpTo: Cell | null = null;
  sim.player = walk(m, sim.player, rules.playerSpeed * dt, playerChoice(m, sim.want), at => {
    const key = cellKey(at);
    if (m.lights.some(l => sameCell(l, at)) && !sim.collected.has(key)) { sim.collected.add(key); events.push('bead'); }
    const item = m.items.find(i => sameCell(i.cell, at));
    if (item && !sim.taken.has(key)) {
      sim.taken.add(key);
      if (item.kind === 'star') sim.powerUntil = sim.clock + rules.powerSeconds;
      if (item.kind === 'clock') sim.slowUntil = sim.clock + rules.slowSeconds;
      if (item.kind === 'shield') sim.shield = 1;
      events.push(item.kind);
    }
    if (m.checkpoints.some(c => sameCell(c, at)) && !sameCell(sim.checkpoint, at)) { sim.checkpoint = at; events.push('checkpoint'); }
    const portal = m.portals?.findIndex(p => sameCell(p, at)) ?? -1;
    if (portal >= 0 && sim.clock >= sim.warpUntil && m.portals) {
      // ออกจากประตูอีกฝั่ง เดินต่อทิศเดิม ปลอดภัยสักครู่ กันเด้งกลับทันที
      warpTo = m.portals[1 - portal];
      sim.warpUntil = sim.clock + 1;
      sim.safeUntil = Math.max(sim.safeUntil, sim.clock + 1.5);
      events.push('warp');
      return true;
    }
  });
  if (warpTo) sim.player = walkerAt(warpTo);
  if (sim.player.dir) sim.facing = sim.player.dir;
  // เม็ดสุดท้ายชนะก่อนตรวจการแตะในเฟรมเดียวกัน
  if (beadsLeft(sim) === 0) { sim.done = true; events.push('complete'); return events; }

  // ── เพื่อนหุ่น ──
  const me = walkerPos(sim.player), myCell = walkerCell(sim.player);
  const myDist = distFrom(sim, myCell);
  const power = powered(sim), slow = slowed(sim);
  for (const s of sim.seekers) {
    if (s.mode === 'docked') {
      if (sim.started && sim.clock >= s.dockUntil && !power) s.mode = 'active';
      else continue;
    }
    const speed = rules.seekerSpeed * (slow ? 0.5 : 1) * (s.mode === 'returning' ? 1.4 : power ? 0.6 : 1);
    if (s.mode === 'returning') {
      s.w = walk(m, s.w, speed * dt, seekerChoice(m, distFrom(sim, s.home), false, 0, random));
      if (!s.w.dir && sameCell(s.w, s.home)) { s.mode = 'docked'; s.dockUntil = Math.max(sim.clock + DOCK, sim.powerUntil); }
      continue;
    }
    if (s.id === 'green') {
      // เดิน 2 วินาที พัก 1 วินาที เลือกทางสุ่มที่ทางแยก
      if (sim.clock < s.pauseUntil) continue;
      if (sim.clock >= s.nextPause) { s.pauseUntil = sim.clock + 1; s.nextPause = sim.clock + 3; continue; }
    }
    const at = walkerCell(s.w), gap = myDist[at.r * m.cols + at.c];
    let target: Int16Array | null = null, wander = 0.25;
    if (power) { target = myDist; }
    else if (s.id === 'red') { target = gap >= 0 && gap <= 5 ? myDist : distFrom(sim, s.home); wander = gap <= 5 ? 0.2 : 0.5; }
    else if (s.id === 'violet') { target = distFrom(sim, s.home); wander = 0.6; }
    else if (s.id === 'blue') {
      if (gap >= 0 && gap <= 6) {
        // เล็งช่องที่หุ่นลูกกลมจะไปถึงอีกสองช่อง หยุดที่ผนัง
        let ahead = myCell;
        const dir = sim.player.dir ?? sim.facing;
        for (let i = 0; i < 2 && canGo(m, ahead, dir); i++) ahead = { c: ahead.c + STEP[dir][0], r: ahead.r + STEP[dir][1] };
        target = distFrom(sim, ahead);
      } else { target = distFrom(sim, s.home); wander = 0.5; }
    } else { target = null; wander = 1; }
    s.w = walk(m, s.w, speed * dt, seekerChoice(m, target, power, power ? 0.1 : wander, random, cell => safeCell(sim, cell)));
    if (!touching(me, walkerPos(s.w))) continue;
    if (power) { s.mode = 'returning'; events.push('yield'); }
    else if (sim.clock < sim.safeUntil) continue;
    else if (sim.shield) { sim.shield = 0; sim.safeUntil = sim.clock + 2; events.push('shieldUsed'); }
    else {
      // โดนแตะ: กลับจุดพักล่าสุด เพื่อนกลับแท่นแล้วพัก เด็กปลอดภัยสักครู่ ไม่มีอะไรหาย
      sim.player = walkerAt(sim.checkpoint); sim.want = null;
      for (const o of sim.seekers) { o.w = walkerAt(o.home); o.mode = 'docked'; o.dockUntil = sim.clock + DOCK; }
      sim.safeUntil = sim.clock + 4;
      events.push('bump');
      break;
    }
  }
  return events;
}

