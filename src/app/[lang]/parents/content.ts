import type { Text } from "@/i18n/config";

/*
  เนื้อหาหน้าผู้ปกครอง ทุกภาษาอยู่คู่กันที่นี่ (ไม่ใช้ dictionary กลาง เพราะเป็นบทความยาวและมีตัวบทศาสนา)

  - ข้อความเขียนเฉพาะสิ่งที่เว็บทำจริงตอนนี้ ห้ามเขียนสัญญาสิ่งที่ยังไม่มี
  - คำแปลตัวบท (tr) แปลตามตัวบท ห้ามเติมความเห็นลงในคำแปล
    คำแปลอังกฤษ Claude แปลจากตัวบทอาหรับเทียบกับคำแปลไทย (16 ต.ค. 2026) — รอเจ้าของโปรเจกต์ตรวจ
  - ถ้าแก้ตัวบทหรือแหล่งอ้างอิง ต้องเปิดหน้า Shamela ตรวจทุกครั้ง และแก้ AGENTS.md ข้อ 1.1 ให้ตรงกัน
*/

export type Section = { title: Text; body: Text[] };

export const SECTIONS: Section[] = [
  {
    title: { th: "Little Ummah คืออะไร", en: "What is Little Ummah?" },
    body: [
      {
        th: "เว็บไซต์เรียนรู้อิสลามสำหรับเด็ก แบ่งเป็นหกเกาะ: ภาษาอาหรับเบื้องต้น มารยาทและศีลธรรม เรื่องเล่า สำรวจโลก เกม และศิลปะ",
        en: "An Islamic learning website for children, divided into six islands: Basic Arabic, Manners & Morals, Stories, Explore, Games, and Art.",
      },
      {
        th: "ทุกเกาะมีเนื้อหาแยกสองช่วงวัย คือ 3-6 ปี (เรียนรู้ผ่านการเล่น ประโยคสั้น) และ 7 ปีขึ้นไป (อ่านเองได้ มีรายละเอียดมากขึ้น)",
        en: "Every island has content for two age groups: 3–6 (learning through play, short sentences) and 7+ (reading on their own, with more detail).",
      },
    ],
  },
  {
    title: { th: "แนวทางเนื้อหา", en: "Our content guidelines" },
    body: [
      {
        th: "ไม่มีภาพใบหน้าของคนหรือสัตว์ ตัวละครนำทางเป็นหุ่นยนต์ และภาพประกอบส่วนใหญ่เป็นสิ่งของหรือธรรมชาติ ถ้ามีคนหรือสัตว์ในภาพ ใบหน้าจะว่างเปล่า ไม่มีตา จมูก ปาก (ดูหลักฐานในหัวข้อถัดไป)",
        en: "There are no pictures of human or animal faces. Our guide character is a robot, and most illustrations show objects or nature. If a person or animal appears, the face is left blank, with no eyes, nose or mouth (see the evidence in the next section).",
      },
      {
        th: "ภาพถ่ายจริงใช้เฉพาะภาพสัตว์บนเกาะสำรวจโลก ในช่วงที่หุ่นยนต์สอนว่า “นี่คือสัตว์จริงๆ” เพื่อให้เด็กรู้จักสิ่งที่อัลลอฮ์ทรงสร้าง ไม่มีภาพถ่ายคน และไม่ใช้ภาพถ่ายเป็นภาพตกแต่ง (ดูหลักฐานในหัวข้อถัดไป)",
        en: "Real photographs are used only for animals on Explore Island, at the moment the robot teaches “this is the real animal”, so children come to know what Allah has created. There are no photos of people, and photos are never used as decoration (see the evidence in the next section).",
      },
      {
        th: "ไม่มีเสียงดนตรีหรือเพลงบรรเลง เสียงในเว็บมีเฉพาะเสียงพูด และเสียงประกอบสั้นๆ เช่น เสียงกดปุ่ม เสียงพลิกหน้าหนังสือ เสียงคลื่นและเสียงฝนในนิทาน",
        en: "There is no music or instrumental sound. The only sounds are speech and short sound effects, such as button taps, page turns, and waves and rain in the stories.",
      },
      {
        th: "เรื่องเล่าใช้เนื้อหาจากอัลกุรอาน และไม่วาดภาพศาสดาหรือเศาะหาบะฮ์",
        en: "The stories come from the Quran, and we never draw the Prophets or the Companions.",
      },
    ],
  },
  {
    title: { th: "เสียงอ่าน", en: "Read-aloud voice" },
    body: [
      {
        th: "เด็กที่ยังอ่านไม่ออกกดปุ่ม “ฟัง” หรือแตะเกาะเพื่อฟังเสียงอ่านได้ ปิดเสียงได้ที่ปุ่ม “เสียง” มุมบนขวา",
        en: "Children who cannot read yet can tap “Listen” or tap an island to hear it read aloud. Turn the sound off with the “Sound” button at the top right.",
      },
      {
        th: "เสียงส่วนใหญ่เป็นเสียงพากย์ที่อัดไว้แล้ว เสียงหุ่นยนต์นูรีสร้างด้วยโปรแกรมสังเคราะห์เสียง (AI) ข้อความที่ยังไม่มีเสียงอัดจะใช้เสียงสังเคราะห์ภาษาไทยของเครื่อง ถ้าไม่ได้ยินเสียง ให้ตรวจว่าอุปกรณ์ติดตั้งเสียงภาษาไทยไว้แล้ว",
        en: "Most audio is pre-recorded narration. The voice of Nuri the robot is made with speech-synthesis software (AI). Text without a recording uses your device's built-in English synthetic voice. If you hear nothing, check that an English voice is installed on the device.",
      },
      {
        th: "คำภาษาอาหรับแสดงคำอ่านภาษาไทยกำกับไว้ เพราะเสียงสังเคราะห์อ่านอักษรอาหรับไม่ได้ ควรฝึกออกเสียงไปพร้อมกับลูก",
        en: "Arabic words come with a reading guide, because synthetic voices cannot read Arabic script. Practise the pronunciation together with your child.",
      },
    ],
  },
  {
    title: { th: "ข้อมูลส่วนตัว", en: "Privacy" },
    body: [
      {
        th: "เว็บนี้ใช้ฟรี ไม่มีโฆษณา ไม่มีการสมัครสมาชิก ไม่มีคุกกี้ และไม่มีระบบติดตามพฤติกรรม (analytics) ข้อมูลของเด็กไม่ถูกส่งออกจากเครื่อง",
        en: "This website is free, with no ads, no sign-up, no cookies and no behaviour tracking (analytics). Your child's data never leaves this device.",
      },
      {
        th: "สิ่งที่เว็บจำไว้ในเบราว์เซอร์ของเครื่องนี้มีเท่านี้: การตั้งค่าเปิด/ปิดเสียง, ดาวจากการฝึกบนเกาะมารยาทและเกาะสำรวจโลก (วันที่ฝึก), ด่านเกมที่ผ่านแล้วพร้อมดาวและเวลาที่เล่นล่าสุด และสถานะ “ฟังคำแนะนำของหุ่นยนต์แล้ว” ซึ่งหายเองเมื่อปิดเบราว์เซอร์",
        en: "The only things this website remembers in this device's browser are: the sound on/off setting, stars from practice on Manners Island and Explore Island (practice dates), game levels passed with their stars and the last time played, and the “robot guide already heard” status, which clears itself when the browser is closed.",
      },
      {
        th: "เมื่อเปิดเว็บ ผู้ให้บริการเซิร์ฟเวอร์อาจบันทึกข้อมูลทางเทคนิคตามปกติของเว็บไซต์ทั่วไป เช่น หมายเลข IP และเวลาที่เข้าใช้ เว็บนี้ไม่ได้นำข้อมูลนั้นมาใช้ระบุตัวเด็ก",
        en: "When you open the website, the server provider may log routine technical data, as on any website, such as your IP address and the time of access. This website does not use that data to identify children.",
      },
    ],
  },
  {
    title: { th: "คำแนะนำ", en: "Tips" },
    body: [
      {
        th: "นั่งเรียนไปพร้อมกับลูก ถามคำถามและชวนคุยต่อจากเนื้อหาในแต่ละการ์ด",
        en: "Sit and learn together with your child. Ask questions and keep the conversation going from each card.",
      },
      {
        th: "กิจกรรมในเกาะศิลปะทำบนกระดาษจริงได้ ช่วยพักสายตาจากหน้าจอ",
        en: "The Art Island activities can be done on real paper, giving the eyes a rest from the screen.",
      },
    ],
  },
];

