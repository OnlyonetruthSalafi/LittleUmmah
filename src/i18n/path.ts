import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

/** "/learn" -> "/learn" (ไทย) หรือ "/en/learn" — path ภายนอกหรือ #anchor คืนค่าเดิม */
export function localePath(locale: Locale, href: string): string {
  if (locale === DEFAULT_LOCALE || !href.startsWith("/") || href.startsWith("//")) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
