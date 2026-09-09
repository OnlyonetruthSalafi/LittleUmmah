"use client";

import Image from "next/image";
import Link from "next/link";

import { useSound } from "@/components/sound/SoundProvider";
import type { Category } from "@/lib/categories";

/*
  การ์ดเกาะลอย

  ชื่อหมวดวางบนฉากโดยตรง ไม่มีป้ายทึบบังพื้นหลัง
  เงาขาวชิดตัวอักษรช่วยแยกข้อความจากรายละเอียดของฉาก

  motion ตามมาตรฐานข้อ 2.1: ขยับเฉพาะกรอบภาพ ป้ายชื่ออยู่นิ่ง
  ตัดส่วนล้นที่กรอบภาพเท่านั้น ไม่ตัดที่ตัวลิงก์ ไม่งั้นจะบังกรอบโฟกัส

  ภาพเกาะตั้ง alt="" เพราะชื่อหมวดเป็นข้อความจริงอยู่ใต้ภาพแล้ว
  ถ้าใส่ alt ซ้ำ screen reader จะอ่านชื่อหมวดสองรอบ
*/
export function IslandCard({ category }: { category: Category }) {
  const { speak } = useSound();

  return (
    <li className="flex">
      <Link
        href={category.href}
        onPointerEnter={(event) => {
          // Touch reads on click, so scrolling past an island stays quiet.
          if (event.pointerType === "mouse") {
            speak(category.nameTh, `cat-${category.slug}`);
          }
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            speak(category.nameTh, `cat-${category.slug}`);
          }
        }}
        onClick={() => speak(category.nameTh, `cat-${category.slug}`)}
        className="group flex w-full flex-col items-center"
      >
        <span className="block aspect-square w-full overflow-hidden">
          <span className="block size-full drop-shadow-[0_2px_3px_rgb(30_95_191/0.15)] transition-[transform,filter] duration-200 ease-out group-hover:drop-shadow-[0_5px_7px_rgb(30_95_191/0.35)] motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.03] motion-safe:group-active:scale-[0.98] motion-safe:group-active:duration-75">
            <Image
              src={category.image}
              alt=""
              width={900}
              height={900}
              sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, (max-width: 1535px) 16vw, 240px"
              className="size-full object-contain"
            />
          </span>
        </span>

        <span className="island-caption flex max-w-full flex-col items-center px-1 pb-2 text-center">
          <span className="font-display text-ink text-lg leading-normal font-bold text-balance decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline sm:text-xl lg:text-lg xl:text-xl">
            {category.nameTh}
          </span>
          <span lang="en" className="font-display text-ink mt-0.5 text-xs leading-normal font-semibold tracking-wide text-balance sm:text-sm">
            {category.nameEn}
          </span>
        </span>
      </Link>
    </li>
  );
}
