import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { dict } from "@/i18n/dict";

import { OtherIslands } from "@/components/islands/OtherIslands";
import { BackLink } from "@/components/ui/BackLink";
import { Bookshelf } from "@/features/stories/components/Bookshelf";
import { StoryGuide } from "@/features/stories/components/StoryGuide";
import { shelfBooks } from "@/features/stories/shelf";

/*
  เกาะเรื่องเล่า = ตู้หนังสือ
  โฟลเดอร์ literal นี้ชนะ learn/[slug] (แบบเดียวกับ learn/games) และ [slug] ไม่สร้างหน้า stories แล้ว
*/
export async function generateMetadata({ params }: PageProps<"/[lang]/learn/stories">): Promise<Metadata> {
  const { lang } = await params;
  return { title: dict(lang as Locale).t.stories.shelf.metadataTitle };
}

export default async function StoriesIslandPage({ params }: PageProps<"/[lang]/learn/stories">) {
  const { lang } = await params;
  const { t, sub } = dict(lang as Locale);
  const { kids, juniors } = shelfBooks();

  return (
    <>
      <BackLink />
      <h1 className="sr-only">
        {t.stories.shelf.title}{" "}{sub && <span lang="en">{sub.stories.shelf.title}</span>}
      </h1>
      <StoryGuide />
      <Bookshelf kids={kids} juniors={juniors} />

      <OtherIslands current="stories" />
    </>
  );
}
