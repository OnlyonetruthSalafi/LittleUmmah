type IconProps = {
  className?: string;
};

/* สามเหลี่ยมเล่นในวงกลม ใช้บนปุ่มเริ่มต้น */
export function PlayIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="24" cy="24" r="21" fill="currentColor" />
      <path
        d="M20 16.5 33 24l-13 7.5Z"
        fill="var(--color-sun)"
        stroke="var(--color-sun)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
