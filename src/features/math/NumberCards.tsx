"use client";

import { useEffect, useRef, useState } from "react";
import { StarIcon } from "@/components/icons/StarIcon";
import { SpeakerIcon } from "@/components/icons/SpeakerIcon";
import { ReplayIcon } from "@/components/icons/ReplayIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { playNarration } from "@/lib/speech";
import { NUMBER_TEXT, numberClip, numberWord, thaiDigits } from "./numbers";
import "@/features/moral/moral.css";
import "./numbers.css";
import { CountingHands } from "./CountingHands";

/*
  รู้จักตัวเลข — แตะตัวเลข แล้วดาวในแผงสิบช่อง (ten frame) สว่างทีละดวงตรงกับเสียงนับของครูนูรี
  วัย 3–6 นับ 1 ถึง n · วัย 7+ แผงแรกสว่างพร้อมกันตอนพูด "สิบ" แล้วนับต่อ 11 ถึง n
  ปิดเสียงอยู่ = ดาวสว่างครบทันที (ไม่ต้องรอเสียง) · การสว่างเป็นการเปลี่ยนสี ไม่ใช่ transform จึงไม่ต้องตัดตาม reduced motion
  ปุ่มตัวเลขสูง ≥64px (ข้อ 2) และบอกตัวที่เลือกด้วย aria-pressed + กรอบหนา ไม่ใช้สีอย่างเดียว
*/
/** เวลากำมือค้างไว้ก่อนเริ่มนับ (มิลลิวินาที) */
const FIST_MS = 700;

export function NumberCards({ age }: { age: "kids" | "juniors" }) {
  const { pick, sub, pickSub } = useDict();
  const locale = useLocale();
  const { enabled } = useSound();
  const from = age === "kids" ? 1 : 11;
  const nums = Array.from({ length: 10 }, (_, i) => from + i);
  const [n, setN] = useState<number | null>(null);
  const [lit, setLit] = useState(0);
  const cancel = useRef<() => void>(() => {});
  const audioOk = enabled && locale === "th";

  useEffect(() => () => cancel.current(), []);

  function count(target: number) {
    cancel.current();
    setN(target);
    if (!audioOk) {
      // ไม่มีเสียง: กำมือครู่หนึ่งแล้วชูครบทีเดียว (วัย 3–6)
      if (age !== "kids") { setLit(target); return; }
      setLit(0);
      const timer = window.setTimeout(() => setLit(target), FIST_MS);
      cancel.current = () => window.clearTimeout(timer);
      return;
    }
    // ลำดับคลิปที่ต้องพูด และจำนวนดาวที่สว่างเมื่อแต่ละคลิปเริ่ม
    const steps: { clip: string; light: number }[] = age === "kids"
      ? Array.from({ length: target }, (_, i) => ({ clip: numberClip(i + 1), light: i + 1 }))
      : [{ clip: numberClip(10), light: 10 }, ...Array.from({ length: target - 10 }, (_, i) => ({ clip: numberClip(11 + i), light: 11 + i }))];
    setLit(0);
    let i = 0;
    let stopped = false;
    const next = () => {
      if (stopped || i >= steps.length) return;
      const step = steps[i++];
      setLit(step.light);
      const stop = playNarration(`/audio/th/${step.clip}.mp3`, {
        onEnded: next,
        onStopped: () => { stopped = true; setLit(target); },
        onFail: () => { stopped = true; setLit(target); },
      });
      cancel.current = () => { stopped = true; stop(); };
    };
    // วัย 3–6: กำมือให้เห็นก่อนแล้วค่อยเริ่มชูนิ้วแรก (เจ้าของสั่ง 18 พ.ย. 2026 "ตอนนับ 1 ก็ต้องกำก่อน")
    if (age === "kids") {
      const timer = window.setTimeout(next, FIST_MS);
      cancel.current = () => { stopped = true; window.clearTimeout(timer); };
    } else next();
  }

  function howto() {
    cancel.current();
    if (!audioOk) return;
    const stop = playNarration(`/audio/th/math/num-howto-${age}.mp3`, { onEnded: () => {}, onStopped: () => {}, onFail: () => {} });
    cancel.current = stop;
  }

  const title = age === "kids" ? NUMBER_TEXT.titleKids : NUMBER_TEXT.titleJuniors;
  const desc = age === "kids" ? NUMBER_TEXT.howtoKids : NUMBER_TEXT.howtoJuniors;
  const frames = n === null ? [] : n <= 10 ? [n] : [10, n - 10];

  return (
    <section className="num-cards" aria-labelledby={`num-${age}`}>
      <div className="num-head">
        <h3 id={`num-${age}`} className="font-display">
          {pick(title)}
          {sub && <span lang="en" className="block text-sm font-semibold">{pickSub(title)}</span>}
        </h3>
        <p>{pick(desc)}{sub && <span lang="en" className="text-ink-soft block text-sm">{pickSub(desc)}</span>}</p>
        {audioOk && (
          <button type="button" className="ui-pill num-howto" onClick={howto}>
            <SpeakerIcon className="h-5 w-5" /> {pick(NUMBER_TEXT.listen)}
          </button>
        )}
      </div>

      <div className="num-grid" role="group" aria-label={pick(NUMBER_TEXT.pick)}>
        {nums.map((x) => (
          <button key={x} type="button" className="num-key font-display" aria-pressed={n === x}
            aria-label={`${x} ${pick(numberWord(x))}`} onClick={() => count(x)}>
            {x}
          </button>
        ))}
      </div>

      {/* วัย 3–6 แสดงสองมือกำไว้ตั้งแต่ยังไม่แตะ ตำแหน่งจึงคงที่ทุกจอ */}
      {(n !== null || age === "kids") && (
        <div className={`num-stage${n === null ? " num-stage-idle" : ""}`}>
          {n !== null && <div className="num-figure" aria-live="polite">
            <span className="num-big font-display">{n}</span>
            <span className="num-thai font-display" aria-hidden="true">{thaiDigits(n)}</span>
            <span className="num-word font-display">
              {pick(numberWord(n))}
              {sub && <span lang="en" className="block text-base font-semibold">{pickSub(numberWord(n))}</span>}
            </span>
            {n > 10 && <span className="num-split">{pick(NUMBER_TEXT.tenAnd)} {pick(numberWord(n - 10))}</span>}
          </div>}
          {age === "kids" ? <CountingHands up={lit} /> : <div className="num-frames" aria-hidden="true">
            {frames.map((count, f) => (
              <div key={f} className="num-frame">
                {Array.from({ length: 10 }, (_, k) => {
                  const index = f * 10 + k + 1;
                  const on = k < count && index <= lit;
                  return <span key={k} className={`num-cell${k < count ? " num-cell-used" : ""}`}>
                    {k < count && <StarIcon className="num-star" filled={on} />}
                  </span>;
                })}
              </div>
            ))}
          </div>}
          {n !== null && <button type="button" className="ui-pill ui-pill-primary num-again" onClick={() => count(n)}>
            <ReplayIcon className="h-5 w-5" /> {pick(NUMBER_TEXT.again)}
          </button>}
        </div>
      )}
    </section>
  );
}


