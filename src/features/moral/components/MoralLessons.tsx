"use client";

import { awardLesson } from '@/features/learning-stars/store';
import { LearningNotice } from '@/features/learning-stars/components';
import Image from "next/image";
import { fmt } from "@/i18n/dict";
import { useEffect, useRef, useState } from "react";

import { SpeakerIcon } from "@/components/icons/SpeakerIcon";
import { ArabicText } from "@/components/ui/ArabicText";
import { StarIcon } from "@/components/icons/StarIcon";
import { SHOW_REWARD_STARS } from "@/lib/rewardStars";
import { useSound } from "@/components/sound/SoundProvider";
import type { Lesson } from "@/lib/lessons";
import { isSpeaking, stopAllSpeech } from "@/lib/speech";

import type { Cartoon } from "../cartoon";
import { LESSON_OPEN_EVENT, type AgeId, type AgeSection } from "../data";
import { progressStore } from "../progress";
import { CartoonLesson } from "./CartoonLesson";
import { useDict } from "@/i18n/LocaleProvider";
import type { Text } from "@/i18n/config";

/** การ์ดหนึ่งกลุ่มในช่วงวัย — เกาะที่มีหลายหมวด (สำรวจโลก) แสดงหัวข้อกลุ่มเหนือแต่ละตาราง */
export type LessonGroup = { id: string; title?: Text; lessons: Lesson[] };

type CardBubble = { text: string; left: number; top: number; width: number };

/*
  ภารกิจวันนี้ = เป้าเล็กๆ DAILY_GOAL บท ไม่ใช่ทุกบทในช่วงวัย (ประชุม 7 ต.ค. 2026: ไม่ให้เป็นภาระรายวัน)
  เกินเป้าก็ยังนับต่อ แต่แถบเต็มแล้ว
*/
const DAILY_GOAL = 2;
/** บทข้อความ (ไม่มีการ์ตูน): เปิดอย่างน้อยเท่านี้ และเสียงอ่านจบแล้วตอนปิดหน้าต่าง จึงนับว่าฝึกแล้ว */
const TEXT_LESSON_MIN_MS = 5000;

