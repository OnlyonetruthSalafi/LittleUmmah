import './parents-loader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { getCurriculum } = await import('../src/lib/parents-curriculum.ts');
const { readParentsProgress } = await import('../src/lib/parents-progress.ts');
const { CATEGORIES } = await import('../src/lib/categories.ts');
const { HADITH_SHELF, HADITH_SHELF_2 } = await import('../src/features/stories/data/hadith/index.ts');
const { COURSES } = await import('../src/features/languages/courses.ts');
const { games } = await import('../src/features/games/data/catalog.ts');
const { initial, localDay } = await import('../src/features/learning-stars/model.ts');
const curriculum = getCurriculum();
const now = new Date(2026, 10, 11, 12).getTime();
const state = initial(now); state.settings.seeded = true;
function storage(values = {}) { return { getItem: key => values[key] ?? null, setItem() { assert.fail('progress must never write'); } }; }
test('curriculum includes every live island for both ages; unavailable books excluded', () => {
  for (const age of curriculum) {
    assert.deepEqual(age.islands.map(i => i.slug), CATEGORIES.map(i => i.slug));
    for (const island of age.islands) {
      assert.ok(island.items.length); assert.equal(new Set(island.items.map(i => i.id)).size, island.items.length);
    }
    const books = age.islands.find(i => i.slug === 'stories').items;
    for (const shelf of [HADITH_SHELF, HADITH_SHELF_2]) for (const book of shelf[age.age]) assert.equal(books.some(i => i.id === book.story.slug), book.ready);
    const language = age.islands.find(i => i.slug === 'arabic').items;
    assert.equal(language.length, Object.values(COURSES).flatMap(c => c.units[age.age].flatMap(u => u.steps)).length);
    const levels = age.islands.find(i => i.slug === 'games').items;
    for (const game of games) assert.equal(levels.some(i => i.gameId === game.slug), game.enabled && (game.ageGroup === '3–10' || game.ageGroup === (age.age === 'kids' ? '3–6' : '7+')));
    assert.equal(levels.filter(i => i.gameId === 'shape-match').length, age.age === 'kids' ? 1 : 0);
  }
});
test('empty, unavailable and blocked storage do not throw or write/seed stars', () => {
  for (const input of [undefined, storage(), { getItem() { throw Error('blocked'); } }]) {
    const result = readParentsProgress(curriculum, input, now);
    assert.equal(result.hasProgress, false); assert.equal(result.balance, 0); assert.equal(result.minutes, 0);
  }
  assert.equal(readParentsProgress(curriculum, storage({ 'lu-settings': JSON.stringify(initial(now).settings) }), now).balance, 0);
});
test('corrupt data and invalid dates/IDs/levels are ignored', () => {
  const item = curriculum[0].islands.find(i => i.slug === 'moral').items[0];
  const result = readParentsProgress(curriculum, storage({ 'lu-settings': '{bad', 'lu-moral-progress': JSON.stringify({ [item.id]: [null, 3, '2026-2-31', 'bad'], unknown: ['2026-11-11'] }), 'lu-arabic-learned-v1': 'unknown', 'little-ummah:games:v1:puzzle': JSON.stringify({ levelStars: { 999: 3, 1: 4, 2: '2' } }) }), now);
  assert.equal(result.hasProgress, false);
});
test('real store formats map to source names, dates, stars, languages and puzzle variants without writes', () => {
  const moral = curriculum[0].islands.find(i => i.slug === 'moral').items[0];
  const story = curriculum[0].islands.find(i => i.slug === 'stories').items[0];
  const values = { 'lu-settings': JSON.stringify(state.settings), 'lu-ls-stars': JSON.stringify({ ...state.stars, balance: 7, earned: [story.rewardId] }), 'lu-ls-time': JSON.stringify({ ...state.time, used: 125000 }), 'lu-moral-progress': JSON.stringify({ [moral.id]: ['2026-11-10', '2026-11-10', '2026-11-11'] }), 'lu-arabic-learned-v1': 'alif,ba', 'little-ummah:games:v1:puzzle:flower-garden': JSON.stringify({ levelStars: { 1: 2, 2: 3 }, lastPlayed: new Date(now).toISOString() }) };
  const result = readParentsProgress(curriculum, storage(values), now);
  assert.equal(result.balance, 7); assert.equal(result.minutes, 2);
  assert.deepEqual(result.islands.find(i => i.slug === 'moral').items[0].title, moral.title);
  assert.equal(result.islands.find(i => i.slug === 'moral').items[0].stars, 2);
  assert.equal(result.islands.find(i => i.slug === 'arabic').items.length, 2);
  assert.equal(result.islands.find(i => i.slug === 'games').items.length, 2);
  assert.deepEqual(result.islands.find(i => i.slug === 'stories').items[0].dates, [localDay(now)]);
  const tomorrow = readParentsProgress(curriculum, storage(values), now + 86400000);
  assert.equal(tomorrow.minutes, 0); assert.equal(tomorrow.islands.find(i => i.slug === 'stories').items.length, 0);
});
