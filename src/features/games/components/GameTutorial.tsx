'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { HandTapIcon } from '@/components/icons/HandTapIcon';
import { useDict, useLocale } from '@/i18n/LocaleProvider';
import { playNarration, stopAllSpeech } from '@/lib/speech';
import { GameImage as Image } from './GameImage';
import type { TutorialStep } from '../data/gameTutorials';
import { LM_ACTOR_ART, LM_THEME_ART } from '../data/lightMazeArt';

/*
  สอนเล่นทีละจังหวะก่อนนับถอยหลัง — หุ่นยนต์พูดหนึ่งคลิปต่อจังหวะ พูดจบไปจังหวะถัดไป จบจังหวะสุดท้ายเริ่มเกมเอง
  ปุ่มข้ามกดได้ตั้งแต่วินาทีแรก เล่นเสียงไม่ได้หรือปิดเสียงอยู่ใช้เวลาแทน
  paused = กำลังรอหมุนจอ ยังไม่เริ่มพูด
*/
export function GameTutorial({ steps, soundOn, paused, onDone }: {
  steps: readonly TutorialStep[]; soundOn: boolean; paused: boolean; onDone: () => void;
}) {
  const { t, sub, pick, pickSub } = useDict();
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const done = useRef(onDone);
  useEffect(() => { done.current = onDone; });

  useEffect(() => {
    if (paused) return;
    const current = steps[step];
    let timer = 0;
    const next = () => { if (step + 1 < steps.length) setStep(step + 1); else done.current(); };
    const timed = () => { timer = window.setTimeout(next, current.ms); };
    let stopAudio = () => {};
    if (soundOn) stopAudio = playNarration(`/audio/${locale}/${current.clip}.mp3`, { onEnded: () => { timer = window.setTimeout(next, 700); }, onStopped: timed, onFail: timed });
    else timed();
    return () => { window.clearTimeout(timer); stopAudio(); stopAllSpeech(); };
  }, [step, steps, soundOn, paused, locale]);

  const current = steps[step];
  return <section className="lmt" aria-labelledby="lmt-title">
    <LightMazeDemo step={step} />
    <div className="lmt-side">
      <p className="lmt-dots" aria-hidden="true">{steps.map((item, i) => <span key={item.clip} data-on={i <= step || undefined} />)}</p>
      <h2 id="lmt-title" className="lmt-text" role="status">{pick(current.text)}{sub && <small lang="en">{pickSub(current.text)!}</small>}</h2>
      <button type="button" className="gc-button lmt-skip" onClick={onDone}>{t.games.tutorial.skip}{sub && <small lang="en">{sub.games.tutorial.skip}</small>}</button>
    </div>
  </section>;
}

/* ทางเดินบนผิวเกาะ public/games/light-maze/v2/island-neon.webp ขนานขอบบนซ้าย→ขวาล่างของเกาะ เปอร์เซ็นต์ของภาพ */
const onPath = (at: number) => ({ '--x': `${34.7 + 31.3 * at}%`, '--y': `${26.7 + 21.8 * at}%` }) as CSSProperties;
const BEADS = [0.35, 0.5, 0.65];

/** ฉากสาธิตด้วยภาพจริงของเกม: จังหวะ 1 กดปุ่มแล้วหุ่นเดิน · จังหวะ 2 เก็บเม็ดแสง · จังหวะ 3 เพื่อนหุ่นขวางทาง หุ่นเลี้ยวหลบ */
function LightMazeDemo({ step }: { step: number }) {
  const theme = LM_THEME_ART('neon');
  const orb = LM_ACTOR_ART('orb'), friend = LM_ACTOR_ART('blue');
  return <div className="lmt-scene" data-step={step} aria-hidden="true">
    <div className="lmt-island">
      <Image src={theme.island} alt="" width={1400} height={963} sizes="(max-width: 899px) 60vw, 560px" />
      {BEADS.map((at, i) => <span key={at} className="lmt-bead" style={{ ...onPath(at), '--i': i } as CSSProperties} />)}
      {step === 2 && <Image src={friend.rest ?? friend.se} alt="" width={200} height={200} sizes="90px" className="lmt-friend" style={onPath(1)} />}
      <Image key={step} src={step === 2 ? orb.ne : orb.se} alt="" width={200} height={200} sizes="90px" className="lmt-orb" />
    </div>
    <span className="lmt-pad">{[-63.4, 63.4, -116.6, 116.6].map((rotate, i) => <i key={rotate} data-press={(i === 3 && step < 2) || undefined}><svg viewBox="0 0 24 24" focusable="false" style={{ transform: `rotate(${rotate}deg)` }}><path d="M12 2 20.5 11.5H15V22H9V11.5H3.5z" /></svg></i>)}{step < 2 && <HandTapIcon className="lmt-hand" />}</span>
  </div>;
}
