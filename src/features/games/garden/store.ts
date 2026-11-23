'use client';
import { useSyncExternalStore } from 'react';
import { readGarden, GARDEN_KEY as SAVE_KEY, type Garden } from './model';

const changed = 'lu-garden-change';
let memory: string | null = null;
let temporary = false;
function snapshot() {
  if (!temporary) {
    try { return window.localStorage.getItem(SAVE_KEY); }
    catch { temporary = true; }
  }
  return memory;
}
const server = () => null;
function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => { if (!event.key || event.key === SAVE_KEY) listener(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener(changed, listener);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(changed, listener); };
}
export function useGarden() {
  const raw = useSyncExternalStore(subscribe, snapshot, server);
  return { garden: readGarden(raw), temporary };
}
export async function updateGarden(change: (garden: Garden) => Garden) {
  const write = () => {
    const current = readGarden(snapshot());
    const next = change(current);
    if (next === current) return false;
    memory = JSON.stringify(next);
    if (!temporary) {
      try { window.localStorage.setItem(SAVE_KEY, memory); }
      catch { temporary = true; }
    }
    window.dispatchEvent(new Event(changed));
    return true;
  };
  try {
    if (navigator.locks) return await navigator.locks.request(SAVE_KEY, write);
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'SecurityError')) throw error;
  }
  return write();
}
