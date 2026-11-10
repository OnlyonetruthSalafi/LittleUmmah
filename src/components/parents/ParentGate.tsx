'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import { LS } from '@/features/learning-stars/content';
import '@/features/learning-stars/learning-stars.css';

let passedUntil = 0;
// โจทย์ผู้ใหญ่: เลข 12–19 คูณ 6–9 เขียนเป็นคำ (สูตรคูณแม่ 6–9 ล้วนเด็กโตท่องได้ — Claude ปรับ 10 พ.ย. 2026 ตามที่เจ้าของโปรเจกต์อนุมัติ)
const tens = { th: ['สิบสอง','สิบสาม','สิบสี่','สิบห้า','สิบหก','สิบเจ็ด','สิบแปด','สิบเก้า'], en: ['twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'] };
const words = { th: ['หก','เจ็ด','แปด','เก้า'], en: ['six','seven','eight','nine'] };
function question(previous = -1) { let n = Math.floor(Math.random() * 32); if (n === previous) n = (n + 1) % 32; return n; }
export function ParentGate({ onPass, onClose }: { onPass: () => void; onClose: () => void }) {
  const { pick, pickSub } = useDict();
  const [q, setQ] = useState(() => question());
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pass = useRef(onPass);
  const autoPassed = useRef(false);
  useEffect(() => { pass.current = onPass; });
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    if (Date.now() < passedUntil) { if (!autoPassed.current) { autoPassed.current = true; pass.current(); } return; }
    input.current?.focus();
    return () => previous?.focus();
  }, []);
  const a = Math.floor(q / 4), b = q % 4;
  const text = { th: `${tens.th[a]} คูณ ${words.th[b]}`, en: `${tens.en[a]} times ${words.en[b]}` };
  return <div className="ls-overlay ls-parent" onKeyDown={e => {
    e.stopPropagation();
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab') {
      const nodes = panel.current?.querySelectorAll<HTMLElement>('input,button');
      if (!nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }}><div ref={panel} className="ls-dialog" role="dialog" aria-modal="true" aria-labelledby="ls-parent-title">
    <h2 id="ls-parent-title">{pick(LS.gateTitle)}</h2>
    <p id="ls-question" className="ls-copy">{pick(text)}{pickSub(text) && <small lang="en">{pickSub(text)}</small>}</p>
    <form onSubmit={e => { e.preventDefault(); if (Number(answer) === (a + 12) * (b + 6)) { passedUntil = Date.now() + 600_000; onPass(); } else { setWrong(true); setAnswer(''); setQ(question(q)); input.current?.focus(); } }}>
      <label htmlFor="ls-answer">{pick(LS.answer)}</label><input ref={input} id="ls-answer" className="ls-input" inputMode="numeric" autoComplete="off" pattern="[0-9]*" value={answer} onChange={e => setAnswer(e.target.value)} aria-describedby="ls-question ls-error" />
      <p id="ls-error" role="status">{wrong ? pick(LS.wrong) : ''}</p>
      <div className="ls-actions"><button className="ls-button" type="submit">{pick(LS.submit)}</button><button className="ls-button" type="button" onClick={onClose}>{pick(LS.cancel)}</button></div>
    </form>
  </div></div>;
}
export function GatedAction({ children, action, className = 'ls-button' }: { children: ReactNode; action: () => void; className?: string }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" className={className} onClick={() => setOpen(true)}>{children}</button>{open && <ParentGate onClose={() => setOpen(false)} onPass={() => { setOpen(false); action(); }} />}</>;
}
