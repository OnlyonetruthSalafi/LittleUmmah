"use client";

import { SpeakerIcon } from "@/components/icons/SpeakerIcon";
import { useSound } from "@/components/sound/SoundProvider";

/*
  ปุ่มเปิด/ปิดเสียงอ่าน

  ชื่อที่ screen reader อ่านคงที่เป็น "เสียงอ่าน" เสมอ แล้วให้ aria-pressed
  เป็นตัวบอกสถานะ ไม่สลับชื่อไปมาเป็น "เปิด/ปิดเสียง" ซึ่งจะทำให้ผู้ใช้
  สับสนว่าคำที่ได้ยินคือสถานะปัจจุบันหรือคำสั่งที่กำลังจะทำ

  ต้องมีปุ่มนี้ เพราะเด็กใช้เว็บในห้องเรียนหรือที่สาธารณะได้
  และผู้ใช้ screen reader จะได้ยินเสียงซ้อนสองชั้นถ้าปิดไม่ได้
*/
export function SoundToggle() {
  const { enabled, speechBroken, toggle, speak } = useSound();

  const unavailable = enabled && speechBroken;

  return (
    <button
      type="button"
      onClick={() => {
        toggle();
        // speak อ่านสถานะสดจาก store จึงพูดได้ทันทีในคลิกเดียวกับที่เพิ่งเปิด
        speak("เปิดเสียงแล้ว", "sound-on");
      }}
      aria-pressed={enabled}
      aria-label="เสียงอ่าน"
      title={
        unavailable
          ? "อุปกรณ์นี้ยังไม่มีเสียงอ่านภาษาไทยติดตั้งไว้"
          : "เสียงอ่าน"
      }
      className="bg-cloud shadow-soft relative flex min-h-16 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-[transform,box-shadow] duration-200 ease-out hover:shadow-float motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] sm:px-5 sm:text-base"
    >
      <SpeakerIcon
        on={enabled}
        className={`size-6 shrink-0 sm:size-7 ${enabled ? "text-brand-blue" : "text-ink-soft"}`}
      />
      <span className={`hidden sm:inline ${enabled ? "text-ink" : "text-ink-soft"}`}>
        เสียง
      </span>
      {unavailable && (
        <span className="bg-sun absolute top-1.5 right-1.5 size-3 rounded-full" />
      )}
      {unavailable && (
        <span className="sr-only">อุปกรณ์นี้ยังไม่มีเสียงอ่านภาษาไทย</span>
      )}
    </button>
  );
}
