import { MosqueIcon } from "@/components/icons/MosqueIcon";

type LogoProps = {
  /** ซ่อนสโลแกนบนจอแคบ ตั้งเป็น false เมื่อมีที่ว่างพอ */
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <span className="flex items-center gap-2 sm:gap-3">
      <span className="bg-sky-pale flex size-9 shrink-0 items-center justify-center rounded-full sm:size-11">
        <MosqueIcon className="text-brand-blue size-5 sm:size-7" />
      </span>

      <span className="flex flex-col leading-tight">
        <span className="font-display text-brand-blue text-[15px] font-extrabold tracking-tight whitespace-nowrap sm:text-xl">
          Little Ummah
        </span>
        {!compact && (
          <span className="text-ink-soft hidden text-[11px] leading-tight whitespace-nowrap sm:block">
            หัวใจสดใส วันพรุ่งนี้ที่สดใสกว่า
          </span>
        )}
      </span>
    </span>
  );
}
