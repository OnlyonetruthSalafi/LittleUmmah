'use client';
import { useRef, type ReactNode, type PointerEvent } from 'react';
export function DragItem({ id, label, selected, disabled, onSelect, onDrop, children }: { id: string; label: string; selected: boolean; disabled?: boolean; onSelect: () => void; onDrop: (id: string, target: string) => void; children: ReactNode }) {
  const drag = useRef<{ x: number; y: number; moved: boolean; pointerId: number } | null>(null);
  const suppressClick = useRef(false);
  const reset = (element: HTMLButtonElement) => { element.style.translate = ''; element.style.zIndex = ''; element.removeAttribute('data-dragging'); drag.current = null; };
  const finish = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const element = event.currentTarget;
    if (current.moved) {
      suppressClick.current = true;
      element.style.pointerEvents = 'none';
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-drop-id]');
      element.style.pointerEvents = '';
      if (target && !target.hasAttribute('disabled')) onDrop(id, target.dataset.dropId!);
    }
    reset(element);
  };
  return <button type="button" className="gc-drag gc-object-button" disabled={disabled} aria-label={label} aria-pressed={selected} data-item-id={id}
    onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } onSelect(); }}
    onPointerDown={event => { if (event.button !== 0 || !event.isPrimary) return; suppressClick.current = false; drag.current = { x: event.clientX, y: event.clientY, moved: false, pointerId: event.pointerId }; event.currentTarget.setPointerCapture(event.pointerId); }}
    onPointerMove={event => { const current = drag.current; if (!current || current.pointerId !== event.pointerId) return; const dx = event.clientX - current.x, dy = event.clientY - current.y; if (Math.hypot(dx, dy) > 7) current.moved = true; if (current.moved) { event.currentTarget.style.translate = `${dx}px ${dy}px`; event.currentTarget.style.zIndex = '30'; event.currentTarget.dataset.dragging = 'true'; } }}
    onPointerUp={finish} onPointerCancel={event => reset(event.currentTarget)} onLostPointerCapture={event => { if (drag.current) reset(event.currentTarget); }}>
    {children}<span className="gc-selected-mark" aria-hidden="true">✓</span>
  </button>;
}
