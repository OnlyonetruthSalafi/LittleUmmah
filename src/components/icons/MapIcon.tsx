/* แผนที่พับสามทบ มีหมุดทอง — หัวข้อ "ไปเกาะอื่นกัน" */
export function MapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path d="M4 11.5 16 7l16 5 12-4.5v29L32 41l-16-5-12 4.5Z" fill="#2fb5a6" />
      <path d="M16 7v29l16 5V12Z" fill="#7bd7c4" />
      <path d="M4 11.5 16 7v29L4 40.5Z" fill="#5fc8b8" />
      <path d="M7 25c3-3 6 1 9-1.5s5-4 8-1 5 3.5 8 1" stroke="#f6b51e" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 4" fill="none" />
      <path d="M36 13.5a5 5 0 0 1 5 5c0 4-5 9-5 9s-5-5-5-9a5 5 0 0 1 5-5Z" fill="#e8553e" />
      <circle cx="36" cy="18.5" r="2" fill="#fff" />
      <path d="M4 11.5 16 7l16 5 12-4.5v29L32 41l-16-5-12 4.5Z" stroke="#16786d" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
