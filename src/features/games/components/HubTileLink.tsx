'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { useSound } from '@/components/sound/SoundProvider';
import { isScrollHover } from '@/lib/scrollHover';

// หุ่นยนต์อ่านชื่อเกาะสั้นๆ ตอนชี้เมาส์หรือเลื่อนโฟกัสด้วยคีย์บอร์ด
// จอสัมผัสไม่อ่าน เพราะแตะครั้งเดียวต้องเข้าเกมเลย (AGENTS.md ข้อ 2.1)
export function HubTileLink({ href, slug, nameTh, className, style, children }: {
  href: string; slug: string; nameTh: string; className: string; style?: CSSProperties; children: ReactNode;
}) {
  const { speak } = useSound();
  const say = () => speak(nameTh, `name-${slug}`);
  return <Link href={href} prefetch={false} className={className} style={style}
    // เลื่อนจอแล้วเกาะเลื่อนมาอยู่ใต้เมาส์ที่นิ่งอยู่ ก็เกิด pointerenter ได้ — ไม่นับ (ดู lib/scrollHover)
    onPointerEnter={event => { if (event.pointerType === 'mouse' && !isScrollHover()) say(); }}
    onFocus={event => { if (event.currentTarget.matches(':focus-visible')) say(); }}>
    {children}
  </Link>;
}
