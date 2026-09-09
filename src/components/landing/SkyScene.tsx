import type { ReactNode } from "react";

/*
  ฉากเปิดหน้าแรก — ท้องฟ้าไล่สีพร้อมเมฆสองชั้น

  ครอบเฉพาะฉากเปิด ไม่ยืดตามความสูงของทั้งหน้า
  ไม่งั้นตำแหน่งสีของ gradient จะเลื่อนทุกครั้งที่เพิ่มเนื้อหาด้านล่าง

  ไม่ใส่ overflow-hidden ที่กรอบนอก เพราะจะไปตัดกรอบโฟกัสของปุ่มในแถบหัวเว็บ
*/
export function SkyScene({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-[34rem] flex-col sm:min-h-[40rem]">
      <div
        aria-hidden="true"
        className="sky-backdrop pointer-events-none absolute inset-0 -z-20"
      />
      <div
        aria-hidden="true"
        className="cloud-bank-far pointer-events-none absolute inset-x-0 bottom-24 -z-20 h-36"
      />
      <div
        aria-hidden="true"
        className="cloud-bank-front pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56"
      />
      {children}
    </div>
  );
}
