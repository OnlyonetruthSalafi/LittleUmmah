import type { Story } from "../types";

/*
 * C-9a / kids 3–6 / ร่างรอตรวจศาสนา ไม่เชื่อมเข้าระบบจริง
 * หลักฐาน: อัลก็อลัม 68:17–33; Quran.com Thai 51 / Saheeh International 20
 * ตรวจตัวบทอาหรับ: https://shamela.ws/book/8473/4241 (เฉพาะตัวอายะฮ์)
 * th/en เป็นคำเล่าสรุป; meaning เป็นท่อนตรงตัวจาก Thai 51 ไม่แก้คำสะกด
 * หน้า 8 แยกข้อคิดผู้เขียนด้วยป้ายชัดเจน ไม่ใช่ตัวบทหรือคำพูดของบุคคลในเรื่อง
 * image/cover เป็นเส้นทางที่วางแผน ยังไม่มีไฟล์ ห้ามเผยแพร่หรืออัดเสียงจากร่างนี้
 * PROMPT ทุกหน้า: 3D การ์ตูนพรีเมียม 1536×1024 หน้าคู่ เว้นกลางสันหนังสือ
 * โทนฟ้า เทอร์ควอยซ์ ขาว ทอง; ไม่มีคน สัตว์ เงาคน มือ ใบหน้า หรือหุ่นยนต์ในฉาก
 * ไม่มีตัวหนังสือ อักษรอาหรับ โลโก้ สัญลักษณ์ดนตรี; ไม่แสดงรูปลักษณ์อัลลอฮ์หรือสิ่งแทนพระองค์
 * สวนใช้พืช/ผลแบบนามธรรมไม่ระบุชนิด ไม่วาดองุ่นหรืออินทผลัมตามอีกเรื่อง
 * องค์ประกอบศิลป์ไม่ใช่ข้อเท็จจริงเพิ่มในคำเล่า; ไม่แสดงไฟ ฟ้าผ่า หรือผู้ทำลายสวน
 * REVIEW-RELIGIOUS: R1–R5 ใน report.md
 */
