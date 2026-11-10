import type { Story } from "../../types";

/*
  พ่อค้าผู้ใจดี (วัย 7 ปีขึ้นไป)
  บุคอรี 2078 จากอบูฮุร็อยเราะฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1681/3307)
  «كان تاجر يداين الناس، فإذا رأى معسرا قال لفتيانه: تجاوزوا عنه، لعل الله أن يتجاوز عنا، فتجاوز الله عنه»
  «تجاوزوا عنه» = ผ่อนปรน/ปล่อยผ่าน จึงเล่าว่า "อย่าทวงเลย ยกให้เขาเถิด"
  ภาพ: ไม่มีคน เล่าด้วยร้านค้า สมุดบัญชี (ไม่มีตัวหนังสือ) ถุงเงิน และบ้านหลังเล็ก
*/
export const KIND_MERCHANT_STORY: Story = {
  evidence: ["bukhari-2078"],
  slug: "kind-merchant",
  title: { th: "พ่อค้าผู้ใจดี", en: "The kind merchant" },
  cover: "/stories/kind-merchant/cover.webp",
  coverAlt: { th: "ร้านค้าโบราณมีกระสอบสินค้าและตาชั่ง แสงอุ่นยามเย็น", en: "An old shop with sacks of goods and a balance scale in warm evening light" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/kind-merchant/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ร้านค้าโบราณในตลาด กระสอบเครื่องเทศ ผ้าพับ ตาชั่งทองเหลือง ไม่มีคน ไม่มีตัวหนังสือ
      image: "/stories/kind-merchant/p01.webp",
      fx: "town",
      ambience: "land",
      alt: { th: "ร้านค้าโบราณในตลาด มีกระสอบเครื่องเทศ ผ้าพับ และตาชั่ง", en: "An old market shop with sacks of spices, folded cloth and a balance scale" },
      th: "ท่านนบี ﷺ เล่าว่า มีพ่อค้าคนหนึ่ง ให้ผู้คนยืมเงินไปใช้ก่อน",
      en: "The Prophet ﷺ told us about a merchant who used to lend money to people.",
    },
    {
      // PROMPT: ถุงเงินผ้าใบเล็กหลายใบวางบนโต๊ะไม้ในร้าน ข้างๆ เป็นแผ่นบัญชีม้วนเก่า (ไม่มีตัวหนังสือ) ไม่มีคน
      image: "/stories/kind-merchant/p02.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ถุงเงินใบเล็กหลายใบบนโต๊ะไม้ ข้างๆ เป็นม้วนบัญชีเก่า", en: "Small money pouches on a wooden table beside an old rolled-up ledger" },
      th: "เมื่อถึงเวลาเก็บหนี้ เขาส่งคนรับใช้หนุ่มๆ ไปเก็บเงิน",
      en: "When it was time to collect the debts, he sent his young helpers to collect the money.",
    },
    {
      // PROMPT: บ้านหลังเล็กเก่าๆ หลังคาซ่อมด้วยใบไม้ หม้อว่างเปล่าวางหน้าบ้าน สื่อว่าเจ้าของบ้านลำบาก นุ่มนวล ไม่มีคน
      image: "/stories/kind-merchant/p03.webp",
      fx: "shade",
      ambience: "wind",
      alt: { th: "บ้านหลังเล็กเก่าๆ มีหม้อว่างเปล่าวางอยู่หน้าบ้าน", en: "A small old house with an empty pot outside the door" },
      th: "ถ้าเขาเห็นว่าใครลำบาก ไม่มีเงินจ่ายหนี้ เขาจะบอกคนรับใช้ว่า อย่าทวงเลย ยกให้เขาเถิด บางทีอัลลอฮ์จะทรงยกโทษให้เราบ้าง",
      en: "If he saw that someone was struggling and could not pay, he would tell his helpers: Don't press him. Let it go. Perhaps Allah will let our faults go too.",
    },
    {
      // PROMPT: บ้านหลังเล็กเดิม หน้าบ้านมีหม้อที่เต็มไปด้วยอาหาร แสงอุ่นยามเย็น ไม่มีคน
      image: "/stories/kind-merchant/p04.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "บ้านหลังเล็กเดิม หน้าบ้านมีหม้ออาหารในแสงอุ่น", en: "The same small house with a pot of food outside in warm light" },
      th: "พ่อค้าคนนี้ยกหนี้ให้คนลำบากอยู่เสมอ",
      en: "This merchant always let struggling people off their debts.",
    },
    {
      // PROMPT: ร้านค้าเดิมยามค่ำ ตะเกียงอุ่น ท้องฟ้ามีดาว สงบ ไม่มีคน
      image: "/stories/kind-merchant/p05.webp",
      fx: "night",
      ambience: "landnight",
      lamp: null,
      alt: { th: "ร้านค้าเดิมยามค่ำ มีตะเกียงอุ่นและท้องฟ้ามีดาว", en: "The same shop at night, with a warm lamp and a starry sky" },
      th: "แล้วอัลลอฮ์ก็ทรงยกโทษให้เขาจริงๆ\n\nข้อคิดของเรา: ถ้าเพื่อนลำบาก เรามาผ่อนปรนและให้อภัยเขา เหมือนที่เราอยากให้อัลลอฮ์ทรงอภัยให้เรากันนะ",
      en: "And Allah truly forgave him.\n\nOur lesson: When a friend is struggling, let's be easy on them and forgive them, just as we hope Allah will forgive us.",
    },
  ],
};
