import { BrandMarkIcon } from "@/components/icons/BrandMarkIcon";
import { useId } from "react";

/*
  โลโก้โปร่งใสวางบนเมฆของฉาก ชื่อและคำโปรยแสดงครบทั้งมือถือและจอใหญ่
  บนจอแคบปุ่มควบคุมย้ายลงอีกแถวเพื่อให้ชื่อแบรนด์ยังอ่านได้ชัด
*/
export function Logo() {
  const arcId = useId();
  const fillId = useId();

  return (
    <span className="cloud-logo flex max-w-full flex-col items-center">
      <span className="flex w-full items-center justify-center gap-[2%]">
        <BrandMarkIcon className="logo-mark-glow aspect-square w-[19%] shrink-0" />
        <span lang="en" className="font-display logo-sticker block w-[79%] font-extrabold">
          <span className="sr-only">Little Ummah</span>
          <svg aria-hidden="true" focusable="false" viewBox="0 0 300 76" className="block aspect-[300/76] w-full overflow-visible">
            <defs>
              <path id={arcId} d="M 8 63 Q 150 13 292 63" />
              {/* ไล่จากฟ้าแบรนด์ลงน้ำเงินเข้ม ทั้งสองสีเข้มพอบนเมฆขาว */}
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2f7de0" />
                <stop offset="100%" stopColor="#163f8c" />
              </linearGradient>
            </defs>
            <text
              fill={`url(#${fillId})`}
              fontSize="47"
              stroke="white"
              strokeWidth="7"
              strokeLinejoin="round"
              className="[paint-order:stroke_fill]"
            >
              <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle" textLength="278" lengthAdjust="spacingAndGlyphs">
                Little Ummah
              </textPath>
            </text>
          </svg>
        </span>
      </span>

      <span className="cloud-logo-tagline text-ink text-center leading-tight font-semibold">
        <span className="inline-block">อุมมะตัวน้อยในวันนี้</span>{" "}
        <span className="inline-block">คือ ผู้ใหญ่ในวันหน้า</span>
      </span>
    </span>
  );
}
