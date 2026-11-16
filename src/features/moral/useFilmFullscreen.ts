"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "inline" | "browser" | "native" | "viewport";
type FullscreenDocument = Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void> | void };
type FullscreenElement = HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type NativeVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void; webkitExitFullscreen?: () => void; webkitDisplayingFullscreen?: boolean };
type Orientation = ScreenOrientation & { lock?: (value: "landscape") => Promise<void> };
const currentElement = () => document.fullscreenElement ?? (document as FullscreenDocument).webkitFullscreenElement;

// Fullscreen the contents, not <dialog> (which the Fullscreen API excludes).
// iPhone uses native video; return to HTML at interactive stops so no prompt is lost.
export function useFilmFullscreen(allowNative: boolean) {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("inline");
  const modeRef = useRef<Mode>("inline");
  const locked = useRef(false);
  const changeMode = useCallback((next: Mode) => { modeRef.current = next; setMode(next); }, []);
  const unlock = useCallback(() => {
    if (locked.current) { try { screen.orientation?.unlock(); } catch {} locked.current = false; }
  }, []);
  const exit = useCallback(async () => {
    const v = video.current as NativeVideo | null;
    if (v?.webkitDisplayingFullscreen || modeRef.current === "native") { try { v?.webkitExitFullscreen?.(); } catch {} }
    if (container.current && currentElement() === container.current) {
      const doc = document as FullscreenDocument;
      try { await (doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc))?.(); } catch {}
    }
    unlock();
    if (v?.textTracks[0]) v.textTracks[0].mode = "hidden";
    changeMode("inline");
  }, [container, video, unlock, changeMode]);

  const enter = useCallback(async () => {
    const el = container.current as FullscreenElement | null;
    const v = video.current as NativeVideo | null;
    if (!el || !v) return;
    const request = el.requestFullscreen?.bind(el) ?? el.webkitRequestFullscreen?.bind(el);
    if (request) {
      try {
        await request({ navigationUI: "hide" });
        if (!el.isConnected || currentElement() !== el) return;
        changeMode("browser");
        if (window.matchMedia("(pointer: coarse)").matches) {
          try {
            const orientation = screen.orientation as Orientation | undefined;
            if (orientation?.lock) {
              await orientation.lock("landscape");
              locked.current = true;
              if (!el.isConnected || currentElement() !== el) unlock();
            }
          } catch { /* Keep fullscreen; the child can rotate the device manually. */ }
        }
        return;
      } catch { /* A denied request still permits a full-viewport player. */ }
    } else if (allowNative && v.webkitEnterFullscreen) {
      try {
        v.webkitEnterFullscreen();
        changeMode("native");
        if (v.textTracks[0]) v.textTracks[0].mode = "showing";
        return;
      } catch { /* Not ready or unsupported: keep the HTML player usable. */ }
    }
    if (el.isConnected) changeMode("viewport");
  }, [container, video, allowNative, changeMode, unlock]);

  const leaveNative = useCallback(() => {
    if (modeRef.current === "native") void exit();
  }, [exit]);

  useEffect(() => {
    const el = container.current;
    const v = video.current as NativeVideo | null;
    const onChange = () => {
      if (el && currentElement() === el) changeMode("browser");
      else if (modeRef.current === "browser") { unlock(); changeMode("inline"); }
    };
    const onNativeStart = () => { changeMode("native"); if (v?.textTracks[0]) v.textTracks[0].mode = "showing"; };
    const onNativeEnd = () => { changeMode("inline"); if (v?.textTracks[0]) v.textTracks[0].mode = "hidden"; };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    v?.addEventListener("webkitbeginfullscreen", onNativeStart);
    v?.addEventListener("webkitendfullscreen", onNativeEnd);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
      v?.removeEventListener("webkitbeginfullscreen", onNativeStart);
      v?.removeEventListener("webkitendfullscreen", onNativeEnd);
      if (v?.webkitDisplayingFullscreen) { try { v.webkitExitFullscreen?.(); } catch {} }
      if (el && currentElement() === el) {
        const doc = document as FullscreenDocument;
        try { void Promise.resolve((doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc))?.()).catch(() => {}); } catch {}
      }
      unlock();
    };
  }, [container, video, changeMode, unlock]);
  return { playerRef: container, videoRef: video, mode, expanded: mode === "browser" || mode === "viewport", enter, exit, leaveNative };
}
