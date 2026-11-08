import type { ReactNode } from 'react';
import type { ComingSoonId } from '@/features/games/data/comingSoon';

/* ภาพของเล่นบนการ์ดเกมที่กำลังเตรียม เป็นสิ่งของล้วน ไม่มีคน สัตว์ ใบหน้า ตัวหนังสือ หรือเครื่องดนตรี (ข้อ 1.1, 1.3) */
const BLUE = '#2f7fe0', DEEP = '#1e5fbf', TEAL = '#21b8ad', GOLD = '#f6b51e', AMBER = '#d48806', WHITE = '#ffffff', SAND = '#f3dcae';

const base = <ellipse cx="60" cy="80" rx="46" ry="8" fill={DEEP} opacity=".14" />;

const art: Record<ComingSoonId, ReactNode> = {
  'block-builders': <>
    <path d="M60 12 92 36H28Z" fill={GOLD} stroke={AMBER} strokeWidth="2" strokeLinejoin="round" />
    <rect x="34" y="36" width="25" height="22" rx="3" fill={BLUE} /><rect x="61" y="36" width="25" height="22" rx="3" fill={TEAL} />
    <rect x="34" y="58" width="25" height="22" rx="3" fill={TEAL} /><rect x="61" y="58" width="25" height="22" rx="3" fill={BLUE} />
    <path d="M38 41h14M65 41h14M38 63h14M65 63h14" stroke={WHITE} strokeWidth="3" strokeLinecap="round" opacity=".55" />
  </>,
  'coin-box': <>
    <rect x="26" y="36" width="68" height="44" rx="9" fill={BLUE} /><rect x="26" y="36" width="68" height="13" rx="6.5" fill={TEAL} />
    <rect x="45" y="39.5" width="30" height="6" rx="3" fill={DEEP} />
    <rect x="38" y="58" width="44" height="14" rx="4" fill={WHITE} opacity=".85" />
    <circle cx="48" cy="65" r="4" fill={GOLD} /><circle cx="60" cy="65" r="4" fill={GOLD} /><circle cx="72" cy="65" r="4" fill={GOLD} />
    <circle cx="60" cy="20" r="14" fill={GOLD} stroke={AMBER} strokeWidth="2.5" /><circle cx="60" cy="20" r="8" fill="none" stroke={AMBER} strokeWidth="2" />
  </>,
  'marble-run': <>
    <path d="M12 18h52q10 0 10 10t-10 10H36q-10 0-10 10t10 10h60" fill="none" stroke={TEAL} strokeWidth="12" strokeLinecap="round" />
    <path d="M12 18h52q10 0 10 10t-10 10H36q-10 0-10 10t10 10h60" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" opacity=".6" />
    <path d="M90 62h20l-3 16H93Z" fill={BLUE} />
    <circle cx="28" cy="16" r="8" fill={GOLD} stroke={AMBER} strokeWidth="2" /><circle cx="25.5" cy="13.5" r="2.2" fill={WHITE} />
  </>,
  'track-builder': <>
    <path d="M6 66c30 0 34-34 62-34h46" fill="none" stroke={DEEP} strokeWidth="11" strokeDasharray="4 7" />
    <path d="M6 66c30 0 34-34 62-34h46" fill="none" stroke={GOLD} strokeWidth="4" />
    <rect x="62" y="14" width="42" height="26" rx="6" fill={BLUE} /><rect x="86" y="8" width="16" height="16" rx="3" fill={TEAL} />
    <rect x="68" y="20" width="12" height="9" rx="2" fill={WHITE} opacity=".85" />
    <circle cx="74" cy="42" r="6" fill={DEEP} stroke={GOLD} strokeWidth="2" /><circle cx="94" cy="42" r="6" fill={DEEP} stroke={GOLD} strokeWidth="2" />
  </>,
  'buttons-zips': <>
    <rect x="14" y="12" width="92" height="66" rx="9" fill={BLUE} /><rect x="20" y="18" width="80" height="54" rx="6" fill="none" stroke={WHITE} strokeWidth="1.8" strokeDasharray="4 4" opacity=".7" />
    <circle cx="42" cy="34" r="12" fill={GOLD} stroke={AMBER} strokeWidth="2" /><circle cx="38" cy="30" r="2" fill={AMBER} /><circle cx="46" cy="30" r="2" fill={AMBER} /><circle cx="38" cy="38" r="2" fill={AMBER} /><circle cx="46" cy="38" r="2" fill={AMBER} />
    <circle cx="78" cy="34" r="12" fill={TEAL} stroke={WHITE} strokeWidth="2" /><circle cx="74" cy="30" r="2" fill={WHITE} /><circle cx="82" cy="30" r="2" fill={WHITE} /><circle cx="74" cy="38" r="2" fill={WHITE} /><circle cx="82" cy="38" r="2" fill={WHITE} />
    <path d="M26 60h68" stroke={WHITE} strokeWidth="6" strokeDasharray="3 3" />
    <rect x="58" y="53" width="11" height="14" rx="3" fill={GOLD} stroke={AMBER} strokeWidth="1.5" />
  </>,
  'sand-trails': <>
    <rect x="10" y="18" width="100" height="60" rx="13" fill={BLUE} /><rect x="17" y="25" width="86" height="46" rx="8" fill={SAND} />
    <path d="M26 58c12-30 22-30 32-12s20 16 36-16" fill="none" stroke="#c9a15c" strokeWidth="6" strokeLinecap="round" />
    <circle cx="26" cy="58" r="5" fill={TEAL} /><path d="m92 22 4 8 8 1-6 6 2 8-8-4-7 4 1-8-6-6 9-1Z" fill={GOLD} stroke={AMBER} strokeWidth="1.5" strokeLinejoin="round" />
  </>,
};

export function ToyIcon({ id, className }: { id: ComingSoonId; className?: string }) {
  return <svg viewBox="0 0 120 90" className={className} aria-hidden="true" focusable="false">{base}{art[id]}</svg>;
}

export function LockIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <path d="M7.5 11V8a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <rect x="4.5" y="10.5" width="15" height="11" rx="3" fill="currentColor" />
    <circle cx="12" cy="15.3" r="1.7" fill="#fff" /><rect x="11.2" y="15.5" width="1.6" height="3" rx=".8" fill="#fff" />
  </svg>;
}
