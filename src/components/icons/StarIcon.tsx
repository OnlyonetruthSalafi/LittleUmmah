/* ดาวห้าแฉกมุมมน — ดาวสะสมของบทเรียน filled = ได้แล้ว, ไม่ filled = ยังเป็นช่องว่างสีเทา */
export function StarIcon({ className, filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M12 2.6c.4 0 .8.2 1 .6l2.4 4.9 5.3.8c.9.1 1.3 1.2.6 1.9l-3.9 3.8.9 5.3c.2.9-.8 1.6-1.6 1.2L12 18.6l-4.8 2.5c-.8.4-1.8-.3-1.6-1.2l.9-5.3-3.9-3.8c-.7-.6-.3-1.8.6-1.9l5.3-.8L11 3.2c.2-.4.6-.6 1-.6Z"
        fill={filled ? "#f6b51e" : "#e2e8f0"}
        stroke={filled ? "#d48806" : "#cbd5e1"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {filled && <path d="M8.6 9.6c.9-.2 1.6-.6 2-1.5" stroke="#fff6d6" strokeWidth="1.4" strokeLinecap="round" fill="none" />}
    </svg>
  );
}
