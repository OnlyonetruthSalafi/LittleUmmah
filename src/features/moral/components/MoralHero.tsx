"use client";

import { setAge } from "@/lib/ageStore";
import { applyAge, useAge } from "@/components/learn/AgePreference";
import Image from "next/image";
import { useHeroGuide } from "../useHeroGuide";

import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

import { LESSON_OPEN_EVENT, type AgeId, type AgeSection, type GuideStep } from "../data";
import "../moral.css";
import type { Text } from "@/i18n/config";
import { useDict } from "@/i18n/LocaleProvider";

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
export type HeroArt = { src: string; width: number; height: number };

export function MoralHero({
  title,
  intro,
  steps: GUIDE_STEPS,
  ageSections: AGE_SECTIONS,
  art,
  seenKey: SEEN_KEY,
}: {
  title: Text;
  intro: Text;
  /** บทของหุ่นยนต์นำทาง (หนึ่งจังหวะ = หนึ่งคลิปเสียง) */
  steps: GuideStep[];
  ageSections: Record<AgeId, AgeSection>;
  /** ภาพเกาะในส่วนหัว */
  art: HeroArt;
  /** sessionStorage key — แต่ละเกาะเล่นแนะนำเองครั้งแรกแยกกัน */
  seenKey: string;
}) {
  const { t, sub, pick, pickSub } = useDict();
  const selectedAge = useAge();
  const { phase, current, pose, focus, touring, start, finish } = useHeroGuide({
    steps: GUIDE_STEPS, seenKey: SEEN_KEY, stopEvent: LESSON_OPEN_EVENT,
  });

  const ageButton = (age: AgeId) => {
    const section = AGE_SECTIONS[age];
    return (
      <a href={`#${age}`} aria-controls={age} aria-expanded={!selectedAge || selectedAge === age}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          if (location.hash !== `#${age}`) history.pushState(null, "", `#${age}`);
          setAge(age);
          applyAge();
          const target = document.getElementById(age);
          target?.focus({ preventScroll: true });
          target?.scrollIntoView();
        }} className={`mrl-age-btn mrl-age-btn-${age}`} data-guided={focus === age || undefined}>
        <Image src={section.badge} alt="" width={96} height={96} className="mrl-age-btn-art" priority />
        <span className="min-w-0 flex-1">
          {pick(section.label)}
          {sub && <span lang="en" className="block text-sm font-semibold">
            {pickSub(section.label)}
          </span>}
        </span>
        <ChevronRightIcon className="size-6 shrink-0" />
      </a>
    );
  };

  return (
    <header className="mrl-hero">
      <div className="mrl-hero-copy">
        <h1 className="font-display">
          <span className="mrl-hero-title">{pick(title)}</span>
          {sub && <span lang="en" className="mrl-hero-title-en">
            {pickSub(title)}
          </span>}
        </h1>
        <p className="mrl-hero-intro">
          {pick(intro)}
          {sub && <span lang="en" className="text-ink-soft block text-sm">
            {pickSub(intro)}
          </span>}
        </p>
        <nav aria-label={t.moral.hero.chooseAge} className="mrl-age-btns">
          {ageButton("kids")}
          {ageButton("juniors")}
        </nav>
      </div>

      <div className="mrl-hero-art">
        <Image
          src={art.src}
          alt=""
          width={art.width}
          height={art.height}
          priority
          sizes="(max-width: 767px) 100vw, 560px"
          className="mrl-hero-island"
        />

        {/* บอลลูนคำพูด — role=status ให้ screen reader อ่านทีละจังหวะ */}
        <div className="mrl-bubble" role="status" data-show={(phase === "tour" && current !== null) || undefined}>
          {phase === "tour" && current && (
            <>
              <p>{pick(current)}</p>
              {sub && <p lang="en" className="mrl-bubble-en text-ink-soft mt-1 text-sm">
                {pickSub(current)}
              </p>}
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
              ? t.moral.hero.skipGuide
              : t.moral.hero.hearGuide
          }
          title={touring ? t.moral.hero.skip : t.moral.hero.hearAgain}
        >
          {(["stand", "wave-1", "wave-2", "point"] as const).map((frame) => (
            <Image
              key={frame}
              src={`/moral/guide/${frame}.webp`}
              alt=""
              width={512}
              height={512}
              sizes="(max-width: 1152px) 36vw, 420px"
              /* ไม่ใช่ภาพ LCP (ภาพ LCP คือท้องฟ้า) — eager เพื่อไม่ให้ท่าโบกมือกระพริบตอนเริ่มทัวร์ แต่ไม่ preload แย่งคิว (P1-4) */
              loading="eager"
              className={`mrl-guide-frame mrl-guide-${frame}`}
            />
          ))}
        </button>
      </div>
    </header>
  );
}
