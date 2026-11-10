import { categoryMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { dict } from "@/i18n/dict";

import { OtherIslands } from "@/components/islands/OtherIslands";
import { BackLink } from "@/components/ui/BackLink";
import { Bookshelf } from "@/features/stories/components/Bookshelf";
import { StoryGuide } from "@/features/stories/components/StoryGuide";
import { hadithShelf2Books, hadithShelfBooks, shelfBooks } from "@/features/stories/shelf";

/*
  เกาะเรื่องเล่า = ตู้หนังสือ
  โฟลเดอร์ literal นี้ชนะ learn/[slug] (แบบเดียวกับ learn/games) และ [slug] ไม่สร้างหน้า stories แล้ว
*/
export async function generateMetadata({ params }: PageProps<"/[lang]/learn/stories">): Promise<Metadata> {
  const { lang } = await params;
  const { t } = dict(lang as Locale);
  return categoryMetadata(lang as Locale, "stories", t.stories.shelf.metadataTitle);
}

export default async function StoriesIslandPage({ params }: PageProps<"/[lang]/learn/stories">) {
  const { lang } = await params;
  const { t, sub } = dict(lang as Locale);
  const { kids, juniors } = shelfBooks();
  const hadith = hadithShelfBooks();
  const hadith2 = hadithShelf2Books();

  return (
    <>
      <BackLink />
      <h1 className="sr-only">
        {t.stories.shelf.metadataTitle}{" "}{sub && <span lang="en">{sub.stories.shelf.metadataTitle}</span>}
      </h1>
      <StoryGuide />
      <Bookshelf kids={kids} juniors={juniors} />
      {/* ตู้ที่สอง: เรื่องจริงจากหะดีษ (เจ้าของโปรเจกต์สั่ง 9 พ.ย. 2026) */}
      <Bookshelf kids={hadith.kids} juniors={hadith.juniors} shelf="hadith" />
      {/* ตู้ที่สาม: เรื่องจริงจากหะดีษ ชุดที่ 2 */}
      <Bookshelf kids={hadith2.kids} juniors={hadith2.juniors} shelf="hadith2" />

      <OtherIslands current="stories" />
    </>
  );
}
