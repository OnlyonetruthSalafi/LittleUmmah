export type GameIconName = "memory" | "moon" | "mushaf" | "lantern" | "dates" | "mat" | "jug" | "letters" | "maze";
export type AgeGroup = "kids" | "juniors";
export type Game = {
  slug: string;
  nameTh: string;
  nameEn: string;
  ageGroup: AgeGroup;
  icon: GameIconName;
  color: "bg-sky" | "bg-game-peach" | "bg-game-mint" | "bg-game-lilac";
} & ({ status: "playable"; href: string } | { status: "coming-soon"; href?: never });

// เก็บระดับไว้ใน URL เพื่อให้ผู้ปกครองส่งลิงก์ตรงช่วงวัยได้
export const AGE_GROUPS = [
  { id: "kids", nameTh: "วัย 3-6 ปี", nameEn: "Ages 3–6", hint: "เล่นง่าย", hintEn: "Easy play", pairs: 3 },
  { id: "juniors", nameTh: "วัย 7 ปีขึ้นไป", nameEn: "Ages 7+", hint: "ท้าทายขึ้น", hintEn: "More challenge", pairs: 6 },
] as const;

export const GAMES: Game[] = [
  { slug: "memory-easy", nameTh: "จับคู่ภาพ", nameEn: "Memory Match", ageGroup: "kids", status: "playable", href: "/learn/games/memory/easy", icon: "memory", color: "bg-sky" },
  { slug: "count-dates", nameTh: "นับอินทผลัม", nameEn: "Count the Dates", ageGroup: "kids", status: "coming-soon", icon: "dates", color: "bg-game-peach" },
  { slug: "color-lantern", nameTh: "ระบายสีโคมไฟ", nameEn: "Color a Lantern", ageGroup: "kids", status: "coming-soon", icon: "lantern", color: "bg-game-lilac" },
  { slug: "shadows", nameTh: "ทายเงาสิ่งของ", nameEn: "Object Shadows", ageGroup: "kids", status: "coming-soon", icon: "jug", color: "bg-game-mint" },
  { slug: "memory-hard", nameTh: "จับคู่ภาพ", nameEn: "Memory Match", ageGroup: "juniors", status: "playable", href: "/learn/games/memory/hard", icon: "memory", color: "bg-game-lilac" },
  { slug: "arabic", nameTh: "จับคู่อักษรอาหรับ", nameEn: "Arabic Letter Match", ageGroup: "juniors", status: "coming-soon", icon: "letters", color: "bg-game-peach" },
  { slug: "wudu", nameTh: "เรียงขั้นตอนอาบน้ำละหมาด", nameEn: "Wudu Steps", ageGroup: "juniors", status: "coming-soon", icon: "jug", color: "bg-game-mint" },
  { slug: "maze", nameTh: "เขาวงกตไปมัสยิด", nameEn: "Mosque Maze", ageGroup: "juniors", status: "coming-soon", icon: "maze", color: "bg-sky" },
];

export const MEMORY_ITEMS: { icon: GameIconName; nameTh: string; nameEn: string }[] = [
  { icon: "moon", nameTh: "ดวงจันทร์", nameEn: "Moon" },
  { icon: "lantern", nameTh: "โคมไฟ", nameEn: "Lantern" },
  { icon: "dates", nameTh: "อินทผลัม", nameEn: "Dates" },
  { icon: "mushaf", nameTh: "อัลกุรอาน", nameEn: "Quran" },
  { icon: "mat", nameTh: "เสื่อละหมาด", nameEn: "Prayer Mat" },
  { icon: "jug", nameTh: "เหยือกน้ำ", nameEn: "Water Jug" },
];
