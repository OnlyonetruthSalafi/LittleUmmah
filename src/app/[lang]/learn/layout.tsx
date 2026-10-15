import type { ReactNode } from "react";

import { PageShell } from "@/components/layout/PageShell";

/* ทุกเกาะ (รวมเกาะเกม) ใช้ฉากและหัวเว็บชุดเดียวกัน */
export default function LearnLayout({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
