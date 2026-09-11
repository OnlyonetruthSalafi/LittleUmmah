import { IslandCard } from "@/components/landing/IslandCard";
import { CATEGORIES } from "@/lib/categories";

/*
  กริดเกาะทั้งหก สำหรับหน้าช่วงวัยและหน้า /learn
  anchor ("#kids" / "#juniors") พาไปส่วนของช่วงวัยนั้นในหน้าเกาะทันที
  ช่วงวัยอยู่ใน URL ตามแนวทางเดียวกับ AgeGroupSelector ไม่ใช่ state ที่ซ่อนไว้
*/
export function IslandPicker({ anchor }: { anchor?: "kids" | "juniors" }) {
  return (
    <ul className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 sm:gap-6">
      {CATEGORIES.map((category) => (
        <IslandCard
          key={category.slug}
          category={{ ...category, href: anchor ? `${category.href}#${anchor}` : category.href }}
        />
      ))}
    </ul>
  );
}
