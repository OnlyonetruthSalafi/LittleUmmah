import type { SVGProps } from "react";

export function FullscreenIcon({ active = false, ...props }: SVGProps<SVGSVGElement> & { active?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d={active ? "M3 9h6V3m12 6h-6V3M3 15h6v6m12-6h-6v6" : "M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"} />
  </svg>;
}
