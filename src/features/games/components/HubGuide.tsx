'use client';

import { useEffect, useRef, useState } from 'react';
import { GameImage as Image } from './GameImage';
import { useRunSound } from '../audio/useRunSound';
import { getSoundSnapshot } from '@/lib/soundStore';
import { ReplayIcon } from '@/components/icons/ReplayIcon';
import { PauseIcon } from '@/components/icons/PauseIcon';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';

const RUN_FRAMES = [1, 2, 3, 4, 5, 6];
/* วิ่งมาถึงกลางจอแล้วหันหน้าตรง โบกมือทักทาย (wave-1/2 สลับกัน) แล้วหยุดยืนถือจอยเกม (stand)
   ภาพจาก Codex ยึดหุ่นตัวเดิม (output/robot-wave/BRIEF.md) ตัวหุ่นอยู่กึ่งกลางภาพ จึงหยุดตรงกลางจอพอดี */
const GREET_FRAMES = ['wave-1', 'wave-2', 'stand'];

export function HubGuide() {
  const runSound = useRunSound();
  const stopRunSound = runSound.stop;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'ended'>('idle');
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const loadedFrames = useRef(new Set<string>());
  const frameLoaded = (id: string) => {
    loadedFrames.current.add(id);
    if (loadedFrames.current.size === RUN_FRAMES.length + GREET_FRAMES.length) setReady(true);
  };
  const [run, setRun] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    const pauseWhenHidden = () => { if (document.hidden) audio?.pause(); };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => {
      audio?.pause();
      document.removeEventListener('visibilitychange', pauseWhenHidden);
    };
  }, []);

  // หุ่นยนต์หยุดนิ่งแล้วพูดแนะนำทันที
  // ถ้าเบราว์เซอร์บล็อกเสียงอัตโนมัติ (เปิดหน้าตรงๆ ยังไม่เคยแตะหน้าจอ) ให้พูดตอนแตะ/กดแป้นครั้งแรกแทน
  // ไม่นับการแตะปุ่มมุมขวาบน เพราะปุ่มลำโพงเล่นเสียงเองอยู่แล้ว ถ้านับซ้ำจะเล่นแล้วถูกหยุดทันที
  const cancelPendingVoice = useRef<(() => void) | null>(null);
  // เด็กกดเกาะเกมแล้ว = กำลังออกจากหน้านี้ ห้ามเริ่มพูดอีก (เช่น หุ่นวิ่งถึงพอดีระหว่างรอเปิดหน้าเกม)
  const leaving = useRef(false);
  const autoSpeak = () => {
    const audio = audioRef.current;
    if (leaving.current || !audio || !audio.paused || !getSoundSnapshot() || document.hidden) return;
    audio.currentTime = 0;
    void audio.play().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === 'NotAllowedError')) return;
      cancelPendingVoice.current?.();
      // pointerup/keydown นับเป็นการโต้ตอบของผู้ใช้ เบราว์เซอร์จึงยอมให้เล่นเสียง
      const retry = (event: Event) => {
        // ไม่นับการแตะปุ่มลำโพง (เล่นเสียงเองอยู่แล้ว) และการแตะเกาะเกม (กำลังจะเข้าเกม ไม่ใช่ขอฟัง)
        if (event.target instanceof Element && event.target.closest('.gc-hub-guide-controls, .gc-grid a')) return;
        cancel();
        autoSpeak();
      };
      const cancel = () => {
        window.removeEventListener('pointerup', retry, true);
        window.removeEventListener('keydown', retry, true);
        cancelPendingVoice.current = null;
      };
      cancelPendingVoice.current = cancel;
      window.addEventListener('pointerup', retry, true);
      window.addEventListener('keydown', retry, true);
    });
  };
  useEffect(() => () => cancelPendingVoice.current?.(), []);

  // กดเกาะเกม: ตัดเสียงหุ่น (เสียงพูดแนะนำ + เสียงวิ่ง) ทันที ไม่ให้ทับเสียงชื่อเกาะหรือเสียงในเกม
  // pointerdown ตัดเร็วที่สุดตอนนิ้วแตะ ส่วน click ครอบการกด Enter ด้วยคีย์บอร์ด
  useEffect(() => {
    const silence = (event: Event) => {
      if (!(event.target instanceof Element) || !event.target.closest('.gc-grid a')) return;
      leaving.current = true;
      cancelPendingVoice.current?.();
      audioRef.current?.pause();
      stopRunSound();
    };
    document.addEventListener('pointerdown', silence, true);
    document.addEventListener('click', silence, true);
    return () => {
      document.removeEventListener('pointerdown', silence, true);
      document.removeEventListener('click', silence, true);
    };
  }, [stopRunSound]);

  // ปิดการเคลื่อนไหวไว้ = ไม่มีแอนิเมชันให้รอ พูดเลยเมื่อพร้อม
  useEffect(() => {
    if (ready && runSound.ready && window.matchMedia('(prefers-reduced-motion: reduce)').matches) autoSpeak();
  }, [ready, runSound.ready]);

  const toggleVoice = async () => {
    cancelPendingVoice.current?.();
    runSound.stop();
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    setError(false);
    if (audio.ended) audio.currentTime = 0;
    try { await audio.play(); } catch { setError(true); }
  };

  const label = status === 'playing' ? ['พักเสียง', 'Pause']
    : status === 'paused' ? ['ฟังต่อ', 'Continue']
    : status === 'ended' ? ['ฟังอีกครั้ง', 'Listen again']
    : ['ฟังเพื่อนหุ่นยนต์แนะนำเกม', 'Meet your game guide'];

  return <header className="gc-hub-guide" aria-label="หุ่นยนต์แนะนำเกม / Your game guide">
    <h1 className="sr-only">โลกแห่งเกม / A world of little adventures</h1>
    <div className="gc-hub-guide-stage" role="img" aria-label="หุ่นยนต์ถือจอยเกม วิ่งตีโค้งจากไกลเข้ามา โบกมือทักทาย แล้วยืนหน้าตรงกลางจอ">
      <div key={run} className="gc-hub-guide-arrival" data-ready={ready && runSound.ready} aria-hidden="true"
        onAnimationStart={event => {
          if (event.target === event.currentTarget && event.animationName === 'gc-guide-curve') runSound.play();
        }}
        onAnimationEnd={event => {
          if (event.target === event.currentTarget && event.animationName === 'gc-guide-curve') autoSpeak();
        }}>
        <span className="gc-run-dust"><i /><i /><i /></span>
        {RUN_FRAMES.map(frame => <Image key={frame}
          className={`gc-hub-guide-robot gc-run-frame gc-run-frame-${frame}`}
          src={`/Character/run/run-0${frame}.webp`} width={640} height={640}
          alt="" unoptimized loading="eager" onLoad={() => frameLoaded(`run-${frame}`)} />)}
        {GREET_FRAMES.map(name => <Image key={name}
          className={`gc-hub-guide-robot gc-greet gc-greet-${name}`}
          src={`/Character/greet/${name}.webp`} width={640} height={640}
          alt="" unoptimized loading="eager" onLoad={() => frameLoaded(name)} />)}
      </div>
    </div>
    {/* ปุ่มไอคอนล้วน ข้อความอยู่ใน aria-label และ title (ไทยนำ อังกฤษรอง) */}
    <div className="gc-hub-guide-controls">
      <button type="button" className="gc-hub-icon-btn motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
        aria-label="ดูหุ่นยนต์วิ่งอีกครั้ง / Replay arrival" title="ดูหุ่นยนต์วิ่งอีกครั้ง / Replay arrival" onClick={() => {
          audioRef.current?.pause();
          runSound.stop();
          runSound.unlock();
          setRun(value => value + 1);
        }}>
        <ReplayIcon className="h-8 w-8" />
      </button>
      <button type="button" className="gc-hub-icon-btn gc-hub-icon-btn-primary motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
        onClick={() => void toggleVoice()} aria-controls="gc-hub-voice"
        aria-label={`${label[0]} / ${label[1]}`} title={`${label[0]} / ${label[1]}`} data-error={error || undefined}>
        {status === 'playing' ? <PauseIcon className="h-8 w-8" /> : <SpeakerIcon className="h-9 w-9" />}
      </button>
    </div>
    <audio id="gc-hub-voice" ref={audioRef} src="/audio/th/hub-intro.mp3" preload="auto"
      onPlay={() => setStatus('playing')}
      onPause={() => { if (!audioRef.current?.ended) setStatus('paused'); }}
      onEnded={() => setStatus('ended')} onError={() => setError(true)} />
    {/* สถานะให้ screen reader อ่าน ส่วนบนจอบอกด้วยไอคอนบนปุ่มแทน
        ยกเว้นตอนเปิดเสียงไม่ได้ ต้องเห็นเป็นข้อความ ไม่งั้นเด็กกดแล้วเงียบโดยไม่รู้สาเหตุ */}
    <p className={error ? 'gc-hub-guide-status' : 'sr-only'} role="status">
      {error ? <>เปิดเสียงไม่ได้ ลองแตะอีกครั้งนะ <span lang="en">Unable to play. Please try again.</span></>
        : status === 'playing' ? <>กำลังแนะนำเกม… <span lang="en">Your guide is speaking…</span></>
        : null}
    </p>
  </header>;
}
