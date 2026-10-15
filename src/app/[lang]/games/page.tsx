import type { Metadata } from 'next';
import { GameHub } from '@/features/games/components/GameHub';
export const metadata: Metadata = { title: 'เกาะแห่งการเล่น — Mini Game Center', description: 'เกมเรียนรู้สำหรับเด็ก 8 เกม จับคู่สี รูปทรง ความจำ จิ๊กซอว์ และอักษรอาหรับ' };
export default function GamesPage() { return <GameHub />; }
