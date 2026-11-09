import type { Story } from "../../types";

/*
  ชายผู้ให้น้ำสุนัข (วัย 3-6 ปี)
  บุคอรี 2363 จากอบูฮุร็อยเราะฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1681/3751)
  «بينا رجل يمشي فاشتد عليه العطش، فنزل بئرا فشرب منها، ثم خرج فإذا هو بكلب يلهث يأكل الثرى من العطش، فقال: لقد بلغ هذا مثل الذي بلغ بي،
  فملأ خفه ثم أمسكه بفيه، ثم رقي فسقى الكلب، فشكر الله له فغفر له، قالوا: يا رسول الله وإن لنا في البهائم أجرا؟ قال: في كل كبد رطبة أجر»
  ไม่เติมชื่อคน สถานที่ หรืออากาศร้อน (ตัวบทไม่ได้บอก) — ฉากทะเลทรายเป็นองค์ประกอบศิลป์ ไม่อ้างในข้อความ
  ภาพ: ไม่มีคน เล่าด้วยบ่อน้ำ เชือก รองเท้าหนัง (ขุฟ) สุนัขการ์ตูนใบหน้าว่าง
*/
export const WATER_DOG_STORY: Story = {
  slug: "water-dog",
  title: { th: "ชายผู้ให้น้ำสุนัข", en: "The man who gave water to a dog" },
  cover: "/stories/water-dog/cover.webp",
  coverAlt: { th: "บ่อน้ำหินกลางทุ่ง มีรองเท้าหนังใส่น้ำวางอยู่ข้างบ่อ", en: "A stone well in an open field, with a leather boot full of water beside it" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/water-dog/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ทางดินทอดยาวผ่านทุ่งโล่งกว้าง ไม่มีคน ไกลๆ มีบ่อน้ำหิน แสงยามบ่าย
      image: "/stories/water-dog/p01.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "ทางดินทอดยาวผ่านทุ่งกว้าง ไกลๆ มีบ่อน้ำหิน", en: "A dirt road stretching across a wide field, with a stone well far away" },
      th: "วันหนึ่ง มีชายคนหนึ่งกำลังเดินทาง เขาเดินไปเรื่อยๆ จนกระหายน้ำมาก",
      en: "One day, a man was walking on a journey. He walked and walked until he became very thirsty.",
    },
    {
      // PROMPT: มองลงไปในบ่อน้ำหินลึก น้ำใสสะท้อนแสงที่ก้นบ่อ มีขั้นหินเล็กๆ ตามผนังบ่อ ไม่มีคน
      image: "/stories/water-dog/p02.webp",
      fx: "rays",
      ambience: "spring",
      alt: { th: "มองลงไปในบ่อน้ำหินลึก เห็นน้ำใสระยิบที่ก้นบ่อ", en: "Looking down into a deep stone well, with clear sparkling water at the bottom" },
      th: "เขาเจอบ่อน้ำ จึงลงไปในบ่อ แล้วดื่มน้ำจนหายกระหาย",
      en: "He found a well, so he climbed down into it and drank until he was no longer thirsty.",
    },
    {
      // PROMPT: ข้างปากบ่อ สุนัขการ์ตูนตัวผอม ใบหน้าว่างเรียบ (ไม่มีตา จมูก ปาก) นอนหอบบนดินชื้น ดูน่าสงสาร ไม่น่ากลัว ไม่มีคน
      image: "/stories/water-dog/p03.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "สุนัขตัวผอมใบหน้าว่างนอนอ่อนแรงอยู่บนดินชื้นข้างปากบ่อ", en: "A thin, faceless dog lying weakly on damp earth beside the well" },
      th: "เมื่อขึ้นมาจากบ่อ เขาเห็นสุนัขตัวหนึ่งหอบแลบลิ้น และเลียดินชื้นๆ เพราะกระหายน้ำมาก",
      en: "When he came out of the well, he saw a dog panting, licking the damp earth because it was so thirsty.",
    },
    {
      // PROMPT: ปากบ่อน้ำหินกับสุนัขตัวเดิมด้านข้าง (ใบหน้าว่าง) แสงอุ่นนุ่ม บรรยากาศเห็นใจ ไม่มีคน
      image: "/stories/water-dog/p04.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "สุนัขตัวเดิมอยู่ข้างปากบ่อในแสงอุ่น", en: "The same dog beside the well in warm light" },
      th: "ชายคนนั้นคิดว่า สุนัขตัวนี้คงกระหายน้ำ เหมือนที่ฉันกระหายเมื่อกี้นี้เลย",
      en: "The man thought: this dog must be as thirsty as I was a moment ago.",
    },
    {
      // PROMPT: รองเท้าหนังทรงบูทสั้น (ขุฟ) ใส่น้ำจนเต็มเปี่ยม วางบนขอบบ่อหิน หยดน้ำระยิบ เชือกบ่อพาดอยู่ ไม่มีคน ไม่มีมือ
      image: "/stories/water-dog/p05.webp",
      fx: "rays",
      ambience: "spring",
      alt: { th: "รองเท้าหนังใส่น้ำจนเต็ม วางบนขอบบ่อหิน", en: "A leather boot filled to the brim with water, resting on the stone rim of the well" },
      th: "เขาลงไปในบ่ออีกครั้ง ตักน้ำใส่รองเท้าหนังของเขาจนเต็ม คาบรองเท้าไว้ด้วยปาก แล้วปีนกลับขึ้นมา",
      en: "He climbed down into the well again, filled his leather boot with water, held it in his mouth, and climbed back up.",
    },
    {
      // PROMPT: สุนัขตัวเดิม (ใบหน้าว่าง) ก้มดื่มน้ำจากรองเท้าหนังที่วางบนพื้น ดูสดชื่นขึ้น แสงสว่างอบอุ่น ไม่มีคน
      image: "/stories/water-dog/p06.webp",
      fx: "dawn",
      ambience: "spring",
      alt: { th: "สุนัขก้มดื่มน้ำจากรองเท้าหนังที่วางบนพื้น", en: "The dog drinking water from the leather boot on the ground" },
      th: "แล้วเขาก็ให้สุนัขดื่มน้ำ จนมันหายกระหาย",
      en: "Then he gave the dog water to drink until it was no longer thirsty.",
    },
    {
      // PROMPT: ทุ่งกว้างกับบ่อน้ำยามเย็น ท้องฟ้าสีทองนุ่ม แสงส่องลงมาอย่างสงบ ไม่มีคน ไม่มีสัตว์
      image: "/stories/water-dog/p07.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "บ่อน้ำกลางทุ่งใต้ท้องฟ้าสีทองยามเย็น", en: "The well in the field under a golden evening sky" },
      th: "อัลลอฮ์ทรงขอบคุณการกระทำของเขา และทรงอภัยโทษให้เขา",
      en: "Allah appreciated what he did and forgave him.",
    },
    {
      // หะดีษท่อนท้าย: เศาะหาบะฮ์ถาม «وإن لنا في البهائم أجرا؟» ตอบ «في كل كبد رطبة أجر»
      // PROMPT: ถ้วยน้ำดินเผาหลายใบกับรางน้ำเล็กๆ วางเรียงในลานบ้าน นกเล็กใบหน้าว่างเกาะขอบรางน้ำ ไม่มีคน
      image: "/stories/water-dog/p08.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "ถ้วยน้ำดินเผาและรางน้ำในลานบ้าน มีนกเล็กๆ เกาะดื่มน้ำ", en: "Clay water bowls and a small trough in a courtyard, with little birds drinking" },
      th: "บรรดาเศาะหาบะฮ์ถามท่านนบี ﷺ ว่า เราจะได้ผลบุญจากการดูแลสัตว์ด้วยหรือ ท่านตอบว่า การทำดีต่อสิ่งมีชีวิตทุกชนิด ได้ผลบุญทั้งนั้น\n\nข้อคิดของเรา: เรามาใจดีกับสัตว์กันนะ ให้น้ำ ให้อาหาร และไม่ทำร้ายมัน",
      en: "The Companions asked the Prophet ﷺ: Do we get a reward for caring for animals too? He answered: There is a reward for kindness to every living thing.\n\nOur lesson: Let's be kind to animals. Give them water and food, and never hurt them.",
    },
  ],
};
