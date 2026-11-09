"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { PauseIcon } from "@/components/icons/PauseIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";
import { ReplayIcon } from "@/components/icons/ReplayIcon";
import { ArrowLeftIcon } from "@/components/icons/ArrowLeftIcon";
import { BackLink } from "@/components/ui/BackLink";
import { ArabicText } from "@/components/ui/ArabicText";
import { useSound } from "@/components/sound/SoundProvider";
import { playNarration, speakWithSynth, stopAllSpeech } from "@/lib/speech";

import { narrationSrc } from "../index";
import type { Story, StoryPage } from "../types";
import { useAmbience } from "../useAmbience";
import { CurlLeaf } from "./CurlLeaf";
import { DeluxeCover, GoldBurst } from "./DeluxeCover";
import { FishShadow, SceneFx } from "./SceneFx";
import "../story.css";
import "../story-deluxe.css";
import { useDict } from "@/i18n/LocaleProvider";
import { fmt } from "@/i18n/dict";

/*
  หนังสือนิทาน 2.5D

  สถานะหน้า: -1 = ปกปิดอยู่, 0..n-1 = หน้าคู่ที่เปิดอยู่
  ภาพแต่ละหน้าเป็นภาพเดียวกว้างสองหน้า ตัดครึ่งซ้าย-ขวาตรงสันหนังสือ
  ตอนพลิกไปข้างหน้า แผ่นที่พลิกมี "หน้า" = ครึ่งขวาของภาพเดิม และ "หลัง" = ครึ่งซ้ายของภาพถัดไป
  ใต้แผ่นคือครึ่งขวาของภาพถัดไป เหมือนหนังสือจริง

  โหมดเล่นอัตโนมัติ: เสียงพากย์จบ -> พักสั้นๆ -> พลิก -> พากย์หน้าถัดไป จนจบเล่ม
  ปิดเสียงอยู่: ใช้เวลาอ่านตามความยาวข้อความแทน
  ปิดการเคลื่อนไหว: ไม่พลิก 3D เปลี่ยนหน้าแบบจางเข้าแทน (ข้อ 2.1)

  แบบอลังการ (story.deluxe): ปกหนังแข็ง ประกายทองตอนจบเรื่อง
  เล่มสมจริง (deluxe.book) เปิดเหมือนหนังสือตัวอย่างของเจ้าของโปรเจกต์ (7 ต.ค. 2026 ตามคำแนะนำของ Codex):
  เล่มเปิดวางเต็มขนาดตั้งแต่แรก ปกวางทับครึ่งขวา -> ปกแข็งพลิกไปซ้าย (ด้านในปกเป็นกระดาษครีม)
  -> พักสั้นๆ -> กระดาษแผ่นแรก (หน้าชื่อเรื่อง) โค้งพลิก เผยภาพหน้า 1  ปิดเล่มเล่นย้อนกลับ
  ระหว่างสองจังหวะนี้ turn.phase บอกว่าแผ่นไหนกำลังพลิก เปิดเล่มทั้งชุดนับเป็นการพลิกครั้งเดียว
  กระดาษโค้งตอนพลิก (CurlLeaf) ฉากเคลื่อนไหวบนภาพ (SceneFx) และเสียงบรรยากาศวนซ้ำ (useAmbience)
  ตรรกะการเล่า/เสียงพากย์/เล่นอัตโนมัติใช้ชุดเดียวกับแบบเดิมทั้งหมด
*/

const TURN_MS = 1000;
const CURL_MS = 1150;
const COVER_MS = 1500;
/** เล่มสมจริง: ปกพลิกเสร็จแล้วพักก่อนกระดาษแผ่นแรกพลิกตาม */
const REAL_COVER_MS = 900;
const REAL_HOLD_MS = 150;
const REAL_PAPER_MS = 1000;
const SFX_PAGE = "/audio/sfx/story-page-curl.mp3";
const SFX_COVER = "/audio/sfx/story-book-open.mp3";
const SFX_FALLBACK = "/audio/sfx/page-turn.mp3";
const PAUSE_AFTER_NARRATION_MS = 800;
const SIZES = "(max-width: 1140px) 100vw, 1100px";

