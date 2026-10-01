import assert from 'node:assert/strict';
import test from 'node:test';
import { MAZE_LEVELS, parseMaze, reachable, distances, cellKey, isWall, walk, walkerAt, walkerPos, playerChoice, turnAround, seekerChoice, touching } from '../src/features/games/data/lightMaze.ts';
import { createSim, stepSim, steer, beadsLeft } from '../src/features/games/engine/lightMazeSim.ts';

for (const [i, level] of MAZE_LEVELS.entries()) test(`light-maze level ${i + 1}: closed border, every path cell reachable, homes far from start`, () => {
  const maze = parseMaze(level.map);
  for (let c = 0; c < maze.cols; c++) assert.ok(isWall(maze, c, 0) && isWall(maze, c, maze.rows - 1));
  for (let r = 0; r < maze.rows; r++) assert.ok(isWall(maze, 0, r) && isWall(maze, maze.cols - 1, r));
  const open = reachable(maze);
  const walkable = maze.walls.filter(w => !w).length;
  assert.equal(open.size, walkable, 'every walkable cell reachable without portals');
  assert.ok(maze.lights.length >= 30);
  assert.ok(maze.crystal, 'crystal pillar in the middle like the mock');
  assert.equal(maze.homes.length, [0, 2, 3][i]);
  if (i > 0) assert.deepEqual(maze.items.map(x => x.kind).sort(), ['clock', 'shield', 'star']);
  if (i > 0) assert.ok(maze.portals && maze.checkpoints.length === 1);
  const fromStart = distances(maze, maze.start);
  for (const h of maze.homes) assert.ok(fromStart[h.cell.r * maze.cols + h.cell.c] >= 6, `${h.id} home too close`);
  // เพื่อนหุ่นไม่ต้องเร็วกว่าเด็ก
  assert.ok(level.rules.seekerSpeed < level.rules.playerSpeed);
});

test('parser rejects broken maps', () => {
  assert.throws(() => parseMaze(['###', '#P#', '##']), /columns/);
  assert.throws(() => parseMaze(['####', '#PX#', '####']), /unknown/);
  assert.throws(() => parseMaze(['####', '#PP#', '####']), /two starts/);
  assert.throws(() => parseMaze(['####', '#PA#', '####']), /portal/);
  assert.throws(() => parseMaze(['###', '#.#', '###']), /no start/);
});

const TINY = ['#######', '#P....#', '#.#.#.#', '#.....#', '#######'];

test('player walks, stops at walls, reverses mid-way and never passes walls', () => {
  const maze = parseMaze(TINY);
  const seen = [];
  let w = walk(maze, walkerAt(maze.start), 2.5, playerChoice(maze, 'right'), at => { seen.push(cellKey(at)); });
  assert.deepEqual(seen, ['2,1', '3,1']);
  assert.deepEqual(walkerPos(w), { x: 3.5, y: 1 });
  w = turnAround(w, 'left');
  assert.deepEqual(walkerPos(w), { x: 3.5, y: 1 });
  w = walk(maze, w, 10, playerChoice(maze, 'left'));
  assert.deepEqual(w, { c: 1, r: 1, dir: null, t: 0 });
  assert.deepEqual(walk(maze, walkerAt(maze.start), 1, playerChoice(maze, 'up')), { c: 1, r: 1, dir: null, t: 0 });
  const far = walk(maze, walkerAt(maze.start), 999, playerChoice(maze, 'right'));
  assert.ok(!isWall(maze, far.c, far.r));
});

