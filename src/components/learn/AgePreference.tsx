"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getAgeSnapshot, getAgeServerSnapshot, subscribeAge, setAge, refreshAge, parseAge } from "@/lib/ageStore";

function subscribeDisplay(listener: () => void) {
  const unsubscribe = subscribeAge(listener);
  window.addEventListener("lu-age-display", listener);
  return () => { unsubscribe(); window.removeEventListener("lu-age-display", listener); };
}
const displaySnapshot = () => parseAge(document.documentElement.dataset.age);

export function useAge() {
  return useSyncExternalStore(subscribeDisplay, displaySnapshot, getAgeServerSnapshot);
}
export function applyAge() {
  const age = parseAge(location.hash.slice(1)) ?? getAgeSnapshot();
  if (age) document.documentElement.dataset.age = age;
  else delete document.documentElement.dataset.age;
  window.dispatchEvent(new Event("lu-age-display"));
}

/** Runs on soft navigation as well as direct entry; hash never overwrites the saved choice. */
export function AgePreference() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const age = parseAge(pathname.split("/").filter(Boolean).at(-1));
    if (age) setAge(age);
    applyAge();
    const hash = () => {
      applyAge();
      const target = parseAge(location.hash.slice(1));
      if (target) document.getElementById(target)?.scrollIntoView();
    };
    const storage = (event: StorageEvent) => {
      if (event.key === "lu-age" || event.key === null) refreshAge();
    };
    const unsubscribe = subscribeAge(applyAge);
    window.addEventListener("hashchange", hash);
    window.addEventListener("storage", storage);
    return () => {
      unsubscribe();
      window.removeEventListener("hashchange", hash);
      window.removeEventListener("storage", storage);
    };
  }, [pathname]);
  return null;
}
