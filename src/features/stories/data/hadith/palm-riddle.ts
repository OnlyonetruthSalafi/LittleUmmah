import type { Story } from "../../types";

/*
  ต้นไม้ที่ใบไม่ร่วง (วัย 3–6 ปี)
  **ที่มา:**
  - บุคอรี 61 จากอิบนุ อุมัร — https://shamela.ws/book/1681/116
  - บุคอรี 72 ซึ่งมีท่อน «فَأُتِيَ بِجُمَّارٍ» และ «فَإِذَا أَنَا أَصْغَرُ الْقَوْمِ، فَسَكَتُّ» — https://shamela.ws/book/1681/137
  > «إِنَّ مِنَ الشَّجَرِ شَجَرَةً لَا يَسْقُطُ وَرَقُهَا، وَإِنَّهَا مَثَلُ الْمُسْلِمِ، فَحَدِّثُونِي مَا هِيَ؟ فَوَقَعَ النَّاسُ فِي شَجَرِ الْبَوَادِي ... هِيَ النَّخْلَةُ»
  เล่มนี้เป็นเล่มชวนทาย หน้า p04 ให้เด็กได้ทายก่อนเปิดคำตอบ
  - หน้า p06: ข้อคิดเรื่องประโยชน์ของต้นอินทผลัมเป็นข้อคิดของเราเอง ตัวบทในบุคอรี 61 และ 72 ไม่ได้อธิบายว่ามุสลิมเหมือนต้นอินทผลัมตรงไหน จึงติดป้าย "ข้อคิดของเรา" ไว้
  สถานะ: Claude ตรวจตัวบทกับ Shamela 10 พ.ย. 2026; เล่มนี้ยังไม่พร้อมเปิด
  กฎภาพร่วม: 3D การ์ตูนพรีเมียม โทนฟ้า เทอร์ควอยซ์ ขาว ทอง เว้นกลางสันหนังสือ
  ไม่มีคน เงาคน มือ เท้า หรือรอยเท้าคน ห้ามวาดนบี เศาะหาบะฮ์ และมะลักทุกกรณี
  สัตว์ทุกตัวใบหน้าว่าง ไม่มีตา จมูก ปาก คิ้ว ขนตา แก้มแดง หรือส่วนที่ทำหน้าที่เป็นใบหน้า
  ไม่มีตัวหนังสือ โลโก้ หรือสัญลักษณ์ดนตรี; อูฐไม่วาดน้ำตาหรืออวัยวะใบหน้า
  alt และชื่ออังกฤษ Codex ร่างจาก PROMPT แล้ว Claude ตัดข้อกำหนดภาพออกและตรวจรับ 10 พ.ย. 2026 — ปรับให้ตรงภาพจริงเมื่อทำภาพ
*/
export const PALM_RIDDLE_STORY: Story = {
  slug: "palm-riddle",
  title: { th: "ต้นไม้ที่ใบไม่ร่วง", en: "The tree whose leaves do not fall" },
  cover: "/stories/palm-riddle/cover.webp",
  coverAlt: { th: "ยอดอ่อนของต้นอินทผลัม (ญุมมาร) สีขาวนวล วางบนจานไม้", en: "The pale soft heart of a date palm on a wooden plate" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/palm-riddle/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ยอดอ่อนของต้นอินทผลัม (ญุมมาร) สีขาวนวล วางบนจานไม้ ไม่มีคน
      image: "/stories/palm-riddle/p01.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ยอดอ่อนของต้นอินทผลัม (ญุมมาร) สีขาวนวล วางบนจานไม้", en: "The pale soft heart of a date palm on a wooden plate" },
      th: "วันหนึ่ง มีคนนำยอดอ่อนของต้นอินทผลัมมาให้ท่านนบี ﷺ",
      en: "One day, someone brought the Prophet ﷺ the soft heart of a date palm.",
    },
    {
      // PROMPT: ต้นไม้หลายแบบเรียงกันบนเนินทราย มีเครื่องหมายคำถามทำจากใบไม้ (ไม่มีตัวหนังสือ)
      image: "/stories/palm-riddle/p02.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "ต้นไม้หลายแบบบนเนินทราย มีใบไม้กระจายอยู่บนพื้น", en: "Different trees on sandy hills with leaves scattered on the ground" },
      th: "ท่านนบี ﷺ ถามบรรดาเศาะหาบะฮ์ว่า \"มีต้นไม้ต้นหนึ่งที่ใบไม่ร่วง และเหมือนกับมุสลิม บอกฉันหน่อยว่าเป็นต้นอะไร\"",
      en: "The Prophet ﷺ asked his Companions, \"There is a tree whose leaves do not fall, and it is like a Muslim. Tell me, which tree is it?\"",
    },
    {
      // PROMPT: ต้นไม้ทะเลทรายหลายชนิดกระจายอยู่ไกลๆ
      image: "/stories/palm-riddle/p03.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "ต้นไม้ทะเลทรายหลายชนิดกระจายอยู่ไกลๆ", en: "Different desert trees scattered in the distance" },
      th: "ทุกคนเริ่มนึกถึงต้นไม้ต่างๆ ในทะเลทราย",
      en: "Everyone began to think of the different trees in the desert.",
    },
    {
      // PROMPT: ต้นอินทผลัมต้นเดียวตั้งตรงอยู่หลังม่านใบไม้บางๆ ยังไม่เห็นชัด
      image: "/stories/palm-riddle/p04.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "ต้นอินทผลัมต้นเดียวตั้งตรงอยู่หลังม่านใบไม้บางๆ ยังไม่เห็นชัด", en: "A date palm partly hidden behind a curtain of leaves" },
      th: "อับดุลลอฮ์ อิบนุ อุมัร นึกออกว่าคือต้นอะไร แต่เขาเป็นคนที่อายุน้อยที่สุดในที่นั้น จึงเงียบไว้ ... หนูลองทายดูสิ ต้นอะไรเอ่ย",
      en: "Abdullah ibn Umar thought he knew the answer, but he was the youngest one there, so he kept quiet. ... Can you guess which tree it is?",
    },
    {
      // PROMPT: ต้นอินทผลัมสูงสง่า ใบเขียวเต็มต้น ผลเป็นพวงสีทอง
      image: "/stories/palm-riddle/p05.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ต้นอินทผลัมสูงสง่า ใบเขียวเต็มต้น ผลเป็นพวงสีทอง", en: "A tall date palm with green leaves and golden fruit" },
      th: "ท่านนบี ﷺ บอกว่า \"คือต้นอินทผลัม\"",
      en: "The Prophet ﷺ said, \"It is the date palm.\"",
    },
    {
      // PROMPT: ร่มเงาต้นอินทผลัม มีผลอินทผลัมในตะกร้า ใบสานเป็นเสื่อ ไม่มีคน
      image: "/stories/palm-riddle/p06.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "ร่มเงาต้นอินทผลัม มีผลอินทผลัมในตะกร้า ใบสานเป็นเสื่อ", en: "A basket of dates and a woven mat in the shade of a date palm" },
      th: "ข้อคิดของเรา: ต้นอินทผลัมให้ทั้งร่มเงา ผลไม้ และใบที่ใช้สานของได้ เรามาเป็นมุสลิมที่ทำความดีให้คนอื่นอยู่เสมอ เหมือนต้นอินทผลัมกันนะ",
      en: "Our lesson: The date palm gives shade, fruit, and leaves for weaving. Let's be Muslims who always do good for others, just like the date palm.",
    },
  ],
};
