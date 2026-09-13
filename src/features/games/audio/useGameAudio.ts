'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useSound } from '@/components/sound/SoundProvider';
import { stopAllSpeech } from '@/lib/speech';
export type AudioCue = 'uiClick' | 'correct' | 'incorrect' | 'levelComplete' | 'voiceInstruction';

// คำชมและคำให้กำลังใจของหุ่นยนต์ สุ่มพูดทีละประโยคไม่ให้ซ้ำจนเด็กเบื่อ
// key = ไฟล์ใน public/audio/th/ ส่วน text คือคำที่เสียงสังเคราะห์อ่านแทนถ้าไฟล์เล่นไม่ได้
const praise: Partial<Record<AudioCue, { key: string; text: string }[]>> = {
  correct: [
    { key: 'praise-correct-1', text: 'เก่งมาก' },
    { key: 'praise-correct-2', text: 'มาชาอัลลอฮ์' },
    { key: 'praise-correct-3', text: 'ถูกต้อง' },
  ],
  incorrect: [
    { key: 'praise-wrong-1', text: 'ลองอีกครั้งนะ' },
    { key: 'praise-wrong-2', text: 'ใกล้แล้ว สู้ๆ นะ' },
  ],
  levelComplete: [{ key: 'praise-level-complete', text: 'เย้ ผ่านด่านแล้ว' }],
};
// รอให้เสียงเอฟเฟคขึ้นก่อนนิดหนึ่ง หุ่นยนต์ค่อยพูด เสียงจะได้ไม่ทับกันจนฟังไม่ออก
const PRAISE_DELAY_MS = 300;

// Sound effect สร้างด้วย ElevenLabs Sound Effects ใส่ "no music, no melody" ทุกไฟล์ (AGENTS.md ข้อ 1.3)
// เจ้าของโปรเจกต์ฟังและอนุมัติแล้ว ระดับเสียงตาม GAME_SYSTEM_PLAN.md §10.2
const effects: Partial<Record<AudioCue, { file: string; volume: number }>> = {
  uiClick: { file: '/audio/sfx/tap.mp3', volume: 0.5 },
  correct: { file: '/audio/sfx/correct.mp3', volume: 0.7 },
  incorrect: { file: '/audio/sfx/wrong.mp3', volume: 0.4 },
  levelComplete: { file: '/audio/sfx/level-complete.mp3', volume: 0.7 },
};

export function useGameAudio() {
  const { enabled, toggle, speak, speechBroken } = useSound();
  // เก็บ element ไว้ตัวละ cue แล้วรีเซ็ต currentTime ก่อนเล่น กันการสร้าง element ใหม่ทุกครั้ง
  const players = useRef(new Map<AudioCue, HTMLAudioElement>());
  const praiseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastPraise = useRef(new Map<AudioCue, string>());
  useEffect(() => () => { clearTimeout(praiseTimer.current); stopAllSpeech(); }, []);
  useEffect(() => {
    const pool = players.current;
    return () => { for (const audio of pool.values()) audio.pause(); pool.clear(); };
  }, []);

  const playEffect = useCallback((cue: AudioCue) => {
    const effect = effects[cue];
    if (!effect || typeof Audio === 'undefined') return;
    let player = players.current.get(cue);
    if (!player) {
      player = new Audio(effect.file);
      player.preload = 'auto';
      player.volume = effect.volume;
      players.current.set(cue, player);
    }
    player.currentTime = 0;
    // เบราว์เซอร์บล็อกเสียงได้ถ้าเด็กยังไม่เคยแตะหน้าจอ ปล่อยผ่านเงียบๆ ไม่ให้เกมพัง
    void player.play().catch(() => {});
  }, []);

  /** instruction = คำสั่งเล่นเกม, key = ไฟล์เสียงหุ่นยนต์ของคำสั่งนั้น */
  const play = useCallback((cue: AudioCue, instruction?: string, key?: string) => {
    if (!enabled) return;
    playEffect(cue);
    if (cue === 'voiceInstruction') { if (instruction) speak(instruction, key); return; }
    const lines = praise[cue];
    if (!lines) return;
    // ไม่พูดประโยคเดิมซ้ำสองครั้งติดกัน
    const choices = lines.length > 1 ? lines.filter(line => line.key !== lastPraise.current.get(cue)) : lines;
    const line = choices[Math.floor(Math.random() * choices.length)];
    lastPraise.current.set(cue, line.key);
    clearTimeout(praiseTimer.current);
    praiseTimer.current = setTimeout(() => speak(line.text, line.key), PRAISE_DELAY_MS);
  }, [enabled, playEffect, speak]);

  return { enabled, toggle, play, speechBroken };
}
