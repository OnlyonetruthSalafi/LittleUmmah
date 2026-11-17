import type { AgeId, AgeSection } from "@/features/moral/data";
import type { Lesson } from "@/lib/lessons";

/*
  เกาะ "ตัวเลขและคณิตคิดสนุก" (/learn/numbers-math) — เจ้าของสั่ง 18 พ.ย. 2026: เลิกแบบถาดดาวของ Codex
  สอนผ่านการ์ตูน film-kit ทีละแนวคิด (แผน docs/films/math-island-plan.md) + ส่วนรู้จักตัวเลข (NumberCards)
  ภาพการ์ดตัดจากการ์ตูนเรื่องนั้นเอง (output/car-math-count/release-media.mjs) ไม่มีตัวหนังสือ/ตัวเลขในภาพ
*/
export const AGE_SECTIONS: Record<AgeId, AgeSection> = {
  kids: {
    label: { th: "วัย 3-6 ปี", en: "Ages 3-6" },
    desc: { th: "นับเลข จับคู่ และรู้จักจำนวนผ่านการ์ตูน", en: "Counting, matching and number sense through cartoons" },
    badge: "/moral/age-kids.webp",
  },
  juniors: {
    label: { th: "วัย 7 ปีขึ้นไป", en: "Ages 7+" },
    desc: { th: "ตัวเลขเกินสิบ และคิดเป็นจำนวน", en: "Numbers beyond ten and thinking in amounts" },
    badge: "/moral/age-juniors.webp",
  },
};

/* ภาพการ์ด: ตัดจากการ์ตูนเรื่องนั้น หรือภาพสิ่งของที่ Codex สร้าง (docs/briefs/MATH-CARDS-1.md) ไม่มีตัวเลข/ตัวหนังสือในภาพ */
export const CARD_ART: Record<string, string> = {
  "math-count": "/math/card-count-film-v1.webp",
  "math-subitize": "/math/card-subitize.webp",
  "math-compare": "/math/card-compare.webp",
  "math-join": "/math/card-join.webp",
  "math-shapes": "/math/card-shapes.webp",
  "math-patterns": "/math/card-patterns.webp",
  "math-size": "/math/card-size.webp",
  "math-position": "/math/card-position.webp",
  "math-ten": "/math/card-ten.webp",
  "math-place": "/math/card-place.webp",
  "math-addsub": "/math/card-addsub.webp",
  "math-oddeven": "/math/card-oddeven.webp",
  "math-groups": "/math/card-groups.webp",
  "math-share": "/math/card-share.webp",
  "math-measure": "/math/card-measure.webp",
  "math-time": "/math/card-time.webp",
};

