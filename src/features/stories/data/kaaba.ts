import type { Story } from "../types";

/*
  นิทานสร้างบ้านของอัลลอฮ์ (วัย 7 ปีขึ้นไป)

  แกนเรื่องคือหะดีษอิบนุ อับบาส บุคอรี 3364 (ตรวจกับ Shamela 7 ต.ค. 2026 https://shamela.ws/book/1681/5226)
  - นบีอิบรอฮีมพาแม่ของอิสมาอีลกับอิสมาอีลที่ยังกินนม มาไว้ที่บ้าน (ที่ตั้งกะอ์บะฮ์) ไม่มีใครอยู่ ไม่มีน้ำ
    วางถุงอินทผลัมกับถุงน้ำไว้ "อัลลอฮ์สั่งท่านหรือ" "ใช่" "ถ้าอย่างนั้นพระองค์จะไม่ทอดทิ้งเรา"
  - ที่ช่องเขา ท่านหันไปทางบ้าน ยกมือวิงวอน «رب إني أسكنت من ذريتي بواد غير ذي زرع» (ตัวบทอัลกุรอาน อิบรอฮีม 37
    ใช้ «ربنا» ตามมุศฮัฟ — ตรวจที่ https://shamela.ws/book/8473/2312)
  - น้ำหมด ลูกกระสับกระส่าย นางขึ้นเศาะฟา ข้ามหุบเขาไปมัรวะฮ์ 7 รอบ ท่านนบี ﷺ: «فذلك سعي الناس بينهما»
  - ได้ยินเสียง มะลักอยู่ที่ที่ตั้งซัมซัม ขุดจนน้ำพุ่ง นางกั้นแอ่งแล้วตักใส่ถุงน้ำ
  - มะลัก: «لا تخافوا الضيعة فإن ها هنا بيت الله يبني هذا الغلام وأبوه وإن الله لا يضيع أهله»
  - คณะจากญุรฮุมเห็นนกบินวนเหนือน้ำ ขออนุญาตมาอยู่ อิสมาอีลโตขึ้น เรียนภาษาอาหรับจากพวกเขา
  - นบีอิบรอฮีมมาพบอิสมาอีลเหลาลูกธนูใต้ต้นไม้ใกล้ซัมซัม "อัลลอฮ์สั่งพ่อให้สร้างบ้านที่นี่" "ผมจะช่วย"
  - อิสมาอีลขนหิน อิบรอฮีมก่อ เมื่อสูงขึ้นเอาหินมาให้ยืน ทั้งสองกล่าว «ربنا تقبل منا إنك أنت السميع العليم» (อัลบะเกาะเราะฮ์ 127)
  ไม่เล่าตอนภรรยาของอิสมาอีล (มีในหะดีษเดียวกัน แต่ไม่จำเป็นต่อเรื่องและยาวเกินสำหรับเด็ก)
  ไม่ใส่ชื่อ "ฮาญัร" ในข้อความ เพราะหะดีษนี้เรียกว่า "แม่ของอิสมาอีล" ตลอด
  หน้าสุดท้าย: มุสลิมหันไปทางกะอ์บะฮ์เมื่อละหมาด (อัลบะเกาะเราะฮ์ 144) — ความรู้ทั่วไป ไม่ใช่ส่วนของหะดีษ

  ภาพไม่มีคน ไม่มีศาสดา ไม่มีมะลัก ไม่มีนก/อูฐ (ข้อ 1.1, 1.4) ใช้ข้าวของ รอยเท้า น้ำพุ ก้อนหิน แทน
  ข้อความอยู่ในหน้าเว็บทั้งหมด ไม่ฝังในภาพ (ข้อ 1.5)
*/
export const KAABA_STORY: Story = {
  evidence: ["quran-ibrahim-37","quran-al-baqarah-127","quran-al-baqarah-144","bukhari-3364"],
  slug: "kaaba",
  title: { th: "สร้างบ้านของอัลลอฮ์", en: "Building the Kaaba" },
  cover: "/stories/kaaba/cover.webp",
  coverAlt: { th: "ฐานกำแพงหินสี่เหลี่ยมที่กำลังก่อขึ้นกลางหุบเขาทะเลทรายยามเย็น", en: "A square stone wall being built up in a desert valley in the evening" },
  robot: "/Character/faith.webp",
  deluxe: {
    cover: "/stories/kaaba/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      image: "/stories/kaaba/p01.webp",
      fx: "dust",
      ambience: "kaaba-heat",
      alt: { th: "หุบเขาทะเลทรายที่เงียบสงัด มีถุงหนังใส่อินทผลัมกับถุงน้ำวางอยู่ใต้ต้นไม้ต้นเดียว", en: "A silent desert valley, with a leather bag of dates and a water skin under a single tree" },
      th: "นบีอิบรอฮีม (อะลัยฮิสสลาม) พาแม่ของอิสมาอีล และอิสมาอีลที่ยังเป็นทารก มายังหุบเขาแห่งหนึ่งในมักกะฮ์ ที่นั่นไม่มีใครอาศัยอยู่เลย และไม่มีน้ำ ท่านวางถุงอินทผลัมกับถุงน้ำไว้ให้ แล้วเดินจากไป",
      en: "Prophet Ibrahim (peace be upon him) brought the mother of Isma'il and baby Isma'il to a valley in Makkah. No one lived there, and there was no water. He left them a bag of dates and a skin of water, then walked away.",
    },
    {
      image: "/stories/kaaba/p02.webp",
      fx: "dust",
      ambience: "steps",
      alt: { th: "รอยเท้าบนผืนทรายทอดยาวออกไปทางช่องเขา", en: "Footprints in the sand leading away towards a mountain pass" },
      th: "แม่ของอิสมาอีลเดินตามไปถามหลายครั้ง แล้วถามว่า อัลลอฮ์ทรงสั่งท่านใช่ไหม ท่านตอบว่า ใช่ นางจึงพูดว่า ถ้าอย่างนั้น พระองค์จะไม่ทอดทิ้งเรา",
      en: "The mother of Isma'il followed him and asked many times. Then she asked: Did Allah command you to do this? He said: Yes. She said: Then He will not let us be lost.",
    },
    {
      evidence: ["quran-ibrahim-37","bukhari-3364"],
      image: "/stories/kaaba/p03.webp",
      fx: "dawn",
      ambience: "kaaba-heat",
      alt: { th: "ช่องเขาหินสีแดงอมทอง มองลงไปเห็นหุบเขาด้านล่างอยู่ไกลๆ", en: "A red-gold rocky mountain pass, looking down on the valley far below" },
      th: "เมื่อเดินไปถึงช่องเขา ที่พวกเขามองไม่เห็นท่านแล้ว นบีอิบรอฮีมหันหน้าไปทางที่ตั้งของบ้านอัลลอฮ์ ยกมือขึ้นวิงวอนว่า",
      en: "When he reached the mountain pass, where they could no longer see him, Ibrahim turned towards the place of Allah's House, raised his hands and prayed:",
      meaning: { th: "โอ้พระเจ้าของเรา แท้จริงข้าพระองค์ได้ให้ลูกหลานของข้าพระองค์ พำนักอยู่ ณ ที่ราบลุ่มนี้โดยไม่มีพืชผลใดๆ ซึ่งอยู่ใกล้บ้านอันเป็นเขตหวงห้ามของพระองค์", en: "Our Lord, I have settled some of my descendants in an uncultivated valley near Your sacred House" },
    },
    {
      image: "/stories/kaaba/p04.webp",
      fx: "dust",
      ambience: "steps",
      cue: "canteen",
      alt: { th: "เนินเขาหินสองลูกตั้งอยู่คนละฝั่งของหุบเขา มีรอยเท้าวิ่งไปมาระหว่างเนินทั้งสอง", en: "Two rocky hills on opposite sides of the valley, with running footprints going back and forth between them" },
      th: "ไม่นานน้ำก็หมด ลูกน้อยกระหายน้ำจนกระสับกระส่าย แม่ของอิสมาอีลขึ้นไปบนเนินเศาะฟา มองหาคน แต่ไม่เห็นใคร แล้วรีบข้ามหุบเขาไปที่เนินมัรวะฮ์ นางทำอย่างนี้ทั้งหมด 7 รอบ",
      en: "Soon the water ran out, and the baby grew thirsty and restless. The mother of Isma'il climbed the hill of Safa to look for someone, but saw no one. She hurried across the valley to the hill of Marwah. She did this seven times.",
    },
    {
      image: "/stories/kaaba/p05.webp",
      fx: "dawn",
      ambience: "kaaba-heat",
      alt: { th: "ทางเดินระหว่างเนินเศาะฟาและมัรวะฮ์ยามเช้า", en: "The path between the hills of Safa and Marwah in the morning" },
      th: "ท่านนบีมุฮัมมัด ﷺ บอกว่า นี่แหละคือการสะอีย์ ที่มุสลิมเดินระหว่างเศาะฟากับมัรวะฮ์จนถึงทุกวันนี้",
      en: "Prophet Muhammad ﷺ said that this is the sa'y, when Muslims walk between Safa and Marwah to this very day.",
    },
    {
      image: "/stories/kaaba/p06.webp",
      fx: "rays",
      ambience: "spring",
      alt: { th: "น้ำใสพุ่งขึ้นมาจากผืนทรายกลางหุบเขา มีแสงระยิบระยับรอบๆ และแอ่งทรายกั้นน้ำไว้", en: "Clear water bursting up from the sand in the middle of the valley, sparkling all around, held in by a sand basin" },
      th: "บนเนินมัรวะฮ์ นางได้ยินเสียง มีมะลักอยู่ตรงที่ของซัมซัม แล้วน้ำก็พุ่งขึ้นมาจากพื้นดิน นางรีบทำแอ่งกั้นน้ำ แล้วตักใส่ถุงน้ำ",
      en: "On Marwah she heard a voice. An angel was at the place of Zamzam, and water burst out of the ground. She quickly made a pool around it and filled her water skin.",
    },
    {
      image: "/stories/kaaba/p07.webp",
      fx: "rays",
      ambience: "spring",
      alt: { th: "แอ่งน้ำใสกลางหุบเขา สะท้อนแสงอาทิตย์ยามบ่าย", en: "A clear pool in the middle of the valley, reflecting the afternoon sun" },
      th: "นางได้ดื่มน้ำ และให้นมลูก มะลักบอกว่า อย่ากลัวว่าจะถูกทอดทิ้ง ตรงนี้คือบ้านของอัลลอฮ์ เด็กคนนี้กับพ่อของเขาจะเป็นผู้สร้าง และอัลลอฮ์จะไม่ทอดทิ้งคนของพระองค์",
      en: "She drank and fed her baby. The angel said: Do not fear being lost. Here is the House of Allah, which this boy and his father will build, and Allah does not abandon His people.",
    },
    {
      image: "/stories/kaaba/p08.webp",
      fx: "dawn",
      ambience: "spring",
      alt: { th: "เต็นท์ผ้าหลายหลังตั้งเรียงกันใกล้แอ่งน้ำในหุบเขา", en: "Several cloth tents in a row near the pool in the valley" },
      th: "ต่อมามีคณะเดินทางผ่านมา เห็นนกบินวนอยู่จึงรู้ว่ามีน้ำ พวกเขาขออนุญาตแม่ของอิสมาอีลมาอยู่ด้วย นางอนุญาต อิสมาอีลเติบโตขึ้นที่นั่น และเรียนภาษาอาหรับจากพวกเขา",
      en: "Later, travellers passed by. They saw a bird circling and knew there was water. They asked the mother of Isma'il if they could stay, and she agreed. Isma'il grew up there and learned Arabic from them.",
    },
    {
      image: "/stories/kaaba/p09.webp",
      fx: "dawn",
      ambience: "spring",
      alt: { th: "ต้นไม้ใหญ่ใกล้แอ่งน้ำ ใต้ต้นมีคันธนูกับลูกธนูวางพิงอยู่", en: "A big tree near the pool, with a bow and arrows leaning beneath it" },
      th: "หลายปีต่อมา นบีอิบรอฮีมกลับมา พบอิสมาอีลกำลังเหลาลูกธนูอยู่ใต้ต้นไม้ใกล้ซัมซัม เมื่อเห็นพ่อ อิสมาอีลก็ลุกขึ้นไปหา ทั้งสองดีใจและทักทายกันอย่างที่พ่อลูกทำกัน",
      en: "Years later, Ibrahim came back and found Isma'il sharpening arrows under a tree near Zamzam. Isma'il stood up and went to him, and they greeted each other as a father and son do.",
    },
    {
      image: "/stories/kaaba/p10.webp",
      fx: "clouds",
      ambience: "kaaba-heat",
      alt: { th: "เนินดินที่สูงกว่าพื้นรอบๆ กลางหุบเขา มีก้อนหินกองเตรียมไว้", en: "A mound of earth higher than the ground around it in the middle of the valley, with stones piled ready" },
      th: "นบีอิบรอฮีมบอกว่า อัลลอฮ์ทรงสั่งให้พ่อสร้างบ้านหลังหนึ่งที่นี่ ลูกจะช่วยพ่อไหม อิสมาอีลตอบว่า ทำตามที่พระเจ้าของพ่อสั่งเถิด ผมจะช่วยพ่อ",
      en: "Ibrahim said: Allah has commanded me to build a House here. Will you help me? Isma'il said: Do what your Lord has commanded. I will help you.",
    },
    {
      evidence: ["quran-al-baqarah-127","bukhari-3364"],
      image: "/stories/kaaba/p11.webp",
      fx: "dust",
      ambience: "kaaba-heat",
      alt: { th: "กำแพงหินสี่เหลี่ยมที่กำลังก่อขึ้น มีกองหินและหินก้อนหนึ่งวางไว้ให้ยืนข้างกำแพง", en: "A square stone wall being built, with a pile of stones and one stone placed beside the wall to stand on" },
      th: "ทั้งสองช่วยกันสร้างฐานของบ้านอัลลอฮ์ อิสมาอีลขนหินมา นบีอิบรอฮีมก่อ เมื่อกำแพงสูงขึ้น อิสมาอีลเอาหินก้อนหนึ่งมาให้พ่อยืน ระหว่างทำงาน ทั้งสองวิงวอนว่า",
      en: "Together they raised the foundations of Allah's House. Isma'il brought stones and Ibrahim built. When the walls grew high, Isma'il brought a stone for his father to stand on. As they worked, they both prayed:",
      meaning: { th: "ข้าแต่พระผู้เป็นเจ้าของพวกข้าพระองค์ โปรดรับ(งาน)จากพวกข้าพระองค์ด้วยเถิด แท้จริงพระองค์นั้นทรงได้ยินและทรงรอบรู้", en: "Our Lord, accept [this] from us. Indeed, You are the Hearing, the Knowing." },
    },
    {
      image: "/stories/kaaba/p12.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "landnight",
      alt: { th: "กะอ์บะฮ์สีดำใต้ท้องฟ้ายามค่ำคืนที่เต็มไปด้วยดวงดาว", en: "The black Kaaba under a night sky full of stars" },
      th: "ทุกวันนี้ มุสลิมทั่วโลกหันหน้าไปทางกะอ์บะฮ์เมื่อละหมาด เมื่อเราทำความดี ให้เราขอให้อัลลอฮ์ทรงรับไว้ เหมือนที่นบีอิบรอฮีมกับนบีอิสมาอีลวิงวอน",
      en: "Today, Muslims all over the world face the Kaaba when they pray. When we do good, let's ask Allah to accept it, just as Ibrahim and Isma'il prayed.",
    },
  ],
};
