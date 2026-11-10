import type { Text } from "@/i18n/config";
export type Category = {
  slug: string;
  name: Text;
  href: string;
  image: string;
};

/*
  หมวดหมู่ที่เปิดใช้งานของหน้าแรก
  ภาพเกาะเป็นงานวาดจริง แปลงเป็น WebP ด้วย scripts/optimize-images.mjs

  mockup เดิมมีหมวด "ดนตรี" ซึ่งขัดข้อกำหนดข้อ 1.3 โดยตรง
  เคยเปลี่ยนเป็น "เสียงและการฟัง" ไปรอบหนึ่ง แต่ภาพประกอบยังมีโน้ตดนตรีกับหูฟังอยู่ดี
  เจ้าของโปรเจกต์จึงเปลี่ยนหมวดนี้เป็น "มารยาทและศีลธรรม" พร้อมภาพใหม่
  กฎข้อ 1.3 จึงคงไว้เหมือนเดิม ไม่ต้องผ่อนปรน

  ลิงก์ใช้ /learn/<slug> ซึ่งไม่ผูกกับช่วงวัย
  ก่อนหน้านี้ชี้ไป /kids/<slug> ทั้งหมด ซึ่งแปลว่าเด็ก 7 ปีขึ้นไปที่กดจากหน้าแรก
  จะถูกพาเข้าเนื้อหาของวัย 3-6 โดยไม่ได้เลือกเอง
  หน้า /learn/<slug> จะเป็นตัวส่งต่อไปยัง track ตามวัยที่ผู้ใช้เลือกไว้

  ลำดับตามที่เจ้าของโปรเจกต์กำหนด: มารยาท -> เรื่องเล่า -> ภาษาอาหรับ แล้วจึงหมวดที่เหลือ
*/
export const CATEGORIES: Category[] = [
  {
    slug: "moral",
    name: { th: "มารยาทและศีลธรรม", en: "Manners & Morals" },
    href: "/learn/moral",
    image: "/islands/moral.webp",
  },
  {
    slug: "stories",
    name: { th: "เรื่องเล่า", en: "Stories" },
    href: "/learn/stories",
    image: "/islands/stories.webp",
  },
  {
    /*
      เดิมเป็นเกาะ "อัลกุรอาน" เจ้าของโปรเจกต์เปลี่ยนเป็นภาษาอาหรับเบื้องต้น
      ภาพยังใช้ไฟล์เดิม (มุศฮัฟ) ชั่วคราว รอภาพเกาะใหม่ — ดู public/islands/README.md
    */
    slug: "arabic",
    name: { th: "เรียนภาษาเบื้องต้น", en: "Basic Languages" },
    href: "/learn/languages",
    image: "/islands/quran.webp",
  },
  {
    slug: "explore",
    name: { th: "สำรวจโลก", en: "Explore" },
    href: "/learn/explore",
    image: "/islands/explore.webp",
  },
  {
    slug: "games",
    name: { th: "เกม", en: "Games" },
    href: "/learn/games",
    image: "/islands/games.webp",
  },
  {
    slug: "art",
    name: { th: "ศิลปะ", en: "Art" },
    href: "/learn/art",
    image: "/islands/art.webp",
  },
  { slug: "faith-basics", name: { th: "เรียนรู้อิสลามพื้นฐานสำหรับเด็ก", en: "Islam Basics for Kids" }, href: "/learn/faith-basics", image: "/islands/faith-basics.webp" },
];

// Homepage groups are separate from CATEGORIES: other pages still need the
// live category shortcuts, never links to subjects that have not opened yet.
export type HomeIsland = Omit<Category, "href"> & { href?: string; comingSoon?: boolean };
const upcoming: HomeIsland[] = [
  { slug: "tajweed", name: { th: "ตัจวีดพื้นฐาน", en: "Tajweed Basics" }, image: "/islands/tajweed.webp", comingSoon: true },
  { slug: "quran-reading", name: { th: "ฝึกอ่านอัลกุรอาน", en: "Qur'an Reading" }, image: "/islands/quran-reading.webp", comingSoon: true },
  { slug: "numbers-math", name: { th: "ตัวเลขและคณิตคิดสนุก", en: "Numbers & Math" }, image: "/islands/numbers-math.webp", comingSoon: true },
];
const category = (slug: string) => CATEGORIES.find((entry) => entry.slug === slug)!;
export const HOME_ISLANDS: { learn: HomeIsland[]; play: HomeIsland[] } = {
  // Homepage grouping only; Arabic remains first in reading order.
  learn: [category("arabic"), category("moral"), ...upcoming.filter((entry) => entry.slug !== "numbers-math"), category("faith-basics")],
  play: [category("stories"), category("art"), category("games"), upcoming.find((entry) => entry.slug === "numbers-math")!, category("explore")],
};
