/* ลูกศรชี้ขวาแบบหัวมน ใช้บอกว่า "ไปต่อ" บนปุ่ม/ป้าย */
export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" focusable="false">
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
