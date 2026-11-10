import type { Cartoon, CartoonScene, Word } from "@/features/moral/cartoon";
import type { AgeId, AgeSection, GuidePose, GuideStep } from "@/features/moral/data";
import type { Lesson } from "@/lib/lessons";

/*
  เกาะ "เรียนรู้อิสลามพื้นฐานสำหรับเด็ก" (/learn/faith-basics) — หลักศรัทธาแนวสลัฟ แบบถาม-ตอบ ครูนูรีสอนเป็นการ์ตูน
  หน้าตาและส่วนประกอบเดียวกับเกาะสำรวจโลก (features/explore) และเกาะมารยาท (features/moral)

  เจ้าของโปรเจกต์สั่ง (10 พ.ย. 2026): "ทำสอนหลักศรัทธาแบบสลาฟี อัลเลาะฮ์อยู่ที่ไหน ที่นิยม และคำถามอื่นๆ
  ในหมู่ผู้ปกครองอาหรับสลาฟี นำเสนอคล้ายๆ ครูนูรีมาสอนแบบสำรวจโลก" · รอบแรก 6+6 บทตามรีวิวของ Fable (เจ้าของโปรเจกต์ให้ทำตาม)
  ผู้รู้ที่เป็นคน (นักเรียนศาสนาสายสลัฟ) จะตรวจทานหลังเปิดทดสอบแบบจำกัดผู้ใช้ — เจ้าของโปรเจกต์ 10 พ.ย. 2026

  ข้อความทุกบรรทัด Claude เขียนและตรวจเอง (AGENTS.md ข้อ 4) หลักฐานที่ตรวจใน Shamela / quran.com 10 พ.ย. 2026:
  - ثلاثة الأصول (محمد بن عبد الوهاب) https://shamela.ws/book/239/9 — «من ربك؟ فقل: ربي الله الذي رباني وربى جميع العالمين
    بنعمه وهو معبودي ليس لي معبود سواه» · «بم عرفت ربك؟ فقل: بآياته ومخلوقاته ومن آياته الليل والنهار والشمس والقمر»
  - ثلاثة الأصول https://shamela.ws/book/239/14 — الإسلام «الاستسلام لله بالتوحيد، والانقياد له بالطاعة، والخلوص من الشرك»
    · معنى الشهادة «لا معبود بحق إلا الله» · «(لا إله) نافيا جميع ما يعبد من دون الله، (إلا الله) مثبتا العبادة لله وحده»
  - ثلاثة الأصول https://shamela.ws/book/239/10 — أنواع العبادة: الدعاء والخوف والرجاء والتوكل ...
  - มุสลิม 537 https://shamela.ws/book/1727/1146 — «أين الله؟» قالت: في السماء. قال: «من أنا؟» قالت: أنت رسول الله. قال: «أعتقها فإنها مؤمنة»
  - มุสลิม 8 (หะดีษญิบรีล) https://shamela.ws/book/1727/62 — อิสลาม 5 (ฮัจญ์ «إن استطعت إليه سبيلا»), อีมาน 6
    («وتؤمن بالقدر خيره وشره»), เอี๊ยะซาน «أن تعبد الله كأنك تراه فإن لم تكن تراه فإنه يراك», ท้ายหะดีษ «فإنه جبريل أتاكم يعلمكم دينكم»
  - บุคอรี 8 https://shamela.ws/book/1681/19 — «بني الإسلام على خمس»
  - บุคอรี 46 https://shamela.ws/book/1681/89 — «خمس صلوات في اليوم والليلة»
  - มุสลิม 2996 https://shamela.ws/book/1727/7427 — «خلقت الملائكة من نور»
  - อัลกุรอาน (ใช้ความหมาย ไม่ยกตัวอาหรับ ไม่ให้นูรีอ่านอายะฮ์ — ข้อ 1.6; คำแปลไทย quran.com id 51 แก้เฉพาะคำพิมพ์ผิด "สถิตย์" → "สถิต"):
    20:5 «ผู้ทรงกรุณาปรานี ทรงสถิตอยู่บนบัลลังก์» · 42:11 ท่อน «ไม่มีสิ่งใดเสมอเหมือนพระองค์ และพระองค์เป็นผู้ทรงได้ยิน ผู้ทรงเห็น»
    อ้างใน comment (ไม่ยกเป็นคำแปลในบท): 39:62 ผู้ทรงสร้างทุกสิ่ง, 41:37 อย่ากราบดวงอาทิตย์/ดวงจันทร์, 40:60 จงวิงวอนต่อข้า,
    20:46 ข้าได้ยินและได้เห็น, 48:29 มุฮัมมัดเป็นร่อซูลของอัลลอฮ์, 67:16 และ 16:50 «يخافون ربهم من فوقهم» (คำว่า "เหนือ")
    16:50 คำแปลไทยฉบับนี้แปลว่า "ผู้ทรงอำนาจเหนือ" ซึ่งเป็นการตีความ จึงใช้เป็นหลักฐานของคำว่า "เหนือ" เท่านั้น ไม่ยกคำแปล

  ถ้อยคำอะกีดะฮ์ (handoff 2026-11-10 ข้อ 2.3):
  - في السماء = "เบื้องสูง เหนือชั้นฟ้าทั้งมวล" ห้ามเขียน "ในท้องฟ้า" · ห้าม "อัลลอฮ์อยู่ทุกที่" ทุกกรณี
    คำถาม "อัลลอฮ์เห็นหนูไหม" ตอบด้วยการรู้ การเห็น การได้ยิน · อิสติวาอ์: "ในแบบที่เหมาะสมกับพระองค์ ไม่ถามว่าเป็นอย่างไร" + 42:11
  - ชะฮาดะฮ์ = "ไม่มีผู้ใดสมควรได้รับการเคารพภักดีโดยชอบธรรม นอกจากอัลลอฮ์" · สรรพนามของอัลลอฮ์ = "พระองค์" ("ท่าน" ใช้กับนบี)
  - ชื่อนบีมุฮัมมัดมี ﷺ ทุกครั้ง (เสียง: ต่อคลิปมาตรฐาน scripts/voice-assets — memory nabi-salawat-standard-clip)
  - วัย 3–6 ไม่พูดเรื่องญิน ไม่ลงรายละเอียดซีฟาต นอกจาก ทรงสร้าง ทรงเห็น ทรงได้ยิน ทรงอยู่เบื้องสูง
  - ป้ายพูดตาม (Word) เป็นถ้อยคำจากหะดีษ/ثلاثة الأصول/ซิกรุ ไม่ใช่อายะฮ์ จึงให้นูรีพูดเป็นอาหรับได้ (th = คำอ่าน ไม่ใช่คำแปล)

  ภาพ: ห้ามวาดอัลลอฮ์ บัลลังก์ ฟ้าเจ็ดชั้นเป็นแผนผัง แสงที่สื่อว่าเป็นอัลลอฮ์หรือมลาอิกะฮ์ คน นบี และคนกราบ
  ใช้ท้องฟ้า ดาว ภูเขา ทะเล มุศฮัฟ พรมละหมาด หุ่นยนต์ — ฉากใหม่อยู่ที่ /faith/scenes/ (Codex สร้าง) ฉากที่ใช้ซ้ำมาจากเกาะสำรวจโลก/มารยาท

  เสียงพากย์สร้างจากข้อความไทยในไฟล์นี้โดยตรง (scripts/make-faith-voice.mjs) ไฟล์นี้จึง import ได้แค่ type
*/

