"use client";

import { useDict } from "@/i18n/LocaleProvider";

import Image from "next/image";
import { LocaleLink as Link } from "@/i18n/LocaleProvider";

import { useSound } from "@/components/sound/SoundProvider";
import type { CSSProperties } from "react";
import type { HomeIsland } from "@/lib/categories";
import { isScrollHover } from "@/lib/scrollHover";
import { IslandLockIcon } from "@/components/icons/IslandLockIcon";
import { islandLockedLabel, useIslandNotice } from "./IslandNotice";

/*
  การ์ดเกาะลอย

  ป้ายชื่อใช้ตัวหนังสือขอบขาวแบบ sticker เพื่อรักษา contrast บนฉากทั้งสองโซน

  motion ตามมาตรฐานข้อ 2.1: ขยับเฉพาะกรอบภาพ ป้ายชื่ออยู่นิ่ง
  กรอบภาพไม่ตัดส่วนล้น เพื่อให้แสงสีทองฟุ้งออกนอกกรอบได้ (ดู .island-aura ใน globals.css)

  ภาพเกาะตั้ง alt="" เพราะชื่อหมวดเป็นข้อความจริงอยู่ใต้ภาพแล้ว
  ถ้าใส่ alt ซ้ำ screen reader จะอ่านชื่อหมวดสองรอบ
*/
export function IslandCard({ category, style }: { category: HomeIsland; style?: CSSProperties }) {
  const { sub, pick, pickSub } = useDict();
  const showNotice = useIslandNotice();
  const { speak } = useSound();
  const content = <>
        {/* ไม่ใส่ overflow-hidden ที่กรอบนี้ ไม่งั้นแสงฟุ้งรอบเกาะจะถูกตัดเป็นขอบสี่เหลี่ยม
            ไม่ใส่ isolate ด้วย: แสง -z-10 ของทุกเกาะจึงอยู่ใน stacking context เดียวกัน
            (ของ SkyScene) และอยู่หลังภาพเกาะทุกใบ แสงของใบถัดไปจะไม่ทับขอบเกาะใบก่อนหน้า */}
        <span className="island-art-frame pointer-events-none relative block aspect-square w-full">
          <span aria-hidden="true" className="island-aura pointer-events-none absolute -z-10" />
          <span className="island-glow block size-full transition-[translate,scale,filter] duration-200 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.03] motion-safe:group-active:scale-[0.98] motion-safe:group-active:duration-75">
            <Image
              src={category.image}
              alt=""
              width={900}
              height={900}
              sizes="(max-width: 639px) 55vw, (max-width: 1023px) 33vw, 310px"
              className="size-full object-contain"
            />
          </span>
          {category.comingSoon && <span className="island-lock"><IslandLockIcon /></span>}
        </span>

        <span className="island-caption flex max-w-full flex-col items-center px-1 pb-2 text-center">
          <span className="island-name font-display text-island-ink text-xl leading-snug font-extrabold text-balance decoration-1 underline-offset-4 group-hover:underline group-focus-visible:underline">
            {pick(category.name)}
          </span>
          {sub && <span lang="en" className="island-name-sub font-display text-island-ink-soft mt-1 text-sm leading-normal font-semibold text-balance">
            {pickSub(category.name)}
          </span>}
        </span>
    </>;
  return (
    <li className="flex" data-slug={category.slug} style={style}>
      {category.href && !category.comingSoon ? <Link
        href={category.href}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && !isScrollHover()) speak(pick(category.name), `cat-${category.slug}`);
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) speak(pick(category.name), `cat-${category.slug}`);
        }}
        onClick={() => speak(pick(category.name), `cat-${category.slug}`)}
        className="island-link group flex w-full flex-col items-center rounded-2xl"
      >{content}</Link> : <button type="button" data-coming-soon
        aria-label={`${pick(category.name)} — ${pick(islandLockedLabel)}`}
        onClick={showNotice}
        className="island-link group flex w-full cursor-pointer flex-col items-center rounded-2xl"
      >{content}</button>}
    </li>
  );
}
