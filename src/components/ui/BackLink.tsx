"use client";

import { LocaleLink as Link } from "@/i18n/LocaleProvider";

import { ArrowLeftIcon } from "@/components/icons/ArrowLeftIcon";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { useSound } from "@/components/sound/SoundProvider";
import type { Text } from "@/i18n/config";

/*
  ปุ่มนำทางกลับของหน้าด้านใน — ใช้ตัวนี้ทุกหน้า รวมถึงหน้าเกม
  กฎไอคอน: ไปหน้าแรก (/) = บ้าน, กลับหมวดที่อยู่เหนือขึ้นไป = ลูกศร
  ป้ายเป็นชื่อปลายทางอย่างเดียว ("เกาะเรื่องเล่า" "รวมเกม") ลูกศรบอกความหมาย "กลับ" อยู่แล้ว
  หน้าตามาจาก .ui-pill ใน controls.css
*/
export function BackLink({
  href = "/",
  label = { th: "หน้าแรก", en: "Home" },
  className = "",
}: {
  href?: string;
  label?: Text;
  className?: string;
}) {
  const { speak } = useSound();
  const Icon = href === "/" ? HomeIcon : ArrowLeftIcon;

  return (
    <Link href={href} onClick={() => speak(label.th)} className={`ui-pill ${className}`}>
      <span className="ui-disc">
        <Icon />
      </span>
      <span className="ui-label">
        {label.th}
        <span lang="en" className="ui-sub">
          {label.en}
        </span>
      </span>
    </Link>
  );
}
