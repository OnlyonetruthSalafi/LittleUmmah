import type { Metadata } from "next";

import { OtherIslands } from "@/components/islands/OtherIslands";
import { BackLink } from "@/components/ui/BackLink";
import { Bookshelf } from "@/features/stories/components/Bookshelf";
import { StoryGuide } from "@/features/stories/components/StoryGuide";
import { shelfBooks } from "@/features/stories/shelf";

/*
  เกาะเรื่องเล่า = ตู้หนังสือ
  โฟลเดอร์ literal นี้ชนะ learn/[slug] (แบบเดียวกับ learn/games) และ [slug] ไม่สร้างหน้า stories แล้ว
*/
export const metadata: Metadata = { title: "เกาะเรื่องเล่า" };

export default function StoriesIslandPage() {
  const { kids, juniors } = shelfBooks();

  return (
    <>
      <BackLink />
      <h1 className="sr-only">
        เรื่องเล่า <span lang="en">Stories</span>
      </h1>
      <StoryGuide />
      <Bookshelf kids={kids} juniors={juniors} />

      <OtherIslands current="stories" />
    </>
  );
}
