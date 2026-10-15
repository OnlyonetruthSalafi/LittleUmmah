"use client";

import { fmt } from "@/i18n/dict";
import { useDict } from "@/i18n/LocaleProvider";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GameIcon } from "@/components/icons/GameIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { AGE_GROUPS, MEMORY_ITEMS, type AgeGroup } from "@/lib/games";
import {
  chooseMemoryCard,
  createMemoryState,
  isMemoryMatch,
  settleMemoryTurn,
  startMemoryRound,
  type MemoryCard,
} from "@/lib/memory-game";
import { GameNavigation, gameButtonClass } from "./GameNavigation";

export function MemoryGame({ ageGroup }: { ageGroup: AgeGroup }) {
  const { t, sub, pick, pickSub } = useDict();
  const group = AGE_GROUPS.find(group => group.id === ageGroup)!;
  const { speak } = useSound();
  const [round, setRound] = useState(() => createMemoryState(MEMORY_ITEMS.slice(0, group.pairs)));
  const { deck, started, open, matched, moves } = round;
  const [announcement, setAnnouncement] = useState(t.memoryGame.ready);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstCard = useRef<HTMLButtonElement>(null);
  const winHeading = useRef<HTMLHeadingElement>(null);
  const won = matched.length === group.pairs;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    if (won) winHeading.current?.focus();
  }, [won]);
  useEffect(() => {
    if (started) firstCard.current?.focus();
  }, [started]);

  function start() {
    if (timer.current) clearTimeout(timer.current);
    // สุ่มตอนกดเริ่มเท่านั้น HTML จากเซิร์ฟเวอร์จึงตรงกับการแสดงผลครั้งแรก
    setRound(startMemoryRound(round));
    setAnnouncement(t.memoryGame.started);
    speak(t.memoryGame.choose);
    // เล่นซ้ำยังคง started=true จึงคืนโฟกัสหลัง React วาดกระดานใหม่
    requestAnimationFrame(() => firstCard.current?.focus());
  }

  function flip(card: MemoryCard) {
    const next = chooseMemoryCard(round, card.id);
    if (next === round) return;
    speak(pick(card.item.name));
    setRound(next);
    if (next.open.length === 1) {
      setAnnouncement(fmt(t.memoryGame.opened, { name: pick(card.item.name) }));
      return;
    }
    const first = deck.find(candidate => candidate.id === next.open[0])!;
    const isMatch = isMemoryMatch(next);
    setAnnouncement(isMatch
      ? fmt(t.memoryGame.found, { name: pick(card.item.name) })
      : fmt(t.memoryGame.mismatch, { first: pick(first.item.name), name: pick(card.item.name) }));
    // เว้นเวลาให้เด็กเห็นภาพทั้งสองใบ และไม่ตัดเสียงชื่อด้วยคำชมทันที
    timer.current = setTimeout(() => {
      if (isMatch) {
        const found = settleMemoryTurn(next).matched;
        speak(t.memoryGame.praise);
        setAnnouncement(found.length === group.pairs
          ? fmt(t.memoryGame.wonAnnouncement, { pairs: group.pairs, moves: next.moves })
          : fmt(t.memoryGame.progress, { found: found.length, pairs: group.pairs }));
      } else {
        setAnnouncement(t.memoryGame.hiddenAnnouncement);
      }
      setRound(settleMemoryTurn(next));
      timer.current = null;
    }, 900);
  }

  return <>
    <GameNavigation />
    <section className="mt-6 rounded-card scene-copy p-4 shadow-soft sm:p-8" aria-labelledby="memory-title">
      <div className="text-center">
        <h1 id="memory-title" className="font-display text-3xl font-extrabold sm:text-4xl">
          {t.memoryGame.title}
          {sub && <span lang="en" className="block text-xl font-semibold">{sub.memoryGame.title}</span>}
        </h1>
        <p className="mt-2 font-bold">{fmt(t.memoryGame.groupPairs, { group: pick(group.name), pairs: group.pairs })}</p>
        {sub && <p lang="en" className="text-sm">{fmt(sub.memoryGame.groupPairs, { group: pickSub(group.name)!, pairs: group.pairs })}</p>}
        <p id="memory-help" className="mt-4">{t.memoryGame.help}</p>
        {sub && <p lang="en" className="text-sm">{sub.memoryGame.help}</p>}
      </div>
      <div className="my-5 flex flex-wrap justify-center gap-3 text-center">
        <p className="rounded-card-sm scene-copy px-5 py-3 font-bold">
          {fmt(t.memoryGame.pairsFound, { found: matched.length, pairs: group.pairs })}
          {sub && <span lang="en" className="block text-xs font-normal">{sub.memoryGame.pairsCaption}</span>}
        </p>
        <p className="rounded-card-sm scene-copy px-5 py-3 font-bold">
          {fmt(t.memoryGame.moves, { moves })}
          {sub && <span lang="en" className="block text-xs font-normal">{sub.memoryGame.movesCaption}</span>}
        </p>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="mx-auto mb-5 min-h-12 max-w-xl text-center text-sm">
        {announcement}
      </p>
      {!started && <div className="mb-6 text-center">
        <button className={`${gameButtonClass} ui-pill-primary`} onClick={start}>
          <span>{t.memoryGame.start}{sub && <span lang="en" className="ui-sub">{sub.memoryGame.start}</span>}</span>
        </button>
      </div>}
      {won ? <div className="mx-auto max-w-lg rounded-card scene-copy p-6 text-center">
        <Image src="/Character/fighting.webp" alt="" width={200} height={200} sizes="200px" className="logo-mark-glow mx-auto size-40 object-contain sm:size-48" />
        <h2 ref={winHeading} tabIndex={-1} className="mt-2 font-display text-3xl font-extrabold">
          {t.memoryGame.wellDone}{sub && <span lang="en" className="block text-2xl">{sub.memoryGame.wellDone}</span>}
        </h2>
        <p className="mt-3">{t.memoryGame.complete}</p>
        {sub && <p lang="en" className="text-sm">{sub.memoryGame.complete}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button onClick={start} className={gameButtonClass}>
            <span>{t.memoryGame.again}{sub && <span lang="en" className="ui-sub">{sub.memoryGame.again}</span>}</span>
          </button>
          <GameNavigation />
        </div>
      </div> : <div
        aria-describedby="memory-help"
        className={`mx-auto grid gap-3 sm:gap-5 ${ageGroup === "kids" ? "max-w-3xl grid-cols-2 sm:grid-cols-3" : "max-w-4xl grid-cols-3 sm:grid-cols-4"}`}
      >
        {deck.map((card, index) => {
          const isMatched = matched.includes(card.item.icon);
          const revealed = open.includes(card.id) || isMatched;
          return <button
            key={card.id}
            ref={index === 0 ? firstCard : undefined}
            type="button"
            // ไม่ disabled การ์ดที่จับคู่แล้ว ไม่งั้นโฟกัสคีย์บอร์ดหลุดหายกลางเกม
            // chooseMemoryCard เมินการ์ดที่จับคู่แล้วอยู่แล้ว aria-disabled จึงพอ
            disabled={!started}
            aria-disabled={!started || isMatched || open.length === 2 || open.includes(card.id)}
            aria-pressed={revealed}
            aria-label={fmt(t.memoryGame.card, { index: index + 1, state: revealed ? pick(card.item.name) : t.memoryGame.faceDown, matched: isMatched ? t.memoryGame.matchedSuffix : "" })}
            onClick={() => flip(card)}
            className={`group flex min-h-28 min-w-16 flex-col items-center justify-center rounded-card-sm border-2 border-brand-blue p-2 text-ink shadow-soft transition-shadow duration-200 ease-out enabled:hover:shadow-float ${revealed ? "bg-cloud" : "bg-sky"} ${ageGroup === "kids" ? "aspect-[4/5] sm:aspect-square" : "aspect-[3/4] sm:aspect-square"}`}
          >
            {/* แสดงภาพด้วย state โดยตรง ไม่พึ่งการหมุน 3D เพื่อให้ปิด motion แล้วยังเล่นได้ */}
            <span className="flex aspect-square w-3/4 max-w-36 items-center justify-center overflow-hidden rounded-xl transition-transform duration-200 ease-out motion-safe:group-enabled:group-hover:-translate-y-1 motion-safe:group-enabled:group-hover:scale-[1.03] motion-safe:group-enabled:group-active:scale-[0.98] group-active:duration-75">
              <GameIcon name={revealed ? card.item.icon : "sparkle"} className="size-full" />
            </span>
            <span aria-hidden="true" className={`block min-h-12 text-center leading-normal ${ageGroup === "kids" ? "text-base sm:text-lg" : "text-xs sm:text-base"}`}>
              {revealed ? <>
                <span className="block font-bold">{pick(card.item.name)}</span>
                {sub && <span lang="en" className="block text-xs">{pickSub(card.item.name)}</span>}
              </> : <span className="font-display text-xl font-bold">{index + 1}</span>}
            </span>
            <span aria-hidden="true" className="flex min-h-6 items-center gap-1 text-xs font-bold">{isMatched && <><GameIcon name="check" className="size-5" />{t.memoryGame.matched}</>}</span>
          </button>;
        })}
      </div>}
    </section>
  </>;
}
