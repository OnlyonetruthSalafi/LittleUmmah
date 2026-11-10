'use client';
import { getSoundSnapshot, subscribeSound } from '@/lib/soundStore';
import { isSpeaking, playNarration } from '@/lib/speech';

export type VoiceId = 'ls-earned' | 'ls-empty' | 'ls-free' | 'time-warn' | 'time-up' | 'unlocked' | 'ls-last';
/** Wait for narration to finish; never interrupt a lesson or another teacher. */
export function queueVoice(id: VoiceId) {
  if (typeof window === 'undefined' || !getSoundSnapshot() || location.pathname.startsWith('/en')) return () => {};
  let stop: (() => void) | undefined;
  let timer: ReturnType<typeof setTimeout>;
  let cancelled = false;
  const unsubscribe = subscribeSound(() => { if (!getSoundSnapshot()) cancel(); });
  const cancel = () => { cancelled = true; clearTimeout(timer); stop?.(); unsubscribe(); };
  const attempt = () => {
    if (cancelled || !getSoundSnapshot()) return cancel();
    if (isSpeaking() || document.visibilityState !== 'visible') { timer = setTimeout(attempt, 500); return; }
    stop = playNarration(`/audio/th/stars/${id}.mp3`, { onEnded: cancel, onStopped: cancel, onFail: cancel });
  };
  // Let the current lesson schedule its own next narration first.
  timer = setTimeout(attempt, 1000);
  return cancel;
}
