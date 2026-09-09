import { SiteHeader } from "@/components/layout/SiteHeader";
import { Hero } from "@/components/landing/Hero";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
      </main>
    </>
  );
}
