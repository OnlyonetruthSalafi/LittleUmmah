import type { Metadata } from "next";

import { ValueBar } from "@/components/landing/ValueBar";
import { BackLink } from "@/components/ui/BackLink";
import { Bookshelf } from "@/features/stories/components/Bookshelf";
import { shelfBooks } from "@/features/stories/shelf";
import { getIslandContent } from "@/lib/lessons";

/*
  เกาะเรื่องเล่า = ตู้หนังสือ
  โฟลเดอร์ literal นี้ชนะ learn/[slug] (แบบเดียวกับ learn/games) และ [slug] ไม่สร้างหน้า stories แล้ว
*/
export const metadata: Metadata = { title: "เกาะเรื่องเล่า" };

export default function StoriesIslandPage() {
  const { kids, juniors } = shelfBooks();
  const island = getIslandContent("stories");

  return (
    <>
      <BackLink />
      <h1 className="sr-only">
        เรื่องเล่า <span lang="en">Stories</span>
      </h1>
      <Bookshelf kids={kids} juniors={juniors} introTh={island?.introTh ?? ""} introEn={island?.introEn ?? ""} />

      <div className="mt-12">
        <h2 className="font-display mb-4 text-center text-2xl font-bold">ไปเกาะอื่นกัน</h2>
        <ValueBar />
      </div>
    </>
  );
}
