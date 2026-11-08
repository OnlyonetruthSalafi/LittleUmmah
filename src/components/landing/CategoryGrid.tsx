import type { CSSProperties } from "react";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import { IslandCard } from "@/components/landing/IslandCard";
import { HOME_ISLANDS } from "@/lib/categories";

// Arabic leads reading order and stays highest at every breakpoint.
const ISLANDS = HOME_ISLANDS.learn;

export function CategoryGrid({ locale }: { locale: Locale }) {
  const { t, sub } = dict(locale);
  return (
    <section data-home-zone="learn" aria-labelledby="learn-heading" className="island-arc home-islands mx-auto w-full max-w-[96rem] px-3 pb-6 sm:px-6">
      <h2 id="learn-heading" className="home-zone-heading">{t.categoryGrid.heading}
        {sub && <span lang="en">{sub.categoryGrid.heading}</span>}
      </h2>
      <ul className="learn-island-grid">
        {ISLANDS.map((category, index) => {
          // LearnArc: x=30+700t, y=150-260t(1-t).
          // Normalized y=(y-85)/65=(2t-1)^2. One arch.
          // ปลายโค้งไม่วางที่ t=0/1 (ช่วงชันที่สุดของพาราโบลา เกาะปลายตกลึกและชิดขอบจอ เจ้าของโปรเจกต์ทักว่าเกาะขวาต่ำไป 8 พ.ย. 2026)
          // ใช้ t ห่างเท่ากัน 0.1–0.9: ปลาย y=0.64 คู่ใน y=0.16 โค้งนุ่มขึ้น ยังเป็นสมการเดียวกับคำ "Learn, Play, Grow"
          const arcT = [.5, .1, .3, .7, .9][index];
          const portraitY = index === 0 ? 0 : index === 2 || index === 3 ? .5 : 1;
          const portraitT = (1 - Math.sqrt(portraitY)) / 2;
          const left = index === 1 || index === 2;
          const style = {
            "--arc-t": arcT, "--arc-y": (2 * arcT - 1) ** 2,
            "--portrait-column": portraitY === 0 ? .5 : left ? 0 : 1,
            "--portrait-t": left ? portraitT : 1 - portraitT,
            "--portrait-y": portraitY,
          } as CSSProperties;
          return <IslandCard key={category.slug} category={category} style={style} />;
        })}
      </ul>
    </section>
  );
}
