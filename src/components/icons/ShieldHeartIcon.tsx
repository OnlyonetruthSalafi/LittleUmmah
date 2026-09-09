type IconProps = {
  className?: string;
};

/*
  โล่ + หัวใจ ใช้แทนโซนผู้ปกครอง
  mockup เดิมใช้ไอคอนรูปคน ซึ่งมีใบหน้า จึงใช้ไม่ได้ตามข้อกำหนดข้อ 1.1
  โล่สื่อถึงความปลอดภัย/การดูแล ไม่ต้องพึ่งรูปคน
*/
export function ShieldHeartIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M24 5 8 10.5V23c0 9.7 6.6 16.5 16 19 9.4-2.5 16-9.3 16-19V10.5Z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M24 31.4c-4.9-3.4-7.5-5.9-7.5-9.1a3.75 3.75 0 0 1 7.5-1.85 3.75 3.75 0 0 1 7.5 1.85c0 3.2-2.6 5.7-7.5 9.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
