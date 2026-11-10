import type { Story } from "../../types";

/*
  อูฐที่มาฟ้องท่านนบี ﷺ (วัย 3–6 ปี)
  **ที่มา:**
  - อบูดาวูด 2549 จากอับดุลลอฮ์ อิบนุ ญะอ์ฟัร — https://shamela.ws/book/1726/3457
  - ในหมายเหตุของอบูดาวูด อัลบานีย์เขียนว่า «صحيح م بجملة الهدف والحائش فقط» แต่ใน อัสสิลสิละฮ์ อัศเศาะฮีหะฮ์ ข้อ 20 ท่านตัดสินทั้งเรื่องว่า «صحيح على شرط مسلم» และยกท่อนอูฐครบ — https://shamela.ws/book/9442/58
  > «فَإِذَا جَمَلٌ، فَلَمَّا رَأَى النَّبِيَّ ﷺ حَنَّ وَذَرَفَتْ عَيْنَاهُ، فَأَتَاهُ النَّبِيُّ ﷺ فَمَسَحَ ذِفْرَاهُ فَسَكَتَ ... أَفَلَا تَتَّقِي اللَّهَ فِي هَذِهِ الْبَهِيمَةِ الَّتِي مَلَّكَكَ اللَّهُ إِيَّاهَا؟ فَإِنَّهُ شَكَا إِلَيَّ أَنَّكَ تُجِيعُهُ وَتُدْئِبُهُ»
  - หน้า p03 เรื่องน้ำตา: อูฐใบหน้าว่างจึงวาดน้ำตาไม่ได้ ให้ข้อความเล่า ส่วนภาพสื่อด้วยท่าทาง
  - หน้า p04: ห้ามวาดมือท่านนบี ﷺ ภาพเป็นอูฐที่สงบแล้ว
  - หน้า p07: เป็นภาพตามข้อคิด ตัวบทไม่ได้เล่าว่าเจ้าของเปลี่ยนตัวหลังจากนั้น ข้อความจึงไม่อ้าง
  สถานะ: Claude ตรวจตัวบทกับ Shamela 10 พ.ย. 2026; เล่มนี้ยังไม่พร้อมเปิด
  กฎภาพร่วม: 3D การ์ตูนพรีเมียม โทนฟ้า เทอร์ควอยซ์ ขาว ทอง เว้นกลางสันหนังสือ
  ไม่มีคน เงาคน มือ เท้า หรือรอยเท้าคน ห้ามวาดนบี เศาะหาบะฮ์ และมะลักทุกกรณี
  สัตว์ทุกตัวใบหน้าว่าง ไม่มีตา จมูก ปาก คิ้ว ขนตา แก้มแดง หรือส่วนที่ทำหน้าที่เป็นใบหน้า
  ไม่มีตัวหนังสือ โลโก้ หรือสัญลักษณ์ดนตรี; อูฐไม่วาดน้ำตาหรืออวัยวะใบหน้า
  alt และชื่ออังกฤษ Codex ร่างจาก PROMPT แล้ว Claude ตัดข้อกำหนดภาพออกและตรวจรับ 10 พ.ย. 2026 — ปรับให้ตรงภาพจริงเมื่อทำภาพ
*/
export const CAMEL_COMPLAINT_STORY: Story = {
  evidence: ["abu-dawud-2549","al-silsilah-al-sahihah-20"],
  slug: "camel-complaint",
  title: { th: "อูฐที่มาฟ้องท่านนบี ﷺ", en: "The camel that complained to the Prophet ﷺ" },
  cover: "/stories/camel-complaint/cover.webp",
  coverAlt: { th: "สวนอินทผลัมมีกำแพงดินล้อมรอบ ประตูไม้เปิดอยู่", en: "A date garden surrounded by clay walls with an open wooden gate" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/camel-complaint/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: สวนอินทผลัมมีกำแพงดินล้อมรอบ ประตูไม้เปิดอยู่ ไม่มีคน
      image: "/stories/camel-complaint/p01.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "สวนอินทผลัมมีกำแพงดินล้อมรอบ ประตูไม้เปิดอยู่", en: "A date garden surrounded by clay walls with an open wooden gate" },
      th: "วันหนึ่ง ท่านนบี ﷺ เข้าไปในสวนของชาวอันศอรคนหนึ่ง",
      en: "One day, the Prophet ﷺ went into a garden belonging to a man of the Ansar.",
    },
    {
      // PROMPT: อูฐผอมใบหน้าว่างยืนก้มคอใต้ต้นอินทผลัม
      image: "/stories/camel-complaint/p02.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "อูฐผอมยืนก้มคอใต้ต้นอินทผลัม", en: "A thin camel standing beneath a date palm with its neck lowered" },
      th: "ในสวนนั้นมีอูฐอยู่ตัวหนึ่ง",
      en: "In the garden there was a camel.",
    },
    {
      // PROMPT: อูฐตัวเดิมเงยคอยาว ท่าทางเศร้า (แสดงด้วยท่าทาง ไม่ใช่ใบหน้า)
      image: "/stories/camel-complaint/p03.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "อูฐตัวเดิมเงยคอยาว ท่าทางเศร้า", en: "The same camel raising its long neck with a sad posture" },
      th: "พออูฐเห็นท่านนบี ﷺ มันก็ร้องครวญคราง และน้ำตาไหล",
      en: "When the camel saw the Prophet ﷺ, it moaned and its eyes filled with tears.",
    },
    {
      // PROMPT: อูฐนอนพักสงบใต้ร่มไม้ แสงนุ่ม ไม่มีมือ ไม่มีคน
      image: "/stories/camel-complaint/p04.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "อูฐนอนพักสงบใต้ร่มไม้ แสงนุ่ม", en: "A camel resting calmly in the shade of a tree" },
      th: "ท่านนบี ﷺ เข้าไปหามัน ลูบหลังใบหูของมัน จนมันสงบลง",
      en: "The Prophet ﷺ went to it and stroked it behind its ears until it calmed down.",
    },
    {
      // PROMPT: ประตูสวน มีถังน้ำเปล่ากับรางอาหารว่าง
      image: "/stories/camel-complaint/p05.webp",
      fx: "town",
      ambience: "land",
      alt: { th: "ประตูสวน มีถังน้ำเปล่ากับรางอาหารว่าง", en: "A garden gate beside an empty water bucket and feeding trough" },
      th: "ท่านนบี ﷺ ถามว่า \"อูฐตัวนี้เป็นของใคร\" ชายหนุ่มชาวอันศอรคนหนึ่งมาบอกว่า \"ของผมเองครับ ท่านเราะสูลุลลอฮ์\"",
      en: "The Prophet ﷺ asked, \"Who owns this camel?\" A young man of the Ansar came and said, \"It is mine, O Messenger of Allah.\"",
    },
    {
      // PROMPT: รางอาหารว่างกับอานอูฐหนักๆ วางกองอยู่
      image: "/stories/camel-complaint/p06.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "รางอาหารว่างกับอานอูฐหนักๆ วางกองอยู่", en: "An empty feeding trough beside a pile of heavy camel saddles" },
      th: "ท่านนบี ﷺ บอกว่า \"เธอไม่ยำเกรงอัลลอฮ์ในเรื่องสัตว์ตัวนี้ที่อัลลอฮ์ให้เธอเป็นเจ้าของหรือ มันมาฟ้องฉันว่า เธอปล่อยให้มันหิว และใช้งานมันจนเหนื่อยเกินไป\"",
      en: "The Prophet ﷺ said, \"Do you not fear Allah about this animal that Allah has given you? It has complained to me that you leave it hungry and work it too hard.\"",
    },
    {
      // PROMPT: อูฐตัวเดิมกินหญ้าเต็มราง มีถังน้ำเต็ม แสงทอง
      image: "/stories/camel-complaint/p07.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "อูฐตัวเดิมกินหญ้าเต็มราง มีถังน้ำเต็ม แสงทอง", en: "The same camel eating grass from a full trough beside a full water bucket" },
      th: "ข้อคิดของเรา: สัตว์ที่เราเลี้ยงเป็นความไว้วางใจจากอัลลอฮ์ เราต้องให้อาหาร ให้น้ำ และไม่ใช้งานมันจนเหนื่อยเกินไปนะ",
      en: "Our lesson: The animals we keep are a trust from Allah. We must feed them, give them water, and never work them too hard.",
    },
  ],
};
