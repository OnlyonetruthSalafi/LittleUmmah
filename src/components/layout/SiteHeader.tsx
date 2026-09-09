"use client";

import Link from "next/link";

import { ShieldHeartIcon } from "@/components/icons/ShieldHeartIcon";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { useSound } from "@/components/sound/SoundProvider";
import { Logo } from "@/components/ui/Logo";

/*
  แถบหัวเว็บ — โลโก้ทางซ้าย ปุ่มเสียงและทางเข้าโซนผู้ปกครองทางขวา

  ทุกปุ่มสูง 64px เท่ากันตามเกณฑ์ tap target ของเด็ก
  มือถือและแท็บเล็ตแยกปุ่มควบคุมเป็นแถวที่สอง ให้โลโก้แสดงชื่อเต็มได้

  ทุกปุ่มอ่านชื่อตัวเองออกเสียงตอนกด เพราะเด็กเล็กยังอ่านหนังสือไม่ออก
*/
export function SiteHeader() {
  const { speak } = useSound();

  return (
    <header className="w-full">
      <div className="brand-header flex w-full flex-col items-start justify-between gap-3 pt-1 pr-2 pb-3 sm:pr-6 lg:flex-row lg:items-center lg:pt-2">
        <Link
          href="/"
          aria-label="Little Ummah หน้าแรก"
          onClick={() => speak("ลิตเทิ่ล อุมมะฮ์ หน้าแรก", "logo-home")}
          className="flex min-h-16 max-w-full shrink-0 items-center justify-center rounded-xl drop-shadow-[0_1px_2px_rgb(30_95_191/0.15)] transition-[transform,filter] duration-200 ease-out hover:drop-shadow-[0_3px_5px_rgb(30_95_191/0.35)] motion-safe:active:scale-[0.98] active:duration-75"
        >
          <Logo />
        </Link>

        <div className="flex shrink-0 items-center gap-2 self-end sm:gap-3 lg:self-center">
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
