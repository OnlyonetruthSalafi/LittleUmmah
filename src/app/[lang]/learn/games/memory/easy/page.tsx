import type { Metadata } from "next";
import { MemoryGame } from "@/components/games/MemoryGame";

export const metadata: Metadata = { title: "จับคู่ภาพ — วัย 3-6 ปี" };
export default function EasyMemoryPage() { return <MemoryGame key="easy" ageGroup="kids" />; }
