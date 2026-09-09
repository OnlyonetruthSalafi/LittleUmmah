import { MosqueIcon } from "@/components/icons/MosqueIcon";

/*
  บนจอแคบเหลือเฉพาะตราสัญลักษณ์ เพราะแถบหัวเว็บต้องแบ่งที่ให้ปุ่มเสียง
  และปุ่มผู้ปกครองด้วย ชื่อเต็มจะโผล่ตั้งแต่ 640px ขึ้นไป
  ตัวลิงก์มี aria-label กำกับอยู่แล้ว ชื่อที่ screen reader อ่านจึงไม่หายไปด้วย
*/
export function Logo() {
  return (
    <span className="flex items-center gap-2 sm:gap-3">
      <span className="bg-sky-pale flex size-11 shrink-0 items-center justify-center rounded-full">
        <MosqueIcon className="text-brand-blue size-7" />
      </span>

      <span className="hidden flex-col leading-tight sm:flex">
        <span className="font-display text-brand-blue text-xl font-extrabold tracking-tight whitespace-nowrap">
          Little Ummah
        </span>
        <span className="text-ink-soft text-[11px] leading-tight whitespace-nowrap">
          หัวใจสดใส วันพรุ่งนี้ที่สดใสกว่า
        </span>
      </span>
    </span>
  );
}
