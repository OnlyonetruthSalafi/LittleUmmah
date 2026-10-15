import Image from "next/image";

import { IslandPicker } from "@/components/learn/IslandPicker";
import { BackLink } from "@/components/ui/BackLink";
import { PageShell } from "@/components/layout/PageShell";
import type { Text } from "@/i18n/config";

/*
  หน้าแรกของแต่ละช่วงวัย (/kids, /juniors) — ปลายทางของการ์ดเลือกวัยในหน้าแรก
  แสดงเกาะทั้งหก แต่ละเกาะลิงก์ไปส่วนของวัยนั้นในหน้าเกาะ (#kids / #juniors)
  หุ่นยนต์ท่าเดียวกับการ์ดเลือกวัย เด็กจึงรู้ว่ามาถูกที่
*/
export function AgeHome({
  anchor,
  robot,
  title,
  hint,
}: {
  anchor: "kids" | "juniors";
  robot: string;
  title: Text;
  hint: Text;
}) {
  return (
    <PageShell>
      <BackLink />
      <div className="scene-copy shadow-soft rounded-card mt-6 mb-8 flex items-center justify-center gap-3 px-4 py-6 sm:gap-6">
        <Image
          src={robot}
          alt=""
          width={144}
          height={144}
          sizes="(max-width: 639px) 80px, 144px"
          className="logo-mark-glow size-20 shrink-0 object-contain sm:size-36"
        />
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold sm:text-5xl">
            {title.th}
            <span lang="en" className="mt-1 block text-xl font-semibold sm:text-2xl">
              {title.en}
            </span>
          </h1>
          <p className="mt-2">{hint.th}</p>
          <p lang="en" className="text-ink-soft text-sm">
            {hint.en}
          </p>
        </div>
      </div>
      <IslandPicker anchor={anchor} />
    </PageShell>
  );
}
