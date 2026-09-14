"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { PauseIcon } from "@/components/icons/PauseIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";
import { ReplayIcon } from "@/components/icons/ReplayIcon";
import { GameIcon } from "@/components/icons/GameIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { playNarration, speakWithSynth, stopAllSpeech } from "@/lib/speech";

import { narrationSrc } from "../index";
import type { Story, StoryPage } from "../types";
import "../story.css";

/*
  หนังสือนิทาน 2.5D

  สถานะหน้า: -1 = ปกปิดอยู่, 0..n-1 = หน้าคู่ที่เปิดอยู่
  ภาพแต่ละหน้าเป็นภาพเดียวกว้างสองหน้า ตัดครึ่งซ้าย-ขวาตรงสันหนังสือ
  ตอนพลิกไปข้างหน้า แผ่นที่พลิกมี "หน้า" = ครึ่งขวาของภาพเดิม และ "หลัง" = ครึ่งซ้ายของภาพถัดไป
  ใต้แผ่นคือครึ่งขวาของภาพถัดไป เหมือนหนังสือจริง

  โหมดเล่นอัตโนมัติ: เสียงพากย์จบ -> พักสั้นๆ -> พลิก -> พากย์หน้าถัดไป จนจบเล่ม
  ปิดเสียงอยู่: ใช้เวลาอ่านตามความยาวข้อความแทน
  ปิดการเคลื่อนไหว: ไม่พลิก 3D เปลี่ยนหน้าแบบจางเข้าแทน (ข้อ 2.1)
*/

const TURN_MS = 1000;
const PAUSE_AFTER_NARRATION_MS = 800;
const SIZES = "(max-width: 1140px) 100vw, 1100px";

type Turn = { from: number; to: number };

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** ครึ่งหนึ่งของภาพหน้าคู่ — ภาพกว้าง 200% แล้วเลื่อนให้เห็นเฉพาะด้านที่ต้องการ */
function Half({ page, side }: { page: StoryPage; side: "left" | "right" }) {
  return (
    <div className="sb-half" data-side={side}>
      <div className="sb-half-img">
        <Image src={page.image} alt="" fill sizes={SIZES} className="object-cover" />
      </div>
    </div>
  );
}

function Cover({ story }: { story: Story }) {
  return (
    <div className="sb-cover">
      <Image src={story.cover} alt="" fill sizes="(max-width: 1140px) 50vw, 550px" className="object-cover" priority />
      <div className="sb-cover-title" aria-hidden="true">
        <span className="sb-cover-th">{story.titleTh}</span>
        <span className="sb-cover-en" lang="en">
          {story.titleEn}
        </span>
      </div>
    </div>
  );
}

