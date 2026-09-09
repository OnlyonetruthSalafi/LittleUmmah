"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  RECORDED_CLIPS,
  getSpeechBrokenServerSnapshot,
  getSpeechBrokenSnapshot,
  playRecordedClip,
  speakWithSynth,
  stopAllSpeech,
  subscribeSpeechBroken,
  warmUpVoices,
} from "@/lib/speech";
import {
  getSoundServerSnapshot,
  getSoundSnapshot,
  setSoundEnabled,
  subscribeSound,
} from "@/lib/soundStore";

type SoundContextValue = {
  enabled: boolean;
  /** อุปกรณ์นี้อ่านออกเสียงไม่ได้ เช่น ไม่มีเสียงไทยติดตั้งไว้ */
  speechBroken: boolean;
  toggle: () => void;
  /** อ่านออกเสียงข้อความไทย key ใช้เลือกไฟล์เสียงที่อัดไว้ถ้ามี */
  speak: (text: string, key?: string) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(
    subscribeSound,
    getSoundSnapshot,
    getSoundServerSnapshot,
  );

  const speechBroken = useSyncExternalStore(
    subscribeSpeechBroken,
    getSpeechBrokenSnapshot,
    getSpeechBrokenServerSnapshot,
  );

  useEffect(() => {
    warmUpVoices();
  }, []);

  const toggle = useCallback(() => {
    const next = !getSoundSnapshot();
    if (!next) stopAllSpeech();
    setSoundEnabled(next);
  }, []);

  /*
    อ่านสถานะจาก store โดยตรงแทนค่าที่ปิดมากับ closure
    เพราะปุ่มเปิดเสียงต้องพูดยืนยันทันทีในคลิกเดียวกับที่เพิ่งเปิด
    ถ้าใช้ค่าจาก closure จะยังเป็นสถานะเก่าคือปิดอยู่ แล้วเสียงจะไม่ดัง
  */
  const speak = useCallback((text: string, key?: string) => {
    if (!getSoundSnapshot()) return;

    if (key && RECORDED_CLIPS.has(key)) {
      playRecordedClip(key, () => {
        // ระหว่างรอไฟล์โหลด ผู้ใช้อาจกดปิดเสียงไปแล้ว ต้องเช็กซ้ำก่อนใช้เสียงสำรอง
        if (getSoundSnapshot()) speakWithSynth(text);
      });
      return;
    }

    speakWithSynth(text);
  }, []);

  const value = useMemo(
    () => ({ enabled, speechBroken, toggle, speak }),
    [enabled, speechBroken, toggle, speak],
  );

  return <SoundContext value={value}>{children}</SoundContext>;
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound ต้องอยู่ภายใน SoundProvider");
  }
  return context;
}
