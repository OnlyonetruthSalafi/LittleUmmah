"use client";

import { LearningNotice } from "@/features/learning-stars/components";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { PauseIcon } from "@/components/icons/PauseIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";
import { ReplayIcon } from "@/components/icons/ReplayIcon";
import { ArabicText } from "@/components/ui/ArabicText";
import { fmt } from "@/i18n/dict";
import { useDict } from "@/i18n/LocaleProvider";
import type { Lesson } from "@/lib/lessons";
import { stopAllSpeech } from "@/lib/speech";
import { getSoundSnapshot } from "@/lib/soundStore";

import { filmPaths, type Film } from "../film";

/*
  เครื่องเล่นการ์ตูนเต็มเรื่อง (film.ts) — ใช้แทน CartoonLesson ในบทที่มีการ์ตูนแล้ว

  - เปิดจากการแตะการ์ด จึงเล่นพร้อมเสียงได้ทันที ยกเว้นเครื่องที่ตั้งลดการเคลื่อนไหว: แสดงภาพปก รอเด็กกดเล่นเอง
  - วิดีโอโหลดเมื่อเปิดหน้าต่างนี้เท่านั้น จอแคบใช้ 720p จอกว้าง 1080p (<source media>) จาก Cloudflare R2 (film.ts)
  - คำบรรยายเป็นไฟล์ WebVTT แสดงเป็นข้อความจริงใต้ภาพ (ไม่ฝังในวิดีโอ — ข้อ 1.5) พร้อมชื่อผู้พูด
  - ถึงตาเด็กพูด: วิดีโอหยุดเอง ขึ้นป้ายคำ เด็กกด "หนูพูดแล้ว" แล้วนูรีตอบ (ไม่ใช้ไมโครโฟน ไม่เก็บเสียงเด็ก)
  - ปุ่มทุกปุ่ม 64px (ข้อ 2) ไม่ใช้แถบควบคุมของเบราว์เซอร์ ไม่มีภาพซ้อนภาพ ไม่มีดาวน์โหลด
  - ปิดเสียงทั้งเว็บอยู่ = เล่นแบบไม่มีเสียง อ่านคำบรรยายได้ · สลับแท็บ = พักเอง
  - ดาว: ดูจนจบโดยดูจริงอย่างน้อย 90% ของเรื่อง (ข้ามไปท้ายเรื่องไม่นับ)
*/
type Status = "idle" | "playing" | "paused" | "turn" | "ended";

/* ภาพถ่ายสัตว์จริง: เด็กกด "ดูต่อ" เองได้ หรือรอให้นับถอยหลังจบแล้วเล่นต่อเอง (เจ้าของโปรเจกต์สั่ง 13 พ.ย. 2026) */
const PHOTO_WAIT = 6;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

function watchedSeconds(v: HTMLVideoElement) {
  let s = 0;
  for (let i = 0; i < v.played.length; i++) s += v.played.end(i) - v.played.start(i);
  return s;
}

