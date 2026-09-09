import { SiteHeader } from "@/components/layout/SiteHeader";
import { Hero } from "@/components/landing/Hero";
import { SkyScene } from "@/components/landing/SkyScene";

export default function HomePage() {
  return (
    <SkyScene>
      <SiteHeader />
      <main className="flex flex-1 items-center">
        <Hero />
      </main>
    </SkyScene>
  );
}
