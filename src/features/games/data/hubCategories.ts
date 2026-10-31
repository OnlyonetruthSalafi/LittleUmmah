import type { Text } from '@/i18n/config';
import type { GameDefinition, GameSlug } from './catalog';
import type { HeroGuideStep } from '@/features/moral/useHeroGuide';

export type GameCategory = {
  id: GameDefinition['category'];
  label: Text;
  desc: Text;
  icon: 'blocks' | 'search';
  theme: 'gold' | 'teal';
  order: GameSlug[];
  guide: HeroGuideStep;
};

// หมวดใช้ค่าเดิมของ catalog ส่วน order จัดเฉพาะการแสดงผล ไม่เปลี่ยน progress key
export const GAME_CATEGORIES: GameCategory[] = [
  {
    id: 'matching', label: { th: 'เสริมทักษะ', en: 'Build Skills' },
    desc: { th: 'จับคู่สี รูปทรง อักษร และแยกหมวด', en: 'Match colors, shapes, letters and groups.' },
    icon: 'blocks', theme: 'gold', order: ['color-match', 'shape-match', 'arabic-match', 'sort'],
    guide: {
      clip: 'hub-cat-skills', pose: 'point', focus: 'matching', ms: 6500,
      th: 'หมวดเสริมทักษะ มาฝึกจับคู่ รูปทรง อักษร และแยกของกันนะ',
      en: 'Build Skills: match colors, shapes and letters, and sort things.',
    },
  },
  {
    id: 'thinking', label: { th: 'ไหวพริบ', en: 'Think & Solve' },
    desc: { th: 'สังเกต จดจำ และค่อย ๆ หาคำตอบ', en: 'Observe, remember and solve at your own pace.' },
    icon: 'search', theme: 'teal', order: ['memory', 'find-object', 'puzzle', 'sequence', 'light-maze'],
    guide: {
      clip: 'hub-cat-thinking', pose: 'point', focus: 'thinking', ms: 8000,
      th: 'หมวดไหวพริบ มาจำ มาค้นหา แล้วคิดหาทางกันนะ เลือกเกมที่ชอบ แตะเลย!',
      en: 'Think & Solve: remember, find and work it out. Pick a game and tap!',
    },
  },
];

// ข้อความตรงกับคลิปเดิมใน make-game-voice.mjs ทั้งสองแบบ
export const HUB_INTRO: HeroGuideStep = {
  clip: 'hub-intro', pose: 'wave', ms: 8500,
  th: 'อัสสลามุอะลัยกุม ยินดีต้อนรับสู่เกาะเกมนะ มีเกมสนุกรออยู่หลายเกาะเลย เลือกเกาะที่ชอบ แล้วแตะเลย!',
  en: 'Assalamu alaikum! Welcome to Games Island. There are lots of fun game islands waiting. Pick the island you like and tap!',
};
export const HUB_INTRO_TOUCH: HeroGuideStep = {
  clip: 'hub-intro-touch', pose: 'wave', ms: 12500,
  th: 'อัสสลามุอะลัยกุม ยินดีต้อนรับสู่เกาะเกมนะ ถ้ามือถือยังตั้งอยู่ หมุนให้นอนแบบที่ครูทำให้ดูนะ เกมจะใหญ่ขึ้น เล่นง่ายขึ้น แล้วเลือกเกาะที่ชอบ แตะเลย!',
  en: 'Assalamu alaikum! Welcome to Games Island. If your phone is upright, turn it sideways like this. The games will be bigger and easier to play. Then pick the island you like and tap!',
};
