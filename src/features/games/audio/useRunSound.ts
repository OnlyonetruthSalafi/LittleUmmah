'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSoundSnapshot, subscribeSound } from '@/lib/soundStore';
import { getRunAudioContext, loadRunAudio, unlockRunAudio } from '@/lib/runAudio';

// Schedule in the audio engine, not a throttled UI timer.
// run-brake.mp3 = engine run-up that grows louder, then a brake that stops at STOP_SECONDS.
// The stop is aligned to the 3600ms arrival in hub-guide.css, the moment frame 6
// (robot closest to the screen) appears; the short settle tail plays after it.
const STOP_SECONDS = 2.87;
const ARRIVAL_SECONDS = 3.6;

export function useRunSound() {
  const [ready, setReady] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const buffer = useRef<AudioBuffer | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const request = useRef(0);

  const stop = useCallback(() => {
    request.current++;
    source.current?.stop();
    source.current = null;
  }, []);

  useEffect(() => {
    let active = true;
    const audio = getRunAudioContext();
    if (!audio) {
      queueMicrotask(() => { if (active) setReady(true); });
      return () => { active = false; };
    }
    context.current = audio;
    void loadRunAudio(audio)
      .then(decoded => { if (active) buffer.current = decoded; })
      .catch(() => { /* Allow silent animation if the asset cannot load. */ })
      .finally(() => { if (active) setReady(true); });
    const visibility = () => { if (document.hidden) stop(); };
    const unsubscribe = subscribeSound(() => { if (!getSoundSnapshot()) stop(); });
    document.addEventListener('visibilitychange', visibility);
    return () => {
      active = false; stop(); unsubscribe(); buffer.current = null;
      document.removeEventListener('visibilitychange', visibility);
      context.current = null;
    };
  }, [stop]);

  const play = useCallback(() => {
    stop();
    const audio = context.current;
    const clip = buffer.current;
    if (!audio || !clip || !getSoundSnapshot() || document.hidden) return;
    // Let the browser decide whether resuming is allowed. A transient
    // userActivation check incorrectly rejects permitted route arrivals.
    const beganAt = performance.now();
    const id = request.current;
    void audio.resume().then(() => {
      if (id !== request.current || document.hidden || !getSoundSnapshot()) return;
      const elapsed = (performance.now() - beganAt) / 1000;
      if (elapsed >= ARRIVAL_SECONDS) return;
      const player = audio.createBufferSource();
      const gain = audio.createGain();
      const delay = ARRIVAL_SECONDS - STOP_SECONDS;
      const offset = Math.max(0, elapsed - delay);
      const duration = clip.duration - offset;
      if (duration <= 0) return;
      const now = audio.currentTime;
      const startsAt = now + Math.max(0, delay - elapsed);
      player.buffer = clip;
      gain.gain.setValueAtTime(.65, startsAt);
      gain.gain.setValueAtTime(.65, startsAt + Math.max(0, duration - .15));
      gain.gain.linearRampToValueAtTime(0, startsAt + duration);
      player.connect(gain); gain.connect(audio.destination);
      source.current = player;
      player.onended = () => {
        player.disconnect(); gain.disconnect();
        if (source.current === player) source.current = null;
      };
      player.start(startsAt, offset, duration);
    }).catch(() => { /* Autoplay restrictions must not interrupt the page. */ });
  }, [stop]);

  return { play, stop, ready, unlock: unlockRunAudio };
}
