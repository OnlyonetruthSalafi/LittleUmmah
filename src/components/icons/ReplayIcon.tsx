type IconProps = {
  className?: string;
};

/* ลูกศรวนกลับ — เล่นซ้ำ ใช้กับปุ่มดูหุ่นยนต์วิ่งอีกครั้ง */
export function ReplayIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12.5 17.5A14 14 0 1 1 10 26"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M9 8.5v10h10"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
