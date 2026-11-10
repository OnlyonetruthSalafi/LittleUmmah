import type { Story } from "../../types";

/*
  ชายผู้ยกกิ่งหนามออกจากทาง (วัย 3-6 ปี)
  บุคอรี 652 จากอบูฮุร็อยเราะฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1681/1077)
  «بينما رجل يمشي بطريق، وجد غصن شوك على الطريق فأخره، فشكر الله له فغفر له»
  หน้า 3 เป็นคำอธิบายของผู้เล่า (หนามอาจทำให้คนเจ็บ) ไม่ได้อ้างว่าเป็นความคิดของชายในเรื่อง
  หน้า 6: มุสลิม 35 «الإيمان بضع وستون شعبة ... وأدناها إماطة الأذى عن الطريق» (https://shamela.ws/book/1727/119)
  ข้อคิดเรื่องความปลอดภัย (บอกผู้ใหญ่ ไม่จับเศษแก้วเอง) เป็นของผู้เขียน
  ภาพ: ไม่มีคน เล่าด้วยทาง กิ่งหนาม และแสง
*/
export const THORN_BRANCH_STORY: Story = {
  evidence: ["bukhari-652","muslim-35"],
  slug: "thorn-branch",
  title: { th: "กิ่งหนามบนทางเดิน", en: "The thorny branch on the path" },
  cover: "/stories/thorn-branch/cover.webp",
  coverAlt: { th: "ทางเดินร่มรื่น มีกิ่งไม้หนามวางอยู่ข้างทาง", en: "A shady path with a thorny branch set aside at the edge" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/thorn-branch/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ทางเดินดินผ่านทุ่งหญ้าและต้นไม้ยามเช้า สงบ ไม่มีคน
      image: "/stories/thorn-branch/p01.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ทางเดินดินผ่านทุ่งหญ้ายามเช้า", en: "A dirt path through a meadow in the morning" },
      th: "วันหนึ่ง มีชายคนหนึ่งกำลังเดินไปตามทาง",
      en: "One day, a man was walking along a path.",
    },
    {
      // PROMPT: มองใกล้กิ่งไม้มีหนามแหลมตกขวางกลางทางเดิน หนามชัดแต่ไม่น่ากลัว ไม่มีคน
      image: "/stories/thorn-branch/p02.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "กิ่งไม้มีหนามแหลมตกขวางกลางทางเดิน", en: "A branch with sharp thorns lying across the middle of the path" },
      th: "เขาเห็นกิ่งไม้มีหนามแหลมๆ ตกขวางอยู่บนทาง",
      en: "He saw a branch with sharp thorns lying on the path.",
    },
    {
      // PROMPT: มองใกล้หนามแหลมบนกิ่งไม้ ทางเดินทอดต่อไปไกล สื่อว่าจะมีคนเดินผ่านมา ไม่มีคน ไม่มีรอยเท้าคน
      image: "/stories/thorn-branch/p03.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "หนามแหลมบนกิ่งไม้ กับทางเดินที่ทอดยาวต่อไป", en: "Sharp thorns on the branch, with the path stretching on ahead" },
      th: "หนามแหลมแบบนี้ อาจตำเท้าคนที่เดินผ่านมา ทำให้เขาเจ็บได้",
      en: "Sharp thorns like these could prick the feet of people walking by and hurt them.",
    },
    {
      // PROMPT: ทางเดินโล่งสะอาด กิ่งหนามถูกวางไว้ข้างทางใต้พุ่มไม้ ไม่มีคน ไม่มีมือ
      image: "/stories/thorn-branch/p04.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ทางเดินโล่งสะอาด กิ่งหนามถูกวางไว้ข้างทาง", en: "The path is clear, with the thorny branch set aside at the edge" },
      th: "ชายคนนั้นจึงยกกิ่งหนามออกไปจากทาง",
      en: "So the man moved the thorny branch off the path.",
    },
    {
      // PROMPT: ทางเดินเดิมในแสงทองอบอุ่น ท้องฟ้ากว้างสงบ ไม่มีคน
      image: "/stories/thorn-branch/p05.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ทางเดินเดิมในแสงสีทองอบอุ่น", en: "The same path in warm golden light" },
      th: "อัลลอฮ์ทรงขอบคุณการกระทำของเขา และทรงอภัยโทษให้เขา",
      en: "Allah appreciated what he did and forgave him.",
    },
    {
      // มุสลิม 35 ท่อน «وأدناها إماطة الأذى عن الطريق»
      // PROMPT: ทางเดินในหมู่บ้านที่สะอาด มีถังขยะไม้ใบเล็กข้างทาง ดอกไม้ริมทาง ไม่มีคน
      image: "/stories/thorn-branch/p06.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "ทางเดินในหมู่บ้านที่สะอาด มีถังขยะใบเล็กข้างทาง", en: "A clean village path with a small bin at the side" },
      th: "ท่านนบี ﷺ บอกว่า การเอาสิ่งที่ทำให้คนเจ็บออกจากทาง เป็นส่วนหนึ่งของการศรัทธา\n\nข้อคิดของเรา: ถ้าเห็นของที่อาจทำให้คนอื่นเจ็บบนทาง เช่น ก้อนหิน หรือเศษแก้ว ให้บอกผู้ใหญ่ช่วยเก็บนะ",
      en: "The Prophet ﷺ said that removing something harmful from the path is part of faith.\n\nOur lesson: If you see something on the path that could hurt someone, like a stone or broken glass, tell a grown-up so they can help clear it.",
    },
  ],
};
