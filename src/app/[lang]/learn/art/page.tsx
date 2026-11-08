import { categoryMetadata } from "@/lib/seo";
import type { Metadata } from "next";

import { OtherIslands } from "@/components/islands/OtherIslands";
import { dict, fmt } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import { ArtStudio } from "@/features/art/components/ArtStudio";
import { ART_TEXT } from "@/features/art/data";
import "@/features/games/games.css";
import "@/features/games/game-tutorial.css";
import "@/features/art/art.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/learn/art">): Promise<Metadata> {
  const { lang } = await params;
  const { t, pick } = dict(lang as Locale);
  return categoryMetadata(lang as Locale, "art", fmt(t.islandPage.metadataTitle, { name: pick(ART_TEXT.title) }));
}

// เกาะศิลปะเป็นเกมระบายสี (เจ้าของโปรเจกต์สั่งออกแบบใหม่ 1 พ.ย. 2026) กระดานเต็มจออยู่ใน ArtStudio
export default function ArtPage() {
  return (
    <>
      <ArtStudio />
      <OtherIslands current="art" />
    </>
  );
}
