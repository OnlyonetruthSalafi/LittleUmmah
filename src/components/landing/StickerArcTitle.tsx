import { useId } from "react";

type Props = {
  /* สามคำ เรียงสี น้ำเงิน / ส้ม / เขียว */
  words: readonly [string, string, string];
  /* เส้นโค้งใน viewBox 760×180 */
  arc: string;
  fontSize: number;
};

const GRADIENTS = [
  ["#4d9bff", "#2a74e0", "#1e5fbf"],
  ["#ffd24d", "#f5a623", "#d97706"],
  ["#5fd36f", "#22a34a", "#15803d"],
] as const;

/*
  ตัวอักษรสติกเกอร์โค้งแบบ mockup ใช้ร่วมกันระหว่าง "Learn, Play, Grow" และ "Obey Trust Faithful"
  เป็นภาพตกแต่ง (aria-hidden) ผู้เรียกต้องใส่ข้อความ sr-only เอง

  วาดสามชั้นซ้อนกัน:
  1. เงาน้ำเงินเข้มเยื้องลงล่าง = ความหนาของตัวอักษร
  2. ขอบขาวหนา
  3. เนื้อสีไล่ระดับ บนสว่าง -> ล่างเข้ม ให้ดูนูนมัน (สีล่างสุดคือสีแบรนด์ที่ผ่าน contrast แล้ว)
  ขอบกรมท่ารอบนอกทำให้ contrast กับฉากหลังไม่ขึ้นกับสีเนื้อตัวอักษร

  lengthAdjust="spacing" ยืดแค่ช่องไฟ ไม่ยืดรูปตัวอักษร ตัวอักษรจึงอ้วนมนตามฟอนต์จริง
*/
export function StickerArcTitle({ words, arc, fontSize }: Props) {
  /* ตัดอักขระพิเศษของ useId ออก เพราะใช้ใน url(#...) ของ fill ด้วย */
  const id = `arc${useId().replace(/[^\w-]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 760 180"
      className="block aspect-[760/180] w-full overflow-visible"
    >
      <defs>
        <path id={id} d={arc} />
        {GRADIENTS.map((stops, i) => (
          <linearGradient key={i} id={`${id}-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={stops[0]} />
            <stop offset="0.55" stopColor={stops[1]} />
            <stop offset="1" stopColor={stops[2]} />
          </linearGradient>
        ))}
      </defs>
      {(["shadow", "outline", "fill"] as const).map((layer) => (
        <text
          key={layer}
          fontSize={fontSize}
          fontWeight="800"
          strokeLinejoin="round"
          transform={layer === "shadow" ? "translate(0 6)" : undefined}
          fill={layer === "shadow" ? "#12356b" : layer === "outline" ? "white" : undefined}
          stroke={layer === "shadow" ? "#12356b" : layer === "outline" ? "white" : undefined}
          strokeWidth={layer === "shadow" ? 16 : layer === "outline" ? 12 : undefined}
        >
          <textPath
            href={`#${id}`}
            startOffset="50%"
            textAnchor="middle"
            textLength="690"
            lengthAdjust="spacing"
          >
            {words.map((word, i) => (
              <tspan key={word} fill={layer === "fill" ? `url(#${id}-${i})` : undefined}>
                {i < words.length - 1 ? `${word} ` : word}
              </tspan>
            ))}
          </textPath>
        </text>
      ))}
    </svg>
  );
}