export const AGE_SECTIONS: Record<AgeId, AgeSection> = {
  kids: {
    label: { th: "วัย 3-6 ปี", en: "Ages 3-6" },
    desc: { th: "คำถามสำคัญที่มุสลิมตัวน้อยตอบได้", en: "Important questions little Muslims can answer" },
    badge: "/moral/age-kids.webp",
  },
  juniors: {
    label: { th: "วัย 7 ปีขึ้นไป", en: "Ages 7+" },
    desc: { th: "หลักพื้นฐานของอิสลามและอีมาน", en: "The foundations of Islam and iman" },
    badge: "/moral/age-juniors.webp",
  },
};

/* บทของหุ่นยนต์นำทางหน้า */
export const GUIDE_STEPS: GuideStep[] = [
  {
    clip: "faith-intro",
    pose: "wave",
    th: "อัสสะลามุอะลัยกุม ยินดีต้อนรับสู่เกาะเรียนรู้อิสลาม มาตอบคำถามสำคัญที่มุสลิมทุกคนต้องรู้ไปด้วยกันนะ",
    en: "Assalamu alaikum! Welcome to the Islam island. Let's answer the important questions every Muslim should know.",
    ms: 6500,
  },
  {
    clip: "faith-kids",
    pose: "point",
    focus: "kids",
    th: "น้องวัย 3-6 ขวบ กดปุ่มสีเหลือง มาฝึกตอบว่า ใครคือพระเจ้าของหนู และอัลลอฮ์ทรงอยู่ที่ไหน",
    en: "Ages 3-6: tap the yellow button to practise answering who your Lord is and where Allah is.",
    ms: 6500,
  },
  {
    clip: "faith-juniors",
    pose: "point",
    focus: "juniors",
    th: "พี่ๆ 7 ขวบขึ้นไป กดปุ่มสีเขียว ไปเรียนหลักพื้นฐานของอิสลาม อีมาน และเอี๊ยะซาน",
    en: "Ages 7+: tap the green button to learn the foundations of Islam, iman and ihsan.",
    ms: 6000,
  },
];

/* ภาพการ์ดของแต่ละบท (Codex สร้าง: สิ่งของเท่านั้น ไม่มีคน ไม่มีตัวอักษร) */
export const CARD_ART: Record<string, string> = {
  "faith-rabbi": "/faith/card-rabbi.webp",
  "faith-dini": "/faith/card-dini.webp",
  "faith-nabiyyi": "/faith/card-nabiyyi.webp",
  "faith-aina": "/faith/card-aina.webp",
  "faith-khaliq": "/faith/card-khaliq.webp",
  "faith-dua": "/faith/card-dua.webp",
  "faith-usul": "/faith/card-usul.webp",
  "faith-aina-j": "/faith/card-aina-j.webp",
  "faith-shahada": "/faith/card-shahada.webp",
  "faith-islam": "/faith/card-islam.webp",
  "faith-iman": "/faith/card-iman.webp",
  "faith-ihsan": "/faith/card-ihsan.webp",
};

