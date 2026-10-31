'use client';

import { LocaleLink as Link } from '@/i18n/LocaleProvider';
import type { CSSProperties, ReactNode } from 'react';
import { useSound } from '@/components/sound/SoundProvider';
import { isScrollHover } from '@/lib/scrollHover';
import type { GameSlug } from '../data/catalog';
import { gamePresentation } from '../data/presentation';
import { enterGameFullscreen } from '../engine/fullscreen';

// หุ่นยนต์อ่านชื่อเกาะสั้นๆ ตอนชี้เมาส์หรือเลื่อนโฟกัสด้วยคีย์บอร์ด
// จอสัมผัสไม่อ่าน เพราะแตะครั้งเดียวต้องเข้าเกมเลย (AGENTS.md ข้อ 2.1)
export function HubTileLink({ href, slug, name, ariaLabel, className, style, children }: {
  href: string; slug: GameSlug; name: string; ariaLabel: string; className: string; style?: CSSProperties; children: ReactNode;
}) {
  const { speak } = useSound();
  const say = () => {
    // กันตลอดทัวร์ รวมช่วงเข้าฉากและ fallback ที่ไม่มีเสียง ไม่ให้ชื่อเกมตัดทัวร์
    if (document.querySelector('.gh-hero[data-guide-active]')) return;
    speak(name, `name-${slug}`);
  };
  return <Link href={href} prefetch={false} className={className} style={style} data-game-link aria-label={ariaLabel}
    // การแตะการ์ดคือจังหวะเดียวที่เบราว์เซอร์ยอมให้เต็มจอก่อนเข้าเกม
    onClick={() => { if (gamePresentation[slug].fullscreen) enterGameFullscreen(); }}
    // เลื่อนจอแล้วเกาะเลื่อนมาอยู่ใต้เมาส์ที่นิ่งอยู่ ก็เกิด pointerenter ได้ — ไม่นับ (ดู lib/scrollHover)
    onPointerEnter={event => { if (event.pointerType === 'mouse' && !isScrollHover()) say(); }}
    onFocus={event => { if (event.currentTarget.matches(':focus-visible')) say(); }}>
    {children}
  </Link>;
}
