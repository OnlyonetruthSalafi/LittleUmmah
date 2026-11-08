"use client";

import { usePathname } from "next/navigation";
import { ErrorPage, type ErrorPageProps } from "@/components/layout/ErrorPage";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { errorText } from "@/i18n/dict/error";
import { fontClasses } from "./fonts";
import "./globals.css";

/** แทน root layout ที่พัง: มี document, CSS, ฟอนต์ และภาษาของตัวเองเหมือน global-not-found */
export default function GlobalError(props: ErrorPageProps) {
  // Router context อยู่เหนือ root error boundary ไม่ใช่ provider ของ layout ที่พัง
  // ไทยถูก rewrite เป็น /th/... แต่ยังเลือก th เหมือน URL ภายนอก
  const pathname = usePathname();
  const locale = pathname === "/en" || pathname?.startsWith("/en/") ? "en" : "th";
  return (
    <html lang={locale} className={`${fontClasses} h-full antialiased`}>
      <head><title>{`${errorText.title[locale]} | Little Ummah`}</title></head>
      <body className="font-body bg-sky-pale text-ink">
        <LocaleProvider locale={locale}>
          <ErrorPage {...props} reloadHome />
        </LocaleProvider>
      </body>
    </html>
  );
}
