/** Architectural brand mark; the cloud comes from the page background. */
export function BrandMarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" fill="none" className={className} aria-hidden="true" focusable="false">
      <path d="M36 5v7" className="stroke-brand-blue" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M39 3a4 4 0 1 0 4 5 3.5 3.5 0 0 1-4-5Z" className="fill-sun" />
      <path d="M21 35c0-11 11-14 15-22 4 8 15 11 15 22Z" className="fill-sun stroke-brand-blue" strokeWidth="2" strokeLinejoin="round" />
      <path d="M25 33c0-7 5-10 9-14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 36h28v27H22Z" className="fill-sky stroke-brand-blue" strokeWidth="2" />
      <path d="M9 30h10v33H9ZM53 30h10v33H53Z" className="fill-sky-deep stroke-brand-blue" strokeWidth="2" />
      <path d="m8 30 6-12 6 12Zm44 0 6-12 6 12Z" className="fill-sun stroke-brand-blue" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 63V49a6 6 0 0 1 12 0v14" className="fill-brand-blue" />
      <path d="M14 39v7m44-7v7" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 64h60" className="stroke-brand-blue" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
