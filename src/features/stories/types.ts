export type StoryPage = {
  /** ภาพเต็มสองหน้า (1536x1024) แบ่งซ้าย-ขวาตรงสันหนังสือ */
  image: string;
  alt: string;
  th: string;
  en: string;
  /** ข้อความภาษาอาหรับ แสดงเป็นตัวอักษร เสียงพากย์อ่านจาก reading แทน */
  arabic?: string;
  reading?: string;
  meaning?: string;
};

export type Story = {
  slug: string;
  titleTh: string;
  titleEn: string;
  /** ภาพปกแนวตั้ง */
  cover: string;
  coverAlt: string;
  /** หุ่นยนต์ผู้เล่าเรื่อง (ข้อ 1.2) */
  robot: string;
  pages: StoryPage[];
};
