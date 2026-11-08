import type { Text } from '@/i18n/config';

export const PUZZLE_PICTURES: { id: string; label: Text; src?: string }[] = [
  { id: 'original', label: { th: 'ภาพชุดเดิม', en: 'Original pictures' } },
  { id: 'flower-garden', label: { th: 'สวนกระถางดอกไม้', en: 'Potted flower garden' }, src: '/games/puzzle/flower-garden.webp' },
  { id: 'sailboat-bay', label: { th: 'เรือใบในอ่าว', en: 'Sailboat bay' }, src: '/games/puzzle/sailboat-bay.webp' },
  { id: 'toy-station', label: { th: 'สถานีรถไฟของเล่น', en: 'Toy train station' }, src: '/games/puzzle/toy-station.webp' },
];
export const PUZZLE_CHOOSE = { th: 'เลือกภาพ', en: 'Choose a picture' };
export function puzzlePicture(id = 'original') {
  return PUZZLE_PICTURES.find(picture => picture.id === id) ?? PUZZLE_PICTURES[0];
}
// Keep legacy progress intact; each new picture has its own three levels.
export function puzzleProgressId(id = 'original') {
  const picture = puzzlePicture(id);
  return picture.id === 'original' ? 'puzzle' : `puzzle:${picture.id}`;
}
