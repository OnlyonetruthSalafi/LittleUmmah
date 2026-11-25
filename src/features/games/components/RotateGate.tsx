'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { FullscreenIcon } from '@/components/icons/FullscreenIcon';
import { BackLink } from '@/components/ui/BackLink';
import { useSound } from '@/components/sound/SoundProvider';
import type { Text } from '@/i18n/config';
import { useDict } from '@/i18n/LocaleProvider';
import { GameImage as Image } from './GameImage';
import { canEnterFullscreen, enterGameFullscreen } from '../engine/fullscreen';

const PORTRAIT_TOUCH = '(pointer: coarse) and (orientation: portrait)';
const portraitSubscription = (query: string) => (notify: () => void) => { const media = window.matchMedia(query); media.addEventListener('change', notify); return () => media.removeEventListener('change', notify); };

// Subscribe to the same media query used to decide whether to pause the game.
const subscribeTouch = portraitSubscription(PORTRAIT_TOUCH);
const subscribePortrait = portraitSubscription('(orientation: portrait)');

export function usePortraitGate(on: boolean, everyPortrait = false) {
  return useSyncExternalStore(everyPortrait ? subscribePortrait : subscribeTouch, () => on && window.matchMedia(everyPortrait ? '(orientation: portrait)' : PORTRAIT_TOUCH).matches, () => false);
}

// รอให้เครื่องล็อกแนวนอนเสร็จก่อน จอที่หมุนเองได้จะได้ไม่มีเสียงบอกให้หมุน
const VOICE_DELAY_MS = 900;

/*
  บังหน้าเกมจนกว่าจะเป็นแนวนอน — iPhone ล็อกจอจากหน้าเว็บไม่ได้ หรือเด็กออกจากเต็มจอแล้วถือมือถือตั้งไว้
  ปุ่มเปิดเต็มจอมีเฉพาะเครื่องที่รองรับ กดแล้วเครื่องหมุนให้เอง (Android)
*/
export function RotateGate({ back, instruction, expanded, onFullscreen = enterGameFullscreen }: { back?: ReactNode; instruction?: Text; expanded?: boolean; onFullscreen?: () => void } = {}) {
  const { t, sub, pick } = useDict();
  const { speak } = useSound();
  const say = useRef({ speak, text: t.games.rotate.title });
  useEffect(() => { say.current = { speak, text: t.games.rotate.title }; });
  useEffect(() => {
    const timer = setTimeout(() => say.current.speak(say.current.text, 'rotate-phone'), VOICE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);
  const label = expanded ? 'exitFullscreen' : 'fullscreen';
  return <section className="gc-rotate" role="dialog" aria-modal="true" aria-labelledby="gc-rotate-title">
    <div className="gc-rotate-robot" aria-hidden="true">
      {(['phone-portrait', 'phone-landscape'] as const).map(frame => <Image key={frame} src={`/Character/greet/${frame}.webp`} alt="" width={640} height={640} sizes="200px" className={`gc-rotate-${frame}`} />)}
    </div>
    <h2 id="gc-rotate-title">{t.games.rotate.title}{sub && <small lang="en">{sub.games.rotate.title}</small>}</h2>
    {instruction && <p className="harbor-rotate-help">{pick(instruction)}{sub && <small lang="en">{instruction.en}</small>}</p>}
    <div className="gc-rotate-actions">
      {(expanded !== undefined || canEnterFullscreen()) && <button type="button" className="gc-button gc-primary" onClick={onFullscreen}>{expanded !== undefined && <FullscreenIcon active={expanded} width={24} height={24} />}{t.games.rotate[label]}{sub && <small lang="en">{sub.games.rotate[label]}</small>}</button>}
      {back ?? <BackLink href="/games" label={{ th: t.games.shell.hub, en: sub?.games.shell.hub ?? t.games.shell.hub }} />}
    </div>
  </section>;
}
