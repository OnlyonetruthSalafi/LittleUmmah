"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { PauseIcon } from "@/components/icons/PauseIcon";
import { ReplayIcon } from "@/components/icons/ReplayIcon";
import { SpeakerIcon } from "@/components/icons/SpeakerIcon";
import type { Lesson } from "@/lib/lessons";
import { playNarration, stopAllSpeech } from "@/lib/speech";
import { getSoundSnapshot } from "@/lib/soundStore";

import { CARTOONS, SAY_ALONG_MS, sayPrompt } from "../cartoon";

/*
  การ์ตูนบทเรียน — ครูหุ่นยนต์นูรีพาไปดูเหตุการณ์ทีละฉาก (ข้อมูลใน cartoon.ts)

  - เปิดจากการแตะการ์ด (การกดของผู้ใช้) เบราว์เซอร์จึงยอมเล่นเสียงตั้งแต่ฉากแรก
  - คลิปเสียงจบ -> (ถ้ามี) จังหวะเงียบให้เด็กพูดตาม -> ฉากถัดไป เดินเองจนจบ
    ไม่มีเสียงก็เดินตามเวลา ข้อความใต้ภาพบอกเรื่องครบ
  - ปุ่มพัก/เล่นต่อ ย้อน ถัดไป ทุกปุ่ม 64px (ข้อ 2) และพักเองเมื่อสลับแท็บ
  - ใช้ช่องเสียงเดียวกับทั้งเว็บ (playNarration) ปิดหน้าต่าง = เสียงหยุด
  - ฉากเปลี่ยนด้วยการจางซ้อน ภาพค่อยๆ ขยายเล็กน้อยครั้งเดียวต่อฉาก นูรีวิ่งเข้ามาครั้งแรกครั้งเดียว
    ไม่มีลอย/เด้งวน (ข้อ 2.1) ปิด motion = เปลี่ยนฉากทันที นูรียืนนิ่ง
*/
type Status = "playing" | "paused" | "ended";

