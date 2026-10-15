"use client";

import Image from "next/image";
import { LocaleLink as Link } from "@/i18n/LocaleProvider";

import { useSound } from "@/components/sound/SoundProvider";
import type { Category } from "@/lib/categories";
import { isScrollHover } from "@/lib/scrollHover";

/*
  การ์ดเกาะลอย

  ชื่อหมวดวางบนฉากโดยตรง ไม่มีป้ายทึบบังพื้นหลัง
  เงาขาวชิดตัวอักษรช่วยแยกข้อความจากรายละเอียดของฉาก

  motion ตามมาตรฐานข้อ 2.1: ขยับเฉพาะกรอบภาพ ป้ายชื่ออยู่นิ่ง
  กรอบภาพไม่ตัดส่วนล้น เพื่อให้แสงสีทองฟุ้งออกนอกกรอบได้ (ดู .island-aura ใน globals.css)

  ภาพเกาะตั้ง alt="" เพราะชื่อหมวดเป็นข้อความจริงอยู่ใต้ภาพแล้ว
  ถ้าใส่ alt ซ้ำ screen reader จะอ่านชื่อหมวดสองรอบ
*/
export function IslandCard({ category }: { category: Category }) {
  const { speak } = useSound();

  return (
    <li className="flex" data-slug={category.slug}>
      <Link
        href={category.href}
        onPointerEnter={(event) => {
          // Touch reads on click, so scrolling past an island stays quiet.
          // Scrolling also slides islands under a still mouse and fires pointerenter;
          // skip those so they don't cut off other speech (see lib/scrollHover).
          if (event.pointerType === "mouse" && !isScrollHover()) {
            speak(category.name.th, `cat-${category.slug}`);
          }
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            speak(category.name.th, `cat-${category.slug}`);
          }
        }}
        onClick={() => speak(category.name.th, `cat-${category.slug}`)}
        className="group flex w-full flex-col items-center"
      >
        {/* ไม่ใส่ overflow-hidden ที่กรอบนี้ ไม่งั้นแสงฟุ้งรอบเกาะจะถูกตัดเป็นขอบสี่เหลี่ยม
            ไม่ใส่ isolate ด้วย: แสง -z-10 ของทุกเกาะจึงอยู่ใน stacking context เดียวกัน
            (ของ SkyScene) และอยู่หลังภาพเกาะทุกใบ แสงของใบถัดไปจะไม่ทับขอบเกาะใบก่อนหน้า */}
        <span className="relative block aspect-square w-full">
          <span aria-hidden="true" className="island-aura pointer-events-none absolute -z-10" />
          <span className="island-glow block size-full transition-[transform,filter] duration-200 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.03] motion-safe:group-active:scale-[0.98] motion-safe:group-active:duration-75">
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
          <span className="font-display text-island-ink text-xl leading-snug font-extrabold text-balance decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline sm:text-2xl lg:text-xl xl:text-[1.375rem]">
            {category.name.th}
          </span>
          <span lang="en" className="font-display text-island-ink-soft mt-1 text-sm leading-normal font-semibold tracking-wide text-balance sm:text-base">
            {category.name.en}
          </span>
        </span>
      </Link>
    </li>
  );
}
