import type { Story } from "../types";

/*
  นิทานนบีอิบรอฮีมกับกองไฟ (วัย 3-6 ปี)

  ตรวจตัวบทกับ Shamela 7 ต.ค. 2026 (ตัฟซีรอิบนุ กะษีร https://shamela.ws/book/8473/2757 ถึง /2760, /3522)
  - "รูปปั้นพวกนี้คืออะไร ที่พวกท่านนั่งกราบไหว้" / "เราเห็นบรรพบุรุษของเรากราบไหว้มัน" (อัลอัมบิยาอ์ 52-53)
  - "พระเจ้าของพวกท่านคือพระเจ้าแห่งฟ้าและแผ่นดิน ผู้ทรงสร้างมัน" (อัลอัมบิยาอ์ 56)
  - เมื่อพวกเขาออกไป ท่านทุบรูปปั้นเป็นชิ้นๆ เหลือตัวใหญ่ที่สุดไว้ (อัลอัมบิยาอ์ 57-58)
  - "ใครทำแบบนี้" ... "ลองถามพวกมันดูสิ ถ้าพวกมันพูดได้" ... "ท่านก็รู้ว่าพวกมันพูดไม่ได้" (อัลอัมบิยาอ์ 59-65)
    ตัดท่อน «بل فعله كبيرهم هذا» ออก — สำหรับเด็กเล็กจะสับสนเรื่องการพูดเท็จ (บุคอรี/มุสลิมอธิบายว่าเป็นการพูดอ้อม)
  - "พวกท่านกราบไหว้สิ่งที่ไม่ให้ประโยชน์และไม่ให้โทษหรือ" (อัลอัมบิยาอ์ 66)
  - "จงเผาเขา" (อัลอัมบิยาอ์ 68) / "จงสร้างกองไฟให้เขาแล้วโยนเขาลงไป" (อัศศ็อฟฟาต 97)
  - «حسبنا الله ونعم الوكيل» ท่านกล่าวตอนถูกโยนลงกองไฟ — บุคอรี 4563 จากอิบนุ อับบาส (https://shamela.ws/book/1681/6669)
  - «يا نار كوني بردا وسلاما على إبراهيم» (อัลอัมบิยาอ์ 69) / พวกเขาวางแผนร้าย แต่เราทำให้พวกเขาเป็นผู้ขาดทุน (70)
  ไม่ใส่ อายุของท่าน เครื่องยิง ชื่อคน การเก็บฟืนนานเท่าไร หรือญิบรีลมาถาม (ตัฟซีรเล่าจากอิสรออีลียาต/สายรายงานอ่อน — ข้อ 1.6)

  ภาพไม่มีคน ไม่มีศาสดา ไม่มีรูปปั้นที่เป็นรูปสิ่งมีชีวิต — รูปปั้นที่ถูกทุบเป็นเศษหินไม่มีรูปทรง
  ตัวใหญ่ที่สุดคลุมผ้าไว้ทั้งตัว ไฟเป็นกองไฟว่างๆ ไม่มีใครอยู่ในนั้น (ข้อ 1.1, 1.4)
*/
export const IBRAHIM_FIRE_STORY: Story = {
  evidence: ["quran-al-anbiya-52-53","quran-al-anbiya-56","quran-al-anbiya-57-58","quran-al-anbiya-59-65","quran-al-anbiya-66","quran-al-anbiya-68","quran-al-anbiya-69","quran-as-saffat-97","quran-al-anbiya-70","bukhari-4563"],
  slug: "ibrahim-fire",
  title: { th: "นบีอิบรอฮีมกับกองไฟ", en: "Prophet Ibrahim and the fire" },
  cover: "/stories/ibrahim-fire/cover.webp",
  coverAlt: { th: "เปลวไฟสีส้มกลายเป็นแสงสีฟ้าเย็นสบาย มีดอกไม้เล็กๆ ผลิบานรอบๆ", en: "Orange flames turning into a cool blue light, with little flowers blooming all around" },
  robot: "/Character/faith.webp",
  deluxe: {
    cover: "/stories/ibrahim-fire/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      image: "/stories/ibrahim-fire/p01.webp",
      fx: "town",
      ambience: "land",
      alt: { th: "เมืองโบราณสีทรายยามเย็น มีวิหารหินหลังใหญ่ประตูปิดอยู่กลางเมือง", en: "An old sand-coloured town in the evening, with a big stone temple with closed doors in the middle" },
      th: "นานมาแล้ว ผู้คนในเมืองของนบีอิบรอฮีม (อะลัยฮิสสลาม) กราบไหว้รูปปั้นที่พวกเขาทำขึ้นเอง",
      en: "Long ago, the people in Prophet Ibrahim's (peace be upon him) town worshipped statues they had made themselves.",
    },
    {
      image: "/stories/ibrahim-fire/p02.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "ลานหน้าวิหารหิน มีบันไดหินกว้างและเสาสูง", en: "The square in front of the stone temple, with wide stone steps and tall columns" },
      th: "นบีอิบรอฮีมถามว่า รูปปั้นพวกนี้คืออะไร ทำไมพวกท่านถึงนั่งกราบไหว้มัน พวกเขาตอบว่า เราเห็นบรรพบุรุษของเรากราบไหว้มันมาก่อน",
      en: "Ibrahim asked: What are these statues you worship? They answered: We saw our fathers worshipping them.",
    },
    {
      image: "/stories/ibrahim-fire/p03.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "ท้องฟ้ากว้างใหญ่เหนือภูเขาและทุ่งหญ้า แสงแดดส่องลงมาเป็นลำ", en: "A huge sky over mountains and meadows, with rays of sunlight shining down" },
      th: "ท่านบอกว่า พระเจ้าของพวกท่าน คือพระเจ้าแห่งฟ้าและแผ่นดิน ผู้ทรงสร้างฟ้าและแผ่นดินขึ้นมา",
      en: "He said: Your Lord is the Lord of the heavens and the earth, the One who created them.",
    },
    {
      image: "/stories/ibrahim-fire/p04.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "ห้องโถงหินที่ว่างเปล่า มีเศษหินแตกกระจายอยู่บนพื้น และหินก้อนสูงหนึ่งก้อนคลุมผ้าไว้", en: "An empty stone hall with broken pieces of stone on the floor and one tall stone covered with a cloth" },
      th: "วันหนึ่ง เมื่อผู้คนออกไปนอกเมือง ท่านทุบรูปปั้นจนแตกเป็นชิ้นๆ เหลือไว้แค่ตัวที่ใหญ่ที่สุด",
      en: "One day, when the people had gone out, he broke the statues into pieces, leaving only the biggest one.",
    },
    {
      image: "/stories/ibrahim-fire/p05.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "เศษหินแตกบนพื้นห้องโถง แสงจากประตูที่เปิดอยู่ส่องเข้ามา", en: "Broken pieces of stone on the hall floor, with light coming in through the open door" },
      th: "ผู้คนกลับมาเห็นก็ถามว่า ใครทำแบบนี้ นบีอิบรอฮีมตอบว่า ลองถามพวกมันดูสิ ถ้าพวกมันพูดได้ พวกเขาก้มหน้า แล้วตอบว่า ท่านก็รู้ว่าพวกมันพูดไม่ได้",
      en: "The people came back and asked: Who did this? Ibrahim said: Ask them, if they can speak. They hung their heads and said: You know they cannot speak.",
    },
    {
      image: "/stories/ibrahim-fire/p06.webp",
      fx: "town",
      ambience: "land",
      alt: { th: "ลานเมืองยามบ่าย ประตูวิหารเปิดอ้า ภายในว่างเปล่า", en: "The town square in the afternoon, with the temple doors wide open and nothing inside" },
      th: "ท่านจึงถามว่า แล้วพวกท่านจะกราบไหว้สิ่งที่ไม่ให้ประโยชน์ และไม่ให้โทษอะไรพวกท่านเลยหรือ",
      en: "So he asked: Then do you worship things that cannot help you or harm you at all?",
    },
    {
      evidence: ["quran-3-173","bukhari-4563"],
      image: "/stories/ibrahim-fire/p07.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "fire",
      alt: { th: "กองไฟกองใหญ่ลุกโชนกลางลานกว้างยามค่ำคืน ประกายไฟลอยขึ้นสู่ท้องฟ้า", en: "A huge fire blazing in a wide square at night, with sparks rising into the sky" },
      th: "ผู้คนโกรธมาก พวกเขาก่อกองไฟกองใหญ่ แล้วโยนนบีอิบรอฮีมลงไป ตอนนั้นท่านกล่าวว่า",
      en: "The people were very angry. They built a huge fire and threw Ibrahim into it. At that moment he said:",
      meaning: { th: "อัลลอฮ์นั้นเป็นผู้ที่พอเพียงแก่เราแล้ว และเป็นผู้รับมอบหมายที่ดีเยี่ยม", en: "Sufficient for us is Allāh, and [He is] the best Disposer of affairs." },
    },
    {
      evidence: ["quran-al-anbiya-69"],
      image: "/stories/ibrahim-fire/p08.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "เปลวไฟสีส้มค่อยๆ กลายเป็นแสงสีฟ้าเย็นนุ่มนวล มีดอกไม้เล็กๆ บานอยู่รอบๆ", en: "Orange flames slowly turning into a soft, cool blue light, with little flowers blooming around" },
      th: "อัลลอฮ์ทรงสั่งไฟว่า",
      en: "Allah commanded the fire:",
      meaning: { th: "ไฟเอ๋ย! จงเย็นลง และให้ความปลอดภัยแก่อิบรอฮีมเถิด", en: "O fire, be coolness and safety upon Abraham." },
    },
    {
      image: "/stories/ibrahim-fire/p09.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ลานกว้างยามเช้า เหลือเพียงขี้เถ้าสีเทาจางๆ ท้องฟ้าสดใส", en: "The wide square in the morning, with only faint grey ashes left under a clear sky" },
      th: "ไฟจึงเย็นและปลอดภัยสำหรับนบีอิบรอฮีม ผู้คนวางแผนร้ายต่อท่าน แต่อัลลอฮ์ทรงทำให้พวกเขาเป็นฝ่ายแพ้",
      en: "So the fire was cool and safe for Ibrahim. The people planned to harm him, but Allah made them the losers.",
    },
    {
      image: "/stories/ibrahim-fire/p10.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "landnight",
      alt: { th: "ท้องฟ้ายามค่ำคืนเต็มไปด้วยดวงดาว เหนือเนินเขาที่สงบ", en: "A night sky full of stars over peaceful hills" },
      th: "เมื่อเรากลัว ให้เรามั่นใจในอัลลอฮ์ และพูดว่า ฮัสบุนัลลอฮ์ อัลลอฮ์ทรงดูแลผู้ที่เคารพภักดีพระองค์เพียงองค์เดียว",
      en: "When we feel afraid, let's trust Allah and say Hasbunallah. Allah takes care of those who worship Him alone.",
    },
  ],
};
