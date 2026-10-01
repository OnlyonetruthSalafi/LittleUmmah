"use client";

import { useSyncExternalStore } from "react";

/*
  ดาวและภารกิจวันนี้ของเกาะมารยาท — เก็บในเครื่องของผู้ใช้เท่านั้น (localStorage)
  ไม่มีบัญชีผู้ใช้ ข้อมูลหายได้ถ้าล้างเบราว์เซอร์ หน้าเว็บจึงต้องทำงานได้ปกติแม้อ่านค่าไม่ได้

  ความหมายของดาว: "ฝึกบทนี้มาแล้วกี่วัน" สูงสุด 3 ดวง ตรงกับคำว่า "ฝึกไปด้วยกันทุกวัน"
  ภารกิจวันนี้: บทของช่วงวัยนั้นที่เปิดฟังแล้ววันนี้ / ทั้งหมด
  เปิดบทเรียน (แตะการ์ด) = นับว่าฝึกแล้วในวันนั้น
*/
const KEY = "lu-moral-progress";
const MAX_STARS = 3;

type Progress = Record<string, string[]>;

const EMPTY: Progress = {};
let cache: Progress | null = null;
const listeners = new Set<() => void>();

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
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

export function markPractised(lessonId: string) {
  const current = read();
  const days = current[lessonId] ?? [];
  const day = today();
  if (days.includes(day)) return;
  // เก็บแค่วันล่าสุดไม่เกินจำนวนดาว — ข้อมูลไม่โตเรื่อยๆ
  cache = { ...current, [lessonId]: [...days, day].slice(-MAX_STARS) };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
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

export function useMoralProgress() {
  const progress = useSyncExternalStore(subscribe, read, () => EMPTY);
  const day = today();
  return {
    stars: (lessonId: string) => Math.min(progress[lessonId]?.length ?? 0, MAX_STARS),
    doneToday: (lessonId: string) => progress[lessonId]?.includes(day) ?? false,
    maxStars: MAX_STARS,
  };
}
