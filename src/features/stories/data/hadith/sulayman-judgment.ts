import type { Story } from "../../types";

/*
  นบีสุลัยมานตัดสินความ (วัย 7 ปีขึ้นไป)
  บุคอรี 3427 จากอบูฮุร็อยเราะฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1681/5315)
  «كانت امرأتان معهما ابناهما جاء الذئب فذهب بابن إحداهما فقالت صاحبتها: إنما ذهب بابنك وقالت الأخرى: إنما ذهب بابنك فتحاكمتا إلى داود فقضى به للكبرى
  فخرجتا على سليمان بن داود فأخبرتاه فقال: ائتوني بالسكين أشقه بينهما فقالت الصغرى لا تفعل يرحمك الله هو ابنها فقضى به للصغرى»
  หน้า 5: "ท่านพูดเพื่อทดสอบ" และหน้า 6: "แม่ตัวจริงยอมเสียลูกดีกว่าให้ลูกเจ็บ" เป็นคำอธิบายของนักวิชาการ (ไม่ใช่ถ้อยคำในหะดีษ)
    ใส่ไว้ให้เด็กไม่เข้าใจผิดว่าท่านจะทำร้ายเด็กจริง
  ภาพ: ห้ามวาดนบีดาวูด นบีสุลัยมาน ผู้หญิง เด็ก และหมาป่า ไม่มีมีด เล่าด้วยเปลเด็ก ห้องตัดสินความ ตาชั่ง และแสง
*/
export const SULAYMAN_JUDGMENT_STORY: Story = {
  evidence: ["bukhari-3427"],
  slug: "sulayman-judgment",
  title: { th: "นบีสุลัยมานตัดสินความ", en: "Prophet Sulayman's judgment" },
  cover: "/stories/sulayman-judgment/cover.webp",
  coverAlt: { th: "ตาชั่งทองตั้งอยู่ในห้องโถงหินอ่อน ข้างๆ มีเปลเด็กไม้", en: "A golden balance scale in a marble hall, beside a wooden cradle" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/sulayman-judgment/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: เปลเด็กไม้สองใบวางคู่กันใต้ต้นไม้ ผ้าห่มนุ่มในเปล ไม่มีเด็ก ไม่มีคน
      image: "/stories/sulayman-judgment/p01.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "เปลเด็กไม้สองใบวางคู่กันใต้ต้นไม้", en: "Two wooden cradles side by side under a tree" },
      th: "ท่านนบี ﷺ เล่าว่า มีผู้หญิงสองคน แต่ละคนมีลูกชายตัวเล็กๆ อยู่ด้วย",
      en: "The Prophet ﷺ told us about two women, each with her little son.",
    },
    {
      // PROMPT: เปลเด็กใบหนึ่งว่างเปล่า อีกใบมีผ้าห่ม ขอบป่าไกลๆ ในแสงเย็น บรรยากาศเศร้าแต่ไม่น่ากลัว ไม่มีหมาป่า ไม่มีคน
      image: "/stories/sulayman-judgment/p02.webp",
      fx: "shade",
      ambience: "wind",
      alt: { th: "เปลใบหนึ่งว่างเปล่า อีกใบมีผ้าห่ม ไกลๆ เป็นขอบป่า", en: "One cradle empty and the other with a blanket, with the edge of a forest in the distance" },
      th: "วันหนึ่ง หมาป่ามาพาลูกของผู้หญิงคนหนึ่งไป ผู้หญิงสองคนจึงแย่งกันว่า เด็กที่เหลืออยู่เป็นลูกของตัวเอง ต่างคนต่างพูดว่า หมาป่าเอาลูกของเธอไปต่างหาก",
      en: "One day, a wolf took away the son of one of the women. Then the two women argued over the child who was left. Each one said: The wolf took your son, not mine.",
    },
    {
      // PROMPT: ห้องโถงตัดสินความหินอ่อนกว้าง เสาสูง แสงส่องลงมา บัลลังก์ว่างเปล่า ตาชั่งทอง ไม่มีคน
      image: "/stories/sulayman-judgment/p03.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ห้องโถงหินอ่อนกว้าง มีบัลลังก์ว่างเปล่าและตาชั่งทอง", en: "A wide marble hall with an empty throne and a golden balance scale" },
      th: "ทั้งสองไปให้นบีดาวูดตัดสิน ท่านตัดสินให้เด็กเป็นของผู้หญิงคนที่อายุมากกว่า",
      en: "They went to Prophet Dawud to judge between them, and he judged that the child belonged to the older woman.",
    },
    {
      // PROMPT: ทางเดินระหว่างเสาหินออกจากห้องโถง ไปสู่ห้องอีกห้องที่มีแสงทองอุ่นกว่า ไม่มีคน
      image: "/stories/sulayman-judgment/p04.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ทางเดินระหว่างเสาหิน มุ่งไปยังห้องที่มีแสงทองอุ่น", en: "A walkway between stone pillars leading to a room glowing with warm golden light" },
      th: "แล้วทั้งสองก็ออกไปพบนบีสุลัยมาน ลูกชายของนบีดาวูด และเล่าเรื่องให้ท่านฟัง",
      en: "Then the two of them went out to Prophet Sulayman, the son of Prophet Dawud, and told him what had happened.",
    },
    {
      // PROMPT: เปลเด็กไม้ใบเดียวกลางห้องที่มีแสงทอง มีผ้าห่มนุ่ม ไม่มีมีด ไม่มีอาวุธ ไม่มีคน
      image: "/stories/sulayman-judgment/p05.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "เปลเด็กไม้ใบเดียวกลางห้องที่มีแสงทอง", en: "A single wooden cradle in the middle of a golden room" },
      th: "นบีสุลัยมานพูดว่า เอามีดมาให้ฉัน ฉันจะแบ่งเด็กให้คนละครึ่ง ท่านพูดอย่างนี้เพื่อทดสอบว่า ใครคือแม่ที่แท้จริง",
      en: "Prophet Sulayman said: Bring me a knife, and I will divide the child between you. He said this to test which of them was the real mother.",
    },
    {
      // PROMPT: เปลเด็กใบเดิมห่อด้วยแสงอุ่นนุ่มนวล ผ้าห่มลายสวย ปลอดภัยและสงบ ไม่มีคน
      image: "/stories/sulayman-judgment/p06.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "เปลเด็กใบเดิมห่อด้วยแสงอุ่นนุ่มนวล", en: "The same cradle wrapped in soft warm light" },
      th: "ผู้หญิงคนที่อายุน้อยกว่ารีบพูดว่า อย่าทำเลย ขออัลลอฮ์ทรงเมตตาท่าน เด็กเป็นลูกของเธอ",
      en: "The younger woman quickly said: Don't do it, may Allah have mercy on you! He is her son.",
    },
    {
      // PROMPT: ตาชั่งทองสมดุลในห้องโถงที่มีแสงสว่าง เปลเด็กอยู่ข้างๆ บรรยากาศสงบสุข ไม่มีคน
      image: "/stories/sulayman-judgment/p07.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ตาชั่งทองสมดุลในห้องโถงสว่าง มีเปลเด็กอยู่ข้างๆ", en: "A balanced golden scale in a bright hall, with the cradle beside it" },
      th: "นบีสุลัยมานจึงตัดสินให้เด็กเป็นของผู้หญิงคนที่อายุน้อยกว่า เพราะแม่ที่แท้จริงยอมเสียลูกไป ดีกว่าให้ลูกเจ็บ\n\nข้อคิดของเรา: ความรักของแม่ยิ่งใหญ่มาก และอัลลอฮ์ทรงให้ปัญญาแก่นบีสุลัยมาน เมื่อเราต้องตัดสินเรื่องอะไร ให้คิดให้รอบคอบนะ",
      en: "So Prophet Sulayman judged that the child belonged to the younger woman, because a real mother would rather lose her child than let him be hurt.\n\nOur lesson: A mother's love is very great, and Allah gave Prophet Sulayman wisdom. When we have to decide something, let's think carefully.",
    },
  ],
};
