'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useSound } from '@/components/sound/SoundProvider';

export type SfxSet<K extends string> = Record<K, { file: string; volume: number }>;

/** สั่งเล่นตอนไฟล์ยังโหลดไม่เสร็จ (เช่น ติ๊กแรกของการนับถอยหลัง) จะเล่นให้เมื่อโหลดเสร็จ ถ้าช้าไม่เกินนี้ */
const LATE_MS = 400;

/*
  เสียงเอฟเฟคที่เล่นถี่และซ้อนกันได้ (เช่น เก็บเม็ดแสงติดกันหลายเม็ด) ใช้ Web Audio
  ถอดไฟล์ครั้งเดียวแล้วสร้าง source ใหม่ทุกครั้ง เสียงซ้อนกันได้โดยไม่ตัดกันและไม่หน่วง
  ต่างจาก useGameAudio ที่ใช้ <audio> ตัวเดียวต่อเสียง (เล่นซ้ำจะตัดเสียงเดิม)

  เคารพปุ่มเสียงของเว็บ (useSound().enabled) — ทุกเสียงผ่าน master gain ตัวเดียว
  กดปิดเสียงกลางคันแล้วเสียงที่กำลังดังอยู่เงียบทันที
  sfx ต้องเป็นค่าคงที่นอก component ไม่งั้นจะโหลดไฟล์ใหม่ทุกครั้งที่ render
*/
export function useSfx<K extends string>(sfx: SfxSet<K>) {
  const { enabled } = useSound();
  const on = useRef(enabled);
  const ctx = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const buffers = useRef(new Map<K, AudioBuffer>());
  const pending = useRef(new Map<K, number>());
  useEffect(() => {
    on.current = enabled;
    if (master.current) master.current.gain.value = enabled ? 1 : 0;
  }, [enabled]);

  const start = useCallback((key: K) => {
    const ac = ctx.current, out = master.current, buffer = buffers.current.get(key);
    if (!ac || !out || !buffer) return;
    // เบราว์เซอร์ให้ AudioContext เริ่มแบบพักจนกว่าผู้ใช้จะแตะหน้าจอ — เกมเริ่มจากปุ่มที่เด็กกด จึงปลุกได้
    if (ac.state === 'suspended') void ac.resume().catch(() => {});
    const source = ac.createBufferSource(), gain = ac.createGain();
    source.buffer = buffer;
    gain.gain.value = sfx[key].volume;
    source.connect(gain).connect(out);
    source.start();
  }, [sfx]);

  useEffect(() => {
    if (typeof AudioContext === 'undefined') return;
    const ac = new AudioContext(), out = ac.createGain();
    out.gain.value = on.current ? 1 : 0;
    out.connect(ac.destination);
    ctx.current = ac; master.current = out;
    const loaded = buffers.current, waiting = pending.current;
    let alive = true;
    for (const key of Object.keys(sfx) as K[]) {
      // ไฟล์ไหนโหลดไม่ได้ก็เงียบไปเฉพาะเสียงนั้น เกมยังเล่นได้
      fetch(sfx[key].file).then(r => r.arrayBuffer()).then(data => ac.decodeAudioData(data)).then(buffer => {
        if (!alive) return;
        loaded.set(key, buffer);
        const asked = waiting.get(key);
        waiting.delete(key);
        if (asked !== undefined && on.current && performance.now() - asked < LATE_MS) start(key);
      }).catch(() => {});
    }
    return () => {
      alive = false; loaded.clear(); waiting.clear();
      ctx.current = null; master.current = null;
      void ac.close().catch(() => {});
    };
  }, [sfx, start]);

  return useCallback((key: K) => {
    if (!on.current) return;
    if (!buffers.current.has(key)) { pending.current.set(key, performance.now()); return; }
    start(key);
  }, [start]);
}
