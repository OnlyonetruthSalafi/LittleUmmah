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
  // The greeting clip the child has heard to the end, so the reply buttons wait for the salam.
  const [heard, setHeard] = useState<string | null>(null);
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

  const listen = useCallback(() => {
    if (!active || !enabled) return;
    cancel.current?.();
    needsGesture.current = false;
    const done = () => { if (greeting) setHeard(clip); };
    // A clip that never reports its end must not hide the replies for long.
    const fallback = greeting ? window.setTimeout(done, 4000) : undefined;
    const recorded = () => playNarration(clip, {
      onEnded: done, onStopped: done,
      onFail() {
        needsGesture.current = true;
        // Keep the replies hidden: the child taps to hear the salam first, then answers it.
        if (greeting) { window.clearTimeout(fallback); setBlocked(clip); }
      },
    });
    const audio = greeting && getRunAudioContext();
    if (audio && audio.state === 'running' && prepared.current) {
      // This context was unlocked by the child's earlier tap. Some mobile browsers
      // block a new HTMLAudioElement created later by an animation-end callback.
      stopAllSpeech();
      let stopped = false;
      let source: AudioBufferSourceNode | undefined;
      let stopFallback: (() => void) | undefined;
      cancel.current = () => {
        window.clearTimeout(fallback);
        stopped = true;
        if (source) { source.stop(); source.disconnect(); }
        stopFallback?.();
      };
      void prepared.current.then(buffer => {
        if (stopped) return;
        if (!buffer || audio.state !== 'running') { stopFallback = recorded(); return; }
        source = audio.createBufferSource();
        source.buffer = buffer;
        source.onended = done;
        source.connect(audio.destination);
        source.start();
      });
    } else if (greeting || lang === 'th') {
      const stop = recorded();
      cancel.current = () => { window.clearTimeout(fallback); stop(); };
    } else {
      speakWithSynth(line);
      cancel.current = () => stopSpeechIf('', line);
    }
  }, [active, clip, enabled, greeting, lang, line]);
  useEffect(() => {
    if (active && enabled) listen();
    return () => { cancel.current?.(); cancel.current = undefined; };
  }, [active, enabled, listen]);
  // With the sound off there is nothing to wait for.
  const greeted = !enabled || heard === clip;
  const needsTap = greeting && enabled && blocked === clip && !greeted;
  const hearGreeting = () => { setBlocked(null); listen(); };
  return { enabled, greeted, needsTap, hearGreeting, listen, retryOnGesture: () => { if (needsGesture.current) listen(); } };
}
