"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { MapIcon } from "@/components/icons/MapIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { CATEGORIES } from "@/lib/categories";

import "./other-islands.css";

/*
  "ไปเกาะอื่นกัน" ท้ายหน้าเกาะ (มารยาท, เรื่องเล่า) — ใช้ภาพเกาะเดิมของหน้าแรก (CATEGORIES.image) ตามที่เจ้าของโปรเจกต์สั่ง
  ไม่วาดใหม่ เกาะจึงหน้าตาเดียวกับที่เด็กเห็นบนหน้าแรก และตัดเกาะที่อยู่ตอนนี้ออก

  เป็นการ์ด (ภาพเหนือข้อความ) ตามข้อ 2.1: hover ขยับเฉพาะภาพเกาะ ป้ายชื่อนิ่ง
  ภาพ alt="" เพราะชื่อเกาะเป็นข้อความอยู่ในลิงก์เดียวกันแล้ว
*/
export function OtherIslands({ current }: { current: string }) {
  const { speak } = useSound();
  const islands = CATEGORIES.filter((category) => category.slug !== current);

  return (
    <nav aria-labelledby="other-islands" className="oi-wrap">
      <div className="oi-wrap-head">
        <MapIcon className="size-12 shrink-0" />
        <h2 id="other-islands" className="font-display text-2xl font-extrabold sm:text-3xl">
          ไปเกาะอื่นกัน
          <span lang="en" className="text-ink-soft ml-2 text-base font-semibold">
            More islands
          </span>
        </h2>
        <p className="text-ink-soft basis-full text-sm sm:basis-auto">เรียนรู้เรื่องราวดีๆ อีกมากมาย</p>
      </div>
      <ul className="oi-wrap-list">
        {islands.map((island) => (
          <li key={island.slug} className="flex">
            <Link
              href={island.href}
              onClick={() => speak(island.nameTh, `cat-${island.slug}`)}
              className="oi-island group"
            >
              <span className="oi-island-art">
                <Image src={island.image} alt="" width={320} height={320} sizes="(max-width: 639px) 45vw, 190px" />
              </span>
              <span className="oi-island-label">
                <span className="min-w-0 flex-1">
                  <span className="font-display block leading-snug font-extrabold">{island.nameTh}</span>
                  <span lang="en" className="text-ink-soft block text-xs">
                    {island.nameEn}
                  </span>
                </span>
                <ChevronRightIcon className="oi-island-chev" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
