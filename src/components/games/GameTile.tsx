"use client";

import { fmt } from "@/i18n/dict";
import { useDict } from "@/i18n/LocaleProvider";

import { LocaleLink as Link } from "@/i18n/LocaleProvider";
import { GameIcon } from "@/components/icons/GameIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { AGE_GROUPS, type Game } from "@/lib/games";
import { isScrollHover } from "@/lib/scrollHover";

export function GameTile({ game }: { game: Game }) {
  const { t, sub, pick, pickSub } = useDict();
  const { speak } = useSound();
  const playable = game.status === "playable";
  const pairs = AGE_GROUPS.find(group => group.id === game.ageGroup)!.pairs;
  const content = <>
    {/* ลดความสดเฉพาะภาพ เพื่อรักษา contrast ของชื่อและป้ายสถานะ */}
    <span className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-card border-4 border-cloud ${game.color} shadow-soft ${playable ? "transition-[transform,box-shadow] duration-200 ease-out group-hover:shadow-float group-focus-visible:shadow-float motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.03] motion-safe:group-active:scale-[0.98] group-active:duration-75" : ""}`}>
      <GameIcon name={game.icon} className={`size-3/4 ${playable ? "logo-mark-glow" : "opacity-50 saturate-50"}`} />
      {!playable && <span className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1 rounded-full scene-copy px-2 py-1 text-xs font-bold sm:text-sm"><GameIcon name="lock" className="size-5 shrink-0" />{t.gameTile.soon}</span>}
    </span>
    <span className="mt-3 block text-center font-display text-lg font-bold leading-normal sm:text-xl">{pick(game.name)}</span>
    {sub && <span lang="en" className="block text-center font-display text-sm">{pickSub(game.name)}</span>}
    <span className="mt-1 block text-center text-xs font-semibold">
      {playable ? <>{fmt(t.gameTile.play, { pairs })}{sub && <span lang="en" className="block font-normal">{fmt(sub.gameTile.play, { pairs })}</span>}</> : sub && <span lang="en">{sub.gameTile.soon}</span>}
    </span>
  </>;
  return <li>{playable ? <Link
    href={game.href}
    className="group block rounded-card text-ink"
    onPointerEnter={event => {
      // ignore pointerenter caused by scrolling under a still mouse (see lib/scrollHover)
      if (event.pointerType === "mouse" && !isScrollHover()) speak(pick(game.name), game.slug);
    }}
    onFocus={event => {
      if (event.currentTarget.matches(":focus-visible")) speak(pick(game.name), game.slug);
    }}
    onClick={() => speak(pick(game.name), game.slug)}
  >
    {content}
  </Link> : <div className="text-ink">{content}</div>}</li>;
}