/* ข้อความประกอบของหน้า */
export const UI = {
  title: { th: "สำหรับผู้ปกครอง", en: "For parents" },
  source: { th: "ที่มา:", en: "Source:" },
  openShamela: { th: "เปิดใน Shamela", en: "Open in Shamela" },
  newTab: { th: " (เปิดในแท็บใหม่)", en: " (opens in a new tab)" },
  fatwaHeading: { th: "หลักฐานเรื่องภาพคนและสัตว์ที่ไม่มีใบหน้า", en: "Evidence on pictures of people and animals without faces" },
  fatwaIntro: {
    th: "เว็บนี้ใช้หุ่นยนต์และสิ่งของเป็นหลัก การ์ตูนบทเรียนบนเกาะมารยาทใช้ตัวละครหุ่นยนต์ทั้งหมด ไม่มีภาพคน ถ้าจำเป็นต้องมีคนหรือสัตว์ในภาพการ์ตูน ใบหน้าจะว่างเปล่าหรือหันหลังให้คนดู ไม่มีตา จมูก ปาก และไม่มีสิ่งที่ทำให้เป็นใบหน้า เช่น คิ้วหรือแก้มแดง ตามหลักฐานด้านล่าง ส่วนศาสดาและเศาะหาบะฮ์ไม่วาดในทุกกรณี",
    en: "This website mainly uses robots and objects. The lesson cartoons on Manners Island use only robot characters, with no people. If a person or animal must appear in a cartoon, the face is left blank or turned away from the viewer: no eyes, nose or mouth, and nothing that makes it a face, such as eyebrows or rosy cheeks, according to the evidence below. The Prophets and Companions are never drawn in any case.",
  },
  fromSahaba: { th: "จากเศาะหาบะฮ์", en: "From the Companions" },
  fromUlama: { th: "ฟัตวาของอุละมาอ์", en: "Fatwas of the scholars" },
  note: { th: "หมายเหตุ:", en: "Note:" },
  albaniNote: {
    th: "ชัยค์มุฮัมมัด นาศิรุดดีน อัลบานีย์ มีทัศนะที่เคร่งกว่า ท่านเห็นว่ารูปที่พิมพ์บนกระดาษต้องเอาศีรษะออกทั้งหมด การลบเฉพาะใบหน้ายังไม่พอ (อัสสิลสิละฮ์ อัศเศาะฮีหะฮ์ 4/554)",
    en: "Shaykh Muhammad Nasir al-Din al-Albani held a stricter view: a picture printed on paper must have the whole head removed, and erasing only the face is not enough (al-Silsilah al-Sahihah 4/554).",
  },
  albaniFollow: {
    th: "เว็บนี้ยึดทัศนะของชัยค์อิบนุ อุษัยมีน ชัยค์อิบนุ ญิบรีน และชัยค์อัรรอญิฮีย์ข้างต้น",
    en: "This website follows the view of Shaykh Ibn Uthaymin, Shaykh Ibn Jibrin and Shaykh al-Rajihi above.",
  },
  photoHeading: { th: "ภาพถ่ายสัตว์จริงบนเกาะสำรวจโลก", en: "Real animal photos on Explore Island" },
  photoIntro: {
    th: "บนเกาะสำรวจโลก หลังจากหุ่นยนต์เล่าเรื่องสัตว์ด้วยภาพการ์ตูนใบหน้าว่าง จะมีภาพถ่ายสัตว์ตัวจริงให้ดูว่า “นี่คือสัตว์จริงๆ” ใช้เพื่อการสอนเท่านั้น ไม่ใช้ภาพถ่ายบนการ์ดหรือเป็นภาพตกแต่ง ไม่มีภาพถ่ายคน และใช้เฉพาะภาพสาธารณสมบัติหรือ CC0 ที่ใช้ได้อย่างเสรี พร้อมระบุชื่อผู้ถ่าย",
    en: "On Explore Island, after the robot tells about an animal with blank-faced cartoon pictures, a photo of the real animal is shown: “this is the real animal”. Photos are used only for teaching, never on cards or as decoration. There are no photos of people, and we use only public-domain or CC0 images that are free to use, with the photographer credited.",
  },
  lajnahNote: {
    th: "อัลเลาะญ์นะฮ์ อัดดาอิมะฮ์ (ฟัตวาที่ 4513) เห็นว่าภาพถ่ายสิ่งมีชีวิตไม่อนุญาต นอกจากกรณีจำเป็น เช่น บัตรประจำตัวและหนังสือเดินทาง",
    en: "The Permanent Committee (al-Lajnah al-Da'imah, fatwa 4513) held that photographs of living beings are not permitted except in cases of necessity, such as ID cards and passports.",
  },
  lajnahFollow: { th: "เว็บนี้ยึดทัศนะของชัยค์อิบนุ อุษัยมีนข้างต้น", en: "This website follows the view of Shaykh Ibn Uthaymin above." },
  ages: { th: "ไปยังช่วงวัย", en: "Go to an age group" },
  kids: { th: "วัย 3-6 ปี", en: "Ages 3–6" },
  juniors: { th: "วัย 7 ปีขึ้นไป", en: "Ages 7+" },
  clear: { th: "ล้างความคืบหน้าในเครื่องนี้", en: "Clear progress on this device" },
  clearConfirm: { th: "กดอีกครั้งเพื่อยืนยันการล้าง", en: "Tap again to confirm" },
  clearWarn: { th: "ดาวและด่านที่ผ่านแล้วจะหายไป เริ่มใหม่ได้ทุกเมื่อ", en: "Stars and passed levels will be removed. You can start again any time." },
} satisfies Record<string, Text>;

