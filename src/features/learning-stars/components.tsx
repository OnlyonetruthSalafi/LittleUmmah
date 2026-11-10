'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LocaleLink, useDict } from '@/i18n/LocaleProvider';
import type { Text } from '@/i18n/config';
import { LearningStarIcon } from '@/components/icons/LearningStarIcon';
import { GatedAction, ParentGate } from '@/components/parents/ParentGate';
import { LS } from './content';
import { giveStars, trackPlayTime, unlockTime, useLearningState, useNotice } from './store';
import { starsOut, timeLocked } from './model';
import { queueVoice } from './voice';
import { CATEGORIES } from '@/lib/categories';
import './learning-stars.css';

export function Copy({ text }: { text: Text }) { const { pick, pickSub } = useDict(); return <span className="ls-copy">{pick(text)}{pickSub(text) && <small lang="en">{pickSub(text)}</small>}</span>; }
export function LearningBalance({ intro = false }: { intro?: boolean }) {
  const s = useLearningState();
  const kind = !s.available || !s.settings.starsEnabled ? 'unlimited' : s.stars.activeRound ? 'credit' : s.stars.freeDay !== s.stars.earnedDay ? 'free' : 'star';
  useEffect(() => { if (intro && kind === 'free') return queueVoice('ls-free'); }, [intro, kind]);
  return <div className="ls-badge" data-ls-balance={s.stars.balance}><LearningStarIcon /><Copy text={LS.name} /><strong>{s.stars.balance} / 20</strong>{intro && <Copy text={LS[kind]} />}</div>;
}
export function LearningNotice() { const notice = useNotice(); return notice && <div role="status" className="ls-badge ls-notice" data-ls-notice={notice}><LearningStarIcon /><Copy text={LS[notice]} /></div>; }
export function LockScreen({ reason, onClose }: { reason: 'time' | 'stars'; onClose?: () => void }) {
  const [gate, setGate] = useState(false);
  const [parent, setParent] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { heading.current?.focus(); return queueVoice(reason === 'time' ? 'time-up' : 'ls-empty'); }, [reason]);
  // ปิดหน้าล็อกแล้วคืนโฟกัสเข้าเกม (inert ถูกถอดใน render เดียวกัน จึงรอหนึ่งเฟรม)
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => { requestAnimationFrame(() => {
      if (document.activeElement && document.activeElement !== document.body) return;
      const target = previous?.isConnected && previous !== document.body && !previous.closest('[inert]') ? previous
        : document.querySelector<HTMLElement>('main [tabindex="-1"]:not([inert] *), main button:not([disabled]):not([inert] *)');
      target?.focus({ preventScroll: true });
    }); };
  }, []);
  const action = (fn: () => void) => { fn(); onClose?.(); };
  return <><div className="ls-overlay" data-ls-lock={reason} onKeyDown={e => {
    if (e.key !== 'Tab') return;
    const nodes = panel.current?.querySelectorAll<HTMLElement>('button,a');
    if (!nodes?.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }}><div ref={panel} className={`ls-dialog${parent ? ' ls-parent' : ''}`} role="dialog" aria-modal="true" aria-labelledby="ls-lock-title" inert={gate}>
    <Image className="ls-robot" src="/Character/read.webp" width={160} height={160} alt="" />
    <h2 id="ls-lock-title" ref={heading} tabIndex={-1}><Copy text={reason === 'time' ? LS.time : LS.empty} /></h2>
    <p><Copy text={reason === 'time' ? LS.timeHelp : LS.emptyHelp} /></p>
    <LearnChoices /><div className="ls-actions"><button className="ls-button" onClick={() => setGate(true)}><Copy text={LS.parents} /></button></div>
    {parent && <div className="ls-actions">{reason === 'stars' ? <><GatedAction action={() => action(() => giveStars(1))}><Copy text={LS.addOne} /></GatedAction><GatedAction action={() => action(() => giveStars(3))}><Copy text={LS.addThree} /></GatedAction></> : <>{([15,30,'day'] as const).map(n => <GatedAction key={n} action={() => action(() => unlockTime(n))}><Copy text={n === 15 ? LS.add15 : n === 30 ? LS.add30 : LS.day} /></GatedAction>)}</>}<LocaleLink href="/parents/settings" className="ls-button"><Copy text={LS.settings} /></LocaleLink></div>}
  </div></div>{gate && <ParentGate onClose={() => setGate(false)} onPass={() => { setGate(false); setParent(true); }} />}</>;
}
/** ปลายทางปุ่ม "ไปเรียนเก็บดาว" / "ไปเกาะเรียนรู้" ทุกจุดใช้ค่าเดียวกัน */
export const LEARN_HREF = '/'; // หน้าแรก: โซนเกาะเรียนรู้อยู่บนสุด
/** ให้เด็กเลือกเกาะเรียนรู้เองได้ 5 เกาะ (ภาพเกาะเป็นภาพตกแต่ง alt="" เพราะชื่อเกาะเป็นข้อความอยู่แล้ว) */
// ชื่อสั้นในกล่องเล็ก (ชื่อเต็มยาวจนคำไทยถูกตัดกลางคำบนจอ 360px)
const SHORT: Record<string, Text> = { 'faith-basics': { th: 'อิสลาม', en: 'Islam' }, moral: { th: 'มารยาท', en: 'Manners' }, stories: { th: 'เรื่องเล่า', en: 'Stories' }, explore: { th: 'สำรวจโลก', en: 'Explore' }, arabic: { th: 'เรียนภาษา', en: 'Languages' } };
const LEARN_ISLANDS = ['moral', 'stories', 'explore', 'arabic', 'faith-basics'].map(slug => ({ ...CATEGORIES.find(c => c.slug === slug)!, name: SHORT[slug] }));
export function LearnChoices() {
  const { pick } = useDict();
  return <nav className="ls-learn" aria-label={pick(LS.timeLearn)}>{LEARN_ISLANDS.map(c => <LocaleLink key={c.slug} href={c.href} className="ls-learn-tile"><Image src={c.image} width={64} height={64} alt="" /><Copy text={c.name} /></LocaleLink>)}</nav>;
}
export function useStarsOut() { return starsOut(useLearningState()); }
/** ป้ายระหว่างเล่นเมื่อรอบนี้ใช้ดาวดวงสุดท้าย — ไม่บังเกม ไม่กระพริบ */
export function LastStarBadge() { return <div role="status" className="ls-badge ls-last" data-ls-last><LearningStarIcon /><Copy text={LS.last} /></div>; }
/** หน้าผ่านด่านเมื่อดาวหมด: บอกก่อนว่าต้องไปเรียนเก็บดาว แทนปุ่มด่านต่อไป */
export function StarsOutPanel() {
  return <div className="ls-out" data-ls-out><p className="ls-out-title"><LearningStarIcon /><Copy text={LS.empty} /></p><p><Copy text={LS.emptyHelp} /></p><LearnChoices /></div>;
}
/** แถบหัวเกาะเกม: ดาวหมด → ต้องไปเรียนก่อน, เหลือ 1 → บอกจำนวน */
export function HubStarsHint() {
  const s = useLearningState();
  const out = starsOut(s);
  if (!s.available || !s.settings.starsEnabled) return null;
  if (out) return <div className="ls-badge ls-hub-hint" data-ls-hub="empty"><LearningStarIcon /><Copy text={LS.hubEmpty} /><LocaleLink href={LEARN_HREF} className="ls-button"><Copy text={LS.learn} /></LocaleLink></div>;
  if (s.stars.balance === 1 && !s.stars.activeRound) return <div className="ls-badge ls-hub-hint" data-ls-hub="one"><LearningStarIcon /><Copy text={LS.hubOne} /></div>;
  return null;
}
export function usePlayLimit(playing = false) {
  const s = useLearningState();
  useEffect(() => trackPlayTime(), []);
  return timeLocked(s, playing);
}
export function useBlockedReason(reason: 'time' | 'stars' | undefined) {
  const s = useLearningState();
  if (!s.available) return undefined;
  if (reason === 'time') return timeLocked(s) ? reason : undefined;
  if (reason === 'stars' && s.settings.starsEnabled && !s.stars.activeRound && s.stars.balance === 0 && s.stars.freeDay === s.stars.earnedDay) return reason;
  return undefined;
}
export function PlayArea({ children }: { children: ReactNode }) {
  const locked = usePlayLimit();
  return <><div inert={locked}>{children}</div><LearningNotice />{locked && <LockScreen reason="time" />}</>;
}
