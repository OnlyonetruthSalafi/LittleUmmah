'use client';

import { useEffect, useRef, useState } from 'react';
import { GameImage as Image } from './GameImage';
import { useRunSound } from '../audio/useRunSound';

export function HubGuide() {
  const runSound = useRunSound();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'ended'>('idle');
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const loadedFrames = useRef(new Set<number>());
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

  const toggleVoice = async () => {
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
    <div className="gc-hub-guide-stage" role="img" aria-label="หุ่นยนต์ถือจอยเกม วิ่งตีโค้งจากไกลเข้ามาทักทาย">
      <div key={run} className="gc-hub-guide-arrival" data-ready={ready && runSound.ready} aria-hidden="true"
        onAnimationStart={event => {
          if (event.target === event.currentTarget && event.animationName === 'gc-guide-curve') runSound.play();
        }}>
        <span className="gc-run-dust"><i /><i /><i /></span>
        {[1, 2, 3, 4, 5, 6].map(frame => <Image key={frame}
          className={`gc-hub-guide-robot gc-run-frame gc-run-frame-${frame}`}
          src={`/Character/run/run-0${frame}.webp`} width={640} height={640}
          alt="" unoptimized loading="eager" onLoad={() => {
            loadedFrames.current.add(frame);
            if (loadedFrames.current.size === 6) setReady(true);
          }} />)}
      </div>
    </div>
    <button type="button" className="gc-button gc-hub-guide-replay" onClick={() => {
      audioRef.current?.pause();
      runSound.stop();
      runSound.unlock();
      setRun(value => value + 1);
    }}>
      ดูวิ่งอีกครั้ง<small lang="en">Replay arrival</small>
    </button>
    <button type="button" className="gc-button gc-hub-guide-listen motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
      onClick={() => void toggleVoice()} aria-controls="gc-hub-voice">
      <span>{label[0]}</span><small lang="en">{label[1]}</small>
    </button>
    <audio id="gc-hub-voice" ref={audioRef} src="/games/voiceover/แนะนำเกม.mp3" preload="none"
      onPlay={() => setStatus('playing')}
      onPause={() => { if (!audioRef.current?.ended) setStatus('paused'); }}
      onEnded={() => setStatus('ended')} onError={() => setError(true)} />
    <p className="gc-hub-guide-status" role="status">
      {error ? <>เปิดเสียงไม่ได้ ลองแตะอีกครั้งนะ <span lang="en">Unable to play. Please try again.</span></>
        : status === 'playing' ? <>กำลังแนะนำเกม… <span lang="en">Your guide is speaking…</span></>
        : <>เลือกเกาะด้านล่างเพื่อเล่นได้เลย <span lang="en">Choose an island below to play.</span></>}
    </p>
  </header>;
}
