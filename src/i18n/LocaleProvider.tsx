"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, type ComponentProps } from "react";

import { setSpeechLocale } from "@/lib/speech";

import { DEFAULT_LOCALE, type Locale } from "./config";
import { localePath } from "./path";

/*
  ภาษาของหน้าปัจจุบัน ส่งลงไปให้ client component ทุกตัว
  ตั้งที่ app/[lang]/layout.tsx จาก URL (/en/... = en, ที่เหลือ = th)
*/
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  // เสียงสังเคราะห์สำรอง (lib/speech.ts) ต้องรู้ภาษาเพื่อเลือกเสียงและสำเนียง
  useEffect(() => setSpeechLocale(locale), [locale]);
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** แปลง path ภายในเว็บให้อยู่ในภาษาปัจจุบัน ใช้กับ router.push() */
export function useLocalePath() {
  const locale = useLocale();
  return (href: string) => localePath(locale, href);
}

/**
  ลิงก์ภายในเว็บที่คงภาษาปัจจุบันไว้ — ใช้แทน next/link ทุกที่ที่ชี้ไปหน้าในเว็บ
  href ที่เป็น string และขึ้นต้นด้วย "/" จะได้ prefix ของภาษา (ไทยไม่มี prefix จึงเหมือนเดิม)
*/
export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  return <Link href={typeof href === "string" ? localePath(locale, href) : href} {...props} />;
}
