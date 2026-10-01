"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { playNarration } from "@/lib/speech";
import { getSoundSnapshot } from "@/lib/soundStore";

import { AGE_SECTIONS, GUIDE_STEPS, type AgeId } from "../data";
import "../moral.css";

/*
  ส่วนหัวของเกาะมารยาท + หุ่นยนต์นำทาง

  หุ่นยนต์ (ตัวเดิม ท่าใหม่จาก Codex ข้อ 1.5) วิ่งด้วยล้อตีนตะขาบเข้ามาจากขวา
  โบกมือทักทาย ชี้ปุ่มวัย 3-6 ปี แล้วชี้ปุ่มวัย 7 ปีขึ้นไป บอกวิธีใช้หน้า
  จากนั้นถอยกลับไปยืนตัวเล็กที่มุมขวาของภาพเกาะ แตะตัวหุ่นยนต์เพื่อฟังอีกครั้งได้

  - หนึ่งจังหวะ = หนึ่งคลิปเสียง เล่นจบแล้วค่อยไปจังหวะถัดไป ท่าทางจึงตรงกับเสียงเสมอ
  - ข้อความในบอลลูนแสดงทุกจังหวะ (ไทยนำ อังกฤษรอง) ปิดเสียงอยู่ก็ยังรู้เรื่อง
    ไม่มีเสียง/เบราว์เซอร์บล็อกเสียงอัตโนมัติ = เดินจังหวะตามเวลาแทน
  - เล่นเองครั้งเดียวต่อการเปิดเว็บ (sessionStorage) เด็กที่กลับมาหน้านี้ซ้ำจะไม่ต้องรอฟังทุกครั้ง
  - ใช้ช่องเสียงเดียวกับเสียงอ่านทั้งเว็บ (playNarration) เด็กแตะการ์ดบทเรียน = เสียงหุ่นยนต์หยุด
    แล้วหุ่นยนต์กลับไปยืนมุมขวาทันที
  - ปิดการเคลื่อนไหว: หุ่นยนต์ยืนที่มุมขวาตลอด ไม่เลื่อน ไม่โบก บอลลูนยังขึ้นตามจังหวะ
  - การเคลื่อนไหวจบในตัว ไม่มีลอย/เด้งวน (ข้อ 2.1)
*/
const SEEN_KEY = "lu-moral-guide-seen";
const ENTER_MS = 1300;

type Phase = "off" | "tour" | "rest";

