import type { Story } from "../../types";

/*
  ต้นอินทผลัมร้องไห้ (วัย 3-6 ปี)
  บุคอรี 3584 จากญาบิร บิน อับดุลลอฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1681/5507)
  «كان يقوم يوم الجمعة إلى شجرة أو نخلة فقالت امرأة من الأنصار أو رجل يا رسول الله ألا نجعل لك منبرا قال إن شئتم فجعلوا له منبرا
  فلما كان يوم الجمعة دفع إلى المنبر فصاحت النخلة صياح الصبي ثم نزل النبي ﷺ فضمه إليه تئن أنين الصبي الذي يسكن. قال كانت تبكي على ما كانت تسمع من الذكر عندها»
  ผู้ถามเป็นหญิงอันศอรหรือชาย (ผู้รายงานไม่แน่ใจ) จึงเล่าว่า "มีคนหนึ่ง"
  ภาพ: ห้ามวาดท่านนบี ﷺ และเศาะหาบะฮ์ เล่าด้วยลำต้นอินทผลัม มิมบัรไม้ และแสง
*/
export const CRYING_TRUNK_STORY: Story = {
  slug: "crying-trunk",
  title: { th: "ต้นอินทผลัมร้องไห้", en: "The palm trunk that cried" },
  cover: "/stories/crying-trunk/cover.webp",
  coverAlt: { th: "ลำต้นอินทผลัมยืนอยู่ข้างมิมบัรไม้ ท่ามกลางแสงอุ่น", en: "A palm trunk standing beside a wooden minbar in warm light" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/crying-trunk/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ลานมัสยิดเรียบง่ายสมัยก่อน หลังคาใบอินทผลัม มีลำต้นอินทผลัมตั้งอยู่ด้านหน้า แสงยามสาย ไม่มีคน
      image: "/stories/crying-trunk/p01.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ลานเรียบง่าย หลังคาใบอินทผลัม มีลำต้นอินทผลัมตั้งอยู่ด้านหน้า", en: "A simple courtyard with a palm-leaf roof and a palm trunk standing at the front" },
      th: "ทุกวันศุกร์ ท่านนบี ﷺ จะยืนพูดสอนผู้คน โดยยืนอยู่ข้างลำต้นอินทผลัมต้นหนึ่ง",
      en: "Every Friday, the Prophet ﷺ would stand and teach the people, standing beside a palm trunk.",
    },
    {
      // PROMPT: ลำต้นอินทผลัมเดิมในแสงนุ่ม มีเสื่อปูอยู่ด้านหน้า ไม่มีคน
      image: "/stories/crying-trunk/p02.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ลำต้นอินทผลัมในแสงนุ่ม มีเสื่อปูอยู่ด้านหน้า", en: "The palm trunk in soft light, with mats laid out in front" },
      th: "มีคนหนึ่งถามว่า โอ้ท่านเราะสูลุลลอฮ์ ให้พวกเราทำมิมบัรให้ท่านไหม",
      en: "Someone asked: O Messenger of Allah, shall we make a minbar for you?",
    },
    {
      // PROMPT: มิมบัรไม้ใหม่ มีขั้นบันไดเล็กๆ ไม้สีอุ่น ตั้งอยู่ใกล้ลำต้นอินทผลัม ไม่มีคน ไม่มีเครื่องมือในมือคน
      image: "/stories/crying-trunk/p03.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "มิมบัรไม้ใหม่มีขั้นบันได ตั้งอยู่ใกล้ลำต้นอินทผลัม", en: "A new wooden minbar with steps, standing near the palm trunk" },
      th: "ท่านตอบว่า ถ้าพวกท่านต้องการก็ทำเถิด พวกเขาจึงทำมิมบัร ที่ยืนสูงๆ มีขั้นบันได ให้ท่าน",
      en: "He said: If you wish. So they made him a minbar, a raised place to stand with steps.",
    },
    {
      // PROMPT: ลำต้นอินทผลัมตั้งอยู่ห่างจากมิมบัร มีแสงสั่นไหวรอบลำต้น สื่อว่าส่งเสียงร้อง ไม่มีหน้าบนลำต้น ไม่มีคน
      image: "/stories/crying-trunk/p04.webp",
      fx: "shade",
      ambience: "wind",
      alt: { th: "ลำต้นอินทผลัมมีแสงสั่นไหวรอบๆ อยู่ห่างจากมิมบัร", en: "The palm trunk with light trembling around it, a little away from the minbar" },
      th: "เมื่อถึงวันศุกร์ ท่านนบีขึ้นไปยืนบนมิมบัร ต้นอินทผลัมก็ร้องเสียงดัง เหมือนเด็กเล็กๆ ร้องไห้",
      en: "When Friday came, the Prophet stood on the minbar, and the palm trunk cried out loudly, like a little child crying.",
    },
    {
      // PROMPT: ลำต้นอินทผลัมห่อหุ้มด้วยแสงอุ่นนุ่มนวล สงบลง ไม่มีคน ไม่มีมือ ไม่มีแขน
      image: "/stories/crying-trunk/p05.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ลำต้นอินทผลัมห่อหุ้มด้วยแสงอุ่นนุ่มนวล", en: "The palm trunk wrapped in soft warm light" },
      th: "ท่านนบี ﷺ ลงมาจากมิมบัร แล้วกอดต้นอินทผลัมไว้ มันสะอื้นเบาๆ เหมือนเด็กที่ถูกปลอบ จนเงียบไป",
      en: "The Prophet ﷺ came down from the minbar and hugged the palm trunk. It sobbed softly, like a child being comforted, until it was quiet.",
    },
    {
      // PROMPT: ลำต้นอินทผลัมกับมิมบัรตั้งอยู่ใกล้กันในแสงทอง สงบ ไม่มีคน
      image: "/stories/crying-trunk/p06.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ลำต้นอินทผลัมกับมิมบัรตั้งอยู่ใกล้กันในแสงสีทอง", en: "The palm trunk and the minbar close together in golden light" },
      th: "ต้นอินทผลัมร้องไห้ เพราะคิดถึงการรำลึกถึงอัลลอฮ์ ที่มันเคยได้ยินอยู่ใกล้ๆ\n\nข้อคิดของเรา: แม้แต่ต้นไม้ยังรักการรำลึกถึงอัลลอฮ์ เรามาฟังและรำลึกถึงอัลลอฮ์กันบ่อยๆ นะ",
      en: "The palm trunk cried because it missed the remembrance of Allah that it used to hear nearby.\n\nOur lesson: Even a tree loves the remembrance of Allah. Let's listen and remember Allah often.",
    },
  ],
};