export const LESSONS: Record<AgeId, Lesson[]> = {
  kids: [
    { evidence: ["scholar-thalathat-al-usul-9"], id: "faith-rabbi", icon: "globe", title: { th: "ใครคือพระเจ้าของหนู", en: "Who is your Lord?" }, body: { th: "พระเจ้าของหนูคืออัลลอฮ์ ผู้ทรงสร้างและดูแลทุกสิ่ง", en: "My Lord is Allah, who created and cares for everything." } },
    { evidence: ["scholar-thalathat-al-usul-14"], id: "faith-dini", icon: "mat", title: { th: "ศาสนาของหนูคืออะไร", en: "What is your religion?" }, body: { th: "ศาสนาของหนูคืออิสลาม", en: "My religion is Islam." } },
    { evidence: ["quran-48-29"], id: "faith-nabiyyi", icon: "mushaf", title: { th: "นบีของหนูคือใคร", en: "Who is your Prophet?" }, body: { th: "นบีของหนูคือท่านนบีมุฮัมมัด ﷺ", en: "My Prophet is Muhammad ﷺ." } },
    { evidence: ["muslim-537","quran-16-50","quran-67-16","quran-42-11","quran-20-46"], id: "faith-aina", icon: "cloud", title: { th: "อัลลอฮ์ทรงอยู่ที่ไหน", en: "Where is Allah?" }, body: { th: "อัลลอฮ์ทรงอยู่เบื้องสูง เหนือชั้นฟ้าทั้งมวล และทรงเห็นหนูเสมอ", en: "Allah is above, over all the heavens, and He always sees you." } },
    { evidence: ["quran-39-62","quran-41-37"], id: "faith-khaliq", icon: "mountain", title: { th: "ใครสร้างทุกสิ่ง", en: "Who created everything?" }, body: { th: "อัลลอฮ์ทรงสร้างทุกสิ่ง เรากราบอัลลอฮ์องค์เดียว", en: "Allah created everything, so we prostrate to Allah alone." } },
    { evidence: ["quran-40-60","scholar-thalathat-al-usul-10"], id: "faith-dua", icon: "lantern", title: { th: "เราขอดุอาอ์จากใคร", en: "Whom do we ask in du'a?" }, body: { th: "เราขอดุอาอ์จากอัลลอฮ์องค์เดียว พระองค์ทรงได้ยินเราเสมอ", en: "We make du'a to Allah alone. He always hears us." } },
  ],
  juniors: [
    { evidence: ["scholar-thalathat-al-usul-9","scholar-thalathat-al-usul-14"], id: "faith-usul", icon: "mushaf", title: { th: "หลักพื้นฐานสามประการ", en: "The three fundamentals" }, body: { th: "รู้จักพระเจ้าของเรา ศาสนาของเรา และนบีของเรา", en: "Knowing our Lord, our religion and our Prophet." } },
    { evidence: ["muslim-537","quran-20-5","quran-42-11"], id: "faith-aina-j", icon: "cloud", title: { th: "อัลลอฮ์ทรงอยู่ที่ไหน", en: "Where is Allah?" }, body: { th: "อัลลอฮ์ทรงอยู่เบื้องสูง ทรงสถิตอยู่บนบัลลังก์ ไม่มีสิ่งใดเสมอเหมือนพระองค์", en: "Allah is above, established over the Throne. There is nothing like Him." } },
    { evidence: ["scholar-thalathat-al-usul-14","scholar-thalathat-al-usul-10","bukhari-8","quran-48-29"], id: "faith-shahada", icon: "heart", title: { th: "ความหมายของลาอิลาฮะอิลลัลลอฮ์", en: "The meaning of La ilaha illallah" }, body: { th: "ไม่มีผู้ใดสมควรได้รับการเคารพภักดีโดยชอบธรรม นอกจากอัลลอฮ์", en: "None has the right to be worshipped except Allah." } },
    { evidence: ["bukhari-8","bukhari-46","muslim-8"], id: "faith-islam", icon: "kaaba", title: { th: "รุก่นอิสลามห้าประการ", en: "The five pillars of Islam" }, body: { th: "ปฏิญาณตน ละหมาด ซะกาต ถือศีลอด และฮัจญ์", en: "The testimony, prayer, zakah, fasting and Hajj." } },
    { evidence: ["muslim-8","muslim-2996","muslim-2653","quran-81-29","quran-39-7"], id: "faith-iman", icon: "moon", title: { th: "รุก่นอีมานหกประการ", en: "The six pillars of iman" }, body: { th: "ศรัทธาต่ออัลลอฮ์ มลาอิกะฮ์ คัมภีร์ ร่อซูล วันสุดท้าย และกอดัร", en: "Belief in Allah, His angels, books, messengers, the Last Day and the decree." } },
    { evidence: ["muslim-8"], id: "faith-ihsan", icon: "heart", title: { th: "เอี๊ยะซาน", en: "Ihsan" }, body: { th: "เคารพภักดีอัลลอฮ์เสมือนว่าเราเห็นพระองค์", en: "Worshipping Allah as though we see Him." } },
  ],
};

/* ---------- การ์ตูน ---------- */

// ฉากใหม่ของเกาะนี้ / ฉากที่ใช้ซ้ำจากเกาะสำรวจโลกและเกาะมารยาท (ภาพเดิมที่อนุมัติแล้ว)
const F = (name: string) => `/faith/scenes/${name}.webp`;
const X = (name: string) => `/explore/scenes/${name}.webp`;
const CLASS = "/moral/scenes/class.webp";
const SKY = F("sky");          // ท้องฟ้ากว้างเหนือเกาะ เมฆบางๆ — ไม่มีบัลลังก์ ไม่มีแสงลำ ไม่มีดวงอาทิตย์มีหน้า
const QURAN = F("quran");      // มุศฮัฟเปิดบนแท่นไม้ (เราะฮัล) ในห้องสงบ
const PRAYER = F("prayer");    // พรมละหมาดกับเหยือกน้ำวุฎูอ์ ไม่มีคน
const DUA = F("dua");          // พรมละหมาดกับโคมไฟยามเย็น ฟ้าสีส้มอ่อน
const PILLARS = F("pillars");  // อาคารสีขาวมีเสาทองห้าต้นบนเกาะ (ไม่ใช่มัสยิด ไม่มีโดม/หออะซาน)
// ฟ้ากลางคืนไม่มีสัตว์ (ฉาก desert-night ของเกาะสำรวจโลกมีจิ้งจอก) — ใช้ภาพการ์ด aina-j เป็นฉาก
const NIGHT = "/faith/card-aina-j.webp";
const GARDEN = X("garden-arrive");
const SEA = X("sea-arrive");
const MOUNTAIN = X("mountain-arrive");