export function CartoonLesson({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const { scenes, word: lessonWord } = CARTOONS[lesson.id];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("playing");
  const [sayAlong, setSayAlong] = useState(false);
  // เพิ่มเลขทุกครั้งที่เริ่มฉากใหม่ (รวมเล่นซ้ำฉากเดิม) ให้ effect เล่นเสียงฉากนั้นอีกรอบ
  const [take, setTake] = useState(0);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const goTo = useCallback((next: number) => {
    setSayAlong(false);
    setIndex(next);
    setStatus("playing");
    setTake((t) => t + 1);
  }, []);

  // เล่นฉากปัจจุบัน
  useEffect(() => {
    if (status !== "playing") return;
    const scene = scenes[index];
    let timer = 0;
    const advance = () => {
      if (index + 1 < scenes.length) goTo(index + 1);
      else setStatus("ended");
    };
    const afterVoice = () => {
      if (scene.sayAlong) {
        setSayAlong(true);
        timer = window.setTimeout(advance, SAY_ALONG_MS);
      } else {
        timer = window.setTimeout(advance, 500);
      }
    };
    let stop = () => {};
    if (getSoundSnapshot()) {
      stop = playNarration(`/audio/th/${scene.clip}.mp3`, {
        onEnded: afterVoice,
        // ปุ่มปิดเสียง หรือเสียงอื่นแทรก = พักการ์ตูนไว้ เด็กกดเล่นต่อได้
        onStopped: () => setStatus("paused"),
        onFail: () => {
          timer = window.setTimeout(afterVoice, scene.ms);
        },
      });
    } else {
      timer = window.setTimeout(afterVoice, scene.ms);
    }
    return () => {
      window.clearTimeout(timer);
      stop();
    };
    // take: เริ่มฉากเดิมใหม่ได้ (กดเล่นต่อ/ดูอีกครั้ง)
  }, [index, status, take, scenes, goTo]);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden) setStatus((s) => (s === "playing" ? "paused" : s));
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const scene = scenes[index];
  const firstScene = index === 0 && take <= 1;
  // ป้ายคำของฉาก: ฉากกำหนดเองได้ (null = ไม่มีป้าย) ไม่งั้นใช้ป้ายของบท ยกเว้นฉากแรกที่เป็นการทักทาย
  const word = scene.word !== undefined ? scene.word : index > 0 ? lessonWord : undefined;

  const togglePlay = () => {
    if (status === "playing") {
      stopAllSpeech();
      setStatus("paused");
    } else if (status === "ended") {
      goTo(0);
    } else {
      // เล่นต่อ = เริ่มฉากที่ค้างไว้ใหม่ เด็กเล็กได้ฟังประโยคครบ
      goTo(index);
    }
  };

  const playLabel =
    status === "playing" ? ["พัก", "Pause"] : status === "ended" ? ["ดูอีกครั้ง", "Watch again"] : ["เล่นต่อ", "Play"];

  return (
    <dialog
      ref={dialogRef}
      className="mrl-dialog mrl-cartoon"
      aria-labelledby="cartoon-title"
      onClose={() => {
        stopAllSpeech();
        onClose();
      }}
    >
      <div className="mrl-cartoon-body">
        <div className="mrl-cartoon-head">
          <h3 id="cartoon-title" className="font-display text-xl leading-snug font-extrabold sm:text-2xl">
            {lesson.titleTh}
            <span lang="en" className="text-ink-soft ml-2 text-sm font-semibold">
              {lesson.titleEn}
            </span>
          </h3>
          <button type="button" className="ui-pill" onClick={() => dialogRef.current?.close()}>
            ปิด <span lang="en" className="text-sm font-normal">Close</span>
          </button>
        </div>

        {/* เวที: ภาพฉากเป็นภาพตกแต่ง เรื่องราวอยู่ในข้อความใต้ภาพ */}
        <div className="mrl-stage" data-say={sayAlong || undefined}>
          {scenes.map((s, i) =>
            // ภาพฉากเดียวกันใช้ซ้ำหลายฉาก วาดครั้งเดียวต่อไฟล์
            scenes.findIndex((o) => o.bg === s.bg) === i ? (
              <Image
                key={s.bg}
                src={s.bg}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 860px"
                priority={i === 0}
                className="mrl-stage-bg"
                data-active={s.bg === scene.bg || undefined}
              />
            ) : null,
          )}
          {/* ป้ายคำที่สอน — ข้อความจริง ไม่ฝังในภาพ (ข้อ 1.5) */}
          {word && (
            <p className="mrl-stage-word" key={`w-${index}-${take}`}>
              <span lang="ar" dir="rtl">
                {word.ar}
              </span>
              <span className="mrl-stage-word-th">{word.th}</span>
            </p>
          )}
          <div className="mrl-nuri" data-enter={firstScene || undefined} data-pose={scene.pose} key={`n-${scene.pose}-${index}-${take}`}>
            {(["stand", "wave-1", "wave-2", "point"] as const).map((frame) => (
              <Image
                key={frame}
                src={`/moral/guide/${frame}.webp`}
                alt=""
                width={512}
                height={512}
                className={`mrl-guide-frame mrl-guide-${frame}`}
              />
            ))}
          </div>
          {sayAlong && word && (
            <p className="mrl-say" aria-hidden="true">
              {sayPrompt(word)}
            </p>
          )}
        </div>

        {/* ข้อความของฉาก — role=status ให้ screen reader อ่านเมื่อเปลี่ยนฉาก */}
        <div className="mrl-cartoon-caption" role="status">
          <p className="font-semibold">{scene.th}</p>
          <p lang="en" className="text-ink-soft text-sm">
            {scene.en}
          </p>
          {/* จอแคบ: บอกจังหวะพูดตามที่นี่แทนบอลลูนบนฉาก (บอลลูนจะบังเด็กในภาพ) */}
          {sayAlong && word && <p className="mrl-say-caption">{sayPrompt(word)}</p>}
        </div>

        <div className="mrl-cartoon-controls">
          <button
            type="button"
            className="ui-round"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
            aria-label="ฉากก่อนหน้า / Previous"
            title="ฉากก่อนหน้า / Previous"
          >
            <ChevronRightIcon className="size-7 rotate-180" />
          </button>
          <button
            type="button"
            className="ui-pill ui-pill-primary"
            onClick={togglePlay}
          >
            {status === "playing" ? (
              <PauseIcon className="size-7" />
            ) : status === "ended" ? (
              <ReplayIcon className="size-7" />
            ) : (
              <SpeakerIcon className="size-7" />
            )}
            <span>
              {playLabel[0]}{" "}
              <span lang="en" className="text-sm font-normal">
                {playLabel[1]}
              </span>
            </span>
          </button>
          <button
            type="button"
            className="ui-round"
            disabled={index === scenes.length - 1}
            onClick={() => goTo(index + 1)}
            aria-label="ฉากถัดไป / Next"
            title="ฉากถัดไป / Next"
          >
            <ChevronRightIcon className="size-7" />
          </button>
        </div>
        <ol className="mrl-dots" aria-label={`ฉาก ${index + 1} จาก ${scenes.length}`}>
          {scenes.map((s, i) => (
            <li key={s.clip} data-on={i === index || undefined} data-done={i < index || undefined} />
          ))}
        </ol>
      </div>
    </dialog>
  );
}
