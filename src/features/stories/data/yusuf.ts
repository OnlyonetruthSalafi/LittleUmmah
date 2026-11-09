import type { Story } from "../types";

/*
  นิทานนบียูซุฟผู้อดทน (วัย 7 ปีขึ้นไป)

  เนื้อหามาจากอัลกุรอานเท่านั้น (ซูเราะฮ์ยูซุฟ ตรวจกับ Shamela 7 ต.ค. 2026 ตัฟซีรอิบนุ กะษีร https://shamela.ws/book/8473/2168 ถึง /2210)
  - ความฝัน ดาว 11 ดวง ดวงอาทิตย์ ดวงจันทร์ กราบท่าน (4) / พ่อบอกอย่าเล่าให้พี่ๆ ฟัง (5)
  - พี่ๆ อิจฉาเพราะพ่อรักท่าน (8) พาออกไปแล้วตกลงกันโยนลงก้นบ่อ อัลลอฮ์ทรงบอกท่านว่าสักวันจะได้บอกพวกเขาถึงสิ่งนี้ (15)
  - ค่ำนั้นกลับมาร้องไห้ บอกว่าหมาป่ากินเขา พ่อกล่าว «فصبر جميل» (16-18)
  - คาราวานหย่อนถังพบท่าน แล้วท่านถูกขายในราคาถูก (19-20) ไปอยู่อียิปต์ (21)
  - ถูกขังในคุกหลายปี (42 «بضع سنين») ทั้งที่ไม่ได้ทำผิด (51 «ما علمنا عليه من سوء»)
  - ความฝันของกษัตริย์ วัวอ้วน 7 วัวผอม 7 รวงเขียว 7 รวงแห้ง 7 (43) ท่านตีความ ปลูก 7 ปีเก็บไว้ในรวง แล้วแห้งแล้ง 7 ปี (46-49)
  - กษัตริย์ให้ดูแลคลังของแผ่นดิน "ฉันรักษาได้ดีและมีความรู้" (54-55)
  - พี่ๆ มา ท่านจำได้ พวกเขาจำไม่ได้ (58) / "ฉันคือยูซุฟ" ... "ผู้ใดยำเกรงและอดทน อัลลอฮ์ไม่ทำให้รางวัลของผู้ทำดีสูญเปล่า" (90)
  - พี่ๆ ยอมรับผิด (91) «لا تثريب عليكم اليوم يغفر الله لكم» (92)
  - ครอบครัวมาอียิปต์ ความฝันเป็นจริง "พระเจ้าของฉันทรงดีต่อฉัน" (99-100)
  ไม่ใส่ชื่อพี่น้อง ชื่อน้องชาย จำนวนวันในบ่อ ราคาที่ขาย จำนวนปีในคุก ตอนภรรยาอัลอะซีซ
  และรายละเอียดที่ตัฟซีรเล่าจากอิสรออีลียาต (ข้อ 1.6) ไม่พูดถึงเลือดบนเสื้อ (ไม่เหมาะกับเด็ก และไม่จำเป็นต่อเรื่อง)

  ภาพไม่มีคน ไม่มีศาสดา ไม่มีหมาป่าหรือวัว (ข้อ 1.1, 1.4) ใช้ดวงดาว บ่อน้ำ รวงข้าว คลังอาหาร แทน
*/
export const YUSUF_STORY: Story = {
  slug: "yusuf",
  title: { th: "นบียูซุฟผู้อดทน", en: "Patient Prophet Yusuf" },
  cover: "/stories/yusuf/cover.webp",
  coverAlt: { th: "ท้องฟ้ายามค่ำ มีดาว 11 ดวง ดวงอาทิตย์ และดวงจันทร์ส่องแสงเหนือทุ่งข้าวสาลี", en: "A night sky with 11 stars, the sun and the moon shining over a wheat field" },
  robot: "/Character/faith.webp",
  deluxe: {
    cover: "/stories/yusuf/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      image: "/stories/yusuf/p01.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "landnight",
      alt: { th: "ท้องฟ้ายามค่ำคืน มีดาวสว่าง 11 ดวง ดวงอาทิตย์ และดวงจันทร์ เรียงอยู่ด้วยกัน", en: "A night sky with 11 bright stars, the sun and the moon together" },
      th: "นบียูซุฟ (อะลัยฮิสสลาม) เป็นลูกของนบียะอ์กูบ (อะลัยฮิสสลาม) วันหนึ่งท่านเล่าให้พ่อฟังว่า พ่อครับ ผมฝันเห็นดาว 11 ดวง ดวงอาทิตย์ และดวงจันทร์ ก้มกราบผม",
      en: "Prophet Yusuf (peace be upon him) was the son of Prophet Ya'qub (peace be upon him). One day he told his father: Father, I dreamed of eleven stars, the sun and the moon bowing down to me.",
    },
    {
      image: "/stories/yusuf/p02.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "landnight",
      alt: { th: "บ้านดินในชนบท มีตะเกียงส่องแสงอุ่นอยู่ที่หน้าต่าง", en: "A mud-brick house in the countryside, with a lantern glowing warmly in the window" },
      th: "นบียะอ์กูบบอกว่า ลูกเอ๋ย อย่าเล่าความฝันนี้ให้พี่ๆ ฟังนะ เดี๋ยวพวกเขาจะวางแผนร้ายต่อลูก",
      en: "Ya'qub said: My son, do not tell your brothers about this dream, or they may plot against you.",
    },
    {
      image: "/stories/yusuf/p03.webp",
      fx: "dust",
      ambience: "heat",
      alt: { th: "บ่อน้ำหินเก่าๆ กลางทุ่งแห้ง", en: "An old stone well in the middle of a dry field" },
      th: "พี่ๆ อิจฉานบียูซุฟ เพราะพ่อรักท่านมาก วันหนึ่งพวกเขาพาท่านออกไปข้างนอก แล้วโยนท่านลงไปในก้นบ่อน้ำ",
      en: "Yusuf's brothers were jealous because their father loved him so much. One day they took him out and threw him to the bottom of a well.",
    },
    {
      image: "/stories/yusuf/p04.webp",
      fx: "rays",
      ambience: "cave",
      alt: { th: "มองจากก้นบ่อขึ้นไปเห็นท้องฟ้า แสงสว่างส่องลงมาเป็นลำ", en: "Looking up from the bottom of the well at the sky, with a beam of light shining down" },
      th: "ในบ่อน้ำ อัลลอฮ์ทรงบอกนบียูซุฟว่า สักวันหนึ่ง เจ้าจะได้บอกพวกเขาถึงสิ่งที่พวกเขาทำในวันนี้",
      en: "In the well, Allah told Yusuf: One day you will tell them about what they did today.",
    },
    {
      image: "/stories/yusuf/p05.webp",
      fx: "night",
      moon: null,
      lamp: null,
      ambience: "landnight",
      alt: { th: "บ้านดินยามค่ำ ประตูเปิดอยู่ มีแสงตะเกียงสลัวๆ", en: "The mud-brick house at night, its door open and lit by a dim lantern" },
      th: "ตอนค่ำ พี่ๆ กลับไปหาพ่อพร้อมกับร้องไห้ บอกว่าหมาป่ากินยูซุฟไปแล้ว นบียะอ์กูบรู้ว่าไม่จริง ท่านกล่าวว่า",
      en: "That evening the brothers came back to their father, weeping, and said a wolf had eaten Yusuf. Ya'qub knew it was not true. He said:",
      meaning: { th: "การอดทนเป็นสิ่งที่ดี และอัลลอฮ์ทรงเป็นผู้ให้ความช่วยเหลือในสิ่งที่พวกเจ้ากล่าวอ้าง", en: "patience is most fitting. And Allāh is the one sought for help against that which you describe." },
    },
    {
      image: "/stories/yusuf/p06.webp",
      fx: "dust",
      ambience: "heat",
      alt: { th: "ถังน้ำไม้ผูกเชือกหย่อนลงไปในบ่อ ไกลออกไปมีเต็นท์ของกองคาราวาน", en: "A wooden bucket on a rope lowered into the well, with caravan tents in the distance" },
      th: "แล้วกองคาราวานก็ผ่านมา คนตักน้ำหย่อนถังลงไป และพบนบียูซุฟ พวกเขาพาท่านไปอียิปต์ และท่านถูกขายไปในราคาถูก",
      en: "Then a caravan passed by. Their water-drawer let down his bucket and found Yusuf. They took him to Egypt, and he was sold for a low price.",
    },
    {
      image: "/stories/yusuf/p07.webp",
      fx: "shade",
      ambience: "cave",
      alt: { th: "หน้าต่างลูกกรงเล็กๆ บนกำแพงหิน มีแสงแดดส่องเข้ามา", en: "A small barred window in a stone wall, with sunlight shining in" },
      th: "ที่อียิปต์ นบียูซุฟถูกขังในคุกหลายปี ทั้งที่ท่านไม่ได้ทำผิดเลย แต่ท่านก็ยังอดทน",
      en: "In Egypt, Yusuf was kept in prison for several years, even though he had done nothing wrong. Still, he stayed patient.",
    },
    {
      image: "/stories/yusuf/p08.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "รวงข้าวสาลีสีเขียว 7 รวง กับรวงข้าวแห้ง 7 รวง อยู่คนละฝั่ง", en: "7 green ears of wheat and 7 dry ears of wheat on opposite sides" },
      th: "วันหนึ่ง กษัตริย์ฝันเห็นวัวอ้วน 7 ตัว ถูกวัวผอม 7 ตัวกิน และรวงข้าวสีเขียว 7 รวง กับรวงข้าวแห้งอีก 7 รวง ไม่มีใครตีความได้ จึงมีคนไปถามนบียูซุฟ",
      en: "One day, the king dreamed of seven fat cows eaten by seven thin cows, and seven green ears of grain and seven dry ones. No one could explain it, so someone went to ask Yusuf.",
    },
    {
      image: "/stories/yusuf/p09.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ทุ่งข้าวสาลีสีทองกว้างใหญ่ริมแม่น้ำ", en: "A huge golden wheat field beside a river" },
      th: "นบียูซุฟอธิบายว่า จะมีปีที่ปลูกพืชได้ดี 7 ปี ให้เก็บข้าวไว้ในรวง กินแต่น้อย แล้วจะมีปีที่แห้งแล้งอีก 7 ปี",
      en: "Yusuf explained: For seven years you will farm well. Store the grain in its ears and eat only a little. Then seven hard, dry years will come.",
    },
    {
      image: "/stories/yusuf/p10.webp",
      fx: "town",
      ambience: "land",
      alt: { th: "ยุ้งฉางและคลังอาหารทำด้วยอิฐดินเรียงกันเป็นแถว มีกระสอบข้าวกองอยู่", en: "Rows of mud-brick granaries and storehouses, with sacks of grain piled up" },
      th: "กษัตริย์จึงให้นบียูซุฟดูแลคลังอาหารของแผ่นดิน เพราะท่านเป็นคนซื่อสัตย์และมีความรู้",
      en: "So the king put Yusuf in charge of the storehouses of the land, because he was trustworthy and knowledgeable.",
    },
    {
      image: "/stories/yusuf/p11.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "ประตูใหญ่ของคลังอาหาร มีกระสอบข้าวและตาชั่งวางอยู่", en: "The great door of a storehouse, with sacks of grain and a set of scales" },
      th: "เมื่อปีแห้งแล้งมาถึง พี่ๆ ของท่านเดินทางมาขออาหาร นบียูซุฟจำพวกเขาได้ แต่พวกเขาจำท่านไม่ได้ ในที่สุดท่านก็บอกว่า ฉันคือยูซุฟ พี่ๆ จึงยอมรับว่าพวกเขาทำผิด",
      en: "When the dry years came, his brothers travelled to ask for food. Yusuf knew them, but they did not know him. At last he said: I am Yusuf. His brothers admitted they had done wrong.",
    },
    {
      image: "/stories/yusuf/p12.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "แสงอาทิตย์อบอุ่นส่องผ่านซุ้มประตูโค้งในวัง", en: "Warm sunlight shining through an arched gateway in the palace" },
      th: "นบียูซุฟให้อภัยพวกเขา ท่านกล่าวว่า",
      en: "Yusuf forgave them. He said:",
      meaning: { th: "วันนี้ไม่มีการประณามพวกท่าน อัลลอฮ์จะทรงอภัยโทษพวกท่าน และพระองค์ทรงเมตตายิ่งในบรรดาผู้เมตตา", en: "No blame will there be upon you today. May Allāh forgive you; and He is the most merciful of the merciful." },
    },
    {
      image: "/stories/yusuf/p13.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "รุ่งอรุณเหนือแม่น้ำและเมืองในอียิปต์ ดวงดาวจางๆ ยังอยู่บนฟ้า", en: "Dawn over the river and a city in Egypt, with faint stars still in the sky" },
      th: "ครอบครัวทั้งหมดได้มาอยู่ด้วยกันที่อียิปต์ ความฝันของนบียูซุฟเป็นจริง ท่านกล่าวว่า พระเจ้าของฉันทรงดีต่อฉันมาก เหมือนที่ท่านเคยบอกพี่ๆ ว่า ใครยำเกรงอัลลอฮ์และอดทน อัลลอฮ์จะไม่ทำให้ความดีของเขาสูญเปล่า",
      en: "The whole family came to live together in Egypt, and Yusuf's dream came true. He said: My Lord has been so good to me. Just as he had told his brothers: whoever fears Allah and is patient, Allah never lets their good deeds go to waste.",
    },
  ],
};
