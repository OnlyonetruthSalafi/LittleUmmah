import type { Story } from "../../types";

/*
  ไปเยี่ยมพี่น้องเพราะรักเพื่ออัลลอฮ์ (วัย 7 ปีขึ้นไป)
  **ที่มา:** มุสลิม 2567 จากอบูฮุร็อยเราะฮ์ — https://shamela.ws/book/1727/6484
  > «أن رجلا زار أخا له في قرية أخرى. فأرصد الله له، على مدرجته، ملكا ... هل لك عليه من نعمة تربها؟ قال: لا. غير أني أحببته في الله عز وجل. قال: فإني رسول الله إليك، بأن الله قد أحبك كما أحببته فيه»
  ภาพห้ามวาดมะลัก เล่าเรื่องด้วยเส้นทาง หมู่บ้าน และแสงแทน
  - หน้า p04: «نعمة تربها» แปลว่า "บุญคุณที่ท่านจะไปดูแลหรือตอบแทน" ตามเชิงอรรถใน Shamela «تقوم بإصلاحها»
  สถานะ: Claude ตรวจตัวบทกับ Shamela 10 พ.ย. 2026; เล่มนี้ยังไม่พร้อมเปิด
  กฎภาพร่วม: 3D การ์ตูนพรีเมียม โทนฟ้า เทอร์ควอยซ์ ขาว ทอง เว้นกลางสันหนังสือ
  ไม่มีคน เงาคน มือ เท้า หรือรอยเท้าคน ห้ามวาดนบี เศาะหาบะฮ์ และมะลักทุกกรณี
  สัตว์ทุกตัวใบหน้าว่าง ไม่มีตา จมูก ปาก คิ้ว ขนตา แก้มแดง หรือส่วนที่ทำหน้าที่เป็นใบหน้า
  ไม่มีตัวหนังสือ โลโก้ หรือสัญลักษณ์ดนตรี; อูฐไม่วาดน้ำตาหรืออวัยวะใบหน้า
  alt และชื่ออังกฤษ Codex ร่างจาก PROMPT แล้ว Claude ตัดข้อกำหนดภาพออกและตรวจรับ 10 พ.ย. 2026 — ปรับให้ตรงภาพจริงเมื่อทำภาพ
*/
export const VISIT_BROTHER_STORY: Story = {
  evidence: ["muslim-2567"],
  slug: "visit-brother",
  title: { th: "ไปเยี่ยมพี่น้องเพราะรักเพื่ออัลลอฮ์", en: "Visiting a brother for the sake of Allah" },
  cover: "/stories/visit-brother/cover.webp",
  coverAlt: { th: "ทางดินทอดจากหมู่บ้านหนึ่งไปยังอีกหมู่บ้านไกลๆ", en: "A dirt path leading from one village towards another in the distance" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/visit-brother/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ทางดินทอดจากหมู่บ้านหนึ่งไปยังอีกหมู่บ้านไกลๆ ไม่มีคน
      image: "/stories/visit-brother/p01.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "ทางดินทอดจากหมู่บ้านหนึ่งไปยังอีกหมู่บ้านไกลๆ", en: "A dirt path leading from one village towards another in the distance" },
      th: "ท่านนบี ﷺ เล่าว่า มีชายคนหนึ่งออกเดินทาง เพื่อไปเยี่ยมพี่น้องของเขาที่อยู่อีกหมู่บ้านหนึ่ง",
      en: "The Prophet ﷺ told of a man who set out to visit his brother in another village.",
    },
    {
      // PROMPT: ทางเดินโค้งผ่านเนินเขา มีแสงนุ่มส่องลงมาบนทาง
      image: "/stories/visit-brother/p02.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ทางเดินโค้งผ่านเนินเขา มีแสงนุ่มส่องลงมาบนทาง", en: "A winding path through hills with soft light falling on it" },
      th: "อัลลอฮ์ทรงส่งมะลักองค์หนึ่งมารอเขาอยู่บนเส้นทาง",
      en: "Allah sent an angel to wait for him on his path.",
    },
    {
      // PROMPT: ทางแยกพร้อมป้ายไม้ไม่มีตัวหนังสือ ชี้ไปทางหมู่บ้าน
      image: "/stories/visit-brother/p03.webp",
      fx: "town",
      ambience: "land",
      alt: { th: "ทางแยกพร้อมป้ายไม้ ชี้ไปทางหมู่บ้าน", en: "A crossroads with an wooden sign pointing towards a village" },
      th: "เมื่อเขาเดินมาถึง มะลักถามว่า \"ท่านจะไปไหน\" เขาตอบว่า \"ฉันจะไปเยี่ยมพี่น้องของฉันในหมู่บ้านนี้\"",
      en: "When he arrived, the angel asked, \"Where are you going?\" He said, \"I want to visit my brother in this village.\"",
    },
    {
      // PROMPT: ตะกร้าของฝากที่ว่างเปล่าวางข้างทาง
      image: "/stories/visit-brother/p04.webp",
      fx: "shade",
      ambience: "land",
      alt: { th: "ตะกร้าของฝากที่ว่างเปล่าวางข้างทาง", en: "An empty gift basket beside the path" },
      th: "มะลักถามว่า \"เขาเคยทำบุญคุณอะไรให้ท่าน แล้วท่านจะไปตอบแทนเขาหรือ\" ชายคนนั้นตอบว่า \"เปล่าเลย ฉันแค่รักเขาเพื่ออัลลอฮ์\"",
      en: "The angel asked, \"Has he done you a favour that you are going to repay?\" The man said, \"No. I simply love him for the sake of Allah.\"",
    },
    {
      // PROMPT: หมู่บ้านใต้ท้องฟ้าสว่างไสว แสงทองส่องลงมา
      image: "/stories/visit-brother/p05.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "หมู่บ้านใต้ท้องฟ้าสว่างไสว แสงทองส่องลงมา", en: "A village beneath a bright sky with golden light" },
      th: "มะลักบอกว่า \"ฉันเป็นผู้ที่อัลลอฮ์ส่งมาบอกท่านว่า อัลลอฮ์ทรงรักท่าน เหมือนที่ท่านรักพี่น้องของท่านเพื่อพระองค์\"",
      en: "The angel said, \"I am a messenger from Allah to tell you that Allah loves you, just as you love your brother for His sake.\"",
    },
    {
      // PROMPT: ประตูบ้านสองหลังที่เปิดเข้าหากัน มีถ้วยน้ำชาสองใบบนเสื่อ
      image: "/stories/visit-brother/p06.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ประตูบ้านสองหลังที่เปิดเข้าหากัน มีถ้วยน้ำชาสองใบบนเสื่อ", en: "Two open house doors facing each other with two teacups on a mat" },
      th: "ข้อคิดของเรา: เรามารักเพื่อนและพี่น้องเพื่ออัลลอฮ์ ไปเยี่ยมกัน โดยไม่หวังสิ่งตอบแทนกันนะ",
      en: "Our lesson: Let's love our friends and family for the sake of Allah, and visit one another without expecting anything in return.",
    },
  ],
};
