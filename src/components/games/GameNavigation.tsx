"use client";

import { BackLink } from "@/components/ui/BackLink";

/* หน้าตาปุ่มมาจาก .ui-pill ใน controls.css — ชุดเดียวกับปุ่มทั้งเว็บ */
export const gameButtonClass = "ui-pill";

export function GameNavigation({ home = false }: { home?: boolean }) {
  return home ? <BackLink /> : <BackLink href="/learn/games" labelTh="หน้าเกม" labelEn="Games" />;
}
