import type { Metadata } from "next";

import { NotFoundPage } from "@/components/layout/NotFoundPage";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { fontClasses } from "./fonts";
import "./globals.css";
import "./scene-type.css";
import "./controls.css";

/*
  หน้า 404 ของ URL ที่ไม่มีหน้าในเว็บ — ไม่ผ่าน layout ใดๆ จึงต้องใส่ <html> ฟอนต์ CSS และ provider เอง
  (คู่มือ Next: file-conventions/not-found — root layout อยู่ใต้ [lang])
  ไม่รู้ภาษาจาก URL ที่ไม่มีหน้า จึงแสดงแบบหน้าไทย (ไทยนำ อังกฤษรอง)
*/
export const metadata: Metadata = {
  title: "ไม่พบหน้านี้ | Little Ummah",
};

export default function GlobalNotFound() {
  return (
    <html lang="th" className={`${fontClasses} h-full antialiased`}>
      <body className="font-body bg-sky-pale text-ink flex min-h-full flex-col">
        <LocaleProvider locale="th">
          <SoundProvider>
            <NotFoundPage />
          </SoundProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
