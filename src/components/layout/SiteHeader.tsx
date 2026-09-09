"use client";

import Link from "next/link";

import { ShieldHeartIcon } from "@/components/icons/ShieldHeartIcon";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { useSound } from "@/components/sound/SoundProvider";
import { Logo } from "@/components/ui/Logo";

/*
  แถบหัวเว็บ — โลโก้ทางซ้าย ปุ่มเสียงและทางเข้าโซนผู้ปกครองทางขวา

  ทุกปุ่มสูง 64px เท่ากันตามเกณฑ์ tap target ของเด็ก
  บนจอ 320px: โลโก้ 64 + ปุ่มเสียง 64 + ผู้ปกครอง ~116 + ระยะห่าง 16 = 260px
  ยังเหลือที่ในพื้นที่ 304px ที่มี

  ทุกปุ่มอ่านชื่อตัวเองออกเสียงตอนกด เพราะเด็กเล็กยังอ่านหนังสือไม่ออก
*/
export function SiteHeader() {
  const { speak } = useSound();

  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-2 py-3 sm:gap-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          aria-label="Little Ummah หน้าแรก"
          onClick={() => speak("ลิตเทิ่ล อุมมะฮ์ หน้าแรก", "logo-home")}
          className="bg-cloud shadow-soft flex size-16 items-center justify-center rounded-full transition-[transform,box-shadow] duration-200 ease-out hover:shadow-float motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] sm:w-auto sm:justify-start sm:py-1.5 sm:pr-5 sm:pl-2"
        >
          <Logo />
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <SoundToggle />

          <Link
            href="/parents"
            onClick={() => speak("สำหรับผู้ปกครอง", "for-parents")}
            className="bg-cloud shadow-soft text-ink flex min-h-16 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold whitespace-nowrap transition-[transform,box-shadow] duration-200 ease-out hover:shadow-float motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] sm:gap-2 sm:px-5 sm:text-base"
          >
            <ShieldHeartIcon className="text-brand-green size-5 shrink-0 sm:size-6" />
            <span className="sm:hidden">ผู้ปกครอง</span>
            <span className="hidden sm:inline">สำหรับผู้ปกครอง</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
