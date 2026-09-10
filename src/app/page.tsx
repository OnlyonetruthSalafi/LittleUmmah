import { AgeGroupSelector } from "@/components/landing/AgeGroupSelector";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { Hero } from "@/components/landing/Hero";
import { LowerScene } from "@/components/landing/LowerScene";
import { ObeyArc } from "@/components/landing/ObeyArc";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ValueBar } from "@/components/landing/ValueBar";
import { SkyScene } from "@/components/landing/SkyScene";

export default function HomePage() {
  return (
    <SkyScene>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <CategoryGrid />
        <Hero />
        {/* ตั้งแต่คำโค้ง "Obey" ลงไปใช้ภาพพื้นหลัง BGLower */}
        <LowerScene>
          <ObeyArc />
          <AgeGroupSelector />
          <ValueBar />
        </LowerScene>
      </main>
    </SkyScene>
  );
}
