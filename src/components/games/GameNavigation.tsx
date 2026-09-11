"use client";

import Link from "next/link";
import { GameIcon } from "@/components/icons/GameIcon";
import { useSound } from "@/components/sound/SoundProvider";

export const gameButtonClass = "inline-flex min-h-16 min-w-16 items-center justify-center gap-2 rounded-full bg-cloud px-6 py-3 font-bold text-ink shadow-soft transition-[transform,box-shadow] duration-200 ease-out hover:shadow-float motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] active:duration-75";

export function GameNavigation({ home = false }: { home?: boolean }) {
  const { speak } = useSound();
  const label = home ? "หน้าแรก" : "กลับหน้าเกม";
  return <Link href={home ? "/" : "/learn/games"} onClick={() => speak(label)} className={gameButtonClass}>
    <GameIcon name="back" className="size-6" />
    <span>{label}<span lang="en" className="block text-xs font-normal">{home ? "Home" : "Games"}</span></span>
  </Link>;
}
