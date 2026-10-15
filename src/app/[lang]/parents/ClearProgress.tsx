"use client";

import { useState } from "react";

import { useDict } from "@/i18n/LocaleProvider";

import { UI } from "./content";

/*
  ปุ่มล้างความคืบหน้าในเครื่องนี้ (ดาวมารยาท ดาวสำรวจโลก ด่านเกม และสถานะ "ดูคำแนะนำแล้ว")
  ไม่ล้างการตั้งค่าเปิด/ปิดเสียง เพราะเป็นการตั้งค่า ไม่ใช่ข้อมูลการเรียน

  กดสองครั้งเพื่อยืนยัน แทน window.confirm ที่หน้าตาต่างกันไปทุกเบราว์เซอร์
  ล้างแล้วโหลดหน้าใหม่ เพราะที่เก็บดาว/ด่านมี cache ในหน่วยความจำ ถ้าไม่โหลดใหม่ หน้าอื่นจะยังเห็นค่าเก่า
  ถ้าเพิ่ม key ใหม่ใน localStorage/sessionStorage ต้องเพิ่มที่นี่และในรายการบนหน้าผู้ปกครองด้วย
*/
const LOCAL_KEYS = ["lu-moral-progress", "lu-explore-progress"];
const LOCAL_PREFIXES = ["little-ummah:games:"];
const SESSION_KEYS = ["lu-moral-guide-seen", "lu-explore-guide-seen", "lu-stories-guide-seen"];

function clearAll() {
  try {
    const local = window.localStorage;
    const keys = Array.from({ length: local.length }, (_, i) => local.key(i)).filter((k): k is string => k !== null);
    for (const key of keys) {
      if (LOCAL_KEYS.includes(key) || LOCAL_PREFIXES.some((p) => key.startsWith(p))) local.removeItem(key);
    }
    for (const key of SESSION_KEYS) window.sessionStorage.removeItem(key);
  } catch {
    // เบราว์เซอร์ห้ามแตะที่เก็บข้อมูล (โหมดส่วนตัวบางแบบ) — ไม่มีอะไรเก็บไว้ให้ล้างอยู่แล้ว
  }
}

export function ClearProgress() {
  const [armed, setArmed] = useState(false);
  const { pick } = useDict();
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="ui-pill"
        onClick={() => {
          if (!armed) {
            setArmed(true);
            return;
          }
          clearAll();
          window.location.reload();
        }}
        onBlur={() => setArmed(false)}
      >
        {pick(armed ? UI.clearConfirm : UI.clear)}
      </button>
      <p className="text-ink-soft text-sm" aria-live="polite">
        {armed ? pick(UI.clearWarn) : ""}
      </p>
    </div>
  );
}
