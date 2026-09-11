import type { Metadata } from "next";
import Image from "next/image";

import { GameNavigation } from "@/components/games/GameNavigation";
import { GameTile } from "@/components/games/GameTile";
import { AGE_GROUPS, GAMES } from "@/lib/games";

export const metadata: Metadata = { title: "เกาะเกม — เล่นสนุก ฝึกความจำ" };

/*
  หน้าเกาะเกม — กริดไอคอนเกมแบบ BabyBus แยกตามช่วงวัย

  หน้าเดียว สองส่วน ไม่ใช่แท็บที่มี state (แนวเดียวกับ AgeGroupSelector)
  เด็กเห็นเกมของทั้งสองวัยทันทีโดยไม่ต้องแตะเพิ่ม และผู้ปกครองส่งลิงก์ต่อได้
  รายการเกมทั้งหมดอยู่ใน src/lib/games.ts — เพิ่มเกมใหม่ที่นั่นที่เดียว
*/
export default function GamesPage() {
  return (
    <>
      <GameNavigation home />

      <div className="bg-cloud shadow-soft rounded-card mt-6 flex items-center justify-center gap-2 px-4 py-6 sm:gap-6">
        {/* หุ่นยนต์นำทาง (ข้อ 1.2) ภาพตกแต่ง ชื่อหน้าเป็นข้อความอยู่ข้างๆ แล้ว */}
        <Image
          src="/Character/play.webp"
          alt=""
          width={144}
          height={144}
          sizes="(max-width: 639px) 80px, 144px"
          className="logo-mark-glow size-20 object-contain sm:size-36"
        />
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-5xl">
            เกาะเกม
            <span lang="en" className="mt-1 block text-xl font-semibold sm:text-2xl">
              Games Island
            </span>
          </h1>
          <p className="mt-2">มาเล่นและเรียนรู้ไปด้วยกัน!</p>
          <p lang="en" className="text-sm">
            Let’s play and learn together!
          </p>
        </div>
      </div>

      {AGE_GROUPS.map((group) => (
        <section
          key={group.id}
          id={group.id}
          aria-labelledby={`age-${group.id}`}
          className="bg-cloud shadow-soft rounded-card mt-8 p-4 sm:p-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 id={`age-${group.id}`} className="font-display text-2xl font-bold">
              {group.nameTh}
              <span lang="en" className="block text-sm font-normal">
                {group.nameEn}
              </span>
            </h2>
            <p className="bg-sky-pale rounded-full px-4 py-2 font-semibold">
              {group.hint}
              <span lang="en" className="ml-2 text-xs font-normal">
                {group.hintEn}
              </span>
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4 sm:gap-6">
            {GAMES.filter((game) => game.ageGroup === group.id).map((game) => (
              <GameTile key={game.slug} game={game} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