export function MoralHero({ titleTh, titleEn, introTh, introEn }: {
  titleTh: string;
  titleEn: string;
  introTh: string;
  introEn: string;
}) {
  const [phase, setPhase] = useState<Phase>("rest");
  const [step, setStep] = useState(-1);
  // ยกเลิกช่วงวิ่งเข้า (rAF + ตัวจับเวลา) — ส่วนเสียงของแต่ละจังหวะยกเลิกใน cleanup ของ effect ข้างล่าง
  const cancelEnter = useRef<() => void>(() => {});

  const finish = useCallback(() => {
    cancelEnter.current();
    setStep(-1);
    setPhase("rest");
  }, []);

  // เล่นจังหวะปัจจุบัน: เสียงจบ (หรือหมดเวลาเมื่อไม่มีเสียง) แล้วไปจังหวะถัดไป
  // cleanup หยุดเสียงและตัวจับเวลาเสมอ — เปลี่ยนจังหวะ ข้าม หรือออกจากหน้า เสียงจึงไม่ค้าง
  useEffect(() => {
    if (phase !== "tour" || step < 0) return;
    const current = GUIDE_STEPS[step];
    let timer = 0;
    const next = () => (step + 1 < GUIDE_STEPS.length ? setStep(step + 1) : finish());
    const timed = () => {
      timer = window.setTimeout(next, current.ms);
    };
    let stopAudio = () => {};
    if (getSoundSnapshot()) {
      stopAudio = playNarration(`/audio/th/${current.clip}.mp3`, {
        onEnded: () => {
          timer = window.setTimeout(next, 350);
        },
        // เสียงอื่นแทรก (เด็กแตะการ์ด) หรือกดปิดเสียง = จบการแนะนำ
        onStopped: finish,
        // เบราว์เซอร์ไม่ยอมเล่นเสียงอัตโนมัติ: เดินตามเวลา บอลลูนยังบอกเรื่องครบ
        onFail: timed,
      });
    } else {
      timed();
    }
    return () => {
      window.clearTimeout(timer);
      stopAudio();
    };
  }, [phase, step, finish]);

  const start = useCallback(() => {
    cancelEnter.current();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("tour");
      setStep(0);
      return;
    }
    // วางหุ่นยนต์นอกกรอบทางขวาก่อน แล้วค่อยให้เลื่อนเข้ามาในเฟรมถัดไป
    setPhase("off");
    setStep(-1);
    let timer = 0;
    let cancelled = false;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (cancelled) return;
        setPhase("tour");
        timer = window.setTimeout(() => setStep(0), ENTER_MS);
      }),
    );
    cancelEnter.current = () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  // เปิดหน้าครั้งแรกในรอบนี้ = เล่นเอง
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // อ่าน sessionStorage ไม่ได้ ก็เล่นเหมือนเปิดครั้งแรก
    }
    if (seen) return;
    // จดว่าเล่นแล้วตอนเริ่มจริง ไม่ใช่ตอน effect รัน (StrictMode รัน effect สองรอบ)
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // จดไม่ได้ = รอบหน้าเล่นอีก ไม่เป็นไร
      }
      start();
    }, 500);
    return () => window.clearTimeout(timer);
  }, [start]);

  // สลับแท็บ = หยุดพูดแล้วกลับไปยืนมุมขวา
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) finish();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      cancelEnter.current();
    };
  }, [finish]);

  const touring = phase !== "rest";
  const current = step >= 0 ? GUIDE_STEPS[step] : null;
  const pose = phase === "tour" && current ? current.pose : "stand";
  const focus = current?.focus;

  const ageButton = (age: AgeId) => {
    const section = AGE_SECTIONS[age];
    return (
      <a href={`#${age}`} className={`mrl-age-btn mrl-age-btn-${age}`} data-guided={focus === age || undefined}>
        <Image src={section.badge} alt="" width={96} height={96} className="mrl-age-btn-art" priority />
        <span className="min-w-0 flex-1">
          {section.labelTh}
          <span lang="en" className="block text-sm font-semibold">
            {section.labelEn}
          </span>
        </span>
        <ChevronRightIcon className="size-6 shrink-0" />
      </a>
    );
  };

  return (
    <header className="mrl-hero">
      <div className="mrl-hero-copy">
        <h1 className="font-display">
          <span className="mrl-hero-title">{titleTh}</span>
          <span lang="en" className="mrl-hero-title-en">
            {titleEn}
          </span>
        </h1>
        <p className="mrl-hero-intro">
          {introTh}
          <span lang="en" className="text-ink-soft block text-sm">
            {introEn}
          </span>
        </p>
        <nav aria-label="เลือกช่วงวัย / Choose an age" className="mrl-age-btns">
          {ageButton("kids")}
          {ageButton("juniors")}
        </nav>
      </div>

      <div className="mrl-hero-art">
        <Image
          src="/moral/hero-island.webp"
          alt=""
          width={1063}
          height={923}
          priority
          sizes="(max-width: 767px) 100vw, 560px"
          className="mrl-hero-island"
        />

        {/* บอลลูนคำพูด — role=status ให้ screen reader อ่านทีละจังหวะ */}
        <div className="mrl-bubble" role="status" data-show={(phase === "tour" && current !== null) || undefined}>
          {phase === "tour" && current && (
            <>
              <p>{current.th}</p>
              <p lang="en" className="mrl-bubble-en text-ink-soft mt-1 text-sm">
                {current.en}
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          className="mrl-guide"
          data-phase={phase}
          data-pose={pose}
          onClick={() => (touring ? finish() : start())}
          aria-label={
            touring
              ? "ข้ามคำแนะนำของหุ่นยนต์ / Skip the guide"
              : "ฟังหุ่นยนต์แนะนำหน้านี้อีกครั้ง / Hear the robot guide again"
          }
          title={touring ? "ข้าม / Skip" : "ฟังอีกครั้ง / Hear again"}
        >
          {(["stand", "wave-1", "wave-2", "point"] as const).map((frame) => (
            <Image
              key={frame}
              src={`/moral/guide/${frame}.webp`}
              alt=""
              width={512}
              height={512}
              priority
              className={`mrl-guide-frame mrl-guide-${frame}`}
            />
          ))}
        </button>
      </div>
    </header>
  );
}
