import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { LessonCard } from "@/components/learn/LessonCard";
import { BackLink } from "@/components/ui/BackLink";
import { ValueBar } from "@/components/landing/ValueBar";
import { AGE_GROUPS } from "@/lib/games";
import { CATEGORIES } from "@/lib/categories";
import { ISLAND_CONTENT, getIslandContent } from "@/lib/lessons";

/*
  หน้าเกาะเนื้อหา (ภาษาอาหรับ มารยาท เรื่องเล่า สำรวจโลก ศิลปะ)
  เกาะเกมมีโฟลเดอร์ของตัวเอง (learn/games) ซึ่ง Next ให้สิทธิ์ก่อน [slug]

  สร้างเป็นหน้า static ทั้งหมดตอน build และ dynamicParams = false
  slug ที่ไม่มีในข้อมูลจึงเป็น 404 ตั้งแต่ต้น แทนที่จะเป็นหน้าว่าง
*/
export const dynamicParams = false;

export function generateStaticParams() {
  return ISLAND_CONTENT.map((island) => ({ slug: island.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  return { title: category ? `เกาะ${category.nameTh}` : "เกาะการเรียนรู้" };
}

export default async function IslandPage({ params }: PageProps<"/learn/[slug]">) {
  const { slug } = await params;
  const island = getIslandContent(slug);
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!island || !category) notFound();

  return (
    <>
      <BackLink />

      <div className="bg-cloud shadow-soft rounded-card mt-6 flex items-center justify-center gap-3 px-4 py-6 sm:gap-6">
        {/* หุ่นยนต์นำทาง (ข้อ 1.2) ภาพตกแต่ง ชื่อเกาะเป็นข้อความอยู่ข้างๆ แล้ว */}
        <Image
          src={island.robot}
          alt=""
          width={144}
          height={144}
          sizes="(max-width: 639px) 80px, 144px"
          className="logo-mark-glow size-20 shrink-0 object-contain sm:size-36"
        />
        <div className="min-w-0">
          <h1 className="font-display text-3xl leading-snug font-extrabold sm:text-5xl">
            {category.nameTh}
            <span lang="en" className="mt-1 block text-xl font-semibold sm:text-2xl">
              {category.nameEn}
            </span>
          </h1>
          <p className="mt-2">{island.introTh}</p>
          <p lang="en" className="text-ink-soft text-sm">
            {island.introEn}
          </p>
        </div>
      </div>

      {AGE_GROUPS.map((group) => (
        <section
          key={group.id}
          id={group.id}
          aria-labelledby={`age-${group.id}`}
          className="mt-8 scroll-mt-4"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            {/* ป้ายพื้นขาว เพราะหัวข้อวัยแรกวางทับภาพพื้นหลังที่รายละเอียดเยอะ contrast คุมไม่ได้ถ้าไม่มีพื้นรอง */}
            <h2 id={`age-${group.id}`} className="font-display bg-cloud shadow-soft text-ink rounded-full px-6 py-2 text-2xl font-bold sm:text-3xl">
              {group.nameTh}
              <span lang="en" className="block text-sm font-normal">
                {group.nameEn}
              </span>
            </h2>
          </div>
          <ul className="grid gap-5 lg:grid-cols-2">
            {island[group.id].map((lesson, i) => (
              <LessonCard key={lesson.id} lesson={lesson} index={i} />
            ))}
          </ul>
        </section>
      ))}

      {/* ทางไปเกาะอื่น — ใช้แถบป้ายชุดเดียวกับหน้าแรก */}
      <div className="mt-12">
        <h2 className="font-display mb-4 text-center text-2xl font-bold">ไปเกาะอื่นกัน</h2>
        <ValueBar />
      </div>
    </>
  );
}
