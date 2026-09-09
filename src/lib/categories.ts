export type Category = {
  slug: string;
  nameTh: string;
  nameEn: string;
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
*/
export const CATEGORIES: Category[] = [
  {
    slug: "games",
    nameTh: "เกม",
    nameEn: "Games",
    href: "/learn/games",
    image: "/islands/games.webp",
  },
  {
    slug: "stories",
    nameTh: "เรื่องเล่า",
    nameEn: "Stories",
    href: "/learn/stories",
    image: "/islands/stories.webp",
  },
  {
    slug: "quran",
    nameTh: "อัลกุรอาน",
    nameEn: "Quran",
    href: "/learn/quran",
    image: "/islands/quran.webp",
  },
  {
    slug: "explore",
    nameTh: "สำรวจโลก",
    nameEn: "Explore",
    href: "/learn/explore",
    image: "/islands/explore.webp",
  },
  {
    slug: "art",
    nameTh: "ศิลปะ",
    nameEn: "Art",
    href: "/learn/art",
    image: "/islands/art.webp",
  },
  {
    slug: "moral",
    nameTh: "มารยาทและศีลธรรม",
    nameEn: "Manners & Morals",
    href: "/learn/moral",
    image: "/islands/moral.webp",
  },
];
