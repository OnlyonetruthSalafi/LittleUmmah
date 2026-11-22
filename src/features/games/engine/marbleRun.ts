import scenery from '../data/marble-course.json' with { type: 'json' };

export type Direction = -1 | 0 | 1;
export type Peg = { x: number; y: number };

function unpack([x, y]: number[]): Peg { return { x, y }; }

// Blender projects the ball's centre, the switch pivots and the bowl openings with the railway camera.
export function marbleMachine(level: number) {
  const course = scenery.courses[level === 1 ? 0 : 1];
  const rotor = scenery.rotors[level - 1];
  return {
    intake: unpack(course.intake),
    rotor: { pivot: unpack(rotor.pivot), width: rotor.width, height: rotor.height },
    gates: course.gates.map(unpack),
    cups: course.cups.map(unpack),
    tracks: course.tracks.map(fork => fork.map(path => path.map(unpack))),
    goals: level === 1 ? [0, 1] : level === 2 ? [3, 0] : [1, 3, 2],
  };
}

type Machine = ReturnType<typeof marbleMachine>;
export function branch(machine: Machine, gate: number, dir: Exclude<Direction, 0>) {
  const side = dir === 1 ? 1 : 0;
  const track = machine.tracks[gate][side];
  if (machine.gates.length === 3 && gate === 0) {
    return { track, to: machine.gates[1 + side], next: 1 + side, cup: -1 };
  }
  const cup = Math.max(0, gate - 1) * 2 + side;
  return { track, to: machine.cups[cup], next: -1, cup };
}

// A fork can be ignored when its branch does not lead to this delivery's cup.
export function nextMarbleGate(machine: Machine, dirs: Direction[], target: number): number | null {
  function search(gate: number): number | null | undefined {
    for (const dir of [-1, 1] as const) {
      const { next, cup } = branch(machine, gate, dir);
      const downstream = next >= 0 ? search(next) : cup === target ? null : undefined;
      if (downstream !== undefined) return dirs[gate] === dir ? downstream : gate;
    }
    return undefined;
  }
  return search(0) ?? null;
}

export function followMarble(machine: Machine, dirs: Direction[]) {
  const points = [machine.intake, machine.gates[0]];
  let gate = 0;
  for (;;) {
    const dir = dirs[gate];
    if (!dir) {
      points.push({ x: machine.gates[gate].x, y: machine.gates[gate].y + 52 });
      return { points, cup: -1 };
    }
    const { track, to, next, cup } = branch(machine, gate, dir);
    points.push(...track.slice(1), to);
    if (next < 0) return { points, cup };
    gate = next;
  }
}

export function rollPosition(points: Peg[], distance: number): Peg {
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    if (distance <= length) {
      const t = distance / length;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    distance -= length;
  }
  return points[points.length - 1];
}
