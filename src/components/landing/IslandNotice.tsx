"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useDict } from "@/i18n/LocaleProvider";
import type { Text } from "@/i18n/config";

const message: Text = {
  th: "เกาะนี้ยังไม่เปิดนะ ครูกำลังเตรียมอยู่ เร็วๆ นี้!",
  en: "This island is not open yet. Your teacher is getting it ready. Coming soon!",
};
export const islandLockedLabel: Text = { th: "ยังไม่เปิด เร็วๆ นี้", en: "Not open yet — coming soon" };
const closeLabel: Text = { th: "ปิดข้อความ", en: "Close message" };
const NoticeContext = createContext<() => void>(() => {});
export const useIslandNotice = () => useContext(NoticeContext);

export function IslandNotice({ children }: { children: ReactNode }) {
  const { pick, pickSub, sub } = useDict();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function close() {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }
  function show() {
    if (timer.current) clearTimeout(timer.current);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), 3000);
  }
  return <NoticeContext.Provider value={show}>
    {children}
    <div className="island-notice" data-visible={visible}>
      <div role="status" aria-live="polite" aria-atomic="true">
        {visible && <><p>{pick(message)}</p>{sub && <p lang="en">{pickSub(message)}</p>}</>}
      </div>
      {visible && <button type="button" onClick={close} aria-label={pick(closeLabel)} className="island-notice-close"><span aria-hidden="true">×</span></button>}
    </div>
  </NoticeContext.Provider>;
}