const RABBI: Word = { ar: "رَبِّيَ اللهُ", th: "ร็อบบิยัลลอฮ์" };
const DINI: Word = { ar: "دِينِيَ الْإِسْلَامُ", th: "ดีนิยัลอิสลาม" };
const NABIYYI: Word = { ar: "نَبِيِّي مُحَمَّدٌ ﷺ", th: "นะบียฺยี มุฮัมมัด" };
const FISSAMA: Word = { ar: "فِي السَّمَاءِ", th: "ฟิสสะมาอ์" };
const SUBHANALLAH: Word = { ar: "سُبْحَانَ اللهِ", th: "ซุบฮานัลลอฮ์" };
const YA_ALLAH: Word = { ar: "يَا اللهُ", th: "ยาอัลลอฮ์" };
const SHAHADA: Word = { ar: "لَا إِلَهَ إِلَّا اللهُ", th: "ลาอิลาฮะอิลลัลลอฮ์" };

type SceneExtra = Partial<Pick<CartoonScene, "word" | "sayAlong">>;

// หนึ่งฉาก — ms = เวลาแสดงเมื่อไม่มีเสียง (ประมาณจากความยาวข้อความ)
function scene(bg: string, clip: string, pose: GuidePose, th: string, en: string, extra: SceneExtra = {}): CartoonScene {
  return { bg, clip, pose, th, en, ms: Math.max(4500, th.length * 65), ...extra };
}
// ฉากให้เด็กพูดตาม — ป้ายคำขึ้นเฉพาะฉากนี้
const say = (bg: string, clip: string, word: Word, th: string, en: string) =>
  scene(bg, clip, "wave", th, en, { word, sayAlong: true });

