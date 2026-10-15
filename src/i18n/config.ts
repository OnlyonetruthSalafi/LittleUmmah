/*
  ภาษาของเว็บ — ไทยเป็นภาษาหลัก URL ไม่มี prefix (/learn/moral) ภาษาอื่นมี prefix (/en/learn/moral)
  เจ้าของโปรเจกต์ตัดสิน 15 ต.ค. 2026 (docs/meetings/2026-10-15-global-structure-audit.md)
  เพิ่มภาษาใหม่: ใส่รหัสใน LOCALES แล้ว TypeScript จะชี้ทุกข้อความที่ยังไม่มีคำแปล
*/
export const LOCALES = ["th", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "th";

/** ข้อความหนึ่งชุดในทุกภาษา */
export type Text = Record<Locale, string>;
