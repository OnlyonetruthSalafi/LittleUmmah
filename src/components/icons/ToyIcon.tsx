import type { ReactNode } from 'react';
import type { ComingSoonId } from '@/features/games/data/comingSoon';

/* ภาพของเล่นบนการ์ดเกมที่กำลังเตรียม เป็นสิ่งของล้วน ไม่มีคน สัตว์ ใบหน้า ตัวหนังสือ หรือเครื่องดนตรี (ข้อ 1.1, 1.3) */
const BLUE = '#2f7fe0', DEEP = '#1e5fbf', TEAL = '#21b8ad', GOLD = '#f6b51e', AMBER = '#d48806', WHITE = '#ffffff';

const base = <ellipse cx="60" cy="80" rx="46" ry="8" fill={DEEP} opacity=".14" />;

const art: Record<ComingSoonId, ReactNode> = {
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
