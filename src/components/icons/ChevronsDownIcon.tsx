type IconProps = {
  className?: string;
};

/* ลูกศรคู่ชี้ลง — บอกเด็กว่าเกาะให้เลือกอยู่ด้านล่าง ไม่ต้องอ่านหนังสือ */
export function ChevronsDownIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m12 10 12 11 12-11"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".55"
      />
      <path
        d="m12 25 12 11 12-11"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
