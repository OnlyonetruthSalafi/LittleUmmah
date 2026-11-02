/** Pure brush geometry. Coordinates are in the original 400 × 300 picture. */
export const PAINT_WIDTH = 1000;
export const PAINT_HEIGHT = 750;
export const BRUSH_WIDTH = 26;
export const UNDO_LIMIT = 16;
export type Point = { x: number; y: number };
export type PaintStroke = { region: number; color: string; seed: number; points: Point[]; whole?: boolean };

export function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let n = value;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

/** Excludes the start (already painted), includes the endpoint, even for a fast fling. */
export function interpolate(from: Point, to: Point, spacing = 2): Point[] {
  const count = Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / Math.max(.25, spacing));
  return Array.from({ length: count }, (_, i) => ({
    x: from.x + (to.x - from.x) * (i + 1) / count,
    y: from.y + (to.y - from.y) * (i + 1) / count,
  }));
}

export function brushBristles(seed: number) {
  const random = seededRandom(seed);
  return Array.from({ length: 35 }, (_, i) => ({
    x: (i / 34 - .5) * BRUSH_WIDTH + (random() - .5) * .5,
    y: (random() - .5) * 3,
    length: 4 + random() * 5,
    width: .35 + random() * .65,
    alpha: .1 + random() * .17,
  }));
}

export function picturePoint(client: Point, rect: { left: number; top: number; width: number; height: number }): Point {
  return { x: (client.x - rect.left) * 400 / rect.width, y: (client.y - rect.top) * 300 / rect.height };
}

export function keyboardRows(): Point[][] {
  // Parallel sweeps overlap: every visible pixel gets textured paint, including tiny regions.
  const random = seededRandom(731);
  return Array.from({ length: 78 }, (_, row) => {
    const y = -4 + row * 4 + random() * .7;
    return row % 2 ? [{ x: 412, y }, { x: -12, y }] : [{ x: -12, y }, { x: 412, y }];
  });
}

export function pushHistory<T>(history: T[], entry: T, limit = UNDO_LIMIT): { history: T[]; baked?: T } {
  const next = [...history, entry];
  return next.length > limit ? { history: next.slice(1), baked: next[0] } : { history: next };
}
