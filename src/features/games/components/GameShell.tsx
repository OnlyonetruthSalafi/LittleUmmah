'use client';
import { fmt } from '@/i18n/dict';
import { useDict } from '@/i18n/LocaleProvider';

import { GameImage as Image } from './GameImage';
import { LocaleLink as Link } from '@/i18n/LocaleProvider';
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';import { BackLink } from '@/components/ui/BackLink';
import { gameAssets, type GameDefinition } from '../data/catalog';
import { gameProgress } from '../engine/progress';
import { completionStars } from '../engine/rules';
import { useGameAudio } from '../audio/useGameAudio';
import { GameIntro } from './GameIntro';
import { VoiceIntro } from './VoiceIntro';
import { Countdown } from './Countdown';
import { gamePresentation } from '../data/presentation';
import { enterGameFullscreen, exitGameFullscreen, keepGameFullscreen } from '../engine/fullscreen';
import { GAME_TUTORIALS } from '../data/gameTutorials';
import { GameTutorial } from './GameTutorial';
import { RotateGate, usePortraitGate } from './RotateGate';
import { puzzleProgressId } from '../data/puzzlePictures';
import { SHOW_REWARD_STARS } from '@/lib/rewardStars';

/** onTap = เสียงตอบรับตอนแตะชิ้นส่วน กระดานไหนไม่ต้องการก็ไม่ต้องเรียก
 *  paused = กำลังนับถอยหลังก่อนเริ่ม — กระดานถูก inert อยู่แล้ว ใช้เฉพาะกระดานที่มีเวลาเดินเอง หรือฟังคีย์บอร์ดทั้งหน้า (เขาวงกตแสง) */
