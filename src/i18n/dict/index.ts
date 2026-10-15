import type { Locale, Text } from "../config";
import { en } from "./en";
import { th } from "./th";

/** รูปของ dictionary ทุกภาษา = รูปของ th.ts โดยค่าเป็น string อะไรก็ได้ */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dictionary = Widen<typeof th>;

const DICTIONARIES: Record<Locale, Dictionary> = { th, en };

/** แทนค่า {name} ในข้อความ */
export function fmt(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (all, key: string) => (key in vars ? String(vars[key]) : all));
}

/*
  ข้อความของหน้าในภาษาหนึ่ง
  - t      = ข้อความหลักของหน้า
  - sub    = บรรทัดรองภาษาอังกฤษ มีเฉพาะหน้าไทย (ไทยนำ อังกฤษรอง) หน้าอื่นเป็น null ไม่ต้องแสดง
  - pick / pickSub = แบบเดียวกันสำหรับข้อมูล { th, en } ในไฟล์ข้อมูลของเกาะ
  server component เรียก dict(locale) ตรงๆ, client component ใช้ useDict() จาก LocaleProvider
*/
export function dict(locale: Locale) {
  const hasSub = locale === "th";
  return {
    locale,
    t: DICTIONARIES[locale],
    sub: hasSub ? DICTIONARIES.en : null,
    pick: (text: Text) => text[locale],
    pickSub: (text: Text) => (hasSub ? text.en : null),
  };
}

export type Dict = ReturnType<typeof dict>;
