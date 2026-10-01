'use client';
import { GameImage as Image } from './GameImage';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';
import { BackLink } from '@/components/ui/BackLink';
import { gameAssets, type GameDefinition } from '../data/catalog';
import { gameProgress } from '../engine/progress';
import { completionStars } from '../engine/rules';
import { useGameAudio } from '../audio/useGameAudio';
import { GameIntro } from './GameIntro';
import { VoiceIntro } from './VoiceIntro';
import { Countdown } from './Countdown';
import { gamePresentation } from '../data/presentation';

/** onTap = เสียงตอบรับตอนแตะชิ้นส่วน กระดานไหนไม่ต้องการก็ไม่ต้องเรียก
 *  paused = กำลังนับถอยหลังก่อนเริ่ม — กระดานถูก inert อยู่แล้ว ใช้เฉพาะกระดานที่มีเวลาเดินเอง หรือฟังคีย์บอร์ดทั้งหน้า (เขาวงกตแสง) */
export type PlayProps = { slug: GameDefinition['slug']; level: number; paused: boolean; onProgress: (done: number, total: number) => void; onFeedback: (correct: boolean) => void; onComplete: () => void; onTap: () => void };
export function GameShell({ game, Board }: { game: GameDefinition; Board: ComponentType<PlayProps> }) {
  const theme = gamePresentation[game.slug];
  const levelCount = theme.levelCount ?? 3;
  const [status, setStatus] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [level, setLevel] = useState(1);
  const [session, setSession] = useState(0);
  const [progress, setProgress] = useState({ done: 0, total: 1 });
  const [feedback, setFeedback] = useState({ text: '', correct: true, key: 0 });
  const [savedStars, setSavedStars] = useState(0);
  // นับถอยหลัง 3 2 1 ทุกครั้งที่เริ่มเล่น ระหว่างนับกระดานกดไม่ได้ (inert)
  const [counting, setCounting] = useState(false);
  const speakAfterGo = useRef(false);
  const instructionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // ออกจากหน้าเล่น (ผ่านด่าน เลือกด่านใหม่) หรือออกจากเกม ยกเลิกเสียงคำสั่งที่ตั้งเวลาไว้
  useEffect(() => { if (status !== 'playing') clearTimeout(instructionTimer.current); }, [status]);
  useEffect(() => () => clearTimeout(instructionTimer.current), []);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const instructionHeading = useRef<HTMLHeadingElement>(null);
  const audio = useGameAudio();
  const play = audio.play;
  const onProgress = useCallback((done: number, total: number) => setProgress({ done, total }), []);
  const onTap = useCallback(() => play('uiClick'), [play]);
  const onFeedback = useCallback((correct: boolean) => { setFeedback(previous => ({ text: correct ? 'ถูกแล้ว! • Well done!' : 'ลองอีกครั้งนะ • Try again', correct, key: previous.key + 1 })); play(correct ? 'correct' : 'incorrect'); }, [play]);
  const onComplete = useCallback(() => { const saved = gameProgress.complete(game.slug, level, completionStars()); setSavedStars(saved.stars); setStatus('complete'); if (theme.ownVoice) audio.effect('levelComplete'); else play('levelComplete'); }, [game.slug, level, play, theme.ownVoice, audio]);
  useEffect(() => {
    if (status === 'complete') resultHeading.current?.focus();
    if (status === 'playing') instructionHeading.current?.focus({ preventScroll: true });
  }, [status, session]);
  // เกมแบบเส้นทาง (journey): ต่อจากด่านถัดจากที่ผ่านล่าสุด อ่าน localStorage หลัง mount กัน hydration ไม่ตรงกัน
  useEffect(() => {
    if (!theme.journey) return;
    // ด่านแรกที่ยังไม่ผ่าน (ข้อมูลเก่าจากสมัยเลือกด่านได้อาจผ่านด่าน 2 โดยยังไม่ผ่านด่าน 1) ผ่านครบแล้วเริ่มด่าน 1
    const done = gameProgress.read(game.slug).completedLevels;
    setLevel(Array.from({ length: levelCount }, (_, i) => i + 1).find(n => !done.includes(n)) ?? 1);
  }, [game.slug, theme.journey, levelCount]);
  const start = ({ speak = true } = {}) => { setProgress({ done: 0, total: 1 }); setFeedback({ text: '', correct: true, key: 0 }); setSession(s => s + 1); setStatus('playing'); setCounting(true); clearTimeout(instructionTimer.current); speakAfterGo.current = speak && !theme.ownVoice; };
  // "เริ่ม!" แล้วหุ่นพูด "บิสมิลลาฮ์ เริ่มกันเลย" (~1.8 วิ) รอจบก่อนค่อยอ่านคำสั่ง ไม่ให้เสียงพูดตัดกัน
  const onGo = useCallback(() => {
    setCounting(false);
    if (speakAfterGo.current) instructionTimer.current = setTimeout(() => play('voiceInstruction', game.instruction.th, `game-${game.slug}`), 1900);
  }, [play, game.instruction.th, game.slug]);
  return <main className="gc-world gc-focus" data-game={game.slug} data-status={status}><div className="gc-play-container">
    <header className="gc-game-header"><BackLink href="/games" labelTh="รวมเกม" labelEn="Game Hub" /><h1>{game.title.th}<small lang="en">{game.title.en}</small></h1>{/* ชื่อปุ่มคงที่ "เสียงเกม" แล้วให้ aria-pressed บอกสถานะ แบบเดียวกับปุ่มเสียงบนหัวเว็บ — จอแคบเหลือปุ่มกลมไอคอนลำโพง */}<button className="ui-pill ui-pill-sm-round gc-sound" onClick={audio.toggle} aria-pressed={audio.enabled} aria-label="เสียงเกม / Game sound"><span className="ui-disc"><SpeakerIcon on={audio.enabled} /></span><span className="ui-label hidden sm:block" aria-hidden="true">{audio.enabled ? 'เสียงเปิด' : 'เสียงปิด'}<small lang="en">{audio.enabled ? 'Sound on' : 'Sound off'}</small></span></button></header>
    {status === 'idle' ? theme.voiceIntro ? <VoiceIntro game={game} soundOn={audio.enabled} speechBroken={audio.speechBroken} onStart={() => start({ speak: false })} /> : <GameIntro game={game} level={level} onLevel={setLevel} onStart={start} soundOn={audio.enabled} onListen={() => play('voiceInstruction', game.instruction.th, `game-${game.slug}`)} /> : status === 'playing' ? <>
      <div className="gc-progress-row"><span className="gc-progress-level">ด่าน {level} <small lang="en">Level {level}</small></span><progress value={progress.done} max={progress.total} aria-label="ความคืบหน้าด่าน / Level progress" /><span>{progress.done} / {progress.total}</span><span className="gc-progress-reward" aria-hidden="true">★</span></div>
      <div className="gc-instruction"><Image className="gc-playing-guide" src={gameAssets.guide} width={90} height={100} alt="" /><h2 ref={instructionHeading} tabIndex={-1}>{game.instruction.th}<small lang="en">{game.instruction.en}</small></h2><button className="gc-button" onClick={() => play('voiceInstruction', game.instruction.th, `game-${game.slug}`)}>ฟังวิธีเล่น<small lang="en">Listen</small></button></div>
      <div className="gc-feedback" role="status" aria-live="polite"><span key={feedback.key} className={feedback.text ? feedback.correct ? 'gc-correct' : 'gc-retry' : ''}>{feedback.text || (theme.voiceIntro ? '' : 'พร้อมแล้ว ลองเลย! • You can do it!')}</span></div>
      <Countdown key={session} onGo={onGo} /><section className="gc-panel gc-board" aria-label={game.title.th} inert={counting}>{!theme.voiceIntro && <div className="gc-workbench-title"><span aria-hidden="true">✦</span><span>{theme.world.th}<small lang="en">{theme.world.en}</small></span><span aria-hidden="true">✦</span></div>}<Board key={`${game.slug}-${level}-${session}`} slug={game.slug} level={level} paused={counting} onProgress={onProgress} onFeedback={onFeedback} onComplete={onComplete} onTap={onTap} /></section>
      <div className="gc-bottom-controls">{levelCount > 1 && !theme.journey && <button className="gc-button" onClick={() => setStatus('idle')}>เลือกด่านใหม่<small lang="en">Choose level</small></button>}<button className="gc-button" onClick={() => start()}>เริ่มใหม่<small lang="en">Restart</small></button></div>
    </> : <section className="gc-panel gc-result"><div className="gc-celebration" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} style={{ left: `${10 + i * 10}%`, animationDelay: `${i * 65}ms` }}>✦</span>)}</div><Image src={gameAssets.celebration} width={170} height={190} alt="หุ่นยนต์ร่วมยินดี" /><h2 tabIndex={-1} ref={resultHeading}>เก่งมาก ผ่านด่านแล้ว!</h2><p lang="en">You did it! Level {level} complete</p><p className="gc-result-stars" aria-label="ได้รับ 3 ดาว">★ ★ ★</p><p>สะสมเกมนี้ {savedStars} ดาว <span lang="en">• {savedStars} stars collected</span></p><div className="gc-result-actions">{/* journey: ไปด่านต่อไปเล่นทันที ไม่กลับหน้าเลือกด่าน / ด่านสุดท้าย "เล่นอีกครั้ง" เริ่มเส้นทางใหม่จากด่านแรก */}{level < levelCount && <button className="gc-button gc-primary" onClick={() => { setLevel(l => l + 1); if (theme.journey) start(); else setStatus('idle'); }}>ด่านต่อไป<small lang="en">Next level →</small></button>}<button className="gc-button" onClick={() => { if (theme.journey && level >= levelCount) setLevel(1); start(); }}>เล่นอีกครั้ง<small lang="en">Play again</small></button><Link className="gc-button" href="/games">เลือกเกมใหม่<small lang="en">More games</small></Link></div></section>}
    {audio.speechBroken && <p className="gc-audio-note">อุปกรณ์นี้ไม่มีเสียงอ่าน ใช้ภาพและคำแนะนำบนหน้าจอได้เลย <span lang="en">Voice unavailable. Follow the pictures.</span></p>}
  </div></main>;
}
