import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type PointerEvent, type RefObject } from "react";
import { useDict } from "@/i18n/LocaleProvider";
import type { Story } from "../types";
import type { createTheatre, PaperView } from "../paper/theatre";
import { PaperBook } from "./PaperBook";
import { goldJarDescriptions, paperDescriptions } from "../paper/descriptions";

type Pose = [string, string | undefined, number, boolean];
type Drag = { id: number; x: number; y: number; opening: number; axis?: "horizontal" | "vertical"; delta: number; progress: number };
const cameraViews = ["viewOverview", "viewFront", "viewLeft", "viewRight", "viewAbove"] as const;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function motionChanges(changed: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", changed);
  return () => media.removeEventListener("change", changed);
}
const ease = (t: number) => t * t * (3 - 2 * t);

export default function PaperReaderStage({ story, spread, turn, onDone, onStep, onScrub, bookRef, label }: {
  story: Story; spread: number; turn: { from: number; to: number } | null;
  onDone: () => void; onStep: (delta: number) => void; onScrub: () => void;
  bookRef: RefObject<HTMLDivElement | null>; label: string;
}) {
  const staticMotion = useSyncExternalStore(motionChanges, reduced, () => false);
  const { t, sub, pick } = useDict();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printedTurn = useRef<HTMLDivElement>(null);
  const theatre = useRef<ReturnType<typeof createTheatre> | null>(null);
  const pose = useRef<Pose>(["cover", undefined, 0, false]);
  const drag = useRef<Drag | null>(null);
  const continuation = useRef(0);
  const gestureFrame = useRef(0);
  const opening = useRef(0);
  const [progress, setProgress] = useState(0);
  const [live, setLive] = useState(false);
  const [focusScene, setFocusScene] = useState("");
  const [view, setView] = useState<PaperView>("viewOverview");
  const sceneAt = (n: number) => n < 0 ? "cover" : story.pages[n]?.image.split("/").pop()?.replace(/\.webp$/, "");
  const goldJar = story.slug === "gold-jar";
  const previewPage = goldJar ? "p02" : "p04";
  const previewAtlas = goldJar ? "discovery" : "workshop";
  const assetRoot = `/stories/${story.slug}-paper`;
  const current = sceneAt(spread) ?? "cover";
  const [previousScene, setPreviousScene] = useState(current);
  if (previousScene !== current) {
    setPreviousScene(current);
    setProgress(0);
    setFocusScene("");
  }
  const next = turn ? sceneAt(turn.to) : undefined;
  const backward = Boolean(turn && turn.to < turn.from);
  const cover = current === "cover";
  const shown = next ?? (cover && progress > 0 ? previewPage : current);
  const description = (goldJar ? goldJarDescriptions : paperDescriptions)[shown];
  const artLabel = shown === "cover" ? (goldJar ? t.stories.shelf.jarCover : t.stories.shelf.closedCover) : description ? pick(description) : label;
  const canFocus = live && !turn && (current === previewPage || (cover && progress >= .8));
  const focused = canFocus && focusScene === current;
  const words = (key: keyof typeof t.stories.shelf) => <span>{t.stories.shelf[key]}
    {sub && <small lang="en">{sub.stories.shelf[key]}</small>}</span>;

  const renderPose = useCallback((...args: Pose) => {
    pose.current = args;
    if (theatre.current) {
      theatre.current.pose(...args);
      return;
    }
    const frame = printedTurn.current;
    if (!frame) return;
    const [from, to, amount, reverse] = args;
    frame.hidden = !to;
    if (to) {
      const index = Math.round((reverse ? 1 - amount : amount) * 11);
      const atlas = from === "cover" && to === previewPage ? previewAtlas : reverse ? to : from;
      frame.style.backgroundImage = `url(${assetRoot}/turns/${atlas}.webp)`;
      frame.style.backgroundPosition = `${index % 4 * 100 / 3}% ${Math.floor(index / 4) * 50}%`;
    }
  }, [assetRoot, previewAtlas, previewPage]);

  function openTo(value: number) {
    opening.current = value;
    setProgress(value);
    renderPose("cover", previewPage, value, false);
  }

  function explore() {
    onScrub();
    cancelAnimationFrame(gestureFrame.current);
    setFocusScene("");
    const from = opening.current;
    const closeFirst = from >= .99;
    if (reduced()) { openTo(closeFirst ? 0 : 1); return; }
    const start = performance.now();
    const closingTime = closeFirst ? 1150 : 0;
    const duration = closeFirst ? 1900 : Math.max(240, 1900 * (1 - from));
    function tick(now: number) {
      const elapsed = now - start;
      if (elapsed < closingTime) openTo(from * (1 - ease(elapsed / closingTime)));
      else {
        const t = Math.min(1, (elapsed - closingTime) / duration);
        const initial = closeFirst ? 0 : from;
        openTo(initial + (1 - initial) * ease(t));
      }
      if (elapsed < closingTime + duration) gestureFrame.current = requestAnimationFrame(tick);
    }
    gestureFrame.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let active = true;
    async function mount() {
      try {
        if (!canvas?.getContext("webgl2", { antialias: true, powerPreference: "low-power" })) return;
        const { createTheatre } = await import("../paper/theatre");
        if (!active) return;
        theatre.current = createTheatre(canvas, story.slug);
        theatre.current.pose(...pose.current);
        setLive(true);
      } catch {
        theatre.current?.dispose();
        theatre.current = null;
        setLive(false);
      }
    }
    function lost(event: Event) {
      event.preventDefault();
      theatre.current?.dispose();
      theatre.current = null;
      renderPose(...pose.current);
      setLive(false);
    }
    void mount();
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", mount);
    return () => {
      active = false;
      cancelAnimationFrame(gestureFrame.current);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", mount);
      theatre.current?.dispose();
      theatre.current = null;
    };
  }, [story.slug, renderPose]);

  useLayoutEffect(() => {
    cancelAnimationFrame(gestureFrame.current);
    drag.current = null;
    if (!next) {
      opening.current = 0;
      renderPose(current, undefined, 0, false);
      continuation.current = 0;
      return;
    }
    // The cover preview and the first story page share a hinge, not an illustration.
    // Carry its opening angle into the requested spread before the next paint.
    const from = current === "cover" ? opening.current : continuation.current;
    opening.current = 0;
    continuation.current = 0;
    renderPose(current, next, from, backward);
    if (!theatre.current) {
      const destination = new Image();
      destination.src = `${assetRoot}/${next}.webp`;
    }
    const start = performance.now();
    const duration = 1350 * (1 - from);
    let frame = 0;
    function animate(now: number) {
      const t = duration > 0 ? Math.min(1, (now - start) / duration) : 1;
      renderPose(current, next, from + (1 - from) * ease(t), backward);
      if (t === 1) onDone();
      else frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [current, next, backward, onDone, assetRoot, renderPose]);

  useEffect(() => {
    if (live) theatre.current?.camera(view, focused);
  }, [focused, view, live]);

  function pointer(e: PointerEvent<HTMLDivElement>) {
    const b = e.currentTarget.getBoundingClientRect();
    const u = (e.clientX - b.left) / b.width;
    const v = (e.clientY - b.top) / b.height;
    const sideways = getComputedStyle(e.currentTarget).getPropertyValue("--pp-quarter-turn").trim() === "1";
    const x = sideways ? v : u, y = sideways ? 1 - u : v;
    const width = e.currentTarget.clientWidth, height = e.currentTarget.clientHeight;
    return { x, y, localX: x * width, localY: y * height, width, height };
  }
  function down(e: PointerEvent<HTMLDivElement>) {
    if (turn || !e.isPrimary || e.button !== 0) return;
    cancelAnimationFrame(gestureFrame.current);
    const { localX, localY } = pointer(e);
    drag.current = { id: e.pointerId, x: localX, y: localY, opening: opening.current, delta: 0, progress: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) {
      if (live && !turn && e.pointerType === "mouse") {
        const { x, y } = pointer(e); theatre.current?.hover(x*2-1, 1-y*2);
      }
      return;
    }
    if (d.id !== e.pointerId || turn) return;
    const { localX, localY, width } = pointer(e);
    const dx = d.x - localX, dy = d.y - localY;
    if (!d.axis) {
      if (Math.hypot(dx, dy) < 6) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      if (d.axis === "horizontal") { onScrub(); theatre.current?.hover(); }
    }
    if (d.axis === "vertical") return;
    if (cover) {
      d.progress = dx / width;
      openTo(Math.min(1, Math.max(0, d.opening + dx / (width * .68))));
    }
    else {
      const delta=d.delta || Math.sign(d.x-localX);
      if (!delta || spread+delta < -1 || spread+delta >= story.pages.length) return;
      d.delta=delta;
      d.progress=Math.min(1,Math.max(0,(d.x-localX)*delta/(width*.65)));
      if (!reduced()) renderPose(current,sceneAt(spread+delta),d.progress,delta<0);
    }
  }
  function toggleFocus() { setFocusScene(focused ? "" : current); }
  function up(e: PointerEvent<HTMLDivElement>, cancelled = false) {
    const d=drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current=null;
    const { x, y }=pointer(e);
    if (!cancelled && !d.axis) {
      if (canFocus && theatre.current?.hitSubject(x*2-1,1-y*2)) toggleFocus();
      else if (cover && opening.current < .99) explore();
    } else if (!cancelled && cover && d.opening >= .99 && d.progress > .12) {
      onStep(1);
    } else if (!cover && d.delta) {
      if (!cancelled && d.progress>.18) { continuation.current=d.progress; onStep(d.delta); }
      else {
        const start=performance.now();
        function settle(now:number) {
          const t=reduced()?1:Math.min(1,(now-start)/240);
          renderPose(current,sceneAt(spread+d!.delta),d!.progress*(1-ease(t)),d!.delta<0);
          if(t<1) gestureFrame.current=requestAnimationFrame(settle);
          else renderPose(current,undefined,0,false);
        }
        gestureFrame.current=requestAnimationFrame(settle);
      }
    }
  }
  return <div className="pp-reader-stage" id="paper-book" ref={bookRef}>
    <div role="img" aria-label={artLabel} className="pp-viewport" data-scene={current} data-live={live} data-turn={next}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={e=>up(e,true)}
      onPointerLeave={()=>theatre.current?.hover()}>
      <PaperBook key={current} src={`${assetRoot}/${current}.webp`} />
      <div key={next ? "page-turn" : "at-rest"} ref={printedTurn} className="pp-printed-turn" hidden />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
    <div className="pp-tools">
      {cover && <>
        <button type="button" className="pp-lift-cover" onClick={explore} disabled={!!turn}>
          {words(progress >= .99 ? (staticMotion ? "closeFold" : "replayFold") : goldJar ? "liftJar" : "liftCover")}
        </button>
        <label className="pp-opening">{words("openingAngle")}
          <input type="range" min="0" max="100" value={Math.round(progress*100)} disabled={!!turn}
            onChange={e=>{cancelAnimationFrame(gestureFrame.current); onScrub(); openTo(Number(e.target.value)/100);}} />
        </label>
        <button type="button" onClick={()=>onStep(1)} disabled={!!turn}>{words("startStory")}</button>
      </>}
      {!cover && <p>{words("dragPage")}</p>}
      {live && <div className="pp-camera-views" role="group" aria-label={t.stories.shelf.cameraViews}>
        {cameraViews.map(choice => <button key={choice} type="button" aria-pressed={!focused && choice === view}
          onClick={() => { setFocusScene(""); setView(choice); }}>{words(choice)}</button>)}
      </div>}
      {canFocus && <button type="button" aria-pressed={focused} onClick={toggleFocus}>{words(goldJar ? "focusJar" : "focusArk")}</button>}
    </div>
  </div>;
}
