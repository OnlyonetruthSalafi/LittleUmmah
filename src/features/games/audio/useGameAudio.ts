'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useSound } from '@/components/sound/SoundProvider';
import { stopAllSpeech } from '@/lib/speech';
export type AudioCue = 'uiClick' | 'correct' | 'incorrect' | 'levelComplete' | 'voiceInstruction';
const phrases: Partial<Record<AudioCue, string>> = { correct: 'ถูกแล้ว', incorrect: 'ลองอีกครั้งนะ', levelComplete: 'เก่งมาก ผ่านด่านแล้ว' };

// Sound effect เลือกจากคลังเสียงของเจ้าของโปรเจกต์ แปลงด้วย scripts/prepare-sfx.mjs
// ทั้งสี่ไฟล์มาจากโฟลเดอร์ POPS เป็นเสียงป๊อก ไม่ใช่ดนตรี ไม่มีทำนองหรือจังหวะ (AGENTS.md ข้อ 1.3)
// ระดับเสียงตาม GAME_SYSTEM_PLAN.md §10.2
const effects: Partial<Record<AudioCue, { file: string; volume: number }>> = {
  uiClick: { file: '/audio/sfx/tap.wav', volume: 0.5 },
  correct: { file: '/audio/sfx/correct.wav', volume: 0.7 },
  incorrect: { file: '/audio/sfx/wrong.wav', volume: 0.4 },
  levelComplete: { file: '/audio/sfx/level-complete.wav', volume: 0.7 },
};

export function useGameAudio() {
  const { enabled, toggle, speak, speechBroken } = useSound();
  // เก็บ element ไว้ตัวละ cue แล้วรีเซ็ต currentTime ก่อนเล่น กันการสร้าง element ใหม่ทุกครั้ง
  const players = useRef(new Map<AudioCue, HTMLAudioElement>());
  useEffect(() => () => stopAllSpeech(), []);
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

  const play = useCallback((cue: AudioCue, instruction?: string) => {
    if (!enabled) return;
    playEffect(cue);
    // เสียงอ่านใช้เฉพาะคำสั่งเล่นเกม ส่วน feedback สั้นๆ ให้ sound effect ทำหน้าที่แทน
    if (cue === 'voiceInstruction') { const text = instruction ?? phrases[cue]; if (text) speak(text); }
  }, [enabled, playEffect, speak]);

  return { enabled, toggle, play, speechBroken };
}
