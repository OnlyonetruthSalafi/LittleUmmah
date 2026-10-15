import Image from "next/image";
import { useDict } from "@/i18n/LocaleProvider";

import type { Story } from "../types";

/*
  ปกหนังแข็งของหนังสือแบบอลังการ
  มีภาพปกหนังเต็มหน้า (story.deluxe.cover) ใช้ภาพนั้น ไม่มีก็วาดด้วย CSS:
  หนังสีเขียวน้ำทะเลเข้ม ขอบทอง ดาวแปดแฉกสี่มุม และหน้าต่างโค้งใส่ภาพปกเดิม
  ชื่อเรื่องเป็นตัวหนังสือจริงในหน้าเว็บ ไม่ฝังในภาพ (ข้อ 1.5) — aria-hidden เพราะมี h1 ชื่อเรื่องอยู่แล้ว
*/

function CornerStar({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`sbx-corner ${className}`} aria-hidden="true">
      <path
        d="M20 2l4.6 7.4 8.4-2.4-2.4 8.4L38 20l-7.4 4.6 2.4 8.4-8.4-2.4L20 38l-4.6-7.4-8.4 2.4 2.4-8.4L2 20l7.4-4.6L7 7l8.4 2.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="20" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function DeluxeCover({ story }: { story: Story }) {
  const { pick, pickSub } = useDict();
  const art = story.deluxe?.cover;
  return (
    <div className="sbx-cover" data-art={art ? "" : undefined}>
      {art ? (
        <Image src={art} alt="" fill sizes="(max-width: 1140px) 50vw, 550px" className="object-cover" priority />
      ) : (
        <>
          <div className="sbx-window">
            <Image src={story.cover} alt="" fill sizes="(max-width: 1140px) 40vw, 440px" className="object-cover" priority />
          </div>
          <CornerStar className="sbx-tl" />
          <CornerStar className="sbx-tr" />
          <CornerStar className="sbx-bl" />
          <CornerStar className="sbx-br" />
        </>
      )}
      <div className="sbx-title" aria-hidden="true">
        <span className="sbx-title-th">{pick(story.title)}</span>
        {pickSub(story.title) && <span className="sbx-title-en" lang="en">
          {pickSub(story.title)}
        </span>}
      </div>
    </div>
  );
}

/** ประกายทองพุ่งออกจากสันหนังสือตอนเปิดปกและตอนจบเรื่อง เล่นครั้งเดียว ไม่วนซ้ำ */
export function GoldBurst() {
  return (
    <div className="sbx-burst" aria-hidden="true">
      <span className="sbx-bloom" />
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2 + (i % 2) * 0.15;
        const dist = 18 + (i % 4) * 7;
        return (
          <span
            key={i}
            className="sbx-spark"
            style={
              {
                "--dx": `${Math.cos(angle) * dist}cqw`,
                "--dy": `${Math.sin(angle) * dist * 0.7}cqw`,
                animationDelay: `${(i % 5) * 60}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
