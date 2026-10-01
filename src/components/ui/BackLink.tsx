"use client";

import Link from "next/link";

import { ArrowLeftIcon } from "@/components/icons/ArrowLeftIcon";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { useSound } from "@/components/sound/SoundProvider";

/*
  ปุ่มนำทางกลับของหน้าด้านใน — ใช้ตัวนี้ทุกหน้า รวมถึงหน้าเกม
  กฎไอคอน: ไปหน้าแรก (/) = บ้าน, กลับหมวดที่อยู่เหนือขึ้นไป = ลูกศร
  ป้ายเป็นชื่อปลายทางอย่างเดียว ("เกาะเรื่องเล่า" "รวมเกม") ลูกศรบอกความหมาย "กลับ" อยู่แล้ว
  หน้าตามาจาก .ui-pill ใน controls.css
*/
export function BackLink({
  href = "/",
  labelTh = "หน้าแรก",
  labelEn = "Home",
  className = "",
}: {
  href?: string;
  labelTh?: string;
  labelEn?: string;
  className?: string;
}) {
  const { speak } = useSound();
  const Icon = href === "/" ? HomeIcon : ArrowLeftIcon;

  return (
    <Link href={href} onClick={() => speak(labelTh)} className={`ui-pill ${className}`}>
      <span className="ui-disc">
        <Icon />
      </span>
      <span className="ui-label">
        {labelTh}
        <span lang="en" className="ui-sub">
          {labelEn}
        </span>
      </span>
    </Link>
  );
}
