"use client";

import { useSyncExternalStore } from "react";

/*
  ดาวและภารกิจวันนี้ของเกาะที่ใช้หน้าตาแบบเกาะมารยาท — เก็บในเครื่องของผู้ใช้เท่านั้น (localStorage)
  ไม่มีบัญชีผู้ใช้ ข้อมูลหายได้ถ้าล้างเบราว์เซอร์ หน้าเว็บจึงต้องทำงานได้ปกติแม้อ่านค่าไม่ได้

  ความหมายของดาว: "ฝึกบทนี้มาแล้วกี่วัน" สูงสุด 3 ดวง ตรงกับคำว่า "ฝึกไปด้วยกันทุกวัน"
  ภารกิจวันนี้: บทของช่วงวัยนั้นที่เปิดฟังแล้ววันนี้ / ทั้งหมด
  เปิดบทเรียน (แตะการ์ด) = นับว่าฝึกแล้วในวันนั้น

  แต่ละเกาะมีที่เก็บของตัวเอง (createProgress(key)) id บทเรียนของสองเกาะจึงชนกันไม่ได้
*/
const MAX_STARS = 3;

type Progress = Record<string, string[]>;

const EMPTY: Progress = {};

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export type ProgressStore = {
  markPractised: (lessonId: string) => void;
  useProgress: () => {
    stars: (lessonId: string) => number;
    doneToday: (lessonId: string) => boolean;
    maxStars: number;
  };
};

export function createProgress(key: string): ProgressStore {
  let cache: Progress | null = null;
  const listeners = new Set<() => void>();

  function read(): Progress {
    if (cache) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      // รับเฉพาะ { id: ["วันที่", ...] } — ข้อมูลเสียหรือถูกแก้มือต้องไม่ทำให้หน้าพัง
      cache = {};
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [id, days] of Object.entries(parsed)) {
          if (Array.isArray(days)) cache[id] = days.filter((d): d is string => typeof d === "string");
        }
      }
    } catch {
      cache = {};
    }
    return cache;
  }

  function markPractised(lessonId: string) {
    const current = read();
    const days = current[lessonId] ?? [];
    const day = today();
    if (days.includes(day)) return;
    // เก็บแค่วันล่าสุดไม่เกินจำนวนดาว — ข้อมูลไม่โตเรื่อยๆ
    cache = { ...current, [lessonId]: [...days, day].slice(-MAX_STARS) };
    try {
      window.localStorage.setItem(key, JSON.stringify(cache));
    } catch {
      // บันทึกไม่ได้ (private mode) ก็ยังแสดงผลในหน้านี้ได้จาก cache
    }
    for (const listener of listeners) listener();
  }

  function subscribe(onChange: () => void) {
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }

  function useProgress() {
    const progress = useSyncExternalStore(subscribe, read, () => EMPTY);
    const day = today();
    return {
      stars: (lessonId: string) => Math.min(progress[lessonId]?.length ?? 0, MAX_STARS),
      doneToday: (lessonId: string) => progress[lessonId]?.includes(day) ?? false,
      maxStars: MAX_STARS,
    };
  }

  return { markPractised, useProgress };
}

// หนึ่ง key = หนึ่งที่เก็บ หน้า (server component) ส่งแค่ key มาเป็น props เพราะส่งฟังก์ชันข้ามไปฝั่ง client ไม่ได้
const stores = new Map<string, ProgressStore>();
export function progressStore(key: string) {
  let store = stores.get(key);
  if (!store) {
    store = createProgress(key);
    stores.set(key, store);
  }
  return store;
}
