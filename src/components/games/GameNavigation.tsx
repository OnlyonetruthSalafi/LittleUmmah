"use client";

import { useDict } from "@/i18n/LocaleProvider";

import { BackLink } from "@/components/ui/BackLink";

/* หน้าตาปุ่มมาจาก .ui-pill ใน controls.css — ชุดเดียวกับปุ่มทั้งเว็บ */
export const gameButtonClass = "ui-pill";

export function GameNavigation({ home = false }: { home?: boolean }) {
  const { t, sub } = useDict();
  return home ? <BackLink /> : <BackLink href="/learn/games" label={{ th: t.gameNavigation.games, en: sub?.gameNavigation.games ?? t.gameNavigation.games }} />;
}
