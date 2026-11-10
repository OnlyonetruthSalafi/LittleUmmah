"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Only for artwork frames whose existing CSS reserves their full size.
 * Keep the card, its label and its focus target mounted. Prepare images ahead
 * of scrolling; never unmount decoded artwork when it leaves the viewport.
 */
export function NearArtwork({ children, overlay, className, as: Tag = "span" }: {
  children: ReactNode;
  overlay?: ReactNode;
  className: string;
  as?: "span" | "div";
}) {
  const frame = useRef<HTMLDivElement & HTMLSpanElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setNear(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: "800px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={frame} className={className}>
    {near ? children : <noscript>{children}</noscript>}
    {overlay}
  </Tag>;
}
