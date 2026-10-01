import type { Story } from "../types";

/*
  นิทานนบีมูซาข้ามทะเล (วัย 7 ปีขึ้นไป)

  เนื้อหามาจากอัลกุรอานเท่านั้น
  - ฟิรเอาน์หยิ่งผยองและกดขี่วงศ์วานอิสรออีล (อัลเกาะศ็อศ 4), "ข้าคือพระเจ้าสูงสุดของพวกเจ้า" (อันนาซิอาต 24)
  - นบีมูซากับนบีฮารูนผู้เป็นพี่น้องถูกส่งไปพร้อมสัญญาณ ขอให้ปล่อยวงศ์วานอิสรออีล (ฏอฮา 29-30, 47)
  - ให้พาบ่าวของอัลลอฮ์ออกเดินทางกลางคืน แล้วจะถูกไล่ตาม (อัชชุอะรออ์ 52)
  - ฟิรเอาน์ส่งคนไปรวบรวมทหารตามเมืองต่างๆ "พวกนั้นเป็นแค่กลุ่มเล็กๆ" (อัชชุอะรออ์ 53-56)
  - ไล่ตามตอนพระอาทิตย์ขึ้น เมื่อสองฝ่ายเห็นกัน "พวกเราจะถูกตามทันแน่" / "ไม่หรอก พระเจ้าของฉันอยู่กับฉัน" (อัชชุอะรออ์ 60-62)
  - ตีทะเลด้วยไม้เท้า ทะเลแยก แต่ละฝั่งเหมือนภูเขาใหญ่ (อัชชุอะรออ์ 63)
  - ทางแห้ง ไม่ต้องกลัวถูกตามทันและไม่ต้องกลัวจมน้ำ (ฏอฮา 77)
  - ช่วยนบีมูซาและทุกคนที่อยู่กับท่าน ให้อีกฝ่ายจมน้ำ (อัชชุอะรออ์ 64-66, ฏอฮา 78)
  - ฟิรเอาน์ประกาศศรัทธาตอนจมน้ำ "ตอนนี้หรือ ทั้งที่ก่อนหน้านี้เจ้าฝ่าฝืน" ร่างถูกเก็บไว้เป็นสัญญาณ (ยูนุส 90-92)
  - หน้าสุดท้าย: "ผู้ใดยำเกรงอัลลอฮ์ พระองค์จะทรงทำให้มีทางออกแก่เขา" (อัฏฏอลาก 2)
  ไม่ใช้หะดีษ — เจ้าของโปรเจกต์อนุญาตหะดีษเศาะฮีห์เฉพาะเรื่องนบีนูห์ (2026-09-15) ยังไม่ได้ถามสำหรับเรื่องนี้
  (เช่น หะดีษการถือศีลอดวันอาชูรออ์ ถ้าเจ้าของโปรเจกต์อนุญาตค่อยเพิ่ม)
  ไม่ใส่รายละเอียดจากตัฟซีร/อิสรออีลียาต เช่น ชื่อทะเล จำนวนทาง จำนวนทหาร หรือว่าฮารูนเป็นพี่หรือน้อง

  ภาพไม่มีคน ไม่มีศาสดา (ข้อ 1.4) ไม่มีสัตว์ ไม่มีรูปปั้น ไม่มีมือถือไม้เท้า
  การเดินทางของผู้ศรัทธาใช้รอยเท้าบนทรายแทนตัวคน กองทัพใช้พายุฝุ่นแทนทหาร
  ข้อความอยู่ในหน้าเว็บทั้งหมด ไม่ฝังในภาพ (ข้อ 1.5)
*/
export const MUSA_STORY: Story = {
  slug: "musa",
  titleTh: "นบีมูซาข้ามทะเล",
  titleEn: "Prophet Musa and the sea",
  cover: "/stories/musa/cover.webp",
  coverAlt: "ทะเลแยกออกเป็นกำแพงน้ำสองฝั่ง มีทางเดินทรายแห้งทอดอยู่ตรงกลาง",
  robot: "/Character/faith.webp",
  pages: [
    {
      image: "/stories/musa/p01.webp",
      alt: "พระราชวังหินใหญ่โตริมแม่น้ำยามเย็น มีพีระมิดอยู่ไกลๆ",
      th: "นานมาแล้วในอียิปต์ มีกษัตริย์ชื่อฟิรเอาน์ เขาหยิ่งยโสจนถึงกับประกาศว่า ข้าคือพระเจ้าสูงสุดของพวกเจ้า เขากดขี่วงศ์วานอิสรออีลและทำร้ายพวกเขาอย่างโหดร้าย",
      en: "Long ago in Egypt there was a king called Fir'awn. He was so arrogant that he announced: I am your lord, the most high! He oppressed the Children of Israel and treated them cruelly.",
    },
    {
      image: "/stories/musa/p02.webp",
      alt: "ประตูวังบานใหญ่ปิดสนิท ขนาบด้วยเสาหินสูง",
      th: "อัลลอฮ์ทรงส่งนบีมูซา (อะลัยฮิสสลาม) และนบีฮารูนผู้เป็นพี่น้องของท่าน ไปเตือนฟิรเอาน์ให้เคารพภักดีอัลลอฮ์องค์เดียว และให้ปล่อยวงศ์วานอิสรออีลเป็นอิสระ ท่านนำสัญญาณอันชัดแจ้งจากอัลลอฮ์ไปแสดง แต่ฟิรเอาน์ก็ยังหยิ่งและไม่ยอมเชื่อ",
      en: "Allah sent Prophet Musa (peace be upon him) and his brother Prophet Harun to warn Fir'awn to worship Allah alone and to let the Children of Israel go free. Musa showed him clear signs from Allah, but Fir'awn stayed proud and refused to believe.",
    },
    {
      image: "/stories/musa/p03.webp",
      alt: "รอยเท้าบนเนินทรายใต้แสงจันทร์ ทอดยาวออกจากเมืองที่เห็นแสงไฟอยู่ไกลๆ",
      th: "อัลลอฮ์ทรงบอกนบีมูซาว่า จงพาบ่าวของเราออกเดินทางตอนกลางคืน แล้วพวกเจ้าจะถูกไล่ตาม คืนนั้นผู้ศรัทธาจึงออกจากเมืองไปอย่างเงียบๆ",
      en: "Allah told Musa: Travel by night with My servants, for you will be followed. So that night the believers quietly left the city.",
    },
    {
      image: "/stories/musa/p04.webp",
      alt: "พายุฝุ่นทรายขนาดมหึมาเคลื่อนข้ามทะเลทรายมาในยามรุ่งสาง",
      th: "ฟิรเอาน์โกรธมาก เขาส่งคนไปทุกเมืองเพื่อรวบรวมทหาร แล้วประกาศว่า พวกนั้นเป็นแค่กลุ่มเล็กๆ และพวกมันทำให้เราโกรธ แล้วกองทัพใหญ่ก็ออกไล่ตามมา",
      en: "Fir'awn was furious. He sent men to every city to gather soldiers, and announced: They are only a small band, and they have made us angry! Then his great army set off after them.",
    },
    {
      image: "/stories/musa/p05.webp",
      alt: "รอยเท้ามากมายหยุดอยู่ที่ริมทะเล ขณะที่พายุฝุ่นใกล้เข้ามาจากอีกด้านตอนพระอาทิตย์ขึ้น",
      th: "กองทัพของฟิรเอาน์ไล่ตามมาตอนพระอาทิตย์ขึ้น เมื่อทั้งสองฝ่ายมองเห็นกัน ผู้คนที่มากับนบีมูซาตกใจกลัว และพูดว่า พวกเราจะถูกตามทันแน่!",
      en: "Fir'awn's army chased them at sunrise. When the two groups saw each other, the people with Musa were frightened and cried: We will surely be caught!",
    },
    {
      image: "/stories/musa/p06.webp",
      alt: "ลำแสงสีทองส่องลงมาจากฟ้าบนผืนทะเลยามเช้า",
      th: "แต่นบีมูซามั่นใจในอัลลอฮ์ ท่านตอบอย่างหนักแน่นว่า",
      en: "But Musa trusted Allah completely. He answered firmly:",
      arabic: "كَلَّا إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ",
      reading: "กัลลา อินนะ มะอิยะ ร็อบบี ซะยะฮ์ดีน",
      meaning: "ไม่หรอก แท้จริงพระเจ้าของฉันอยู่กับฉัน พระองค์จะทรงชี้ทางให้ฉัน",
    },
    {
      image: "/stories/musa/p07.webp",
      alt: "ทะเลกำลังแยกออกเป็นสองฝั่ง กำแพงน้ำสีฟ้าตั้งสูงเหมือนภูเขา",
      th: "อัลลอฮ์ทรงบอกนบีมูซาให้ใช้ไม้เท้าตีทะเล แล้วทะเลก็แยกออกเป็นสองฝั่ง น้ำแต่ละฝั่งตั้งตระหง่านสูงเหมือนภูเขาใหญ่",
      en: "Allah told Musa to strike the sea with his staff. The sea split apart, and each side stood up tall like a great mountain.",
    },
    {
      image: "/stories/musa/p08.webp",
      alt: "ทางเดินทรายแห้งระหว่างกำแพงน้ำสองฝั่ง มีรอยเท้าทอดไปถึงฝั่งตรงข้าม",
      th: "ตรงกลางกลายเป็นทางเดินที่แห้งสนิท นบีมูซาและผู้ศรัทธาทุกคนเดินข้ามไปอย่างปลอดภัย ไม่ต้องกลัวว่าจะถูกจับ และไม่ต้องกลัวจมน้ำ",
      en: "In the middle was a completely dry path. Musa and all the believers walked across safely, with no fear of being caught and no fear of drowning.",
    },
    {
      image: "/stories/musa/p09.webp",
      alt: "กำแพงน้ำสองฝั่งถล่มกลับมารวมกัน เกิดคลื่นฟองขาวใหญ่",
      th: "ฟิรเอาน์กับกองทัพตามลงมาในทางนั้น เมื่อนบีมูซาและผู้ศรัทธาขึ้นฝั่งกันหมดแล้ว อัลลอฮ์ทรงให้น้ำทะเลกลับมารวมกัน ท่วมฟิรเอาน์และกองทัพของเขาทั้งหมด",
      en: "Fir'awn and his army followed them down the path. Once Musa and the believers were all safely across, Allah made the sea come back together, and it covered Fir'awn and his whole army.",
    },
    {
      image: "/stories/musa/p10.webp",
      alt: "มงกุฎทองคำตกอยู่บนทรายเปียกริมทะเลที่สงบลงแล้ว",
      th: "ขณะกำลังจมน้ำ ฟิรเอาน์ร้องว่า ฉันศรัทธาแล้ว แต่สายเกินไป อัลลอฮ์ตรัสว่า ตอนนี้หรือ ทั้งที่ก่อนหน้านี้เจ้าฝ่าฝืน และเป็นผู้ก่อความเสียหาย อัลลอฮ์ทรงเก็บร่างของเขาไว้ เป็นบทเรียนแก่คนรุ่นหลัง",
      en: "As he was drowning, Fir'awn cried: I believe! But it was too late. Allah said: Now? When before you disobeyed and spread corruption? Allah preserved his body as a lesson for those who come after.",
    },
    {
      image: "/stories/musa/p11.webp",
      alt: "รอยเท้าเดินขึ้นจากทะเลสู่ฝั่งเขียวขจีที่มีต้นอินทผลัม ยามเช้าสดใส",
      th: "นบีมูซาและผู้ศรัทธาปลอดภัยอยู่บนอีกฝั่งของทะเล อัลลอฮ์ทรงช่วยพวกเขาทุกคนให้รอดพ้น",
      en: "Musa and the believers were safe on the other side of the sea. Allah saved every one of them.",
    },
    {
      image: "/stories/musa/p12.webp",
      alt: "ตะเกียงสีทองบนชายฝั่งยามค่ำ ท้องฟ้าเต็มไปด้วยดวงดาวและจันทร์เสี้ยวเหนือทะเลสงบ",
      th: "ไม่ว่าทางข้างหน้าจะดูตันแค่ไหน ถ้าเราเชื่อฟังและมั่นใจในอัลลอฮ์ พระองค์จะทรงเปิดทางให้เสมอ อัลลอฮ์ตรัสว่า",
      en: "However blocked the road ahead may seem, if we obey Allah and trust in Him, He will always open a way. Allah says:",
      arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      reading: "วะมัย ยัตตะกิลลาฮะ ยัจอัล ละฮู มัครอญา",
      meaning: "และผู้ใดยำเกรงอัลลอฮ์ พระองค์จะทรงทำให้มีทางออกแก่เขา",
    },
  ],
};
