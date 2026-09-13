'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { useSound } from '@/components/sound/SoundProvider';

// หุ่นยนต์อ่านชื่อเกาะสั้นๆ ตอนชี้เมาส์หรือเลื่อนโฟกัสด้วยคีย์บอร์ด
// จอสัมผัสไม่อ่าน เพราะแตะครั้งเดียวต้องเข้าเกมเลย (AGENTS.md ข้อ 2.1)
export function HubTileLink({ href, slug, nameTh, className, style, children }: {
  href: string; slug: string; nameTh: string; className: string; style?: CSSProperties; children: ReactNode;
}) {
  const { speak } = useSound();
  const say = () => speak(nameTh, `name-${slug}`);
  return <Link href={href} prefetch={false} className={className} style={style}
    onPointerEnter={event => { if (event.pointerType === 'mouse') say(); }}
    onFocus={event => { if (event.currentTarget.matches(':focus-visible')) say(); }}>
    {children}
  </Link>;
}