export const GARDEN_OWNERS_STORY: Story = {
  slug: "garden-owners",
  title: { th: "เจ้าของสวน", en: "The owners of the garden" },
  cover: "/stories/garden-owners/cover.webp",
  coverAlt: { th: "ภาพสวนและต้นไม้รูปทรงเรียบง่าย ไม่มีคนหรือสัตว์", en: "A garden with simply shaped trees, with no people or animals" },
  robot: "/Character/faith.webp",
  deluxe: {
    cover: "/stories/garden-owners/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // หน้า 1 — อัลก็อลัม 68:17–18; meaning = 68:18 ตัดเฉพาะช่องว่างท้ายข้อความ
      // REVIEW-RELIGIOUS R1: คำว่า อินชาอัลลอฮฺ อยู่ในคำแปลไทย แต่ไม่เพิ่มคำถอดเสียงอายะฮ์
      // PROMPT: สวนอุดมสมบูรณ์ มุมกว้าง เห็นต้นไม้และผลทรงเรียบง่ายไม่ระบุชนิด ใช้กฎภาพร่วมด้านบน
      image: "/stories/garden-owners/p01.webp",
      alt: { th: "สวนที่มีต้นไม้และผลรูปทรงเรียบง่าย", en: "A garden with simply shaped trees and fruit" },
      th: "เจ้าของสวนกลุ่มหนึ่งสาบานว่าจะเก็บผลไม้ในตอนเช้า แต่พวกเขาไม่ได้กล่าวสิ่งสำคัญนี้",
      en: "The owners of a garden swore to gather its fruit in the morning. But they left something important out.",
      meaning: { th: "และพวกเขามิได้กล่าวคำว่า “อินชาอัลลอฮฺ”", en: "Without making exception." },
    },
    {
      // หน้า 2 — อัลก็อลัม 68:19–20; ไม่ระบุวิธีทำลายสวนหรือเหตุการณ์กับร่างกายคน
      // REVIEW-RELIGIOUS R2: เล่าเรื่องการลงโทษอย่างนุ่มนวล แต่คงผู้ส่งการลงโทษตามคำแปล
      // PROMPT: สวนหลังถูกทำลาย เหลือพื้นโล่งและพืชล้มราบใต้แสงเช้าอ่อน ไม่มีผลให้เก็บ ไม่แสดงช่วงทำลาย ใช้กฎภาพร่วม
      image: "/stories/garden-owners/p02.webp",
      alt: { th: "พื้นสวนโล่งและพืชที่ล้มราบในแสงเช้า", en: "Bare garden ground and flattened plants in the morning light" },
      th: "ขณะที่พวกเขาหลับ การลงโทษจากอัลลอฮ์มาถึงสวน พอเช้า สวนก็ราบเรียบเหมือนถูกตัดไปแล้ว",
      en: "While they slept, a punishment from Allah came upon the garden. By morning, it was as though its plants had been cut down.",
    },
    {
      // หน้า 3 — อัลก็อลัม 68:21–25; คำเล่าทางอ้อม ไม่แต่งบทสนทนา
      // PROMPT: มองตามพื้นดินไปยังสวนยามเช้า ต้นไม้ที่เหลืออยู่ไกลๆ ไม่ใส่รอยเท้าหรือเงาบุคคล ใช้กฎภาพร่วม
      image: "/stories/garden-owners/p03.webp",
      alt: { th: "พื้นดินทอดไปสู่สวนในยามเช้า ไม่มีคนอยู่ในภาพ", en: "Ground stretching towards the garden in the morning, with no people in the picture" },
      th: "พวกเขาเรียกกันแต่เช้า แล้วออกไปเก็บผลไม้ พวกเขากระซิบกัน ไม่ยอมให้คนยากจนเข้ามาในสวน",
      en: "They called one another early and set out to gather the fruit. They whispered about keeping poor people out of the garden.",
    },
    {
      // หน้า 4 — อัลก็อลัม 68:26–27; ไม่ยืนยันว่าหลงทางจริง
      // REVIEW-RELIGIOUS R2: สรุป ถูกหวงห้ามสิทธิ์ เป็น ไม่มีผลไม้ให้เก็บ บนบริบท 68:20,26–27
      // PROMPT: มุมกว้างสวนเดิมที่โล่ง เหลือพืชล้มราบและกิ่งว่าง ภาพสงบ ไม่เพิ่มชนิดภัย ใช้กฎภาพร่วม
      image: "/stories/garden-owners/p04.webp",
      alt: { th: "สวนโล่ง มีกิ่งว่างและพืชล้มราบ ไม่มีผลไม้ให้เก็บ", en: "An empty garden with bare branches and flattened plants, with no fruit left to pick" },
      th: "เมื่อเห็นสวน พวกเขาคิดว่ามาผิดทาง แต่ไม่ใช่เลย สวนของพวกเขาไม่มีผลไม้ให้เก็บแล้ว",
      en: "When they saw the garden, they thought they had come the wrong way. But they had not. Their garden had no fruit left for them to gather.",
    },
    {
      // หน้า 5 — อัลก็อลัม 68:28–29; meaning = ท่อนคำพูดใน 68:29 ตามตัวอักษร
      // REVIEW-RELIGIOUS R1: ผู้อธรรม เป็นคำยาก คงไว้ในคำแปล; คำเล่าใช้ ยอมรับว่าทำผิด
      // PROMPT: สวนเดิมที่เสียหาย ใต้ท้องฟ้าเปิด จัดภาพนิ่งสงบ ไม่มีแสงเหนือธรรมชาติ ไม่มีสวนฟื้น ใช้กฎภาพร่วม
      image: "/stories/garden-owners/p05.webp",
      alt: { th: "สวนที่เสียหายใต้ท้องฟ้าเปิด ไม่มีคนหรือสัตว์", en: "A ruined garden under an open sky, with no people or animals" },
      th: "คนหนึ่งเตือนให้พวกเขาสดุดีอัลลอฮ์ พวกเขาจึงยอมรับว่าทำผิด และกล่าวว่า",
      en: "One of them reminded the others to glorify Allah. They admitted that they had done wrong and spoke to their Lord.",
      meaning: { th: "มหาบริสุทธิ์แห่งพระเจ้าของเรา แท้จริงเรานั้นเป็นผู้อธรรม", en: "Exalted is our Lord! Indeed, we were wrongdoers." },
    },
    {
      // หน้า 6 — อัลก็อลัม 68:30–31; สรุปความ ไม่ทำคำพูดที่แต่งขึ้นเป็นคำอ้างตรง
      // PROMPT: มองใกล้พืชที่ล้มอยู่บนพื้นสวน ภาพเรียบง่ายไม่หวาดกลัว ไม่ใส่ของใหม่แทนการทะเลาะ ใช้กฎภาพร่วม
      image: "/stories/garden-owners/p06.webp",
      alt: { th: "พืชที่ล้มอยู่บนพื้นสวนที่เสียหาย", en: "Fallen plants on the ground of the ruined garden" },
      th: "พวกเขาหันมาต่อว่ากัน แล้วก็ยอมรับว่าพวกเขาฝ่าฝืนและทำผิด",
      en: "They began blaming one another. Then they admitted that they had gone too far and done wrong.",
    },
    {
      // หน้า 7 — อัลก็อลัม 68:32; meaning = ท่อนท้ายตามตัวอักษร
      // REVIEW-RELIGIOUS R3: เป็นความหวัง ไม่ใช่การรับรองว่าได้รับสวนใหม่หรือได้รับอภัยแล้ว
      // PROMPT: สวนที่เสียหายเดิมกับท้องฟ้ากว้าง องค์ประกอบนุ่มนวล ไม่มีต้นอ่อนงอกใหม่ ไม่มีผลหรือสวนทดแทน ใช้กฎภาพร่วม
      image: "/stories/garden-owners/p07.webp",
      alt: { th: "สวนเดิมที่เสียหายใต้ท้องฟ้ากว้าง", en: "The same ruined garden under a wide sky" },
      th: "พวกเขาหวังว่าอัลลอฮ์จะประทานสิ่งที่ดีกว่าให้ และหวังในความอภัยจากพระองค์",
      en: "They hoped that Allah would give them something better, and they hoped for His forgiveness.",
      meaning: { th: "แท้จริงเราหวังในความอภัยต่อพระเจ้าของเรา", en: "Indeed, we are toward our Lord desirous." },
    },
    {
      // หน้า 8 — อัลก็อลัม 68:33 (คำเตือน); ข้อคิดผู้เขียนจาก 68:24–25,29–32 ไม่ใช่ตัวบท
      // REVIEW-RELIGIOUS R2/R3: ตรวจน้ำเสียงเรื่องโลกหน้าสำหรับวัย 3–6 และการแยกข้อคิดออกจากเหตุการณ์
      // PROMPT: ภาพสวนที่เสียหายเดิมอย่างสงบ เว้นที่ว่างกว้าง ไม่วาดปรโลก ไม่วาดสวนฟื้น ไม่ฝังข้อความ ใช้กฎภาพร่วม
      image: "/stories/garden-owners/p08.webp",
      alt: { th: "ภาพสวนที่เสียหายอย่างสงบ มีพื้นที่ว่างรอบต้นไม้", en: "A calm picture of the ruined garden, with open space around the trees" },
      th: "อัลกุรอานเตือนว่า การลงโทษในโลกหน้ายิ่งใหญ่กว่านี้\n\nข้อคิดของเรา: เมื่อตั้งใจจะทำอะไร เรากล่าวว่า อินชาอัลลอฮ์ และมาแบ่งปันให้คนที่ขาดแคลนกันนะ เมื่อทำผิด เรามายอมรับผิดและขออภัยต่ออัลลอฮ์กัน",
      en: "The Quran warns that the punishment in the Hereafter is greater.\n\nOur lesson: When we plan to do something, we say In sha Allah. Let's share with people in need. When we do wrong, let's admit it and ask Allah for forgiveness.",
    },
  ],
};