/*
  ส่วนบทเรียนหนึ่งช่วงวัย: หัวข้อ + ภารกิจวันนี้ + การ์ดสี่ใบ + หน้าต่างบทเรียน

  การ์ดทั้งใบเป็นปุ่มเดียว (หนึ่งการ์ด = หนึ่งจุดโฟกัส ข้อ 2.1) แตะแล้วเปิดหน้าต่างบทเรียน
  ซึ่งมีเนื้อหาครบเหมือนเดิม (คำอธิบาย ตัวอาหรับ คำอ่าน ความหมาย) และอ่านออกเสียงให้ทันที
  เพราะการ์ดแบบ mock แสดงแค่ชื่อเรื่อง แต่เนื้อหาที่ต้องสอนคือคำอธิบายข้างใน

  hover ขยับเฉพาะกรอบภาพ ข้อความนิ่ง (ข้อ 2.1) และใช้ <dialog> ของเบราว์เซอร์
  ได้การกักโฟกัส ปุ่ม Esc และคืนโฟกัสกลับการ์ดให้เอง
*/
export function MoralSection({
  age,
  section,
  groups,
  cardArt,
  cardBubble = {},
  cartoons,
  progressKey,
}: {
  age: AgeId;
  section: AgeSection;
  groups: LessonGroup[];
  /** ภาพการ์ดของแต่ละบท (key = id บทเรียน) */
  cardArt: Record<string, string>;
  cardBubble?: Record<string, CardBubble>;
  /** บทที่มีการ์ตูนครูนูรี เปิดเป็นการ์ตูนแทนหน้าต่างข้อความ */
  cartoons: Record<string, Cartoon>;
  /** localStorage key ของดาว แยกตามเกาะ */
  progressKey: string;
}) {
  const { t, sub, pick, pickSub } = useDict();
  const lessons = groups.flatMap((group) => group.lessons);
  const progress = progressStore(progressKey);
  const markPractised = (id: string) => { awardLesson(`${progressKey.includes('explore') ? 'explore' : 'moral'}:${id}`); progress.markPractised(id); };
  const { stars, doneToday, maxStars } = progress.useProgress();
  const { speak } = useSound();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Lesson | null>(null);
  // บทที่มีการ์ตูนครูนูรี (cartoon.ts) เปิดเป็นการ์ตูนแทนหน้าต่างข้อความ
  const [cartoon, setCartoon] = useState<Lesson | null>(null);

  const done = lessons.filter((lesson) => doneToday(lesson.id)).length;
  const goal = Math.min(DAILY_GOAL, lessons.length);
  // บทข้อความ: ครบ TEXT_LESSON_MIN_MS หลังเปิดจึงนับว่าฟังแล้ว
  const listened = useRef(false);
  const listenTimer = useRef(0);
  const scriptOf = (lesson: Lesson) =>
    [pick(lesson.title), pick(lesson.body), lesson.reading, lesson.meaning && pick(lesson.meaning)].filter(Boolean).join(" ... ");

  const openLesson = (lesson: Lesson) => {
    // หยุดหุ่นยนต์แนะนำหน้าก่อน แล้วค่อยเริ่มเสียงบทเรียน
    window.dispatchEvent(new Event(LESSON_OPEN_EVENT));
    // ดาวได้เมื่อดูการ์ตูนจบ (onFinish) หรือฟังบทข้อความจนจบแล้วปิดหน้าต่าง ไม่ใช่แค่แตะเปิด
    if (cartoons[lesson.id]) {
      setCartoon(lesson);
      return;
    }
    listened.current = false;
    window.clearTimeout(listenTimer.current);
    listenTimer.current = window.setTimeout(() => {
      listened.current = true;
    }, TEXT_LESSON_MIN_MS);
    setOpen(lesson);
    speak(scriptOf(lesson));
  };

  // ออกจากหน้าตอนหน้าต่างบทเรียนยังเปิด (กดย้อนกลับ) = หยุดเสียงอ่านบทนั้น
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) stopAllSpeech();
    };
  }, []);

  // เปิดหน้าต่างหลังเนื้อหาวาดเสร็จ โฟกัสจึงลงที่ปุ่ม "ฟังอีกครั้ง" ไม่ใช่กล่องว่าง
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  return (
    <section id={age} aria-labelledby={`age-${age}`} className={`mrl-section mrl-section-${age} scroll-mt-4`}>
      {age === 'kids' && !cartoon && <LearningNotice />}
      <div className="mrl-section-head">
        <h2 id={`age-${age}`} className="mrl-age-badge font-display">
          <Image src={section.badge} alt="" width={96} height={96} className="mrl-age-badge-art" />
          <span>
            {pick(section.label)}
            {sub && <span lang="en" className="block text-sm font-semibold">
              {pickSub(section.label)}
            </span>}
          </span>
        </h2>
        <p className="mrl-section-desc">
          {pick(section.desc)}
          {sub && <span lang="en" className="text-ink-soft block text-sm">
            {pickSub(section.desc)}
          </span>}
        </p>
        {/* ภารกิจวันนี้ — บอกด้วยตัวเลขกำกับเสมอ ไม่ใช่แถบสีอย่างเดียว (ข้อ 2) */}
        <div className="mrl-mission" role="group" aria-label={fmt(t.moral.lessons.missionLabel, { done, goal })}>
          {SHOW_REWARD_STARS && <StarIcon className="size-9 shrink-0" />}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">
              {t.moral.lessons.mission} {done}/{goal}{" "}
              {sub && <span lang="en" className="text-ink-soft font-normal">
                {sub.moral.lessons.mission}
              </span>}
            </p>
            <span className="mrl-mission-bar" aria-hidden="true">
              <span style={{ width: `${Math.min(done / goal, 1) * 100}%` }} />
            </span>
          </div>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.id} className="mrl-group">
          {group.title && pick(group.title) && (
            <h3 className="mrl-group-title font-display">
              {pick(group.title)}
              {sub && pickSub(group.title) && (
                <span lang="en" className="text-ink-soft ml-2 text-base font-semibold">
                  {pickSub(group.title)}
                </span>
              )}
            </h3>
          )}
      <ul className="mrl-grid">
        {group.lessons.map((lesson) => {
          const count = stars(lesson.id);
          const bubble = cardBubble[lesson.id];
          return (
            <li key={lesson.id} className="flex">
              <button type="button" className="mrl-card group" onClick={() => openLesson(lesson)}>
                <span className="mrl-card-art">
                  <Image
                    src={cardArt[lesson.id]}
                    alt=""
                    width={512}
                    height={384}
                    sizes="(max-width: 1023px) 46vw, 260px"
                  />
                  {bubble && (
                    <span
                      lang="ar"
                      dir="rtl"
                      aria-hidden="true"
                      className="mrl-card-bubble"
                      style={{ left: `${bubble.left}%`, top: `${bubble.top}%`, width: `${bubble.width}%` }}
                    >
                      {bubble.text}
                    </span>
                  )}
                </span>
                <span className="mrl-card-title font-display">
                  {pick(lesson.title)}
                  {sub && <span lang="en">{pickSub(lesson.title)}</span>}
                </span>
                <span className="mrl-card-foot">
                  {SHOW_REWARD_STARS ? <>
                    <span className="mrl-card-stars flex gap-0.5">
                      {Array.from({ length: maxStars }, (_, i) => (
                        <StarIcon key={i} filled={i < count} />
                      ))}
                    </span>
                    <span className="sr-only">
                      {fmt(t.moral.lessons.stars, { count, maxStars })}
                    </span>
                  </> : <span />}
                  <svg viewBox="0 0 48 48" className="mrl-card-play" aria-hidden="true" focusable="false">
                    <circle cx="24" cy="24" r="22" />
                    <path d="M19.5 15.5 34 24l-14.5 8.5Z" fill="#fff" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
        </div>
      ))}

      <dialog
        ref={dialogRef}
        className="mrl-dialog"
        aria-labelledby={`lesson-title-${age}`}
        onClose={() => {
          // ปิดหน้าต่าง = หยุดเสียงอ่านบทนั้นด้วย
          window.clearTimeout(listenTimer.current);
          // ยังอ่านไม่จบตอนปิด = ยังไม่นับ (ปิดเสียงอยู่ก็ใช้แค่เกณฑ์เวลา)
          if (open && listened.current && !isSpeaking()) markPractised(open.id);
          stopAllSpeech();
          setOpen(null);
        }}
        onClick={(event) => {
          // แตะพื้นมืดรอบหน้าต่าง = ปิด
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        {open && (
          <div className="mrl-dialog-body">
            <span className="mrl-dialog-art">
              <Image src={cardArt[open.id]} alt="" width={512} height={384} sizes="(max-width: 639px) 90vw, 480px" />
            </span>
            <h3 id={`lesson-title-${age}`} className="font-display text-2xl leading-snug font-extrabold sm:text-3xl">
              {pick(open.title)}
              {sub && <span lang="en" className="text-ink-soft block text-base font-semibold">
                {pickSub(open.title)}
              </span>}
            </h3>
            <p className="mt-2 text-lg leading-relaxed"><ArabicText text={pick(open.body)} /></p>
            {sub && <p lang="en" className="text-ink-soft text-sm">{pickSub(open.body)}</p>}
            {open.arabic && (
              <div className="mrl-dialog-arabic">
                <p lang="ar" dir="rtl" className="text-ink text-2xl leading-loose font-semibold sm:text-3xl">
                  {open.arabic}
                </p>
                {open.reading && <p className="mt-1 font-semibold">{t.lessonCard.reading} {open.reading}</p>}
                {open.meaning && <p className="text-ink-soft text-sm">{t.lessonCard.meaning} {pick(open.meaning)}</p>}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="ui-pill ui-pill-primary" onClick={() => speak(scriptOf(open))}>
                <SpeakerIcon className="size-6" />
                <span>
                  {t.moral.lessons.listenAgain}{" "}
                  {sub && <span lang="en" className="text-sm font-normal">
                    {sub.moral.lessons.listenAgain}
                  </span>}
                </span>
              </button>
              <button type="button" className="ui-pill" onClick={() => dialogRef.current?.close()}>
                <span>
                  {t.moral.lessons.close}{" "}
                  {sub && <span lang="en" className="text-sm font-normal">
                    {sub.moral.lessons.close}
                  </span>}
                </span>
              </button>
            </div>
          </div>
        )}
      </dialog>

      {cartoon && (
        <CartoonLesson
          lesson={cartoon}
          cartoon={cartoons[cartoon.id]}
          onClose={() => setCartoon(null)}
          onFinish={() => markPractised(cartoon.id)}
        />
      )}
    </section>
  );
}
