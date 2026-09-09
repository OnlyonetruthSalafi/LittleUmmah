import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = ts.transpileModule(
  readFileSync(new URL("../src/lib/speech.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;

function setup() {
  const clips = [];
  const utterances = [];
  const synth = {
    speaking: false,
    pending: false,
    getVoices: () => [],
    cancel() { this.speaking = false; },
    speak(utterance) { this.speaking = true; utterances.push(utterance); },
  };
  class Audio {
    constructor(src) {
      this.src = src;
      clips.push(this);
    }
    addEventListener(name, callback) { this[name] = callback; }
    pause() { this.paused = true; }
    play() { return new Promise((resolve, reject) => { this.reject = reject; }); }
  }
  const exports = {};
  runInNewContext(source, {
    exports, Audio, DOMException,
    window: { speechSynthesis: synth },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
  });
  return { speech: exports, clips, utterances };
}

test("hover then click does not restart the current spoken label", () => {
  const { speech, utterances } = setup();
  speech.speakWithSynth("อัลกุรอาน");
  speech.speakWithSynth("อัลกุรอาน");
  assert.equal(utterances.length, 1);
  speech.speakWithSynth("เกม");
  assert.equal(utterances.length, 2);
});

test("same recorded label plays once, but can replay after ending", () => {
  const { speech, clips } = setup();
  speech.playRecordedClip("cat-quran", () => {});
  speech.playRecordedClip("cat-quran", () => {});
  assert.equal(clips.length, 1);
  clips[0].ended();
  speech.playRecordedClip("cat-quran", () => {});
  assert.equal(clips.length, 2);
});

test("replaced or muted clips cannot start late fallback speech", async () => {
  const { speech, clips } = setup();
  let failures = 0;
  speech.playRecordedClip("cat-quran", () => failures++);
  speech.playRecordedClip("cat-games", () => failures++);
  clips[0].reject(new Error("late failure"));
  speech.stopAllSpeech();
  clips[1].reject(new Error("muted"));
  await Promise.resolve();
  assert.equal(failures, 0);
  assert.ok(clips.every((clip) => clip.paused));
});

test("a missing active recording falls back", async () => {
  const { speech, clips } = setup();
  let failures = 0;
  speech.playRecordedClip("cat-quran", () => failures++);
  clips[0].reject(new Error("missing file"));
  await Promise.resolve();
  assert.equal(failures, 1);
});

test("autoplay blocking allows retry without reporting broken speech", async () => {
  const { speech, clips, utterances } = setup();
  let failures = 0;
  speech.playRecordedClip("cat-quran", () => failures++);
  clips[0].reject(new DOMException("gesture required", "NotAllowedError"));
  await Promise.resolve();
  assert.equal(failures, 0);
  speech.playRecordedClip("cat-quran", () => failures++);
  assert.equal(clips.length, 2);
  speech.speakWithSynth("อัลกุรอาน");
  utterances[0].onerror({ error: "not-allowed" });
  assert.equal(speech.getSpeechBrokenSnapshot(), false);
  speech.speakWithSynth("อัลกุรอาน");
  assert.equal(utterances.length, 2);
});
