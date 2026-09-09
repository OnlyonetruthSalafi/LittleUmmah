"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useSound } from "@/components/sound/SoundProvider";

type ButtonProps = {
  children: ReactNode;
  /** ใส่ href แล้วจะเรนเดอร์เป็นลิงก์ ไม่ใส่จะเป็นปุ่มธรรมดา */
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "soft";
  className?: string;
  /** ข้อความที่จะให้อ่านออกเสียงตอนกด สำหรับเด็กที่ยังอ่านไม่ออก */
  speak?: string;
  /** key ของไฟล์เสียงที่อัดไว้ ถ้ามีจะใช้แทนเสียงสังเคราะห์ */
  speakKey?: string;
};

/*
  ปุ่มสูง 64px ตามเกณฑ์ tap target ของเด็กใน AGENTS.md
  motion ตามมาตรฐานหัวข้อ 2.1: hover ยกขึ้นเล็กน้อย active ย่อลง ครอบ motion-safe ทุกจุด
  และมีเงาเปลี่ยนเป็น fallback สำหรับคนที่ปิดการเคลื่อนไหว
*/
const BASE =
  "inline-flex min-h-16 items-center justify-center gap-3 rounded-full px-7 text-lg font-extrabold whitespace-nowrap transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] motion-safe:active:duration-75 sm:px-9 sm:text-xl";

const VARIANTS = {
  // เงาต้องเพิ่มขึ้นตอน hover ไม่ใช่ลดลง และเป็น fallback ให้คนที่ปิดการเคลื่อนไหว
  primary: "bg-sun text-sun-ink shadow-soft hover:bg-sun-deep hover:shadow-float",
  soft: "bg-cloud text-ink shadow-soft hover:shadow-float",
} as const;

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  speak,
  speakKey,
}: ButtonProps) {
  const { speak: say } = useSound();

  const handleClick = () => {
    if (speak) say(speak, speakKey);
    onClick?.();
  };

  const classes = `font-display ${BASE} ${VARIANTS[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} onClick={handleClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={classes}>
      {children}
    </button>
  );
}
