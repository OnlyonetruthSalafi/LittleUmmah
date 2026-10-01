/* ลูกศรหนาปลายมน — ปุ่มย้อนกลับทุกจุดใช้ตัวนี้ตัวเดียว
   หมุน -scale-x-100 เป็นลูกศรไปข้างหน้า */
export function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true" focusable="false">
      <path
        d="M22 10 8 24l14 14M10 24h30"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
