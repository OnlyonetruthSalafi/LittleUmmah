"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import { LocaleLink as Link, useDict } from "@/i18n/LocaleProvider";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { PadlockIcon } from "@/components/icons/PadlockIcon";
import "./picker.css";

// Only the picker imports this font; no Bengali font is added to the root layout.
const bengali = Noto_Sans_Bengali({ subsets: ["bengali"], weight: "600", display: "swap" });
const rooms = [
  { id: "english", script: "A b c", lang: "en", dir: "ltr", font: "font-display" },
  { id: "thai", script: "ก ข ค", lang: "th", dir: "ltr", font: "font-body" },
  { id: "arabic", script: "ا ب ت", lang: "ar", dir: "rtl", font: "" },
] as const;
function subscribeHash(fn: () => void) {
  window.addEventListener("hashchange", fn);
  return () => window.removeEventListener("hashchange", fn);
}
function readHash() { return window.location.hash === "#juniors" ? "#juniors" : "#kids"; }

export function RoomPicker() {
  const { t, sub } = useDict();
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "#kids");
  return (
    <section className="language-picker" aria-labelledby="language-heading">
      <header className="language-welcome">
        <div>
          <p className="language-eyebrow">{t.languages.title}{sub && <span lang="en">{sub.languages.title}</span>}</p>
          <h1 id="language-heading">{t.languages.subtitle}{sub && <span lang="en">{sub.languages.subtitle}</span>}</h1>
          <p className="language-invitation">{t.languages.welcome}</p>
          {sub && <p lang="en" className="language-invitation-sub">{sub.languages.welcome}</p>}
        </div>
        <Image src="/Character/teach.webp" alt="" width={400} height={400} sizes="(max-width: 639px) 88px, 180px" className="language-nuri" priority />
      </header>

      <div className="language-hall">
        <ul className="language-open">
          {rooms.map((room) => <li key={room.id}>
            <Link href={`/learn/languages/${room.id}${hash}`} data-room={room.id} className="language-room group motion-safe:active:scale-[0.98] motion-safe:active:duration-75">
              <span className="language-room-art">
                <Image src="/languages/school.webp" alt="" width={1024} height={1024} sizes="(max-width: 639px) 160px, (max-width: 1023px) 30vw, 360px" className="language-school motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.03]" priority />
              </span>
              <span className={`language-sample ${room.font}`} lang={room.lang} dir={room.dir}>{room.script}</span>
              <span className="language-nameplate">
                <span><strong>{t.languages.names[room.id]}</strong>{sub && <span lang="en" className="language-secondary">{sub.languages.names[room.id]}</span>}</span>
                <ChevronRightIcon className="size-7 shrink-0" />
              </span>
              <span className="language-enter">{t.languages.enter}{sub && <span lang="en">{sub.languages.enter}</span>}</span>
            </Link>
          </li>)}
        </ul>
      </div>

      <section className="language-future" aria-labelledby="language-future-heading">
        <h2 id="language-future-heading">{t.languages.closedHeading}{sub && <span lang="en">{sub.languages.closedHeading}</span>}</h2>
        <ul className="language-closed-list">
          {(["bengali", "indonesian"] as const).map((id) => <li key={id} className="language-closed" data-locked-room={id}>
            <div className="language-closed-board"><span lang={id === "bengali" ? "bn" : "id"} className={id === "bengali" ? bengali.className : "font-display"}>{id === "bengali" ? "বাংলা" : "Bahasa Indonesia"}</span></div>
            <div className="language-closed-name"><h3>{t.languages.names[id]}</h3>{sub && <p lang="en">{sub.languages.names[id]}</p>}<p className="language-lock"><PadlockIcon className="size-5 shrink-0" /><span>{t.languages.soon}{sub && <span lang="en">{sub.languages.soon}</span>}</span></p></div>
          </li>)}
        </ul>
      </section>
    </section>
  );
}
