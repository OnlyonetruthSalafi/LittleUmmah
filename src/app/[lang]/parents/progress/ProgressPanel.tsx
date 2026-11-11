'use client';
import { useSyncExternalStore } from 'react';
import type { Locale } from '@/i18n/config';
import type { CurriculumAge } from '@/lib/parents-curriculum';
import { readParentsProgress } from '@/lib/parents-progress';
import { P } from '../pages-content';

function subscribe(fn: () => void) {
  window.addEventListener('storage', fn); window.addEventListener('focus', fn);
  const timer = window.setInterval(fn, 30_000);
  return () => { window.removeEventListener('storage', fn); window.removeEventListener('focus', fn); window.clearInterval(timer); };
}
// Primitive snapshot is stable between notifications and null on the server.
export function ProgressPanel({ curriculum, lang }: { curriculum: CurriculumAge[]; lang: Locale }) {
  const snapshot = useSyncExternalStore(subscribe, () => {
    try { return JSON.stringify(readParentsProgress(curriculum, window.localStorage)); }
    catch { return JSON.stringify(readParentsProgress(curriculum)); }
  }, () => null);
  // ค่าอยู่บรรทัดเดียวกับป้ายทั้งไทยและอังกฤษ ไม่ห้อย ": 1" ลงบรรทัดใหม่
  const labelled = (text: { th: string; en: string }, value: number | string) => <p>{text[lang]} <strong>{value}</strong>{lang === 'th' && <span lang="en" className="block text-sm font-normal">{text.en} {value}</span>}</p>;
  const copy = (text: { th: string; en: string }) => <>{text[lang]}{lang === 'th' && <span lang="en" className="block text-sm font-normal">{text.en}</span>}</>;
  if (snapshot === null) return <div className="min-h-96" aria-busy="true">{copy(P.loading)}</div>;
  const result: ReturnType<typeof readParentsProgress> = JSON.parse(snapshot);
  return <div className="min-h-96" data-progress-ready>
    <dl className="my-6 grid gap-4 sm:grid-cols-2">{[[P.balance, result.balance], [P.time, result.minutes]].map(([title, count], index) => <div key={index} className="rounded-2xl border border-ink/20 p-4"><dt>{copy(title as typeof P.balance)}</dt><dd className="mt-2 text-3xl font-bold">{count as number}</dd></div>)}</dl>
    <p className="leading-relaxed">{copy(P.limited)}</p>
    {!result.hasProgress && <p className="mt-5 rounded-2xl bg-sky-pale p-4" data-empty>{copy(P.empty)}</p>}
    {result.islands.map(island => <section key={island.slug} className="mt-8" data-progress-island={island.slug}>
      <h2 className="font-display text-xl font-bold">{copy(island.title)}</h2>
      {island.items.length ? <ul className="mt-3 space-y-4">{island.items.map(item => <li key={item.id} className="border-b border-ink/20 pb-3">
        <div className="font-semibold">{copy(item.title)}</div>
        {item.level && labelled(P.level, item.level)}
        {item.stars !== undefined && labelled(P.stars, item.stars)}
        {!!item.dates.length && <p className="mt-1 text-sm">{copy(P.dates)} {item.dates.map(day => { const [y, m, d] = day.split('-').map(Number); return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH-u-ca-gregory' : 'en-GB', { dateStyle: 'medium' }).format(new Date(y, m - 1, d)); }).join(' · ')}</p>}
      </li>)}</ul> : <p className="mt-2">{copy(P.none)}</p>}
    </section>)}
  </div>;
}