/* การ์ดตามหลักสูตร (วิจัย 18 พ.ย. 2026 — docs/films/math-island-plan.md) · บทที่ยังไม่มีการ์ตูนเปิดเป็นหน้าต่างข้อความไปก่อน */
export const LESSONS: Record<AgeId, Lesson[]> = {
  kids: [
    { id: "math-count", icon: "tree", title: { th: "ต้นกล้าครบไหมนะ", en: "A plant for every pot" }, body: { th: "นับหนึ่งถึงห้า หนึ่งกระถางต่อหนึ่งต้น ขาดไปหนึ่งก็เพิ่มอีกหนึ่ง", en: "Count one to five: one plant for each pot, and add one more when one is missing." } },
    { id: "math-subitize", icon: "star8", title: { th: "ดูปุ๊บ รู้ปั๊บ", en: "See it, know it" }, body: { th: "มองกลุ่มเล็กๆ แล้วบอกได้ทันทีว่ามีเท่าไร ไม่เกินห้า โดยไม่ต้องนับทีละอัน", en: "Tell how many are in a small group, up to five, without counting one by one." } },
    { id: "math-compare", icon: "dates", title: { th: "อันไหนมากกว่า", en: "Which has more?" }, body: { th: "เทียบสองกลุ่ม จับคู่ทีละอัน แล้วบอกว่ากลุ่มไหนมากกว่า น้อยกว่า หรือเท่ากัน", en: "Compare two groups by pairing them up: more, fewer or the same." } },
    { id: "math-join", icon: "heart", title: { th: "มาเพิ่ม ไปหนึ่ง", en: "One more, one less" }, body: { th: "ของมาเพิ่มก็นับต่อ ของหายไปก็นับถอย รวมกันไม่เกินห้า", en: "Count on when one more comes and count back when one goes, within five." } },
    { id: "math-shapes", icon: "home", title: { th: "รูปทรงรอบตัว", en: "Shapes around us" }, body: { th: "หาวงกลม สามเหลี่ยม และสี่เหลี่ยม จากของรอบตัว", en: "Find circles, triangles and squares in the things around us." } },
    { id: "math-patterns", icon: "star8", title: { th: "ลายต่อไปคืออะไร", en: "What comes next?" }, body: { th: "ดูลายที่ซ้ำกัน แล้วเดาว่าชิ้นต่อไปคืออะไร", en: "Spot a repeating pattern and guess the next piece." } },
    { id: "math-size", icon: "mountain", title: { th: "เล็ก กลาง ใหญ่", en: "Small, medium, big" }, body: { th: "เปรียบเทียบขนาดและความยาว แล้วเรียงจากเล็กไปใหญ่", en: "Compare size and length, then line things up from small to big." } },
    { id: "math-position", icon: "home", title: { th: "บน ใต้ ใน", en: "On, under, in" }, body: { th: "ใช้คำบอกตำแหน่ง บน ใต้ ใน ข้าง หน้า หลัง", en: "Use position words: on, under, in, beside, in front of and behind." } },
  ],
  juniors: [
    { id: "math-ten", icon: "star8", title: { th: "เติมให้ครบสิบ", en: "Make ten" }, body: { th: "สองจำนวนไหนรวมกันได้สิบ เป็นพื้นฐานของการบวกในใจ", en: "Find pairs that make ten, the base of mental addition." } },
    { id: "math-place", icon: "pen", title: { th: "หลักสิบ หลักหน่วย", en: "Tens and ones" }, body: { th: "มัดละสิบกับที่เหลือ อ่านและเขียนจำนวนถึงหนึ่งร้อย", en: "Bundles of ten and loose ones: read and write numbers to one hundred." } },
    { id: "math-addsub", icon: "pen", title: { th: "บวกลบไม่เกินยี่สิบ", en: "Add and take away to 20" }, body: { th: "บวกและลบโดยนับต่อ นับถอย และใช้สิบช่วย", en: "Add and subtract by counting on, counting back and using ten." } },
    { id: "math-oddeven", icon: "dates", title: { th: "คู่หรือคี่", en: "Odd or even?" }, body: { th: "จับคู่ทีละสอง ถ้ามีเหลือหนึ่งคือจำนวนคี่", en: "Pair things up in twos: one left over means odd." } },
    { id: "math-groups", icon: "dates", title: { th: "กลุ่มเท่ากัน", en: "Equal groups" }, body: { th: "หลายกลุ่มที่มีเท่ากัน นับเป็นกลุ่มได้เร็วกว่า เป็นพื้นฐานของการคูณ", en: "Counting equal groups is faster, the first step to multiplication." } },
    { id: "math-share", icon: "heart", title: { th: "แบ่งเท่ากัน", en: "Share fairly" }, body: { th: "แบ่งของให้ทุกคนได้เท่ากัน เป็นพื้นฐานของการหาร", en: "Share things so everyone gets the same, the first step to division." } },
    { id: "math-measure", icon: "mountain", title: { th: "วัดความยาว", en: "Measuring length" }, body: { th: "วัดด้วยของชิ้นเท่ากัน แล้วเทียบว่าอะไรยาวกว่า สั้นกว่า", en: "Measure with same-size units and compare longer and shorter." } },
    { id: "math-time", icon: "sun", title: { th: "ดูนาฬิกา", en: "Telling the time" }, body: { th: "อ่านเวลาเป็นชั่วโมงและครึ่งชั่วโมงจากนาฬิกาเข็ม", en: "Read the time to the hour and half hour on a clock." } },
  ],
};
