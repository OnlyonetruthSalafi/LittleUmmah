import { GARDEN_OWNERS_STORY } from "../features/stories/data/garden-owners.ts";
import { TWO_GARDENS_STORY } from "../features/stories/data/two-gardens.ts";
import type { LessonIconName } from "@/components/icons/LessonIcon";
import type { Text } from "@/i18n/config";

export type Lesson = {
  evidence?: string[];
  id: string;
  icon: LessonIconName;
  /** ตัวอักษรอาหรับขนาดใหญ่แทนไอคอน ใช้กับบทเรียนตัวอักษร */
  glyph?: string;
  title: Text;
  body: Text;
  /** ข้อความภาษาอาหรับ แสดงเป็นตัวอักษร แต่ไม่ส่งให้เสียงอ่าน (เสียงไทยอ่านอาหรับไม่ได้) */
  arabic?: string;
  /** คำอ่านเป็นภาษาไทย — ส่งให้เสียงอ่านแทนตัวอาหรับ */
  reading?: string;
  /** ความหมาย — บทใหม่ใช้ Text (อายะฮ์ภาษาอังกฤษ = Saheeh International ยกเฉพาะท่อน) */
  meaning?: Text;
};

export type IslandContent = {
  slug: string;
  robot: string;
  intro: Text;
  kids: Lesson[];
  juniors: Lesson[];
};