/** phase ใช้เฉพาะเล่มสมจริงตอนเปิด/ปิดปก: cover = ปกแข็งพลิก, hold = ปกเปิดแล้วพักครู่หนึ่ง, paper = หน้าชื่อเรื่องพลิก */
type Turn = { from: number; to: number; phase?: "cover" | "hold" | "paper" };

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
  const { pick, pickSub } = useDict();
  if (story.deluxe) return <DeluxeCover story={story} />;
  return (
    <div className="sb-cover">
      <Image src={story.cover} alt="" fill sizes="(max-width: 1140px) 50vw, 550px" className="object-cover" priority />
      <div className="sb-cover-title" aria-hidden="true">
        <span className="sb-cover-th">{pick(story.title)}</span>
        {pickSub(story.title) && <span className="sb-cover-en" lang="en">
          {pickSub(story.title)}
        </span>}
      </div>
    </div>
  );
}

/** หน้าชื่อเรื่องใต้ปก (เล่มสมจริง) ตัวหนังสือจริง ไม่ฝังในภาพ — aria-hidden เพราะมี h1 ชื่อเรื่องแล้ว */
function TitlePage({ story }: { story: Story }) {
  const { pick, pickSub } = useDict();
  return (
    <div className="sbx-titlepage" aria-hidden="true">
      <span className="sbx-tp-th">{pick(story.title)}</span>
      {pickSub(story.title) && <span className="sbx-tp-en" lang="en">
        {pickSub(story.title)}
      </span>}
    </div>
  );
}

/**
  ภาพเล่มหนังสือเปิดหน้าว่าง วางให้กรอบหน้ากระดาษในภาพทับพื้นที่หน้าของ .sb-book พอดี
  ส่วนปก ขอบกระดาษซ้อน และหัวสัน ยื่นออกนอกพื้นที่หน้า ตามสัดส่วนที่วัดจากภาพ
*/
function BookShell({ book }: { book: NonNullable<NonNullable<Story["deluxe"]>["book"]> }) {
  const [l, top, r, bottom] = book.paper;
  const pw = r - l;
  const ph = bottom - top;
  return (
    <div
      className="sbx-shell"
      aria-hidden="true"
      style={{
        left: `${(-l / pw) * 100}%`,
        right: `${(-(book.width - r) / pw) * 100}%`,
        top: `${(-top / ph) * 100}%`,
        bottom: `${(-(book.height - bottom) / ph) * 100}%`,
      }}
    >
      <Image src={book.src} alt="" fill sizes="(max-width: 1140px) 110vw, 1250px" priority />
    </div>
  );
}

