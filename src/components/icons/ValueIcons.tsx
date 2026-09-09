type IconProps = {
  className?: string;
};

/* ต้นกล้างอกจากดิน — ศรัทธาที่ค่อยๆ เติบโต */
export function SeedlingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        d="M24 42V24"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M24 26c-9 0-15-5-15-13 8 0 15 5 15 13Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path d="M24 24c0-8 6-14 15-14 0 8-6 14-15 14Z" fill="currentColor" />
      <path
        d="M13 42h22"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

/* หัวใจ — มารยาทและการปฏิบัติต่อผู้อื่น */
export function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        d="M24 41C11.5 32.5 6 26.5 6 19.5A9.5 9.5 0 0 1 24 15a9.5 9.5 0 0 1 18 4.5C42 26.5 36.5 32.5 24 41Z"
        fill="currentColor"
      />
    </svg>
  );
}

/*
  มือสองข้างประคองหัวใจ — โลกที่ใจดีต่อกัน
  mockup เดิมใช้ไอคอนรูปคน 3 คนซึ่งมีใบหน้า จึงใช้ไม่ได้ มือไม่ใช่ใบหน้า จึงไม่ขัดข้อ 1.1

  ใช้รูปทรงทึบ ไม่ใช้เส้นบาง เพราะไอคอนนี้แสดงจริงที่ 28px
  รอบก่อนผมวาดด้วยเส้น stroke บางๆ แล้วมันอ่านเป็นขีดเล็กๆ ไม่ใช่มือ
*/
export function CaringHandsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        d="M24 26c-5.6-3.9-8.4-6.8-8.4-10.4A4.4 4.4 0 0 1 24 13.2a4.4 4.4 0 0 1 8.4 2.4C32.4 19.2 29.6 22.1 24 26Z"
        fill="currentColor"
      />
      <path
        d="M7.4 26.6c2.9-1.6 6.1-.1 7.4 2.7l4.6 9.4c.7 1.5-1.2 2.9-2.4 1.7l-9.9-9.6c-1.6-1.5-1.5-3.4.3-4.2Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M40.6 26.6c-2.9-1.6-6.1-.1-7.4 2.7l-4.6 9.4c-.7 1.5 1.2 2.9 2.4 1.7l9.9-9.6c1.6-1.5 1.5-3.4-.3-4.2Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}
