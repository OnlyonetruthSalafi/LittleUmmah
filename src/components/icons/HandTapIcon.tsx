/*
  มือชี้สีขาว ใช้เป็นตัวนำสายตาในภาพสาธิตวิธีเล่น
  เป็นส่วนของร่างกายที่ไม่ใช่ใบหน้า จึงใช้ได้ตาม AGENTS.md ข้อ 1.1
  ขอบเข้มรอบมือมีไว้ให้มองเห็นได้ทั้งบนพื้นขาวของเกาะและบนแผ่นสีเทอร์ควอยซ์
*/
export function HandTapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M11.1 13.4V4.7a1.85 1.85 0 1 1 3.7 0v5.1a1.5 1.5 0 0 1 3 .1v1.3a1.5 1.5 0 0 1 3 .1v4.2c0 3.6-2.9 6.5-6.5 6.5h-1.2c-2.1 0-4.1-1-5.3-2.8l-3.4-4.9a1.85 1.85 0 0 1 2.8-2.4l1.9 1.9z"
        fill="#ffffff"
        stroke="#123a72"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
