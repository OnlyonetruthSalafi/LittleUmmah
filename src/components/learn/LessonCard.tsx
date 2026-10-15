"use client";

import { useDict } from "@/i18n/LocaleProvider";

import { LessonIcon } from "@/components/icons/LessonIcon";
import { SpeakerIcon } from "@/components/icons/SpeakerIcon";
import { useSound } from "@/components/sound/SoundProvider";
import type { Lesson } from "@/lib/lessons";

const TINTS = ["bg-sky", "bg-game-peach", "bg-game-mint", "bg-game-lilac"];

/*
  การ์ดบทเรียน — อ่านอย่างเดียว ไม่ใช่ลิงก์ จึงไม่ขยับตอน hover (ข้อ 2.1 ใช้กับสิ่งที่กดได้)
  จุดที่กดได้มีจุดเดียวคือปุ่ม "ฟัง" สูง 64px สำหรับเด็กที่ยังอ่านไม่ออก

  เสียงอ่านใช้คำอ่านภาษาไทยแทนตัวอาหรับ เพราะเสียงสังเคราะห์ภาษาไทยอ่านอักษรอาหรับไม่ได้
  ตัวอาหรับกำกับ lang="ar" dir="rtl" ให้ screen reader และเบราว์เซอร์จัดทิศถูก
  ไอคอน/ตัวอักษรใหญ่เป็นภาพตกแต่ง เพราะชื่อบทเรียนเป็นข้อความอยู่ข้างๆ แล้ว
*/
export function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const { t, sub, pick, pickSub } = useDict();
  const { speak } = useSound();
  const script = [pick(lesson.title), lesson.body, lesson.reading, lesson.meaning].filter(Boolean).join(" ... ");

  return (
    <li className="scene-copy shadow-soft rounded-card flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
      {/* ไม่ซ่อนกรอบนี้จาก screen reader: ตัวอักษรอาหรับคือสิ่งที่กำลังสอน ส่วนไอคอน SVG ซ่อนตัวเองอยู่แล้ว */}
      <span
        className={`${TINTS[index % TINTS.length]} rounded-card-sm flex size-24 shrink-0 items-center justify-center self-center sm:self-start`}
      >
        {lesson.glyph ? (
          <span lang="ar" dir="rtl" className="text-ink text-6xl leading-none font-bold">
            {lesson.glyph}
          </span>
        ) : (
          <LessonIcon name={lesson.icon} className="text-ink size-16" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl leading-snug font-extrabold sm:text-2xl">
          {pick(lesson.title)}
          {sub && <span lang="en" className="text-ink-soft block text-sm font-semibold">
            {pickSub(lesson.title)}
          </span>}
        </h3>
        <p className="mt-2 leading-relaxed">{lesson.body}</p>

        {lesson.arabic && (
          <div className="scene-copy rounded-card-sm mt-3 px-4 py-3">
            <p lang="ar" dir="rtl" className="text-ink text-2xl leading-loose font-semibold sm:text-3xl">
              {lesson.arabic}
            </p>
            {lesson.reading && <p className="mt-1 font-semibold">{t.lessonCard.reading} {lesson.reading}</p>}
            {lesson.meaning && <p className="text-ink-soft text-sm">{t.lessonCard.meaning} {lesson.meaning}</p>}
          </div>
        )}

        <button
          type="button"
          onClick={() => speak(script)}
          className="bg-sun text-sun-ink shadow-soft hover:bg-sun-deep hover:shadow-float mt-4 inline-flex min-h-16 items-center gap-2 rounded-full px-6 font-bold transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] motion-safe:active:duration-75"
        >
          <SpeakerIcon className="size-6" />
          {t.lessonCard.listen}
          {sub && <span lang="en" className="text-sm font-normal">
            {sub.lessonCard.listen}
          </span>}
          <span className="sr-only">{pick(lesson.title)}</span>
        </button>
      </div>
    </li>
  );
}
