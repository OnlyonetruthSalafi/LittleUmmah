type RobotProps = {
  className?: string;
  /** "little" = ตัวเตี้ยทรงกลมมีล้อ / "big" = ตัวสูงทรงเหลี่ยมมีตีนตะขาบ */
  build: "little" | "big";
};

/*
  หุ่นยนต์เพื่อนนำทาง 2 ตัว ใช้แยกการ์ดช่วงวัยสำหรับเด็กที่ยังอ่านตัวเลขไม่ออก

  หุ่นยนต์มีใบหน้าได้ตามข้อ 1.2 ใน AGENTS.md ต่างจากคนและสัตว์
  แยกกันที่ "รูปทรง" เป็นหลัก ไม่ใช่แค่สี เด็กตาบอดสีจึงยังแยกออก
*/
export function RobotBuddyIcon({ className, build }: RobotProps) {
  if (build === "little") {
    return (
      <svg
        viewBox="0 0 96 96"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {/* เสาอากาศ */}
        <circle cx="48" cy="12" r="6" fill="#f5a623" />
        <path d="M48 18v8" stroke="#1e5fbf" strokeWidth="4" strokeLinecap="round" />
        {/* หัวทรงกลม */}
        <circle cx="48" cy="46" r="26" fill="#1e5fbf" />
        <rect x="30" y="34" width="36" height="22" rx="11" fill="#eaf6ff" />
        <circle cx="40" cy="45" r="5" fill="#1e5fbf" />
        <circle cx="56" cy="45" r="5" fill="#1e5fbf" />
        <path
          d="M42 62h12"
          stroke="#eaf6ff"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* ล้อ */}
        <circle cx="30" cy="80" r="10" fill="#4b5563" />
        <circle cx="66" cy="80" r="10" fill="#4b5563" />
        <circle cx="30" cy="80" r="4" fill="#a8d8f5" />
        <circle cx="66" cy="80" r="4" fill="#a8d8f5" />
        <rect x="28" y="68" width="40" height="12" rx="6" fill="#1e5fbf" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* เสาอากาศคู่ */}
      <path
        d="M34 14v8M62 14v8"
        stroke="#15803d"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="34" cy="10" r="5" fill="#f5a623" />
      <circle cx="62" cy="10" r="5" fill="#f5a623" />
      {/* หัวทรงเหลี่ยม */}
      <rect x="22" y="22" width="52" height="34" rx="10" fill="#15803d" />
      <rect x="30" y="30" width="36" height="18" rx="6" fill="#eaf6ff" />
      <rect x="37" y="35" width="7" height="8" rx="3.5" fill="#15803d" />
      <rect x="52" y="35" width="7" height="8" rx="3.5" fill="#15803d" />
      {/* ลำตัว */}
      <rect x="30" y="58" width="36" height="18" rx="6" fill="#15803d" />
      <rect x="40" y="63" width="16" height="8" rx="4" fill="#a8d8f5" />
      {/* ตีนตะขาบ */}
      <rect x="18" y="78" width="60" height="14" rx="7" fill="#4b5563" />
      <circle cx="30" cy="85" r="4" fill="#a8d8f5" />
      <circle cx="48" cy="85" r="4" fill="#a8d8f5" />
      <circle cx="66" cy="85" r="4" fill="#a8d8f5" />
    </svg>
  );
}
