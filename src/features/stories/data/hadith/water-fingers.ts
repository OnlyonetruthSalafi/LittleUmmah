import type { Story } from "../../types";

/*
  น้ำไหลจากนิ้วท่านนบี ﷺ (วัย 3-6 ปี)
  บุคอรี 3576 จากญาบิร บิน อับดุลลอฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1681/5499)
  «عطش الناس يوم الحديبية والنبي ﷺ بين يديه ركوة فتوضأ فجهش الناس نحوه فقال ما لكم قالوا ليس عندنا ماء نتوضأ ولا نشرب إلا ما بين يديك
  فوضع يده في الركوة فجعل الماء يثور بين أصابعه كأمثال العيون فشربنا وتوضأنا قلت كم كنتم قال لو كنا مائة ألف لكفانا كنا خمس عشرة مائة»
  ภาพ: ห้ามวาดท่านนบี ﷺ รวมถึงมือของท่าน และห้ามวาดเศาะหาบะฮ์ เล่าด้วยภาชนะน้ำ แสง ถุงน้ำ และค่ายพัก
*/
export const WATER_FINGERS_STORY: Story = {
  evidence: ["bukhari-3576"],
  slug: "water-fingers",
  title: { th: "น้ำที่พอสำหรับทุกคน", en: "Water enough for everyone" },
  cover: "/stories/water-fingers/cover.webp",
  coverAlt: { th: "ภาชนะน้ำหนังใบเล็กมีน้ำใสเปล่งประกายพุ่งขึ้นมา", en: "A small leather water vessel with clear, shining water rising up from it" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/water-fingers/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ค่ายพักกลางที่ราบ เต็นท์ผ้าหลายหลัง ถุงน้ำหนังแห้งแฟบวางกองอยู่ แสงแดดจ้า ไม่มีคน ไม่มีสัตว์
      image: "/stories/water-fingers/p01.webp",
      fx: "dust",
      ambience: "heat",
      alt: { th: "ค่ายพักมีเต็นท์หลายหลัง ถุงน้ำหนังแห้งแฟบวางกองอยู่", en: "A camp of many tents, with empty, flat leather water skins piled up" },
      th: "วันหนึ่ง ที่ฮุดัยบิยะฮ์ ผู้คนกระหายน้ำมาก",
      en: "One day, at Hudaybiyah, the people were very thirsty.",
    },
    {
      // PROMPT: ภาชนะน้ำหนังใบเล็ก (ร็อกวะฮ์) วางบนผ้าปูพื้น มีน้ำอยู่ข้างในเล็กน้อย ไม่มีคน ไม่มีมือ
      image: "/stories/water-fingers/p02.webp",
      fx: "dawn",
      ambience: "heat",
      alt: { th: "ภาชนะน้ำหนังใบเล็กวางบนผ้าปูพื้น มีน้ำอยู่เล็กน้อย", en: "A small leather water vessel on a cloth, with a little water inside" },
      th: "ท่านนบี ﷺ มีภาชนะใส่น้ำใบเล็กๆ อยู่ตรงหน้า ท่านใช้น้ำในนั้นอาบน้ำละหมาด",
      en: "The Prophet ﷺ had a small water vessel in front of him, and he used its water to make wudu.",
    },
    {
      // PROMPT: ถ้วยและถุงน้ำว่างเปล่าหลายใบวางเรียงรอบภาชนะใบเล็ก สื่อว่าทุกคนไม่มีน้ำ ไม่มีคน
      image: "/stories/water-fingers/p03.webp",
      fx: "dust",
      ambience: "heat",
      alt: { th: "ถ้วยและถุงน้ำว่างเปล่าหลายใบวางรอบภาชนะใบเล็ก", en: "Many empty cups and water skins around the small vessel" },
      th: "ผู้คนรีบเข้ามาหาท่าน ท่านถามว่า เกิดอะไรขึ้น พวกเขาตอบว่า พวกเราไม่มีน้ำจะอาบน้ำละหมาดหรือดื่มเลย นอกจากน้ำที่อยู่ตรงหน้าท่าน",
      en: "The people hurried to him. He asked: What is the matter? They said: We have no water to make wudu or to drink, except what is in front of you.",
    },
    {
      // PROMPT: น้ำใสพุ่งขึ้นจากภาชนะใบเล็กเป็นสายหลายสาย เหมือนตาน้ำ แสงระยิบงดงาม ไม่มีมือ ไม่มีคน
      image: "/stories/water-fingers/p04.webp",
      fx: "rays",
      ambience: "spring",
      alt: { th: "น้ำใสพุ่งขึ้นจากภาชนะใบเล็กเป็นหลายสาย เปล่งประกาย", en: "Clear water rising from the small vessel in many sparkling streams" },
      th: "ท่านนบี ﷺ วางมือลงในภาชนะ แล้วน้ำก็พุ่งออกมาจากระหว่างนิ้วของท่าน เหมือนตาน้ำหลายๆ ตา",
      en: "The Prophet ﷺ placed his hand in the vessel, and water began to gush out from between his fingers, like many springs.",
    },
    {
      // PROMPT: ถ้วยและถุงน้ำหนังหลายใบเต็มไปด้วยน้ำ หยดน้ำระยิบ เต็นท์ด้านหลัง ไม่มีคน
      image: "/stories/water-fingers/p05.webp",
      fx: "rays",
      ambience: "spring",
      alt: { th: "ถ้วยและถุงน้ำหลายใบเต็มไปด้วยน้ำ", en: "Many cups and water skins, all full of water" },
      th: "ทุกคนได้ดื่มน้ำ และได้อาบน้ำละหมาด",
      en: "Everyone drank, and everyone made wudu.",
    },
    {
      // PROMPT: ค่ายพักกว้างยามเย็น เต็นท์มากมายสุดสายตา ท้องฟ้าสีทอง ถุงน้ำเต็มแขวนหน้าเต็นท์ ไม่มีคน
      image: "/stories/water-fingers/p06.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ค่ายพักกว้างยามเย็น มีเต็นท์มากมาย ถุงน้ำเต็มแขวนหน้าเต็นท์", en: "A wide camp in the evening, with many tents and full water skins hanging outside" },
      th: "ญาบิรเล่าว่า วันนั้นพวกเรามีหนึ่งพันห้าร้อยคน ถ้ามีถึงหนึ่งแสนคน น้ำนั้นก็ยังพอ\n\nข้อคิดของเรา: นี่คือปาฏิหาริย์ที่อัลลอฮ์ประทานแก่ท่านนบี ﷺ อัลลอฮ์คือผู้ประทานน้ำและทุกสิ่งให้เรา เรามาขอบคุณอัลลอฮ์กันนะ",
      en: "Jabir said: There were one thousand five hundred of us that day. Even if we had been one hundred thousand, it would have been enough.\n\nOur lesson: This was a miracle Allah gave the Prophet ﷺ. Allah gives us water and everything we have. Let's thank Allah.",
    },
  ],
};
