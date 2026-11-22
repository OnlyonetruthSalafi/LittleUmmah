'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSound } from '@/components/sound/SoundProvider';
import { getRunAudioContext } from '@/lib/runAudio';
import { playNarration, speakWithSynth, stopAllSpeech, stopSpeechIf } from '@/lib/speech';
import type { Locale } from '@/i18n/config';

export function useOrderVoice(clip: string, line: string, lang: Locale, active: boolean, greeting: boolean) {
  const { enabled } = useSound();
  const cancel = useRef<(() => void) | undefined>(undefined);
  const needsGesture = useRef(false);
  const prepared = useRef<Promise<AudioBuffer | null> | null>(null);
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
    const recorded = () => playNarration(clip, {
      onEnded() {}, onStopped() {},
      onFail() { needsGesture.current = true; },
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
        stopped = true;
        if (source) { source.stop(); source.disconnect(); }
        stopFallback?.();
      };
      void prepared.current.then(buffer => {
        if (stopped) return;
        if (!buffer || audio.state !== 'running') { stopFallback = recorded(); return; }
        source = audio.createBufferSource();
        source.buffer = buffer;
        source.connect(audio.destination);
        source.start();
      });
    } else if (greeting || lang === 'th') {
      cancel.current = recorded();
    } else {
      speakWithSynth(line);
      cancel.current = () => stopSpeechIf('', line);
    }
  }, [active, clip, enabled, greeting, lang, line]);
  useEffect(() => {
    if (active && enabled) listen();
    return () => { cancel.current?.(); cancel.current = undefined; };
  }, [active, enabled, listen]);
  return { enabled, listen, retryOnGesture: () => { if (needsGesture.current) listen(); } };
}
