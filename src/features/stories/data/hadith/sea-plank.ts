import type { Story } from "../../types";

/*
  ขอนไม้กลางทะเล (วัย 7 ปีขึ้นไป)
  **ที่มา:**
  - บุคอรี 2291 จากอบูฮุร็อยเราะฮ์ — https://shamela.ws/book/1681/3637
    - บุคอรีบันทึกแบบมุอัลลัก «وَقَالَ اللَّيْثُ» (ไม่มีสายรายงานต่อเนื่อง แต่ใช้ถ้อยคำยืนยัน)
    - รายงานแบบสั้นอยู่ใน 1498 ด้วย
  - สายรายงานต่อเนื่อง: มุสนัดอะห์มัด 8587 อัลอัรนาอูฏตัดสินว่า «حديث صحيح، وهذا إسناد حسن» — https://shamela.ws/book/25794/6881
  - ตัวบทบอกจำนวนไว้เอง ("หนึ่งพันดีนาร์") จึงใช้ได้ ส่วน "บนีอิสรออีล" ก็มาจากตัวบท
  - หน้า p10: ตัวบทเริ่มด้วย «قَالَ: أُخْبِرُكَ أَنِّي لَمْ أَجِدْ مَرْكَبًا» แล้วจึงถึงคำตอบของเจ้าของเงิน ผมย่อท่อนนี้ให้สั้นลง แต่ไม่เปลี่ยนความหมาย
  สถานะ: Claude ตรวจตัวบทกับ Shamela 10 พ.ย. 2026; เล่มนี้ยังไม่พร้อมเปิด
  กฎภาพร่วม: 3D การ์ตูนพรีเมียม โทนฟ้า เทอร์ควอยซ์ ขาว ทอง เว้นกลางสันหนังสือ
  ไม่มีคน เงาคน มือ เท้า หรือรอยเท้าคน ห้ามวาดนบี เศาะหาบะฮ์ และมะลักทุกกรณี
  สัตว์ทุกตัวใบหน้าว่าง ไม่มีตา จมูก ปาก คิ้ว ขนตา แก้มแดง หรือส่วนที่ทำหน้าที่เป็นใบหน้า
  ไม่มีตัวหนังสือ โลโก้ หรือสัญลักษณ์ดนตรี; อูฐไม่วาดน้ำตาหรืออวัยวะใบหน้า
  alt และชื่ออังกฤษ Codex ร่างจาก PROMPT แล้ว Claude ตัดข้อกำหนดภาพออกและตรวจรับ 10 พ.ย. 2026 — ปรับให้ตรงภาพจริงเมื่อทำภาพ
*/
export const SEA_PLANK_STORY: Story = {
  evidence: ["bukhari-2291","ahmad-8587","bukhari-1498"],
  slug: "sea-plank",
  title: { th: "ขอนไม้กลางทะเล", en: "A piece of wood at sea" },
  cover: "/stories/sea-plank/cover.webp",
  coverAlt: { th: "ถุงผ้าใส่เหรียญทองวางบนโต๊ะไม้", en: "A cloth bag of gold coins on a wooden table" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/sea-plank/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ถุงผ้าใส่เหรียญทองวางบนโต๊ะไม้ ไม่มีคน
      image: "/stories/sea-plank/p01.webp",
      fx: "town",
      ambience: "land",
      alt: { th: "ถุงผ้าใส่เหรียญทองวางบนโต๊ะไม้", en: "A cloth bag of gold coins on a wooden table" },
      th: "ท่านนบี ﷺ เล่าว่า ชายคนหนึ่งจากบนีอิสรออีล ขอยืมเงินหนึ่งพันดีนาร์จากชายอีกคนหนึ่ง",
      en: "The Prophet ﷺ told of a man from the Children of Israel who asked another man to lend him one thousand dinars.",
    },
    {
      // PROMPT: ตาชั่งกับม้วนกระดาษสัญญา ไม่มีตัวหนังสือ
      image: "/stories/sea-plank/p02.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ตาชั่งกับม้วนกระดาษสัญญา", en: "Scales and a rolled contract" },
      th: "คนให้ยืมบอกว่า \"ไปหาพยานมาสิ\" ชายคนนั้นตอบว่า \"อัลลอฮ์ทรงเป็นพยานก็พอแล้ว\" คนให้ยืมบอกว่า \"งั้นหาคนค้ำประกันมา\" เขาตอบว่า \"อัลลอฮ์ทรงเป็นผู้ค้ำประกันก็พอแล้ว\"",
      en: "The lender said, \"Bring me witnesses.\" The man answered, \"Allah is enough as a witness.\" The lender said, \"Then bring someone to guarantee it.\" He answered, \"Allah is enough as a guarantor.\"",
    },
    {
      // PROMPT: ท่าเรือไม้ยามเช้า เรือใบลำหนึ่งกำลังออกทะเล
      image: "/stories/sea-plank/p03.webp",
      fx: "harbor",
      ambience: "harbor",
      alt: { th: "ท่าเรือไม้ยามเช้า เรือใบลำหนึ่งกำลังออกทะเล", en: "A sailing boat leaving a wooden harbour in morning light" },
      th: "คนให้ยืมบอกว่า \"ท่านพูดจริง\" แล้วให้เขายืมเงิน โดยนัดวันคืนเงินไว้ ชายคนนั้นจึงเดินทางข้ามทะเลไปทำธุระ",
      en: "The lender said, \"You have spoken the truth,\" and lent him the money, with a day set to pay it back. Then the man sailed across the sea to do his work.",
    },
    {
      // PROMPT: ชายหาดว่างเปล่า ไม่มีเรือสักลำ ทะเลกว้าง
      image: "/stories/sea-plank/p04.webp",
      fx: "clouds",
      ambience: "shore",
      alt: { th: "ชายหาดว่างเปล่า ไม่มีเรือสักลำ ทะเลกว้าง", en: "An empty beach beside a wide sea with no boats" },
      th: "เมื่อใกล้ถึงวันนัด เขาหาเรือเพื่อกลับไปคืนเงิน แต่หาไม่ได้เลย",
      en: "When the day came near, he looked for a ship to go back and repay the money, but he could not find one.",
    },
    {
      // PROMPT: ขอนไม้ถูกเจาะเป็นโพรง มีเหรียญทองกับม้วนจดหมายอยู่ข้างใน ไม่มีมือ
      image: "/stories/sea-plank/p05.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "ขอนไม้ถูกเจาะเป็นโพรง มีเหรียญทองกับม้วนจดหมายอยู่ข้างใน", en: "A hollow piece of wood containing gold coins and a rolled letter" },
      th: "เขาจึงเอาขอนไม้มาเจาะเป็นโพรง ใส่เงินหนึ่งพันดีนาร์กับจดหมายถึงเจ้าของเงินไว้ข้างใน แล้วปิดรูให้แน่น",
      en: "So he took a piece of wood and hollowed it out. He put the thousand dinars inside, with a letter to the owner, and sealed the hole tightly.",
    },
    {
      // PROMPT: ขอนไม้ลอยออกไปบนคลื่นยามเย็น
      image: "/stories/sea-plank/p06.webp",
      fx: "harbor",
      ambience: "shore",
      alt: { th: "ขอนไม้ลอยออกไปบนคลื่นยามเย็น", en: "A piece of wood floating on evening waves" },
      th: "เขาพาขอนไม้ไปที่ทะเล แล้วขอดุอาอ์ว่า \"โอ้อัลลอฮ์ พระองค์ทรงรู้ว่าเขาพอใจให้พระองค์เป็นพยานและผู้ค้ำประกัน ฉันพยายามหาเรือแล้วแต่หาไม่ได้ ฉันขอฝากเงินนี้ไว้กับพระองค์\" แล้วเขาก็โยนขอนไม้ลงทะเล",
      en: "He took the wood to the sea and prayed, \"O Allah, You know he accepted You as witness and guarantor. I tried hard to find a ship but could not. I leave this money in Your trust.\" Then he threw the wood into the sea.",
    },
    {
      // PROMPT: ขอนไม้ลอยมาเกยชายหาดอีกฝั่ง ยามเช้า
      image: "/stories/sea-plank/p07.webp",
      fx: "dawn",
      ambience: "shore",
      alt: { th: "ขอนไม้ลอยมาเกยชายหาดอีกฝั่ง ยามเช้า", en: "A piece of wood washed onto the opposite shore in morning light" },
      th: "อีกฝั่งหนึ่ง เจ้าของเงินออกมาที่ชายหาด รอดูว่าจะมีเรือนำเงินมาคืนหรือไม่ เขาไม่เห็นเรือ แต่เห็นขอนไม้ลอยมา จึงเก็บไปเป็นฟืนให้ครอบครัว",
      en: "On the other side, the lender went out to the shore to see whether a ship had come with his money. He saw no ship, but he found a piece of wood and took it home as firewood for his family.",
    },
    {
      // PROMPT: ขอนไม้ผ่าออก เหรียญทองกับจดหมายอยู่ข้างใน วางข้างกองฟืน
      image: "/stories/sea-plank/p08.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ขอนไม้ผ่าออก เหรียญทองกับจดหมายอยู่ข้างใน วางข้างกองฟืน", en: "A split piece of wood with coins and a letter beside a pile of firewood" },
      th: "เมื่อเขาผ่าขอนไม้ ก็พบเงินและจดหมายอยู่ข้างใน",
      en: "When he split the wood, he found the money and the letter inside.",
    },
    {
      // PROMPT: เรือใบเข้าเทียบท่า ถุงเงินถุงใหม่วางบนโต๊ะไม้
      image: "/stories/sea-plank/p09.webp",
      fx: "harbor",
      ambience: "harbor",
      alt: { th: "เรือใบเข้าเทียบท่า ถุงเงินถุงใหม่วางบนโต๊ะไม้", en: "A sailing boat arriving at a harbour and a new bag of money on a wooden table" },
      th: "ต่อมา ชายที่ยืมเงินก็หาเรือได้ เขารีบนำเงินอีกหนึ่งพันดีนาร์มาคืน และบอกว่า \"ฉันพยายามหาเรือมาตลอด เพิ่งได้ลำนี้เอง\"",
      en: "Later, the borrower found a ship. He hurried to bring another thousand dinars and said, \"I kept trying to find a ship. This is the first one I found.\"",
    },
    {
      // PROMPT: ถุงเงินถุงเดียววางบนโต๊ะ ประตูเปิดออกสู่ทะเลสีทอง
      image: "/stories/sea-plank/p10.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ถุงเงินถุงเดียววางบนโต๊ะ ประตูเปิดออกสู่ทะเลสีทอง", en: "A single bag of money on a table with an open door overlooking a golden sea" },
      th: "เจ้าของเงินถามว่า \"ท่านส่งอะไรมาให้ฉันหรือเปล่า\" แล้วบอกว่า \"อัลลอฮ์ทรงส่งเงินที่ท่านใส่ในขอนไม้มาถึงฉันแล้ว เอาเงินหนึ่งพันดีนาร์ของท่านกลับไปเถิด\"",
      en: "The lender asked, \"Did you send me something?\" Then he said, \"Allah has delivered the money you sent in the wood. Take your thousand dinars back with you.\"",
    },
    {
      // PROMPT: ทะเลสงบยามเย็นกับท่าเรือ
      image: "/stories/sea-plank/p11.webp",
      fx: "dawn",
      ambience: "shore",
      alt: { th: "ทะเลสงบยามเย็นกับท่าเรือ", en: "A quiet evening sea and a harbour" },
      th: "ข้อคิดของเรา: เมื่อสัญญาแล้วต้องรักษาสัญญา และพยายามเต็มที่ คนที่ไว้วางใจอัลลอฮ์ อัลลอฮ์จะทรงช่วยเขา",
      en: "Our lesson: When we make a promise, we must keep it and try our very best. Allah helps those who put their trust in Him.",
    },
  ],
};
