"use client";

import Image from "next/image";

import { PageShell } from "@/components/layout/PageShell";
import { BackLink } from "@/components/ui/BackLink";
import { useDict } from "@/i18n/LocaleProvider";

/* หน้าที่หาไม่เจอ — หุ่นนูรีพากลับหน้าแรก
   ใช้ทั้งใน [lang]/not-found.tsx (notFound() ในหน้า) และ global-not-found.tsx (URL ที่ไม่มีหน้า)
   not-found ไม่ได้รับ params จึงอ่านภาษาจาก LocaleProvider (client component) */
export function NotFoundPage() {
  const { t, sub } = useDict();
  return (
    <PageShell>
      <BackLink />
      <div className="scene-copy shadow-soft rounded-card mx-auto mt-6 flex max-w-2xl flex-col items-center gap-3 px-4 py-8 text-center">
        <Image src="/Character/idea.webp" alt="" width={144} height={144} className="size-28 object-contain sm:size-36" />
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          {t.notFound.title}
          {sub && (
            <span lang="en" className="mt-1 block text-xl font-semibold">
              {sub.notFound.title}
            </span>
          )}
        </h1>
        <p>{t.notFound.body}</p>
        {sub && (
          <p lang="en" className="text-ink-soft text-sm">
            {sub.notFound.body}
          </p>
        )}
      </div>
    </PageShell>
  );
}