export const CARTOONS: Record<string, Cartoon> = {
  /* ---------- วัย 3-6 ปี ---------- */

  // ثلاثة الأصول หน้า 9 «من ربك؟ فقل: ربي الله الذي رباني ...»
  "faith-rabbi": {
    evidence: ["scholar-thalathat-al-usul-9"],
    scenes: [
      scene(CLASS, "faith-k-rabbi-1", "wave",
        "อัสสะลามุอะลัยกุม วันนี้ครูมีคำถามสำคัญมาถามหนูนะ",
        "Assalamu alaikum! Today I have an important question for you."),
      scene(CLASS, "faith-k-rabbi-2", "point",
        "ถ้ามีคนถามว่า ใครคือพระเจ้าของหนู หนูตอบว่า พระเจ้าของหนูคืออัลลอฮ์",
        "If someone asks, \"Who is your Lord?\", you answer, \"My Lord is Allah.\""),
      scene(GARDEN, "faith-k-rabbi-3", "point",
        "อัลลอฮ์ทรงสร้างหนู ทรงให้อาหาร ให้น้ำ และทรงดูแลทุกสิ่ง",
        "Allah created you. He gives you food and water and takes care of everything."),
      say(CLASS, "faith-k-rabbi-4", RABBI,
        "มาพูดตามครูนะ ร็อบบิยัลลอฮ์ แปลว่า พระเจ้าของหนูคืออัลลอฮ์",
        "Say it with me: Rabbiyallah. It means \"My Lord is Allah.\""),
    ],
  },

  // ثلاثة الأصول หน้า 14 — อิสลาม = ยอมจำนนต่ออัลลอฮ์ด้วยเตาฮีด เชื่อฟังพระองค์ และพ้นจากชิริก
  "faith-dini": {
    evidence: ["scholar-thalathat-al-usul-14"],
    scenes: [
      scene(CLASS, "faith-k-dini-1", "wave",
        "คำถามที่สองนะ ศาสนาของหนูคืออะไร",
        "Here is the second question: what is your religion?"),
      scene(CLASS, "faith-k-dini-2", "point",
        "หนูตอบว่า ศาสนาของหนูคืออิสลาม",
        "You answer, \"My religion is Islam.\""),
      scene(PRAYER, "faith-k-dini-3", "point",
        "อิสลามคือการเชื่อฟังอัลลอฮ์ เคารพภักดีพระองค์องค์เดียว และทำตามที่พระองค์ทรงสั่ง เช่น ละหมาด",
        "Islam means obeying Allah, worshipping Him alone and doing what He commands, like praying."),
      say(CLASS, "faith-k-dini-4", DINI,
        "มาพูดตามครูนะ ดีนิยัลอิสลาม แปลว่า ศาสนาของหนูคืออิสลาม",
        "Say it with me: Diniyal Islam. It means \"My religion is Islam.\""),
    ],
  },

  // ثلاثة الأصول (ونبيه محمدا ﷺ) · 48:29 มุฮัมมัดเป็นร่อซูลของอัลลอฮ์ · ห้ามวาดอะไรแทนตัวท่าน
  "faith-nabiyyi": {
    evidence: ["quran-48-29"],
    scenes: [
      scene(CLASS, "faith-k-nabiyyi-1", "wave",
        "คำถามที่สามนะ นบีของหนูคือใคร",
        "Here is the third question: who is your Prophet?"),
      scene(CLASS, "faith-k-nabiyyi-2", "point",
        "หนูตอบว่า นบีของหนูคือท่านนบีมุฮัมมัด ﷺ",
        "You answer, \"My Prophet is Muhammad ﷺ.\""),
      scene(QURAN, "faith-k-nabiyyi-3", "point",
        "ท่านนบี ﷺ เป็นศาสนทูตของอัลลอฮ์ ท่านสอนให้เรารู้จักอัลลอฮ์ และสอนอัลกุรอาน",
        "The Prophet ﷺ is the Messenger of Allah. He taught us about Allah and taught us the Quran."),
      scene(CLASS, "faith-k-nabiyyi-4", "point",
        "เรารักท่านนบี ﷺ และทำตามสิ่งที่ท่านสอน",
        "We love the Prophet ﷺ and follow what he taught."),
      say(CLASS, "faith-k-nabiyyi-5", NABIYYI,
        "มาพูดตามครูนะ นะบียฺยี มุฮัมมัด แปลว่า นบีของหนูคือท่านนบีมุฮัมมัด ﷺ",
        "Say it with me: Nabiyyi Muhammad. It means \"My Prophet is Muhammad ﷺ.\""),
    ],
  },

  // มุสลิม 537 «أين الله؟» قالت: في السماء ... «فإنها مؤمنة» · 16:50/67:16 เบื้องสูง · 42:11, 20:46 ทรงได้ยิน ทรงเห็น
  // ห้าม "ในท้องฟ้า" และห้าม "อยู่ทุกที่" (handoff 2.3)
  "faith-aina": {
    evidence: ["muslim-537","quran-16-50","quran-67-16","quran-42-11","quran-20-46"],
    scenes: [
      scene(CLASS, "faith-k-aina-1", "wave",
        "หนูรู้ไหม อัลลอฮ์ทรงอยู่ที่ไหน",
        "Do you know where Allah is?"),
      scene(SKY, "faith-k-aina-2", "point",
        "อัลลอฮ์ทรงอยู่เบื้องสูง เหนือชั้นฟ้าทั้งมวล สูงกว่าทุกสิ่ง",
        "Allah is above, over all the heavens, higher than everything."),
      scene(SKY, "faith-k-aina-3", "point",
        "ท่านนบี ﷺ เคยถามผู้หญิงคนหนึ่งว่า อัลลอฮ์อยู่ที่ไหน นางตอบว่า อยู่เบื้องสูง เหนือชั้นฟ้าทั้งมวล ท่านนบี ﷺ บอกว่า นางเป็นผู้ศรัทธา",
        "The Prophet ﷺ once asked a woman, \"Where is Allah?\" She said, \"Above all the heavens.\" The Prophet ﷺ said she was a believer."),
      scene(GARDEN, "faith-k-aina-4", "point",
        "อัลลอฮ์ทรงอยู่เบื้องสูง แต่ทรงเห็นและทรงได้ยินหนูเสมอ ไม่มีอะไรซ่อนจากพระองค์ได้",
        "Allah is above, yet He always sees you and hears you. Nothing is hidden from Him."),
      say(CLASS, "faith-k-aina-5", FISSAMA,
        "ถ้ามีคนถามว่า อัลลอฮ์อยู่ที่ไหน ให้ตอบว่า ฟิสสะมาอ์ แปลว่า อยู่เบื้องสูง เหนือชั้นฟ้าทั้งมวล มาพูดตามครูนะ",
        "If someone asks where Allah is, answer: Fis-sama, meaning \"above all the heavens\". Say it with me."),
    ],
  },

  // 39:62 ผู้ทรงสร้างทุกสิ่ง · 41:37 อย่ากราบดวงอาทิตย์และดวงจันทร์ จงกราบอัลลอฮ์ผู้ทรงสร้างพวกมัน (ไม่วาดใครกราบ)
  "faith-khaliq": {
    evidence: ["quran-39-62","quran-41-37"],
    scenes: [
      scene(SEA, "faith-k-khaliq-1", "wave",
        "ดูสิ ทะเล ภูเขา ต้นไม้ และสัตว์มากมาย ใครเป็นผู้สร้าง",
        "Look at the sea, the mountains, the trees and so many animals. Who created them?"),
      scene(MOUNTAIN, "faith-k-khaliq-2", "point",
        "อัลลอฮ์ทรงสร้างทุกสิ่ง ทั้งท้องฟ้า แผ่นดิน และตัวหนูด้วย",
        "Allah created everything: the sky, the earth, and you too."),
      scene(NIGHT, "faith-k-khaliq-3", "point",
        "ดวงอาทิตย์ ดวงจันทร์ และดวงดาว ก็เป็นสิ่งที่อัลลอฮ์ทรงสร้าง เราจึงไม่กราบไหว้มัน เรากราบอัลลอฮ์องค์เดียว",
        "The sun, the moon and the stars were created by Allah too. So we never bow to them. We prostrate to Allah alone."),
      say(GARDEN, "faith-k-khaliq-4", SUBHANALLAH,
        "เห็นสิ่งที่อัลลอฮ์ทรงสร้างแล้ว เรากล่าวว่า ซุบฮานัลลอฮ์ มาพูดตามครูนะ",
        "When we see what Allah created, we say Subhanallah. Say it with me."),
    ],
  },

  // 40:60 จงวิงวอนขอต่อข้า ข้าจะตอบรับ · ثلاثة الأصول หน้า 10 ดุอาอ์เป็นอิบาดะฮ์ (ไม่วาดสิ่งที่คนขอผิดๆ)
  // ห้ามสื่อว่าขอให้คนที่อยู่ตรงหน้าช่วยในสิ่งที่เขาทำได้เป็นเรื่องผิด — ชิริกคือการขอดุอาอ์ต่อสิ่งอื่นนอกจากอัลลอฮ์ (รีวิว Fable 10 พ.ย.)
  "faith-dua": {
    evidence: ["quran-40-60","scholar-thalathat-al-usul-10"],
    scenes: [
      scene(DUA, "faith-k-dua-1", "wave",
        "เวลาหนูกลัว หรือไม่สบาย หรืออยากให้อัลลอฮ์ช่วย หนูขอดุอาอ์จากใคร",
        "When you feel scared, or unwell, or want Allah's help, whom do you make du'a to?"),
      scene(DUA, "faith-k-dua-2", "point",
        "เราขอดุอาอ์จากอัลลอฮ์องค์เดียว พระองค์ทรงได้ยินเราเสมอ",
        "We make du'a to Allah alone. He always hears us."),
      scene(DUA, "faith-k-dua-3", "point",
        "เราไม่ขอดุอาอ์จากสิ่งที่อัลลอฮ์ทรงสร้าง เช่น ดวงอาทิตย์ ดวงดาว หรือก้อนหิน เราขอดุอาอ์จากอัลลอฮ์เท่านั้น",
        "We never make du'a to things Allah created, like the sun, the stars or stones. We make du'a to Allah only."),
      say(DUA, "faith-k-dua-4", YA_ALLAH,
        "เวลาขอดุอาอ์ หนูเรียกว่า ยาอัลลอฮ์ มาพูดตามครูนะ",
        "When you make du'a, you call, \"Ya Allah.\" Say it with me."),
    ],
  },

  /* ---------- วัย 7 ปีขึ้นไป ---------- */

  // ثلاثة الأصول หน้า 9 และ 14
  "faith-usul": {
    evidence: ["scholar-thalathat-al-usul-9","scholar-thalathat-al-usul-14"],
    scenes: [
      scene(CLASS, "faith-j-usul-1", "wave",
        "วันนี้เราจะเรียนหลักพื้นฐานสามประการ ที่มุสลิมทุกคนต้องรู้",
        "Today we learn the three fundamentals that every Muslim must know."),
      scene(CLASS, "faith-j-usul-2", "point",
        "คือ รู้จักพระเจ้าของเรา รู้จักศาสนาของเรา และรู้จักนบีของเรา ท่านนบีมุฮัมมัด ﷺ",
        "They are knowing our Lord, knowing our religion, and knowing our Prophet, Muhammad ﷺ."),
      scene(GARDEN, "faith-j-usul-3", "point",
        "ถ้ามีคนถามว่า ใครคือพระเจ้าของเธอ ให้ตอบว่า พระเจ้าของฉันคืออัลลอฮ์ ผู้ทรงเลี้ยงดูฉันและทุกสิ่งด้วยความโปรดปรานของพระองค์ และพระองค์คือผู้เดียวที่ฉันเคารพภักดี",
        "If someone asks who your Lord is, answer: \"My Lord is Allah, who nurtures me and all creation with His blessings, and He is the only one I worship.\""),
      scene(NIGHT, "faith-j-usul-4", "point",
        "เรารู้จักพระองค์จากสัญญาณและสิ่งที่พระองค์ทรงสร้าง เช่น กลางคืน กลางวัน ดวงอาทิตย์ และดวงจันทร์",
        "We know Him through His signs and His creation, such as the night, the day, the sun and the moon."),
      scene(PRAYER, "faith-j-usul-5", "point",
        "ศาสนาของเราคืออิสลาม คือการยอมจำนนต่ออัลลอฮ์ด้วยเตาฮีด คือเคารพภักดีพระองค์องค์เดียว เชื่อฟังพระองค์ และไม่ตั้งภาคีกับพระองค์",
        "Our religion is Islam: submitting to Allah with tawhid, worshipping Him alone, obeying Him, and staying free of shirk."),
      say(CLASS, "faith-j-usul-6", RABBI,
        "มาพูดคำตอบแรกด้วยกันนะ ร็อบบิยัลลอฮ์",
        "Let's say the first answer together: Rabbiyallah."),
    ],
  },

  // มุสลิม 537 · 20:5 (คำแปลไทย quran.com 51) · 42:11 · بلا كيف ไม่ตีความ ไม่เปรียบเทียบ · ห้าม "อยู่ทุกที่"
  "faith-aina-j": {
    evidence: ["muslim-537","quran-20-5","quran-42-11"],
    scenes: [
      scene(CLASS, "faith-j-aina-1", "wave",
        "มีคำถามหนึ่งที่ท่านนบี ﷺ เคยถาม คือ อัลลอฮ์อยู่ที่ไหน",
        "There is a question the Prophet ﷺ once asked: where is Allah?"),
      scene(SKY, "faith-j-aina-2", "point",
        "ผู้หญิงคนหนึ่งตอบว่า ฟิสสะมาอ์ คืออยู่เบื้องสูง เหนือชั้นฟ้าทั้งมวล ท่านนบี ﷺ บอกว่า นางเป็นผู้ศรัทธา",
        "A woman answered, \"Fis-sama\", meaning above all the heavens. The Prophet ﷺ said she was a believer."),
      scene(SKY, "faith-j-aina-3", "point",
        "อัลกุรอานบอกว่า ผู้ทรงกรุณาปรานี ทรงสถิตอยู่บนบัลลังก์",
        "The Quran says: \"The Most Merciful above the Throne established.\""),
      scene(SKY, "faith-j-aina-4", "point",
        "อัลลอฮ์ทรงอยู่สูงเหนือบัลลังก์ ในแบบที่เหมาะสมกับพระองค์ เราเชื่อตามที่พระองค์บอก เราไม่รู้ว่าเป็นอย่างไร และไม่เปรียบพระองค์กับสิ่งใด",
        "Allah is high above the Throne in the way that befits Him. We believe what He told us. We do not know how, and we never compare Him to anything."),
      scene(QURAN, "faith-j-aina-5", "point",
        "อัลกุรอานบอกว่า ไม่มีสิ่งใดเสมอเหมือนพระองค์ และพระองค์เป็นผู้ทรงได้ยิน ผู้ทรงเห็น",
        "The Quran says: \"There is nothing like unto Him, and He is the Hearing, the Seeing.\""),
      scene(GARDEN, "faith-j-aina-6", "point",
        "พระองค์ทรงอยู่เบื้องสูง และทรงรู้ ทรงเห็น ทรงได้ยินทุกสิ่ง ไม่ว่าเราจะอยู่ที่ไหน ไม่มีอะไรซ่อนจากพระองค์ได้",
        "He is above, and He knows, sees and hears everything wherever we are. Nothing is hidden from Him."),
      say(CLASS, "faith-j-aina-7", FISSAMA,
        "มาพูดตามครูนะ ฟิสสะมาอ์",
        "Say it with me: Fis-sama."),
    ],
  },

  // ثلاثة الأصول หน้า 14 (معنى الشهادة) และหน้า 10 (أنواع العبادة) · บุคอรี 8 · 48:29
  "faith-shahada": {
    evidence: ["scholar-thalathat-al-usul-14","scholar-thalathat-al-usul-10","bukhari-8","quran-48-29"],
    scenes: [
      scene(CLASS, "faith-j-shahada-1", "wave",
        "ประโยคที่ยิ่งใหญ่ที่สุดของอิสลาม คือ ลาอิลาฮะอิลลัลลอฮ์",
        "The greatest sentence in Islam is La ilaha illallah."),
      scene(CLASS, "faith-j-shahada-2", "point",
        "ความหมายคือ ไม่มีผู้ใดสมควรได้รับการเคารพภักดีโดยชอบธรรม นอกจากอัลลอฮ์",
        "It means: none has the right to be worshipped except Allah."),
      scene(CLASS, "faith-j-shahada-3", "point",
        "ลาอิลาฮะ ปฏิเสธทุกสิ่งที่ถูกเคารพภักดีนอกจากอัลลอฮ์ อิลลัลลอฮ์ ยืนยันว่าการเคารพภักดีเป็นของอัลลอฮ์องค์เดียว",
        "La ilaha rejects everything worshipped besides Allah. Illallah affirms that worship belongs to Allah alone."),
      scene(DUA, "faith-j-shahada-4", "point",
        "การละหมาด การขอดุอาอ์ และการมอบหมายต่ออัลลอฮ์ เราทำเพื่ออัลลอฮ์องค์เดียว ไม่ตั้งภาคีกับพระองค์",
        "Prayer, du'a and putting our trust: we do these for Allah alone, without associating partners with Him."),
      scene(QURAN, "faith-j-shahada-5", "point",
        "และเราปฏิญาณว่า ท่านนบีมุฮัมมัด ﷺ เป็นศาสนทูตของอัลลอฮ์",
        "And we testify that Muhammad ﷺ is the Messenger of Allah."),
      say(CLASS, "faith-j-shahada-6", SHAHADA,
        "มาพูดตามครูนะ ลาอิลาฮะอิลลัลลอฮ์",
        "Say it with me: La ilaha illallah."),
    ],
  },

  // บุคอรี 8 «بني الإسلام على خمس» · บุคอรี 46 ละหมาดห้าเวลา · มุสลิม 8 ฮัจญ์ «إن استطعت إليه سبيلا»
  "faith-islam": {
    evidence: ["bukhari-8","bukhari-46","muslim-8"],
    scenes: [
      scene(PILLARS, "faith-j-islam-1", "wave",
        "อิสลามตั้งอยู่บนรากฐานห้าประการ เหมือนอาคารที่มีเสาห้าต้น",
        "Islam is built on five pillars, like a building standing on five columns."),
      scene(PILLARS, "faith-j-islam-2", "point",
        "หนึ่ง ปฏิญาณว่าไม่มีผู้ใดสมควรได้รับการเคารพภักดีโดยชอบธรรมนอกจากอัลลอฮ์ และท่านนบีมุฮัมมัด ﷺ เป็นศาสนทูตของอัลลอฮ์",
        "One: testifying that none has the right to be worshipped except Allah, and that Muhammad ﷺ is the Messenger of Allah."),
      scene(PRAYER, "faith-j-islam-3", "point",
        "สอง ดำรงการละหมาด วันละห้าเวลา",
        "Two: establishing the prayer, five times every day and night."),
      scene(PILLARS, "faith-j-islam-4", "point",
        "สาม จ่ายซะกาต",
        "Three: giving zakah."),
      scene(PILLARS, "faith-j-islam-4b", "point",
        "สี่ ถือศีลอดในเดือนเราะมะฎอน",
        "Four: fasting in Ramadan."),
      scene(PILLARS, "faith-j-islam-5", "point",
        "ห้า ไปทำฮัจญ์ที่บัยตุลลอฮ์ สำหรับคนที่มีความสามารถ",
        "Five: performing Hajj to the House of Allah, for those who are able."),
      scene(PILLARS, "faith-j-islam-6", "wave",
        "ห้าข้อนี้คือรุก่นอิสลาม มุสลิมทุกคนต้องรู้และปฏิบัติ",
        "These five are the pillars of Islam. Every Muslim must know them and practise them."),
    ],
  },

  // มุสลิม 8 (อีมาน 6, «وتؤمن بالقدر خيره وشره») · มุสลิม 2996 «خلقت الملائكة من نور» (ไม่วาดมลาอิกะฮ์)
  "faith-iman": {
    evidence: ["muslim-8","muslim-2996","muslim-2653","quran-81-29","quran-39-7"],
    scenes: [
      scene(NIGHT, "faith-j-iman-1", "wave",
        "เมื่อญิบรีลมาถามท่านนบี ﷺ เรื่องอีมาน ท่านนบี ﷺ ตอบว่า มีหกประการ",
        "When Jibril asked the Prophet ﷺ about iman, the Prophet ﷺ answered that it has six pillars."),
      scene(QURAN, "faith-j-iman-2", "point",
        "ศรัทธาต่ออัลลอฮ์ ศรัทธาต่อมลาอิกะฮ์ของพระองค์ และศรัทธาต่อคัมภีร์ทั้งหลายของพระองค์",
        "Believing in Allah, in His angels, and in His books."),
      scene(QURAN, "faith-j-iman-3", "point",
        "ศรัทธาต่อบรรดาร่อซูลของพระองค์ ศรัทธาต่อวันสุดท้าย และศรัทธาต่อกอดัร ทั้งสิ่งดีและสิ่งไม่ดี",
        "Believing in His messengers, in the Last Day, and in the decree, both the good and the bad."),
      scene(NIGHT, "faith-j-iman-4", "point",
        "มลาอิกะฮ์ถูกสร้างจากแสง ตามปกติเรามองไม่เห็นพวกเขา แต่เราเชื่อตามที่อัลลอฮ์และท่านนบี ﷺ บอก",
        "The angels were created from light. Normally we cannot see them, but we believe what Allah and the Prophet ﷺ told us."),
      // เจ้าของโปรเจกต์ 10 พ.ย. 2026: เพิ่ม "ทรงรู้ และให้เกิดขึ้นตามความประสงค์ของพระองค์" + ความประสงค์สองแบบ
      // ใช้ "ทรงให้เกิดขึ้น" ไม่ใช้ "ทรงอนุญาต" — ภาษาไทย "อนุญาต" ฟังเหมือนทรงยินยอม/รับรองความชั่ว (ปนกับ إرادة شرعية)
      // ระดับของกอดัร: ทรงรู้ (علم) ทรงบันทึก (كتابة) ทรงประสงค์ (مشيئة) ทรงสร้าง (خلق) — มุสลิม 2653 «كتب الله مقادير الخلائق قبل أن يخلق السماوات والأرض بخمسين ألف سنة»
      // ความประสงค์สองแบบ: الإرادة الكونية (ทุกสิ่งที่เกิดขึ้น ทั้งดีและไม่ดี) / الإرادة الشرعية (สิ่งที่ทรงรักและทรงสั่งใช้)
      //   อัลกุรอาน 81:29 (ความประสงค์ที่ครอบคลุมทุกสิ่ง) · 39:7 (ไม่ทรงพอพระทัยการปฏิเสธศรัทธา) — ไม่ยกคำแปลในฉาก
      //   อิบนุ ตัยมิยะฮ์ อัลอะกีดะฮ์ อัลวาสิฏิยะฮ์ / อิบนุ อุษัยมีน ชัรห์ — TODO(Claude): ยืนยันหน้าใน Shamela (MCP โดน rate limit 10 พ.ย.) ก่อนใส่ทะเบียนหลักฐาน
      scene(GARDEN, "faith-j-iman-5", "point",
        "การศรัทธาต่อกอดัร คือเชื่อว่า ทุกสิ่งที่เกิดขึ้น เกิดตามที่อัลลอฮ์ทรงรู้และทรงบันทึกไว้ และพระองค์ทรงให้มันเกิดขึ้นตามความประสงค์ของพระองค์ ไม่มีสิ่งใดเกิดขึ้นได้ ถ้าพระองค์ไม่ทรงประสงค์",
        "Believing in the decree means believing that everything that happens, happens as Allah knows and has written, and He makes it happen by His will. Nothing can happen unless He wills it."),
      scene(SKY, "faith-j-iman-5b", "point",
        "ความประสงค์ของอัลลอฮ์มีสองแบบ แบบแรก คือสิ่งที่พระองค์ทรงให้เกิดขึ้นในโลก ทั้งสิ่งดีและสิ่งไม่ดี แบบที่สอง คือสิ่งที่พระองค์ทรงรักและทรงสั่งใช้ นั่นคือความดีเท่านั้น",
        "Allah's will is of two kinds. The first is what He makes happen in the world, both good and bad. The second is what He loves and commands, and that is only good."),
      scene(GARDEN, "faith-j-iman-5c", "wave",
        "อัลลอฮ์ไม่ทรงรักความชั่ว แม้มันจะเกิดขึ้นได้ เมื่อเจอเรื่องไม่ดี เราอดทน และเราเลือกทำความดีที่อัลลอฮ์ทรงรัก",
        "Allah does not love evil, even though it can happen. When something bad happens, we are patient, and we choose the good that Allah loves."),
      scene(CLASS, "faith-j-iman-6", "wave",
        "หกข้อนี้คือรุก่นอีมาน",
        "These six are the pillars of iman."),
    ],
  },

  // มุสลิม 8 «أن تعبد الله كأنك تراه فإن لم تكن تراه فإنه يراك» · «فإنه جبريل أتاكم يعلمكم دينكم»
  "faith-ihsan": {
    evidence: ["muslim-8"],
    scenes: [
      scene(CLASS, "faith-j-ihsan-1", "wave",
        "ญิบรีลถามท่านนบี ﷺ อีกข้อหนึ่งว่า เอี๊ยะซานคืออะไร",
        "Jibril asked the Prophet ﷺ another question: what is ihsan?"),
      scene(CLASS, "faith-j-ihsan-2", "point",
        "ท่านนบี ﷺ ตอบว่า คือการเคารพภักดีอัลลอฮ์เสมือนว่าเธอเห็นพระองค์ ถ้าเธอไม่เห็นพระองค์ แท้จริงพระองค์ทรงเห็นเธอ",
        "The Prophet ﷺ answered: to worship Allah as though you see Him, and if you do not see Him, He surely sees you."),
      scene(PRAYER, "faith-j-ihsan-3", "point",
        "เวลาละหมาด เราจึงตั้งใจ ไม่รีบร้อน เพราะรู้ว่าอัลลอฮ์ทรงเห็นเรา",
        "So when we pray, we focus and do not rush, because we know Allah sees us."),
      scene(GARDEN, "faith-j-ihsan-4", "point",
        "เราทำความดีแม้ไม่มีใครเห็น เพราะอัลลอฮ์ทรงเห็นเราเสมอ",
        "We do good even when no one is watching, because Allah always sees us."),
      scene(CLASS, "faith-j-ihsan-5", "wave",
        "อิสลาม อีมาน และเอี๊ยะซาน คือศาสนาที่ญิบรีลมาสอนเรา",
        "Islam, iman and ihsan: this is the religion Jibril came to teach us."),
    ],
  },
};