/*
  หลักฐานเรื่องภาพสิ่งมีชีวิตที่ไม่มีใบหน้า (AGENTS.md ข้อ 1.1)
  ตัวบททุกชิ้นเปิดตรวจกับต้นฉบับใน Shamela แล้ว (1 ต.ค. 2026) ใส่เฉพาะหลักฐานที่ถูกต้อง
  - ไม่ใช้รายงาน «ولا صورة إلا لطخها» ในมุสนัดอะห์มัด เพราะอัลบานีย์ตัดสินว่าเฎาะอีฟ (เฆาะยะตุลมะรอม 144)
*/
export type Evidence = { arabic: string; tr: Text; source: Text; href: string };

export const SAHABA: Evidence[] = [
  {
    arabic:
      "قَالَ لِي عَلِيُّ بْنُ أَبِي طَالِبٍ: أَلَا أَبْعَثُكَ عَلَى مَا بَعَثَنِي عَلَيْهِ رَسُولُ اللَّهِ ﷺ؟ أَنْ لَا تَدَعَ تِمْثَالًا إِلَّا طَمَسْتَهُ، وَلَا قَبْرًا مُشْرِفًا إِلَّا سَوَّيْتَهُ",
    tr: {
      th: "ท่านอะลีย์ อิบนุ อบีฏอลิบ กล่าวกับฉันว่า ฉันจะส่งท่านไปทำงานเดียวกับที่ท่านเราะสูลุลลอฮ์ ﷺ ส่งฉันไปไหม คือ อย่าปล่อยรูปปั้นใดไว้ นอกจากท่านจะลบมันเสีย และอย่าปล่อยหลุมศพที่ก่อสูงไว้ นอกจากท่านจะปรับให้เรียบ",
      en: "Ali ibn Abi Talib said to me: Shall I not send you on what the Messenger of Allah ﷺ sent me on? That you leave no statue without effacing it, and no raised grave without levelling it.",
    },
    source: {
      th: "เศาะฮีห์มุสลิม หะดีษที่ 969 (รายงานโดยอบุลฮัยยาจ อัลอะสะดีย์)",
      en: "Sahih Muslim, hadith 969 (narrated by Abu al-Hayyaj al-Asadi)",
    },
    href: "https://shamela.ws/book/1727/2175",
  },
  {
    arabic: "وَلَا صُورَةً إِلَّا طَمَسْتَهَا",
    tr: { th: "และอย่าปล่อยรูปภาพใดไว้ นอกจากท่านจะลบมันเสีย", en: "And leave no image without effacing it." },
    source: {
      th: "เศาะฮีห์มุสลิม หะดีษเดียวกัน สายรายงานของยะห์ยา อัลก็อฏฏอน — อุละมาอ์อธิบายว่า «ลบ» ในที่นี้คือลบใบหน้า (ดูคำอธิบายของชัยค์อิบนุ ญิบรีนด้านล่าง)",
      en: "Sahih Muslim, the same hadith, in the chain of Yahya al-Qattan — scholars explain that «effacing» here means effacing the face (see Shaykh Ibn Jibrin's explanation below)",
    },
    href: "https://shamela.ws/book/1727/2176",
  },
  {
    arabic: "الصورة الرأس، فإذا قطع الرأس فليس بصورة",
    tr: {
      th: "รูปนั้นคือศีรษะ เมื่อศีรษะถูกตัดออกไปแล้ว ก็ไม่ถือเป็นรูป",
      en: "The image is the head; when the head is cut off, it is no longer an image.",
    },
    source: {
      th: "คำพูดของท่านอิบนุ อับบาส (ร.ฎ.) รายงานโดยอัลบัยฮะกีย์ (14974) สายรายงานเศาะฮีห์ — สายที่รายงานเป็นคำของท่านนบี ﷺ อัลบานีย์ตัดสินว่าเศาะฮีห์ ใน อัสสิลสิละฮ์ อัศเศาะฮีหะฮ์ (1921)",
      en: "Saying of Ibn Abbas (may Allah be pleased with him), reported by al-Bayhaqi (14974) with an authentic chain — the chain attributing it to the Prophet ﷺ was graded authentic by al-Albani in al-Silsilah al-Sahihah (1921)",
    },
    href: "https://shamela.ws/book/17128/234",
  },
  {
    arabic: "إِنْ أَبَيْتَ إِلَّا أَنْ تَصْنَعَ، فَعَلَيْكَ بِهَذَا الشَّجَرِ، كُلِّ شَيْءٍ لَيْسَ فِيهِ رُوحٌ",
    tr: {
      th: "ถ้าท่านยังจะทำ (รูป) ต่อไป ก็จงทำรูปต้นไม้ และทุกสิ่งที่ไม่มีวิญญาณ",
      en: "If you insist on making (images), then make these trees, and everything that has no soul.",
    },
    source: {
      th: "ฟัตวาของท่านอิบนุ อับบาส (ร.ฎ.) แก่ชายที่เลี้ยงชีพด้วยการทำรูปภาพ เศาะฮีห์บุคอรี หะดีษที่ 2225 — เว็บนี้จึงเลือกวาดสิ่งของและธรรมชาติก่อนเสมอ",
      en: "Fatwa of Ibn Abbas (may Allah be pleased with him) to a man who earned his living making images, Sahih al-Bukhari, hadith 2225 — so this website always prefers to draw objects and nature",
    },
    href: "https://shamela.ws/book/1681/3534",
  },
  {
    arabic: "أَمَا عَلِمْتَ أَنَّ الصُّورَةَ مُحَرَّمَةٌ",
    tr: {
      th: "ท่านไม่รู้หรือว่า «อัศศูเราะฮ์» (ใบหน้า) นั้นเป็นที่ต้องห้าม (ห้ามทำร้าย)",
      en: "Do you not know that «al-ṣūrah» (the face) is inviolable (must not be struck)?",
    },
    source: {
      th: "ท่านสุวัยด์ อิบนุ มุก็อรริน (ร.ฎ.) กล่าวกับคนที่ตบหน้าทาสหญิงของท่าน เศาะฮีห์มุสลิม หะดีษที่ 1658 — แสดงว่าคำว่า «รูป» ในภาษาของเศาะหาบะฮ์หมายถึงใบหน้า",
      en: "Suwayd ibn Muqarrin (may Allah be pleased with him) said this to a man who slapped his slave girl's face, Sahih Muslim, hadith 1658 — showing that «ṣūrah» (image) in the Companions' language meant the face",
    },
    href: "https://shamela.ws/book/711/5102",
  },
];

