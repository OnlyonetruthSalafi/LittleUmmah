import type { Metadata } from "next";

import { IslandPicker } from "@/components/learn/IslandPicker";
import { BackLink } from "@/components/ui/BackLink";

export const metadata: Metadata = { title: "เกาะการเรียนรู้ทั้งหมด" };

/* /learn ไม่มีลิงก์ชี้มาตรงๆ แต่คนพิมพ์ URL ตัดท้ายได้ จึงแสดงเกาะทั้งหมดแทน 404 */
export default function LearnIndexPage() {
  return (
    <>
      <BackLink />
      <h1 className="font-display title-sticker mt-6 mb-6 text-center text-3xl font-extrabold sm:text-4xl">
        เลือกเกาะที่อยากไป
        <span lang="en" className="block text-lg font-semibold">
          Choose an island
        </span>
      </h1>
      <IslandPicker />
    </>
  );
}
