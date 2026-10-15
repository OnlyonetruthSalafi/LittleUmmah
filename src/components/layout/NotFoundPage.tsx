import Image from "next/image";

import { PageShell } from "@/components/layout/PageShell";
import { BackLink } from "@/components/ui/BackLink";

/* หน้าที่หาไม่เจอ — หุ่นนูรีพากลับหน้าแรก (ข้อความไทยนำ อังกฤษรอง)
   ใช้ทั้งใน [lang]/not-found.tsx (notFound() ในหน้า) และ global-not-found.tsx (URL ที่ไม่มีหน้า) */
export function NotFoundPage() {
  return (
    <PageShell>
      <BackLink />
      {/* ข้อความชุดนี้เป็นไทยนำ จึงกำกับ lang="th" ไว้ — แสดงใต้ /en ด้วย (html lang="en") */}
      <div lang="th" className="scene-copy shadow-soft rounded-card mx-auto mt-6 flex max-w-2xl flex-col items-center gap-3 px-4 py-8 text-center">
        <Image src="/Character/idea.webp" alt="" width={144} height={144} className="size-28 object-contain sm:size-36" />
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          ไม่พบหน้านี้
          <span lang="en" className="mt-1 block text-xl font-semibold">
            Page not found
          </span>
        </h1>
        <p>หน้าที่หาอาจย้ายไปแล้ว กดปุ่มหน้าแรกเพื่อกลับไปเลือกเกาะกันใหม่นะ</p>
        <p lang="en" className="text-ink-soft text-sm">
          This page may have moved. Tap Home to pick an island again.
        </p>
      </div>
    </PageShell>
  );
}
