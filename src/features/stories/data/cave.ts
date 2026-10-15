import type { Story } from "../types";

/*
  นิทานชาวถ้ำ (วัย 7 ปีขึ้นไป)

  เนื้อหามาจากอัลกุรอานเท่านั้น (อัลกะฮ์ฟ์ 9-26 ตรวจกับ Shamela 7 ต.ค. 2026 ตัฟซีรอิบนุ กะษีร https://shamela.ws/book/8473/2548 ถึง /2560)
  - ชายหนุ่มที่ศรัทธา อัลลอฮ์ทรงเพิ่มทางนำ (13) ยืนขึ้นกล่าวว่าพระเจ้าของเราคือพระเจ้าแห่งฟ้าและแผ่นดิน (14)
  - ผู้คนของพวกเขาเคารพพระเจ้าอื่น (15) แยกตัวไปหลบในถ้ำ (16)
  - ดุอาอ์ «ربنا آتنا من لدنك رحمة وهيئ لنا من أمرنا رشدا» (10) แล้วหลับไปหลายปี (11)
  - แสงอาทิตย์ขึ้นเอียงหลบไปทางขวา ตกเลยผ่านทางซ้าย พวกเขาอยู่ในที่กว้างของถ้ำ เป็นสัญญาณของอัลลอฮ์ (17)
  - คิดว่าตื่นแต่หลับ พลิกตัวขวาซ้าย สุนัขเหยียดขาหน้าที่ปากถ้ำ (18)
  - ตื่นแล้วถามกันว่าหลับไปนานเท่าไร "หนึ่งวันหรือไม่ถึงวัน" "พระเจ้าของพวกท่านรู้ดีที่สุด"
    ส่งคนหนึ่งพาเหรียญเงินไปซื้ออาหารที่ดี ให้ระวังตัว (19) กลัวถูกบังคับให้กลับไปนับถือแบบเดิม (20)
  - อัลลอฮ์ทรงให้ผู้คนรู้เรื่องพวกเขา เพื่อให้รู้ว่าสัญญาของอัลลอฮ์จริง และวันกิยามะฮ์ไม่มีข้อสงสัย (21)
  - จำนวนคนมีแต่อัลลอฮ์ทรงรู้ (22) อยู่ในถ้ำ 300 ปีและเพิ่มอีก 9 (25)
  ไม่ใส่ ชื่อเมือง ชื่อกษัตริย์ ชื่อชาวถ้ำหรือสุนัข สีสุนัข จำนวนคน เรื่องเหรียญเก่าที่คนในเมืองจำไม่ได้
  (ตัฟซีรเล่าด้วย «ذكروا»/อิสรออีลียาต — ข้อ 1.6) และไม่เล่าตอนสร้างอาคารเหนือถ้ำ (21 ท้ายอายะฮ์)

  ภาพไม่มีคน (ชาวถ้ำเป็นคนจริงในประวัติศาสตร์ ใช้ถ้ำ แสง และข้าวของแทน)
  สุนัขเห็นแค่ขาหน้าที่ปากถ้ำ ไม่เห็นหัว (ข้อ 1.1 — ส่วนของร่างกายที่ไม่ใช่ใบหน้า)
*/
export const CAVE_STORY: Story = {
  slug: "cave",
  title: { th: "ชาวถ้ำ", en: "The people of the cave" },
  cover: "/stories/cave/cover.webp",
  coverAlt: "ปากถ้ำบนภูเขาหินยามเช้า แสงอาทิตย์สีทองส่องผ่านเข้าไปข้างใน",
  robot: "/Character/faith.webp",
  deluxe: {
    cover: "/stories/cave/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      image: "/stories/cave/p01.webp",
      fx: "town",
      ambience: "land",
      alt: "เมืองโบราณมีกำแพงหินและหอคอย ตั้งอยู่เชิงเขา",
      th: "นานมาแล้ว ในเมืองหนึ่ง ผู้คนเคารพบูชาสิ่งอื่นนอกจากอัลลอฮ์ แต่มีชายหนุ่มกลุ่มหนึ่งศรัทธาต่ออัลลอฮ์ และอัลลอฮ์ทรงเพิ่มทางนำให้พวกเขา",
      en: "Long ago, in a certain town, people worshipped others besides Allah. But a group of young men believed in Allah, and Allah increased them in guidance.",
    },
    {
      image: "/stories/cave/p02.webp",
      fx: "clouds",
      ambience: "land",
      alt: "ลานหินกลางเมือง ท้องฟ้าสดใสและแสงแดดส่องลงมา",
      th: "พวกเขายืนขึ้นอย่างกล้าหาญแล้วพูดว่า พระเจ้าของเรา คือพระเจ้าแห่งฟ้าและแผ่นดิน เราจะไม่วิงวอนพระเจ้าอื่นนอกจากพระองค์",
      en: "They stood up bravely and said: Our Lord is the Lord of the heavens and the earth. We will never call on any god besides Him.",
    },
    {
      image: "/stories/cave/p03.webp",
      fx: "dust",
      ambience: "land",
      alt: "ทางเดินบนภูเขาทอดยาวขึ้นไปสู่ปากถ้ำ เมืองอยู่ไกลออกไปด้านล่าง",
      th: "เพื่อรักษาความศรัทธาไว้ พวกเขาแยกตัวออกจากผู้คน และไปหลบอยู่ในถ้ำบนภูเขา",
      en: "To protect their faith, they left their people and took shelter in a cave in the mountains.",
    },
    {
      image: "/stories/cave/p04.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "cave",
      alt: "ภายในถ้ำยามค่ำคืน มองออกไปเห็นท้องฟ้าเต็มไปด้วยดาว",
      th: "ในถ้ำ พวกเขาวิงวอนว่า",
      en: "In the cave, they prayed:",
      meaning: "ข้าแต่พระผู้เป็นเจ้าของเรา ขอพระองค์ทรงโปรดประทานความเมตตาจากพระองค์แก่เรา และทรงทำให้การงานของเราอยู่ในแนวทางที่ถูกต้อง",
    },
    {
      image: "/stories/cave/p05.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "cave",
      alt: "ถ้ำเงียบสงบภายใต้แสงจันทร์ ฝุ่นละอองลอยอยู่ในแสงที่ส่องเข้ามา",
      th: "อัลลอฮ์ทรงทำให้พวกเขาหลับไปในถ้ำ เป็นเวลานานหลายปี",
      en: "Allah made them fall asleep in the cave for many years.",
    },
    {
      image: "/stories/cave/p06.webp",
      fx: "rays",
      ambience: "cave",
      alt: "แสงอาทิตย์ส่องเฉียงผ่านปากถ้ำ ตกลงข้างผนังถ้ำ ไม่ส่องถึงพื้นที่กว้างด้านใน",
      th: "ตอนเช้า แสงแดดเอียงหลบไปทางขวาของถ้ำ ตอนเย็น แสงแดดเลยผ่านไปทางซ้าย ส่วนพวกเขาอยู่ในที่กว้างข้างในถ้ำ นี่คือสัญญาณหนึ่งของอัลลอฮ์",
      en: "In the morning, the sun turned away to the right of the cave. In the evening, it passed by on the left, while they lay in a wide space inside. This is one of the signs of Allah.",
    },
    {
      image: "/stories/cave/p07.webp",
      fx: "shade",
      ambience: "cave",
      alt: "ปากถ้ำ มีขาหน้าของสุนัขเหยียดยาวอยู่บนธรณีหิน",
      th: "ใครเห็นพวกเขาจะคิดว่าตื่นอยู่ แต่จริงๆ พวกเขาหลับ อัลลอฮ์ทรงพลิกตัวพวกเขาไปทางขวาและทางซ้าย และสุนัขของพวกเขาก็หมอบเหยียดขาหน้าอยู่ที่ปากถ้ำ",
      en: "Anyone seeing them would think they were awake, but they were asleep. Allah turned them over to the right and to the left, and their dog lay at the entrance with its forelegs stretched out.",
    },
    {
      image: "/stories/cave/p08.webp",
      fx: "dawn",
      ambience: "cave",
      alt: "แสงอรุณสีชมพูทองส่องเข้ามาในถ้ำ",
      th: "แล้วอัลลอฮ์ก็ทรงให้พวกเขาตื่นขึ้น พวกเขาถามกันว่า เราหลับไปนานเท่าไร บางคนตอบว่า วันเดียวหรือไม่ถึงวัน แล้วพวกเขาก็พูดว่า พระเจ้าของพวกเรารู้ดีที่สุด",
      en: "Then Allah woke them up. They asked each other: How long have we slept? Some said: A day, or part of a day. Then they said: Our Lord knows best.",
    },
    {
      image: "/stories/cave/p09.webp",
      fx: "dawn",
      ambience: "land",
      alt: "เหรียญเงินเก่าวางอยู่บนก้อนหิน ไกลออกไปเห็นทางเดินลงเขาไปสู่เมือง",
      th: "พวกเขาให้คนหนึ่งเอาเหรียญเงินเข้าไปในเมือง เพื่อซื้ออาหารที่ดี และบอกให้ระวังตัว อย่าให้ใครรู้เรื่องพวกเขา เพราะกลัวว่าจะถูกบังคับให้กลับไปนับถือแบบเดิม",
      en: "They sent one of them to the town with their silver coins to buy good food, and told him to be careful and let no one know about them, for fear of being forced back to the old religion.",
    },
    {
      image: "/stories/cave/p10.webp",
      fx: "town",
      ambience: "land",
      alt: "เมืองยามเช้าที่ดูแตกต่างไปจากเดิม มีบ้านเรือนและถนนใหม่ๆ",
      th: "อัลลอฮ์ทรงให้ผู้คนได้รู้เรื่องของพวกเขา เพื่อให้รู้ว่าสัญญาของอัลลอฮ์เป็นความจริง และวันกิยามะฮ์จะมาถึงอย่างแน่นอน",
      en: "Allah let the people find out about them, so that they would know that Allah's promise is true and that the Day of Judgement will surely come.",
    },
    {
      image: "/stories/cave/p11.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "landnight",
      alt: "ภูเขาและปากถ้ำใต้ท้องฟ้ายามค่ำ มีดาวมากมายเต็มฟ้า",
      th: "พวกเขาอยู่ในถ้ำ 300 ปี และเพิ่มอีก 9 ปี ส่วนพวกเขามีกี่คน อัลลอฮ์ทรงรู้ดีที่สุด",
      en: "They stayed in their cave for three hundred years, and nine more. As for how many they were, Allah knows best.",
    },
    {
      image: "/stories/cave/p12.webp",
      fx: "dawn",
      ambience: "land",
      alt: "ดวงอาทิตย์ขึ้นเหนือภูเขา แสงสีทองส่องไปทั่วหุบเขา",
      th: "ชายหนุ่มเหล่านี้เลือกอัลลอฮ์ก่อนสิ่งอื่นใด อัลลอฮ์จึงทรงดูแลพวกเขา ถ้ามีใครชวนเราทำสิ่งที่ผิด ให้เรายึดมั่นในอัลลอฮ์เหมือนพวกเขานะ",
      en: "These young men chose Allah above everything, so Allah took care of them. If anyone asks us to do wrong, let's hold on to Allah just like them.",
    },
  ],
};
