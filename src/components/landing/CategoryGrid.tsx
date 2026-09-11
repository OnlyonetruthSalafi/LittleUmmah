import { IslandCard } from "@/components/landing/IslandCard";
import { CATEGORIES } from "@/lib/categories";

/*
  เกาะภาษาอาหรับเบื้องต้นต้องอยู่บนสุดเสมอทุกขนาดจอ (เดิมตำแหน่งนี้เป็นเกาะอัลกุรอาน เจ้าของโปรเจกต์เปลี่ยนเป็นภาษาอาหรับ)
  - ใน DOM ให้ภาษาอาหรับมาก่อน screen reader และคีย์บอร์ดจึงเจอภาษาอาหรับเป็นเกาะแรก
    และบนมือถือ/แท็บเล็ตภาษาอาหรับได้แถวแรกตามธรรมชาติ
  - บน PC วางตำแหน่งซ้าย→ขวาตาม CATEGORIES ด้วย grid-column ใน globals.css (.island-arc)
    ภาษาอาหรับเป็นยอดโค้งจุดเดียว
  เรียงใหม่เฉพาะที่นี่ ไม่แก้ CATEGORIES แถบป้ายเกาะด้านล่าง (ValueBar) จึงเรียงเหมือนเดิม
*/
const ISLANDS = [
  ...CATEGORIES.filter((c) => c.slug === "arabic"),
  ...CATEGORIES.filter((c) => c.slug !== "arabic"),
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