export type PlayProps = { slug: GameDefinition['slug']; pictureId?: string; level: number; paused: boolean; onProgress: (done: number, total: number) => void; onFeedback: (correct: boolean, voice?: { text: string; key: string }) => void; onResetFeedback?: () => void; onComplete: () => void; onTap: () => void };
export function GameShell({ game, Board }: { game: GameDefinition; Board: ComponentType<PlayProps> }) {
  const { t, sub, pick, pickSub } = useDict();
  const theme = gamePresentation[game.slug];
  const levelCount = theme.levelCount ?? 3;
  const [status, setStatus] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [level, setLevel] = useState(1);
  const [pictureId, setPictureId] = useState('original');
  const [session, setSession] = useState(0);
  const [progress, setProgress] = useState({ done: 0, total: 1 });
  const [feedback, setFeedback] = useState({ text: '', correct: true, key: 0 });
  const [savedStars, setSavedStars] = useState(0);
  // นับถอยหลัง 3 2 1 ทุกครั้งที่เริ่มเล่น ระหว่างนับกระดานกดไม่ได้ (inert)
  const [counting, setCounting] = useState(false);
  const tutorial = GAME_TUTORIALS[game.slug];
  // เกมที่บังคับแนวนอน: จอตั้งอยู่ = หยุดทุกอย่าง กลับมาแนวนอนแล้วนับถอยหลังใหม่ให้เด็กตั้งตัวทัน
  const gated = usePortraitGate(!!theme.fullscreen);
  const [wasGated, setWasGated] = useState(false);
  const [countRound, setCountRound] = useState(0);
  if (gated !== wasGated) { setWasGated(gated); if (gated && status === 'playing') { setCounting(true); setCountRound(round => round + 1); } }
  const speakAfterGo = useRef(false);
  const instructionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // ออกจากหน้าเล่น (ผ่านด่าน เลือกด่านใหม่) หรือออกจากเกม ยกเลิกเสียงคำสั่งที่ตั้งเวลาไว้
  useEffect(() => { if (status !== 'playing' || gated) clearTimeout(instructionTimer.current); }, [status, gated]);
  useEffect(() => () => clearTimeout(instructionTimer.current), []);
  // ออกจากหน้าเกม (ปุ่มรวมเกม เลือกเกมใหม่) คืนจอปกติ
  useEffect(() => { if (!theme.fullscreen) return; keepGameFullscreen(); return exitGameFullscreen; }, [theme.fullscreen]);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const instructionHeading = useRef<HTMLHeadingElement>(null);
  const audio = useGameAudio(!!theme.landscapeBoard && gated);
  const play = audio.play;
  const onProgress = useCallback((done: number, total: number) => setProgress({ done, total }), []);
  const onTap = useCallback(() => play('uiClick'), [play]);
  const onFeedback = useCallback((correct: boolean, voice?: { text: string; key: string }) => { setFeedback(previous => ({ text: correct ? t.games.shell.correct : t.games.shell.retry, correct, key: previous.key + 1 })); play(correct ? 'correct' : 'incorrect', voice?.text, voice?.key); }, [play, t.games.shell.correct, t.games.shell.retry]);
  const onResetFeedback = useCallback(() => setFeedback(previous => ({ ...previous, text: '' })), []);
  const onComplete = useCallback(() => { const saved = gameProgress.complete(game.slug === 'puzzle' ? puzzleProgressId(pictureId) : game.slug, level, theme.starsPerLevel ?? completionStars()); setSavedStars(saved.stars); setStatus('complete'); if (theme.ownVoice) audio.effect('levelComplete'); else play('levelComplete'); }, [game.slug, pictureId, level, play, theme.ownVoice, theme.starsPerLevel, audio]);
  useEffect(() => {
    if (status === 'complete') resultHeading.current?.focus();
    if (status === 'playing') instructionHeading.current?.focus({ preventScroll: true });
  }, [status, session]);
  // เกมแบบเส้นทาง (journey): ต่อจากด่านถัดจากที่ผ่านล่าสุด อ่าน localStorage หลัง mount กัน hydration ไม่ตรงกัน
  useEffect(() => {
    if (!theme.journey) return;
    // ด่านแรกที่ยังไม่ผ่าน (ข้อมูลเก่าจากสมัยเลือกด่านได้อาจผ่านด่าน 2 โดยยังไม่ผ่านด่าน 1) ผ่านครบแล้วเริ่มด่าน 1
    const done = gameProgress.read(game.slug).completedLevels;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage อ่านได้หลัง mount เท่านั้น
    setLevel(Array.from({ length: levelCount }, (_, i) => i + 1).find(n => !done.includes(n)) ?? 1);
  }, [game.slug, theme.journey, levelCount]);
  // start ถูกเรียกจากปุ่มที่เด็กกดเสมอ จึงขอเต็มจอได้ตรงนี้
  const start = ({ speak = true } = {}) => { if (theme.fullscreen) enterGameFullscreen(); setProgress({ done: 0, total: 1 }); setFeedback({ text: '', correct: true, key: 0 }); setSession(s => s + 1); setStatus('playing'); setCounting(true); clearTimeout(instructionTimer.current); speakAfterGo.current = speak && !theme.ownVoice; };
  // "เริ่ม!" แล้วหุ่นพูด "บิสมิลลาฮ์ เริ่มกันเลย" (~1.8 วิ) รอจบก่อนค่อยอ่านคำสั่ง ไม่ให้เสียงพูดตัดกัน
  const onGo = useCallback(() => {
    setCounting(false);
    if (speakAfterGo.current) instructionTimer.current = setTimeout(() => play('voiceInstruction', pick(game.instruction), `game-${game.slug}`), 1900);
  }, [play, pick, game.instruction, game.slug]);
  return <main className={`gc-world gc-focus${theme.landscapeBoard ? ' gc-landscape' : ''}`} data-game={game.slug} data-status={status}><div className="gc-play-container" inert={gated}>
    <header className="gc-game-header"><BackLink href="/games" label={{ th: t.games.shell.hub, en: sub?.games.shell.hub ?? t.games.shell.hub }} /><h1>{pick(game.title)}{sub && <small lang="en">{pickSub(game.title)!}</small>}</h1>{/* ชื่อปุ่มคงที่ "เสียงเกม" แล้วให้ aria-pressed บอกสถานะ แบบเดียวกับปุ่มเสียงบนหัวเว็บ — จอแคบเหลือปุ่มกลมไอคอนลำโพง */}<button className="ui-pill ui-pill-sm-round gc-sound" onClick={audio.toggle} aria-pressed={audio.enabled} aria-label={t.games.shell.sound}><span className="ui-disc"><SpeakerIcon on={audio.enabled} /></span><span className="ui-label hidden sm:block" aria-hidden="true">{audio.enabled ? t.games.shell.soundOn : t.games.shell.soundOff}{sub && <small lang="en">{audio.enabled ? sub.games.shell.soundOn : sub.games.shell.soundOff}</small>}</span></button></header>
    {status === 'idle' ? tutorial ? <GameTutorial steps={tutorial} soundOn={audio.enabled && !audio.speechBroken} paused={gated} onDone={() => start({ speak: false })} /> : theme.voiceIntro ? <VoiceIntro paused={gated} game={game} soundOn={audio.enabled} speechBroken={audio.speechBroken} onStart={() => start({ speak: false })} /> : <GameIntro game={game} level={level} onLevel={setLevel} onStart={start} soundOn={audio.enabled} onListen={() => play('voiceInstruction', pick(game.instruction), `game-${game.slug}`)} pictureId={pictureId} onPicture={setPictureId} /> : status === 'playing' ? <>
      <div className="gc-progress-row"><span className="gc-progress-level">{t.games.shell.level} {level} {sub && <small lang="en">{sub.games.shell.level} {level}</small>}</span><progress value={progress.done} max={progress.total} aria-label={t.games.shell.progress} /><span>{progress.done} / {progress.total}</span>{SHOW_REWARD_STARS && <span className="gc-progress-reward" aria-hidden="true">★</span>}</div>
      <div className="gc-instruction"><Image className="gc-playing-guide" src={gameAssets.pointer} width={90} height={100} alt="" /><h2 ref={instructionHeading} tabIndex={-1}>{pick(game.instruction)}{sub && <small lang="en">{pickSub(game.instruction)!}</small>}</h2><button className="gc-button" onClick={() => play('voiceInstruction', pick(game.instruction), `game-${game.slug}`)}>{t.games.shell.listen}{sub && <small lang="en">{sub.games.shell.listen}</small>}</button></div>
      <div className="gc-feedback" role="status" aria-live="polite"><span key={feedback.key} className={feedback.text ? feedback.correct ? 'gc-correct' : 'gc-retry' : ''}>{feedback.text || (theme.voiceIntro ? '' : t.games.shell.ready)}</span></div>
      {!gated && <Countdown key={`${session}-${countRound}`} onGo={onGo} />}<section className="gc-panel gc-board" aria-label={pick(game.title)} inert={counting}>{!theme.voiceIntro && <div className="gc-workbench-title"><span aria-hidden="true">✦</span><span>{pick(theme.world)}{sub && <small lang="en">{pickSub(theme.world)!}</small>}</span><span aria-hidden="true">✦</span></div>}<Board key={`${game.slug}-${level}-${session}`} slug={game.slug} pictureId={pictureId} level={level} paused={counting || gated} onProgress={onProgress} onFeedback={onFeedback} onResetFeedback={onResetFeedback} onComplete={onComplete} onTap={onTap} /></section>
      <div className="gc-bottom-controls">{levelCount > 1 && !theme.journey && <button className="gc-button" onClick={() => setStatus('idle')}>{t.games.shell.choose}{sub && <small lang="en">{sub.games.shell.choose}</small>}</button>}<button className="gc-button" onClick={() => start()}>{t.games.shell.restart}{sub && <small lang="en">{sub.games.shell.restart}</small>}</button></div>
    </> : <section className="gc-panel gc-result"><div className="gc-celebration" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} style={{ left: `${10 + i * 10}%`, animationDelay: `${i * 65}ms` }}>✦</span>)}</div><Image src={gameAssets.celebration} width={170} height={190} alt={t.games.shell.celebrateAlt} /><h2 tabIndex={-1} ref={resultHeading}>{t.games.shell.complete}</h2>{sub && <p lang="en">{fmt(sub.games.shell.result, { level })}</p>}{SHOW_REWARD_STARS && <><p className="gc-result-stars" aria-label={t.games.shell.stars}>★ ★ ★</p><p>{fmt(t.games.shell.collected, { stars: savedStars })}{sub && <span lang="en">{fmt(sub.games.shell.collectedSecondary, { stars: savedStars })}</span>}</p></>}<div className="gc-result-actions">{/* journey: ไปด่านต่อไปเล่นทันที ไม่กลับหน้าเลือกด่าน / ด่านสุดท้าย "เล่นอีกครั้ง" เริ่มเส้นทางใหม่จากด่านแรก */}{level < levelCount && <button className="gc-button gc-primary" onClick={() => { setLevel(l => l + 1); if (theme.journey) start(); else setStatus('idle'); }}>{t.games.shell.next}{sub && <small lang="en">{sub.games.shell.next}</small>}</button>}<button className="gc-button" onClick={() => { if (theme.journey && level >= levelCount) setLevel(1); start(); }}>{t.games.shell.again}{sub && <small lang="en">{sub.games.shell.again}</small>}</button><Link className="gc-button" href="/games">{t.games.shell.more}{sub && <small lang="en">{sub.games.shell.more}</small>}</Link></div></section>}
    {audio.speechBroken && <p className="gc-audio-note">{t.games.shell.noVoice} {sub && <span lang="en">{sub.games.shell.noVoice}</span>}</p>}
  </div>{gated && <RotateGate />}</main>;
}
