import type { Story } from "../types";

/*
 * C-9a / juniors 7+ / ร่างรอตรวจศาสนา ไม่เชื่อมเข้าระบบจริง
 * หลักฐาน: อัลกะฮ์ฟิ 18:32–44; Quran.com Thai 51 / Saheeh International 20
 * ตัวบทอาหรับใน Shamela: https://shamela.ws/book/8473/2567 (32–36), /2568 (37–41), /2570 (42–44)
 * ใช้เฉพาะตัวอายะฮ์ ไม่ยืมเรื่องขยายหรือหะดีษจากหน้าตัฟซีร
 * th/en เป็นคำเล่าสรุป; meaning เป็นท่อนตรงตัวจาก Thai 51 ไม่แก้คำสะกด
 * หน้า 10 เป็นข้อคิดผู้เขียน มีป้ายในข้อความ ไม่อ้างเป็นตัวบทหรือเหตุการณ์ต่อจากเรื่อง
 * image/cover เป็นเส้นทางที่วางแผน ยังไม่มีไฟล์ ห้ามเผยแพร่หรืออัดเสียงจากร่างนี้
 * PROMPT ทุกหน้า: 3D การ์ตูนพรีเมียม 1536×1024 หน้าคู่ เว้นกลางสันหนังสือ
 * โทนฟ้า เทอร์ควอยซ์ ขาว ทอง; ไม่มีคน สัตว์ เงาคน มือ ใบหน้า หรือหุ่นยนต์ในฉาก
 * ไม่มีตัวหนังสือ อักษรอาหรับ โลโก้ สัญลักษณ์ดนตรี; ไม่แสดงรูปลักษณ์อัลลอฮ์หรือสิ่งแทนพระองค์
 * องุ่น อินทผลัม พืชระหว่างสวน และลำน้ำ มีที่มา 18:32–33 (ลำน้ำอยู่ใน 18:33)
 * ไม่กำหนดชนิดพืชกลางสวน สี/ที่ตั้ง/ยุคเป็นเพียงองค์ประกอบศิลป์ ไม่อ้างเป็นประวัติศาสตร์
 * ไม่แสดงวิธีทำลายสวน ฟ้าผ่า ไฟ หรือการฟื้นสวน; คำเตือน 18:40–41 ไม่เท่ากับเหตุการณ์ใน 18:42
 * REVIEW-RELIGIOUS: R1, R3–R5 ใน report.md
 */
