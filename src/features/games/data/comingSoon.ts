import type { Text } from '@/i18n/config';
import type { GameDefinition } from './catalog';

/*
  เกมของเล่นพัฒนาการที่ยังไม่ได้ทำ มีแค่การ์ดในหน้าเกาะเกม (เจ้าของโปรเจกต์สั่ง 1 พ.ย. 2026)
  แยกจาก GameSlug ตั้งใจไม่ให้มี route, progress หรือ presentation ของเกมปลอม
*/
export type ComingSoonId = 'coin-box' | 'marble-run' | 'track-builder' | 'buttons-zips' | 'sand-trails';
export type ComingSoonGame = { id: ComingSoonId; title: Text; skill: Text; ageGroup: string; category: GameDefinition['category'] };

export const comingSoonGames: ComingSoonGame[] = [
  { id: 'buttons-zips', category: 'matching', ageGroup: '3–6', title: { th: 'กระดานกระดุมและซิป', en: 'Buttons & Zips' }, skill: { th: 'ฝึกนิ้วมือและการทำงานตามลำดับ', en: 'Finger control and following steps' } },
  { id: 'sand-trails', category: 'matching', ageGroup: '3–6', title: { th: 'วาดทางบนถาดทราย', en: 'Sand Trails' }, skill: { th: 'ฝึกลากเส้นตามทาง', en: 'Following lines with a finger' } },
  { id: 'track-builder', category: 'thinking', ageGroup: '3–6', title: { th: 'รถไฟต่อราง', en: 'Track Builder' }, skill: { th: 'ฝึกต่อเส้นทางให้ถึงที่หมาย', en: 'Connecting a path to its goal' } },
  { id: 'marble-run', category: 'thinking', ageGroup: '7+', title: { th: 'สร้างรางลูกแก้ว', en: 'Marble Run' }, skill: { th: 'ฝึกวางแผนแล้วลองแก้ไข', en: 'Planning, testing and fixing' } },
];
