"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { afterScenePaint } from "@/components/performance/afterScenePaint";

import { useSound } from "@/components/sound/SoundProvider";
import { playNarration, stopAllSpeech } from "@/lib/speech";

import "../story-guide.css";
import { useDict } from "@/i18n/LocaleProvider";

/*
  ครูนูรีแนะนำเกาะเรื่องเล่า เหนือตู้หนังสือ (เจ้าของโปรเจกต์สั่ง 8 ต.ค. 2026)

  - ข้อความในบอลลูนแสดงตลอด (ไทยนำ อังกฤษรอง) ปิดเสียงหรือเบราว์เซอร์บล็อกเสียงก็ยังอ่านได้
  - พูดเองครั้งเดียวต่อการเปิดเว็บ (sessionStorage) เบราว์เซอร์มักบล็อกเสียงก่อนแตะจอ — ถ้าถูกบล็อกก็เงียบไป ไม่ค้าง
  - แตะตัวหุ่นเพื่อฟังอีกครั้ง (ปุ่ม 96px ≥ 64px ตามข้อ 2) ชี้/แตะหนังสือบนตู้ = เสียงนี้หยุด เพราะใช้ช่องเสียงเดียวกัน
  - ไม่มีการเคลื่อนไหววนซ้ำ (ข้อ 2.1)
  เสียง: public/audio/th/stories-intro.mp3 อัดด้วย scripts/lib/robot-voice.mjs จากข้อความ stories.guide.intro ใน dictionary ภาษาไทยตรงตัว
*/
const CLIP = "stories-intro";
const SEEN_KEY = "lu-stories-guide-seen";

export function StoryGuide() {
  const { locale, t, sub } = useDict();
  const { enabled: soundOn } = useSound();
  const stop = useRef<() => void>(() => {});
  const cancelAuto = useRef<() => void>(() => {});

  const say = () => {
    cancelAuto.current();
    // ปิดเสียงเว็บอยู่ = ไม่เล่น ข้อความในบอลลูนยังอ่านได้
    if (!soundOn) return;
    try { window.sessionStorage.setItem(SEEN_KEY, "1"); } catch {}
    stop.current();
    stop.current = playNarration(`/audio/${locale}/${CLIP}.mp3`, { onEnded: () => {}, onStopped: () => {}, onFail: () => {} });
  };

  useEffect(() => {
    if (!soundOn) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // อ่าน sessionStorage ไม่ได้ ก็พูดเหมือนเปิดครั้งแรก
    }
    if (seen) return;
    const cancel = afterScenePaint(() => {
      say();
    });
    cancelAuto.current = cancel;
    // A child choosing a book takes precedence over a delayed introduction.
    document.addEventListener("pointerdown", cancel, { once: true, capture: true });
    document.addEventListener("keydown", cancel, { once: true, capture: true });
    return () => {
      cancel();
      document.removeEventListener("pointerdown", cancel, true);
      document.removeEventListener("keydown", cancel, true);
    };
    // พูดเองแค่ตอนเข้าหน้า ไม่พูดซ้ำเมื่อเปิดเสียงทีหลัง
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ออกจากหน้า = หยุดเสียงครู
  useEffect(() => () => stop.current(), []);
  useEffect(() => {
    if (!soundOn) { cancelAuto.current(); stopAllSpeech(); }
  }, [soundOn]);

  return (
    <div className="mx-auto mt-4 flex max-w-3xl items-end gap-3 px-1 sm:gap-4">
      <button
        type="button"
        onClick={say}
        aria-label={t.stories.guide.replay}
        className="focus-visible:outline-brand-blue size-24 shrink-0 rounded-full transition-[box-shadow,transform] duration-75 ease-out hover:shadow-float active:shadow-soft focus-visible:outline-4 focus-visible:outline-offset-2 motion-safe:active:scale-[0.98]"
      >
        <Image src="/Character/welcome.webp" alt="" width={96} height={96}  className="size-24 object-contain" />
      </button>
      <div className="sg-bubble">
        <p className="sg-name">
          {t.stories.guide.name}{" "}{sub && <span lang="en">{sub.stories.guide.name}</span>}
        </p>
        <p className="text-lg leading-relaxed font-semibold sm:text-xl">{t.stories.guide.intro}</p>
        {sub && <p lang="en" className="text-ink-soft mt-1 text-sm sm:text-base">
          {sub.stories.guide.intro}
        </p>}
      </div>
    </div>
  );
}
