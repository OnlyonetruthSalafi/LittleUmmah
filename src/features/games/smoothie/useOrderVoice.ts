'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/components/sound/SoundProvider';
import { getRunAudioContext } from '@/lib/runAudio';
import { playNarration, speakWithSynth, stopAllSpeech, stopSpeechIf } from '@/lib/speech';
import type { Locale } from '@/i18n/config';

export function useOrderVoice(clip: string, line: string, lang: Locale, active: boolean, greeting: boolean) {
  const { enabled } = useSound();
  const cancel = useRef<(() => void) | undefined>(undefined);
  const needsGesture = useRef(false);
  const prepared = useRef<Promise<AudioBuffer | null> | null>(null);
  // This visit can proceed after the salam ends, or with its caption if a tapped retry also fails.
  const [finishedGreeting, setFinishedGreeting] = useState<string | null>(null);
  // A greeting the browser would not play without a tap (a page opened straight to the shop).
  const [blocked, setBlocked] = useState<string | null>(null);
  useEffect(() => {
    if (!greeting || !enabled) return;
    const audio = getRunAudioContext();
    if (!audio) return;
    const request = new AbortController();
    const deadline = window.setTimeout(() => request.abort(), 4000);
    // The walk gives the customer's greeting time to load before the dialogue opens.
    prepared.current = fetch(clip, { signal: request.signal })
      .then(response => {
        if (!response.ok) throw new Error('Greeting unavailable');
        return response.arrayBuffer();
      })
      .then(bytes => audio.decodeAudioData(bytes))
      .catch(() => null)
      .finally(() => window.clearTimeout(deadline));
    return () => { window.clearTimeout(deadline); request.abort(); prepared.current = null; };
  }, [clip, enabled, greeting]);

  const play = useCallback((retryGreeting: boolean) => {
    if (!active || !enabled) return;
    cancel.current?.();
    needsGesture.current = false;
    let stopped = false;
    let stopPlayback: (() => void) | undefined;
    let deadline: number | undefined;
    const cancelAttempt = () => {
      if (stopped) return;
      stopped = true;
      window.clearTimeout(deadline);
      stopPlayback?.();
    };
    cancel.current = cancelAttempt;
    const done = () => {
      if (stopped) return;
      window.clearTimeout(deadline);
      if (greeting) setFinishedGreeting(clip);
    };
    const failed = () => {
      if (stopped) return;
      cancelAttempt();
      needsGesture.current = true;
      if (greeting) {
        if (retryGreeting) setFinishedGreeting(clip);
        else setBlocked(clip);
      }
    };
    // A suspended context or stalled decoder may never dispatch ended.
    if (greeting) deadline = window.setTimeout(failed, 12000);
    const recorded = () => playNarration(clip, {
      onEnded: done, onStopped: greeting ? failed : done, onFail: failed,
    });
    const audio = greeting && getRunAudioContext();
    if (audio && audio.state === 'running' && prepared.current) {
      // This context was unlocked by the child's earlier tap. Some mobile browsers
      // block a new HTMLAudioElement created later by an animation-end callback.
      stopAllSpeech();
      void prepared.current.then(buffer => {
        if (stopped) return;
        if (!buffer || audio.state !== 'running') { stopPlayback = recorded(); return; }
        const source = audio.createBufferSource();
        source.buffer = buffer;
        source.onended = done;
        source.connect(audio.destination);
        source.start();
        stopPlayback = () => { source.onended = null; source.stop(); source.disconnect(); };
      }).catch(failed);
    } else if (greeting || lang === 'th') {
      stopPlayback = recorded();
    } else {
      speakWithSynth(line);
      stopPlayback = () => stopSpeechIf('', line);
    }
  }, [active, clip, enabled, greeting, lang, line]);
  const listen = useCallback(() => play(false), [play]);
  useEffect(() => {
    if (active && enabled && !(greeting && (finishedGreeting === clip || needsGesture.current))) listen();
    return () => { cancel.current?.(); cancel.current = undefined; };
  }, [active, enabled, listen, greeting, finishedGreeting, clip]);
  // With the sound off there is nothing to wait for.
  const greeted = !enabled || finishedGreeting === clip;
  const needsTap = greeting && enabled && blocked === clip && !greeted;
  const hearGreeting = () => { setBlocked(null); play(true); };
  return { enabled, greeted, needsTap, hearGreeting, listen, retryOnGesture: () => { if (needsGesture.current) listen(); } };
}
