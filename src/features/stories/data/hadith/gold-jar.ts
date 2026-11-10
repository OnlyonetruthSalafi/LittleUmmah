import type { Story } from "../../types";

/*
  ไหทองคำในที่ดิน (วัย 7 ปีขึ้นไป)
  บุคอรี 3472 จากอบูฮุร็อยเราะฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1681/5372) และมุสลิม 1721
  «اشترى رجل من رجل عقارا له فوجد الرجل الذي اشترى العقار في عقاره جرة فيها ذهب فقال له الذي اشترى العقار خذ ذهبك مني إنما اشتريت منك الأرض ولم أبتع منك الذهب
  وقال الذي له الأرض إنما بعتك الأرض وما فيها فتحاكما إلى رجل فقال الذي تحاكما إليه ألكما ولد قال أحدهما لي غلام وقال الآخر لي جارية
  قال أنكحوا الغلام الجارية وأنفقوا على أنفسهما منه وتصدقا»
  ภาพ: ไม่มีคน เล่าด้วยที่ดิน ไหดินเผา ทองคำ และบ้านสองหลัง
*/
export const GOLD_JAR_STORY: Story = {
  evidence: ["bukhari-3472","muslim-1721"],
  slug: "gold-jar",
  title: { th: "ไหทองคำในที่ดิน", en: "The jar of gold in the land" },
  cover: "/stories/gold-jar/cover.webp",
  coverAlt: { th: "ไหดินเผาเต็มไปด้วยเหรียญทองคำ วางอยู่บนดินที่เพิ่งขุด", en: "A clay jar full of gold coins resting on freshly dug earth" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/gold-jar/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ที่ดินผืนหนึ่งมีรั้วไม้เตี้ยๆ ต้นไม้ไม่กี่ต้น บ้านเล็กสองหลังอยู่คนละฝั่ง ไม่มีคน
      image: "/stories/gold-jar/p01.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "ที่ดินผืนหนึ่งมีรั้วไม้เตี้ยๆ และบ้านสองหลังอยู่คนละฝั่ง", en: "A plot of land with a low wooden fence and two houses on either side" },
      th: "ท่านนบี ﷺ เล่าว่า มีชายคนหนึ่งซื้อที่ดินจากชายอีกคนหนึ่ง",
      en: "The Prophet ﷺ told us that a man bought a piece of land from another man.",
    },
    {
      // PROMPT: ดินที่เพิ่งขุดเป็นหลุม ข้างหลุมมีไหดินเผาเต็มไปด้วยเหรียญทองเปล่งประกาย จอบวางอยู่ ไม่มีคน ไม่มีมือ
      image: "/stories/gold-jar/p02.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ไหดินเผาเต็มไปด้วยเหรียญทองข้างหลุมที่เพิ่งขุด", en: "A clay jar full of gold coins beside a freshly dug hole" },
      th: "คนที่ซื้อที่ดินพบไหใบหนึ่งในที่ดินนั้น ข้างในมีทองคำ",
      en: "The man who bought the land found a jar in it, and inside the jar was gold.",
    },
    {
      // PROMPT: ไหทองคำวางอยู่หน้าประตูบ้านหลังหนึ่ง ทางเดินจากที่ดินมาถึงประตู ไม่มีคน
      image: "/stories/gold-jar/p03.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ไหทองคำวางอยู่หน้าประตูบ้านของคนขายที่ดิน", en: "The jar of gold set down at the door of the man who sold the land" },
      th: "เขานำทองไปให้คนขายที่ดิน และบอกว่า เอาทองของท่านไปเถิด ฉันซื้อแค่ที่ดินจากท่าน ไม่ได้ซื้อทองคำ",
      en: "He took the gold to the man who sold the land and said: Take your gold. I only bought the land from you. I did not buy the gold.",
    },
    {
      // PROMPT: ไหทองคำวางอยู่กลางระหว่างบ้านสองหลัง ไม่มีใครรับไป ไม่มีคน
      image: "/stories/gold-jar/p04.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "ไหทองคำวางอยู่ตรงกลางระหว่างบ้านสองหลัง", en: "The jar of gold sitting halfway between the two houses" },
      th: "คนขายตอบว่า ฉันขายที่ดินให้ท่าน รวมทั้งทุกอย่างที่อยู่ในนั้นแล้ว ทองจึงเป็นของท่าน",
      en: "The seller answered: I sold you the land and everything in it, so the gold is yours.",
    },
    {
      // PROMPT: ห้องรับแขกเรียบง่าย มีเบาะรองนั่งว่างสามที่ ไหทองวางอยู่ตรงกลาง แสงจากหน้าต่าง ไม่มีคน
      image: "/stories/gold-jar/p05.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ห้องเรียบง่ายมีเบาะรองนั่งว่างสามที่ ไหทองวางอยู่ตรงกลาง", en: "A simple room with three empty cushions and the jar of gold in the middle" },
      th: "ทั้งสองคนจึงไปให้ชายอีกคนหนึ่งช่วยตัดสิน เขาถามว่า พวกท่านมีลูกไหม คนหนึ่งตอบว่า ฉันมีลูกชาย อีกคนตอบว่า ฉันมีลูกสาว",
      en: "So the two of them went to another man to judge between them. He asked: Do you have children? One said: I have a son. The other said: I have a daughter.",
    },
    {
      // PROMPT: บ้านหลังใหม่อบอุ่นตกแต่งเรียบร้อย ตะกร้าอาหารหลายใบเตรียมแจกวางหน้าบ้าน ไหทองว่างครึ่งหนึ่ง ไม่มีคน
      image: "/stories/gold-jar/p06.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "บ้านหลังใหม่อบอุ่น มีตะกร้าอาหารเตรียมแจกวางอยู่หน้าบ้าน", en: "A warm new home with baskets of food ready to give away outside" },
      th: "เขาตัดสินว่า ให้ลูกชายแต่งงานกับลูกสาว ใช้ทองนั้นเลี้ยงดูทั้งสองคน และแบ่งไปทำทานด้วย\n\nข้อคิดของเรา: ทั้งสองคนซื่อสัตย์มาก ไม่มีใครอยากได้สิ่งที่ไม่ใช่ของตัวเอง เรามาซื่อสัตย์ แม้ไม่มีใครเห็นกันนะ",
      en: "He judged: Let the son marry the daughter, use the gold to provide for them both, and give some in charity.\n\nOur lesson: Both men were very honest. Neither wanted what was not his. Let's be honest too, even when no one is watching.",
    },
  ],
};
