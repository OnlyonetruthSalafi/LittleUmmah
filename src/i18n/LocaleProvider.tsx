"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, type ComponentProps } from "react";

import { setSpeechLocale } from "@/lib/speech";

import { DEFAULT_LOCALE, type Locale } from "./config";
import { dict } from "./dict";
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

/** ข้อความของหน้าในภาษาปัจจุบัน — ดู dict() ใน ./dict */
export function useDict() {
  const locale = useLocale();
  // คงอ้างอิงเดิมตลอดที่ภาษาไม่เปลี่ยน ใส่ใน dependency ของ effect ได้โดยไม่ทำให้รันซ้ำทุก render
  return useMemo(() => dict(locale), [locale]);
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
export function LocaleLink({ href, prefetchOnIntent = false, onPointerEnter, onPointerDown, onFocus, ...props }: ComponentProps<typeof Link> & { prefetchOnIntent?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const target = typeof href === "string" ? localePath(locale, href) : href;
  const prepare = () => {
    if (prefetchOnIntent && typeof target === "string") router.prefetch(target);
  };
  return <Link href={target} {...props}
    prefetch={prefetchOnIntent ? false : props.prefetch}
    onPointerEnter={event => { if (event.pointerType === "mouse") prepare(); onPointerEnter?.(event); }}
    onPointerDown={event => { prepare(); onPointerDown?.(event); }}
    onFocus={event => { prepare(); onFocus?.(event); }}
  />;
}
