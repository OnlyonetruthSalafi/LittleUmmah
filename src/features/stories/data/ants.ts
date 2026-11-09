import type { Story } from "../types";

/*
  นิทานนบีสุลัยมานกับมด (วัย 3-6 ปี)

  เนื้อหามาจากอัลกุรอานเท่านั้น (ตรวจตัวบทกับ Shamela 7 ต.ค. 2026 — ตัฟซีรอิบนุ กะษีร https://shamela.ws/book/8473/3086)
  - อัลลอฮ์ประทานความรู้แก่ดาวูดและสุลัยมาน ทั้งสองกล่าวสรรเสริญอัลลอฮ์ (อันนัมล์ 15)
  - สุลัยมานได้รับความรู้ภาษาของนก และได้รับจากทุกสิ่ง (อันนัมล์ 16)
  - กองทัพของสุลัยมาน ทั้งญิน มนุษย์ และนก ถูกรวบรวมมา เดินเป็นแถวอย่างเป็นระเบียบ (อันนัมล์ 17)
  - มาถึงหุบเขาแห่งมด มดตัวหนึ่งกล่าว «يا أيها النمل ادخلوا مساكنكم لا يحطمنكم سليمان وجنوده وهم لا يشعرون» (อันนัมล์ 18)
  - ท่านยิ้มหัวเราะเพราะคำพูดของมด แล้ววิงวอน «رب أوزعني أن أشكر نعمتك ...» (อันนัมล์ 19)
  ไม่บอกว่ามดเข้ารังทันหรือไม่ ไม่ตั้งชื่อหุบเขา ไม่บอกจำนวนกองทัพ (ตัวบทไม่ได้ระบุ — AGENTS.md ข้อ 1.6)
  บทเรียนท้ายเรื่อง (ห่วงใยเพื่อน / ขอบคุณอัลลอฮ์) เป็นข้อคิดสำหรับเด็ก ไม่ได้อ้างว่าเป็นตัวบท

  ภาพไม่มีคน ไม่มีศาสดา ไม่มีญิน (ข้อ 1.4) กองทัพใช้ฝุ่นและธงไกลๆ แทนตัวทหาร
  มดเป็นการ์ตูนตัวเล็กใบหน้าว่าง ไม่มีตา ปาก (ข้อ 1.1) ข้อความอยู่ในหน้าเว็บทั้งหมด ไม่ฝังในภาพ (ข้อ 1.5)
*/
export const ANTS_STORY: Story = {
  slug: "ants",
  title: { th: "นบีสุลัยมานกับมด", en: "Prophet Sulayman and the ant" },
  cover: "/stories/ants/cover.webp",
  coverAlt: { th: "หุบเขาสีทองยามเช้า มีจอมปลวกรังมดเล็กๆ เรียงรายอยู่บนพื้น", en: "A golden valley in the morning, with little ant hills dotted across the ground" },
  robot: "/Character/faith.webp",
  deluxe: {
    cover: "/stories/ants/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      image: "/stories/ants/p01.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "พระราชวังหินสีทรายบนเนินเขา ท่ามกลางสวนเขียวขจียามเช้า", en: "A sand-coloured stone palace on a hill, among green gardens in the morning" },
      th: "อัลลอฮ์ทรงให้ความรู้แก่นบีดาวูดและนบีสุลัยมาน (อะลัยฮิมัสสลาม) ท่านทั้งสองกล่าวว่า อัลฮัมดุลิลลาฮ์ การสรรเสริญเป็นของอัลลอฮ์",
      en: "Allah gave knowledge to Prophet Dawud and Prophet Sulayman (peace be upon them). They both said: Alhamdulillah, all praise is for Allah.",
    },
    {
      image: "/stories/ants/p02.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "ท้องฟ้าสีฟ้าสดใส มีขนนกสีทองลอยล่องเหนือยอดไม้", en: "A bright blue sky with golden feathers floating above the treetops" },
      th: "นบีสุลัยมานได้รับความรู้เรื่องภาษาของนก และอัลลอฮ์ทรงให้ท่านได้รับสิ่งต่างๆ มากมาย",
      en: "Prophet Sulayman was taught the language of the birds, and Allah gave him a great many things.",
    },
    {
      image: "/stories/ants/p03.webp",
      fx: "dust",
      ambience: "heat",
      alt: { th: "ฝุ่นทรายฟุ้งขึ้นเป็นแนวยาวบนเส้นทางไกลๆ มีธงหลากสีโบกสะบัดอยู่บนขอบฟ้า", en: "A long line of dust rising on a distant road, with colourful flags waving on the horizon" },
      th: "วันหนึ่ง กองทัพของนบีสุลัยมานมารวมกัน มีทั้งญิน มนุษย์ และนก พวกเขาเดินเป็นแถวอย่างเป็นระเบียบ",
      en: "One day, the army of Sulayman gathered: jinn, people and birds. They marched in neat rows.",
    },
    {
      image: "/stories/ants/p04.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "หุบเขาเล็กๆ มีรังมดเป็นเนินดินเล็กๆ อยู่ทั่วพื้น ทางเดินเล็กๆ ของมดทอดยาวระหว่างก้อนหิน", en: "A small valley with little mounds of ant nests all over the ground and tiny ant trails winding between the rocks" },
      th: "กองทัพเดินทางมาถึงหุบเขาแห่งหนึ่ง ที่มีมดอาศัยอยู่มากมาย",
      en: "The army came to a valley where many ants lived.",
    },
    {
      image: "/stories/ants/p05.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "มดตัวเล็กยืนบนก้อนหินหน้ารังมด ไกลออกไปมีฝุ่นของกองทัพกำลังเข้ามา", en: "A little ant standing on a rock in front of its nest, with the army's dust coming from far away" },
      th: "มดตัวหนึ่งเห็นกองทัพกำลังมา มันร้องเตือนเพื่อนๆ ว่า",
      en: "One ant saw the army coming. She called out to the other ants:",
      meaning: { th: "โอ้พวกมดเอ๋ย! พวกเจ้าจงเข้าไปในรังของพวกเจ้าเถิด", en: "O ants, enter your dwellings" },
    },
    {
      image: "/stories/ants/p06.webp",
      ambience: "land",
      alt: { th: "มดตัวเล็กๆ หลายตัวเดินเป็นแถวเข้าไปในรูของรังมด", en: "Many little ants walking in a line into the hole of their nest" },
      th: "เพื่อนๆ จะได้ไม่ถูกนบีสุลัยมานและกองทัพเหยียบ เพราะพวกเขามองไม่เห็นมดตัวเล็กๆ",
      en: "So that Sulayman and his army would not step on them, because they could not see the tiny ants.",
    },
    {
      image: "/stories/ants/p07.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "แสงแดดอบอุ่นส่องลงมาที่หุบเขาเงียบสงบ รังมดอยู่ท่ามกลางดอกไม้เล็กๆ", en: "Warm sunlight shining down on a quiet valley, with an ant nest among small flowers" },
      th: "นบีสุลัยมานได้ยินคำพูดของมดตัวน้อย ท่านยิ้ม แล้วหัวเราะเพราะคำพูดของมัน",
      en: "Prophet Sulayman heard what the little ant said. He smiled, and laughed at her words.",
    },
    {
      image: "/stories/ants/p08.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ท้องฟ้ายามเย็นสีทอง เหนือหุบเขาและสวนที่สงบ", en: "A golden evening sky over the peaceful valley and gardens" },
      th: "แล้วท่านก็ขอบคุณอัลลอฮ์ ด้วยดุอาอ์นี้",
      en: "Then he thanked Allah with this du'a:",
      meaning: { th: "ข้าแต่พระผู้เป็นเจ้าของข้าพระองค์ ขอพระองค์ทรงโปรดประทานแก่ข้าพระองค์ เพื่อให้ข้าพระองค์ขอบคุณต่อความโปรดปรานของพระองค์ท่าน", en: "My Lord, enable me to be grateful for Your favor" },
    },
    {
      image: "/stories/ants/p09.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "landnight",
      alt: { th: "รังมดใต้ท้องฟ้ายามค่ำ มีดาวระยิบระยับเต็มฟ้า", en: "An ant nest under the night sky, full of twinkling stars" },
      th: "มดตัวน้อยห่วงใยเพื่อนๆ ส่วนนบีสุลัยมานมีทุกอย่าง แต่ก็ยังขอบคุณอัลลอฮ์ เรามาห่วงใยเพื่อน และพูดว่า อัลฮัมดุลิลลาฮ์ กันนะ",
      en: "The little ant cared for her friends. Sulayman had so much, yet he still thanked Allah. Let's care for our friends and say Alhamdulillah!",
    },
  ],
};
