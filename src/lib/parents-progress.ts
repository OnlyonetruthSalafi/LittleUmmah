import type { CurriculumAge, CurriculumItem } from './parents-curriculum';
import { createProgressRepository } from '../features/games/engine/progress.ts';
import { initial, readState, localDay } from '../features/learning-stars/model.ts';

export type ReadStorage = Pick<Storage, 'getItem'>;
export type PractisedItem = CurriculumItem & { stars?: number; dates: string[] };
function validDay(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number), date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}
/** Read adapter for private Classroom/moral readers. Dates remain local calendar days.
 * readState can seed storage; the adapter deliberately discards its writes and
 * supplies an already-seeded default so visiting this page never grants stars. */
export function readParentsProgress(curriculum: CurriculumAge[], storage?: ReadStorage, now = Date.now()) {
  const get = (key: string) => { try { return storage?.getItem(key) ?? null; } catch { return null; } };
  const base = initial(now);
  const adapter = { getItem: (key: string) => {
    const raw = get(key);
    if (key !== 'lu-settings') return raw;
    if (!raw) return JSON.stringify({ ...base.settings, seeded: true });
    try {
      const settings = JSON.parse(raw);
      // Keep validation of malformed flags; suppress only an actual false flag.
      return settings?.seeded === false ? JSON.stringify({ ...settings, seeded: true }) : raw;
    } catch { return raw; }
  }, setItem: () => {} };
  const state = readState(adapter, now);
  const repository = createProgressRepository(() => adapter);
  const json = (key: string): Record<string, unknown> => { try { const value = JSON.parse(get(key) ?? '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { return {}; } };
  const islands = curriculum[0]?.islands.map(island => {
    const unique = new Map(curriculum.flatMap(age => age.islands.find(row => row.slug === island.slug)?.items ?? []).map(item => [item.id, item]));
    const items: PractisedItem[] = [];
    for (const item of unique.values()) {
      let dates: string[] = [], stars: number | undefined, done = false;
      if (item.gameId && item.level) {
        const progress = repository.read(item.gameId);
        stars = progress.levelStars[item.level]; done = !!stars;
        // This timestamp belongs to the whole game, not an individual level.
      } else if (item.storageKey?.endsWith('-learned-v1')) {
        done = (get(item.storageKey) ?? '').split(',').includes(item.id.slice(item.id.indexOf(':') + 1));
      } else if (item.storageKey) {
        const raw = json(item.storageKey)[item.id];
        dates = Array.isArray(raw) ? [...new Set(raw.filter(validDay))].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) : [];
        stars = Math.min(3, dates.length); done = stars > 0;
      }
      if (item.rewardId && state.available && state.stars.earned.includes(item.rewardId)) {
        done = true;
        if (!dates.includes(localDay(now))) dates.push(localDay(now));
      }
      if (done) items.push({ ...item, stars, dates });
    }
    return { slug: island.slug, title: island.title, items };
  }) ?? [];
  return { islands, balance: state.available ? state.stars.balance : 0, minutes: state.available ? Math.floor(state.time.used / 60_000) : 0, available: !!storage && state.available, hasProgress: islands.some(island => island.items.length > 0) };
}
