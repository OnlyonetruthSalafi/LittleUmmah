'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { FullscreenIcon } from '@/components/icons/FullscreenIcon';
import { useMediaFullscreen } from '@/components/useMediaFullscreen';
import { useDict } from '@/i18n/LocaleProvider';

const GameDisplay = createContext<{
  expanded: boolean;
  toggle: () => void;
  enterOnTouch: () => void;
} | null>(null);

export function GameViewport({ children }: { children: ReactNode }) {
  const { playerRef, mode, expanded, enter, exit } = useMediaFullscreen();
  const autoEntered = useRef(false);
  useEffect(() => {
    if (mode !== 'viewport') return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) void exit();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mode, exit]);

  function toggle() {
    autoEntered.current = true;
    if (expanded) void exit();
    else void enter();
  }
  function enterOnTouch() {
    if (autoEntered.current || !window.matchMedia('(pointer: coarse)').matches) return;
    autoEntered.current = true;
    void enter();
  }
  return <GameDisplay.Provider value={{ expanded, toggle, enterOnTouch }}>
    <div ref={playerRef} className="gc-viewport" data-expanded={expanded || undefined}>{children}</div>
  </GameDisplay.Provider>;
}

export function useGameDisplay() {
  const display = useContext(GameDisplay);
  if (!display) throw new Error('Game controls require GameViewport');
  return display;
}

export function GameFullscreenButton() {
  const { expanded, toggle } = useGameDisplay();
  const { t } = useDict();
  const label = expanded ? t.games.rotate.exitFullscreen : t.games.rotate.fullscreen;
  return <button type="button" className="ui-round gc-fullscreen" onClick={toggle} aria-label={label} title={label}>
    <FullscreenIcon active={expanded} width={28} height={28} />
  </button>;
}
