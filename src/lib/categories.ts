import type { Text } from "@/i18n/config";
export type Category = {
  slug: string;
  name: Text;
  href: string;
  image: string;
};

/*
  หมวดหมู่ทั้งหกของหน้าแรก
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
    name: { th: "ภาษาอาหรับเบื้องต้น", en: "Basic Arabic" },
    href: "/learn/arabic",
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
];
