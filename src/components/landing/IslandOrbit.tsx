"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";

import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { IslandLockIcon } from "@/components/icons/IslandLockIcon";
import { afterScenePaint } from "@/components/performance/afterScenePaint";
import { HeroVoice, ORBIT_TURN_EVENT } from "@/components/landing/HeroVoice";
import { useSound } from "@/components/sound/SoundProvider";
import { fmt } from "@/i18n/dict";
import { LocaleLink as Link, useDict } from "@/i18n/LocaleProvider";
import { HOME_ISLANDS, type HomeIsland } from "@/lib/categories";
import "./island-orbit.css";
import { islandLockedLabel, useIslandNotice } from "./IslandNotice";

/*
  Hero "วงเกาะโคจร" — เจ้าของโปรเจกต์สั่งใช้จริง 9 พ.ย. 2026 (ต้นแบบ docs/prototypes/hero-orbit)
  เกาะทั้ง 10 (โซนเรียนรู้ 5 + โซนผจญภัย 5) วางบนวงรี ภาพหันหน้าเข้ากล้องเสมอ เกาะหลังเล็กและจางลง
  เกาะหน้าสุดแสดงชื่อ (ป้ายโซนเรียนรู้/ผจญภัยเอาออกแล้ว ไม่เหมาะกับ Hero — เจ้าของโปรเจกต์ 9 พ.ย. 2026)

  motion (ข้อ 2.1): หมุนเฉพาะเมื่อผู้ใช้สั่ง (ปัด ลูกศร คีย์บอร์ด แตะเกาะ) ไม่หมุนเอง ไม่ลอยวน
  prefers-reduced-motion: กระโดดไปตำแหน่งใหม่ทันที ไม่มี tween
  แตะเกาะที่ยังไม่อยู่หน้า = หมุนมาหน้าก่อน แตะซ้ำ = เข้าเกาะ (หรือขึ้นข้อความ "ยังไม่เปิด" ถ้าล็อก)

  ตำแหน่งคำนวณเป็นตัวเลขไร้หน่วย (sin/cos/scale) แล้วให้ CSS แปลงเป็นระยะจริงตามขนาดจอ (island-orbit.css)
  HTML ที่ render ฝั่ง server จึงตรงกับตอน hydrate โดยไม่ต้องวัดขนาดจอ · มือถือใช้เกาะเล็กลง (เจ้าของโปรเจกต์ 9 พ.ย. 2026)
*/
const ISLANDS: HomeIsland[] = [...HOME_ISLANDS.learn, ...HOME_ISLANDS.play];
const N = ISLANDS.length;
const STEP = 360 / N;
const TWEEN_MS = 520;