export function StoryBook({ story }: { story: Story }) {
  const { locale, t, sub, pick, pickSub } = useDict();
  const { enabled: soundOn } = useSound();
  const count = story.pages.length;

  const [spread, setSpread] = useState(-1);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [auto, setAuto] = useState(false);
  /** นับว่าเด็กกดอะไรแล้วหรือยัง เบราว์เซอร์ไม่ให้เล่นเสียงก่อนผู้ใช้แตะจอ */
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const turnSfx = useRef<HTMLAudioElement | null>(null);
  const deluxe = story.deluxe;
  const real = !!deluxe?.book;
  /** กดพักแล้ว: เงียบเสียงบรรยากาศด้วย จนกว่าจะกดเล่นหรือพลิกหน้าอีก */
  const [userPaused, setUserPaused] = useState(false);

  const playSfx = useCallback(
    (src: string) => {
      if (!soundOn) return;
      turnSfx.current?.pause();
      const sfx = new Audio(src);
      sfx.volume = 0.7;
      turnSfx.current = sfx;
      void sfx.play().catch(() => {
        if (src === SFX_FALLBACK || turnSfx.current !== sfx) return;
        const fallback = new Audio(SFX_FALLBACK);
        fallback.volume = 0.7;
        turnSfx.current = fallback;
        void fallback.play().catch(() => {});
      });
    },
    [soundOn],
  );

  // เปิด/ปิดเล่มสมจริง (มี phase): ยังแสดงข้อความและเลขหน้าของปกจนกว่าจะเปิดเสร็จ ไม่ให้ประกาศหน้า 1 ขณะยังเห็นหน้าชื่อเรื่อง
  const shown = turn && !turn.phase ? turn.to : spread;
  const page = shown >= 0 ? story.pages[shown] : null;

  const goTo = useCallback(
    (to: number) => {
      if (turn || to === spread || to < -1 || to >= count) return;
      setFinished(false);
      // พลิกหน้าเอง = ฟังต่อ (รวมกรณีปิดการเคลื่อนไหวที่ข้ามไปหน้าใหม่ทันที)
      setUserPaused(false);
      if (prefersReducedMotion()) {
        setSpread(to);
        return;
      }
      // เล่มสมจริง: เปิดเริ่มที่ปกแข็ง ปิดเริ่มที่หน้าชื่อเรื่อง
      const first = real && (spread < 0 || to < 0) ? (spread < 0 ? "cover" : "paper") : undefined;
      // แบบอลังการ: เสียงเปิดปกแข็ง / เสียงกระดาษแผ่นใหญ่ ถ้ายังไม่มีไฟล์ใช้เสียงพลิกหน้าเดิม
      playSfx(!deluxe ? SFX_FALLBACK : first === "paper" || (!first && spread >= 0 && to >= 0) ? SFX_PAGE : SFX_COVER);
      setTurn({ from: spread, to, phase: first });
    },
    [turn, spread, count, deluxe, real, playSfx],
  );

  const finishTurn = useCallback(() => {
    setTurn((t) => {
      if (!t) return null;
      // เปิดเล่ม: ปกพลิกเสร็จ -> พัก  ปิดเล่ม: หน้าชื่อเรื่องพลิกกลับเสร็จ -> ปกพลิกปิดต่อ
      if (t.phase === "cover" && t.to >= 0) return { ...t, phase: "hold" };
      if (t.phase === "paper" && t.to < 0) return { ...t, phase: "cover" };
      setSpread(t.to);
      return null;
    });
  }, []);

  // จังหวะที่สองของการเปิด/ปิดเล่ม: เสียงของแผ่นที่เริ่มพลิก และพักสั้นๆ ก่อนหน้าชื่อเรื่องพลิก
  const phase = turn?.phase;
  const closing = !!turn && turn.to < 0;
  useEffect(() => {
    if (phase === "hold") {
      const timer = setTimeout(() => setTurn((t) => t && { ...t, phase: "paper" }), REAL_HOLD_MS);
      return () => clearTimeout(timer);
    }
    if (phase === "paper" && !closing) playSfx(SFX_PAGE);
    if (phase === "cover" && closing) playSfx(SFX_COVER);
  }, [phase, closing, playSfx]);

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
    // กดพักระหว่างพลิก: พลิกให้จบ แต่ไม่เริ่มพากย์หน้าใหม่ จนกว่าจะกดเล่นหรือพลิกอีก
    if (!started || turn || userPaused) return;
    const text = spread < 0 ? pick(story.title) : [page && pick(page), page?.reading, page?.meaning && pick(page.meaning)].filter(Boolean).join(" ... ");
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
      cancel = playNarration(narrationSrc(locale, story, spread), {
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
  }, [started, turn, spread, soundOn, replay, userPaused]);

  // ปิดเสียง หรือออกจากหน้านี้: หยุดเสียงพลิกหน้าด้วย (เป็น Audio แยกจากช่องเสียงพูด)
  useEffect(() => {
    if (!soundOn) turnSfx.current?.pause();
  }, [soundOn]);

  /*
    เสียงประกอบครั้งเดียวของหน้า (cue) — รอให้เสียงพลิกกระดาษจบก่อนราว 0.7 วินาที
    ใช้ Audio แยกจาก turnSfx จะได้ไม่ตัดเสียงพลิกหน้า พลิกหน้าต่อหรือปิดเสียงก่อนถึงเวลา = ไม่เล่น
  */
  const cueSrc = spread >= 0 && story.pages[spread].cue ? `/audio/sfx/story-cue-${story.pages[spread].cue}.mp3` : null;
  useEffect(() => {
    if (!cueSrc || !deluxe || !soundOn || !started || userPaused) return;
    let audio: HTMLAudioElement | null = null;
    const timer = window.setTimeout(() => {
      audio = new Audio(cueSrc);
      audio.volume = 0.6;
      void audio.play().catch(() => {});
    }, 700);
    return () => {
      window.clearTimeout(timer);
      audio?.pause();
    };
  }, [cueSrc, deluxe, soundOn, started, userPaused, spread]);
  useEffect(
    () => () => {
      stopAllSpeech();
      turnSfx.current?.pause();
    },
    [],
  );

  // เสียงบรรยากาศของหน้าที่วางนิ่งแล้ว ระหว่างพลิกยังเป็นเสียงของหน้าเดิม แล้วค่อยเฟดข้าม
  const settled = spread >= 0 ? story.pages[spread] : null;
  // จบเรื่องแล้วเฟดเสียงบรรยากาศออก ไม่ให้วนต่อไปเรื่อยๆ
  const unlockAmbience = useAmbience(
    settled?.ambience ? `/audio/sfx/story-amb-${settled.ambience}.mp3` : null,
    !!deluxe && soundOn && started && !userPaused && !finished,
  );

  const play = () => {
    if (deluxe) unlockAmbience();
    setUserPaused(false);
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
    setUserPaused(true);
    stopAllSpeech();
  };
  const step = (delta: number) => {
    if (deluxe) unlockAmbience();
    setStarted(true);
    setUserPaused(false);
    goTo(spread + delta);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea")) return;
      if (deluxe && (e.key === "ArrowRight" || e.key === "ArrowLeft")) unlockAmbience();
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
  }, [goTo, spread, deluxe, unlockAmbience]);

  // ชั้นภาพนิ่งซ้าย-ขวา ขณะพลิกเป็นส่วนผสมของหน้าเดิมกับหน้าใหม่
  const forward = turn ? turn.to > turn.from : true;
  const leftIndex = turn ? (forward ? turn.from : turn.to) : spread;
  const rightIndex = turn ? (forward ? turn.to : turn.from) : spread;
  const closed = (turn ? turn.to : spread) < 0;
  /*
    เล่มสมจริงตอนเปิด/ปิดปก: ทางซ้ายเป็นกระดาษครีมเปล่า (ด้านในปก) ขวาเป็นหน้าชื่อเรื่องหรือภาพหน้า 1
    ไม่มีปกด้านในลายเขียวโผล่ระหว่างพลิก และด้านหลังปกไม่ใช่ภาพนิทาน
  */
  const realOpening = real && !!phase;
  const leftSurface = realOpening || (real && spread < 0 && !turn) ? null : leftIndex >= 0 ? (
    <Half page={story.pages[leftIndex]} side="left" />
  ) : (
    <div
      className="sb-endpaper"
      style={deluxe?.endpaper ? { backgroundImage: `url(${deluxe.endpaper})`, backgroundSize: "50% auto" } : undefined}
    />
  );
  const rightSurface =
    phase === "paper" ? (
      <Half page={story.pages[0]} side="right" />
    ) : phase ? (
      <TitlePage story={story} />
    ) : rightIndex >= 0 ? (
      <Half page={story.pages[rightIndex]} side="right" />
    ) : (
      <Cover story={story} />
    );
  const inside = <div className="sbx-inside" />;
  const realLeaf =
    phase === "cover" ? (
      <CurlLeaf
        key="cover"
        dir={closing ? "back" : "fwd"}
        rigid
        duration={REAL_COVER_MS}
        onDone={finishTurn}
        front={closing ? inside : <Cover story={story} />}
        back={closing ? <Cover story={story} /> : inside}
      />
    ) : phase === "paper" ? (
      <CurlLeaf
        key="paper"
        dir={closing ? "back" : "fwd"}
        rigid={false}
        duration={REAL_PAPER_MS}
        onDone={finishTurn}
        front={closing ? <Half page={story.pages[0]} side="left" /> : <TitlePage story={story} />}
        back={closing ? <TitlePage story={story} /> : <Half page={story.pages[0]} side="left" />}
      />
    ) : null;

  const preload = [spread + 1, spread + 2].filter((i) => i >= 0 && i < count);

  return (
    <section
      aria-label={fmt(t.stories.book.label, { title: pick(story.title) })}
      className="sb-root mt-6"
      data-deluxe={deluxe ? "" : undefined}
      data-real={deluxe?.book ? "" : undefined}
      style={deluxe?.paper ? ({ "--sb-paper": `url(${deluxe.paper})` } as React.CSSProperties) : undefined}
    >
      <div className="sb-stage">
        <div
          ref={bookRef}
          className="sb-book"
          data-closed={closed || undefined}
          data-turning={turn ? (forward ? "fwd" : "back") : undefined}
          role="img"
          aria-label={pick(page ? page.alt : story.coverAlt)}
        >
          <div className="sb-board" aria-hidden="true" />
          {deluxe?.book && <BookShell book={deluxe.book} />}

          {/* หน้าซ้าย */}
          <div className="sb-page sb-page-left" aria-hidden="true">
            {leftSurface}
          </div>

          {/* หน้าขวา (หรือปกตอนปิดเล่ม) */}
          <div className="sb-page sb-page-right" aria-hidden="true">
            {rightSurface}
          </div>

          {/* ฉากเคลื่อนไหวของหน้าที่วางนิ่งแล้ว ซ่อนระหว่างพลิก ไม่ให้ไปขยับบนแผ่นที่กำลังโค้ง */}
          {deluxe && !turn && page?.fx && <SceneFx key={`fx-${shown}`} fx={page.fx} water={page.water} moon={page.moon} lamp={page.lamp} />}
          {deluxe && !turn && page?.fish && <FishShadow key={`fish-${shown}`} fish={page.fish} />}

          <div className="sb-gutter" aria-hidden="true" />

          {deluxe && finished && <GoldBurst key="end" />}

          {realLeaf}

          {turn && deluxe && !realOpening && (
            <CurlLeaf
              key={`${turn.from}-${turn.to}`}
              dir={forward ? "fwd" : "back"}
              rigid={turn.from < 0 || turn.to < 0}
              duration={turn.from < 0 || turn.to < 0 ? COVER_MS : CURL_MS}
              onDone={finishTurn}
              front={
                forward ? (
                  turn.from >= 0 ? <Half page={story.pages[turn.from]} side="right" /> : <Cover story={story} />
                ) : (
                  <Half page={story.pages[turn.from]} side="left" />
                )
              }
              back={
                forward ? (
                  <Half page={story.pages[turn.to]} side="left" />
                ) : turn.to >= 0 ? (
                  <Half page={story.pages[turn.to]} side="right" />
                ) : (
                  <Cover story={story} />
                )
              }
            />
          )}

          {turn && !deluxe && (
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
          aria-label={t.stories.book.previous}
          className="ui-round"
        >
          <ArrowLeftIcon />
        </button>

        {auto ? (
          <button type="button" onClick={pause} className="ui-pill ui-pill-primary sb-btn-main">
            <span className="ui-disc">
              <PauseIcon />
            </span>
            <span className="ui-label">
              {t.stories.book.pause}
              {sub && <span lang="en" className="ui-sub">
                {sub.stories.book.pause}
              </span>}
            </span>
          </button>
        ) : (
          <button type="button" onClick={play} className="ui-pill ui-pill-primary sb-btn-main">
            {/* PlayIcon มีวงกลมในตัวอยู่แล้ว ขนาดเท่า .ui-disc */}
            {finished ? <span className="ui-disc"><ReplayIcon /></span> : <PlayIcon className="size-11 shrink-0" />}
            <span className="ui-label">
              {finished ? t.stories.book.again : spread < 0 ? t.stories.book.play : t.stories.book.continue}
              {sub && <span lang="en" className="ui-sub">
                {finished ? sub.stories.book.again : spread < 0 ? sub.stories.book.play : sub.stories.book.continue}
              </span>}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => step(1)}
          disabled={spread >= count - 1 || !!turn}
          aria-label={t.stories.book.next}
          className="ui-round"
        >
          <ArrowLeftIcon className="-scale-x-100" />
        </button>

        {/* live region สั้นๆ แค่เลขหน้า เนื้อเรื่องมีเสียงพากย์อยู่แล้ว ไม่ต้องให้ screen reader อ่านทับ */}
        <p className="text-ink col-span-3 font-bold tabular-nums" aria-live="polite">
          {shown < 0 ? t.stories.book.cover : fmt(t.stories.book.page, { page: shown + 1, count })}
        </p>
      </div>

      <div className="scene-copy shadow-soft rounded-card mx-auto mt-5 flex max-w-4xl gap-3 p-4 sm:gap-5 sm:p-6">
        {/* หุ่นยนต์ผู้เล่าเรื่อง ภาพตกแต่ง */}
        <Image src={story.robot} alt="" width={112} height={112} className="size-16 shrink-0 object-contain sm:size-28" />
        <div className="sb-text min-w-0 flex-1">
          {page ? (
            <>
              <p className="text-xl leading-relaxed font-semibold sm:text-2xl"><ArabicText text={pick(page)} /></p>
              {pickSub(page) && <p lang="en" className="text-ink-soft mt-2 text-sm sm:text-base">
                <ArabicText text={pickSub(page)!} />
              </p>}
              {page.arabic ? (
                <div className="bg-sky-pale rounded-card-sm mt-3 px-4 py-3">
                  <p lang="ar" dir="rtl" className="text-2xl leading-loose font-semibold sm:text-3xl">
                    {page.arabic}
                  </p>
                  {page.reading && <p className="mt-1 font-semibold">{fmt(t.stories.book.reading, { reading: page.reading })}</p>}
                  {page.meaning && <p className="text-ink-soft text-sm">{fmt(t.stories.book.meaning, { meaning: pick(page.meaning) })}</p>}
                </div>
              ) : (
                /* อายะฮ์อัลกุรอาน: แสดงเฉพาะความหมายภาษาไทย ไม่ยกตัวอาหรับ (เจ้าของโปรเจกต์ 8 ต.ค. 2026 — AGENTS.md ข้อ 1.6) */
                page.meaning && (
                  <blockquote className="bg-sky-pale rounded-card-sm mt-3 px-4 py-3 text-lg leading-relaxed font-semibold">
                    “{pick(page.meaning)}”
                  </blockquote>
                )
              )}
            </>
          ) : (
            <>
              <p className="text-xl leading-relaxed font-semibold sm:text-2xl">{t.stories.book.intro}</p>
              {sub && <p lang="en" className="text-ink-soft mt-1 text-sm sm:text-base">
                {sub.stories.book.intro}
              </p>}
            </>
          )}
          {finished && (
            <p className="font-display text-brand-blue mt-3 text-2xl font-extrabold">
              {t.stories.book.end}{" "}{sub && <span lang="en">{sub.stories.book.end}</span>}
            </p>
          )}
        </div>
      </div>

      {finished && (
        <div className="mt-5 flex justify-center">
          <BackLink href="/learn/stories" label={{ th: t.stories.shelf.back, en: sub?.stories.shelf.back ?? t.stories.shelf.back }} />
        </div>
      )}
    </section>
  );
}
