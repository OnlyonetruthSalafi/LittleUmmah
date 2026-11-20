import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { STORY_SLUGS } from "@/features/stories";
import { games } from "@/features/games/data/catalog";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  // Public Thai URLs only. /learn/games redirects to /games; do not list redirects.
  const paths = [
    "/", "/kids", "/juniors", "/learn", "/games", "/parents",
    "/parents/curriculum", "/parents/progress", "/parents/privacy", "/parents/sponsors",
    "/learn/languages/arabic", "/learn/languages/english", "/learn/languages/thai",
    ...CATEGORIES.filter((category) => category.slug !== "games").map((category) => category.href),
    ...STORY_SLUGS.map((slug) => `/learn/stories/${slug}`),
    ...games.filter((game) => game.enabled).map((game) => `/games/${game.slug}`),
    "/learn/games/memory", "/learn/games/memory/easy", "/learn/games/memory/hard",
  ];
  return paths.map((path) => ({ url: new URL(path, siteUrl()).href }));
}
