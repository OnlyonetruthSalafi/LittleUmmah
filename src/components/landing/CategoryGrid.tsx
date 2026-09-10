import { IslandCard } from "@/components/landing/IslandCard";
import { CATEGORIES } from "@/lib/categories";

/*
  เกาะอัลกุรอานต้องอยู่บนสุดเสมอทุกขนาดจอ (เจ้าของโปรเจกต์กำหนด)
  - ใน DOM ให้อัลกุรอานมาก่อน screen reader และคีย์บอร์ดจึงเจออัลกุรอานเป็นเกาะแรก
    และบนมือถือ/แท็บเล็ตอัลกุรอานได้แถวแรกตามธรรมชาติ
  - บน PC วางตำแหน่งซ้าย→ขวาตาม CATEGORIES ด้วย grid-column ใน globals.css (.island-arc)
    อัลกุรอานเป็นยอดโค้งจุดเดียว
  เรียงใหม่เฉพาะที่นี่ ไม่แก้ CATEGORIES แถบป้ายเกาะด้านล่าง (ValueBar) จึงเรียงเหมือนเดิม
*/
const ISLANDS = [
  ...CATEGORIES.filter((c) => c.slug === "quran"),
  ...CATEGORIES.filter((c) => c.slug !== "quran"),
];

export function CategoryGrid() {
  return (
    <section className="island-arc mx-auto w-full max-w-[96rem] px-3 pb-6 sm:px-6">
      <h2 className="sr-only">หมวดการเรียนรู้</h2>
      <ul className="grid grid-cols-2 items-start gap-3 sm:grid-cols-6 sm:gap-5 lg:gap-3">
        {ISLANDS.map((category) => (
          <IslandCard key={category.slug} category={category} />
        ))}
      </ul>
    </section>
  );
}
