import { IslandCard } from "@/components/landing/IslandCard";
import { CATEGORIES } from "@/lib/categories";

export function CategoryGrid() {
  return (
    <section className="island-arc mx-auto w-full max-w-[96rem] px-3 pb-6 sm:px-6">
      <h2 className="sr-only">หมวดการเรียนรู้</h2>
      <ul className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6 lg:gap-3">
        {CATEGORIES.map((category) => (
          <IslandCard key={category.slug} category={category} />
        ))}
      </ul>
    </section>
  );
}
