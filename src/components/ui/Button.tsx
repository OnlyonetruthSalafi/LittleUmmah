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
  หน้าตาและ motion ทั้งหมดอยู่ที่ .ui-pill ใน controls.css (ชุดเดียวกับปุ่มทั้งเว็บ)
  ที่นี่กำหนดแค่ขนาดตัวอักษรของปุ่มใหญ่
*/
const BASE = "text-lg sm:text-xl";

const VARIANTS = {
  primary: "ui-pill ui-pill-primary",
  soft: "ui-pill",
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

  const classes = `${VARIANTS[variant]} ${BASE} ${className}`;

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