export function FilmLesson({
  lesson,
  film,
  onClose,
  onFinish,
}: {
  lesson: Pick<Lesson, "title">;
  film: Film;
  onClose: () => void;
  onFinish?: () => void;
}) {
  const { locale, t, sub, pick, pickSub } = useDict();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLButtonElement>(null);
  const still = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const [status, setStatus] = useState<Status>("idle");
  const [turn, setTurn] = useState(-1);
  const [line, setLine] = useState<{ who: string; text: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const turnsDone = useRef(new Set<number>());
  const [left, setLeft] = useState(PHOTO_WAIT);
  const { base, video } = filmPaths(film);
  const captionLang = film.captions.includes(locale as "th" | "en") ? locale : film.captions[0];

  useEffect(() => {
    stopAllSpeech();
    dialogRef.current?.showModal();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !getSoundSnapshot();
    if (!getReducedMotion()) v.play().catch(() => setStatus("paused"));
  }, []);

  // คำบรรยาย: ฟังการเปลี่ยนบรรทัดแล้ววาดเองใต้ภาพ (ตัวใหญ่ อ่านง่าย มีชื่อผู้พูด)
  useEffect(() => {
    const v = videoRef.current;
    const track = v?.textTracks[0];
    if (!track) return;
    const onCue = () => {
      const cue = track.activeCues?.[0] as VTTCue | undefined;
      if (!cue) return setLine(null);
      const m = cue.text.match(/^<v ([^>]+)>([\s\S]*)$/);
      setLine(m ? { who: m[1], text: m[2] } : { who: "", text: cue.text });
    };
    track.addEventListener("cuechange", onCue);
    return () => track.removeEventListener("cuechange", onCue);
  }, []);

  // ตาเด็กพูด: เช็กทุกเฟรมระหว่างเล่น (timeupdate ช้าเกินไป หยุดเลยจุดได้)
  useEffect(() => {
    if (status !== "playing") return;
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v) {
        setProgress(v.currentTime / (v.duration || film.duration));
        const i = film.turns.findIndex((tr, k) => !turnsDone.current.has(k) && v.currentTime >= tr.at && v.currentTime < tr.resumeAt);
        if (i >= 0) {
          v.pause();
          turnsDone.current.add(i);
          setTurn(i);
          setStatus("turn");
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, film]);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden) videoRef.current?.pause();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !getSoundSnapshot();
    if (status === "ended") {
      turnsDone.current.clear();
      v.currentTime = 0;
    }
    v.play().catch(() => {});
  }, [status]);

  const saidIt = () => {
    const v = videoRef.current;
    if (!v || turn < 0) return;
    v.currentTime = film.turns[turn].resumeAt;
    setTurn(-1);
    setLeft(PHOTO_WAIT);
    v.play().catch(() => {});
  };

  const back = () => {
    const v = videoRef.current;
    if (!v) return;
    const to = Math.max(0, v.currentTime - 5);
    // ย้อนกลับไปก่อนช่วงพูดตาม = ให้เด็กได้พูดอีกรอบ
    film.turns.forEach((tr, k) => { if (to < tr.at) turnsDone.current.delete(k); });
    v.currentTime = to;
    setProgress(to / (v.duration || film.duration));
    // ย้อนจากช่วงพูดตามหรือการ์ดจบ = ปิดป้ายนั้น กลับเป็นพักไว้ (กดเล่นต่อได้)
    if (status === "turn" || status === "ended") {
      setTurn(-1);
      setLeft(PHOTO_WAIT);
      setStatus("paused");
    }
  };

  const word = turn >= 0 ? film.turns[turn].word ?? null : null;
  const photo = turn >= 0 ? film.turns[turn].photo ?? null : null;
  const playing = status === "playing";
  // ภาพถ่ายขึ้นมา: ย้ายโฟกัสไปปุ่ม "ดูต่อ" (ผู้ใช้คีย์บอร์ดกด Enter ต่อได้เลย)
  useEffect(() => {
    if (photo) mainRef.current?.focus();
  }, [photo]);
  // นับถอยหลังระหว่างแสดงภาพถ่าย ครบแล้วเล่นต่อเอง (ย้อน 5 วินาทีหรือกดดูต่อ = ยกเลิกการนับ)
  const saidItRef = useRef(saidIt);
  useEffect(() => {
    saidItRef.current = saidIt;
  });
  useEffect(() => {
    if (!photo || status !== "turn") return;
    const end = Date.now() + PHOTO_WAIT * 1000;
    const id = window.setInterval(() => {
      const s = Math.ceil((end - Date.now()) / 1000);
      if (s <= 0) {
        window.clearInterval(id);
        saidItRef.current();
      } else setLeft(s);
    }, 200);
    return () => window.clearInterval(id);
  }, [photo, status]);
  const mainLabel = playing ? "pause" : status === "ended" ? "watchAgain" : "play";

  return (
    <dialog
      ref={dialogRef}
      className="mrl-dialog mrl-cartoon mrl-film"
      aria-labelledby="film-title"
      onClose={() => {
        videoRef.current?.pause();
        onClose();
      }}
    >
      <div className="mrl-cartoon-body">
        <LearningNotice />
        <div className="mrl-cartoon-head">
          <h3 id="film-title" className="font-display text-xl leading-snug font-extrabold sm:text-2xl">
            {pick(lesson.title)}
            {sub && <span lang="en" className="text-ink-soft ml-2 text-sm font-semibold">{pickSub(lesson.title)}</span>}
          </h3>
          <button type="button" className="ui-pill" onClick={() => dialogRef.current?.close()}>
            {t.moral.lessons.close} {sub && <span lang="en" className="text-sm font-normal">{sub.moral.lessons.close}</span>}
          </button>
        </div>

        <div className="mrl-film-stage" data-state={status}>
          <video
            ref={videoRef}
            className="mrl-film-video"
            poster={`${base}-poster.webp`}
            playsInline
            preload={still ? "metadata" : "auto"}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            aria-label={pick(film.label)}
            onClick={() => (playing ? videoRef.current?.pause() : status !== "turn" && play())}
            // คำบรรยายวาดเองใต้ภาพ จึงซ่อนตัวที่เบราว์เซอร์วาดบนวิดีโอ
            onLoadedMetadata={(e) => { const tr = e.currentTarget.textTracks[0]; if (tr) tr.mode = "hidden"; }}
            onPlay={() => setStatus("playing")}
            onPause={() => setStatus((s) => (s === "turn" || s === "ended" ? s : "paused"))}
            onEnded={() => {
              const v = videoRef.current;
              setStatus("ended");
              setProgress(1);
              if (v && watchedSeconds(v) >= 0.9 * (v.duration || film.duration) - film.turns.reduce((a, tr) => a + tr.resumeAt - tr.at, 0)) onFinishRef.current?.();
            }}
          >
            <source src={`${video}-1080.mp4`} type="video/mp4" media="(min-width: 1200px)" />
            <source src={`${video}-720.mp4`} type="video/mp4" />
            <track kind="captions" src={`${base}.${captionLang}.vtt`} srcLang={captionLang} label={captionLang === "th" ? "ไทย" : "English"} default />
          </video>

          {/* ตาเด็กพูด — ป้ายคำเป็นข้อความจริง (ข้อ 1.5) */}
          {status === "turn" && word && (
            <div className="mrl-film-turn">
              <p className="mrl-film-turn-prompt font-display">{fmt(t.moral.cartoon.sayPrompt, { word: locale === "th" ? word.th : word.ar })}</p>
              <p className="mrl-stage-word mrl-film-word">
                <span lang="ar" dir="rtl">{word.ar}</span>
                {locale === "th" && <span className="mrl-stage-word-th">{word.th}</span>}
              </p>
              <button type="button" className="ui-pill ui-pill-primary mrl-film-said" onClick={saidIt} autoFocus>
                {t.moral.film.saidIt} {sub && <span lang="en" className="text-sm font-normal">{sub.moral.film.saidIt}</span>}
              </button>
            </div>
          )}

          {/* ภาพถ่ายสัตว์จริง — HTML มี alt จริงและเครดิต (AGENTS 1.1, ข้อ 2) วิดีโอหยุดรอ เด็กกด "ดูต่อ" ที่ปุ่มหลักด้านล่าง
              (ไม่วางปุ่มบนภาพ เพราะบนมือถือจะบังภาพถ่าย) */}
          {status === "turn" && photo && (
            <div className="mrl-film-photo">
              <figure className="mrl-photo">
                <span className="mrl-photo-img">
                  <Image src={photo.src} alt={pick(photo.alt)} width={photo.width} height={photo.height} sizes="(max-width: 767px) 62vw, 720px" />
                </span>
                <figcaption className="mrl-photo-label font-display">
                  {pick(photo.label)} {sub && <span lang="en">{pickSub(photo.label)}</span>}
                </figcaption>
              </figure>
            </div>
          )}

          {/* จบเรื่อง — ทวนคำที่เรียน */}
          {status === "ended" && film.words.length > 0 && (
            <div className="mrl-film-end">
              {film.words.map((w) => (
                <p key={w.ar} className="mrl-stage-word mrl-film-word">
                  <span lang="ar" dir="rtl">{w.ar}</span>
                  {locale === "th" && <span className="mrl-stage-word-th">{w.th}</span>}
                </p>
              ))}
            </div>
          )}

          {status === "idle" && still && (
            <button type="button" className="mrl-film-bigplay" onClick={play} aria-label={t.moral.cartoon.play}>
              <PlayIcon className="size-10" />
            </button>
          )}
        </div>

        <div className="mrl-film-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>

        {/* คำบรรยาย — ไม่ใช้ role=status เพราะเปลี่ยนถี่ (วิดีโอมีเสียงพูดอยู่แล้ว) */}
        <div className="mrl-cartoon-caption mrl-film-caption">
          {status === "turn" && word ? (
            // ตาเด็กพูด: บอกในกล่องข้อความด้วย (จอแนวนอนเตี้ยซ่อนบอลลูนบนภาพ) role=status ให้ screen reader อ่าน
            <p className="font-semibold" role="status">
              {fmt(t.moral.cartoon.sayPrompt, { word: locale === "th" ? word.th : word.ar })}
            </p>
          ) : status === "turn" && photo ? (
            <>
              <p className="font-semibold" role="status">
                {pick(photo.label)} <span className="text-ink-soft text-xs font-normal">{pick(photo.credit)}</span>
              </p>
              <p className="text-ink-soft text-sm" aria-hidden="true">
                {fmt(t.moral.film.autoNext, { n: String(left) })} {sub && <span lang="en">{fmt(sub.moral.film.autoNext, { n: String(left) })}</span>}
              </p>
            </>
          ) : line ? (
            <>
              {line.who && <p className="mrl-speaker font-display">{line.who}</p>}
              <p className="font-semibold"><ArabicText text={line.text} /></p>
            </>
          ) : (
            <p className="text-ink-soft">{pick(film.label)}</p>
          )}
        </div>

        <div className="mrl-cartoon-controls">
          <button type="button" className="ui-round" onClick={back} disabled={status === "idle"} aria-label={t.moral.film.back} title={t.moral.film.back}>
            <ReplayIcon className="size-7" />
          </button>
          <button
            ref={mainRef}
            type="button"
            className="ui-pill ui-pill-primary"
            onClick={() => (playing ? videoRef.current?.pause() : status === "turn" ? saidIt() : play())}
          >
            {playing ? <PauseIcon className="size-7" /> : status === "ended" ? <ReplayIcon className="size-7" /> : <PlayIcon className="size-7" />}
            {photo ? (
              <span>
                {t.moral.film.next} {sub && <span lang="en" className="text-sm font-normal">{sub.moral.film.next}</span>}{" "}
                <span className="mrl-film-count" aria-hidden="true">{left}</span>
              </span>
            ) : (
              <span>
                {t.moral.cartoon[mainLabel]} {sub && <span lang="en" className="text-sm font-normal">{sub.moral.cartoon[mainLabel]}</span>}
              </span>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
