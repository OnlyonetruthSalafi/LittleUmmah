import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { dict, fmt } from "@/i18n/dict";
import { localePath } from "@/i18n/path";

type ShareImage = "welcome" | "play";

/** Return complete social objects: Next merges nested metadata shallowly. */
export function pageMetadata(locale: Locale, path: string, title: string, description: string, image: ShareImage = "welcome"): Metadata {
  const { t } = dict(locale);
  const fullTitle = path === "/" ? title : t.layout.titleTemplate.replace("%s", title);
  const url = localePath(locale, path);
  // The requested image descriptions stay Thai, including on the unreleased English routes.
  const alt = dict("th").t.seo.images[image];
  const images = [{ url: `/og/${image}.jpg`, width: 1200, height: 630, type: "image/jpeg", alt }];
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, siteName: "Little Ummah", locale: locale === "th" ? "th_TH" : "en_US", type: "website", images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}

export function categoryMetadata(locale: Locale, slug: string, title: string): Metadata {
  const { t } = dict(locale);
  const descriptions: Record<string, string> = t.seo.categories;
  return pageMetadata(locale, `/learn/${slug}`, title, descriptions[slug] ?? fmt(t.seo.categoryDescription, { title }), slug === "games" ? "play" : "welcome");
}
