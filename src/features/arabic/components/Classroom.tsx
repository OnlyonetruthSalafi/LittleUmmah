"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";

import { PauseIcon } from "@/components/icons/PauseIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";
import { ReplayIcon } from "@/components/icons/ReplayIcon";
import { ArrowLeftIcon } from "@/components/icons/ArrowLeftIcon";
import { SpeakerIcon } from "@/components/icons/SpeakerIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { playNarration, speakWithSynth, stopAllSpeech } from "@/lib/speech";

import { CHEER_COUNT, CLASS_STEPS, classAudio, type AgeGroupId, type ClassStep } from "../data/classroom";
import "../classroom.css";

// ปุ่มควบคุมบทเรียน (เริ่ม พัก ฟังซ้ำ ก่อน/ถัดไป) ใช้ชุดปุ่มทั้งเว็บ — .ui-pill ใน controls.css
const CONTROL = "ui-pill text-lg";

/*
  ห้องเรียนหุ่นยนต์ — เกาะภาษาอาหรับ

  วงจรหนึ่งบท: ครูสอน -> ครูอ่านนำ -> เว้นจังหวะให้เด็กอ่านตาม -> ครูชม -> บทถัดไป
  เว็บไม่ฟังเสียงเด็ก ไม่มีไมโครโฟน ไม่ส่งอะไรออกนอกเครื่อง
  คำชมจึงเป็นคำให้กำลังใจ ("เก่งมาก ไปตัวต่อไปกัน") ไม่ใช่คำตัดสินว่าอ่านถูก
  เพราะครูไม่ได้ฟังจริง การบอกว่า "ถูกต้อง" จะเป็นคำชมลอยๆ ที่ไม่ตรงกับสิ่งที่เกิดขึ้น

  เสียงทุกช่วงใช้ playNarration ซึ่งบอกได้ว่าเล่นจบ ถูกหยุดกลางคัน หรือเล่นไม่ได้
  (playRecordedClip ใช้ไม่ได้ เพราะมันข้ามการเล่นซ้ำ key เดิม คลิปคำชมที่ใช้ร่วมกันจะเงียบไปเฉยๆ)

  ปิดเสียงอยู่ หรือไฟล์เสียงหาย: เดินเรื่องต่อด้วยตัวจับเวลาตามความยาวข้อความ
  บทเรียนจึงไม่ค้าง และเด็กยังเห็นตัวอักษรบนกระดานครบทุกบท
*/

/** ภาพฉากห้องเรียนจาก Codex — ใส่ path ของไฟล์เมื่อภาพมาถึง (ดู CODEX_CLASSROOM_BRIEF.md) */
const CLASSROOM_SCENE: string | null = null;

/** ท่าครูสอน — ใช้ท่า read ที่มีอยู่ไปก่อน เปลี่ยนเป็น teach.webp เมื่อ Codex วาดท่าใหม่เสร็จ */
const TEACHER_POSE = "/Character/read.webp";

type Phase = "idle" | "teach" | "say" | "echo" | "cheer" | "done";

/** เวลาที่ใช้แทนเสียง เมื่อปิดเสียงหรือไฟล์เสียงเล่นไม่ได้ */
function readingMs(text: string) {
  return Math.min(9000, Math.max(2000, text.length * 95));
}

/** เวลาเว้นให้เด็กอ่านตาม — ยาวกว่าที่ครูอ่าน เพราะเด็กเล็กเริ่มออกเสียงช้ากว่า */
function echoMs(text: string) {
  return Math.min(9000, Math.max(3000, text.length * 190));
}

const GROUPS: { id: AgeGroupId; nameTh: string; nameEn: string }[] = [
  { id: "kids", nameTh: "3–6 ปี", nameEn: "Ages 3–6" },
  { id: "juniors", nameTh: "7 ปีขึ้นไป", nameEn: "Ages 7+" },
];

