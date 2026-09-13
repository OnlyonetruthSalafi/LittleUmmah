"use client";

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
  const group = AGE_GROUPS.find(group => group.id === ageGroup)!;
  const { speak } = useSound();
  const [round, setRound] = useState(() => createMemoryState(MEMORY_ITEMS.slice(0, group.pairs)));
  const { deck, started, open, matched, moves } = round;
  const [announcement, setAnnouncement] = useState("กดเริ่มเล่นเพื่อสับการ์ด");
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
    setAnnouncement("เริ่มแล้ว เลือกการ์ดสองใบที่มีภาพเหมือนกัน");
    speak("เลือกการ์ดสองใบที่มีภาพเหมือนกัน");
    // เล่นซ้ำยังคง started=true จึงคืนโฟกัสหลัง React วาดกระดานใหม่
    requestAnimationFrame(() => firstCard.current?.focus());
  }

  function flip(card: MemoryCard) {
    const next = chooseMemoryCard(round, card.id);
    if (next === round) return;
    speak(card.item.nameTh);
    setRound(next);
    if (next.open.length === 1) {
      setAnnouncement(`เปิด ${card.item.nameTh} เลือกอีกหนึ่งใบ`);
      return;
    }
    const first = deck.find(candidate => candidate.id === next.open[0])!;
    const isMatch = isMemoryMatch(next);
    setAnnouncement(isMatch
      ? `จับคู่ ${card.item.nameTh} ได้แล้ว`
      : `${first.item.nameTh} กับ ${card.item.nameTh} ยังไม่เหมือนกัน ลองจำภาพไว้นะ`);
    // เว้นเวลาให้เด็กเห็นภาพทั้งสองใบ และไม่ตัดเสียงชื่อด้วยคำชมทันที
    timer.current = setTimeout(() => {
      if (isMatch) {
        const found = settleMemoryTurn(next).matched;
        speak("เก่งมาก");
        setAnnouncement(found.length === group.pairs
          ? `เก่งมาก! จับคู่ครบ ${group.pairs} คู่ ใช้ ${next.moves} ครั้ง`
          : `เก่งมาก จับคู่ได้ ${found.length} จาก ${group.pairs} คู่`);
      } else {
        setAnnouncement("คว่ำการ์ดแล้ว ลองเลือกคู่อีกครั้ง");
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
          จับคู่ภาพ
          <span lang="en" className="block text-xl font-semibold">Memory Match</span>
        </h1>
        <p className="mt-2 font-bold">{group.nameTh} · {group.pairs} คู่</p>
        <p lang="en" className="text-sm">{group.nameEn} · {group.pairs} pairs</p>
        <p id="memory-help" className="mt-4">แตะการ์ดสองใบ หาภาพที่เหมือนกัน</p>
        <p lang="en" className="text-sm">Turn over two cards. Find the matching pictures.</p>
      </div>
      <div className="my-5 flex flex-wrap justify-center gap-3 text-center">
        <p className="rounded-card-sm scene-copy px-5 py-3 font-bold">
          จับคู่ได้ {matched.length} / {group.pairs}
          <span lang="en" className="block text-xs font-normal">Pairs found</span>
        </p>
        <p className="rounded-card-sm scene-copy px-5 py-3 font-bold">
          เปิดแล้ว {moves} ครั้ง
          <span lang="en" className="block text-xs font-normal">Moves</span>
        </p>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="mx-auto mb-5 min-h-12 max-w-xl text-center text-sm">
        {announcement}
      </p>
      {!started && <div className="mb-6 text-center">
        <button className={gameButtonClass} onClick={start}>
          เริ่มเล่น<span lang="en" className="text-sm font-normal">Start</span>
        </button>
      </div>}
      {won ? <div className="mx-auto max-w-lg rounded-card scene-copy p-6 text-center">
        <Image src="/Character/fighting.webp" alt="" width={200} height={200} sizes="200px" className="logo-mark-glow mx-auto size-40 object-contain sm:size-48" />
        <h2 ref={winHeading} tabIndex={-1} className="mt-2 font-display text-3xl font-extrabold">
          เก่งมาก!<span lang="en" className="block text-2xl">Well done!</span>
        </h2>
        <p className="mt-3">จับคู่ครบแล้ว มาเล่นกันอีกนะ</p>
        <p lang="en" className="text-sm">You found every pair!</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button onClick={start} className={gameButtonClass}>
            <span>เล่นอีกครั้ง<span lang="en" className="block text-xs font-normal">Play again</span></span>
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
            aria-label={`การ์ดใบที่ ${index + 1}, ${revealed ? card.item.nameTh : "คว่ำอยู่"}${isMatched ? ", จับคู่แล้ว" : ""}`}
            onClick={() => flip(card)}
            className={`group flex min-h-28 min-w-16 flex-col items-center justify-center rounded-card-sm border-2 border-brand-blue p-2 text-ink shadow-soft transition-shadow duration-200 ease-out enabled:hover:shadow-float ${revealed ? "bg-cloud" : "bg-sky"} ${ageGroup === "kids" ? "aspect-[4/5] sm:aspect-square" : "aspect-[3/4] sm:aspect-square"}`}
          >
            {/* แสดงภาพด้วย state โดยตรง ไม่พึ่งการหมุน 3D เพื่อให้ปิด motion แล้วยังเล่นได้ */}
            <span className="flex aspect-square w-3/4 max-w-36 items-center justify-center overflow-hidden rounded-xl transition-transform duration-200 ease-out motion-safe:group-enabled:group-hover:-translate-y-1 motion-safe:group-enabled:group-hover:scale-[1.03] motion-safe:group-enabled:group-active:scale-[0.98] group-active:duration-75">
              <GameIcon name={revealed ? card.item.icon : "sparkle"} className="size-full" />
            </span>
            <span aria-hidden="true" className={`block min-h-12 text-center leading-normal ${ageGroup === "kids" ? "text-base sm:text-lg" : "text-xs sm:text-base"}`}>
              {revealed ? <>
                <span className="block font-bold">{card.item.nameTh}</span>
                <span lang="en" className="block text-xs">{card.item.nameEn}</span>
              </> : <span className="font-display text-xl font-bold">{index + 1}</span>}
            </span>
            <span aria-hidden="true" className="flex min-h-6 items-center gap-1 text-xs font-bold">{isMatched && <><GameIcon name="check" className="size-5" />จับคู่แล้ว</>}</span>
          </button>;
        })}
      </div>}
    </section>
  </>;
}