/*
  เนื้อหาของเกาะทั้งห้า (เกาะเกมมีหน้าของตัวเองที่ /learn/games)

  หลักการเขียน
  - สั้น อ่านจบในการ์ดเดียว วัย 3-6 ปีใช้ประโยคสั้นมาก วัย 7+ อธิบายเพิ่มได้
  - ไม่ใส่เลขอ้างอิงอายะฮ์/หะดีษ — เลขผิดในเว็บสอนเด็กเป็นความผิดที่ตรวจเจอยาก
    ถ้าจะใส่ ให้เจ้าของโปรเจกต์ตรวจแหล่งอ้างอิงก่อน
  - เรื่องเล่าใช้เฉพาะเนื้อหาที่มีในอัลกุรอานโดยตรง ไม่เติมรายละเอียดจากแหล่งที่ไม่แน่ชัด
    (เคยมีการ์ด "อัลอะมีน" ซึ่งมาจากชีวประวัติ ไม่ใช่อัลกุรอาน จึงเปลี่ยนเป็นเรื่องนบีอิบรอฮีมกับกองไฟ)
  - ไม่วาดภาพบุคคล ศาสดา หรือเศาะหาบะฮ์ (ข้อ 1.4) การ์ดใช้ไอคอนสิ่งของแทน
*/
export const ISLAND_CONTENT: IslandContent[] = [
  {
    slug: "arabic",
    robot: "/Character/read.webp",
    intro: { th: "มารู้จักตัวอักษรและคำง่ายๆ ในภาษาอาหรับ ภาษาของอัลกุรอาน อ่านจากขวาไปซ้ายนะ", en: "Meet Arabic letters and simple words. Arabic is read from right to left." },
    // วัย 3-6 ปี: อักษรอาหรับครบ 28 ตัว เรียงตามลำดับ ห้องเรียนแบ่งเป็นชุดละ 4 ตัว (features/arabic/data/classroom.ts)
    kids: [
      {
        id: "alif",
        icon: "letters",
        glyph: "ا",
        title: { th: "อะลิฟ", en: "Alif" },
        body: { th: "อะลิฟเป็นตัวอักษรตัวแรก เขียนเป็นเส้นตรง ยืนตัวตรงเหมือนไม้บรรทัด", en: "Alif is the first letter. It is a straight line, standing tall like a ruler." },
      },
      {
        id: "ba",
        icon: "letters",
        glyph: "ب",
        title: { th: "บาอ์", en: "Ba" },
        body: { th: "บาอ์เหมือนเรือเล็กๆ มีจุดหนึ่งจุดอยู่ข้างล่าง", en: "Ba looks like a little boat with one dot underneath." },
      },
      {
        id: "ta",
        icon: "letters",
        glyph: "ت",
        title: { th: "ตาอ์", en: "Ta" },
        body: { th: "ตาอ์รูปร่างเหมือนบาอ์ แต่มีจุดสองจุดอยู่ข้างบน", en: "Ta has the same shape as Ba, but with two dots on top." },
      },
      {
        id: "tha",
        icon: "letters",
        glyph: "ث",
        title: { th: "ษาอ์", en: "Tha" },
        body: { th: "ษาอ์รูปร่างเหมือนตาอ์ แต่มีจุดสามจุดอยู่ข้างบน ลองนับจุดดูนะ", en: "Tha has the same shape as Ta, but with three dots on top. Try counting the dots!" },
      },
      {
        id: "jim",
        icon: "letters",
        glyph: "ج",
        title: { th: "ญีม", en: "Jim" },
        body: { th: "ญีมมีหัวเหมือนตะขอ และมีจุดหนึ่งจุดอยู่ตรงกลาง", en: "Jim has a head like a hook and one dot in the middle." },
      },
      {
        id: "haa",
        icon: "letters",
        glyph: "ح",
        title: { th: "หาอ์", en: "Ha" },
        body: { th: "หาอ์รูปร่างเหมือนญีม แต่ไม่มีจุดเลย", en: "Ha has the same shape as Jim, but no dots at all." },
      },
      {
        id: "kha",
        icon: "letters",
        glyph: "خ",
        title: { th: "คออ์", en: "Kha" },
        body: { th: "คออ์รูปร่างเหมือนหาอ์ แต่มีจุดหนึ่งจุดอยู่ข้างบน", en: "Kha has the same shape as Ha, but with one dot on top." },
      },
      {
        id: "dal",
        icon: "letters",
        glyph: "د",
        title: { th: "ดาล", en: "Dal" },
        body: { th: "ดาลตัวเล็ก เหมือนมุมที่โค้งนิดๆ", en: "Dal is small, like a corner with a gentle bend." },
      },
      {
        id: "dhal",
        icon: "letters",
        glyph: "ذ",
        title: { th: "ซาล", en: "Dhal" },
        body: { th: "ซาลรูปร่างเหมือนดาล แต่มีจุดหนึ่งจุดอยู่ข้างบน", en: "Dhal has the same shape as Dal, but with one dot on top." },
      },
      {
        id: "ra",
        icon: "letters",
        glyph: "ر",
        title: { th: "รออ์", en: "Ra" },
        body: { th: "รออ์เป็นเส้นโค้งที่ไหลลงไปข้างล่าง เหมือนสไลเดอร์", en: "Ra is a curve that slides down, like a slide." },
      },
      {
        id: "zay",
        icon: "letters",
        glyph: "ز",
        title: { th: "ซาย", en: "Zay" },
        body: { th: "ซายรูปร่างเหมือนรออ์ แต่มีจุดหนึ่งจุดอยู่ข้างบน", en: "Zay has the same shape as Ra, but with one dot on top." },
      },
      {
        id: "sin",
        icon: "letters",
        glyph: "س",
        title: { th: "ซีน", en: "Sin" },
        body: { th: "ซีนมีฟันเล็กๆ สามซี่ แล้วมีหางโค้งเหมือนถ้วย", en: "Sin has three little teeth and a curved tail like a cup." },
      },
      {
        id: "shin",
        icon: "letters",
        glyph: "ش",
        title: { th: "ชีน", en: "Shin" },
        body: { th: "ชีนรูปร่างเหมือนซีน แต่มีจุดสามจุดอยู่ข้างบน", en: "Shin has the same shape as Sin, but with three dots on top." },
      },
      {
        id: "sad",
        icon: "letters",
        glyph: "ص",
        title: { th: "ศ็อด", en: "Sad" },
        body: { th: "ศ็อดมีวงรีเหมือนห่วงยาง แล้วมีหางโค้งเหมือนถ้วย", en: "Sad has an oval loop like a swim ring and a curved tail like a cup." },
      },
      {
        id: "dad",
        icon: "letters",
        glyph: "ض",
        title: { th: "ฎ็อด", en: "Dad" },
        body: { th: "ฎ็อดรูปร่างเหมือนศ็อด แต่มีจุดหนึ่งจุดอยู่ข้างบน", en: "Dad has the same shape as Sad, but with one dot on top." },
      },
      {
        id: "taa",
        icon: "letters",
        glyph: "ط",
        title: { th: "ฏออ์", en: "Ta (heavy)" },
        body: { th: "ฏออ์มีวงรีนอนอยู่ และมีเสาตั้งตรงหนึ่งต้น", en: "This heavy Ta has an oval lying down and one straight pole standing up." },
      },
      {
        id: "zaa",
        icon: "letters",
        glyph: "ظ",
        title: { th: "ซออ์", en: "Za (heavy)" },
        body: { th: "ซออ์รูปร่างเหมือนฏออ์ แต่มีจุดหนึ่งจุดอยู่ข้างบน", en: "This heavy Za has the same shape as the heavy Ta, but with one dot on top." },
      },
      {
        id: "ayn",
        icon: "letters",
        glyph: "ع",
        title: { th: "อัยน์", en: "Ayn" },
        body: { th: "อัยน์ด้านบนโค้งเหมือนพระจันทร์เสี้ยวเล็กๆ แล้วมีหางโค้งลงข้างล่าง", en: "Ayn curves at the top like a small crescent moon, then has a tail curving down." },
      },
      {
        id: "ghayn",
        icon: "letters",
        glyph: "غ",
        title: { th: "ฆ็อยน์", en: "Ghayn" },
        body: { th: "ฆ็อยน์รูปร่างเหมือนอัยน์ แต่มีจุดหนึ่งจุดอยู่ข้างบน", en: "Ghayn has the same shape as Ayn, but with one dot on top." },
      },
      {
        id: "fa",
        icon: "letters",
        glyph: "ف",
        title: { th: "ฟาอ์", en: "Fa" },
        body: { th: "ฟาอ์มีห่วงกลมเล็กๆ และมีจุดหนึ่งจุดอยู่ข้างบน", en: "Fa has a small round loop and one dot on top." },
      },
      {
        id: "qaf",
        icon: "letters",
        glyph: "ق",
        title: { th: "ก็อฟ", en: "Qaf" },
        body: { th: "ก็อฟมีห่วงกลม จุดสองจุดอยู่ข้างบน และหางโค้งลึกกว่าฟาอ์", en: "Qaf has a round loop, two dots on top, and a tail that curves deeper than Fa's." },
      },
      {
        id: "kaf",
        icon: "letters",
        glyph: "ك",
        title: { th: "กาฟ", en: "Kaf" },
        body: { th: "กาฟมีเส้นตั้งกับเส้นนอน และมีขีดเล็กๆ อยู่ข้างใน", en: "Kaf has a standing line and a lying line, with a little mark inside." },
      },
      {
        id: "lam",
        icon: "letters",
        glyph: "ل",
        title: { th: "ลาม", en: "Lam" },
        body: { th: "ลามเป็นเสาสูง แล้วโค้งลงเป็นตะขอข้างล่าง", en: "Lam is a tall pole that curves down into a hook at the bottom." },
      },
      {
        id: "mim",
        icon: "letters",
        glyph: "م",
        title: { th: "มีม", en: "Mim" },
        body: { th: "มีมมีหัวกลมเล็กๆ แล้วมีหางยาวลงไปข้างล่าง", en: "Mim has a small round head and a long tail going down." },
      },
      {
        id: "nun",
        icon: "letters",
        glyph: "ن",
        title: { th: "นูน", en: "Nun" },
        body: { th: "นูนเหมือนถ้วยใบเล็ก มีจุดหนึ่งจุดอยู่ข้างบน", en: "Nun is like a little cup with one dot on top." },
      },
      {
        id: "ha",
        icon: "letters",
        glyph: "ه",
        title: { th: "ฮาอ์", en: "Ha (soft)" },
        body: { th: "ฮาอ์กลมๆ เหมือนวงกลม", en: "This soft Ha is round, like a circle." },
      },
      {
        id: "waw",
        icon: "letters",
        glyph: "و",
        title: { th: "วาว", en: "Waw" },
        body: { th: "วาวมีหัวกลม แล้วมีหางโค้งลงไปข้างล่าง", en: "Waw has a round head and a tail curving down." },
      },
      {
        id: "ya",
        icon: "letters",
        glyph: "ي",
        title: { th: "ยาอ์", en: "Ya" },
        body: { th: "ยาอ์เหมือนเรือที่โค้งลึก มีจุดสองจุดอยู่ข้างล่าง ยาอ์เป็นตัวอักษรตัวสุดท้าย", en: "Ya is like a deep boat with two dots underneath. Ya is the last letter." },
      },
    ],
    // วัย 7 ปีขึ้นไป: 4 หมวด — มารยาท สระ ตัวเลข คำศัพท์ (ไม่มีอายะฮ์อัลกุรอาน AGENTS.md ข้อ 1.6)
    juniors: [
      {
        id: "salam",
        icon: "chat",
        title: { th: "กล่าวสลาม", en: "Greeting with Salam" },
        body: { th: "เมื่อพบพี่น้องมุสลิม เรากล่าวสลาม และคนที่ได้ยินก็ตอบสลามกลับ", en: "When we meet a fellow Muslim, we say Salam, and whoever hears it answers the Salam." },
        arabic: "السَّلَامُ عَلَيْكُمْ — وَعَلَيْكُمُ السَّلَامُ",
        reading: "อัสสะลามุอะลัยกุม ตอบว่า วะอะลัยกุมุสสะลาม",
        meaning: { th: "ขอความสันติสุขจงมีแด่ท่าน และขอความสันติสุขจงมีแด่ท่านเช่นกัน", en: "Peace be upon you — and upon you be peace too." },
      },
      {
        id: "jazak",
        icon: "heart",
        title: { th: "ขอบคุณแบบมุสลิม", en: "Saying thank you" },
        body: { th: "เมื่อมีคนทำดีกับเรา เราขอดุอาอ์ให้เขาได้รับความดีตอบแทนจากอัลลอฮ์", en: "When someone is kind to us, we make dua that Allah rewards them with good." },
        arabic: "جَزَاكَ اللَّهُ خَيْرًا",
        reading: "ญะซากัลลอฮุค็อยร็อน",
        meaning: { th: "ขออัลลอฮ์ทรงตอบแทนความดีแก่ท่าน", en: "May Allah reward you with good." },
      },
      {
        id: "bismillah",
        icon: "dates",
        title: { th: "บิสมิลลาฮ์ก่อนกิน", en: "Bismillah before eating" },
        body: { th: "ก่อนกินอาหาร เรากล่าวบิสมิลลาฮ์ และกินด้วยมือขวา", en: "Before eating, we say Bismillah and eat with our right hand." },
        arabic: "بِسْمِ اللَّهِ",
        reading: "บิสมิลลาฮ์",
        meaning: { th: "ด้วยพระนามของอัลลอฮ์", en: "In the name of Allah." },
      },
      {
        id: "alhamdulillah",
        icon: "star8",
        title: { th: "อัลฮัมดุลิลลาฮ์", en: "Alhamdulillah" },
        body: { th: "เมื่อกินเสร็จ หรือเมื่อจาม เรากล่าวอัลฮัมดุลิลลาฮ์ ขอบคุณอัลลอฮ์", en: "After eating, or when we sneeze, we say Alhamdulillah to thank Allah." },
        arabic: "الْحَمْدُ لِلَّهِ",
        reading: "อัลฮัมดุลิลลาฮ์",
        meaning: { th: "การสรรเสริญทั้งหลายเป็นของอัลลอฮ์", en: "All praise is for Allah." },
      },
      {
        id: "fatha",
        icon: "pen",
        title: { th: "ฟัตฮะฮ์ สระอะ", en: "Fatha (a)" },
        body: { th: "ฟัตฮะฮ์เป็นขีดเล็กๆ อยู่เหนือตัวอักษร อ่านเป็นเสียงอะ", en: "Fatha is a small stroke above a letter. It makes the sound a." },
        arabic: "بَ تَ ثَ",
        reading: "บะ ตะ ษะ",
        meaning: { th: "ขีดข้างบน = เสียงอะ", en: "Stroke on top = the a sound" },
      },
      {
        id: "kasra",
        icon: "pen",
        title: { th: "กัสเราะฮ์ สระอิ", en: "Kasra (i)" },
        body: { th: "กัสเราะฮ์เป็นขีดเล็กๆ อยู่ใต้ตัวอักษร อ่านเป็นเสียงอิ", en: "Kasra is a small stroke below a letter. It makes the sound i." },
        arabic: "بِ تِ ثِ",
        reading: "บิ ติ ษิ",
        meaning: { th: "ขีดข้างล่าง = เสียงอิ", en: "Stroke underneath = the i sound" },
      },
      {
        id: "damma",
        icon: "pen",
        title: { th: "ฎ็อมมะฮ์ สระอุ", en: "Damma (u)" },
        body: { th: "ฎ็อมมะฮ์หน้าตาเหมือนวาวตัวเล็กๆ อยู่เหนือตัวอักษร อ่านเป็นเสียงอุ", en: "Damma looks like a tiny Waw above a letter. It makes the sound u." },
        arabic: "بُ تُ ثُ",
        reading: "บุ ตุ ษุ",
        meaning: { th: "วาวเล็กข้างบน = เสียงอุ", en: "Little Waw on top = the u sound" },
      },
      {
        id: "sukun",
        icon: "pen",
        title: { th: "ซุกูน ตัวสะกด", en: "Sukun" },
        body: { th: "ซุกูนเป็นวงกลมเล็กๆ อยู่เหนือตัวอักษร ทำให้ตัวนั้นเป็นตัวสะกด ไม่มีสระ", en: "Sukun is a small circle above a letter. The letter closes the sound and has no vowel." },
        arabic: "أَبْ ، أُمْ",
        reading: "อับ อุม",
        meaning: { th: "วงกลมเล็กข้างบน = ตัวสะกด", en: "Little circle on top = no vowel" },
      },
      {
        id: "numbers",
        icon: "letters",
        title: { th: "นับเลข 1 ถึง 5", en: "Counting 1 to 5" },
        body: { th: "ลองนับนิ้วมือทีละนิ้วเป็นภาษาอาหรับ", en: "Count your fingers one by one in Arabic." },
        arabic: "وَاحِد ، اِثْنَان ، ثَلَاثَة ، أَرْبَعَة ، خَمْسَة",
        reading: "วาฮิด อิษนาน ษะลาษะฮ์ อัรบะอะฮ์ ค็อมสะฮ์",
        meaning: { th: "หนึ่ง สอง สาม สี่ ห้า", en: "one, two, three, four, five" },
      },
      {
        id: "numbers2",
        icon: "letters",
        title: { th: "นับเลข 6 ถึง 10", en: "Counting 6 to 10" },
        body: { th: "นับต่ออีกมือหนึ่ง จนครบสิบนิ้ว", en: "Keep counting on your other hand until you reach ten fingers." },
        arabic: "سِتَّة ، سَبْعَة ، ثَمَانِيَة ، تِسْعَة ، عَشَرَة",
        reading: "ซิตตะฮ์ ซับอะฮ์ ษะมานิยะฮ์ ติสอะฮ์ อะชะเราะฮ์",
        meaning: { th: "หก เจ็ด แปด เก้า สิบ", en: "six, seven, eight, nine, ten" },
      },
      {
        id: "digits",
        icon: "letters",
        title: { th: "ตัวเลขแบบอาหรับ", en: "Arabic numerals" },
        body: { th: "ในหนังสืออาหรับ ตัวเลขหนึ่งถึงห้าเขียนแบบนี้ ลองชี้ทีละตัวแล้วนับไปพร้อมครูนะ", en: "In Arabic books, the numbers one to five are written like this. Point to each one and count along with the teacher." },
        arabic: "١ ٢ ٣ ٤ ٥",
        reading: "วาฮิด อิษนาน ษะลาษะฮ์ อัรบะอะฮ์ ค็อมสะฮ์",
        meaning: { th: "1 2 3 4 5", en: "1 2 3 4 5" },
      },
      {
        id: "words",
        icon: "mushaf",
        title: { th: "คำศัพท์รอบตัว", en: "Everyday words" },
        body: { th: "คำง่ายๆ ที่เจอทุกวัน ลองชี้ของจริงแล้วพูดตาม", en: "Simple words we meet every day. Point to the real thing and say it." },
        arabic: "كِتَاب ، قَلَم ، بَيْت ، مَاء",
        reading: "กิตาบ เกาะลัม บัยต์ มาอ์",
        meaning: { th: "หนังสือ ปากกา บ้าน น้ำ", en: "book, pen, house, water" },
      },
      {
        id: "home",
        icon: "home",
        title: { th: "ของในบ้าน", en: "Things at home" },
        body: { th: "ลองเดินดูรอบบ้าน แล้วเรียกชื่อของเป็นภาษาอาหรับ", en: "Walk around your home and name things in Arabic." },
        arabic: "بَاب ، كُرْسِيّ ، سَرِير ، نَافِذَة",
        reading: "บาบ กุรซีย์ ซะรีร นาฟิซะฮ์",
        meaning: { th: "ประตู เก้าอี้ เตียง หน้าต่าง", en: "door, chair, bed, window" },
      },
      {
        id: "nature",
        icon: "sun",
        title: { th: "ธรรมชาติที่อัลลอฮ์ทรงสร้าง", en: "Allah's creation" },
        body: { th: "มองออกไปนอกหน้าต่าง เราเห็นสิ่งที่อัลลอฮ์ทรงสร้างมากมาย", en: "Look out of the window: we can see so many things Allah created." },
        arabic: "شَمْس ، قَمَر ، نَجْم ، شَجَرَة",
        reading: "ชัมส์ เกาะมัร นัจญ์ม์ ชะญะเราะฮ์",
        meaning: { th: "ดวงอาทิตย์ ดวงจันทร์ ดาว ต้นไม้", en: "sun, moon, star, tree" },
      },
      {
        id: "family",
        icon: "heart",
        title: { th: "ครอบครัวของเรา", en: "My family" },
        body: { th: "คนในครอบครัวที่เรารักและเชื่อฟัง", en: "The people in our family whom we love and obey." },
        arabic: "أَب ، أُمّ ، أَخ ، أُخْت",
        reading: "อับ อุมม์ อัค อุคต์",
        meaning: { th: "พ่อ แม่ พี่น้องผู้ชาย พี่น้องผู้หญิง", en: "father, mother, brother, sister" },
      },
    ],
  },
  {
    slug: "moral",
    robot: "/Character/welcome.webp",
    intro: { th: "มุสลิมที่ดีมีมารยาทงาม ใจดีกับทุกคน มาฝึกไปด้วยกันทุกวัน", en: "A good Muslim has beautiful manners. Let’s practise together every day." },
    kids: [
      // รู้จักเพื่อนใหม่ — แนะนำครูนูรีและผองเพื่อน (9 พ.ย. 2026) มารยาททั่วไป ไม่มีตัวบท
      {
        id: "meet-friends",
        icon: "chat",
        title: { th: "รู้จักเพื่อนใหม่", en: "Meet new friends" },
        body: { th: "เจอเพื่อนใหม่ ทักสลาม บอกชื่อ แล้วยิ้มให้กันนะ", en: "Meet a new friend: say Salam, tell your name, and share a smile." },
      },
      // C-8: Claude ตรวจตัวบท 8 พ.ย. 2026 — บุคอรี 6324 https://shamela.ws/book/1681/9484
      {
        evidence: ["bukhari-6324"],
        "id": "dua-sleep",
        "icon": "home",
        "title": {
          "th": "ดุอาอ์ก่อนนอน",
          "en": "Dua before sleeping"
        },
        "body": { "th": "ท่านนบี ﷺ เมื่อจะนอนกล่าวว่า…", "en": "When the Prophet ﷺ went to sleep, he said…" },
        "arabic": "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        "reading": "บิสมิกัลลอฮุมมะ อะมูตุ วะอะห์ยา",
        "meaning": { "th": "ด้วยพระนามของพระองค์ โอ้อัลลอฮ์ ข้าพเจ้าตายและข้าพเจ้ามีชีวิต", "en": "In Your name, O Allah, I die and I live." }
      },
      {
        id: "bismillah",
        icon: "dates",
        title: { th: "บิสมิลลาฮ์ก่อนกิน", en: "Bismillah before eating" },
        body: { th: "ก่อนกินข้าว เรากล่าวบิสมิลลาฮ์ แล้วกินด้วยมือขวา", en: "Before eating, we say Bismillah, then eat with our right hand." },
        arabic: "بِسْمِ اللَّهِ",
        reading: "บิสมิลลาฮ์",
        meaning: { th: "ด้วยพระนามของอัลลอฮ์", en: "In the name of Allah." },
      },
      {
        id: "salam",
        icon: "chat",
        title: { th: "กล่าวสลามเมื่อพบกัน", en: "Say Salam" },
        body: { th: "เจอพ่อแม่ เจอเพื่อน เรากล่าวสลามด้วยเสียงใสๆ", en: "When we meet our parents or friends, we say Salam in a bright, clear voice." },
        arabic: "السَّلَامُ عَلَيْكُمْ",
        reading: "อัสสะลามุอะลัยกุม",
      },
      {
        id: "smile",
        icon: "heart",
        title: { th: "ยิ้มให้กัน", en: "Share a smile" },
        body: { th: "ท่านนบีมุฮัมมัด ﷺ สอนว่า การยิ้มให้พี่น้องเป็นความดีอย่างหนึ่ง", en: "Prophet Muhammad ﷺ taught that smiling at your brother is a good deed." },
      },
      {
        id: "clean",
        icon: "drop",
        title: { th: "รักความสะอาด", en: "Stay clean" },
        body: { th: "ล้างมือก่อนกินและหลังเข้าห้องน้ำ อิสลามรักความสะอาด", en: "Wash your hands before eating and after using the toilet. Islam loves cleanliness." },
      },
      {
        evidence: ["tirmidhi-2035"],
        // ติรมิซีย์ 2035 อัลบานีย์ตัดสินเศาะฮีห์ (ตรวจกับ Shamela 2 ต.ค. 2026)
        id: "thanks",
        icon: "heart",
        title: { th: "กล่าวขอบคุณ", en: "Say thank you" },
        body: { th: "เมื่อมีคนให้ของหรือช่วยเรา เรากล่าวว่า ญะซากัลลอฮุค็อยร็อน", en: "When someone gives us something or helps us, we say Jazakallahu khayran." },
        arabic: "جَزَاكَ اللَّهُ خَيْرًا",
        reading: "ญะซากัลลอฮุค็อยร็อน",
        meaning: { th: "ขออัลลอฮ์ทรงตอบแทนความดีแก่เธอ", en: "May Allah reward you with good." },
      },
      {
        id: "share",
        icon: "heart",
        title: { th: "แบ่งปันของเล่น", en: "Share your toys" },
        body: { th: "เล่นด้วยกัน แบ่งของเล่นให้เพื่อน ไม่แย่งกัน เพื่อนก็มีความสุข เราก็มีความสุข", en: "Play together and share your toys with friends. No grabbing! Your friend is happy, and so are you." },
      },
      {
        id: "say-sorry",
        icon: "heart",
        title: { th: "ขอโทษเมื่อทำผิด", en: "Say sorry when you make a mistake" },
        body: { th: "ทำของเพื่อนล้ม ขอโทษแล้วช่วยเก็บนะ", en: "If you knock something over, say sorry and help pick it up." },
      },
      {
        id: "help-friend",
        icon: "heart",
        title: { th: "ช่วยเพื่อนที่ต้องการความช่วยเหลือ", en: "Help a friend who needs help" },
        body: { th: "ถามก่อนช่วย ของหนักให้ผู้ใหญ่ช่วยนะ", en: "Ask before helping. Get an adult for heavy things." },
      },
      {
        id: "wait-turn",
        icon: "heart",
        title: { th: "รอคิว", en: "Wait your turn" },
        body: { th: "ต่อท้ายแถว รอให้ถึงตาเรา", en: "Join the end of the line and wait your turn." },
      },
      {
        id: "tidy-toys",
        icon: "heart",
        title: { th: "เก็บของเล่นหลังเล่น", en: "Put toys away" },
        body: { th: "เล่นเสร็จแล้ว เก็บของเล่นเข้าที่", en: "When playtime ends, put the toys away." },
      },
    ],
    juniors: [
      // C-8: Claude ตรวจตัวบท 8 พ.ย. 2026 — บุคอรี 6324 https://shamela.ws/book/1681/9484 (หะดีษเดียวกับก่อนนอน)
      {
        evidence: ["bukhari-6324"],
        "id": "dua-wake",
        "icon": "home",
        "title": {
          "th": "ดุอาอ์ตื่นนอน",
          "en": "Dua when waking up"
        },
        "body": { "th": "เมื่อตื่นนอนท่านนบี ﷺ กล่าวว่า…", "en": "When the Prophet ﷺ woke up, he said…" },
        "arabic": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        "reading": "อัลฮัมดุลิลลาฮิลละซี อะห์ยานา บะอ์ดะมา อะมาตะนา วะอิลัยฮินนุชูร",
        "meaning": { "th": "การสรรเสริญเป็นของอัลลอฮ์ ผู้ทรงให้เรามีชีวิตหลังจากที่ทรงให้เราตาย และยังพระองค์คือการฟื้นคืนชีพ", "en": "Praise belongs to Allah, who gave us life after causing us to die, and to Him is the resurrection." }
      },
      // C-8: Claude ตรวจตัวบท 8 พ.ย. 2026 — อบูดาวูด 5095 (อัลบานีย์: เศาะฮีห์) https://shamela.ws/book/1726/6957 · ติรมิซีย์ 3426 https://shamela.ws/book/1435/5650
      {
        evidence: ["abu-dawud-5095","tirmidhi-3426"],
        "id": "dua-leave-home",
        "icon": "home",
        "title": {
          "th": "ดุอาอ์ออกจากบ้าน",
          "en": "Dua when leaving home"
        },
        "body": { "th": "ท่านนบี ﷺ สอนว่า เมื่อออกจากบ้านให้กล่าวว่า…", "en": "The Prophet ﷺ taught that when you leave home, you say…" },
        "arabic": "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        "reading": "บิสมิลลาฮ์ ตะวักกัลตุ อะลัลลอฮ์ ลาเหาละ วะลา กุววะตะ อิลลา บิลลาฮ์",
        "meaning": { "th": "ด้วยพระนามของอัลลอฮ์ ข้าพเจ้ามอบหมายต่ออัลลอฮ์ ไม่มีพลังและไม่มีกำลังใดๆ นอกจากด้วยอัลลอฮ์", "en": "In the name of Allah. I put my trust in Allah. There is no power and no strength except through Allah." }
      },
      // C-8: Claude ตรวจตัวบท 8 พ.ย. 2026 — อบูดาวูด 4023 (อัลบานีย์: หะซัน) https://shamela.ws/book/1726/5556
      {
        evidence: ["abu-dawud-4023"],
        "id": "dua-after-eating",
        "icon": "dates",
        "title": {
          "th": "ดุอาอ์หลังกินเสร็จ",
          "en": "Dua after eating"
        },
        "body": { "th": "ท่านนบี ﷺ สอนว่า เมื่อกินอาหารเสร็จให้กล่าวว่า…", "en": "The Prophet ﷺ taught that when you finish eating, you say…" },
        "arabic": "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا الطَّعَامَ، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        "reading": "อัลฮัมดุลิลลาฮิลละซี อัฏอะมะนี ฮาซัฏเฏาะอาม วะเราะซะเกาะนีฮิ มิน ฆ็อยริ เหาลิน มินนี วะลา กุววะฮ์",
        "meaning": { "th": "การสรรเสริญเป็นของอัลลอฮ์ ผู้ทรงให้อาหารนี้แก่ข้าพเจ้า และประทานมันแก่ข้าพเจ้า โดยไม่มีพลังและกำลังใดๆ จากตัวข้าพเจ้าเลย", "en": "Praise belongs to Allah, who fed me this food and provided it for me without any power or strength of my own." }
      },
      {
        id: "parents",
        icon: "home",
        title: { th: "ทำดีต่อพ่อแม่", en: "Kindness to parents" },
        body: { th: "อัลลอฮ์ทรงสั่งในอัลกุรอานให้ทำดีต่อพ่อแม่ แม้แต่คำว่า “อุฟ” ที่แสดงความรำคาญก็ห้ามพูดกับท่าน ให้พูดกับท่านด้วยคำพูดที่อ่อนโยน", en: "In the Qur'an, Allah commands us to be good to our parents. We must not even say “uff” to show we are annoyed. Speak to them with gentle words." },
      },
      {
        id: "truth",
        icon: "shield",
        title: { th: "พูดความจริง", en: "Always tell the truth" },
        body: { th: "ท่านนบี ﷺ สอนว่า ความสัตย์จริงนำไปสู่ความดี และความดีนำไปสู่สวรรค์ แม้พูดความจริงแล้วจะโดนดุ ก็ยังดีกว่าโกหก", en: "The Prophet ﷺ taught that truthfulness leads to goodness, and goodness leads to Paradise. Even if telling the truth gets you a telling-off, it is still better than lying." },
      },
      {
        evidence: ["bukhari-6224"],
        id: "sneeze",
        icon: "chat",
        title: { th: "เมื่อจาม", en: "When you sneeze" },
        // บุคอรี 6224
        body: { th: "คนที่จามกล่าวอัลฮัมดุลิลลาฮ์ คนที่ได้ยินตอบว่า ยัรฮะมุกัลลอฮ์ แล้วคนที่จามตอบกลับว่า ยะฮ์ดีกุมุลลอฮ์ วะยุศลิหุบาละกุม", en: "The one who sneezes says Alhamdulillah. The one who hears replies Yarhamukallah. Then the one who sneezed answers Yahdikumullahu wa yuslihu balakum." },
        arabic: "الْحَمْدُ لِلَّهِ — يَرْحَمُكَ اللَّهُ — يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ",
        reading: "อัลฮัมดุลิลลาฮ์ — ยัรฮะมุกัลลอฮ์ — ยะฮ์ดีกุมุลลอฮ์ วะยุศลิหุบาละกุม",
        meaning: { th: "การสรรเสริญเป็นของอัลลอฮ์ — ขออัลลอฮ์ทรงเมตตาเธอ — ขออัลลอฮ์ทรงชี้ทางแก่เธอและทำให้เรื่องของเธอดีขึ้น", en: "All praise is for Allah — May Allah have mercy on you — May Allah guide you and set your affairs right." },
      },
      {
        id: "animals",
        icon: "jug",
        title: { th: "เมตตาต่อสัตว์", en: "Mercy to animals" },
        body: { th: "ท่านนบี ﷺ เล่าถึงชายคนหนึ่งที่ตักน้ำให้สุนัขที่กระหายน้ำ อัลลอฮ์จึงทรงอภัยให้เขา เราจึงให้น้ำและอาหารสัตว์ และไม่ทำร้ายพวกมัน", en: "The Prophet ﷺ told of a man who gave water to a thirsty dog, and Allah forgave him. So we give animals water and food, and we never hurt them." },
      },
      {
        evidence: ["quran-24-27","bukhari-6245"],
        // อันนูร 24:27, บุคอรี 6245
        id: "permission",
        icon: "home",
        title: { th: "ขออนุญาตก่อนเข้า", en: "Ask before you enter" },
        body: { th: "ก่อนเข้าห้องหรือบ้านคนอื่น เคาะประตู กล่าวสลาม แล้วรอให้อนุญาตก่อน ท่านนบี ﷺ สอนว่า ถ้าขออนุญาตสามครั้งแล้วไม่ได้รับอนุญาต ก็ให้กลับไปก่อน", en: "Before entering someone else's room or home, knock on the door, say Salam, and wait for permission. The Prophet ﷺ taught that if you ask three times and are not given permission, you should go back." },
      },
      {
        evidence: ["bukhari-6116","bukhari-6115","abu-dawud-4782"],
        // บุคอรี 6116, 6115 และอบูดาวูด 4782 (อัลบานีย์: เศาะฮีห์)
        id: "calm",
        icon: "heart",
        title: { th: "ไม่โกรธ", en: "Stay calm" },
        body: { th: "ท่านนบี ﷺ สั่งเสียชายคนหนึ่งว่า “อย่าโกรธ” เมื่อรู้สึกโกรธ ให้กล่าว อะอูซุบิลลาฮิมินัชชัยฏอนิรรอญีม ถ้ายืนอยู่ก็ให้นั่งลง", en: "The Prophet ﷺ advised a man: “Do not get angry.” When you feel angry, say A'udhu billahi minash-shaytanir-rajim. If you are standing, sit down." },
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        reading: "อะอูซุบิลลาฮิมินัชชัยฏอนิรรอญีม",
        meaning: { th: "ฉันขอความคุ้มครองต่ออัลลอฮ์ ให้พ้นจากชัยฏอนที่ถูกขับไล่", en: "I seek refuge with Allah from Shaytan, the expelled one." },
      },
      {
        id: "keep-promise",
        icon: "heart",
        title: { th: "ทำตามที่รับปากไว้", en: "Keep your promises" },
        body: { th: "มาตามนัด คืนของตามที่บอก ถ้าทำไม่ได้รีบบอกเพื่อน", en: "Meet as agreed and return things on time. Tell your friend promptly if you cannot." },
      },
      {
        id: "save-water-power",
        icon: "heart",
        title: { th: "ใช้น้ำและไฟไม่สิ้นเปลือง", en: "Save water and electricity" },
        body: { th: "ใช้น้ำพอดี ปิดก๊อกและปิดไฟเมื่อไม่ใช้", en: "Use only the water you need. Turn off taps and lights when finished." },
      },
      {
        id: "listen-friend",
        icon: "chat",
        title: { th: "ฟังเพื่อนพูดจนจบ", en: "Let your friend finish" },
        body: { th: "ฟังให้จบ แล้วค่อยพูดหรือถาม", en: "Listen to the end, then speak or ask a question." },
      },
      {
        id: "shared-things",
        icon: "heart",
        title: { th: "ดูแลของส่วนรวม", en: "Care for shared things" },
        body: { th: "ใช้หนังสืออย่างเบามือ ให้เพื่อนคนถัดไปได้อ่านด้วย", en: "Handle books gently so the next reader can enjoy them too." },
      },
    ],
  },
  {
    slug: "stories",
    robot: "/Character/faith.webp",
    intro: { th: "เรื่องจริงจากอัลกุรอานและหะดีษ สอนให้เรารักและเชื่อฟังอัลลอฮ์", en: "True stories from the Quran and the Hadith that teach us to love and obey Allah." },
    kids: [
      {
        id: "nuh",
        icon: "boat",
        title: { th: "นบีนูห์กับเรือลำใหญ่", en: "Prophet Nuh and the Ark" },
        body: { th: "นบีนูห์ (อะลัยฮิสสลาม) สร้างเรือตามคำสั่งของอัลลอฮ์ เมื่อน้ำท่วมใหญ่มาถึง ผู้ศรัทธาและสัตว์เป็นคู่ๆ ที่อยู่บนเรือปลอดภัย เราเรียนรู้ว่าต้องเชื่อฟังอัลลอฮ์", en: "Prophet Nuh (peace be upon him) built a ship as Allah commanded. When the great flood came, the believers and the pairs of animals on the ship were safe. We learn to obey Allah." },
      },
      {
        id: "yunus",
        icon: "wave",
        title: { th: "นบียูนุสในท้องปลา", en: "Prophet Yunus" },
        body: { th: "นบียูนุส (อะลัยฮิสสลาม) ถูกปลาใหญ่กลืนลงไป ในความมืดท่านวิงวอนขออภัยต่ออัลลอฮ์ แล้วอัลลอฮ์ก็ทรงช่วยท่านออกมา", en: "Prophet Yunus (peace be upon him) was swallowed by a big fish. In the darkness he called on Allah, asking forgiveness, and Allah saved him." },
        arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        reading: "ลาอิลาฮะ อิลลา อันตะ ซุบฮานะกะ อินนี กุนตุ มินัซซอลิมีน",
        meaning: { th: "ไม่มีพระเจ้าอื่นใดนอกจากพระองค์ มหาบริสุทธิ์แด่พระองค์ แท้จริงฉันเป็นส่วนหนึ่งของผู้อธรรม", en: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." },
      },
      {
        id: "ants",
        icon: "home",
        title: { th: "นบีสุลัยมานกับมด", en: "Prophet Sulayman and the ant" },
        body: { th: "มดตัวหนึ่งร้องเตือนเพื่อนๆ ให้รีบเข้ารัง จะได้ไม่ถูกกองทัพของนบีสุลัยมานเหยียบโดยไม่รู้ตัว นบีสุลัยมานได้ยินก็ยิ้ม และขอบคุณอัลลอฮ์", en: "An ant called out to the other ants to hurry into their homes, so that Sulayman's army would not crush them without noticing. Prophet Sulayman heard it, smiled, and thanked Allah." },
      },
      {
        id: "ibrahim-fire",
        icon: "sun",
        title: { th: "นบีอิบรอฮีมกับกองไฟ", en: "Prophet Ibrahim and the fire" },
        body: { th: "ผู้คนโยนนบีอิบรอฮีม (อะลัยฮิสสลาม) ลงในกองไฟ เพราะท่านไม่ยอมกราบไหว้รูปปั้น อัลลอฮ์ทรงสั่งให้ไฟเย็นลงและปลอดภัย ท่านจึงไม่เป็นอันตรายเลย", en: "People threw Prophet Ibrahim (peace be upon him) into a fire because he refused to worship statues. Allah commanded the fire to become cool and safe, so he was not harmed at all." },
        arabic: "يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ",
        reading: "ยา นารุ กูนี บัรดัน วะสะลามัน อะลา อิบรอฮีม",
        meaning: { th: "โอ้ไฟเอ๋ย จงเย็นและปลอดภัยแก่อิบรอฮีมเถิด", en: "O fire, be coolness and safety upon Abraham." },
      },
      {
        id: GARDEN_OWNERS_STORY.slug,
        icon: "tree",
        title: GARDEN_OWNERS_STORY.title,
        body: { th: GARDEN_OWNERS_STORY.pages[0].th, en: GARDEN_OWNERS_STORY.pages[0].en },
      },
    ],
    juniors: [
      {
        id: "kaaba",
        icon: "kaaba",
        title: { th: "สร้างบ้านของอัลลอฮ์", en: "Building the Kaaba" },
        body: { th: "นบีอิบรอฮีมและนบีอิสมาอีล (อะลัยฮิมัสสลาม) ช่วยกันยกฐานของกะอ์บะฮ์ ระหว่างทำงานท่านทั้งสองวิงวอนขอให้อัลลอฮ์ทรงรับการงานนั้น", en: "Prophet Ibrahim and Prophet Ismail (peace be upon them) raised the foundations of the Kaaba together. As they worked, they asked Allah to accept their work." },
        arabic: "رَبَّنَا تَقَبَّلْ مِنَّا",
        reading: "ร็อบบะนา ตะก็อบบัล มินนา",
        meaning: { th: "โอ้พระเจ้าของเรา โปรดทรงรับจากเราด้วยเถิด", en: "Our Lord, accept [this] from us." },
      },
      {
        id: "musa",
        icon: "wave",
        title: { th: "นบีมูซาข้ามทะเล", en: "Prophet Musa and the sea" },
        body: { th: "ฟิรเอาน์และทหารไล่ตามนบีมูซา (อะลัยฮิสสลาม) มาถึงริมทะเล ผู้คนกลัวว่าจะถูกจับ แต่ท่านมั่นใจในอัลลอฮ์ อัลลอฮ์ทรงให้ท่านตีทะเลด้วยไม้เท้า ทะเลจึงแยกออกเป็นทางเดิน", en: "Fir'awn and his soldiers chased Prophet Musa (peace be upon him) to the edge of the sea. The people were afraid of being caught, but he trusted Allah. Allah told him to strike the sea with his staff, and the sea parted into a path." },
        arabic: "كَلَّا إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ",
        reading: "กัลลา อินนะ มะอิยะ ร็อบบี ซะยะฮ์ดีน",
        meaning: { th: "ไม่หรอก แท้จริงพระเจ้าของฉันอยู่กับฉัน พระองค์จะทรงชี้ทางให้ฉัน", en: "No! Indeed, with me is my Lord; He will guide me." },
      },
      {
        id: "cave",
        icon: "cave",
        title: { th: "ชาวถ้ำ", en: "The people of the cave" },
        body: { th: "กลุ่มชายหนุ่มผู้ศรัทธาหนีไปหลบในถ้ำเพื่อรักษาความศรัทธาไว้ อัลลอฮ์ทรงให้พวกเขาหลับไปเป็นเวลาหลายร้อยปี แล้วจึงให้ตื่นขึ้นมา เป็นสัญญาณแห่งเดชานุภาพของพระองค์", en: "A group of believing young men hid in a cave to protect their faith. Allah made them sleep for hundreds of years and then woke them up, as a sign of His power." },
      },
      {
        id: "yusuf",
        icon: "well",
        title: { th: "นบียูซุฟผู้อดทน", en: "Patient Prophet Yusuf" },
        body: { th: "พี่ๆ ของนบียูซุฟ (อะลัยฮิสสลาม) โยนท่านลงบ่อน้ำ ท่านอดทนผ่านความยากลำบากมากมาย จนอัลลอฮ์ทรงให้ท่านมีตำแหน่งสูงในอียิปต์ เมื่อพี่ๆ มาหา ท่านให้อภัยพวกเขา", en: "Prophet Yusuf's (peace be upon him) brothers threw him into a well. He stayed patient through many hardships, until Allah gave him a high position in Egypt. When his brothers came to him, he forgave them." },
        arabic: "لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ",
        reading: "ลา ตัษรีบะ อะลัยกุมุล เยาม์",
        meaning: { th: "วันนี้ไม่มีการตำหนิพวกท่านแล้ว", en: "No blame will there be upon you today." },
      },
      {
        id: TWO_GARDENS_STORY.slug,
        icon: "tree",
        title: TWO_GARDENS_STORY.title,
        body: { th: TWO_GARDENS_STORY.pages[0].th, en: TWO_GARDENS_STORY.pages[0].en },
      },
    ],
  },
  {
    slug: "explore",
    robot: "/Character/idea.webp",
    intro: { th: "มองไปรอบตัว ทุกอย่างที่เราเห็นคือสิ่งที่อัลลอฮ์ทรงสร้าง", en: "Look around — everything we see was created by Allah." },
    kids: [
      {
        id: "sun",
        icon: "sun",
        title: { th: "ดวงอาทิตย์", en: "The Sun" },
        body: { th: "ดวงอาทิตย์ให้แสงสว่างและความอบอุ่น ช่วยให้ต้นไม้เติบโต ห้ามมองดวงอาทิตย์ตรงๆ นะ แสบตา", en: "The sun gives us light and warmth and helps plants grow. Never look straight at the sun, it hurts your eyes!" },
      },
      {
        id: "moon",
        icon: "moon",
        title: { th: "ดวงจันทร์", en: "The Moon" },
        body: { th: "ดวงจันทร์เปลี่ยนรูปทุกคืน จากเสี้ยวบางๆ จนเต็มดวง มุสลิมดูจันทร์เสี้ยวเพื่อนับวันเริ่มเดือนใหม่", en: "The moon changes shape every night, from a thin crescent to a full moon. Muslims look for the new crescent to start each new month." },
      },
      {
        id: "water",
        icon: "drop",
        title: { th: "น้ำ", en: "Water" },
        body: { th: "คน สัตว์ และต้นไม้ ทุกชีวิตต้องการน้ำ เราจึงใช้น้ำอย่างประหยัด ปิดก๊อกทุกครั้ง", en: "People, animals and plants: every living thing needs water. So we use water carefully and always turn off the tap." },
      },
      {
        id: "tree",
        icon: "tree",
        title: { th: "ต้นไม้", en: "Trees" },
        body: { th: "เมล็ดเล็กนิดเดียว งอกเป็นต้นไม้ใหญ่ ให้ร่มเงาและผลไม้ อย่างต้นอินทผลัม", en: "A tiny seed grows into a big tree that gives shade and fruit, like the date palm." },
      },
    ],
    juniors: [
      {
        id: "honey",
        icon: "honeycomb",
        title: { th: "ผึ้งกับน้ำผึ้ง", en: "Bees and honey" },
        body: { th: "ในอัลกุรอานมีซูเราะฮ์ชื่อ อันนะห์ล แปลว่าผึ้ง อัลลอฮ์ทรงบอกว่าจากท้องของผึ้งมีเครื่องดื่มหลากสี ซึ่งมีการรักษาสำหรับมนุษย์", en: "In the Qur'an there is a surah called An-Nahl, which means the bee. Allah tells us that from the bellies of bees comes a drink of many colours, in which there is healing for people." },
      },
      {
        id: "rain",
        icon: "cloud",
        title: { th: "ฝนมาจากไหน", en: "Where rain comes from" },
        body: { th: "แดดทำให้น้ำในทะเลระเหยเป็นไอ ลอยขึ้นไปรวมกันเป็นเมฆ เมื่อหยดน้ำในเมฆหนักขึ้นก็ตกลงมาเป็นฝน เมื่อฝนตก เราขอดุอาอ์ให้เป็นฝนที่มีประโยชน์", en: "The sun turns sea water into vapour, which rises and gathers into clouds. When the drops in the clouds get heavy, they fall as rain. When it rains, we ask Allah to make it a beneficial rain." },
      },
      {
        id: "mountain",
        icon: "mountain",
        title: { th: "ภูเขา", en: "Mountains" },
        body: { th: "อัลกุรอานเปรียบภูเขาเหมือนหลักตรึง ภูเขามีรากลึกลงไปใต้ดิน ยิ่งกว่าส่วนที่เรามองเห็นเสียอีก", en: "The Qur'an compares mountains to pegs. Mountains have deep roots under the ground, even bigger than the part we can see." },
      },
      {
        id: "day-night",
        icon: "globe",
        title: { th: "กลางวันกลางคืน", en: "Day and night" },
        body: { th: "โลกหมุนรอบตัวเองวันละหนึ่งรอบ ฝั่งที่หันเข้าหาดวงอาทิตย์เป็นกลางวัน อีกฝั่งเป็นกลางคืน เวลาละหมาดทั้งห้าก็กำหนดตามตำแหน่งของดวงอาทิตย์", en: "The Earth spins around once a day. The side facing the sun has day, and the other side has night. The times of the five prayers are set by the position of the sun." },
      },
    ],
  },
  {
    slug: "art",
    robot: "/Character/fighting.webp",
    intro: { th: "หยิบกระดาษกับสีมาเลย! วาดธรรมชาติ ลวดลาย และตัวอักษรที่สวยงาม", en: "Grab paper and colours! Draw nature, patterns and beautiful letters." },
    kids: [
      {
        id: "moon-star",
        icon: "moon",
        title: { th: "ระบายจันทร์เสี้ยวกับดาว", en: "Moon and star" },
        body: { th: "วาดจันทร์เสี้ยวกับดาวดวงเล็กๆ ระบายสีเหลือง แล้วระบายพื้นหลังเป็นสีฟ้าเข้มเหมือนท้องฟ้ายามค่ำ", en: "Draw a crescent moon and a little star and colour them yellow. Then colour the background dark blue, like the night sky." },
      },
      {
        id: "finger-tree",
        icon: "tree",
        title: { th: "ต้นไม้ลายนิ้วมือ", en: "Fingerprint tree" },
        body: { th: "วาดลำต้นสีน้ำตาล แล้วจุ่มนิ้วในสีเขียว แตะรอบๆ กิ่งให้เป็นใบไม้ เพิ่มสีแดงเป็นผลไม้ก็ได้", en: "Draw a brown trunk, then dip your finger in green paint and dab around the branches to make leaves. Add red for fruit if you like." },
      },
      {
        id: "shapes",
        icon: "home",
        title: { th: "ต่อรูปทรงเป็นมัสยิด", en: "Shape mosque" },
        body: { th: "ตัดกระดาษเป็นสี่เหลี่ยม ครึ่งวงกลม และสามเหลี่ยม แล้วนำมาต่อกันเป็นมัสยิด มีโดมและหออะซาน", en: "Cut paper into squares, half circles and triangles, then put them together to make a mosque with a dome and a minaret." },
      },
    ],
    juniors: [
      {
        id: "star8",
        icon: "star8",
        title: { th: "ดาวแปดแฉก", en: "Eight-point star" },
        body: { th: "วาดสี่เหลี่ยมจัตุรัสหนึ่งรูป แล้ววาดอีกรูปขนาดเท่ากันซ้อนทับ แต่หมุนเอียง 45 องศา จะได้ดาวแปดแฉก ลวดลายที่พบในศิลปะอิสลาม", en: "Draw a square, then draw another of the same size on top of it, turned 45 degrees. You get an eight-point star, a pattern found in Islamic art." },
      },
      {
        id: "eid-card",
        icon: "lantern",
        title: { th: "การ์ดวันอีด", en: "Eid card" },
        body: { th: "พับกระดาษครึ่งหนึ่ง วาดโคมไฟและดาวด้านหน้า ด้านในเขียนคำอวยพรให้ครอบครัว", en: "Fold a piece of paper in half, draw lanterns and stars on the front, and write a greeting for your family inside." },
        arabic: "عِيد مُبَارَك",
        reading: "อีด มุบาร็อก",
        meaning: { th: "ขอให้เป็นวันอีดที่จำเริญ", en: "Have a blessed Eid." },
      },
      {
        id: "calligraphy",
        icon: "pen",
        title: { th: "ฝึกเขียนอักษรอาหรับ", en: "Arabic lettering" },
        body: { th: "ใช้ปากกาหัวตัดหรือตะเกียบจุ่มหมึก ค่อยๆ เขียนตัวอักษร อะลิฟ บาอ์ ตาอ์ ให้ใหญ่และสวยงาม", en: "Use a chisel-tip pen, or a chopstick dipped in ink. Slowly write the letters Alif, Ba and Ta, big and beautiful." },
        arabic: "ا ب ت",
      },
      {
        id: "patterns",
        icon: "palette",
        title: { th: "ศิลปะแบบมุสลิม", en: "Muslim art" },
        body: { th: "นักวาดมุสลิมนิยมวาดลวดลายเรขาคณิต ดอกไม้ ใบไม้ และตัวอักษรที่สวยงาม ลองออกแบบลายของเราเองดูนะ", en: "Muslim artists love drawing geometric patterns, flowers, leaves and beautiful letters. Try designing your own pattern!" },
      },
    ],
  },
];

export function getIslandContent(slug: string) {
  return ISLAND_CONTENT.find((island) => island.slug === slug);
}
