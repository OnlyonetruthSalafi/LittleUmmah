/*
  เสียงอ่านออกเสียงภาษาไทย สำหรับเด็กเล็กที่ยังอ่านหนังสือไม่ออก

  ใช้สองชั้น:
  1. ไฟล์เสียงที่อัดไว้จริง (public/audio/th/<key>.mp3) — คุณภาพดีที่สุด เป็นเสียงเด็กผู้ชายจริง
  2. เสียงสังเคราะห์ของเบราว์เซอร์ — ใช้ไปก่อนระหว่างที่ยังไม่มีไฟล์อัด

  ไม่ใช่ดนตรี เป็นเสียงพูดล้วน จึงไม่ขัดข้อกำหนดข้อ 1.3 ใน AGENTS.md

  เสียงทุกชนิดผ่าน stopAllSpeech() จุดเดียว ไม่ว่าจะเป็นไฟล์อัดหรือเสียงสังเคราะห์
  เด็กกดรัวๆ หรือกดปิดเสียงกลางคัน จึงหยุดได้จริงทั้งสองทาง
*/

/** key ที่มีไฟล์เสียงอัดไว้แล้ว เพิ่มชื่อที่นี่เมื่อวางไฟล์ลง public/audio/th/ */
export const RECORDED_CLIPS = new Set<string>([]);

let cachedVoice: SpeechSynthesisVoice | null = null;
let currentAudio: HTMLAudioElement | null = null;

/*
  สถานะ "อุปกรณ์นี้อ่านออกเสียงไม่ได้"
  จำเป็นต้องรู้ เพราะถ้าเครื่องไม่มีเสียงไทย ปุ่มจะขึ้นว่าเปิดเสียงอยู่แต่เงียบสนิท
  ซึ่งเป็นกรณีที่แย่ที่สุดสำหรับเด็กที่อ่านหนังสือไม่ออก
*/
let speechBroken = false;
const brokenListeners = new Set<() => void>();

export function subscribeSpeechBroken(onChange: () => void) {
  brokenListeners.add(onChange);
  return () => {
    brokenListeners.delete(onChange);
  };
}

export function getSpeechBrokenSnapshot(): boolean {
  return speechBroken;
}

export function getSpeechBrokenServerSnapshot(): boolean {
  return false;
}

function markSpeechBroken() {
  if (speechBroken) return;
  speechBroken = true;
  for (const listener of brokenListeners) listener();
}

function pickThaiVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = synth.getVoices();
  if (voices.length === 0) return null;
  cachedVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith("th")) ?? null;
  return cachedVoice;
}

/** เรียกครั้งเดียวตอนโหลดหน้า — Chrome คืนรายการเสียงเป็นค่าว่างในครั้งแรก */
export function warmUpVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    markSpeechBroken();
    return;
  }
  const synth = window.speechSynthesis;
  pickThaiVoice(synth);
  synth.addEventListener("voiceschanged", () => {
    cachedVoice = null;
    pickThaiVoice(synth);
  });
}

export function stopAllSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function speakWithSynth(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    markSpeechBroken();
    return;
  }
  const synth = window.speechSynthesis;
  stopAllSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "th-TH";
  utterance.pitch = 1.6; // สูงขึ้นให้ใกล้เสียงเด็ก
  utterance.rate = 0.9; // ช้าลงให้เด็กเล็กตามทัน
  const voice = pickThaiVoice(synth);
  if (voice) utterance.voice = voice;

  utterance.onerror = (event) => {
    // ถูกตัดกลางคันเพราะกดปุ่มถัดไป ไม่ใช่ความผิดพลาดของอุปกรณ์
    if (event.error === "canceled" || event.error === "interrupted") return;
    markSpeechBroken();
  };

  synth.speak(utterance);
}

/** เล่นไฟล์เสียงที่อัดไว้ ถ้าเล่นไม่ได้จึงค่อยเรียก onFail */
export function playRecordedClip(key: string, onFail: () => void) {
  stopAllSpeech();
  const audio = new Audio(`/audio/th/${key}.mp3`);
  currentAudio = audio;
  audio.addEventListener("ended", () => {
    if (currentAudio === audio) currentAudio = null;
  });
  void audio.play().catch(() => {
    if (currentAudio === audio) currentAudio = null;
    onFail();
  });
}
