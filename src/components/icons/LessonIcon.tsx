import { GameIcon } from "@/components/icons/GameIcon";
import type { GameIconName } from "@/lib/games";

/*
  ไอคอนประจำบทเรียนของแต่ละเกาะ — สไตล์เดียวกับ GameIcon (viewBox 120, เส้น 5)
  เป็นสิ่งของและธรรมชาติล้วน ไม่มีใบหน้าคนหรือสัตว์ (ข้อ 1.1)
  บทเรียนเรื่องผึ้งจึงใช้รวงผึ้งแทนตัวผึ้ง เรื่องนบียูนุสใช้คลื่นทะเลแทนปลา
*/
export type LessonIconName =
  | Extract<GameIconName, "moon" | "lantern" | "dates" | "mushaf" | "mat" | "jug" | "letters">
  | "sun"
  | "drop"
  | "tree"
  | "cloud"
  | "mountain"
  | "globe"
  | "honeycomb"
  | "boat"
  | "wave"
  | "kaaba"
  | "cave"
  | "heart"
  | "chat"
  | "home"
  | "star8"
  | "palette"
  | "pen"
  | "shield"
  | "well";

const GAME_ICONS = new Set<string>(["moon", "lantern", "dates", "mushaf", "mat", "jug", "letters"]);

export function LessonIcon({ name, className = "" }: { name: LessonIconName; className?: string }) {
  if (GAME_ICONS.has(name)) return <GameIcon name={name as GameIconName} className={className} />;

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {name === "sun" && (
        <>
          <circle cx="60" cy="60" r="24" fill="var(--color-sun)" />
          <path d="M60 12v12m0 72v12M12 60h12m72 0h12M26 26l9 9m50 50 9 9M26 94l9-9m50-50 9-9" />
        </>
      )}
      {name === "drop" && <path d="M60 14C44 40 30 56 30 74a30 30 0 0 0 60 0c0-18-14-34-30-60Z" fill="var(--color-sky)" />}
      {name === "tree" && (
        <>
          <path d="M60 110V62m0 18-16-12m16 4 14-10" />
          <circle cx="60" cy="42" r="30" fill="var(--color-game-mint)" />
          <path d="M20 110h80" />
        </>
      )}
      {name === "cloud" && (
        <>
          <path d="M32 74a18 18 0 0 1 4-36 26 26 0 0 1 48-4 20 20 0 0 1 4 40Z" fill="var(--color-cloud)" />
          <path d="M40 88l-6 12m26-12-6 12m26-12-6 12" stroke="var(--color-brand-blue)" />
        </>
      )}
      {name === "mountain" && (
        <>
          <path d="M8 100 44 32l22 40 12-18 34 46Z" fill="var(--color-game-mint)" />
          <path d="m36 48 8-16 9 16" fill="var(--color-cloud)" />
        </>
      )}
      {name === "globe" && (
        <>
          <circle cx="60" cy="60" r="44" fill="var(--color-sky)" />
          <path d="M36 30c10 8 2 18 12 22s4 16 14 18M78 22c-6 10 8 14 2 24m16 30c-10-4-18 4-16 18" />
        </>
      )}
      {name === "honeycomb" && (
        <>
          <path d="m42 20 18 10v20L42 60 24 50V30Zm36 0 18 10v20L78 60 60 50V30ZM60 50l18 10v20L60 90 42 80V60Z" fill="var(--color-sun)" />
          <path d="M60 90v18" />
        </>
      )}
      {name === "boat" && (
        <>
          <path d="M14 70h92l-14 26H28Z" fill="var(--color-sun)" />
          <path d="M34 70V50h52v20M44 50V36h32v14" />
          <path d="M8 106q13-8 26 0t26 0 26 0 26 0" stroke="var(--color-brand-blue)" />
        </>
      )}
      {name === "wave" && (
        <>
          <path d="M10 70q12-24 30-10t30 0 30-10 12 10v40H10Z" fill="var(--color-sky)" />
          <path d="M10 50q12-12 24 0t24 0 24 0 24 0" stroke="var(--color-brand-blue)" />
        </>
      )}
      {name === "kaaba" && (
        <>
          <path d="M24 38 60 24l36 14v52L60 104 24 90Z" fill="var(--color-ink)" />
          <path d="m24 50 36 14 36-14M60 64v40" stroke="var(--color-sun)" />
        </>
      )}
      {name === "cave" && (
        <>
          <path d="M8 104C12 50 34 20 60 20s48 30 52 84Z" fill="var(--color-game-peach)" />
          <path d="M38 104c0-26 10-44 22-44s22 18 22 44Z" fill="var(--color-ink)" />
        </>
      )}
      {name === "heart" && <path d="M60 100S16 74 16 44a22 22 0 0 1 44-6 22 22 0 0 1 44 6c0 30-44 56-44 56Z" fill="var(--color-game-peach)" />}
      {name === "chat" && (
        <>
          <path d="M16 24h88v54H50l-20 18V78H16Z" fill="var(--color-cloud)" />
          <path d="M34 44h52M34 60h32" />
        </>
      )}
      {name === "home" && (
        <>
          <path d="M18 56 60 20l42 36v48H18Z" fill="var(--color-game-peach)" />
          <path d="M50 104V76h20v28" />
        </>
      )}
      {name === "star8" && (
        <>
          <rect x="30" y="30" width="60" height="60" fill="var(--color-sun)" />
          <rect x="30" y="30" width="60" height="60" transform="rotate(45 60 60)" fill="var(--color-sun)" fillOpacity="0.6" />
          <circle cx="60" cy="60" r="10" fill="var(--color-cloud)" />
        </>
      )}
      {name === "palette" && (
        <>
          <path d="M60 14a46 46 0 1 0 0 92c8 0 10-8 6-14s0-14 8-14h14c10 0 18-8 18-20 0-24-20-44-46-44Z" fill="var(--color-cloud)" />
          <circle cx="40" cy="44" r="7" fill="var(--color-sun)" />
          <circle cx="62" cy="34" r="7" fill="var(--color-brand-blue)" />
          <circle cx="84" cy="46" r="7" fill="var(--color-brand-green)" />
          <circle cx="36" cy="70" r="7" fill="var(--color-game-lilac)" />
        </>
      )}
      {name === "pen" && (
        <>
          <path d="m28 92 8-26 50-50 18 18-50 50Z" fill="var(--color-sun)" />
          <path d="m76 26 18 18M28 92l-8 12" />
        </>
      )}
      {name === "shield" && (
        <>
          <path d="M60 12 20 26v28c0 26 16 44 40 54 24-10 40-28 40-54V26Z" fill="var(--color-game-mint)" />
          <path d="m42 60 12 12 24-26" />
        </>
      )}
      {name === "well" && (
        <>
          <path d="M26 60h68v44H26Z" fill="var(--color-game-peach)" />
          <path d="M30 60V24h60v36M20 24h80M60 24v18" />
          <path d="M52 42h16v12H52Z" fill="var(--color-sky)" />
        </>
      )}
    </svg>
  );
}
