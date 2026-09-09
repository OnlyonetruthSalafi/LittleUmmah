import {
  CaringHandsIcon,
  HeartIcon,
  SeedlingIcon,
} from "@/components/icons/ValueIcons";

/*
  แถบค่านิยมสามข้อปิดท้ายหน้าแรก

  ใน mockup เป็นแถบขาวแถบเดียวเรียงนอน บนมือถือซ้อนเป็นสามแถว
  ไอคอนตกแต่งล้วน ให้ข้อความข้างๆ เป็นตัวอ่านของ screen reader
*/
const VALUES = [
  { Icon: SeedlingIcon, th: "ศรัทธา", en: "Faith", tint: "text-brand-green" },
  {
    Icon: HeartIcon,
    th: "มารยาทดี",
    en: "Good Character",
    tint: "text-brand-amber",
  },
  {
    Icon: CaringHandsIcon,
    th: "โลกที่ใจดี",
    en: "A Kinder World",
    tint: "text-brand-blue",
  },
];

export function ValueBar() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-12 sm:px-6 sm:pb-16">
      <h2 className="sr-only">สิ่งที่เราเชื่อ</h2>
      <ul className="bg-cloud shadow-soft rounded-card flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-around sm:gap-2 sm:px-6">
        {VALUES.map(({ Icon, th, en, tint }) => (
          <li
            key={en}
            className="flex min-h-12 items-center justify-center gap-3 sm:flex-col sm:gap-1.5 sm:text-center"
          >
            <Icon className={`size-7 shrink-0 sm:size-8 ${tint}`} />
            <span className="flex items-baseline gap-2 sm:flex-col sm:items-center sm:gap-0">
              <span className="font-display text-ink text-base font-extrabold sm:text-lg">
                {th}
              </span>
              <span lang="en" className="text-ink-soft text-xs">
                {en}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
