import type { GameSlug, Label } from './catalog';

/*
  สอนเล่นก่อนเริ่มเกม — เจ้าของโปรเจกต์สั่ง 31 ต.ค. 2026 เริ่มจากเขาวงกตแสงเกมเดียว
  clip = public/audio/<ภาษา>/<clip>.mp3 (scripts/make-game-voice.mjs)
  ms = เวลาของจังหวะเมื่อเล่นเสียงไม่ได้หรือปิดเสียงอยู่
*/
export type TutorialStep = { text: Label; clip: string; ms: number };

export const GAME_TUTORIALS: Partial<Record<GameSlug, readonly TutorialStep[]>> = {
  'light-maze': [
    { text: { th: 'แตะปุ่มลูกศร พาหุ่นลูกกลมเดินนะ', en: 'Tap the arrows to move the round robot.' }, clip: 'howto-light-maze-1', ms: 4000 },
    { text: { th: 'เก็บเม็ดแสงให้ครบทุกเม็ด', en: 'Collect all the lights.' }, clip: 'howto-light-maze-2', ms: 4000 },
    { text: { th: 'เจอเพื่อนหุ่นยนต์ ให้เลือกทางหลบนะ', en: 'See a robot friend? Go another way.' }, clip: 'howto-light-maze-3', ms: 4000 },
  ],
};
