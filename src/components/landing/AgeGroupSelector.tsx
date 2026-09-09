"use client";

import Link from "next/link";

import { RobotBuddyIcon } from "@/components/icons/RobotBuddyIcon";
import { useSound } from "@/components/sound/SoundProvider";

/*
  ทางเข้าหลักของหน้าแรก แยกเป็นสองช่วงวัย

  เป็นลิงก์ไปคนละหน้า ไม่ใช่ตัวกรองที่มี state
  เพราะพ่อแม่ส่งลิงก์ให้กันได้ตรงช่วงวัย และไม่มีสถานะซ่อนให้เด็กงงว่าของหายไปไหน

  แยกสองใบด้วยรูปทรงหุ่นยนต์เป็นหลัก สีเป็นตัวเสริม
  เด็กที่ยังอ่านตัวเลขไม่ออกหรือตาบอดสีจึงยังแยกทางเข้าได้
*/
const GROUPS = [
  {
    href: "/kids",
    build: "little" as const,
    label: "วัย 3-6 ปี",
    hint: "เรียนรู้ผ่านการเล่น",
    speakKey: "age-3-6",
    tint: "text-brand-blue",
  },
  {
    href: "/juniors",
    build: "big" as const,
    label: "วัย 7 ปีขึ้นไป",
    hint: "อ่านเองได้ สำรวจเอง",
    speakKey: "age-7-plus",
    tint: "text-brand-green",
  },
];

export function AgeGroupSelector() {
  const { speak } = useSound();

  return (
    <section
      id="choose-age"
      className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6 sm:pb-12"
    >
      <h2 className="font-display text-ink mb-4 text-center text-xl font-extrabold sm:text-2xl">
        หนูอายุเท่าไหร่จ๊ะ
      </h2>

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
              <span className="block shrink-0 transition-transform duration-200 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.03] motion-safe:group-active:scale-[0.98] motion-safe:group-active:duration-75">
                <RobotBuddyIcon
                  build={group.build}
                  className={`size-16 ${group.tint}`}
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
