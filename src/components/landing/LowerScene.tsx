import Image from "next/image";
import type { ReactNode } from "react";

/*
  ฉากพื้นหลังช่วงล่างของหน้าแรก — เริ่มตั้งแต่คำโค้ง "Obey Trust Faithful" ลงไปจนสุดหน้า
  ภาพ BGLower (เมืองลอยฟ้า) จากเจ้าของโปรเจกต์ ตรวจแล้วไม่มีใบหน้ามนุษย์หรือสัตว์ (ข้อ 1.1)

  ขอบบนใช้ mask ให้ภาพค่อยๆ ปรากฏจากโปร่งใส ไม่ใช้แผ่นสีพื้นทับ
  ตอนใช้แผ่นสีทับ ภาพฉากบน (SkyScene) ที่ยังจางไม่หมดถูกตัดเป็นเส้นตรงคาดจอบนเดสก์ท็อป
  mask ปล่อยให้ฉากบนไล่จางต่อลงมาเองแล้วภาพนี้ค่อยซ้อนขึ้นมา จึงไม่มีรอยต่อ
  ช่วงโปร่งใสเต็ม 6rem (มือถือ) / 8rem แล้วค่อยเข้มถึงเต็มที่ 20rem / 24rem
  เพราะวัดจากภาพ render แล้ว mask ที่เริ่มทันทีทำให้ท้องฟ้าเข้มโผล่ใต้คำโค้ง contrast ตกเหลือ 1.5:1 บนมือถือ
  คำโค้งวางอยู่บนช่วงที่ยังจาง (มี hero-glow รองใน ObeyArc) ส่วนการ์ดช่วงวัยกับแถบป้ายเกาะเป็นพื้นขาวทึบ อ่านได้บนภาพเต็ม

  isolate เพื่อให้ภาพ -z-10 อยู่หลังเนื้อหาของฉากนี้เท่านั้น
  ไม่ใส่ overflow-hidden เพราะจะตัดกรอบโฟกัสและหุ่นยนต์ที่ยื่นพ้นขอบการ์ด
*/
export function LowerScene({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent_6rem,black_20rem)] sm:[mask-image:linear-gradient(to_bottom,transparent_8rem,black_24rem)]"
      >
        <Image
          src="/BG/bglower.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_65%]"
        />
      </div>
      {children}
    </div>
  );
}
