// รูปทรงและแว่นขยายตามแบบเกาะเกม เป็นภาพตกแต่งคู่กับชื่อหมวด
export function GameCategoryIcon({ name, className }: { name: 'blocks' | 'search'; className?: string }) {
  return <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
    {name === 'blocks' ? <>
      <rect x="5" y="29" width="27" height="27" rx="7" fill="#1e5fbf" stroke="#fff" strokeWidth="2" />
      <path d="m36 8 23 39H13Z" fill="#ffc94b" stroke="#fff" strokeWidth="2" />
      <circle cx="46" cy="46" r="13" fill="#0f766e" stroke="#fff" strokeWidth="2" />
    </> : <>
      <circle cx="27" cy="26" r="18" fill="#eaf6ff" stroke="#fff" strokeWidth="5" />
      <path d="m41 40 15 16" stroke="#ffc94b" strokeWidth="10" strokeLinecap="round" />
      <path d="m27 14 4 8 9 1-6 6 1 9-8-4-8 4 1-9-6-6 9-1Z" fill="#f7bd35" stroke="#9b5800" />
    </>}
  </svg>;
}
