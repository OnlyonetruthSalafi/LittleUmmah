import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/ui/BackLink";
import { StoryBook } from "@/features/stories/components/StoryBook";
import { STORIES, getStory } from "@/features/stories";

/*
  หน้าหนังสือนิทาน /learn/stories/<slug>
  โฟลเดอร์ stories ไม่มี page.tsx ของตัวเอง /learn/stories จึงยังเป็นหน้าเกาะจาก [slug] ตามเดิม
*/
export const dynamicParams = false;

export function generateStaticParams() {
  return STORIES.map((s) => ({ story: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/stories/[story]">): Promise<Metadata> {
  const { story } = await params;
  return { title: getStory(story)?.titleTh ?? "นิทาน" };
}

export default async function StoryPage({ params }: PageProps<"/learn/stories/[story]">) {
  const { story: slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return (
    <>
      <BackLink href="/learn/stories" labelTh="เกาะเรื่องเล่า" labelEn="Stories" />
      <h1 className="font-display scene-copy shadow-soft mx-auto mt-6 w-fit rounded-full px-6 py-2 text-center text-2xl font-extrabold sm:text-4xl">
        {story.titleTh}
        <span lang="en" className="text-ink-soft block text-base font-semibold sm:text-lg">
          {story.titleEn}
        </span>
      </h1>
      <StoryBook story={story} />
    </>
  );
}
