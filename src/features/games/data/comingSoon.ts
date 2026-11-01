import type { Text } from '@/i18n/config';
import type { GameDefinition } from './catalog';

/*
  เกมของเล่นพัฒนาการที่ยังไม่ได้ทำ มีแค่การ์ดในหน้าเกาะเกม (เจ้าของโปรเจกต์สั่ง 1 พ.ย. 2026)
  แยกจาก GameSlug ตั้งใจไม่ให้มี route, progress หรือ presentation ของเกมปลอม
*/
export type ComingSoonId = 'block-builders' | 'bead-lacing' | 'coin-box' | 'balance-scale' | 'marble-run' | 'track-builder' | 'buttons-zips' | 'sand-trails';
export type ComingSoonGame = { id: ComingSoonId; title: Text; skill: Text; ageGroup: string; category: GameDefinition['category'] };

export const comingSoonGames: ComingSoonGame[] = [
  { id: 'bead-lacing', category: 'matching', ageGroup: '3–6', title: { th: 'ร้อยเชือกลูกปัด', en: 'Bead Lacing' }, skill: { th: 'ฝึกมือกับสายตาให้ทำงานด้วยกัน', en: 'Hand and eye working together' } },
  { id: 'coin-box', category: 'matching', ageGroup: '3–6', title: { th: 'กล่องเหรียญนับจำนวน', en: 'Counting Coin Box' }, skill: { th: 'ฝึกนับทีละหนึ่ง', en: 'Counting one by one' } },
  { id: 'buttons-zips', category: 'matching', ageGroup: '3–6', title: { th: 'กระดานกระดุมและซิป', en: 'Buttons & Zips' }, skill: { th: 'ฝึกนิ้วมือและการทำงานตามลำดับ', en: 'Finger control and following steps' } },
  { id: 'sand-trails', category: 'matching', ageGroup: '3–6', title: { th: 'วาดทางบนถาดทราย', en: 'Sand Trails' }, skill: { th: 'ฝึกลากเส้นตามทาง', en: 'Following lines with a finger' } },
  { id: 'block-builders', category: 'thinking', ageGroup: '3–6', title: { th: 'ต่อบล็อกสร้างบ้าน', en: 'Block Builders' }, skill: { th: 'ฝึกคิดเรื่องพื้นที่และการวางแผน', en: 'Space and planning' } },
  { id: 'track-builder', category: 'thinking', ageGroup: '3–6', title: { th: 'รถไฟต่อราง', en: 'Track Builder' }, skill: { th: 'ฝึกต่อเส้นทางให้ถึงที่หมาย', en: 'Connecting a path to its goal' } },
  { id: 'balance-scale', category: 'thinking', ageGroup: '7+', title: { th: 'ตาชั่งสมดุล', en: 'Balance Scale' }, skill: { th: 'ฝึกเปรียบเทียบและทดลอง', en: 'Comparing and testing' } },
  { id: 'marble-run', category: 'thinking', ageGroup: '7+', title: { th: 'สร้างรางลูกแก้ว', en: 'Marble Run' }, skill: { th: 'ฝึกวางแผนแล้วลองแก้ไข', en: 'Planning, testing and fixing' } },
];
