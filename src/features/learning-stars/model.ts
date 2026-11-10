/** Pure rules. Dates deliberately use the device's local calendar. */
export const MINUTE = 60_000;
export const SETTINGS_KEY = 'lu-settings';
export const STARS_KEY = 'lu-ls-stars';
export const TIME_KEY = 'lu-ls-time';
export const CLOCK_KEY = 'lu-ls-clock';
export type Settings = { starsEnabled: boolean; timeEnabled: boolean; minutes: number; seeded: boolean };
export type Stars = { balance: number; earnedDay: string; earned: string[]; activeRound: boolean; freeDay: string };
export type Time = { day: string; used: number; extra: number; unlimited: boolean; warned: boolean };
export type State = { settings: Settings; stars: Stars; time: Time; available: boolean };
export function localDay(now: number) { const d = new Date(now); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
export function initial(now: number): State {
  return { settings: { starsEnabled: true, timeEnabled: false, minutes: 30, seeded: false }, stars: { balance: 0, earnedDay: localDay(now), earned: [], activeRound: false, freeDay: '' }, time: { day: localDay(now), used: 0, extra: 0, unlimited: false, warned: false }, available: true };
}
export function rollover(state: State, now: number): State {
  const day = localDay(now);
  return { ...state, stars: state.stars.earnedDay === day ? state.stars : { ...state.stars, earnedDay: day, earned: [] }, time: state.time.day === day ? state.time : initial(now).time };
}
export function seed(state: State): State {
  return state.settings.seeded ? state : { ...state, settings: { ...state.settings, seeded: true }, stars: { ...state.stars, balance: 3 } };
}
export function earn(state: State, id: string, now: number): { state: State; result: 'earned' | 'full' | 'duplicate' } {
  const s = rollover(state, now);
  if (s.stars.earned.includes(id)) return { state: s, result: 'duplicate' };
  if (s.stars.balance >= 20) return { state: s, result: 'full' };
  return { state: { ...s, stars: { ...s.stars, balance: s.stars.balance + 1, earned: [...s.stars.earned, id] } }, result: 'earned' };
}
export function remaining(state: State) { return (state.settings.minutes + state.time.extra) * MINUTE - state.time.used; }
export function timeLocked(state: State, playing = false) {
  return state.available && state.settings.timeEnabled && !state.time.unlimited && remaining(state) <= (playing ? -5 * MINUTE : 0);
}
export function roundKind(state: State, now: number) {
  if (!state.available || !state.settings.starsEnabled) return 'unlimited';
  if (state.stars.activeRound) return 'credit';
  return state.stars.freeDay !== localDay(now) ? 'free' : 'star';
}
/** midLevel = เริ่มใหม่ด่านเดิมที่ยังไม่ผ่าน: ใช้ช่วงผ่อนเวลาเหมือนกำลังเล่น (เพดานเดิม 5 นาที) */
export function startRound(state: State, now: number, midLevel = false): { state: State; blocked?: 'time' | 'stars' } {
  const s = rollover(state, now);
  if (timeLocked(s, midLevel)) return { state: s, blocked: 'time' };
  const kind = roundKind(s, now);
  if (kind === 'unlimited' || kind === 'credit') return { state: s };
  if (kind === 'star' && !s.stars.balance) return { state: s, blocked: 'stars' };
  return { state: { ...s, stars: { ...s.stars, activeRound: true, balance: s.stars.balance - (kind === 'star' ? 1 : 0), freeDay: kind === 'free' ? localDay(now) : s.stars.freeDay } } };
}
/** หักดาวดวงสุดท้ายในการเริ่มรอบนี้ (ไม่นับรอบฟรีหรือเครดิตเดิม) */
export function isLastStar(before: State, after: State) {
  return before.stars.balance > 0 && after.stars.balance === 0 && !before.stars.activeRound && after.stars.activeRound;
}
/** ดาวหมดจริง: ไม่มีดาว ไม่มีเครดิต และใช้รอบฟรีของวันนี้ไปแล้ว */
/** ใช้กับ state ที่ผ่าน rollover แล้ว (read() ทำให้เสมอ) earnedDay จึงเป็นวันนี้ */
export function starsOut(s: State) {
  return s.available && s.settings.starsEnabled && !s.stars.activeRound && s.stars.balance === 0 && s.stars.freeDay === s.stars.earnedDay;
}
export function completeRound(state: State): State { return { ...state, stars: { ...state.stars, activeRound: false } }; }
export function tick(state: State, elapsed: number, visible: boolean, now: number): State {
  const s = rollover(state, now);
  if (!visible || !s.available) return s;
  return { ...s, time: { ...s.time, used: s.time.used + Math.max(0, elapsed) } };
}
export function visibleInterval(from: number, now: number, watermark: number, visible: boolean) {
  const midnight = new Date(now); midnight.setHours(0,0,0,0);
  return { elapsed: visible ? Math.max(0, now - Math.max(from, watermark, midnight.getTime())) : 0, watermark: visible ? Math.max(now, watermark) : watermark };
}
export function shouldWarn(s: State) { return s.available && s.settings.timeEnabled && !s.time.unlimited && !s.time.warned && remaining(s) > 0 && remaining(s) <= 2 * MINUTE; }
export function unlock(state: State, amount: 15 | 30 | 'day'): State {
  return { ...state, time: { ...state.time, warned: false, unlimited: amount === 'day' || state.time.unlimited, extra: amount === 'day' ? state.time.extra : Math.max(state.time.extra, state.time.used / MINUTE - state.settings.minutes) + amount } };
}
export function clearStars(state: State): State { return { ...state, stars: { ...state.stars, balance: 0, earned: [], activeRound: false } }; }
export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;
export function readState(storage: StorageLike, now: number): State {
  const base = initial(now);
  try {
    const parse = (key: string) => JSON.parse(storage.getItem(key) || 'null');
    const settings = parse(SETTINGS_KEY), stars = parse(STARS_KEY), time = parse(TIME_KEY);
    if (settings) {
      if (typeof settings.starsEnabled !== 'boolean' || typeof settings.timeEnabled !== 'boolean' || ![15,20,30,45,60,90].includes(settings.minutes) || typeof settings.seeded !== 'boolean') throw Error('settings');
      base.settings = settings;
    }
    if (stars) {
      if (!Number.isInteger(stars.balance) || stars.balance < 0 || stars.balance > 20 || !Array.isArray(stars.earned) || !stars.earned.every((v: unknown) => typeof v === 'string') || typeof stars.earnedDay !== 'string' || typeof stars.freeDay !== 'string' || typeof stars.activeRound !== 'boolean') throw Error('stars');
      base.stars = stars;
    }
    if (time) {
      if (typeof time.day !== 'string' || !Number.isFinite(time.used) || time.used < 0 || !Number.isFinite(time.extra) || time.extra < 0 || typeof time.unlimited !== 'boolean' || typeof time.warned !== 'boolean') throw Error('time');
      base.time = time;
    }
    const ready = seed(rollover(base, now));
    return settings?.seeded ? ready : writeState(storage, ready);
  } catch { return { ...base, available: false }; }
}
export function writeState(storage: StorageLike, s: State): State {
  try {
    // Persist the once-only flag first: a partial write must never regrant starter stars.
    storage.setItem(SETTINGS_KEY, JSON.stringify(s.settings));
    storage.setItem(STARS_KEY, JSON.stringify(s.stars));
    storage.setItem(TIME_KEY, JSON.stringify(s.time));
    return s;
  } catch { return { ...s, available: false }; }
}
