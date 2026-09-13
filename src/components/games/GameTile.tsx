"use client";

import Link from "next/link";
import { GameIcon } from "@/components/icons/GameIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { AGE_GROUPS, type Game } from "@/lib/games";
import { isScrollHover } from "@/lib/scrollHover";

export function GameTile({ game }: { game: Game }) {
  const { speak } = useSound();
  const playable = game.status === "playable";
  const pairs = AGE_GROUPS.find(group => group.id === game.ageGroup)!.pairs;
  const content = <>
    {/* ลดความสดเฉพาะภาพ เพื่อรักษา contrast ของชื่อและป้ายสถานะ */}
    <span className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-card border-4 border-cloud ${game.color} shadow-soft ${playable ? "transition-[transform,box-shadow] duration-200 ease-out group-hover:shadow-float group-focus-visible:shadow-float motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.03] motion-safe:group-active:scale-[0.98] group-active:duration-75" : ""}`}>
      <GameIcon name={game.icon} className={`size-3/4 ${playable ? "logo-mark-glow" : "opacity-50 saturate-50"}`} />
      {!playable && <span className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1 rounded-full scene-copy px-2 py-1 text-xs font-bold sm:text-sm"><GameIcon name="lock" className="size-5 shrink-0" />เร็วๆ นี้</span>}
    </span>
    <span className="mt-3 block text-center font-display text-lg font-bold leading-normal sm:text-xl">{game.nameTh}</span>
    <span lang="en" className="block text-center font-display text-sm">{game.nameEn}</span>
    <span className="mt-1 block text-center text-xs font-semibold">
      {playable ? <>{pairs} คู่ · เล่นเลย<span lang="en" className="block font-normal">{pairs} pairs · Play</span></> : <span lang="en">Coming soon</span>}
    </span>
  </>;
  return <li>{playable ? <Link
    href={game.href}
    className="group block rounded-card text-ink"
    onPointerEnter={event => {
      // ignore pointerenter caused by scrolling under a still mouse (see lib/scrollHover)
      if (event.pointerType === "mouse" && !isScrollHover()) speak(game.nameTh, game.slug);
    }}
    onFocus={event => {
      if (event.currentTarget.matches(":focus-visible")) speak(game.nameTh, game.slug);
    }}
    onClick={() => speak(game.nameTh, game.slug)}
  >
    {content}
  </Link> : <div className="text-ink">{content}</div>}</li>;
}
