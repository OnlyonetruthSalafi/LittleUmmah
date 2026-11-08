'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, type PointerEvent } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import type { ArtPicture } from '../data';
import { PAINT_WIDTH, PAINT_HEIGHT, picturePoint, interpolate, type Point } from '../paint';
import { PaintRenderer } from './paint-renderer';

export type PaintSurfaceHandle = {
  undo: () => void; end: () => void; isPainting: () => boolean;
  fromTray: (event: PointerEvent<HTMLElement>, color: string) => boolean;
  move: (event: PointerEvent<HTMLElement>) => void;
  release: (event: PointerEvent<HTMLElement>) => void;
};
type Props = {
  picture: ArtPicture; color: string; readOnly: boolean;
  onHistory: (count: number) => void; onBrush: (point: Point | null) => void;
};

export const PaintSurface = forwardRef<PaintSurfaceHandle, Props>(function PaintSurface({ picture, color, readOnly, onHistory, onBrush }, ref) {
  const { pick } = useDict();
  const surface = useRef<HTMLCanvasElement>(null), lines = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<PaintRenderer | null>(null);
  const pointer = useRef<number | null>(null);
  const capture = useRef<HTMLElement | null>(null);
  const pending = useRef<{ previous: Point; color: string } | null>(null);
  const sequence = useRef(1);
  useEffect(() => {
    const engine = new PaintRenderer(picture, surface.current!, lines.current!);
    renderer.current = engine;
    return () => { engine.dispose(); renderer.current = null; };
  }, [picture]);

  const end = () => {
    const id = pointer.current; pointer.current = null;
    pending.current = null;
    if (id !== null && capture.current?.hasPointerCapture(id)) capture.current.releasePointerCapture(id);
    capture.current = null;
    renderer.current?.end(); onHistory(renderer.current?.history.length ?? 0); onBrush(null);
  };
  useImperativeHandle(ref, () => ({
    undo: () => { end(); renderer.current?.undo(); onHistory(renderer.current?.history.length ?? 0); }, end,
    isPainting: () => pointer.current !== null,
    fromTray: (event, selectedColor) => {
      if (readOnly || pointer.current !== null || !event.isPrimary || event.button !== 0) return false;
      event.preventDefault();
      pointer.current = event.pointerId; capture.current = event.currentTarget;
      event.currentTarget.setPointerCapture(event.pointerId);
      pending.current = { previous: { x: event.clientX, y: event.clientY }, color: selectedColor };
      onBrush(pending.current.previous);
      return true;
    },
    move, release,
  }));

  const down = (event: PointerEvent<HTMLCanvasElement>) => {
    if (readOnly || pointer.current !== null || !event.isPrimary || event.button !== 0) return;
    const engine = renderer.current; if (!engine) return;
    const point = picturePoint({ x: event.clientX, y: event.clientY }, event.currentTarget.getBoundingClientRect());
    const region = engine.hit(point); if (region < 0) return;
    event.preventDefault(); pointer.current = event.pointerId;
    capture.current = event.currentTarget;
    event.currentTarget.setPointerCapture(event.pointerId);
    engine.begin({ region, color, seed: sequence.current++, points: [point] });
    onBrush({ x: event.clientX, y: event.clientY });
  };
  function move(event: PointerEvent<HTMLElement>) {
    if (readOnly || (pointer.current !== null && pointer.current !== event.pointerId)) return;
    if (pointer.current === event.pointerId) {
      const rect = surface.current!.getBoundingClientRect();
      const native = event.nativeEvent;
      const samples = typeof native.getCoalescedEvents === 'function' ? native.getCoalescedEvents() : [];
      for (const sample of samples.length ? samples : [native]) {
        const client = { x: sample.clientX, y: sample.clientY };
        const point = picturePoint(client, rect);
        const waiting = pending.current;
        if (waiting) {
          // Inspect the swept segment, so a fast move still selects the first entered piece.
          for (const next of interpolate(picturePoint(waiting.previous, rect), point, 1)) {
            if (next.x < 0 || next.x > 400 || next.y < 0 || next.y > 300) continue;
            const region = renderer.current?.hit(next) ?? -1;
            if (region < 0) continue;
            renderer.current?.begin({ region, color: waiting.color, seed: sequence.current++, points: [next] });
            pending.current = null;
            break;
          }
          waiting.previous = client;
        }
        if (!pending.current) renderer.current?.move(point);
      }
    }
    if (pointer.current === event.pointerId || event.pointerType === 'mouse') onBrush({ x: event.clientX, y: event.clientY });
  }
  function release(event: PointerEvent<HTMLElement>) { if (pointer.current === event.pointerId) end(); }

  // Enter/Space และคำสั่ง click จากเทคโนโลยีช่วยเหลือใช้ทางเดียวกัน
  const paintWhole = (index: number) => {
    if (readOnly || pointer.current !== null) return;
    renderer.current?.begin({ region: index, color, seed: sequence.current++, points: [], whole: true });
    renderer.current?.end(); onHistory(renderer.current?.history.length ?? 0);
  };

  return <div className="art-paper">
    <canvas ref={surface} className="art-paint" width={PAINT_WIDTH} height={PAINT_HEIGHT} role="img" aria-label={pick(picture.title)}
      onPointerDown={down} onPointerMove={move}
      onPointerUp={event => { if (pointer.current === event.pointerId) end(); }}
      onPointerCancel={event => { if (pointer.current === event.pointerId) end(); }}
      onLostPointerCapture={event => { if (pointer.current === event.pointerId) end(); }}
      onPointerLeave={() => { if (pointer.current === null) onBrush(null); }} />
    <canvas ref={lines} className="art-lines" width={PAINT_WIDTH} height={PAINT_HEIGHT} aria-hidden="true" />
    <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="art-keyboard" role="group" aria-label={pick(picture.title)} aria-hidden={readOnly || undefined}>
      {picture.regions.map((region, index) => <path key={region.id} d={region.d} fillRule="evenodd" role="button" tabIndex={readOnly ? -1 : 0}
        aria-label={pick(region.label)} onClick={() => paintWhole(index)} onKeyDown={event => {
          if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
          event.preventDefault();
          paintWhole(index);
        }} />)}
    </svg>
  </div>;
});