const BUTTON =
  "shadow-soft hover:shadow-float inline-flex min-h-16 items-center justify-center gap-2 rounded-full px-6 text-lg font-bold transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] motion-safe:active:duration-75";

/*
  หน้า /kids และ /juniors ลิงก์มาที่ /learn/arabic#kids และ #juniors (ดู IslandPicker)
  ห้องเรียนจึงต้องเปิดตรงช่วงวัยที่เด็กกดมา ไม่ใช่เริ่มที่ 3–6 ปีเสมอ
  อ่านผ่าน useSyncExternalStore เพราะ location เป็นระบบภายนอกของ React
  และ server snapshot ต้องเป็น "kids" เสมอ ไม่งั้น HTML ที่ prerender ไว้จะไม่ตรงกับตอน hydrate
*/
function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getHashGroup(): AgeGroupId {
  return window.location.hash === "#juniors" ? "juniors" : "kids";
}

function getHashGroupOnServer(): AgeGroupId {
  return "kids";
}

export function Classroom({ introTh, introEn }: { introTh: string; introEn: string }) {
  const hashGroup = useSyncExternalStore(subscribeHash, getHashGroup, getHashGroupOnServer);
  /** null = ยังไม่ได้กดเลือกเอง ให้ยึดตาม anchor ที่ลิงก์มา */
  const [chosen, setChosen] = useState<AgeGroupId | null>(null);
  const group = chosen ?? hashGroup;

  return (
    <section aria-labelledby="classroom-heading" className="mt-6">
      <div className="scene-copy shadow-soft rounded-card px-4 py-6 sm:px-6">
        <h1 id="classroom-heading" className="font-display text-3xl leading-snug font-extrabold sm:text-5xl">
          ห้องเรียนภาษาอาหรับ
          <span lang="en" className="mt-1 block text-xl font-semibold sm:text-2xl">
            Arabic Classroom
          </span>
        </h1>
        <p className="mt-2">{introTh}</p>
        <p lang="en" className="text-ink-soft text-sm">
          {introEn}
        </p>
        <p className="mt-3 font-semibold">ครูหุ่นยนต์อ่านให้ฟังก่อน แล้วเว้นจังหวะให้หนูอ่านตามออกเสียงดังๆ</p>
      </div>

      {/* เลือกช่วงวัย — ใบที่เลือกอยู่มีคำว่า "กำลังเรียน" กำกับ ไม่ได้บอกด้วยสีอย่างเดียว */}
      <div role="group" aria-label="เลือกช่วงวัย" className="mt-6 flex flex-wrap justify-center gap-3">
        {GROUPS.map((g) => {
          const active = g.id === group;
          return (
            <button
              key={g.id}
              type="button"
              id={g.id}
              aria-pressed={active}
              onClick={() => setChosen(g.id)}
              className={`${BUTTON} scroll-mt-4 ${active ? "bg-brand-blue text-cloud" : "bg-cloud text-ink"}`}
            >
              {g.nameTh}
              <span lang="en" className="text-sm font-normal">
                {g.nameEn}
              </span>
              {active && <span className="sr-only">กำลังเรียนช่วงวัยนี้</span>}
            </button>
          );
        })}
      </div>

      {/* key = group: เปลี่ยนช่วงวัยแล้วบทเรียนเริ่มใหม่หมด ไม่มีเสียงหรือจังหวะของวัยเดิมค้างอยู่ */}
      <Lesson key={group} group={group} />
    </section>
  );
}

