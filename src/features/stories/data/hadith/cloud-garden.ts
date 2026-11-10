import type { Story } from "../../types";

/*
  เมฆรดสวน (วัย 3-6 ปี)
  มุสลิม 2984 จากอบูฮุร็อยเราะฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1727/7405)
  «بينا رجل بفلاة من الأرض، فسمع صوتا في سحابة: اسق حديقة فلان. فتنحى ذلك السحاب. فأفرغ ماءه في حرة. فإذا شرجة من تلك الشراج قد استوعبت ذلك الماء كله.
  فتتبع الماء. فإذا رجل قائم في حديقته يحول الماء بمسحاته ... فأتصدق بثلثه، وآكل أنا وعيالي ثلثا، وأرد فيها ثلثه»
  ตัวบทไม่บอกชื่อ (فلان) จึงเล่าว่า "เสียงนั้นเอ่ยชื่อเจ้าของสวน" ไม่ตั้งชื่อเอง
  ภาพ: ไม่มีคน เล่าด้วยเมฆ พื้นหินสีดำ ลำธาร สวน และจอบ
*/
export const CLOUD_GARDEN_STORY: Story = {
  evidence: ["muslim-2984"],
  slug: "cloud-garden",
  title: { th: "เมฆรดสวน", en: "The cloud that watered a garden" },
  cover: "/stories/cloud-garden/cover.webp",
  coverAlt: { th: "เมฆก้อนใหญ่โปรยฝนลงบนสวนเขียวขจี", en: "A big cloud sprinkling rain over a green garden" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/cloud-garden/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ทุ่งกว้างโล่ง ท้องฟ้ามีเมฆขาวก้อนใหญ่ก้อนเดียว ไม่มีคน
      image: "/stories/cloud-garden/p01.webp",
      fx: "clouds",
      ambience: "wind",
      alt: { th: "ทุ่งกว้างโล่ง มีเมฆก้อนใหญ่ลอยอยู่บนฟ้า", en: "A wide open field with one big cloud in the sky" },
      th: "วันหนึ่ง มีชายคนหนึ่งอยู่กลางทุ่งกว้าง",
      en: "One day, a man was out in a wide open field.",
    },
    {
      // PROMPT: เมฆก้อนใหญ่มีแสงนุ่มรอบขอบ สื่อว่ามีเสียงดังมาจากเมฆ ไม่มีคน ไม่มีหน้าบนเมฆ
      image: "/stories/cloud-garden/p02.webp",
      fx: "clouds",
      ambience: "wind",
      alt: { th: "เมฆก้อนใหญ่มีแสงเรืองนุ่มรอบขอบ", en: "The big cloud with a soft glow around its edges" },
      th: "เขาได้ยินเสียงจากในก้อนเมฆว่า จงไปรดน้ำสวนของชายคนหนึ่ง เสียงนั้นเอ่ยชื่อเจ้าของสวนด้วย",
      en: "He heard a voice from inside the cloud: Go and water the garden of a certain man. The voice even said the garden owner's name.",
    },
    {
      // PROMPT: เมฆลอยไปเทฝนลงบนพื้นที่เต็มไปด้วยหินสีดำ (ฮัรเราะฮ์) ไม่มีคน
      image: "/stories/cloud-garden/p03.webp",
      fx: "clouds",
      ambience: "rain",
      alt: { th: "เมฆเทฝนลงบนพื้นที่เต็มไปด้วยหินสีดำ", en: "The cloud pouring rain onto ground covered with black stones" },
      th: "แล้วเมฆก้อนนั้นก็ลอยไป และเทน้ำฝนลงบนพื้นที่เต็มไปด้วยหินสีดำ",
      en: "Then that cloud drifted away and poured its rain onto ground full of black stones.",
    },
    {
      // PROMPT: น้ำฝนไหลรวมเป็นลำธารเล็กๆ คดเคี้ยวผ่านหินสีดำ ไปทางสวนไกลๆ ไม่มีคน ไม่มีรอยเท้า
      image: "/stories/cloud-garden/p04.webp",
      fx: "rays",
      ambience: "spring",
      alt: { th: "น้ำฝนไหลรวมเป็นลำธารคดเคี้ยวผ่านหินสีดำ", en: "Rainwater gathering into a winding stream between the black stones" },
      th: "น้ำทั้งหมดไหลรวมกันเป็นลำธารสายหนึ่ง ชายคนนั้นจึงเดินตามสายน้ำไป",
      en: "All the water gathered into one stream, so the man followed it.",
    },
    {
      // PROMPT: ลำธารไหลเข้าสวนอินทผลัมเขียวขจี มีร่องน้ำในสวน จอบวางพิงร่องน้ำ ไม่มีคน ไม่มีมือ
      image: "/stories/cloud-garden/p05.webp",
      fx: "rays",
      ambience: "spring",
      alt: { th: "ลำธารไหลเข้าสวนเขียวขจี มีจอบวางพิงร่องน้ำ", en: "The stream flowing into a green garden, with a hoe leaning by the water channel" },
      th: "สายน้ำไหลไปถึงสวนแห่งหนึ่ง มีชายคนหนึ่งยืนอยู่ในสวน กำลังใช้จอบทำทางให้น้ำไหลเข้าสวน",
      en: "The water reached a garden. A man was standing in it, using a hoe to guide the water into his garden.",
    },
    {
      // PROMPT: มุมกว้างของสวนที่ได้น้ำ ใบไม้ชุ่มชื้น หยดน้ำระยิบ ไม่มีคน
      image: "/stories/cloud-garden/p06.webp",
      fx: "clouds",
      ambience: "spring",
      alt: { th: "สวนที่ได้น้ำ ใบไม้ชุ่มชื้นระยิบระยับ", en: "The watered garden, its leaves fresh and sparkling" },
      th: "เขาถามเจ้าของสวนว่า ท่านชื่ออะไร เจ้าของสวนบอกชื่อ เป็นชื่อเดียวกับที่เขาได้ยินจากในเมฆ",
      en: "He asked the garden owner: What is your name? The owner told him, and it was the same name he had heard from the cloud.",
    },
    {
      // PROMPT: เมฆก้อนเดิมลอยอยู่เหนือสวน แสงอุ่น สงบ ไม่มีคน
      image: "/stories/cloud-garden/p07.webp",
      fx: "clouds",
      ambience: "spring",
      alt: { th: "เมฆก้อนเดิมลอยอยู่เหนือสวน", en: "The same cloud floating above the garden" },
      th: "เจ้าของสวนถามว่า ทำไมท่านถามชื่อฉัน เขาจึงเล่าเรื่องเสียงจากในเมฆให้ฟัง แล้วถามว่า ท่านทำอะไรกับสวนนี้หรือ",
      en: "The garden owner asked: Why do you ask my name? So he told him about the voice in the cloud, and asked: What do you do with this garden?",
    },
    {
      // PROMPT: ผลอินทผลัมที่เก็บแล้วแบ่งเป็นสามกอง กองหนึ่งในตะกร้าพร้อมแจก กองหนึ่งบนโต๊ะในบ้าน กองหนึ่งเป็นเมล็ดพันธุ์ข้างแปลงปลูก ไม่มีคน
      image: "/stories/cloud-garden/p08.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ผลผลิตแบ่งเป็นสามกอง ตะกร้าสำหรับแจก อาหารในบ้าน และเมล็ดพันธุ์ข้างแปลงปลูก", en: "The harvest in three piles: a basket to give away, food at home, and seeds beside the planting beds" },
      th: "เจ้าของสวนตอบว่า เมื่อเก็บผลผลิตได้ ฉันแบ่งเป็นสามส่วน ส่วนหนึ่งให้ทาน ส่วนหนึ่งให้ฉันกับครอบครัวกิน และอีกส่วนหนึ่งใช้ปลูกสวนต่อ\n\nข้อคิดของเรา: เมื่อเรามีอะไร มาแบ่งปันให้คนอื่นด้วย เหมือนเจ้าของสวนคนนี้กันนะ",
      en: "The garden owner answered: When I gather the harvest, I divide it into three parts. One part I give in charity, one part my family and I eat, and one part I put back into the garden.\n\nOur lesson: When we have something, let's share it with others, just like this garden owner.",
    },
  ],
};
