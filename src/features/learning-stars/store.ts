'use client';
import { useSyncExternalStore } from 'react';
import { isLastStar, CLOCK_KEY, SETTINGS_KEY, STARS_KEY, TIME_KEY, initial, readState, rollover, earn, startRound, completeRound, tick, visibleInterval, shouldWarn, unlock, clearStars, type State } from './model';
import { queueVoice } from './voice';

const server = initial(0);
let cache: State | undefined;
let failed = false;
const listeners = new Set<() => void>();
let notice: 'earned' | 'full' | 'warn' | null = null;
const emit = () => listeners.forEach(fn => fn());
export function read() {
  if (typeof window === 'undefined') return server;
  try { return { ...readState(localStorage, Date.now()), ...(failed ? { available: false } : {}) }; }
  catch { failed = true; return { ...server, available: false }; }
}
function snapshot() { return cache ??= read(); }
function save(next: State, previous: State, probe = false) {
  if (!next.available) { failed = true; cache = next; emit(); return; }
  try {
    // Timer ticks must not overwrite another tab's stars or parental settings.
    // Persist only the fields this action actually changed.
    for (const [field, key] of [['settings', SETTINGS_KEY], ['stars', STARS_KEY], ['time', TIME_KEY]] as const) {
      const value = JSON.stringify(next[field]);
      if (value !== JSON.stringify(previous[field]) || (probe && field === 'stars')) localStorage.setItem(key, value);
    }
    cache = read();
  } catch { cache = { ...next, available: false }; }
  if (!cache.available) failed = true;
  emit();
}
export function change(fn: (s: State) => State) { const previous = read(); save(fn(previous), previous); }
function subscribe(fn: () => void) {
  listeners.add(fn);
  const sync = (e: StorageEvent) => { if (!e.key || e.key === 'lu-settings' || e.key.startsWith('lu-ls-')) { cache = read(); emit(); } };
  window.addEventListener('storage', sync);
  return () => { listeners.delete(fn); window.removeEventListener('storage', sync); };
}
export function useLearningState() { return useSyncExternalStore(subscribe, snapshot, () => server); }
export function useNotice() { return useSyncExternalStore(subscribe, () => notice, () => null); }
function announce(value: typeof notice) {
  notice = value; emit();
  if (value === 'earned') queueVoice('ls-earned');
  if (value === 'warn') queueVoice('time-warn');
  setTimeout(() => { if (notice === value) { notice = null; emit(); } }, 7000);
}
export function awardLesson(id: string) {
  const previous = read();
  const result = earn(previous, id, Date.now());
  if (!result.state.available) return;
  save(result.state, previous);
  if (result.result !== 'duplicate') announce(result.result);
}
export function beginRound(midLevel = false) {
  const previous = read();
  const result = startRound(previous, Date.now(), midLevel); save(result.state, previous, true);
  if (!cache?.available) return undefined;
  // ใช้ดาวดวงสุดท้ายไปแล้ว: ครูเตือนล่วงหน้าว่าจบด่านนี้ต้องไปเรียนเก็บดาวก่อน (เจ้าของโปรเจกต์สั่ง 10 พ.ย. 2026)
  if (!result.blocked && isLastStar(previous, result.state)) queueVoice('ls-last');
  return result.blocked;
}
export function finishRound() { change(completeRound); }
export function giveStars(amount: number) { change(s => ({ ...s, stars: { ...s.stars, balance: Math.min(20, s.stars.balance + amount) } })); }
export function unlockTime(amount: 15 | 30 | 'day') { change(s => unlock(rollover(s, Date.now()), amount)); queueVoice('unlocked'); }
export function clearLearningProgress() { change(clearStars); }

/** A shared wall-time watermark merges overlapping visible intervals across tabs.
 * Web Locks serializes read/modify/write where supported, including current Safari.
 * The synchronous fallback also deduplicates repeated ticks by their timestamp.
 */
export function trackPlayTime() {
  let last = Date.now();
  let wasVisible = document.visibilityState === 'visible';
  let alive = true;
  const update = (flush = false) => {
    const now = Date.now(), from = last, visible = wasVisible;
    last = now; wasVisible = document.visibilityState === 'visible';
    const run = () => {
      if (!alive && !flush) return;
      try {
        const state = read();
        const watermark = Number(localStorage.getItem(CLOCK_KEY) || 0);
        // Split at local midnight so yesterday's interval never enters today's quota.
        const interval = visibleInterval(from, now, watermark, visible);
        if (visible) localStorage.setItem(CLOCK_KEY, String(interval.watermark));
        let next = tick(state, interval.elapsed, visible, now);
        if (shouldWarn(next)) { next = { ...next, time: { ...next.time, warned: true } }; announce('warn'); }
        save(next, state);
      } catch { failed = true; cache = { ...snapshot(), available: false }; emit(); }
    };
    if (navigator.locks) void navigator.locks.request('lu-ls-clock', run); else run();
  };
  const onVisibility = () => update();
  const timer = setInterval(() => update(), 1000);
  document.addEventListener('visibilitychange', onVisibility);
  return () => { update(true); alive = false; clearInterval(timer); document.removeEventListener('visibilitychange', onVisibility); };
}