export const TWO_GARDENS_STORY: Story = {
  slug: "two-gardens",
  title: { th: "ชายเจ้าของสวนสองแห่ง", en: "The man with two gardens" },
  cover: "/stories/two-gardens/cover.webp",
  coverAlt: { th: "สวนองุ่นสองแห่ง มีต้นอินทผลัมล้อมรอบและลำน้ำไหลผ่าน", en: "Two vineyards surrounded by date palms, with a stream flowing through" },
  robot: "/Character/faith.webp",
  deluxe: {
    cover: "/stories/two-gardens/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // หน้า 1 — อัลกะฮ์ฟิ 18:32–33; เรียกว่าอุทาหรณ์ ไม่เติมชื่อคนหรือสถานที่
      // PROMPT: มุมกว้างเห็นสวนองุ่นสองแห่ง มีอินทผลัมล้อมรอบ พืชไม่ระบุชนิดระหว่างสวน และลำน้ำท่ามกลางสวน ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p01.webp",
      alt: { th: "สวนองุ่นสองแห่ง มีอินทผลัมล้อมรอบ พืชระหว่างสวน และลำน้ำ", en: "Two vineyards surrounded by date palms, with crops between them and a stream" },
      th: "อัลกุรอานยกอุทาหรณ์เรื่องชายสองคน อัลลอฮ์ประทานสวนองุ่นสองแห่งแก่คนหนึ่ง มีต้นอินทผลัมล้อมรอบ มีพืชระหว่างสวน และลำน้ำไหลผ่าน สวนทั้งสองให้ผลอย่างสมบูรณ์",
      en: "The Quran gives an example of two men. Allah gave one of them two gardens of grapevines, surrounded by date palms, with crops between them and a river flowing through. Both gardens produced their fruit in full.",
    },
    {
      // หน้า 2 — อัลกะฮ์ฟิ 18:34; meaning = คำพูดตรงตัว ไม่เอาคำอวดมาเป็นข้อเท็จจริงที่ผู้เล่ารับรอง
      // REVIEW-RELIGIOUS R1/R4: ข้าบริพาร เป็นคำยาก และเรื่องมีมากกว่าความภูมิใจในทรัพย์สิน
      // PROMPT: พวงองุ่นในสวนอุดมสมบูรณ์ มีต้นอินทผลัมอยู่ด้านหลัง ไม่แสดงคน ทรัพย์สินกองโตหรือจำนวนบริวาร ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p02.webp",
      alt: { th: "พวงองุ่นในสวนที่อุดมสมบูรณ์ มีต้นอินทผลัมด้านหลัง", en: "Bunches of grapes in a rich garden, with date palms behind" },
      th: "ชายเจ้าของสวนได้รับผลผลิต เขาอวดกับเพื่อนในขณะที่ทั้งสองโต้เถียงกันว่า",
      en: "The garden owner had fruit to harvest. As he argued with his companion, he boasted about having more wealth and more people on his side.",
      meaning: { th: "ฉันมีทรัพย์สินมากกว่าท่าน และมีข้าบริพารมากกว่า", en: "I am greater than you in wealth and mightier in [numbers of] men." },
    },
    {
      // หน้า 3 — อัลกะฮ์ฟิ 18:35–36; คำเล่าทางอ้อม แสดงชัดว่าเป็นความเชื่อที่ผิดของชาย ไม่ใช่คำรับรองของผู้เล่า
      // REVIEW-RELIGIOUS R4: คงการไม่เชื่อวันอวสาน ไม่ลดเรื่องเหลือเพียงลืมขอบคุณ
      // PROMPT: มองเข้าไปในสวนองุ่นที่ยังอุดมสมบูรณ์ คงฉากเดิม ไม่วาดสวนสวรรค์หรือสัญลักษณ์ความเป็นนิรันดร์ ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p03.webp",
      alt: { th: "สวนองุ่นที่ยังอุดมสมบูรณ์และมีลำน้ำไหลผ่าน", en: "A vineyard still full of fruit, with a stream flowing through" },
      th: "เขาเข้าไปในสวนโดยทำผิดต่อตัวเอง เขาคิดว่าสวนจะไม่มีวันพังพินาศ และไม่คิดว่าวันอวสานของโลกจะมาถึง เขายังคิดว่า แม้ต้องกลับไปหาพระผู้เป็นเจ้า เขาก็จะได้รับสิ่งที่ดีกว่านี้",
      en: "He entered his garden while wronging himself. He thought it would never perish and did not think the Last Hour would come. He even thought that, if he returned to his Lord, he would receive something better.",
    },
    {
      // หน้า 4 — อัลกะฮ์ฟิ 18:37; สรุปคำเตือน ไม่ยกคำถามที่แต่งขึ้น
      // REVIEW-RELIGIOUS R1/R4: ย่อรายละเอียดการสร้างเหลือพระผู้สร้างเขา ไม่เปลี่ยนลำดับหรืออ้างวิทยาศาสตร์
      // PROMPT: พื้นดินและพืชในสวนเดียวกัน มุมสงบ ไม่มีร่างกายคน อวัยวะหรือภาพกระบวนการสร้าง ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p04.webp",
      alt: { th: "พื้นดินและพืชในสวน ไม่มีคนหรือภาพร่างกาย", en: "The ground and plants of the garden, with no people or bodies" },
      th: "เพื่อนของเขาเตือนถึงอัลลอฮ์ ผู้ทรงสร้างเขา เพื่อนทักท้วงที่เขาเนรคุณต่อพระผู้สร้างของตน",
      en: "His companion reminded him of Allah, who had created him. He challenged the man's disbelief in his Creator.",
    },
    {
      // หน้า 5 — อัลกะฮ์ฟิ 18:38; meaning ยกเฉพาะท่อนแรกที่ไม่มีคำพิมพ์ผิด ผู้เป้น
      // REVIEW-RELIGIOUS R4: เคารพภักดีพระองค์เพียงผู้เดียว เป็นคำสรุปของไม่ตั้งภาคี ไม่ใช่คำแปลอ้างตรง
      // PROMPT: ใบองุ่นและต้นอินทผลัมในสวนเดิมใต้ท้องฟ้าธรรมดา ไม่ใช้ลำแสงหรือวัตถุแทนพระเจ้า ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p05.webp",
      alt: { th: "ใบองุ่นและต้นอินทผลัมใต้ท้องฟ้า", en: "Grape leaves and date palms under the sky" },
      th: "เพื่อนยืนยันว่าเขาเชื่อในอัลลอฮ์ พระผู้เป็นเจ้าของเขา และจะไม่ตั้งผู้ใดเป็นภาคีกับพระองค์",
      en: "His companion affirmed that he believed in Allah, his Lord, and would not associate anyone with Him.",
      meaning: { th: "แต่ฉันเชื่อว่าพระองค์คืออัลลอฮ์ พระผู้เป็นเจ้าของฉัน", en: "But as for me, He is Allāh, my Lord" },
    },
    {
      // หน้า 6 — อัลกะฮ์ฟิ 18:39; meaning ยกท่อนตรงตัว รวมวงเล็บและเว้นวรรคเดิม
      // REVIEW-RELIGIOUS R1: ไม่เพิ่มเสียงอ่านอาหรับของอายะฮ์ และไม่แก้วงเล็บในคำแปล
      // PROMPT: สวนองุ่น อินทผลัมและลำน้ำเดิม รายละเอียดผลไม้และน้ำชัดเจน ไม่ฝังคำกล่าวในภาพ ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p06.webp",
      alt: { th: "องุ่นและต้นอินทผลัมข้างลำน้ำในสวน", en: "Grapes and date palms beside the stream in the garden" },
      th: "เพื่อนเตือนว่า เมื่อเข้าไปในสวน เขาควรกล่าวถึงพระประสงค์และพลังจากอัลลอฮ์",
      en: "His companion reminded him that, on entering the garden, he should acknowledge Allah's will and that there is no power except through Allah.",
      meaning: { th: "สิ่งที่อัลลอฮ์ทรงประสงค์(ย่อมเกิดขึ้น) ไม่มีพลังใด ๆ(ที่จะช่วยเราได้) นอกจากที่อัลลอฮ์", en: "What Allāh willed [has occurred]; there is no power except in Allāh" },
    },
    {
      // หน้า 7 — อัลกะฮ์ฟิ 18:40–41; ทั้งหมดเป็นคำเตือนถึงสิ่งที่อาจเกิด ไม่ใช่รายงานสาเหตุจริง
      // REVIEW-RELIGIOUS R4: ไทย 51 ระบุสายฟ้า อังกฤษ 20 ใช้ penalty from the sky; ไม่เลือกชนิดภัยเป็นข้อเท็จจริง
      // PROMPT: คงสวนเดิมและลำน้ำที่ยังมีน้ำ ไม่วาดฟ้าผ่า ไม่ทำดินแห้งในฉากนี้ เพราะเป็นเพียงคำเตือน ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p07.webp",
      alt: { th: "สวนและลำน้ำที่ยังมีน้ำอยู่ ไม่มีภาพภัยพิบัติ", en: "The garden and stream, still full of water, with no disaster shown" },
      th: "เพื่อนกล่าวว่า อัลลอฮ์อาจประทานสิ่งที่ดีกว่าสวนนี้ให้แก่ตน ส่วนสวนของชายอาจถูกลงโทษจนเป็นที่โล่ง หรือน้ำอาจเหือดแห้งจนหาไม่พบ นี่เป็นคำเตือนของเพื่อน",
      en: "His companion said that Allah might give him something better than this garden. The man's garden could be struck by punishment and become bare ground, or its water could disappear beyond reach. This was his companion's warning.",
    },
    {
      // หน้า 8 — อัลกะฮ์ฟิ 18:42; ไม่ระบุว่าฟ้าผ่า น้ำแห้ง หรือใช้เวลานานเท่าใด
      // REVIEW-RELIGIOUS R1/R4: ต้นฉบับไทยมีข้อความซ้ำช่วงฝ่ามือ ใช้คำเล่าสรุปความเสียใจ; meaning ยกท้ายตรงตัว
      // PROMPT: สวนองุ่นหลังเสียหาย เถาและค้างล้มพัง ผลผลิตเสียหาย ภาพสงบ ไม่แสดงช่วงทำลายหรือสาเหตุ ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p08.webp",
      alt: { th: "สวนองุ่นที่เสียหาย เถาและค้างล้มพัง ไม่มีคนหรือสัตว์", en: "A ruined vineyard with fallen vines and broken trellises, with no people or animals" },
      th: "แล้วผลผลิตของเขาก็ถูกทำลายหมด สวนพังลง เขาเสียใจกับสิ่งที่ใช้จ่ายไป และกล่าวด้วยความเสียดายว่า",
      en: "His fruit was destroyed, and the garden collapsed. He grieved over what he had spent and regretted having associated anyone with his Lord.",
      meaning: { th: "โอ้ ! หากฉันไม่เอาผู้ใดมาตั้งภาคีกับพระผู้เป็นเจ้าของฉัน", en: "Oh, I wish I had not associated with my Lord anyone." },
    },
    {
      // หน้า 9 — อัลกะฮ์ฟิ 18:43–44; meaning = ท่อน 18:44 ตามตัวอักษร
      // REVIEW-RELIGIOUS R4: ไม่มีใครช่วยในเหตุการณ์นี้ ไม่สอนว่ามนุษย์ช่วยเหลือกันไม่ได้โดยทั่วไป
      // PROMPT: มุมกว้างของสวนที่พังเดิม ค้างองุ่นล้ม พื้นว่าง ท้องฟ้าปกติ ไม่เพิ่มผู้ช่วยหรือการฟื้นสวน ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p09.webp",
      alt: { th: "สวนเดิมที่พังลง มีค้างองุ่นล้มอยู่บนพื้น", en: "The same garden collapsed, with grape trellises lying on the ground" },
      th: "ในเหตุการณ์นี้ พรรคพวกช่วยเขาไม่ได้ และเขาก็ช่วยตัวเองไม่ได้ อัลกุรอานย้ำว่าการคุ้มครองช่วยเหลือเป็นของอัลลอฮ์",
      en: "In this situation, his people could not help him, and he could not save himself. The Quran makes clear that true protection belongs to Allah.",
      meaning: { th: "การคุ้มครองช่วยเหลือเป็นของอัลลอฮ์ผู้ทรงสัจจะ", en: "the authority is [completely] for Allāh, the Truth." },
    },
    {
      // หน้า 10 — ข้อคิดผู้เขียนจากอัลกะฮ์ฟิ 18:34,38–39,42–44 ไม่ใช่ตัวบท ไม่ใช่เหตุการณ์ใหม่
      // REVIEW-RELIGIOUS R3/R4: ไม่สรุปว่าเขากลับใจสำเร็จ ได้รับอภัย หรือได้รับสวนคืน
      // PROMPT: ภาพนิ่งของสวนที่เสียหายเดิม เว้นพื้นที่ให้พักสายตา ไม่แสดงสวนเขียวฟื้น ไม่มีต้นอ่อนหรือผลผลิตใหม่ ใช้กฎภาพร่วม
      image: "/stories/two-gardens/p10.webp",
      alt: { th: "สวนที่เสียหายเดิมในภาพนิ่งสงบ ไม่มีผลผลิตใหม่", en: "A calm picture of the ruined garden, with no new fruit" },
      th: "ข้อคิดของเรา: เมื่อมีสิ่งดี ๆ เราควรขอบคุณอัลลอฮ์ ไม่อวดว่าตนเหนือกว่าผู้อื่น เคารพภักดีพระองค์เพียงผู้เดียว และรับฟังคำเตือนที่ดีจากเพื่อน",
      en: "Our lesson: When we have good things, we should thank Allah and not boast that we are better than others. We should worship Him alone and listen to good advice from a friend.",
    },
  ],
};
