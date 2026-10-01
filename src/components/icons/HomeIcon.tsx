/* บ้านทรงมน — ไอคอนของลิงก์ "หน้าแรก" ทุกจุด
   ตั้งใจไม่ใช้โดมหรือหอคอย เพื่อไม่ให้ซ้ำกับมัสยิดหรือรูปอาคารในโลโก้ */
export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true" focusable="false">
      <path
        d="M21.4 7.2a4 4 0 0 1 5.2 0l15 12.6A2.4 2.4 0 0 1 40 24h-2v14a4 4 0 0 1-4 4h-6V31a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v11h-6a4 4 0 0 1-4-4V24H8a2.4 2.4 0 0 1-1.6-4.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
