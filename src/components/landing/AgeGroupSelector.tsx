"use client";

import Image from "next/image";
import Link from "next/link";

import { useSound } from "@/components/sound/SoundProvider";

/*
  ทางเข้าหลักของหน้าแรก แยกเป็นสองช่วงวัย

  เป็นลิงก์ไปคนละหน้า ไม่ใช่ตัวกรองที่มี state
  เพราะพ่อแม่ส่งลิงก์ให้กันได้ตรงช่วงวัย และไม่มีสถานะซ่อนให้เด็กงงว่าของหายไปไหน

  แยกสองใบด้วยท่าทางของหุ่นยนต์นำทาง (ข้อ 1.2) เด็กที่ยังอ่านตัวเลขไม่ออกก็แยกได้
  - 3-6 ปี "เรียนรู้ผ่านการเล่น" -> ท่าชูกำปั้นดีใจ (Glad)
  - 7 ปีขึ้นไป "อ่านเองได้"      -> ท่าถือหนังสือเปิดอ่าน (Read)
  ภาพ alt="" เพราะชื่อช่วงวัยเป็นข้อความอยู่ข้างๆ ในลิงก์เดียวกันแล้ว
*/
const GROUPS = [
  {
    href: "/kids",
    image: "/Character/glad.webp",
    label: "วัย 3-6 ปี",
    hint: "เรียนรู้ผ่านการเล่น",
    speakKey: "age-3-6",
  },
  {
    href: "/juniors",
    image: "/Character/read.webp",
    label: "วัย 7 ปีขึ้นไป",
    hint: "อ่านเองได้ สำรวจเอง",
    speakKey: "age-7-plus",
  },
];

export function AgeGroupSelector() {
  const { speak } = useSound();

  return (
    <section
      id="choose-age"
      aria-label="เลือกช่วงวัย"
      className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 sm:pb-12"
    >
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5">
        {GROUPS.map((group) => (
          <li key={group.href} className="flex">
            <Link
              href={group.href}
              onClick={() => speak(group.label, group.speakKey)}
              className="bg-cloud shadow-soft hover:shadow-float rounded-card group flex min-h-24 w-full items-center gap-4 px-5 py-4 transition-shadow duration-200 ease-out"
            >
              {/*
                นี่คือการ์ด ไม่ใช่ปุ่ม จึงขยับเฉพาะกรอบหุ่นยนต์ ข้อความอยู่นิ่ง
                ตัวการ์ดสื่อสารด้วยเงาที่เข้มขึ้น ซึ่งยังทำงานแม้ผู้ใช้ปิดการเคลื่อนไหว
              */}
              {/*
                กรอบขนาดคงที่กัน layout ขยับ -my-4 ให้หุ่นยนต์ยื่นพ้นขอบการ์ดเล็กน้อย
                ดูมีมิติ แต่ความสูงการ์ดยังเท่าเดิม ส่วนอื่นของหน้าจึงไม่ถูกดัน
                แสงทองรอบตัว (logo-mark-glow) ใช้ชุดเดียวกับไอคอนโลโก้
              */}
              <span className="-my-4 block size-24 shrink-0 sm:-my-6 transition-transform duration-200 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.03] motion-safe:group-active:scale-[0.98] motion-safe:group-active:duration-75 sm:size-28">
                <Image
                  src={group.image}
                  alt=""
                  width={400}
                  height={400}
                  sizes="112px"
                  className="logo-mark-glow size-full object-contain"
                />
              </span>
              <span className="flex flex-col text-left">
                <span className="font-display text-ink text-xl font-extrabold sm:text-2xl">
                  {group.label}
                </span>
                <span className="text-ink-soft text-sm">{group.hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
