// Keep the unlocked context and decoded clip across App Router navigation.
let context: AudioContext | null = null;
let clip: Promise<AudioBuffer> | null = null;

export function getRunAudioContext() {
  if (typeof AudioContext === 'undefined') return null;
  if (!context || context.state === 'closed') {
    context = new AudioContext();
    clip = null;
  }
  return context;
}

export function unlockRunAudio() {
  const audio = getRunAudioContext();
  if (audio && audio.state !== 'running') void audio.resume().catch(() => {});
}

export function loadRunAudio(audio: AudioContext) {
  clip ??= fetch('/audio/sfx/run-brake.mp3', { signal: AbortSignal.timeout(8000) })
    .then(response => {
      if (!response.ok) throw new Error('Run sound unavailable');
      return response.arrayBuffer();
    })
    .then(bytes => audio.decodeAudioData(bytes))
    .catch(error => { clip = null; throw error; });
  return clip;
}
