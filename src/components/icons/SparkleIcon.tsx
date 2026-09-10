/** ประกายดาวสี่แฉก ใช้ตกแต่งหน้าป้ายข้อความ — ไม่ใช่ดาวห้าแฉกและไม่ใช่สัญลักษณ์ดนตรี */
export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M12 1.5c.6 4.9 2.6 7.9 7.9 9.2.5.1.5.8 0 .9-5.3 1.3-7.3 4.3-7.9 9.2-.1.5-.8.5-.9 0-.6-4.9-2.6-7.9-7.9-9.2-.5-.1-.5-.8 0-.9 5.3-1.3 7.3-4.3 7.9-9.2.1-.5.8-.5.9 0Z"
        fill="currentColor"
      />
      <circle cx="19.5" cy="4.5" r="1.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
