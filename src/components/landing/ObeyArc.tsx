import { StickerArcTitle } from "@/components/landing/StickerArcTitle";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";

/*
  คำขวัญโค้งคว่ำ "Obey Trust Faithful" — แยกออกมาจาก Hero
  เพื่อให้เป็นจุดเริ่มของฉากพื้นหลังล่าง (LowerScene) ได้
  ใช้ตัวอักษรสติกเกอร์ชุดเดียวกับ "Learn, Play, Grow" (StickerArcTitle)
  ข้อความตกแต่งภาษาอังกฤษล้วนได้ตามข้อยกเว้นใน AGENTS.md

  แสงขาวด้านหลัง (hero-glow) รองให้ตัวอักษรสีแบรนด์อ่านได้บนภาพที่มีฟ้าสีเข้ม
*/
export function ObeyArc({ locale }: { locale: Locale }) {
  const { t } = dict(locale);
  return (
    <div className="relative mx-auto w-full max-w-3xl px-4 pt-5 pb-6 text-center sm:px-6 sm:pt-7 sm:pb-8">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-0 -z-10 scale-x-110"
      />
      <p lang="en" className="font-display font-extrabold">
        <span className="sr-only">{t.obeyArc.title}</span>
        <StickerArcTitle
          words={[t.obeyArc.obey, t.obeyArc.trust, t.obeyArc.faithful]}
          arc="M 30 40 Q 380 170 730 40"
          fontSize={80}
        />
      </p>
    </div>
  );
}
