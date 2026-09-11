import type { ReactNode } from "react";

import { SkyScene } from "@/components/landing/SkyScene";
import { SiteHeader } from "@/components/layout/SiteHeader";

/*
  โครงหน้าด้านใน (เกาะ, หน้าช่วงวัย, หน้าผู้ปกครอง)
  ใช้ฉากท้องฟ้าและหัวเว็บเดียวกับหน้าแรก ให้ทุกหน้ารู้สึกเป็นโลกเดียวกัน
*/
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <SkyScene>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pt-4 pb-16 sm:px-8">{children}</main>
    </SkyScene>
  );
}
