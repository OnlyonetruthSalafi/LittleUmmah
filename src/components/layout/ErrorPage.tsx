"use client";

import Image from "next/image";
import { useEffect } from "react";

import { LocaleLink, useDict } from "@/i18n/LocaleProvider";
import styles from "./ErrorPage.module.css";

export type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

const actionClass = "flex min-h-16 min-w-16 flex-col items-center justify-center rounded-2xl px-6 py-2 font-bold shadow-soft hover:shadow-float active:shadow-float transition-[translate,scale,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] active:duration-75";

/** ใช้ได้โดยไม่พึ่ง SoundProvider เพื่อให้หน้า fallback มีสิ่งที่อาจพังน้อยที่สุด */
export function ErrorPage({ error, retry, embedded = false, reloadHome = false }: ErrorPageProps & { embedded?: boolean; reloadHome?: boolean }) {
  const { t, sub } = useDict();
  useEffect(() => { console.error(error); }, [error]);

  const content = (
    <section className={styles.page} aria-labelledby="error-title">
      {/* นูรีช่วยให้บรรยากาศอ่อนโยน แต่ข้อมูลและทางออกทั้งหมดอยู่ในข้อความแล้ว */}
      <Image src="/Character/encourage.webp" alt="" width={160} height={160} className={styles.robot} />
      <div className={styles.copy}>
        <h1 id="error-title" className="font-display text-2xl font-extrabold sm:text-3xl">
          {t.error.title}
          {sub && <span lang="en" className="mt-1 block text-lg font-semibold">{sub.error.title}</span>}
        </h1>
        <p className="mt-3 text-base">{t.error.body}</p>
        {sub && <p lang="en" className="text-ink-soft mt-1 text-sm">{sub.error.body}</p>}
        <div className={styles.actions}>
          <button type="button" onClick={retry} className={`${actionClass} bg-brand-blue text-white`}>
            {t.error.retry}
            {sub && <span lang="en" className="text-sm font-semibold">{sub.error.retry}</span>}
          </button>
          <LocaleLink href="/" prefetch={false} onClick={reloadHome ? (event) => {
            // global fallback ต้องสร้าง root layout ใหม่ ไม่ใช้ layout ที่พังจาก router cache
            event.preventDefault();
            window.location.assign(event.currentTarget.href);
          } : undefined} className={`${actionClass} border-brand-blue text-brand-blue border-2 bg-white`}>
            {t.error.home}
            {sub && <span lang="en" className="text-sm font-semibold">{sub.error.home}</span>}
          </LocaleLink>
        </div>
        {error.digest && (
          <p className="text-ink-soft mt-4 text-xs [overflow-wrap:anywhere]">
            {t.error.reference}{sub && <span lang="en"> / {sub.error.reference}</span>}: <bdi>{error.digest}</bdi>
          </p>
        )}
      </div>
    </section>
  );
  return embedded ? content : <main className={styles.screen}>{content}</main>;
}
