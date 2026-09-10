import { useId } from "react";

/*
  คำขวัญโค้งคว่ำ "Obey Trust Faithful" — แยกออกมาจาก Hero
  เพื่อให้เป็นจุดเริ่มของฉากพื้นหลังล่าง (LowerScene) ได้ หน้าตาเหมือนเดิมทุกอย่าง
  ข้อความตกแต่งภาษาอังกฤษล้วนได้ตามข้อยกเว้นใน AGENTS.md

  แสงขาวด้านหลัง (hero-glow) รองให้ตัวอักษรสีแบรนด์อ่านได้บนภาพที่มีฟ้าสีเข้ม
*/
export function ObeyArc() {
  const arcId = useId();

  return (
    <div className="relative mx-auto w-full max-w-3xl px-4 pt-5 pb-6 text-center sm:px-6 sm:pt-7 sm:pb-8">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-0 -z-10 scale-x-110"
      />
      <p lang="en" className="font-display font-extrabold">
        <span className="sr-only">Obey Trust Faithful</span>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 760 180"
          className="block aspect-[760/180] w-full overflow-visible"
        >
          <defs>
            <path id={arcId} d="M 20 40 Q 380 192 740 40" />
          </defs>
          <text
            fontSize="72"
            stroke="white"
            strokeWidth="3"
            strokeLinejoin="round"
            className="[paint-order:stroke_fill]"
          >
            <textPath
              href={`#${arcId}`}
              startOffset="50%"
              textAnchor="middle"
              textLength="680"
              lengthAdjust="spacingAndGlyphs"
            >
              <tspan className="fill-brand-blue">Obey </tspan>
              <tspan className="fill-brand-amber">Trust </tspan>
              <tspan className="fill-brand-green">Faithful</tspan>
            </textPath>
          </text>
        </svg>
      </p>
    </div>
  );
}