export const ULAMA: Evidence[] = [
  {
    arabic:
      "إذا لم تكن الصورة واضحة أي ليس فيها عين ولا أنف ولا فم ولا أصابع فهذه ليست صورة كاملة ولا مضاهية لخلق الله عز وجل",
    tr: {
      th: "หากรูปนั้นไม่ชัดเจน คือไม่มีตา ไม่มีจมูก ไม่มีปาก และไม่มีนิ้ว รูปนั้นก็ไม่ใช่รูปที่สมบูรณ์ และไม่ใช่การเลียนแบบการสร้างของอัลลอฮ์ ผู้ทรงเกียรติและสูงส่ง",
      en: "If the image is not clear, that is, it has no eyes, no nose, no mouth and no fingers, then it is not a complete image, nor does it imitate the creation of Allah, the Mighty and Majestic.",
    },
    source: {
      th: "ชัยค์มุฮัมมัด อิบนุ ศอลิห์ อัลอุษัยมีน, หนังสือ มัจญ์มูอะฮ์ อัสอิละฮ์ ตุฮิมมุ อัลอุสเราะฮ์ อัลมุสลิมะฮ์ (ประมวลคำถามที่สำคัญต่อครอบครัวมุสลิม) หมวดคำถามเรื่องของเล่นเด็ก หน้า 138",
      en: "Shaykh Muhammad ibn Salih al-Uthaymin, Majmu'at As'ilah Tuhimm al-Usrah al-Muslimah (Questions Important to the Muslim Family), section on children's toys, p. 138",
    },
    href: "https://shamela.ws/book/11377/178",
  },
  {
    arabic:
      "أما مسألة القطن والذي ما تبين له صورة رغم ما هنالك من أعضاء ورأس ورقبة ولكن ليس فيه عيون وأنف فما فيه بأس، لأن هذا لا يضاهي لخلق الله",
    tr: {
      th: "ส่วนตุ๊กตาผ้าฝ้ายที่มองไม่ออกว่าเป็นรูป แม้จะมีแขนขา ศีรษะ และคอ แต่ไม่มีตาและจมูก ก็ไม่เป็นไร เพราะสิ่งนี้ไม่ใช่การเลียนแบบการสร้างของอัลลอฮ์",
      en: "As for the cotton doll in which no image is apparent, even though it has limbs, a head and a neck, but no eyes or nose, there is nothing wrong with it, because it does not imitate the creation of Allah.",
    },
    source: { th: "ชัยค์อิบนุ อุษัยมีน, เล่มเดียวกัน หน้า 137", en: "Shaykh Ibn Uthaymin, the same book, p. 137" },
    href: "https://shamela.ws/book/11377/177",
  },
  {
    arabic:
      "إذا طمس الوجه من الصورة فقد حصل المقصود، لأن الصورة حقيقة لا تكون إلا بالوجه، والوجه هو الرأس، فإذا طمسه فلا حرج",
    tr: {
      th: "ถ้าลบใบหน้าออกจากรูปแล้ว ก็บรรลุจุดประสงค์ เพราะความเป็นรูปจริงๆ อยู่ที่ใบหน้า และใบหน้าก็คือศีรษะ เมื่อลบมันแล้วก็ไม่มีปัญหา",
      en: "If the face is effaced from the image, the purpose is achieved, because an image in reality exists only through the face, and the face is the head; so once it is effaced, there is no harm.",
    },
    source: {
      th: "ชัยค์อิบนุ อุษัยมีน, มัจญ์มูอ์ ฟะตาวา วะเราะซาอิล อัลอุษัยมีน เล่ม 12 หน้า 359",
      en: "Shaykh Ibn Uthaymin, Majmu' Fatawa wa Rasa'il al-Uthaymin, vol. 12, p. 359",
    },
    href: "https://shamela.ws/book/12293/4642",
  },
  {
    arabic: "وإذا قدر أنها وجدت فليست بصورة، يعني: هذه مثل الظل، مثل إنسان يمشي في الشمس يكون له ظل",
    tr: {
      th: "ถ้าสมมติว่ามี (รูปคนที่ถ่ายจากด้านหลัง) ขึ้นมา มันก็ไม่ใช่รูป (ที่ห้าม) หมายความว่ามันเหมือนเงา เหมือนคนเดินกลางแดดแล้วมีเงา",
      en: "And if we suppose it (a picture of a person taken from behind) exists, it is not an (prohibited) image; that is, it is like a shadow, like a person walking in the sun who casts a shadow.",
    },
    source: {
      th: "ชัยค์อิบนุ อุษัยมีน, ลิกออ์ อัลบาบ อัลมัฟตูห์ ครั้งที่ 150 หัวข้อ «การถ่ายรูปคนจากด้านหลัง» — เป็นหลักของภาพที่หันหลังให้คนดู (คำถามเดิมเป็นเรื่องรูปถ่ายที่ระลึก ซึ่งท่านติว่าไร้ประโยชน์ แต่ตอบชัดว่าไม่นับเป็นรูปต้องห้าม)",
      en: "Shaykh Ibn Uthaymin, Liqa' al-Bab al-Maftuh, session 150, topic «Photographing a person from behind» — the basis for pictures that face away from the viewer (the original question was about souvenir photos, which he criticised as pointless, but he answered clearly that it is not a prohibited image)",
    },
    href: "https://shamela.ws/book/7687/4243",
  },
  {
    arabic:
      "قوله: (لا تدع صورة إلا طمستها) المراد به طمس الوجه؛ لأن الوجه مجمع المحاسن، فإذا جعل على وجه الصورة ما تزول به خلقتها إذا كانت -مثلاً- منقوشة كفى ذلك",
    tr: {
      th: "คำว่า «อย่าปล่อยรูปภาพใดไว้ นอกจากท่านจะลบมันเสีย» หมายถึงการลบใบหน้า เพราะใบหน้ารวมรูปลักษณ์ทั้งหมดไว้ ถ้าทำให้ใบหน้าของรูปหมดรูปลักษณ์ไป เช่น รูปที่วาดหรือพิมพ์ เท่านั้นก็พอ",
      en: "His words «leave no image without effacing it» mean effacing the face, because the face gathers all the features; so if something is put on the face of the image that removes its form, for example when it is drawn or printed, that is enough.",
    },
    source: {
      th: "ชัยค์อับดุลลอฮ์ อิบนุ ญิบรีน, ชัรห์ อัลอะกีดะฮ์ อัฏเฏาะหาวิยะฮ์ บทที่ 11 (ส่วนรูปปั้นท่านว่าต้องตัดศีรษะออก)",
      en: "Shaykh Abdullah ibn Jibrin, Sharh al-Aqidah al-Tahawiyyah, lesson 11 (for statues, he said the head must be cut off)",
    },
    href: "https://shamela.ws/book/7724/148",
  },
  {
    arabic:
      "أما إذا كانت الصورة جثة بدون وجه فلا بأس ... أما إذا كانت صورة يد أو رجل، أو جثة بدون رأس فلا بأس بها",
    tr: {
      th: "ถ้ารูปเป็นร่างที่ไม่มีใบหน้า ก็ไม่เป็นไร ... ส่วนรูปมือหรือเท้า หรือร่างที่ไม่มีศีรษะ ก็ไม่เป็นไร",
      en: "If the image is a body without a face, there is nothing wrong with it ... and an image of a hand or a foot, or a body without a head, there is nothing wrong with it.",
    },
    source: {
      th: "ชัยค์อับดุลอะซีซ อัรรอญิฮีย์, ฟะตาวา มุเนาวะอะฮ์ เล่ม 9 หน้า 22 (ท่านเตือนด้วยว่าการขีดเส้นทับใบหน้าอย่างเดียวไม่พอ ต้องลบใบหน้าให้หมด)",
      en: "Shaykh Abd al-Aziz al-Rajihi, Fatawa Munawwa'ah, vol. 9, p. 22 (he also warned that drawing a line across the face is not enough; the face must be removed entirely)",
    },
    href: "https://shamela.ws/book/36975/508",
  },
];

