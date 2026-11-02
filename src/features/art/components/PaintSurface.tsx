'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, type PointerEvent } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import type { ArtPicture } from '../data';
import { PAINT_WIDTH, PAINT_HEIGHT, picturePoint, type Point } from '../paint';
import { PaintRenderer } from './paint-renderer';

export type PaintSurfaceHandle = { undo: () => void; end: () => void; isPainting: () => boolean };
type Props = {
  picture: ArtPicture; color: string; readOnly: boolean;
  onHistory: (count: number) => void; onBrush: (point: Point | null) => void;
};

export const PaintSurface = forwardRef<PaintSurfaceHandle, Props>(function PaintSurface({ picture, color, readOnly, onHistory, onBrush }, ref) {
  const { pick } = useDict();
  const surface = useRef<HTMLCanvasElement>(null), lines = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<PaintRenderer | null>(null);
  const pointer = useRef<number | null>(null);
  const sequence = useRef(1);
  useEffect(() => {
    const engine = new PaintRenderer(picture, surface.current!, lines.current!);
    renderer.current = engine;
    return () => { engine.dispose(); renderer.current = null; };
  }, [picture]);

  const end = () => {
    const id = pointer.current; pointer.current = null;
    if (id !== null && surface.current?.hasPointerCapture(id)) surface.current.releasePointerCapture(id);
    renderer.current?.end(); onHistory(renderer.current?.history.length ?? 0); onBrush(null);
  };
  useImperativeHandle(ref, () => ({
    undo: () => { end(); renderer.current?.undo(); onHistory(renderer.current?.history.length ?? 0); }, end,
    isPainting: () => pointer.current !== null,
  }));

  const down = (event: PointerEvent<HTMLCanvasElement>) => {
    if (readOnly || pointer.current !== null || !event.isPrimary || event.button !== 0) return;
    const engine = renderer.current; if (!engine) return;
    const point = picturePoint({ x: event.clientX, y: event.clientY }, event.currentTarget.getBoundingClientRect());
    const region = engine.hit(point); if (region < 0) return;
    event.preventDefault(); pointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    engine.begin({ region, color, seed: sequence.current++, points: [point] });
    onBrush({ x: event.clientX, y: event.clientY });
  };
  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (readOnly || (pointer.current !== null && pointer.current !== event.pointerId)) return;
    if (pointer.current === event.pointerId) {
      const rect = event.currentTarget.getBoundingClientRect();
      const native = event.nativeEvent;
      const samples = typeof native.getCoalescedEvents === 'function' ? native.getCoalescedEvents() : [];
      for (const sample of samples.length ? samples : [native]) {
        renderer.current?.move(picturePoint({ x: sample.clientX, y: sample.clientY }, rect));
      }
    }
    if (pointer.current === event.pointerId || event.pointerType === 'mouse') onBrush({ x: event.clientX, y: event.clientY });
  };

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
