"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { SpeakerIcon } from "@/components/icons/SpeakerIcon";
import { StarIcon } from "@/components/icons/StarIcon";
import { useSound } from "@/components/sound/SoundProvider";
import type { Lesson } from "@/lib/lessons";
import { stopAllSpeech } from "@/lib/speech";

import type { Cartoon } from "../cartoon";
import { LESSON_OPEN_EVENT, type AgeId, type AgeSection } from "../data";
import { progressStore } from "../progress";
import { CartoonLesson } from "./CartoonLesson";

/** การ์ดหนึ่งกลุ่มในช่วงวัย — เกาะที่มีหลายหมวด (สำรวจโลก) แสดงหัวข้อกลุ่มเหนือแต่ละตาราง */
export type LessonGroup = { id: string; titleTh?: string; titleEn?: string; lessons: Lesson[] };

type CardBubble = { text: string; left: number; top: number; width: number };

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
  const lessons = groups.flatMap((group) => group.lessons);
  const progress = progressStore(progressKey);
  const { markPractised } = progress;
  const { stars, doneToday, maxStars } = progress.useProgress();
  const { speak } = useSound();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Lesson | null>(null);
  // บทที่มีการ์ตูนครูนูรี (cartoon.ts) เปิดเป็นการ์ตูนแทนหน้าต่างข้อความ
  const [cartoon, setCartoon] = useState<Lesson | null>(null);

  const done = lessons.filter((lesson) => doneToday(lesson.id)).length;
  const scriptOf = (lesson: Lesson) =>
    [lesson.titleTh, lesson.body, lesson.reading, lesson.meaning].filter(Boolean).join(" ... ");

  const openLesson = (lesson: Lesson) => {
    // หยุดหุ่นยนต์แนะนำหน้าก่อน แล้วค่อยเริ่มเสียงบทเรียน
    window.dispatchEvent(new Event(LESSON_OPEN_EVENT));
    markPractised(lesson.id);
    if (cartoons[lesson.id]) {
      setCartoon(lesson);
      return;
    }
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
      <div className="mrl-section-head">
        <h2 id={`age-${age}`} className="mrl-age-badge font-display">
          <Image src={section.badge} alt="" width={96} height={96} className="mrl-age-badge-art" />
          <span>
            {section.labelTh}
            <span lang="en" className="block text-sm font-semibold">
              {section.labelEn}
            </span>
          </span>
        </h2>
        <p className="mrl-section-desc">
          {section.descTh}
          <span lang="en" className="text-ink-soft block text-sm">
            {section.descEn}
          </span>
        </p>
        {/* ภารกิจวันนี้ — บอกด้วยตัวเลขกำกับเสมอ ไม่ใช่แถบสีอย่างเดียว (ข้อ 2) */}
        <div className="mrl-mission" role="group" aria-label={`ภารกิจวันนี้ ${done} จาก ${lessons.length}`}>
          <StarIcon className="size-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">
              ภารกิจวันนี้ {done}/{lessons.length}{" "}
              <span lang="en" className="text-ink-soft font-normal">
                Today
              </span>
            </p>
            <span className="mrl-mission-bar" aria-hidden="true">
              <span style={{ width: `${(done / lessons.length) * 100}%` }} />
            </span>
          </div>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.id} className="mrl-group">
          {group.titleTh && (
            <h3 className="mrl-group-title font-display">
              {group.titleTh}
              {group.titleEn && (
                <span lang="en" className="text-ink-soft ml-2 text-base font-semibold">
                  {group.titleEn}
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
                  {lesson.titleTh}
                  <span lang="en">{lesson.titleEn}</span>
                </span>
                <span className="mrl-card-foot">
                  <span className="mrl-card-stars flex gap-0.5">
                    {Array.from({ length: maxStars }, (_, i) => (
                      <StarIcon key={i} filled={i < count} />
                    ))}
                  </span>
                  <span className="sr-only">
                    ดาว {count} จาก {maxStars}
                  </span>
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
              {open.titleTh}
              <span lang="en" className="text-ink-soft block text-base font-semibold">
                {open.titleEn}
              </span>
            </h3>
            <p className="mt-2 text-lg leading-relaxed">{open.body}</p>
            {open.arabic && (
              <div className="mrl-dialog-arabic">
                <p lang="ar" dir="rtl" className="text-ink text-2xl leading-loose font-semibold sm:text-3xl">
                  {open.arabic}
                </p>
                {open.reading && <p className="mt-1 font-semibold">อ่านว่า: {open.reading}</p>}
                {open.meaning && <p className="text-ink-soft text-sm">ความหมาย: {open.meaning}</p>}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="ui-pill ui-pill-primary" onClick={() => speak(scriptOf(open))}>
                <SpeakerIcon className="size-6" />
                <span>
                  ฟังอีกครั้ง{" "}
                  <span lang="en" className="text-sm font-normal">
                    Listen again
                  </span>
                </span>
              </button>
              <button type="button" className="ui-pill" onClick={() => dialogRef.current?.close()}>
                <span>
                  ปิด{" "}
                  <span lang="en" className="text-sm font-normal">
                    Close
                  </span>
                </span>
              </button>
            </div>
          </div>
        )}
      </dialog>

      {cartoon && <CartoonLesson lesson={cartoon} cartoon={cartoons[cartoon.id]} onClose={() => setCartoon(null)} />}
    </section>
  );
}
