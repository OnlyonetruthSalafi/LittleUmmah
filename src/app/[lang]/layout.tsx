import { siteUrl } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { SoundProvider } from "@/components/sound/SoundProvider";
import { dict } from "@/i18n/dict";
import { LOCALES, type Locale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { isLocale } from "@/i18n/path";
import "../globals.css";
import "../scene-type.css";
import "../controls.css";
import { fontClasses } from "../fonts";


/*
  root layout อยู่ใต้ [lang] เพื่อให้ <html lang> ตรงกับภาษาของหน้า (คู่มือ Next: guides/internationalization)
  ไทยไม่มี prefix ใน URL — src/proxy.ts rewrite /learn ไปที่ /th/learn ภายใน
  /en ยังไม่เปิดให้คนทั่วไป (เนื้อหาอังกฤษยังไม่ครบ) จึงสั่ง noindex ไว้ก่อน
*/
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  const metadata: Metadata = {
    metadataBase: siteUrl(),
    title: { default: t.seo.homeTitle, template: t.layout.titleTemplate },
    description: t.seo.description,
    manifest: "/manifest.webmanifest",
  };
  return lang === "th" ? metadata : { ...metadata, robots: { index: false, follow: false } };
}

export const viewport: Viewport = {
  themeColor: "#4fa8e8",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html
      lang={lang}
      className={`${fontClasses} h-full antialiased`}
    >
      <body className="font-body bg-sky-pale text-ink flex min-h-full flex-col">
        <LocaleProvider locale={lang}>
          <SoundProvider>{children}</SoundProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
