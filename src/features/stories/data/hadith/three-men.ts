import type { Story } from "../../types";

/*
  ชายสามคนกับการทดสอบ (วัย 7 ปีขึ้นไป)
  บุคอรี 3464 จากอบูฮุร็อยเราะฮ์ (ตรวจกับ Shamela 9 พ.ย. 2026 https://shamela.ws/book/1681/5361)
  ชายสามคนในบนีอิสรออีล: أبرص (โรคผิวหนังด่างขาว) أقرع (หัวล้าน) أعمى (ตาบอด) อัลลอฮ์ส่งมะลักมาทดสอบ
  - คนแรกได้ผิวสวยและ «ناقة عشراء» คนที่สองได้ผมสวยและ «بقرة حاملا» คนที่สามได้การมองเห็นและ «شاة والدا» มะลักกล่าว «يبارك لك فيها»
    (ผู้รายงานไม่แน่ใจว่าคนแรกหรือคนที่สองขออูฐหรือวัว — ใช้ตามลำดับที่ตัวบทเล่า)
  - «فكان لهذا واد من إبل ولهذا واد من بقر ولهذا واد من الغنم»
  - มะลักกลับมา «في صورته وهيئته» = ในรูปที่ชายคนนั้นเคยเป็น (ยากจน มีโรค) ตามคำอธิบายของนักวิชาการ
  - คำตอบ «إن الحقوق كثيرة» / «لقد ورثت لكابر عن كابر» / «إن كنت كاذبا فصيرك الله إلى ما كنت»
  - คนตาบอด «فخذ ما شئت فوالله لا أجهدك اليوم بشيء أخذته لله» → «أمسك مالك فإنما ابتليتم فقد رضي الله عنك وسخط على صاحبيك»
  ภาพ: ห้ามวาดมะลัก ไม่มีคน สัตว์ใบหน้าว่าง เล่าด้วยหุบเขาเต็มไปด้วยฝูงสัตว์ ทางเดิน ไม้เท้าและย่ามของคนเดินทาง
*/
export const THREE_MEN_STORY: Story = {
  evidence: ["bukhari-3464"],
  slug: "three-men",
  title: { th: "ชายสามคนกับการทดสอบ", en: "Three men and a test" },
  cover: "/stories/three-men/cover.webp",
  coverAlt: { th: "หุบเขาสามแห่งเรียงกัน มีฝูงอูฐ ฝูงวัว และฝูงแพะ", en: "Three valleys side by side, with a herd of camels, a herd of cows and a flock of goats" },
  robot: "/Character/read.webp",
  deluxe: {
    cover: "/stories/three-men/cover-deluxe.webp",
    endpaper: "/stories/book/endpaper.webp",
    paper: "/stories/book/paper.webp",
    book: { src: "/stories/book/book-spread.webp", width: 2400, height: 1700, paper: [132, 139, 2270, 1560] },
  },
  pages: [
    {
      // PROMPT: หมู่บ้านโบราณเรียบง่ายสามหลังบนเนินเขา ประตูบ้านเล็กๆ ยามเช้า ไม่มีคน ไม่มีแสงรูปคน
      image: "/stories/three-men/p01.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "บ้านโบราณเรียบง่ายสามหลังบนเนินเขายามเช้า", en: "Three simple old houses on a hillside in the morning" },
      th: "ท่านนบี ﷺ เล่าว่า ในหมู่ชาวบนีอิสรออีล มีชายสามคน คนหนึ่งเป็นโรคผิวหนัง คนหนึ่งหัวล้าน และอีกคนตาบอด อัลลอฮ์ทรงต้องการทดสอบพวกเขา จึงส่งมะลักมาหาทั้งสามคน",
      en: "The Prophet ﷺ told us that among the Children of Israel there were three men. One had a skin disease, one was bald, and one was blind. Allah wanted to test them, so He sent an angel to them.",
    },
    {
      // PROMPT: อูฐแม่ท้องแก่ตัวหนึ่ง ใบหน้าว่าง (ไม่มีตา จมูก ปาก) ยืนหน้าบ้านหลังแรก แสงอุ่น ไม่มีคน
      image: "/stories/three-men/p02.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "แม่อูฐท้องแก่ยืนอยู่หน้าบ้านหลังแรก", en: "A pregnant mother camel standing outside the first house" },
      th: "มะลักถามชายที่เป็นโรคผิวหนังว่า ท่านอยากได้อะไรที่สุด เขาตอบว่า ผิวสวยๆ เพราะผู้คนรังเกียจฉัน มะลักลูบตัวเขา โรคก็หายไป แล้วเขาขออูฐ จึงได้แม่อูฐท้องแก่มาตัวหนึ่ง",
      en: "The angel asked the man with the skin disease: What would you love most? He said: Good skin, because people find me disgusting. The angel touched him and the disease went away. Then he asked for camels, and he was given a pregnant mother camel.",
    },
    {
      // PROMPT: แม่วัวท้องแก่ตัวหนึ่ง ใบหน้าว่าง ยืนหน้าบ้านหลังที่สอง ไม่มีคน
      image: "/stories/three-men/p03.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "แม่วัวท้องแก่ยืนอยู่หน้าบ้านหลังที่สอง", en: "A pregnant mother cow standing outside the second house" },
      th: "มะลักไปหาชายหัวล้าน เขาอยากได้ผมสวยๆ เพราะผู้คนรังเกียจเขา มะลักลูบศีรษะเขา ผมก็งอกขึ้นมา แล้วเขาขอวัว จึงได้แม่วัวท้องแก่มาตัวหนึ่ง",
      en: "The angel went to the bald man. He wanted good hair, because people found him disgusting. The angel touched his head and his hair grew. Then he asked for cows, and he was given a pregnant mother cow.",
    },
    {
      // PROMPT: แม่แพะตัวหนึ่ง ใบหน้าว่าง กับลูกแพะตัวเล็ก ยืนหน้าบ้านหลังที่สาม หน้าต่างบ้านเปิดรับแสง ไม่มีคน
      image: "/stories/three-men/p04.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "แม่แพะกับลูกแพะยืนอยู่หน้าบ้านหลังที่สาม", en: "A mother goat and her kid standing outside the third house" },
      th: "มะลักไปหาชายตาบอด เขาขอให้อัลลอฮ์คืนดวงตาให้ จะได้มองเห็นผู้คน มะลักลูบตาเขา อัลลอฮ์ก็คืนการมองเห็นให้ แล้วเขาขอแพะ จึงได้แม่แพะที่ใกล้คลอดมาตัวหนึ่ง มะลักขอพรให้ทั้งสามคนว่า ขอให้สัตว์ของท่านมีความจำเริญ",
      en: "The angel went to the blind man. He asked that Allah give him back his sight so he could see people. The angel touched his eyes, and Allah gave him back his sight. Then he asked for goats, and he was given a mother goat about to give birth. The angel prayed for each of them: May your animals be blessed.",
    },
    {
      // PROMPT: หุบเขาสามแห่งเรียงกัน หุบหนึ่งเต็มไปด้วยฝูงอูฐ หุบหนึ่งฝูงวัว หุบหนึ่งฝูงแพะ ทุกตัวใบหน้าว่าง มองจากไกล ไม่มีคน
      image: "/stories/three-men/p05.webp",
      fx: "clouds",
      ambience: "land",
      alt: { th: "หุบเขาสามแห่ง เต็มไปด้วยฝูงอูฐ ฝูงวัว และฝูงแพะ", en: "Three valleys full of camels, cows and goats" },
      th: "สัตว์เหล่านั้นออกลูกออกหลาน จนคนแรกมีอูฐเต็มหุบเขา คนที่สองมีวัวเต็มหุบเขา และคนที่สามมีแพะเต็มหุบเขา",
      en: "The animals had young, and their young had young, until the first man had a valley full of camels, the second a valley full of cows, and the third a valley full of goats.",
    },
    {
      // PROMPT: ไม้เท้าเก่ากับย่ามผ้าขาดๆ วางพิงประตูบ้านหลังใหญ่ที่หรูหรา ไกลๆ เป็นฝูงอูฐ ไม่มีคน
      image: "/stories/three-men/p06.webp",
      fx: "dust",
      ambience: "wind",
      alt: { th: "ไม้เท้าเก่ากับย่ามผ้าขาดวางพิงประตูบ้านหลังใหญ่ ไกลๆ เป็นฝูงอูฐ", en: "An old walking stick and a torn cloth bag leaning on the door of a big house, with camels in the distance" },
      th: "ต่อมา มะลักกลับไปหาชายคนแรก ในรูปคนยากจนที่เป็นโรคผิวหนัง เหมือนที่เขาเคยเป็น มะลักบอกว่า ฉันเดินทางมาไกลจนหมดหนทาง ขออูฐสักตัว ในนามของอัลลอฮ์ผู้ประทานผิวสวยและทรัพย์สินให้ท่าน แต่เขาตอบว่า ฉันมีภาระต้องจ่ายมากมาย",
      en: "Later, the angel came back to the first man, looking like a poor man with a skin disease, just as he used to be. The angel said: I have travelled far and have nothing left. Give me one camel, for the sake of Allah, who gave you good skin and wealth. But the man said: I have many expenses.",
    },
    {
      // PROMPT: ประตูบ้านหลังใหญ่ปิดสนิท ทางเดินว่างเปล่าทอดออกไป ฟ้าครึ้มเล็กน้อย ไม่มีคน
      image: "/stories/three-men/p07.webp",
      fx: "shade",
      ambience: "wind",
      alt: { th: "ประตูบ้านหลังใหญ่ปิดสนิท ทางเดินว่างเปล่าทอดออกไป", en: "The big house's door shut tight, with an empty path leading away" },
      th: "มะลักพูดว่า ฉันจำท่านได้ ท่านเคยเป็นโรคผิวหนัง คนรังเกียจ และยากจน แล้วอัลลอฮ์ก็ประทานให้ท่านไม่ใช่หรือ เขาตอบว่า ทรัพย์สินนี้ฉันได้รับสืบทอดมาจากบรรพบุรุษ มะลักพูดว่า ถ้าท่านโกหก ขออัลลอฮ์ให้ท่านกลับไปเป็นเหมือนเดิม\n\nเมื่อมะลักไปหาชายที่เคยหัวล้าน เขาก็ตอบแบบเดียวกัน มะลักจึงพูดคำเดียวกัน",
      en: "The angel said: I think I know you. Weren't you once poor, with a skin disease that people found disgusting, and then Allah gave you all this? He answered: I inherited this wealth from my ancestors. The angel said: If you are lying, may Allah return you to how you were.\n\nWhen the angel went to the man who had been bald, he answered the same way, and the angel said the same words.",
    },
    {
      // PROMPT: ประตูบ้านหลังที่สามเปิดกว้าง แสงอุ่นส่องออกมา ฝูงแพะในคอกด้านข้าง ไม้เท้ากับย่ามวางอยู่หน้าประตู ไม่มีคน
      image: "/stories/three-men/p08.webp",
      fx: "rays",
      ambience: "land",
      alt: { th: "ประตูบ้านหลังที่สามเปิดกว้าง แสงอุ่นส่องออกมา ข้างๆ มีคอกแพะ", en: "The third house's door wide open with warm light pouring out, beside a pen of goats" },
      th: "สุดท้าย มะลักไปหาชายที่เคยตาบอด ขอแพะสักตัว เขาตอบว่า ฉันเคยตาบอด อัลลอฮ์คืนการมองเห็นให้ฉัน ฉันเคยยากจน อัลลอฮ์ก็ทำให้ฉันร่ำรวย เอาไปเถิดเท่าที่ท่านต้องการ วันนี้ฉันจะไม่ขัดขวางท่านเลย ในสิ่งที่ท่านเอาไปเพื่ออัลลอฮ์",
      en: "Last, the angel went to the man who had been blind and asked for one goat. He said: I was blind and Allah gave me back my sight. I was poor and Allah made me rich. Take whatever you want. By Allah, I will not hold back anything you take today for the sake of Allah.",
    },
    {
      // PROMPT: หุบเขาเต็มไปด้วยฝูงแพะในแสงทองยามเย็น บ้านหลังที่สามสงบอบอุ่น ไม่มีคน
      image: "/stories/three-men/p09.webp",
      fx: "dawn",
      ambience: "land",
      alt: { th: "หุบเขาเต็มไปด้วยฝูงแพะในแสงทองยามเย็น", en: "A valley full of goats in golden evening light" },
      th: "มะลักพูดว่า เก็บทรัพย์สินของท่านไว้เถิด พวกท่านแค่ถูกทดสอบ อัลลอฮ์ทรงพอพระทัยท่าน และทรงกริ้วต่อเพื่อนสองคนของท่าน\n\nข้อคิดของเรา: ทุกสิ่งที่เรามี อัลลอฮ์เป็นผู้ประทานให้ เรามาขอบคุณอัลลอฮ์ และแบ่งปันให้คนที่ลำบากกันนะ",
      en: "The angel said: Keep your wealth. You were only being tested. Allah is pleased with you, and He is displeased with your two companions.\n\nOur lesson: Everything we have is a gift from Allah. Let's thank Allah and share with people in need.",
    },
  ],
};
