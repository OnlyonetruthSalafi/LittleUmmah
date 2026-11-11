"use client";

import { useId, type ReactNode } from "react";
import { useDict } from "@/i18n/LocaleProvider";
import { setAge, type Age } from "@/lib/ageStore";
import { applyAge, useAge } from "./AgePreference";

export function AgeSwitch({ controls, focusId }: { controls: string | Record<Age, string>; focusId?: string }) {
  const { t, sub } = useDict();
  const age = useAge();
  return <div className="age-switch">
    {(["kids", "juniors"] as const).map(target => <button key={target} type="button"
      className="age-switch-button shadow-soft hover:shadow-float transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] active:duration-75" data-age-switch={target}
      aria-expanded={age === target} aria-controls={typeof controls === "string" ? controls : controls[target]}
      onClick={() => {
        // Replace an old age hash, otherwise it would keep overriding this explicit choice.
        if (location.hash === "#kids" || location.hash === "#juniors") history.replaceState(null, "", `#${target}`);
        setAge(target);
        applyAge();
        const panel = document.getElementById(focusId ?? (typeof controls === "string" ? controls : controls[target]));
        panel?.focus({ preventScroll: true });
        panel?.scrollIntoView({ block: "start" });
      }}>
      {t.agePreference[target]}
      {sub && <span lang="en">{sub.agePreference[target]}</span>}
    </button>)}
  </div>;
}

/** Both server-rendered sections remain in DOM; display:none also removes inactive content from AT. */
export function AgeSections({ kids, juniors, className = "" }: { kids: ReactNode; juniors: ReactNode; className?: string }) {
  const uid = useId();
  return <div className={`age-sections ${className}`} id={uid} tabIndex={-1}>
    {(["kids", "juniors"] as Age[]).map(age => <div key={age} id={`${uid}-${age}`} data-age-panel={age}>{age === "kids" ? kids : juniors}</div>)}
    <AgeSwitch controls={{ kids: `${uid}-kids`, juniors: `${uid}-juniors` }} focusId={uid} />
  </div>;
}
