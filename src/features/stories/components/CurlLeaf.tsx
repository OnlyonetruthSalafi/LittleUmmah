"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  แผ่นกระดาษที่โค้งตอนพลิก (หนังสือแบบอลังการ)

  แผ่นถูกหั่นเป็นแถบแนวตั้ง STRIPS แถบ ซ้อนกันเป็นลูกโซ่ (แถบถัดไปอยู่ในแถบก่อนหน้า ติดขอบด้านนอก)
  แต่ละแถบหมุน rotateY เทียบกับแถบก่อนหน้า มุมรวมของแถบนอกสุดจึงต่างจากแถบที่ติดสัน = กระดาษโค้ง
  ช่วงแรกขอบกระดาษยกนำก่อน (เหมือนนิ้วจับมุมหน้า) ช่วงหลังขอบลากตามหลังแล้วค่อยวางลงเรียบ

  ทุกแถบแสดงเนื้อหาชิ้นเดียวกันทั้งแผ่น แต่เลื่อนให้เห็นเฉพาะส่วนของตัวเอง
  ด้านหลังแผ่น (หน้าใหม่) อยู่ในหน้าที่หมุน 180 องศา เมื่อพลิกจบจึงอ่านได้ตรงทิศ

  rigid = ปกแข็ง ไม่โค้ง หมุนเป็นแผ่นเดียวสองด้าน ไม่หั่นเป็นแถบ มีสันปกหนาที่ขอบนอก
  (ปกที่หั่น 12 แถบเห็นริ้วขาวตรงรอยต่อบางขนาดจอ เจ้าของโปรเจกต์เห็น 7 ต.ค. 2026)
  อัปเดต transform ตรงที่ DOM ทุกเฟรม ไม่ re-render React ระหว่างพลิก
  ผู้ที่ปิดการเคลื่อนไหวไม่เห็นแผ่นนี้เลย (StoryBook ข้ามการพลิก)
*/

const STRIPS = 12;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
/** โค้งระฆังครึ่งคลื่น sin ระหว่าง a..b นอกช่วงเป็น 0 */
const bump = (p: number, a: number, b: number) => (p <= a || p >= b ? 0 : Math.sin((Math.PI * (p - a)) / (b - a)));

/** มุมของแถบ k (องศา ลบ = พลิกไปทางซ้าย) ที่ความคืบหน้า p */
function stripAngle(k: number, p: number) {
  const base = -180 * ease(p);
  const t = k / (STRIPS - 1);
  // ขอบนอกนำ (ค่าลบ) ช่วงต้น แล้วลากตาม (ค่าบวก) ช่วงกลางถึงท้าย
  const edge = -40 * bump(p, 0, 0.4) + 60 * bump(p, 0.2, 1);
  return clamp(base + edge * t ** 1.4, -180, 0);
}

