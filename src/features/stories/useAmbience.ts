"use client";

import { useCallback, useEffect, useRef } from "react";

/*
  เสียงบรรยากาศวนซ้ำใต้เสียงพากย์ (คลื่น ลม ฝน ใต้น้ำ) — sound effect ไม่ใช่ดนตรี (ข้อ 1.3)

  ใช้ Web Audio แยกจากช่องเสียงพูดใน lib/speech.ts โดยตั้งใจ:
  - ไม่ไปแตะ currentAudio ของเสียงพากย์ หนังสือจึงไม่เข้าใจผิดว่าเสียงพากย์ถูกตัด (onStopped)
  - AudioBufferSourceNode วนซ้ำได้ไม่มีช่องเงียบ และค่อยๆ เฟดข้ามเมื่อเปลี่ยนฉาก
  ไฟล์โหลดไม่ได้ (ยังไม่มี หรือเครือข่ายล่ม) ก็เงียบไปเฉยๆ ไม่กระทบการเล่านิทาน
*/

const LEVEL = 0.28;
const FADE_S = 0.9;

type Playing = { src: string; node: AudioBufferSourceNode; gain: GainNode };

/**
  คืน unlock() ให้เรียกใน handler ที่เด็กแตะโดยตรง — Safari บน iPad ยอมให้ AudioContext เริ่มเล่น
  เฉพาะเมื่อสร้าง/resume ภายใน event ของการแตะ ถ้าทำใน effect ทีหลังอาจเงียบ
*/
export function useAmbience(src: string | null, on: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const buffers = useRef(new Map<string, Promise<AudioBuffer | null>>());
  const playing = useRef<Playing | null>(null);

  useEffect(() => {
    const want = on ? src : null;
    if (playing.current?.src === want) return;

    const fadeOut = (p: Playing | null) => {
      if (!p || !ctxRef.current) return;
      const t = ctxRef.current.currentTime;
      p.gain.gain.cancelScheduledValues(t);
      p.gain.gain.setValueAtTime(p.gain.gain.value, t);
      p.gain.gain.linearRampToValueAtTime(0, t + FADE_S);
      p.node.stop(t + FADE_S + 0.05);
    };
    fadeOut(playing.current);
    playing.current = null;
    if (!want) return;

    // สร้างหลังเด็กแตะจอแล้วเท่านั้น (on = started) เบราว์เซอร์จึงยอมให้เล่น
    const ctx = (ctxRef.current ??= new AudioContext());
    void ctx.resume().catch(() => {});
    let load = buffers.current.get(want);
    if (!load) {
      load = fetch(want)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
        .then((data) => ctx.decodeAudioData(data))
        .catch(() => null);
      buffers.current.set(want, load);
    }

    let cancelled = false;
    void load.then((buffer) => {
      if (cancelled || !buffer) return;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(LEVEL, ctx.currentTime + FADE_S);
      gain.connect(ctx.destination);
      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.loop = true;
      // วนทั้งไฟล์ — Chrome ตัดช่วงเงียบของ encoder ให้แล้ว (วัด 4 ต.ค. 2026: ยาว 6.100 วินาทีพอดี หัวท้ายไม่เงียบ)
      node.connect(gain);
      node.start();
      playing.current = { src: want, node, gain };
    });
    return () => {
      cancelled = true;
    };
  }, [src, on]);

  const unlock = useCallback(() => {
    if (typeof AudioContext === "undefined") return;
    const ctx = (ctxRef.current ??= new AudioContext());
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  }, []);

  useEffect(
    () => () => {
      void ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      playing.current = null;
    },
    [],
  );
  return unlock;
}
