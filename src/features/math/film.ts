import type { Film } from "@/features/moral/film";

/*
  การ์ตูนเกาะคณิต (film-kit) — Claude, 18 พ.ย. 2026 · แผนทั้งเกาะ docs/films/math-island-plan.md
  วิดีโออยู่ R2 math/film/ (ทดสอบในเครื่อง: สำเนาใน public/math/film/ + NEXT_PUBLIC_FILM_VIDEO_BASE=/moral/film)
*/
export const FILMS: Record<string, Film> = {
  // ต้นกล้าครบไหมนะ — นับ 1–5 หนึ่งกระถางต่อหนึ่งต้น ขาดไปหนึ่ง สี่เพิ่มหนึ่งเป็นห้า (วัย 3–6)
  // บรรทัดท้ายอธิบายจากความหมาย อัลวากิอะฮ์ 56:63–64 (อิบนุ กะษีร https://shamela.ws/book/8473/4038) ไม่ยกคำแปล ไม่อ่านอาหรับ
  // ต้นทาง output/car-math-count/ · บันทึก docs/films/math-count-v1-production.txt
  "math-count": {
    name: "count-v1",
    dir: "math/film",
    duration: 131.424,
    turns: [{ at: 103.255, resumeAt: 104.055, word: {
      ar: "",
      th: "ชี้ทีละต้น แล้วนับออกเสียง",
      prompt: { th: "มีต้นไม้กี่ต้น? ชี้ทีละต้น แล้วนับออกเสียงนะ", en: "How many plants? Point to each one and count aloud." },
      instruction: { th: "นับต้นไม้ออกเสียงทีละต้น นับเสร็จแล้วกดปุ่ม ครูจะนับไปพร้อมกับหนู", en: "Count the plants aloud, one by one. Press the button when you finish and Nuri will count with you." },
    } }],
    words: [{ ar: "", th: "หนึ่งกระถาง หนึ่งต้น — ห้าต้น", prompt: { th: "หนึ่งกระถาง หนึ่งต้น ครบ 5 ต้น", en: "One pot, one plant: 5 plants in all." } }],
    captions: ["th"],
    label: {
      th: "การ์ตูนต้นกล้าครบไหมนะ — ซาบิรปลูกต้นกล้าลงกระถางห้าใบทีละต้นพร้อมนับ ต้นกล้าหมดตอนสี่ต้น ซาฟีไปเอามาอีกหนึ่งต้น สี่เพิ่มหนึ่งเป็นห้า",
      en: "Is there a plant for every pot? Sabir plants seedlings one by one while counting, runs out at four, and Safi brings one more: four and one more make five.",
    },
  },
};
