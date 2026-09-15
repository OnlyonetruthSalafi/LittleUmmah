import type { Metadata } from "next";

import { ValueBar } from "@/components/landing/ValueBar";
import { BackLink } from "@/components/ui/BackLink";
import { Classroom } from "@/features/arabic/components/Classroom";
import { getIslandContent } from "@/lib/lessons";

/*
  เกาะภาษาอาหรับ = ห้องเรียนหุ่นยนต์
  โฟลเดอร์ literal นี้ชนะ learn/[slug] (แบบเดียวกับ learn/games และ learn/stories)
  และ [slug] ไม่สร้างหน้า arabic แล้ว
*/
export const metadata: Metadata = { title: "เกาะภาษาอาหรับเบื้องต้น" };

export default function ArabicIslandPage() {
  const island = getIslandContent("arabic");

  return (
    <>
      <BackLink />
      <Classroom introTh={island?.introTh ?? ""} introEn={island?.introEn ?? ""} />

      <div className="mt-12">
        <h2 className="font-display mb-4 text-center text-2xl font-bold">ไปเกาะอื่นกัน</h2>
        <ValueBar />
      </div>
    </>
  );
}
