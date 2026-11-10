import type { Story } from "../../types";

/*
  วัวที่พูดได้ (วัย 3-6 ปี)
  บุคอรี 3471 จากอบูฮุร็อยเราะฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1681/5370)
  «صلى رسول الله ﷺ صلاة الصبح ثم أقبل على الناس فقال: بينا رجل يسوق بقرة إذ ركبها فضربها فقالت إنا لم نخلق لهذا إنما خلقنا للحرث
  فقال الناس سبحان الله بقرة تكلم فقال فإني أومن بهذا أنا وأبو بكر وعمر وما هما ثم ...»
  ใช้เฉพาะท่อนวัว ไม่เล่าท่อนหมาป่าคาบแกะ (เลี่ยงภาพสัตว์ล่าเหยื่อสำหรับวัยเล็ก — ตัดตอนท้าย ไม่ได้แก้ความหมาย)
  ภาพ: ไม่มีคน วัวการ์ตูนใบหน้าว่าง ทุ่งนา คันไถ
*/
export const TALKING_COW_STORY: Story = {
  evidence: ["bukhari-3471"],
  slug: "talking-cow",
  title: { th: "วัวที่พูดได้", en: "The cow that spoke" },
  cover: "/stories/talking-cow/cover.webp",
  coverAlt: { th: "วัวยืนอยู่ในทุ่งนาเขียว ข้างคันไถไม้", en: "A cow standing in a green field beside a wooden plough" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/talking-cow/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: ลานมัสยิดเรียบง่ายยามเช้าตรู่ ฟ้าเริ่มสว่าง เสื่อปูเรียง ไม่มีคน
      image: "/stories/talking-cow/p01.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "ลานเรียบง่ายยามเช้าตรู่ มีเสื่อปูเรียง", en: "A simple courtyard at early dawn, with mats laid out in rows" },
      th: "เช้าวันหนึ่ง ท่านนบี ﷺ ละหมาดศุบห์เสร็จ แล้วหันมาเล่าเรื่องให้ผู้คนฟัง",
      en: "One morning, after the Prophet ﷺ finished the Fajr prayer, he turned to the people and told them a story.",
    },
    {
      // PROMPT: ทางดินข้างทุ่ง วัวการ์ตูนใบหน้าว่าง (ไม่มีตา จมูก ปาก) เดินอยู่ เชือกผูกคอยาวไปนอกภาพ ไม่มีคน
      image: "/stories/talking-cow/p02.webp",
      fx: "dust",
      ambience: "land",
      alt: { th: "วัวเดินอยู่บนทางดินข้างทุ่ง มีเชือกผูกคอ", en: "A cow walking on a dirt road beside the fields, with a rope around its neck" },
      th: "มีชายคนหนึ่งกำลังต้อนวัวไป แล้วเขาก็ขึ้นขี่หลังวัว และตีมัน",
      en: "A man was leading a cow. Then he climbed onto its back and hit it.",
    },
    {
      // PROMPT: วัวตัวเดิม (ใบหน้าว่าง) หยุดยืน หันไปทางทุ่งนาที่มีคันไถไม้วางอยู่ แสงเรืองนุ่มรอบตัววัว ไม่มีคน
      image: "/stories/talking-cow/p03.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "วัวหยุดยืน หันไปทางทุ่งนาที่มีคันไถวางอยู่", en: "The cow standing still, turned towards a field with a plough lying in it" },
      th: "วัวพูดขึ้นว่า พวกเราไม่ได้ถูกสร้างมาเพื่อสิ่งนี้ พวกเราถูกสร้างมาเพื่อไถนา",
      en: "The cow spoke: We were not created for this. We were created for ploughing the fields.",
    },
    {
      // PROMPT: ทุ่งนากว้างไถเป็นร่องสวยงาม คันไถไม้ ท้องฟ้าสดใส ไม่มีคน ไม่มีสัตว์
      image: "/stories/talking-cow/p04.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "ทุ่งนากว้างไถเป็นร่องสวยงาม มีคันไถไม้", en: "A wide field ploughed into neat rows, with a wooden plough" },
      th: "ผู้คนที่ฟังอยู่พูดว่า ซุบหานัลลอฮ์ วัวพูดได้ด้วย!",
      en: "The people listening said: Subhanallah, a cow that speaks!",
    },
    {
      // PROMPT: วัวตัวเดิม (ใบหน้าว่าง) ยืนสงบในทุ่งนายามเย็น แสงทอง ไม่มีคน
      image: "/stories/talking-cow/p05.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "วัวยืนสงบในทุ่งนายามเย็น", en: "The cow standing calmly in the field in the evening" },
      th: "ท่านนบี ﷺ ตอบว่า ฉันศรัทธาในเรื่องนี้ อบูบักรและอุมัรก็ศรัทธาด้วย ทั้งที่ตอนนั้นทั้งสองคนไม่ได้อยู่ที่นั่น\n\nข้อคิดของเรา: เราเชื่อทุกเรื่องที่ท่านนบี ﷺ บอก และเรามาใจดีกับสัตว์ ไม่ตีมันนะ",
      en: "The Prophet ﷺ answered: I believe it, and so do Abu Bakr and Umar, even though the two of them were not there.\n\nOur lesson: We believe everything the Prophet ﷺ told us, and let's be kind to animals and never hit them.",
    },
  ],
};
