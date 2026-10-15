import type { Metadata } from "next";
import { MemoryGame } from "@/components/games/MemoryGame";

export const metadata: Metadata = { title: "จับคู่ภาพ — วัย 7 ปีขึ้นไป" };
export default function HardMemoryPage() { return <MemoryGame key="hard" ageGroup="juniors" />; }
