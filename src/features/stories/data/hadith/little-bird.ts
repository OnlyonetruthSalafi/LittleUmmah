import type { Story } from "../../types";

/*
  นกน้อยของอบูอุมัยร์ (วัย 3–6 ปี)
  **ที่มา:** บุคอรี 6129 จากอนัส อิบนุ มาลิก — https://shamela.ws/book/1681/9176
  > «إِنْ كَانَ النَّبِيُّ ﷺ لَيُخَالِطُنَا حَتَّى يَقُولَ لِأَخٍ لِي صَغِيرٍ يَا أَبَا عُمَيْرٍ، مَا فَعَلَ النُّغَيْرُ»
  - ไม่บอกว่านกตาย เพราะท่อนนั้นมาจากสายรายงานอื่นที่ยังไม่ได้ตรวจ จึงเล่าเฉพาะที่บุคอรีบอก
  - ไม่ระบุว่าเป็นนกพันธุ์อะไรหรือสีอะไร ภาพวาดเป็นนกเล็กทั่วไป
  สถานะ: Claude ตรวจตัวบทกับ Shamela 10 พ.ย. 2026; เล่มนี้ยังไม่พร้อมเปิด
  กฎภาพร่วม: 3D การ์ตูนพรีเมียม โทนฟ้า เทอร์ควอยซ์ ขาว ทอง เว้นกลางสันหนังสือ
  ไม่มีคน เงาคน มือ เท้า หรือรอยเท้าคน ห้ามวาดนบี เศาะหาบะฮ์ และมะลักทุกกรณี
  สัตว์ทุกตัวใบหน้าว่าง ไม่มีตา จมูก ปาก คิ้ว ขนตา แก้มแดง หรือส่วนที่ทำหน้าที่เป็นใบหน้า
  ไม่มีตัวหนังสือ โลโก้ หรือสัญลักษณ์ดนตรี; อูฐไม่วาดน้ำตาหรืออวัยวะใบหน้า
  alt และชื่ออังกฤษ Codex ร่างจาก PROMPT แล้ว Claude ตัดข้อกำหนดภาพออกและตรวจรับ 10 พ.ย. 2026 — ปรับให้ตรงภาพจริงเมื่อทำภาพ
*/
export const LITTLE_BIRD_STORY: Story = {
  slug: "little-bird",
  title: { th: "นกน้อยของอบูอุมัยร์", en: "The little bird of Abu Umayr" },
  cover: "/stories/little-bird/cover.webp",
  coverAlt: { th: "ลานบ้านดินเหนียวยามเช้า ประตูไม้เปิด", en: "An empty clay courtyard in morning light with an open wooden door" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/little-bird/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ลานบ้านดินเหนียวยามเช้า ประตูไม้เปิด ไม่มีคน
      image: "/stories/little-bird/p01.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ลานบ้านดินเหนียวยามเช้า ประตูไม้เปิด", en: "An empty clay courtyard in morning light with an open wooden door" },
      th: "ท่านนบี ﷺ ใจดีกับทุกคน ท่านมาพบปะพูดคุยกับครอบครัวของอนัสอยู่บ่อยๆ",
      en: "The Prophet ﷺ was kind to everyone. He often came to visit and talk with Anas's family.",
    },
    {
      // PROMPT: ของเล่นไม้ชิ้นเล็กๆ วางบนเสื่อในลานบ้าน ไม่มีคน
      image: "/stories/little-bird/p02.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "ของเล่นไม้ชิ้นเล็กๆ วางบนเสื่อในลานบ้าน", en: "Small wooden toys on a mat in a courtyard" },
      th: "อนัสมีน้องชายตัวเล็กๆ ท่านนบี ﷺ เรียกน้องคนนี้ว่า \"อบูอุมัยร์\"",
      en: "Anas had a little brother. The Prophet ﷺ called him \"Abu Umayr\".",
    },
    {
      // PROMPT: นกตัวเล็กใบหน้าว่างเกาะกิ่งไม้ข้างถ้วยน้ำดินเผา
      image: "/stories/little-bird/p03.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "นกตัวเล็กเกาะกิ่งไม้ข้างถ้วยน้ำดินเผา", en: "A small bird on a branch beside a clay water bowl" },
      th: "น้องอบูอุมัยร์มีนกตัวเล็กๆ อยู่หนึ่งตัว",
      en: "Little Abu Umayr had a tiny bird.",
    },
    {
      // PROMPT: นกน้อยตัวเดิมกระโดดบนขอบหน้าต่างไม้ แสงอุ่น
      image: "/stories/little-bird/p04.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "นกน้อยตัวเดิมกระโดดบนขอบหน้าต่างไม้ แสงอุ่น", en: "The same little bird on a wooden windowsill in warm light" },
      th: "วันหนึ่ง ท่านนบี ﷺ ถามน้องว่า \"อบูอุมัยร์เอ๋ย นกน้อยของหนูเป็นอย่างไรบ้าง\"",
      en: "One day, the Prophet ﷺ asked him, \"O Abu Umayr, what has your little bird been doing?\"",
    },
    {
      // PROMPT: ลานบ้านยามบ่าย มีถ้วยน้ำ เมล็ดพืช และขนนกเล็กๆ บนพื้น
      image: "/stories/little-bird/p05.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "ลานบ้านยามบ่าย มีถ้วยน้ำ เมล็ดพืช และขนนกเล็กๆ บนพื้น", en: "Water, seeds and a small feather in an afternoon courtyard" },
      th: "ท่านนบี ﷺ ไม่ได้คุยแต่กับผู้ใหญ่ ท่านใส่ใจเด็กเล็กๆ และถามถึงสิ่งที่เด็กรัก",
      en: "The Prophet ﷺ did not only talk with grown-ups. He cared about little children and asked about the things they loved.",
    },
    {
      // PROMPT: นกน้อยสองตัวเกาะกิ่งไม้ใต้ท้องฟ้าสีทอง
      image: "/stories/little-bird/p06.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "นกน้อยสองตัวเกาะกิ่งไม้ใต้ท้องฟ้าสีทอง", en: "Two little birds on a branch beneath a golden sky" },
      th: "ข้อคิดของเรา: เรามาใจดีกับน้องๆ กันนะ ทักทายน้อง เล่นกับน้อง และถามถึงสิ่งที่น้องชอบ",
      en: "Our lesson: Let's be kind to younger children. Greet them, play with them, and ask about the things they like.",
    },
  ],
};