test('seekers follow real paths (BFS), flee when asked and avoid safe cells', () => {
  const maze = parseMaze(TINY);
  const target = distances(maze, { c: 1, r: 3 });
  // มาจากทางขวา (เดินไปทางซ้าย) ไม่กลับหลัง เหลือทางซ้ายกับทางขึ้น
  assert.equal(seekerChoice(maze, target, false, 0, () => 0.9)({ c: 3, r: 3 }, 'left'), 'left');
  assert.equal(seekerChoice(maze, target, true, 0, () => 0.9)({ c: 3, r: 3 }, 'left'), 'up');
  assert.equal(seekerChoice(maze, target, false, 0, () => 0.9, at => at.c === 2 && at.r === 3)({ c: 3, r: 3 }, 'left'), 'up');
  assert.ok(touching({ x: 2, y: 3 }, { x: 2.5, y: 3 }));
  assert.ok(!touching({ x: 2, y: 3 }, { x: 3, y: 3 }));
});

const run = (sim, seconds, rnd = () => 0.5) => { const events = []; for (let t = 0; t < seconds; t += 1 / 60) events.push(...stepSim(sim, 1 / 60, rnd)); return events; };

test('collecting every bead completes exactly once; seekers wait until the child moves', () => {
  const sim = createSim({ theme: 'neon', th: '', en: '', map: TINY, rules: { playerSpeed: 3, seekerSpeed: 0, powerSeconds: 5, slowSeconds: 5 } });
  assert.equal(beadsLeft(sim), 12);
  const events = [];
  // ขวาสุด → ลง → ซ้ายสุด → ขึ้น → ขวาแล้วเลี้ยวลงที่ทางแยกกลาง (กดทิศล่วงหน้า หุ่นเลี้ยวเองเมื่อถึง)
  for (const [dirs, sec] of [[['right'], 2], [['down'], 1], [['left'], 2], [['up'], 1], [['right', 'down'], 2]]) { for (const d of dirs) { steer(sim, d); events.push(...run(sim, 0.15)); } events.push(...run(sim, sec)); }
  assert.equal(beadsLeft(sim), 0);
  assert.equal(events.filter(e => e === 'complete').length, 1);
  assert.deepEqual(run(sim, 1), []);
});

const ARENA = ['#########', '#P......#', '#.#####.#', '#S.*H..1#', '#########'];

test('bump sends the robot to the last rest spot and keeps collected beads; shield and star protect', () => {
  const level = { theme: 'grove', th: '', en: '', map: ARENA, rules: { playerSpeed: 3, seekerSpeed: 2, powerSeconds: 6, slowSeconds: 5 } };
  let sim = createSim(level);
  steer(sim, 'right');
  const events = run(sim, 8, () => 0);
  assert.ok(events.includes('bump'), 'red friend catches the robot on the top corridor');
  assert.ok(sim.collected.size > 0 && beadsLeft(sim) < 11, 'collected beads stay collected');
  assert.equal(sim.player.dir, null);

  sim = createSim(level);
  sim.shield = 1; steer(sim, 'right');
  const shielded = run(sim, 8, () => 0);
  assert.ok(shielded.indexOf('shieldUsed') >= 0 && shielded.indexOf('shieldUsed') < (shielded.indexOf('bump') + 1 || Infinity));
  assert.equal(sim.shield, 0);

  sim = createSim(level);
  steer(sim, 'down'); const powered = run(sim, 1.2);
  steer(sim, 'right'); powered.push(...run(sim, 1.5, () => 0));
  assert.ok(powered.includes('checkpoint') && powered.includes('star') && powered.includes('shield'));
  const later = run(sim, 4, () => 0);
  assert.ok(!later.includes('bump'), 'friends yield while light power is on');
});

test('portals teleport to the partner and do not bounce straight back', () => {
  const sim = createSim({ theme: 'sky', th: '', en: '', map: ['#######', '#PA...#', '#.###.#', '#....B#', '#######'], rules: { playerSpeed: 3, seekerSpeed: 0, powerSeconds: 5, slowSeconds: 5 } });
  steer(sim, 'right');
  const events = run(sim, 0.5);
  assert.deepEqual(events.filter(e => e === 'warp').length, 1);
  assert.deepEqual({ c: sim.player.c, r: sim.player.r }, { c: 5, r: 3 });
});
