'use client';
import { useEffect, useRef, useState } from 'react';
import { useSound } from '@/components/sound/SoundProvider';
import { useSfx, type SfxSet } from '../audio/useSfx';

/* เสียงติ๊กและเสียงพุ่ง (scripts/make-game-sfx.mjs — ElevenLabs, no music) */
const SFX: SfxSet<'tick' | 'go'> = {
  tick: { file: '/audio/sfx/countdown-tick.mp3', volume: 0.45 },
  go: { file: '/audio/sfx/countdown-go.mp3', volume: 0.6 },
};
/* เสียงหุ่นยนต์พูดตัวเลข (scripts/make-game-voice.mjs) */
const STEPS = [
  { n: 3, key: 'count-3', th: 'สาม' }, { n: 2, key: 'count-2', th: 'สอง' }, { n: 1, key: 'count-1', th: 'หนึ่ง' },
] as const;
const GO = { key: 'count-go', th: 'บิสมิลลาฮ์ เริ่มกันเลย' };
const STEP_MS = 1000;
/** ป้าย "เริ่ม!" ค้างอยู่เท่านี้หลังเริ่มเล่นได้แล้ว แล้วหายไปเอง */
const GO_MS = 800;

/*
  นับถอยหลัง 3 2 1 ก่อนเริ่มเล่นทุกเกม — ตัวเลขใหญ่กลางจอ + เสียงหุ่นพูด + เสียงติ๊ก จบด้วยป้าย "เริ่ม!"
  GameShell ใส่ key ต่อรอบการเล่น ทุกครั้งที่เริ่ม เริ่มใหม่ หรือไปด่านต่อไปจึงนับใหม่
  onGo = ตอนขึ้นคำว่า "เริ่ม!" (เล่นได้แล้ว) — ระหว่างนับ GameShell ทำให้กระดานกดไม่ได้

  ไม่บังการแตะส่วนอื่นของหน้า (pointer-events: none) และไม่กะพริบ — ตัวเลขแต่ละตัวเด้งเข้าครั้งเดียว
*/
export function Countdown({ onGo }: { onGo: () => void }) {
  const { speak } = useSound();
  const sfx = useSfx(SFX);
  const [shown, setShown] = useState<number | null>(STEPS[0].n);
  const latest = useRef({ onGo, speak, sfx });
  useEffect(() => { latest.current = { onGo, speak, sfx }; });

  useEffect(() => {
    const timers = STEPS.map((step, i) => setTimeout(() => {
      setShown(step.n);
      latest.current.sfx('tick');
      latest.current.speak(step.th, step.key);
    }, i * STEP_MS));
    timers.push(setTimeout(() => {
      setShown(0);
      latest.current.sfx('go');
      latest.current.speak(GO.th, GO.key);
      latest.current.onGo();
    }, STEPS.length * STEP_MS));
    timers.push(setTimeout(() => setShown(null), STEPS.length * STEP_MS + GO_MS));
    return () => timers.forEach(clearTimeout);
  }, []);

  return <>
    {shown !== null && <div className="gc-countdown" aria-hidden="true">
      {/* key ต่อตัวเลข ให้ animation เด้งเข้าใหม่ทุกครั้งที่เปลี่ยน */}
      {shown > 0 ? <span key={shown} className="gc-count-badge"><span className="gc-count-num">{shown}</span></span>
        : <span key="go" className="gc-count-go">เริ่ม!<small lang="en">Go!</small></span>}
    </div>}
    <p className="sr-only" role="status" aria-live="assertive">{shown === null ? '' : shown > 0 ? String(shown) : 'เริ่ม! Go!'}</p>
  </>;
}