function Lesson({ group }: { group: AgeGroupId }) {
  const { enabled: soundOn } = useSound();

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [paused, setPaused] = useState(false);
  /** ความคืบหน้าของจังหวะอ่านตาม 0..1 ใช้วาดวงแหวนนับถอยหลัง */
  const [turn, setTurn] = useState(0);
  /** นับขึ้นทุกครั้งที่สั่งให้เล่นช่วงเดิมใหม่ (ฟังอีกครั้ง / เรียนต่อ) */
  const [replay, setReplay] = useState(0);

  const steps = CLASS_STEPS[group];
  const step: ClassStep | undefined = steps[index];
  const talking = !paused && (phase === "teach" || phase === "say" || phase === "cheer");

  useEffect(() => stopAllSpeech, []);

  /*
    หัวใจของบทเรียน: effect เดียวคุมทุกช่วง
    เริ่มเสียง (หรือตัวจับเวลา) ของช่วงปัจจุบัน แล้วบอกว่าช่วงถัดไปคืออะไร
    cleanup ตัดทุกอย่างทิ้ง การกดปุ่มระหว่างเสียงกำลังเล่นจึงไม่ทำให้สองช่วงซ้อนกัน
  */
  useEffect(() => {
    if (phase === "idle" || paused || !step) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let ticker: ReturnType<typeof setInterval> | undefined;
    let cancelAudio: (() => void) | undefined;

    const go = (next: Phase) => {
      if (cancelled) return;
      // รีเซ็ตวงแหวนตรงนี้ ไม่ใช่ในตัว effect — เป็นการเปลี่ยน state จาก callback จึงไม่เกิด cascading render
      if (next === "echo") setTurn(0);
      if (next === "teach") {
        // จบคำชมแล้ว ไปบทถัดไป หรือจบคาบถ้าหมดบทแล้ว
        if (index + 1 >= steps.length) {
          setPhase("done");
          return;
        }
        setIndex(index + 1);
        setPhase("teach");
        return;
      }
      setPhase(next);
    };

    /** เล่นคลิป แล้วไปช่วงถัดไปเมื่อจบ ถ้าเล่นไม่ได้ใช้เสียงสังเคราะห์ไทยแล้วจับเวลาแทน */
    const narrate = (key: string, fallbackText: string, next: Phase | null) => {
      if (!soundOn) {
        if (next) timer = setTimeout(() => go(next), readingMs(fallbackText));
        return;
      }
      cancelAudio = playNarration(classAudio(key), {
        onEnded: () => {
          if (next) go(next);
        },
        // ถูกตัดกลางคัน (กดปิดเสียง หรือเสียงอื่นแทรก) — จอดไว้ตรงนี้ ไม่เดินต่อเอง
        onStopped: () => {
          if (!cancelled) setPaused(true);
        },
        onFail: () => {
          if (cancelled) return;
          // ไฟล์เสียงยังไม่มี: อ่านด้วยเสียงสังเคราะห์ไทย (ห้ามส่งตัวอาหรับเข้าไป เสียงไทยอ่านไม่ได้)
          speakWithSynth(fallbackText);
          if (next) timer = setTimeout(() => go(next), readingMs(fallbackText));
        },
      });
    };

    if (phase === "teach") {
      narrate(`teach-${step.id}`, `${step.titleTh} ... ${step.body}`, "say");
    } else if (phase === "say") {
      narrate(`say-${step.id}`, `อ่านตามครูนะ ... ${step.say}`, "echo");
    } else if (phase === "echo") {
      // จังหวะเว้นว่างให้เด็กอ่านตาม — เงียบสนิท ไม่มีเสียงแทรก
      const total = echoMs(step.say);
      const startedAt = Date.now();
      ticker = setInterval(() => {
        setTurn(Math.min(1, (Date.now() - startedAt) / total));
      }, 100);
      timer = setTimeout(() => go("cheer"), total);
    } else if (phase === "cheer") {
      // คำชมหมุนตามลำดับบท เด็กจึงไม่ได้ยินประโยคเดิมซ้ำทุกบท
      narrate(`cheer-${(index % CHEER_COUNT) + 1}`, "เก่งมาก ไปดูตัวต่อไปกันนะ", "teach");
    } else if (phase === "done") {
      narrate("done", "เก่งมากเลย วันนี้เรียนจบแล้ว ครูภูมิใจในตัวหนูนะ", null);
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (ticker) clearInterval(ticker);
      cancelAudio?.();
    };
  }, [phase, index, paused, soundOn, steps, step, replay]);

  const start = useCallback(() => {
    stopAllSpeech();
    setPaused(false);
    setIndex(0);
    setPhase("teach");
    setReplay((r) => r + 1);
  }, []);

  const goToStep = useCallback(
    (next: number) => {
      if (next < 0 || next >= steps.length) return;
      stopAllSpeech();
      setPaused(false);
      setIndex(next);
      setPhase("teach");
      setReplay((r) => r + 1);
    },
    [steps.length],
  );

  const again = useCallback(() => {
    stopAllSpeech();
    setPaused(false);
    setPhase("teach");
    setReplay((r) => r + 1);
  }, []);

  const togglePause = useCallback(() => {
    if (paused) {
      setPaused(false);
      // เล่นช่วงเดิมซ้ำตั้งแต่ต้น เด็กจะได้ไม่ต้องเดาว่าฟังไปถึงไหนแล้ว
      setReplay((r) => r + 1);
      return;
    }
    stopAllSpeech();
    setPaused(true);
  }, [paused]);

  const running = phase !== "idle";
  const finished = phase === "done";

  return (
    <>
      {/* ── ฉากห้องเรียน ── */}
      <div className="cls-stage mt-6">
        {CLASSROOM_SCENE ? (
          <Image
            src={CLASSROOM_SCENE}
            alt=""
            fill
            sizes="(max-width: 1100px) 100vw, 1100px"
            className="object-cover"
            priority
          />
        ) : (
          <>
            <div className="cls-wall-pattern" aria-hidden="true" />
            <div className="cls-floor" aria-hidden="true" />
            <div className="cls-desks" aria-hidden="true">
              <span className="cls-desk" />
              <span className="cls-desk" />
              <span className="cls-desk" />
            </div>
          </>
        )}

        {/* กระดานดำ: ตัวอักษรเป็นข้อความจริงของหน้าเว็บ ไม่ได้ฝังอยู่ในภาพ (ข้อ 1.5) */}
        <div className="cls-board">
          <div className="cls-board-face">
            <p
              key={`${group}-${index}-${finished}`}
              lang="ar"
              dir="rtl"
              className="cls-board-text"
              data-size={finished ? "glyph" : (step?.boardSize ?? "glyph")}
            >
              {finished ? "✦" : (step?.board ?? "")}
            </p>
          </div>
        </div>

        {/* หุ่นยนต์ครู — ภาพตกแต่ง ข้อความบทเรียนอยู่ใต้ฉากแล้ว */}
        <Image
          src={TEACHER_POSE}
          alt=""
          width={512}
          height={512}
          sizes="(max-width: 639px) 40vw, 280px"
          className="cls-teacher"
          data-talking={talking}
          priority
        />
      </div>

      {/* ── ป้ายบอกว่าตอนนี้ถึงตาใคร ── */}
      <div className="scene-copy shadow-soft rounded-card mt-6 px-4 py-5 text-center sm:px-6">
        <p aria-live="polite" className="font-display text-2xl font-extrabold sm:text-3xl">
          {!running && "กดปุ่มเริ่มเรียน แล้วครูจะสอนทีละตัว"}
          {running && paused && "พักอยู่ กดเรียนต่อเมื่อพร้อมนะ"}
          {running && !paused && phase === "teach" && `ครูกำลังสอน: ${step?.titleTh ?? ""}`}
          {running && !paused && phase === "say" && "ครูอ่านนำ ฟังให้ดีนะ"}
          {running && !paused && phase === "echo" && "ตาหนูแล้ว! อ่านตามครูดังๆ"}
          {running && !paused && phase === "cheer" && "เก่งมาก!"}
          {running && !paused && finished && "เรียนครบทุกบทแล้ว เก่งมากเลย"}
        </p>

        {/* วงแหวนนับถอยหลังของจังหวะอ่านตาม — มีคำอ่านเป็นข้อความกำกับ ไม่ได้บอกด้วยสีอย่างเดียว */}
        {!paused && phase === "echo" && step && (
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="cls-turn-ring" style={{ "--cls-turn": turn } as CSSProperties} aria-hidden="true">
              <SpeakerIcon className="text-brand-blue size-8" />
            </div>
            <p className="text-2xl font-extrabold">{step.say}</p>
          </div>
        )}

        {step && running && phase !== "echo" && (
          <div className="mt-3">
            <p className="text-xl font-bold">
              {step.titleTh}{" "}
              <span lang="en" className="text-ink-soft text-base font-semibold">
                {step.titleEn}
              </span>
            </p>
            <p className="mt-1">{step.body}</p>
            <p className="mt-1 font-semibold">อ่านว่า: {step.say}</p>
            {step.meaning && <p className="text-ink-soft mt-1 text-sm">ความหมาย: {step.meaning}</p>}
          </div>
        )}

        {/* ── ปุ่มควบคุม สูงอย่างน้อย 64px ตามข้อ 2 ── */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {!running || finished ? (
            <button type="button" onClick={start} className={`${CONTROL} ui-pill-primary`}>
              <PlayIcon className="size-11 shrink-0" />
              <span>
                {finished ? "เรียนอีกรอบ" : "เริ่มเรียน"}
                <span lang="en" className="ui-sub">
                  {finished ? "Again" : "Start"}
                </span>
              </span>
            </button>
          ) : (
            <>
              <button type="button" onClick={togglePause} className={CONTROL}>
                {/* PlayIcon มีวงกลมในตัวแล้ว ขนาดเท่า .ui-disc */}
                {paused ? <PlayIcon className="size-11 shrink-0 text-brand-blue" /> : <span className="ui-disc"><PauseIcon /></span>}
                <span>
                  {paused ? "เรียนต่อ" : "พักก่อน"}
                  <span lang="en" className="ui-sub">{paused ? "Continue" : "Pause"}</span>
                </span>
              </button>
              <button type="button" onClick={again} className={`${CONTROL} ui-pill-primary`}>
                <span className="ui-disc"><ReplayIcon /></span>
                <span>
                  ฟังอีกครั้ง
                  <span lang="en" className="ui-sub">Listen again</span>
                </span>
              </button>
            </>
          )}

          {running && !finished && (
            <>
              <button
                type="button"
                onClick={() => goToStep(index - 1)}
                disabled={index === 0}
                className={CONTROL}
              >
                <span className="ui-disc"><ArrowLeftIcon /></span>
                <span>
                  ก่อนหน้า
                  <span lang="en" className="ui-sub">Previous</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => goToStep(index + 1)}
                disabled={index + 1 >= steps.length}
                className={CONTROL}
              >
                <span>
                  ตัวถัดไป
                  <span lang="en" className="ui-sub">Next</span>
                </span>
                <span className="ui-disc"><ArrowLeftIcon className="-scale-x-100" /></span>
              </button>
            </>
          )}
        </div>

        <p className="text-ink-soft mt-4 text-sm">
          บทที่ {Math.min(index + 1, steps.length)} จาก {steps.length}
        </p>
      </div>

      {/* รายการบททั้งหมด — กดข้ามไปบทที่ต้องการได้ */}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => goToStep(i)}
              aria-current={running && i === index ? "step" : undefined}
              className={`${BUTTON} w-full ${running && i === index ? "bg-brand-blue text-cloud" : "bg-cloud text-ink"}`}
            >
              {s.boardSize === "glyph" && (
                <span lang="ar" dir="rtl" className="text-2xl">
                  {s.board}
                </span>
              )}
              {s.titleTh}
              {running && i === index && <span className="sr-only">บทที่กำลังเรียนอยู่</span>}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