export function CurlLeaf({
  dir,
  duration,
  rigid,
  front,
  back,
  onDone,
}: {
  dir: "fwd" | "back";
  duration: number;
  rigid: boolean;
  /** เนื้อหาเต็มแผ่นของด้านหน้า (หน้าเดิม) และด้านหลัง (หน้าใหม่) */
  front: ReactNode;
  back: ReactNode;
  onDone: () => void;
}) {
  const strips = useRef<(HTMLDivElement | null)[]>([]);
  const frontShades = useRef<(HTMLDivElement | null)[]>([]);
  const backShades = useRef<(HTMLDivElement | null)[]>([]);
  const castShadow = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const sign = dir === "fwd" ? 1 : -1;
    let raf = 0;
    let start = 0;
    const frame = (now: number) => {
      start ||= now;
      const p = clamp((now - start) / duration, 0, 1);
      if (rigid) {
        const a = -180 * ease(p);
        if (panel.current) panel.current.style.transform = `translateZ(1px) rotateY(${sign * a}deg)`;
        const dark = `rgb(20 14 6 / ${(0.3 * Math.sin((-a * Math.PI) / 180)).toFixed(3)})`;
        if (frontShades.current[0]) frontShades.current[0].style.background = dark;
        if (backShades.current[0]) backShades.current[0].style.background = dark;
        if (castShadow.current) castShadow.current.style.opacity = String(Math.sin(Math.PI * p) * 0.5);
        if (p < 1) raf = requestAnimationFrame(frame);
        else done.current();
        return;
      }
      const angles = Array.from({ length: STRIPS }, (_, k) => stripAngle(k, p));
      // ความมืดตามมุมที่กระดาษตั้งขึ้น ใช้ค่ามุมที่ "ขอบ" แถบ (เฉลี่ยกับแถบข้างๆ)
      const shade = (a: number) => (0.3 * Math.sin((-a * Math.PI) / 180)).toFixed(3);
      for (let k = 0; k < STRIPS; k++) {
        const a = angles[k];
        const el = strips.current[k];
        // ยกแผ่น 1px ก่อนหมุน — ถ้ายกหลังหมุน พอพลิกครบ 180° แผ่นจะจมใต้กระดาษ 1px ชนกับภาพเล่ม เห็นเป็นริ้ว/แถบครีม
        if (el) el.style.transform = `${k === 0 ? "translateZ(1px) " : ""}rotateY(${sign * (a - (angles[k - 1] ?? 0))}deg)`;
        /*
          เงาไล่ระดับต่อเนื่องจากขอบฝั่งสันไปขอบฝั่งนอกของแต่ละแถบ ค่าที่ขอบตรงกับแถบข้างๆ พอดี
          ถ้าใช้สีเรียบแถบละค่า ความมืดจะกระโดดเป็นขั้นตรงรอยต่อ เห็นเป็นริ้ว (เจ้าของโปรเจกต์เห็นใน Chrome 5 ต.ค. 2026)
          ด้านหลังหมุน 180 องศา แกนซ้าย-ขวาในตัวกลับด้าน ทิศของเงาจึงสลับ
        */
        const inner = shade(k === 0 ? a : (angles[k - 1] + a) / 2);
        const outer = shade(k === STRIPS - 1 ? a : (a + angles[k + 1]) / 2);
        const gradient = (deg: number) => `linear-gradient(${deg}deg, rgb(20 14 6 / ${inner}), rgb(20 14 6 / ${outer}))`;
        const f = frontShades.current[k];
        const b = backShades.current[k];
        if (f) f.style.background = gradient(dir === "fwd" ? 90 : 270);
        if (b) b.style.background = gradient(dir === "fwd" ? 270 : 90);
      }
      if (castShadow.current) castShadow.current.style.opacity = String(Math.sin(Math.PI * p) * 0.65);
      if (p < 1) raf = requestAnimationFrame(frame);
      else done.current();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [dir, duration, rigid]);

  if (rigid) {
    return (
      <>
        <div ref={castShadow} className="sb-cast" data-dir={dir} aria-hidden="true" />
        <div className="sb-curl" data-dir={dir} aria-hidden="true">
          <div ref={panel} className="sb-board-leaf">
            <div className="sb-board-face">
              {front}
              <div
                className="sb-strip-shade"
                ref={(el) => {
                  frontShades.current[0] = el;
                }}
              />
            </div>
            <div className="sb-board-face sb-strip-back">
              {back}
              <div
                className="sb-strip-shade"
                ref={(el) => {
                  backShades.current[0] = el;
                }}
              />
            </div>
            {/* ความหนาของปก: แผ่นแคบตั้งฉากที่ขอบนอก เห็นตอนปกยกขึ้น */}
            <div className="sb-board-edge" />
          </div>
        </div>
      </>
    );
  }

  // แถบซ้อนกันเป็นลูกโซ่: สร้างจากแถบนอกสุดเข้าหาสัน
  let chain: ReactNode = null;
  for (let k = STRIPS - 1; k >= 0; k--) {
    const frontOffset = dir === "fwd" ? k : STRIPS - 1 - k;
    const backOffset = dir === "fwd" ? STRIPS - 1 - k : k;
    chain = (
      <div
        className="sb-strip"
        data-first={k === 0 || undefined}
        ref={(el) => {
          strips.current[k] = el;
        }}
      >
        <div className="sb-strip-face">
          <div className="sb-strip-content" style={{ left: `calc(${-frontOffset} * (100% - 2px))` }}>
            {front}
          </div>
          <div
            className="sb-strip-shade"
            ref={(el) => {
              frontShades.current[k] = el;
            }}
          />
        </div>
        <div className="sb-strip-face sb-strip-back">
          <div className="sb-strip-content" style={{ left: `calc(${-backOffset} * (100% - 2px))` }}>
            {back}
          </div>
          <div
            className="sb-strip-shade"
            ref={(el) => {
              backShades.current[k] = el;
            }}
          />
        </div>
        {chain}
      </div>
    );
  }

  return (
    <>
      {/* เงาที่แผ่นทอดลงบนหน้าใต้แผ่น */}
      <div ref={castShadow} className="sb-cast" data-dir={dir} aria-hidden="true" />
      <div className="sb-curl" data-dir={dir} style={{ "--strips": STRIPS } as React.CSSProperties} aria-hidden="true">
        {chain}
      </div>
    </>
  );
}
