import { useId } from "react";

/*
  เจ้าของโปรเจกต์เลือกหัวเรื่องอังกฤษโค้งตาม mockup และคำแปลไทยเล็กลงด้านล่าง
  SVG textPath จัดตัวอักษรตามเส้นโค้งคงที่ ไม่ใช้ animation หรือภาพตัวอักษร
  ข้อความใน h1 ให้ screen reader อ่านครั้งเดียว ส่วน SVG เป็นภาพตกแต่ง
  ไม่มีปุ่ม "เริ่มสำรวจเลย" แล้ว เพราะการ์ดเลือกช่วงวัยอยู่ถัดลงไปในหน้าจอแรกอยู่แล้ว
  ปุ่มนั้นกลายเป็นขั้นตอนซ้ำที่ทำให้เด็กต้องกดสองทีกว่าจะถึงเนื้อหา
*/
export function Hero() {
  const titleArcId = useId();

  return (
    <section className="relative mx-auto w-full max-w-3xl px-4 pt-4 pb-6 text-center sm:px-6 sm:pt-8 sm:pb-8">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-0 -z-10 scale-x-125 scale-y-150"
      />
      <h1 lang="en" className="font-display font-extrabold">
        <span className="sr-only">Learn, Play, Grow</span>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 760 180"
          className="block aspect-[760/180] w-full overflow-visible"
        >
          <defs>
            <path id={titleArcId} d="M 20 140 Q 380 -12 740 140" />
          </defs>
          <text
            fontSize="86"
            stroke="white"
            strokeWidth="3"
            strokeLinejoin="round"
            className="[paint-order:stroke_fill]"
          >
            <textPath
              href={`#${titleArcId}`}
              startOffset="50%"
              textAnchor="middle"
              textLength="680"
              lengthAdjust="spacingAndGlyphs"
            >
              <tspan className="fill-brand-blue">Learn, </tspan>
              <tspan className="fill-brand-amber">Play, </tspan>
              <tspan className="fill-brand-green">Grow</tspan>
            </textPath>
          </text>
        </svg>
      </h1>

      <p
        className="font-display text-ink mt-1 text-xl font-bold sm:text-2xl"
      >
        เรียนรู้ เล่นสนุก เติบโต
      </p>

      <p className="text-ink mt-3 text-lg font-semibold sm:mt-4 sm:text-xl">
        โลกที่สดใสกว่า เพื่อเด็กรุ่นใหม่ที่สดใส
      </p>
      <p className="text-ink-soft mx-auto mt-2 max-w-xl text-base sm:text-lg">
        รู้จักอิสลาม สร้างมารยาทที่ดี และทำให้พรุ่งนี้ใจดีขึ้นกว่าเดิม
      </p>
    </section>
  );
}
