"use client";

import { useDict } from "@/i18n/LocaleProvider";

import { useEffect, useRef } from "react";

import { useSound } from "@/components/sound/SoundProvider";
import { isSpeaking, stopSpeechIf } from "@/lib/speech";

const KEY = "home-welcome";
// เห็นวงเกาะอย่างน้อยครึ่งหนึ่งถึงนับว่า "เลื่อนมาเจอ" แตะขอบจอเฉยๆ ยังไม่อ่าน
const VISIBLE_RATIO = 0.5;
/** IslandOrbit ส่ง event นี้ทุกครั้งที่เกาะเริ่มหมุน (ปัด ลูกศร แตะเกาะข้างหลัง คีย์บอร์ด) */
export const ORBIT_TURN_EVENT = "orbit-turn";

/*
  หุ่นยนต์ต้อนรับในหน้าแรก (เจ้าของโปรเจกต์สั่ง 12 พ.ย. 2026 แทนเสียง "Learn, Play, Grow" เดิม)
  "อัสสลามุอะลัยกุม ยินดีต้อนรับเข้าสู่ Little Ummah อุมมะฮ์ตัวน้อยในวันนี้ คือผู้ใหญ่ในวันหน้า
   ปัดซ้าย ขวา เพื่อเลื่อนดูเกาะต่างๆ นะ" — วางไว้ในวงเกาะ จึงอ่านเมื่อวงเกาะอยู่ในจอ

  - อ่านครั้งเดียวต่อการเข้ามาหนึ่งรอบ ต้องเลื่อนออกไปแล้วกลับมาใหม่ถึงอ่านอีก
  - **เด็กหมุนเกาะเมื่อไร ตัดเสียงทันที** และไม่อ่านอีกจนกว่าจะโหลดหน้าใหม่ (เด็กรู้วิธีหมุนแล้ว)
  - ไม่อ่านทับเสียงอื่นที่กำลังเล่นอยู่ (เช่นชื่อเกาะที่เด็กเพิ่งชี้) และไม่อ่านตอนปิดเสียง
  - เบราว์เซอร์ไม่ยอมให้เล่นเสียงก่อนผู้ใช้โต้ตอบกับหน้า การเลื่อนจอไม่นับเป็นการโต้ตอบ
    ถ้ายังไม่เคยโต้ตอบ ให้รออ่านตอนแตะ/กดแป้นครั้งแรก
    แต่ไม่นับการแตะลิงก์หรือปุ่ม เช่นกดเกาะศิลปะ ต้องได้ยินชื่อเกาะนั้นอย่างเดียว ไม่มีเสียงต้อนรับแทรก
*/
export function HeroVoice() {
  const { t } = useDict();
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
    const text = t.hero.speech;
    let visible = false;
    let waitingForInteraction = false;
    let dismissed = false;

    const say = () => {
      if (dismissed || !visible || !enabledRef.current || document.hidden || isSpeaking()) return;
      speakRef.current(text, KEY);
    };
    const stopWaiting = () => {
      waitingForInteraction = false;
      window.removeEventListener("pointerup", onFirstInteraction, true);
      window.removeEventListener("keydown", onFirstInteraction, true);
    };
    function onFirstInteraction(event: Event) {
      if (event.target instanceof Element && event.target.closest("a, button, [role='button'], input, select, textarea")) return;
      stopWaiting();
      // ปล่อยนิ้วหลังปัดเกาะ: ให้ event หมุนเกาะ (ส่งตอนเริ่มลาก) ตัดสินก่อน จะได้ไม่เริ่มเสียงแล้วโดนตัด
      if (event.target instanceof Element && event.target.closest(".orbit-stage")) setTimeout(say, 0);
      else say();
    }
    const onTurn = () => {
      dismissed = true;
      stopWaiting();
      stopSpeechIf(KEY, text);
    };
    // เบราว์เซอร์ที่ไม่มี userActivation ถือว่าโต้ตอบแล้ว ถ้าโดนบล็อก playRecordedClip จะเงียบเอง
    const hasInteracted = () =>
      (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive ?? true;

    const observer = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting && entry.intersectionRatio >= VISIBLE_RATIO;
      if (inView && !visible) {
        visible = true;
        if (hasInteracted()) say();
        else if (!waitingForInteraction && !dismissed) {
          waitingForInteraction = true;
          window.addEventListener("pointerup", onFirstInteraction, true);
          window.addEventListener("keydown", onFirstInteraction, true);
        }
      } else if (!inView && visible) {
        visible = false;
      }
    }, { threshold: [0, VISIBLE_RATIO] });

    observer.observe(target);
    window.addEventListener(ORBIT_TURN_EVENT, onTurn);
    return () => {
      observer.disconnect();
      stopWaiting();
      window.removeEventListener(ORBIT_TURN_EVENT, onTurn);
    };
  }, [t.hero.speech]);

  // ตัวจับตำแหน่งล่องหนเต็มพื้นที่วงเกาะ ไม่รับการแตะ ไม่กินที่ในหน้า
  return <span ref={sentinel} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20" />;
}
