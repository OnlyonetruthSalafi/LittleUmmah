import type { CSSProperties } from "react";
import { dict } from "@/i18n/dict";
import type { Locale } from "@/i18n/config";
import { HOME_ISLANDS } from "@/lib/categories";
import { IslandCard } from "./IslandCard";

export function PlayIslands({ locale }: { locale: Locale }) {
  const { t, sub } = dict(locale);
  return (
    <section data-home-zone="play" aria-labelledby="play-heading" className="play-islands home-islands mx-auto w-full max-w-[96rem] px-3 sm:px-6">
      <h2 id="play-heading" className="home-zone-heading">{t.homePlay.heading}
        {sub && <span lang="en">{sub.homePlay.heading}</span>}
      </h2>
      <ul className="play-island-arc">
        {HOME_ISLANDS.play.map((island, index) => {
          // ObeyArc's quadratic Bézier: P0=(30,40), P1=(380,170), P2=(730,40).
          // x(t)=30+700t; y(t)=40+260t(1-t). Normalize y: (y-40)/65=4t(1-t).
          // Both layouts use this exact parabola, with responsive x/y scaling.
          // Two columns fold the parabola on narrow screens. Equal y steps
          // use the inverse parabola t=(1-sqrt(1-y))/2, avoiding empty sky.
          const t = [0, .25, .5, .75, 1][index];
          const portraitY = Math.min(index, 4 - index) / 2;
          const portraitT = (1 - Math.sqrt(1 - portraitY)) / 2;
          const style = {
            "--arc-t": t, "--arc-y": 4 * t * (1 - t),
            "--portrait-column": index < 2 ? 0 : index > 2 ? 1 : .5,
            "--portrait-t": index <= 2 ? portraitT : 1 - portraitT,
            "--portrait-y": portraitY,
          } as CSSProperties;
          return <IslandCard key={island.slug} category={island} style={style} />;
        })}
      </ul>
    </section>
  );
}
