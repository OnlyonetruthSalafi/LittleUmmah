import type { Story } from "../../types";

/*
  แม่นกกับลูกนกสองตัว (วัย 3–6 ปี)
  **ที่มา:** อบูดาวูด 2675 จากอับดุลลอฮ์ อิบนุ มัสอูด อัลบานีย์ตัดสินว่าเศาะฮีห์ — https://shamela.ws/book/1726/3658
  > «فَرَأَيْنَا حُمَرَةً مَعَهَا فَرْخَانِ فَأَخَذْنَا فَرْخَيْهَا، فَجَاءَتِ الْحُمَرَةُ فَجَعَلَتْ تَفْرِشُ، فَجَاءَ النَّبِيُّ ﷺ فَقَالَ: مَنْ فَجَعَ هَذِهِ بِوَلَدِهَا؟ رُدُّوا وَلَدَهَا إِلَيْهَا»
  - ใช้เฉพาะท่อนนก ไม่ใช้ท่อนรังมด
  - "حُمَّرَة" คือนกเล็กชนิดหนึ่ง ในข้อความเรียกแค่ "นกตัวเล็ก" ไม่ระบุชนิดหรือสี
  - "تفرش" คือกางปีกบินวนต่ำๆ
  - หน้า p06: ตัวบทบอกแค่คำสั่งให้คืนลูกนก ไม่ได้เล่าว่าลูกนกกลับรังแล้ว ข้อความจึงไม่เล่าเรื่องนั้น และภาพเป็นรังใต้แสงอุ่น ไม่วาดลูกนกกลับมา
  สถานะ: Claude ตรวจตัวบทกับ Shamela 10 พ.ย. 2026; เล่มนี้ยังไม่พร้อมเปิด
  กฎภาพร่วม: 3D การ์ตูนพรีเมียม โทนฟ้า เทอร์ควอยซ์ ขาว ทอง เว้นกลางสันหนังสือ
  ไม่มีคน เงาคน มือ เท้า หรือรอยเท้าคน ห้ามวาดนบี เศาะหาบะฮ์ และมะลักทุกกรณี
  สัตว์ทุกตัวใบหน้าว่าง ไม่มีตา จมูก ปาก คิ้ว ขนตา แก้มแดง หรือส่วนที่ทำหน้าที่เป็นใบหน้า
  ไม่มีตัวหนังสือ โลโก้ หรือสัญลักษณ์ดนตรี; อูฐไม่วาดน้ำตาหรืออวัยวะใบหน้า
  alt และชื่ออังกฤษ Codex ร่างจาก PROMPT แล้ว Claude ตัดข้อกำหนดภาพออกและตรวจรับ 10 พ.ย. 2026 — ปรับให้ตรงภาพจริงเมื่อทำภาพ
*/
export const MOTHER_BIRD_STORY: Story = {
  evidence: ["abu-dawud-2675"],
  slug: "mother-bird",
  title: { th: "แม่นกกับลูกนกสองตัว", en: "The mother bird and her two chicks" },
  cover: "/stories/mother-bird/cover.webp",
  coverAlt: { th: "ทางเดินทางผ่านทุ่งกว้าง มีต้นไม้เตี้ยๆ", en: "An empty path across an open field with low trees" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/mother-bird/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ทางเดินทางผ่านทุ่งกว้าง มีต้นไม้เตี้ยๆ ไม่มีคน
      image: "/stories/mother-bird/p01.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "ทางเดินทางผ่านทุ่งกว้าง มีต้นไม้เตี้ยๆ", en: "An empty path across an open field with low trees" },
      th: "วันหนึ่ง บรรดาเศาะหาบะฮ์ออกเดินทางไปกับท่านนบี ﷺ",
      en: "One day, the Companions went on a journey with the Prophet ﷺ.",
    },
    {
      // PROMPT: รังนกบนพุ่มไม้ แม่นกใบหน้าว่างกับลูกนกสองตัว
      image: "/stories/mother-bird/p02.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "รังนกบนพุ่มไม้ แม่นกกับลูกนกสองตัว", en: "A mother bird and two chicks in a nest on a bush" },
      th: "ระหว่างทาง พวกเขาเห็นแม่นกตัวเล็กๆ ตัวหนึ่ง กับลูกนกสองตัว",
      en: "On the way, they saw a small mother bird with her two chicks.",
    },
    {
      // PROMPT: รังนกว่างเปล่าบนพุ่มไม้
      image: "/stories/mother-bird/p03.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "รังนกว่างเปล่าบนพุ่มไม้", en: "An empty nest on a bush" },
      th: "พวกเขาจึงหยิบลูกนกทั้งสองตัวไป",
      en: "So they took the two chicks.",
    },
    {
      // PROMPT: แม่นกกางปีกบินวนต่ำๆ เหนือรังว่าง
      image: "/stories/mother-bird/p04.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "แม่นกกางปีกบินวนต่ำๆ เหนือรังว่าง", en: "A mother bird fluttering low over her empty nest" },
      th: "แม่นกบินมา กางปีกบินวนไปมา เพราะตามหาลูกของมัน",
      en: "The mother bird came, spreading her wings and fluttering around, searching for her babies.",
    },
    {
      // PROMPT: แม่นกเกาะขอบรังว่าง แสงยามบ่ายนุ่ม
      image: "/stories/mother-bird/p05.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "แม่นกเกาะขอบรังว่าง แสงยามบ่ายนุ่ม", en: "A mother bird perched on the edge of an empty nest in soft afternoon light" },
      th: "ท่านนบี ﷺ มาเห็นจึงถามว่า \"ใครทำให้แม่นกตัวนี้เสียใจ เพราะเอาลูกของมันไป เอาลูกของมันคืนให้มันเถิด\"",
      en: "When the Prophet ﷺ came, he asked, \"Who has upset this bird by taking her young? Give her young back to her.\"",
    },
    {
      // PROMPT: รังนกบนพุ่มไม้ใต้แสงอุ่นยามเย็น ไม่มีนก
      image: "/stories/mother-bird/p06.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "รังนกบนพุ่มไม้ใต้แสงอุ่นยามเย็น ไม่มีนก", en: "An empty nest on a bush in warm evening light" },
      th: "ข้อคิดของเรา: สัตว์ก็รักลูกของมัน เราจะไม่แยกลูกสัตว์ออกจากแม่ และไม่รื้อรังนกเล่นนะ",
      en: "Our lesson: Animals love their babies too. We will never take baby animals away from their mothers or play with birds' nests.",
    },
  ],
};
