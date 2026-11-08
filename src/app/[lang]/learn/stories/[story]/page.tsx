import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { dict, fmt } from "@/i18n/dict";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/ui/BackLink";
import { StoryBook } from "@/features/stories/components/StoryBook";
import { STORIES, getStory } from "@/features/stories";

/*
  หน้าหนังสือนิทาน /learn/stories/<slug>
  หน้ารวม /learn/stories แสดงตู้หนังสือ ส่วนหน้านี้แสดงหนังสือแต่ละเล่ม
*/
export const dynamicParams = false;

export function generateStaticParams() {
  return STORIES.map((s) => ({ story: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/learn/stories/[story]">): Promise<Metadata> {
  const { story, lang } = await params;
  const { t, pick } = dict(lang as Locale);
  const book = getStory(story);
  if (!book) notFound();
  const title = pick(book.title);
  return pageMetadata(lang as Locale, `/learn/stories/${story}`, title, fmt(t.seo.storyDescription, { title }));
}

export default async function StoryPage({ params }: PageProps<"/[lang]/learn/stories/[story]">) {
  const { story: slug, lang } = await params;
  const { t, sub, pick, pickSub } = dict(lang as Locale);
  const story = getStory(slug);
  if (!story) notFound();

  return (
    <>
      <BackLink href="/learn/stories" label={{ th: t.stories.shelf.back, en: sub?.stories.shelf.back ?? t.stories.shelf.back }} />
      <h1 className="font-display scene-copy shadow-soft mx-auto mt-6 w-fit rounded-full px-6 py-2 text-center text-2xl font-extrabold sm:text-4xl">
        {pick(story.title)}
        {pickSub(story.title) && <span lang="en" className="text-ink-soft block text-base font-semibold sm:text-lg">
          {pickSub(story.title)}
        </span>}
      </h1>
      <StoryBook story={story} />
    </>
  );
}
