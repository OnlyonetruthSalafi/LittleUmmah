import { categoryMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { dict } from "@/i18n/dict";

import { OtherIslands } from "@/components/islands/OtherIslands";
import { BackLink } from "@/components/ui/BackLink";
import { Bookshelf } from "@/features/stories/components/Bookshelf";
import { StoryGuide } from "@/features/stories/components/StoryGuide";
import { hadithShelfBooks, shelfBooks } from "@/features/stories/shelf";
import { PAPER_EDITION } from "@/features/stories";
import { LocaleLink } from "@/i18n/LocaleProvider";
import "@/features/stories/components/paper-book.css";

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
  const { t, sub, pick, pickSub } = dict(lang as Locale);
  const { kids, juniors } = shelfBooks();
  const hadith = hadithShelfBooks();

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
      <section className="pp-collection" data-shelf="popup" aria-labelledby="pp-collection-title">
        <header className="pp-cornice">
          <h2 id="pp-collection-title">{t.stories.shelf.paperTitle}{sub && <small lang="en">{sub.stories.shelf.paperTitle}</small>}</h2>
        </header>
        <LocaleLink href={`/learn/stories/${PAPER_EDITION.slug}#paper-book`} className="pp-collection-link" aria-labelledby="pp-book-title pp-open-action">
          <div className="pp-feature-art">
            <Image src="/stories/nuh-paper/jacket.webp" alt="" width={1024} height={1356} sizes="(max-width: 639px) 35vw, 180px" className="pp-jacket" />
          </div>
          <div className="pp-collection-copy">
            <h3 id="pp-book-title">{pick(PAPER_EDITION.story.title)}{sub && <small lang="en">{pickSub(PAPER_EDITION.story.title)}</small>}</h3>
            <span className="pp-open" id="pp-open-action">
              <span>{t.stories.shelf.openPaper}{sub && <small lang="en">{sub.stories.shelf.openPaper}</small>}</span>
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </LocaleLink>
      </section>

      <OtherIslands current="stories" />
    </>
  );
}
