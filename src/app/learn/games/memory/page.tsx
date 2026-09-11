import type { Metadata } from "next";

import { GameNavigation } from "@/components/games/GameNavigation";
import { GameTile } from "@/components/games/GameTile";
import { AGE_GROUPS, GAMES } from "@/lib/games";

export const metadata: Metadata = { title: "จับคู่ภาพ — เลือกช่วงวัย" };

/*
  ทางเข้ากลางของเกมจับคู่ สำหรับคนที่พิมพ์ URL สั้นหรือได้ลิงก์ที่ไม่ระบุวัย
  ระดับความยากอยู่ใน URL (/easy, /hard) ไม่ใช่ state ที่ซ่อนไว้
*/
export default function MemoryPage() {
  return (
    <>
      <GameNavigation />
      <section className="bg-cloud shadow-soft rounded-card mx-auto mt-6 max-w-2xl p-6">
        <h1 className="font-display text-3xl font-bold">
          จับคู่ภาพ
          <span lang="en" className="block text-xl">
            Memory Match
          </span>
        </h1>
        <p className="mt-3">เลือกช่วงวัย แล้วมาเริ่มจับคู่กัน</p>
        <p lang="en" className="text-sm">
          Choose your age group to play.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {AGE_GROUPS.map((group) => (
            <section key={group.id}>
              <h2 className="mb-4 text-xl font-bold">
                {group.nameTh}
                <span lang="en" className="block text-sm font-normal">
                  {group.nameEn}
                </span>
              </h2>
              <ul>
                {GAMES.filter(
                  (game) => game.status === "playable" && game.ageGroup === group.id,
                ).map((game) => (
                  <GameTile key={game.slug} game={game} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
