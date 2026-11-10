import { PlayArea, LearningBalance } from '@/features/learning-stars/components';
import { pageMetadata } from "@/lib/seo";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

import { GameNavigation } from "@/components/games/GameNavigation";
import { GameTile } from "@/components/games/GameTile";
import { AGE_GROUPS, GAMES } from "@/lib/games";

export async function generateMetadata({ params }: PageProps<"/[lang]/learn/games/memory">): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return pageMetadata(lang as Locale, "/learn/games/memory", t.memoryPage.metadataTitle, t.seo.gamesDescription, "play");
}

/*
  ทางเข้ากลางของเกมจับคู่ สำหรับคนที่พิมพ์ URL สั้นหรือได้ลิงก์ที่ไม่ระบุวัย
  ระดับความยากอยู่ใน URL (/easy, /hard) ไม่ใช่ state ที่ซ่อนไว้
*/
export default async function MemoryPage({ params }: PageProps<"/[lang]/learn/games/memory">) {
  const { lang } = await params;
  const { t, sub, pick, pickSub } = dict(lang as Locale);
  return (
    <PlayArea><LearningBalance />
      <GameNavigation />
      <section className="scene-copy shadow-soft rounded-card mx-auto mt-6 max-w-2xl p-6">
        <h1 className="font-display text-3xl font-bold">
          {t.memoryGame.title}
          {sub && <span lang="en" className="block text-xl">
            {sub.memoryGame.title}
          </span>}
        </h1>
        <p className="mt-3">{t.memoryPage.hint}</p>
        {sub && <p lang="en" className="text-sm">
          {sub.memoryPage.hint}
        </p>}

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {AGE_GROUPS.map((group) => (
            <section key={group.id}>
              <h2 className="mb-4 text-xl font-bold">
                {pick(group.name)}
                {sub && <span lang="en" className="block text-sm font-normal">
                  {pickSub(group.name)}
                </span>}
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
    </PlayArea>
  );
}
