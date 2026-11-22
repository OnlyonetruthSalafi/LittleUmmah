import type { CSSProperties, ReactNode, RefObject } from 'react';
import { useEffect } from 'react';
import type { Text } from '@/i18n/config';
import { useDict } from '@/i18n/LocaleProvider';
import { GameImage } from './GameImage';
import '../workshop-stage.css';

export type Point = { x: number; y: number };
export function pointOnBoard(element: Element, clientX: number, clientY: number): Point {
  const r = element.getBoundingClientRect();
  return { x: (clientX-r.left)*960/r.width, y: (clientY-r.top)*480/r.height };
}
export function at({ x, y }: Point): CSSProperties { return { left: x/9.6+'%', top: y/4.8+'%' }; }

export function WorkshopStage({ slug, level, stage, children, message, action }: {
  slug: string; level: number; stage: RefObject<HTMLDivElement | null>; children: ReactNode; message: Text; action?: ReactNode;
}) {
  const { pick, sub } = useDict();
  return <div className="ws-board" data-workshop={slug}>
    <div className="ws-stage" ref={stage}>
      <GameImage src={'/games/'+slug+'/level-'+level+'.webp'} alt="" width={1120} height={560}
        loading="eager" fetchPriority="high" draggable={false} unoptimized />
      {children}
    </div>
    <div className="ws-console"><div role="status"><strong>{pick(message)}</strong>{sub && <small lang="en">{message.en}</small>}</div>{action}</div>
  </div>;
}

export function ActionLabel({ text }: { text: Text }) {
  const { pick, sub } = useDict();
  return <>{pick(text)}{sub && <small lang="en">{text.en}</small>}</>;
}

// Leave the finished toy visible briefly. Orientation changes and restarts cancel the timer.
export function useWorkshopFinish(done: boolean, paused: boolean, onComplete: () => void, delay = 800) {
  useEffect(() => {
    if (!done || paused) return;
    const timer = setTimeout(onComplete, delay);
    return () => clearTimeout(timer);
  }, [done, paused, onComplete, delay]);
}
