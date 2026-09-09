import Link from "next/link";

import { ShieldHeartIcon } from "@/components/icons/ShieldHeartIcon";
import { Logo } from "@/components/ui/Logo";

/*
  แถบหัวเว็บ — โลโก้ทางซ้าย ทางเข้าโซนผู้ปกครองทางขวา

  ทั้งสองปุ่มสูง 64px เท่ากัน: เผื่อไว้ว่าเด็กเป็นคนกดโลโก้เองด้วย
  จึงยึดเกณฑ์ tap target ของเด็กทั้งคู่ และได้ขอบบน-ล่างที่ตรงกันเป็นผลพลอยได้

  ขนาดตัวอักษร/ระยะห่างบีบลงบนจอแคบ เพื่อให้ป้ายทั้งสองฝั่งอยู่ครบที่ 320px
  โดยไม่ต้องตัดข้อความหรือเหลือแต่ไอคอนเปล่า
*/
export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-2 py-3 sm:gap-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          aria-label="Little Ummah หน้าแรก"
          className="bg-cloud shadow-soft flex min-h-16 items-center rounded-full py-1.5 pr-3 pl-1.5 transition-transform motion-safe:hover:scale-[1.02] sm:pr-5 sm:pl-2"
        >
          <Logo />
        </Link>

        <Link
          href="/parents"
          className="bg-cloud shadow-soft text-ink flex min-h-16 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold whitespace-nowrap transition-transform motion-safe:hover:scale-[1.02] sm:gap-2 sm:px-5 sm:text-base"
        >
          <ShieldHeartIcon className="text-brand-green size-5 shrink-0 sm:size-6" />
          <span className="sm:hidden">ผู้ปกครอง</span>
          <span className="hidden sm:inline">สำหรับผู้ปกครอง</span>
        </Link>
      </div>
    </header>
  );
}
