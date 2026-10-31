"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Text } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";
import { playNarration } from "@/lib/speech";
import { getSoundSnapshot } from "@/lib/soundStore";

// ทัวร์ร่วมของเกาะ: หนึ่งคลิปต่อจังหวะ ถ้าเปิดเสียงไม่ได้ใช้เวลาแทน
// แยกจาก MoralHero โดยคงการเข้าฉาก ท่าทาง และ session เดิม
export type HeroGuideStep = Text & {
  clip: string;
  pose: "wave" | "point" | "stand";
  focus?: string;
  ms: number;
};
const ENTER_MS = 1300;
type Phase = "off" | "tour" | "rest";

export function useHeroGuide({ steps, seenKey, stopEvent, stopSelector }: {
  steps: readonly HeroGuideStep[];
  seenKey: string;
  stopEvent?: string;
  stopSelector?: string;
}) {
  const locale = useLocale();
  const [phase, setPhase] = useState<Phase>("rest");
  const [step, setStep] = useState(-1);
  // ยกเลิกช่วงวิ่งเข้า (rAF + ตัวจับเวลา) — ส่วนเสียงของแต่ละจังหวะยกเลิกใน cleanup ของ effect ข้างล่าง
  const cancelEnter = useRef<() => void>(() => {});

  const cancelStep = useRef<() => void>(() => {});
  const autoTimer = useRef(0);

  const finish = useCallback(() => {
    cancelEnter.current();
    cancelStep.current();
    window.clearTimeout(autoTimer.current);
    setStep(-1);
    setPhase("rest");
  }, []);

  // เล่นจังหวะปัจจุบัน: เสียงจบ (หรือหมดเวลาเมื่อไม่มีเสียง) แล้วไปจังหวะถัดไป
  // cleanup หยุดเสียงและตัวจับเวลาเสมอ — เปลี่ยนจังหวะ ข้าม หรือออกจากหน้า เสียงจึงไม่ค้าง
  useEffect(() => {
    if (phase !== "tour" || step < 0) return;
    const current = steps[step];
    let timer = 0;
    const next = () => (step + 1 < steps.length ? setStep(step + 1) : finish());
    const timed = () => {
      timer = window.setTimeout(next, current.ms);
    };
    let stopAudio = () => {};
    if (getSoundSnapshot()) {
      stopAudio = playNarration(`/audio/${locale}/${current.clip}.mp3`, {
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
    const cancel = () => {
      window.clearTimeout(timer);
      stopAudio();
    };
    cancelStep.current = cancel;
    return cancel;
  }, [phase, step, finish, steps, locale]);

  const start = useCallback(() => {
    cancelEnter.current();
    window.clearTimeout(autoTimer.current);
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
      seen = window.sessionStorage.getItem(seenKey) === "1";
    } catch {
      // อ่าน sessionStorage ไม่ได้ ก็เล่นเหมือนเปิดครั้งแรก
    }
    if (seen) return;
    // จดว่าเล่นแล้วตอนเริ่มจริง ไม่ใช่ตอน effect รัน (StrictMode รัน effect สองรอบ)
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(seenKey, "1");
      } catch {
        // จดไม่ได้ = รอบหน้าเล่นอีก ไม่เป็นไร
      }
      start();
    }, 500);
    autoTimer.current = timer;
    return () => window.clearTimeout(timer);
  }, [start, seenKey]);

  // สลับแท็บ = หยุดพูดแล้วกลับไปยืนมุมขวา
  // เปิดบทเรียน = จบการแนะนำทันที — ถ้าเบราว์เซอร์บล็อกเสียงตอนเปิดหน้า การแนะนำจะเดินตามเวลา
  // พอเด็กแตะการ์ด เบราว์เซอร์ยอมให้มีเสียงแล้ว จังหวะถัดไปของหุ่นแนะนำจะดังทับเสียงครูนูรีในการ์ตูน
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) finish();
    };
    document.addEventListener("visibilitychange", onHide);
    if (stopEvent) window.addEventListener(stopEvent, finish);
    const onActivate = (event: Event) => {
      if (stopSelector && event.target instanceof Element && event.target.closest(stopSelector)) finish();
    };
    document.addEventListener("pointerdown", onActivate, true);
    document.addEventListener("click", onActivate, true);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      if (stopEvent) window.removeEventListener(stopEvent, finish);
      document.removeEventListener("pointerdown", onActivate, true);
      document.removeEventListener("click", onActivate, true);
      cancelEnter.current();
    };
  }, [finish, stopEvent, stopSelector]);

  const touring = phase !== "rest";
  const current = step >= 0 ? steps[step] : null;
  const pose = phase === "tour" && current ? current.pose : "stand";
  const focus = current?.focus;

  return { phase, step, current, pose, focus, touring, start, finish };
}
