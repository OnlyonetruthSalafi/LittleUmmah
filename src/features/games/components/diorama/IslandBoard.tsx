import { GameImage as Image } from '../GameImage';
import type { CSSProperties, ReactNode } from 'react';

type MobileArt = { src: string; width: number; height: number; surface: { left: number; right: number; top: number; bottom: number } };

/**
 * กระดานเกาะลอยฟ้าแบบ 2.5D — ใช้ภาพเกาะที่วาดมาเป็นตัวกระดานจริง
 * ไม่ใช่ภาพประดับหลังเกม ชิ้นส่วนของเกมวางบนผิวครีมของเกาะโดยตรง
 *
 * ใช้ซ้ำได้กับเกมอื่นโดยส่ง src/width/height ของภาพเกาะของเกมนั้นเข้ามา
 * ตำแหน่งผิวเล่นคุมด้วย CSS (`--surface-*`) เพราะแต่ละเกาะมีผิวครีมไม่เท่ากัน
 */
export function IslandBoard({ src, width, height, mobileArt, className = '', label, children }: {
  src: string; width: number; height: number; mobileArt?: MobileArt; className?: string; label?: string; children: ReactNode;
}) {
  const art = <Image className="isl-art" src={src} width={width} height={height} alt="" preload={!mobileArt} loading={mobileArt ? 'eager' : undefined} unoptimized={!!mobileArt} sizes="(max-width: 639px) 100vw, 860px" />;
  return <div className={`isl-board ${className}`} style={mobileArt ? {
    '--mobile-aspect': `${mobileArt.width} / ${mobileArt.height}`,
    '--mobile-l': `${mobileArt.surface.left}%`, '--mobile-r': `${mobileArt.surface.right}%`,
    '--mobile-t': `${mobileArt.surface.top}%`, '--mobile-b': `${mobileArt.surface.bottom}%`,
  } as CSSProperties : undefined}>
    {mobileArt ? <picture><source media="(max-width: 639px) and (orientation: portrait)" srcSet={mobileArt.src} />{art}</picture> : art}
    <div className="isl-surface" role={label ? 'group' : undefined} aria-label={label}>{children}</div>
  </div>;
}
