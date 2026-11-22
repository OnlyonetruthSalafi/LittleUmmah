import type { Text } from '@/i18n/config';
import type { GameDefinition } from './catalog';

/*
  เกมของเล่นพัฒนาการที่ยังไม่ได้ทำ มีแค่การ์ดในหน้าเกาะเกม (เจ้าของโปรเจกต์สั่ง 1 พ.ย. 2026)
  แยกจาก GameSlug ตั้งใจไม่ให้มี route, progress หรือ presentation ของเกมปลอม
*/
export type ComingSoonId = 'coin-box' | 'marble-run' | 'buttons-zips' | 'sand-trails';
export type ComingSoonGame = { id: ComingSoonId; title: Text; skill: Text; ageGroup: string; category: GameDefinition['category'] };

export const comingSoonGames: ComingSoonGame[] = [];
