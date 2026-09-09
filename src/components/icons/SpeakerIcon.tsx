type IconProps = {
  className?: string;
  /** false = ขีดทับ แสดงว่าปิดเสียงอยู่ */
  on?: boolean;
};

/* ลำโพง + คลื่นเสียง — ไม่มีโน้ตดนตรีตามข้อกำหนดข้อ 1.3 */
export function SpeakerIcon({ className, on = true }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M25 8 14 17H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7l11 9Z"
        fill="currentColor"
      />
      {on ? (
        <>
          <path
            d="M32 18a9 9 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <path
            d="M38 13a17 17 0 0 1 0 22"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          d="m33 19 10 10M43 19 33 29"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
