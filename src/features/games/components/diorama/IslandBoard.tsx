import { GameImage as Image } from '../GameImage';
import type { ReactNode } from 'react';

/**
 * กระดานเกาะลอยฟ้าแบบ 2.5D — ใช้ภาพเกาะที่วาดมาเป็นตัวกระดานจริง
 * ไม่ใช่ภาพประดับหลังเกม ชิ้นส่วนของเกมวางบนผิวครีมของเกาะโดยตรง
 *
 * ใช้ซ้ำได้กับเกมอื่นโดยส่ง src/width/height ของภาพเกาะของเกมนั้นเข้ามา
 * ตำแหน่งผิวเล่นคุมด้วย CSS (`--surface-*`) เพราะแต่ละเกาะมีผิวครีมไม่เท่ากัน
 */
export function IslandBoard({ src, width, height, className = '', label, children }: {
  src: string; width: number; height: number; className?: string; label?: string; children: ReactNode;
}) {
  return <div className={`isl-board ${className}`}>
    <Image className="isl-art" src={src} width={width} height={height} alt="" priority sizes="(max-width: 639px) 100vw, 860px" />
    <div className="isl-surface" role={label ? 'group' : undefined} aria-label={label}>{children}</div>
  </div>;
}
