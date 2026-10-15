import type { Text } from "@/i18n/config";
export type GameIconName = "memory" | "moon" | "mushaf" | "lantern" | "dates" | "mat" | "jug" | "letters" | "maze";
export type AgeGroup = "kids" | "juniors";
export type Game = {
  slug: string;
  name: Text;
  ageGroup: AgeGroup;
  icon: GameIconName;
  color: "bg-sky" | "bg-game-peach" | "bg-game-mint" | "bg-game-lilac";
} & ({ status: "playable"; href: string } | { status: "coming-soon"; href?: never });

// เก็บระดับไว้ใน URL เพื่อให้ผู้ปกครองส่งลิงก์ตรงช่วงวัยได้
export const AGE_GROUPS = [
  { id: "kids", name: { th: "วัย 3-6 ปี", en: "Ages 3–6" }, hint: { th: "เล่นง่าย", en: "Easy play" }, pairs: 3 },
  { id: "juniors", name: { th: "วัย 7 ปีขึ้นไป", en: "Ages 7+" }, hint: { th: "ท้าทายขึ้น", en: "More challenge" }, pairs: 6 },
] as const;

export const GAMES: Game[] = [
  { slug: "memory-easy", name: { th: "จับคู่ภาพ", en: "Memory Match" }, ageGroup: "kids", status: "playable", href: "/learn/games/memory/easy", icon: "memory", color: "bg-sky" },
  { slug: "count-dates", name: { th: "นับอินทผลัม", en: "Count the Dates" }, ageGroup: "kids", status: "coming-soon", icon: "dates", color: "bg-game-peach" },
  { slug: "color-lantern", name: { th: "ระบายสีโคมไฟ", en: "Color a Lantern" }, ageGroup: "kids", status: "coming-soon", icon: "lantern", color: "bg-game-lilac" },
  { slug: "shadows", name: { th: "ทายเงาสิ่งของ", en: "Object Shadows" }, ageGroup: "kids", status: "coming-soon", icon: "jug", color: "bg-game-mint" },
  { slug: "memory-hard", name: { th: "จับคู่ภาพ", en: "Memory Match" }, ageGroup: "juniors", status: "playable", href: "/learn/games/memory/hard", icon: "memory", color: "bg-game-lilac" },
  { slug: "arabic", name: { th: "จับคู่อักษรอาหรับ", en: "Arabic Letter Match" }, ageGroup: "juniors", status: "coming-soon", icon: "letters", color: "bg-game-peach" },
  { slug: "wudu", name: { th: "เรียงขั้นตอนอาบน้ำละหมาด", en: "Wudu Steps" }, ageGroup: "juniors", status: "coming-soon", icon: "jug", color: "bg-game-mint" },
  { slug: "maze", name: { th: "เขาวงกตไปมัสยิด", en: "Mosque Maze" }, ageGroup: "juniors", status: "coming-soon", icon: "maze", color: "bg-sky" },
];

export const MEMORY_ITEMS: { icon: GameIconName; name: Text }[] = [
  { icon: "moon", name: { th: "ดวงจันทร์", en: "Moon" } },
  { icon: "lantern", name: { th: "โคมไฟ", en: "Lantern" } },
  { icon: "dates", name: { th: "อินทผลัม", en: "Dates" } },
  { icon: "mushaf", name: { th: "อัลกุรอาน", en: "Quran" } },
  { icon: "mat", name: { th: "เสื่อละหมาด", en: "Prayer Mat" } },
  { icon: "jug", name: { th: "เหยือกน้ำ", en: "Water Jug" } },
];
