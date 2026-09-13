'use client';
import { GameImage as Image } from './GameImage';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';
import { gameAssets, type GameDefinition } from '../data/catalog';
import { gameProgress } from '../engine/progress';
import { completionStars } from '../engine/rules';
import { useGameAudio } from '../audio/useGameAudio';
import { GameIntro } from './GameIntro';
import { gamePresentation } from '../data/presentation';

/** onTap = เสียงตอบรับตอนแตะชิ้นส่วน กระดานไหนไม่ต้องการก็ไม่ต้องเรียก */
export type PlayProps = { slug: GameDefinition['slug']; level: number; onProgress: (done: number, total: number) => void; onFeedback: (correct: boolean) => void; onComplete: () => void; onTap: () => void };
export function GameShell({ game, Board }: { game: GameDefinition; Board: ComponentType<PlayProps> }) {
  const theme = gamePresentation[game.slug];
  const levelCount = theme.levelCount ?? 3;
  const [status, setStatus] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [level, setLevel] = useState(1);
  const [session, setSession] = useState(0);
  const [progress, setProgress] = useState({ done: 0, total: 1 });
  const [feedback, setFeedback] = useState({ text: '', correct: true, key: 0 });
  const [savedStars, setSavedStars] = useState(0);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const instructionHeading = useRef<HTMLHeadingElement>(null);
  const audio = useGameAudio();
  const play = audio.play;
  const onProgress = useCallback((done: number, total: number) => setProgress({ done, total }), []);
  const onTap = useCallback(() => play('uiClick'), [play]);
  const onFeedback = useCallback((correct: boolean) => { setFeedback(previous => ({ text: correct ? 'ถูกแล้ว! • Well done!' : 'ลองอีกครั้งนะ • Try again', correct, key: previous.key + 1 })); play(correct ? 'correct' : 'incorrect'); }, [play]);
  const onComplete = useCallback(() => { const saved = gameProgress.complete(game.slug, level, completionStars()); setSavedStars(saved.stars); setStatus('complete'); play('levelComplete'); }, [game.slug, level, play]);
  useEffect(() => {
    if (status === 'complete') resultHeading.current?.focus();
    if (status === 'playing') instructionHeading.current?.focus({ preventScroll: true });
  }, [status, session]);
  const start = () => { setProgress({ done: 0, total: 1 }); setFeedback({ text: '', correct: true, key: 0 }); setSession(s => s + 1); setStatus('playing'); play('voiceInstruction', game.instruction.th); };
  return <main className="gc-world gc-focus" data-game={game.slug} data-status={status}><div className="gc-play-container">
    <header className="gc-game-header"><Link className="gc-button" href="/games">← รวมเกม <small lang="en">Game Hub</small></Link><h1>{game.title.th}<small lang="en">{game.title.en}</small></h1><button className="gc-button gc-sound" onClick={audio.toggle} aria-pressed={audio.enabled} aria-label={audio.enabled ? 'ปิดเสียง / Sound off' : 'เปิดเสียง / Sound on'}><SpeakerIcon className="h-6 w-6" on={audio.enabled} /><span>{audio.enabled ? 'เปิดเสียงอยู่' : 'ปิดเสียงอยู่'}<small lang="en">{audio.enabled ? 'Sound on' : 'Sound off'}</small></span></button></header>
    {status === 'idle' ? <GameIntro game={game} level={level} onLevel={setLevel} onStart={start} /> : status === 'playing' ? <>
      <div className="gc-progress-row"><span className="gc-progress-level">ด่าน {level} <small lang="en">Level {level}</small></span><progress value={progress.done} max={progress.total} aria-label="ความคืบหน้าด่าน / Level progress" /><span>{progress.done} / {progress.total}</span><span className="gc-progress-reward" aria-hidden="true">★</span></div>
      <div className="gc-instruction"><Image className="gc-playing-guide" src={gameAssets.guide} width={90} height={100} alt="" /><h2 ref={instructionHeading} tabIndex={-1}>{game.instruction.th}<small lang="en">{game.instruction.en}</small></h2><button className="gc-button" onClick={() => play('voiceInstruction', game.instruction.th)}>ฟังวิธีเล่น<small lang="en">Listen</small></button></div>
      <div className="gc-feedback" role="status" aria-live="polite"><span key={feedback.key} className={feedback.text ? feedback.correct ? 'gc-correct' : 'gc-retry' : ''}>{feedback.text || 'พร้อมแล้ว ลองเลย! • You can do it!'}</span></div>
      <section className="gc-panel gc-board" aria-label={game.title.th}><div className="gc-workbench-title"><span aria-hidden="true">✦</span><span>{theme.world.th}<small lang="en">{theme.world.en}</small></span><span aria-hidden="true">✦</span></div><Board key={`${game.slug}-${level}-${session}`} slug={game.slug} level={level} onProgress={onProgress} onFeedback={onFeedback} onComplete={onComplete} onTap={onTap} /></section>
      <div className="gc-bottom-controls">{levelCount > 1 && <button className="gc-button" onClick={() => setStatus('idle')}>เลือกด่านใหม่<small lang="en">Choose level</small></button>}<button className="gc-button" onClick={start}>เริ่มใหม่<small lang="en">Restart</small></button></div>
    </> : <section className="gc-panel gc-result"><div className="gc-celebration" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} style={{ left: `${10 + i * 10}%`, animationDelay: `${i * 65}ms` }}>✦</span>)}</div><Image src={gameAssets.celebration} width={170} height={190} alt="หุ่นยนต์ร่วมยินดี" /><h2 tabIndex={-1} ref={resultHeading}>เก่งมาก ผ่านด่านแล้ว!</h2><p lang="en">You did it! Level {level} complete</p><p className="gc-result-stars" aria-label="ได้รับ 3 ดาว">★ ★ ★</p><p>สะสมเกมนี้ {savedStars} ดาว <span lang="en">• {savedStars} stars collected</span></p><div className="gc-result-actions">{level < levelCount && <button className="gc-button gc-primary" onClick={() => { setLevel(l => l + 1); setStatus('idle'); }}>ด่านต่อไป<small lang="en">Next level →</small></button>}<button className="gc-button" onClick={start}>เล่นอีกครั้ง<small lang="en">Play again</small></button><Link className="gc-button" href="/games">เลือกเกมใหม่<small lang="en">More games</small></Link></div></section>}
    {audio.speechBroken && <p className="gc-audio-note">อุปกรณ์นี้ไม่มีเสียงอ่าน ใช้ภาพและคำแนะนำบนหน้าจอได้เลย <span lang="en">Voice unavailable. Follow the pictures.</span></p>}
  </div></main>;
}
