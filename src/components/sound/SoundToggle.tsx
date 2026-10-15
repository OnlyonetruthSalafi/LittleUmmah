"use client";

import { SpeakerIcon } from "@/components/icons/SpeakerIcon";
import { useSound } from "@/components/sound/SoundProvider";
import { useDict } from "@/i18n/LocaleProvider";

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
  const { t, sub } = useDict();

  const unavailable = enabled && speechBroken;

  return (
    <button
      type="button"
      onClick={() => {
        toggle();
        // speak อ่านสถานะสดจาก store จึงพูดได้ทันทีในคลิกเดียวกับที่เพิ่งเปิด
        speak(t.speech.soundOn, "sound-on");
      }}
      aria-pressed={enabled}
      aria-label={t.sound.label}
      title={unavailable ? t.sound.noVoice : t.sound.label}
      className="ui-pill ui-pill-sm-round relative shrink-0 text-sm sm:text-base"
    >
      <span className="ui-disc">
        <SpeakerIcon on={enabled} />
      </span>
      {/* ป้ายบอกสถานะด้วยคำ ไม่ใช่สีของวงไอคอนอย่างเดียว (ข้อ 2) */}
      <span className="ui-label hidden sm:block" aria-hidden="true">
        {enabled ? t.sound.on : t.sound.off}
        {sub && (
          <span lang="en" className="ui-sub">
            {enabled ? sub.sound.on : sub.sound.off}
          </span>
        )}
      </span>
      {unavailable && (
        <span className="bg-sun absolute top-1.5 right-1.5 size-3 rounded-full" />
      )}
      {unavailable && (
        <span className="sr-only">{t.sound.noVoiceShort}</span>
      )}
    </button>
  );
}
