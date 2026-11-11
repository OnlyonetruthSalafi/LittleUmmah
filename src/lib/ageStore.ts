/** Age preference is device-local. No cookies; blocked storage falls back to memory. */
export type Age = "kids" | "juniors";
export const AGE_STORAGE_KEY = "lu-age";
export function parseAge(value: unknown): Age | null {
  return value === "kids" || value === "juniors" ? value : null;
}
let cached: Age | null | undefined;
const listeners = new Set<() => void>();
function read(): Age | null {
  try { return parseAge(window.localStorage.getItem(AGE_STORAGE_KEY)); }
  catch { return null; }
}
export function getAgeSnapshot(): Age | null {
  if (typeof window === "undefined") return null;
  if (cached === undefined) cached = read();
  return cached;
}
export function getAgeServerSnapshot(): null { return null; }
export function subscribeAge(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function notify() { for (const listener of listeners) listener(); }
export function setAge(age: Age) {
  if (!parseAge(age)) return;
  cached = age;
  try { window.localStorage.setItem(AGE_STORAGE_KEY, age); } catch { /* memory only */ }
  notify();
}
export function refreshAge() { cached = read(); notify(); }
