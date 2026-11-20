import { useEffect, useRef, type ReactNode } from "react";
import { FullscreenIcon } from "@/components/icons/FullscreenIcon";
import { useMediaFullscreen } from "@/components/useMediaFullscreen";
import { useDict } from "@/i18n/LocaleProvider";
import "./paper-book.css";

export function PaperFullscreen({ children }: { children: ReactNode }) {
  const { playerRef, mode, expanded, enter, exit } = useMediaFullscreen();
  const button = useRef<HTMLButtonElement>(null);
  const { t, sub } = useDict();
  const label = expanded ? t.moral.film.exitFullscreen : t.games.rotate.fullscreen;
  const secondary = expanded ? sub?.moral.film.exitFullscreen : sub?.games.rotate.fullscreen;

  useEffect(() => {
    const root = playerRef.current;
    if (mode !== "viewport" || !root) return;
    // Keep the same live canvas and narration when native fullscreen is unavailable.
    if (typeof root.showPopover === "function") {
      root.popover = "manual";
      root.showPopover();
    }
    const background: HTMLElement[] = [];
    for (let node: HTMLElement = root; node.parentElement; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling !== node && sibling instanceof HTMLElement && !sibling.inert) {
          sibling.setAttribute("inert", "");
          background.push(sibling);
        }
      }
      if (node.parentElement === document.body) break;
    }
    const toggle = button.current;
    toggle?.focus({ preventScroll: true });
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        void exit();
      }
    }
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("keydown", escape);
      if (root.hasAttribute("popover")) {
        if (root.isConnected) root.hidePopover();
        root.removeAttribute("popover");
      }
      background.forEach(element => element.removeAttribute("inert"));
      if (toggle?.isConnected) toggle.focus({ preventScroll: true });
    };
  }, [mode, playerRef, exit]);

  return <div className="pp-screen" ref={playerRef} data-expanded={expanded || undefined}>
    <div className="pp-screen-layout">
      <div className="pp-screen-dock">
        <button ref={button} type="button" className="pp-screen-toggle" aria-pressed={expanded}
          onClick={expanded ? exit : enter}>
          <FullscreenIcon active={expanded} width={21} height={21} />
          <span>{label}{secondary && <small lang="en">{secondary}</small>}</span>
        </button>
      </div>
      <div className="pp-screen-scroll">{children}</div>
    </div>
  </div>;
}
