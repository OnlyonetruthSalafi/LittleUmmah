type IconProps = {
  className?: string;
};

/*
  มัสยิด — โดม หอคอย และจันทร์เสี้ยว
  เป็นสถาปัตยกรรมล้วน ไม่มีสิ่งมีชีวิต ตามข้อกำหนดข้อ 1 ใน AGENTS.md
  ประตูใช้ fill-rule evenodd เจาะเป็นช่องว่าง จึงวางบนพื้นสีอะไรก็ได้
*/
export function MosqueIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* จันทร์เสี้ยวบนยอดโดม */}
      <path d="M24 7.4a3.6 3.6 0 1 0 3.6 3.6A2.9 2.9 0 0 1 24 7.4Z" />
      {/* หอคอยซ้าย */}
      <circle cx="8" cy="18" r="2.6" />
      <path d="M5.5 40V21.5a2.5 2.5 0 0 1 5 0V40Z" />
      {/* หอคอยขวา */}
      <circle cx="40" cy="18" r="2.6" />
      <path d="M37.5 40V21.5a2.5 2.5 0 0 1 5 0V40Z" />
      {/* ตัวอาคาร + โดม พร้อมประตูโค้งที่เจาะทะลุ */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 40V27a11 11 0 0 1 22 0v13Zm7.5 0v-6.5a3.5 3.5 0 1 1 7 0V40Z"
      />
    </svg>
  );
}
