import Image from "next/image";
import { AgeSections } from "@/components/learn/AgeSections";
import { BackLink } from "@/components/ui/BackLink";
import { OtherIslands } from "@/components/islands/OtherIslands";
import { MoralSection } from "@/features/moral/components/MoralLessons";
import { AGE_SECTIONS, CARD_ART, LESSONS } from "@/features/math/data";
import { FILMS } from "@/features/math/film";
import { NumberCards } from "@/features/math/NumberCards";
import type { Locale } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { CATEGORIES } from "@/lib/categories";
import { categoryMetadata } from "@/lib/seo";

/* เกาะคณิต: การ์ตูนทีละแนวคิด (MoralSection + FilmLesson แบบเกาะศรัทธา) + ส่วนรู้จักตัวเลข — 18 พ.ย. 2026 */
const island = CATEGORIES.find(category => category.slug === "numbers-math")!;
const INTRO = { th: "ดูการ์ตูนนับเลขกับครูนูรีและผองเพื่อน แล้วมาแตะตัวเลขชูนิ้วนับด้วยกันนะ", en: "Watch counting cartoons with Nuri and friends, then tap a number and count on your fingers together." };

export async function generateMetadata({ params }: PageProps<"/[lang]/learn/numbers-math">) {
  const { lang } = await params;
  return categoryMetadata(lang as Locale, island.slug, island.name[lang as Locale]);
}

export default async function NumbersPage({ params }: PageProps<"/[lang]/learn/numbers-math">) {
  const { lang } = await params;
  const { pick, sub, pickSub } = dict(lang as Locale);
  return <div className="mrl-page">
    <BackLink />
    <header className="scene-copy rounded-card shadow-soft mt-6 flex items-center justify-center gap-4 p-4 sm:p-8">
      <Image src={island.image} width={240} height={240} sizes="(max-width: 639px) 25vw, 192px" alt="" className="h-auto w-1/4 max-w-48" />
      <div>
        <h1 className="font-display text-3xl font-extrabold sm:text-5xl">
          {pick(island.name)}{sub && <small lang="en" className="block text-lg font-semibold">{pickSub(island.name)}</small>}
        </h1>
        <p className="mt-3">{pick(INTRO)}{sub && <small lang="en" className="text-ink-soft block">{pickSub(INTRO)}</small>}</p>
      </div>
    </header>
    <AgeSections
      kids={<MoralSection age="kids" section={AGE_SECTIONS.kids} groups={[{ id: "kids-math", lessons: LESSONS.kids }]}
        cardArt={CARD_ART} cartoons={{}} films={FILMS} progressKey="lu-math-progress">
        <NumberCards age="kids" />
      </MoralSection>}
      juniors={<MoralSection age="juniors" section={AGE_SECTIONS.juniors} groups={[{ id: "juniors-math", lessons: LESSONS.juniors }]}
        cardArt={CARD_ART} cartoons={{}} films={FILMS} progressKey="lu-math-progress">
        <NumberCards age="juniors" />
      </MoralSection>}
    />
    <OtherIslands current={island.slug} />
  </div>;
}
