"use client";

import Link from "next/link";

import { GameIcon } from "@/components/icons/GameIcon";
import { useSound } from "@/components/sound/SoundProvider";

/*
  ปุ่มย้อนกลับของหน้าด้านใน — สูง 64px ตามเกณฑ์ tap target ของเด็ก
  เป็น "ปุ่ม" ตามข้อ 2.1: ยกทั้งปุ่มได้ เงาเพิ่มตอน hover เป็น fallback ตอนปิด motion
*/
export function BackLink({
  href = "/",
  labelTh = "หน้าแรก",
  labelEn = "Home",
}: {
  href?: string;
  labelTh?: string;
  labelEn?: string;
}) {
  const { speak } = useSound();

  return (
    <Link
      href={href}
      onClick={() => speak(labelTh)}
      className="bg-cloud text-ink shadow-soft hover:shadow-float inline-flex min-h-16 min-w-16 items-center justify-center gap-2 rounded-full px-6 py-3 font-bold transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] motion-safe:active:duration-75"
    >
      <GameIcon name="back" className="size-6" />
      <span>
        {labelTh}
        <span lang="en" className="block text-xs font-normal">
          {labelEn}
        </span>
      </span>
    </Link>
  );
}
