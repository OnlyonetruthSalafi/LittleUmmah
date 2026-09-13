type IconProps = {
  className?: string;
};

/* สองแท่งมน — พักเสียง */
export function PauseIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="12" y="9" width="8.5" height="30" rx="4.25" fill="currentColor" />
      <rect x="27.5" y="9" width="8.5" height="30" rx="4.25" fill="currentColor" />
    </svg>
  );
}
