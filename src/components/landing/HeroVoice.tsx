"use client";

import { useEffect, useRef } from "react";

import { useSound } from "@/components/sound/SoundProvider";
import { isSpeaking } from "@/lib/speech";

const TEXT = "เรียนรู้ เล่นสนุก เติบโต";
const KEY = "hero-tagline";
// เห็นหัวข้ออย่างน้อยครึ่งหนึ่งถึงนับว่า "เลื่อนมาเจอ" แตะขอบจอเฉยๆ ยังไม่อ่าน
const VISIBLE_RATIO = 0.5;

/*
  หุ่นยนต์อ่านหัวข้อหน้าแรก "เรียนรู้ เล่นสนุก เติบโต — Learn, Play, Grow!" เมื่อหัวข้อเลื่อนเข้ามาในจอ

  - อ่านครั้งเดียวต่อการเข้ามาหนึ่งรอบ ต้องเลื่อนออกไปแล้วกลับมาใหม่ถึงอ่านอีก
  - ไม่อ่านทับเสียงอื่นที่กำลังเล่นอยู่ (เช่นชื่อเกาะที่เด็กเพิ่งชี้) และไม่อ่านตอนปิดเสียง
  - เบราว์เซอร์ไม่ยอมให้เล่นเสียงก่อนผู้ใช้โต้ตอบกับหน้า การเลื่อนจอไม่นับเป็นการโต้ตอบ
    ถ้ายังไม่เคยโต้ตอบ ให้รออ่านตอนแตะ/กดแป้นครั้งแรก
    แต่ไม่นับการแตะลิงก์หรือปุ่ม เช่นกดเกาะศิลปะ ต้องได้ยินชื่อเกาะนั้นอย่างเดียว ไม่มีหัวข้อแทรก
*/
export function HeroVoice() {
  const sentinel = useRef<HTMLSpanElement>(null);
  const { speak, enabled } = useSound();
  const speakRef = useRef(speak);
  const enabledRef = useRef(enabled);
  useEffect(() => {
    speakRef.current = speak;
    enabledRef.current = enabled;
  }, [speak, enabled]);

  useEffect(() => {
    const target = sentinel.current;
    if (!target || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    let waitingForInteraction = false;

    const say = () => {
      if (!visible || !enabledRef.current || document.hidden || isSpeaking()) return;
      speakRef.current(TEXT, KEY);
    };
    const stopWaiting = () => {
      waitingForInteraction = false;
      window.removeEventListener("pointerup", onFirstInteraction, true);
      window.removeEventListener("keydown", onFirstInteraction, true);
    };
    function onFirstInteraction(event: Event) {
      if (event.target instanceof Element && event.target.closest("a, button, [role='button'], input, select, textarea")) return;
      stopWaiting();
      say();
    }
    // เบราว์เซอร์ที่ไม่มี userActivation ถือว่าโต้ตอบแล้ว ถ้าโดนบล็อก playRecordedClip จะเงียบเอง
    const hasInteracted = () =>
      (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive ?? true;

    const observer = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting && entry.intersectionRatio >= VISIBLE_RATIO;
      if (inView && !visible) {
        visible = true;
        if (hasInteracted()) say();
        else if (!waitingForInteraction) {
          waitingForInteraction = true;
          window.addEventListener("pointerup", onFirstInteraction, true);
          window.addEventListener("keydown", onFirstInteraction, true);
        }
      } else if (!inView && visible) {
        visible = false;
      }
    }, { threshold: [0, VISIBLE_RATIO] });

    observer.observe(target);
    return () => {
      observer.disconnect();
      stopWaiting();
    };
  }, []);

  // ตัวจับตำแหน่งล่องหนเต็มพื้นที่หัวข้อ ไม่รับการแตะ ไม่กินที่ในหน้า
  return <span ref={sentinel} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20" />;
}