export function StoryBook({ story }: { story: Story }) {
  const { enabled: soundOn } = useSound();
  const count = story.pages.length;

  const [spread, setSpread] = useState(-1);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [auto, setAuto] = useState(false);
  /** นับว่าเด็กกดอะไรแล้วหรือยัง เบราว์เซอร์ไม่ให้เล่นเสียงก่อนผู้ใช้แตะจอ */
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const turnSfx = useRef<HTMLAudioElement | null>(null);

  const shown = turn ? turn.to : spread;
  const page = shown >= 0 ? story.pages[shown] : null;

  const goTo = useCallback(
    (to: number) => {
      if (turn || to === spread || to < -1 || to >= count) return;
      setFinished(false);
      if (prefersReducedMotion()) {
        setSpread(to);
        return;
      }
      if (soundOn) {
        turnSfx.current ??= new Audio("/audio/sfx/page-turn.mp3");
        turnSfx.current.currentTime = 0;
        turnSfx.current.volume = 0.7;
        void turnSfx.current.play().catch(() => {});
      }
      setTurn({ from: spread, to });
    },
    [turn, spread, count, soundOn],
  );

  const finishTurn = useCallback(() => {
    setTurn((t) => {
      if (t) setSpread(t.to);
      return null;
    });
  }, []);

  /*
    auto อ่านผ่าน ref ไม่ใส่ใน deps ของ effect เสียงพากย์
    ถ้าใส่ การกดพัก (auto เปลี่ยน) จะทำให้ effect รันใหม่แล้วเล่นเสียงหน้าเดิมซ้ำตั้งแต่ต้น
    narration บอกสถานะเสียงของหน้าปัจจุบัน ปุ่มเล่นต่อจะได้รู้ว่าควรพลิกเลยหรือเล่นหน้านี้ใหม่
  */
  const autoRef = useRef(false);
  const narration = useRef<"idle" | "playing" | "done" | "stopped">("idle");
  const [replay, setReplay] = useState(0);
  const setAutoMode = useCallback((on: boolean) => {
    autoRef.current = on;
    setAuto(on);
  }, []);

  /*
    มาจากตู้หนังสือ (?play=1): หนังสือลอยมาขยายกลางจอแล้ว เลื่อนเล่มจริงให้อยู่กลางจอตรงกัน แล้วเริ่มเล่นเอง
    เบราว์เซอร์ยอมให้เล่นเสียง เพราะเด็กเพิ่งแตะหนังสือในเอกสารเดียวกัน (เปลี่ยนหน้าแบบ client-side)
    ลบ ?play=1 ออกจาก URL กดรีเฟรชแล้วจะไม่เล่นเองอีก
  */
  const bookRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("play") !== "1") return;
    // ลบ param ใน callback ไม่ใช่ตัว effect: StrictMode รัน effect สองรอบ ถ้าลบตั้งแต่รอบแรก รอบจริงจะไม่เห็น param
    const frame = requestAnimationFrame(() => {
      window.history.replaceState(window.history.state, "", window.location.pathname);
      bookRef.current?.scrollIntoView({ block: "center" });
      setAutoMode(true);
      setStarted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [setAutoMode]);

  const advance = useCallback(() => {
    if (!autoRef.current) return;
    if (spread >= count - 1) {
      setAutoMode(false);
      setFinished(true);
    } else goTo(spread + 1);
  }, [spread, count, goTo, setAutoMode]);
  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  // เสียงพากย์ของหน้าที่หยุดนิ่งแล้ว (ไม่ทำงานระหว่างพลิก)
  useEffect(() => {
    if (!started || turn) return;
    const text = spread < 0 ? story.titleTh : [page?.th, page?.reading, page?.meaning].filter(Boolean).join(" ... ");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancel: (() => void) | undefined;
    let usedSynth = false;
    narration.current = "playing";

    const done = () => {
      narration.current = "done";
      timer = setTimeout(() => advanceRef.current(), PAUSE_AFTER_NARRATION_MS);
    };
    const readingTime = () => {
      timer = setTimeout(done, 2500 + text.length * 70);
    };

    if (!soundOn) {
      readingTime();
    } else {
      cancel = playNarration(narrationSrc(story, spread), {
        onEnded: done,
        // เสียงอื่นแทรก หรือกดปิดเสียง: พักหนังสือไว้ ไม่พลิกเอง
        onStopped: () => {
          narration.current = "stopped";
          setAutoMode(false);
        },
        onFail: () => {
          usedSynth = true;
          speakWithSynth(text);
          readingTime();
        },
      });
    }
    return () => {
      clearTimeout(timer);
      cancel?.();
      // เสียงสังเคราะห์สำรองไม่ผูกกับ cancel ของไฟล์เสียง ต้องหยุดเองตอนเปลี่ยนหน้า
      if (usedSynth) stopAllSpeech();
      if (narration.current === "playing") narration.current = "stopped";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- เล่นใหม่เฉพาะเมื่อหน้า/เสียง/การขอเล่นซ้ำเปลี่ยน
  }, [started, turn, spread, soundOn, replay]);

  // ปิดเสียง หรือออกจากหน้านี้: หยุดเสียงพลิกหน้าด้วย (เป็น Audio แยกจากช่องเสียงพูด)
  useEffect(() => {
    if (!soundOn) turnSfx.current?.pause();
  }, [soundOn]);
  useEffect(
    () => () => {
      stopAllSpeech();
      turnSfx.current?.pause();
    },
    [],
  );

  const play = () => {
    setAutoMode(true);
    if (!started) {
      setStarted(true);
      return;
    }
    if (finished) {
      setFinished(false);
      setSpread(-1);
      setReplay((n) => n + 1);
      return;
    }
    if (narration.current === "done") advanceRef.current();
    else if (narration.current !== "playing") setReplay((n) => n + 1);
  };
  const pause = () => {
    setAutoMode(false);
    stopAllSpeech();
  };
  const step = (delta: number) => {
    setStarted(true);
    goTo(spread + delta);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea")) return;
      if (e.key === "ArrowRight") {
        setStarted(true);
        goTo(spread + 1);
      } else if (e.key === "ArrowLeft") {
        setStarted(true);
        goTo(spread - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, spread]);

  // ชั้นภาพนิ่งซ้าย-ขวา ขณะพลิกเป็นส่วนผสมของหน้าเดิมกับหน้าใหม่
  const forward = turn ? turn.to > turn.from : true;
  const leftIndex = turn ? (forward ? turn.from : turn.to) : spread;
  const rightIndex = turn ? (forward ? turn.to : turn.from) : spread;
  const closed = (turn ? turn.to : spread) < 0;

  const preload = [spread + 1, spread + 2].filter((i) => i >= 0 && i < count);

  return (
    <section aria-label={`หนังสือนิทาน ${story.titleTh}`} className="sb-root mt-6">
      <div className="sb-stage">
        <div
          ref={bookRef}
          className="sb-book"
          data-closed={closed || undefined}
          data-turning={turn ? (forward ? "fwd" : "back") : undefined}
          role="img"
          aria-label={page ? page.alt : story.coverAlt}
        >
          <div className="sb-board" aria-hidden="true" />

          {/* หน้าซ้าย */}
          <div className="sb-page sb-page-left" aria-hidden="true">
            {leftIndex >= 0 ? <Half page={story.pages[leftIndex]} side="left" /> : <div className="sb-endpaper" />}
          </div>

          {/* หน้าขวา (หรือปกตอนปิดเล่ม) */}
          <div className="sb-page sb-page-right" aria-hidden="true">
            {rightIndex >= 0 ? <Half page={story.pages[rightIndex]} side="right" /> : <Cover story={story} />}
          </div>

          <div className="sb-gutter" aria-hidden="true" />

          {turn && (
            <div
              key={`${turn.from}-${turn.to}`}
              className="sb-leaf"
              data-dir={forward ? "fwd" : "back"}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) finishTurn();
              }}
              style={{ animationDuration: `${TURN_MS}ms` }}
              aria-hidden="true"
            >
              <div className="sb-face sb-face-front">
                {forward ? (
                  turn.from >= 0 ? <Half page={story.pages[turn.from]} side="right" /> : <Cover story={story} />
                ) : (
                  <Half page={story.pages[turn.from]} side="left" />
                )}
                <div className="sb-shade" />
              </div>
              <div className="sb-face sb-face-back">
                {forward ? (
                  <Half page={story.pages[turn.to]} side="left" />
                ) : turn.to >= 0 ? (
                  <Half page={story.pages[turn.to]} side="right" />
                ) : (
                  <Cover story={story} />
                )}
                <div className="sb-shade" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* โหลดภาพหน้าถัดไปไว้ก่อน จะได้ไม่กระพริบตอนพลิก */}
      <div className="sb-preload" aria-hidden="true">
        {preload.map((i) => (
          <Image key={i} src={story.pages[i].image} alt="" width={16} height={11} sizes={SIZES} />
        ))}
      </div>

      {/* ปุ่มอยู่ติดใต้หนังสือ เห็นพร้อมกันบนจอแล็ปท็อปเตี้ยๆ ข้อความตามมาข้างล่าง */}
      {/* grid คงที่ ปุ่มก่อน-เล่น-ถัดไปอยู่ตำแหน่งเดิมเสมอ ไม่ว่าป้ายปุ่มเล่นจะยาวแค่ไหน */}
      <div className="mx-auto mt-1 grid w-fit grid-cols-[auto_auto_auto] items-center justify-items-center gap-x-3 gap-y-2 sm:gap-x-5">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={spread < 0 || !!turn}
          className="sb-btn scene-copy text-ink"
        >
          <GameIcon name="back" className="size-7" />
          <span className="sr-only">หน้าก่อน</span>
        </button>

        {auto ? (
          <button type="button" onClick={pause} className="sb-btn sb-btn-main bg-sun text-sun-ink">
            <PauseIcon className="size-9" />
            <span>
              พัก
              <span lang="en" className="block text-xs font-normal">
                Pause
              </span>
            </span>
          </button>
        ) : (
          <button type="button" onClick={play} className="sb-btn sb-btn-main bg-sun text-sun-ink">
            {finished ? <ReplayIcon className="size-9" /> : <PlayIcon className="size-10" />}
            <span>
              {finished ? "อ่านอีกครั้ง" : spread < 0 ? "เล่นนิทาน" : "เล่นต่อ"}
              <span lang="en" className="block text-xs font-normal">
                {finished ? "Read again" : spread < 0 ? "Play" : "Continue"}
              </span>
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => step(1)}
          disabled={spread >= count - 1 || !!turn}
          className="sb-btn scene-copy text-ink"
        >
          <GameIcon name="back" className="size-7 -scale-x-100" />
          <span className="sr-only">หน้าถัดไป</span>
        </button>

        {/* live region สั้นๆ แค่เลขหน้า เนื้อเรื่องมีเสียงพากย์อยู่แล้ว ไม่ต้องให้ screen reader อ่านทับ */}
        <p className="text-ink col-span-3 font-bold tabular-nums" aria-live="polite">
          {shown < 0 ? "ปก" : `หน้า ${shown + 1} / ${count}`}
        </p>
      </div>

      <div className="scene-copy shadow-soft rounded-card mx-auto mt-5 flex max-w-4xl gap-3 p-4 sm:gap-5 sm:p-6">
        {/* หุ่นยนต์ผู้เล่าเรื่อง ภาพตกแต่ง */}
        <Image src={story.robot} alt="" width={112} height={112} className="size-16 shrink-0 object-contain sm:size-28" />
        <div className="sb-text min-w-0 flex-1">
          {page ? (
            <>
              <p className="text-xl leading-relaxed font-semibold sm:text-2xl">{page.th}</p>
              <p lang="en" className="text-ink-soft mt-2 text-sm sm:text-base">
                {page.en}
              </p>
              {page.arabic && (
                <div className="bg-sky-pale rounded-card-sm mt-3 px-4 py-3">
                  <p lang="ar" dir="rtl" className="text-2xl leading-loose font-semibold sm:text-3xl">
                    {page.arabic}
                  </p>
                  {page.reading && <p className="mt-1 font-semibold">อ่านว่า: {page.reading}</p>}
                  {page.meaning && <p className="text-ink-soft text-sm">ความหมาย: {page.meaning}</p>}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-xl leading-relaxed font-semibold sm:text-2xl">กดปุ่มเล่น แล้วมาฟังนิทานกันนะ</p>
              <p lang="en" className="text-ink-soft mt-1 text-sm sm:text-base">
                Press play and let&apos;s listen to the story!
              </p>
            </>
          )}
          {finished && (
            <p className="font-display text-brand-blue mt-3 text-2xl font-extrabold">
              จบแล้ว <span lang="en">The End</span>
            </p>
          )}
        </div>
      </div>

      {finished && (
        <div className="mt-5 flex justify-center">
          <Link href="/learn/stories" className="sb-btn scene-copy text-ink px-6">
            กลับเกาะเรื่องเล่า
            <span lang="en" className="text-sm font-normal">
              Stories
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
