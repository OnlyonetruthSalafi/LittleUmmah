import type { Locale } from "@/i18n/config";
/*
  เสียงอ่านออกเสียงภาษาไทย สำหรับเด็กเล็กที่ยังอ่านหนังสือไม่ออก

  ใช้สองชั้น:
  1. ไฟล์เสียง (public/audio/th/<key>.mp3) — ใช้เมื่อมีไฟล์ที่ตรวจฟังแล้ว
  2. เสียงสังเคราะห์ของเบราว์เซอร์ — ใช้ไปก่อนระหว่างที่ยังไม่มีไฟล์อัด

  ไม่ใช่ดนตรี เป็นเสียงพูดล้วน จึงไม่ขัดข้อกำหนดข้อ 1.3 ใน AGENTS.md

  เสียงทุกชนิดผ่าน stopAllSpeech() จุดเดียว ไม่ว่าจะเป็นไฟล์อัดหรือเสียงสังเคราะห์
  เด็กกดรัวๆ หรือกดปิดเสียงกลางคัน จึงหยุดได้จริงทั้งสองทาง
*/

/** key ที่มีไฟล์เสียงอัดไว้แล้ว เพิ่มชื่อที่นี่เมื่อวางไฟล์ลง public/audio/th/ */
export const RECORDED_CLIPS = new Set<string>([
  'name-block-builders', 'game-block-builders', 'howto-block-builders',
  'build-support', 'build-retry', 'build-praise', 'build-cube', 'build-beam', 'build-roof', 'build-arch', 'build-cylinder', 'build-dome',
  'name-balance-scale', 'game-balance-scale', 'howto-balance-scale',
  'balance-left', 'balance-right', 'balance-equal', 'balance-retry', 'balance-correct', 'balance-compare',
  'name-coin-box', 'game-coin-box', 'howto-coin-box', 'coin-praise', 'coin-retry',
  ...Array.from({ length: 10 }, (_, i) => `coin-count-${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `coin-target-${i + 1}`),
  'name-bead-lacing', 'game-bead-lacing', 'howto-bead-lacing', 'bead-praise', 'bead-complete', 'bead-repeat', 'bead-hint-blue-circle', 'bead-hint-blue-square', 'bead-hint-blue-star', 'bead-hint-turquoise-circle', 'bead-hint-turquoise-square', 'bead-hint-turquoise-star', 'bead-hint-gold-circle', 'bead-hint-gold-square', 'bead-hint-gold-star', 'bead-hint-white-circle', 'bead-hint-white-square', 'bead-hint-white-star',
  // เสียงหุ่นยนต์ (ElevenLabs เสียง Leo + เอฟเฟคหุ่นยนต์) พูดไทยแล้วต่อด้วยอังกฤษ
  "hub-intro", "hub-intro-touch",
  "game-color-match", "game-shape-match", "game-memory", "game-puzzle",
  "game-arabic-match", "game-sequence", "game-find-object", "game-sort",
  "praise-correct-1", "praise-correct-2", "praise-correct-3",
  "praise-wrong-1", "praise-wrong-2", "praise-level-complete",
  // ชื่อเกาะสั้นๆ ตอนชี้เมาส์ในหน้ารวมเกม (ไทยอย่างเดียว)
  "name-color-match", "name-shape-match", "name-memory", "name-puzzle",
  "name-arabic-match", "name-sequence", "name-find-object", "name-sort",
  // ชื่อเกาะหมวดหมู่ในหน้าแรก (IslandCard, ValueBar) ไทยอย่างเดียว
  // cat-arabic อัดใหม่ 8 พ.ย. 2026 เป็น "เรียนภาษาเบื้องต้น" (ชื่อเกาะใหม่ หลังยุบเกาะภาษาไทย/อังกฤษเข้ามา)
  "cat-moral", "cat-stories", "cat-arabic", "cat-explore", "cat-games", "cat-art",
  // เสียงต้อนรับหน้าแรก อ่านเมื่อวงเกาะอยู่ในจอ ตัดทันทีเมื่อเด็กหมุนเกาะ (HeroVoice) — แทน "hero-tagline" เดิม 12 พ.ย. 2026
  "home-welcome",
  // เกมเขาวงกตแสง (scripts/make-lightmaze-voice.mjs) — เจ้าของโปรเจกต์ให้ลงได้เลยโดยไม่ต้องรอฟังก่อน
  // จะลองเล่นแล้วแจ้งแก้ทีหลัง (1 ต.ค. 2026)
  "game-light-maze", "name-light-maze",
  "orbmaze-star", "orbmaze-slow", "orbmaze-shield", "orbmaze-warp",
  "orbmaze-bump", "orbmaze-praise", "orbmaze-complete",
  // นับถอยหลังก่อนเริ่มเล่นทุกเกม (components/Countdown.tsx, scripts/make-game-voice.mjs)
  "count-3", "count-2", "count-1", "count-go",
  // หน้าบอกให้หมุนจอก่อนเล่นเกมแนวนอน (components/RotateGate.tsx)
  "rotate-phone",
]);

/** มีเสียงพูดเล่นอยู่ไหม ใช้กันเสียงอัตโนมัติไปตัดเสียงที่เด็กเพิ่งกดฟัง */
export function isSpeaking(): boolean {
  if (currentAudio && !currentAudio.paused && !currentAudio.ended) return true;
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking || window.speechSynthesis.pending;
}

let cachedVoice: SpeechSynthesisVoice | null = null;

/*
  ภาษาของหน้าปัจจุบัน — LocaleProvider ตั้งให้ ไฟล์เสียงอยู่ที่ public/audio/<ภาษา>/
  ทะเบียน RECORDED_CLIPS เป็นไฟล์ภาษาไทย ภาษาอื่นใช้เสียงสังเคราะห์จนกว่าจะอัดไฟล์ของภาษานั้น
*/
// import แค่ type: scripts/speech.test.mjs รันไฟล์นี้แยกโดยไม่มีตัว resolve "@/"
let speechLocale: Locale = "th";
const SYNTH_LANG: Record<Locale, string> = { th: "th-TH", en: "en-US" };

export function setSpeechLocale(locale: Locale) {
  if (locale === speechLocale) return;
  speechLocale = locale;
  cachedVoice = null;
}

/** มีไฟล์เสียงอัดของ key นี้ในภาษาปัจจุบันไหม */
export function hasRecordedClip(key: string): boolean {
  return speechLocale === "th" && RECORDED_CLIPS.has(key);
}
let currentAudio: HTMLAudioElement | null = null;
let currentClipKey: string | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

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
    voices.find((v) => v.lang?.toLowerCase().startsWith(speechLocale)) ?? null;
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
  currentUtterance = null;
  currentClipKey = null;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/** หยุดเสียงเฉพาะเมื่อเสียงที่กำลังเล่นเป็นของ key นี้ (ไฟล์อัด) หรือข้อความนี้ (เสียงสังเคราะห์) เสียงอื่นไม่โดนตัด */
export function stopSpeechIf(key: string, text: string) {
  if ((currentAudio && currentClipKey === key) || currentUtterance?.text === text) stopAllSpeech();
}

export function speakWithSynth(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    markSpeechBroken();
    return;
  }
  const synth = window.speechSynthesis;
  // Hover followed by a click should not restart the same word mid-sentence.
  if (
    currentUtterance?.text === text &&
    (synth.speaking || synth.pending)
  ) return;
  stopAllSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SYNTH_LANG[speechLocale];
  utterance.pitch = 1.6; // สูงขึ้นให้ใกล้เสียงเด็ก
  utterance.rate = 0.9; // ช้าลงให้เด็กเล็กตามทัน
  const voice = pickThaiVoice(synth);
  if (voice) utterance.voice = voice;
  currentUtterance = utterance;

  utterance.onend = () => {
    if (currentUtterance === utterance) currentUtterance = null;
  };

  utterance.onerror = (event) => {
    if (currentUtterance !== utterance) return;
    currentUtterance = null;
    // ถูกตัดกลางคันเพราะกดปุ่มถัดไป ไม่ใช่ความผิดพลาดของอุปกรณ์
    if (
      event.error === "canceled" ||
      event.error === "interrupted" ||
      event.error === "not-allowed"
    ) return;
    markSpeechBroken();
  };

  synth.speak(utterance);
}

/*
  เสียงพากย์นิทาน — ใช้ช่องเสียงเดียวกับเสียงพูดอื่น stopAllSpeech() (ปุ่มปิดเสียง หรือเสียงอื่นแทรก) จึงหยุดได้
  ต่างจาก playRecordedClip ตรงที่บอกผู้เรียกได้ว่าเล่นจบ หรือถูกหยุดกลางคัน หนังสือจะได้รู้ว่าควรพลิกหน้าหรือพัก
  คืนฟังก์ชันยกเลิก ซึ่งหยุดเสียงโดยไม่เรียก handler ใดๆ
*/
const NARRATION_STALL_MS = 8000;

export function playNarration(
  src: string,
  handlers: { onEnded: () => void; onStopped: () => void; onFail: () => void },
): () => void {
  stopAllSpeech();
  let cancelled = false;
  let failed = false;
  let stallTimer = 0;
  const audio = new Audio(src);
  currentAudio = audio;
  currentClipKey = src;
  audio.addEventListener("pause", () => {
    // pause ก่อนจบเท่านั้นที่นับว่าถูกหยุด ตอนเล่นจบเบราว์เซอร์ก็ส่ง pause มาเหมือนกัน
    if (!cancelled && !failed && !audio.ended) handlers.onStopped();
  });
  audio.addEventListener("ended", () => {
    window.clearTimeout(stallTimer);
    if (currentAudio === audio) {
      currentAudio = null;
      currentClipKey = null;
    }
    if (!cancelled) handlers.onEnded();
  });
  // เล่นไม่ได้ตั้งแต่ต้น (play reject) พังกลางทาง (error) หรือโหลดค้าง แจ้ง onFail ครั้งเดียว หนังสือ/การ์ตูนจะได้ไม่ค้าง
  const fail = () => {
    if (failed || cancelled || currentAudio !== audio) return;
    failed = true;
    window.clearTimeout(stallTimer);
    currentAudio = null;
    currentClipKey = null;
    // ไฟล์ที่โหลดช้ามาถึงทีหลังต้องไม่ดังทับฉากถัดไป
    audio.pause();
    handlers.onFail();
  };
  /*
    เน็ตชะงัก: เบราว์เซอร์ไม่ส่ง error แต่ค้างรอข้อมูลไปเรื่อยๆ
    ยังไม่เริ่มเล่น หรือหยุดรอข้อมูลกลางคัน นานเกิน NARRATION_STALL_MS = ถือว่าเล่นไม่ได้ ให้ผู้เรียกเดินต่อตามเวลา
  */
  const armStall = () => {
    window.clearTimeout(stallTimer);
    stallTimer = window.setTimeout(fail, NARRATION_STALL_MS);
  };
  audio.addEventListener("playing", () => window.clearTimeout(stallTimer));
  audio.addEventListener("waiting", armStall);
  audio.addEventListener("error", fail);
  armStall();
  void audio.play().catch(fail);
  return () => {
    cancelled = true;
    window.clearTimeout(stallTimer);
    if (currentAudio === audio) stopAllSpeech();
  };
}

/** เล่นไฟล์เสียงที่อัดไว้ ถ้าเล่นไม่ได้จึงค่อยเรียก onFail */
export function playRecordedClip(key: string, onFail: () => void) {
  if (currentAudio && currentClipKey === key) return;
  stopAllSpeech();
  const audio = new Audio(`/audio/${speechLocale}/${key}.mp3`);
  currentAudio = audio;
  currentClipKey = key;
  audio.addEventListener("ended", () => {
    if (currentAudio === audio) {
      currentAudio = null;
      currentClipKey = null;
    }
  });
  void audio.play().catch((error: unknown) => {
    // A stopped/replaced clip must never interrupt the newer one with fallback speech.
    if (currentAudio !== audio) return;
    currentAudio = null;
    currentClipKey = null;
    // Hover may be blocked until a real click unlocks browser audio.
    if (error instanceof DOMException && error.name === "NotAllowedError") return;
    onFail();
  });
}
