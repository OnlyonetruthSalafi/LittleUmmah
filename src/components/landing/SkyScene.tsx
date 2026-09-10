import Image from "next/image";
import type { ReactNode } from "react";

/*
  ฉากเปิดหน้าแรก — ใช้ภาพวาดจริงจากเจ้าของโปรเจกต์เป็นพื้นหลัง

  ภาพครอบเฉพาะช่วงบนของหน้า แล้วไล่จางลงไปหาสีพื้นของเว็บ
  เนื้อหาที่อยู่ต่ำกว่านั้น (กริดเกาะ แถบค่านิยม) จึงอยู่บนพื้นเรียบที่อ่านง่าย

  ใต้ภาพยังมี gradient ท้องฟ้าเดิมรองไว้ ใช้ตอนภาพยังโหลดไม่เสร็จ
  และเป็นสีต่อเนื่องในกรณีที่จอสูงกว่าที่ภาพครอบถึง

  ไม่ใส่ overflow-hidden ที่กรอบนอก เพราะจะไปตัดกรอบโฟกัสของปุ่มในแถบหัวเว็บ
*/
export function SkyScene({ children }: { children: ReactNode }) {
  return (
    <div className="sky-scene relative isolate flex overflow-x-clip min-h-[34rem] flex-col sm:min-h-[40rem]">
      {/*
        พื้นรองเป็นสีเรียบสีเดียวกับปลายทางของภาพ ไม่ใช่ gradient
        ตอนใช้ gradient รองไว้ สีตรงรอยต่อไม่ตรงกับขอบล่างของภาพ จึงเห็นเป็นเส้นคาดขวางจอ
      */}
      <div aria-hidden="true" className="bg-sky-pale absolute inset-0 -z-30" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[var(--scene-art-height)]"
      >
        <Image
          src="/BG/bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-left-top"
        />
        {/* ไล่จางลงไปหาสีพื้นของหน้า ไม่ให้ขอบล่างของภาพเป็นเส้นคาด */}
        <div className="via-sky-pale/70 to-sky-pale absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent" />
      </div>

      {children}
    </div>
  );
}
