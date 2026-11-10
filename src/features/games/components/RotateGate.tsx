'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { BackLink } from '@/components/ui/BackLink';
import { useSound } from '@/components/sound/SoundProvider';
import { useDict } from '@/i18n/LocaleProvider';
import { GameImage as Image } from './GameImage';
import { canEnterFullscreen, enterGameFullscreen } from '../engine/fullscreen';

const PORTRAIT_TOUCH = '(pointer: coarse) and (orientation: portrait)';
const subscribe = (notify: () => void) => { const media = window.matchMedia(PORTRAIT_TOUCH); media.addEventListener('change', notify); return () => media.removeEventListener('change', notify); };

/** จอสัมผัสที่ยังตั้งอยู่ ต้องหมุนก่อนเล่น PC (เมาส์) ไม่เกี่ยว */
export function usePortraitGate(on: boolean) {
  return useSyncExternalStore(subscribe, () => on && window.matchMedia(PORTRAIT_TOUCH).matches, () => false);
}

// รอให้เครื่องล็อกแนวนอนเสร็จก่อน จอที่หมุนเองได้จะได้ไม่มีเสียงบอกให้หมุน
const VOICE_DELAY_MS = 900;

/*
  บังหน้าเกมจนกว่าจะเป็นแนวนอน — iPhone ล็อกจอจากหน้าเว็บไม่ได้ หรือเด็กออกจากเต็มจอแล้วถือมือถือตั้งไว้
  ปุ่มเปิดเต็มจอมีเฉพาะเครื่องที่รองรับ กดแล้วเครื่องหมุนให้เอง (Android)
*/
export function RotateGate({ back, onFullscreen = enterGameFullscreen }: { back?: ReactNode; onFullscreen?: () => void } = {}) {
  const { t, sub } = useDict();
  const { speak } = useSound();
  const say = useRef({ speak, text: t.games.rotate.title });
  useEffect(() => { say.current = { speak, text: t.games.rotate.title }; });
  useEffect(() => {
    const timer = setTimeout(() => say.current.speak(say.current.text, 'rotate-phone'), VOICE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);
  return <section className="gc-rotate" role="dialog" aria-modal="true" aria-labelledby="gc-rotate-title">
    <div className="gc-rotate-robot" aria-hidden="true">
      {(['phone-portrait', 'phone-landscape'] as const).map(frame => <Image key={frame} src={`/Character/greet/${frame}.webp`} alt="" width={640} height={640} sizes="200px" className={`gc-rotate-${frame}`} />)}
    </div>
    <h2 id="gc-rotate-title">{t.games.rotate.title}{sub && <small lang="en">{sub.games.rotate.title}</small>}</h2>
    <div className="gc-rotate-actions">
      {canEnterFullscreen() && <button type="button" className="gc-button gc-primary" onClick={onFullscreen}>{t.games.rotate.fullscreen}{sub && <small lang="en">{sub.games.rotate.fullscreen}</small>}</button>}
      {back ?? <BackLink href="/games" label={{ th: t.games.shell.hub, en: sub?.games.shell.hub ?? t.games.shell.hub }} />}
    </div>
  </section>;
}
