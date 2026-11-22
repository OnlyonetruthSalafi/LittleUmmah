'use client';
import { useSyncExternalStore } from 'react';
import { readLedger, SAVE_KEY, type Ledger } from './model';

const changed = 'lu-smoothie-change';
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
export function useShop() {
  const raw = useSyncExternalStore(subscribe, snapshot, server);
  return { shop: readLedger(raw), temporary };
}
export async function updateShop(change: (shop: Ledger) => Ledger) {
  const write = () => {
    const current = readLedger(snapshot());
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