/*
  หลักฐานเรื่องภาพถ่ายสัตว์เพื่อการสอน (AGENTS.md ข้อ 1.1 — เจ้าของโปรเจกต์อนุมัติ 2 ต.ค. 2026)
  เปิดตรวจกับ Shamela แล้ว (2 ต.ค. 2026) ชัยค์อิบนุ อุษัยมีนให้ภาพถ่ายขึ้นกับจุดประสงค์ และห้ามเก็บรูปโดยไม่มีความจำเป็น
*/
export const PHOTO: Evidence[] = [
  {
    arabic:
      "إنه قول له وجه، وذلك لأن المصور لا يخطط بيده لا العين ولا الأنف ولا الفم ولا غير ذلك، فهو كالمرآة، لكن الفرق أن المرآة لا تنطبع، وهذا ينطبع، لكن هذا الذي انطبع نعتبره صورة، واقتناء الصور لغير حاجة وضرورة محرم",
    tr: {
      th: "คำพูดนี้ (ที่ว่าการถ่ายภาพด้วยกล้องเหมือนการมองกระจกเงา) มีน้ำหนัก เพราะคนถ่ายไม่ได้ใช้มือวาดตา จมูก ปาก หรือสิ่งอื่นใด มันจึงเหมือนกระจกเงา แต่ต่างกันตรงที่ภาพในกระจกเงาไม่ติดตรึงอยู่ ส่วนภาพถ่ายติดตรึงอยู่ และสิ่งที่ติดตรึงนี้เรานับว่าเป็นรูป การเก็บรูปไว้โดยไม่มีความจำเป็นหรือความคับขันเป็นที่ต้องห้าม",
      en: "This view (that a camera photograph is like looking in a mirror) has weight, because the photographer does not draw the eyes, nose, mouth or anything else with his hand, so it is like a mirror. The difference is that a mirror does not fix the image while a photograph does, and what is fixed we count as an image. Keeping images without need or necessity is prohibited.",
    },
    source: {
      th: "ชัยค์อิบนุ อุษัยมีน, ลิกออ์ อัลบาบ อัลมัฟตูห์ ครั้งที่ 76 หัวข้อ «เหตุผลของการเทียบภาพถ่ายกับภาพในกระจกเงา»",
      en: "Shaykh Ibn Uthaymin, Liqa' al-Bab al-Maftuh, session 76, topic «Why photographs are compared to mirror images»",
    },
    href: "https://shamela.ws/book/7687/2277",
  },
  {
    arabic:
      "لا أرى أن التصوير الفوتوغرافي الفوري ... داخل في التصوير الذي نهى عنه الرسول ﷺ ... إذا كان الغرض شيئًا مباحًا صار هذا العمل مباحًا بإباحة الغرض المقصود منه، وإذا كان الغرض غير مباح صار هذا العمل حرامًا",
    tr: {
      th: "ฉันไม่เห็นว่าการถ่ายภาพแบบทันที ... เข้าอยู่ในการทำรูปที่ท่านเราะสูล ﷺ ห้ามไว้ ... ถ้าจุดประสงค์เป็นสิ่งที่อนุญาต การกระทำนี้ก็อนุญาตตามจุดประสงค์นั้น และถ้าจุดประสงค์ไม่เป็นที่อนุญาต การกระทำนี้ก็เป็นที่ต้องห้าม",
      en: "I do not see that instant photography ... falls under the image-making that the Messenger ﷺ forbade ... If the purpose is something permissible, the act becomes permissible because its intended purpose is permissible; and if the purpose is not permissible, the act becomes forbidden.",
    },
    source: {
      th: "ชัยค์อิบนุ อุษัยมีน, มัจญ์มูอ์ ฟะตาวา วะเราะซาอิล อัลอุษัยมีน เล่ม 2 หน้า 271 (ตัวอย่างที่ท่านห้ามคือ ถ่ายเก็บไว้เป็นที่ระลึก และถ่ายเพื่อความเพลิดเพลิน หน้า 272)",
      en: "Shaykh Ibn Uthaymin, Majmu' Fatawa wa Rasa'il al-Uthaymin, vol. 2, p. 271 (the examples he forbade are photos kept as souvenirs and photos taken for amusement, p. 272)",
    },
    href: "https://shamela.ws/book/12293/546",
  },
  {
    arabic:
      "لا أرى أنه يلزم طمسها؛ لأن في ذلك مشقة كبيرة، ولأنها أي هذه الكتب ما قصد بها هذه الصورة إنما قصد ما فيها من العلم",
    tr: {
      th: "ฉันไม่เห็นว่าจำเป็นต้องลบรูป (ในหนังสือ) เพราะเป็นความลำบากมาก และเพราะหนังสือเหล่านี้ไม่ได้มุ่งที่รูป แต่มุ่งที่ความรู้ในหนังสือ",
      en: "I do not see that it is necessary to efface them (the pictures in books), because that is very burdensome, and because these books are not intended for the pictures but for the knowledge they contain.",
    },
    source: {
      th: "ชัยค์อิบนุ อุษัยมีน, มัจญ์มูอ์ ฟะตาวา เล่ม 2 หน้า 283 คำถามที่ 338",
      en: "Shaykh Ibn Uthaymin, Majmu' Fatawa, vol. 2, p. 283, question 338",
    },
    href: "https://shamela.ws/book/12293/558",
  },
];
