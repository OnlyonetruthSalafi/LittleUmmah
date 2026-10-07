/**
  ฉากเคลื่อนไหวซ้อนบนภาพหน้าคู่ (โหมด deluxe) — เคลื่อนแค่สิ่งไม่มีชีวิต: น้ำ เมฆ ฝน ฟอง แสง
  ตำแหน่งจุดเด่นของภาพ (วังน้ำวน ดวงจันทร์) อยู่ใน story.css ตามชื่อฉาก
*/
export type SceneFx = "clouds" | "harbor" | "storm" | "whirl" | "deep" | "rays" | "dawn" | "shade" | "town" | "night" | "dust";

/** เสียงบรรยากาศวนซ้ำใต้เสียงพากย์ (public/audio/sfx/story-amb-<ชื่อ>.mp3) ไม่ใช่ดนตรี (ข้อ 1.3) */
export type Ambience = "sea" | "harbor" | "storm" | "underwater" | "shore" | "night" | "wind" | "rain";

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
  fx?: SceneFx;
  /** บริเวณผิวน้ำในภาพ (% ของภาพหน้าคู่: ซ้าย บน กว้าง สูง) ที่จะมีประกายแสงระยิบ */
  water?: [number, number, number, number];
  ambience?: Ambience;
  /** ฉาก night: ตำแหน่งดวงจันทร์/ตะเกียงในภาพ (% ของภาพหน้าคู่: x y) ไม่ใส่ = ตำแหน่งเดิมของหน้าสุดท้ายนิทานยูนุส, null = ไม่มี */
  moon?: [number, number] | null;
  lamp?: [number, number] | null;
  /**
    เงาปลาใหญ่ใต้น้ำ (% ของภาพหน้าคู่: ซ้าย บน กว้าง) — เงาทึบไม่มีตา ปาก เหงือก ไม่มีส่วนใดเป็นใบหน้า (ข้อ 1.1)
    เจ้าของโปรเจกต์ขอ 7 ต.ค. 2026  flip = หันหัวไปทางขวา, deep = ทะเลลึกมืด (เงาดำมีขอบแสงจางๆ ให้มองเห็นบนพื้นมืด)
  */
  fish?: { at: [number, number, number]; flip?: boolean; deep?: boolean };
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
  /**
    หนังสือแบบอลังการ: ปกแข็งเปิดออก กระดาษโค้งตอนพลิก ฉากเคลื่อนไหว และเสียงบรรยากาศ
    ไม่ใส่ = หนังสือแบบเดิม ภาพที่ไม่มีใช้ CSS แทน
  */
  deluxe?: {
    /** ปกหนังเต็มหน้า (แทน cover เฉพาะในหนังสือ ตู้หนังสือยังใช้ cover เดิม) */
    cover?: string;
    /** ลายกระดาษด้านในปก ต่อกันได้ไม่มีรอยต่อ */
    endpaper?: string;
    /**
      ภาพเล่มหนังสือเปิดหน้าว่างแบบสมจริง (มองตรงจากด้านบน พื้นหลังโปร่งใส) — ขอบกระดาษซ้อน ร่องสัน เนื้อกระดาษ
      ภาพนิทานถูกพิมพ์ลงบนหน้าว่างด้วย multiply  paper = กรอบหน้ากระดาษในภาพ (px: ซ้าย บน ขวา ล่าง) วัดจากภาพจริง
    */
    book?: { src: string; width: number; height: number; paper: [number, number, number, number] };
    /** เนื้อกระดาษต่อกันได้ไม่มีรอยต่อ ใช้บนแผ่นที่กำลังพลิก */
    paper?: string;
  };
};
