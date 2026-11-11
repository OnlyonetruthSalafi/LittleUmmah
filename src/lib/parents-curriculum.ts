import type { Text } from '../i18n/config';
import { CATEGORIES } from './categories';
import { getIslandContent } from './lessons';
import { LESSONS } from '../features/faith/data';
import { HABITAT_LESSONS } from '../features/explore/data';
import { shelfBooks, hadithShelfBooks, hadithShelf2Books } from '../features/stories/shelf';
import { COURSES } from '../features/languages/courses';
import { ART_PICTURES } from '../features/art/data';
import { games } from '../features/games/data/catalog';
import { gamePresentation as presentation } from '../features/games/data/presentation';
import { PUZZLE_PICTURES, puzzleProgressId } from '../features/games/data/puzzlePictures';

export type CurriculumItem = { id: string; title: Text; unit: 'lessons' | 'books' | 'levels' | 'pictures'; storageKey?: string; rewardId?: string; gameId?: string; level?: number };
export type CurriculumIsland = { slug: string; title: Text; href: string; items: CurriculumItem[] };
export type CurriculumAge = { age: 'kids' | 'juniors'; islands: CurriculumIsland[] };

/** Same sources and availability rules as the live island routes. No lesson copy. */
export function getCurriculum(): CurriculumAge[] {
  return (['kids', 'juniors'] as const).map(age => ({ age, islands: CATEGORIES.map(category => {
    let items: CurriculumItem[] = [];
    const lessons = (rows: { id: string; title: Text }[], prefix: string, storageKey?: string) => rows.map(row => ({ id: row.id, title: row.title, unit: 'lessons' as const, rewardId: `${prefix}:${row.id}`, storageKey }));
    switch (category.slug) {
      case 'moral': items = lessons(getIslandContent('moral')![age], 'moral', 'lu-moral-progress'); break;
      case 'explore': items = lessons([...HABITAT_LESSONS[age], ...getIslandContent('explore')![age]], 'explore', 'lu-explore-progress'); break;
      case 'faith-basics': items = lessons(LESSONS[age], 'faith', 'lu-faith-progress'); break;
      case 'stories': items = [shelfBooks(), hadithShelfBooks(), hadithShelf2Books()].flatMap(shelf => shelf[age].filter(book => book.href).map(book => ({ id: book.id, title: book.title, unit: 'books', rewardId: `story:${book.id}` }))); break;
      case 'arabic': items = Object.values(COURSES).flatMap(course => course.units[age].flatMap(unit => unit.steps.map(step => ({ id: `${course.id}:${step.id}`, title: step.title, unit: 'lessons', storageKey: course.progressKey, rewardId: course.id === 'arabic' ? `arabic:${step.id}` : `lang:${course.id}:${step.id}` })))); break;
      case 'art': items = ART_PICTURES.map(picture => ({ id: picture.id, title: picture.title, unit: 'pictures' })); break;
      case 'games': items = games.filter(game => game.enabled && (game.ageGroup === '3–10' || game.ageGroup === (age === 'kids' ? '3–6' : '7+'))).flatMap(game => {
        const theme = presentation[game.slug];
        const variants = game.slug === 'puzzle' ? PUZZLE_PICTURES.map(picture => ({ id: puzzleProgressId(picture.id), title: picture.label })) : [{ id: game.slug, title: game.title }];
        return variants.flatMap(variant => theme.levels.slice(0, theme.levelCount ?? 3).map((title, index) => ({ id: `${variant.id}:${index + 1}`, gameId: variant.id, level: index + 1, unit: 'levels' as const, title: { th: `${game.title.th} · ${variant.id === game.slug ? '' : variant.title.th + ' · '}${title.th}`, en: `${game.title.en} · ${variant.id === game.slug ? '' : variant.title.en + ' · '}${title.en}` } })));
      }); break;
      default: items = lessons(getIslandContent(category.slug)?.[age] ?? [], category.slug);
    }
    return { slug: category.slug, title: category.name, href: category.href, items };
  }) }));
}
