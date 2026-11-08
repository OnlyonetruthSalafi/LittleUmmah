import type { Story } from "../types";

/*
  นิทานนบียูนุสในท้องปลา (วัย 3-6 ปี)

  เนื้อหามาจากอัลกุรอานเท่านั้น
  - เป็นหนึ่งในบรรดาร่อซูล (อัศศ็อฟฟาต 139) ผู้คนไม่ยอมเชื่อ (นัยจากยูนุส 98)
  - ออกไปทั้งที่โกรธ (อัลอัมบิยาอ์ 87) หนีไปขึ้นเรือที่บรรทุกเต็มลำ (อัศศ็อฟฟาต 140)
  - จับสลากแล้วเป็นผู้แพ้ (อัศศ็อฟฟาต 141) ปลาใหญ่กลืน ขณะที่ท่านตำหนิตัวเอง (อัศศ็อฟฟาต 142)
  - วิงวอนในความมืดหลายชั้น "ลาอิลาฮะ อิลลา อันตะ ..." (อัลอัมบิยาอ์ 87)
  - อัลลอฮ์ทรงตอบรับ ช่วยให้พ้นความทุกข์ "เช่นนี้แหละ เราช่วยผู้ศรัทธาให้รอด" (อัลอัมบิยาอ์ 88)
  - ถ้าไม่ใช่ผู้ที่สรรเสริญอัลลอฮ์ จะต้องอยู่ในท้องปลาจนถึงวันฟื้นคืนชีพ (อัศศ็อฟฟาต 143-144)
  - ถูกนำออกมาบนที่โล่ง (العراء ไม่ได้ระบุว่าเป็นชายหาด ภาพวาดเป็นชายหาดเพื่อต่อกับฉากทะเล) ขณะป่วย ต้นน้ำเต้าขึ้นให้ร่มเงา (อัศศ็อฟฟาต 145-146)
  - ถูกส่งไปหาผู้คนนับแสนหรือมากกว่า พวกเขาศรัทธา แล้วได้ใช้ชีวิตต่อไป (อัศศ็อฟฟาต 147-148, ยูนุส 98)
  ไม่ใช้หะดีษ — เจ้าของโปรเจกต์อนุญาตหะดีษเศาะฮีห์เฉพาะเรื่องนบีนูห์ (2026-09-15) ยังไม่ได้ถามสำหรับเรื่องนี้
  ไม่ใส่รายละเอียดจากตัฟซีร/อิสรออีลียาต เช่น ชื่อเมือง ที่ตั้งเมือง จำนวนวันในท้องปลา เหตุผลที่ต้องจับสลาก
  หรือว่าผู้คนในหน้า 10 เป็นกลุ่มเดิม (Codex review 2026-09-28 — ตัดสิ่งที่อายะฮ์ไม่ได้ระบุออก)
  ภาพเมืองวาดไว้ริมทะเลเพื่อให้ต่อกับฉากเรือ แต่ข้อความไม่ระบุที่ตั้ง

  ภาพไม่มีคน ไม่มีศาสดา (ข้อ 1.4) ไม่มีปลาหรือสัตว์ใดๆ — ตอนปลากลืนใช้วังน้ำวนกับฟองอากาศแทน
  ข้อความอยู่ในหน้าเว็บทั้งหมด ไม่ฝังในภาพ (ข้อ 1.5)
*/
export const YUNUS_STORY: Story = {
  slug: "yunus",
  title: { th: "นบียูนุสในท้องปลา", en: "Prophet Yunus" },
  cover: "/stories/yunus/cover.webp",
  coverAlt: "เรือใบไม้ลำเล็กบนทะเลสีฟ้า มีแสงสีทองส่องขึ้นมาจากใต้น้ำ",
  robot: "/Character/faith.webp",
  // นำร่องหนังสือแบบอลังการ (4–5 ต.ค. 2026) ภาพเล่ม/กระดาษ/ปกหนังจาก Codex (docs/briefs/archive/CODEX_STORYBOOK_BRIEF.md)
  deluxe: {
    cover: "/stories/yunus/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    // กรอบหน้ากระดาษวัดจากพิกเซลภาพจริง (output/storybook-art/README.md) สันอยู่ที่ x = 1200
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      image: "/stories/yunus/p01.webp",
      fx: "clouds",
      water: [25, 52, 75, 30],
      ambience: "sea",
      alt: "บ้านสีทรายหลังคาแบนเรียงบนเนินริมทะเล ใต้ท้องฟ้าหม่น",
      th: "อัลลอฮ์ทรงส่งนบียูนุส (อะลัยฮิสสลาม) ไปหาผู้คนในเมืองหนึ่ง ท่านชวนพวกเขาให้เคารพภักดีอัลลอฮ์องค์เดียว แต่พวกเขาไม่ยอมเชื่อ",
      en: "Allah sent Prophet Yunus (peace be upon him) to the people of a town. He called them to worship Allah alone, but they would not believe.",
    },
    {
      image: "/stories/yunus/p02.webp",
      fx: "dawn",
      water: [52, 35, 48, 24],
      ambience: "sea",
      alt: "ทางเดินทอดยาวออกจากประตูเมือง มุ่งไปสู่ท่าเรือ",
      th: "นบียูนุสโกรธที่ผู้คนไม่ยอมเชื่อ ท่านจึงเดินออกจากเมืองไป",
      en: "Yunus was angry that the people would not believe, so he walked away from the town.",
    },
    {
      image: "/stories/yunus/p03.webp",
      fx: "harbor",
      water: [20, 58, 80, 40],
      ambience: "harbor",
      alt: "เรือใบไม้จอดที่ท่าเรือ บนดาดฟ้ามีลังและกระสอบวางเต็มลำ",
      th: "ท่านไปขึ้นเรือลำหนึ่ง ที่บรรทุกของไว้เต็มลำ แล้วเรือก็แล่นออกไปกลางทะเล",
      en: "He boarded a ship that was full to the top, and the ship sailed out to sea.",
    },
    {
      image: "/stories/yunus/p04.webp",
      fx: "storm",
      ambience: "storm",
      alt: "เรือใบโคลงเคลงกลางทะเลคลื่นแรง ใต้เมฆสีเทา",
      th: "กลางทะเล คนบนเรือจับสลากกัน และนบียูนุสก็เป็นผู้แพ้",
      en: "Out at sea, the people on the ship drew lots, and Yunus lost.",
    },
    {
      image: "/stories/yunus/p05.webp",
      fx: "whirl",
      // เงาปลาใหญ่ใต้วังน้ำวน กำลังโผล่ขึ้นมา
      fish: { at: [4, 64, 44], flip: true },
      ambience: "storm",
      alt: "วังน้ำวนขนาดใหญ่และฟองอากาศบนผิวทะเล ใต้น้ำมีเงาปลาตัวใหญ่ เรือใบแล่นห่างออกไป",
      th: "นบียูนุสลงไปในทะเล แล้วปลาใหญ่ตัวหนึ่งก็กลืนท่านลงไปทั้งตัว",
      en: "Yunus went into the sea, and a huge fish swallowed him whole.",
    },
    {
      image: "/stories/yunus/p06.webp",
      fx: "deep",
      // ปลาใหญ่ทั้งตัวในหน้าขวาที่มืด
      fish: { at: [54, 32, 43], deep: true },
      ambience: "underwater",
      alt: "ใต้ทะเลลึกมืดมิดหลายชั้น มีแสงสีทองดวงเล็กลอยขึ้นไปพร้อมฟองอากาศ และเงาดำของปลาตัวใหญ่ว่ายอยู่ในความมืด",
      th: "ข้างในมืดมิด มืดซ้อนกันหลายชั้น นบียูนุสรู้ตัวว่าทำผิด ท่านจึงวิงวอนขออภัยต่ออัลลอฮ์ว่า",
      en: "Inside it was dark, layer upon layer of darkness. Yunus knew he had done wrong, so he called out to Allah for forgiveness:",
      meaning: "ไม่มีพระเจ้าอื่นใดนอกจากพระองค์ท่าน มหาบริสุทธิ์แห่งพระองค์ท่าน แท้จริงข้าพระองค์เป็นผู้หนึ่งในหมู่ผู้อธรรมทั้งหลาย",
    },
    {
      image: "/stories/yunus/p07.webp",
      fx: "rays",
      ambience: "underwater",
      alt: "ลำแสงสีทองส่องลงมาจากผิวน้ำ ทะลุความมืดของทะเลลึก",
      th: "อัลลอฮ์ทรงได้ยินดุอาอ์ของท่าน และทรงช่วยท่านให้พ้นจากความทุกข์ ถ้านบียูนุสไม่ใช่คนที่ชอบกล่าวสรรเสริญอัลลอฮ์ ท่านคงต้องอยู่ในท้องปลาไปจนถึงวันกิยามะฮ์",
      en: "Allah heard his prayer and saved him from his sorrow. If Yunus had not been one who often praised Allah, he would have stayed inside the fish until the Day of Judgement.",
    },
    {
      image: "/stories/yunus/p08.webp",
      fx: "dawn",
      water: [0, 30, 100, 22],
      ambience: "shore",
      alt: "ชายหาดโล่งกว้างยามรุ่งเช้า คลื่นเล็กๆ ซัดเข้าฝั่ง",
      th: "อัลลอฮ์ทรงให้ท่านออกมาอยู่บนที่โล่งกว้าง ตอนนั้นนบียูนุสอ่อนแรงและไม่สบาย",
      en: "Allah brought him out onto wide, open land. Yunus was weak and unwell.",
    },
    {
      image: "/stories/yunus/p09.webp",
      fx: "shade",
      water: [0, 52, 45, 16],
      ambience: "shore",
      alt: "ต้นน้ำเต้าเลื้อยใบใหญ่สีเขียว แผ่ร่มเงาอยู่บนชายหาด",
      th: "อัลลอฮ์ทรงให้ต้นน้ำเต้างอกขึ้นมาเหนือตัวท่าน ใบใหญ่ๆ ของมันแผ่ร่มเงาให้ท่าน",
      en: "Allah made a gourd plant grow over him. Its big leaves spread their shade over him.",
    },
    {
      image: "/stories/yunus/p10.webp",
      fx: "town",
      water: [25, 68, 75, 28],
      ambience: "harbor",
      alt: "เมืองริมทะเลสว่างสดใสใต้แสงแดด มีสวนเขียวขจีและเรือใบเข้าเทียบท่า",
      th: "แล้วอัลลอฮ์ทรงส่งท่านไปหาผู้คนนับแสนคนหรือมากกว่านั้น พวกเขาศรัทธา อัลลอฮ์จึงให้พวกเขาได้อยู่อย่างมีความสุขต่อไป",
      en: "Then Allah sent him to a hundred thousand people or more. They believed, so Allah let them live on happily.",
    },
    {
      image: "/stories/yunus/p11.webp",
      fx: "night",
      water: [45, 60, 55, 14],
      ambience: "night",
      alt: "ตะเกียงสีทองริมหน้าต่างโค้ง มองเห็นทะเลสงบใต้แสงจันทร์เสี้ยว",
      th: "อัลลอฮ์ตรัสว่า เช่นนี้แหละ เราช่วยผู้ศรัทธาให้รอด เมื่อเราทำผิดหรือมีความทุกข์ มาวิงวอนเหมือนนบียูนุสกันนะ",
      en: "Allah says: this is how We save the believers. When we do wrong or feel sad, let's call on Allah just like Prophet Yunus!",
      meaning: "ไม่มีพระเจ้าอื่นใดนอกจากพระองค์ท่าน มหาบริสุทธิ์แห่งพระองค์ท่าน แท้จริงข้าพระองค์เป็นผู้หนึ่งในหมู่ผู้อธรรมทั้งหลาย",
    },
  ],
};
