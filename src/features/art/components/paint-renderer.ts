import type { ArtPicture } from '../data';
import { PAINT_WIDTH, PAINT_HEIGHT, brushBristles, interpolate, keyboardRows, pushHistory, type PaintStroke, type Point } from '../paint';

const SCALE = PAINT_WIDTH / 400;
const canvas = () => { const c = document.createElement('canvas'); c.width = PAINT_WIDTH; c.height = PAINT_HEIGHT; return c; };
const context = (c: HTMLCanvasElement) => c.getContext('2d')!;

/** Owns raster caches, never reads pixels in the drawing loop. */
export class PaintRenderer {
  readonly paths: Path2D[];
  readonly masks = new Map<number, HTMLCanvasElement>();
  readonly committed = canvas();
  readonly baked = canvas();
  readonly ink = canvas();
  readonly clipped = canvas();
  history: PaintStroke[] = [];
  active: PaintStroke | null = null;
  private stamp: HTMLCanvasElement | null = null;
  private raf = 0;

  constructor(readonly picture: ArtPicture, readonly surface: HTMLCanvasElement, readonly lines: HTMLCanvasElement) {
    this.paths = picture.regions.map(region => new Path2D(region.d));
    const ctx = context(lines);
    // React StrictMode sets effects up twice on the same DOM canvas in development.
    ctx.resetTransform(); ctx.clearRect(0, 0, PAINT_WIDTH, PAINT_HEIGHT);
    ctx.scale(SCALE, SCALE);
    ctx.lineWidth = 3.5; ctx.strokeStyle = '#1c2b3a'; ctx.lineJoin = 'round';
    for (const path of this.paths) {
      ctx.globalCompositeOperation = 'destination-out'; ctx.fill(path, 'evenodd');
      ctx.globalCompositeOperation = 'source-over'; ctx.stroke(path);
    }
    if (picture.lines) ctx.stroke(new Path2D(picture.lines));
  }

  hit(point: Point) {
    const ctx = context(this.ink);
    ctx.save(); ctx.resetTransform(); ctx.lineWidth = 26;
    let hit = -1;
    for (let i = this.paths.length - 1; i >= 0; i--) {
      if (ctx.isPointInPath(this.paths[i], point.x, point.y, 'evenodd') ||
        (this.picture.regions[i].thin && ctx.isPointInStroke(this.paths[i], point.x, point.y))) { hit = i; break; }
    }
    ctx.restore(); return hit;
  }

  private mask(region: number) {
    let mask = this.masks.get(region);
    if (!mask) {
      mask = canvas(); const ctx = context(mask); ctx.scale(SCALE, SCALE);
      ctx.fill(this.paths[region], 'evenodd'); ctx.globalCompositeOperation = 'destination-out';
      for (let i = region + 1; i < this.paths.length; i++) ctx.fill(this.paths[i], 'evenodd');
      this.masks.set(region, mask);
    }
    return mask;
  }

  private makeStamp(stroke: PaintStroke) {
    const c = document.createElement('canvas'); c.width = c.height = 80;
    const ctx = context(c); ctx.scale(SCALE, SCALE); ctx.translate(16, 16); ctx.fillStyle = ctx.strokeStyle = stroke.color;
    ctx.globalAlpha = .035; ctx.beginPath(); ctx.ellipse(0, 0, 11, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.lineCap = 'round';
    for (const bristle of brushBristles(stroke.seed)) {
      ctx.globalAlpha = bristle.alpha;
      ctx.lineWidth = bristle.width; ctx.beginPath();
      ctx.moveTo(bristle.x, bristle.y - bristle.length / 2); ctx.lineTo(bristle.x, bristle.y + bristle.length / 2); ctx.stroke();
    }
    return c;
  }

  private dab(point: Point) {
    if (this.stamp) context(this.ink).drawImage(this.stamp, point.x * SCALE - 40, point.y * SCALE - 40);
  }

  begin(stroke: PaintStroke) {
    this.active = stroke; this.stamp = this.makeStamp(stroke);
    context(this.ink).clearRect(0, 0, PAINT_WIDTH, PAINT_HEIGHT);
    if (stroke.whole) {
      for (const row of keyboardRows()) for (const point of [row[0], ...interpolate(row[0], row[1])]) this.dab(point);
    } else if (stroke.points[0]) {
      // A tap leaves one visible bristled dab, never a region fill.
      for (let i = 0; i < 4; i++) this.dab(stroke.points[0]);
    }
    this.schedule();
  }

  move(point: Point) {
    if (!this.active) return;
    const previous = this.active.points.at(-1)!;
    for (const next of interpolate(previous, point)) this.dab(next);
    this.active.points.push(point); this.schedule();
  }

  private clip() {
    const ctx = context(this.clipped);
    ctx.clearRect(0, 0, PAINT_WIDTH, PAINT_HEIGHT);
    ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(this.ink, 0, 0);
    ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(this.mask(this.active!.region), 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }

  render() {
    const ctx = context(this.surface); ctx.clearRect(0, 0, PAINT_WIDTH, PAINT_HEIGHT); ctx.drawImage(this.committed, 0, 0);
    if (this.active) { this.clip(); ctx.drawImage(this.clipped, 0, 0); }
  }

  private schedule() {
    if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.render(); });
  }

  end() {
    if (!this.active) return;
    this.clip(); context(this.committed).drawImage(this.clipped, 0, 0);
    const { history, baked } = pushHistory(this.history, this.active);
    this.history = history; this.active = null;
    if (baked) this.replay(baked, this.baked);
    this.render();
  }

  private replay(stroke: PaintStroke, destination: HTMLCanvasElement) {
    this.begin({ ...stroke, points: stroke.points.slice(0, 1) });
    if (!stroke.whole) for (const point of stroke.points.slice(1)) this.move(point);
    this.clip(); context(destination).drawImage(this.clipped, 0, 0); this.active = null;
  }

  undo() {
    this.active = null; this.history.pop();
    const ctx = context(this.committed); ctx.clearRect(0, 0, PAINT_WIDTH, PAINT_HEIGHT); ctx.drawImage(this.baked, 0, 0);
    for (const stroke of this.history) this.replay(stroke, this.committed);
    this.render();
  }

  dispose() { cancelAnimationFrame(this.raf); this.masks.clear(); }
}