const norm = (a: number) => ((((a % 360) + 540) % 360) - 180);
const frontOf = (rot: number) => ((Math.round(-rot / STEP) % N) + N) % N;
/** บอก HeroVoice ว่าเกาะเริ่มหมุนแล้ว ให้ตัดเสียงต้อนรับทันที */
const announceTurn = () => window.dispatchEvent(new Event(ORBIT_TURN_EVENT));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function IslandOrbit() {
  const { t, sub, pick, pickSub } = useDict();
  const { speak } = useSound();
  const showNotice = useIslandNotice();
  const [rot, setRot] = useState(0);
  const [touched, setTouched] = useState(false);
  const rotRef = useRef(0);
  const anim = useRef(0);
  const drag = useRef<{ x: number; dx: number; rot: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const imagesReady = useRef(false);
  const preparingImages = useRef<Promise<void> | null>(null);
  const pendingTurn = useRef(0);
  const front = frontOf(rot);

  useEffect(() => afterScenePaint(() => {
    imagesReady.current = true;
  }, ".orbit-island img"), []);

  const apply = useCallback((value: number) => {
    rotRef.current = value;
    setRot(value);
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(anim.current);
    pendingTurn.current++;
    drag.current = null;
  }, []);

  // Cold loads can hydrate before the rear islands arrive. Promote them on
  // intent and decode once before moving; keep every existing img mounted.
  const prepareImages = useCallback(() => {
    if (imagesReady.current) return null;
    if (!preparingImages.current) {
      const images = [...(stage.current?.querySelectorAll("img") ?? [])];
      images.forEach(image => { image.fetchPriority = "high"; });
      // รอภาพไม่เกิน 2 วินาที ภาพที่ค้างต้องไม่ทำให้เด็กหมุนเกาะไม่ได้
      const waitAtMost = new Promise<void>(resolve => setTimeout(resolve, 2000));
      preparingImages.current = Promise.race([
        Promise.all(images.map(image => image.decode().catch(() => {}))).then(() => {}),
        waitAtMost,
      ]).then(() => { imagesReady.current = true; });
    }
    return preparingImages.current;
  }, []);

  const dragRotation = (d: { rot: number; dx: number }) =>
    d.rot + d.dx * (360 / Math.max((stage.current?.clientWidth ?? 600) * 1.6, 600));

  const tweenTo = useCallback(
    (target: number, onDone?: () => void) => {
      cancelAnimationFrame(anim.current);
      if (prefersReducedMotion()) {
        apply(target);
        onDone?.();
        return;
      }
      const from = rotRef.current;
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / TWEEN_MS);
        const e = 1 - Math.pow(1 - k, 3);
        apply(from + (target - from) * e);
        if (k < 1) anim.current = requestAnimationFrame(step);
        else onDone?.();
      };
      anim.current = requestAnimationFrame(step);
    },
    [apply],
  );

  /** หมุนให้เกาะ i มาอยู่หน้า แล้วอ่านชื่อเกาะ (เฉพาะเกาะที่เปิดแล้วมีไฟล์เสียง cat-*) */
  const goTo = useCallback(
    function turnTo(i: number) {
      setTouched(true);
      announceTurn();
      const ready = prepareImages();
      const intent = ++pendingTurn.current;
      if (ready) {
        void ready.then(() => { if (pendingTurn.current === intent) turnTo(i); });
        return;
      }
      const cur = frontOf(rotRef.current);
      let d = i - cur;
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;
      const island = ISLANDS[i];
      tweenTo(Math.round(rotRef.current / STEP) * STEP - d * STEP, () => {
        if (!island.comingSoon) speak(pick(island.name), `cat-${island.slug}`);
      });
    },
    [tweenTo, speak, pick, prepareImages],
  );
  const nudge = (dir: 1 | -1) => goTo((frontOf(rotRef.current) + dir + N) % N);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") { nudge(-1); event.preventDefault(); }
    if (event.key === "ArrowRight") { nudge(1); event.preventDefault(); }
  };

  /* ปัด/ลาก: หมุนตามนิ้ว ปล่อยแล้วหยุดที่เกาะใกล้สุด · ลากเกิน 6px ถือเป็นการปัด ไม่ใช่การแตะเกาะ */
  const onPointerDown = (event: PointerEvent) => {
    if ((event.target as HTMLElement).closest(".orbit-arrow")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    cancelAnimationFrame(anim.current);
    pendingTurn.current++;
    const d = { x: event.clientX, dx: 0, rot: rotRef.current, moved: false };
    drag.current = d;
  };
  const onPointerMove = (event: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.x;
    d.dx = dx;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      announceTurn();
      stage.current?.setPointerCapture(event.pointerId);
      const ready = prepareImages();
      if (ready) void ready.then(() => {
        if (drag.current === d && d.moved) apply(dragRotation(d));
      });
    }
    if (d.moved && imagesReady.current) apply(dragRotation(d));
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    goTo(frontOf(imagesReady.current ? rotRef.current : dragRotation(d)));
  };

  return (
    <section aria-labelledby="orbit-heading" className="island-orbit mx-auto w-full max-w-[96rem]">
      <h2 id="orbit-heading" className="sr-only">{t.islandOrbit.label}</h2>
      <div
        ref={stage}
        className="orbit-stage"
        data-touched={touched || undefined}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <HeroVoice />
        <ul className="orbit-ring">
          {ISLANDS.map((island, i) => {
            const a = norm(i * STEP + rot);
            const r = (a * Math.PI) / 180;
            const depth = (Math.cos(r) + 1) / 2; // 1 = หน้าสุด, 0 = หลังสุด
            const isFront = i === front;
            const style = {
              "--sx": Math.sin(r).toFixed(4),
              "--cy": Math.cos(r).toFixed(4),
              "--d": depth.toFixed(4), // ขนาด/ความจางคำนวณใน CSS ตามขนาดจอ (มือถือลดเกาะหลังแรงกว่า)
              zIndex: Math.round(depth * 100),
            } as CSSProperties;
            const label = `${pick(island.name)}${island.comingSoon ? ` — ${pick(islandLockedLabel)}` : ""} (${fmt(t.islandOrbit.position, { n: i + 1, total: N })})`;
            const onClick = (event: MouseEvent) => {
              if (suppressClick.current) { event.preventDefault(); return; }
              if (!isFront) { event.preventDefault(); goTo(i); return; }
              if (island.comingSoon) { showNotice(); return; }
              speak(pick(island.name), `cat-${island.slug}`);
            };
            const onFocus = (event: FocusEvent<HTMLElement>) => {
              // Tab ถึงเกาะไหน หมุนเกาะนั้นมาหน้า (เฉพาะโฟกัสจากคีย์บอร์ด การแตะจัดการใน onClick)
              if (!event.currentTarget.matches(":focus-visible")) return;
              if (!isFront) goTo(i);
              else pendingTurn.current++; // โฟกัสกลับเกาะหน้า = ยกเลิกการหมุนที่ยังรอภาพอยู่
            };
            const body = (
              <>
                <span className="orbit-art">
                  <Image src={island.image} alt="" width={900} height={900} sizes="(max-width: 639px) 50vw, 300px" loading="eager" fetchPriority="low" draggable={false} />
                  {island.comingSoon && <span className="orbit-lock"><IslandLockIcon /></span>}
                </span>
                <span className="orbit-caption" aria-hidden="true">
                  <span className="orbit-name font-display">{pick(island.name)}</span>
                  {sub && <span lang="en" className="orbit-name-sub font-display">{pickSub(island.name)}</span>}
                </span>
              </>
            );
            return (
              <li key={island.slug} className="orbit-island" data-slug={island.slug} data-front={isFront || undefined} style={style}>
                {island.href && !island.comingSoon ? (
                  <Link href={island.href} prefetchOnIntent aria-label={label} onClick={onClick} onFocus={onFocus} draggable={false} className="orbit-hit">
                    {body}
                  </Link>
                ) : (
                  <button type="button" data-coming-soon aria-label={label} onClick={onClick} onFocus={onFocus} className="orbit-hit">
                    {body}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <p className="orbit-hint" aria-hidden={touched || undefined}>{t.islandOrbit.hint}</p>
        <div className="orbit-controls">
          <button type="button" className="orbit-arrow" aria-label={t.islandOrbit.prev} onClick={() => nudge(-1)}>
            <ChevronRightIcon className="size-8 -scale-x-100" />
          </button>
          <button type="button" className="orbit-arrow" aria-label={t.islandOrbit.next} onClick={() => nudge(1)}>
            <ChevronRightIcon className="size-8" />
          </button>
        </div>
        <ol className="orbit-dots" aria-hidden="true">
          {ISLANDS.map((island, i) => <li key={island.slug} data-on={i === front || undefined} />)}
        </ol>
      </div>
    </section>
  );
}
