export type UserGameProgress = { gameId: string; completedLevels: number[]; highestLevel: number; stars: number; levelStars: Record<string, number>; lastPlayed: string };
export interface ProgressStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export interface GameProgressRepository { read(gameId: string): UserGameProgress; complete(gameId: string, level: number, stars: number): UserGameProgress }
const empty = (gameId: string): UserGameProgress => ({ gameId, completedLevels: [], highestLevel: 0, stars: 0, levelStars: {}, lastPlayed: '' });
export function createProgressRepository(storage: () => ProgressStorage | undefined): GameProgressRepository {
  const cache = new Map<string, UserGameProgress>();
  const unsaved = new Set<string>();
  const read = (gameId: string): UserGameProgress => {
    if (unsaved.has(gameId)) return cache.get(gameId) ?? empty(gameId);
    try {
      const raw = storage()?.getItem(`little-ummah:games:v1:${gameId}`);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null && 'levelStars' in parsed && typeof parsed.levelStars === 'object' && parsed.levelStars !== null) {
          const levelStars: Record<string, number> = {};
          for (const [key, value] of Object.entries(parsed.levelStars)) {
            if (/^[1-9]\d*$/.test(key) && typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 3) levelStars[key] = value;
          }
          const levels = Object.keys(levelStars).map(Number).sort((a, b) => a - b);
          const result = { gameId, levelStars, completedLevels: levels, highestLevel: Math.max(0, ...levels), stars: Object.values(levelStars).reduce((a, b) => a + b, 0), lastPlayed: 'lastPlayed' in parsed && typeof parsed.lastPlayed === 'string' ? parsed.lastPlayed : '' };
          cache.set(gameId, result); return result;
        }
      }
    } catch { /* Blocked/corrupt storage cannot interrupt play. */ }
    return cache.get(gameId) ?? empty(gameId);
  };
  return { read, complete(gameId, level, stars) {
    const previous = read(gameId);
    if (!Number.isInteger(level) || level < 1 || !Number.isFinite(stars)) return previous;
    const levelStars: Record<string, number> = { ...previous.levelStars, [level]: Math.max(previous.levelStars[level] ?? 0, Math.min(3, Math.max(1, Math.floor(stars)))) };
    const completedLevels = Object.keys(levelStars).map(Number).sort((a, b) => a - b);
    const result = { gameId, levelStars, completedLevels, highestLevel: Math.max(...completedLevels), stars: Object.values(levelStars).reduce((a, b) => a + b, 0), lastPlayed: new Date().toISOString() };
    cache.set(gameId, result);
    try { storage()?.setItem(`little-ummah:games:v1:${gameId}`, JSON.stringify(result)); unsaved.delete(gameId); } catch { unsaved.add(gameId); }
    return result;
  } };
}
export const gameProgress = createProgressRepository(() => typeof window === 'undefined' ? undefined : window.localStorage);
