import { AgeSections } from "@/components/learn/AgeSections";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { BackLink } from "@/components/ui/BackLink";
import { OtherIslands } from "@/components/islands/OtherIslands";
import { MoralHero } from "@/features/moral/components/MoralHero";
import { MoralSection } from "@/features/moral/components/MoralLessons";
import { AGE_SECTIONS, CARD_ART, CARTOONS, GUIDE_STEPS, LESSONS } from "@/features/faith/data";
import { CATEGORIES } from "@/lib/categories";
import { categoryMetadata } from "@/lib/seo";

const category = CATEGORIES.find((entry) => entry.slug === "faith-basics")!;
// Namespace audio at the page boundary; the approved lesson data stays untouched.
const steps = GUIDE_STEPS.map((step) => ({ ...step, clip: `faith/${step.clip}` }));
const cartoons = Object.fromEntries(Object.entries(CARTOONS).map(([id, cartoon]) => [id, {
  ...cartoon,
  scenes: cartoon.scenes.map((scene) => ({
    ...scene,
    clip: `faith/${scene.clip}`,
  })),
}]));
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { pick } = dict(lang as Locale);
  return categoryMetadata(lang as Locale, "faith-basics", pick(category.name));
}

export default function FaithIslandPage() {
  const section = (age: "kids" | "juniors") => (
    <MoralSection
      age={age}
      section={AGE_SECTIONS[age]}
      groups={[{ id: `${age}-faith`, lessons: LESSONS[age] }]}
      cardArt={CARD_ART}
      cartoons={cartoons}
      progressKey="lu-faith-progress"
    />
  );
  return <div className="mrl-page">
    <BackLink />
    <MoralHero
      title={category.name}
      intro={GUIDE_STEPS[0]}
      steps={steps}
      ageSections={AGE_SECTIONS}
      art={{ src: "/Character/faith.webp", width: 400, height: 400 }}
      seenKey="lu-faith-guide-seen"
    />
    <AgeSections kids={section("kids")} juniors={section("juniors")} />
    <OtherIslands current="faith-basics" />
  </div>;
}
