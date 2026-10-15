"use client";

import { LocaleLink as Link, useDict } from "@/i18n/LocaleProvider";

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
  label,
  className = "",
}: {
  href?: string;
  label?: Text;
  className?: string;
}) {
  const { speak } = useSound();
  const d = useDict();
  // ไม่ส่ง label = ปุ่มกลับหน้าแรก
  const main = label ? d.pick(label) : d.t.nav.home;
  const second = label ? d.pickSub(label) : d.sub?.nav.home;
  const Icon = href === "/" ? HomeIcon : ArrowLeftIcon;

  return (
    <Link href={href} onClick={() => speak(main)} className={`ui-pill ${className}`}>
      <span className="ui-disc">
        <Icon />
      </span>
      <span className="ui-label">
        {main}
        {second && (
          <span lang="en" className="ui-sub">
            {second}
          </span>
        )}
      </span>
    </Link>
  );
}
