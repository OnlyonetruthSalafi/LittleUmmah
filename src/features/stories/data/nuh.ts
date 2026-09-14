import type { Story } from "../types";

/*
  นิทานนบีนูห์กับเรือลำใหญ่ (วัย 3-6 ปี)

  เนื้อหามาจากอัลกุรอานและหะดีษเศาะฮีห์เท่านั้น
  - เรียกร้องผู้คน 950 ปี (อัลอันกะบูต), สร้างเรือตามคำสั่ง และถูกหัวเราะเยาะ (ฮูด)
  - นำขึ้นเรือชนิดละคู่ พร้อมครอบครัวและผู้ศรัทธา, "บิสมิลลาฮิ มัจเราะฮา วะมุรซาฮา" (ฮูด)
  - ฟ้าเทน้ำ แผ่นดินพุ่งน้ำ (อัลเกาะมัร), คลื่นเหมือนภูเขา แผ่นดินกลืนน้ำ เรือจอดบนอัลญูดีย์ (ฮูด)
  เจ้าของโปรเจกต์อนุญาต (2026-09-15) ให้เรื่องนบีนูห์ใช้หะดีษเศาะฮีห์ได้ ใช้ 3 บท:
  - หน้า 1: ที่มาของรูปปั้นวัดด์ สุวาอ์ ยะฆูษ ยะอูก นัสร์ — ศ่อฮีห์อัลบุคอรี 4920 (อิบนุอับบาส, ตัฟซีรซูเราะฮ์นูห์)
  - หน้า 2: นบีนูห์เป็นร่อซูลคนแรกที่ถูกส่งมายังชาวโลก — อัลบุคอรี 3340, มุสลิม 194 (หะดีษการชะฟาอะฮ์)
  - หน้า 11: คำสั่งเสียของนบีนูห์แก่ลูก — อะหมัด 6583, อัลอะดับอัลมุฟร็อด 548
    อัลอัลบานีย์ว่าเศาะฮีห์ (อัสสิลสิละฮ์อัศเศาะฮีหะฮ์ 134) — ให้เจ้าของโปรเจกต์ตรวจเลขอ้างอิงก่อน commit
  ในนิทานไม่แสดงแหล่งอ้างอิง (เจ้าของโปรเจกต์: นิทานเด็กไม่ต้องใส่) รายการนี้เก็บไว้ชี้แจงในหน้าผู้ปกครองภายหลัง
  ไม่ใช้หะดีษอ่อน เช่น "นบีนูห์ถือศีลอดตลอดปี" (อิบนุมาญะฮ์ — ฎออีฟ)
  ไม่ใส่รายละเอียดจากคัมภีร์อื่น เช่น นกพิราบ รุ้งกินน้ำ หรือ 40 วัน
  - หน้า 8b: บุตรชายไม่ยอมขึ้นเรือ หนีขึ้นภูเขา แล้วคลื่นกั้นกลาง (ฮูด) — เจ้าของโปรเจกต์ขอให้ใส่ (2026-09-15)
    ภาพไม่มีตัวบุตรชาย ใช้ยอดเขาโดดเดี่ยวกับคลื่นยักษ์แทน

  ภาพไม่มีคน ไม่มีศาสดา (ข้อ 1.4) ไม่มีสัตว์ — ภาพสัตว์ขึ้นเรือใช้รอยเท้าเป็นคู่แทน
  ข้อความอยู่ในหน้าเว็บทั้งหมด ไม่ฝังในภาพ (ข้อ 1.5)
*/
export const NUH_STORY: Story = {
  slug: "nuh",
  titleTh: "นบีนูห์กับเรือลำใหญ่",
  titleEn: "Prophet Nuh and the Ark",
  cover: "/stories/nuh/cover.webp",
  coverAlt: "เรือไม้ลำใหญ่แล่นบนคลื่นสีฟ้ายามรุ่งอรุณ",
  robot: "/Character/faith.webp",
  pages: [
    {
      image: "/stories/nuh/p01.webp",
      alt: "หมู่บ้านเล็กๆ ยามเย็น ท้องฟ้าหม่นมัว",
      th: "นานมาแล้ว มีคนดีห้าคน เมื่อพวกเขาเสียชีวิต ชัยฏอนกระซิบให้ผู้คนทำรูปปั้นไว้ระลึกถึง นานเข้าคนรุ่นหลังก็ลืม แล้วหันไปกราบไหว้รูปปั้นแทนอัลลอฮ์",
      en: "Long ago there were five good men. When they died, Shaytan whispered to the people to make statues of them. Later generations forgot, and began worshipping the statues instead of Allah.",
    },
    {
      image: "/stories/nuh/p02.webp",
      alt: "ทางเดินที่มีตะเกียงส่องสว่าง ฟ้าครึ่งหนึ่งเป็นกลางวัน อีกครึ่งเป็นกลางคืน",
      th: "อัลลอฮ์ทรงส่งนบีนูห์ (อะลัยฮิสสลาม) มาเตือนพวกเขา ท่านเป็นร่อซูลคนแรกที่ถูกส่งมายังชาวโลก ท่านชวนผู้คนทั้งกลางวันและกลางคืน นานถึงเก้าร้อยห้าสิบปี",
      en: "Allah sent Prophet Nuh (peace be upon him) to warn them. He was the first messenger sent to the people of the earth. He called them by day and by night, for nine hundred and fifty years.",
    },
    {
      image: "/stories/nuh/p03.webp",
      alt: "โครงเรือไม้กำลังสร้างอยู่กลางทุ่งหญ้า มีแผ่นไม้และเครื่องมือวางอยู่",
      th: "แต่มีคนศรัทธาเพียงไม่กี่คน อัลลอฮ์จึงทรงสั่งให้นบีนูห์สร้างเรือลำใหญ่",
      en: "But only a few believed. So Allah told Nuh to build a great big ship.",
    },
    {
      image: "/stories/nuh/p04.webp",
      alt: "เรือไม้ลำใหญ่ที่เกือบเสร็จ ตั้งอยู่บนเนินเขาที่แห้งแล้ง ไกลจากทะเล",
      th: "ใครเดินผ่านก็หัวเราะเยาะ สร้างเรือทำไมบนบก! แต่นบีนูห์อดทน และสร้างเรือต่อไปจนเสร็จ",
      en: "People walked by and laughed: a ship on dry land! But Nuh was patient and kept building until it was done.",
    },
    {
      image: "/stories/nuh/p05.webp",
      alt: "ทางลาดขึ้นเรือ มีรอยเท้าสัตว์หลายแบบเดินขึ้นไปเป็นคู่ๆ",
      th: "อัลลอฮ์ทรงสั่งให้นำสัตว์ขึ้นเรือ ชนิดละหนึ่งคู่ พร้อมกับครอบครัวและผู้ศรัทธา",
      en: "Allah told him to bring onto the ship a pair of every kind of animal, with his family and the believers.",
    },
    {
      image: "/stories/nuh/p06.webp",
      alt: "ประตูเรือเปิดอยู่ แสงตะเกียงอบอุ่นส่องออกมาจากข้างใน",
      th: "นบีนูห์กล่าวว่า ขึ้นเรือกันเถิด ด้วยพระนามของอัลลอฮ์ เรือจะแล่นไปและจอดลง",
      en: "Nuh said: Climb aboard! In the name of Allah it will sail, and in His name it will stop.",
      arabic: "بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا",
      reading: "บิสมิลลาฮิ มัจเราะฮา วะมุรซาฮา",
      meaning: "ด้วยพระนามของอัลลอฮ์ ขณะแล่นไปและขณะจอดลง",
    },
    {
      image: "/stories/nuh/p07.webp",
      alt: "ฝนตกหนักจากเมฆสีเทา น้ำพุ่งขึ้นจากพื้นดิน เรือลอยอยู่บนน้ำ",
      th: "แล้วฝนก็เทลงมาจากฟ้า น้ำพุ่งขึ้นมาจากแผ่นดิน น้ำท่วมสูงขึ้นเรื่อยๆ",
      en: "Then water poured down from the sky, and springs burst up from the earth. The water rose higher and higher.",
    },
    {
      image: "/stories/nuh/p08.webp",
      alt: "เรือแล่นท่ามกลางคลื่นสูงใหญ่ แสงอบอุ่นส่องจากหน้าต่างเรือ",
      th: "เรือแล่นไปท่ามกลางคลื่นสูงเหมือนภูเขา แต่ทุกคนบนเรือปลอดภัย เพราะอัลลอฮ์ทรงดูแล",
      en: "The ship sailed through waves as high as mountains, but everyone aboard was safe, because Allah was taking care of them.",
    },
    {
      // ชื่อไฟล์ p08b เพื่อไม่ต้องเปลี่ยนชื่อภาพและเสียงของหน้าหลังจากนี้ (เพิ่มภายหลัง)
      image: "/stories/nuh/p08b.webp",
      alt: "ยอดภูเขาโดดเดี่ยวกลางน้ำท่วม มีคลื่นยักษ์กั้นระหว่างภูเขากับเรือ",
      th: "นบีนูห์เห็นลูกชายอยู่ห่างออกไป ท่านร้องเรียกว่า ลูกเอ๋ย ขึ้นเรือมากับเราเถิด อย่าอยู่กับผู้ปฏิเสธเลย แต่ลูกชายตอบว่า ฉันจะหนีขึ้นภูเขา ภูเขาจะช่วยฉันจากน้ำได้ นบีนูห์บอกว่า วันนี้ไม่มีใครช่วยได้ นอกจากอัลลอฮ์ แล้วคลื่นก็ซัดมากั้นระหว่างทั้งสอง ลูกชายจึงจมน้ำไป",
      en: "Nuh saw his son far away. He called: My son, come aboard with us, don't stay with the disbelievers! But his son said: I will climb a mountain, it will save me from the water. Nuh said: Today no one can save you except Allah. Then a wave came between them, and the son was drowned.",
    },
    {
      image: "/stories/nuh/p09.webp",
      alt: "ฟ้าสว่างสดใส น้ำลดลง เรือจอดอยู่บนยอดภูเขาเขียวขจี",
      th: "อัลลอฮ์ทรงสั่งให้แผ่นดินกลืนน้ำ และให้ฟ้าหยุดฝน เรือจึงจอดลงบนภูเขาอัลญูดีย์",
      en: "Allah commanded the earth to swallow its water and the sky to stop. The ship came to rest on Mount Al-Judi.",
    },
    {
      image: "/stories/nuh/p10.webp",
      alt: "เรือบนยอดเขายามเย็น ท้องฟ้ามีดวงดาวสีทองและจันทร์เสี้ยว",
      th: "ผู้ที่เชื่อฟังอัลลอฮ์ได้รับความปลอดภัย มาเชื่อฟังอัลลอฮ์ และอดทนเหมือนนบีนูห์กันนะ",
      en: "Those who obeyed Allah were kept safe. Let's obey Allah and be patient, just like Prophet Nuh!",
    },
    {
      image: "/stories/nuh/p11.webp",
      alt: "ตะเกียงสีทองส่องสว่างข้างหน้าต่างโค้ง มองเห็นท้องฟ้ายามค่ำที่เต็มไปด้วยดวงดาว",
      th: "ก่อนนบีนูห์จะเสียชีวิต ท่านสั่งเสียลูกให้กล่าว ลาอิลาฮะอิลลัลลอฮ์ และซุบฮานัลลอฮิวะบิฮัมดิฮ์ เพราะทุกสิ่งในโลกกล่าวสรรเสริญอัลลอฮ์ด้วยคำนี้ เรามากล่าวด้วยกันนะ",
      en: "Before Prophet Nuh passed away, he told his son to say: La ilaha illallah, and Subhanallahi wa bihamdihi, because everything in the world praises Allah with it. Let's say it together!",
      arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ، سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      reading: "ลาอิลาฮะ อิลลัลลอฮ์ ... ซุบฮานัลลอฮิ วะบิฮัมดิฮ์",
      meaning: "ไม่มีพระเจ้าอื่นใดนอกจากอัลลอฮ์ ... มหาบริสุทธิ์แด่อัลลอฮ์และด้วยการสรรเสริญพระองค์",
    },
  ],
};
