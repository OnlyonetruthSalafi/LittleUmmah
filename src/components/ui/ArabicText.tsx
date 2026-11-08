/** คงข้อความเดิมทุกตัว และกำกับฟอนต์เฉพาะอาหรับ/ﷺ ที่แทรกในไทยหรืออังกฤษ */
export function ArabicText({ text }: { text: string }) {
  return text.split(/([\u0600-\u06ff\u0750-\u077f\u0870-\u08ff\ufb50-\ufdff\ufe70-\ufefc]+)/u).map((part, i) =>
    /[\u0600-\u06ff\u0750-\u077f\u0870-\u08ff\ufb50-\ufdff\ufe70-\ufefc]/u.test(part)
      ? <span key={i} lang="ar" dir="rtl">{part}</span>
      : part,
  );
}
