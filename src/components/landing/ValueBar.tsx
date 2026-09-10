"use client";

import Link from "next/link";

import { SparkleIcon } from "@/components/icons/SparkleIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { CATEGORIES } from "@/lib/categories";

/*
  แถบปิดท้ายหน้าแรก — ป้ายชื่อหมวดของเกาะทั้งหก
  เดิมเป็นค่านิยมสามข้อ (ศรัทธา / มารยาทดี / โลกที่ใจดี) เจ้าของโปรเจกต์ให้เปลี่ยนเป็นชื่อเกาะแทน
  ใช้ลำดับและลิงก์จาก CATEGORIES เดียวกับเกาะ แก้ที่เดียวแล้วตรงกันทั้งสองจุด

  ป้ายเป็น "ปุ่ม" ตามข้อ 2.1: ป้ายสั้น ยกทั้งใบได้ -translate-y-0.5
  เงาเพิ่มตอน hover เป็น fallback ตอนปิด motion, สูงอย่างน้อย 64px ตามข้อ 2
  ประกายดาวสลับสามสีแบรนด์ เป็นของตกแต่ง ไม่ได้สื่อความหมาย จึง aria-hidden
*/
const SPARKLE_TINTS = ["text-brand-amber", "text-brand-blue", "text-brand-green"];

export function ValueBar() {
  const { speak } = useSound();

  return (
    <nav
      aria-label="ทางลัดไปหมวดการเรียนรู้"
      className="mx-auto w-full max-w-3xl px-4 pb-12 sm:px-6 sm:pb-16"
    >
      <ul className="bg-cloud shadow-soft rounded-card ring-sun/30 grid grid-cols-2 gap-2 p-3 ring-2 sm:grid-cols-3 sm:gap-3 sm:p-4">
        {CATEGORIES.map((category, i) => (
          <li key={category.slug} className="flex">
            <Link
              href={category.href}
              onClick={() => speak(category.nameTh, `cat-${category.slug}`)}
              className="group rounded-card-sm hover:shadow-float flex min-h-16 w-full items-center gap-2.5 bg-gradient-to-br from-amber-50 via-white to-sky-50 px-3 py-2 shadow-[0_2px_6px_-2px_rgb(30_95_191/0.25)] transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] motion-safe:active:duration-75"
            >
              <SparkleIcon
                className={`logo-mark-glow size-6 shrink-0 ${SPARKLE_TINTS[i % SPARKLE_TINTS.length]}`}
              />
              <span className="flex min-w-0 flex-col text-left">
                <span className="font-display text-ink text-base leading-snug font-extrabold decoration-2 underline-offset-4 group-hover:underline sm:text-lg">
                  {category.nameTh}
                </span>
                <span lang="en" className="text-ink-soft text-xs">
                  {category.nameEn}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
